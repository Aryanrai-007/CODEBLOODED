import { createRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Route as rootRoute } from "./__root";

const ChessPage = lazy(() =>
  import("../pages/ChessPage").then((m) => ({
    default: m.ChessPage,
  })),
);

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chess",
  component: () => (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-primary text-xl font-mono animate-pulse">
            LOADING CHESS ARENA...
          </div>
        </div>
      }
    >
      <ChessPage />
    </Suspense>
  ),
});
