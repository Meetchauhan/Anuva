import React, { useState, useRef } from 'react';
import { Phone, Users, UserCircle, ChevronDown, X, MessageCircle, GripVertical } from 'lucide-react';
import Draggable from 'react-draggable';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '../../lib/utils';

type TeamContact = {
  id: string;
  name: string;
  role: string;
  phoneNumber: string;
  isPrimary?: boolean;
  avatar?: string;
};

interface ClinicTeamWidgetProps {
  patientId?: number;
  teamContacts?: TeamContact[];
  className?: string;
  expanded?: boolean;
  onToggleExpand?: () => void;
}

export function ClinicTeamWidget({
  patientId,
  teamContacts: providedContacts,
  className,
  expanded = false,
  onToggleExpand
}: ClinicTeamWidgetProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(expanded);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Use a single ref for both collapsed and expanded states
  const nodeRef = useRef(null);
  
  // Default team contacts if none are provided
  const defaultContacts: TeamContact[] = [
    {
      id: 'anuva-agent',
      name: 'Anuva Agent',
      role: 'Clinical Support',
      phoneNumber: '(555) 234-5678',
      isPrimary: true
    },
    {
      id: 'case-manager',
      name: 'James Wilson',
      role: 'Case Manager',
      phoneNumber: '(555) 345-6789'
    },
    {
      id: 'patient',
      name: 'Michael Thompson',
      role: 'Patient',
      phoneNumber: '(555) 456-7890'
    },
    {
      id: 'physical-therapist',
      name: 'Emily Rodriguez',
      role: 'Physical Therapist',
      phoneNumber: '(555) 567-8901'
    }
  ];
  
  const teamContacts = providedContacts || defaultContacts;
  const primaryContact = teamContacts.find(contact => contact.isPrimary) || teamContacts[0];
  
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
  
  const handleDrag = (e: any, data: any) => {
    setPosition({ x: data.x, y: data.y });
  };
  
  // Render the appropriate view based on expanded state
  return isExpanded ? (
    // Expanded view (shows all team contacts)
    <Draggable 
      handle=".drag-handle" 
      position={position}
      onDrag={handleDrag}
      nodeRef={nodeRef}
    >
      <Card ref={nodeRef} className={cn("shadow-sm border border-primary/20 z-50", className)}>
        <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm flex items-center">
            <div className="drag-handle cursor-move p-1 mr-1">
              <GripVertical className="h-4 w-4 text-primary" />
            </div>
            <Users className="h-4 w-4 text-primary mr-2" />
            Care Team
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
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {teamContacts.map((contact) => (
              <div 
                key={contact.id} 
                className={cn(
                  "flex items-center justify-between p-2 rounded-md",
                  contact.isPrimary ? "bg-primary/5" : "hover:bg-muted"
                )}
              >
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{contact.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {contact.role} • {contact.phoneNumber}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 border-primary/30 text-primary hover:bg-primary/10"
                    onClick={() => handleCall(contact.phoneNumber)}
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    Call
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 border-primary/30 text-primary hover:bg-primary/10"
                  >
                    <MessageCircle className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </Draggable>
  ) : (
    // Collapsed view (just shows primary contact)
    <Draggable 
      handle=".drag-handle" 
      position={position}
      onDrag={handleDrag}
      nodeRef={nodeRef}
    >
      <Card ref={nodeRef} className={cn("shadow-sm hover:shadow transition-shadow duration-300 border border-primary/20 z-50", className)}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary rounded-full drag-handle cursor-move">
                <GripVertical className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">{primaryContact.name}</h4>
                <p className="text-xs text-muted-foreground">{primaryContact.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="h-8 px-3"
                      onClick={() => handleCall(primaryContact.phoneNumber)}
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Call {primaryContact.phoneNumber}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
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
    </Draggable>
  );
}