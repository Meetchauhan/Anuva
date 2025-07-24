import React, { useState, useEffect } from 'react';
import { WidgetManager, DashboardWidget } from './widget-manager';
import { StatusCard } from './status-card';
import { PatientRiskList } from './patient-risk-list';
import { CalendarView } from './calendar-view';
import { SymptomAnalytics } from './symptom-analytics';
import { TreatmentAnalytics } from './treatment-analytics';
import { PatientVisitAnalytics } from './patient-visit-analytics';
import { AIDocumentation } from './ai-documentation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Calendar, TrendingUp, Users, Activity, FileText, AlertTriangle, Clock } from 'lucide-react';

// Default widget configuration
const defaultWidgets: DashboardWidget[] = [
  {
    id: 'status-overview',
    title: 'Patient Status Overview',
    description: 'Quick stats on patient counts and risk levels',
    component: StatusCard,
    category: 'patient',
    size: 'small',
    isVisible: true,
    order: 0,
  },
  {
    id: 'high-risk-patients',
    title: 'High-Risk Patients',
    description: 'Patients requiring immediate attention',
    component: PatientRiskList,
    category: 'patient',
    size: 'medium',
    isVisible: true,
    order: 1,
  },
  {
    id: 'upcoming-appointments',
    title: 'Today\'s Schedule',
    description: 'Appointments and tasks for today',
    component: CalendarView,
    category: 'scheduling',
    size: 'medium',
    isVisible: true,
    order: 2,
  },
  {
    id: 'symptom-trends',
    title: 'Symptom Analytics',
    description: 'Trending symptoms across patient population',
    component: SymptomAnalytics,
    category: 'analytics',
    size: 'large',
    isVisible: true,
    order: 3,
  },
  {
    id: 'treatment-effectiveness',
    title: 'Treatment Analytics',
    description: 'Treatment outcomes and effectiveness metrics',
    component: TreatmentAnalytics,
    category: 'analytics',
    size: 'medium',
    isVisible: false,
    order: 4,
  },
  {
    id: 'patient-visits',
    title: 'Visit Analytics',
    description: 'Patient visit patterns and frequency',
    component: PatientVisitAnalytics,
    category: 'analytics',
    size: 'medium',
    isVisible: false,
    order: 5,
  },
  {
    id: 'ai-documentation',
    title: 'AI Documentation Assistant',
    description: 'AI-powered clinical documentation help',
    component: AIDocumentation,
    category: 'clinical',
    size: 'large',
    isVisible: false,
    order: 6,
  },
];

interface CustomizableDashboardProps {
  className?: string;
}

export function CustomizableDashboard({ className }: CustomizableDashboardProps) {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(() => {
    // Load saved widget configuration from localStorage
    const saved = localStorage.getItem('dashboard-widgets');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultWidgets;
      }
    }
    return defaultWidgets;
  });

  // Save widget configuration when it changes
  useEffect(() => {
    localStorage.setItem('dashboard-widgets', JSON.stringify(widgets));
  }, [widgets]);

  const handleUpdateWidgets = (updatedWidgets: DashboardWidget[]) => {
    setWidgets(updatedWidgets);
  };

  const visibleWidgets = widgets
    .filter(widget => widget.isVisible)
    .sort((a, b) => a.order - b.order);

  const getWidgetGridClass = (size: string) => {
    switch (size) {
      case 'small':
        return 'col-span-1';
      case 'medium':
        return 'col-span-2';
      case 'large':
        return 'col-span-3';
      default:
        return 'col-span-1';
    }
  };

  const getWidgetIcon = (category: string) => {
    switch (category) {
      case 'patient':
        return <Users className="h-4 w-4" />;
      case 'analytics':
        return <TrendingUp className="h-4 w-4" />;
      case 'scheduling':
        return <Calendar className="h-4 w-4" />;
      case 'clinical':
        return <Brain className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className={className}>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Clinical Dashboard</h1>
          <p className="text-muted-foreground">
            Personalized workspace for patient management and analytics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            {visibleWidgets.length} Active Widgets
          </Badge>
          <WidgetManager widgets={widgets} onUpdateWidgets={handleUpdateWidgets} />
        </div>
      </div>

      {/* Widgets Grid */}
      {visibleWidgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleWidgets.map((widget) => {
            const WidgetComponent = widget.component;
            return (
              <div key={widget.id} className={getWidgetGridClass(widget.size)}>
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base">
                      {getWidgetIcon(widget.category)}
                      {widget.title}
                      <Badge variant="secondary" className="text-xs">
                        {widget.category}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <WidgetComponent />
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-muted p-3">
                <AlertTriangle className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">No Widgets Enabled</h3>
                <p className="text-sm text-muted-foreground">
                  Enable widgets to customize your dashboard
                </p>
              </div>
              <WidgetManager widgets={widgets} onUpdateWidgets={handleUpdateWidgets} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats Footer */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Widgets</p>
                <p className="text-lg font-bold">{widgets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Active Widgets</p>
                <p className="text-lg font-bold">{visibleWidgets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Analytics Widgets</p>
                <p className="text-lg font-bold">
                  {widgets.filter(w => w.category === 'analytics' && w.isVisible).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-muted-foreground">Just now</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}