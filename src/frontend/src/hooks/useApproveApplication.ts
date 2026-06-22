import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mockBackend } from "../mocks/backend";

export function useApproveApplication() {
  const queryClient = useQueryClient();
  return useMutation<boolean, Error, bigint>({
    mutationFn: (id: bigint) => mockBackend.approveApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}
