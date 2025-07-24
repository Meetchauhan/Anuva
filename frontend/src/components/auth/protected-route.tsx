import React, { ReactNode, useEffect } from "react";
import { Route, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import { UserRole } from "../../types/user-roles";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  path: string;
  allowedRoles: UserRole[];
  children: ReactNode;
}

export function ProtectedRoute({ path, allowedRoles, children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { 
    if (!isLoading && !user) {
      // If not authenticated, redirect to auth page
      navigate("/auth");
    } else if (!isLoading && user && !allowedRoles.includes(user.role)) {
      // If authenticated but not authorized for this route, redirect to appropriate dashboard
      // Define redirection paths based on user role
      let redirectPath = "/";
      
      if (user.role === UserRole.PROVIDER) {
        redirectPath = "/provider";
      } else if (user.role === UserRole.PATIENT) {
        redirectPath = "/patient";
      } else if (user.role === UserRole.CAREGIVER) {
        redirectPath = "/caregiver";
      }
      
      if (path !== redirectPath) {
        navigate(redirectPath);
      }
    }
  }, [user, isLoading, path, allowedRoles, navigate]);

  // Render the loading state when authenticating
  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  // If authenticated and authorized, render the route component
  if (user && allowedRoles.includes(user.role)) {
    return <Route path={path}>{children}</Route>;
  }

  // Return an empty route component for handling redirects
  return <Route path={path}></Route>;
}