import { ReactNode, useEffect, useState } from "react";
import { Route, useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import useAdminAuth from "@/hooks/useAdminAuth";
import useUserAuth from "@/hooks/useUserAuth";

interface PrivateRouteProps {
  path: string;
  children: ReactNode;
  type: "admin" | "user";
}

export function PrivateRoute({ path, children, type }: PrivateRouteProps) {
  const [, setLocation] = useLocation();
  const adminAuth = useAdminAuth();
  const userAuth = useUserAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  console.log("userAuth", userAuth);

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      if (type === "admin") {
        return sessionStorage.getItem("adminAuthToken");
      } else {
        return sessionStorage.getItem("authToken");
      }
    }
    return null;
  };

  const getRedirectPath = () => (type === "admin" ? "/admin/auth" : "/auth");

  useEffect(() => {
    const checkAuth = () => {
      const currentToken = getAuthToken();

      if (!currentToken) {
        // No token, redirect to login
        setLocation(getRedirectPath());
        return;
      }

      // Token exists, allow access
      setIsCheckingAuth(false);
    };

    // Small delay to ensure sessionStorage is updated after login
    const timeoutId = setTimeout(checkAuth, 100);
    return () => clearTimeout(timeoutId);
  }, [path, type, setLocation]);

  // Handle live sessionStorage updates (like login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = getAuthToken();
      if (!newToken) {
        setLocation(getRedirectPath());
      } else {
        setIsCheckingAuth(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [type, setLocation]);

  if (typeof window === "undefined" || isCheckingAuth) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  // If not authorized after check
  if (!getAuthToken()) {
    return <Route path={path} />;
  }

  return <Route path={path}>{children}</Route>;
}

// Admin-specific private route
export function AdminPrivateRoute({ path, children }: { path: string; children: ReactNode }) {
  return <PrivateRoute path={path} type="admin">{children}</PrivateRoute>;
}

// User-specific private route
export function UserPrivateRoute({ path, children }: { path: string; children: ReactNode }) {
  return <PrivateRoute path={path} type="user">{children}</PrivateRoute>;
}

// Component to prevent authenticated users from accessing auth pages
export function AuthRoute({ path, children }: { path: string; children: ReactNode }) {
  const [, setLocation] = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const userToken = sessionStorage.getItem("authToken");
      const adminToken = sessionStorage.getItem("adminAuthToken");

      if (userToken) {
        // User is logged in, redirect to home
        setLocation("/home");
        return;
      } else if (adminToken) {
        // Admin is logged in, redirect to admin dashboard
        setLocation("/admin/dashboard");
        return;
      }

      // No tokens, allow access to auth page
      setIsChecking(false);
    };

    const timeoutId = setTimeout(checkAuth, 100);
    return () => clearTimeout(timeoutId);
  }, [setLocation]);

  if (isChecking) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  return <Route path={path}>{children}</Route>;
}
