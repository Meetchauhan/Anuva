import React from "react";
import { Button } from "../../components/ui/button";
import { CheckCircle, LogOut } from "lucide-react";
import {  useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      navigate('/auth', {replace: true}); // or '/signin' if that's your login route
    } catch (error) {
     
      console.error("error logging out", error);
      
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3 bg-[#1F5A42]">
              <CheckCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">AnuvaConnect--</h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
