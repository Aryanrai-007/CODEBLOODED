import { createRoute, useNavigate } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: IndexComponent,
});

function IndexComponent() {
  const { user, userData, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate({ to: "/login" });
      } else if (!userData?.houseId) {
        navigate({ to: "/house-select" });
      } else if (userData?.characterClass === 'none') {
        navigate({ to: "/character-select" });
      } else {
        if (userData.role === 'admin') {
          navigate({ to: "/admin" });
        } else {
          navigate({ to: "/dashboard" });
        }
      }
    }
  }, [user, userData, loading, navigate]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="animate-pulse text-2xl font-display font-bold tracking-widest text-primary">
        WINTER IS COMING...
      </div>
    </div>
  );
}
