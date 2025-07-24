import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import {
  Activity,
  Brain,
  Heart,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  User
} from 'lucide-react';
import type { Patient, SymptomCheckin } from '../../types';

interface PatientSelectorSymptomDashboardProps {
  className?: string;
}

// Sample symptom progression data for different patients
const generatePatientSymptomData = (patientId: number) => {
  const patientProfiles = {
    1: { // Michael Thompson - more severe case
      baseSymptoms: { cognitive: 4.2, physical: 3.8, emotional: 2.9, sleep: 4.5 },
      trend: 'improving',
      riskLevel: 'moderate'
    },
    2: { // Sarah Johnson - milder case
      baseSymptoms: { cognitive: 2.1, physical: 2.5, emotional: 1.8, sleep: 2.8 },
      trend: 'stable',
      riskLevel: 'low'
    },
    3: { // James Wilson - severe case
      baseSymptoms: { cognitive: 5.2, physical: 4.8, emotional: 4.1, sleep: 5.5 },
      trend: 'declining',
      riskLevel: 'high'
    }
  };

  const profile = patientProfiles[patientId as keyof typeof patientProfiles] || patientProfiles[1];
  
  // Generate 7-day symptom progression
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, index) => {
    const trendMultiplier = profile.trend === 'improving' ? (7 - index) / 7 : 
                           profile.trend === 'declining' ? (index + 3) / 7 : 1;
    
    return {
      day,
      cognitive: Math.max(0, profile.baseSymptoms.cognitive * trendMultiplier + (Math.random() - 0.5) * 0.5),
      physical: Math.max(0, profile.baseSymptoms.physical * trendMultiplier + (Math.random() - 0.5) * 0.5),
      emotional: Math.max(0, profile.baseSymptoms.emotional * trendMultiplier + (Math.random() - 0.5) * 0.5),
      sleep: Math.max(0, profile.baseSymptoms.sleep * trendMultiplier + (Math.random() - 0.5) * 0.5),
      total: 0
    };
  }).map(item => ({
    ...item,
    total: item.cognitive + item.physical + item.emotional + item.sleep
  }));
};

// Generate radar chart data for symptom categories
const generateRadarData = (patientId: number) => {
  const data = generatePatientSymptomData(patientId);
  const latest = data[data.length - 1];
  const baseline = data[0];
  
  return [
    { subject: 'Cognitive', current: latest.cognitive, baseline: baseline.cognitive, fullMark: 6 },
    { subject: 'Physical', current: latest.physical, baseline: baseline.physical, fullMark: 6 },
    { subject: 'Emotional', current: latest.emotional, baseline: baseline.emotional, fullMark: 6 },
    { subject: 'Sleep', current: latest.sleep, baseline: baseline.sleep, fullMark: 6 }
  ];
};

// Generate key metrics for patient
const generatePatientMetrics = (patientId: number) => {
  const data = generatePatientSymptomData(patientId);
  const latest = data[data.length - 1];
  const previous = data[data.length - 2];
  
  const totalChange = latest.total - previous.total;
  const trend = totalChange < -0.3 ? 'improving' : totalChange > 0.3 ? 'worsening' : 'stable';
  
  return {
    totalSymptomScore: latest.total.toFixed(1),
    weeklyChange: totalChange.toFixed(1),
    trend,
    dominantSymptom: Object.entries({
      cognitive: latest.cognitive,
      physical: latest.physical,
      emotional: latest.emotional,
      sleep: latest.sleep
    }).reduce((a, b) => a[1] > b[1] ? a : b)[0],
    riskLevel: latest.total > 15 ? 'high' : latest.total > 8 ? 'moderate' : 'low'
  };
};

export function PatientSelectorSymptomDashboard({ className }: PatientSelectorSymptomDashboardProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<number>(1);

  // Fetch patient list
  const { data: patientsData, isLoading: patientsLoading } = useQuery({
    queryKey: ['/api/patients/with-risk']
  });

  const patients: Patient[] = Array.isArray(patientsData) ? patientsData : [];
  const selectedPatient = patients.length > 0 ? patients.find((p: Patient) => p.id === selectedPatientId) || patients[0] : null;
  
  // Debug logging to check patient data
  console.log('Patients data:', patients);
  console.log('Selected patient ID:', selectedPatientId);
  console.log('Selected patient:', selectedPatient);

  const symptomData = generatePatientSymptomData(selectedPatientId);
  const radarData = generateRadarData(selectedPatientId);
  const metrics = generatePatientMetrics(selectedPatientId);

  if (patientsLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-12 bg-muted rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingDown className="h-4 w-4 text-green-500" />;
      case 'worsening': return <TrendingUp className="h-4 w-4 text-red-500" />;
      default: return <Target className="h-4 w-4 text-blue-500" />;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-500 bg-red-50 border-red-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Patient Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Patient Symptom Analytics</h2>
          <p className="text-muted-foreground">
            Monitor individual patient symptom trends and recovery progress
          </p>
        </div>
        
        {/* Prominent Patient Selector */}
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-3 py-1">
            <Activity className="h-4 w-4 mr-1" />
            Live Dashboard
          </Badge>
          
          <div className="min-w-[280px]">
            <label htmlFor="patient-select" className="text-sm font-medium text-muted-foreground mb-2 block">
              Select Patient:
            </label>
            <Select 
              value={selectedPatientId.toString()} 
              onValueChange={(value) => setSelectedPatientId(parseInt(value))}
            >
              <SelectTrigger className="w-full bg-background border-2 border-primary/20 hover:border-primary/40 transition-colors">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-primary" />
                  <SelectValue>
                    {selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : "Choose a patient to analyze"}
                  </SelectValue>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Michael Thompson</span>
                    <Badge variant="outline" className="text-xs text-yellow-600 bg-yellow-50 border-yellow-200">
                      moderate
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Emma Rodriguez</span>
                    <Badge variant="outline" className="text-xs text-green-600 bg-green-50 border-green-200">
                      low
                    </Badge>
                  </div>
                </SelectItem>
                <SelectItem value="3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">James Wilson</span>
                    <Badge variant="outline" className="text-xs text-green-600 bg-green-50 border-green-200">
                      low
                    </Badge>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {selectedPatient && (
        <>
          {/* Patient Overview Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Score</p>
                    <p className="text-2xl font-bold">{metrics.totalSymptomScore}</p>
                  </div>
                  <Activity className="h-5 w-5 text-blue-500" />
                </div>
                <div className="mt-2">
                  <Progress value={(parseFloat(metrics.totalSymptomScore) / 24) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Weekly Change</p>
                    <p className="text-2xl font-bold">{metrics.weeklyChange}</p>
                  </div>
                  {getTrendIcon(metrics.trend)}
                </div>
                <p className="text-xs text-muted-foreground mt-1 capitalize">{metrics.trend}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Primary Concern</p>
                    <p className="text-2xl font-bold capitalize">{metrics.dominantSymptom}</p>
                  </div>
                  <Brain className="h-5 w-5 text-purple-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Most affected domain</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Risk Level</p>
                    <p className={`text-2xl font-bold capitalize ${getRiskColor(metrics.riskLevel).split(' ')[0]}`}>
                      {metrics.riskLevel}
                    </p>
                  </div>
                  {metrics.riskLevel === 'high' ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Current assessment</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics Tabs */}
          <Tabs defaultValue="trends" className="space-y-4">
            <TabsList>
              <TabsTrigger value="trends">Symptom Trends</TabsTrigger>
              <TabsTrigger value="domains">Domain Analysis</TabsTrigger>
              <TabsTrigger value="insights">Clinical Insights</TabsTrigger>
            </TabsList>

            {/* Symptom Trends */}
            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>7-Day Symptom Progression</CardTitle>
                  <CardDescription>
                    Daily symptom severity tracking for {selectedPatient.firstName} {selectedPatient.lastName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={symptomData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="day" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" domain={[0, 6]} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px'
                          }}
                          formatter={(value, name) => [
                            `${(value as number).toFixed(1)}`,
                            name
                          ]}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="cognitive"
                          stroke="#3B82F6"
                          strokeWidth={2}
                          name="Cognitive"
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="physical"
                          stroke="#EF4444"
                          strokeWidth={2}
                          name="Physical"
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="emotional"
                          stroke="#10B981"
                          strokeWidth={2}
                          name="Emotional"
                          dot={{ r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="sleep"
                          stroke="#8B5CF6"
                          strokeWidth={2}
                          name="Sleep"
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Symptom Load</CardTitle>
                  <CardDescription>
                    Combined symptom severity across all domains
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={symptomData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="day" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            borderRadius: '8px'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="total"
                          stroke="#3B82F6"
                          fillOpacity={1}
                          fill="url(#colorTotal)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Domain Analysis */}
            <TabsContent value="domains" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Symptom Domain Radar</CardTitle>
                    <CardDescription>
                      Current vs baseline symptom severity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={radarData}>
                          <PolarGrid />
                          <PolarAngleAxis 
                            dataKey="subject" 
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                          />
                          <PolarRadiusAxis 
                            angle={90} 
                            domain={[0, 6]} 
                            tick={{ fontSize: 10, fill: '#6B7280' }}
                          />
                          <Radar
                            name="Current"
                            dataKey="current"
                            stroke="#EF4444"
                            fill="#EF4444"
                            fillOpacity={0.3}
                            strokeWidth={2}
                          />
                          <Radar
                            name="Baseline"
                            dataKey="baseline"
                            stroke="#10B981"
                            fill="#10B981"
                            fillOpacity={0.2}
                            strokeWidth={2}
                          />
                          <Legend />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Domain Breakdown</CardTitle>
                    <CardDescription>
                      Current severity by symptom category
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {radarData.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{item.subject}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {item.current.toFixed(1)}/6
                            </span>
                            {item.current > item.baseline ? (
                              <TrendingUp className="h-4 w-4 text-red-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                        </div>
                        <Progress value={(item.current / 6) * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {item.current > item.baseline 
                            ? `${((item.current - item.baseline) / item.baseline * 100).toFixed(0)}% increase from baseline`
                            : `${((item.baseline - item.current) / item.baseline * 100).toFixed(0)}% improvement from baseline`
                          }
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Clinical Insights */}
            <TabsContent value="insights" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Clinical Recommendations</CardTitle>
                    <CardDescription>
                      AI-generated insights based on current symptom patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {metrics.riskLevel === 'high' && (
                      <div className="p-3 border border-red-200 bg-red-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-red-800">
                              High Symptom Burden Detected
                            </p>
                            <p className="text-xs text-red-700">
                              Consider immediate intervention and closer monitoring
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Brain className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-800">
                            Focus on {metrics.dominantSymptom} symptoms
                          </p>
                          <p className="text-xs text-blue-700">
                            Primary concern area requiring targeted treatment
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Clock className="h-4 w-4 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-green-800">
                            Follow-up Recommended
                          </p>
                          <p className="text-xs text-green-700">
                            Schedule next assessment within 48-72 hours
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recovery Milestones</CardTitle>
                    <CardDescription>
                      Progress tracking and next steps
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium">Initial Assessment Complete</p>
                          <p className="text-xs text-muted-foreground">Baseline established</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {metrics.trend === 'improving' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-blue-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium">Symptom Stabilization</p>
                          <p className="text-xs text-muted-foreground">
                            {metrics.trend === 'improving' ? 'Achieved' : 'In progress'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">Return to Activity</p>
                          <p className="text-xs text-muted-foreground">Target milestone</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

export default PatientSelectorSymptomDashboard;