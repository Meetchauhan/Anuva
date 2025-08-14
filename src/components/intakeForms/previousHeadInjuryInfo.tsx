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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { previousHeadInjuryInfoForm } from "@/features/intakeFormSlice/previousHeadInjuryInfoSlice"

// Zod schema for previous head injury validation
const previousHeadInjurySchema = z.object({
  // patientID: z.string().min(1, "Patient ID is required"),
  hasPreviousInjuries: z.boolean(),
  totalNumberOfInjuries: z.number().min(0).max(50).optional(),
}).refine((data) => {
  // If has previous injuries is true, total number of injuries should be provided
  if (data.hasPreviousInjuries && (data.totalNumberOfInjuries === undefined || data.totalNumberOfInjuries === 0)) {
    return false;
  }
  return true;
}, {
  message: "Please specify the total number of previous injuries",
  path: ["totalNumberOfInjuries"]
});

type PreviousHeadInjuryFormData = z.infer<typeof previousHeadInjurySchema>

const PreviousHeadInjuryInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userAuth = useUserAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PreviousHeadInjuryFormData>({
    resolver: zodResolver(previousHeadInjurySchema),
    defaultValues: {
      // patientID: (userAuth as any)?.user?.patientId || '',
      hasPreviousInjuries: false,
      totalNumberOfInjuries: 0,
    },
  })

  const onSubmit = async (data: PreviousHeadInjuryFormData) => {
    setIsSubmitting(true);
    
    try {
        const response = await dispatch(previousHeadInjuryInfoForm(data)).unwrap();
                 
      toast({
        title: "Previous head injury information submitted successfully",
        description: response.message || "Your previous head injury information has been submitted successfully",
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

  const renderInjuryCountSlider = () => (
    <FormField
      control={form.control}
      name="totalNumberOfInjuries"
      render={({ field }) => (
        <FormItem className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel className="text-base font-medium">Total Number of Previous Injuries</FormLabel>
            <span className="text-sm font-medium text-gray-600">
              {field.value || 0}
            </span>
          </div>
          <FormControl>
            {isSubmitting ? (
              <Skeleton className="h-6 w-full" />
            ) : (
              <Slider
                value={[Number(field.value) || 0]}
                onValueChange={(value) => field.onChange(value[0])}
                max={20}
                min={0}
                step={1}
                className="w-full"
              />
            )}
          </FormControl>
          <FormDescription className="text-sm text-gray-500">
            Slide to indicate the total number of previous head injuries you have experienced
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Previous Head Injury Information</CardTitle>
          <CardDescription className="text-center">
            Please provide information about any previous head injuries you may have experienced.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              

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

              <Separator />

              {/* Previous Injury Assessment */}
              <div className="space-y-6">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-56" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">Previous Head Injury Assessment</h3>
                )}
                
                <FormField
                  control={form.control}
                  name="hasPreviousInjuries"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-6 bg-gray-50">
                      {isSubmitting ? (
                        <div className="flex flex-row items-center justify-between w-full">
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-4 w-64" />
                          </div>
                          <Skeleton className="h-6 w-11" />
                        </div>
                      ) : (
                        <>
                          <div className="space-y-1">
                            <FormLabel className="text-base font-medium">Have you experienced previous head injuries?</FormLabel>
                            <FormDescription className="text-sm">
                              This includes any head injuries, concussions, or traumatic brain injuries in the past
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </>
                      )}
                    </FormItem>
                  )}
                />

                {/* Conditional Fields - Only show if hasPreviousInjuries is true */}
                {form.watch("hasPreviousInjuries") && (
                  <div className="space-y-6 pl-6 border-l-2 border-gray-200">
                    {isSubmitting ? (
                      <div className="space-y-4">
                        <Skeleton className="h-6 w-64" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4">
                          <h4 className="text-md font-medium text-gray-700">Please provide additional details:</h4>
                          {renderInjuryCountSlider()}
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h5 className="text-sm font-medium text-blue-800 mb-2">Important Note:</h5>
                          <p className="text-sm text-blue-700">
                            Previous head injuries can impact your current condition and treatment plan. 
                            Please be as accurate as possible when reporting the number of previous injuries.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* No Previous Injuries Message */}
                {!form.watch("hasPreviousInjuries") && !isSubmitting && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-green-800 mb-2">No Previous Injuries</h5>
                    <p className="text-sm text-green-700">
                      You have indicated that you have not experienced any previous head injuries. 
                      This information will be recorded in your medical history.
                    </p>
                  </div>
                )}
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
                    "Submit Previous Injury Information"
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

export default PreviousHeadInjuryInfo
