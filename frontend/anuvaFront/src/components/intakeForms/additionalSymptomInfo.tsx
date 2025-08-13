"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { toast } from "@/hooks/use-toast"
import { navigate } from "wouter/use-browser-location"
import useUserAuth from "@/hooks/useUserAuth"
// import { getUser } from "@/features/authSlice"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { additionalSymptomChecklistInfoForm } from "@/features/intakeFormSlice/additionalSymptomChecklistInfoSlice"

// Zod schema for additional symptoms validation
const additionalSymptomSchema = z.object({
  // patientID: z.string().min(1, "Patient ID is required"),
  // injuryID: z.string().min(1, "Injury ID is required"),
  painLocation: z.string().max(100, "Pain location must be less than 100 characters").optional(),
  painInOtherParts: z.number().min(0).max(6),
  problemsWithSleeping: z.number().min(0).max(6),
  gaitOrBalanceProblems: z.number().min(0).max(6),
  visionLossOrChange: z.number().min(0).max(6),
  hearingLossOrChange: z.number().min(0).max(6),
  lossOfSmellOrTaste: z.number().min(0).max(6),
  speechChanges: z.number().min(0).max(6),
  weakness: z.number().min(0).max(6),
  tremors: z.number().min(0).max(6),
  bowelOrBladderDisturbances: z.number().min(0).max(6),
  sexualDysfunction: z.number().min(0).max(6),
  difficultyPlanningAndOrganizing: z.number().min(0).max(6),
  difficultyAnticipatingConsequences: z.number().min(0).max(6),
  wordFindingDifficulties: z.number().min(0).max(6),
  difficultyUnderstandingConversations: z.number().min(0).max(6),
  lostInFamiliarEnvironment: z.number().min(0).max(6),
  lossOfAppetite: z.number().min(0).max(6),
  suicidalOrHomicidalThoughts: z.number().min(0).max(6),
  verballyOrPhysicallyAggressive: z.number().min(0).max(6),
  personalityChanges: z.number().min(0).max(6),
  disInhibition: z.number().min(0).max(6),
  avoidanceBehaviors: z.number().min(0).max(6),
  intrusiveDistressingThoughts: z.number().min(0).max(6),
  repetitiveMotorActivity: z.number().min(0).max(6),
  worseWithPhysicalActivity: z.boolean().default(false),
  worseWithMentalActivity: z.boolean().default(false),
})

type AdditionalSymptomFormData = z.infer<typeof additionalSymptomSchema>

const AdditionalSymptomInfo = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const userAuth = useUserAuth();
  


  const form = useForm<AdditionalSymptomFormData>({
    resolver: zodResolver(additionalSymptomSchema),
    defaultValues: {
      // patientID: (userAuth as any)?.user?.patientId || 0,
      // injuryID: (userAuth as any)?.user?.injuryId || 0, 
      painLocation: "",
      painInOtherParts: 0,
      problemsWithSleeping: 0,
      gaitOrBalanceProblems: 0,
      visionLossOrChange: 0,
      hearingLossOrChange: 0,
      lossOfSmellOrTaste: 0,
      speechChanges: 0,
      weakness: 0,
      tremors: 0,
      bowelOrBladderDisturbances: 0,
      sexualDysfunction: 0,
      difficultyPlanningAndOrganizing: 0,
      difficultyAnticipatingConsequences: 0,
      wordFindingDifficulties: 0,
      difficultyUnderstandingConversations: 0,
      lostInFamiliarEnvironment: 0,
      lossOfAppetite: 0,
      suicidalOrHomicidalThoughts: 0,
      verballyOrPhysicallyAggressive: 0,
      personalityChanges: 0,
      disInhibition: 0,
      avoidanceBehaviors: 0,
      intrusiveDistressingThoughts: 0,
      repetitiveMotorActivity: 0,
      worseWithPhysicalActivity: false,
      worseWithMentalActivity: false,
    },
  })

  const onSubmit = async (data: AdditionalSymptomFormData) => {
    // Calculate total symptoms and severity score
    // const symptomScores: number[] = [
    //   data.painInOtherParts, data.problemsWithSleeping, data.gaitOrBalanceProblems,
    //   data.visionLossOrChange, data.hearingLossOrChange, data.lossOfSmellOrTaste,
    //   data.speechChanges, data.weakness, data.tremors, data.bowelOrBladderDisturbances,
    //   data.sexualDysfunction, data.difficultyPlanningAndOrganizing, data.difficultyAnticipatingConsequences,
    //   data.wordFindingDifficulties, data.difficultyUnderstandingConversations, data.lostInFamiliarEnvironment,
    //   data.lossOfAppetite, data.suicidalOrHomicidalThoughts, data.verballyOrPhysicallyAggressive,
    //   data.personalityChanges, data.disInhibition, data.avoidanceBehaviors,
    //   data.intrusiveDistressingThoughts, data.repetitiveMotorActivity
    // ]
    
    // const totalSymptoms = symptomScores.filter(score => score > 0).length
    // const symptomSeverityScore = symptomScores.reduce((total, score) => total + score, 0)

    // const formattedData = {
    //   ...data,
    //   totalSymptoms,
    //   symptomSeverityScore,
    // }
    setIsSubmitting(true);
    const response = await dispatch(additionalSymptomChecklistInfoForm(data)).unwrap()
    if(response.status) {
      setIsSubmitting(false);
      toast({
        title: "Additional symptoms submitted successfully",
        description: response.message,
      })
      navigate("/home")
      form.reset()
    }else{
      setIsSubmitting(false);
      toast({
        title: "Additional symptoms submission failed",
        description: response.message,
      })
    }
    
  }

  const renderSymptomSlider = (name: keyof AdditionalSymptomFormData, label: string, description?: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel className="text-base font-medium">{label}</FormLabel>
            <span className="text-sm font-medium text-gray-600">
              {field.value}/6
            </span>
          </div>
          <FormControl>
            <Slider
              value={[Number(field.value) || 0]}
              onValueChange={(value) => field.onChange(value[0])}
              max={6}
              min={0}
              step={1}
              className="w-full"
            />
          </FormControl>
          {description && (
            <FormDescription className="text-sm text-gray-500">
              {description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )

  return (
    <div className="container mx-auto py-8 px-4">
    
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Additional Symptoms Assessment</CardTitle>
          <CardDescription className="text-center">
            Please rate the severity of each additional symptom on a scale of 0-6, where 0 = None and 6 = Severe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Patient Information */}
              
              {/* <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Patient Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="injuryID"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Injury ID *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter injury ID" 
                            {...field}
                            value={(userAuth as any)?.user?.injuryId || ''}
                            disabled={true}
                            // onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className="bg-gray-100 cursor-not-allowed"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="injuryID"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Injury ID *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Enter injury ID" 
                            {...field}
                            value={(userAuth as any)?.user?.injuryId || ''}
                            disabled={true}
                            className="bg-gray-100 cursor-not-allowed"
                            // onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div> */}

              {/* General Somatic Symptoms */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">General Somatic Symptoms</h3>
                
                <FormField
                  control={form.control}
                  name="painLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location of Other Pain</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the location of any other pain you are experiencing..."
                          className="resize-none min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Please specify the location of any pain not covered in the main symptom checklist
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderSymptomSlider('painInOtherParts', 'Pain in Other Parts', 'Pain in areas not previously mentioned')}
                  {renderSymptomSlider('problemsWithSleeping', 'Problems with Sleeping', 'Difficulty sleeping or sleep disturbances')}
                </div>
              </div>

              {/* Primary Neurological Symptoms */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Primary Neurological Symptoms</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderSymptomSlider('gaitOrBalanceProblems', 'Gait or Balance Problems', 'Difficulty walking or maintaining balance')}
                  {renderSymptomSlider('visionLossOrChange', 'Vision Loss or Change', 'Changes in vision or visual disturbances')}
                  {renderSymptomSlider('hearingLossOrChange', 'Hearing Loss or Change', 'Changes in hearing or auditory disturbances')}
                  {renderSymptomSlider('lossOfSmellOrTaste', 'Loss of Smell or Taste', 'Changes in sense of smell or taste')}
                  {renderSymptomSlider('speechChanges', 'Speech Changes', 'Difficulty speaking or changes in speech')}
                  {renderSymptomSlider('weakness', 'Weakness', 'Muscle weakness or loss of strength')}
                  {renderSymptomSlider('tremors', 'Tremors', 'Involuntary shaking or trembling')}
                  {renderSymptomSlider('bowelOrBladderDisturbances', 'Bowel or Bladder Disturbances', 'Changes in bowel or bladder function')}
                  {renderSymptomSlider('sexualDysfunction', 'Sexual Dysfunction', 'Changes in sexual function or desire')}
                </div>
              </div>

              {/* Cognitive and Executive Function */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Cognitive and Executive Function</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderSymptomSlider('difficultyPlanningAndOrganizing', 'Difficulty Planning and Organizing', 'Trouble with planning tasks or organizing activities')}
                  {renderSymptomSlider('difficultyAnticipatingConsequences', 'Difficulty Anticipating Consequences', 'Trouble understanding the results of actions')}
                  {renderSymptomSlider('wordFindingDifficulties', 'Word Finding Difficulties', 'Trouble finding the right words to say')}
                  {renderSymptomSlider('difficultyUnderstandingConversations', 'Difficulty Understanding Conversations', 'Trouble following conversations or understanding speech')}
                  {renderSymptomSlider('lostInFamiliarEnvironment', 'Lost in Familiar Environment', 'Getting lost in places you know well')}
                </div>
              </div>

              {/* Behavioral and Psychological Symptoms */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Behavioral and Psychological Symptoms</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderSymptomSlider('lossOfAppetite', 'Loss of Appetite', 'Decreased desire to eat')}
                  {renderSymptomSlider('suicidalOrHomicidalThoughts', 'Suicidal or Homicidal Thoughts', 'Thoughts of harming self or others')}
                  {renderSymptomSlider('verballyOrPhysicallyAggressive', 'Verbally or Physically Aggressive', 'Aggressive behavior toward others')}
                  {renderSymptomSlider('personalityChanges', 'Personality Changes', 'Changes in personality or behavior')}
                  {renderSymptomSlider('disInhibition', 'Disinhibition', 'Loss of social inhibitions or impulse control')}
                  {renderSymptomSlider('avoidanceBehaviors', 'Avoidance Behaviors', 'Avoiding certain situations or activities')}
                  {renderSymptomSlider('intrusiveDistressingThoughts', 'Intrusive Distressing Thoughts', 'Unwanted, distressing thoughts')}
                  {renderSymptomSlider('repetitiveMotorActivity', 'Repetitive Motor Activity', 'Repetitive movements or behaviors')}
                </div>
              </div>

              {/* Activity Impact */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Activity Impact</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="worseWithPhysicalActivity"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Symptoms Worse with Physical Activity</FormLabel>
                          <FormDescription>
                            Do your symptoms get worse when you exercise or do physical activities?
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="worseWithMentalActivity"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Symptoms Worse with Mental Activity</FormLabel>
                          <FormDescription>
                            Do your symptoms get worse when you read, study, or do mental work?
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Reset Form
                </Button>
                <Button type="submit">
                  Submit Additional Symptoms
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdditionalSymptomInfo
