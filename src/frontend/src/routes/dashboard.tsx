import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
});

function Dashboard() {
  const { userData, logout } = useAuth();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-display font-black text-primary tracking-widest uppercase">
            Member Realm
          </h1>
          <Button onClick={logout} variant="outline" className="text-white border-white/20">
            Sign Out
          </Button>
        </div>

        <Card className="bg-black/60 border-primary/30 backdrop-blur-md">
          <CardContent className="p-8 space-y-4">
            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-widest border-b border-primary/20 pb-4">
              Your Profile
            </h2>
            <div className="grid grid-cols-2 gap-8 pt-4 text-lg">
              <div>
                <p className="text-gray-400 font-mono text-sm uppercase">Name</p>
                <p className="text-white font-semibold">{userData?.name}</p>
              </div>
              <div>
                <p className="text-gray-400 font-mono text-sm uppercase">House</p>
                <p className="text-primary font-display font-bold uppercase">{userData?.houseId}</p>
              </div>
              <div>
                <p className="text-gray-400 font-mono text-sm uppercase">Class</p>
                <p className="text-white font-semibold uppercase">{userData?.characterClass}</p>
              </div>
              <div>
                <p className="text-gray-400 font-mono text-sm uppercase">Gender</p>
                <p className="text-white font-semibold capitalize">{userData?.gender}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
