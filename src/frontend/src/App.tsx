import { RouterProvider, createRouter } from "@tanstack/react-router";
import { Route as rootRoute } from "./routes/__root";
import { Route as adminRoute } from "./routes/admin";
import { Route as calendarRoute } from "./routes/calendar";
import { Route as chessRoute } from "./routes/chess";
import { Route as chessbotRoute } from "./routes/chessbot";
import { Route as indexRoute } from "./routes/index";
import { Route as joinRoute } from "./routes/join";

const routeTree = rootRoute.addChildren([
  indexRoute,
  joinRoute,
  adminRoute,
  calendarRoute,
  chessRoute,
  chessbotRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
