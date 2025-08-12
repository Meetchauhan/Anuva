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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { headacheInfoForm } from "@/features/intakeFormSlice/headacheInfoSlice"
import { navigate } from "wouter/use-browser-location"

// Zod schema for headache info validation
const headacheInfoSchema = z.object({
  ageOrDateOfOnset: z.string().min(1, "Please specify when headaches began"),
  pastHeadacheProblems: z.boolean(),
  pastHeadacheDescription: z.string().optional(),
  locationOfPain: z.string().min(1, "Please specify the location of pain"),
  frequency: z.string().min(1, "Please specify how often headaches occur"),
  painAtPresent: z.number().min(0).max(10),
  painAtWorst: z.number().min(0).max(10),
  qualityDescription: z.string().min(1, "Please describe the quality of headache"),
  timingDescription: z.string().min(1, "Please describe timing changes"),
  durationDescription: z.string().min(1, "Please describe how long headaches last"),
  triggersDescription: z.string().min(1, "Please describe what triggers headaches"),
  associatedSymptoms: z.string().min(1, "Please describe associated symptoms"),
  reliefFactors: z.string().min(1, "Please describe what relieves headaches"),
  daysMissingWorkOrSchool: z.string().min(1, "Please specify days missing work/school"),
  daysMissingSocialEvents: z.string().min(1, "Please specify days missing social events"),
}).refine((data) => {
  // If past headache problems is true, description is required
  if (data.pastHeadacheProblems && !data.pastHeadacheDescription) {
    return false;
  }
  return true;
}, {
  message: "Please describe past headache problems",
  path: ["pastHeadacheDescription"]
});

type HeadacheInfoFormData = z.infer<typeof headacheInfoSchema>

const HeadacheInfo = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<HeadacheInfoFormData>({
    resolver: zodResolver(headacheInfoSchema),
    defaultValues: {
      ageOrDateOfOnset: "",
      pastHeadacheProblems: false,
      pastHeadacheDescription: "",
      locationOfPain: "",
      frequency: "",
      painAtPresent: 5,
      painAtWorst: 5,
      qualityDescription: "",
      timingDescription: "",
      durationDescription: "",
      triggersDescription: "",
      associatedSymptoms: "",
      reliefFactors: "",
      daysMissingWorkOrSchool: "",
      daysMissingSocialEvents: "",
    },
  });

  const onSubmit = async (data: HeadacheInfoFormData) => {
   
      setIsSubmitting(true);
      // TODO: Replace with actual API call
      // await dispatch(headacheInfoForm(data)).unwrap();
      const response = await dispatch(headacheInfoForm(data)).unwrap()
      if(response.status) {
        setIsSubmitting(false);
        toast({
          title: "Headache Information Saved",
          description: response.message,
        });
        form.reset()
        navigate("/home")
      }else{
        setIsSubmitting(false);
        toast({
          title: "Headache Information Saved",
          description: response.message,
        });
      }
      // Simulate API call
    
      
  
  };

  const painLevels = [
    { value: 0, label: "0 - No Pain" },
    { value: 1, label: "1 - Very Mild" },
    { value: 2, label: "2 - Mild" },
    { value: 3, label: "3 - Mild to Moderate" },
    { value: 4, label: "4 - Moderate" },
    { value: 5, label: "5 - Moderate to Severe" },
    { value: 6, label: "6 - Severe" },
    { value: 7, label: "7 - Very Severe" },
    { value: 8, label: "8 - Extremely Severe" },
    { value: 9, label: "9 - Excruciating" },
    { value: 10, label: "10 - Worst Possible" },
  ];

  return (
    <div className="container mx-auto py-12 px-6 max-w-5xl">
      
      <Card className="shadow-lg">
        <CardHeader className="pb-8">
          <CardTitle className="text-3xl font-bold text-center text-black mb-4">Headache Information</CardTitle>
          <CardDescription className="text-center text-lg">
            Please provide detailed information about your headache symptoms and history
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
           
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-black mb-6">Basic Information</h3>
                
                <FormField
                  control={form.control}
                  name="ageOrDateOfOnset"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-medium">When did your headaches begin?</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., 2 years ago, after car accident, etc."
                          className="h-12 text-base"
                        />
                      </FormControl>
                      <FormDescription className="text-sm">
                        Please specify when your headaches first started
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pastHeadacheProblems"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-6 bg-gray-50">
                      <div className="space-y-1">
                        <FormLabel className="text-base font-medium">Past Headache Problems</FormLabel>
                        <FormDescription className="text-sm">
                          Have you experienced headache problems before?
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

                {form.watch("pastHeadacheProblems") && (
                  <FormField
                    control={form.control}
                    name="pastHeadacheDescription"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-medium">Description of Past Headache Issues</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Please describe your past headache problems..."
                            rows={4}
                            className="text-base"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <Separator className="my-8" />

              {/* Pain Assessment */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-black mb-6">Pain Assessment</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="locationOfPain"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-medium">Location of Pain</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select pain location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            <SelectItem value="front" className="bg-white text-black hover:bg-gray-100">Front of head</SelectItem>
                            <SelectItem value="back" className="bg-white text-black hover:bg-gray-100">Back of head</SelectItem>
                            <SelectItem value="sides" className="bg-white text-black hover:bg-gray-100">Sides of head</SelectItem>
                            <SelectItem value="top" className="bg-white text-black hover:bg-gray-100">Top of head</SelectItem>
                            <SelectItem value="behind-eyes" className="bg-white text-black hover:bg-gray-100">Behind eyes</SelectItem>
                            <SelectItem value="temple" className="bg-white text-black hover:bg-gray-100">Temple area</SelectItem>
                            <SelectItem value="entire" className="bg-white text-black hover:bg-gray-100">Entire head</SelectItem>
                            <SelectItem value="other" className="bg-white text-black hover:bg-gray-100">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="frequency"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-medium">Frequency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            <SelectItem value="daily" className="bg-white text-black hover:bg-gray-100">Daily</SelectItem>
                            <SelectItem value="weekly" className="bg-white text-black hover:bg-gray-100">Weekly</SelectItem>
                            <SelectItem value="monthly" className="bg-white text-black hover:bg-gray-100">Monthly</SelectItem>
                            <SelectItem value="occasional" className="bg-white text-black hover:bg-gray-100">Occasional</SelectItem>
                            <SelectItem value="constant" className="bg-white text-black hover:bg-gray-100">Constant</SelectItem>
                            <SelectItem value="other" className="bg-white text-black hover:bg-gray-100">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <FormField
                    control={form.control}
                    name="painAtPresent"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-medium">Current Pain Level (0-10)</FormLabel>
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
                              {painLevels.find(level => level.value === field.value)?.label}
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="painAtWorst"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-medium">Worst Pain Level Since Injury (0-10)</FormLabel>
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
                              {painLevels.find(level => level.value === field.value)?.label}
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator className="my-8" />

              {/* Detailed Descriptions */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-black mb-6">Detailed Descriptions</h3>
                
                <FormField
                  control={form.control}
                  name="qualityDescription"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-medium">Quality of Headache</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe the quality of your headache (e.g., throbbing, sharp, dull, pressure, etc.)"
                          rows={4}
                          className="text-base"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timingDescription"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-medium">Timing Changes</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe how your headache changes throughout the day"
                          rows={4}
                          className="text-base"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="durationDescription"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-medium">Duration</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="How long does each headache typically last?"
                          rows={4}
                          className="text-base"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="triggersDescription"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-medium">Triggers</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="What triggers or worsens your headaches?"
                          rows={4}
                          className="text-base"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="associatedSymptoms"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-medium">Associated Symptoms</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="What other symptoms occur with your headaches?"
                          rows={4}
                          className="text-base"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reliefFactors"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base font-medium">Relief Factors</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="What helps relieve your headaches?"
                          rows={4}
                          className="text-base"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Separator className="my-8" />

              {/* Impact Assessment */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-black mb-6">Impact Assessment</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="daysMissingWorkOrSchool"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-medium">Days Missing Work/School per Month</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select days" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            <SelectItem value="0" className="bg-white text-black hover:bg-gray-100">0 days</SelectItem>
                            <SelectItem value="1-2" className="bg-white text-black hover:bg-gray-100">1-2 days</SelectItem>
                            <SelectItem value="3-5" className="bg-white text-black hover:bg-gray-100">3-5 days</SelectItem>
                            <SelectItem value="6-10" className="bg-white text-black hover:bg-gray-100">6-10 days</SelectItem>
                            <SelectItem value="11-15" className="bg-white text-black hover:bg-gray-100">11-15 days</SelectItem>
                            <SelectItem value="16-20" className="bg-white text-black hover:bg-gray-100">16-20 days</SelectItem>
                            <SelectItem value="21+" className="bg-white text-black hover:bg-gray-100">21+ days</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="daysMissingSocialEvents"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base font-medium">Days Missing Social Events per Month</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select days" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            <SelectItem value="0" className="bg-white text-black hover:bg-gray-100">0 days</SelectItem>
                            <SelectItem value="1-2" className="bg-white text-black hover:bg-gray-100">1-2 days</SelectItem>
                            <SelectItem value="3-5" className="bg-white text-black hover:bg-gray-100">3-5 days</SelectItem>
                            <SelectItem value="6-10" className="bg-white text-black hover:bg-gray-100">6-10 days</SelectItem>
                            <SelectItem value="11-15" className="bg-white text-black hover:bg-gray-100">11-15 days</SelectItem>
                            <SelectItem value="16-20" className="bg-white text-black hover:bg-gray-100">16-20 days</SelectItem>
                            <SelectItem value="21+" className="bg-white text-black hover:bg-gray-100">21+ days</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Reset Form
                </Button>
                <Button type="submit">
                  Submit Headache Information
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeadacheInfo;
