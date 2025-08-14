import React, { useState } from 'react';
import { Phone, AlertCircle, X, ChevronDown, ChevronRight, Ambulance, UserCircle, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

type EmergencyContact = {
  id: string;
  name: string;
  role: string;
  phoneNumber: string;
  priority: 'critical' | 'urgent' | 'standard';
  isEmergencyService?: boolean;
  avatar?: string;
};

interface EmergencyContactWidgetProps {
  patientId?: number;
  contacts?: EmergencyContact[];
  className?: string;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export function EmergencyContactWidget({
  patientId,
  contacts: providedContacts,
  className,
  expanded = false,
  onToggleExpand
}: EmergencyContactWidgetProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(expanded);
  
  // Default emergency contacts if none are provided
  const defaultContacts: EmergencyContact[] = [
    {
      id: 'emergency-services',
      name: 'Emergency Services',
      role: 'Emergency Response',
      phoneNumber: '911',
      priority: 'critical',
      isEmergencyService: true
    },
    {
      id: 'neurology-on-call',
      name: 'Neurology On-Call',
      role: 'Hospital Department',
      phoneNumber: '(555) 123-4567',
      priority: 'urgent'
    },
    {
      id: 'head-trauma-specialist',
      name: 'Dr. James Wilson',
      role: 'Head Trauma Specialist',
      phoneNumber: '(555) 987-6543',
      priority: 'urgent'
    },
    {
      id: 'patient-emergency-contact',
      name: 'Sarah Thompson',
      role: 'Patient Emergency Contact (Spouse)',
      phoneNumber: '(555) 456-7890',
      priority: 'standard'
    }
  ];
  
  const emergencyContacts = providedContacts || defaultContacts;
  
  const handleToggleExpand = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (onToggleExpand) {
      onToggleExpand();
    }
  };
  
  const handleCall = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-600 hover:bg-red-700';
      case 'urgent':
        return 'bg-amber-500 hover:bg-amber-600';
      default:
        return 'bg-primary hover:bg-primary-dark';
    }
  };
  
  const getPriorityIcon = (contact: EmergencyContact) => {
    if (contact.isEmergencyService) return <Ambulance className="h-4 w-4" />;
    if (contact.priority === 'urgent') return <Stethoscope className="h-4 w-4" />;
    return <UserCircle className="h-4 w-4" />;
  };
  
  // Collapsed view shows just an emergency button
  if (!isExpanded) {
    return (
      <Card className={cn("shadow-sm hover:shadow transition-shadow duration-300 border-red-900/30 bg-background", className)}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-600 rounded-full">
                <AlertCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-red-500">Emergency Contacts</h4>
                <p className="text-xs text-muted-foreground">Quick access to critical contacts</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="destructive" 
                size="sm" 
                className="h-8 px-3"
                onClick={() => handleCall(emergencyContacts[0].phoneNumber)}
              >
                <Phone className="h-3 w-3 mr-1" />
                {emergencyContacts[0].phoneNumber}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0"
                onClick={handleToggleExpand}
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Expanded view shows all emergency contacts
  return (
    <Card className={cn("shadow-sm border-red-900/30 bg-background", className)}>
      <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between">
        <CardTitle className="text-sm flex items-center text-red-500">
          <AlertCircle className="h-4 w-4 mr-2" />
          Emergency Contacts
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0" 
          onClick={handleToggleExpand}
        >
          <X className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent className="p-3">
        <div className="space-y-2">
          {emergencyContacts.map((contact) => (
            <div 
              key={contact.id} 
              className={cn(
                "flex items-center justify-between p-2 rounded-md",
                contact.priority === 'critical' ? "bg-red-900/10" : 
                contact.priority === 'urgent' ? "bg-amber-900/10" : "hover:bg-muted"
              )}
            >
              <div className="flex items-center space-x-2">
                <div className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center",
                  contact.priority === 'critical' ? "bg-red-600/20" : 
                  contact.priority === 'urgent' ? "bg-amber-600/20" : "bg-primary/20"
                )}>
                  {getPriorityIcon(contact)}
                </div>
                <div>
                  <div className="flex items-center">
                    <h4 className="text-sm font-medium">{contact.name}</h4>
                    {contact.priority === 'critical' && (
                      <div className="ml-2 text-[10px] py-0 px-1 bg-red-600 text-white rounded-full">CRITICAL</div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {contact.role} • {contact.phoneNumber}
                  </p>
                </div>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "h-8 border-none text-white",
                        getPriorityColor(contact.priority)
                      )}
                      onClick={() => handleCall(contact.phoneNumber)}
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Call {contact.phoneNumber}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}