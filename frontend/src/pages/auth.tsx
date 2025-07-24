import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignupForm from "../components/auth/signup-form";
import LoginForm from "../components/auth/login-form";

export default function Auth() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);

  const handleAuthSuccess = () => {
    // Redirect to home page after successful authentication
    navigate("/home", { replace: true });
  };

  const switchToSignup = () => setIsSignup(true);
  const switchToLogin = () => setIsSignup(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* AnuvaConnect Branding */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1F5A42] mb-2">AnuvaConnect</h1>
          <p className="text-gray-600">Your Recovery, Connected</p>
        </div>

        {/* Authentication Forms */}
        {isSignup ? (
          <SignupForm 
            onSignupSuccess={handleAuthSuccess}
            onSwitchToLogin={switchToLogin}
          />
        ) : (
          <LoginForm 
            onLoginSuccess={handleAuthSuccess}
            onSwitchToSignup={switchToSignup}
          />
        )}
      </div>
    </div>
  );
}