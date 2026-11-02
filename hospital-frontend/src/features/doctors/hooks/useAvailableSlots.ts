
import { useQuery } from "@tanstack/react-query";
import { getAvailableSlots } from "../api/slotApi";

//fetch slots available for patient to book an appointment with a doctor
export function useAvailableSlots(doctorId: number, date: string) {
    return useQuery({
        queryKey: ["doctor-slots", doctorId, date],
        queryFn: () => getAvailableSlots(doctorId, date),
        enabled: doctorId > 0 && Boolean(date),
    });
}
