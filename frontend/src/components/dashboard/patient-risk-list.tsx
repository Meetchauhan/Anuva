import { Link } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Filter, Download } from "lucide-react";
import type { PatientWithRisk } from "../../types";
import { RecoveryBadge } from "../ui/recovery-badge";
import type { cn, getFullName, getAge, formatDateShort, getDaysAgo } from "../../lib/utils";

interface PatientRiskListProps {
  patients: PatientWithRisk[];
  loading?: boolean;
  error?: string;
  onSelectPatient?: (patientId: number) => void;
}

export function PatientRiskList({ patients, loading, error, onSelectPatient }: PatientRiskListProps) {
  // Only show 3 patients in the list, others will be accessed via "View All"
  const displayPatients = patients.slice(0, 3);
  
  if (loading) {
    return (
      <Card className="bg-neutral-900 border-neutral-800 mb-6">
        <CardHeader className="border-b border-neutral-800 flex-row justify-between items-center pb-4">
          <CardTitle className="text-lg font-semibold">Patient Risk Stratification</CardTitle>
          <div className="flex items-center">
            <Button variant="ghost" size="icon">
              <Filter className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-8 text-center text-neutral-400">
            Loading patients...
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="bg-neutral-900 border-neutral-800 mb-6">
        <CardHeader className="border-b border-neutral-800 flex-row justify-between items-center pb-4">
          <CardTitle className="text-lg font-semibold">Patient Risk Stratification</CardTitle>
          <div className="flex items-center">
            <Button variant="ghost" size="icon">
              <Filter className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-8 text-center text-status-red">
            Error loading patients: {error}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (patients.length === 0) {
    return (
      <Card className="bg-neutral-900 border-neutral-800 mb-6">
        <CardHeader className="border-b border-neutral-800 flex-row justify-between items-center pb-4">
          <CardTitle className="text-lg font-semibold">Patient Risk Stratification</CardTitle>
          <div className="flex items-center">
            <Button variant="ghost" size="icon">
              <Filter className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Download className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-8 text-center text-neutral-400">
            No patients available
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-neutral-900 border-neutral-800 mb-6">
      <CardHeader className="border-b border-neutral-800 flex-row justify-between items-center pb-4">
        <CardTitle className="text-lg font-semibold">Patient Risk Stratification</CardTitle>
        <div className="flex items-center">
          <Button variant="ghost" size="icon">
            <Filter className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Download className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {displayPatients.map((patient) => (
          <div 
            key={patient.id} 
            className="border-b border-neutral-800 hover:bg-neutral-800/50 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className={cn(
                    "w-2 h-10 rounded-sm mr-3",
                    patient.riskLevel === 'critical' && "bg-status-red",
                    patient.riskLevel === 'recovering' && "bg-status-yellow",
                    patient.riskLevel === 'stable' && "bg-status-green",
                    patient.riskLevel === 'waiting' && "bg-blue-500"
                  )}
                />
                <div>
                  <div className="flex items-center">
                    <h3 className="font-medium">
                      {getFullName(patient.firstName, patient.lastName)}
                    </h3>
                    <RecoveryBadge status={patient.riskLevel} className="ml-2" />
                  </div>
                  <div className="flex items-center text-sm text-neutral-400 mt-1">
                    <span>{typeof patient.dateOfBirth === 'string' ? getAge(new Date(patient.dateOfBirth)) : '--'}</span>
                    <span className="mx-1">•</span>
                    <span>{patient.gender}</span>
                    {patient.concussion ? (
                      <>
                        <span className="mx-1">•</span>
                        <span>{patient.concussion.sportActivity} Concussion</span>
                        <span className="mx-1">•</span>
                        <span>{patient.concussion.dateOfInjury ? getDaysAgo(new Date(patient.concussion.dateOfInjury)) + ' days ago' : '--'}</span>
                      </>
                    ) : (
                      <>
                        <span className="mx-1">•</span>
                        {patient.status === 'waiting' ? (
                          <span className="text-blue-500 font-medium">Waiting for Digital Intake</span>
                        ) : (
                          <span className="text-amber-500 font-medium">Pending Intake Form</span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-right mr-6">
                  <div className="text-sm font-medium">PCSS Score</div>
                  <div 
                    className={cn(
                      "text-xl font-bold",
                      patient.riskLevel === 'critical' && "text-status-red",
                      patient.riskLevel === 'recovering' && "text-status-yellow",
                      patient.riskLevel === 'stable' && "text-status-green"
                    )}
                  >
                    {patient.lastCheckin?.pcssTotal ?? '-'}
                  </div>
                </div>
                {onSelectPatient ? (
                  <Button 
                    className="bg-primary hover:bg-primary-dark" 
                    onClick={() => onSelectPatient(patient.id)}
                  >
                    View Details
                  </Button>
                ) : (
                  <Link to={`/patients/${patient.id}`}>
                    <Button className="bg-primary hover:bg-primary-dark">
                      View Details
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
        
        <div className="p-3 text-center">
          <Link to="/patients">
            <div className="text-primary hover:text-primary-light text-sm font-medium cursor-pointer">
              View All Patients
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
