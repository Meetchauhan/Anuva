// Define user roles directly to avoid import issues
export type UserRole = 'provider' | 'patient' | 'caregiver';

// Define the User type with role information
export interface User {
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
  role: UserRole;
}

// Registration data with role-specific fields
export type ProviderRegistrationData = {
  username: string;
  password: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: 'provider';
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
  role: 'patient';
};

export type CaregiverRegistrationData = {
  username: string;
  password: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: 'caregiver';
  relationToPatient: string;
};

// Union type for all registration data
export type UserRegistrationData = 
  | ProviderRegistrationData
  | PatientRegistrationData
  | CaregiverRegistrationData;

// Auth context type
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: {
    mutate: (data: { username: string; password: string }) => void;
    isPending: boolean;
    error: Error | null;
  };
  registerMutation: {
    mutate: (data: UserRegistrationData) => void;
    isPending: boolean;
    error: Error | null;
  };
  logoutMutation: {
    mutate: () => void;
    isPending: boolean;
    error: Error | null;
  };
}