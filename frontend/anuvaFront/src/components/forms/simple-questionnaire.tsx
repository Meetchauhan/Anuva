import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { IntakeForm } from "@shared/schema";

interface SimpleQuestionnaireProps {
  form: IntakeForm;
  onClose: () => void;
}

export default function SimpleQuestionnaire({ form, onClose }: SimpleQuestionnaireProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [currentStep, setCurrentStep] = useState(0);

  const completeMutation = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      const response = await fetch(`/api/intake-forms/${form.id}/complete`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ responses: data }),
      });
      if (!response.ok) {
        throw new Error("Failed to complete form");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Assessment Completed",
        description: "Your responses have been saved successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/intake-forms"] });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save your responses. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateResponse = (key: string, value: any) => {
    setResponses(prev => ({ ...prev, [key]: value }));
  };

  const getQuestionnaireConfig = () => {
    switch (form.formType) {
      case "concussion_baseline":
        return {
          title: "Concussion Management Intake",
          steps: [
            {
              title: "Medical History",
              questions: [
                {
                  key: "previousConcussions",
                  label: "Have you ever had a concussion or head injury?",
                  type: "radio",
                  options: [
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" }
                  ]
                },
                {
                  key: "currentMedications",
                  label: "Are you currently taking any medications?",
                  type: "radio",
                  options: [
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" }
                  ]
                },
                {
                  key: "learningDisabilities",
                  label: "Do you have any learning disabilities?",
                  type: "radio",
                  options: [
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" }
                  ]
                }
              ]
            },
            {
              title: "Current Status",
              questions: [
                {
                  key: "dominantHand",
                  label: "What is your dominant hand?",
                  type: "radio",
                  options: [
                    { value: "right", label: "Right" },
                    { value: "left", label: "Left" }
                  ]
                },
                {
                  key: "sportsParticipation",
                  label: "Do you participate in sports or physical activities?",
                  type: "radio",
                  options: [
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" }
                  ]
                },
                {
                  key: "additionalComments",
                  label: "Any additional information you'd like to share?",
                  type: "textarea"
                }
              ]
            }
          ]
        };

      case "symptom_tracking":
        return {
          title: "Graded Symptom Checklist",
          steps: [
            {
              title: "Physical Symptoms",
              questions: [
                {
                  key: "headacheLevel",
                  label: "Rate your headache intensity (0-10 scale)",
                  type: "number",
                  min: 0,
                  max: 10
                },
                {
                  key: "nauseaLevel",
                  label: "Rate your nausea level (0-10 scale)",
                  type: "number",
                  min: 0,
                  max: 10
                },
                {
                  key: "dizzinessLevel",
                  label: "Rate your dizziness level (0-10 scale)",
                  type: "number",
                  min: 0,
                  max: 10
                }
              ]
            },
            {
              title: "Cognitive Symptoms",
              questions: [
                {
                  key: "concentrationDifficulty",
                  label: "Rate your concentration difficulty (0-10 scale)",
                  type: "number",
                  min: 0,
                  max: 10
                },
                {
                  key: "memoryProblems",
                  label: "Rate your memory problems (0-10 scale)",
                  type: "number",
                  min: 0,
                  max: 10
                },
                {
                  key: "sleepQuality",
                  label: "How would you rate your sleep quality?",
                  type: "radio",
                  options: [
                    { value: "excellent", label: "Excellent" },
                    { value: "good", label: "Good" },
                    { value: "fair", label: "Fair" },
                    { value: "poor", label: "Poor" }
                  ]
                }
              ]
            },
            {
              title: "Daily Function",
              questions: [
                {
                  key: "dailyActivities",
                  label: "How are your symptoms affecting your daily activities?",
                  type: "radio",
                  options: [
                    { value: "not_at_all", label: "Not at all" },
                    { value: "slightly", label: "Slightly" },
                    { value: "moderately", label: "Moderately" },
                    { value: "severely", label: "Severely" }
                  ]
                },
                {
                  key: "symptomTriggers",
                  label: "What triggers or worsens your symptoms?",
                  type: "textarea"
                }
              ]
            }
          ]
        };

      case "cognitive_evaluation":
        return {
          title: "Cognitive Function Assessment",
          steps: [
            {
              title: "Assessment Information",
              questions: [
                {
                  key: "assessmentPreparation",
                  label: "Are you ready for your cognitive assessment?",
                  type: "radio",
                  options: [
                    { value: "yes", label: "Yes, I'm ready" },
                    { value: "need_reschedule", label: "I need to reschedule" }
                  ]
                },
                {
                  key: "currentConcerns",
                  label: "What are your main cognitive concerns?",
                  type: "textarea"
                }
              ]
            }
          ]
        };

      case "neurological_assessment":
        return {
          title: "Neurological Symptom Checklist",
          steps: [
            {
              title: "Neurological Symptoms",
              questions: [
                {
                  key: "visionChanges",
                  label: "Are you experiencing any vision changes?",
                  type: "radio",
                  options: [
                    { value: "none", label: "No changes" },
                    { value: "blurred", label: "Blurred vision" },
                    { value: "double", label: "Double vision" },
                    { value: "light_sensitivity", label: "Light sensitivity" }
                  ]
                },
                {
                  key: "balanceIssues",
                  label: "Rate your balance problems (0-10 scale)",
                  type: "number",
                  min: 0,
                  max: 10
                },
                {
                  key: "coordinationProblems",
                  label: "Do you have coordination problems?",
                  type: "radio",
                  options: [
                    { value: "none", label: "No problems" },
                    { value: "mild", label: "Mild difficulty" },
                    { value: "moderate", label: "Moderate difficulty" },
                    { value: "severe", label: "Severe difficulty" }
                  ]
                }
              ]
            }
          ]
        };

      case "neurobehavioral_baseline":
        return {
          title: "Neurobehavioral Baseline Assessment",
          steps: [
            {
              title: "Cognitive Baseline",
              questions: [
                {
                  key: "attentionSpan",
                  label: "How would you rate your typical attention span?",
                  type: "radio",
                  options: [
                    { value: "excellent", label: "Excellent" },
                    { value: "good", label: "Good" },
                    { value: "fair", label: "Fair" },
                    { value: "poor", label: "Poor" }
                  ]
                },
                {
                  key: "memoryFunction",
                  label: "How is your typical memory function?",
                  type: "radio",
                  options: [
                    { value: "excellent", label: "Excellent" },
                    { value: "good", label: "Good" },
                    { value: "fair", label: "Fair" },
                    { value: "poor", label: "Poor" }
                  ]
                },
                {
                  key: "processingSpeed",
                  label: "How would you describe your information processing speed?",
                  type: "radio",
                  options: [
                    { value: "very_fast", label: "Very fast" },
                    { value: "fast", label: "Fast" },
                    { value: "average", label: "Average" },
                    { value: "slow", label: "Slow" }
                  ]
                }
              ]
            }
          ]
        };

      case "medical_history":
        return {
          title: "Medical History Intake",
          steps: [
            {
              title: "General Medical History",
              questions: [
                {
                  key: "chronicConditions",
                  label: "Do you have any chronic medical conditions?",
                  type: "textarea"
                },
                {
                  key: "allergies",
                  label: "List any allergies or adverse reactions to medications",
                  type: "textarea"
                },
                {
                  key: "familyHistory",
                  label: "Relevant family medical history",
                  type: "textarea"
                },
                {
                  key: "emergencyContact",
                  label: "Emergency contact name and phone number",
                  type: "text"
                }
              ]
            }
          ]
        };

      case "return_to_play":
        return {
          title: "Return-to-Play Protocol",
          steps: [
            {
              title: "Current Status",
              questions: [
                {
                  key: "symptomFreeAtRest",
                  label: "Are you symptom-free at rest?",
                  type: "radio",
                  options: [
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" }
                  ]
                },
                {
                  key: "exerciseTolerance",
                  label: "What level of exercise can you currently tolerate?",
                  type: "radio",
                  options: [
                    { value: "none", label: "Complete rest only" },
                    { value: "light", label: "Light activity" },
                    { value: "moderate", label: "Moderate exercise" },
                    { value: "full", label: "Full activity" }
                  ]
                },
                {
                  key: "physicianClearance",
                  label: "Have you received physician clearance?",
                  type: "radio",
                  options: [
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                    { value: "pending", label: "Pending evaluation" }
                  ]
                },
                {
                  key: "returnConcerns",
                  label: "Do you have any concerns about returning to play?",
                  type: "textarea"
                }
              ]
            }
          ]
        };

      default:
        return {
          title: "Assessment Form",
          steps: [
            {
              title: "General Assessment",
              questions: [
                {
                  key: "generalNotes",
                  label: "Please provide any relevant information",
                  type: "textarea"
                }
              ]
            }
          ]
        };
    }
  };

  const config = getQuestionnaireConfig();
  const currentStepData = config.steps[currentStep];

  const renderQuestion = (question: any) => {
    switch (question.type) {
      case "radio":
        return (
          <div className="space-y-3">
            <Label className="text-base font-medium">{question.label}</Label>
            <RadioGroup
              value={responses[question.key] || ""}
              onValueChange={(value) => updateResponse(question.key, value)}
            >
              {question.options.map((option: any) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${question.key}-${option.value}`} />
                  <label htmlFor={`${question.key}-${option.value}`} className="text-sm">
                    {option.label}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case "number":
        return (
          <div className="space-y-3">
            <Label className="text-base font-medium">{question.label}</Label>
            <Input
              type="number"
              min={question.min}
              max={question.max}
              value={responses[question.key] || ""}
              onChange={(e) => updateResponse(question.key, e.target.value)}
              className="w-20"
            />
          </div>
        );

      case "textarea":
        return (
          <div className="space-y-3">
            <Label className="text-base font-medium">{question.label}</Label>
            <Textarea
              value={responses[question.key] || ""}
              onChange={(e) => updateResponse(question.key, e.target.value)}
              placeholder="Please provide your response..."
              rows={4}
            />
          </div>
        );

      default:
        return (
          <div className="space-y-3">
            <Label className="text-base font-medium">{question.label}</Label>
            <Input
              value={responses[question.key] || ""}
              onChange={(e) => updateResponse(question.key, e.target.value)}
            />
          </div>
        );
    }
  };

  const handleSubmit = () => {
    completeMutation.mutate(responses);
  };

  const canProceed = () => {
    return currentStepData.questions.every(q => 
      q.type === "textarea" || responses[q.key] !== undefined
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{config.title}</span>
            <Button variant="ghost" onClick={onClose}>
              ×
            </Button>
          </CardTitle>
          {config.steps.length > 1 && (
            <div className="flex space-x-2 mt-4">
              {config.steps.map((step, index) => (
                <div
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm ${
                    index === currentStep
                      ? "bg-blue-600 text-white"
                      : index < currentStep
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.title}
                </div>
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
            
            <div className="space-y-6">
              {currentStepData.questions.map((question, index) => (
                <div key={question.key}>
                  {renderQuestion(question)}
                </div>
              ))}
            </div>
            
            <div className="flex justify-between pt-6">
              {currentStep > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                >
                  Previous
                </Button>
              )}
              
              <div className="ml-auto">
                {currentStep < config.steps.length - 1 ? (
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={!canProceed()}
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit} 
                    disabled={completeMutation.isPending || !canProceed()}
                  >
                    {completeMutation.isPending ? "Submitting..." : "Complete Assessment"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}