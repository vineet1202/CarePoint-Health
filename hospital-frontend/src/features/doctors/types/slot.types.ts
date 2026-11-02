
export interface SlotResponse {
    id: number;
    slotDate: string;
    startTime: string;
    endTime: string;
    status: string;
}

export interface SlotCreateRequest {
  slotDate: string;
  startTime: string;
  endTime: string;
}

export interface SlotGenerateRequest {
  slotDate: string;
  dayStartTime: string;
  dayEndTime: string;
  slotDurationMinutes: number;
}
