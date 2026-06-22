import { useQuery } from "@tanstack/react-query";
import type { Application } from "../types";
import { mockBackend } from "../mocks/backend";

export function useApplications() {
  return useQuery<Application[]>({
    queryKey: ["applications"],
    queryFn: () => mockBackend.getApplications(),
  });
}
