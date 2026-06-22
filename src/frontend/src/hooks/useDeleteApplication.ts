import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockBackend } from "../mocks/backend";

export function useDeleteApplication() {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, bigint>({
    mutationFn: (id: bigint) => mockBackend.deleteApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}
