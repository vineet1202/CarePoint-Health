
import type {
    AppointmentBookRequest,
    AppointmentResponse,
} from "../types/appointment.types";
import apiClient from "@/lib/axios";

export const bookAppointment = async (
    request: AppointmentBookRequest
): Promise<AppointmentResponse> => {
    const response = await apiClient.post<AppointmentResponse>(
        "/appointments",
        request
    );

    return response.data;
};

export const cancelAppointment = async (
    appointmentId: number
): Promise<void> => {
    await apiClient.delete(`/appointments/${appointmentId}`);
};

export const rescheduleAppointment = async (
    appointmentId: number,
    request: { newSlotId: number }
): Promise<AppointmentResponse> => {
    const response = await apiClient.put(
        `/appointments/${appointmentId}/reschedule`,
        request
    );

    return response.data;
};

//fetch all appointments for patient
export async function getMyAppointments(): Promise<AppointmentResponse[]> {
    const response = await apiClient.get<AppointmentResponse[]>(
        "/appointments/patient"
    );

    return response.data;
}

//fetch all appointments for doctor
export const getDoctorAppointments = async (
  date?: string
): Promise<AppointmentResponse[]> => {
  const response = await apiClient.get("/appointments/doctor", {
    params: date ? { date } : {},
  });

  return response.data;
};

// Get patient's appointment history for the logged-in doctor
export async function getDoctorPatientHistory(patientId: number) {
  const response = await apiClient.get<AppointmentResponse[]>(
    `/doctors/patients/${patientId}/appointments`,
  );

  return response.data;
}

