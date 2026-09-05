import { Outlet, createRootRoute } from "@tanstack/react-router";
import { GotLayout } from "../components/GotLayout";

export const Route = createRootRoute({
  component: () => (
    <GotLayout>
      <Outlet />
    </GotLayout>
  ),
});
