"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { toast } from "@/hooks/use-toast"
import { navigate } from "wouter/use-browser-location"
import useUserAuth from "@/hooks/useUserAuth"
import { concussionDetailsInfoForm } from "@/features/intakeFormSlice/concussionDetailsInfoSlice"

// Zod schema for concussion details validation
const concussionDetailsSchema = z.object({
  concussionNumber: z.number().min(1, "Concussion number is required").max(50, "Concussion number must be less than 50"),
  injuryDate: z.date({
    required_error: "Injury date is required",
  }).refine((date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today to allow today's date
    return date <= today;
  }, {
    message: "Injury date cannot be in the future"
  }),
  knockedUnconscious: z.boolean().default(false),
  soughtMedicalTreatment: z.boolean().default(false),
  symptomDuration: z.string().min(1, "Symptom duration is required").max(100, "Symptom duration must be less than 100 characters"),
})

type ConcussionDetailsFormData = z.infer<typeof concussionDetailsSchema>

const ConcussionDetailsInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userAuth = useUserAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ConcussionDetailsFormData>({
    resolver: zodResolver(concussionDetailsSchema),
    defaultValues: {
      concussionNumber: 1,
      injuryDate: new Date(),
      knockedUnconscious: false,
      soughtMedicalTreatment: false,
      symptomDuration: "",
    },
  })

  const onSubmit = async (data: ConcussionDetailsFormData) => {
    setIsSubmitting(true);
    
    try {
      // Format the date to YYYY-MM-DD format
      const formattedData = {
        ...data,
        injuryDate: format(data.injuryDate, 'yyyy-MM-dd')
      }
    
      const response = await dispatch(concussionDetailsInfoForm(formattedData)).unwrap();

      toast({
        title: "Concussion details submitted successfully",
        description: response.message || "Your concussion details have been submitted successfully",
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

  const symptomDurationOptions = [
    { value: "less-than-24-hours", label: "Less than 24 hours" },
    { value: "1-3-days", label: "1-3 days" },
    { value: "4-7-days", label: "4-7 days" },
    { value: "1-2-weeks", label: "1-2 weeks" },
    { value: "2-4-weeks", label: "2-4 weeks" },
    { value: "1-3-months", label: "1-3 months" },
    { value: "3-6-months", label: "3-6 months" },
    { value: "6-months-plus", label: "6+ months" },
    { value: "still-present", label: "Still present" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Concussion Details Information</CardTitle>
          <CardDescription className="text-center">
            Please provide detailed information about your concussion incident.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             

              {/* Basic Information */}
              <div className="space-y-4">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-40" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="concussionNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Concussion Number *</FormLabel>
                        <FormControl>
                          {isSubmitting ? (
                            <Skeleton className="h-10 w-full" />
                          ) : (
                            <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                              <SelectTrigger className="bg-white text-black">
                                <SelectValue placeholder="Select concussion number" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                                  <SelectItem key={num} value={num.toString()} className="text-black bg-white hover:bg-gray-100 hover:text-black border-none">
                                    {num}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </FormControl>
                        <FormDescription>
                          Which concussion is this in your history? (1st, 2nd, 3rd, etc.)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="injuryDate"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel>Date of Concussion *</FormLabel>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Injury Details */}
              <div className="space-y-6">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-48" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">Injury Details</h3>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="knockedUnconscious"
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
                              <FormLabel className="text-base font-medium">Were you knocked unconscious?</FormLabel>
                              <FormDescription className="text-sm">
                                Did you lose consciousness during this concussion?
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
                    name="soughtMedicalTreatment"
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
                              <FormLabel className="text-base font-medium">Did you seek medical treatment?</FormLabel>
                              <FormDescription className="text-sm">
                                Did you receive medical care for this concussion?
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
              </div>

              <Separator />

              {/* Symptom Duration */}
              <div className="space-y-4">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-44" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">Symptom Duration</h3>
                )}
                
                <FormField
                  control={form.control}
                  name="symptomDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How long did symptoms last? *</FormLabel>
                      <FormControl>
                        {isSubmitting ? (
                          <Skeleton className="h-10 w-full" />
                        ) : (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="bg-white text-black">
                              <SelectValue placeholder="Select symptom duration" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {symptomDurationOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value} className="text-black bg-white hover:bg-gray-100 hover:text-black border-none">
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </FormControl>
                      <FormDescription>
                        How long did concussion symptoms persist after the injury?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Information Box */}
              {!isSubmitting && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-blue-800 mb-2">Important Information:</h5>
                  <p className="text-sm text-blue-700">
                    Concussion details help healthcare providers understand your injury history and provide appropriate care. 
                    Please provide accurate information about each concussion you have experienced.
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
                    "Submit Concussion Details"
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

export default ConcussionDetailsInfo
