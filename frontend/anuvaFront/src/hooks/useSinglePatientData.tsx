import { usePatient } from './usePatient';

interface UseSinglePatientDataProps {
  patientId: string | number;
}

const useSinglePatientData = ({ patientId }: UseSinglePatientDataProps) => {
  const { patients, loading, error } = usePatient();
  
  // Find the patient with matching _id, convert patientId to string for comparison
  const patient = patients.users?.find((p: any) => p._id === String(patientId));
  
  return { 
    patient, 
    patientLoading: loading, 
    patientError: error,
  };
};

export default useSinglePatientData;