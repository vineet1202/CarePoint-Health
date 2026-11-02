import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getMySlots,
  createSlot,
  generateSlots,
  deleteSlot,
} from "../api/slotApi";

import type {
  SlotCreateRequest,
  SlotGenerateRequest,
} from "../types/slot.types";

export function useMySlots(date: string) {
  return useQuery({
    queryKey: ["doctor-slots", "my", date],
    queryFn: () => getMySlots(date),
    enabled: Boolean(date),
  });
}

export function useCreateSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SlotCreateRequest) => createSlot(request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["doctor-slots", "my", variables.slotDate],
      });
    },
  });
}

export function useGenerateSlots() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SlotGenerateRequest) => generateSlots(request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["doctor-slots", "my", variables.slotDate],
      });
    },
  });
}

export function useDeleteSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slotId: number) => deleteSlot(slotId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["doctor-slots", "my"],
      });
    },
  });
}