import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockBackend } from "../mocks/backend";
import type { CreateEventInput } from "../types";

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: bigint; input: CreateEventInput }) =>
      mockBackend.updateEvent(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendarEvents"] });
    },
  });
}
