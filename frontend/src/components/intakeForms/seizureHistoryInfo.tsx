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
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { seizureHistoryInfoForm } from "@/features/intakeFormSlice/seizureHistoryInfoSlice"

// Zod schema for seizure history validation
const seizureHistorySchema = z.object({
  hasSeizureHistory: z.boolean(),
  dateOfOnset: z.date().optional(),
  typeOfSeizure: z.string().max(100, "Type of seizure must be less than 100 characters").optional(),
  dateOfLastSeizure: z.date().optional(),
  currentMedications: z.string().max(1000, "Medications description must be less than 1000 characters").optional(),
}).refine((data) => {
  if (data.hasSeizureHistory) {
    if (!data.dateOfOnset) return false;
    if (!data.typeOfSeizure || data.typeOfSeizure.trim() === '') return false;
    if (!data.dateOfLastSeizure) return false;
    if (!data.currentMedications || data.currentMedications.trim() === '') return false;
  }
  return true;
}, {
  message: "Please fill in all seizure history details if you have a history of seizures",
  path: ["hasSeizureHistory"]
})

type SeizureHistoryFormData = z.infer<typeof seizureHistorySchema>

const SeizureHistoryInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userAuth = useUserAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SeizureHistoryFormData>({
    resolver: zodResolver(seizureHistorySchema),
    defaultValues: {
      hasSeizureHistory: false,
      dateOfOnset: undefined,
      typeOfSeizure: "",
      dateOfLastSeizure: undefined,
      currentMedications: "",
    },
  })

  const onSubmit = async (data: SeizureHistoryFormData) => {
    setIsSubmitting(true);
    
    try {
      // Format dates to yyyy-MM-dd format before sending to API
      const formattedData = {
        ...data,
        dateOfOnset: data.dateOfOnset ? format(data.dateOfOnset, "yyyy-MM-dd") : undefined,
        dateOfLastSeizure: data.dateOfLastSeizure ? format(data.dateOfLastSeizure, "yyyy-MM-dd") : undefined,
      };

      const response = await dispatch(seizureHistoryInfoForm(formattedData)).unwrap();
      
      toast({
        title: "Seizure history submitted successfully",
        description: response.message || "Your seizure history information has been submitted successfully",
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

  const renderSeizureDetails = () => {
    if (!form.watch("hasSeizureHistory")) {
      return null;
    }

    return (
      <div className="space-y-6 pl-6 border-l-2 border-gray-200">
       
          
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700">Please provide additional details:</h4>
              
              {/* Date of Onset */}
              <FormField
                control={form.control}
                name="dateOfOnset"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>When did seizures begin? *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "yyyy-MM-dd")
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
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When did you first experience seizures?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type of Seizure */}
              <FormField
                control={form.control}
                name="typeOfSeizure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type of Seizures *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Tonic-clonic, Absence, Focal, Myoclonic, Atonic, etc." 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      What type of seizures do you experience?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date of Last Seizure */}
              <FormField
                control={form.control}
                name="dateOfLastSeizure"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Last Seizure *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "yyyy-MM-dd")
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
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      When was your most recent seizure?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Current Medications */}
              <FormField
                control={form.control}
                name="currentMedications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Medications for Seizures *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="List all medications you are currently taking for seizure control. Include dosage, frequency, and how long you've been taking each medication. Also mention if you've had any side effects or if the medications are effective."
                        className="resize-none min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      What medications are you currently taking to control seizures?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Information Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h5 className="text-sm font-medium text-blue-800 mb-2">Seizure Information:</h5>
              <p className="text-sm text-blue-700">
                Accurate seizure history helps healthcare providers understand your condition better and make informed treatment decisions. 
                This information is crucial for managing your seizure disorder effectively.
              </p>
            </div>
          
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Seizure History Information</CardTitle>
          <CardDescription className="text-center">
            Please provide information about your seizure history, including when seizures began, their type, and current medications.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             
              {/* Seizure History Question */}
              <div className="space-y-4">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-48" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">Seizure History</h3>
                )}

                <FormField
                  control={form.control}
                  name="hasSeizureHistory"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Do you have a history of seizures?
                        </FormLabel>
                        <FormDescription>
                          This includes any type of seizure disorder or epilepsy
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

              {/* Conditional Seizure Details */}
              {renderSeizureDetails()}

              {/* Information Boxes */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-red-800 mb-2">⚠️ Important Medical Information:</h5>
                  <p className="text-sm text-red-700">
                    Seizure disorders require careful medical management. Please provide accurate information about your seizure history, 
                    including any triggers, warning signs, and how seizures typically present. This information is critical for your safety.
                  </p>
                </div>
              

              
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-yellow-800 mb-2">Note:</h5>
                  <p className="text-sm text-yellow-700">
                    If you have experienced seizures but are not currently diagnosed with a seizure disorder, please still provide this information. 
                    Include any single seizures, febrile seizures in childhood, or seizures related to other medical conditions.
                  </p>
                </div>
              

              
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-green-800 mb-2">Seizure Types:</h5>
                  <p className="text-sm text-green-700">
                    Common seizure types include: Tonic-clonic (grand mal), Absence (petit mal), Focal (partial), 
                    Myoclonic, Atonic, and others. If you're unsure of the specific type, describe what happens during your seizures.
                  </p>
                </div>


              
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-purple-800 mb-2">Medication Information:</h5>
                  <p className="text-sm text-purple-700">
                    Include all anti-seizure medications, their dosages, how often you take them, and any side effects you experience. 
                    Also mention if you've had to change medications or if any have been ineffective.
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
                    "Submit Seizure History Information"
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

export default SeizureHistoryInfo
