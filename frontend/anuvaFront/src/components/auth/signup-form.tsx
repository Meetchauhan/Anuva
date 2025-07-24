import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Calendar, Mail, Phone, User } from "lucide-react";

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSignupSuccess: () => void;
  onSwitchToLogin: () => void;
}

export default function SignupForm({ onSignupSuccess, onSwitchToLogin }: SignupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema)
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth,
          email: data.email,
          phoneNumber: data.phoneNumber,
          password: data.password
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }

      toast({
        title: "Account Created Successfully",
        description: "Welcome to AnuvaConnect! You can now access your healthcare dashboard.",
      });

      onSignupSuccess();
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "An error occurred during signup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-[#1F5A42]/10 rounded-full">
            <UserPlus className="w-8 h-8 text-[#1F5A42]" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">Create Your Account</CardTitle>
        <p className="text-gray-600">Join AnuvaConnect for personalized healthcare management</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="John"
                {...register("firstName")}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Doe"
                {...register("lastName")}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Date of Birth
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              {...register("dateOfBirth")}
              className={errors.dateOfBirth ? "border-red-500" : ""}
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="(555) 123-4567"
              {...register("phoneNumber")}
              className={errors.phoneNumber ? "border-red-500" : ""}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a secure password"
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              {...register("confirmPassword")}
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#1F5A42] hover:bg-[#154734] text-white"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-sm text-[#1F5A42] hover:text-[#154734] underline"
            >
              Already have an account? Sign in
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}