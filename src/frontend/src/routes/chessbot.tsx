import { createRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { Route as rootRoute } from "./__root";

const ChessBotPage = lazy(() =>
  import("../pages/ChessBotPage").then((m) => ({
    default: m.default,
  })),
);

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chessbot",
  component: () => (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-primary text-xl font-mono animate-pulse">
            LOADING CHESS BOT...
          </div>
        </div>
      }
    >
      <ChessBotPage />
    </Suspense>
  ),
});
