import { useQuery } from "@tanstack/react-query";
import { getDoctorAppointments } from "../api/appointmentApi";

export const useDoctorAppointments = (date?: string) => {
  return useQuery({
    queryKey: ["doctorAppointments", date],
    queryFn: () => getDoctorAppointments(date),
  });
};