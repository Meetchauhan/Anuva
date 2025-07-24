import Anthropic from '@anthropic-ai/sdk';
import { SoapNote, SymptomCheckin } from '@shared/schema';

// Initialize Anthropic client
// The newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export class SymptomAnalysisService {
  /**
   * Generate insights from symptom checkins
   */
  async analyzeSymptomProgression(checkins: SymptomCheckin[]): Promise<{
    insights: string;
    recommendations: string[];
    riskLevel: 'improving' | 'stable' | 'deteriorating';
  }> {
    if (!checkins || checkins.length === 0) {
      return {
        insights: "No symptom data available for analysis.",
        recommendations: ["Complete initial symptom assessment."],
        riskLevel: 'stable'
      };
    }

    // Sort checkins by date (newest first)
    const sortedCheckins = [...checkins].sort(
      (a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime()
    );

    // Format checkin data for Claude
    const checkinData = sortedCheckins.map(checkin => {
      const date = new Date(checkin.checkInDate).toLocaleDateString();
      
      const symptoms = checkin.symptoms.map(s => {
        return `${s.name}: ${s.value}/6`;
      }).join(', ');
      
      return `Date: ${date}, PCSS Score: ${checkin.pcssTotal}, Symptoms: [${symptoms}]`;
    }).join('\n\n');

    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 1000,
        system: "You are a neurological assessment AI assistant that analyzes concussion symptoms. Provide concise, actionable insights based on symptom progression data. Focus on identifying trends, improvements, or areas of concern.",
        messages: [
          {
            role: 'user',
            content: `Analyze the following concussion symptom progression data from a patient's checkins:
            
            ${checkinData}
            
            Please provide:
            1. A brief insight about the patient's symptom progression
            2. Three specific recommendations for the clinical team
            3. A risk assessment (improving, stable, or deteriorating)
            
            Format your response as JSON with keys: "insights", "recommendations" (array), and "riskLevel".`
          }
        ]
      });

      try {
        // Check if the content has text property
        if ('text' in response.content[0]) {
          const analysisText = response.content[0].text;
          const analysis = JSON.parse(analysisText);
          return {
            insights: analysis.insights || "Analysis completed.",
            recommendations: analysis.recommendations || [],
            riskLevel: analysis.riskLevel || 'stable'
          };
        } else {
          return {
            insights: "Analysis completed but couldn't format results.",
            recommendations: ["Review symptom data manually."],
            riskLevel: 'stable'
          };
        }
      } catch (parseError) {
        console.error("Failed to parse Claude response:", parseError);
        return {
          insights: "Analysis completed but couldn't format results.",
          recommendations: ["Review symptom data manually."],
          riskLevel: 'stable'
        };
      }
    } catch (error) {
      console.error("Error calling Claude API:", error);
      return {
        insights: "Unable to analyze symptoms at this time.",
        recommendations: ["Try again later or review symptoms manually."],
        riskLevel: 'stable'
      };
    }
  }

  /**
   * Generate visualization recommendations based on symptom data
   */
  async generateVisualizationRecommendations(checkins: SymptomCheckin[]): Promise<{
    recommendedVisualizations: Array<{
      type: string;
      title: string;
      description: string;
      rationale: string;
    }>;
  }> {
    if (!checkins || checkins.length < 2) {
      return {
        recommendedVisualizations: [{
          type: "none",
          title: "Insufficient Data",
          description: "Not enough data points for visualization",
          rationale: "Need at least two symptom checkins for meaningful visualization"
        }]
      };
    }

    try {
      // Format symptom data for Claude
      const symptoms = new Set<string>();
      const categoryMap = new Map<string, Set<string>>();
      
      checkins.forEach(checkin => {
        checkin.symptoms.forEach(symptom => {
          symptoms.add(symptom.name);
          
          if (!categoryMap.has(symptom.category)) {
            categoryMap.set(symptom.category, new Set());
          }
          categoryMap.get(symptom.category)?.add(symptom.name);
        });
      });

      const categorySummary = Array.from(categoryMap.entries()).map(([category, symptomSet]) => {
        return `${category}: ${Array.from(symptomSet).join(', ')}`;
      }).join('\n');

      const response = await anthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 1200,
        system: "You are a data visualization expert specializing in medical data. Recommend the most effective visualizations for tracking concussion symptoms over time.",
        messages: [
          {
            role: 'user',
            content: `A patient has ${checkins.length} symptom checkins over time with the following symptom categories:
            
            ${categorySummary}
            
            Total number of unique symptoms: ${symptoms.size}
            
            Recommend 3-5 visualizations that would be most effective for:
            1. Tracking overall symptom progression
            2. Identifying patterns across symptom categories
            3. Highlighting the most severe or persistent symptoms
            
            Format your response as JSON with an array of visualization recommendations, each containing:
            - "type": The type of visualization (e.g., "line chart", "radar chart", "heatmap")
            - "title": A clear title for the visualization
            - "description": A brief description of what the visualization shows
            - "rationale": Why this visualization is particularly effective for this data`
          }
        ]
      });

      try {
        if ('text' in response.content[0]) {
          const recommendationsText = response.content[0].text;
          const result = JSON.parse(recommendationsText);
          return {
            recommendedVisualizations: Array.isArray(result) ? result : (result.recommendedVisualizations || [])
          };
        } else {
          return {
            recommendedVisualizations: []
          };
        }
      } catch (parseError) {
        console.error("Failed to parse Claude visualization recommendations:", parseError);
        return {
          recommendedVisualizations: []
        };
      }
    } catch (error) {
      console.error("Error generating visualization recommendations:", error);
      return {
        recommendedVisualizations: []
      };
    }
  }

  /**
   * Generate AI-enhanced SOAP note from symptom data
   */
  async generateEnhancedSoapNote(patientName: string, symptoms: SymptomCheckin[], existingNote?: SoapNote): Promise<{
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  }> {
    if (!symptoms || symptoms.length === 0) {
      return {
        subjective: "No subjective data available.",
        objective: "No objective data available.",
        assessment: "Assessment not possible due to insufficient data.",
        plan: "Complete initial symptom assessment."
      };
    }

    // Sort symptoms by date (newest first)
    const sortedSymptoms = [...symptoms].sort(
      (a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime()
    );

    // Format checkin data for Claude
    const symptomData = sortedSymptoms.map(checkin => {
      const date = new Date(checkin.checkInDate).toLocaleDateString();
      
      const symptomDetails = checkin.symptoms.map(s => {
        return `${s.name}: ${s.value}/6`;
      }).join(', ');
      
      return `Date: ${date}, PCSS Score: ${checkin.pcssTotal}, Symptoms: [${symptomDetails}]`;
    }).join('\n\n');

    const existingNotePrompt = existingNote ? `
      Previously documented SOAP note:
      Subjective: ${existingNote.subjective}
      Objective: ${existingNote.objective}
      Assessment: ${existingNote.assessment}
      Plan: ${existingNote.plan}
    ` : '';

    try {
      const response = await anthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 1500,
        system: "You are a clinical neuropsychologist specializing in concussion assessment and treatment. Draft clear, professional SOAP notes based on symptom data.",
        messages: [
          {
            role: 'user',
            content: `Generate a SOAP note for patient ${patientName} based on the following symptom progression data:
            
            ${symptomData}
            
            ${existingNotePrompt}
            
            Format your response as JSON with these sections:
            - "subjective": Patient's reported symptoms and experiences
            - "objective": Clinical observations and test results
            - "assessment": Clinical assessment of condition and progress
            - "plan": Treatment recommendations and next steps`
          }
        ]
      });

      try {
        if ('text' in response.content[0]) {
          const soapNoteText = response.content[0].text;
          return JSON.parse(soapNoteText);
        } else {
          return {
            subjective: "Error generating subjective section.",
            objective: "Error generating objective section.",
            assessment: "Error generating assessment section.",
            plan: "Manual review recommended."
          };
        }
      } catch (parseError) {
        console.error("Failed to parse Claude SOAP note response:", parseError);
        return {
          subjective: "Error generating subjective section.",
          objective: "Error generating objective section.",
          assessment: "Error generating assessment section.",
          plan: "Manual review recommended."
        };
      }
    } catch (error) {
      console.error("Error generating SOAP note:", error);
      return {
        subjective: "Unable to generate SOAP note at this time.",
        objective: "API error occurred.",
        assessment: "Cannot provide assessment due to technical issues.",
        plan: "Try again later or create note manually."
      };
    }
  }
}

// Create singleton instance
export const symptomAnalysisService = new SymptomAnalysisService();