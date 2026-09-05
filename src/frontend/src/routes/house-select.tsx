import { createRoute, useNavigate } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { useAuth } from "../contexts/AuthContext";
import { doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/house-select",
  component: HouseSelect,
});

const HOUSES = [
  { id: "stark", name: "Stark", lord: "Harsh Choudhary", theme: "Winter is Coming", color: "bg-gray-800", img: "/assets/houses/stark.jpg" },
  { id: "targaryen", name: "Targaryen", lord: "Aryan Rai", theme: "Fire and Blood", color: "bg-red-900", img: "/assets/houses/targaryen.jpg" },
  { id: "lannister", name: "Lannister", lord: "Mridul Mani Tripathi", theme: "Hear Me Roar", color: "bg-red-800", img: "/assets/houses/lannister.jpg" },
  { id: "baratheon", name: "Baratheon", lord: "Ishant Yadav", theme: "Ours is the Fury", color: "bg-yellow-800", img: "/assets/houses/baratheon.jpg" },
  { id: "greyjoy", name: "Greyjoy", lord: "Suraj Trivedi", theme: "We Do Not Sow", color: "bg-teal-900", img: "/assets/houses/greyjoy.jpg" },
];

function HouseSelect() {
  const { user, userData, refreshUserData } = useAuth();
  const navigate = useNavigate();

  const handleSelect = async (houseId: string) => {
    if (!user) {
      alert("You must be logged in to select a house. Please log in first.");
      navigate({ to: "/" });
      return;
    }

    document.documentElement.className = `theme-${houseId} dark`;

    try {
      if (!userData) {
        const isAdmin = [
          "aryanraiavengers@gmail.com",
          "harsh@codeblooded.com",
          "ishant@codeblooded.com",
          "suraj@codeblooded.com",
          "mridul@codeblooded.com",
        ].includes((user.email || "").toLowerCase());

        await setDoc(doc(db, "users", user.uid), {
          email: user.email || "",
          name: user.displayName || "",
          role: isAdmin ? "admin" : "member",
          houseId,
          gender: "none",
          characterClass: "none",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else {
        await updateDoc(doc(db, "users", user.uid), {
          houseId,
          updatedAt: serverTimestamp(),
        });
      }

      await refreshUserData();
      navigate({ to: "/character-select" });
    } catch (error: any) {
      console.error("Error selecting house:", error);
      alert("Failed to save selection. Please try logging out and back in. " + error.message);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 md:py-16">
      <div className="max-w-[1500px] mx-auto">
        <div className="text-center mb-10 md:mb-14 space-y-3">
          <p className="font-mono text-xs uppercase tracking-[0.45em] text-primary">The Great Houses</p>
          <h1 className="text-4xl md:text-7xl font-display font-black text-white tracking-widest uppercase">
            Choose Your House
          </h1>
          <p className="text-base md:text-xl text-gray-400 font-mono uppercase tracking-widest">
            Your allegiance shapes your destiny
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch">
          {HOUSES.map((house) => (
            <Card
              key={house.id}
              onClick={() => handleSelect(house.id)}
              className="min-h-[520px] bg-black/40 border-white/10 hover:border-primary/50 hover:-translate-y-1 transition-all duration-500 cursor-pointer overflow-hidden group relative shadow-2xl"
            >
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center opacity-65 group-hover:opacity-100 transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-[1.03]"
                style={{ backgroundImage: `url(${house.img})` }}
                role="img"
                aria-label={`House ${house.name} banner`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10 opacity-95 group-hover:opacity-75 transition-opacity" />

              <CardContent className="absolute inset-x-0 bottom-0 p-5 text-center space-y-3 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <Badge variant="outline" className={`w-fit mx-auto border-white/20 text-white ${house.color}`}>
                  {house.theme}
                </Badge>
                <h2 className="text-2xl lg:text-3xl font-display font-bold text-white uppercase tracking-wider drop-shadow-lg">
                  {house.name}
                </h2>
                <div className="space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center pt-3 border-t border-white/10">
                  <p className="text-[10px] text-gray-300 font-mono uppercase tracking-[0.25em]">House Lord</p>
                  <div className="flex items-center gap-3 bg-black/60 pr-4 pl-1 py-1 rounded-full border border-white/10">
                    <img
                      src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(house.lord)}`}
                      alt=""
                      className="w-9 h-9 rounded-full bg-white/10"
                    />
                    <p className="text-sm font-semibold text-white">{house.lord}</p>
                  </div>
                  <p className="text-[10px] text-primary/80 font-mono uppercase tracking-wider">Enter this banner</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
