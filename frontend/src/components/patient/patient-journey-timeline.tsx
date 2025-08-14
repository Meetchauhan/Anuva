import React, { useState } from "react";
import { format } from "date-fns";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine 
} from "recharts";
import { 
  Activity, 
  FileText, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Award, 
  ArrowUpCircle, 
  ArrowDownCircle,
  TrendingDown,
  TrendingUp,
  Clock,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Tooltip as ShadcnTooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { 
  Patient, 
  ConcussionEvent, 
  SymptomCheckin, 
  SoapNote, 
  Appointment, 
  RecoveryMilestone 
} from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Type for timeline event
type TimelineEvent = {
  id: number;
  type: 'concussion' | 'checkin' | 'appointment' | 'note' | 'milestone';
  date: Date;
  title: string;
  description?: string;
  severity?: number;
  status?: string;
  trend?: 'improving' | 'worsening' | 'stable';
  icon?: React.ReactNode;
  color?: string;
  data?: any;
};

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

export function PatientJourneyTimeline({
  patient,
  concussions = [],
  checkins = [],
  notes = [],
  appointments = [],
  milestones = [],
  loading,
  error
}: PatientJourneyTimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [timelineView, setTimelineView] = useState<'list' | 'chart'>('list');
  const [focusedConcussion, setFocusedConcussion] = useState<number | null>(null);
  const [showAllEvents, setShowAllEvents] = useState(false);
  
  // Create a combined timeline of events
  const timelineEvents = React.useMemo(() => {
    const events: TimelineEvent[] = [];
    
    // Add concussion events
    concussions.forEach(concussion => {
      events.push({
        id: concussion.id,
        type: 'concussion',
        date: new Date(concussion.dateOfInjury),
        title: `Concussion: ${concussion.mechanismOfInjury}`,
        description: `${concussion.mechanismOfInjury} ${concussion.sportActivity ? '- ' + concussion.sportActivity : ''}`,
        severity: 0, // Using 0 as a default since we don't have this field
        icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
        color: 'bg-red-500',
        data: concussion
      });
    });
    
    // Add symptom check-ins
    checkins.forEach(checkin => {
      // Calculate trend compared to previous checkin
      let trend: 'improving' | 'worsening' | 'stable' = 'stable';
      const prevCheckin = checkins.find(
        c => c.concussionId === checkin.concussionId && 
        new Date(c.checkInDate) < new Date(checkin.checkInDate) && 
        c.id !== checkin.id
      );
      
      if (prevCheckin) {
        if (checkin.pcssTotal < prevCheckin.pcssTotal) {
          trend = 'improving';
        } else if (checkin.pcssTotal > prevCheckin.pcssTotal) {
          trend = 'worsening';
        }
      }
      
      events.push({
        id: checkin.id,
        type: 'checkin',
        date: new Date(checkin.checkInDate),
        title: `Symptom Check-in`,
        description: `PCSS Score: ${checkin.pcssTotal}`,
        severity: checkin.pcssTotal,
        trend,
        icon: trend === 'improving' ? 
              <TrendingDown className="h-5 w-5 text-green-500" /> : 
              trend === 'worsening' ? 
              <TrendingUp className="h-5 w-5 text-red-500" /> : 
              <Activity className="h-5 w-5 text-yellow-500" />,
        color: trend === 'improving' ? 'bg-green-500' : 
               trend === 'worsening' ? 'bg-red-500' : 'bg-yellow-500',
        data: checkin
      });
    });
    
    // Add clinical notes
    notes.forEach(note => {
      events.push({
        id: note.id,
        type: 'note',
        date: new Date(note.createdAt as Date),
        title: `SOAP Note`,
        description: note.assessment ? note.assessment.substring(0, 100) + '...' : '',
        icon: <FileText className="h-5 w-5 text-blue-500" />,
        color: 'bg-blue-500',
        data: note
      });
    });
    
    // Add appointments
    appointments.forEach(appointment => {
      const isPast = new Date(appointment.startDate) < new Date();
      
      events.push({
        id: appointment.id,
        type: 'appointment',
        date: new Date(appointment.startDate),
        title: `${appointment.appointmentType}`,
        description: appointment.notes || '',
        status: isPast ? 'completed' : 'scheduled',
        icon: <Calendar className="h-5 w-5 text-purple-500" />,
        color: 'bg-purple-500',
        data: appointment
      });
    });
    
    // Add recovery milestones
    milestones.forEach(milestone => {
      const milestoneDate = milestone.achievedDate || milestone.targetDate;
      if (milestoneDate) {
        events.push({
          id: milestone.id,
          type: 'milestone',
          date: new Date(milestoneDate),
          title: milestone.milestoneName,
          description: milestone.notes || '',
          status: milestone.achievedDate ? 'achieved' : 'target',
          icon: milestone.achievedDate ? 
                <Award className="h-5 w-5 text-amber-500" /> : 
                <Clock className="h-5 w-5 text-indigo-500" />,
          color: milestone.achievedDate ? 'bg-amber-500' : 'bg-indigo-500',
          data: milestone
        });
      }
    });
    
    // Sort events by date
    return events.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [concussions, checkins, notes, appointments, milestones]);
  
  // Filter events based on focused concussion if selected
  const filteredEvents = React.useMemo(() => {
    if (!focusedConcussion || showAllEvents) {
      return timelineEvents;
    }
    
    // Find the concussion event
    const concussionEvent = timelineEvents.find(
      event => event.type === 'concussion' && event.id === focusedConcussion
    );
    
    if (!concussionEvent) return timelineEvents;
    
    // Find the next concussion event (if any)
    const nextConcussionIndex = timelineEvents.findIndex(
      (event, index) => {
        const isNextConcussion = event.type === 'concussion' && 
                               event.date > concussionEvent.date && 
                               event.id !== focusedConcussion;
        return isNextConcussion;
      }
    );
    
    // Filter events between current concussion and next concussion (or end)
    if (nextConcussionIndex > -1) {
      return timelineEvents.filter((event, index) => {
        const concussionIndex = timelineEvents.findIndex(e => e.id === focusedConcussion && e.type === 'concussion');
        return index >= concussionIndex && index < nextConcussionIndex;
      });
    } else {
      return timelineEvents.filter(event => {
        const concussionIndex = timelineEvents.findIndex(e => e.id === focusedConcussion && e.type === 'concussion');
        return event.date >= concussionEvent.date || 
              (event.type === 'concussion' && event.id === focusedConcussion);
      });
    }
  }, [timelineEvents, focusedConcussion, showAllEvents]);
  
  // Prepare chart data for symptom trajectory
  const symptomTrajectoryData = React.useMemo(() => {
    // Only use checkin events for current concussion if one is selected
    const relevantCheckins = focusedConcussion 
      ? checkins.filter(c => c.concussionId === focusedConcussion)
      : checkins;
      
    return relevantCheckins
      .sort((a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime())
      .map(checkin => ({
        date: format(new Date(checkin.checkInDate), 'MMM dd'),
        score: checkin.pcssTotal,
        checkInId: checkin.id
      }));
  }, [checkins, focusedConcussion]);
  
  // Display loading state
  if (loading) {
    return (
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle>Patient Journey Timeline</CardTitle>
          <CardDescription>Loading patient journey data...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading patient timeline data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Display error state
  if (error) {
    return (
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle>Patient Journey Timeline</CardTitle>
          <CardDescription>Error loading patient journey</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <div className="text-center text-red-500">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Display empty state
  if (filteredEvents.length === 0) {
    return (
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle>Patient Journey Timeline</CardTitle>
          <CardDescription>No timeline events found</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[300px]">
          <div className="text-center text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4" />
            <p>No timeline events available for this patient</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Patient Journey Timeline</CardTitle>
            <CardDescription>
              {patient ? `${patient.firstName} ${patient.lastName}'s recovery journey` : 'Patient recovery journey'}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setTimelineView(timelineView === 'list' ? 'chart' : 'list')}
            >
              {timelineView === 'list' ? 'Chart View' : 'List View'}
            </Button>
            {concussions && concussions.length > 1 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAllEvents(!showAllEvents)}
              >
                {showAllEvents ? 'Filter by Concussion' : 'Show All Events'}
              </Button>
            )}
          </div>
        </div>
        
        {/* Concussion filter pills */}
        {concussions && concussions.length > 0 && !showAllEvents && (
          <div className="flex flex-wrap gap-2 mt-4">
            {concussions.map(concussion => (
              <Badge 
                key={concussion.id}
                variant={focusedConcussion === concussion.id ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFocusedConcussion(
                  focusedConcussion === concussion.id ? null : concussion.id
                )}
              >
                {format(new Date(concussion.dateOfInjury), 'MMM d, yyyy')} - {concussion.mechanismOfInjury}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {/* Timeline/Chart View Switch */}
        <Tabs defaultValue="timeline" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="chart">Symptom Trajectory</TabsTrigger>
          </TabsList>
          
          {/* Timeline View */}
          <TabsContent value="timeline" className="overflow-hidden">
            <div className="space-y-8 relative pt-4">
              {/* Timeline connector line */}
              <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-neutral-800"></div>
              
              {filteredEvents.map((event, index) => (
                <div 
                  key={`${event.type}-${event.id}`} 
                  className={cn(
                    "relative flex gap-4 items-start",
                    selectedEvent?.id === event.id && selectedEvent?.type === event.type && "bg-neutral-800/50 -mx-4 px-4 py-2 rounded-md"
                  )}
                  onClick={() => setSelectedEvent(selectedEvent?.id === event.id && selectedEvent?.type === event.type ? null : event)}
                >
                  {/* Timeline dot */}
                  <div className={`w-4 h-4 rounded-full mt-1.5 ${event.color} z-10 ring-4 ring-neutral-900`}></div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">
                          {format(event.date, 'MMM d, yyyy')}
                        </span>
                        {event.icon && <span>{event.icon}</span>}
                        <h4 className="font-medium">{event.title}</h4>
                        
                        {event.type === 'checkin' && event.trend && (
                          <Badge className={
                            event.trend === 'improving' ? 'bg-green-500 hover:bg-green-600' : 
                            event.trend === 'worsening' ? 'bg-red-500 hover:bg-red-600' : 'bg-yellow-500 hover:bg-yellow-600'
                          }>
                            {event.trend === 'improving' ? 'Improving' : 
                             event.trend === 'worsening' ? 'Worsening' : 'Stable'}
                          </Badge>
                        )}
                        
                        {event.type === 'milestone' && (
                          <Badge className={event.data.achievedDate ? 'bg-amber-500 hover:bg-amber-600' : 'bg-neutral-500 hover:bg-neutral-600'}>
                            {event.data.achievedDate ? 'Achieved' : 'Target'}
                          </Badge>
                        )}
                      </div>
                      
                      <span className="text-muted-foreground text-sm">
                        {format(event.date, 'h:mm a')}
                      </span>
                    </div>
                    
                    {event.description && (
                      <p className="text-neutral-400 mt-1 text-sm">{event.description}</p>
                    )}
                    
                    {/* Event-specific details when selected */}
                    {selectedEvent?.id === event.id && selectedEvent?.type === event.type && (
                      <div className="mt-4 bg-neutral-800 p-4 rounded-md space-y-3 text-sm">
                        {event.type === 'concussion' && (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium text-neutral-300">Mechanism of Injury</h5>
                                <p>{event.data.mechanismOfInjury}</p>
                              </div>
                              <div>
                                <h5 className="font-medium text-neutral-300">Location</h5>
                                <p>{event.data.locationOfInjury}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium text-neutral-300">Loss of Consciousness</h5>
                                <p>{event.data.lossOfConsciousness ? 'Yes' : 'No'}</p>
                              </div>
                              <div>
                                <h5 className="font-medium text-neutral-300">Initial Symptom Severity</h5>
                                <p>{event.data.initialSymptomSeverity}/100</p>
                              </div>
                            </div>
                            {event.data.notes && (
                              <div>
                                <h5 className="font-medium text-neutral-300">Notes</h5>
                                <p>{event.data.notes}</p>
                              </div>
                            )}
                          </>
                        )}
                        
                        {event.type === 'checkin' && (
                          <>
                            <div>
                              <h5 className="font-medium text-neutral-300">PCSS Score</h5>
                              <p>{event.data.pcssTotal}/100</p>
                            </div>
                            <div>
                              <h5 className="font-medium text-neutral-300">Highest Symptom Categories</h5>
                              <div className="mt-2 space-y-2">
                                {event.data.symptoms
                                  .sort((a: any, b: any) => b.value - a.value)
                                  .slice(0, 3)
                                  .map((symptom: any, i: number) => (
                                    <div key={i} className="flex items-center gap-2">
                                      <div className="h-2 bg-primary rounded-full" style={{ width: `${symptom.value * 2}px` }}></div>
                                      <span>{symptom.name}: {symptom.value}</span>
                                    </div>
                                  ))
                                }
                              </div>
                            </div>
                            <div>
                              <h5 className="font-medium text-neutral-300">Notes</h5>
                              <p>{event.data.notes || 'No notes provided'}</p>
                            </div>
                          </>
                        )}
                        
                        {event.type === 'note' && (
                          <>
                            <div>
                              <h5 className="font-medium text-neutral-300">Clinician</h5>
                              <p>{event.data.clinicianName}</p>
                            </div>
                            <div>
                              <h5 className="font-medium text-neutral-300">Subjective</h5>
                              <p className="text-sm">{event.data.subjective || 'None documented'}</p>
                            </div>
                            <div>
                              <h5 className="font-medium text-neutral-300">Assessment</h5>
                              <p className="text-sm">{event.data.assessment || 'None documented'}</p>
                            </div>
                            <div>
                              <h5 className="font-medium text-neutral-300">Plan</h5>
                              <p className="text-sm">{event.data.plan || 'None documented'}</p>
                            </div>
                          </>
                        )}
                        
                        {event.type === 'appointment' && (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium text-neutral-300">Appointment Type</h5>
                                <p>{event.data.appointmentType}</p>
                              </div>
                              <div>
                                <h5 className="font-medium text-neutral-300">Status</h5>
                                <Badge className={event.status === 'completed' ? 'bg-green-500 hover:bg-green-600' : 'bg-neutral-500 hover:bg-neutral-600'}>
                                  {event.status === 'completed' ? 'Completed' : 'Scheduled'}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <h5 className="font-medium text-neutral-300">Clinician</h5>
                              <p>{event.data.clinicianName || 'Not assigned'}</p>
                            </div>
                            <div>
                              <h5 className="font-medium text-neutral-300">Notes</h5>
                              <p>{event.data.notes || 'No notes available'}</p>
                            </div>
                          </>
                        )}
                        
                        {event.type === 'milestone' && (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h5 className="font-medium text-neutral-300">Target Date</h5>
                                <p>{format(new Date(event.data.targetDate), 'MMM d, yyyy')}</p>
                              </div>
                              <div>
                                <h5 className="font-medium text-neutral-300">Achieved Date</h5>
                                <p>
                                  {event.data.achievedDate 
                                    ? format(new Date(event.data.achievedDate), 'MMM d, yyyy') 
                                    : 'Not yet achieved'}
                                </p>
                              </div>
                            </div>
                            <div>
                              <h5 className="font-medium text-neutral-300">Category</h5>
                              <p>{event.data.category}</p>
                            </div>
                            <div>
                              <h5 className="font-medium text-neutral-300">Notes</h5>
                              <p>{event.data.notes || 'No notes provided'}</p>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* Symptom Trajectory Chart */}
          <TabsContent value="chart">
            <div className="pt-4">
              <h3 className="text-lg font-medium mb-4">Symptom Trajectory</h3>
              {symptomTrajectoryData.length > 0 ? (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={symptomTrajectoryData}
                      margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value: number) => [`PCSS Score: ${value}`, 'Severity']}
                        labelFormatter={(label) => `Date: ${label}`}
                        contentStyle={{ 
                          backgroundColor: '#1f1f1f', 
                          borderColor: '#333',
                          color: '#fff' 
                        }}
                      />
                      <ReferenceLine y={40} stroke="#F59E0B" strokeDasharray="3 3" />
                      <ReferenceLine y={65} stroke="#EF4444" strokeDasharray="3 3" />
                      <Bar 
                        dataKey="score" 
                        name="Symptom Severity"
                        fill="#6E40C9"
                        radius={[4, 4, 0, 0]}
                        onClick={(data) => {
                          // Find the check-in event
                          const event = timelineEvents.find(
                            e => e.type === 'checkin' && e.data.id === data.checkInId
                          );
                          if (event) setSelectedEvent(event);
                        }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="flex justify-between text-sm text-neutral-400 mt-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span>Under 40: Standard Risk</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span>40-65: Moderate Risk</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                      <span>Over 65: High Risk</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center bg-neutral-800/50 rounded-md">
                  <p className="text-neutral-400">No symptom check-in data available</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="text-sm text-muted-foreground">
        {patient && filteredEvents.length > 0 && 
         <span>Showing {filteredEvents.length} events from {
           format(new Date(filteredEvents[0]?.date), 'MMM d, yyyy')
         } to {
           format(new Date(filteredEvents[filteredEvents.length-1]?.date), 'MMM d, yyyy')
         }</span>
        }
      </CardFooter>
    </Card>
  );
}