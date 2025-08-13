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
import { previousTestInfoForm } from "@/features/intakeFormSlice/previousTestInfoSlice"

// Zod schema for previous test validation
const previousTestSchema = z.object({
  neurologicalImaging: z.boolean().default(false),
  neurologicalImagingDates: z.string().max(1000, "Imaging dates must be less than 1000 characters").optional(),
  impactTesting: z.boolean().default(false),
  impactTestingDates: z.string().max(1000, "ImPACT testing dates must be less than 1000 characters").optional(),
  neuropsychologicalTesting: z.boolean().default(false),
  neuropsychologicalTestingDates: z.string().max(1000, "Neuropsychological testing dates must be less than 1000 characters").optional(),
  eeg: z.boolean().default(false),
  eegDates: z.string().max(1000, "EEG dates must be less than 1000 characters").optional(),
  bloodWork: z.boolean().default(false),
  bloodWorkDates: z.string().max(1000, "Blood work dates must be less than 1000 characters").optional(),
})

type PreviousTestFormData = z.infer<typeof previousTestSchema>

const PreviousTestInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userAuth = useUserAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PreviousTestFormData>({
    resolver: zodResolver(previousTestSchema),
    defaultValues: {
      neurologicalImaging: false,
      neurologicalImagingDates: "",
      impactTesting: false,
      impactTestingDates: "",
      neuropsychologicalTesting: false,
      neuropsychologicalTestingDates: "",
      eeg: false,
      eegDates: "",
      bloodWork: false,
      bloodWorkDates: "",
    },
  })

  const onSubmit = async (data: PreviousTestFormData) => {
    setIsSubmitting(true);
    
    try {
     const response = await dispatch(previousTestInfoForm(data)).unwrap();
      
      toast({
        title: "Previous test information submitted successfully",
        description: response.message || "Your previous test information has been submitted successfully",
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

  const renderTestSection = (testName: "neurologicalImaging" | "impactTesting" | "neuropsychologicalTesting" | "eeg" | "bloodWork", 
                           testLabel: string, 
                           datesField: "neurologicalImagingDates" | "impactTestingDates" | "neuropsychologicalTestingDates" | "eegDates" | "bloodWorkDates",
                           description: string) => {
    if (!form.watch(testName)) {
      return null;
    }

    return (
      <div className="space-y-6 pl-6 border-l-2 border-gray-200">
        {isSubmitting ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700">Please provide {testLabel.toLowerCase()} details:</h4>
              
              <FormField
                control={form.control}
                name={datesField}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dates of {testLabel}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={`Please provide the dates when you had ${testLabel.toLowerCase()}. Include specific dates, approximate time periods, or any relevant details about when these tests were performed.`}
                        className="resize-none min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      {description}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Previous Test Information</CardTitle>
          <CardDescription className="text-center">
            Please provide information about any previous medical tests you have had. This helps healthcare providers understand your complete medical history and avoid unnecessary repeat testing.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              

              {/* Neurological Imaging */}
              <div className="space-y-4">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-64" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">Neurological Imaging</h3>
                )}

                <FormField
                  control={form.control}
                  name="neurologicalImaging"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Have you had previous neurological imaging?
                        </FormLabel>
                        <FormDescription>
                          This includes CT scans, MRI scans, PET scans, or other brain imaging tests
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
              </div>

              {renderTestSection(
                "neurologicalImaging",
                "Neurological Imaging",
                "neurologicalImagingDates",
                "Include dates of CT scans, MRI scans, PET scans, or other brain imaging tests"
              )}

              <Separator />

              {/* ImPACT Testing */}
              <div className="space-y-4">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-48" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">ImPACT Testing</h3>
                )}

                <FormField
                  control={form.control}
                  name="impactTesting"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Have you had previous ImPACT testing?
                        </FormLabel>
                        <FormDescription>
                          ImPACT (Immediate Post-Concussion Assessment and Cognitive Testing) is a computerized concussion evaluation system
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
              </div>

              {renderTestSection(
                "impactTesting",
                "ImPACT Testing",
                "impactTestingDates",
                "Include dates of computerized concussion evaluations and cognitive testing"
              )}

              <Separator />

              {/* Neuropsychological Testing */}
              <div className="space-y-4">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-64" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">Neuropsychological Testing</h3>
                )}

                <FormField
                  control={form.control}
                  name="neuropsychologicalTesting"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Have you had previous neuropsychological testing?
                        </FormLabel>
                        <FormDescription>
                          This includes comprehensive cognitive and psychological assessments
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
              </div>

              {renderTestSection(
                "neuropsychologicalTesting",
                "Neuropsychological Testing",
                "neuropsychologicalTestingDates",
                "Include dates of comprehensive cognitive and psychological assessments"
              )}

              <Separator />

              {/* EEG */}
              <div className="space-y-4">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-24" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">EEG (Electroencephalogram)</h3>
                )}

                <FormField
                  control={form.control}
                  name="eeg"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Have you had previous EEG testing?
                        </FormLabel>
                        <FormDescription>
                          EEG measures electrical activity in the brain
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
              </div>

              {renderTestSection(
                "eeg",
                "EEG",
                "eegDates",
                "Include dates of electroencephalogram tests and any specific findings"
              )}

              <Separator />

              {/* Blood Work */}
              <div className="space-y-4">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-48" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">Blood Work</h3>
                )}

                <FormField
                  control={form.control}
                  name="bloodWork"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Have you had previous blood work?
                        </FormLabel>
                        <FormDescription>
                          This includes any blood tests, lab work, or blood panels
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
              </div>

              {renderTestSection(
                "bloodWork",
                "Blood Work",
                "bloodWorkDates",
                "Include dates of blood tests, lab work, or blood panels"
              )}

              {/* Information Boxes */}
              {!isSubmitting && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-blue-800 mb-2">Medical History:</h5>
                  <p className="text-sm text-blue-700">
                    Previous test results help healthcare providers understand your medical history and avoid unnecessary repeat testing. 
                    This information is crucial for making informed treatment decisions.
                  </p>
                </div>
              )}

              {!isSubmitting && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-yellow-800 mb-2">Note:</h5>
                  <p className="text-sm text-yellow-700">
                    Include approximate dates if you don't remember exact dates. Even if test results were normal, 
                    knowing when tests were performed helps establish a timeline of your medical care.
                  </p>
                </div>
              )}

              {!isSubmitting && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-green-800 mb-2">Test Types:</h5>
                  <p className="text-sm text-green-700">
                    Neurological imaging includes CT, MRI, PET scans. ImPACT testing is computerized concussion evaluation. 
                    Neuropsychological testing assesses cognitive function. EEG measures brain electrical activity. 
                    Blood work includes various lab tests and panels.
                  </p>
                </div>
              )}

              {!isSubmitting && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-purple-800 mb-2">Results Information:</h5>
                  <p className="text-sm text-purple-700">
                    If you have copies of test results or remember specific findings, please include that information 
                    in the dates section. This helps provide a complete picture of your medical testing history.
                  </p>
                </div>
              )}

              {!isSubmitting && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-orange-800 mb-2">Follow-up Testing:</h5>
                  <p className="text-sm text-orange-700">
                    Knowing about previous tests helps determine if follow-up testing is needed or if certain tests 
                    should be repeated to track changes over time.
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
                    "Submit Previous Test Information"
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

export default PreviousTestInfo
