import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockBackend } from "../mocks/backend";

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: bigint) => mockBackend.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendarEvents"] });
    },
  });
}
