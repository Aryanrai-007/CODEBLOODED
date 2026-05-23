import { createRoute } from "@tanstack/react-router";
import { GamesHubPage } from "../pages/GamesHubPage";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/games",
  component: GamesHubPage,
});
