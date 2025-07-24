// import { env } from "./apiEndpoints";

import { useQuery } from "@tanstack/react-query";
import type { PatientCombinedRecordV1_2, RelationalInjuryRead } from '../types/index_v2'
import type { PatientWithRisk } from "../types";
// import { Patient } from '../../../backend/shared/schema';
// import { ConcussionEvent } from '../../../backend/shared/schema';

// const env = require('./apiEndpoints') as 'sandbox' | 'production';

import { env } from "./apiEndpoints"

export function usePatientsData() {
    if (env === "production") {
        const {
            data: patientsData,
            isLoading: patientsLoading,
            error: patientsError
        } = useQuery<PatientCombinedRecordV1_2[]>({
            queryKey: ['/api/v2/patients']
        });

        const patients =
            patientsData?.map(
                (patientData) =>
                    new PatientCombinedRecordV1_2(
                        patientData.meta_patient,
                        patientData.symptom_checklist,
                        patientData.injury
                    )
            ) || [];

        return { patients, patientsLoading, patientsError };
    }
    const {
        data: patients,
        isLoading: patientsLoading,
        error: patientsError,
    } = useQuery<PatientWithRisk[]>({
        queryKey: ['/api/patients/with-risk'],
    });

    return { patients, patientsLoading, patientsError };
}

export function usePatientDataID(patientID: number) {
    if (env === "production") {

        const {
            data: patient_v2_head,
            isLoading: patientLoading,
            error: patientError
        } = useQuery<PatientCombinedRecordV1_2[]>({
            queryKey: [`/api/v2/patients/${patientID}`],
            enabled: !!patientID
        });

        const patientV2 = patient_v2_head?.map(patient_v2_head =>
            new PatientCombinedRecordV1_2(
                patient_v2_head.meta_patient,
                patient_v2_head.symptom_checklist,
                patient_v2_head.injury
            )
        ) || [];
        const patient = patientV2[0];
        return { patient, patientLoading, patientError, patient_v2_head };
    }
    // Fetch patient details
    const {
        data: patient,
        isLoading: patientLoading,
        error: patientError
    } = useQuery({
        queryKey: [`/api/patients/${patientID}`],
        enabled: !!patientID
    });

    const {
        data: _patient_v2_head
    } = useQuery<PatientWithRisk[]>({
        queryKey: ['/api/patients/with-risk']
    })
    const patient_v2_head = _patient_v2_head?.filter(
        (patient) => patient.id === patientID);
    return { patient, patientLoading, patientError, patient_v2_head };
}

export function usePatientConcussionsID(patientID: number) {
    if (env === "production") {
        const {
            data: _concussionsV2,
            isLoading: concussionLoading,
            error: concussionError
        } = useQuery<RelationalInjuryRead[]>({
            queryKey: [`/api/v2/patients/${patientID}/concussions`],
            enabled: !!patientID
        });

        const concussionV2 = _concussionsV2?.map(_concussionsV2 =>
            _concussionsV2.attributes
        ) || [];

        const concussions = concussionV2;
        return { concussions, concussionLoading, concussionError };
    }
    // Fetch patient details
    const {
        data: concussions,
        isLoading: concussionLoading,
        error: concussionError
    } = useQuery({
        queryKey: [`/api/patients/${patientID}/concussions`],
        enabled: !!patientID
    });

    return { concussions, concussionLoading, concussionError };
}

export async function useIntakeFormView(requestID: number) {
    if (env === "production") {

        const resp = await fetch(`${window.location.origin}/api/intake-form/${requestID}`,
            { signal: AbortSignal.timeout(5000) }
        );
        if (!resp.ok) {
            // setLoading(false);
            throw new Error("Failed to load form data");
        }
        const data = await resp.json();
        return data;
    }
    let data;
    data = {
        fullName: "First Last",
        dateOfExamination: "2024-09-23",
        race: "White",
        maritalStatus: "Single",
        numberOfChildren: 3,
        hearingImpairment: true,
        hearingAids: true,
        glassesOrContacts: false,
        occupation: "Doctor",
        employer: "HealthPlus",
        EeployerAddress: "656 Main St",
        enrolledInSchool: true,
        school: "Stanford",
        dateOfBirth: "2000-03-10",
        gender: "Female",
        createdAt: "2025-05-27T00:37:31.894757",
        updatedAt: "2025-05-27T00:37:31.894757",
    };
    return data;

}