import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { SubmitApplicationInput, SubmitApplicationResult } from "../types";

export function useSubmitApplication() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();

  return useMutation<SubmitApplicationResult, Error, SubmitApplicationInput>({
    mutationFn: async (input: SubmitApplicationInput) => {
      if (!actor) throw new Error("Actor not ready");
      const result = await (
        actor as unknown as {
          submitApplication: (
            name: string,
            email: string,
            phone: string,
            yearOfStudy: string,
            department: string,
            reasonForJoining: string,
            priorExperience: string,
          ) => Promise<SubmitApplicationResult>;
        }
      ).submitApplication(
        input.name,
        input.email,
        input.phone,
        input.yearOfStudy,
        input.department,
        input.reasonForJoining,
        input.priorExperience,
      );
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
}
