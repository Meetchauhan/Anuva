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
import { currentMedicationInfoForm } from "@/features/intakeFormSlice/currentMedicationsInfoSlice"

// Zod schema for current medication validation
const currentMedicationSchema = z.object({
  medicineName: z.string().min(1, "Medicine name is required").max(100, "Medicine name must be less than 100 characters"),
  reasonForTaking: z.string().min(1, "Reason for taking medication is required").max(1000, "Reason must be less than 1000 characters"),
  dosage: z.string().min(1, "Dosage is required").max(50, "Dosage must be less than 50 characters"),
  amount: z.string().min(1, "Amount/frequency is required").max(50, "Amount must be less than 50 characters"),
})

type CurrentMedicationFormData = z.infer<typeof currentMedicationSchema>

const CurrentMedicationInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userAuth = useUserAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CurrentMedicationFormData>({
    resolver: zodResolver(currentMedicationSchema),
    defaultValues: {
      medicineName: "",
      reasonForTaking: "",
      dosage: "",
      amount: "",
    },
  })

  const onSubmit = async (data: CurrentMedicationFormData) => {
    setIsSubmitting(true);
    
    try {
     const response = await dispatch(currentMedicationInfoForm(data)).unwrap();
      
      toast({
        title: "Current medication submitted successfully",
        description: response.message || "Your current medication information has been submitted successfully",
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
          <CardTitle className="text-2xl font-bold text-center">Current Medication Information</CardTitle>
          <CardDescription className="text-center">
            Please provide information about your current medications and prescriptions.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             

           
              <Separator />

              {/* Medication Details */}
              <div className="space-y-6">
               
                  <h3 className="text-lg font-semibold border-b pb-2">Medication Details</h3>

                {/* Medicine Name */}
                <FormField
                  control={form.control}
                  name="medicineName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medicine Name *</FormLabel>
                      <FormControl>
                        {isSubmitting ? (
                          <Skeleton className="h-10 w-full" />
                        ) : (
                          <Input 
                            placeholder="e.g., Aspirin, Ibuprofen, Lisinopril, etc." 
                            {...field} 
                          />
                        )}
                      </FormControl>
                      <FormDescription>
                        Enter the name of the medication as prescribed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Dosage and Amount in a row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dosage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dosage *</FormLabel>
                        <FormControl>
                          {isSubmitting ? (
                            <Skeleton className="h-10 w-full" />
                          ) : (
                            <Input 
                              placeholder="e.g., 500mg, 10mg, 1 tablet" 
                              {...field} 
                            />
                          )}
                        </FormControl>
                        <FormDescription>
                          The strength or amount per dose
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency/Quantity *</FormLabel>
                        <FormControl>
                          {isSubmitting ? (
                            <Skeleton className="h-10 w-full" />
                          ) : (
                            <Input 
                              placeholder="e.g., Twice daily, 3 times a day, As needed" 
                              {...field} 
                            />
                          )}
                        </FormControl>
                        <FormDescription>
                          How often you take the medication
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Reason for Taking */}
                <FormField
                  control={form.control}
                  name="reasonForTaking"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Taking Medication *</FormLabel>
                      <FormControl>
                        {isSubmitting ? (
                          <Skeleton className="h-20 w-full" />
                        ) : (
                          <Textarea 
                            placeholder="Please describe why you are taking this medication, what condition it treats, and any relevant medical context..."
                            className="resize-none min-h-[100px]"
                            {...field} 
                          />
                        )}
                      </FormControl>
                      <FormDescription>
                        Explain the medical reason for taking this medication
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Information Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-blue-800 mb-2">Important Information:</h5>
                  <p className="text-sm text-blue-700">
                    Your current medication information helps healthcare providers understand your treatment plan and avoid potential drug interactions. 
                    Please provide accurate information about all medications you are currently taking.
                  </p>
                </div>

              {/* Additional Notes Box */}
             
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-yellow-800 mb-2">Note:</h5>
                  <p className="text-sm text-yellow-700">
                    If you are taking multiple medications, please submit a separate form for each medication. 
                    This helps maintain detailed records for each prescription and ensures accurate medication management.
                  </p>
                </div>

              {/* Medication Safety Box */}
             
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-green-800 mb-2">Medication Safety:</h5>
                  <p className="text-sm text-green-700">
                    Always inform your healthcare provider about all medications you are taking, including over-the-counter drugs, 
                    vitamins, and herbal supplements. This helps prevent potential drug interactions and ensures safe treatment.
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
                    "Submit Medication Information"
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

export default CurrentMedicationInfo
