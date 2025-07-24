// Define common types used across the application

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