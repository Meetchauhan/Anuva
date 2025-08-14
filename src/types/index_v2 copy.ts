export interface PatientAttributesCreate {
    fullName: string;
    dateOfExamination: string;
    race?: string;
    maritalStatus?: string;
    numberOfChildren?: number;
    hearingImpairment?: boolean;
    hearingAids?: boolean;
    glassesOrContacts?: boolean;
    occupation?: string;
    employer?: string;
    employerAddress?: string;
    enrolledInSchool?: boolean;
    school?: string;
}

export interface PatientAttributesRead extends PatientAttributesCreate {
    createdAt: string;
    updatedAt: string;
}

export interface RelationalPatientCreate {
    patientID: number;
    attributes: PatientAttributesCreate;
}

export interface RelationalPatientRead extends RelationalPatientCreate {
    createdAt: string;
    updatedAt: string;
}

export interface InjuryAttributesCreate {
    injuryID: number;
    patientID: number;
    dateOfInjury: string;
    sportOrActivity?: string;
    setting?: string;
    settingDetail?: string;
    position?: string;
    injuryDescription?: string;
    impactType?: string;
    impactDetail?: string;
    locationOfContact?: string;
    lLossOfConsciousness?: boolean;
    LOCDuration?: string;
    troubleRemembering?: boolean;
    memoryTroubleDuration?: string;
    feelConfused?: boolean;
    confusionDuration?: string;
    stoppedParticipation?: boolean;
    stopDuration?: string;
    returnedToParticipation?: boolean;
    returnDuration?: string;
    emergencyRoomVisit?: boolean;
    ERDetails?: string;
    testsPerformed?: string;
}

export interface InjuryAttributesRead extends InjuryAttributesCreate {
    createdAt: string;
    updatedAt: string;
}

export interface RelationalInjuryCreate {
    injuryID: number;
    patientID: number;
    attributes: InjuryAttributesCreate;
}

export interface RelationalInjuryRead extends RelationalInjuryCreate {
    createdAt: string;
    updatedAt: string;
}

export interface SymptomAttributesCreate {
    symptomChecklistID: number;
    patientID: number;
    injuryID: number;
    headache: number;
    pressureInHead: number;
    neckPain: number;
    troubleFallingAsleep: number;
    drowsiness: number;
    nauseaOrVomiting: number;
    fatigueOrLowEnergy: number;
    dizziness: number;
    blurredVision: number;
    balanceProblems: number;
    sensitivityToLight: number;
    sensitivityToNoise: number;
    feelingSlowedDown: number;
    feelingInAFog: number;
    dontFeelRight: number;
    difficultyConcentrating: number;
    difficultyRemembering: number;
    confusion: number;
    moreEmotional: number;
    irritability: number;
    sadnessOrDepression: number;
    nervousOrAnxious: number;
    worseWithPhysicalActivity?: boolean;
    worseWithMentalActivity?: boolean;
    totalSymptoms: number;
    symptomSeverityScore: number;
}

export interface SymptomAttributesRead extends SymptomAttributesCreate {
    createdAt: string;
    updatedAt: string;
}

export interface RelationalSymptomChecklistCreate {
    symptomChecklistID: number;
    patientID: number;
    attributes: SymptomAttributesCreate;
}

export interface RelationalSymptomChecklistRead extends RelationalSymptomChecklistCreate {
    createdAt: string;
    updatedAt: string;
}

export interface PatientCombinedRecordV2 {
    meta_patient: RelationalPatientRead;
    symptom_checklist: RelationalSymptomChecklistRead;
    injury: RelationalInjuryRead;

}

export class PatientCombinedRecordV1_2 implements PatientCombinedRecordV2 {
    meta_patient: RelationalPatientRead;
    symptom_checklist: RelationalSymptomChecklistRead;
    injury: RelationalInjuryRead;

    constructor(meta_patient: RelationalPatientRead,
        symptom_checklist: RelationalSymptomChecklistRead,
        injury: RelationalInjuryRead
    ) {
        this.meta_patient = meta_patient;
        this.symptom_checklist = symptom_checklist;
        this.injury = injury;
    }

    getValueByKey(key: string): any {
        const search = (obj: any): any => {
            if (obj && typeof obj === 'object') {
                if (key in obj) {
                    return obj[key];
                }
                for (const k in obj) {
                    const result = search(obj[k]);
                    if (result !== undefined) {
                        return result;
                    }
                }
            }
            return undefined;
        };
        return search(this);
    }

}
