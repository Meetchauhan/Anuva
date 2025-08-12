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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { developmentalHistoryInfoForm } from "@/features/intakeFormSlice/developmentalHistoryInfoSlice"

// Zod schema for developmental history validation
const developmentalHistorySchema = z.object({
//   patientID: z.string().min(1, "Patient ID is required"),
  learningDisabilities: z.boolean().default(false),
  learningDisabilitiesDescription: z.string().optional(),
  motorVehicleAccidentHistory: z.boolean().default(false),
  accidentDates: z.string().optional(),
  headTrauma: z.boolean().default(false),
  brainSurgery: z.boolean().default(false),
  residualImpairments: z.boolean().default(false),
  impairmentDescription: z.string().optional(),
})

type DevelopmentalHistoryFormData = z.infer<typeof developmentalHistorySchema>

const DevelopmentalHistoryInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userAuth = useUserAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DevelopmentalHistoryFormData>({
    resolver: zodResolver(developmentalHistorySchema),
    defaultValues: {
    //   patientID: (userAuth as any)?.user?.patientId || '',
      learningDisabilities: false,
      learningDisabilitiesDescription: "",
      motorVehicleAccidentHistory: false,
      accidentDates: "",
      headTrauma: false,
      brainSurgery: false,
      residualImpairments: false,
      impairmentDescription: "",
    },
  })

  const onSubmit = async (data: DevelopmentalHistoryFormData) => {
    setIsSubmitting(true);
    
    try {
      console.log("Developmental History Form Data:", data)
      
      // TODO: Replace with actual API call when developmental history slice is created
      // const response = await dispatch(developmentalHistoryForm(data)).unwrap()
      
      // Simulate API call
      const response = await dispatch(developmentalHistoryInfoForm(data)).unwrap();
      
      toast({
        title: "Developmental history submitted successfully",
        description: "Your developmental history has been submitted successfully",
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
          <CardTitle className="text-2xl font-bold text-center">Developmental History Information</CardTitle>
          <CardDescription className="text-center">
            Please provide information about your developmental history and medical background.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {isSubmitting && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-gray-700">Submitting developmental history...</p>
                    <p className="text-sm text-gray-500">Please wait while we save your information</p>
                  </div>
                </div>
              )}

              {/* Patient Information */}
              <div className="space-y-4">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-40" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">Patient Information</h3>
                )}
                
                {/* <FormField
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
                /> */}
              </div>

              <Separator />

              {/* Learning Disabilities */}
              <div className="space-y-6">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-56" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">Learning Disabilities</h3>
                )}
                
                <FormField
                  control={form.control}
                  name="learningDisabilities"
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
                            <FormLabel className="text-base font-medium">Do you have learning disabilities?</FormLabel>
                            <FormDescription className="text-sm">
                              This includes dyslexia, ADHD, or other learning challenges
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

                {form.watch("learningDisabilities") && (
                  <div className="space-y-4 pl-6 border-l-2 border-gray-200">
                    {isSubmitting ? (
                      <div className="space-y-4">
                        <Skeleton className="h-6 w-64" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    ) : (
                      <FormField
                        control={form.control}
                        name="learningDisabilitiesDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description of Learning Disabilities</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please describe your learning disabilities, when they were diagnosed, and how they affect you..."
                                className="resize-none min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Provide details about your learning disabilities and their impact
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                )}
              </div>

              <Separator />

              {/* Motor Vehicle Accident History */}
              <div className="space-y-6">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-64" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">Motor Vehicle Accident History</h3>
                )}
                
                <FormField
                  control={form.control}
                  name="motorVehicleAccidentHistory"
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
                            <FormLabel className="text-base font-medium">Do you have a history of motor vehicle accidents?</FormLabel>
                            <FormDescription className="text-sm">
                              This includes any car, motorcycle, or other vehicle accidents
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

                {form.watch("motorVehicleAccidentHistory") && (
                  <div className="space-y-4 pl-6 border-l-2 border-gray-200">
                    {isSubmitting ? (
                      <div className="space-y-4">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    ) : (
                      <FormField
                        control={form.control}
                        name="accidentDates"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dates of Accidents</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please list the dates and brief descriptions of your motor vehicle accidents..."
                                className="resize-none min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Include approximate dates and any relevant details about the accidents
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                )}
              </div>

              <Separator />

              {/* Medical History */}
              <div className="space-y-6">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-44" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">Medical History</h3>
                )}
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="headTrauma"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-6 bg-gray-50">
                        {isSubmitting ? (
                          <div className="flex flex-row items-center justify-between w-full">
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-5 w-32" />
                              <Skeleton className="h-4 w-48" />
                            </div>
                            <Skeleton className="h-6 w-11" />
                          </div>
                        ) : (
                          <>
                            <div className="space-y-1">
                              <FormLabel className="text-base font-medium">History of head trauma?</FormLabel>
                              <FormDescription className="text-sm">
                                Any significant head injuries or trauma
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

                  <FormField
                    control={form.control}
                    name="brainSurgery"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-6 bg-gray-50">
                        {isSubmitting ? (
                          <div className="flex flex-row items-center justify-between w-full">
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-5 w-36" />
                              <Skeleton className="h-4 w-52" />
                            </div>
                            <Skeleton className="h-6 w-11" />
                          </div>
                        ) : (
                          <>
                            <div className="space-y-1">
                              <FormLabel className="text-base font-medium">History of brain surgery?</FormLabel>
                              <FormDescription className="text-sm">
                                Any surgical procedures on the brain
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

                  <FormField
                    control={form.control}
                    name="residualImpairments"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-6 bg-gray-50">
                        {isSubmitting ? (
                          <div className="flex flex-row items-center justify-between w-full">
                            <div className="space-y-2 flex-1">
                              <Skeleton className="h-5 w-40" />
                              <Skeleton className="h-4 w-56" />
                            </div>
                            <Skeleton className="h-6 w-11" />
                          </div>
                        ) : (
                          <>
                            <div className="space-y-1">
                              <FormLabel className="text-base font-medium">Do you have residual impairments?</FormLabel>
                              <FormDescription className="text-sm">
                                Any lasting effects from injuries or medical conditions
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
                </div>

                {form.watch("residualImpairments") && (
                  <div className="space-y-4 pl-6 border-l-2 border-gray-200">
                    {isSubmitting ? (
                      <div className="space-y-4">
                        <Skeleton className="h-6 w-56" />
                        <Skeleton className="h-20 w-full" />
                      </div>
                    ) : (
                      <FormField
                        control={form.control}
                        name="impairmentDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description of Impairments</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Please describe your residual impairments, their severity, and how they affect your daily life..."
                                className="resize-none min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Provide detailed information about any lasting impairments
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Information Box */}
              {!isSubmitting && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-blue-800 mb-2">Important Information:</h5>
                  <p className="text-sm text-blue-700">
                    Your developmental history helps healthcare providers understand your medical background and provide appropriate care. 
                    Please provide accurate information about your learning disabilities, accident history, and medical conditions.
                  </p>
                </div>
              )}

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
                    "Submit Developmental History"
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

export default DevelopmentalHistoryInfo
