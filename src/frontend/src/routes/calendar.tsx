import { createRoute } from "@tanstack/react-router";
import { CalendarPage } from "../pages/CalendarPage";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/calendar",
  component: CalendarPage,
});
