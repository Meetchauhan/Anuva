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
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { toast } from "@/hooks/use-toast"
import { navigate } from "wouter/use-browser-location"
import useUserAuth from "@/hooks/useUserAuth"
import { bodyPainInfoForm } from "@/features/intakeFormSlice/bodypainInfoSlice"

// Zod schema for body pain information validation
const bodyPainSchema = z.object({
  patientID: z.string().min(1, "Patient ID is required"),
  bodyPart: z.string().min(1, "Body part is required").max(50, "Body part must be less than 50 characters"),
  dateOfOnset: z.date({
    required_error: "Date of onset is required",
  }).refine((date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today to allow today's date
    return date <= today;
  }, {
    message: "Date of onset cannot be in the future"
  }),
  severity: z.number().min(1, "Severity is required").max(10, "Severity must be between 1 and 10"),
  frequency: z.string().min(1, "Frequency is required").max(100, "Frequency must be less than 100 characters"),
  duration: z.string().min(1, "Duration is required").max(100, "Duration must be less than 100 characters"),
  triggers: z.string().optional(),
  relievedBy: z.string().optional(),
  progression: z.enum(["better", "same", "worse"], {
    required_error: "Progression is required",
  }),
})

type BodyPainFormData = z.infer<typeof bodyPainSchema>

const BodyPainInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userAuth = useUserAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BodyPainFormData>({
    resolver: zodResolver(bodyPainSchema),
    defaultValues: {
      patientID: (userAuth as any)?.user?.patientId || 0,
      bodyPart: "",
      dateOfOnset: new Date(),
      severity: 5,
      frequency: "",
      duration: "",
      triggers: "",
      relievedBy: "",
      progression: "same",
    },
  })

  const onSubmit = async (data: BodyPainFormData) => {
    try{
    setIsSubmitting(true);
    
      // Format the date to YYYY-MM-DD format
      const formattedData = {
        ...data,
        dateOfOnset: format(data.dateOfOnset, 'yyyy-MM-dd')
      }
      
      console.log("Body Pain Form Data:", formattedData)
      
      // TODO: Replace with actual API call when body pain slice is created
      // const response = await dispatch(bodyPainForm(formattedData)).unwrap()
      
      // Simulate API call
      // await new Promise(resolve => setTimeout(resolve, 1500));

      const response = await dispatch(bodyPainInfoForm(formattedData)).unwrap()
      if(response.status) {
        setIsSubmitting(false);
        toast({
          title: "Body pain information submitted successfully",
          description: response.message,
        })
        form.reset()
        navigate("/home")
      }else{
        setIsSubmitting(false);
        toast({
          title: "Body pain information submission failed",
          description: response.message,
        })
      }
    }catch(error){
      console.log(error)
      form.reset()
      setIsSubmitting(false);
      toast({
        title: "Error in form submission",
        description: "Please try again",
        variant: "destructive",
      });
    }
  }

  const renderSeveritySlider = () => (
    <FormField
      control={form.control}
      name="severity"
      render={({ field }) => (
        <FormItem className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel className="text-base font-medium">Pain Severity</FormLabel>
            <span className="text-sm font-medium text-gray-600">
              {field.value}/10
            </span>
          </div>
          <FormControl>
            {isSubmitting ? (
              <Skeleton className="h-6 w-full" />
            ) : (
              <Slider
                value={[Number(field.value) || 0]}
                onValueChange={(value) => field.onChange(value[0])}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            )}
          </FormControl>
          <FormDescription className="text-sm text-gray-500">
            Rate your pain on a scale of 1 (mild) to 10 (severe)
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
          <CardTitle className="text-2xl font-bold text-center">Body Pain Information Form</CardTitle>
          <CardDescription className="text-center">
            Please provide detailed information about your body pain symptoms.
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
                    name="patientID"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient ID *</FormLabel>
                        <FormControl>
                          {isSubmitting ? (
                            <Skeleton className="h-10 w-full" />
                          ) : (
                            <Input 
                              type="number" 
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

                  <FormField
                    control={form.control}
                    name="bodyPart"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Body Part with Pain *</FormLabel>
                        <FormControl>
                          {isSubmitting ? (
                            <Skeleton className="h-10 w-full" />
                          ) : (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="bg-white text-black">
                                <SelectValue placeholder="Select body part" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="head">Head</SelectItem>
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="neck">Neck</SelectItem>
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="shoulder">Shoulder</SelectItem>
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="arm">Arm</SelectItem>
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="hand">Hand</SelectItem>
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="chest">Chest</SelectItem>
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="back">Back</SelectItem>
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="hip">Hip</SelectItem>
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="leg">Leg</SelectItem>
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="knee">Knee</SelectItem>
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="foot">Foot</SelectItem>
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="dateOfOnset"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Pain Onset *</FormLabel>
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

              {/* Pain Assessment */}
              <div className="space-y-4">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-48" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">Pain Assessment</h3>
                )}
                
                {renderSeveritySlider()}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="frequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frequency of Pain *</FormLabel>
                        <FormControl>
                          {isSubmitting ? (
                            <Skeleton className="h-10 w-full" />
                          ) : (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="bg-white text-black">
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="constant">Constant</SelectItem>
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="daily">Daily</SelectItem>
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="several-times-week">Several times per week</SelectItem>
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="weekly">Weekly</SelectItem>
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="monthly">Monthly</SelectItem>
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="occasional">Occasional</SelectItem>
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration of Pain *</FormLabel>
                        <FormControl>
                          {isSubmitting ? (
                            <Skeleton className="h-10 w-full" />
                          ) : (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger className="bg-white text-black">
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="seconds">Seconds</SelectItem>
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="minutes">Minutes</SelectItem>
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="hours">Hours</SelectItem>
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="days">Days</SelectItem>
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="weeks">Weeks</SelectItem>
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="months">Months</SelectItem>
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="years">Years</SelectItem>
                                <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Pain Triggers and Relief */}
              <div className="space-y-4">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-56" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">Pain Triggers and Relief</h3>
                )}
                
                <FormField
                  control={form.control}
                  name="triggers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What Triggers or Worsens Pain</FormLabel>
                      <FormControl>
                        {isSubmitting ? (
                          <Skeleton className="h-20 w-full" />
                        ) : (
                          <Textarea 
                            placeholder="Describe what activities, movements, or conditions make your pain worse (e.g., sitting, standing, exercise, stress, certain foods, etc.)..."
                            className="resize-none min-h-[80px]"
                            {...field} 
                          />
                        )}
                      </FormControl>
                      <FormDescription>
                        Leave blank if no specific triggers are identified
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="relievedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What Relieves Pain</FormLabel>
                      <FormControl>
                        {isSubmitting ? (
                          <Skeleton className="h-20 w-full" />
                        ) : (
                          <Textarea 
                            placeholder="Describe what helps relieve your pain (e.g., rest, medication, heat, ice, massage, specific positions, etc.)..."
                            className="resize-none min-h-[80px]"
                            {...field} 
                          />
                        )}
                      </FormControl>
                      <FormDescription>
                        Leave blank if no specific relief methods are identified
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Pain Progression */}
              <div className="space-y-4">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-44" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">Pain Progression</h3>
                )}
                
                <FormField
                  control={form.control}
                  name="progression"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How has your pain changed over time? *</FormLabel>
                      <FormControl>
                        {isSubmitting ? (
                          <Skeleton className="h-10 w-full" />
                        ) : (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger className="bg-white text-black">
                              <SelectValue placeholder="Select progression" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="better">Better</SelectItem>
                              <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="same">Same</SelectItem>
                              <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="worse">Worse</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </FormControl>
                      <FormDescription>
                        Compared to when the pain first started
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                    "Submit Body Pain Information"
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

export default BodyPainInfo
