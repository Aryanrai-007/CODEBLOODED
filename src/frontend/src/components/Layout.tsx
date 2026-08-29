import { AnimatePresence, motion } from "motion/react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CursorGlow, ScrollProgress } from "./AnimatedChrome";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/join", label: "Join" },
  { to: "/calendar", label: "Calendar" },
  { to: "/chess", label: "Chess" },
  { to: "/chessbot", label: "Bot" },
  { to: "/admin", label: "Admin" },
] as const;

export function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const location = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const initial = stored === "light" || stored === "dark" ? stored : "dark";
    document.documentElement.classList.toggle("dark", initial === "dark");
    setTheme(initial);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
    setTheme(next);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <ScrollProgress />
      <CursorGlow />

      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
        <motion.div
          layout
          className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-border/70 bg-card/70 px-3 py-2.5 shadow-2xl shadow-black/10 backdrop-blur-xl sm:px-4"
        >
          <Link to="/" data-ocid="nav-logo" className="group flex items-center gap-3">
            <motion.span
              whileHover={{ rotate: -4, scale: 1.06 }}
              transition={{ type: "spring", stiffness: 420, damping: 20 }}
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-primary/30 bg-primary/10"
            >
              <img src="/assets/images/logo.png" alt="CodeBlooded logo" className="h-8 w-8 object-contain" />
            </motion.span>
            <span className="hidden font-display text-sm font-black uppercase tracking-[0.22em] sm:block">
              CODEBLOODED
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" data-ocid="nav-desktop">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link key={item.to} to={item.to} className="relative px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground" data-ocid={`nav-${item.label.toLowerCase()}`}>
                  {active && (
                    <motion.span layoutId="nav-active" className="absolute inset-0 rounded-xl bg-primary/10" transition={{ type: "spring", stiffness: 420, damping: 32 }} />
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              onClick={toggleTheme}
              whileHover={{ rotate: 8, scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              className="hidden h-9 w-9 items-center justify-center rounded-xl border border-border bg-background/50 text-xs md:flex"
              aria-label="Toggle theme"
              data-ocid="theme-toggle"
            >
              {theme === "dark" ? "☼" : "◐"}
            </motion.button>
            <Link to="/join" className="hidden rounded-xl bg-primary px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-primary-foreground transition-transform hover:scale-[1.03] active:scale-95 sm:block" data-ocid="nav-cta">
              Enter the club ↗
            </Link>
            <button type="button" onClick={() => setMenuOpen((value) => !value)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background/50 md:hidden" aria-label="Toggle menu" data-ocid="nav-mobile-toggle">
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav initial={{ opacity: 0, y: -12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={{ duration: 0.2 }} className="mx-auto mt-2 flex max-w-7xl flex-col gap-1 rounded-2xl border border-border/70 bg-card/90 p-2 shadow-2xl backdrop-blur-xl md:hidden" data-ocid="nav-mobile">
              {navItems.map((item, index) => (
                <motion.div key={item.to} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.035 }}>
                  <Link to={item.to} className="block rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] hover:bg-primary/10 hover:text-primary">{item.label}</Link>
                </motion.div>
              ))}
              <motion.button type="button" onClick={toggleTheme} whileTap={{ scale: 0.98 }} className="rounded-xl px-4 py-3 text-left text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground hover:bg-primary/10 hover:text-primary">Switch to {theme === "dark" ? "light" : "dark"}</motion.button>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main className="relative flex-1 pt-20">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={location.pathname} initial={{ opacity: 0, y: 12, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -8, filter: "blur(6px)" }} transition={{ duration: 0.34, ease: "easeOut" }}>
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-border/70 bg-card/60 backdrop-blur-xl" data-ocid="footer">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="font-display text-lg font-black tracking-tight">CODEBLOODED<span className="text-primary">.</span></p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Build · Hack · Innovate · Repeat</p>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">© {new Date().getFullYear()} · Built by builders</p>
        </div>
      </footer>
    </div>
  );
}
