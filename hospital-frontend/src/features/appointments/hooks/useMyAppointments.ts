import { useQuery } from "@tanstack/react-query";
import { getMyAppointments } from "../api/appointmentApi";

export function useMyAppointments() {
    return useQuery({
        queryKey: ["appointments", "my"],
        queryFn: getMyAppointments,
    });
}