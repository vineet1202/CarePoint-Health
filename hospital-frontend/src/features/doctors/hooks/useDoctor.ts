import { useQuery } from "@tanstack/react-query";
import { getDoctorById } from "../api/doctorApi";

export function useDoctor(doctorId: number) {
    return useQuery({
        queryKey: ["doctor", doctorId],
        queryFn: () => getDoctorById(doctorId),
        enabled: Number.isFinite(doctorId) && doctorId > 0,
    });
}