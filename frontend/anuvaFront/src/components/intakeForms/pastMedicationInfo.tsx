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
import { pastMedicationsInfoForm } from "@/features/intakeFormSlice/pastMedicationsInfoSlice"

// Zod schema for past medication validation
const pastMedicationSchema = z.object({
  medicineName: z.string().min(1, "Medicine name is required").max(100, "Medicine name must be less than 100 characters"),
  reasonForTaking: z.string().min(1, "Reason for taking medication is required").max(1000, "Reason must be less than 1000 characters"),
  dosage: z.string().min(1, "Dosage is required").max(50, "Dosage must be less than 50 characters"),
  amount: z.string().min(1, "Amount/frequency is required").max(50, "Amount must be less than 50 characters"),
})

type PastMedicationFormData = z.infer<typeof pastMedicationSchema>

const PastMedicationInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userAuth = useUserAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PastMedicationFormData>({
    resolver: zodResolver(pastMedicationSchema),
    defaultValues: {
      medicineName: "",
      reasonForTaking: "",
      dosage: "",
      amount: "",
    },
  })

  const onSubmit = async (data: PastMedicationFormData) => {
    setIsSubmitting(true);
    
    try {
   const response = await dispatch(pastMedicationsInfoForm(data)).unwrap();
      
      toast({
        title: "Past medication submitted successfully",
        description: response.message || "Your past medication information has been submitted successfully",
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
          <CardTitle className="text-2xl font-bold text-center">Past Medication Information</CardTitle>
          <CardDescription className="text-center">
            Please provide information about medications you have taken in the past, even if you are no longer taking them.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              <Separator />

              {/* Past Medication Details */}
              <div className="space-y-6">
               
                  <h3 className="text-lg font-semibold border-b pb-2">Past Medication Details</h3>

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
                        Enter the name of the medication you previously took
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
                          The strength or amount per dose you were prescribed
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
                          How often you were instructed to take the medication
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
                            placeholder="Please describe why you were prescribed this medication, what condition it was treating, and any relevant medical context..."
                            className="resize-none min-h-[100px]"
                            {...field} 
                          />
                        )}
                      </FormControl>
                      <FormDescription>
                        Explain the medical reason why you were prescribed this medication
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
                    Your past medication history helps healthcare providers understand your complete medical background and identify potential patterns or recurring issues. 
                    This information is crucial for making informed treatment decisions.
                  </p>
                </div>
              

              {/* Additional Notes Box */}
              
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-yellow-800 mb-2">Note:</h5>
                  <p className="text-sm text-yellow-700">
                    If you have taken multiple medications in the past, please submit a separate form for each medication. 
                    Include both prescription and over-the-counter medications that you have used regularly.
                  </p>
                </div>
              

              {/* Medical History Box */}
              
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-green-800 mb-2">Medical History:</h5>
                  <p className="text-sm text-green-700">
                    Include medications you stopped taking due to side effects, ineffectiveness, or completion of treatment. 
                    This helps identify what treatments have been tried and their outcomes.
                  </p>
                </div>
              

              {/* Timeline Box */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-purple-800 mb-2">Timeline Information:</h5>
                  <p className="text-sm text-purple-700">
                    If you remember the approximate time period when you took this medication, please include that information in the reason field. 
                    This helps create a timeline of your medical treatment history.
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
                    "Submit Past Medication Information"
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

export default PastMedicationInfo
