"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "@/store/store"
import { toast } from "@/hooks/use-toast"
import { navigate } from "wouter/use-browser-location"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Clock, RefreshCw, CheckCircle } from "lucide-react"
import { resendOtp, verifyOtp } from "@/features/authSlice"
import useUserAuth from "@/hooks/useUserAuth"

// Zod schema for OTP validation (no error messages displayed)
const otpSchema = z.object({
  otp: z.string()
    .min(4)
    .max(4)
    .regex(/^\d{4}$/)
    .refine((val) => val.length === 4),
})

type OtpFormData = z.infer<typeof otpSchema>

const VerifyOtp = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true); // Start disabled
  const [countdown, setCountdown] = useState(60); // Start with 60 seconds
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 3;

  const form = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  })
const patientId = useUserAuth();

  // Countdown timer for resend functionality
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setResendDisabled(false);
      setCountdown(0);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const startResendCountdown = () => {
    setCountdown(60); // 60 seconds countdown
    setResendDisabled(true);
  };

  // Initialize countdown on component mount
  React.useEffect(() => {
    startResendCountdown();
  }, []);

  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      await dispatch(resendOtp({ patientId: (patientId as any)?.patientId || "" })).unwrap();
      
      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your registered email/phone",
      });
      
      startResendCountdown();
    } catch (error) {
      toast({
        title: "Failed to resend OTP",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (data: OtpFormData) => {
    try {
      setIsVerifying(true);
      const response = await dispatch(
        verifyOtp({ otp: data.otp, patientId: (patientId as any)?.patientId || "" })
      ).unwrap();
      console.log("response", response);
      if (response?.status) {
        sessionStorage.setItem("authToken", response?.token);
        toast({
          title: "OTP Verified Successfully",
          description: "Welcome to AnuvaConnect",
        });
        navigate("/home");
        form.reset();
      } else {
        toast({
          title: response?.message,
          description: "Please try again",
          variant: "destructive",
        });
        form.reset();
      }
    } catch (error) {
      
      toast({
        title: "Verification Failed",
        description: "Please try again later",
        variant: "destructive",
      });
      form.reset();
    } finally {
      setIsVerifying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-[#1F5A42] font-bold">Verify Your Account</CardTitle>
          <CardDescription>
            We've sent a 4-digit verification code to your registered email/phone number
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* OTP Input */}
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter OTP</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="0000"
                        maxLength={4}
                        className="text-center text-2xl font-mono tracking-widest"
                        autoComplete="one-time-code"
                        disabled={isVerifying}
                        onChange={(e) => {
                          // Only allow numbers
                          const value = e.target.value.replace(/\D/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                  Enter the 4-digit code sent to your device
                </FormDescription>
                  </FormItem>
                )}
              />

              {/* Attempts Warning */}
              {attempts > 0 && attempts < maxAttempts && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {maxAttempts - attempts} attempts remaining
                  </AlertDescription>
                </Alert>
              )}

              {/* Max Attempts Warning */}
              {attempts >= maxAttempts && (
                <Alert variant="destructive">
                  <AlertDescription>
                    You have exceeded the maximum number of attempts. Please request a new OTP.
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isVerifying || attempts >= maxAttempts}
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>

              {/* Resend OTP Section */}
              <div className="text-center space-y-4">
                <div className="text-sm text-gray-600">
                  Didn't receive the code?
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendOtp}
                  disabled={resendDisabled || isResending}
                  className="w-full"
                >
                  {resendDisabled ? (
                    <>
                      <Clock className="mr-2 h-4 w-4" />
                      Resend OTP in {formatTime(countdown)}
                    </>
                  ) : isResending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resend OTP
                    </>
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

export default VerifyOtp;
