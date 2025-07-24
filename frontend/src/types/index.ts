// Define user roles as an enum for consistent usage
export enum UserRole {
  PROVIDER = 'provider',
  PATIENT = 'patient',
  CAREGIVER = 'caregiver'
}

// Define the base user type
export interface DbUser {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  speciality?: string;
  licenseNumber?: string;
  npi?: string;
  relationToPatient?: string;
  onboardingCompleted?: boolean;
  profileImageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the User interface with role
export interface User extends DbUser {
  role: UserRole;
}

// Registration data with role-specific fields
export type ProviderRegistrationData = {
  username: string;
  password: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: UserRole.PROVIDER;
  speciality: string;
  licenseNumber: string;
  npi?: string;
};

export type PatientRegistrationData = {
  username: string;
  password: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: UserRole.PATIENT;
};

export type CaregiverRegistrationData = {
  username: string;
  password: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: UserRole.CAREGIVER;
  relationToPatient: string;
};

// Union type for all registration data
export type UserRegistrationData = 
  | ProviderRegistrationData
  | PatientRegistrationData
  | CaregiverRegistrationData;
export interface Symptom {
  category: string;
  name: string;
  value: number;
}

export interface ClinicalAlert {
  message: string;
  severity: 'info' | 'warning' | 'critical';
  domain: string;
  relatedSymptoms?: string[];
  recommendation?: string;
}

export interface SuggestedOrder {
  name: string;
  category: string;
  rationale: string;
  evidenceLevel: string;
  completed: boolean;
}

export interface Patient {
  id: number;
  userId?: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  contactPhone?: string;
  contactEmail?: string;
  primaryCareProvider?: string;
  primaryCarePhone?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceGroupNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  schoolOrTeam?: string;
  mainSport?: string;
  position?: string;
  allergies?: string;
  medications?: string;
  priorConcussionHistory?: boolean;
  priorConcussionCount?: number;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ConcussionEvent {
  id: number;
  patientId: number;
  dateOfInjury: Date;
  mechanismOfInjury: string;
  sportActivity?: string;
  lossOfConsciousness?: boolean;
  amnesia?: boolean;
  description?: string;
  mediaUrl?: string;
  createdAt?: Date;
}

export interface SymptomCheckin {
  id: number;
  patientId: number;
  concussionId: number;
  checkInDate: Date;
  pcssTotal: number;
  symptoms: Symptom[];
  notes?: string;
  createdAt?: Date;
}

export interface SoapNote {
  id: number;
  patientId: number;
  concussionId: number;
  clinicianId: number;
  dateOfVisit: Date;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  status: string;
  aiGenerated?: boolean;
  clinicalAlerts: ClinicalAlert[];
  suggestedOrders: SuggestedOrder[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Appointment {
  id: number;
  patientId?: number;
  clinicianId: number;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: string;
  appointmentType: string;
  location?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Task {
  id: number;
  assignedTo: number;
  title: string;
  description?: string;
  dueDate: Date;
  priority: string;
  status: string;
  taskType: string;
  patientId?: number;
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  criticalCount: number;
  recoveringCount: number;
  stableCount: number;
  todaysAppointments: number;
  pendingDocumentation: number;
  aiDraftsReady: number;
  completedToday: number;
}

export interface PatientWithRisk extends Patient {
  concussion?: ConcussionEvent;
  lastCheckin?: SymptomCheckin;
  daysAgo: number;
  riskLevel: 'critical' | 'recovering' | 'stable' | 'waiting';
}