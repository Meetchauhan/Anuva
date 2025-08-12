import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { LoginForm } from "@/components/auth/admin-login-form";
import { RegisterForm } from "@/components/auth/register-form";
import useUserAuth from "@/hooks/useUserAuth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserRole } from "@/types";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const user = useUserAuth();
  console.log("user--------", user);
  
  const [, setLocation] = useLocation();

  // Redirect to appropriate dashboard if already logged in
  // useEffect(() => {
  //   if (user) {
  //     // Redirect based on user role
  //     const dashboardRoutes = {
  //       [UserRole.PROVIDER]: "/provider",
  //       [UserRole.PATIENT]: "/patient",
  //       [UserRole.CAREGIVER]: "/caregiver",
  //     };
      
  //     setLocation(dashboardRoutes[user.role] || "/");
  //   }
  // }, [user, setLocation]);

  if (user) {
    // Show loading while redirecting
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#121212]">
      {/* Left Column - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-10 lg:p-20">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2 text-white">Rudra Health Anuva OS</h1>
            <p className=" text-[#64ce9e]">Concussion Management & Neurology EHR</p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "login" | "register")}
            className="space-y-6"
          >
            <TabsList className="grid grid-cols-2 w-full bg-[#1f1f1f]">
              <TabsTrigger value="login" className="">Sign In</TabsTrigger>
              <TabsTrigger value="register">Create Account</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <div className="mb-4 p-3 bg-secondary/10 border border-secondary rounded-md">
                <h3 className="font-medium text-sm mb-2 text-white">Demo Accounts (Password: password123)</h3>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 bg-white rounded border border-primary">
                    <strong className="block text-primary">Provider</strong>
                    Username: drchen
                  </div>
                  <div className="p-2 bg-white rounded border border-primary">
                    <strong className="block text-primary">Patient</strong>
                    Username: patient
                  </div>
                  <div className="p-2 bg-white rounded border border-primary">
                    <strong className="block text-primary">Caregiver</strong>
                    Username: caregiver
                  </div>
                </div>
              </div>
              <LoginForm />
            </TabsContent>

            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Column - Hero Section */}
      <div className="flex-1 bg-[#25745033] bg-primary/20 dark:bg-primary/30 hidden md:flex items-center justify-center p-10 shadow-inner">
        <div className="max-w-lg text-center">
          <h2 className="text-3xl font-bold mb-6 text-white bg-primary px-4 py-2 rounded-lg shadow-md ">
            Rudra Health Anuva OS Platform
          </h2>
          <div className="space-y-6 text-lg">
            <div className="p-4 bg-white rounded-lg shadow-md border border-accent">
              <h3 className="font-semibold text-xl mb-2 text-primary">For Healthcare Providers</h3>
              <p className="text-black text-base font-medium">
                Comprehensive tools for tracking patients, monitoring recovery,
                and documenting neurological assessments.
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-md border border-accent">
              <h3 className="font-semibold text-xl mb-2 text-primary">For Patients</h3>
              <p className="text-black text-base font-medium">
                Track your symptoms, monitor your recovery progress,
                and stay connected with your healthcare team.
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-md border border-accent">
              <h3 className="font-semibold text-xl mb-2 text-primary">For Caregivers</h3>
              <p className="text-black text-base font-medium">
                Help manage recovery for your loved ones with monitoring tools
                and seamless communication with providers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}