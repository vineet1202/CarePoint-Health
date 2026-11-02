
export interface AppointmentBookRequest {
    slotId: number;
}

export interface AppointmentResponse {
    id: number;
    doctorId: number;
    doctorName: string;
    patientId: number;
    patientName: string;
    slotDate: string;
    startTime: string;
    endTime: string;
    status: string;
}
export interface ConsultationRequest {
  diagnosis: string;
  doctorNotes: string;
}

export interface ConsultationResponse {
  id: number;
  appointmentId: number;
  diagnosis: string;
  doctorNotes: string;
}
