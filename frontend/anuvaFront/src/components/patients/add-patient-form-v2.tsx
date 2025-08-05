import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { User, Phone, Mail, CreditCard, Send, Calendar, Clock } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { createPatient, fetchPatients } from '@/features/patientSlice';
import { usePatient } from '@/hooks/usePatient';

const addPatientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Please enter a valid email address'),
  // password: z.string().min(6, 'Password must be at least 6 characters'),
  insuranceProvider: z.string().min(1, 'Insurance provider is required'),
});

type AddPatientFormData = z.infer<typeof addPatientSchema>;

interface AddPatientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPatientForm({ open, onOpenChange }: AddPatientFormProps) {
  const [isSendingIntake, setIsSendingIntake] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const dispatch = useDispatch<AppDispatch>();

  // Fetch next available appointments when dialog opens
  const { data: nextAppointments, isLoading: appointmentsLoading } = useQuery<{
    dateTime: string;
    date: string;
    fullDate: string;
    time: string;
    isToday: boolean;
    isTomorrow: boolean;
  }[]>({
    queryKey: ['/api/appointments/next-available'],
    enabled: open,
  });

  const form = useForm<AddPatientFormData>({
    resolver: zodResolver(addPatientSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      phoneNumber: '',
      email: '',   
      // password: '',
      insuranceProvider: '',
    },
  });

  const { loading, error } = usePatient();

  // const createPatientMutation = useMutation({
  //   mutationFn: async (data: AddPatientFormData) => {
  //     const response = await apiRequest('POST', '/api/patients', {
  //       firstName: data.firstName,
  //       lastName: data.lastName,
  //       contactPhone: data.phoneNumber,
  //       contactEmail: data.email,
  //       password: data.password,
  //       insuranceProvider: data.insuranceProvider,
  //       dateOfBirth: data.dateOfBirth,
  //       gender: 'Unknown',
  //       emergencyContactName: 'TBD',
  //       emergencyContactPhone: 'TBD',
  //       emergencyContactRelation: 'TBD',
  //     });
  //     return response;
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
  //     queryClient.invalidateQueries({ queryKey: ['/api/patients/with-risk'] });
      
  //     toast({
  //       title: 'Patient Added Successfully',
  //       description: `${form.getValues('firstName')} ${form.getValues('lastName')} has been added to the system.`,
  //     });

  //     form.reset();
  //     onOpenChange(false);
  //   },
  //   onError: (error: any) => {
  //     toast({
  //       title: 'Error Adding Patient',
  //       description: error.message || 'Failed to add patient. Please try again.',
  //       variant: 'destructive',
  //     });
  //   },
  // });

  const handleSendIntakeForm = async () => {
    const formData = form.getValues();
    
    if (!formData.email) {
      toast({
        title: 'Email Required',
        description: 'Please enter an email address to send the intake form.',
        variant: 'destructive',
      });
      return;
    }

    setIsSendingIntake(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Intake Form Sent',
        description: `Intake form has been sent to ${formData.email}`,
      });
    } catch (error) {
      toast({
        title: 'Error Sending Intake Form',
        description: 'Failed to send intake form. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSendingIntake(false);
    }
  };

  const onSubmit = async (data: AddPatientFormData) => {
    try {
      const result = await dispatch(createPatient(data)).unwrap();
      console.log("result", result);
      
      if(result?.status){
        await dispatch(fetchPatients()).unwrap();
        form.reset();
        onOpenChange(false);
        toast({
          title: "Patient Added",
          description: "Successfully Patient Added.",
        });
      } else {
        toast({
          title: "Error Adding Patient",
          description: result?.message || "Failed to add patient. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error creating patient:", error);
      toast({
        title: "Error Adding Patient",
        description:  "Failed to add patient. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-[#121212]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <User className="h-5 w-5 text-white" />
            Add New Patient
          </DialogTitle>
          <DialogDescription className="text-[#64ce9e]">
            Quick patient registration with appointment scheduling
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6 mt-4">
          {/* Left Column - Patient Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4 text-[#257450]" />
              <h3 className="font-semibold text-white">Patient Information</h3>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">First Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter first name" 
                            {...field} 
                            className="bg-[#121212] text-white placeholder:text-[#64ce9e]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Last Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter last name" 
                            {...field} 
                            className="bg-[#121212] text-white placeholder:text-[#64ce9e]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      
                      <FormLabel className="text-white flex gap-2">
                        Date of Birth</FormLabel>
                      <FormControl>
                        
                        <Input 
                          type="date"
                          {...field} 
                          className="bg-[#121212] text-white placeholder:text-[#64ce9e] [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-0 [&::-webkit-calendar-picker-indicator]:contrast-100"
                        />
                        
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                          <Input 
                            placeholder="(555) 123-4567" 
                            className="pl-10 bg-[#121212] text-white placeholder:text-[#64ce9e]" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                          <Input 
                            type="email"
                            placeholder="patient@example.com" 
                            className="pl-10 bg-[#121212] text-white placeholder:text-[#64ce9e]" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 {/* <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">Password</FormLabel>
                        <FormControl>
                          <Input 
                          type='password'
                            placeholder="Enter password" 
                            {...field} 
                            className="bg-[#121212] text-white placeholder:text-[#64ce9e]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}

                <FormField
                  control={form.control}
                  name="insuranceProvider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Insurance Provider</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                          <Input 
                            placeholder="e.g., Blue Cross Blue Shield" 
                            className="pl-10 bg-[#121212] text-white placeholder:text-[#64ce9e]" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-3 pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-[#257450] text-white"
                    disabled={loading}
                  >
                    {loading ? 'Adding Patient...' : 'Add Patient'}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleSendIntakeForm}
                    disabled={isSendingIntake || !form.getValues('email')}
                    className="w-full"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {isSendingIntake ? 'Sending...' : 'Send Intake Form'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Right Column - Appointment Scheduling */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-white">Available Appointments</h3>
            </div>

            {appointmentsLoading ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-600 animate-spin" />
                  <span className="text-sm text-blue-700">Loading appointments...</span>
                </div>
              </div>
            ) : nextAppointments && nextAppointments.length > 0 ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-green-800 text-sm">Next Available</span>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {nextAppointments.length} slots
                  </span>
                </div>
                
                {/* Priority slots - reduced to 2 to save space */}
                <div className="space-y-2 mb-3">
                  {nextAppointments.slice(0, 2).map((slot, index) => (
                    <div key={index} className="bg-white rounded-md p-2 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-green-800 text-sm">
                            {slot.isTomorrow ? 'Tomorrow' : slot.isToday ? 'Today' : slot.date}
                          </div>
                          <div className="text-xs text-green-600">{slot.time}</div>
                        </div>
                        {index === 0 && (
                          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                            Next
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Compact view of more times */}
                <div className="border-t border-green-200 pt-2">
                  <div className="text-xs font-medium text-green-700 mb-1">More Available Times</div>
                  <div className="max-h-24 overflow-y-auto space-y-1">
                    {nextAppointments.slice(2, 8).map((slot, index) => (
                      <div key={index} className="flex justify-between text-xs p-1 hover:bg-green-100 rounded">
                        <span className="text-green-700">{slot.date}</span>
                        <span className="font-medium text-green-800">{slot.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span className="text-sm text-amber-700">No appointments available</span>
                </div>
              </div>
            )}
            

            {/* Compact scheduling note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
              <div className="text-xs text-blue-700">
                <div className="font-medium">Scheduling Tip</div>
                <div>Schedule appointment after adding patient</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}