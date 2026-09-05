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
  { id: 'stark', name: 'Stark', lord: 'Harsh Choudhary', theme: 'Winter is Coming', color: 'bg-gray-800', img: '/stark.jpeg' },
  { id: 'targaryen', name: 'Targaryen', lord: 'Aryan Rai', theme: 'Fire and Blood', color: 'bg-red-900', img: '/targaryen.jpeg' },
  { id: 'lannister', name: 'Lannister', lord: 'Mridul Mani Tripathi', theme: 'Hear Me Roar', color: 'bg-red-800', img: '/lannister.jpeg' },
  { id: 'baratheon', name: 'Baratheon', lord: 'Ishant Yadav', theme: 'Ours is the Fury', color: 'bg-yellow-800', img: '/baratheon.jpeg' },
  { id: 'greyjoy', name: 'Greyjoy', lord: 'Suraj Trivedi', theme: 'We Do Not Sow', color: 'bg-teal-900', img: '/greyjoy.jpeg' },
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
    
    // Immediately apply the visual theme change on click
    document.documentElement.className = `theme-${houseId} dark`;
    
    try {
      if (!userData) {
        // If the user's document hasn't been created yet due to previous errors, create it now.
        const isAdmin = [
          'aryanraiavengers@gmail.com',
          'harsh@codeblooded.com',
          'ishant@codeblooded.com',
          'suraj@codeblooded.com',
          'mridul@codeblooded.com'
        ].includes(user.email || '');

        await setDoc(doc(db, 'users', user.uid), {
          email: user.email || '',
          name: user.displayName || '',
          role: isAdmin ? 'admin' : 'member',
          houseId,
          gender: 'none',
          characterClass: 'none',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        // Just update if it already exists
        await updateDoc(doc(db, 'users', user.uid), {
          houseId,
          updatedAt: serverTimestamp()
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
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-widest uppercase">
            Choose Your House
          </h1>
          <p className="text-xl text-gray-400 font-mono uppercase tracking-widest">
            Your allegiance shapes your destiny
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 h-[70vh] justify-center items-stretch">
          {HOUSES.map(house => (
            <Card 
              key={house.id} 
              onClick={() => handleSelect(house.id)}
              className="flex-1 bg-black/40 border-white/10 hover:border-white/40 hover:flex-[1.5] transition-all duration-500 cursor-pointer overflow-hidden group relative"
            >
              {/* Banner image uploaded by user */}
              <div 
                className="absolute inset-0 w-full h-full opacity-60 group-hover:opacity-100 transition-all duration-500 grayscale group-hover:grayscale-0"
                style={{ 
                  backgroundImage: `url(${house.img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />
              
              <CardContent className="absolute inset-x-0 bottom-0 p-6 text-center space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                <Badge variant="outline" className={`w-fit mx-auto border-white/20 text-white ${house.color}`}>
                  {house.theme}
                </Badge>
                <h2 className="text-2xl lg:text-3xl font-display font-bold text-white shadow-black drop-shadow-lg">
                  {house.name}
                </h2>
                <div className="space-y-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100 flex flex-col items-center pt-2 border-t border-white/10">
                  <p className="text-xs text-gray-300 font-mono uppercase tracking-widest">House Lord</p>
                  <div className="flex items-center gap-3 bg-black/50 pr-4 pl-1 py-1 rounded-full border border-white/10">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${house.lord.replace(/ /g, '')}&backgroundColor=transparent`}
                      alt={house.lord} 
                      className="w-8 h-8 rounded-full bg-white/10"
                    />
                    <p className="text-sm font-semibold text-white shadow-black drop-shadow-md">{house.lord}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
