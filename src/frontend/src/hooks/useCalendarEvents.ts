import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { createActor } from "../backend";
import type { CalendarEvent } from "../types";

export function useCalendarEvents() {
  const { actor, isFetching } = useActor(createActor);

  return useQuery<CalendarEvent[]>({
    queryKey: ["calendarEvents"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEvents();
    },
    enabled: !!actor && !isFetching,
  });
}
