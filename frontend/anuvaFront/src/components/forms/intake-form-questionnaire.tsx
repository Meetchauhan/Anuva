import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import type { IntakeForm } from "@shared/schema";

interface IntakeFormQuestionnaireProps {
  form: IntakeForm;
  onClose: () => void;
}

// Concussion Baseline Assessment Schema
const baselineAssessmentSchema = z.object({
  previousConcussions: z.string(),
  previousConcussionCount: z.string().optional(),
  currentMedications: z.string(),
  learningDisabilities: z.string(),
  attentionDeficit: z.string(),
  mentalHealthHistory: z.string(),
  migraines: z.string(),
  sleepDisorders: z.string(),
  dominantHand: z.string(),
  sportsParticipation: z.string(),
  currentSport: z.string().optional(),
  additionalComments: z.string().optional(),
});

// Symptom Tracking Schema
const symptomTrackingSchema = z.object({
  headacheIntensity: z.array(z.number()),
  nauseaLevel: z.array(z.number()),
  dizzinessLevel: z.array(z.number()),
  fatigueLevel: z.array(z.number()),
  sleepQuality: z.string(),
  concentrationDifficulty: z.array(z.number()),
  memoryProblems: z.array(z.number()),
  lightSensitivity: z.array(z.number()),
  noiseSensitivity: z.array(z.number()),
  balanceProblems: z.array(z.number()),
  irritabilityLevel: z.array(z.number()),
  currentSymptoms: z.array(z.string()),
  symptomTriggers: z.string().optional(),
  dailyActivities: z.string(),
});

// Cognitive Function Assessment Schema
const cognitiveAssessmentSchema = z.object({
  memoryDifficulty: z.string(),
  attentionSpan: z.string(),
  processingSpeed: z.string(),
  executiveFunctioning: z.string(),
  languageProblems: z.string(),
  visualProcessing: z.string(),
  workPerformance: z.string(),
  academicPerformance: z.string(),
  cognitiveStrategies: z.string(),
  cognitiveSymptoms: z.array(z.string()),
});

// Return-to-Play Protocol Schema
const returnToPlaySchema = z.object({
  symptomFreeAtRest: z.string(),
  lightExerciseTolerance: z.string(),
  moderateExerciseTolerance: z.string(),
  heavyExerciseTolerance: z.string(),
  fullContactReadiness: z.string(),
  currentActivityLevel: z.string(),
  physicianClearance: z.string(),
  neuropsychClearance: z.string(),
  returnToPlayConcerns: z.string().optional(),
});

export default function IntakeFormQuestionnaire({ form, onClose }: IntakeFormQuestionnaireProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);

  const getFormConfig = () => {
    switch (form.formType) {
      case "concussion_baseline":
        return {
          schema: baselineAssessmentSchema,
          title: "Concussion Baseline Assessment",
          steps: ["Medical History", "Current Status", "Additional Information"],
        };
      case "symptom_tracking":
        return {
          schema: symptomTrackingSchema,
          title: "Daily Symptom Tracking",
          steps: ["Physical Symptoms", "Cognitive Symptoms", "Daily Function"],
        };
      case "cognitive_evaluation":
        return {
          schema: cognitiveAssessmentSchema,
          title: "Cognitive Function Assessment",
          steps: ["Memory & Attention", "Processing & Language", "Daily Impact"],
        };
      case "return_to_play":
        return {
          schema: returnToPlaySchema,
          title: "Return-to-Play Protocol",
          steps: ["Symptom Status", "Exercise Tolerance", "Medical Clearance"],
        };
      default:
        return {
          schema: z.object({}),
          title: "Assessment Form",
          steps: ["Assessment"],
        };
    }
  };

  const config = getFormConfig();
  const formMethods = useForm({
    resolver: zodResolver(config.schema),
    defaultValues: {},
  });

  const completeMutation = useMutation({
    mutationFn: async (data: any) => {
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
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save your responses. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    completeMutation.mutate(data);
  };

  const renderBaselineAssessment = () => (
    <div className="space-y-6">
      {currentStep === 0 && (
        <div className="space-y-4">
          <FormField
            control={formMethods.control}
            name="previousConcussions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Have you ever had a concussion or head injury?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="prev-concussion-yes" />
                      <label htmlFor="prev-concussion-yes">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="prev-concussion-no" />
                      <label htmlFor="prev-concussion-no">No</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {formMethods.watch("previousConcussions") === "yes" && (
            <FormField
              control={formMethods.control}
              name="previousConcussionCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>How many concussions have you had?</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={formMethods.control}
            name="currentMedications"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Are you currently taking any medications?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="meds-yes" />
                      <label htmlFor="meds-yes">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="meds-no" />
                      <label htmlFor="meds-no">No</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="learningDisabilities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Do you have any learning disabilities?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="learning-yes" />
                      <label htmlFor="learning-yes">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="learning-no" />
                      <label htmlFor="learning-no">No</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="attentionDeficit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Do you have ADD/ADHD?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="adhd-yes" />
                      <label htmlFor="adhd-yes">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="adhd-no" />
                      <label htmlFor="adhd-no">No</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {currentStep === 1 && (
        <div className="space-y-4">
          <FormField
            control={formMethods.control}
            name="mentalHealthHistory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Do you have a history of depression, anxiety, or other mental health conditions?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="mental-yes" />
                      <label htmlFor="mental-yes">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="mental-no" />
                      <label htmlFor="mental-no">No</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="migraines"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Do you suffer from migraines or frequent headaches?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="migraine-yes" />
                      <label htmlFor="migraine-yes">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="migraine-no" />
                      <label htmlFor="migraine-no">No</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="sleepDisorders"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Do you have any sleep disorders?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="sleep-yes" />
                      <label htmlFor="sleep-yes">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="sleep-no" />
                      <label htmlFor="sleep-no">No</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="dominantHand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is your dominant hand?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="right" id="hand-right" />
                      <label htmlFor="hand-right">Right</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="left" id="hand-left" />
                      <label htmlFor="hand-left">Left</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-4">
          <FormField
            control={formMethods.control}
            name="sportsParticipation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Do you participate in sports or physical activities?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="sports-yes" />
                      <label htmlFor="sports-yes">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="sports-no" />
                      <label htmlFor="sports-no">No</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {formMethods.watch("sportsParticipation") === "yes" && (
            <FormField
              control={formMethods.control}
              name="currentSport"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What sports do you participate in?</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Football, Soccer, Basketball..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={formMethods.control}
            name="additionalComments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Any additional information you'd like to share?</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Please provide any additional relevant information..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );

  const renderSymptomTracking = () => (
    <div className="space-y-6">
      {currentStep === 0 && (
        <div className="space-y-6">
          <FormField
            control={formMethods.control}
            name="headacheIntensity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Headache Intensity (0 = None, 10 = Severe)</FormLabel>
                <FormControl>
                  <div className="px-4">
                    <Slider
                      value={field.value || [0]}
                      onValueChange={field.onChange}
                      max={10}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>None</span>
                      <span>Severe</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="nauseaLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nausea Level (0 = None, 10 = Severe)</FormLabel>
                <FormControl>
                  <div className="px-4">
                    <Slider
                      value={field.value || [0]}
                      onValueChange={field.onChange}
                      max={10}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>None</span>
                      <span>Severe</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="dizzinessLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dizziness Level (0 = None, 10 = Severe)</FormLabel>
                <FormControl>
                  <div className="px-4">
                    <Slider
                      value={field.value || [0]}
                      onValueChange={field.onChange}
                      max={10}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>None</span>
                      <span>Severe</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="fatigueLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fatigue Level (0 = None, 10 = Severe)</FormLabel>
                <FormControl>
                  <div className="px-4">
                    <Slider
                      value={field.value || [0]}
                      onValueChange={field.onChange}
                      max={10}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>None</span>
                      <span>Severe</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {currentStep === 1 && (
        <div className="space-y-6">
          <FormField
            control={formMethods.control}
            name="concentrationDifficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Concentration Difficulty (0 = None, 10 = Severe)</FormLabel>
                <FormControl>
                  <div className="px-4">
                    <Slider
                      value={field.value || [0]}
                      onValueChange={field.onChange}
                      max={10}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>None</span>
                      <span>Severe</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="memoryProblems"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Memory Problems (0 = None, 10 = Severe)</FormLabel>
                <FormControl>
                  <div className="px-4">
                    <Slider
                      value={field.value || [0]}
                      onValueChange={field.onChange}
                      max={10}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>None</span>
                      <span>Severe</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="lightSensitivity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Light Sensitivity (0 = None, 10 = Severe)</FormLabel>
                <FormControl>
                  <div className="px-4">
                    <Slider
                      value={field.value || [0]}
                      onValueChange={field.onChange}
                      max={10}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>None</span>
                      <span>Severe</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="noiseSensitivity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Noise Sensitivity (0 = None, 10 = Severe)</FormLabel>
                <FormControl>
                  <div className="px-4">
                    <Slider
                      value={field.value || [0]}
                      onValueChange={field.onChange}
                      max={10}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>None</span>
                      <span>Severe</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-4">
          <FormField
            control={formMethods.control}
            name="sleepQuality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How would you rate your sleep quality?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excellent" id="sleep-excellent" />
                      <label htmlFor="sleep-excellent">Excellent</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="good" id="sleep-good" />
                      <label htmlFor="sleep-good">Good</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fair" id="sleep-fair" />
                      <label htmlFor="sleep-fair">Fair</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="poor" id="sleep-poor" />
                      <label htmlFor="sleep-poor">Poor</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="dailyActivities"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How are your symptoms affecting your daily activities?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not_at_all" id="activities-none" />
                      <label htmlFor="activities-none">Not at all</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="slightly" id="activities-slightly" />
                      <label htmlFor="activities-slightly">Slightly</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderately" id="activities-moderately" />
                      <label htmlFor="activities-moderately">Moderately</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="severely" id="activities-severely" />
                      <label htmlFor="activities-severely">Severely</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="symptomTriggers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What triggers or worsens your symptoms?</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="e.g., bright lights, loud noises, physical activity, stress..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );

  const renderCognitiveAssessment = () => (
    <div className="space-y-6">
      {currentStep === 0 && (
        <div className="space-y-4">
          <FormField
            control={formMethods.control}
            name="memoryDifficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Are you experiencing memory difficulties?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="memory-none" />
                      <label htmlFor="memory-none">None</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mild" id="memory-mild" />
                      <label htmlFor="memory-mild">Mild</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate" id="memory-moderate" />
                      <label htmlFor="memory-moderate">Moderate</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="severe" id="memory-severe" />
                      <label htmlFor="memory-severe">Severe</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="attentionSpan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How is your attention span?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="normal" id="attention-normal" />
                      <label htmlFor="attention-normal">Normal</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="slightly_impaired" id="attention-slight" />
                      <label htmlFor="attention-slight">Slightly impaired</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderately_impaired" id="attention-moderate" />
                      <label htmlFor="attention-moderate">Moderately impaired</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="severely_impaired" id="attention-severe" />
                      <label htmlFor="attention-severe">Severely impaired</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="processingSpeed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How is your mental processing speed?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="normal" id="processing-normal" />
                      <label htmlFor="processing-normal">Normal</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="slightly_slow" id="processing-slight" />
                      <label htmlFor="processing-slight">Slightly slow</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderately_slow" id="processing-moderate" />
                      <label htmlFor="processing-moderate">Moderately slow</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="very_slow" id="processing-severe" />
                      <label htmlFor="processing-severe">Very slow</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {currentStep === 1 && (
        <div className="space-y-4">
          <FormField
            control={formMethods.control}
            name="executiveFunctioning"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How is your ability to plan and organize tasks?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="excellent" id="executive-excellent" />
                      <label htmlFor="executive-excellent">Excellent</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="good" id="executive-good" />
                      <label htmlFor="executive-good">Good</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fair" id="executive-fair" />
                      <label htmlFor="executive-fair">Fair</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="poor" id="executive-poor" />
                      <label htmlFor="executive-poor">Poor</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="languageProblems"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Are you experiencing language or communication difficulties?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="language-no" />
                      <label htmlFor="language-no">No</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="word_finding" id="language-word" />
                      <label htmlFor="language-word">Word finding difficulties</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="reading" id="language-reading" />
                      <label htmlFor="language-reading">Reading difficulties</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="multiple" id="language-multiple" />
                      <label htmlFor="language-multiple">Multiple language issues</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="visualProcessing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Are you experiencing visual processing difficulties?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="visual-no" />
                      <label htmlFor="visual-no">No</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tracking" id="visual-tracking" />
                      <label htmlFor="visual-tracking">Visual tracking problems</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="depth" id="visual-depth" />
                      <label htmlFor="visual-depth">Depth perception issues</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="spatial" id="visual-spatial" />
                      <label htmlFor="visual-spatial">Spatial processing difficulties</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-4">
          <FormField
            control={formMethods.control}
            name="workPerformance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How have these symptoms affected your work performance?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no_impact" id="work-none" />
                      <label htmlFor="work-none">No impact</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mild_impact" id="work-mild" />
                      <label htmlFor="work-mild">Mild impact</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate_impact" id="work-moderate" />
                      <label htmlFor="work-moderate">Moderate impact</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="severe_impact" id="work-severe" />
                      <label htmlFor="work-severe">Severe impact - unable to work</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="academicPerformance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How have these symptoms affected your academic performance?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not_applicable" id="academic-na" />
                      <label htmlFor="academic-na">Not applicable</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no_impact" id="academic-none" />
                      <label htmlFor="academic-none">No impact</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mild_impact" id="academic-mild" />
                      <label htmlFor="academic-mild">Mild impact</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate_impact" id="academic-moderate" />
                      <label htmlFor="academic-moderate">Moderate impact</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="severe_impact" id="academic-severe" />
                      <label htmlFor="academic-severe">Severe impact - unable to attend</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="cognitiveStrategies"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What strategies have you tried to help with cognitive symptoms?</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="e.g., taking breaks, using lists, avoiding multitasking..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );

  const renderReturnToPlay = () => (
    <div className="space-y-6">
      {currentStep === 0 && (
        <div className="space-y-4">
          <FormField
            control={formMethods.control}
            name="symptomFreeAtRest"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Are you symptom-free at rest?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="rest-yes" />
                      <label htmlFor="rest-yes">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="rest-no" />
                      <label htmlFor="rest-no">No</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="currentActivityLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is your current activity level?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="complete_rest" id="activity-rest" />
                      <label htmlFor="activity-rest">Complete rest</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light_activity" id="activity-light" />
                      <label htmlFor="activity-light">Light daily activities</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="moderate_activity" id="activity-moderate" />
                      <label htmlFor="activity-moderate">Moderate activity</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="full_activity" id="activity-full" />
                      <label htmlFor="activity-full">Full activity without contact</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {currentStep === 1 && (
        <div className="space-y-4">
          <FormField
            control={formMethods.control}
            name="lightExerciseTolerance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Can you tolerate light aerobic exercise (walking, stationary bike)?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes_no_symptoms" id="light-yes" />
                      <label htmlFor="light-yes">Yes, no symptoms</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes_mild_symptoms" id="light-mild" />
                      <label htmlFor="light-mild">Yes, mild symptoms</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="light-no" />
                      <label htmlFor="light-no">No, symptoms worsen</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="moderateExerciseTolerance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Can you tolerate moderate exercise (running, sport-specific drills)?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes_no_symptoms" id="moderate-yes" />
                      <label htmlFor="moderate-yes">Yes, no symptoms</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes_mild_symptoms" id="moderate-mild" />
                      <label htmlFor="moderate-mild">Yes, mild symptoms</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="moderate-no" />
                      <label htmlFor="moderate-no">No, symptoms worsen</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not_attempted" id="moderate-na" />
                      <label htmlFor="moderate-na">Not yet attempted</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="heavyExerciseTolerance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Can you tolerate heavy exercise (full training)?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes_no_symptoms" id="heavy-yes" />
                      <label htmlFor="heavy-yes">Yes, no symptoms</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes_mild_symptoms" id="heavy-mild" />
                      <label htmlFor="heavy-mild">Yes, mild symptoms</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="heavy-no" />
                      <label htmlFor="heavy-no">No, symptoms worsen</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not_attempted" id="heavy-na" />
                      <label htmlFor="heavy-na">Not yet attempted</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-4">
          <FormField
            control={formMethods.control}
            name="physicianClearance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Have you received physician clearance for return to play?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="physician-yes" />
                      <label htmlFor="physician-yes">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="physician-no" />
                      <label htmlFor="physician-no">No</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pending" id="physician-pending" />
                      <label htmlFor="physician-pending">Pending evaluation</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="neuropsychClearance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Have you received neuropsychological clearance if required?</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} value={field.value}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="neuropsych-yes" />
                      <label htmlFor="neuropsych-yes">Yes</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="neuropsych-no" />
                      <label htmlFor="neuropsych-no">No</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="not_required" id="neuropsych-na" />
                      <label htmlFor="neuropsych-na">Not required</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pending" id="neuropsych-pending" />
                      <label htmlFor="neuropsych-pending">Pending evaluation</label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={formMethods.control}
            name="returnToPlayConcerns"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Do you have any concerns about returning to play?</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Please describe any concerns you have about returning to your sport or physical activities..." />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );

  const renderFormContent = () => {
    switch (form.formType) {
      case "concussion_baseline":
        return renderBaselineAssessment();
      case "symptom_tracking":
        return renderSymptomTracking();
      case "cognitive_evaluation":
        return renderCognitiveAssessment();
      case "return_to_play":
        return renderReturnToPlay();
      default:
        return (
          <div className="space-y-4">
            <p className="text-gray-600">
              This assessment form is not yet available. Please contact your healthcare provider.
            </p>
          </div>
        );
    }
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
                  {step}
                </div>
              ))}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Form {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)} className="space-y-6">
              {renderFormContent()}
              
              <div className="flex justify-between pt-6">
                {currentStep > 0 && config.steps.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Previous
                  </Button>
                )}
                
                <div className="ml-auto">
                  {currentStep < config.steps.length - 1 && config.steps.length > 1 ? (
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button type="submit" disabled={completeMutation.isPending}>
                      {completeMutation.isPending ? "Submitting..." : "Complete Assessment"}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}