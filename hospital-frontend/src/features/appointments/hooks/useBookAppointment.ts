
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookAppointment } from "../api/appointmentApi";

export function useBookAppointment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: bookAppointment,

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["doctor-slots"],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["appointments"],
                }),
            ]);
        },
    });
}
