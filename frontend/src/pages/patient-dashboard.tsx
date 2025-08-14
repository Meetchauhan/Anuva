import { useState, useEffect } from "react";
import useUserAuth  from "@/hooks/useUserAuth";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { formatDate, formatDateShort, getSymptomSeverityColor } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, Activity, Clipboard, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecoveryMilestone, Symptom, SymptomCheckin } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function PatientDashboard() {
  const user = useUserAuth();
  console.log("user--------", user);
  
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch patient data
  const { data: concussions } = useQuery<any[]>({
    queryKey: ["/api/patient/concussions"],
    throwOnError: false,
  });

  // Fetch symptom checkins
  const { data: symptomCheckins } = useQuery<SymptomCheckin[]>({
    queryKey: ["/api/patient/symptom-checkins"],
    throwOnError: false,
  });

  // Fetch recovery milestones
  const { data: recoveryMilestones } = useQuery<RecoveryMilestone[]>({
    queryKey: ["/api/patient/recovery-milestones"],
    throwOnError: false,
  });

  // Fetch appointments
  const { data: appointments } = useQuery<any[]>({
    queryKey: ["/api/patient/appointments"],
    throwOnError: false,
  });

  // Process recovery progress
  const completedMilestonesCount = recoveryMilestones?.filter(
    (milestone) => milestone.completed
  ).length || 0;
  
  const totalMilestonesCount = recoveryMilestones?.length || 0;
  const recoveryProgressPercentage = totalMilestonesCount 
    ? Math.round((completedMilestonesCount / totalMilestonesCount) * 100) 
    : 0;

  // Process upcoming appointments
  const upcomingAppointments = appointments?.filter(app => {
    const appDate = new Date(app.startDate);
    const today = new Date();
    return appDate >= today;
  }).sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  }).slice(0, 3) || [];

  // Process symptom data for charts
  const symptomData = symptomCheckins?.map(checkin => {
    const date = formatDateShort(checkin.checkInDate);
    
    // Calculate average symptom values per category
    const categories: Record<string, { count: number, total: number }> = {};
    
    checkin.symptoms.forEach((symptom: Symptom) => {
      if (!categories[symptom.category]) {
        categories[symptom.category] = { count: 0, total: 0 };
      }
      categories[symptom.category].count += 1;
      categories[symptom.category].total += symptom.value;
    });
    
    const result: any = { date };
    
    // Calculate averages
    Object.entries(categories).forEach(([category, data]) => {
      result[category] = Math.round(data.total / data.count);
    });
    
    // Add total PCSS score
    result.pcssTotal = checkin.pcssTotal;
    
    return result;
  }) || [];

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, {user?.user?.fullName || "User"}
          </h1>
          <p className="text-muted-foreground">
            Track your symptoms, recovery progress, and upcoming appointments.
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
          <TabsTrigger value="recovery">Recovery</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Recovery Progress
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recoveryProgressPercentage}%</div>
                <Progress value={recoveryProgressPercentage} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {completedMilestonesCount} of {totalMilestonesCount} milestones completed
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Days Since Injury
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {concussions && concussions.length > 0 ? (
                  <>
                    <div className="text-2xl font-bold">
                      {Math.floor((new Date().getTime() - new Date(concussions[0].dateOfInjury).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Injury date: {formatDate(concussions[0].dateOfInjury)}
                    </p>
                  </>
                ) : (
                  <div className="text-muted-foreground">No concussion data</div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Symptom Trend
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {symptomCheckins && symptomCheckins.length > 0 ? (
                  <>
                    <div className="text-2xl font-bold">
                      {symptomCheckins[symptomCheckins.length - 1].pcssTotal}
                    </div>
                    <div className="h-[60px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={symptomData.slice(-7)}>
                          <Line
                            type="monotone"
                            dataKey="pcssTotal"
                            stroke="#6E40C9"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last 7 days PCSS score trend
                    </p>
                  </>
                ) : (
                  <div className="text-muted-foreground">No symptom data</div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Upcoming appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>
                Your scheduled appointments with healthcare providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-2 rounded-md">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium">{appointment.title}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-1 h-3 w-3" />
                          <span>{formatDate(appointment.startDate)}</span>
                        </div>
                        {appointment.description && (
                          <p className="text-sm text-muted-foreground">
                            {appointment.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-4">
                    View All Appointments
                  </Button>
                </div>
              ) : (
                <p className="text-muted-foreground">No upcoming appointments</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Symptoms Tab */}
        <TabsContent value="symptoms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Symptom Trends</CardTitle>
              <CardDescription>
                Track your symptom severity over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {symptomData.length > 0 ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={symptomData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 6]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Physical" stroke="#ff7300" />
                      <Line type="monotone" dataKey="Cognitive" stroke="#387908" />
                      <Line type="monotone" dataKey="Sleep" stroke="#8884d8" />
                      <Line type="monotone" dataKey="Emotional" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-muted-foreground py-8 text-center">No symptom data available</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>PCSS Total Score</CardTitle>
              <CardDescription>
                Post-Concussion Symptom Scale total score over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {symptomData.length > 0 ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={symptomData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="pcssTotal" fill="#6E40C9" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-muted-foreground py-8 text-center">No symptom data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Recovery Tab */}
        <TabsContent value="recovery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recovery Milestones</CardTitle>
              <CardDescription>
                Track your progress through recovery milestones
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recoveryMilestones && recoveryMilestones.length > 0 ? (
                <div className="space-y-4">
                  {recoveryMilestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-start space-x-4">
                      <div className={`p-2 rounded-md ${milestone.completed ? 'bg-green-100' : 'bg-amber-100'}`}>
                        {milestone.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Clipboard className="h-5 w-5 text-amber-600" />
                        )}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">{milestone.title}</p>
                          <Badge variant={milestone.completed ? "outline" : "secondary"}>
                            {milestone.completed ? "Completed" : "Pending"}
                          </Badge>
                        </div>
                        {milestone.notes && (
                          <p className="text-sm text-muted-foreground">
                            {milestone.notes}
                          </p>
                        )}
                        <div className="flex items-center text-sm text-muted-foreground space-x-4">
                          {milestone.targetDate && (
                            <div className="flex items-center">
                              <Calendar className="mr-1 h-3 w-3" />
                              <span>Target: {formatDate(milestone.targetDate)}</span>
                            </div>
                          )}
                          {milestone.completedDate && (
                            <div className="flex items-center">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              <span>Completed: {formatDate(milestone.completedDate)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground py-4 text-center">No recovery milestones set</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recovery Progress</CardTitle>
              <CardDescription>
                Overall progress in your recovery journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm font-medium">{recoveryProgressPercentage}%</span>
                  </div>
                  <Progress value={recoveryProgressPercentage} className="h-2" />
                </div>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="font-medium text-green-800 mb-1">Completed</div>
                    <div className="text-2xl font-bold text-green-700">{completedMilestonesCount}</div>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <div className="font-medium text-amber-800 mb-1">In Progress</div>
                    <div className="text-2xl font-bold text-amber-700">
                      {totalMilestonesCount - completedMilestonesCount}
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="font-medium text-blue-800 mb-1">Total</div>
                    <div className="text-2xl font-bold text-blue-700">{totalMilestonesCount}</div>
                  </div>
                </div>
                
                {symptomCheckins && symptomCheckins.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <div className="font-medium mb-2">Latest Symptom Score</div>
                    <div className="text-2xl font-bold flex items-center">
                      {symptomCheckins[symptomCheckins.length - 1].pcssTotal}
                      <Badge 
                        className="ml-2" 
                        variant="outline" 
                        style={{ color: getSymptomSeverityColor(symptomCheckins[symptomCheckins.length - 1].pcssTotal) }}
                      >
                        {symptomCheckins[symptomCheckins.length - 1].pcssTotal > 20 ? 'High' : symptomCheckins[symptomCheckins.length - 1].pcssTotal > 10 ? 'Moderate' : 'Low'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Recorded on {formatDate(symptomCheckins[symptomCheckins.length - 1].checkInDate)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}