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
      return actor.getApplications();
    },
    enabled: !!actor && !isFetching,
  });
}
