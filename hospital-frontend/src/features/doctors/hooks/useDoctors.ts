import { useQuery } from "@tanstack/react-query";
import { getDoctors } from "../api/doctorApi";

export function useDoctors(
    specialization: string,
    page: number
) {
    return useQuery({
        queryKey: ["doctors", specialization, page],

        queryFn: () =>
            getDoctors({
                specialization,
                page,
                size: 10,
            }),

        enabled: specialization.trim().length > 0,
    });
}
