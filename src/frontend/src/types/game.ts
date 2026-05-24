export interface GamePlayer {
  playerId: string;
  username: string;
  passwordHash: string;
  createdAt: bigint;
}

export interface GameScore {
  scoreId: string;
  playerId: string;
  gameId: string;
  score: bigint;
  killedEnemies: bigint;
  wavesCleared: bigint;
  achievedAt: bigint;
}

export type RegisterResult =
  | { __kind__: "ok"; ok: string }
  | { __kind__: "err"; err: string };

export type LoginResult =
  | { __kind__: "ok"; ok: GamePlayer }
  | { __kind__: "err"; err: string };

export interface PlayerRank {
  playerId: string;
  username: string;
  score: bigint;
  rank: bigint;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "legendary";
  special?: boolean;
  unlocksSkin?: string;
}

export interface Skin {
  id: string;
  name: string;
  color: string;
  isLegendary?: boolean;
  isFree?: boolean;
  unlockCondition?: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_blood",
    name: "First Blood",
    description: "Kill your first enemy",
    icon: "🔫",
    rarity: "common",
  },
  {
    id: "wave_5",
    name: "Survivor",
    description: "Reach Wave 10",
    icon: "🌊",
    rarity: "common",
  },
  {
    id: "wave_10",
    name: "Veteran",
    description: "Reach Wave 20",
    icon: "⚔️",
    rarity: "common",
  },
  {
    id: "wave_15",
    name: "Elite",
    description: "Reach Wave 30",
    icon: "🎖️",
    rarity: "common",
  },
  {
    id: "score_1000",
    name: "Thousand Points",
    description: "Score 5,000 points",
    icon: "⭐",
    rarity: "common",
  },
  {
    id: "score_5000",
    name: "High Flyer",
    description: "Score 25,000 points",
    icon: "🌟",
    rarity: "common",
  },
  {
    id: "score_10000",
    name: "Ace Pilot",
    description: "Score 100,000 points",
    icon: "💫",
    rarity: "common",
  },
  {
    id: "boss_slayer",
    name: "Boss Slayer",
    description: "Defeat 3 bosses",
    icon: "👾",
    rarity: "common",
  },
  {
    id: "combo_master",
    name: "Combo Master",
    description: "Reach a 10x combo",
    icon: "🔥",
    rarity: "common",
  },
  {
    id: "veteran_pilot",
    name: "Veteran Pilot",
    description: "Play 10 games total",
    icon: "🏆",
    rarity: "common",
  },
  {
    id: "phantom_void",
    name: "PHANTOM VOID",
    description: "Only the chosen few navigate the void this deep.",
    icon: "◈",
    rarity: "legendary",
    special: true,
    unlocksSkin: "phantom",
  },
  {
    id: "omega_apex",
    name: "OMEGA APEX",
    description: "Apex predator of the cosmos.",
    icon: "⬡",
    rarity: "legendary",
    special: true,
    unlocksSkin: "omega",
  },
];

export const SKINS: Skin[] = [
  {
    id: "default",
    name: "VOID STRIKER",
    color: "#00ffff",
    unlockCondition: "Default ship",
  },
  {
    id: "crimson",
    name: "CRIMSON BLADE",
    color: "#ff3366",
    unlockCondition: "Reach Wave 5",
  },
  {
    id: "aurora",
    name: "AURORA GHOST",
    color: "#7c3aed",
    unlockCondition: "Score 10,000 points",
  },
  {
    id: "golden",
    name: "GOLDEN EAGLE",
    color: "#f59e0b",
    unlockCondition: "Reach Wave 15",
  },
  {
    id: "phantom",
    name: "PHANTOM VOID",
    color: "#1a0a2e",
    isLegendary: true,
    unlockCondition: "Reach Wave 20 (LEGENDARY)",
  },
  {
    id: "omega",
    name: "OMEGA APEX",
    color: "rainbow",
    isLegendary: true,
    unlockCondition: "Defeat 3 bosses (LEGENDARY)",
  },
  {
    id: "night_shade",
    name: "NIGHT SHADE",
    color: "#1a0a2e",
    isLegendary: true,
    isFree: true,
    unlockCondition: "Free for all pilots",
  },
];
