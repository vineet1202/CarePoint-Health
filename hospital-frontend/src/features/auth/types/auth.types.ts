export interface LoginRequest {
  email: string;
  password: string;
}

export interface PatientRegisterRequest { 
    email: string;
    password: string;
    fullName: string;
    dateOfBirth?: string | null;
    gender?: string | null;
    bloodGroup?: string | null;
    emergencyContact?: string | null;
}

export interface DoctorRegisterRequest {
  email: string;
  password: string;
  fullName: string;
  specialization: string;
  qualification?: string | null;
  experienceYears?: number | null;
  consultationFee: number;
}

export interface AuthResponse {
  userId: number;
  email: string;
  role: Role;
  token: string;
}

export type Role = "PATIENT" | "DOCTOR" | "ADMIN";