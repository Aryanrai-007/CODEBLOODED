import { Outlet } from "@tanstack/react-router";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export function GotLayout({ children }: { children: React.ReactNode }) {
  const { userData } = useAuth();
  
  useEffect(() => {
    // Apply house theme to document body
    const root = document.documentElement;
    if (userData?.houseId === 'targaryen') {
      root.className = 'dark theme-targaryen';
    } else if (userData?.houseId === 'stark') {
      root.className = 'dark theme-stark';
    } else if (userData?.houseId === 'baratheon') {
      root.className = 'dark theme-baratheon';
    } else if (userData?.houseId === 'greyjoy') {
      root.className = 'dark theme-greyjoy';
    } else if (userData?.houseId === 'lannister') {
      root.className = 'dark theme-lannister';
    } else {
      root.className = 'dark'; // default dark theme
    }
  }, [userData?.houseId]);

  return (
    <div className="min-h-screen bg-background text-foreground bg-[url('https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?w=1600&q=80')] bg-cover bg-center bg-fixed">
      <div className="min-h-screen bg-background/80 backdrop-blur-sm">
        {children}
      </div>
    </div>
  );
}
