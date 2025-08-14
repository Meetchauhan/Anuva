import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Printer, Edit } from "lucide-react";
import { Patient, ConcussionEvent, SymptomCheckin } from "@/types";
import { RecoveryBadge } from "@/components/ui/recovery-badge";
import { SymptomSlider } from "@/components/ui/symptom-slider";
import { SymptomTrajectory } from "@/components/charts/symptom-trajectory";
import { formatDate, getAge, getDaysAgo, getFullName, groupSymptomsByCategory } from "@/lib/utils";

import { Filter, Plus, Search, Eye, Link as LinkIcon } from 'lucide-react';
import axios from 'axios';

interface CopyToClipboardState {
  notification: string;
  setNotification: Function;
  showNotification: boolean;
  setShowNotification: Function;
}

interface PatientDetailProps {
  patient: Patient;
  concussion?: ConcussionEvent;
  checkins?: SymptomCheckin[];
  riskLevel: 'critical' | 'recovering' | 'stable';
  loading?: boolean;
  error?: string;
  copyToClipboardState?: CopyToClipboardState;
}

export function PatientDetail({
  patient,
  concussion,
  checkins = [],
  riskLevel,
  loading,
  error,
  copyToClipboardState
}: PatientDetailProps) {
  // Get the latest checkin
  const latestCheckin = checkins.length > 0
    ? checkins.sort((a, b) => new Date(b.checkInDate).getTime() - new Date(a.checkInDate).getTime())[0]
    : undefined;

  // Group symptoms by category for display
  const symptomsGrouped = latestCheckin
    ? groupSymptomsByCategory(latestCheckin.symptoms)
    : {};

  if (loading) {
    return (
      <Card className="bg-neutral-900 border-neutral-800 mb-6">
        <CardHeader className="border-b border-neutral-800 flex-row justify-between items-center pb-4">
          <div className="flex items-center">
            <CardTitle className="text-lg font-semibold">Patient Details</CardTitle>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button variant="accent">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-neutral-400">
            Loading patient details...
          </div>
        </CardContent>
      </Card>
    );
  }

  // if (error) {
  //   return (
  //     <Card className="bg-neutral-900 border-neutral-800 mb-6">
  //       <CardHeader className="border-b border-neutral-800 flex-row justify-between items-center pb-4">
  //         <div className="flex items-center">
  //           <CardTitle className="text-lg font-semibold">Patient Details</CardTitle>
  //         </div>
  //         <div className="flex items-center space-x-3">
  //           <Button variant="outline" size="icon">
  //             <ArrowLeft className="h-5 w-5" />
  //           </Button>
  //           <Button variant="outline" size="icon">
  //             <ArrowRight className="h-5 w-5" />
  //           </Button>
  //           <Button variant="accent">
  //             <Edit className="h-4 w-4 mr-2" />
  //             Edit
  //           </Button>
  //         </div>
  //       </CardHeader>
  //       <CardContent>
  //         <div className="p-8 text-center text-status-red">
  //           Error loading patient details: {error}
  //         </div>
  //       </CardContent>
  //     </Card>
  //   );
  // }

  return (
    <Card className="bg-neutral-900 border-neutral-800 mb-6">
      <CardHeader className="border-b border-neutral-800 flex-row justify-between items-center pb-4">
        <div className="flex items-center">
          <CardTitle className="text-lg font-semibold">Patient Details</CardTitle>
          <RecoveryBadge status={riskLevel} className="ml-2" />
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <Printer className="h-5 w-5" />
          </Button>
          {/* Copy patient intake form to clipboard */}
          <Button
            variant="outline"
            className="shrink-0"
            onClick={() => {
              if (copyToClipboardState) {
                getIntakeForm(patient, copyToClipboardState);
              }
              else {
                console.error("copyToClipboardState is undefined");
              }
            }}
          >
            Patient Intake Form <LinkIcon className="h-4 w-4" />
          </Button>
          <Button variant="accent">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Patient Info */}
          <div className="md:col-span-1 bg-neutral-800 p-4 rounded-md">
            <div className="flex flex-col items-center mb-4">
              <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl mb-2">
                {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
              </div>
              <h3 className="text-lg font-semibold">
                {getFullName(patient.firstName, patient.lastName)}
              </h3>
              <p className="text-sm text-neutral-400">
                {getAge(patient.dateOfBirth)} years old • {patient.gender}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-neutral-400">INJURY TYPE</p>
                <p className="font-medium">{concussion?.sportActivity} Concussion</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">DATE OF INJURY</p>
                <p className="font-medium">{formatDate(concussion?.dateOfInjury ?? '')}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">DAYS SINCE INJURY</p>
                <p className="font-medium">{getDaysAgo(concussion?.dateOfInjury ?? '')}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">PRIMARY CONTACT</p>
                <p className="font-medium">{patient.emergencyContactName} ({patient.emergencyContactRelation})</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">PHONE</p>
                <p className="font-medium">{patient.emergencyContactPhone}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">EMAIL</p>
                <p className="font-medium">{patient.contactEmail}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400">SCHOOL/TEAM</p>
                <p className="font-medium">{patient.schoolOrTeam}</p>
              </div>
            </div>
          </div>

          {/* Symptom Tracking */}
          <div className="md:col-span-3">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-3">Symptom Trajectory</h3>
              <div className="bg-neutral-800 p-4 rounded-md">
                <SymptomTrajectory checkins={checkins} days={14} />
              </div>
            </div>

            {/* Symptom Assessment */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Current Symptom Assessment</h3>
                <span className="text-sm text-neutral-400">
                  Last updated: {latestCheckin ? formatDate(latestCheckin.checkInDate) : 'N/A'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cognitive Symptoms */}
                {symptomsGrouped.cognitive && (
                  <div className="bg-neutral-800 p-4 rounded-md">
                    <h4 className="text-sm uppercase text-neutral-400 mb-3">Cognitive Symptoms</h4>

                    <div className="space-y-4">
                      {symptomsGrouped.cognitive.map((symptom) => (
                        <SymptomSlider
                          key={symptom.name}
                          name={symptom.name}
                          value={symptom.value}
                          disabled
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Physical Symptoms */}
                {symptomsGrouped.physical && (
                  <div className="bg-neutral-800 p-4 rounded-md">
                    <h4 className="text-sm uppercase text-neutral-400 mb-3">Physical Symptoms</h4>

                    <div className="space-y-4">
                      {symptomsGrouped.physical.map((symptom) => (
                        <SymptomSlider
                          key={symptom.name}
                          name={symptom.name}
                          value={symptom.value}
                          disabled
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface SymptomCheckinRequestRead {
  id: number;
  patient_id: number;
  created_at: object;
}
async function getIntakeForm(patient: Patient, copyToClipboardState: CopyToClipboardState | undefined) {
  const _link = `${location.protocol}//${location.host}/api/patients/${patient.id}/check-in-request`;
  let response: { data: SymptomCheckinRequestRead };

  try {
    const axiosResp = await axios.get<SymptomCheckinRequestRead>(_link);
    response = { data: axiosResp.data };
  } catch (error) {
    response = {
      data: {
        id: 1,
        // Add any other required fields from SymptomCheckinRequestRead if necessary
      } as SymptomCheckinRequestRead,
    };
  }

  const link = `${location.protocol}//${location.host}/intake-form?requestID=${response.data.id}`;
  navigator.clipboard.writeText(link).then(() => {
    copyToClipboardState.setNotification(`${link} link copied to clipboard`);
    copyToClipboardState.setShowNotification(true);
    setTimeout(() => {
      copyToClipboardState.setShowNotification(false);
    }, 5000);
  });
}
