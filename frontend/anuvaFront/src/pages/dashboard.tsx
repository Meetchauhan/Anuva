import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { DashboardStats, PatientWithRisk, SoapNote } from "@/types";
import { StatusCard } from "@/components/dashboard/status-card";
import { PatientRiskList } from "@/components/dashboard/patient-risk-list";
import { PatientDetail } from "@/components/dashboard/patient-detail";
import { EnhancedAIDocumentation } from "@/components/dashboard/enhanced-ai-documentation";
import { CalendarView } from "@/components/dashboard/calendar-view";
import { SymptomAnalytics } from "@/components/dashboard/symptom-analytics";
import { TreatmentAnalytics } from "@/components/dashboard/treatment-analytics";
import { PatientCohortAnalytics } from "@/components/dashboard/patient-cohort-analytics";
import { PatientVisitAnalytics } from "@/components/dashboard/patient-visit-analytics";
import { ClinicTeamWidget } from "@/components/clinic/clinic-team-widget";
import { CustomizableDashboard } from "@/components/dashboard/customizable-dashboard";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/admin-header";

import { PatientCombinedRecordV1_2 } from '@/types/index_v2'

import { usePatientsData } from "@/config/apiQueries";

export default function Dashboard() {
  // Track the selected patient
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  // State for support widget expanded status
  const [supportWidgetExpanded, setSupportWidgetExpanded] = useState(false);

  // Fetch dashboard stats
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError
  } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats']
  });
  const { patients, patientsLoading, patientsError } = usePatientsData();
  // const {
  //   data: patientsData,
  //   isLoading: patientsLoading,
  //   error: patientsError,
  // } = useQuery<PatientCombinedRecordV1_2[]>({
  //   queryKey: ['/api/v2/patients'],
  // });

  // const patients = patientsData?.map(patientData =>
  //   new PatientCombinedRecordV1_2(
  //     patientData.meta_patient,
  //     patientData.symptom_checklist,
  //     patientData.injury
  //   )
  // ) || [];

  // useEffect(() => {
  //   console.log(patients); // Log the patients data to the console
  // }, [patients]);

  // Fetch patients with risk scores
  // const {
  //   data: patients,
  //   isLoading: patientsLoading,
  //   error: patientsError
  // } = useQuery<PatientWithRisk[]>({
  //   queryKey: ['/api/patients/with-risk']
  // });

  // Fetch SOAP note for the selected patient
  const {
    data: patientSoapNotes,
    isLoading: soapLoading,
    error: soapError
  } = useQuery<SoapNote[]>({
    queryKey: selectedPatientId
      ? ['/api/patients', selectedPatientId, 'soap-notes']
      : ['/api/soap-notes', 'empty'],
    enabled: !!selectedPatientId
  });

  // Update document title
  useEffect(() => {
    document.title = "Dashboard | Anuva OS";
  }, []);

  // Display loading state if everything is loading
  if (statsLoading && patientsLoading) {
    return (
      <div className="p-4 md:p-6">
        <Header title="Clinical Dashboard" />
        <div className="text-center p-8 text-neutral-400">
          Loading dashboard data...
        </div>
      </div>
    );
  }

  // Display error state if there's a critical error
  if ((statsError || patientsError) && !stats && !patients) {
    return (
      <div className="p-4 md:p-6">
        <Header title="Clinical Dashboard" />
        <div className="text-center p-8 text-status-red">
          Error loading dashboard: {statsError ? (statsError as Error).message :
            patientsError ? (patientsError as Error).message : 'Unknown error'}
        </div>
      </div>
    );
  }

  // Get the selected patient by ID
  const selectedPatient = selectedPatientId && patients
    ? patients.find(patient => patient.id === selectedPatientId)
    : undefined;

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-start">
        <Header title="Concussion Clinic" />

        {/* Team communication */}
        <div className="flex flex-col w-72 lg:w-80 shrink-0 mt-1 ml-3 gap-3">
          <ClinicTeamWidget
            expanded={supportWidgetExpanded}
            onToggleExpand={() => setSupportWidgetExpanded(!supportWidgetExpanded)}
          />
        </div>
      </div>

      {/* Patient Status Summary */}
      <StatusCard
        stats={stats || {
          totalPatients: 0,
          activePatients: 0,
          criticalCount: 0,
          recoveringCount: 0,
          stableCount: 0,
          todaysAppointments: 0,
          pendingDocumentation: 0,
          aiDraftsReady: 0,
          completedToday: 0
        }}
      />

      {/* Enhanced Clinical CRM Dashboard with Tabs */}
      <Tabs defaultValue="patients" className="mb-6">
        <TabsList className="mb-4 flex bg-muted rounded-sm p-1 overflow-x-auto">
          <TabsTrigger
            value="patients"
            className="flex-shrink-0 px-4 py-2 text-foreground/80 data-[state=active]:text-primary-light data-[state=active]:bg-background rounded-sm"
          >
            Patient Management
          </TabsTrigger>
          <TabsTrigger
            value="symptoms"
            className="flex-shrink-0 px-4 py-2 text-foreground/80 data-[state=active]:text-primary-light data-[state=active]:bg-background rounded-sm"
          >
            Symptom Analytics
          </TabsTrigger>
          <TabsTrigger
            value="treatments"
            className="flex-shrink-0 px-4 py-2 text-foreground/80 data-[state=active]:text-primary-light data-[state=active]:bg-background rounded-sm"
          >
            Treatment Analytics
          </TabsTrigger>
          <TabsTrigger
            value="cohort"
            className="flex-shrink-0 px-4 py-2 text-foreground/80 data-[state=active]:text-primary-light data-[state=active]:bg-background rounded-sm"
          >
            Cohort Analytics
          </TabsTrigger>
          <TabsTrigger
            value="schedule"
            className="flex-shrink-0 px-4 py-2 text-foreground/80 data-[state=active]:text-primary-light data-[state=active]:bg-background rounded-sm"
          >
            Calendar
          </TabsTrigger>
          <TabsTrigger
            value="ai"
            className="flex-shrink-0 px-4 py-2 text-foreground/80 data-[state=active]:text-primary-light data-[state=active]:bg-background rounded-sm"
          >
            AI Documentation
          </TabsTrigger>
          <TabsTrigger
            value="widgets"
            className="flex-shrink-0 px-4 py-2 text-foreground/80 data-[state=active]:text-primary-light data-[state=active]:bg-background rounded-sm"
          >
            Custom Widgets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patients">
          <div className="space-y-6">
            {/* Patient Risk Stratification */}
            <PatientRiskList
              patients={patients || []}
              loading={patientsLoading}
              error={patientsError ? (patientsError as Error).message : ''}
              onSelectPatient={setSelectedPatientId}
            />

            {/* Calendar View */}
            <div className="bg-card rounded-lg shadow border border-border p-6">
              <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
              <CalendarView />
            </div>

            {/* Patient Detail View - Only show when a patient is selected */}
            {selectedPatient && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Patient Details</h2>
                  <Button
                    variant="outline"
                    className="text-sm"
                    onClick={() => setSelectedPatientId(null)}
                  >
                    Close
                  </Button>
                </div>
                <PatientDetail
                  patient={selectedPatient}
                  concussion={selectedPatient.concussion}
                  checkins={selectedPatient.lastCheckin ? [selectedPatient.lastCheckin] : []} // For demo, just show the most recent
                  riskLevel={selectedPatient.riskLevel}
                  loading={patientsLoading}
                  error={patientsError ? (patientsError as Error).message : ''}
                />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="symptoms">
          {/* Symptom Data Analytics */}
          <div className="space-y-6">
            <PatientVisitAnalytics />
            <SymptomAnalytics
              patients={patients || []}
              loading={patientsLoading}
              error={patientsError ? (patientsError as Error).message : ''}
            />
          </div>
        </TabsContent>

        <TabsContent value="treatments">
          {/* Treatment Analytics */}
          <TreatmentAnalytics
            patients={patients || []}
            soapNotes={patientSoapNotes}
            loading={patientsLoading || soapLoading}
            error={patientsError ? (patientsError as Error).message :
              soapError ? (soapError as Error).message : ''}
          />
        </TabsContent>

        <TabsContent value="cohort">
          {/* Patient Cohort Analytics */}
          <PatientCohortAnalytics
            patients={patients || []}
            loading={patientsLoading}
            error={patientsError ? (patientsError as Error).message : ''}
          />
        </TabsContent>

        <TabsContent value="schedule">
          {/* Smart Calendar View */}
          <CalendarView />
        </TabsContent>

        <TabsContent value="ai">
          {/* AI Documentation Assistant */}
          <EnhancedAIDocumentation />
        </TabsContent>

        <TabsContent value="widgets">
          {/* Customizable Dashboard Widgets */}
          <CustomizableDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
