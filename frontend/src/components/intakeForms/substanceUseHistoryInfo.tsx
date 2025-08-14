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
import { substanceUseHistoryInfoForm } from "@/features/intakeFormSlice/substanceUseHistoryInfoSlice"

// Zod schema for substance use history validation
const substanceUseHistorySchema = z.object({
  // Alcohol section
  usesAlcohol: z.boolean().default(false),
  alcoholDaysPerWeek: z.number().min(0).max(7).optional(),
  alcoholDrinksPerOccasion: z.number().min(0).max(50).optional(),
  alcoholAgeFirstUse: z.number().min(0).max(100).optional(),
  alcoholLongestSobriety: z.string().max(50).optional(),
  alcoholCurrentlySober: z.boolean().default(false),
  alcoholLastUse: z.date().optional(),
  alcoholBinges: z.boolean().default(false),
  alcoholBlackouts: z.boolean().default(false),
  alcoholDeliriumTremens: z.boolean().default(false),
  alcoholRelatedSeizures: z.boolean().default(false),
  
  // Nicotine section
  usesNicotine: z.boolean().default(false),
  nicotineAgeFirstUse: z.number().min(0).max(100).optional(),
  nicotineType: z.string().max(50).optional(),
  nicotineAmountPerDay: z.string().max(50).optional(),
  nicotineLastUse: z.date().optional(),
  
  // Steroids section
  usesSteroids: z.boolean().default(false),
  steroidsAgeFirstUse: z.number().min(0).max(100).optional(),
  steroidsFrequency: z.string().max(50).optional(),
  steroidsDuration: z.string().max(50).optional(),
  steroidsLastUse: z.date().optional(),
  
  // Other substances section
  usesOtherSubstances: z.boolean().default(false),
  substancesUsed: z.string().max(1000).optional(),
  substancesAgeFirstUse: z.number().min(0).max(100).optional(),
  substancesTypicalAmount: z.string().max(50).optional(),
  substancesFrequency: z.string().max(50).optional(),
  substancesLongestSobriety: z.string().max(50).optional(),
  substancesCurrentlySober: z.boolean().default(false),
  substancesLastUse: z.date().optional(),
})

type SubstanceUseHistoryFormData = z.infer<typeof substanceUseHistorySchema>

const SubstanceUseHistoryInfo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userAuth = useUserAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SubstanceUseHistoryFormData>({
    resolver: zodResolver(substanceUseHistorySchema),
    defaultValues: {
      usesAlcohol: false,
      alcoholDaysPerWeek: 0,
      alcoholDrinksPerOccasion: 0,
      alcoholAgeFirstUse: 0,
      alcoholLongestSobriety: "",
      alcoholCurrentlySober: false,
      alcoholLastUse: undefined,
      alcoholBinges: false,
      alcoholBlackouts: false,
      alcoholDeliriumTremens: false,
      alcoholRelatedSeizures: false,
      usesNicotine: false,
      nicotineAgeFirstUse: 0,
      nicotineType: "",
      nicotineAmountPerDay: "",
      nicotineLastUse: undefined,
      usesSteroids: false,
      steroidsAgeFirstUse: 0,
      steroidsFrequency: "",
      steroidsDuration: "",
      steroidsLastUse: undefined,
      usesOtherSubstances: false,
      substancesUsed: "",
      substancesAgeFirstUse: 0,
      substancesTypicalAmount: "",
      substancesFrequency: "",
      substancesLongestSobriety: "",
      substancesCurrentlySober: false,
      substancesLastUse: undefined,
    },
  })

  const onSubmit = async (data: SubstanceUseHistoryFormData) => {
    setIsSubmitting(true);
    
    try {
     const response = await dispatch(substanceUseHistoryInfoForm(data)).unwrap();
      
      toast({
        title: "Substance use history submitted successfully",
        description: response.message || "Your substance use history information has been submitted successfully",
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

  const renderAlcoholSection = () => {
    if (!form.watch("usesAlcohol")) {
      return null;
    }

    return (
      <div className="space-y-6 pl-6 border-l-2 border-gray-200">
        {isSubmitting ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-6 w-11" />
            <Skeleton className="h-6 w-11" />
            <Skeleton className="h-6 w-11" />
            <Skeleton className="h-6 w-11" />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700">Please provide alcohol use details:</h4>
              
              {/* Alcohol Usage Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="alcoholDaysPerWeek"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Days per week alcohol consumed</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0-7" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alcoholDrinksPerOccasion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Typical number of drinks per occasion</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0-50" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="alcoholAgeFirstUse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age when first used alcohol</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Age" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alcoholLongestSobriety"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longest period of sobriety</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., 2 years, 6 months, etc." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alcoholLastUse"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of last alcohol use</FormLabel>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Alcohol-related complications */}
              <div className="space-y-4">
                <h5 className="text-sm font-medium text-gray-600">Alcohol-related complications:</h5>
                
                <FormField
                  control={form.control}
                  name="alcoholCurrentlySober"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Currently sober from alcohol</FormLabel>
                        <FormDescription>Are you currently abstaining from alcohol?</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alcoholBinges"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">History of alcohol binges</FormLabel>
                        <FormDescription>Have you experienced episodes of heavy drinking?</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alcoholBlackouts"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">History of alcohol blackouts</FormLabel>
                        <FormDescription>Have you experienced memory loss while drinking?</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alcoholDeliriumTremens"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">History of Delirium Tremens (DTs)</FormLabel>
                        <FormDescription>Have you experienced severe alcohol withdrawal symptoms?</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alcoholRelatedSeizures"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Alcohol-related seizures</FormLabel>
                        <FormDescription>Have you experienced seizures related to alcohol use or withdrawal?</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderNicotineSection = () => {
    if (!form.watch("usesNicotine")) {
      return null;
    }

    return (
      <div className="space-y-6 pl-6 border-l-2 border-gray-200">
        {isSubmitting ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700">Please provide nicotine use details:</h4>
              
              <FormField
                control={form.control}
                name="nicotineAgeFirstUse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age when first used nicotine</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Age" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nicotineType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of nicotine product</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Cigarettes, Vape, Chewing tobacco, etc." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nicotineAmountPerDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount used per day</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., 1 pack, 10 cigarettes, etc." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="nicotineLastUse"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of last nicotine use</FormLabel>
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

  const renderSteroidsSection = () => {
    if (!form.watch("usesSteroids")) {
      return null;
    }

    return (
      <div className="space-y-6 pl-6 border-l-2 border-gray-200">
        {isSubmitting ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700">Please provide steroid use details:</h4>
              
              <FormField
                control={form.control}
                name="steroidsAgeFirstUse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age when first used steroids</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Age" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="steroidsFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How often steroids used</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Daily, Weekly, Monthly, etc." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="steroidsDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How long steroids used</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., 3 months, 1 year, etc." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="steroidsLastUse"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of last steroid use</FormLabel>
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

  const renderOtherSubstancesSection = () => {
    if (!form.watch("usesOtherSubstances")) {
      return null;
    }

    return (
      <div className="space-y-6 pl-6 border-l-2 border-gray-200">
        {isSubmitting ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-6 w-11" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700">Please provide other substance use details:</h4>
              
              <FormField
                control={form.control}
                name="substancesUsed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>List of substances used</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please list all substances you have used, including: marijuana, cocaine, heroin, methamphetamine, prescription drugs (not as prescribed), hallucinogens, inhalants, etc. Include specific names and forms."
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
                name="substancesAgeFirstUse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age when first used substances</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Age" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="substancesTypicalAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Typical amount used</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., 1 gram, 2 pills, etc." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="substancesFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How often substances used</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Daily, Weekly, Monthly, etc." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="substancesLongestSobriety"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longest period of sobriety</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., 1 year, 6 months, etc." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="substancesCurrentlySober"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Currently sober from substances</FormLabel>
                      <FormDescription>Are you currently abstaining from substance use?</FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="substancesLastUse"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of last substance use</FormLabel>
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
          </>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Substance Use History Information</CardTitle>
          <CardDescription className="text-center">
            Please provide information about your substance use history. This information is confidential and helps healthcare providers understand potential risk factors and provide appropriate care.
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

              {/* Alcohol Use */}
              <div className="space-y-4">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-48" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">Alcohol Use</h3>
                )}

                <FormField
                  control={form.control}
                  name="usesAlcohol"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Do you use alcohol?
                        </FormLabel>
                        <FormDescription>
                          This includes any type of alcoholic beverages
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

              {renderAlcoholSection()}

              <Separator />

              {/* Nicotine Use */}
              <div className="space-y-4">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-48" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">Nicotine Use</h3>
                )}

                <FormField
                  control={form.control}
                  name="usesNicotine"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Do you use nicotine products?
                        </FormLabel>
                        <FormDescription>
                          This includes cigarettes, vaping, chewing tobacco, etc.
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

              {renderNicotineSection()}

              <Separator />

              {/* Steroid Use */}
              <div className="space-y-4">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-48" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">Steroid Use</h3>
                )}

                <FormField
                  control={form.control}
                  name="usesSteroids"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Do you use steroids?
                        </FormLabel>
                        <FormDescription>
                          This includes anabolic steroids, performance-enhancing drugs
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

              {renderSteroidsSection()}

              <Separator />

              {/* Other Substances */}
              <div className="space-y-4">
                {isSubmitting ? (
                  <Skeleton className="h-6 w-48" />
                ) : (
                  <h3 className="text-lg font-semibold border-b pb-2">Other Substances</h3>
                )}

                <FormField
                  control={form.control}
                  name="usesOtherSubstances"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Do you use other substances?
                        </FormLabel>
                        <FormDescription>
                          This includes marijuana, cocaine, heroin, prescription drugs (not as prescribed), etc.
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

              {renderOtherSubstancesSection()}

              {/* Information Boxes */}
              
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-red-800 mb-2">⚠️ Confidential Information:</h5>
                  <p className="text-sm text-red-700">
                    All substance use information is kept strictly confidential and is used only for medical purposes. 
                    This information helps healthcare providers understand potential risk factors and provide appropriate care.
                  </p>
                </div>
              

              
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-blue-800 mb-2">Medical Safety:</h5>
                  <p className="text-sm text-blue-700">
                    Substance use can affect medication interactions, treatment effectiveness, and overall health outcomes. 
                    Accurate information helps ensure your safety during medical procedures and treatments.
                  </p>
                </div>
              

              
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-yellow-800 mb-2">Note:</h5>
                  <p className="text-sm text-yellow-700">
                    Include both current and past substance use. Even if you are no longer using substances, 
                    this information is important for understanding your complete medical history.
                  </p>
                </div>
              

              
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="text-sm font-medium text-green-800 mb-2">Treatment Support:</h5>
                  <p className="text-sm text-green-700">
                    If you are seeking help for substance use, this information helps healthcare providers 
                    recommend appropriate treatment options and support services.
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
                    "Submit Substance Use History Information"
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

export default SubstanceUseHistoryInfo
