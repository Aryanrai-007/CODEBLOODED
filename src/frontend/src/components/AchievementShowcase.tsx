import { ACHIEVEMENTS } from "@/types/game";
import {
  Award,
  Battery,
  Check,
  Crosshair,
  Crown,
  Flame,
  Heart,
  Lock,
  Shield,
  Star,
  Sword,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

const ICON_MAP: Record<
  string,
  React.ComponentType<{ className?: string; style?: React.CSSProperties }>
> = {
  Target,
  Shield,
  Zap,
  Sword,
  Crosshair,
  Award,
  Trophy,
  Flame,
  Battery,
  Heart,
  Crown,
  Star,
};

export function AchievementShowcase({
  unlockedAchievementIds = [],
}: {
  unlockedAchievementIds?: string[];
}) {
  const unlockedCount = ACHIEVEMENTS.filter((a) =>
    unlockedAchievementIds.includes(a.id),
  ).length;

  return (
    <div>
      <style>{`
        @keyframes legendaryPulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }
        @keyframes unlockedGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(34,197,94,0.2); }
          50% { box-shadow: 0 0 16px rgba(34,197,94,0.5); }
        }
      `}</style>
      <div className="flex items-center justify-between mb-5">
        <h2
          className="text-sm font-black tracking-[0.3em] font-mono"
          style={{
            color: "#06b6d4",
            textShadow: "0 0 12px rgba(6,182,212,0.5)",
          }}
        >
          ACHIEVEMENTS
        </h2>
        <span className="text-xs font-mono" style={{ color: "#a855f7" }}>
          {unlockedCount} / {ACHIEVEMENTS.length} UNLOCKED
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlockedAchievementIds.includes(achievement.id);
          const Icon = ICON_MAP[achievement.icon] || Target;

          return (
            <div
              key={achievement.id}
              className="rounded-xl border p-4 flex flex-col items-center gap-2 transition-all duration-300 relative overflow-hidden"
              style={{
                background: isUnlocked
                  ? "rgba(15,15,30,0.7)"
                  : "rgba(15,15,30,0.3)",
                backdropFilter: "blur(12px)",
                borderColor: isUnlocked
                  ? achievement.rarity === "legendary"
                    ? "rgba(251,191,36,0.5)"
                    : "rgba(34,197,94,0.4)"
                  : "rgba(139,92,246,0.2)",
                opacity: isUnlocked ? 1 : 0.5,
                animation:
                  isUnlocked && achievement.rarity !== "legendary"
                    ? "unlockedGlow 2s infinite"
                    : undefined,
              }}
              data-ocid={`games.achievement.item.${achievement.id}`}
            >
              {achievement.rarity === "legendary" && isUnlocked && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)",
                    animation: "legendaryPulse 2s infinite",
                  }}
                />
              )}

              {achievement.rarity === "legendary" && (
                <span
                  className="text-[10px] font-bold tracking-widest z-10"
                  style={{ color: "#fbbf24" }}
                >
                  ⬡ LEGENDARY ⬡
                </span>
              )}

              <div className="relative z-10">
                {isUnlocked ? (
                  <div className="relative">
                    <Icon
                      className="w-8 h-8"
                      style={{
                        color:
                          achievement.rarity === "legendary"
                            ? "#fbbf24"
                            : "#a855f7",
                        filter:
                          achievement.rarity === "legendary"
                            ? "drop-shadow(0 0 8px rgba(251,191,36,0.6))"
                            : "drop-shadow(0 0 6px rgba(168,85,247,0.5))",
                      }}
                    />
                    <div
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                      style={{
                        background: "#22c55e",
                        boxShadow: "0 0 6px rgba(34,197,94,0.6)",
                      }}
                    >
                      <Check
                        className="w-2.5 h-2.5"
                        style={{ color: "#fff" }}
                      />
                    </div>
                  </div>
                ) : (
                  <Icon className="w-8 h-8" style={{ color: "#4b5563" }} />
                )}
              </div>

              <span
                className="text-xs font-bold text-center z-10"
                style={{ color: isUnlocked ? "#e2d9f3" : "#6b7280" }}
              >
                {achievement.name}
              </span>

              {isUnlocked ? (
                <div className="flex items-center gap-1 z-10">
                  <Check className="w-3 h-3" style={{ color: "#22c55e" }} />
                  <span
                    className="text-[10px] font-bold"
                    style={{ color: "#22c55e" }}
                  >
                    UNLOCKED
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1 z-10">
                  <Lock className="w-3 h-3" style={{ color: "#4b5563" }} />
                  <span className="text-[10px]" style={{ color: "#4b5563" }}>
                    LOCKED
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
