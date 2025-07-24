import React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Patient,
  ConcussionEvent,
  SymptomCheckin,
  SoapNote,
  RecoveryMilestone,
  Appointment
} from '@shared/schema';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  Calendar,
  CheckCircle,
  ClipboardList,
  FileText,
  Activity,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Brain,
  Stethoscope,
  TrendingUp,
  Trophy,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface PatientJourneyTimelineProps {
  patient?: Patient;
  concussions?: ConcussionEvent[];
  checkins?: SymptomCheckin[];
  notes?: SoapNote[];
  appointments?: Appointment[];
  milestones?: RecoveryMilestone[];
  loading?: boolean;
  error?: string;
}

interface TimelineEvent {
  id: number;
  date: Date;
  title: string;
  description: string;
  type: 'concussion' | 'symptom-checkin' | 'soap-note' | 'appointment' | 'milestone';
  severity?: 'low' | 'medium' | 'high';
  status?: 'completed' | 'scheduled' | 'cancelled';
  data?: any;
}

export function PatientJourneyTimeline({ 
  patient, 
  concussions = [], 
  checkins = [], 
  notes = [], 
  appointments = [], 
  milestones = [],
  loading = false,
  error 
}: PatientJourneyTimelineProps) {
  const [isExpanded, setIsExpanded] = React.useState<Record<string, boolean>>({});

  // Merge all events into a single timeline
  const allEvents = React.useMemo(() => {
    const events: TimelineEvent[] = [];

    // Add concussion events
    if (concussions && concussions.length > 0) {
      concussions.forEach(concussion => {
        events.push({
          id: concussion.id,
          date: new Date(concussion.dateOfInjury),
          title: 'Concussion Event',
          description: concussion.description || 'Concussion injury recorded',
          type: 'concussion',
          severity: 'high',
          data: concussion
        });
      });
    }

    // Add symptom checkins
    if (checkins && checkins.length > 0) {
      checkins.forEach(checkin => {
        // Determine severity based on PCSS score
        let severity: 'low' | 'medium' | 'high' = 'low';
        if (checkin.pcssTotal > 40) {
          severity = 'high';
        } else if (checkin.pcssTotal > 20) {
          severity = 'medium';
        }

        events.push({
          id: checkin.id,
          date: new Date(checkin.checkInDate),
          title: 'Symptom Check-in',
          description: `PCSS Score: ${checkin.pcssTotal}`,
          type: 'symptom-checkin',
          severity,
          data: checkin
        });
      });
    }

    // Add SOAP notes
    if (notes && notes.length > 0) {
      notes.forEach(note => {
        events.push({
          id: note.id,
          date: new Date(note.createdAt || Date.now()),
          title: 'Clinical Note',
          description: 'Clinical documentation',
          type: 'soap-note',
          data: note
        });
      });
    }

    // Add recovery milestones
    if (milestones && milestones.length > 0) {
      milestones.forEach(milestone => {
        events.push({
          id: milestone.id,
          date: new Date(milestone.achievedDate || milestone.targetDate || milestone.updatedAt || milestone.createdAt || Date.now()),
          title: milestone.milestoneName,
          description: milestone.notes || 'Recovery milestone achieved',
          type: 'milestone',
          status: 'completed',
          data: milestone
        });
      });
    }

    // Add appointments
    if (appointments && appointments.length > 0) {
      appointments.forEach(appointment => {
        events.push({
          id: appointment.id,
          date: new Date(appointment.startTime || appointment.createdAt || Date.now()),
          title: appointment.appointmentType || 'Appointment',
          description: appointment.description || 'Scheduled appointment',
          type: 'appointment',
          status: appointment.status as 'scheduled' | 'completed' | 'cancelled',
          data: appointment
        });
      });
    }

    // Sort all events chronologically
    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [concussions, checkins, notes, milestones, appointments]);

  // Group events by month and year
  const eventsByMonth = React.useMemo(() => {
    const months: Record<string, TimelineEvent[]> = {};
    
    allEvents.forEach(event => {
      const monthYear = format(event.date, 'MMMM yyyy');
      if (!months[monthYear]) {
        months[monthYear] = [];
      }
      months[monthYear].push(event);
    });
    
    return months;
  }, [allEvents]);

  const toggleMonth = (month: string) => {
    setIsExpanded(prev => ({
      ...prev,
      [month]: !prev[month]
    }));
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'concussion':
        return <Brain className="h-5 w-5 text-red-500" />;
      case 'symptom-checkin':
        return <Activity className="h-5 w-5 text-blue-500" />;
      case 'soap-note':
        return <ClipboardList className="h-5 w-5 text-purple-500" />;
      case 'appointment':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'milestone':
        return <Trophy className="h-5 w-5 text-amber-500" />;
      default:
        return <FileText className="h-5 w-5 text-neutral-500" />;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'concussion':
        return 'border-red-500 bg-red-50 dark:bg-red-950/20';
      case 'symptom-checkin':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-950/20';
      case 'soap-note':
        return 'border-purple-500 bg-purple-50 dark:bg-purple-950/20';
      case 'appointment':
        return 'border-green-500 bg-green-50 dark:bg-green-950/20';
      case 'milestone':
        return 'border-amber-500 bg-amber-50 dark:bg-amber-950/20';
      default:
        return 'border-neutral-500 bg-neutral-50 dark:bg-neutral-950/20';
    }
  };

  const getTypeLabel = (eventType: string) => {
    switch (eventType) {
      case 'concussion':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-500/30">Injury Event</Badge>;
      case 'symptom-checkin':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-500/30">Symptom Check</Badge>;
      case 'soap-note':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-500/30">Clinical Note</Badge>;
      case 'appointment':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-500/30">Appointment</Badge>;
      case 'milestone':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-500/30">Milestone</Badge>;
      default:
        return <Badge variant="outline">Event</Badge>;
    }
  };

  const renderEventDetails = (event: TimelineEvent) => {
    switch (event.type) {
      case 'concussion':
        return (
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Injury Type:</span> {event.data.injuryType || 'N/A'}</p>
            <p><span className="font-medium">Location:</span> {event.data.locationOfImpact || 'N/A'}</p>
            <p><span className="font-medium">Loss of Consciousness:</span> {event.data.lossOfConsciousness ? 'Yes' : 'No'}</p>
            {event.data.notes && <p><span className="font-medium">Notes:</span> {event.data.notes}</p>}
          </div>
        );
      
      case 'symptom-checkin':
        return (
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">PCSS Score:</span> {event.data.pcssTotal}</p>
            <p><span className="font-medium">Top Symptoms:</span></p>
            <div className="space-y-1 mt-1">
              {event.data.symptoms && event.data.symptoms
                .sort((a: any, b: any) => b.value - a.value)
                .slice(0, 3)
                .map((symptom: any, i: number) => (
                  <div key={i} className="flex justify-between items-center">
                    <span>{symptom.name}</span>
                    <Badge variant={symptom.value > 3 ? "destructive" : "outline"}>{symptom.value}/6</Badge>
                  </div>
                ))
              }
            </div>
            {event.data.notes && <p><span className="font-medium">Notes:</span> {event.data.notes}</p>}
          </div>
        );
      
      case 'soap-note':
        return (
          <div className="space-y-2 text-sm">
            <div className="flex space-x-1 mb-1">
              <Badge variant="outline" className="bg-neutral-100 dark:bg-neutral-800">S</Badge>
              <p className="line-clamp-2">{(event.data.subjective || '').substring(0, 80)}...</p>
            </div>
            <div className="flex space-x-1 mb-1">
              <Badge variant="outline" className="bg-neutral-100 dark:bg-neutral-800">A</Badge>
              <p className="line-clamp-1">{(event.data.assessment || '').substring(0, 80)}...</p>
            </div>
            <div className="flex justify-end mt-2">
              <Button variant="outline" size="sm">View Full Note</Button>
            </div>
          </div>
        );
      
      case 'appointment':
        return (
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Provider:</span> {event.data.providerName || 'N/A'}</p>
            <p><span className="font-medium">Type:</span> {event.data.appointmentType || 'N/A'}</p>
            <p><span className="font-medium">Time:</span> {event.data.date ? format(new Date(event.data.date), 'h:mm a') : 'N/A'}</p>
            <p><span className="font-medium">Status:</span> {event.data.status || 'Scheduled'}</p>
          </div>
        );
      
      case 'milestone':
        return (
          <div className="space-y-2 text-sm">
            <p>{event.data.description}</p>
            <div className="flex mt-2">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                <CheckCircle className="h-3 w-3 mr-1" />
                Achieved
              </Badge>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!patient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Patient Journey</CardTitle>
          <CardDescription>Loading patient data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" />
          {`${patient.firstName} ${patient.lastName}'s Recovery Journey`}
        </CardTitle>
        <CardDescription>
          Chronological visualization of injury, assessments, treatments, and milestones
        </CardDescription>
      </CardHeader>
      <CardContent>
        {Object.keys(eventsByMonth).length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No journey events recorded for this patient yet.
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(eventsByMonth).map(([month, events]) => (
              <Collapsible 
                key={month} 
                open={isExpanded[month] ?? true}
                onOpenChange={() => toggleMonth(month)}
                className="border rounded-md overflow-hidden"
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-4 cursor-pointer bg-neutral-50 dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2 text-neutral-500" />
                      <h3 className="text-lg font-medium">{month}</h3>
                      <Badge className="ml-2">{events.length} event{events.length !== 1 ? 's' : ''}</Badge>
                    </div>
                    {isExpanded[month] ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="relative pl-8 pb-1">
                    {/* Timeline stem */}
                    <div className="absolute left-4 top-0 bottom-4 w-0.5 bg-neutral-200 dark:bg-neutral-700"></div>
                    
                    <div className="space-y-6 py-4">
                      {events.map((event, index) => (
                        <div key={`${event.type}-${event.id}`} className="relative">
                          {/* Timeline node */}
                          <div className="absolute -left-6 top-0 flex items-center justify-center w-4 h-4">
                            <div className={cn(
                              "w-4 h-4 rounded-full border-2",
                              event.severity === 'high' ? 'border-red-500 bg-red-100 dark:bg-red-900/30' :
                              event.severity === 'medium' ? 'border-amber-500 bg-amber-100 dark:bg-amber-900/30' :
                              'border-green-500 bg-green-100 dark:bg-green-900/30'
                            )}></div>
                          </div>
                          
                          <div className={cn(
                            "ml-3 p-4 rounded-md border-l-4",
                            getEventColor(event.type)
                          )}>
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                {getEventIcon(event.type)}
                                <h4 className="font-medium">{event.title}</h4>
                                {getTypeLabel(event.type)}
                              </div>
                              <div className="flex items-center mt-2 md:mt-0">
                                <Clock className="h-4 w-4 mr-1 text-neutral-500" />
                                <span className="text-sm text-neutral-500">
                                  {format(event.date, 'MMM d, yyyy')}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-sm mb-3">{event.description}</p>
                            
                            {renderEventDetails(event)}
                            
                            {index < events.length - 1 && (
                              <Separator className="mt-4" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
        
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full border-2 border-red-500 bg-red-100 dark:bg-red-900/30 mr-2"></div>
              <span>High Severity</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full border-2 border-amber-500 bg-amber-100 dark:bg-amber-900/30 mr-2"></div>
              <span>Medium Severity</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full border-2 border-green-500 bg-green-100 dark:bg-green-900/30 mr-2"></div>
              <span>Low Severity</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}