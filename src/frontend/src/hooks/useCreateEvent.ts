import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockBackend } from "../mocks/backend";
import type { CreateEventInput } from "../types";

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateEventInput) => mockBackend.createEvent(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendarEvents"] });
    },
  });
}
