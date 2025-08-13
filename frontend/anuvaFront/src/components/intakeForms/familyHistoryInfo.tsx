"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { toast } from "@/hooks/use-toast"
import { navigate } from "wouter/use-browser-location"
import useUserAuth from "@/hooks/useUserAuth"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { familyHistoryInfoForm } from "@/features/intakeFormSlice/familyHistoryInfoSlice"

// Zod schema for family history validation
const familyHistorySchema = z.object({
  relation: z.enum(["Father", "Mother", "Brother", "Sister", "Grandfather", "Grandmother", "Uncle", "Aunt", "Cousin", "Other"], {
    required_error: "Please select a family relation",
  }),
  dementia: z.boolean().default(false),
  stroke: z.boolean().default(false),
  seizure: z.boolean().default(false),
  highBloodPressure: z.boolean().default(false),
  migraine: z.boolean().default(false),
  headTrauma: z.boolean().default(false),
  diabetes: z.boolean().default(false),
  parkinsonsDisease: z.boolean().default(false),
  learningDisabilities: z.boolean().default(false),
  substanceAbuse: z.boolean().default(false),
  otherConditions: z.string().max(1000, "Other conditions must be less than 1000 characters").optional(),
})

type FamilyHistoryFormData = z.infer<typeof familyHistorySchema>

const FamilyHistoryInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userAuth = useUserAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FamilyHistoryFormData>({
    resolver: zodResolver(familyHistorySchema),
    defaultValues: {
      relation: undefined,
      dementia: false,
      stroke: false,
      seizure: false,
      highBloodPressure: false,
      migraine: false,
      headTrauma: false,
      diabetes: false,
      parkinsonsDisease: false,
      learningDisabilities: false,
      substanceAbuse: false,
      otherConditions: "",
    },
  })

  const onSubmit = async (data: FamilyHistoryFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await dispatch(familyHistoryInfoForm(data)).unwrap();
      
      toast({
        title: "Family history submitted successfully",
        description: response.message || "Your family history information has been submitted successfully",
      })
      
      navigate("/home")
      form.reset()
      
    } catch (error) {
      toast({
        title: "Failed to submit",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false);
    }
  }

  const renderConditionField = (name: "dementia" | "stroke" | "seizure" | "highBloodPressure" | "migraine" | "headTrauma" | "diabetes" | "parkinsonsDisease" | "learningDisabilities" | "substanceAbuse", label: string, description: string) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">
              {label}
            </FormLabel>
            <FormDescription>
              {description}
            </FormDescription>
          </div>
          <FormControl>
            {isSubmitting ? (
              <Skeleton className="h-6 w-11" />
            ) : (
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          </FormControl>
        </FormItem>
      )}
    />
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Family History Information</CardTitle>
          <CardDescription className="text-center">
            Please provide information about your family's medical history. This helps healthcare providers understand genetic risk factors and make informed treatment decisions.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             

              {/* Family Relation */}
              <div className="space-y-4">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-48" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">Family Member</h3>
                )}

                <FormField
                  control={form.control}
                  name="relation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Family Relation *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          {isSubmitting ? (
                            <Skeleton className="h-10 w-full" />
                          ) : (
                            <SelectTrigger className="bg-white text-black border-gray-300">
                              <SelectValue placeholder="Select family member" />
                            </SelectTrigger>
                          )}
                        </FormControl>
                        <SelectContent className="bg-white text-black border-gray-300">
                          <SelectItem className="text-black bg-white" value="Father">Father</SelectItem>
                          <SelectItem className="text-black bg-white" value="Mother">Mother</SelectItem>
                          <SelectItem className="text-black bg-white" value="Brother">Brother</SelectItem>
                          <SelectItem className="text-black bg-white" value="Sister">Sister</SelectItem>
                          <SelectItem className="text-black bg-white" value="Grandfather">Grandfather</SelectItem>
                          <SelectItem className="text-black bg-white" value="Grandmother">Grandmother</SelectItem>
                          <SelectItem className="text-black bg-white" value="Uncle">Uncle</SelectItem>
                          <SelectItem className="text-black bg-white" value="Aunt">Aunt</SelectItem>
                          <SelectItem className="text-black bg-white" value="Cousin">Cousin</SelectItem>
                          <SelectItem className="text-black bg-white" value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select which parent's medical history you are providing
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Medical Conditions */}
              <div className="space-y-4">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-64" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">Medical Conditions</h3>
                )}

                <div className="space-y-4">
                  {renderConditionField(
                    "dementia",
                    "Dementia",
                    "Alzheimer's disease or other forms of dementia"
                  )}
                  
                  {renderConditionField(
                    "stroke",
                    "Stroke",
                    "History of stroke or cerebrovascular accident"
                  )}
                  
                  {renderConditionField(
                    "seizure",
                    "Seizure Disorder",
                    "Epilepsy or other seizure disorders"
                  )}
                  
                  {renderConditionField(
                    "highBloodPressure",
                    "High Blood Pressure",
                    "Hypertension or high blood pressure"
                  )}
                  
                  {renderConditionField(
                    "migraine",
                    "Migraine",
                    "Chronic migraines or severe headaches"
                  )}
                  
                  {renderConditionField(
                    "headTrauma",
                    "Head Trauma",
                    "Significant head injuries or brain trauma"
                  )}
                  
                  {renderConditionField(
                    "diabetes",
                    "Diabetes",
                    "Type 1 or Type 2 diabetes"
                  )}
                  
                  {renderConditionField(
                    "parkinsonsDisease",
                    "Parkinson's Disease",
                    "Parkinson's disease or movement disorders"
                  )}
                  
                  {renderConditionField(
                    "learningDisabilities",
                    "Learning Disabilities",
                    "Dyslexia, ADHD, or other learning disorders"
                  )}
                  
                  {renderConditionField(
                    "substanceAbuse",
                    "Substance Abuse",
                    "Alcohol or drug addiction issues"
                  )}
                </div>
              </div>

              {/* Other Conditions */}
              <div className="space-y-4">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-56" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">Other Conditions</h3>
                )}

                <FormField
                  control={form.control}
                  name="otherConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Family Health Conditions</FormLabel>
                      <FormControl>
                        {isSubmitting ? (
                          <Skeleton className="h-20 w-full" />
                        ) : (
                          <Textarea 
                            placeholder="Please list any other significant medical conditions, mental health conditions, or health issues that run in your family. Include conditions like: heart disease, cancer, mental illness, autoimmune disorders, etc."
                            className="resize-none min-h-[100px]"
                            {...field} 
                          />
                        )}
                      </FormControl>
                      <FormDescription>
                        Include any other important medical conditions that affect your family
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Information Boxes */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-blue-800 mb-2">Genetic Risk Factors:</h5>
                  <p className="text-sm text-blue-700">
                    Family medical history helps identify genetic risk factors and potential health conditions you may be predisposed to. 
                    This information is crucial for preventive care and early detection.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-yellow-800 mb-2">Note:</h5>
                  <p className="text-sm text-yellow-700">
                    If you have information about both parents, please submit separate forms for each parent. 
                    Include conditions that affected grandparents, siblings, or other close relatives if relevant.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-green-800 mb-2">Preventive Care:</h5>
                  <p className="text-sm text-green-700">
                    Knowing your family history helps healthcare providers recommend appropriate screenings, 
                    lifestyle changes, and preventive measures to reduce your risk of developing certain conditions.
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-purple-800 mb-2">Mental Health:</h5>
                  <p className="text-sm text-purple-700">
                    Don't forget to include mental health conditions like depression, anxiety, bipolar disorder, 
                    schizophrenia, or other psychiatric conditions that may run in your family.
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-orange-800 mb-2">Age of Onset:</h5>
                  <p className="text-sm text-orange-700">
                    If you know the age when family members developed certain conditions, 
                    please include that information in the "Other Conditions" field. Early onset of conditions 
                    can indicate higher genetic risk.
                  </p>
                </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isSubmitting}>
                  Reset Form
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    "Submit Family History Information"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default FamilyHistoryInfo
