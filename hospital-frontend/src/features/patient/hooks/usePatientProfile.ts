import { useQuery } from "@tanstack/react-query";
import { getPatientProfile } from "../api/patientProfileApi";

export function usePatientProfile() {
  return useQuery({
    queryKey: ["patient-profile"],
    queryFn: getPatientProfile,
  });
}