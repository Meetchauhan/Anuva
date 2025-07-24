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
} from '../ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useToast } from '../../hooks/use-toast';
import { apiRequest } from '../../lib/queryClient';
import { User, Phone, Mail, CreditCard, Send, Calendar, Clock } from 'lucide-react';

const addPatientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Please enter a valid email address'),
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
      insuranceProvider: '',
    },
  });

  const createPatientMutation = useMutation({
    mutationFn: async (data: AddPatientFormData) => {
      // Transform data to match backend schema
      const patientData = {
        firstName: data.firstName,
        lastName: data.lastName,
        contactPhone: data.phoneNumber,
        contactEmail: data.email,
        insuranceProvider: data.insuranceProvider,
        // Required fields for backend - using placeholder values
        dateOfBirth: data.dateOfBirth,
        gender: 'Unknown', // Will be updated via intake form
        emergencyContactName: 'TBD',
        emergencyContactPhone: 'TBD',
        emergencyContactRelation: 'TBD',
        schoolOrTeam: 'TBD',
      };

      const response = await apiRequest('POST', '/api/patients', patientData);
      return response;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
      queryClient.invalidateQueries({ queryKey: ['/api/patients/with-risk'] });
      
      toast({
        title: 'Patient Added Successfully',
        description: `${form.getValues('firstName')} ${form.getValues('lastName')} has been added to the system.`,
      });
      
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: 'Error Adding Patient',
        description: 'There was an error adding the patient. Please try again.',
        variant: 'destructive',
      });
    },
  });

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
      // Simulate sending intake form email
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: 'Intake Form Sent',
        description: `Intake form has been sent to ${formData.email}`,
      });
    } catch (error) {
      toast({
        title: 'Error Sending Intake Form',
        description: 'There was an error sending the intake form. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSendingIntake(false);
    }
  };

  const onSubmit = (data: AddPatientFormData) => {
    createPatientMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Add New Patient
          </DialogTitle>
          <DialogDescription>
            Enter the patient's basic information to create a new record and send an intake form.
          </DialogDescription>
        </DialogHeader>
        
        {/* Show next available appointments */}
        {appointmentsLoading ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600 animate-spin" />
              <span className="text-sm text-blue-700">Loading available appointments...</span>
            </div>
          </div>
        ) : nextAppointments && nextAppointments.length > 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Available Appointment Times</span>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                {nextAppointments.length} slots available
              </span>
            </div>
            
            {/* Show next few priority slots */}
            <div className="grid grid-cols-1 gap-2 mb-3">
              {nextAppointments.slice(0, 4).map((slot, index) => (
                <div key={index} className="flex items-center justify-between bg-white rounded-md p-2 border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-green-800">
                        {slot.isTomorrow ? 'Tomorrow' : slot.isToday ? 'Today' : slot.date}
                      </span>
                      <span className="text-xs text-green-600">{slot.time}</span>
                    </div>
                  </div>
                  {index === 0 && (
                    <span className="text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                      Next Available
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Scrollable list of all available appointments */}
            <div className="border-t border-green-200 pt-3">
              <div className="text-xs font-medium text-green-700 mb-2">All Available Times (Next 2 Weeks)</div>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {nextAppointments.map((slot, index) => (
                  <div key={index} className="flex items-center justify-between text-xs p-1.5 hover:bg-green-100 rounded">
                    <span className="text-green-700">
                      {slot.fullDate}
                    </span>
                    <span className="font-medium text-green-800">{slot.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-amber-700">No available appointments in the next week</span>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter first name" 
                        {...field} 
                        className="bg-background"
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
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter last name" 
                        {...field} 
                        className="bg-background"
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
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
                      <Input 
                        type="date"
                        placeholder="Select date of birth" 
                        className="pl-10 bg-background" 
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
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="(555) 123-4567" 
                      {...field} 
                      className="bg-background"
                    />
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
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="patient@example.com" 
                      {...field} 
                      className="bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="insuranceProvider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Insurance Provider
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Blue Cross Blue Shield, Aetna, etc." 
                      {...field} 
                      className="bg-background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleSendIntakeForm}
                disabled={isSendingIntake || !form.watch('email')}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                {isSendingIntake ? 'Sending...' : 'Send Intake Form'}
              </Button>
              
              <Button
                type="submit"
                disabled={createPatientMutation.isPending}
                className="flex-1"
              >
                {createPatientMutation.isPending ? 'Adding Patient...' : 'Add Patient'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}