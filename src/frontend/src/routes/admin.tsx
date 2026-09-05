import { createRoute, useNavigate } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../lib/firebase";
import { CalendarPlus, Crown, LogOut, ShieldCheck, Swords, Users } from "lucide-react";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminDashboard,
});

function AdminDashboard() {
  const { userData, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [members, setMembers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  const classCounts = useMemo(() => {
    return members.reduce<Record<string, number>>((acc, member) => {
      acc[member.characterClass] = (acc[member.characterClass] || 0) + 1;
      return acc;
    }, {});
  }, [members]);

  const refreshRealm = async () => {
    if (!userData?.houseId) return;

    const roster = await getDocs(
      query(collection(db, "users"), where("houseId", "==", userData.houseId)),
    );
    setMembers(roster.docs.map((d) => ({ id: d.id, ...d.data() })));

    const eventDocs = await getDocs(
      query(collection(db, "events"), where("houseId", "==", userData.houseId)),
    );
    setEvents(eventDocs.docs.map((d) => ({ id: d.id, ...d.data() })).sort((x: any, y: any) => String(x.date || "").localeCompare(String(y.date || ""))));
  };

  useEffect(() => {
    if (!loading && (!userData || userData.role !== "admin")) {
      navigate({ to: "/" });
      return;
    }
    refreshRealm().catch(console.error);
  }, [loading, userData?.role, userData?.houseId]);

  const createEvent = async () => {
    if (!eventTitle.trim() || !userData?.houseId) return;
    setBusy(true);
    try {
      await addDoc(collection(db, "events"), {
        houseId: userData.houseId,
        title: eventTitle.trim(),
        date: eventDate || "Date TBA",
        description: eventDescription.trim() || "A new order has been issued by the House Lord.",
        createdBy: userData.email,
      });
      setEventTitle("");
      setEventDate("");
      setEventDescription("");
      await refreshRealm();
    } finally {
      setBusy(false);
    }
  };

  if (loading || !userData) {
    return <div className="min-h-screen grid place-items-center font-display tracking-[0.4em] text-primary">OPENING THE WAR ROOM...</div>;
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-primary">CodeBlooded • House Lord Command</p>
            <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-wider text-white">
              War Room — {userData.houseId}
            </h1>
          </div>
          <Button onClick={logout} variant="outline" className="border-white/20 text-white">
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </header>

        <div className="grid gap-4 md:grid-cols-4">
          <Metric icon={<Users />} label="House Members" value={members.length} />
          <Metric icon={<Swords />} label="Warriors" value={classCounts.warrior || 0} />
          <Metric icon={<ShieldCheck />} label="Knights" value={classCounts.knight || 0} />
          <Metric icon={<Crown />} label="Active Events" value={events.length} />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
          <Card className="border-primary/25 bg-black/60 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="font-display text-2xl font-bold uppercase tracking-wider text-white">House Roster</p>
                  <p className="text-sm text-gray-500">Every member sworn to your banner.</p>
                </div>
                <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-mono text-primary">{members.length} MEMBERS</span>
              </div>

              <div className="mt-4 space-y-2">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.035] p-4 transition hover:border-primary/30">
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(member.name || member.email)}`}
                        alt=""
                        className="h-11 w-11 rounded-full bg-white/10"
                      />
                      <div>
                        <p className="font-semibold text-white">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-sm font-bold uppercase text-primary">{member.characterClass}</p>
                      <p className="text-xs capitalize text-gray-500">{member.gender}</p>
                    </div>
                  </div>
                ))}
                {!members.length && <p className="py-10 text-center text-gray-500">No bannermen have pledged to your house yet.</p>}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-white/10 bg-black/60 backdrop-blur-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <CalendarPlus className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-display text-xl font-bold uppercase text-white">Issue a Realm Event</p>
                    <p className="text-xs text-gray-500">Send the next order to your House.</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <input value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="Event title" className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-white outline-none focus:border-primary/50" />
                  <input value={eventDate} onChange={(e) => setEventDate(e.target.value)} placeholder="Date / time" className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-3 text-white outline-none focus:border-primary/50" />
                  <textarea value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} placeholder="What should the House know?" className="min-h-28 w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white outline-none focus:border-primary/50" />
                  <Button disabled={busy || !eventTitle.trim()} onClick={createEvent} className="w-full bg-primary text-primary-foreground">
                    {busy ? "Sending Raven..." : "Announce to the House"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-black/60 backdrop-blur-xl">
              <CardContent className="p-6">
                <p className="font-display text-xl font-bold uppercase text-white">Current Orders</p>
                <div className="mt-4 space-y-3">
                  {events.slice(0, 4).map((event) => (
                    <div key={event.id} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
                      <p className="text-xs font-mono uppercase tracking-widest text-primary">{event.date}</p>
                      <p className="mt-1 font-semibold text-white">{event.title}</p>
                      <p className="mt-1 text-sm text-gray-500">{event.description}</p>
                    </div>
                  ))}
                  {!events.length && <p className="py-4 text-sm text-gray-500">The realm is quiet.</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return (
    <Card className="border-white/10 bg-black/55 backdrop-blur-xl">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-primary">{icon}<span className="font-mono text-[10px] uppercase tracking-widest">{label}</span></div>
        <p className="mt-4 font-display text-4xl font-black text-white">{value}</p>
      </CardContent>
    </Card>
  );
}
