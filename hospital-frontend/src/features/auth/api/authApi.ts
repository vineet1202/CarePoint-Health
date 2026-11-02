import apiClient from "../../../lib/axios"
import type {
  LoginRequest,
  PatientRegisterRequest,
  DoctorRegisterRequest,
  AuthResponse,
} from "../types/auth.types";

export const login = async (
    credentials : LoginRequest
) : Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
        "/auth/login",
        credentials
    );
    return response.data;
}

export const registerPatient = async(
    request : PatientRegisterRequest
) : Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
        "/auth/register/patient",
        request
    );
    return response.data;
}

export const registerDoctor = async (
  request: DoctorRegisterRequest
): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    "/auth/register/doctor",
    request
  );

  return response.data;
};