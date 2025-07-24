import React from "react";
import { useState } from "react";
import { useAuth } from "../context/auth-context";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "../lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  User,
  CalendarDays,
  ArrowRight
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function CaregiverDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch patients under caregiver's care
  const { data: patients } = useQuery<any[]>({
    queryKey: ["/api/caregiver/patients"],
    throwOnError: false,
  });

  // Fetch appointments
  const { data: appointments } = useQuery<any[]>({
    queryKey: ["/api/caregiver/appointments"],
    throwOnError: false,
  });

  // Process patients data
  const patientsWithDetails = patients?.map(patient => {
    // In a real application, we would fetch this data
    // For now, we'll mock it with random data
    return {
      ...patient,
      patientName: `Michael Johnson`, // Example, in real app would fetch from patient ID
      lastCheckinDate: new Date(Date.now() - Math.floor(Math.random() * 7) * 86400000),
      lastSymptomScore: Math.floor(Math.random() * 40),
      recoveryProgress: Math.floor(Math.random() * 100),
      appointmentsThisWeek: Math.floor(Math.random() * 3),
      status: Math.random() > 0.7 ? 'critical' : Math.random() > 0.4 ? 'recovering' : 'stable'
    };
  }) || [];

  // Process upcoming appointments
  const upcomingAppointments = appointments?.filter(app => {
    const appDate = new Date(app.startDate);
    const today = new Date();
    return appDate >= today;
  }).sort((a, b) => {
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  }).slice(0, 5) || [];

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch(status) {
      case 'critical':
        return "destructive";
      case 'recovering':
        return "warning";
      case 'stable':
        return "success";
      default:
        return "secondary";
    }
  };

  // Get status text
  const getStatusText = (status: string) => {
    switch(status) {
      case 'critical':
        return "Needs Attention";
      case 'recovering':
        return "Recovering";
      case 'stable':
        return "Stable";
      default:
        return status;
    }
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, {user?.fullName}
          </h1>
          <p className="text-muted-foreground">
            Monitor patients under your care and track their recovery progress.
          </p>
        </div>
        <Button>Add a Patient</Button>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Patients Under Care
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{patientsWithDetails.length}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {patientsWithDetails.filter(p => p.status === 'critical').length} need attention
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Upcoming Appointments
                </CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {upcomingAppointments.length > 0 
                    ? `Next: ${formatDate(upcomingAppointments[0].startDate)}` 
                    : 'No upcoming appointments'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Patient Status
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Badge variant={"destructive" as any}>
                    {patientsWithDetails.filter(p => p.status === 'critical').length} Critical
                  </Badge>
                  <Badge variant={"warning" as any}>
                    {patientsWithDetails.filter(p => p.status === 'recovering').length} Recovering
                  </Badge>
                  <Badge variant={"success" as any}>
                    {patientsWithDetails.filter(p => p.status === 'stable').length} Stable
                  </Badge>
                </div>
                <Progress 
                  value={patientsWithDetails.length > 0 
                    ? (patientsWithDetails.filter(p => p.status === 'stable').length / patientsWithDetails.length) * 100
                    : 0
                  } 
                  className="mt-2" 
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Patients needing attention */}
          <Card>
            <CardHeader>
              <CardTitle>Patients Needing Attention</CardTitle>
              <CardDescription>
                Patients with critical symptoms or recovery concerns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {patientsWithDetails.filter(p => p.status === 'critical').length > 0 ? (
                <div className="space-y-4">
                  {patientsWithDetails
                    .filter(p => p.status === 'critical')
                    .map((patient) => (
                      <div key={patient.id} className="flex items-start space-x-4">
                        <div className="bg-destructive/10 p-2 rounded-md">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                        </div>
                        <div className="space-y-1 flex-1">
                          <div className="flex justify-between">
                            <p className="font-medium">{patient.patientName}</p>
                            <Badge variant={getStatusVariant(patient.status) as any}>
                              {getStatusText(patient.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Last symptom score: {patient.lastSymptomScore} (High)
                          </p>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="mr-1 h-3 w-3" />
                            <span>Last check-in: {formatDate(patient.lastCheckinDate)}</span>
                          </div>
                          <Button variant="outline" size="sm" className="mt-2">
                            View Details <ArrowRight className="ml-2 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-muted-foreground py-4 text-center">
                  No patients currently need attention
                </p>
              )}
            </CardContent>
          </Card>
          
          {/* Upcoming appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>
                Next scheduled appointments for patients under your care
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
                      <div className="space-y-1 flex-1">
                        <div className="flex justify-between">
                          <p className="font-medium">{appointment.title}</p>
                          <span className="text-sm text-muted-foreground">
                            {new Date(appointment.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
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
                <p className="text-muted-foreground py-4 text-center">No upcoming appointments</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Patients Tab */}
        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patients Under Your Care</CardTitle>
              <CardDescription>
                Monitor and manage patients' recovery progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              {patientsWithDetails.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Recovery Progress</TableHead>
                      <TableHead>Last Check-in</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientsWithDetails.map(patient => (
                      <TableRow key={patient.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>{patient.patientName.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{patient.patientName}</p>
                              <p className="text-sm text-muted-foreground">
                                Patient ID: {patient.patientId}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(patient.status) as any}>
                            {getStatusText(patient.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="w-full max-w-[150px]">
                            <div className="flex justify-between mb-1 text-xs">
                              <span>Recovery</span>
                              <span>{patient.recoveryProgress}%</span>
                            </div>
                            <Progress value={patient.recoveryProgress} className="h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{formatDate(patient.lastCheckinDate)}</p>
                            <p className="text-muted-foreground">
                              Score: {patient.lastSymptomScore}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground py-8 text-center">
                  No patients are currently under your care
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Appointments Tab */}
        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Appointments</CardTitle>
              <CardDescription>
                All upcoming appointments for patients under your care
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Appointment</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingAppointments.map(appointment => (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{appointment.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.appointmentType}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>{formatDate(appointment.startDate)}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(appointment.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                              {new Date(appointment.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p>Michael Johnson</p>
                            <p className="text-sm text-muted-foreground">
                              ID: {appointment.patientId || 'N/A'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {appointment.status || 'Scheduled'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground py-8 text-center">
                  No upcoming appointments scheduled
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}