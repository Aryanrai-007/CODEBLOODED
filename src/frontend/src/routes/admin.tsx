import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboard,
});

function AdminDashboard() {
  const { userData, logout } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      if (userData?.houseId) {
        const q = query(collection(db, "users"), where("houseId", "==", userData.houseId));
        const querySnapshot = await getDocs(q);
        const mems = querySnapshot.docs.map(d => d.data());
        setMembers(mems);
      }
      setLoading(false);
    }
    fetchMembers();
  }, [userData?.houseId]);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-display font-black text-primary tracking-widest uppercase">
            Lord's Command - House {userData?.houseId}
          </h1>
          <Button onClick={logout} variant="outline" className="text-white border-white/20">
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="bg-black/60 border-primary/30 backdrop-blur-md lg:col-span-1 h-fit">
            <CardContent className="p-8 space-y-4">
              <h2 className="text-2xl font-display font-bold text-white uppercase tracking-widest border-b border-primary/20 pb-4">
                Lord Profile
              </h2>
              <div className="space-y-4 pt-4 text-lg">
                <div>
                  <p className="text-gray-400 font-mono text-sm uppercase">Name</p>
                  <p className="text-white font-semibold">{userData?.name}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-mono text-sm uppercase">House</p>
                  <p className="text-primary font-display font-bold uppercase">{userData?.houseId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/60 border-primary/30 backdrop-blur-md lg:col-span-2">
            <CardContent className="p-8 space-y-4">
              <h2 className="text-2xl font-display font-bold text-white uppercase tracking-widest border-b border-primary/20 pb-4">
                House Members
              </h2>
              {loading ? (
                <p className="text-gray-400">Loading forces...</p>
              ) : (
                <div className="space-y-4 pt-4">
                  {members.length === 0 ? (
                    <p className="text-gray-400">No bannermen have pledged to your house yet.</p>
                  ) : (
                    members.map((m, i) => (
                      <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/10">
                        <div>
                          <p className="text-white font-semibold">{m.name}</p>
                          <p className="text-sm text-gray-400">{m.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-primary uppercase text-sm font-bold tracking-wider">{m.characterClass}</p>
                          <p className="text-xs text-gray-500 capitalize">{m.gender}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
