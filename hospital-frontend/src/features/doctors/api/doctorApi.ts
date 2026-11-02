import type {
    DoctorProfile,
    DoctorProfileUpdateRequest,
    DoctorResponse,
    DoctorSearchParams,
    PageResponse,
} from "../types/doctor.types";
import apiClient from "@/lib/axios";

export const getDoctors = async (
    params: DoctorSearchParams
): Promise<PageResponse<DoctorResponse>> => {
    const response = await apiClient.get<PageResponse<DoctorResponse>>(
        "/doctors",
        { params }
    );

    return response.data;
};

export const getDoctorById = async (
    doctorId: number
): Promise<DoctorResponse> => {
    const response = await apiClient.get<DoctorResponse>(`/doctors/${doctorId}`);
    return response.data;
};

export async function getDoctorProfile(): Promise<DoctorProfile> {
  const response = await apiClient.get<DoctorProfile>(
    "/doctors/my",
  );

  return response.data;
}

export async function updateDoctorProfile(
  request: DoctorProfileUpdateRequest,
): Promise<DoctorProfile> {
  const response = await apiClient.put<DoctorProfile>(
    "/doctors/my",
    request,
  );

  return response.data;
}