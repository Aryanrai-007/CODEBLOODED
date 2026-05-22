import { createRoute } from "@tanstack/react-router";
import { AdminPage } from "../pages/AdminPage";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});
