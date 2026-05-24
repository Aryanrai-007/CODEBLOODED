import {
  useEquipSkin,
  useEquippedSkin,
  usePlayerSkins,
} from "@/hooks/useGameQueries";
import { Lock } from "lucide-react";

const SKINS = [
  {
    id: "default",
    name: "Vanguard",
    color: "#06b6d4",
    unlockCondition: "Default",
  },
  {
    id: "crimson",
    name: "Crimson Fury",
    color: "#ef4444",
    unlockCondition: "Reach Wave 3",
  },
  {
    id: "emerald",
    name: "Emerald Blade",
    color: "#22c55e",
    unlockCondition: "Score 10,000",
  },
  {
    id: "golden",
    name: "Golden Ace",
    color: "#fbbf24",
    unlockCondition: "Defeat 1st Boss",
  },
  {
    id: "phantom",
    name: "Phantom",
    color: "#a855f7",
    unlockCondition: "Reach Wave 10",
    isLegendary: true,
  },
  {
    id: "omega",
    name: "Omega",
    color: "rainbow",
    unlockCondition: "Score 50,000",
    isLegendary: true,
  },
  {
    id: "night_shade",
    name: "Night Shade",
    color: "#1a0a2e",
    isLegendary: true,
    isFree: true,
    unlockCondition: "Free for all pilots",
  },
];

export function SkinSelector({
  playerId,
  onEquip,
}: {
  playerId: string;
  onEquip?: (skinId: string) => void;
}) {
  const { data: unlockedSkins = [] } = usePlayerSkins(playerId);
  const { data: equippedSkin } = useEquippedSkin(playerId);
  const equipMutation = useEquipSkin();

  return (
    <div>
      <h2
        className="text-sm font-black tracking-[0.3em] mb-5 font-mono"
        style={{ color: "#06b6d4", textShadow: "0 0 12px rgba(6,182,212,0.5)" }}
      >
        SHIP ARSENAL
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {SKINS.map((skin) => {
          const isUnlocked =
            skin.id === "default" ||
            (skin as { isFree?: boolean }).isFree ||
            unlockedSkins.some((us) => us.skinId === skin.id);
          const isEquipped = equippedSkin?.skinId === skin.id;

          return (
            <div
              key={skin.id}
              className="flex-shrink-0 w-40 rounded-xl border p-4 flex flex-col items-center gap-3 transition-all duration-300"
              style={{
                background: "rgba(15,15,30,0.7)",
                backdropFilter: "blur(12px)",
                borderColor:
                  (skin as { isLegendary?: boolean }).isLegendary && isUnlocked
                    ? "rgba(251,191,36,0.5)"
                    : "rgba(139,92,246,0.3)",
                boxShadow:
                  (skin as { isLegendary?: boolean }).isLegendary && isUnlocked
                    ? "0 0 20px rgba(251,191,36,0.2)"
                    : "0 0 15px rgba(139,92,246,0.1)",
              }}
              data-ocid={`games.skin.item.${skin.id}`}
            >
              {(skin as { isLegendary?: boolean }).isLegendary && (
                <span
                  className="text-[10px] font-bold tracking-widest"
                  style={{ color: "#fbbf24" }}
                >
                  LEGENDARY
                </span>
              )}

              <div
                className="w-12 h-12 rounded-full border-2"
                style={{
                  borderColor: (skin as { isLegendary?: boolean }).isLegendary
                    ? "rgba(251,191,36,0.5)"
                    : "rgba(255,255,255,0.2)",
                  background:
                    skin.color === "rainbow"
                      ? "conic-gradient(from 0deg, #ef4444, #fbbf24, #22c55e, #06b6d4, #a855f7, #ef4444)"
                      : skin.color,
                  boxShadow: `0 0 15px ${skin.color === "rainbow" ? "rgba(168,85,247,0.5)" : skin.color}40`,
                }}
              />

              <span className="text-sm font-bold" style={{ color: "#e2d9f3" }}>
                {skin.name}
              </span>

              {isEquipped ? (
                <span
                  className="text-xs font-bold tracking-wider px-2 py-1 rounded"
                  style={{
                    background: "rgba(6,182,212,0.2)",
                    color: "#06b6d4",
                  }}
                >
                  EQUIPPED
                </span>
              ) : isUnlocked ? (
                <button
                  type="button"
                  onClick={() => {
                    equipMutation.mutate({ playerId, skinId: skin.id });
                    onEquip?.(skin.id);
                  }}
                  disabled={equipMutation.isPending}
                  className="text-xs font-bold tracking-wider px-3 py-1.5 rounded transition-all duration-200 hover:opacity-80 disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                    color: "#fff",
                  }}
                  data-ocid={`games.skin.equip_button.${skin.id}`}
                >
                  {equipMutation.isPending ? "..." : "EQUIP"}
                </button>
              ) : (
                <div
                  className="flex items-center gap-1 text-xs"
                  style={{ color: "#6b7280" }}
                >
                  <Lock className="w-3 h-3" />
                  <span>{skin.unlockCondition}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
