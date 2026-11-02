export interface PatientProfile {
  id: number;
  fullName: string;
  dateOfBirth: string | null;
  gender: string | null;
  bloodGroup: string | null;
  emergencyContact: string | null;
}

export interface PatientProfileUpdateRequest {
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  emergencyContact?: string;
}