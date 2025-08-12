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
import { getUser } from "@/features/authSlice"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { symptomChecklistInfoForm } from "@/features/intakeFormSlice/symptomCheckistInfoSlice"

// Zod schema for symptom checklist validation
const symptomChecklistSchema = z.object({
  patientID: z.string().min(1, "Patient ID is required"),
  injuryID: z.string().min(1, "Injury ID is required"),
  headache: z.number().min(0).max(6),
  pressureInHead: z.number().min(0).max(6),
  neckPain: z.number().min(0).max(6),
  troubleFallingAsleep: z.number().min(0).max(6),
  drowsiness: z.number().min(0).max(6),
  nauseaOrVomiting: z.number().min(0).max(6),
  fatigueOrLowEnergy: z.number().min(0).max(6),
  dizziness: z.number().min(0).max(6),
  blurredVision: z.number().min(0).max(6),
  balanceProblems: z.number().min(0).max(6),
  sensitivityToLight: z.number().min(0).max(6),
  sensitivityToNoise: z.number().min(0).max(6),
  feelingSlowedDown: z.number().min(0).max(6),
  feelingInAFog: z.number().min(0).max(6),
  dontFeelRight: z.number().min(0).max(6),
  difficultyConcentrating: z.number().min(0).max(6),
  difficultyRemembering: z.number().min(0).max(6),
  confusion: z.number().min(0).max(6),
  moreEmotional: z.number().min(0).max(6),
  irritability: z.number().min(0).max(6),
  sadnessOrDepression: z.number().min(0).max(6),
  nervousOrAnxious: z.number().min(0).max(6),
  worseWithPhysicalActivity: z.boolean().default(false),
  worseWithMentalActivity: z.boolean().default(false),
})

type SymptomChecklistFormData = z.infer<typeof symptomChecklistSchema>

const SymptomChecklistInfo = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const userAuth = useUserAuth();
  
 

  const form = useForm<SymptomChecklistFormData>({
    resolver: zodResolver(symptomChecklistSchema),
    defaultValues: {
      patientID: (userAuth as any)?.user?.patientId || 0,
      injuryID: (userAuth as any)?.user?.injuryId || 0, // This should be passed as prop or from context
      headache: 0,
      pressureInHead: 0,
      neckPain: 0,
      troubleFallingAsleep: 0,
      drowsiness: 0,
      nauseaOrVomiting: 0,
      fatigueOrLowEnergy: 0,
      dizziness: 0,
      blurredVision: 0,
      balanceProblems: 0,
      sensitivityToLight: 0,
      sensitivityToNoise: 0,
      feelingSlowedDown: 0,
      feelingInAFog: 0,
      dontFeelRight: 0,
      difficultyConcentrating: 0,
      difficultyRemembering: 0,
      confusion: 0,
      moreEmotional: 0,
      irritability: 0,
      sadnessOrDepression: 0,
      nervousOrAnxious: 0,
      worseWithPhysicalActivity: false,
      worseWithMentalActivity: false,
    },
  })

  const onSubmit = async (data: SymptomChecklistFormData) => {
    // Calculate total symptoms and severity score
    // const symptomScores = [
    //   data.headache, data.pressureInHead, data.neckPain, data.troubleFallingAsleep, data.drowsiness,
    //   data.nauseaOrVomiting, data.fatigueOrLowEnergy, data.dizziness, data.blurredVision, data.balanceProblems,
    //   data.sensitivityToLight, data.sensitivityToNoise, data.feelingSlowedDown, data.feelingInAFog, data.dontFeelRight,
    //   data.difficultyConcentrating, data.difficultyRemembering, data.confusion, data.moreEmotional, data.irritability,
    //   data.sadnessOrDepression, data.nervousOrAnxious
    // ]

    setIsSubmitting(true);
    const response = await dispatch(symptomChecklistInfoForm(data)).unwrap()
    console.log("Symptom Checklist Form Response:", response)
    
    // const totalSymptoms = symptomScores.filter(score => score > 0).length
    // const symptomSeverityScore = symptomScores.reduce((total, score) => total + score, 0)

    // const formattedData = {
    //   ...data,
    //   totalSymptoms,
    //   symptomSeverityScore,
    // }
    
    // console.log("Symptom Checklist Form Data:", formattedData)
    
    // TODO: Replace with actual API call when symptom checklist slice is created
    // const response = await dispatch(symptomChecklistForm(formattedData)).unwrap()
    
    // For now, just show success message
    if(response.status) {
      setIsSubmitting(false);
    toast({
      title: "Symptom checklist submitted successfully",
      description: response.message,
    })
    navigate("/home")
    form.reset()
  }else{
    setIsSubmitting(false);
    toast({
      title: "Symptom checklist submission failed",
      description: response.message,
    })
  }
  }

  const renderSymptomSlider = (name: keyof SymptomChecklistFormData, label: string, description?: string) => (
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
          <CardTitle className="text-2xl font-bold text-center">Symptom Checklist</CardTitle>
          <CardDescription className="text-center">
            Please rate the severity of each symptom on a scale of 0-6, where 0 = None and 6 = Severe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Patient Information */}
             
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Patient Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="patientID"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient ID *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Patient ID" 
                            {...field}
                            value={(userAuth as any)?.user?.patientId || ''}
                            disabled={true}
                            className="bg-gray-100 cursor-not-allowed"
                          />
                        </FormControl>
                        <FormDescription>
                          This field is automatically populated from your account
                        </FormDescription>
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
                            // onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            className="bg-gray-100 cursor-not-allowed"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Physical Symptoms */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Physical Symptoms</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderSymptomSlider('headache', 'Headache', 'Pain in the head')}
                  {renderSymptomSlider('pressureInHead', 'Pressure in Head', 'Feeling of pressure or tightness')}
                  {renderSymptomSlider('neckPain', 'Neck Pain', 'Pain or discomfort in the neck')}
                  {renderSymptomSlider('nauseaOrVomiting', 'Nausea or Vomiting', 'Feeling sick to stomach')}
                  {renderSymptomSlider('dizziness', 'Dizziness', 'Feeling lightheaded or unsteady')}
                  {renderSymptomSlider('balanceProblems', 'Balance Problems', 'Difficulty maintaining balance')}
                </div>
              </div>

              {/* Sleep Symptoms */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Sleep Symptoms</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderSymptomSlider('troubleFallingAsleep', 'Trouble Falling Asleep', 'Difficulty getting to sleep')}
                  {renderSymptomSlider('drowsiness', 'Drowsiness', 'Feeling sleepy during the day')}
                </div>
              </div>

              {/* Energy and Fatigue */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Energy and Fatigue</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderSymptomSlider('fatigueOrLowEnergy', 'Fatigue or Low Energy', 'Feeling tired or lacking energy')}
                  {renderSymptomSlider('feelingSlowedDown', 'Feeling Slowed Down', 'Feeling like you are moving in slow motion')}
                </div>
              </div>

              {/* Vision and Sensory */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Vision and Sensory</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderSymptomSlider('blurredVision', 'Blurred Vision', 'Difficulty seeing clearly')}
                  {renderSymptomSlider('sensitivityToLight', 'Sensitivity to Light', 'Eyes hurt in bright light')}
                  {renderSymptomSlider('sensitivityToNoise', 'Sensitivity to Noise', 'Sounds are too loud or bothersome')}
                </div>
              </div>

              {/* Cognitive Symptoms */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Cognitive Symptoms</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderSymptomSlider('feelingInAFog', 'Feeling in a Fog', 'Feeling mentally unclear')}
                  {renderSymptomSlider('dontFeelRight', 'Don\'t Feel Right', 'Feeling that something is not right')}
                  {renderSymptomSlider('difficultyConcentrating', 'Difficulty Concentrating', 'Trouble focusing on tasks')}
                  {renderSymptomSlider('difficultyRemembering', 'Difficulty Remembering', 'Trouble recalling information')}
                  {renderSymptomSlider('confusion', 'Confusion', 'Feeling mentally confused')}
                </div>
              </div>

              {/* Emotional Symptoms */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Emotional Symptoms</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderSymptomSlider('moreEmotional', 'More Emotional', 'Feeling more emotional than usual')}
                  {renderSymptomSlider('irritability', 'Irritability', 'Easily annoyed or angered')}
                  {renderSymptomSlider('sadnessOrDepression', 'Sadness or Depression', 'Feeling sad or depressed')}
                  {renderSymptomSlider('nervousOrAnxious', 'Nervous or Anxious', 'Feeling nervous or worried')}
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
                  Submit Symptom Checklist
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default SymptomChecklistInfo
