import {
  useEquipSkin,
  useEquippedSkin,
  usePlayerAchievements,
  usePlayerSkins,
  useUnlockAchievement,
  useUnlockSkin,
} from "@/hooks/useGameQueries";
import { useSubmitGameScore, useTopScores } from "@/hooks/useGameScores";
import React, { useRef, useEffect, useState, useCallback } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────
interface Obstacle {
  x: number;
  y: number;
  lane: number;
}
interface Boost {
  x: number;
  y: number;
  lane: number;
  id: number;
}
interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
}
interface Building {
  x: number;
  w: number;
  h: number;
  color: string;
}

interface GameState {
  score: number;
  lives: number;
  combo: number;
  speedMultiplier: number;
  currentLane: number;
  carX: number;
  targetX: number;
  obstacles: Obstacle[];
  boosts: Boost[];
  stars: Star[];
  buildings: Building[];
  frameCount: number;
  invincible: boolean;
  invincibleTimer: number;
  gridOffset: number;
  boostActive: boolean;
  boostTimer: number;
  boostCount: number;
  surviveSeconds: number;
  secondTimer: number;
  hitFlash: number;
  flawlessSeconds: number;
  laneSwitched: boolean;
  nextBoostId: number;
  highScore: number;
}

type GameScreen = "idle" | "playing" | "gameover" | "paused";

// ─── Constants ───────────────────────────────────────────────────────────────
const ACHIEVEMENTS = [
  {
    id: "first_drift",
    name: "First Drift",
    desc: "Switch lanes for the first time",
  },
  { id: "survive_30", name: "Speed Demon", desc: "Survive for 30 seconds" },
  { id: "survive_60", name: "Street Legend", desc: "Survive for 60 seconds" },
  { id: "boost_5", name: "Boost Junkie", desc: "Collect 5 boosts" },
  { id: "boost_20", name: "Nitro God", desc: "Collect 20 boosts" },
  { id: "combo_x3", name: "Triple Threat", desc: "Reach combo x3" },
  { id: "combo_x5", name: "Unstoppable", desc: "Reach combo x5" },
  { id: "score_500", name: "Half K", desc: "Score 500 points" },
  { id: "score_2000", name: "2K Club", desc: "Score 2000 points" },
  {
    id: "flawless_30",
    name: "Flawless",
    desc: "Survive 30s without losing a life",
  },
];

const SKINS = [
  {
    id: "default",
    name: "Street Runner",
    color: "#00ffff",
    glowColor: "#00aaff",
    unlockReq: null as string | null,
    rarity: "free",
  },
  {
    id: "neon_black",
    name: "Neon Black",
    color: "#1a1a2e",
    glowColor: "#ff00ff",
    unlockReq: null as string | null,
    rarity: "free",
  },
  {
    id: "blaze_runner",
    name: "Blaze Runner",
    color: "#ff4400",
    glowColor: "#ff8800",
    unlockReq: "score_500" as string | null,
    rarity: "uncommon",
  },
  {
    id: "phantom_chrome",
    name: "Phantom Chrome",
    color: "#cc88ff",
    glowColor: "#aa00ff",
    unlockReq: "combo_x3" as string | null,
    rarity: "rare",
  },
  {
    id: "omega_drift",
    name: "OMEGA DRIFT",
    color: "#ffd700",
    glowColor: "#ff00ff",
    unlockReq: "score_2000" as string | null,
    rarity: "legendary",
  },
  {
    id: "void_specter",
    name: "Void Specter",
    color: "#4b0082",
    glowColor: "#9400d3",
    unlockReq: "survive_60" as string | null,
    rarity: "rare",
  },
  {
    id: "solar_flare",
    name: "Solar Flare",
    color: "#ff6600",
    glowColor: "#ffcc00",
    unlockReq: "boost_20" as string | null,
    rarity: "uncommon",
  },
  {
    id: "arctic_ghost",
    name: "Arctic Ghost",
    color: "#e0f7ff",
    glowColor: "#00bfff",
    unlockReq: "flawless_30" as string | null,
    rarity: "rare",
  },
  {
    id: "crimson_tide",
    name: "Crimson Tide",
    color: "#dc143c",
    glowColor: "#ff4466",
    unlockReq: "score_5000" as string | null,
    rarity: "legendary",
  },
  {
    id: "emerald_venom",
    name: "Emerald Venom",
    color: "#00ff7f",
    glowColor: "#00cc44",
    unlockReq: "combo_x5" as string | null,
    rarity: "rare",
  },
  {
    id: "midnight_titan",
    name: "Midnight Titan",
    color: "#2c003e",
    glowColor: "#ff69b4",
    unlockReq: "score_10000" as string | null,
    rarity: "legendary",
  },
];

const LANE_CENTERS = [100, 180, 300, 380];
const CANVAS_W = 480;
const CANVAS_H = 680;
const HORIZON_Y = 240;
const VANISH_X = CANVAS_W / 2;

const RARITY_COLOR: Record<string, string> = {
  free: "#00ffcc",
  uncommon: "#ff8800",
  rare: "#cc88ff",
  legendary: "#ffd700",
};

// Score-based unlock thresholds (no dedicated achievement, checked in checkAchievements)
const SCORE_UNLOCK_THRESHOLDS: Record<string, number> = {
  score_5000: 5000,
  score_10000: 10000,
};

// ─── Audio ───────────────────────────────────────────────────────────────────
function getAudioCtx(): AudioContext {
  const W = window as unknown as { webkitAudioContext: typeof AudioContext };
  return new (window.AudioContext || W.webkitAudioContext)();
}

function playBoostSound(ctx: AudioContext, muted: boolean) {
  if (muted) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(1760, ctx.currentTime + 0.3);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
}

function playCollisionSound(ctx: AudioContext, muted: boolean) {
  if (muted) return;
  const buf = ctx.createBuffer(
    1,
    Math.floor(ctx.sampleRate * 0.2),
    ctx.sampleRate,
  );
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++)
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = ctx.createBufferSource();
  const gain = ctx.createGain();
  src.buffer = buf;
  src.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  src.start();
}

function playGameOverSound(ctx: AudioContext, muted: boolean) {
  if (muted) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 1);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
  osc.start();
  osc.stop(ctx.currentTime + 1);
}

function playAchievementSound(ctx: AudioContext, muted: boolean) {
  if (muted) return;
  [880, 1100, 1320].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = freq;
    const t = ctx.currentTime + i * 0.1;
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.1);
    osc.start(t);
    osc.stop(t + 0.1);
  });
}

// ─── Drawing ─────────────────────────────────────────────────────────────────
type Ctx2D = CanvasRenderingContext2D;

function drawSky(ctx: Ctx2D) {
  const grad = ctx.createLinearGradient(0, 0, 0, HORIZON_Y);
  grad.addColorStop(0, "#1a0033");
  grad.addColorStop(1, "#ff00aa");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, HORIZON_Y);
}

function drawStars(ctx: Ctx2D, stars: Star[], frame: number) {
  for (const s of stars) {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fillStyle = frame % 60 < 30 ? "#ffffff" : "#00ffff";
    ctx.fill();
  }
}

function drawBuildings(ctx: Ctx2D, buildings: Building[]) {
  for (const b of buildings) {
    const bY = HORIZON_Y - b.h;
    ctx.save();
    ctx.shadowColor = b.color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#0a0015";
    ctx.fillRect(b.x, bY, b.w, b.h);
    ctx.strokeStyle = b.color;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(b.x, bY, b.w, b.h);
    ctx.shadowBlur = 0;
    ctx.fillStyle = `${b.color}55`;
    for (let wy = bY + 5; wy < HORIZON_Y - 6; wy += 11) {
      for (let wx = b.x + 3; wx < b.x + b.w - 5; wx += 9) {
        if (Math.random() > 0.45) ctx.fillRect(wx, wy, 4, 5);
      }
    }
    ctx.restore();
  }
}

function drawRoad(ctx: Ctx2D, gridOffset: number) {
  ctx.fillStyle = "#0a0a1a";
  ctx.fillRect(0, HORIZON_Y, CANVAS_W, CANVAS_H - HORIZON_Y);
  ctx.save();
  ctx.shadowColor = "#00d4ff";
  ctx.shadowBlur = 12;
  ctx.strokeStyle = "#00d4ff";
  ctx.lineWidth = 2;
  // Outer edges
  ctx.beginPath();
  ctx.moveTo(VANISH_X, HORIZON_Y);
  ctx.lineTo(20, CANVAS_H);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(VANISH_X, HORIZON_Y);
  ctx.lineTo(CANVAS_W - 20, CANVAS_H);
  ctx.stroke();
  // Lane dividers
  const bXs = [130, 215, 300];
  const hXs = [VANISH_X - 52, VANISH_X - 18, VANISH_X + 18];
  ctx.setLineDash([14, 10]);
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(hXs[i], HORIZON_Y);
    ctx.lineTo(bXs[i], CANVAS_H);
    ctx.stroke();
  }
  ctx.setLineDash([]);
  // Horizontal grid lines
  ctx.lineWidth = 0.7;
  for (let i = 0; i < 18; i++) {
    const t = (i / 18 + gridOffset) % 1;
    const p = t * t;
    const y = HORIZON_Y + p * (CANVAS_H - HORIZON_Y);
    const xL = VANISH_X + (20 - VANISH_X) * p;
    const xR = VANISH_X + (CANVAS_W - 20 - VANISH_X) * p;
    ctx.beginPath();
    ctx.moveTo(xL, y);
    ctx.lineTo(xR, y);
    ctx.stroke();
  }
  ctx.restore();
}

type SkinDef = (typeof SKINS)[0];

function drawCar(
  ctx: Ctx2D,
  x: number,
  y: number,
  skin: SkinDef,
  invincible: boolean,
  boostActive: boolean,
  frame: number,
) {
  const wBack = 36; // width at bottom (near player)
  const wFront = 22; // width at top (far/vanishing side)
  const h = 60;
  const top = y - h / 2;
  const bot = y + h / 2;
  const leftBack = x - wBack / 2;
  const rightBack = x + wBack / 2;
  const leftFront = x - wFront / 2;
  const rightFront = x + wFront / 2;

  ctx.save();
  if (invincible && Math.floor(frame / 5) % 2 === 0) ctx.globalAlpha = 0.35;

  // Boost trail (tapered)
  if (boostActive) {
    for (let t = 0; t < 7; t++) {
      const alpha = ((7 - t) / 7) * 0.45;
      const ty = bot + t * 11;
      const tw = wBack - t * 3;
      const grad = ctx.createLinearGradient(x, ty - 8, x, ty + 10);
      grad.addColorStop(0, `rgba(0,255,255,${alpha})`);
      grad.addColorStop(1, "rgba(255,0,170,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(x - tw / 2 + 2, ty - 6, Math.max(tw - 4, 4), 14);
    }
  }

  // Car body — trapezoid (wider at back/bottom)
  ctx.shadowColor = skin.glowColor;
  ctx.shadowBlur = 22;
  ctx.fillStyle = skin.color;
  ctx.beginPath();
  ctx.moveTo(leftBack, bot); // bottom-left  (wide)
  ctx.lineTo(rightBack, bot); // bottom-right (wide)
  ctx.lineTo(rightFront, top); // top-right    (narrow)
  ctx.lineTo(leftFront, top); // top-left     (narrow)
  ctx.closePath();
  ctx.fill();

  // Windshield
  const wWin = wFront - 4;
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(0,0,0,0.65)";
  ctx.beginPath();
  ctx.moveTo(x - wWin / 2, top + 4);
  ctx.lineTo(x + wWin / 2, top + 4);
  ctx.lineTo(x + wWin / 2 + 2, top + 16);
  ctx.lineTo(x - wWin / 2 - 2, top + 16);
  ctx.closePath();
  ctx.fill();

  // Side windows (mid section)
  const midW = (wBack + wFront) / 2;
  ctx.fillRect(x - midW / 2 + 1, top + 20, 5, 9);
  ctx.fillRect(x + midW / 2 - 6, top + 20, 5, 9);

  // Tail lights (at back/bottom)
  ctx.shadowColor = "#ff0000";
  ctx.shadowBlur = 14;
  ctx.fillStyle = "#ff1a00";
  ctx.fillRect(leftBack + 1, bot - 10, 7, 5);
  ctx.fillRect(rightBack - 8, bot - 10, 7, 5);

  // Accent strip at back
  ctx.shadowColor = skin.glowColor;
  ctx.shadowBlur = 20;
  ctx.fillStyle = skin.glowColor;
  ctx.fillRect(leftBack + 1, bot - 2, wBack - 2, 3);

  ctx.restore();
}

function drawObstacle(ctx: Ctx2D, ob: Obstacle) {
  const w = 34;
  const h = 56;
  ctx.save();
  ctx.shadowColor = "#ff0033";
  ctx.shadowBlur = 10;
  ctx.fillStyle = "#1a0010";
  ctx.beginPath();
  ctx.roundRect(ob.x - w / 2, ob.y - h / 2, w, h, 4);
  ctx.fill();
  ctx.strokeStyle = "#660011";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = "#ff2200";
  ctx.shadowColor = "#ff2200";
  ctx.shadowBlur = 16;
  ctx.fillRect(ob.x - w / 2 + 3, ob.y + h / 2 - 11, 7, 5);
  ctx.fillRect(ob.x + w / 2 - 10, ob.y + h / 2 - 11, 7, 5);
  ctx.restore();
}

function drawBoost(ctx: Ctx2D, b: Boost, frame: number) {
  const pulse = Math.sin(frame * 0.12) * 4;
  ctx.save();
  ctx.shadowColor = "#00ffff";
  ctx.shadowBlur = 22 + pulse;
  ctx.beginPath();
  ctx.arc(b.x, b.y, 18 + pulse / 2, 0, Math.PI * 2);
  const grad = ctx.createRadialGradient(b.x, b.y, 2, b.x, b.y, 18 + pulse / 2);
  grad.addColorStop(0, "#ffffff");
  grad.addColorStop(0.4, "#00ffff");
  grad.addColorStop(1, "#ff00aa33");
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#1a0033";
  ctx.font = "bold 16px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("⚡", b.x, b.y);
  ctx.restore();
}

function drawHitFlash(ctx: Ctx2D, intensity: number) {
  if (intensity <= 0) return;
  ctx.save();
  ctx.fillStyle = `rgba(255,0,0,${intensity * 0.35})`;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.restore();
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function CyberDriftRacerGame({
  onExit,
}: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mutedRef = useRef(false);
  const screenRef = useRef<GameScreen>("idle");
  const activeSkinRef = useRef<SkinDef>(SKINS[0]);

  const playerId = localStorage.getItem("gamePlayerId") ?? "";
  const _playerName = localStorage.getItem("gamePlayerName") ?? "Unknown";

  const { mutate: submitScore } = useSubmitGameScore();
  const { data: topScores } = useTopScores("cyber-drift", 10);
  const { data: playerAchievements, refetch: refetchAchievements } =
    usePlayerAchievements(playerId);
  const { mutate: unlockAchievement } = useUnlockAchievement();
  const { data: playerSkins, refetch: refetchSkins } = usePlayerSkins(playerId);
  const { mutate: unlockSkin } = useUnlockSkin();
  const { mutate: equipSkin } = useEquipSkin();
  const { data: equippedSkin } = useEquippedSkin(playerId);

  const unlockedAchievementIds = new Set(
    (playerAchievements ?? []).map(
      (a: { achievementId: string }) => a.achievementId,
    ),
  );
  const unlockedSkinIds = new Set(
    (playerSkins ?? []).map((s: { skinId: string }) => s.skinId),
  );

  const [screen, setScreen] = useState<GameScreen>("idle");
  const [muted, setMuted] = useState(false);
  const [showGarage, setShowGarage] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [achievementPopup, setAchievementPopup] = useState<{
    name: string;
    desc: string;
  } | null>(null);
  const [hudScore, setHudScore] = useState(0);
  const [hudLives, setHudLives] = useState(3);
  const [hudCombo, setHudCombo] = useState(1);
  const [finalScore, setFinalScore] = useState(0);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const skin =
      SKINS.find((s) => s.id === (equippedSkin?.skinId ?? "default")) ??
      SKINS[0];
    activeSkinRef.current = skin;
  }, [equippedSkin]);

  // Auto-unlock free skins
  useEffect(() => {
    if (!playerId) return;
    for (const freeId of ["default", "neon_black"]) {
      if (!unlockedSkinIds.has(freeId)) {
        unlockSkin(
          { playerId, skinId: freeId },
          { onSuccess: () => refetchSkins() },
        );
      }
    }
  }, [playerId, unlockSkin, refetchSkins, unlockedSkinIds]);

  function makeInitialState(): GameState {
    const stars: Star[] = [];
    for (let i = 0; i < 60; i++) {
      stars.push({
        x: Math.random() * CANVAS_W,
        y: Math.random() * HORIZON_Y,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
      });
    }
    const bldColors = ["#9900ff", "#00ffff", "#ff00aa", "#6600cc"];
    const buildings: Building[] = [];
    for (let i = 0; i < 18; i++) {
      buildings.push({
        x: i * 28 - 40 + Math.random() * 10,
        w: 18 + Math.random() * 14,
        h: 22 + Math.random() * 52,
        color: bldColors[Math.floor(Math.random() * bldColors.length)],
      });
    }
    return {
      score: 0,
      lives: 3,
      combo: 0,
      speedMultiplier: 1,
      currentLane: 1,
      carX: LANE_CENTERS[1],
      targetX: LANE_CENTERS[1],
      obstacles: [],
      boosts: [],
      stars,
      buildings,
      frameCount: 0,
      invincible: false,
      invincibleTimer: 0,
      gridOffset: 0,
      boostActive: false,
      boostTimer: 0,
      boostCount: 0,
      surviveSeconds: 0,
      secondTimer: 0,
      hitFlash: 0,
      flawlessSeconds: 0,
      laneSwitched: false,
      nextBoostId: 0,
      highScore: 0,
    };
  }

  const gsRef = useRef<GameState>(makeInitialState());
  const earnedRef = useRef<Set<string>>(new Set());

  const showAchievementPopup = useCallback(
    (id: string) => {
      const def = ACHIEVEMENTS.find((a) => a.id === id);
      if (!def) return;
      if (audioCtxRef.current)
        playAchievementSound(audioCtxRef.current, mutedRef.current);
      setAchievementPopup({ name: def.name, desc: def.desc });
      setTimeout(() => setAchievementPopup(null), 4000);
      if (playerId)
        unlockAchievement(
          { playerId, achievementId: id },
          { onSuccess: () => refetchAchievements() },
        );
    },
    [playerId, unlockAchievement, refetchAchievements],
  );

  const checkAchievements = useCallback(
    (gs: GameState) => {
      const e = earnedRef.current;
      const has = (id: string) => unlockedAchievementIds.has(id) || e.has(id);
      const earn = (id: string, cond: boolean) => {
        if (cond && !has(id)) {
          e.add(id);
          showAchievementPopup(id);
          for (const skin of SKINS) {
            if (
              skin.unlockReq === id &&
              playerId &&
              !unlockedSkinIds.has(skin.id)
            ) {
              unlockSkin(
                { playerId, skinId: skin.id },
                { onSuccess: () => refetchSkins() },
              );
            }
          }
        }
      };
      // Also unlock skins gated on score thresholds (no popup needed)
      for (const [thresholdId, pts] of Object.entries(
        SCORE_UNLOCK_THRESHOLDS,
      )) {
        if (gs.score >= pts) {
          for (const skin of SKINS) {
            if (
              skin.unlockReq === thresholdId &&
              playerId &&
              !unlockedSkinIds.has(skin.id) &&
              !e.has(`skin_${skin.id}_unlocked`)
            ) {
              e.add(`skin_${skin.id}_unlocked`);
              unlockSkin(
                { playerId, skinId: skin.id },
                { onSuccess: () => refetchSkins() },
              );
            }
          }
        }
      }
      earn("first_drift", gs.laneSwitched);
      earn("survive_30", gs.surviveSeconds >= 30);
      earn("survive_60", gs.surviveSeconds >= 60);
      earn("boost_5", gs.boostCount >= 5);
      earn("boost_20", gs.boostCount >= 20);
      earn("combo_x3", gs.combo + 1 >= 3);
      earn("combo_x5", gs.combo + 1 >= 5);
      earn("score_500", gs.score >= 500);
      earn("score_2000", gs.score >= 2000);
      earn("flawless_30", gs.flawlessSeconds >= 30);
    },
    [
      showAchievementPopup,
      playerId,
      unlockSkin,
      refetchSkins,
      unlockedAchievementIds,
      unlockedSkinIds,
    ],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: game loop refs are stable
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (screenRef.current !== "playing") return;

    const gs = gsRef.current;
    gs.frameCount++;

    for (const s of gs.stars) {
      s.y += s.speed;
      if (s.y > HORIZON_Y) {
        s.y = 0;
        s.x = Math.random() * CANVAS_W;
      }
    }
    for (const b of gs.buildings) {
      b.x -= 0.35;
      if (b.x + b.w < -10) b.x = CANVAS_W + 10;
    }
    gs.gridOffset += 3 * gs.speedMultiplier * 0.003;
    if (gs.gridOffset >= 1) gs.gridOffset -= 1;
    gs.carX += (gs.targetX - gs.carX) * 0.14;

    gs.secondTimer++;
    if (gs.secondTimer >= 60) {
      gs.secondTimer = 0;
      gs.surviveSeconds++;
      gs.flawlessSeconds++;
      if (gs.surviveSeconds % 15 === 0)
        gs.speedMultiplier = Math.min(gs.speedMultiplier + 0.15, 3.2);
    }
    if (gs.invincible) {
      gs.invincibleTimer--;
      if (gs.invincibleTimer <= 0) gs.invincible = false;
    }
    if (gs.hitFlash > 0) gs.hitFlash -= 0.05;
    if (gs.boostActive) {
      gs.boostTimer--;
      if (gs.boostTimer <= 0) gs.boostActive = false;
    }

    const multiplier = Math.min(gs.combo + 1, 5);
    gs.score += 0.1 * multiplier;
    const speed = 3 * gs.speedMultiplier;

    if (
      gs.frameCount % Math.max(1, Math.floor(80 + Math.random() * 40)) ===
      0
    ) {
      gs.obstacles.push({
        x: LANE_CENTERS[Math.floor(Math.random() * 4)],
        y: 250,
        lane: Math.floor(Math.random() * 4),
      });
    }
    if (
      gs.frameCount % Math.max(1, Math.floor(100 + Math.random() * 50)) ===
      0
    ) {
      gs.boosts.push({
        x: LANE_CENTERS[Math.floor(Math.random() * 4)],
        y: 250,
        lane: Math.floor(Math.random() * 4),
        id: gs.nextBoostId++,
      });
    }

    let gameEnded = false;
    gs.obstacles = gs.obstacles.filter((o) => {
      o.y += speed;
      if (
        !gs.invincible &&
        Math.abs(o.x - gs.carX) < 30 &&
        Math.abs(o.y - 580) < 40
      ) {
        gs.lives--;
        gs.combo = 0;
        gs.invincible = true;
        gs.invincibleTimer = 120;
        gs.hitFlash = 1;
        gs.flawlessSeconds = 0;
        if (audioCtxRef.current)
          playCollisionSound(audioCtxRef.current, mutedRef.current);
        setHudLives(gs.lives);
        setHudCombo(1);
        if (gs.lives <= 0) {
          gameEnded = true;
          screenRef.current = "gameover";
          setScreen("gameover");
          audioRef.current?.pause();
          const s = Math.floor(gs.score);
          if (s > gs.highScore) gs.highScore = s;
          setFinalScore(s);
          setHighScore(gs.highScore);
          setScoreSubmitted(false);
          if (audioCtxRef.current)
            playGameOverSound(audioCtxRef.current, mutedRef.current);
          return false;
        }
        return false;
      }
      return o.y < CANVAS_H + 60;
    });

    if (!gameEnded) {
      gs.boosts = gs.boosts.filter((b) => {
        b.y += speed;
        if (Math.abs(b.x - gs.carX) < 35 && Math.abs(b.y - 580) < 45) {
          gs.score += 50 * multiplier;
          gs.combo++;
          gs.boostActive = true;
          gs.boostTimer = 90;
          gs.boostCount++;
          if (audioCtxRef.current)
            playBoostSound(audioCtxRef.current, mutedRef.current);
          setHudCombo(Math.min(gs.combo + 1, 5));
          checkAchievements(gs);
          return false;
        }
        return b.y < CANVAS_H + 60;
      });

      setHudScore(Math.floor(gs.score));
      checkAchievements(gs);

      ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
      drawSky(ctx);
      drawStars(ctx, gs.stars, gs.frameCount);
      drawBuildings(ctx, gs.buildings);
      drawRoad(ctx, gs.gridOffset);
      for (const o of gs.obstacles) drawObstacle(ctx, o);
      for (const b of gs.boosts) drawBoost(ctx, b, gs.frameCount);
      drawCar(
        ctx,
        gs.carX,
        580,
        activeSkinRef.current,
        gs.invincible,
        gs.boostActive,
        gs.frameCount,
      );
      drawHitFlash(ctx, gs.hitFlash);

      rafRef.current = requestAnimationFrame(gameLoop);
    }
  }, [checkAchievements, submitScore]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: startGame refs are stable
  const startGame = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = getAudioCtx();
    earnedRef.current = new Set(unlockedAchievementIds);
    gsRef.current = makeInitialState();
    setHudScore(0);
    setHudLives(3);
    setHudCombo(1);
    screenRef.current = "playing";
    setScreen("playing");
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(gameLoop);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [gameLoop, unlockedAchievementIds]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (screenRef.current !== "playing") return;
      const gs = gsRef.current;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        const nl = Math.max(0, gs.currentLane - 1);
        if (nl !== gs.currentLane) {
          gs.currentLane = nl;
          gs.targetX = LANE_CENTERS[nl];
          gs.laneSwitched = true;
        }
      }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        const nl = Math.min(3, gs.currentLane + 1);
        if (nl !== gs.currentLane) {
          gs.currentLane = nl;
          gs.targetX = LANE_CENTERS[nl];
          gs.laneSwitched = true;
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(
    () => () => {
      cancelAnimationFrame(rafRef.current);
      audioRef.current?.pause();
    },
    [],
  );

  function drift(dir: "left" | "right") {
    if (screenRef.current !== "playing") return;
    const gs = gsRef.current;
    const nl =
      dir === "left"
        ? Math.max(0, gs.currentLane - 1)
        : Math.min(3, gs.currentLane + 1);
    if (nl !== gs.currentLane) {
      gs.currentLane = nl;
      gs.targetX = LANE_CENTERS[nl];
      gs.laneSwitched = true;
    }
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    mutedRef.current = next;
    if (audioRef.current) audioRef.current.volume = next ? 0 : 1;
  }

  function pauseForPanel() {
    if (screenRef.current === "playing") {
      screenRef.current = "paused";
      setScreen("paused");
      cancelAnimationFrame(rafRef.current);
      audioRef.current?.pause();
    }
  }

  function resumeFromPanel() {
    if (screenRef.current === "paused") {
      screenRef.current = "playing";
      setScreen("playing");
      rafRef.current = requestAnimationFrame(gameLoop);
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
    }
  }

  const handleSubmitScore = useCallback(() => {
    submitScore(
      {
        playerId: playerId || "anonymous",
        gameId: "cyber-drift",
        score: finalScore,
        kills: 0,
        waves: 0,
      },
      { onSuccess: () => setScoreSubmitted(true) },
    );
  }, [submitScore, playerId, finalScore]);

  const isActive = screen === "playing" || screen === "paused";

  return (
    <div
      className="flex flex-col items-center"
      style={{ fontFamily: "'Orbitron','Share Tech Mono',monospace" }}
    >
      {/* biome-ignore lint/a11y/useMediaCaption: background music, no dialogue */}
      <audio
        ref={audioRef}
        src="/assets/audio/cyber-drift-music.mp3"
        loop
        preload="auto"
      />
      <div
        className="relative"
        style={{ width: CANVAS_W, maxWidth: "100%", userSelect: "none" }}
      >
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          tabIndex={0}
          style={{
            display: "block",
            maxWidth: "100%",
            background: "#1a0033",
            borderRadius: 14,
            border: "2px solid #9900ff",
            boxShadow: "0 0 40px #ff00aa55, 0 0 80px #9900ff33",
          }}
        />

        {screen === "idle" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              background: "linear-gradient(180deg,#1a003399,#0d001a99)",
              borderRadius: 14,
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: 6,
                  color: "#ff00aa",
                  marginBottom: 8,
                  textTransform: "uppercase",
                }}
              >
                NEXUS ARENA
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  color: "#00ffff",
                  textShadow: "0 0 20px #00ffff, 0 0 40px #ff00aa",
                  marginBottom: 6,
                  letterSpacing: 2,
                }}
              >
                CYBER DRIFT RACER
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#cc88ff",
                  marginBottom: 32,
                  letterSpacing: 1,
                }}
              >
                Neon roads. Zero mercy.
              </div>
              <div
                style={{ fontSize: 10, color: "#ffffff77", marginBottom: 24 }}
              >
                ← → Arrow keys · A D to change lanes
              </div>
              <button
                type="button"
                data-ocid="cyber_drift.play_button"
                onClick={startGame}
                style={{
                  background: "linear-gradient(135deg,#ff00aa,#9900ff)",
                  border: "none",
                  color: "#fff",
                  padding: "14px 48px",
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: 3,
                  borderRadius: 6,
                  cursor: "pointer",
                  boxShadow: "0 0 30px #ff00aa88",
                  textTransform: "uppercase",
                }}
              >
                ▶ PLAY
              </button>
            </div>
          </div>
        )}

        {screen === "gameover" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ background: "rgba(8,0,18,0.9)", borderRadius: 14 }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 900,
                  color: "#ff0055",
                  textShadow: "0 0 20px #ff0055",
                  marginBottom: 6,
                  letterSpacing: 2,
                }}
              >
                GAME OVER
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#ff00aa",
                  marginBottom: 4,
                  letterSpacing: 3,
                }}
              >
                SCORE
              </div>
              <div
                style={{
                  fontSize: 52,
                  fontWeight: 900,
                  color: "#00ffff",
                  textShadow: "0 0 24px #00ffff",
                  marginBottom: 4,
                }}
              >
                {finalScore.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: "#cc88ff", marginBottom: 36 }}>
                BEST: {highScore.toLocaleString()}
              </div>
              <div style={{ marginBottom: 18 }}>
                {scoreSubmitted ? (
                  <div
                    data-ocid="cyber_drift.score_submitted_label"
                    style={{
                      fontSize: 11,
                      color: "#00ffcc",
                      letterSpacing: 2,
                      padding: "10px 0",
                      textShadow: "0 0 8px #00ffcc",
                    }}
                  >
                    ✓ SCORE SUBMITTED!
                  </div>
                ) : (
                  <button
                    type="button"
                    data-ocid="cyber_drift.submit_score_button"
                    onClick={handleSubmitScore}
                    style={{
                      background: "linear-gradient(135deg,#00ffcc22,#00aaff22)",
                      border: "1px solid #00ffcc",
                      color: "#00ffcc",
                      padding: "10px 32px",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 3,
                      borderRadius: 6,
                      cursor: "pointer",
                      boxShadow: "0 0 18px #00ffcc44",
                    }}
                  >
                    SUBMIT SCORE
                  </button>
                )}
              </div>
              <div
                style={{ display: "flex", gap: 14, justifyContent: "center" }}
              >
                <button
                  type="button"
                  data-ocid="cyber_drift.play_again_button"
                  onClick={startGame}
                  style={{
                    background: "linear-gradient(135deg,#ff00aa,#9900ff)",
                    border: "none",
                    color: "#fff",
                    padding: "12px 34px",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 2,
                    borderRadius: 6,
                    cursor: "pointer",
                    boxShadow: "0 0 22px #ff00aa55",
                  }}
                >
                  PLAY AGAIN
                </button>
                <button
                  type="button"
                  data-ocid="cyber_drift.exit_button"
                  onClick={onExit}
                  style={{
                    background: "transparent",
                    border: "1px solid #9900ff",
                    color: "#cc88ff",
                    padding: "12px 24px",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 2,
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  EXIT
                </button>
              </div>
            </div>
          </div>
        )}

        {isActive && (
          <>
            <div
              className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-2"
              style={{
                background:
                  "linear-gradient(180deg,rgba(0,0,0,0.72),transparent)",
                borderRadius: "14px 14px 0 0",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 8,
                    color: "#ff00aa",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  Score
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 900,
                    color: "#00ffff",
                    textShadow: "0 0 10px #00ffff",
                  }}
                >
                  {hudScore.toLocaleString()}
                </div>
              </div>
              <div style={{ display: "flex", gap: 5, fontSize: 17 }}>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      opacity: i < hudLives ? 1 : 0.18,
                      filter:
                        i < hudLives ? "drop-shadow(0 0 4px #ff0055)" : "none",
                    }}
                  >
                    ❤️
                  </span>
                ))}
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 8,
                    color: "#ff00aa",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  Combo
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 900,
                    color: hudCombo >= 5 ? "#ffd700" : "#ff00aa",
                    textShadow: `0 0 10px ${hudCombo >= 5 ? "#ffd700" : "#ff00aa"}`,
                  }}
                >
                  x{hudCombo}
                </div>
              </div>
            </div>

            <div
              className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2"
              style={{
                background:
                  "linear-gradient(0deg,rgba(0,0,0,0.75),transparent)",
                borderRadius: "0 0 14px 14px",
              }}
            >
              <div style={{ display: "flex", gap: 7 }}>
                <button
                  type="button"
                  data-ocid="cyber_drift.lane_left_button"
                  onPointerDown={() => drift("left")}
                  style={{
                    background: "rgba(0,212,255,0.14)",
                    border: "1px solid #00d4ff",
                    color: "#00d4ff",
                    width: 42,
                    height: 38,
                    fontSize: 17,
                    borderRadius: 7,
                    cursor: "pointer",
                  }}
                >
                  ◀
                </button>
                <button
                  type="button"
                  data-ocid="cyber_drift.lane_right_button"
                  onPointerDown={() => drift("right")}
                  style={{
                    background: "rgba(0,212,255,0.14)",
                    border: "1px solid #00d4ff",
                    color: "#00d4ff",
                    width: 42,
                    height: 38,
                    fontSize: 17,
                    borderRadius: 7,
                    cursor: "pointer",
                  }}
                >
                  ▶
                </button>
              </div>
              <div style={{ display: "flex", gap: 7 }}>
                <button
                  type="button"
                  data-ocid="cyber_drift.garage_button"
                  onClick={() => {
                    pauseForPanel();
                    setShowGarage(true);
                  }}
                  style={{
                    background: "rgba(153,0,255,0.18)",
                    border: "1px solid #9900ff",
                    color: "#cc88ff",
                    padding: "6px 10px",
                    fontSize: 10,
                    letterSpacing: 1,
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  🚗 GARAGE
                </button>
                <button
                  type="button"
                  data-ocid="cyber_drift.achievements_button"
                  onClick={() => {
                    pauseForPanel();
                    setShowAchievements(true);
                  }}
                  style={{
                    background: "rgba(255,215,0,0.1)",
                    border: "1px solid #ffd700",
                    color: "#ffd700",
                    padding: "6px 10px",
                    fontSize: 10,
                    letterSpacing: 1,
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  🏆 ACHIEVEMENTS
                </button>
                <button
                  type="button"
                  data-ocid="cyber_drift.mute_button"
                  onClick={toggleMute}
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid #555",
                    color: "#aaa",
                    width: 36,
                    height: 32,
                    fontSize: 14,
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  {muted ? "🔇" : "🔊"}
                </button>
              </div>
            </div>
          </>
        )}

        {achievementPopup && (
          <div
            style={{
              position: "absolute",
              top: 52,
              left: "50%",
              transform: "translateX(-50%)",
              width: 265,
              background:
                "linear-gradient(135deg,rgba(26,0,51,0.96),rgba(13,0,26,0.96))",
              border: "1px solid #ffd700",
              borderRadius: 10,
              padding: "12px 18px",
              textAlign: "center",
              boxShadow: "0 0 30px #ffd70066, 0 0 60px #ff00aa33",
              zIndex: 20,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: "#ff00aa",
                letterSpacing: 3,
                marginBottom: 4,
              }}
            >
              ACHIEVEMENT UNLOCKED
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 900,
                color: "#ffd700",
                textShadow: "0 0 10px #ffd700",
                marginBottom: 3,
              }}
            >
              {achievementPopup.name}
            </div>
            <div style={{ fontSize: 10, color: "#cc88ff" }}>
              {achievementPopup.desc}
            </div>
          </div>
        )}
      </div>

      <div
        className="flex items-center gap-3 mt-3 w-full justify-between"
        style={{ maxWidth: CANVAS_W, padding: "0 2px" }}
      >
        <button
          type="button"
          data-ocid="cyber_drift.leaderboard_toggle"
          onClick={() => setShowLeaderboard((v) => !v)}
          style={{
            background: "rgba(0,212,255,0.08)",
            border: "1px solid #00d4ff",
            color: "#00d4ff",
            padding: "7px 16px",
            fontSize: 10,
            letterSpacing: 2,
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          {showLeaderboard ? "▲ HIDE" : "▼ LEADERBOARD"}
        </button>
        <button
          type="button"
          data-ocid="cyber_drift.exit_to_hub_button"
          onClick={onExit}
          style={{
            background: "transparent",
            border: "1px solid #ff00aa",
            color: "#ff00aa",
            padding: "7px 16px",
            fontSize: 10,
            letterSpacing: 2,
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          EXIT HUB
        </button>
      </div>

      {showLeaderboard && (
        <div
          style={{
            width: CANVAS_W,
            maxWidth: "100%",
            marginTop: 12,
            background: "linear-gradient(135deg,#0d001a,#1a0033)",
            border: "1px solid #00d4ff",
            borderRadius: 12,
            padding: 20,
            boxShadow: "0 0 30px #00d4ff22",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 900,
              color: "#00d4ff",
              letterSpacing: 5,
              marginBottom: 14,
              textAlign: "center",
            }}
          >
            TOP 10 — CYBER DRIFT
          </div>
          {(!topScores || topScores.length === 0) && (
            <div
              data-ocid="cyber_drift.leaderboard_empty"
              style={{
                textAlign: "center",
                color: "#ffffff33",
                fontSize: 11,
                padding: "12px 0",
              }}
            >
              No scores yet — be the first!
            </div>
          )}
          {(topScores ?? []).slice(0, 10).map((entry, i: number) => (
            <div
              key={entry.scoreId}
              data-ocid={`cyber_drift.leaderboard.item.${i + 1}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 12px",
                marginBottom: 4,
                borderRadius: 6,
                background:
                  entry.playerId === playerId
                    ? "rgba(0,212,255,0.1)"
                    : "transparent",
                border:
                  entry.playerId === playerId
                    ? "1px solid #00d4ff44"
                    : "1px solid transparent",
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color:
                    i === 0
                      ? "#ffd700"
                      : i === 1
                        ? "#aaaaaa"
                        : i === 2
                          ? "#cc8844"
                          : "#444",
                  minWidth: 24,
                  textAlign: "center",
                }}
              >
                #{i + 1}
              </span>
              <span
                style={{
                  flex: 1,
                  fontSize: 11,
                  color: "#cc88ff",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {entry.playerId}
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#00ffff",
                  textShadow: "0 0 8px #00ffff",
                }}
              >
                {Number(entry.score).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {showGarage && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backdropFilter: "blur(14px)",
            background: "rgba(8,0,18,0.72)",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg,#1a0033f0,#0d001af0)",
              border: "1px solid #9900ff",
              borderRadius: 14,
              padding: 24,
              width: 460,
              maxWidth: "95vw",
              maxHeight: "88vh",
              overflowY: "auto",
              boxShadow: "0 0 60px #9900ff44",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: "#cc88ff",
                  letterSpacing: 3,
                }}
              >
                🚗 GARAGE
              </span>
              <button
                type="button"
                data-ocid="cyber_drift.close_garage_button"
                onClick={() => {
                  setShowGarage(false);
                  resumeFromPanel();
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#cc88ff",
                  fontSize: 22,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 10,
              }}
            >
              {SKINS.map((skin) => {
                const isUnlocked =
                  skin.unlockReq === null || unlockedSkinIds.has(skin.id);
                const isEquipped =
                  (equippedSkin?.skinId ?? "default") === skin.id;
                // Find unlock label
                const unlockLabel = skin.unlockReq
                  ? (ACHIEVEMENTS.find((a) => a.id === skin.unlockReq)?.name ??
                    (SCORE_UNLOCK_THRESHOLDS[skin.unlockReq]
                      ? `${SCORE_UNLOCK_THRESHOLDS[skin.unlockReq].toLocaleString()} pts`
                      : skin.unlockReq))
                  : null;
                return (
                  <div
                    key={skin.id}
                    data-ocid={`cyber_drift.skin_card.${skin.id}`}
                    style={{
                      border: `1px solid ${
                        isEquipped ? skin.glowColor : "#33003355"
                      }`,
                      borderRadius: 10,
                      padding: 10,
                      background: isEquipped
                        ? `${skin.glowColor}11`
                        : "#0a001580",
                      textAlign: "center",
                      opacity: isUnlocked ? 1 : 0.55,
                    }}
                  >
                    {/* Mini car preview — trapezoid */}
                    <div
                      style={{
                        margin: "0 auto 8px",
                        width: 28,
                        height: 44,
                        position: "relative",
                      }}
                    >
                      <svg
                        viewBox="0 0 28 44"
                        width="28"
                        height="44"
                        role="img"
                        aria-label={`${skin.name} car preview`}
                      >
                        <polygon
                          points="2,44 26,44 22,0 6,0"
                          fill={isUnlocked ? skin.color : "#333"}
                          style={{
                            filter: isUnlocked
                              ? `drop-shadow(0 0 6px ${skin.glowColor})`
                              : "none",
                          }}
                        />
                        <rect
                          x="7"
                          y="3"
                          width="14"
                          height="9"
                          rx="1"
                          fill="rgba(0,0,0,0.6)"
                        />
                        <rect
                          x="3"
                          y="36"
                          width="6"
                          height="4"
                          fill="#ff1a00"
                          opacity={isUnlocked ? 1 : 0}
                        />
                        <rect
                          x="19"
                          y="36"
                          width="6"
                          height="4"
                          fill="#ff1a00"
                          opacity={isUnlocked ? 1 : 0}
                        />
                      </svg>
                    </div>
                    <div
                      style={{
                        fontSize: 8,
                        fontWeight: 900,
                        color: isUnlocked ? skin.color : "#666",
                        textShadow: isUnlocked
                          ? `0 0 6px ${skin.color}`
                          : "none",
                        marginBottom: 2,
                        lineHeight: 1.2,
                      }}
                    >
                      {skin.name}
                    </div>
                    <div
                      style={{
                        fontSize: 7,
                        color: RARITY_COLOR[skin.rarity],
                        marginBottom: 6,
                        letterSpacing: 1,
                        textTransform: "uppercase",
                      }}
                    >
                      {skin.rarity}
                    </div>
                    {!isUnlocked && unlockLabel && (
                      <div
                        style={{
                          fontSize: 7,
                          color: "#ffffff44",
                          marginBottom: 6,
                          lineHeight: 1.3,
                        }}
                      >
                        🔒 {unlockLabel}
                      </div>
                    )}
                    {isEquipped ? (
                      <div
                        style={{
                          fontSize: 7,
                          color: skin.glowColor,
                          letterSpacing: 1,
                        }}
                      >
                        ✓ EQUIPPED
                      </div>
                    ) : isUnlocked ? (
                      <button
                        type="button"
                        data-ocid={`cyber_drift.equip_skin_button.${skin.id}`}
                        onClick={() => {
                          if (playerId) {
                            equipSkin(
                              { playerId, skinId: skin.id },
                              {
                                onSuccess: () => {
                                  const s =
                                    SKINS.find((sk) => sk.id === skin.id) ??
                                    SKINS[0];
                                  activeSkinRef.current = s;
                                },
                              },
                            );
                          }
                        }}
                        style={{
                          background: `${skin.glowColor}22`,
                          border: `1px solid ${skin.glowColor}`,
                          color: skin.color,
                          padding: "4px 10px",
                          fontSize: 8,
                          borderRadius: 4,
                          cursor: "pointer",
                          letterSpacing: 1,
                        }}
                      >
                        EQUIP
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showAchievements && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backdropFilter: "blur(14px)",
            background: "rgba(8,0,18,0.72)",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg,#1a0033f0,#0d001af0)",
              border: "1px solid #ffd700",
              borderRadius: 14,
              padding: 28,
              width: 420,
              maxWidth: "95vw",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 0 60px #ffd70022",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 900,
                  color: "#ffd700",
                  letterSpacing: 3,
                }}
              >
                🏆 ACHIEVEMENTS
              </span>
              <button
                type="button"
                data-ocid="cyber_drift.close_achievements_button"
                onClick={() => {
                  setShowAchievements(false);
                  resumeFromPanel();
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#ffd700",
                  fontSize: 22,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {ACHIEVEMENTS.map((ach) => {
                const earned = unlockedAchievementIds.has(ach.id);
                return (
                  <div
                    key={ach.id}
                    data-ocid={`cyber_drift.achievement.${ach.id}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "10px 14px",
                      borderRadius: 8,
                      background: earned
                        ? "rgba(255,215,0,0.08)"
                        : "rgba(255,255,255,0.025)",
                      border: `1px solid ${earned ? "#ffd70055" : "#33003355"}`,
                      opacity: earned ? 1 : 0.55,
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{earned ? "🏅" : "🔒"}</span>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: earned ? "#ffd700" : "#888",
                          marginBottom: 2,
                        }}
                      >
                        {ach.name}
                      </div>
                      <div
                        style={{
                          fontSize: 9,
                          color: earned ? "#cc88ff" : "#555",
                        }}
                      >
                        {ach.desc}
                      </div>
                    </div>
                    {earned && (
                      <span
                        style={{
                          fontSize: 9,
                          color: "#00ffcc",
                          letterSpacing: 1,
                        }}
                      >
                        EARNED
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
