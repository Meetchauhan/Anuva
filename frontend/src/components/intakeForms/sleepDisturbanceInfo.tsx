"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { sleepDisturbanceInfoForm } from "@/features/intakeFormSlice/sleepDisturbanceInfoSlice"
import { navigate } from "wouter/use-browser-location"

// Zod schema for sleep disturbance validation
const sleepDisturbanceSchema = z.object({
  hasSleepDisturbance: z.boolean(),
  difficultyFallingAsleep: z.boolean(),
  fallingAsleepSeverity: z.number().min(0).max(10),
  fallingAsleepProgression: z.string().optional(),
  difficultyStayingAsleep: z.boolean(),
  stayingAsleepSeverity: z.number().min(0).max(10),
  stayingAsleepProgression: z.string().optional(),
  nightmares: z.boolean(),
  nightmaresSeverity: z.number().min(0).max(10),
  nightmaresProgression: z.string().optional(),
  actsOutDreams: z.boolean(),
  actsOutDreamsSeverity: z.number().min(0).max(10),
  actsOutDreamsProgression: z.string().optional(),
  earlyMorningWakening: z.boolean(),
  earlyWakeningSeverity: z.number().min(0).max(10),
  earlyWakeningProgression: z.string().optional(),
  daytimeDrowsiness: z.boolean(),
  drowsinessSeverity: z.number().min(0).max(10),
  drowsinessProgression: z.string().optional(),
  naps: z.boolean(),
  numberOfNaps: z.number().min(0).max(10).optional(),
}).refine((data) => {
  // If has sleep disturbance is false, all other fields should be optional
  if (!data.hasSleepDisturbance) {
    return true;
  }
  return true;
}, {
  message: "Please provide details about sleep disturbances",
});

type SleepDisturbanceFormData = z.infer<typeof sleepDisturbanceSchema>

const SleepDisturbanceInfo = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SleepDisturbanceFormData>({
    resolver: zodResolver(sleepDisturbanceSchema),
    defaultValues: {
      hasSleepDisturbance: false,
      difficultyFallingAsleep: false,
      fallingAsleepSeverity: 5,
      fallingAsleepProgression: "",
      difficultyStayingAsleep: false,
      stayingAsleepSeverity: 5,
      stayingAsleepProgression: "",
      nightmares: false,
      nightmaresSeverity: 5,
      nightmaresProgression: "",
      actsOutDreams: false,
      actsOutDreamsSeverity: 5,
      actsOutDreamsProgression: "",
      earlyMorningWakening: false,
      earlyWakeningSeverity: 5,
      earlyWakeningProgression: "",
      daytimeDrowsiness: false,
      drowsinessSeverity: 5,
      drowsinessProgression: "",
      naps: false,
      numberOfNaps: 0,
    },
  });

  const onSubmit = async (data: SleepDisturbanceFormData) => {
    try{
    setIsSubmitting(true);
    const response = await dispatch(sleepDisturbanceInfoForm(data)).unwrap()
    if(response.status) {
      setIsSubmitting(false);
      toast({
        title: "Sleep Disturbance Information Saved",
        description: response.message,
      });
      form.reset()
      navigate("/home")
    }
  }catch(error){
    console.log(error)
    setIsSubmitting(false);
    toast({
      title: "Error in form submission",
      description: "Please try again",
      variant: "destructive",
    });
  }finally{
    setIsSubmitting(false);
  }
  };

  const severityLevels = [
    { value: 0, label: "0 - None" },
    { value: 1, label: "1 - Very Mild" },
    { value: 2, label: "2 - Mild" },
    { value: 3, label: "3 - Mild to Moderate" },
    { value: 4, label: "4 - Moderate" },
    { value: 5, label: "5 - Moderate to Severe" },
    { value: 6, label: "6 - Severe" },
    { value: 7, label: "7 - Very Severe" },
    { value: 8, label: "8 - Extremely Severe" },
    { value: 9, label: "9 - Very Severe" },
    { value: 10, label: "10 - Most Severe" },
  ];

  const progressionOptions = [
    { value: "better", label: "Better" },
    { value: "same", label: "Same" },
    { value: "worse", label: "Worse" },
  ];

  return (
    <div className="container mx-auto py-12 px-6 max-w-5xl">
      
      <Card className="shadow-lg">
        <CardHeader className="pb-8">
          <CardTitle className="text-3xl font-bold text-center text-black mb-4">Sleep Disturbance Information</CardTitle>
          <CardDescription className="text-center text-lg">
            Please provide detailed information about your sleep patterns and disturbances
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
             
              {/* General Sleep Disturbance */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-black mb-6">General Sleep Assessment</h3>
                
                <FormField
                  control={form.control}
                  name="hasSleepDisturbance"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-6 bg-gray-50">
                      <div className="space-y-1">
                        <FormLabel className="text-base font-medium">Do you experience sleep disturbances?</FormLabel>
                        <FormDescription className="text-sm">
                          This will help us understand your sleep patterns
                        </FormDescription>
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

              {form.watch("hasSleepDisturbance") && (
                <>
                  <Separator className="my-8" />

                  {/* Difficulty Falling Asleep */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-black mb-6">Difficulty Falling Asleep</h3>
                    
                    <FormField
                      control={form.control}
                      name="difficultyFallingAsleep"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-6 bg-gray-50">
                          <div className="space-y-1">
                            <FormLabel className="text-base font-medium">Do you have trouble falling asleep?</FormLabel>
                            <FormDescription className="text-sm">
                              Difficulty initiating sleep
                            </FormDescription>
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

                    {form.watch("difficultyFallingAsleep") && (
                      <div className="space-y-4 pl-6">
                        <FormField
                          control={form.control}
                          name="fallingAsleepSeverity"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-base font-medium">Severity (0-10)</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  <Slider
                                    value={[field.value]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                    max={10}
                                    min={0}
                                    step={1}
                                    className="w-full"
                                  />
                                  <div className="text-sm text-muted-foreground">
                                    {severityLevels.find(level => level.value === field.value)?.label}
                                  </div>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="fallingAsleepProgression"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-base font-medium">Progression</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select progression" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white">
                                  {progressionOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value} className="bg-white text-black hover:bg-gray-100">
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <Separator className="my-8" />

                  {/* Difficulty Staying Asleep */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-black mb-6">Difficulty Staying Asleep</h3>
                    
                    <FormField
                      control={form.control}
                      name="difficultyStayingAsleep"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-6 bg-gray-50">
                          <div className="space-y-1">
                            <FormLabel className="text-base font-medium">Do you have trouble staying asleep?</FormLabel>
                            <FormDescription className="text-sm">
                              Waking up frequently during the night
                            </FormDescription>
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

                    {form.watch("difficultyStayingAsleep") && (
                      <div className="space-y-4 pl-6">
                        <FormField
                          control={form.control}
                          name="stayingAsleepSeverity"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-base font-medium">Severity (0-10)</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  <Slider
                                    value={[field.value]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                    max={10}
                                    min={0}
                                    step={1}
                                    className="w-full"
                                  />
                                  <div className="text-sm text-muted-foreground">
                                    {severityLevels.find(level => level.value === field.value)?.label}
                                  </div>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="stayingAsleepProgression"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-base font-medium">Progression</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select progression" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white">
                                  {progressionOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value} className="bg-white text-black hover:bg-gray-100">
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <Separator className="my-8" />

                  {/* Nightmares */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-black mb-6">Nightmares</h3>
                    
                    <FormField
                      control={form.control}
                      name="nightmares"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-6 bg-gray-50">
                          <div className="space-y-1">
                            <FormLabel className="text-base font-medium">Do you experience nightmares?</FormLabel>
                            <FormDescription className="text-sm">
                              Disturbing dreams that wake you up
                            </FormDescription>
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

                    {form.watch("nightmares") && (
                      <div className="space-y-4 pl-6">
                        <FormField
                          control={form.control}
                          name="nightmaresSeverity"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-base font-medium">Severity (0-10)</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  <Slider
                                    value={[field.value]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                    max={10}
                                    min={0}
                                    step={1}
                                    className="w-full"
                                  />
                                  <div className="text-sm text-muted-foreground">
                                    {severityLevels.find(level => level.value === field.value)?.label}
                                  </div>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="nightmaresProgression"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-base font-medium">Progression</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select progression" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white">
                                  {progressionOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value} className="bg-white text-black hover:bg-gray-100">
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <Separator className="my-8" />

                  {/* Acting Out Dreams */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-black mb-6">Acting Out Dreams</h3>
                    
                    <FormField
                      control={form.control}
                      name="actsOutDreams"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-6 bg-gray-50">
                          <div className="space-y-1">
                            <FormLabel className="text-base font-medium">Do you act out your dreams?</FormLabel>
                            <FormDescription className="text-sm">
                              Physical movements during sleep
                            </FormDescription>
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

                    {form.watch("actsOutDreams") && (
                      <div className="space-y-4 pl-6">
                        <FormField
                          control={form.control}
                          name="actsOutDreamsSeverity"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-base font-medium">Severity (0-10)</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  <Slider
                                    value={[field.value]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                    max={10}
                                    min={0}
                                    step={1}
                                    className="w-full"
                                  />
                                  <div className="text-sm text-muted-foreground">
                                    {severityLevels.find(level => level.value === field.value)?.label}
                                  </div>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="actsOutDreamsProgression"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-base font-medium">Progression</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select progression" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white">
                                  {progressionOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value} className="bg-white text-black hover:bg-gray-100">
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <Separator className="my-8" />

                  {/* Early Morning Wakening */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-black mb-6">Early Morning Wakening</h3>
                    
                    <FormField
                      control={form.control}
                      name="earlyMorningWakening"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-6 bg-gray-50">
                          <div className="space-y-1">
                            <FormLabel className="text-base font-medium">Do you wake up too early?</FormLabel>
                            <FormDescription className="text-sm">
                              Waking up earlier than desired
                            </FormDescription>
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

                    {form.watch("earlyMorningWakening") && (
                      <div className="space-y-4 pl-6">
                        <FormField
                          control={form.control}
                          name="earlyWakeningSeverity"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-base font-medium">Severity (0-10)</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  <Slider
                                    value={[field.value]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                    max={10}
                                    min={0}
                                    step={1}
                                    className="w-full"
                                  />
                                  <div className="text-sm text-muted-foreground">
                                    {severityLevels.find(level => level.value === field.value)?.label}
                                  </div>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="earlyWakeningProgression"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-base font-medium">Progression</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select progression" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white">
                                  {progressionOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value} className="bg-white text-black hover:bg-gray-100">
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <Separator className="my-8" />

                  {/* Daytime Drowsiness */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-black mb-6">Daytime Drowsiness</h3>
                    
                    <FormField
                      control={form.control}
                      name="daytimeDrowsiness"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-6 bg-gray-50">
                          <div className="space-y-1">
                            <FormLabel className="text-base font-medium">Do you experience daytime drowsiness?</FormLabel>
                            <FormDescription className="text-sm">
                              Feeling sleepy during the day
                            </FormDescription>
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

                    {form.watch("daytimeDrowsiness") && (
                      <div className="space-y-4 pl-6">
                        <FormField
                          control={form.control}
                          name="drowsinessSeverity"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-base font-medium">Severity (0-10)</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  <Slider
                                    value={[field.value]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                    max={10}
                                    min={0}
                                    step={1}
                                    className="w-full"
                                  />
                                  <div className="text-sm text-muted-foreground">
                                    {severityLevels.find(level => level.value === field.value)?.label}
                                  </div>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="drowsinessProgression"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-base font-medium">Progression</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Select progression" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white">
                                  {progressionOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value} className="bg-white text-black hover:bg-gray-100">
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <Separator className="my-8" />

                  {/* Naps */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-black mb-6">Napping</h3>
                    
                    <FormField
                      control={form.control}
                      name="naps"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-6 bg-gray-50">
                          <div className="space-y-1">
                            <FormLabel className="text-base font-medium">Do you take naps during the day?</FormLabel>
                            <FormDescription className="text-sm">
                              Regular daytime napping
                            </FormDescription>
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

                    {form.watch("naps") && (
                      <div className="space-y-4 pl-6">
                        <FormField
                          control={form.control}
                          name="numberOfNaps"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-base font-medium">Number of Naps per Day</FormLabel>
                              <FormControl>
                                <div className="space-y-2">
                                  <Slider
                                    value={[field.value || 0]}
                                    onValueChange={(value) => field.onChange(value[0])}
                                    max={10}
                                    min={0}
                                    step={1}
                                    className="w-full"
                                  />
                                  <div className="text-sm text-muted-foreground">
                                    {field.value || 0} naps per day
                                  </div>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Reset Form
                </Button>
                <Button 
                  type="submit" 
                  disabled={!form.watch("hasSleepDisturbance") || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Sleep Disturbance Information"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SleepDisturbanceInfo;
