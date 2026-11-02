import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updatePatientProfile } from "../api/patientProfileApi";

export function useUpdatePatientProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePatientProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(["patient-profile"], updatedProfile);
    },
  });
}