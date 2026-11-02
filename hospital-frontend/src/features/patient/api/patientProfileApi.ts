import apiClient from "@/lib/axios";
import type {
  PatientProfile,
  PatientProfileUpdateRequest,
} from "../types/patient.types";

export async function getPatientProfile(): Promise<PatientProfile> {
  const response = await apiClient.get<PatientProfile>("/patients/my");
  return response.data;
}

export async function updatePatientProfile(
  request: PatientProfileUpdateRequest,
): Promise<PatientProfile> {
  const response = await apiClient.put<PatientProfile>(
    "/patients/my",
    request,
  );

  return response.data;
}