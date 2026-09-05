import { createRoute, useNavigate } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useEffect, useState, type ReactNode } from "react";
import { CalendarDays, Crown, Shield, Swords, Users, LogOut } from "lucide-react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
});

const HOUSE_WORDS: Record<string, string> = {
  stark: "Winter is Coming",
  targaryen: "Fire and Blood",
  lannister: "Hear Me Roar",
  baratheon: "Ours is the Fury",
  greyjoy: "We Do Not Sow",
};

function Dashboard() {
  const { userData, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [memberCount, setMemberCount] = useState(0);
  const [nextEvent, setNextEvent] = useState<any>(null);

  useEffect(() => {
    if (!loading && (!userData || userData.role !== "member")) {
      navigate({ to: "/" });
    }
  }, [loading, userData, navigate]);

  useEffect(() => {
    async function loadRealm() {
      if (!userData?.houseId) return;

      const roster = await getDocs(
        query(collection(db, "users"), where("houseId", "==", userData.houseId)),
      );
      setMemberCount(roster.size);

      const events = await getDocs(
        query(collection(db, "events"), where("houseId", "==", userData.houseId)),
      );
      setNextEvent(events.docs.map((doc) => doc.data()).sort((x: any, y: any) => String(x.date || "").localeCompare(String(y.date || "")))[0] || null);
    }

    loadRealm().catch(console.error);
  }, [userData?.houseId]);

  if (loading || !userData) {
    return <div className="min-h-screen grid place-items-center font-display tracking-[0.4em] text-primary">ENTERING THE REALM...</div>;
  }

  const avatar = `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(userData.name)}`;
  const house = userData.houseId || "unpledged";

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-white/10 pb-6">
          <div>
            <p className="font-mono text-xs tracking-[0.35em] uppercase text-primary">CodeBlooded • Member Realm</p>
            <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-wider text-white">
              House {house}
            </h1>
            <p className="mt-2 text-gray-400 italic">“{HOUSE_WORDS[house] || "Choose your destiny."}”</p>
          </div>
          <Button onClick={logout} variant="outline" className="border-white/20 text-white">
            <LogOut className="mr-2 h-4 w-4" /> Leave Realm
          </Button>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
          <Card className="overflow-hidden border-primary/30 bg-black/60 backdrop-blur-xl">
            <CardContent className="p-0">
              <div className="h-28 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent" />
              <div className="px-6 pb-8 -mt-14">
                <img src={avatar} alt={userData.name} className="h-28 w-28 rounded-full border-4 border-background bg-white/10 shadow-2xl" />
                <div className="mt-5 flex flex-col gap-2">
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Realm Identity</p>
                  <h2 className="text-3xl font-display font-bold text-white">{userData.name}</h2>
                  <p className="text-gray-400">{userData.email}</p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Stat icon={<Crown />} label="House" value={house} />
                  <Stat icon={<Swords />} label="Class" value={userData.characterClass} />
                  <Stat icon={<Shield />} label="Form" value={userData.gender} />
                  <Stat icon={<Users />} label="Bannermen" value={String(memberCount)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-black/55 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <CalendarDays className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-display text-xl font-bold uppercase tracking-wider text-white">Next Realm Event</p>
                  <p className="text-sm text-gray-500">Issued by your House Lord</p>
                </div>
              </div>

              {nextEvent ? (
                <div className="mt-6 space-y-3">
                  <p className="text-xs font-mono uppercase tracking-[0.25em] text-primary">{nextEvent.date || "Date TBA"}</p>
                  <h3 className="text-2xl font-display font-bold text-white">{nextEvent.title}</h3>
                  <p className="leading-7 text-gray-400">{nextEvent.description}</p>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <CalendarDays className="mx-auto h-10 w-10 text-gray-600" />
                  <p className="mt-4 text-gray-400">No realm events have been announced yet.</p>
                  <p className="mt-1 text-sm text-gray-600">Watch the ravens.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.035] p-4">
      <div className="flex items-center gap-2 text-primary">{icon}<span className="font-mono text-[10px] uppercase tracking-widest">{label}</span></div>
      <p className="mt-3 font-display text-lg font-bold capitalize text-white">{value}</p>
    </div>
  );
}
