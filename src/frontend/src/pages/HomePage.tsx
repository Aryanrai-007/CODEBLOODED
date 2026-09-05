import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Code2,
  Globe,
  Mail,
  Rocket,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Code2,
    title: "Hands-On Workshops",
    description:
      "Weekly deep-dive sessions on cutting-edge tech — AI, blockchain, systems design, and beyond. Led by industry engineers and alumni.",
    badge: "Weekly",
    colorClass: "text-primary",
    borderClass: "border-primary/30",
    glowClass: "hover:shadow-[0_0_24px_oklch(var(--primary)/0.15)]",
    bgClass: "bg-primary/10",
  },
  {
    icon: Users,
    title: "Builder Network",
    description:
      "Connect with like-minded creators, founders, and engineers. Find co-founders, collaborators, and mentors in a tight-knit community.",
    badge: "Community",
    colorClass: "text-secondary",
    borderClass: "border-secondary/30",
    glowClass: "hover:shadow-[0_0_24px_oklch(var(--secondary)/0.15)]",
    bgClass: "bg-secondary/10",
  },
  {
    icon: Trophy,
    title: "Win Hackathons",
    description:
      "Compete in national and international hackathons with a prepared team. Past teams have won prizes and landed internships.",
    badge: "Compete",
    colorClass: "text-primary",
    borderClass: "border-primary/30",
    glowClass: "hover:shadow-[0_0_24px_oklch(var(--primary)/0.15)]",
    bgClass: "bg-primary/10",
  },
  {
    icon: Rocket,
    title: "Launch Projects",
    description:
      "Ship real products with guidance from mentors. Build your portfolio, gain industry experience, and turn ideas into impactful projects.",
    badge: "Build & Ship",
    colorClass: "text-secondary",
    borderClass: "border-secondary/30",
    glowClass: "hover:shadow-[0_0_24px_oklch(var(--secondary)/0.15)]",
    bgClass: "bg-secondary/10",
  },
];

const projects = [
  {
    name: "Mayavihin",
    tagline: "AI-based deepfake detection tool",
    colorClass: "text-primary",
    borderClass: "border-primary/30",
    glowClass: "hover:shadow-[0_0_24px_oklch(var(--primary)/0.15)]",
    bgClass: "bg-primary/10",
    accentClass: "bg-primary/5",
    tag: "AI / ML",
  },
  {
    name: "SynQro",
    tagline: "Digital queue management system",
    colorClass: "text-secondary",
    borderClass: "border-secondary/30",
    glowClass: "hover:shadow-[0_0_24px_oklch(var(--secondary)/0.15)]",
    bgClass: "bg-secondary/10",
    accentClass: "bg-secondary/5",
    tag: "SaaS",
  },
  {
    name: "CleanFlow",
    tagline: "A proper management system for Indian dump trucks",
    colorClass: "text-primary",
    borderClass: "border-primary/30",
    glowClass: "hover:shadow-[0_0_24px_oklch(var(--primary)/0.15)]",
    bgClass: "bg-primary/10",
    accentClass: "bg-primary/5",
    tag: "Civic Tech",
  },
  {
    name: "SeekhSathi",
    tagline: "A video call based skill exchange platform",
    colorClass: "text-secondary",
    borderClass: "border-secondary/30",
    glowClass: "hover:shadow-[0_0_24px_oklch(var(--secondary)/0.15)]",
    bgClass: "bg-secondary/10",
    accentClass: "bg-secondary/5",
    tag: "EdTech",
  },
];

const missionTags = [
  "Open to All",
  "Skill-Building",
  "Community-Driven",
  "Project-First",
];

export function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden min-h-[92vh] flex items-center bg-background"
        data-ocid="hero-section"
      >
        {/* Geometric accent layers */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          {/* Left triangular blocks */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 -rotate-12 -translate-x-16 -translate-y-8" />
          <div className="absolute top-8 left-8 w-32 h-48 bg-primary/20 rotate-6" />
          <div className="absolute top-32 left-0 w-20 h-32 bg-secondary/30 rotate-3" />
          {/* Right triangular blocks */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-secondary/10 rotate-12 translate-x-16 -translate-y-8" />
          <div className="absolute top-16 right-8 w-40 h-40 bg-secondary/20 -rotate-6" />
          <div className="absolute top-40 right-0 w-24 h-40 bg-primary/25 -rotate-3" />
          {/* Subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(oklch(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, oklch(var(--primary)) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="outline"
              className="mb-6 inline-flex items-center gap-2 border-primary/40 text-primary bg-primary/10 px-4 py-1.5 text-sm font-mono tracking-wider uppercase"
              data-ocid="hero-badge"
            >
              <Zap className="w-3.5 h-3.5" />
              Established 2026 · Hackathon Club
            </Badge>
          </motion.div>

          {/* Display name */}
          <motion.h1
            className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none mb-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            data-ocid="hero-title"
          >
            <span className="accent-text-gradient">CODE</span>
            <br />
            <span className="text-foreground">BLOODED</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-muted-foreground tracking-widest uppercase mb-6"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
          >
            Build.&nbsp;&nbsp;Hack.&nbsp;&nbsp;Innovate.
          </motion.p>

          {/* Sub-description */}
          <motion.p
            className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            A community of passionate builders, hackers, and innovators. We
            compete, collaborate, and create technology that matters — from
            weekend hackathons to full-scale product launches.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link to="/join" data-ocid="hero-join-btn">
              <Button
                size="lg"
                className="btn-primary text-base px-8 py-4 h-auto font-display font-bold tracking-wide accent-glow group"
              >
                Join Now
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#features" data-ocid="hero-explore-btn">
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 py-4 h-auto font-display font-semibold border-border hover:border-primary/50 hover:text-primary transition-smooth"
              >
                Explore Benefits
              </Button>
            </a>
          </motion.div>
        </div>

        {/* Bottom gradient stripe */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary"
          aria-hidden="true"
        />
      </section>

      {/* ── Features ── */}
      <section
        id="features"
        className="bg-background py-24"
        data-ocid="features-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-mono text-primary text-sm uppercase tracking-[0.3em] mb-3">
              Why Join
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight mb-4">
              Everything you need to{" "}
              <span className="accent-text-gradient">level up</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              CodeBlooded gives you the tools, team, and training to go from
              idea to execution — fast.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                >
                  <Card
                    className={`card-elevated border ${feature.borderClass} bg-card h-full transition-smooth ${feature.glowClass} group cursor-default`}
                    data-ocid={`feature-card-${i}`}
                  >
                    <CardContent className="p-6 flex flex-col gap-4 h-full">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.bgClass} border ${feature.borderClass} group-hover:scale-110 transition-transform duration-200`}
                      >
                        <Icon className={`w-6 h-6 ${feature.colorClass}`} />
                      </div>
                      <div>
                        <Badge
                          variant="outline"
                          className={`text-xs mb-3 ${feature.colorClass} border-current bg-transparent font-mono tracking-wider`}
                        >
                          {feature.badge}
                        </Badge>
                        <h3 className="font-display font-bold text-lg tracking-tight mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section
        id="projects"
        className="bg-muted/30 border-y border-border py-24"
        data-ocid="projects-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-mono text-secondary text-sm uppercase tracking-[0.3em] mb-3">
              What We Build
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight mb-4">
              Our <span className="accent-text-gradient">Projects</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Join us and help us build more — real products tackling real
              problems.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {projects.map((project, i) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
              >
                <Card
                  className={`card-elevated border ${project.borderClass} bg-card h-full transition-smooth ${project.glowClass} group cursor-default`}
                  data-ocid={`project-card-${i}`}
                >
                  <CardContent className="p-6 flex flex-col gap-4 h-full">
                    {/* Icon area */}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${project.bgClass} border ${project.borderClass} font-display font-black text-base ${project.colorClass} group-hover:scale-110 transition-transform duration-200`}
                    >
                      {project.name.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="flex flex-col gap-2 flex-1">
                      <Badge
                        variant="outline"
                        className={`text-xs w-fit ${project.colorClass} border-current bg-transparent font-mono tracking-wider`}
                      >
                        {project.tag}
                      </Badge>
                      <h3 className="font-display font-bold text-xl tracking-tight">
                        {project.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {project.tagline}
                      </p>
                    </div>

                    {/* Bottom accent line */}
                    <div
                      className={`h-px w-full bg-gradient-to-r from-transparent ${project.colorClass.replace("text-", "via-")} to-transparent opacity-30`}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section
        className="bg-background border-b border-border py-24"
        data-ocid="about-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <p className="font-mono text-secondary text-sm uppercase tracking-[0.3em] mb-4">
                Our Mission
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight mb-6">
                Built by builders,{" "}
                <span className="accent-text-gradient">for builders</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                CodeBlooded was founded with one belief: the best way to learn
                is to ship. We bring together students who want to build real
                things, solve real problems, and make a real impact — through
                code, creativity, and collaboration.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Whether you're a first-year just starting out or a final-year
                veteran, there's a place for you here. All skill levels welcome.
                All majors welcome. All big ideas welcome.
              </p>
              <div className="flex flex-wrap gap-3">
                {missionTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-primary/30 text-primary bg-primary/5 font-mono text-xs tracking-wider"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.div>

            {/* Geometric visual */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1 }}
            >
              <div className="relative h-80 lg:h-96 overflow-hidden rounded-2xl bg-card border border-border card-elevated">
                <div className="absolute inset-0" aria-hidden="true">
                  <div className="absolute top-6 left-6 w-24 h-24 bg-primary/20 rotate-12 rounded-sm" />
                  <div className="absolute top-12 left-20 w-16 h-16 bg-secondary/30 -rotate-6 rounded-sm" />
                  <div className="absolute bottom-8 right-8 w-32 h-32 bg-secondary/20 rotate-6 rounded-sm" />
                  <div className="absolute bottom-16 right-24 w-20 h-20 bg-primary/25 -rotate-12 rounded-sm" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-px bg-gradient-to-r from-primary to-secondary" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-40 bg-gradient-to-b from-primary to-secondary" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center z-10">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center accent-glow">
                      <Globe className="w-10 h-10 text-primary" />
                    </div>
                    <p className="font-display font-bold text-xl tracking-tight">
                      Code. Create. Conquer.
                    </p>
                    <p className="text-sm text-muted-foreground mt-1 font-mono">
                      Established 2026
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="bg-background py-24 relative overflow-hidden"
        data-ocid="cta-section"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <p className="font-mono text-primary text-sm uppercase tracking-[0.3em] mb-4">
              Ready to build?
            </p>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter mb-6">
              Your next big idea{" "}
              <span className="accent-text-gradient">starts here</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Applications are open. Join CodeBlooded today and be part of the
              most ambitious builder community in our college.
            </p>
            <Link to="/join" data-ocid="cta-join-btn">
              <Button
                size="lg"
                className="btn-primary text-base px-10 py-4 h-auto font-display font-bold tracking-wide accent-glow group"
              >
                Apply Now — It's Free
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="mt-6 text-xs text-muted-foreground font-mono tracking-wide">
              No experience required. All departments welcome.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Footer info with contact ── */}
      <section
        className="bg-card border-t border-border py-12"
        data-ocid="footer-info-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Club info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/assets/images/logo.png"
                  alt="CodeBlooded logo"
                  className="h-8 w-auto object-contain"
                />
                <span className="font-display font-black text-lg tracking-tight">
                  CODEBLOODED
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                A hackathon club for students who love to build. We organize
                workshops, hackathons, and networking events to help you grow as
                a developer and innovator.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-foreground mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/" className="hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/join"
                    className="hover:text-primary transition-colors"
                  >
                    Join the Club
                  </Link>
                </li>
                <li>
                  <a
                    href="#features"
                    className="hover:text-primary transition-colors"
                  >
                    Benefits
                  </a>
                </li>
                <li>
                  <a
                    href="#projects"
                    className="hover:text-primary transition-colors"
                  >
                    Our Projects
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-display font-bold text-sm uppercase tracking-widest text-foreground mb-4">
                Contact Us
              </h3>
              <a
                href="mailto:codeblooded66@gmail.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                data-ocid="contact-email"
              >
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                codeblooded66@gmail.com
              </a>
              <p className="mt-3 text-xs text-muted-foreground">
                Reach out for partnerships, sponsorships, or any queries about
                the club.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
