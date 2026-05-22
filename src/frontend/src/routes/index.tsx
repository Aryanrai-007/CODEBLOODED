import { createRoute } from "@tanstack/react-router";
import { HomePage } from "../pages/HomePage";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
