import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { Application } from "../types";

export function useApplications() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<Application[]>({
    queryKey: ["applications"],
    queryFn: async () => {
      if (!actor) return [];
      const result = await (
        actor as unknown as { getApplications: () => Promise<Application[]> }
      ).getApplications();
      return result;
    },
    enabled: !!actor && !isFetching,
  });
}
