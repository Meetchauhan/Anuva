import React, { useState } from 'react';
import { PatientVisitAnalytics } from '../components/dashboard/patient-visit-analytics';
import { AISymptomAnalysis } from '../components/dashboard/ai-symptom-analysis';
import { DetailedSymptomProgression } from '../components/dashboard/detailed-symptom-progression';
import { PatientSelectorSymptomDashboard } from '../components/dashboard/patient-selector-symptom-dashboard';
import { SymptomAnalytics } from '../components/dashboard/symptom-analytics';
import { TreatmentAnalytics } from '../components/dashboard/treatment-analytics';
import { PatientCohortAnalytics } from '../components/dashboard/patient-cohort-analytics';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { Patient } from '../../shared/schema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Calendar, User, Activity, TrendingUp, Brain, Clock } from 'lucide-react';

export default function PatientAnalytics() {
  const [selectedPatientId, setSelectedPatientId] = useState<number>(1);
  
  // Get all patients for selection
  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ['/api/patients']
  });
  
  // Get patients with risk data (includes concussion and symptom check-in data)
  const { data: patientsWithRisk = [] } = useQuery({
    queryKey: ['/api/patients/with-risk']
  });
  
  // Get selected patient data with additional details
  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const selectedPatientWithRisk = patientsWithRisk.find((p: any) => p.id === selectedPatientId);
  
  // Get symptom check-ins for the selected patient
  const { data: symptomCheckins = [] } = useQuery({
    queryKey: [`/api/patients/${selectedPatientId}/symptom-checkins`],
    enabled: !!selectedPatientId
  });
  
  // Get concussions for the selected patient
  const { data: concussions = [] } = useQuery({
    queryKey: [`/api/patients/${selectedPatientId}/concussions`],
    enabled: !!selectedPatientId
  });
  
  // Get recovery milestones for the selected patient
  const { data: milestones = [] } = useQuery({
    queryKey: [`/api/patients/${selectedPatientId}/recovery-milestones`],
    enabled: !!selectedPatientId
  });
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Patient Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive patient health records and symptom progression analysis over time
        </p>
      </div>
      {/* Patient Selector */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Select Patient
          </CardTitle>
          <CardDescription>Choose a patient to view their detailed analytics and health record summaries</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedPatientId.toString()} onValueChange={(value) => setSelectedPatientId(parseInt(value))}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Select a patient..." />
            </SelectTrigger>
            <SelectContent>
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id.toString()}>
                  {patient.firstName} {patient.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedPatient && (
            <div className="mt-4 p-4 dark:bg-neutral-800 rounded-lg bg-[#121212]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{selectedPatient.firstName} {selectedPatient.lastName}</h3>
                <Badge variant="outline">{selectedPatient.gender}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  DOB: {selectedPatient.dateOfBirth}
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  {selectedPatient.schoolOrTeam || 'No team info'}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Tabs defaultValue="overview" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Patient Overview</TabsTrigger>
          <TabsTrigger value="symptoms">Symptom Analytics</TabsTrigger>
          <TabsTrigger value="treatment">Treatment Progress</TabsTrigger>
          <TabsTrigger value="cohort">Population Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Health Record Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Health Record Summary
              </CardTitle>
              <CardDescription>
                Complete medical history and concussion management timeline for {selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : 'selected patient'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Recent Activity
                  </h4>
                  <div className="space-y-3">
                    {selectedPatientWithRisk?.lastCheckin ? (
                      <div className="p-3 dark:bg-blue-900/20 rounded-lg bg-[#121212]">
                        <p className="text-sm font-medium">Latest Check-in</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedPatientWithRisk.daysAgo === 0 ? 'Today' : `${selectedPatientWithRisk.daysAgo} days ago`}
                        </p>
                        <p className="text-sm">PCSS Score: {selectedPatientWithRisk.lastCheckin.pcssTotal}/132</p>
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm font-medium">No Check-ins</p>
                        <p className="text-xs text-muted-foreground">No symptom check-ins recorded</p>
                      </div>
                    )}
                    
                    {milestones && milestones.length > 0 ? (
                      <div className="p-3 dark:bg-green-900/20 rounded-lg bg-[#121212]">
                        <p className="text-sm font-medium">Recovery Milestone</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(milestones[milestones.length - 1].createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-sm">{milestones[milestones.length - 1].milestoneName}</p>
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm font-medium">No Milestones</p>
                        <p className="text-xs text-muted-foreground">No recovery milestones set</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Progress Indicators
                  </h4>
                  <div className="space-y-3">
                    {selectedPatientWithRisk?.lastCheckin ? (
                      <>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Cognitive Recovery</span>
                            <span className="text-green-600">
                              {Math.max(0, 100 - Math.round((selectedPatientWithRisk.lastCheckin.symptoms?.filter((s: any) => s.category === 'cognitive').reduce((sum: number, s: any) => sum + s.value, 0) || 0) / 24 * 100))}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${Math.max(0, 100 - Math.round((selectedPatientWithRisk.lastCheckin.symptoms?.filter((s: any) => s.category === 'cognitive').reduce((sum: number, s: any) => sum + s.value, 0) || 0) / 24 * 100))}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Physical Recovery</span>
                            <span className="text-blue-600">
                              {Math.max(0, 100 - Math.round((selectedPatientWithRisk.lastCheckin.symptoms?.filter((s: any) => s.category === 'physical').reduce((sum: number, s: any) => sum + s.value, 0) || 0) / 72 * 100))}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${Math.max(0, 100 - Math.round((selectedPatientWithRisk.lastCheckin.symptoms?.filter((s: any) => s.category === 'physical').reduce((sum: number, s: any) => sum + s.value, 0) || 0) / 72 * 100))}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Overall Progress</span>
                            <span className="text-purple-600">
                              {Math.max(0, 100 - Math.round(selectedPatientWithRisk.lastCheckin.pcssTotal / 132 * 100))}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full" 
                              style={{ width: `${Math.max(0, 100 - Math.round(selectedPatientWithRisk.lastCheckin.pcssTotal / 132 * 100))}%` }}
                            ></div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        No symptom data available for progress calculation
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Treatment Timeline</h4>
                  <div className="space-y-3">
                    {selectedPatientWithRisk?.concussion ? (
                      <>
                        <div className="border-l-2 border-blue-500 pl-3">
                          <p className="text-sm font-medium">Initial Injury</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(selectedPatientWithRisk.concussion.dateOfInjury).toLocaleDateString()}
                          </p>
                          <p className="text-xs">{selectedPatientWithRisk.concussion.mechanismOfInjury}</p>
                        </div>
                        {selectedPatientWithRisk.concussion.sportActivity && (
                          <div className="border-l-2 border-yellow-500 pl-3">
                            <p className="text-sm font-medium">Activity</p>
                            <p className="text-xs text-muted-foreground">{selectedPatientWithRisk.concussion.sportActivity}</p>
                          </div>
                        )}
                        {selectedPatientWithRisk.lastCheckin && (
                          <div className="border-l-2 border-green-500 pl-3">
                            <p className="text-sm font-medium">Current Status</p>
                            <p className="text-xs text-muted-foreground">
                              {selectedPatientWithRisk.riskLevel === 'critical' ? 'Critical - Needs attention' :
                               selectedPatientWithRisk.riskLevel === 'recovering' ? 'Recovering well' :
                               selectedPatientWithRisk.riskLevel === 'stable' ? 'Stable condition' :
                               'Waiting for intake'}
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        No concussion data available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI-Enhanced Analysis */}
          <AISymptomAnalysis patientId={selectedPatientId} />
          
          {/* Detailed Symptom Progression */}
          <DetailedSymptomProgression 
            patientId={selectedPatientId} 
            patientName={selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : ""} 
          />
        </TabsContent>
        
        <TabsContent value="symptoms" className="space-y-6">
          <SymptomAnalytics patients={patients} />
          <PatientSelectorSymptomDashboard />
        </TabsContent>
        
        <TabsContent value="treatment" className="space-y-6">
          <TreatmentAnalytics patients={patients} />
          <PatientVisitAnalytics />
        </TabsContent>
        
        <TabsContent value="cohort" className="space-y-6">
          <PatientCohortAnalytics patients={patients} />
          
          {/* Population Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Population Analytics</CardTitle>
              <CardDescription>
                Compare patient outcomes across different demographics and injury types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">Recovery Time by Sport</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Football</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                        <span className="text-sm text-muted-foreground">18 days</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Soccer</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <span className="text-sm text-muted-foreground">14 days</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Basketball</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <span className="text-sm text-muted-foreground">11 days</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-4">Age Group Outcomes</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">13-15 years</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                        <span className="text-sm text-muted-foreground">90% recovery</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">16-18 years</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <span className="text-sm text-muted-foreground">85% recovery</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">19-22 years</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="text-sm text-muted-foreground">75% recovery</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}