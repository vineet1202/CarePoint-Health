
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rescheduleAppointment } from "../api/appointmentApi";

interface RescheduleRequest {
    newSlotId: number;
}

export function useRescheduleAppointment(appointmentId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: RescheduleRequest) =>
            rescheduleAppointment(appointmentId, request),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["appointments", "my"],
            });

            queryClient.invalidateQueries({
                queryKey: ["doctor-slots"],
            });
        },
    });
}
