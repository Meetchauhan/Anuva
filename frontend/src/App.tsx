// import { Switch, Route } from "wouter";
import React from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { useAuth } from "./hooks/useAuth";
import Landing from "./pages/landing";
import Auth from "./pages/auth";
import Home from "./pages/home";
import Analytics from "./pages/analytics";
import Settings from "./pages/settings";
import NotFound from "./pages/not-found";
import { Routes, Route } from "react-router-dom";
import "./index.css";
import Dashboard from "./pages/dashboard";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  console.log("user",user);
  return (
    // <Routes>
    //   <Route path="/auth" element={<Auth />} />
    //   {isLoading ? (
    //     <Route path="*"></Route>
    //   ) : !isAuthenticated ? (
    //     <>
    //       <Route path="/" element={<Landing />} />
    //       <Route element={<Landing />} />
    //     </>
    //   ) : (
    //     <>
    //       <Route path="/" element={<Home />} />
    //       <Route path="/home" element={<Home />} />
    //       <Route path="/analytics" element={<Analytics />} />
    //       <Route path="/settings" element={<Settings />} />
    //       <Route element={<NotFound />} />
    //     </>
    //   )}
    // </Routes>
    <Routes>
       <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/settings" element={<Settings />} />
      <Route element={<NotFound />} />
       <Route path="/auth" element={<Auth />} />
       <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
