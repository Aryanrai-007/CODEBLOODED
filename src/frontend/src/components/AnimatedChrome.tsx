import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";

export function CursorGlow() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 180, damping: 28, mass: 0.25 });
  const springY = useSpring(y, { stiffness: 180, damping: 28, mass: 0.25 });

  useEffect(() => {
    const move = (event: MouseEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl lg:block"
      style={{ x: springX, y: springY }}
    />
  );
}

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[70] h-px origin-left bg-gradient-to-r from-primary via-secondary to-primary"
      style={{ width: `${progress}%` }}
    />
  );
}
