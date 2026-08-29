import { AnimatePresence, motion } from "motion/react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CursorGlow, ScrollProgress } from "./AnimatedChrome";

const navItems = [
  { to: "/", label: "Index" },
  { to: "/join", label: "Join" },
  { to: "/calendar", label: "Calendar" },
  { to: "/chess", label: "Chess" },
  { to: "/chessbot", label: "Bot" },
  { to: "/admin", label: "Admin" },
] as const;

export function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const location = useLocation();

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const initial = stored === "light" || stored === "dark" ? stored : "light";
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

  return <div className="min-h-screen bg-background text-foreground selection:bg-secondary selection:text-secondary-foreground">
    <ScrollProgress />
    <CursorGlow />
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mx-auto flex max-w-[1500px] items-center justify-between border-b-2 border-foreground/15 bg-background/85 px-2 py-2 backdrop-blur-xl">
        <Link to="/" data-ocid="nav-logo" className="group flex items-center gap-3 px-2 py-1">
          <motion.span whileHover={{ rotate: -8, scale: 1.08 }} whileTap={{ scale: .94 }} className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-foreground"><img src="/assets/images/logo.png" alt="CodeBlooded logo" className="h-7 w-7 object-contain" /></motion.span>
          <span className="font-display text-sm font-black uppercase tracking-[0.18em]">CODEBLOODED<span className="text-secondary">.</span></span>
        </Link>

        <nav className="hidden items-center md:flex" data-ocid="nav-desktop">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return <Link key={item.to} to={item.to} className="relative px-3 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/55 transition-colors hover:text-foreground" data-ocid={`nav-${item.label.toLowerCase()}`}>
              {active && <motion.span layoutId="nav-marker" className="absolute bottom-0 left-3 right-3 h-0.5 bg-secondary" transition={{ type: "spring", stiffness: 450, damping: 30 }} />}
              {item.label}
            </Link>;
          })}
        </nav>

        <div className="flex items-center gap-2">
          <motion.button type="button" onClick={toggleTheme} whileTap={{ scale: .9 }} className="hidden h-9 w-9 items-center justify-center border border-foreground/15 font-mono text-xs sm:flex" aria-label="Toggle theme" data-ocid="theme-toggle">{theme === "dark" ? "☼" : "◐"}</motion.button>
          <Link to="/join" className="hidden bg-secondary px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-secondary-foreground sm:block" data-ocid="nav-cta">JOIN ↗</Link>
          <button type="button" onClick={() => setMenuOpen((v) => !v)} className="flex h-9 w-9 items-center justify-center border border-foreground/15 md:hidden" aria-label="Toggle menu" data-ocid="nav-mobile-toggle">{menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}</button>
        </div>
      </motion.div>

      <AnimatePresence>
        {menuOpen && <motion.nav initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mx-auto mt-2 flex max-w-[1500px] flex-col border-2 border-foreground/15 bg-background/95 p-2 backdrop-blur-xl md:hidden" data-ocid="nav-mobile">
          {navItems.map((item, index) => <motion.div key={item.to} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * .04 }}><Link to={item.to} className="block border-b border-foreground/10 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-secondary/15">{item.label}</Link></motion.div>)}
          <button type="button" onClick={toggleTheme} className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55">Theme / {theme === "dark" ? "light" : "dark"}</button>
        </motion.nav>}
      </AnimatePresence>
    </header>

    <main className="relative flex-1 pt-16">
      <AnimatePresence mode="wait" initial={false}><motion.div key={location.pathname} initial={{ opacity: 0, y: 16, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -10, filter: "blur(5px)" }} transition={{ duration: .3 }}>{children}</motion.div></AnimatePresence>
    </main>

    <footer className="border-t-2 border-foreground/10 bg-foreground text-background" data-ocid="footer"><div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-4 px-5 py-8 font-mono text-[8px] uppercase tracking-[0.2em] sm:flex-row sm:px-10"><span>CODEBLOODED / BUILD · HACK · INNOVATE</span><span>© {new Date().getFullYear()} / STUDENT BUILT</span></div></footer>
  </div>;
}
