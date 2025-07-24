import React from "react";
import { usenavigate, Link, useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";
import { User } from "../../../../backend/shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Brain, Users, Calendar, Settings, BookOpen, ClipboardList, BarChart3, Grid, LayoutDashboard, LogOut, Sun, Search } from "lucide-react";
import tulaneLogoUrl from "../../assets/image_1750564367481.png";
import { useSettings } from "../../context/settings-context";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

interface SidebarProps {
  user?: User;
}

export default function Sidebar({ user }: SidebarProps) {
  const navigate = useNavigate();
  const { toggleHighContrast, settings } = useSettings();
  
  // Fetch current user if not provided
  const { data: fetchedUser } = useQuery<User>({
    queryKey: ['/api/currentUser'],
    enabled: !user
  });
  
  const displayUser = user || fetchedUser;
  
  const mainMenuItems = [
    {
      href: "/",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5 mr-3" />
    },
    {
      href: "/patients",
      label: "Patients",
      icon: <Users className="w-5 h-5 mr-3" />
    },
    {
      href: "/appointments",
      label: "Appointments",
      icon: <Calendar className="w-5 h-5 mr-3" />
    },
    {
      href: "/settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5 mr-3" />
    }
  ];
  
  const clinicalToolsItems = [
    {
      href: "/assessments",
      label: "Assessment Library",
      icon: <BookOpen className="w-5 h-5 mr-3" />
    },
    {
      href: "/documentation",
      label: "Documentation",
      icon: <ClipboardList className="w-5 h-5 mr-3" />
    },
    {
      href: "/analytics",
      label: "Patient Analytics",
      icon: <BarChart3 className="w-5 h-5 mr-3" />
    }
  ];
  
  const isActive = (href: string) => {
    if (href === '/' && navigate === '/') return true;
    if (href !== '/' && navigate.startsWith(href)) return true;
    return false;
  };
  
  return (
    <aside className="w-full md:w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col">
      <div className="p-4 border-b border-neutral-800">
        <div className="flex items-center mb-3">
          <div className="bg-primary rounded-md p-2 mr-3 brain-logo">
            <Brain className="w-6 h-6" />
          </div>
          <h1 className="text-lg font-semibold text-white">Anuva OS</h1>
        </div>
        <div className="flex justify-center">
          <img 
            src={tulaneLogoUrl} 
            alt="Tulane University Center for Sport" 
            className="h-16 w-auto opacity-80 hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
      
      <nav className="flex-grow py-4">
        <div className="px-4 mb-2 text-neutral-400 text-xs uppercase font-semibold">Main Menu</div>
        
        {/* Search dropdown */}
        <div className="px-4 mb-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="flex items-center w-full justify-start">
                <Search className="w-4 h-4 mr-3" />
                Search
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Search Patients</DropdownMenuItem>
              <DropdownMenuItem>Search Symptoms</DropdownMenuItem>
              <DropdownMenuItem>Search Documentation</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Invert Colors button */}
        <div className="px-4 mb-4">
          <Button 
            variant={settings.highContrast ? "default" : "secondary"}
            size="sm"
            onClick={toggleHighContrast}
            className="flex items-center w-full justify-start"
          >
            <Sun className="w-4 h-4 mr-3" />
            Invert Colors
          </Button>
        </div>
        
        {mainMenuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div 
              className={cn(
                "flex items-center px-4 py-3 cursor-pointer",
                isActive(item.href) 
                  ? "text-white bg-primary-dark" 
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              )}
            >
              {item.icon}
              {item.label}
            </div>
          </Link>
        ))}
        
        <div className="px-4 mt-8 mb-2 text-neutral-400 text-xs uppercase font-semibold">Clinical Tools</div>
        
        {clinicalToolsItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div 
              className={cn(
                "flex items-center px-4 py-3 cursor-pointer",
                isActive(item.href) 
                  ? "text-white bg-primary-dark" 
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              )}
            >
              {item.icon}
              {item.label}
            </div>
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-neutral-800">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary-dark flex items-center justify-center text-white">
            {displayUser?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{displayUser?.fullName || 'Loading...'}</p>
            <p className="text-xs text-neutral-400">{displayUser?.speciality || displayUser?.role || ''}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
