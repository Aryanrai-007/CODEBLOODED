import { useGamePlayers } from "@/hooks/useAdminGames";
import { useGameAuth } from "@/hooks/useGameAuth";
import {
  usePlayerRank,
  useSubmitGameScore,
  useTopScores,
} from "@/hooks/useGameScores";

import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Heart, Trophy, X, Zap } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const GAME_ID = "space-shooter";

type WeaponType = "single" | "triple" | "homing" | "plasma" | "electric";
type EnemyType = "fighter" | "kamikaze" | "tank" | "stealth" | "drone" | "boss";
type PowerUpType = "health" | "shield" | "rapidfire" | "multiplier" | "weapon";

interface Vec2 {
  x: number;
  y: number;
}
interface Bullet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: "player" | "enemy";
  color: string;
  w: number;
  h: number;
  dmg: number;
  targetId?: number;
  life?: number;
}
interface Enemy {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  hp: number;
  maxHp: number;
  speed: number;
  type: EnemyType;
  color: string;
  fireTimer: number;
  xDir: number;
  stealthAlpha: number;
  stealthTimer: number;
  sineAngle: number;
  baseX: number;
}
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}
interface PowerUp {
  id: number;
  x: number;
  y: number;
  vy: number;
  type: PowerUpType;
  weaponType?: WeaponType;
}
interface Star {
  x: number;
  y: number;
  vy: number;
  size: number;
}
interface FloatText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  vy: number;
}

interface GState {
  player: Vec2;
  invTimer: number;
  lives: number;
  shield: boolean;
  shieldTimer: number;
  rapidFire: boolean;
  rapidFireTimer: number;
  multiplier: boolean;
  multiplierTimer: number;
  weapon: WeaponType;
  weaponTimer: number;
  bullets: Bullet[];
  enemies: Enemy[];
  particles: Particle[];
  powerUps: PowerUp[];
  floatTexts: FloatText[];
  stars1: Star[];
  stars2: Star[];
  stars3: Star[];
  score: number;
  kills: number;
  xp: number;
  level: number;
  xpToNext: number;
  levelUpAnim: number;
  coins: number;
  wave: number;
  waveEnemiesLeft: number;
  waveDelay: number;
  bossAlive: boolean;
  combo: number;
  comboTimer: number;
  screenShake: number;
  shootTimer: number;
  idCounter: number;
  gameOver: boolean;
}

const W = 480;
const H = 680;
const PLAYER_W = 28;
const PLAYER_H = 40;
const XP_PER_LEVEL = 100;

const WEAPON_COLORS: Record<WeaponType, string> = {
  single: "#06b6d4",
  triple: "#a855f7",
  homing: "#ec4899",
  plasma: "#f97316",
  electric: "#fbbf24",
};
const WEAPON_NAMES: Record<WeaponType, string> = {
  single: "LASER",
  triple: "TRIPLE",
  homing: "HOMING",
  plasma: "PLASMA",
  electric: "CHAIN",
};
const POWERUP_COLORS: Record<PowerUpType, string> = {
  health: "#22c55e",
  shield: "#06b6d4",
  rapidfire: "#f59e0b",
  multiplier: "#ec4899",
  weapon: "#a855f7",
};
const POWERUP_ICONS: Record<PowerUpType, string> = {
  health: "♥",
  shield: "⬡",
  rapidfire: "⚡",
  multiplier: "×2",
  weapon: "▲",
};
const WEAPON_DROPS: WeaponType[] = ["triple", "homing", "plasma", "electric"];
const HEART_KEYS = ["h0", "h1", "h2"] as const;

function mkStars(n: number, minV: number, maxV: number): Star[] {
  return Array.from({ length: n }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vy: minV + Math.random() * (maxV - minV),
    size: Math.random() * 1.5 + 0.3,
  }));
}

function initState(): GState {
  return {
    player: { x: W / 2, y: H - 80 },
    invTimer: 0,
    lives: 3,
    shield: false,
    shieldTimer: 0,
    rapidFire: false,
    rapidFireTimer: 0,
    multiplier: false,
    multiplierTimer: 0,
    weapon: "single",
    weaponTimer: 0,
    bullets: [],
    enemies: [],
    particles: [],
    powerUps: [],
    floatTexts: [],
    stars1: mkStars(40, 0.3, 0.7),
    stars2: mkStars(30, 1.2, 1.8),
    stars3: mkStars(20, 2.5, 3.5),
    score: 0,
    kills: 0,
    xp: 0,
    level: 1,
    xpToNext: XP_PER_LEVEL,
    levelUpAnim: 0,
    coins: 0,
    wave: 1,
    waveEnemiesLeft: 0,
    waveDelay: 0,
    bossAlive: false,
    combo: 0,
    comboTimer: 0,
    screenShake: 0,
    shootTimer: 0,
    idCounter: 0,
    gameOver: false,
  };
}

function nextId(g: GState): number {
  return ++g.idCounter;
}

function spawnWave(g: GState) {
  const isBoss = g.wave % 5 === 0;
  if (isBoss) {
    const hp = 200 + g.wave * 40;
    g.enemies.push({
      id: nextId(g),
      x: W / 2,
      y: -70,
      w: 100,
      h: 60,
      hp,
      maxHp: hp,
      speed: 0.8 + g.wave * 0.02,
      type: "boss",
      color: "#f43f5e",
      fireTimer: 50,
      xDir: 1,
      stealthAlpha: 1,
      stealthTimer: 9999,
      sineAngle: 0,
      baseX: W / 2,
    });
    g.bossAlive = true;
    g.waveEnemiesLeft = 1;
  } else {
    const count = Math.min(8 + (g.wave - 1) * 2, 20);
    const speedMul = 1 + (g.wave - 1) * 0.1;
    for (let i = 0; i < count; i++) {
      const r = Math.random();
      let type: EnemyType;
      if (g.wave <= 1) type = "fighter";
      else if (r < 0.18) type = "kamikaze";
      else if (r < 0.32) type = "tank";
      else if (r < 0.46) type = "stealth";
      else if (r < 0.6) type = "drone";
      else type = "fighter";
      const dims: Record<EnemyType, [number, number]> = {
        fighter: [26, 20],
        kamikaze: [20, 16],
        tank: [40, 30],
        stealth: [24, 18],
        drone: [22, 22],
        boss: [100, 60],
      };
      const hpMap: Record<EnemyType, number> = {
        fighter: 10,
        kamikaze: 6,
        tank: 30,
        stealth: 10,
        drone: 15,
        boss: 0,
      };
      const spMap: Record<EnemyType, number> = {
        fighter: 1.1,
        kamikaze: 3.0,
        tank: 0.5,
        stealth: 1.6,
        drone: 0.9,
        boss: 0,
      };
      const colMap: Record<EnemyType, string> = {
        fighter: "#06b6d4",
        kamikaze: "#f97316",
        tank: "#ef4444",
        stealth: "#8b5cf6",
        drone: "#ec4899",
        boss: "#f43f5e",
      };
      const [w, h] = dims[type];
      const bx = 40 + Math.random() * (W - 80);
      g.enemies.push({
        id: nextId(g),
        x: bx,
        y: -35 - i * 45,
        w,
        h,
        hp: hpMap[type],
        maxHp: hpMap[type],
        speed: spMap[type] * speedMul,
        type,
        color: colMap[type],
        fireTimer: 80 + Math.random() * 80,
        xDir: Math.random() < 0.5 ? 1 : -1,
        stealthAlpha: 1,
        stealthTimer: type === "stealth" ? 60 + Math.random() * 60 : 9999,
        sineAngle: Math.random() * Math.PI * 2,
        baseX: bx,
      });
    }
    g.waveEnemiesLeft = count;
    g.bossAlive = false;
  }
}

function addParticles(g: GState, x: number, y: number, color: string, n = 14) {
  for (let i = 0; i < n; i++) {
    const a = (Math.PI * 2 * i) / n + Math.random() * 0.5;
    const s = Math.random() * 3.5 + 0.8;
    g.particles.push({
      x,
      y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      life: 40 + Math.random() * 30,
      maxLife: 70,
      color,
      size: Math.random() * 4 + 1,
    });
  }
}

function addFloat(
  g: GState,
  x: number,
  y: number,
  text: string,
  color: string,
) {
  g.floatTexts.push({ x, y, text, color, life: 55, vy: -1.1 });
}

function overlap(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number,
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function nearestEnemy(g: GState, x: number, y: number): Enemy | null {
  let best: Enemy | null = null;
  let bestD = Number.POSITIVE_INFINITY;
  for (const e of g.enemies) {
    const d = Math.hypot(e.x - x, e.y - y);
    if (d < bestD) {
      bestD = d;
      best = e;
    }
  }
  return best;
}

function fireWeapon(g: GState) {
  const { x, y } = g.player;
  switch (g.weapon) {
    case "single":
      g.bullets.push({
        id: nextId(g),
        x,
        y: y - 24,
        vx: 0,
        vy: -11,
        type: "player",
        color: "#06b6d4",
        w: 4,
        h: 14,
        dmg: 10,
      });
      break;
    case "triple":
      for (let i = -1; i <= 1; i++)
        g.bullets.push({
          id: nextId(g),
          x: x + i * 12,
          y: y - 18,
          vx: i * 1.8,
          vy: -10.5,
          type: "player",
          color: "#a855f7",
          w: 4,
          h: 12,
          dmg: 8,
        });
      break;
    case "homing": {
      const t = nearestEnemy(g, x, y);
      const ang = t ? Math.atan2(t.y - y, t.x - x) : -Math.PI / 2;
      g.bullets.push({
        id: nextId(g),
        x,
        y: y - 20,
        vx: Math.cos(ang) * 9,
        vy: Math.sin(ang) * 9,
        type: "player",
        color: "#ec4899",
        w: 6,
        h: 6,
        dmg: 12,
        targetId: t?.id,
      });
      break;
    }
    case "plasma":
      g.bullets.push({
        id: nextId(g),
        x,
        y: y - 10,
        vx: 0,
        vy: -5,
        type: "player",
        color: "#f97316",
        w: 22,
        h: 8,
        dmg: 20,
        life: 12,
      });
      break;
    case "electric": {
      const te = nearestEnemy(g, x, y);
      g.bullets.push({
        id: nextId(g),
        x,
        y: y - 20,
        vx: te ? (te.x - x) / 20 : 0,
        vy: -10,
        type: "player",
        color: "#fbbf24",
        w: 5,
        h: 18,
        dmg: 8,
      });
      break;
    }
  }
}

export function SpaceShooterPage() {
  const navigate = useNavigate();
  const { currentPlayer } = useGameAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GState>(initState());
  const keysRef = useRef<Set<string>>(new Set());
  const rafRef = useRef<number>(0);
  const gameRunningRef = useRef<boolean>(false);
  const touchRef = useRef<{ left: boolean; right: boolean }>({
    left: false,
    right: false,
  });

  const [uiScore, setUiScore] = useState(0);
  const [uiWave, setUiWave] = useState(1);
  const [uiLives, setUiLives] = useState(3);
  const [uiCombo, setUiCombo] = useState(0);
  const [uiWeapon, setUiWeapon] = useState<WeaponType>("single");
  const [uiXp, setUiXp] = useState(0);
  const [uiLevel, setUiLevel] = useState(1);
  const [uiShield, setUiShield] = useState(false);
  const [showLb, setShowLb] = useState(false);
  const [gameOver, setGameOver] = useState<{
    score: number;
    kills: number;
    waves: number;
  } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const submitScore = useSubmitGameScore();
  const { data: topScores } = useTopScores(GAME_ID, 10);
  const { data: playerRank } = usePlayerRank(GAME_ID, currentPlayer?.playerId);

  const { data: gamePlayers } = useGamePlayers();
  const playerMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const p of gamePlayers ?? []) map[p.playerId] = p.username;
    return map;
  }, [gamePlayers]);

  useEffect(() => {
    if (!currentPlayer) navigate({ to: "/games" });
  }, [currentPlayer, navigate]);

  // Stable refs shared between layout effect (loop definition) and callbacks
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastTsRef = useRef<number>(-1);
  const loopRef = useRef<((ts: number) => void) | null>(null);

  // startLoop: cancel any pending frame, then synchronously capture loopRef.current
  // into a local const BEFORE passing to rAF — avoids null-ref on first frame.
  const startLoop = useCallback(() => {
    if (gameRunningRef.current) return; // prevent double-start
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    lastTsRef.current = -1;
    const fn = loopRef.current;
    if (!fn) return;
    gameRunningRef.current = true;
    const id = requestAnimationFrame(fn);
    rafRef.current = id;
  }, []);

  const resetGame = useCallback(() => {
    // Cancel current loop first
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    gameRunningRef.current = false;
    stateRef.current = initState();
    spawnWave(stateRef.current);
    setUiScore(0);
    setUiWave(1);
    setUiLives(3);
    setUiCombo(0);
    setUiWeapon("single");
    setUiXp(0);
    setUiLevel(1);
    setUiShield(false);
    setGameOver(null);
    setSubmitted(false);
    startLoop();
    canvasRef.current?.focus();
  }, [startLoop]);

  // useLayoutEffect so loopRef.current is assigned synchronously
  // before any requestAnimationFrame call in startLoop or the init useEffect.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    function onKey(e: KeyboardEvent) {
      if (
        ["ArrowLeft", "ArrowRight", "Space", "KeyA", "KeyD", "KeyL"].includes(
          e.code,
        )
      )
        e.preventDefault();
      if (e.type === "keydown") {
        keysRef.current.add(e.code);
        if (e.code === "KeyL") setShowLb((v) => !v);
      } else keysRef.current.delete(e.code);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKey);
    canvas.focus();

    // Define the loop function and store it in loopRef BEFORE any rAF call.
    // Each frame: capture loopRef.current locally and re-schedule via that local ref.
    function loop(ts: number) {
      if (!ctx) return;
      const lastTs = lastTsRef.current;
      const dt = lastTs < 0 ? 1 : Math.min((ts - lastTs) / 16.67, 3);
      lastTsRef.current = ts;
      const g = stateRef.current;
      if (g.gameOver) {
        gameRunningRef.current = false;
        return;
      }

      // Input
      const spd = 4.5;
      if (
        keysRef.current.has("ArrowLeft") ||
        keysRef.current.has("KeyA") ||
        touchRef.current.left
      )
        g.player.x -= spd * dt;
      if (
        keysRef.current.has("ArrowRight") ||
        keysRef.current.has("KeyD") ||
        touchRef.current.right
      )
        g.player.x += spd * dt;
      g.player.x = Math.max(18, Math.min(W - 18, g.player.x));

      // Auto-fire
      const fireRate = g.rapidFire ? 5 : 12;
      g.shootTimer += dt;
      if (g.shootTimer >= fireRate) {
        g.shootTimer = 0;
        fireWeapon(g);
      }

      // Timers
      if (g.invTimer > 0) g.invTimer -= dt;
      if (g.shield) {
        g.shieldTimer -= dt;
        if (g.shieldTimer <= 0) {
          g.shield = false;
          setUiShield(false);
        }
      }
      if (g.rapidFire) {
        g.rapidFireTimer -= dt;
        if (g.rapidFireTimer <= 0) g.rapidFire = false;
      }
      if (g.multiplier) {
        g.multiplierTimer -= dt;
        if (g.multiplierTimer <= 0) g.multiplier = false;
      }
      if (g.weaponTimer > 0) {
        g.weaponTimer -= dt;
        if (g.weaponTimer <= 0) {
          g.weapon = "single";
          setUiWeapon("single");
        }
      }
      if (g.comboTimer > 0) {
        g.comboTimer -= dt;
        if (g.comboTimer <= 0) {
          g.combo = 0;
          setUiCombo(0);
        }
      }
      if (g.levelUpAnim > 0) g.levelUpAnim -= dt;

      // Wave spawning
      if (g.enemies.length === 0 && !g.bossAlive) {
        if (g.waveDelay > 0) {
          g.waveDelay -= dt;
        } else {
          if (g.waveEnemiesLeft > 0) {
            g.wave++;
            setUiWave(g.wave);
          }
          spawnWave(g);
        }
      }

      // Boss cleared
      if (g.bossAlive && !g.enemies.some((e) => e.type === "boss")) {
        g.bossAlive = false;
        g.wave++;
        setUiWave(g.wave);
        g.waveDelay = 90;
      }

      // Move bullets
      for (const b of g.bullets) {
        if (b.targetId !== undefined) {
          const t = g.enemies.find((e) => e.id === b.targetId);
          if (t) {
            const a = Math.atan2(t.y - b.y, t.x - b.x);
            b.vx += Math.cos(a) * 0.6;
            b.vy += Math.sin(a) * 0.6;
            const m = Math.hypot(b.vx, b.vy);
            if (m > 10) {
              b.vx = (b.vx / m) * 10;
              b.vy = (b.vy / m) * 10;
            }
          }
        }
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        if (b.life !== undefined) b.life -= dt;
      }
      g.bullets = g.bullets.filter(
        (b) =>
          b.y > -30 &&
          b.y < H + 30 &&
          b.x > -30 &&
          b.x < W + 30 &&
          (b.life === undefined || b.life > 0),
      );

      // Move enemies
      for (const e of g.enemies) {
        if (e.type === "boss") {
          e.x += e.xDir * 1.5 * dt;
          if (e.x > W - 60 || e.x < 60) e.xDir = -e.xDir;
          e.y = Math.min(e.y + e.speed * 0.3 * dt, 100);
          e.fireTimer -= dt;
          if (e.fireTimer <= 0) {
            e.fireTimer = 35;
            for (let i = -2; i <= 2; i++)
              g.bullets.push({
                id: nextId(g),
                x: e.x + i * 18,
                y: e.y + 35,
                vx: i * 1.0,
                vy: 5,
                type: "enemy",
                color: "#f43f5e",
                w: 5,
                h: 12,
                dmg: 15,
              });
          }
        } else if (e.type === "kamikaze") {
          const dx = g.player.x - e.x;
          const dy = g.player.y - e.y;
          const dist = Math.hypot(dx, dy) || 1;
          e.x += (dx / dist) * e.speed * 1.5 * dt;
          e.y += (dy / dist) * e.speed * 1.5 * dt;
        } else if (e.type === "drone") {
          e.sineAngle += 0.05 * dt;
          e.x = e.baseX + Math.sin(e.sineAngle) * 60;
          e.y += e.speed * dt;
        } else if (e.type === "stealth") {
          e.stealthTimer -= dt;
          if (e.stealthTimer <= 0) {
            e.stealthAlpha = e.stealthAlpha > 0.5 ? 0.2 : 1.0;
            e.stealthTimer = 60 + Math.random() * 60;
          }
          e.y += e.speed * dt;
        } else {
          e.y += e.speed * dt;
          e.fireTimer -= dt;
          if (e.fireTimer <= 0) {
            e.fireTimer = 90 + Math.random() * 60;
            g.bullets.push({
              id: nextId(g),
              x: e.x,
              y: e.y + e.h / 2,
              vx: 0,
              vy: 4,
              type: "enemy",
              color: "#f43f5e",
              w: 4,
              h: 10,
              dmg: 12,
            });
          }
        }
      }

      // Player bullets hit enemies
      const toRemoveBullets = new Set<number>();
      const toRemoveEnemies = new Set<number>();
      for (const b of g.bullets) {
        if (b.type !== "player") continue;
        for (const e of g.enemies) {
          if (toRemoveEnemies.has(e.id)) continue;
          if (
            !overlap(
              b.x - b.w / 2,
              b.y - b.h / 2,
              b.w,
              b.h,
              e.x - e.w / 2,
              e.y - e.h / 2,
              e.w,
              e.h,
            )
          )
            continue;
          if (b.life === undefined) toRemoveBullets.add(b.id);
          e.hp -= b.dmg;
          addParticles(g, b.x, b.y, e.color, 5);
          // Electric chain
          if (b.color === "#fbbf24") {
            for (const e2 of g.enemies) {
              if (e2.id !== e.id && Math.hypot(e2.x - e.x, e2.y - e.y) < 80) {
                e2.hp -= b.dmg * 0.6;
                addParticles(g, e2.x, e2.y, "#fbbf24", 4);
              }
            }
          }
          if (e.hp <= 0) {
            toRemoveEnemies.add(e.id);
            addParticles(g, e.x, e.y, e.color, e.type === "boss" ? 40 : 14);
            g.screenShake = e.type === "boss" ? 18 : 6;
            g.kills++;
            g.combo = Math.min(g.combo + 1, 20);
            g.comboTimer = 180;
            const cm = Math.min(Math.floor(g.combo / 4) + 1, 5);
            setUiCombo(g.combo);
            const baseScores: Record<EnemyType, number> = {
              fighter: 20,
              kamikaze: 25,
              tank: 60,
              stealth: 40,
              drone: 35,
              boss: 500,
            };
            const scored = baseScores[e.type] * cm * (g.multiplier ? 2 : 1);
            g.score += scored;
            setUiScore(g.score);
            addFloat(g, e.x, e.y - 20, `+${scored}`, "#fbbf24");
            const xpGain = e.type === "boss" ? 50 : e.type === "tank" ? 12 : 5;
            g.xp += xpGain;
            g.coins += Math.floor(Math.random() * 3) + 1;
            if (g.xp >= g.xpToNext) {
              g.xp -= g.xpToNext;
              g.level++;
              g.xpToNext = XP_PER_LEVEL + g.level * 20;
              g.levelUpAnim = 90;
              setUiLevel(g.level);
            }
            setUiXp(g.xp);
            if (e.type === "boss") {
              g.bossAlive = false;
              g.wave++;
              setUiWave(g.wave);
              g.waveDelay = 90;
            }
            const roll = Math.random();
            let pType: PowerUpType | null = null;
            let wType: WeaponType | undefined;
            if (roll < 0.06) pType = "health";
            else if (roll < 0.12) pType = "shield";
            else if (roll < 0.18) pType = "rapidfire";
            else if (roll < 0.22) pType = "multiplier";
            else if (roll < 0.32) {
              pType = "weapon";
              wType =
                WEAPON_DROPS[Math.floor(Math.random() * WEAPON_DROPS.length)];
            }
            if (pType)
              g.powerUps.push({
                id: nextId(g),
                x: e.x,
                y: e.y,
                vy: 1.5,
                type: pType,
                weaponType: wType,
              });
          }
          break;
        }
      }
      g.bullets = g.bullets.filter((b) => !toRemoveBullets.has(b.id));
      g.enemies = g.enemies.filter(
        (e) => !toRemoveEnemies.has(e.id) && e.y < H + 60,
      );

      // Enemy bullets + kamikaze hit player
      if (g.invTimer <= 0) {
        if (g.shield) {
          g.bullets = g.bullets.filter((b) => {
            if (b.type !== "enemy") return true;
            if (
              overlap(
                b.x - b.w / 2,
                b.y - b.h / 2,
                b.w,
                b.h,
                g.player.x - 38,
                g.player.y - 38,
                76,
                76,
              )
            ) {
              addParticles(g, b.x, b.y, "#06b6d4", 5);
              return false;
            }
            return true;
          });
        } else {
          g.bullets = g.bullets.filter((b) => {
            if (b.type !== "enemy") return true;
            if (
              overlap(
                b.x - b.w / 2,
                b.y - b.h / 2,
                b.w,
                b.h,
                g.player.x - PLAYER_W / 2,
                g.player.y - PLAYER_H / 2,
                PLAYER_W,
                PLAYER_H,
              )
            ) {
              g.lives--;
              setUiLives(g.lives);
              g.invTimer = 60;
              g.screenShake = 8;
              g.combo = 0;
              setUiCombo(0);
              addParticles(g, g.player.x, g.player.y, "#f43f5e", 8);
              addFloat(g, g.player.x, g.player.y - 30, "HIT!", "#f43f5e");
              return false;
            }
            return true;
          });
          // Kamikaze crash
          g.enemies = g.enemies.filter((e) => {
            if (e.type !== "kamikaze") return true;
            if (
              overlap(
                e.x - e.w / 2,
                e.y - e.h / 2,
                e.w,
                e.h,
                g.player.x - PLAYER_W / 2,
                g.player.y - PLAYER_H / 2,
                PLAYER_W,
                PLAYER_H,
              )
            ) {
              g.lives--;
              setUiLives(g.lives);
              g.invTimer = 60;
              g.screenShake = 10;
              addParticles(g, e.x, e.y, "#f97316", 16);
              return false;
            }
            return true;
          });
        }
      }

      // Power-up collection
      for (const p of g.powerUps) {
        p.y += p.vy * dt;
        if (
          overlap(
            p.x - 14,
            p.y - 14,
            28,
            28,
            g.player.x - 24,
            g.player.y - 24,
            48,
            48,
          )
        ) {
          p.vy = 9999;
          addParticles(g, p.x, p.y, POWERUP_COLORS[p.type], 10);
          if (p.type === "health") {
            g.lives = Math.min(g.lives + 1, 5);
            setUiLives(g.lives);
            addFloat(g, p.x, p.y - 20, "+LIFE", "#22c55e");
          } else if (p.type === "shield") {
            g.shield = true;
            g.shieldTimer = 120;
            setUiShield(true);
            addFloat(g, p.x, p.y - 20, "SHIELD!", "#06b6d4");
          } else if (p.type === "rapidfire") {
            g.rapidFire = true;
            g.rapidFireTimer = 300;
            addFloat(g, p.x, p.y - 20, "RAPID!", "#f59e0b");
          } else if (p.type === "multiplier") {
            g.multiplier = true;
            g.multiplierTimer = 600;
            addFloat(g, p.x, p.y - 20, "x2 SCORE!", "#ec4899");
          } else if (p.type === "weapon" && p.weaponType) {
            g.weapon = p.weaponType;
            g.weaponTimer = 600;
            setUiWeapon(p.weaponType);
            addFloat(
              g,
              p.x,
              p.y - 20,
              `${WEAPON_NAMES[p.weaponType]}!`,
              "#a855f7",
            );
          }
        }
      }
      g.powerUps = g.powerUps.filter((p) => p.vy !== 9999 && p.y < H + 60);

      // Particles & float texts
      for (const p of g.particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 0.07 * dt;
        p.life -= dt;
      }
      g.particles = g.particles.filter((p) => p.life > 0);
      for (const f of g.floatTexts) {
        f.y += f.vy * dt;
        f.life -= dt;
      }
      g.floatTexts = g.floatTexts.filter((f) => f.life > 0);

      // Stars parallax
      for (const s of g.stars1) {
        s.y += s.vy * dt;
        if (s.y > H + 2) s.y = -2;
      }
      for (const s of g.stars2) {
        s.y += s.vy * dt;
        if (s.y > H + 2) s.y = -2;
      }
      for (const s of g.stars3) {
        s.y += s.vy * dt;
        if (s.y > H + 2) s.y = -2;
      }

      if (g.screenShake > 0) g.screenShake = Math.max(0, g.screenShake - dt);

      // Game over check
      if (g.lives <= 0) {
        g.gameOver = true;
        setGameOver({ score: g.score, kills: g.kills, waves: g.wave });
        return;
      }

      // ── DRAW ──
      ctx.save();
      const sx =
        g.screenShake > 0
          ? (Math.random() - 0.5) * Math.min(g.screenShake, 8)
          : 0;
      ctx.translate(sx, sx * 0.5);

      // Background
      ctx.fillStyle = "#050510";
      ctx.fillRect(-10, -10, W + 20, H + 20);

      // Stars layer 1 (slow, dim)
      for (const s of g.stars1) {
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      // Stars layer 2 (mid)
      for (const s of g.stars2) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "#c7d2fe";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
      // Stars layer 3 (fast, bright)
      ctx.shadowBlur = 3;
      ctx.shadowColor = "#fff";
      for (const s of g.stars3) {
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      // Power-ups
      for (const p of g.powerUps) {
        const c = POWERUP_COLORS[p.type];
        ctx.save();
        ctx.shadowColor = c;
        ctx.shadowBlur = 12;
        ctx.fillStyle = `${c}33`;
        ctx.strokeStyle = c;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(p.x - 13, p.y - 13, 26, 26, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = c;
        ctx.font = "bold 12px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(POWERUP_ICONS[p.type], p.x, p.y);
        ctx.restore();
      }

      // Enemies
      for (const e of g.enemies) {
        ctx.save();
        ctx.globalAlpha = e.type === "stealth" ? e.stealthAlpha : 1;
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = `${e.color}44`;
        ctx.strokeStyle = e.color;
        ctx.lineWidth = 1.5;
        if (e.type === "boss") {
          ctx.beginPath();
          ctx.moveTo(e.x, e.y - e.h / 2);
          ctx.lineTo(e.x + e.w / 2, e.y);
          ctx.lineTo(e.x, e.y + e.h / 2);
          ctx.lineTo(e.x - e.w / 2, e.y);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#1f2937";
          ctx.fillRect(e.x - 50, e.y - e.h / 2 - 12, 100, 6);
          ctx.fillStyle = "#f43f5e";
          ctx.shadowColor = "#f43f5e";
          ctx.shadowBlur = 6;
          ctx.fillRect(e.x - 50, e.y - e.h / 2 - 12, 100 * (e.hp / e.maxHp), 6);
        } else if (e.type === "drone") {
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.w / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(e.x, e.y + e.h / 2);
          ctx.lineTo(e.x + e.w / 2, e.y - e.h / 2);
          ctx.lineTo(e.x - e.w / 2, e.y - e.h / 2);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          if (e.maxHp > 10) {
            ctx.fillStyle = "#1f2937";
            ctx.fillRect(e.x - e.w / 2, e.y - e.h / 2 - 6, e.w, 3);
            ctx.fillStyle = e.color;
            ctx.fillRect(
              e.x - e.w / 2,
              e.y - e.h / 2 - 6,
              e.w * (e.hp / e.maxHp),
              3,
            );
          }
        }
        ctx.restore();
      }

      // Bullets
      for (const b of g.bullets) {
        ctx.save();
        ctx.shadowColor = b.color;
        ctx.shadowBlur = b.type === "player" ? 12 : 8;
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.roundRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h, 2);
        ctx.fill();
        ctx.restore();
      }

      // Particles
      for (const p of g.particles) {
        const a = Math.max(0, p.life / p.maxLife);
        ctx.globalAlpha = a;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      // Float texts
      for (const f of g.floatTexts) {
        ctx.globalAlpha = Math.max(0, f.life / 55);
        ctx.fillStyle = f.color;
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "center";
        ctx.fillText(f.text, f.x, f.y);
      }
      ctx.globalAlpha = 1;

      // Shield bubble
      if (g.shield) {
        ctx.save();
        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = "#06b6d4";
        ctx.shadowColor = "#06b6d4";
        ctx.shadowBlur = 20;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(g.player.x, g.player.y, 38, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Player ship (flash during invincibility)
      const drawPlayer =
        g.invTimer <= 0 || Math.floor(g.invTimer / 8) % 2 === 0;
      if (drawPlayer) {
        ctx.save();
        ctx.shadowColor = "#06b6d4";
        ctx.shadowBlur = 18;
        ctx.fillStyle = "#06b6d4";
        ctx.beginPath();
        ctx.arc(g.player.x, g.player.y + 15, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#06b6d4";
        ctx.strokeStyle = "#67e8f9";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(g.player.x, g.player.y - 22);
        ctx.lineTo(g.player.x + 14, g.player.y + 16);
        ctx.lineTo(g.player.x + 5, g.player.y + 10);
        ctx.lineTo(g.player.x - 5, g.player.y + 10);
        ctx.lineTo(g.player.x - 14, g.player.y + 16);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // Level-up animation
      if (g.levelUpAnim > 0) {
        ctx.globalAlpha = g.levelUpAnim / 90;
        ctx.fillStyle = "#fbbf24";
        ctx.font = "bold 22px monospace";
        ctx.textAlign = "center";
        ctx.fillText(`LEVEL ${g.level}!`, W / 2, H / 2 - 60);
        ctx.globalAlpha = 1;
      }

      ctx.restore();
      // Capture loopRef.current locally before scheduling next frame
      const nextFn = loopRef.current;
      if (nextFn) {
        rafRef.current = requestAnimationFrame(nextFn);
      }
    }

    // Assign to loopRef SYNCHRONOUSLY before any rAF call
    loopRef.current = loop;

    spawnWave(stateRef.current);
    lastTsRef.current = -1;
    // Start the loop immediately — loopRef.current is already set above
    gameRunningRef.current = false; // startLoop will set it true
    const fn = loopRef.current;
    if (fn) {
      gameRunningRef.current = true;
      rafRef.current = requestAnimationFrame(fn);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      gameRunningRef.current = false;
      loopRef.current = null;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
    };
  }, []);

  function handleSubmit() {
    if (!currentPlayer || !gameOver || submitted) return;
    setSubmitted(true);
    submitScore.mutate({
      playerId: currentPlayer.playerId,
      gameId: GAME_ID,
      score: gameOver.score,
      kills: gameOver.kills,
      waves: gameOver.waves,
    });
  }

  const xpPct = Math.min((uiXp / (XP_PER_LEVEL + uiLevel * 20)) * 100, 100);
  const comboMul = Math.min(Math.floor(uiCombo / 4) + 1, 5);

  return (
    <div
      className="min-h-screen flex flex-col items-center py-4 px-2"
      style={{ background: "#050510" }}
    >
      {/* Top bar */}
      <div className="w-full max-w-3xl flex items-center justify-between mb-3 px-1">
        <button
          type="button"
          onClick={() => navigate({ to: "/games" })}
          data-ocid="space-shooter.back_button"
          className="flex items-center gap-1 text-sm font-mono px-3 py-1.5 rounded-lg transition-colors"
          style={{
            background: "rgba(6,182,212,0.12)",
            color: "#06b6d4",
            border: "1px solid rgba(6,182,212,0.3)",
          }}
        >
          <ArrowLeft className="w-4 h-4" /> NEXUS ARENA
        </button>
        <div
          className="text-xs font-mono tracking-widest"
          style={{ color: "rgba(168,85,247,0.5)" }}
        >
          SPACE SHOOTER
        </div>
        <button
          type="button"
          onClick={() => setShowLb((v) => !v)}
          data-ocid="space-shooter.leaderboard_toggle"
          className="flex items-center gap-1 text-sm font-mono px-3 py-1.5 rounded-lg transition-colors"
          style={{
            background: "rgba(168,85,247,0.12)",
            color: "#a855f7",
            border: "1px solid rgba(168,85,247,0.3)",
          }}
        >
          <Trophy className="w-4 h-4" /> SCORES
        </button>
      </div>

      <div className="flex gap-3 w-full max-w-3xl items-start">
        {/* Left HUD */}
        <div
          className="flex flex-col gap-2 flex-shrink-0"
          style={{ width: 100 }}
        >
          <div
            className="rounded-xl p-2 border"
            style={{
              background: "rgba(15,10,35,0.85)",
              borderColor: "rgba(168,85,247,0.3)",
            }}
          >
            <div
              className="text-xs font-mono mb-0.5"
              style={{ color: "#6b7280" }}
            >
              SCORE
            </div>
            <div
              className="text-base font-black font-mono"
              style={{ color: "#a855f7" }}
            >
              {uiScore.toLocaleString()}
            </div>
          </div>
          <div
            className="rounded-xl p-2 border"
            style={{
              background: "rgba(15,10,35,0.85)",
              borderColor: "rgba(6,182,212,0.3)",
            }}
          >
            <div
              className="text-xs font-mono mb-0.5"
              style={{ color: "#6b7280" }}
            >
              WAVE
            </div>
            <div
              className="text-xl font-black font-mono"
              style={{ color: "#06b6d4" }}
            >
              {uiWave}
            </div>
          </div>
          <div
            className="rounded-xl p-2 border"
            style={{
              background: "rgba(15,10,35,0.85)",
              borderColor: "rgba(244,63,94,0.3)",
            }}
          >
            <div
              className="text-xs font-mono mb-1"
              style={{ color: "#6b7280" }}
            >
              LIVES
            </div>
            <div className="flex flex-wrap gap-0.5">
              {HEART_KEYS.map((k, i) => (
                <Heart
                  key={k}
                  className="w-4 h-4"
                  style={{
                    color: i < uiLives ? "#f43f5e" : "#1f2937",
                    fill: i < uiLives ? "#f43f5e" : "transparent",
                  }}
                />
              ))}
            </div>
          </div>
          <div
            className="rounded-xl p-2 border"
            style={{
              background:
                comboMul > 1 ? "rgba(236,72,153,0.12)" : "rgba(15,10,35,0.85)",
              borderColor:
                comboMul > 1
                  ? "rgba(236,72,153,0.5)"
                  : "rgba(255,255,255,0.05)",
            }}
          >
            <div
              className="text-xs font-mono mb-0.5"
              style={{ color: "#6b7280" }}
            >
              COMBO
            </div>
            <div
              className="text-lg font-black font-mono"
              style={{ color: comboMul > 1 ? "#ec4899" : "#374151" }}
            >
              x{comboMul}
            </div>
          </div>
          <div
            className="rounded-xl p-2 border"
            style={{
              background: "rgba(15,10,35,0.85)",
              borderColor: `${WEAPON_COLORS[uiWeapon]}44`,
            }}
          >
            <div
              className="text-xs font-mono mb-0.5"
              style={{ color: "#6b7280" }}
            >
              WEAPON
            </div>
            <div
              className="text-xs font-bold font-mono"
              style={{ color: WEAPON_COLORS[uiWeapon] }}
            >
              {WEAPON_NAMES[uiWeapon]}
            </div>
          </div>
          <div
            className="rounded-xl p-2 border"
            style={{
              background: "rgba(15,10,35,0.85)",
              borderColor: "rgba(251,191,36,0.3)",
            }}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-mono" style={{ color: "#6b7280" }}>
                LVL
              </span>
              <span
                className="text-xs font-bold font-mono"
                style={{ color: "#fbbf24" }}
              >
                {uiLevel}
              </span>
            </div>
            <div
              className="w-full rounded-full h-1.5"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <div
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: `${xpPct}%`,
                  background: "#fbbf24",
                  boxShadow: "0 0 6px #fbbf24",
                }}
              />
            </div>
          </div>
          {uiShield && (
            <div
              className="rounded-xl p-2 border text-center"
              style={{
                background: "rgba(6,182,212,0.1)",
                borderColor: "rgba(6,182,212,0.4)",
              }}
            >
              <div className="text-xs font-mono" style={{ color: "#06b6d4" }}>
                &#x2B21; SHIELD
              </div>
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className="relative flex-1">
          <canvas
            ref={canvasRef}
            width={W}
            height={H}
            tabIndex={0}
            className="w-full rounded-xl outline-none block"
            style={{
              imageRendering: "pixelated",
              border: "1px solid rgba(168,85,247,0.2)",
              boxShadow: "0 0 40px rgba(168,85,247,0.15)",
              maxHeight: "85vh",
            }}
            data-ocid="space-shooter.canvas"
          />
          {/* Mobile controls */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4 pointer-events-none">
            <button
              type="button"
              onTouchStart={(e) => {
                e.preventDefault();
                touchRef.current.left = true;
              }}
              onTouchEnd={() => {
                touchRef.current.left = false;
              }}
              className="pointer-events-auto w-14 h-14 rounded-full font-bold text-2xl flex items-center justify-center select-none"
              style={{
                background: "rgba(6,182,212,0.2)",
                border: "2px solid rgba(6,182,212,0.5)",
                color: "#06b6d4",
              }}
              data-ocid="space-shooter.left_button"
            >
              &larr;
            </button>
            <button
              type="button"
              onTouchStart={(e) => {
                e.preventDefault();
              }}
              onTouchEnd={() => {}}
              className="pointer-events-auto w-14 h-14 rounded-full font-bold flex items-center justify-center select-none"
              style={{
                background: "rgba(168,85,247,0.2)",
                border: "2px solid rgba(168,85,247,0.5)",
                color: "#a855f7",
              }}
              data-ocid="space-shooter.fire_button"
            >
              <Zap className="w-6 h-6" />
            </button>
            <button
              type="button"
              onTouchStart={(e) => {
                e.preventDefault();
                touchRef.current.right = true;
              }}
              onTouchEnd={() => {
                touchRef.current.right = false;
              }}
              className="pointer-events-auto w-14 h-14 rounded-full font-bold text-2xl flex items-center justify-center select-none"
              style={{
                background: "rgba(6,182,212,0.2)",
                border: "2px solid rgba(6,182,212,0.5)",
                color: "#06b6d4",
              }}
              data-ocid="space-shooter.right_button"
            >
              &rarr;
            </button>
          </div>

          {/* Game Over overlay */}
          {gameOver && (
            <div
              className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-4"
              style={{
                background: "rgba(5,5,16,0.93)",
                backdropFilter: "blur(8px)",
              }}
              data-ocid="space-shooter.game_over_panel"
            >
              <div
                className="text-4xl font-black tracking-widest"
                style={{
                  color: "#f43f5e",
                  textShadow: "0 0 30px rgba(244,63,94,0.8)",
                }}
              >
                GAME OVER
              </div>
              <div className="text-center">
                <div
                  className="text-2xl font-black font-mono"
                  style={{ color: "#a855f7" }}
                >
                  {gameOver.score.toLocaleString()} PTS
                </div>
                <div
                  className="text-sm font-mono mt-1"
                  style={{ color: "#6b7280" }}
                >
                  {gameOver.kills} KILLS &middot; WAVE {gameOver.waves}
                </div>
              </div>
              {submitted && playerRank && (
                <div className="text-sm font-mono" style={{ color: "#fbbf24" }}>
                  YOUR RANK: #{Number(playerRank.rank)}
                </div>
              )}
              <div className="flex gap-3 flex-wrap justify-center mt-2">
                {!submitted && currentPlayer && (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    data-ocid="space-shooter.submit_button"
                    className="px-5 py-2.5 rounded-lg font-bold text-sm tracking-widest transition-all"
                    style={{
                      background: "linear-gradient(135deg,#7c3aed,#0891b2)",
                      color: "#fff",
                      boxShadow: "0 0 20px rgba(124,58,237,0.4)",
                    }}
                  >
                    {submitScore.isPending ? "SAVING..." : "SUBMIT SCORE"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={resetGame}
                  data-ocid="space-shooter.restart_button"
                  className="px-5 py-2.5 rounded-lg font-bold text-sm tracking-widest"
                  style={{
                    background: "rgba(168,85,247,0.15)",
                    color: "#a855f7",
                    border: "1px solid rgba(168,85,247,0.4)",
                  }}
                >
                  PLAY AGAIN
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/games" })}
                  data-ocid="space-shooter.exit_button"
                  className="px-5 py-2.5 rounded-lg font-bold text-sm tracking-widest"
                  style={{
                    background: "rgba(6,182,212,0.12)",
                    color: "#06b6d4",
                    border: "1px solid rgba(6,182,212,0.3)",
                  }}
                >
                  HUB
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Leaderboard panel */}
        {showLb && (
          <div
            className="rounded-xl p-4 border flex flex-col gap-2 flex-shrink-0"
            style={{
              width: 180,
              background: "rgba(15,10,35,0.9)",
              borderColor: "rgba(6,182,212,0.3)",
              backdropFilter: "blur(12px)",
              maxHeight: H,
              overflowY: "auto",
            }}
            data-ocid="space-shooter.leaderboard_panel"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5" style={{ color: "#06b6d4" }} />
                <span
                  className="text-xs font-bold tracking-widest font-mono"
                  style={{ color: "#06b6d4" }}
                >
                  TOP 10
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowLb(false)}
                data-ocid="space-shooter.leaderboard_close"
              >
                <X className="w-3.5 h-3.5" style={{ color: "#6b7280" }} />
              </button>
            </div>
            {!topScores || topScores.length === 0 ? (
              <div className="text-xs font-mono" style={{ color: "#374151" }}>
                No scores yet
              </div>
            ) : (
              topScores.map((s, i) => {
                const isMe = currentPlayer?.playerId === s.playerId;
                return (
                  <div
                    key={s.scoreId}
                    className="flex items-center gap-1.5 py-0.5"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    data-ocid={`space-shooter.leaderboard.item.${i + 1}`}
                  >
                    <span
                      className="text-xs font-mono w-5 flex-shrink-0"
                      style={{
                        color:
                          i === 0
                            ? "#fbbf24"
                            : i === 1
                              ? "#9ca3af"
                              : i === 2
                                ? "#d97706"
                                : "#374151",
                      }}
                    >
                      #{i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-xs font-mono truncate"
                        style={{ color: isMe ? "#06b6d4" : "#e2e8f0" }}
                      >
                        {playerMap[s.playerId] ?? s.playerId.slice(0, 8)}
                      </div>
                      <div
                        className="text-xs font-bold font-mono"
                        style={{ color: "#a855f7" }}
                      >
                        {Number(s.score).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Controls hint */}
      <div
        className="mt-3 text-xs font-mono"
        style={{ color: "rgba(107,114,128,0.5)" }}
      >
        &larr; &rarr; / A D &mdash; MOVE &nbsp;&middot;&nbsp; AUTO-FIRE
        &nbsp;&middot;&nbsp; L &mdash; LEADERBOARD &nbsp;&middot;&nbsp; COLLECT
        DROPS TO UPGRADE WEAPON
      </div>
    </div>
  );
}
