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
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { patientInfoForm } from "@/features/intakeFormSlice/patientInfoSlice"
import { toast } from "@/hooks/use-toast"
import { navigate } from "wouter/use-browser-location"

// Zod schema for patient information validation
const patientInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(100, "Full name must be less than 100 characters"),
  dateOfExamination: z.date({
    required_error: "Date of examination is required",
  }),
  race: z.string().min(1, "Race is required").max(50, "Race must be less than 50 characters"),
  maritalStatus: z.enum(["single", "married", "widowed", "divorced"], {
    required_error: "Marital status is required",
  }),
  numberOfChildren: z.number().min(0, "Number of children cannot be negative").max(20, "Number of children seems unrealistic"),
  hearingImpairment: z.boolean().default(false),
  hearingAids: z.boolean().default(false),
  glassesOrContacts: z.boolean().default(false),
  occupation: z.string().min(1, "Occupation is required").max(100, "Occupation must be less than 100 characters"),
  employer: z.string().max(100, "Employer must be less than 100 characters").optional(),
  employerAddress: z.string().max(255, "Employer address must be less than 255 characters").optional(),
  enrolledInSchool: z.boolean().default(false),
  school: z.string().max(100, "School name must be less than 100 characters").optional(),
})

type PatientInfoFormData = z.infer<typeof patientInfoSchema>

const PatientInfo = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const form = useForm<PatientInfoFormData>({
    resolver: zodResolver(patientInfoSchema),
    defaultValues: {
      fullName: "",
      dateOfExamination: new Date(),
      race: "",
      maritalStatus: "single",
      numberOfChildren: 0,
      hearingImpairment: false,
      hearingAids: false,
      glassesOrContacts: false,
      occupation: "",
      employer: "",
      employerAddress: "",
      enrolledInSchool: false,
      school: "",
    },
  })

  const onSubmit = async (data: PatientInfoFormData) => {
    // Format the date to YYYY-MM-DD format
    setIsSubmitting(true);
    const formattedData = {
      ...data,
      dateOfExamination: format(data.dateOfExamination, 'yyyy-MM-dd')
    }
    const response = await dispatch(patientInfoForm(formattedData)).unwrap()

    if(response.status) {
      setIsSubmitting(false);
      form.reset()
      navigate("/home")
      toast({
        title: "Patient information submitted successfully",
        description: response.message || "Patient information has been submitted successfully",
      })
    } else {
      setIsSubmitting(false);
      toast({
        title: "Failed to submit patient information",
        description: "Failed to submit patient information",
      })
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
       
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Patient Information Form</CardTitle>
          <CardDescription className="text-center">
            Please fill out all required fields for patient registration and demographic information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information Section */}
             
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter patient's full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dateOfExamination"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Examination *</FormLabel>
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
                              // disabled={(date) =>
                              //   date > new Date() || date < new Date("1900-01-01")
                              // }
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
                    name="race"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Race *</FormLabel>
                        <Select onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger className="bg-white text-black">
                              <SelectValue className="text-black hover:bg-white hover:text-black" placeholder="Select race" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="White">White</SelectItem>
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="Black or African American">Black or African American</SelectItem>
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="Hispanic or Latino">Hispanic or Latino</SelectItem>
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="Asian">Asian</SelectItem>
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="Native American or Alaska Native">Native American or Alaska Native</SelectItem>
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="Native Hawaiian or Pacific Islander">Native Hawaiian or Pacific Islander</SelectItem>
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="Multiracial">Multiracial</SelectItem>
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="Other">Other</SelectItem>
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="Prefer not to say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maritalStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marital Status *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={'single'}>
                          <FormControl>
                            <SelectTrigger className="bg-white text-black">
                              <SelectValue placeholder="Select marital status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white">
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="single">Single</SelectItem>
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="married">Married</SelectItem>
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="widowed">Widowed</SelectItem>
                            <SelectItem className="text-black bg-white hover:bg-gray-100 hover:text-black border-none" value="divorced">Divorced</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="numberOfChildren"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Children</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the number of children (0 if none)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Health Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Health Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="hearingImpairment"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Hearing Impairment</FormLabel>
                          <FormDescription>
                            Does the patient have hearing impairment?
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hearingAids"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Hearing Aids</FormLabel>
                          <FormDescription>
                            Does the patient use hearing aids?
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="glassesOrContacts"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Glasses or Contacts</FormLabel>
                          <FormDescription>
                            Does the patient wear glasses or contacts?
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Employment Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Employment Information</h3>
                
                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter patient's occupation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="employer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employer</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter employer name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="employerAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employer Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter employer address" 
                            className="resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Education Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Education Information</h3>
                
                <FormField
                  control={form.control}
                  name="enrolledInSchool"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Enrolled in School</FormLabel>
                        <FormDescription>
                          Is the patient currently enrolled in school?
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("enrolledInSchool") && (
                  <FormField
                    control={form.control}
                    name="school"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>School Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter school name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6">
                <Button type="button" variant="outline" onClick={() => form.reset()}>
                  Reset Form
                </Button>
                <Button type="submit">
                  Submit Patient Information
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default PatientInfo