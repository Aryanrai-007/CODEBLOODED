import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SubmitApplicationInput } from "../types";
import { mockBackend } from "../mocks/backend";

export function useSubmitApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SubmitApplicationInput) =>
      mockBackend.submitApplication(
        input.name,
        input.email,
        input.phone,
        input.yearOfStudy,
        input.department,
        input.reasonForJoining,
        input.priorExperience,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}
