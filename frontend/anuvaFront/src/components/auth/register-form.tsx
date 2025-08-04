import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types";
import { useDispatch } from "react-redux";
import { signupAdmin } from "@/features/adminAuthSlice";
import { AppDispatch } from "@/store/store";
import { toast } from "@/hooks/use-toast";
import { navigate } from "wouter/use-browser-location";

// Registration form schema
const registerSchema = z.object({
  userName: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  // role: z.enum([UserRole.PROVIDER, UserRole.PATIENT, UserRole.CAREGIVER]),
  phoneNumber: z.string().optional(),
  speciality: z.string().optional(),
  licenseNumber: z.string().optional(),
  // relationToPatient: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { registerMutation } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userName: "",
      password: "",
      fullName: "",
      email: "",
      // role: UserRole.PATIENT,
      phoneNumber: "",
      speciality: "",
      licenseNumber: "",
      // relationToPatient: "",
    },
  });

  const selectedRole = form.watch("role");

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    

    try {
      const response = await dispatch(signupAdmin(data)).unwrap();
      if(response.status){
        sessionStorage.setItem("adminAuthToken", response.token);
        toast({
          title: response.message,
          description: "Please login to continue",  
        });
        navigate("/admin/dashboard");
      }else{
        toast({
          title: "Registration failed",
          description: response.message,
        });
      }
      console.log("response", response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Create an account</h2>
        <p className="text-sm  text-[#64ce9e]">
          Enter your information to create an account
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter a username"
                    {...field}
                    disabled={isLoading}
                    // className="placeholder:text-[#64ce9e] bg-black focus:outline-none focus-visible:ring-2 "
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Create a password"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    {...field}
                    disabled={isLoading}
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
                <FormLabel className="text-white">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Role</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={UserRole.PROVIDER}>Healthcare Provider</SelectItem>
                    <SelectItem value={UserRole.PATIENT}>Patient</SelectItem>
                    <SelectItem value={UserRole.CAREGIVER}>Caregiver</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* {selectedRole === UserRole.PROVIDER && (
            <>
              <FormField
                control={form.control}
                name="speciality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Speciality</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E.g., Neurology, Sports Medicine"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">License Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your license number"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {selectedRole === UserRole.CAREGIVER && (
            <FormField
              control={form.control}
              name="relationToPatient"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Relation to Patient</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="E.g., Parent, Spouse, Child"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )} */}

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">Phone Number (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your phone number"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-[#257450] hover:bg-[#257450e6]" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}