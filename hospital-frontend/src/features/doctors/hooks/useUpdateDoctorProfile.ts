import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDoctorProfile } from "../api/doctorApi";

export function useUpdateDoctorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDoctorProfile,

    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(
        ["doctor-profile"],
        updatedProfile,
      );
    },
  });
}