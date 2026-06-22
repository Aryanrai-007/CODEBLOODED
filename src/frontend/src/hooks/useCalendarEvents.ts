import { useQuery } from "@tanstack/react-query";
import type { CalendarEvent } from "../types";
import { mockBackend } from "../mocks/backend";

export function useCalendarEvents() {
  return useQuery<CalendarEvent[]>({
    queryKey: ["calendarEvents"],
    queryFn: () => mockBackend.getEvents(),
  });
}
