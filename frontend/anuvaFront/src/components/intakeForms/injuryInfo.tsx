"use client"

import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { toast } from "@/hooks/use-toast"
import { navigate } from "wouter/use-browser-location"
import useUserAuth from "@/hooks/useUserAuth"
import { getUser } from "@/features/authSlice"
import { injuryInfoForm } from "@/features/intakeFormSlice/injuryInfoSlice"


// Zod schema for injury information validation
const injuryInfoSchema = z.object({
  patientID: z.string().min(1, "Patient ID is required"),
  dateOfInjury: z.date({
    required_error: "Date of injury is required",
  }),
  sportOrActivity: z.string().min(1, "Sport or activity is required").max(100, "Sport or activity must be less than 100 characters"),
  setting: z.enum(["game", "practice", "other"], {
    required_error: "Setting is required",
  }),
  settingDetail: z.string().max(100, "Setting detail must be less than 100 characters").optional(),
  position: z.string().max(100, "Position must be less than 100 characters").optional(),
  injuryDescription: z.string().min(1, "Injury description is required"),
  impactType: z.string().min(1, "Impact type is required").max(50, "Impact type must be less than 50 characters"),
  impactDetail: z.string().max(100, "Impact detail must be less than 100 characters").optional(),
  locationOfContact: z.string().min(1, "Location of contact is required").max(100, "Location of contact must be less than 100 characters"),
  lossOfConsciousness: z.boolean().default(false),
  locDuration: z.string().max(50, "Duration must be less than 50 characters").optional(),
  troubleRemembering: z.boolean().default(false),
  memoryTroubleDuration: z.string().max(50, "Duration must be less than 50 characters").optional(),
  feelConfused: z.boolean().default(false),
  confusionDuration: z.string().max(50, "Duration must be less than 50 characters").optional(),
  stoppedParticipation: z.boolean().default(false),
  stopDuration: z.string().max(50, "Duration must be less than 50 characters").optional(),
  returnedToParticipation: z.boolean().default(false),
  returnDuration: z.string().max(50, "Duration must be less than 50 characters").optional(),
  emergencyRoomVisit: z.boolean().default(false),
  erDetails: z.string().optional(),
  testsPerformed: z.string().optional(),
})

type InjuryInfoFormData = z.infer<typeof injuryInfoSchema>

const InjuryInfo = () => {
      const dispatch = useDispatch<AppDispatch>();
  const userAuth = useUserAuth();
  useEffect(() => { 
    dispatch(getUser())
   }, [dispatch]);
   
   
  const form = useForm<InjuryInfoFormData>({
    resolver: zodResolver(injuryInfoSchema),
    defaultValues: {
      patientID: (userAuth as any)?.user?.patientId || 0,
      dateOfInjury: new Date(),
      sportOrActivity: "",
      setting: "game",  
      settingDetail: "",
      position: "",
      injuryDescription: "",
      impactType: "",
      impactDetail: "",
      locationOfContact: "",
      lossOfConsciousness: false,
      locDuration: "",
      troubleRemembering: false,
      memoryTroubleDuration: "",
      feelConfused: false,
      confusionDuration: "",
      stoppedParticipation: false,
      stopDuration: "",
      returnedToParticipation: false,
      returnDuration: "",
      emergencyRoomVisit: false,
      erDetails: "",
      testsPerformed: "",
    },
  })

  const onSubmit = async (data: InjuryInfoFormData) => {
    // Format the date to YYYY-MM-DD format
    const formattedData = {
      ...data,
      dateOfInjury: format(data.dateOfInjury, 'yyyy-MM-dd')
    }
    console.log("Injury Info Form Data:", formattedData)
    
    // TODO: Replace with actual API call when injury slice is created
    // const response = await dispatch(injuryInfoForm(formattedData)).unwrap()
    
    // For now, just show success message
   const response = await dispatch(injuryInfoForm(formattedData)).unwrap()
   console.log("response", response)
   if(response?.status){
    dispatch(getUser())
    toast({
      title: "Injury information submitted successfully",
      description: "Injury information has been submitted successfully",
    })
    form.reset()
    navigate("/home")
   }
   else{
    toast({
      title: "Injury information submission failed",
      description: "Please try again",
      variant: "destructive",
    })
   }
   
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Injury Information Form</CardTitle>
          <CardDescription className="text-center">
            Please provide detailed information about the injury incident.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Injury Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Basic Injury Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="patientID"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Patient ID *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Patient ID" 
                            {...field}
                            value={(userAuth as any)?.user?.patientId || ''}
                            disabled={true}
                            className="bg-gray-100 cursor-not-allowed"
                          />
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
                    name="dateOfInjury"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Injury *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
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
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="sportOrActivity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sport or Activity *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Football, Basketball, Soccer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="setting"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Setting *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue="game">
                          <FormControl>
                            <SelectTrigger className="bg-white text-black">
                              <SelectValue placeholder="Select setting" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="game">Game</SelectItem>
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="practice">Practice</SelectItem>
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch("setting") === "other" && (
                  <FormField
                    control={form.control}
                    name="settingDetail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Setting Detail</FormLabel>
                        <FormControl>
                          <Input placeholder="Please specify the setting" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position Played</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Quarterback, Forward, Midfielder" {...field} />
                      </FormControl>
                      <FormDescription>
                        Position played during the injury (if applicable)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Injury Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Injury Details</h3>
                
                <FormField
                  control={form.control}
                  name="injuryDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Injury Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide a detailed description of the injury, including symptoms, mechanism of injury, and any immediate effects..."
                          className="resize-none min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="impactType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Impact *</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="bg-white text-black">
                              <SelectValue placeholder="Select impact type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="head-contact">Head Contact</SelectItem>
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="fall">Fall</SelectItem>
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="collision">Collision</SelectItem>
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="equipment-contact">Equipment Contact</SelectItem>
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="locationOfContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location of Contact *</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="bg-white text-black">
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="top">Top of Head</SelectItem>
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="front">Front</SelectItem>
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="back">Back</SelectItem>
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="left">Left Side</SelectItem>
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="right">Right Side</SelectItem>
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="face">Face</SelectItem>
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="multiple">Multiple Areas</SelectItem>
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch("impactType") === "other" && (
                  <FormField
                    control={form.control}
                    name="impactDetail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Impact Detail</FormLabel>
                        <FormControl>
                          <Input placeholder="Please specify the type of impact" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Immediate Effects */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Immediate Effects</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="lossOfConsciousness"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Loss of Consciousness</FormLabel>
                          <FormDescription>
                            Did the patient lose consciousness?
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="troubleRemembering"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Trouble Remembering</FormLabel>
                          <FormDescription>
                            Did the patient have memory issues?
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="feelConfused"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Feel Confused</FormLabel>
                          <FormDescription>
                            Did the patient feel confused?
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stoppedParticipation"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Stopped Participation</FormLabel>
                          <FormDescription>
                            Did the patient stop activity?
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="returnedToParticipation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Returned to Participation</FormLabel>
                        <FormDescription>
                          Did the patient return to activity?
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Duration Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Duration Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {form.watch("lossOfConsciousness") && (
                    <FormField
                      control={form.control}
                      name="locDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loss of Consciousness Duration</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 30 seconds, 2 minutes" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {form.watch("troubleRemembering") && (
                    <FormField
                      control={form.control}
                      name="memoryTroubleDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Memory Trouble Duration</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 1 hour, 30 minutes" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {form.watch("feelConfused") && (
                    <FormField
                      control={form.control}
                      name="confusionDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confusion Duration</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 15 minutes, 1 hour" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {form.watch("stoppedParticipation") && (
                    <FormField
                      control={form.control}
                      name="stopDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Activity Stop Duration</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 10 minutes, rest of game" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {form.watch("returnedToParticipation") && (
                  <FormField
                    control={form.control}
                    name="returnDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Until Return to Activity</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 20 minutes, next day" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Medical Treatment */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Medical Treatment</h3>
                
                <FormField
                  control={form.control}
                  name="emergencyRoomVisit"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Emergency Room or Physician Visit</FormLabel>
                        <FormDescription>
                          Did the patient visit an ER or physician?
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("emergencyRoomVisit") && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="erDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medical Treatment Details</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the medical treatment received, including any procedures, medications, or recommendations..."
                              className="resize-none min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="testsPerformed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tests Performed</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="List any tests performed (MRI, CT scan, X-ray, blood tests, etc.)..."
                              className="resize-none min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Reset Form
                </Button>
                <Button type="submit">
                  Submit Injury Information
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default InjuryInfo
