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
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { loginMutation } = useAuth();
  
  // Use the isPending state from the loginMutation
  const isLoading = loginMutation.isPending;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "drchen", // Pre-fill with demo account
      password: "password", // Pre-fill with demo password (from demo accounts shown below)
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    // Use the loginMutation provided by the auth context
    loginMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Sign in to your account</h2>
        <p className="text-sm text-muted-foreground">
          Enter your username and password to sign in
        </p>
      </div>

      {loginMutation.error && (
        <div className="p-3 rounded-md bg-destructive/15 text-destructive text-sm">
          {loginMutation.error instanceof Error 
            ? loginMutation.error.message 
            : "Login failed. Please try again with drchen/password."}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your username"
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
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
        <p className="text-muted-foreground">
          Demo accounts: <br />
          Provider: drchen / password <br />
          Patient: patient / password <br />
          Caregiver: caregiver / password
        </p>
      </div>
    </div>
  );
}