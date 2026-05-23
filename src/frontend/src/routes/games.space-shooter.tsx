import { createRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Route as gamesRoute } from "./games";

const SpaceShooterPage = lazy(() =>
  import("../pages/SpaceShooterPage").then((m) => ({
    default: m.SpaceShooterPage,
  })),
);

export const Route = createRoute({
  getParentRoute: () => gamesRoute,
  path: "/space-shooter",
  component: () => (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
          <div className="text-cyan-400 text-xl font-mono animate-pulse">
            LOADING NEXUS ARENA...
          </div>
        </div>
      }
    >
      <SpaceShooterPage />
    </Suspense>
  ),
});
