import { createRoute } from "@tanstack/react-router";
import { JoinPage } from "../pages/JoinPage";
import { Route as rootRoute } from "./__root";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/join",
  component: JoinPage,
});
