import { useState, useEffect } from 'react';
import { format, addDays, startOfDay, endOfDay, isToday, isSameDay, parseISO } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
interface CalendarEvent {
  id: number;
  itemType: 'appointment' | 'task';
  title: string;
  description: string | null;
  status: string;
  
  // Appointment specific fields
  patientId?: number | null;
  startDate?: Date;
  endDate?: Date;
  appointmentType?: string;
  location?: string | null;
  
  // Task specific fields
  dueDate?: Date;
  priority?: string;
  taskType?: string;
  assignedTo?: number;
  completedAt?: Date | null;
}

interface FilterProps {
  value: string;
  onChange: (value: string) => void;
}

const EventTypeFilter = ({ value, onChange }: FilterProps) => {
  return (
    <div className="space-x-2">
      <Button 
        variant={value === 'all' ? 'default' : 'outline'} 
        size="sm"
        onClick={() => onChange('all')}
      >
        All
      </Button>
      <Button 
        variant={value === 'appointment' ? 'default' : 'outline'} 
        size="sm"
        onClick={() => onChange('appointment')}
      >
        Appointments
      </Button>
      <Button 
        variant={value === 'task' ? 'default' : 'outline'}
        size="sm" 
        onClick={() => onChange('task')}
      >
        Tasks
      </Button>
    </div>
  );
};

// Calendar header component for day view
const DayViewHeader = ({ date, onPrevDay, onNextDay }: { 
  date: Date; 
  onPrevDay: () => void; 
  onNextDay: () => void; 
}) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">
          {isToday(date) ? 'Today' : format(date, 'EEEE')}
          <span className="ml-2 text-sm text-neutral-500 font-normal">
            {format(date, 'MMMM d, yyyy')}
          </span>
        </h2>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={onPrevDay}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Today
        </Button>
        <Button variant="outline" size="icon" onClick={onNextDay}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Calendar header for week view
const WeekViewHeader = ({ startDate, onPrevWeek, onNextWeek }: {
  startDate: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}) => {
  const endDate = addDays(startDate, 6);
  
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">
          Week of {format(startDate, 'MMMM d')}
          <span className="ml-2 text-sm text-neutral-500 font-normal">
            {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
          </span>
        </h2>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={onPrevWeek}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          This Week
        </Button>
        <Button variant="outline" size="icon" onClick={onNextWeek}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Calendar item component
const CalendarItem = ({ event }: { event: CalendarEvent }) => {
  // Event type specific styling
  const isAppointment = event.itemType === 'appointment';
  const isTask = event.itemType === 'task';
  
  // Determine background color based on event type and status
  let bgColorClass = 'bg-neutral-800';
  let borderColorClass = '';
  let textColorClass = '';
  
  if (isAppointment) {
    switch (event.appointmentType) {
      case 'initial':
        bgColorClass = 'bg-blue-900/30';
        borderColorClass = 'border-blue-700';
        break;
      case 'follow-up':
        bgColorClass = 'bg-green-900/30';
        borderColorClass = 'border-green-700';
        break;
      case 'evaluation':
        bgColorClass = 'bg-purple-900/30';
        borderColorClass = 'border-purple-700';
        break;
      case 'specialized':
        bgColorClass = 'bg-amber-900/30';
        borderColorClass = 'border-amber-700';
        break;
      case 'admin':
        bgColorClass = 'bg-gray-900/30';
        borderColorClass = 'border-gray-700';
        break;
      default:
        break;
    }
  } else if (isTask) {
    switch (event.priority) {
      case 'high':
        borderColorClass = 'border-red-700';
        break;
      case 'medium':
        borderColorClass = 'border-amber-700';
        break;
      case 'low':
        borderColorClass = 'border-green-700';
        break;
      default:
        break;
    }
    
    if (event.status === 'completed') {
      textColorClass = 'text-neutral-500 line-through';
    }
  }
  
  return (
    <div 
      className={cn(
        'p-3 border-l-4 rounded-sm mb-2',
        bgColorClass,
        borderColorClass,
        textColorClass
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="text-sm font-medium">{event.title}</div>
          <div className="text-xs text-neutral-400 mt-1">{event.description}</div>
          
          {/* Appointment-specific details */}
          {isAppointment && event.startDate && event.endDate && (
            <div className="flex items-center mt-1">
              <Clock className="w-3 h-3 mr-1" />
              <span className="text-xs">
                {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
              </span>
              
              {event.location && (
                <span className="text-xs ml-3 text-neutral-400">
                  @ {event.location}
                </span>
              )}
            </div>
          )}
          
          {/* Task-specific details */}
          {isTask && event.dueDate && (
            <div className="flex items-center mt-1">
              <Clock className="w-3 h-3 mr-1" />
              <span className="text-xs">
                Due {format(new Date(event.dueDate), 'h:mm a')}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-end">
          {/* Event type badge */}
          <Badge 
            variant="outline" 
            className={cn(
              "text-[10px] h-5",
              isAppointment ? "border-blue-500 text-blue-500" : "border-amber-500 text-amber-500"
            )}
          >
            {isAppointment ? event.appointmentType : event.taskType}
          </Badge>
          
          {/* If it's a patient appointment, show icon */}
          {isAppointment && event.patientId && (
            <div className="flex items-center mt-1 text-neutral-400">
              <Users className="w-3 h-3 mr-1" />
              <span className="text-xs">Patient</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Day view component
const DayView = ({ date, events }: { date: Date; events: CalendarEvent[] }) => {
  // Format date without time
  const formattedDate = format(date, 'yyyy-MM-dd');
  
  // Filter events for this day
  const dayEvents = events.filter(event => {
    const eventDate = event.itemType === 'appointment' 
      ? new Date(event.startDate!) 
      : new Date(event.dueDate!);
    
    return isSameDay(eventDate, date);
  });
  
  // Sort events by time
  const sortedEvents = [...dayEvents].sort((a, b) => {
    const timeA = a.itemType === 'appointment' 
      ? new Date(a.startDate!).getTime() 
      : new Date(a.dueDate!).getTime();
    
    const timeB = b.itemType === 'appointment' 
      ? new Date(b.startDate!).getTime() 
      : new Date(b.dueDate!).getTime();
    
    return timeA - timeB;
  });
  
  // Group events by hour
  const hours = [];
  for (let i = 8; i <= 17; i++) { // 8 AM to 5 PM
    const hour = new Date(date);
    hour.setHours(i, 0, 0, 0);
    
    const hourEvents = sortedEvents.filter(event => {
      const eventTime = event.itemType === 'appointment' 
        ? new Date(event.startDate!)
        : new Date(event.dueDate!);
      
      return eventTime.getHours() === i;
    });
    
    hours.push({
      hour,
      events: hourEvents
    });
  }
  
  return (
    <div className="space-y-1">
      {hours.map(({ hour, events }) => (
        <div key={hour.getTime()} className="flex">
          <div className="w-16 text-right pr-4 text-xs text-neutral-500 py-2">
            {format(hour, 'h:mm a')}
          </div>
          <div className="flex-1 border-l border-neutral-700 pl-4">
            {events.length > 0 ? (
              events.map(event => (
                <CalendarItem key={`${event.itemType}-${event.id}`} event={event} />
              ))
            ) : (
              <div className="h-10 py-2" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Week view component
const WeekView = ({ startDate, events }: { startDate: Date; events: CalendarEvent[] }) => {
  // Generate array of 7 days from start date
  const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map(day => {
        // Filter events for this day
        const dayEvents = events.filter(event => {
          const eventDate = event.itemType === 'appointment' 
            ? new Date(event.startDate!) 
            : new Date(event.dueDate!);
          
          return isSameDay(eventDate, day);
        });
        
        // Sort events by time
        const sortedEvents = [...dayEvents].sort((a, b) => {
          const timeA = a.itemType === 'appointment' 
            ? new Date(a.startDate!).getTime() 
            : new Date(a.dueDate!).getTime();
          
          const timeB = b.itemType === 'appointment' 
            ? new Date(b.startDate!).getTime() 
            : new Date(b.dueDate!).getTime();
          
          return timeA - timeB;
        });
        
        return (
          <div 
            key={day.toISOString()} 
            className={cn(
              "border border-neutral-800 rounded-md",
              isToday(day) && "bg-neutral-900/50 border-primary"
            )}
          >
            <div 
              className={cn(
                "text-center py-2 border-b border-neutral-800 font-semibold",
                isToday(day) && "bg-primary/10 text-primary"
              )}
            >
              <div className="text-xs">{format(day, 'EEEE')}</div>
              <div className="text-lg">{format(day, 'd')}</div>
            </div>
            <div className="p-2 max-h-96 overflow-y-auto">
              {sortedEvents.length > 0 ? (
                sortedEvents.map(event => (
                  <div 
                    key={`${event.itemType}-${event.id}`} 
                    className="mb-1 text-xs"
                  >
                    <div className={cn(
                      "px-2 py-1 rounded-sm truncate",
                      event.itemType === 'appointment' 
                        ? "bg-blue-900/30 border-l-2 border-blue-700" 
                        : "bg-amber-900/30 border-l-2 border-amber-700"
                    )}>
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="text-[10px] text-neutral-400">
                        {event.itemType === 'appointment' 
                          ? format(new Date(event.startDate!), 'h:mm a')
                          : format(new Date(event.dueDate!), 'h:mm a')}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-neutral-500 text-center p-2">
                  No events
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('day'); // 'day' or 'week'
  const [filter, setFilter] = useState('all'); // 'all', 'appointment', or 'task'
  
  // Calculate date ranges based on current view
  const startOfRange = view === 'day' 
    ? startOfDay(currentDate)
    : startOfDay(currentDate); // For week view, start with the current date
  
  const endOfRange = view === 'day'
    ? endOfDay(currentDate)
    : endOfDay(addDays(currentDate, 6)); // For week view, end 6 days later
  
  // Fetch calendar events
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['/api/calendar', startOfRange.toISOString(), endOfRange.toISOString(), filter],
    queryFn: async () => {
      const params = new URLSearchParams({
        startDate: startOfRange.toISOString(),
        endDate: endOfRange.toISOString()
      });
      
      const response = await fetch(`/api/calendar?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch calendar events');
      }
      
      const data = await response.json();
      
      // Filter events based on filter type
      if (filter !== 'all') {
        return data.filter((event: CalendarEvent) => event.itemType === filter);
      }
      
      return data;
    }
  });
  
  // Navigation handlers
  const goToPrevDay = () => {
    setCurrentDate(prev => addDays(prev, -1));
  };
  
  const goToNextDay = () => {
    setCurrentDate(prev => addDays(prev, 1));
  };
  
  const goToPrevWeek = () => {
    setCurrentDate(prev => addDays(prev, -7));
  };
  
  const goToNextWeek = () => {
    setCurrentDate(prev => addDays(prev, 7));
  };
  
  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardHeader className="border-b border-neutral-800 pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
            Smart Calendar
          </CardTitle>
          
          <Tabs value={view} onValueChange={setView} className="w-auto">
            <TabsList className="bg-neutral-800">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4">
        <div className="mb-4 flex justify-between items-center">
          {view === 'day' ? (
            <DayViewHeader 
              date={currentDate} 
              onPrevDay={goToPrevDay} 
              onNextDay={goToNextDay} 
            />
          ) : (
            <WeekViewHeader 
              startDate={currentDate} 
              onPrevWeek={goToPrevWeek} 
              onNextWeek={goToNextWeek} 
            />
          )}
        </div>
        
        <div className="mb-4">
          <EventTypeFilter value={filter} onChange={setFilter} />
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex">
                <Skeleton className="w-16 h-6 mr-4" />
                <Skeleton className="flex-1 h-16" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Failed to load calendar data. Please try again.
          </div>
        ) : (
          <Tabs value={view} className="w-full">
            <TabsContent value="day" className="mt-0">
              <DayView date={currentDate} events={events} />
            </TabsContent>
            
            <TabsContent value="week" className="mt-0">
              <WeekView startDate={currentDate} events={events} />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}