import apiClient from "@/lib/axios";
import type { AppointmentResponse, ConsultationRequest, ConsultationResponse } from "../types/appointment.types";

export async function getPatientConsultation(appointmentId: number) {
  const response = await apiClient.get<ConsultationResponse>(
    `/consultations/appointments/${appointmentId}`,
  );

  return response.data;
}


export async function addAppointmentConsultation(
  appointmentId: number,
  request: ConsultationRequest,
) {
  const response = await apiClient.post<ConsultationResponse>(
    `/consultations/appointments/${appointmentId}`,
    request,
  );

  return response.data;
}


export function localDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export async function getDoctorAppointments() {
  const response = await apiClient.get<AppointmentResponse[]>(
    "/appointments/doctor",
  );

  return response.data;
}

// export async function getAppointmentConsultation(appointmentId: number) {
//   const response = await apiClient.get<ConsultationResponse>(
//     `/consultations/appointments/${appointmentId}`,
//   );

//   return response.data;
// }