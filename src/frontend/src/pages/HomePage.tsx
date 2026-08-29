import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Code2, Cpu, Rocket, Trophy, Users, Zap } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const features = [
  { icon: Code2, kicker: "01 / BUILD", title: "Hands-on workshops", body: "Deep dives into AI, systems, cloud and whatever the builders are obsessed with next." },
  { icon: Users, kicker: "02 / CONNECT", title: "Builder network", body: "Find collaborators, mentors, co-founders and the team that makes the idea real." },
  { icon: Trophy, kicker: "03 / COMPETE", title: "Hackathon mode", body: "Train together, ship under pressure and enter rooms where ambitious builders belong." },
  { icon: Rocket, kicker: "04 / SHIP", title: "Real products", body: "Turn prototypes into useful things with feedback, iteration and a project-first culture." },
];

const projects = [
  ["MAYAVIHIN", "AI / ML", "Deepfake detection"],
  ["SYNQRO", "SAAS", "Digital queue intelligence"],
  ["CLEANFLOW", "CIVIC TECH", "Fleet management"],
  ["SEEKHSATHI", "EDTECH", "Skill exchange"],
];

export function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="overflow-hidden">
      <section ref={heroRef} className="noise-overlay relative flex min-h-[calc(100vh-5rem)] items-center border-b border-border" data-ocid="hero-section">
        <div className="absolute inset-0 bg-[linear-gradient(oklch(var(--border)/.22)_1px,transparent_1px),linear-gradient(90deg,oklch(var(--border)/.22)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
        <motion.div className="absolute -right-32 top-24 h-96 w-96 rounded-full bg-primary/12 blur-[100px]" animate={{ scale: [1, 1.12, 1], x: [0, 24, 0], y: [0, -18, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-secondary/10 blur-[90px]" animate={{ scale: [1, 1.08, 1], x: [0, -16, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />

        <motion.div style={{ y: heroY, scale: heroScale, opacity: heroOpacity }} className="relative z-10 mx-auto w-full max-w-[1400px] px-5 py-24 sm:px-8 lg:px-12">
          <div className="grid gap-14 lg:grid-cols-[1.35fr_.65fr] lg:items-end">
            <div>
              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }} className="mb-8 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[.25em] text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/8 px-3 py-1.5 text-primary"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" /> Live / 2026</span>
                <span>Student hacker collective</span>
                <span>///</span>
                <span>Build different.</span>
              </motion.div>

              <div className="overflow-hidden">
                {[
                  ["CODE", "primary"],
                  ["BLOODED", "foreground"],
                ].map(([text, tone], index) => (
                  <motion.h1 key={text} initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: .8, delay: index * .09, ease: [0.22, 1, .36, 1] }} className={`font-display text-[16vw] font-black leading-[.76] tracking-[-.075em] sm:text-[14vw] lg:text-[10.5vw] ${tone === "primary" ? "text-primary" : "text-foreground"}`}>
                    {text}
                  </motion.h1>
                ))}
              </div>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .45, duration: .55 }} className="mt-10 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl">
                A student-led tech club for people who would rather <span className="text-foreground">ship the idea</span> than just talk about it.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .58, duration: .5 }} className="mt-8 flex flex-wrap gap-3">
                <Link to="/join"><Button size="lg" className="group rounded-xl px-7 font-display font-bold uppercase tracking-[.12em]">Enter CodeBlooded <ArrowUpRight className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></Button></Link>
                <a href="#projects"><Button size="lg" variant="outline" className="rounded-xl px-7 font-display font-bold uppercase tracking-[.12em]">See what we ship</Button></a>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .7, duration: .65 }} className="pb-2 lg:pb-6">
              <div className="border-l border-border pl-6">
                <div className="font-mono text-[10px] uppercase tracking-[.25em] text-primary">Signal / 001</div>
                <div className="mt-4 text-3xl font-black leading-tight tracking-tight">BUILD.<br />BREAK.<br />REBUILD.</div>
                <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">Workshops, competitions, projects, chess, and the weird experiments in between.</p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {['AI', 'WEB', 'SYSTEMS', 'HACKS'].map((tag) => <span key={tag} className="rounded-full border border-border px-2.5 py-1 font-mono text-[9px] tracking-[.2em] text-muted-foreground">{tag}</span>)}
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-20 flex items-center gap-4 font-mono text-[9px] uppercase tracking-[.2em] text-muted-foreground">
            <span>Scroll to enter the loop</span><span className="h-px w-20 bg-border" /><motion.span animate={{ x: [0, 8, 0] }} transition={{ duration: 1.4, repeat: Infinity }}>↓</motion.span>
          </motion.div>
        </motion.div>
      </section>

      <section className="border-b border-border bg-card/35" data-ocid="signal-strip">
        <div className="marquee-track flex w-max min-w-full gap-10 py-4 font-mono text-[10px] uppercase tracking-[.3em] text-muted-foreground">
          {[...Array(2)].flatMap((_, group) => ['CODEBLOODED', 'BUILD / HACK / INNOVATE', 'EST. 2026', 'NO BORING BUILDS'].map((item, i) => <span key={`${group}-${i}`} className="inline-flex items-center gap-10">{item}<span className="text-primary">✳</span></span>))}
        </div>
      </section>

      <section className="relative mx-auto max-w-[1400px] px-5 py-28 sm:px-8 lg:px-12" id="features" data-ocid="features-section">
        <div className="mb-14 grid gap-8 lg:grid-cols-[.65fr_1.35fr] lg:items-end">
          <div className="font-mono text-[10px] uppercase tracking-[.25em] text-primary">The club / 002</div>
          <div>
            <h2 className="font-display text-5xl font-black tracking-[-.05em] sm:text-7xl">MAKE SOMETHING<br /><span className="text-muted-foreground">WORTH SHOWING.</span></h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">The old site told people what we do. This one should make them feel what it is like to be here.</p>
          </div>
        </div>

        <div className="grid gap-px border border-border bg-border md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return <motion.article key={feature.title} initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ delay: index * .08, duration: .55 }} whileHover={{ y: -7 }} className="group relative min-h-[360px] bg-background p-7 transition-shadow hover:shadow-2xl hover:shadow-primary/5 sm:p-9" data-ocid={`feature-card-${index}`}>
              <div className="flex items-start justify-between"><span className="font-mono text-[9px] tracking-[.22em] text-primary">{feature.kicker}</span><Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" /></div>
              <div className="absolute inset-x-7 bottom-8 sm:inset-x-9"><h3 className="font-display text-3xl font-black tracking-tight">{feature.title}</h3><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{feature.body}</p><div className="mt-7 h-px w-full bg-border"><motion.div className="h-px bg-primary" initial={{ width: 0 }} whileInView={{ width: `${25 + index * 17}%` }} transition={{ duration: .8, delay: .15 }} /></div></div>
            </motion.article>;
          })}
        </div>
      </section>

      <section id="projects" className="border-y border-border bg-muted/20" data-ocid="projects-section">
        <div className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8 lg:px-12">
          <div className="mb-14 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><div className="font-mono text-[10px] uppercase tracking-[.25em] text-secondary">Projects / 003</div><h2 className="mt-4 font-display text-5xl font-black tracking-[-.05em] sm:text-7xl">RECENT SHIPMENTS.</h2></div><p className="max-w-sm text-sm leading-relaxed text-muted-foreground">Real ideas. Real prototypes. Real student-built software. Hover a card and let it misbehave.</p></div>
          <div className="grid gap-5 md:grid-cols-2">
            {projects.map(([name, tag, desc], index) => <motion.div key={name} whileHover="hover" initial="rest" className="group relative overflow-hidden rounded-[1.5rem] border border-border bg-background p-6 sm:p-8" data-ocid={`project-card-${index}`}>
              <motion.div variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: -4, scale: 1.06 } }} transition={{ type: "spring", stiffness: 180, damping: 18 }} className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-primary/20 bg-primary/10 blur-[1px]" />
              <div className="relative flex min-h-[280px] flex-col justify-between"><div><Badge variant="outline" className="font-mono text-[9px] tracking-[.2em] text-primary">{tag}</Badge><h3 className="mt-20 font-display text-5xl font-black tracking-[-.06em] sm:text-6xl">{name}</h3><p className="mt-3 text-sm text-muted-foreground">{desc}</p></div><div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[.18em] text-muted-foreground"><span>CodeBlooded / shipped</span><ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></div></div>
            </motion.div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 py-28 sm:px-8 lg:px-12" data-ocid="join-section">
        <div className="relative overflow-hidden rounded-[2rem] border border-primary/25 bg-primary p-8 text-primary-foreground sm:p-14 lg:p-20">
          <motion.div animate={{ x: [0, 60, 0], rotate: [0, 8, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-20 -top-20 h-80 w-80 rounded-full border-[36px] border-primary-foreground/10" />
          <div className="relative max-w-4xl"><div className="font-mono text-[10px] uppercase tracking-[.3em] opacity-65">Final signal / 004</div><h2 className="mt-6 font-display text-6xl font-black leading-[.84] tracking-[-.07em] sm:text-8xl">DON'T JUST<br />JOIN A CLUB.</h2><p className="mt-8 max-w-2xl text-base leading-relaxed opacity-75 sm:text-lg">Join the people who are building the thing they wish already existed.</p><div className="mt-9"><Link to="/join"><Button size="lg" variant="secondary" className="rounded-xl px-7 font-display font-black uppercase tracking-[.12em]">Join CodeBlooded <ArrowUpRight /></Button></Link></div></div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-5 pb-20 sm:px-8 lg:px-12"><div className="flex flex-col gap-3 border-t border-border pt-6 font-mono text-[9px] uppercase tracking-[.22em] text-muted-foreground sm:flex-row sm:justify-between"><span>CODEBLOODED / The build loop continues</span><span>01—∞</span></div></section>
    </div>
  );
}
