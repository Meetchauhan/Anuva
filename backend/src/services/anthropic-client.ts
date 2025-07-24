import Anthropic from '@anthropic-ai/sdk';
import { SoapNote, ClinicalAlert, SuggestedOrder, SymptomCheckin } from '@shared/schema';

export class AnthropicClient {
  private client: Anthropic | null = null;
  
  constructor(apiKey?: string) {
    if (apiKey) {
      this.initialize(apiKey);
    }
  }
  
  initialize(apiKey: string): void {
    this.client = new Anthropic({
      apiKey: apiKey,
    });
  }
  
  isInitialized(): boolean {
    return !!this.client;
  }
  
  /**
   * Generate an enhanced SOAP note using Anthropic Claude
   */
  async enhanceSoapNote(soapNote: SoapNote): Promise<Partial<SoapNote>> {
    if (!this.client) {
      throw new Error('Anthropic client not initialized');
    }
    
    try {
      // The newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
      
      // Create prompt for enhancing assessment
      const assessmentPrompt = `You are a neurology expert specializing in concussion care. 
Review this patient's information and enhance the assessment section to be more thorough:

SUBJECTIVE:
${soapNote.subjective}

OBJECTIVE:
${soapNote.objective}

CURRENT ASSESSMENT:
${soapNote.assessment}

Provide an enhanced assessment that maintains clinical accuracy but adds more detailed observations 
and connections with current concussion management best practices. 
Return ONLY the enhanced assessment, with no additional explanation or labels.`;

      const assessmentResponse = await this.client.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 1000,
        messages: [{ role: 'user', content: assessmentPrompt }],
      });

      // Create prompt for enhancing plan
      const planPrompt = `You are a neurology expert specializing in concussion care. 
Review this patient's information and enhance the treatment plan section to be more comprehensive:

SUBJECTIVE:
${soapNote.subjective}

OBJECTIVE:
${soapNote.objective}

ASSESSMENT:
${soapNote.assessment}

CURRENT PLAN:
${soapNote.plan}

Provide an enhanced treatment plan that maintains clinical accuracy but adds more detailed
recommendations aligned with current evidence-based concussion management.
Return ONLY the enhanced plan, with no additional explanation or labels.`;

      const planResponse = await this.client.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 1000,
        messages: [{ role: 'user', content: planPrompt }],
      });

      // Extract text from responses
      let assessmentText = '';
      let planText = '';
      
      if (assessmentResponse.content && assessmentResponse.content.length > 0) {
        const content = assessmentResponse.content[0];
        if ('text' in content) {
          assessmentText = content.text;
        }
      }
      
      if (planResponse.content && planResponse.content.length > 0) {
        const content = planResponse.content[0];
        if ('text' in content) {
          planText = content.text;
        }
      }

      return {
        assessment: assessmentText,
        plan: planText,
        aiGenerated: true,
        updatedAt: new Date()
      };
    } catch (error: unknown) {
      console.error('Error enhancing SOAP note with Anthropic:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to enhance SOAP note with AI: ${errorMessage}`);
    }
  }
  
  /**
   * Generate clinical alerts based on SOAP note content
   */
  async generateClinicalAlerts(soapNote: SoapNote): Promise<ClinicalAlert[]> {
    if (!this.client) {
      throw new Error('Anthropic client not initialized');
    }
    
    try {
      const prompt = `You are a neurology expert specializing in concussion care.
Based on the following patient information, identify any clinical alerts that would be important for the healthcare provider:

SUBJECTIVE:
${soapNote.subjective}

OBJECTIVE:
${soapNote.objective}

ASSESSMENT:
${soapNote.assessment}

PLAN:
${soapNote.plan}

Generate clinical alerts in the following JSON format:
[
  {
    "message": "Brief alert message",
    "severity": "info|warning|critical",
    "domain": "Category of the alert (e.g., cognitive, physical, sleep)",
    "relatedSymptoms": ["symptom1", "symptom2"],
    "recommendation": "Brief recommendation to address this alert"
  }
]

Return ONLY valid JSON with no additional text.`;

      const response = await this.client.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      });

      try {
        // Extract text from response
        let responseText = '';
        if (response.content && response.content.length > 0) {
          const content = response.content[0];
          if ('text' in content) {
            responseText = content.text;
          }
        }
        
        return JSON.parse(responseText);
      } catch (parseError: unknown) {
        console.error('Error parsing clinical alerts JSON:', parseError);
        return [];
      }
    } catch (error: unknown) {
      console.error('Error generating clinical alerts with Anthropic:', error);
      return [];
    }
  }
  
  /**
   * Generate suggested orders based on SOAP note content
   */
  async generateSuggestedOrders(soapNote: SoapNote): Promise<SuggestedOrder[]> {
    if (!this.client) {
      throw new Error('Anthropic client not initialized');
    }
    
    try {
      const prompt = `You are a neurology expert specializing in concussion care.
Based on the following patient information, suggest appropriate clinical orders:

SUBJECTIVE:
${soapNote.subjective}

OBJECTIVE:
${soapNote.objective}

ASSESSMENT:
${soapNote.assessment}

PLAN:
${soapNote.plan}

Generate suggested orders in the following JSON format:
[
  {
    "name": "Name of the order",
    "category": "Category (e.g., diagnostic, medication, therapy, referral)",
    "rationale": "Brief rationale for this order",
    "evidenceLevel": "High|Moderate|Low",
    "completed": false
  }
]

Return ONLY valid JSON with no additional text.`;

      const response = await this.client.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      });

      try {
        // Extract text from response
        let responseText = '';
        if (response.content && response.content.length > 0) {
          const content = response.content[0];
          if ('text' in content) {
            responseText = content.text;
          }
        }
        
        return JSON.parse(responseText);
      } catch (parseError: unknown) {
        console.error('Error parsing suggested orders JSON:', parseError);
        return [];
      }
    } catch (error: unknown) {
      console.error('Error generating suggested orders with Anthropic:', error);
      return [];
    }
  }
  
  /**
   * Analyze concussion risk based on symptom check-ins
   */
  async analyzeConcussionRisk(checkins: SymptomCheckin[]): Promise<{
    riskLevel: 'critical' | 'recovering' | 'stable';
    alerts: ClinicalAlert[];
  }> {
    if (!this.client) {
      throw new Error('Anthropic client not initialized');
    }
    
    try {
      // Sort checkins by date (newest first)
      const sortedCheckins = [...checkins].sort(
        (a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime()
      );
      
      // Extract symptom data for analysis
      const symptomData = sortedCheckins.map(checkin => ({
        date: new Date(checkin.checkInDate).toISOString().split('T')[0],
        pcssTotal: checkin.pcssTotal,
        symptoms: checkin.symptoms
      }));
      
      const prompt = `You are a neurology expert specializing in concussion care.
Analyze the following patient symptom check-in data to determine their current risk level:

${JSON.stringify(symptomData, null, 2)}

Determine the patient's risk level and provide relevant clinical alerts in the following JSON format:
{
  "riskLevel": "critical|recovering|stable",
  "alerts": [
    {
      "message": "Brief alert message",
      "severity": "info|warning|critical",
      "domain": "Category of the alert (e.g., cognitive, physical, sleep)",
      "relatedSymptoms": ["symptom1", "symptom2"],
      "recommendation": "Brief recommendation to address this alert"
    }
  ]
}

Use the following guidelines:
- "critical" risk: High symptom scores (PCSS total > 60) or significant worsening of symptoms
- "recovering" risk: Moderate symptom scores (PCSS total 30-60) or mild improvement in symptoms
- "stable" risk: Low symptom scores (PCSS total < 30) or significant improvement in symptoms

Return ONLY valid JSON with no additional text.`;

      const response = await this.client.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      });

      try {
        // Extract text from response
        let responseText = '';
        if (response.content && response.content.length > 0) {
          const content = response.content[0];
          if ('text' in content) {
            responseText = content.text;
          }
        }
        
        return JSON.parse(responseText);
      } catch (parseError: unknown) {
        console.error('Error parsing concussion risk analysis JSON:', parseError);
        return {
          riskLevel: 'stable',
          alerts: []
        };
      }
    } catch (error: unknown) {
      console.error('Error analyzing concussion risk with Anthropic:', error);
      return {
        riskLevel: 'stable',
        alerts: []
      };
    }
  }
}