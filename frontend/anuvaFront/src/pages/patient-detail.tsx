import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { Patient, ConcussionEvent, SymptomCheckin, SoapNote, Appointment, RecoveryMilestone } from '@shared/schema';
import Header from '@/components/layout/admin-header';
import { PatientDetail as PatientDetailComponent } from '@/components/dashboard/patient-detail';
import { EnhancedAIDocumentation } from '@/components/dashboard/enhanced-ai-documentation';
import { AssessmentTools } from '@/components/patients/assessment-tools';
import { SymptomForm } from '@/components/patients/symptom-form';
import { PatientJourneyTimeline } from '@/components/patients/patient-journey-timeline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SymptomRadarChart from '@/components/dashboard/SymptomRadarChart';
import PatientCheckinPdfStub from '@/components/patient/patient-checkin-pdf-stub';

import { PatientCombinedRecordV1_2, RelationalInjuryRead, InjuryAttributesRead, RelationalSymptomChecklistRead } from '@/types/index_v2'

import { usePatientConcussionsID, usePatientDataID } from '@/config/apiQueries';
import useSinglePatientData from '@/hooks/useSinglePatientData';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { fetchPatients } from '@/features/patientSlice';

export default function PatientDetail() {
  const [match, params] = useRoute('/admin/patients/:id');
  // const [match, params] = useRoute('/patients/:id');
  const patientId = params?.id  ?? 0;
  const dispatch = useDispatch<AppDispatch>();

  // Copy to Clipboard utility
  const [notification, setNotification] = useState('');
  const [showNotification, setShowNotification] = useState(false);

  // Fetch patient details
  // const { patient, patientLoading, patientError, patient_v2_head } = usePatientDataID(patientId);
  const { patient, patientLoading, patientError} = useSinglePatientData({patientId:patientId});
  const { concussions, concussionLoading, concussionError } = usePatientConcussionsID(patientId);

  // Fetch symptom check-ins for patient
  const {
    data: checkins,
    isLoading: checkinsLoading,
    error: checkinsError
  } = useQuery<SymptomCheckin[]>({
    queryKey: [`/api/patients/${patientId}/symptom-checkins`],
    enabled: !!patientId
  });


  // Fetch SOAP notes for patient
  const {
    data: soapNotes,
    isLoading: soapLoading,
    error: soapError
  } = useQuery<SoapNote[]>({
    queryKey: [`/api/patients/${patientId}/soap-notes`],
    enabled: !!patientId
  });

  // Fetch appointments for patient
  // const {
  //   data: appointments,
  //   isLoading: appointmentsLoading,
  //   error: appointmentsError
  // } = useQuery<Appointment[]>({
  //   queryKey: [`/api/patients/${patientId}/appointments`],
  //   enabled: !!patientId
  // });

  // Fetch recovery milestones for patient
  const {
    data: milestones,
    isLoading: milestonesLoading,
    error: milestonesError
  } = useQuery<RecoveryMilestone[]>({
    queryKey: [`/api/patients/${patientId}/recovery-milestones`],
    enabled: !!patientId
  });

  // Get the most recent concussion
  const latestConcussion = concussions && concussions.length > 0
    ? concussions.sort((a, b) => new Date(b.dateOfInjury).getTime() - new Date(a.dateOfInjury).getTime())[0]
    : undefined;

  // Determine risk level based on PCSS score (if available)
  const getRiskLevel = () => {
    if (!checkins || checkins.length === 0) return 'stable';

    const sortedCheckins = [...checkins].sort(
      (a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime()
    );

    const latestScore = sortedCheckins[0].pcssTotal;

    if (latestScore > 60) return 'critical';
    if (latestScore > 30) return 'recovering';
    return 'stable';
  };

useEffect(()=>{
  dispatch(fetchPatients());
}, [dispatch]);

  // Update document title when patient data is loaded
  useEffect(() => {
    if (patient) {
      document.title = `${patient.firstName} ${patient.lastName} | Anuva OS`;
    } else {
      document.title = "Patient Details | Anuva OS";
    }
  }, [patient]);

  if (!match) {
    return <div>Patient not found</div>;
  }

  const isLoading = patientLoading || concussionLoading || checkinsLoading || soapLoading ||
    milestonesLoading;
  // appointmentsLoading || milestonesLoading;
  const hasError = patientError || concussionError || checkinsError || soapError ||
    milestonesError;

  const radarData = useMemo(() => {
    if (!patient || !patient.symptom_checklist) return ([{
      subject: "A", A: 1
    }, {
      subject: "B", A: 2
    }, {
      subject: "C", A: 3
    }, {
      subject: "D", A: 4
    }, {
      subject: "E", A: 5
    }, {
      subject: "F", A: 6
    }]);
    return Object.entries(patient.symptom_checklist.attributes)
      .filter(([key, val]) =>
        typeof val === 'number' &&
        !['userId', 'patientID', 'injuryID', 'TotalSymptoms', 'SymptomSeverityScore',
          'symptomChecklistID'
        ].includes(key)
      )
      .map(([subject, A]) => ({ subject, A: A as number }));
  }, [patient]);
  // appointmentsError || milestonesError;

  class CopyToClipboardState {
    notification: string;
    setNotification: Function;
    showNotification: boolean;
    setShowNotification: Function;

    constructor(notification: string,
      setNotification: Function,
      showNotification: boolean,
      setShowNotification: Function) {
      this.notification = notification;
      this.setNotification = setNotification;
      this.showNotification = showNotification;
      this.setShowNotification = setShowNotification;
    }
  }
  const copyToClipboardState = new CopyToClipboardState(
    notification, setNotification, showNotification, setShowNotification
  )
  if(patientLoading){
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#257450]"></div>
      </div>
    );
  }
  if(patientError){
    return <div>Error: {patientError}</div>;
  }
  return (
    <div className="p-4 md:p-6 bg-black">
     
      <Header title={patient ? `${patient.firstName} ${patient.lastName}` : "Patient Details"} />

      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="bg-neutral-800 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="journey">Recovery Journey</TabsTrigger>
          <TabsTrigger value="assessment">Assessment Tools</TabsTrigger>
          <TabsTrigger value="symptom-log">Symptom Log</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="radar">RADAR CHART</TabsTrigger>
          <TabsTrigger value="pdf">PDF GENERATION</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {patient && (
            <PatientDetailComponent
              patient={patient}
              concussion={latestConcussion}
              checkins={checkins || []}
              riskLevel={getRiskLevel()}
              loading={isLoading}
              error={hasError ? String(hasError) : undefined}
              copyToClipboardState={copyToClipboardState}
            />
          )}

          {soapNotes && soapNotes.length > 0 && (
            <EnhancedAIDocumentation
              soapNote={soapNotes[0]}
              loading={soapLoading}
              error={soapError ? String(soapError) : undefined}
            />
          )}
        </TabsContent>

        <TabsContent value="journey" style={{ maxWidth: '80vw' }}>
          {patient && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight mb-2">
                {patient.firstName} {patient.lastName}'s Recovery Journey
              </h2>
              <p className="text-muted-foreground mb-4">
                Chronological visualization of injury, assessments, treatments, and recovery milestones
              </p>

              {/* Timeline visualization for patient journey */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-border overflow-hidden">
                <div className="p-4 border-b border-border bg-gray-100 dark:bg-gray-700">
                  <h3 className="text-lg font-medium">Recovery Timeline</h3>
                </div>
                <div className="p-6" >
                  {/* Timeline entries for concussion event */}
                  {concussions && concussions.length > 0 && (
                    <div className="relative pb-8">
                      <div className="absolute top-5 left-4 -ml-px h-full w-0.5 bg-blue-500/50"></div>
                      <div className="relative flex items-start space-x-3">
                        <div>
                          <div className="relative px-1">
                            <div className="h-8 w-8 rounded-full bg-red-200 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm">
                              <span className="font-medium text-gray-900 dark:text-white">Concussion Event</span>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                              {new Date(concussions[0].dateOfInjury).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                            <p>
                              {concussions[0].description || concussions[0].mechanismOfInjury}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timeline entries for symptom check-ins */}
                  {checkins && checkins.length > 0 && checkins.slice().sort((a, b) =>
                    new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime()
                  ).map((checkin, index) => (
                    <div key={checkin.id} className="relative pb-8">
                      {
                        index < checkins.length - 1 ? (
                          <div className="absolute top-5 left-4 -ml-px h-full w-0.5 bg-blue-500/50"></div>
                        ) : null
                      }
                      < div className="relative flex items-start space-x-3" >
                        <div>
                          <div className="relative px-1">
                            <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm">
                              <span className="font-medium text-gray-900 dark:text-white">Symptom Check-in</span>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                              {new Date(checkin.checkInDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="mt-2 text-sm">
                            <p className="font-medium text-gray-800 dark:text-gray-200">PCSS Score: {checkin.pcssTotal}</p>
                            {checkin.symptoms && checkin.symptoms.length > 0 && (
                              <div className="mt-1">
                                <p className="text-gray-600 dark:text-gray-300 mb-1">Top symptoms:</p>
                                <div className="flex flex-wrap gap-1">
                                  {checkin.symptoms
                                    .sort((a, b) => b.value - a.value)
                                    .slice(0, 3)
                                    .map((symptom, i) => (
                                      <span key={i} className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${symptom.value > 4 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                        symptom.value > 2 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                          'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                        }`}>
                                        {symptom.name}: {symptom.value}/6
                                      </span>
                                    ))
                                  }
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* If we have soap notes, display them */}
                  {soapNotes && soapNotes.length > 0 && (
                    <div className="relative pb-8">
                      <div className="absolute top-5 left-4 -ml-px h-full w-0.5 bg-blue-500/50"></div>
                      <div className="relative flex items-start space-x-3">
                        <div>
                          <div className="relative px-1">
                            <div className="h-8 w-8 rounded-full bg-purple-200 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm">
                              <span className="font-medium text-gray-900 dark:text-white">Clinical Documentation</span>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                              {new Date(soapNotes[0].dateOfVisit).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                            <p className="font-medium">Assessment summary:</p>
                            <p className="mt-1 line-clamp-2">{soapNotes[0].assessment}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Display recovery milestones if available */}
                  {milestones && milestones.length > 0 && milestones.map((milestone, index) => (
                    <div key={milestone.id} className="relative pb-8" >
                      {index < milestones.length - 1 ? (
                        <div className="absolute top-5 left-4 -ml-px h-full w-0.5 bg-blue-500/50"></div>
                      ) : null}
                      <div className="relative flex items-start space-x-3">
                        <div>
                          <div className="relative px-1">
                            <div className="h-8 w-8 rounded-full bg-green-200 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <div className="text-sm">
                              <span className="font-medium text-gray-900 dark:text-white">Recovery Milestone</span>
                            </div>
                            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                              {new Date(milestone.achievedDate || milestone.createdAt || '').toLocaleDateString()}
                            </p>
                          </div>
                          <div className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                            <p className="font-medium">{milestone.milestoneName}</p>
                            <p className="mt-1">{milestone.notes}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Empty state if no timeline data */}
                  {(!concussions || concussions.length === 0) &&
                    (!checkins || checkins.length === 0) &&
                    (!soapNotes || soapNotes.length === 0) &&
                    (!milestones || milestones.length === 0) && (
                      <div className="py-12 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 8v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4H8a4 4 0 00-4 4z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No journey data</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          There is no journey data available for this patient yet.
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )
          }
        </TabsContent >

        <TabsContent value="assessment">
          <AssessmentTools
            patientId={patientId}
            concussionId={latestConcussion?.id}
          />
        </TabsContent>

        <TabsContent value="symptom-log">
          <SymptomForm
            patientId={patientId}
            concussionId={latestConcussion?.id}
            existingCheckins={checkins || []}
          />
        </TabsContent>

        <TabsContent value="documentation">
          {soapNotes && soapNotes.length > 0 ? (
            <EnhancedAIDocumentation
              soapNote={soapNotes[0]}
              loading={soapLoading}
              error={soapError ? String(soapError) : undefined}
            />
          ) : (
            <div className="bg-card p-8 rounded-lg text-center text-muted-foreground shadow-md border border-border/30">
              No documentation available for this patient
            </div>
          )}
        </TabsContent>
        <TabsContent value="radar">
          <SymptomRadarChart radarData={radarData} />
        </TabsContent>
        <TabsContent value="pdf">
          <PatientCheckinPdfStub jsonData={patient} />
        </TabsContent>
      </Tabs >

      {
        showNotification && (
          <div className="fixed bottom-0 left-0 right-0 bg-green-500 text-white p-4 text-center">
            {notification}
          </div>
        )
      }
    </div >
  );
}
