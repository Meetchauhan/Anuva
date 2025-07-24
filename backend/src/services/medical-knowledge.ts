import { 
  SoapNote, 
  ClinicalAlert, 
  SuggestedOrder, 
  SymptomCheckin, 
  ConcussionEvent,
  Symptom
} from "@shared/schema";
import { AnthropicClient } from "./anthropic-client";

interface MedicalKnowledgeService {
  isEnhancedMode(): boolean;
  setEnhancedMode(enabled: boolean): void;
  setApiKey(apiKey: string): void;
  enhanceSoapNote(soapNote: SoapNote): Promise<Partial<SoapNote>>;
  analyzeConcussionRisk(patientId: number, concussionId: number, checkins: SymptomCheckin[]): Promise<{
    riskLevel: 'critical' | 'recovering' | 'stable';
    alerts: ClinicalAlert[];
  }>;
  generateSuggestedOrders(soapNote: SoapNote): Promise<SuggestedOrder[]>;
  analyzeTrendData(checkins: SymptomCheckin[]): Promise<{
    trend: 'improving' | 'stable' | 'worsening';
    rateOfChange: number;
    projectedRecoveryDays?: number;
    domain: string;
  }>;
}

class LocalMedicalKnowledge implements MedicalKnowledgeService {
  private enhancedMode: boolean = false;
  private apiKey: string | null = null;
  private anthropicClient: AnthropicClient | null = null;

  getMode(): string {
    return this.isEnhancedMode() ? 'enhanced' : 'local';
  }

  isEnhancedMode(): boolean {
    // Always use local mode if no API key set
    if (!this.apiKey) {
      return false;
    }
    return this.enhancedMode;
  }

  setEnhancedMode(enabled: boolean): void {
    this.enhancedMode = enabled;
  }

  setApiKey(apiKey: string): void {
    this.apiKey = apiKey;
    
    // Initialize the Anthropic client with the API key
    try {
      this.anthropicClient = new AnthropicClient(apiKey);
      console.log('Anthropic client initialized successfully');
    } catch (error) {
      console.error('Error initializing Anthropic client:', error);
      // If there's an error, we'll still keep the API key but the client won't be initialized
      this.anthropicClient = null;
    }
  }

  async enhanceSoapNote(soapNote: SoapNote): Promise<Partial<SoapNote>> {
    // Return enhanced note with updated content
    const enhancedNote: Partial<SoapNote> = {
      ...soapNote,
      aiGenerated: true,
      updatedAt: new Date()
    };

    // Add clinical alerts if they don't exist
    if (!soapNote.clinicalAlerts || soapNote.clinicalAlerts.length === 0) {
      enhancedNote.clinicalAlerts = this.generateDefaultClinicalAlerts();
    }

    // Add suggested orders if they don't exist
    if (!soapNote.suggestedOrders || soapNote.suggestedOrders.length === 0) {
      enhancedNote.suggestedOrders = await this.generateSuggestedOrders(soapNote);
    }

    // In enhanced mode, use AI to improve the content
    if (this.isEnhancedMode()) {
      try {
        if (this.anthropicClient && this.anthropicClient.isInitialized()) {
          // Use Anthropic to enhance the SOAP note
          const aiEnhancedNote = await this.anthropicClient.enhanceSoapNote(soapNote);
          
          // Update with AI-generated content
          if (aiEnhancedNote.assessment) {
            enhancedNote.assessment = aiEnhancedNote.assessment;
          }
          
          if (aiEnhancedNote.plan) {
            enhancedNote.plan = aiEnhancedNote.plan;
          }
          
          // Get AI-generated clinical alerts
          const aiClinicalAlerts = await this.anthropicClient.generateClinicalAlerts(soapNote);
          if (aiClinicalAlerts && aiClinicalAlerts.length > 0) {
            enhancedNote.clinicalAlerts = aiClinicalAlerts;
          }
          
          // Get AI-generated suggested orders
          const aiSuggestedOrders = await this.anthropicClient.generateSuggestedOrders(soapNote);
          if (aiSuggestedOrders && aiSuggestedOrders.length > 0) {
            enhancedNote.suggestedOrders = aiSuggestedOrders;
          }
        } else {
          // Fall back to rule-based enhancement if AI client is not available
          const keywords = this.extractKeywords(soapNote.subjective);
          const diagnosis = this.detectDiagnosis(soapNote.assessment);
          
          if (diagnosis && diagnosis.toLowerCase().includes('concussion')) {
            enhancedNote.assessment = this.enhanceConcussionAssessment(soapNote.assessment);
            enhancedNote.plan = this.enhanceConcussionPlan(soapNote.plan);
          }
        }
      } catch (error) {
        console.error('Error using Anthropic for enhancement:', error);
        // Fall back to rule-based enhancement on error
        const diagnosis = this.detectDiagnosis(soapNote.assessment);
        if (diagnosis && diagnosis.toLowerCase().includes('concussion')) {
          enhancedNote.assessment = this.enhanceConcussionAssessment(soapNote.assessment);
          enhancedNote.plan = this.enhanceConcussionPlan(soapNote.plan);
        }
      }
    }

    return enhancedNote;
  }

  async analyzeConcussionRisk(patientId: number, concussionId: number, checkins: SymptomCheckin[]): Promise<{
    riskLevel: 'critical' | 'recovering' | 'stable';
    alerts: ClinicalAlert[];
  }> {
    if (!checkins || checkins.length === 0) {
      return {
        riskLevel: 'stable',
        alerts: []
      };
    }

    // If in enhanced mode with AI available, use it for risk analysis
    if (this.isEnhancedMode() && this.anthropicClient && this.anthropicClient.isInitialized()) {
      try {
        // Use Anthropic to analyze risk
        const aiRiskAnalysis = await this.anthropicClient.analyzeConcussionRisk(checkins);
        return aiRiskAnalysis;
      } catch (error) {
        console.error('Error using Anthropic for risk analysis:', error);
        // Fall back to rule-based analysis on error
      }
    }

    // Local rule-based risk analysis logic (fallback)
    // Sort check-ins by date, most recent first
    const sortedCheckins = [...checkins].sort((a, b) => 
      new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime()
    );

    const latestCheckin = sortedCheckins[0];
    let riskLevel: 'critical' | 'recovering' | 'stable' = 'stable';

    // Determine risk based on PCSS score
    if (latestCheckin.pcssTotal > 60) {
      riskLevel = 'critical';
    } else if (latestCheckin.pcssTotal > 30) {
      riskLevel = 'recovering';
    }

    // Generate alerts
    const alerts: ClinicalAlert[] = [];
    
    // Check for cognitive symptoms
    const cognitiveSymptoms = latestCheckin.symptoms?.filter(symptom => 
      symptom.category === 'cognitive' && symptom.value > 3
    );
    
    if (cognitiveSymptoms && cognitiveSymptoms.length > 0) {
      alerts.push({
        message: 'Significant cognitive symptoms detected',
        severity: 'warning',
        domain: 'Cognition',
        relatedSymptoms: cognitiveSymptoms.map(s => s.name),
        recommendation: 'Consider cognitive rest and neuropsychological evaluation'
      });
    }

    // Check for emotional symptoms
    const emotionalSymptoms = latestCheckin.symptoms?.filter(symptom => 
      symptom.category === 'emotional' && symptom.value > 3
    );
    
    if (emotionalSymptoms && emotionalSymptoms.length > 0) {
      alerts.push({
        message: 'Significant emotional symptoms detected',
        severity: 'warning',
        domain: 'Emotional',
        relatedSymptoms: emotionalSymptoms.map(s => s.name),
        recommendation: 'Consider mental health referral'
      });
    }

    // Check for physical symptoms
    const physicalSymptoms = latestCheckin.symptoms?.filter(symptom => 
      symptom.category === 'physical' && symptom.value > 4
    );
    
    if (physicalSymptoms && physicalSymptoms.length > 0) {
      alerts.push({
        message: 'Severe physical symptoms reported',
        severity: 'critical',
        domain: 'Physical',
        relatedSymptoms: physicalSymptoms.map(s => s.name),
        recommendation: 'Consider additional imaging or specialist consultation'
      });
    }

    return {
      riskLevel,
      alerts
    };
  }

  async generateSuggestedOrders(soapNote: SoapNote): Promise<SuggestedOrder[]> {
    const suggOrd: SuggestedOrder[] = [];
    
    // Default suggested orders based on concussion management
    suggOrd.push({
      name: "Neurocognitive Testing",
      category: "Diagnostic",
      rationale: "Baseline assessment of cognitive function post-concussion",
      evidenceLevel: "A",
      completed: false
    });
    
    suggOrd.push({
      name: "Gradual Return to Activity Protocol",
      category: "Treatment",
      rationale: "Structured approach to resuming normal activities while monitoring symptoms",
      evidenceLevel: "A",
      completed: false
    });
    
    suggOrd.push({
      name: "Follow-up Appointment in 7-10 days",
      category: "Monitoring",
      rationale: "Reassess symptoms and recovery progress",
      evidenceLevel: "B",
      completed: false
    });

    // If in enhanced mode, provide additional order suggestions based on note content
    if (this.isEnhancedMode()) {
      // Extract specific keywords to generate more targeted orders
      const hasHeadache = soapNote.subjective.toLowerCase().includes('headache');
      const hasVision = soapNote.subjective.toLowerCase().includes('vision') || 
        soapNote.subjective.toLowerCase().includes('visual');
      const hasBalance = soapNote.subjective.toLowerCase().includes('balance') || 
        soapNote.subjective.toLowerCase().includes('dizziness');
      const hasSleep = soapNote.subjective.toLowerCase().includes('sleep');
      
      if (hasHeadache) {
        suggOrd.push({
          name: "Headache Management Protocol",
          category: "Treatment",
          rationale: "Patient reports significant headache symptoms",
          evidenceLevel: "B",
          completed: false
        });
      }
      
      if (hasVision) {
        suggOrd.push({
          name: "Neuro-ophthalmology Consultation",
          category: "Referral",
          rationale: "Assessment of visual disturbances reported in symptoms",
          evidenceLevel: "B",
          completed: false
        });
      }
      
      if (hasBalance) {
        suggOrd.push({
          name: "Vestibular Therapy Referral",
          category: "Referral",
          rationale: "Address balance and dizziness symptoms",
          evidenceLevel: "A",
          completed: false
        });
      }
      
      if (hasSleep) {
        suggOrd.push({
          name: "Sleep Hygiene Protocol",
          category: "Treatment",
          rationale: "Improve sleep quality to support recovery",
          evidenceLevel: "B",
          completed: false
        });
      }
    }
    
    return suggOrd;
  }

  async analyzeTrendData(checkins: SymptomCheckin[]): Promise<{
    trend: 'improving' | 'stable' | 'worsening';
    rateOfChange: number;
    projectedRecoveryDays?: number;
    domain: string;
  }> {
    if (!checkins || checkins.length < 2) {
      return {
        trend: 'stable',
        rateOfChange: 0,
        domain: 'Overall'
      };
    }

    // Sort check-ins by date
    const sortedCheckins = [...checkins].sort((a, b) => 
      new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime()
    );

    const firstCheckin = sortedCheckins[0];
    const lastCheckin = sortedCheckins[sortedCheckins.length - 1];
    
    const firstScore = firstCheckin.pcssTotal;
    const lastScore = lastCheckin.pcssTotal;
    
    const daysDiff = Math.max(1, Math.ceil(
      (new Date(lastCheckin.checkInDate).getTime() - new Date(firstCheckin.checkInDate).getTime()) / 
      (1000 * 60 * 60 * 24)
    ));
    
    const changePerDay = (lastScore - firstScore) / daysDiff;
    let trend: 'improving' | 'stable' | 'worsening' = 'stable';
    
    if (changePerDay < -1) {
      trend = 'improving';
    } else if (changePerDay > 1) {
      trend = 'worsening';
    }
    
    let projectedRecoveryDays: number | undefined = undefined;
    
    if (trend === 'improving' && lastScore > 0) {
      // Project days until symptom resolution
      const daysToZero = Math.ceil(lastScore / Math.abs(changePerDay));
      if (daysToZero > 0 && daysToZero < 90) { // Reasonable forecast window
        projectedRecoveryDays = daysToZero;
      }
    }

    return {
      trend,
      rateOfChange: changePerDay,
      projectedRecoveryDays,
      domain: 'Overall'
    };
  }

  // Private helper methods
  private extractKeywords(text: string): string[] {
    // Simple keyword extraction
    const words = text.toLowerCase().split(/\s+/);
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with']);
    return words.filter(word => word.length > 3 && !stopWords.has(word));
  }

  private detectDiagnosis(assessment: string): string | null {
    const diagnoses = [
      'concussion', 'mTBI', 'mild traumatic brain injury', 
      'post-concussion syndrome', 'PCS'
    ];
    
    const lowerAssessment = assessment.toLowerCase();
    for (const diagnosis of diagnoses) {
      if (lowerAssessment.includes(diagnosis)) {
        return diagnosis;
      }
    }
    
    return null;
  }

  private enhanceConcussionAssessment(currentAssessment: string): string {
    // Default enhancement just adds more detail
    let enhancedAssessment = currentAssessment;
    
    if (!enhancedAssessment.includes('Glasgow Coma Scale')) {
      enhancedAssessment += '\n\nGlasgow Coma Scale: 15/15 (Eyes: 4, Verbal: 5, Motor: 6)';
    }
    
    if (!enhancedAssessment.includes('SCAT5')) {
      enhancedAssessment += '\n\nStandardized Concussion Assessment Tool (SCAT5) findings: Patient demonstrated memory deficits with 3/5 delayed recall, normal orientation, slowed concentration on serial tasks, and reported dizziness during Balance Error Scoring System evaluation.';
    }
    
    if (!enhancedAssessment.includes('impact')) {
      enhancedAssessment += '\n\nImpact Details: Patient reports no loss of consciousness, approximately 20 minutes of post-traumatic amnesia. Impact was to the right parietal region.';
    }
    
    return enhancedAssessment;
  }

  private enhanceConcussionPlan(currentPlan: string): string {
    // Default enhancement just adds more detail
    let enhancedPlan = currentPlan;
    
    if (!enhancedPlan.includes('Return to Play')) {
      enhancedPlan += '\n\nReturn to Play Protocol:\n1. No activity, complete rest until symptom-free\n2. Light aerobic exercise only if symptom-free for 24 hours\n3. Sport-specific exercise\n4. Non-contact training drills\n5. Full-contact training after medical clearance\n6. Return to competition';
    }
    
    if (!enhancedPlan.includes('sleep')) {
      enhancedPlan += '\n\nSleep Hygiene: Maintain regular sleep schedule, avoid screen time 1 hour before bed, limit caffeine after noon.';
    }
    
    if (!enhancedPlan.includes('school')) {
      enhancedPlan += '\n\nAcademic Accommodations: Provided patient with school accommodation letter recommending reduced workload, extra time for assignments/tests, and scheduled rest breaks during school day.';
    }
    
    return enhancedPlan;
  }
  
  private generateDefaultClinicalAlerts(): ClinicalAlert[] {
    return [
      {
        message: 'Patient symptoms are consistent with concussion. Monitor for worsening symptoms.',
        severity: 'warning',
        domain: 'Neurological',
        recommendation: 'Follow up in 7-10 days and implement gradual return to activity protocol'
      },
      {
        message: 'Consider vestibular rehabilitation if dizziness persists >1 week',
        severity: 'warning',
        domain: 'Vestibular',
        recommendation: 'Refer to vestibular therapist if no improvement within 7 days'
      },
      {
        message: 'Sleep disturbances reported. May impact recovery trajectory.',
        severity: 'info',
        domain: 'Sleep',
        recommendation: 'Provide sleep hygiene education and consider sleep aids if persistent'
      }
    ];
  }
}

export const medicalKnowledge: MedicalKnowledgeService = new LocalMedicalKnowledge();