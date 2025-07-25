import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Admin context/providers
import { SettingsProvider } from "./context/settings-context";
import { AuthProvider } from "./context/auth-context";
import { ProtectedRoute } from "./components/auth/protected-route";
import { UserRole } from "./types/user-roles";

// User auth hook
import { useAuth, useUserAuth } from "@/hooks/useAuth";

// Layouts
import AppLayout from "@/layouts/app-layout";

// Admin Pages
import Dashboard from "@/pages/dashboard";
import Patients from "@/pages/patients";
import PatientDetail from "@/pages/patient-detail";
import PatientAnalytics from "@/pages/patient-analytics";
import PatientDashboard from "@/pages/patient-dashboard";
import CaregiverDashboard from "@/pages/caregiver-dashboard";
import Settings from "@/pages/admin-settings";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";
import IntakeFormPage from "@/pages/intake-form";

// User Pages
import Landing from "@/pages/landing";
import Auth from "@/pages/auth";
import Home from "@/pages/home";
import Analytics from "@/pages/analytics";
import UserSettings from "@/pages/settings"; // To avoid conflict with admin Settings

// This function determines if the layout should be applied 
// (layouts are only used for authenticated routes)
function AppWithConditionalLayout({ children }: { children: React.ReactNode }) {
  return (
    <Switch>
      <Route path="/admin/auth">
        {children}
      </Route>
      <Route>
        <AppLayout>{children}</AppLayout>
      </Route>
    </Switch>
  );
}

// User Router logic
function UserRouter() {
  const { isAuthenticated, isLoading } = useAuth();
  const { isToken } = useUserAuth();

  console.log("isToken", isToken);

  return (
    <Switch>
      <Route path="/auth" component={Auth} />
      <Route path="/admin/auth" component={AuthPage} />
      <Route path="/admin/intake-form" component={IntakeFormPage} />
      <Route path="/admin/dashboard" component={Dashboard} />
      <Route path="/admin/patients" component={Patients} />
      <Route path="/admin/patients/:id" component={PatientDetail} />
      <Route path="/admin/analytics" component={PatientAnalytics} />
      <Route path="/admin/settings" component={Settings} />
      <Route path="/admin/patient" component={PatientDashboard} />
      {isLoading ? (
        <Route path="*">
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        </Route>
       ) : !isToken ? ( 
        <>
          <Route path="/" component={Landing} />
           <Route component={Landing} /> 
           </>
       ) : (
        <>
           <Route path="/" component={Home} /> 

          <Route path="/home" component={Home} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/settings" component={UserSettings} />
           {/* <Route path="/admin/auth" component={AuthPage} /> */}
          <Route component={NotFound} />
          </>
      )} 
    </Switch>
  );
}

function App() {
  // You can use a prop, env, or context to determine which mode to use (admin/user)
  // For demonstration, let's use a simple variable:
  const isAdminApp = window.location.pathname.startsWith("/admin"); // or any other logic

  // if (isAdminApp) {
  //   return (
  //     <QueryClientProvider client={queryClient}>
  //       <AuthProvider>
  //         <SettingsProvider>
  //           <TooltipProvider>
  //             <Switch>
  //               <Route path="/admin/intake-form" component={IntakeFormPage} />
  //               <Route>
  //                 <AppWithConditionalLayout>
  //                   <Switch>
  //                     {/* Public Routes */}
  //                     <Route path="/admin/auth" component={AuthPage} />

  //                     {/* Provider-specific Routes */}
  //                     <ProtectedRoute path="/admin/dashboard" allowedRoles={[UserRole.PROVIDER]}>
  //                       <Dashboard />
  //                     </ProtectedRoute>
  //                     <ProtectedRoute path="/admin/provider" allowedRoles={[UserRole.PROVIDER]}>
  //                       <Dashboard />
  //                     </ProtectedRoute>
  //                     <ProtectedRoute path="/admin/patients" allowedRoles={[UserRole.PROVIDER]}>
  //                       <Patients />
  //                     </ProtectedRoute>
  //                     <ProtectedRoute path="/admin/patients/:id" allowedRoles={[UserRole.PROVIDER]}>
  //                       <PatientDetail />
  //                     </ProtectedRoute>
  //                     <ProtectedRoute path="/admin/analytics" allowedRoles={[UserRole.PROVIDER]}>
  //                       <PatientAnalytics />
  //                     </ProtectedRoute>
  //                     <ProtectedRoute path="/admin/settings" allowedRoles={[UserRole.PROVIDER]}>
  //                       <Settings />
  //                     </ProtectedRoute>

  //                     {/* Patient Dashboard */}
  //                     <ProtectedRoute path="/admin/patient" allowedRoles={[UserRole.PATIENT]}>
  //                       <PatientDashboard />
  //                     </ProtectedRoute>

  //                     {/* Caregiver Dashboard */}
  //                     <ProtectedRoute path="/admin/caregiver" allowedRoles={[UserRole.CAREGIVER]}>
  //                       <CaregiverDashboard />
  //                     </ProtectedRoute>

  //                     {/* Not Found */}
  //                     <Route component={NotFound} />
  //                   </Switch>
  //                 </AppWithConditionalLayout>
  //               </Route>
  //             </Switch>
  //             <Toaster />
  //           </TooltipProvider>
  //         </SettingsProvider>
  //       </AuthProvider>
  //     </QueryClientProvider>
  //   );
  // }

  // User App
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SettingsProvider>
          <TooltipProvider>
            <Toaster />
            <UserRouter />
          </TooltipProvider>
        </SettingsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;