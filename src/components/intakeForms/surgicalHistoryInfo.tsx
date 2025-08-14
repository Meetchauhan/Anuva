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
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { surgicalHistoryInfoForm } from "@/features/intakeFormSlice/surgicalHistoryInfoSlice"

// Zod schema for surgical history validation
const surgicalHistorySchema = z.object({
//   patientID: z.string().min(1, "Patient ID is required"),
  surgeryDate: z.date({
    required_error: "Date of surgery is required",
  }).refine((date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today to allow today's date
    return date <= today;
  }, {
    message: "Date of surgery cannot be in the future"
  }),
  bodyPart: z.string().min(1, "Body part is required").max(100, "Body part must be less than 100 characters"),
  procedurePerformed: z.string().min(1, "Procedure description is required").max(1000, "Procedure description must be less than 1000 characters"),
})

type SurgicalHistoryFormData = z.infer<typeof surgicalHistorySchema>

const SurgicalHistoryInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userAuth = useUserAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SurgicalHistoryFormData>({
    resolver: zodResolver(surgicalHistorySchema),
    defaultValues: {
    //   patientID: (userAuth as any)?.user?.patientId || '',
      surgeryDate: new Date(),
      bodyPart: "",
      procedurePerformed: "",
    },
  })

  const onSubmit = async (data: SurgicalHistoryFormData) => {
    setIsSubmitting(true);
    
    try {
      console.log("Surgical History Form Data:", data)
      
      // TODO: Replace with actual API call when surgical history slice is created
      // const response = await dispatch(surgicalHistoryForm(data)).unwrap()
      
      // Simulate API call
      const response = await dispatch(surgicalHistoryInfoForm(data)).unwrap();
      
      toast({
        title: "Surgical history submitted successfully",
        description: response.message || "Your surgical history has been submitted successfully",
      })
      
      form.reset()
      navigate("/home")
      
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
          <CardTitle className="text-2xl font-bold text-center">Surgical History Information</CardTitle>
          <CardDescription className="text-center">
            Please provide information about your surgical procedures and medical history.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* {isSubmitting && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-gray-700">Submitting surgical history...</p>
                    <p className="text-sm text-gray-500">Please wait while we save your information</p>
                  </div>
                </div>
              )} */}

              {/* Patient Information */}
              {/* <div className="space-y-4">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-40" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">Patient Information</h3>
                )}
                
                <FormField
                  control={form.control}
                  name="patientID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient ID *</FormLabel>
                      <FormControl>
                        {isSubmitting ? (
                          <Skeleton className="h-10 w-full" />
                        ) : (
                          <Input 
                            type="text" 
                            placeholder="Patient ID" 
                            {...field}
                            value={(userAuth as any)?.user?.patientId || ''}
                            disabled={true}
                            className="bg-gray-100 cursor-not-allowed"
                          />
                        )}
                      </FormControl>
                      <FormDescription>
                        This field is automatically populated from your account
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div> */}

              {/* Surgery Details */}
              <div className="space-y-6">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-44" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">Surgery Details</h3>
                )}

                {/* Surgery Date */}
                <FormField
                  control={form.control}
                  name="surgeryDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Surgery *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            {isSubmitting ? (
                              <Skeleton className="h-10 w-full" />
                            ) : (
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal hover:bg-white hover:text-black",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            )}
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Select the date when the surgery was performed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Body Part */}
                <FormField
                  control={form.control}
                  name="bodyPart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Body Part Operated On *</FormLabel>
                      <FormControl>
                        {isSubmitting ? (
                          <Skeleton className="h-10 w-full" />
                        ) : (
                          <Input 
                            placeholder="e.g., Left knee, Brain, Heart, etc." 
                            {...field} 
                          />
                        )}
                      </FormControl>
                      <FormDescription>
                        Specify which part of the body was operated on
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Procedure Description */}
                <FormField
                  control={form.control}
                  name="procedurePerformed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description of Surgical Procedure *</FormLabel>
                      <FormControl>
                        {isSubmitting ? (
                          <Skeleton className="h-20 w-full" />
                        ) : (
                          <Textarea 
                            placeholder="Please provide a detailed description of the surgical procedure performed, including the type of surgery, any complications, and outcomes..."
                            className="resize-none min-h-[120px]"
                            {...field} 
                          />
                        )}
                      </FormControl>
                      <FormDescription>
                        Provide a comprehensive description of the surgical procedure, including the surgical technique used and any relevant details
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
                    Your surgical history helps healthcare providers understand your medical background and make informed treatment decisions. 
                    Please provide accurate information about all surgical procedures you have undergone.
                  </p>
                </div>
             

              {/* Additional Notes Box */}
             
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-yellow-800 mb-2">Note:</h5>
                  <p className="text-sm text-yellow-700">
                    If you have had multiple surgeries, please submit a separate form for each procedure. 
                    This helps maintain detailed records for each surgical intervention.
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
                    "Submit Surgical History"
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

export default SurgicalHistoryInfo
