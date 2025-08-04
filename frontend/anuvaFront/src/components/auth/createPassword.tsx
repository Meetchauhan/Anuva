import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Mail, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AuthContext } from "@/context/auth-context";
import { useLocation } from "wouter";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { authLogin, getUser } from "@/features/authSlice";

const createPasswordSchema = z.object({
  patientId: z.string().min(1, "Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
});

type CreatePasswordFormData = z.infer<typeof createPasswordSchema>;

interface LoginFormProps {
  onLoginSuccess: () => void;
  onSwitchToSignup: () => void;
}

export default function CreatePassword() {
  const [, navigate] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  // const auth = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  // console.log("isToken---", auth);
  
  
  const { register, handleSubmit, formState: { errors } } = useForm<CreatePasswordFormData>({
    resolver: zodResolver(createPasswordSchema)
  });
  // const { isAuthenticated } = useAuth();

    const onSubmit = async (data: CreatePasswordFormData) => {
    setIsLoading(true);
    try {
      console.log('Attempting create password with:', { patientId: data.patientId, password: '***' });
      
      const result = await dispatch(authLogin(data)).unwrap();
  
      console.log('Create password result:', result);
      sessionStorage.setItem('authToken', result.token);
           
      if (result?.token) {
        navigate("/home");
        dispatch(getUser());
        // sessionStorage.setItem('authToken', result.token);
        console.log('Token set in sessionStorage:', result.token);
      } else {
        console.log('No token in response:', result);
      }


      toast({
        title: "Create Password",
        description: "Successfully created password.",
      });
     
      // Call onLoginSuccess after token is set
      // onLoginSuccess();
    } catch (error) {
      console.error('Create password error:', error);
      toast({
        title: "Create Password Failed",
        description: error instanceof Error ? error.message : "Invalid patient ID or password",
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
            <LogIn className="w-8 h-8 text-[#1F5A42]" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900">Create Password</CardTitle>
        <p className="text-gray-600">Create a password to access your healthcare dashboard</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patientId" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Patient ID
            </Label>
            <Input
              id="patientId"
              type="patientId"
              placeholder="Enter your patient ID"
              {...register("patientId")}
              className={"bg-white text-black"}
            />
            {errors.patientId && (
              <p className="text-sm text-red-500">{errors.patientId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#1F5A42] hover:bg-[#154734] text-white"
            disabled={isLoading}
          >
            {isLoading ? "Creating Password..." : "Create Password"}
          </Button>



          <div className="text-center space-y-2">
            <button
              type="button"
              className="text-sm text-gray-500 hover:text-[#1F5A42] underline"
            >
              Forgot your password?
            </button>
            
            <div>
              <button
                type="button"
                // onClick={onSwitchToSignup}
                className="text-sm text-[#1F5A42] hover:text-[#154734] underline"
              >
                Already have an account? Sign in 
              </button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}