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
import { allergiesInfoForm } from "@/features/intakeFormSlice/allergiesInfoSlice"

// Zod schema for allergies validation
const allergiesSchema = z.object({
  allergen: z.string().min(1, "Allergen is required").max(100, "Allergen must be less than 100 characters"),
  reaction: z.string().min(1, "Reaction description is required").max(1000, "Reaction description must be less than 1000 characters"),
  treatment: z.string().min(1, "Treatment information is required").max(1000, "Treatment information must be less than 1000 characters"),
})

type AllergiesFormData = z.infer<typeof allergiesSchema>

const AllergiesInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userAuth = useUserAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AllergiesFormData>({
    resolver: zodResolver(allergiesSchema),
    defaultValues: {
      allergen: "",
      reaction: "",
      treatment: "",
    },
  })

  const onSubmit = async (data: AllergiesFormData) => {
    setIsSubmitting(true);
    
    try {
     const response = await dispatch(allergiesInfoForm(data)).unwrap();
      
      toast({
        title: "Allergies information submitted successfully",
        description: response.message || "Your allergies information has been submitted successfully",
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

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Allergies Information</CardTitle>
          <CardDescription className="text-center">
            Please provide information about any allergies you have, including substances that cause allergic reactions and how you typically respond.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              

              {/* Allergies Details */}
              <div className="space-y-6">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-48" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">Allergy Details</h3>
                )}

                {/* Allergen */}
                <FormField
                  control={form.control}
                  name="allergen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allergen (Substance Causing Allergy) *</FormLabel>
                      <FormControl>
                        {isSubmitting ? (
                          <Skeleton className="h-10 w-full" />
                        ) : (
                          <Input 
                            placeholder="e.g., Peanuts, Penicillin, Latex, Pollen, Dust mites, etc." 
                            {...field} 
                          />
                        )}
                      </FormControl>
                      <FormDescription>
                        Enter the specific substance or allergen that causes your allergic reaction
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Reaction */}
                <FormField
                  control={form.control}
                  name="reaction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allergic Reaction *</FormLabel>
                      <FormControl>
                        {isSubmitting ? (
                          <Skeleton className="h-20 w-full" />
                        ) : (
                          <Textarea 
                            placeholder="Describe your allergic reaction in detail. Include symptoms like: swelling, hives, rash, difficulty breathing, nausea, vomiting, dizziness, etc. Also mention how quickly the reaction occurs and how severe it typically is."
                            className="resize-none min-h-[100px]"
                            {...field} 
                          />
                        )}
                      </FormControl>
                      <FormDescription>
                        Describe the symptoms and severity of your allergic reaction
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Treatment */}
                <FormField
                  control={form.control}
                  name="treatment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treatment for Allergic Reaction *</FormLabel>
                      <FormControl>
                        {isSubmitting ? (
                          <Skeleton className="h-20 w-full" />
                        ) : (
                          <Textarea 
                            placeholder="Describe how you typically treat this allergic reaction. Include medications (e.g., antihistamines, epinephrine), medical interventions, or avoidance strategies. Also mention if you carry an EpiPen or other emergency medication."
                            className="resize-none min-h-[100px]"
                            {...field} 
                          />
                        )}
                      </FormControl>
                      <FormDescription>
                        Explain how you manage or treat this allergic reaction
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Information Boxes */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-red-800 mb-2">⚠️ Critical Information:</h5>
                  <p className="text-sm text-red-700">
                    Allergies can be life-threatening. Please provide complete and accurate information about your allergic reactions, 
                    including any severe reactions that required emergency medical attention. This information is crucial for your safety.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-blue-800 mb-2">Important Information:</h5>
                  <p className="text-sm text-blue-700">
                    Your allergy information helps healthcare providers avoid prescribing medications or treatments that could cause 
                    allergic reactions. This is essential for your safety during medical procedures and treatments.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-yellow-800 mb-2">Note:</h5>
                  <p className="text-sm text-yellow-700">
                    If you have multiple allergies, please submit a separate form for each allergen. Include both food allergies, 
                    medication allergies, environmental allergies, and any other substances that cause allergic reactions.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-green-800 mb-2">Emergency Preparedness:</h5>
                  <p className="text-sm text-green-700">
                    If you have severe allergies, make sure to mention if you carry emergency medications like an EpiPen, 
                    and describe any specific emergency procedures that should be followed in case of exposure.
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-purple-800 mb-2">Allergy Types to Include:</h5>
                  <p className="text-sm text-purple-700">
                    Food allergies, medication allergies, environmental allergies (pollen, dust, mold), 
                    insect sting allergies, latex allergies, and any other substances that trigger allergic responses.
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
                    "Submit Allergies Information"
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

export default AllergiesInfo
