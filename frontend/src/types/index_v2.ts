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

    dateOfBirth?: string;
    gender?: string;
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
    pcssTotal: number;
}

export interface SymptomAttributesRead extends SymptomAttributesCreate {
    createdAt: string;
    updatedAt: string;
}

export interface RelationalSymptomChecklistCreate {
    symptomChecklistID: number;
    patientID: number;
    injuryID: number;
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

    get firstName(): string {
        return this.meta_patient.attributes.fullName;
    }

    get lastName(): string {
        return '';
    }

    get schoolOrTeam(): string {
        return this.meta_patient.attributes.school || '';
    }

    get sportActivity(): string {
        return this.meta_patient.attributes.occupation || '';
    }

    get concussion(): InjuryAttributesCreate {
        return this.injury && (this.injury.attributes);
    }

    get lastCheckin(): RelationalSymptomChecklistCreate {
        return this.symptom_checklist && (this.symptom_checklist.attributes);
    }

    get id(): number {
        return this.meta_patient.patientID;
    }

    get dateOfInjury(): string {
        return this.injury && (this.injury.attributes.dateOfInjury);
    }

    get riskLevel(): string {
        const pcssScore = this.symptom_checklist.attributes.pcssTotal;
        var riskLevel: string = "";
        if (pcssScore > 60) {
            riskLevel = 'critical';
        } else if (pcssScore > 30) {
            riskLevel = 'recovering';
        } else {
            riskLevel = 'stable';
        }
        return riskLevel;
    }

    get dateOfBirth(): string {
        return this.meta_patient.attributes.dateOfBirth || "";
    }
    get gender(): string {
        return this.meta_patient.attributes.gender || "";
    }

    get daysAgo(): number {
        // STUB
        return 0;
    }

    get status(): string {
        // STUB
        return "";
    }

}