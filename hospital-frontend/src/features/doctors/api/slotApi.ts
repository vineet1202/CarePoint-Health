
import type { SlotCreateRequest, SlotGenerateRequest, SlotResponse } from "../types/slot.types";
import apiClient from "@/lib/axios";

export const getAvailableSlots = async (
    doctorId: number,
    date: string
): Promise<SlotResponse[]> => {
    const response = await apiClient.get<SlotResponse[]>(
        `/slots/available/${doctorId}`,
        {
            params: { date },
        }
    );

    return response.data;
};


// Fetch all slots belonging to the logged-in doctor for a date
export const getMySlots = async (
  date: string
): Promise<SlotResponse[]> => {
  const response = await apiClient.get<SlotResponse[]>("/slots/my", {
    params: { date },
  });

  return response.data;
};

// Create an individual slot
export const createSlot = async (
  request: SlotCreateRequest    
): Promise<SlotResponse> => {
  const response = await apiClient.post<SlotResponse>("/slots", request);

  return response.data;
};

// Generate multiple slots
export const generateSlots = async (
  request: SlotGenerateRequest
): Promise<SlotResponse[]> => {
  const response = await apiClient.post<SlotResponse[]>(
    "/slots/generate",
    request
  );

  return response.data;
};

// Delete an available slot
export const deleteSlot = async (slotId: number): Promise<void> => {
  await apiClient.delete(`/slots/${slotId}`);
};
