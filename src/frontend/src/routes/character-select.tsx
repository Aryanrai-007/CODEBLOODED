import { createRoute, useNavigate } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { useAuth } from "../contexts/AuthContext";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Card, CardContent } from "../components/ui/card";
import { useState } from "react";
import { Button } from "../components/ui/button";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/character-select",
  component: CharacterSelect,
});

const CLASSES = [
  { id: 'warrior', name: 'Warrior', img: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?w=800&q=80' },
  { id: 'archer', name: 'Archer', img: 'https://images.unsplash.com/photo-1549429532-6a84d436c6be?w=800&q=80' },
  { id: 'knight', name: 'Knight', img: 'https://images.unsplash.com/photo-1620302324976-1502479f67a2?w=800&q=80' },
  { id: 'mage', name: 'Mage', img: 'https://images.unsplash.com/photo-1517409217125-9610f6991196?w=800&q=80' },
];

function CharacterSelect() {
  const { user, userData, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const [gender, setGender] = useState<'male' | 'female' | null>(null);

  const handleSelectClass = async (characterClass: string) => {
    if (!user || !gender) return;
    await updateDoc(doc(db, 'users', user.uid), {
      gender,
      characterClass,
      updatedAt: serverTimestamp()
    });
    await refreshUserData();
    if (userData?.role === 'admin') {
      navigate({ to: "/admin" });
    } else {
      navigate({ to: "/dashboard" });
    }
  };

  if (!gender) {
    return (
      <div className="min-h-screen flex items-center justify-center py-16 px-4">
        <div className="text-center space-y-12 max-w-2xl w-full">
          <h1 className="text-5xl font-display font-black text-white tracking-widest uppercase">
            Choose Your Form
          </h1>
          <div className="grid grid-cols-2 gap-8">
            <Button 
              onClick={() => setGender('male')}
              className="h-32 text-2xl font-display uppercase tracking-widest bg-black/40 border border-white/10 hover:border-white/40 hover:bg-black/60 transition-all text-white"
            >
              Male
            </Button>
            <Button 
              onClick={() => setGender('female')}
              className="h-32 text-2xl font-display uppercase tracking-widest bg-black/40 border border-white/10 hover:border-white/40 hover:bg-black/60 transition-all text-white"
            >
              Female
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-widest uppercase">
            Choose Your Class
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CLASSES.map(cls => (
            <Card 
              key={cls.id} 
              onClick={() => handleSelectClass(cls.id)}
              className="bg-black/40 border-white/10 hover:border-white/40 hover:-translate-y-2 transition-all cursor-pointer overflow-hidden group"
            >
              <div className="h-96 relative">
                <img src={cls.img} alt={cls.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                <div className="absolute bottom-6 left-0 right-0 text-center">
                  <h2 className="text-3xl font-display font-bold text-white tracking-widest uppercase">
                    {cls.name}
                  </h2>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
