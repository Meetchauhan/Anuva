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
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getAdminProfile, loginAdmin } from "@/features/adminAuthSlice";
import { toast } from "@/hooks/use-toast";
import { navigate } from "wouter/use-browser-location";

// Login form schema
const loginSchema = z.object({
  userName: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
      // const { loginMutation } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const loginMutation = useSelector((state: RootState) => state.adminAuth.loading);
  
  // Use the isPending state from the loginMutation
  const isLoading = loginMutation;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      userName: "drchen", // Pre-fill with demo account
      password: "password", // Pre-fill with demo password (from demo accounts shown below)
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    // Use the loginMutation provided by the auth context
    const response = await dispatch(loginAdmin({ userName: data.userName, password: data.password })).unwrap();
    console.log("response admin login form", response);
    // if(response.status === "success"){
      sessionStorage.setItem("adminAuthToken", response.token);
      toast({
        title: response.message,
        description: "Welcome to dashboard",
      });
      await dispatch(getAdminProfile());
      navigate("/admin/dashboard");
    }
  // };


  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-white">Sign in to your account</h2>
        <p className="text-sm  text-[#64ce9e]">
          Enter your username and password to sign in
        </p>
      </div>

      {/* {loginMutation.error && (
        <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm">
          {loginMutation.error instanceof Error 
            ? loginMutation.error.message 
            : "Login failed. Please try again with drchen/password."}
        </div>
      )} */}

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
                    placeholder="Enter your username"
                    {...field}
                    disabled={isLoading}
                    className="bg-black placeholder:text-[#64ce9e] text-white"
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
                    placeholder="Enter your password"
                    {...field}
                    disabled={isLoading}
                    className="bg-black placeholder:text-[#64ce9e] text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-[#257450] hover:bg-[#257450e6]" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <p className=" text-[#64ce9e]">
          Demo accounts: <br />
          Provider: drchen / password <br />
          Patient: patient / password <br />
          Caregiver: caregiver / password
        </p>
      </div>
    </div>
  );
}