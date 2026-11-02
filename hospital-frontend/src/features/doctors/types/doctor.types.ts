export interface DoctorResponse {
    id: number;
    fullName: string;
    specialization: string;
    qualification: string | null;
    experienceYears: number | null;
    consultationFee: number;
}

export interface DoctorSearchParams {
    specialization: string;
    page: number;
    size: number;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface DoctorProfile {
  id: number;
  fullName: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  consultationFee: number;
}

export interface DoctorProfileUpdateRequest {
  qualification?: string;
  experienceYears?: number;
  consultationFee?: number;
}