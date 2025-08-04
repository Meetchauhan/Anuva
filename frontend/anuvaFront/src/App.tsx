import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Route, Switch, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

// Admin context/providers
import { SettingsProvider } from "./context/settings-context";
import { AuthProvider } from "./context/auth-context";
import { AdminPrivateRoute, UserPrivateRoute, AuthRoute } from "./components/privateRoute/privateRoute";
import { UserRole } from "./types/user-roles";

// User auth hook
import { useAuth } from "@/hooks/useAuth";
import useUserAuth from "@/hooks/useUserAuth";

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
import { Provider } from "react-redux";
import  store  from "./store/store";

// Redirect component to handle automatic redirection based on token
function AutoRedirect() {
  const [, setLocation] = useLocation();
  const userAuth = useUserAuth();
  
  useEffect(() => {
    const adminToken = sessionStorage.getItem("adminAuthToken");
    const userToken = sessionStorage.getItem("authToken");
    
    if (adminToken) {
      setLocation("/admin/dashboard");
    } else if (userToken) {
      // Check if user has filled intake form before redirecting to home
      const user = (userAuth as any)?.user;
      if (user && user?.isIntakeFormFilled === false) {
        setLocation("/intake-form");
      } else {
        setLocation("/home");
      }
    } else {
      setLocation("/");
    }
  }, [setLocation, userAuth]);
  
  return null;
}

// This function determines if the layout should be applied
// (layouts are only used for authenticated routes)
function AppWithConditionalLayout({ children }: { children: React.ReactNode }) {
  return (
    <Switch>
      <Route path="/admin/auth">{children}</Route>
      <Route path="/auth">{children}</Route>
      <Route>
        <AppLayout>{children}</AppLayout>
      </Route>
    </Switch>
  );
}

// Component to handle intake form redirection
function IntakeFormRedirect({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const userAuth = useUserAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [canAccess, setCanAccess] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated and has not filled intake form
    const user = (userAuth as any)?.user;
    console.log("IntakeFormRedirect - userAuth:", userAuth);
    console.log("IntakeFormRedirect - user:", user);
    console.log("IntakeFormRedirect - isIntakeFormFilled:", user?.isIntakeFormFilled);
    
    if (user) {
      if (user?.isIntakeFormFilled === false && location !== "/intake-form") {
        console.log("Redirecting to intake form");
        setLocation("/intake-form");
        return;
      } else {
        setCanAccess(true);
      }
    } else {
      setCanAccess(true);
    }
    
    setIsChecking(false);
  }, [userAuth, setLocation, location]);
  
  // Show loading while checking
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Only render children if user can access the page
  return canAccess ? <>{children}</> : null;
}

// User Router logic
function UserRouter() {
  const userAuth = useUserAuth();
  
  return (
    <Switch>
      {/* Auth Routes - Prevent authenticated users from accessing */}
      <AuthRoute path="/auth">
        <Auth />
      </AuthRoute>
      <AuthRoute path="/admin/auth">
        <AuthPage />
      </AuthRoute>
      
      {/* Public Routes */}
      <Route path="/" component={Landing} />
      
      {/* Auto-redirect for root when authenticated */}
      <Route path="/dashboard">
        <AutoRedirect />
      </Route>
      
      {/* Admin Private Routes */}
      {/* <AppLayout> */}
      <AdminPrivateRoute path="/admin/dashboard">
        <AppLayout>
          <Dashboard />
        </AppLayout>
      </AdminPrivateRoute>
      <AdminPrivateRoute path="/admin/patients">
        <AppLayout>
          <Patients />
        </AppLayout>
      </AdminPrivateRoute>
      <AdminPrivateRoute path="/admin/patients/:id">
        <PatientDetail />
      </AdminPrivateRoute>
      <AdminPrivateRoute path="/admin/analytics">
        <PatientAnalytics />
      </AdminPrivateRoute>
      <AdminPrivateRoute path="/admin/settings">
        <Settings />
      </AdminPrivateRoute>
      <AdminPrivateRoute path="/admin/patient">
        <PatientDashboard />
      </AdminPrivateRoute>
      {/* </AppLayout> */}
      
      {/* User Private Routes - Wrap with intake form check */}
      <UserPrivateRoute path="/intake-form">
        <IntakeFormPage />
      </UserPrivateRoute>
      <UserPrivateRoute path="/home">
        <IntakeFormRedirect>
          <Home />
        </IntakeFormRedirect>
      </UserPrivateRoute>
      <UserPrivateRoute path="/analytics">
        <IntakeFormRedirect>
          <Analytics />
        </IntakeFormRedirect>
      </UserPrivateRoute>
      <UserPrivateRoute path="/settings">
        <IntakeFormRedirect>
          <UserSettings />
        </IntakeFormRedirect>
      </UserPrivateRoute>
      
      {/* Catch all route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <Provider store={store}>
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
    </Provider>
  );
}

export default App;
