import { createRoute, useNavigate } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (user) {
      navigate({ to: "/" });
    }
  }, [user, navigate]);

  const handleLoginClick = async (requestedRole: 'member' | 'admin') => {
    try {
      setIsLoggingIn(true);
      // We pass the login call, and the AuthContext handles strict email-based role assignment
      // to ensure security rules are not bypassed.
      await login();
    } catch (e: any) {
      if (e?.code !== 'auth/cancelled-popup-request' && e?.code !== 'auth/popup-closed-by-user') {
        console.error("Login Error:", e);
      }
    } finally {
      setIsLoggingIn(false);
      setShowOptions(false);
    }
  };

  return (
    <div 
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-black"
      style={{
        backgroundImage: "url('/landing-bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Background vignette for better contrast at edges */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />

      {/* Clickable invisible overlay strictly mapped to the center CB shield logo */}
      <button 
        onClick={() => setShowOptions(true)}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vmin] h-[40vmin] rounded-[50%] hover:shadow-[0_0_80px_rgba(255,255,255,0.2)] hover:bg-white/5 transition-all duration-500 cursor-pointer focus:outline-none z-10"
        aria-label="Click the Heart Logo to Enter"
        title="Enter the Realm"
      />

      {/* Instructional text that fades out if hovered (optional, but helps UX) */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-gray-400 font-mono tracking-[0.3em] uppercase text-sm animate-pulse pointer-events-none">
        Click the center crest to begin
      </div>

      <Dialog open={showOptions} onOpenChange={setShowOptions}>
        <DialogContent className="bg-black/90 border-white/20 backdrop-blur-xl sm:max-w-md">
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-3xl font-display font-black text-white tracking-widest uppercase text-center">
              Identify Yourself
            </DialogTitle>
            <p className="text-gray-400 text-center font-mono text-sm uppercase tracking-widest">
              Choose your path into the realm
            </p>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-6">
            <Button 
              onClick={() => handleLoginClick('member')}
              disabled={isLoggingIn}
              className="w-full h-16 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-display uppercase tracking-widest text-lg transition-all"
            >
              Login as Member
            </Button>
            
            <Button 
              onClick={() => handleLoginClick('admin')}
              disabled={isLoggingIn}
              className="w-full h-16 bg-red-900/40 hover:bg-red-900/60 text-white border border-red-500/30 font-display uppercase tracking-widest text-lg transition-all"
            >
              Login as Admin
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center font-mono">
            Note: Admin access is strictly verified against the Iron Bank's records.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
