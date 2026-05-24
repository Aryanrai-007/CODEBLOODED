import { SpaceShooterGame } from "@/components/SpaceShooterGame";
import { useGamePlayers } from "@/hooks/useAdminGames";
import { useGameAuth } from "@/hooks/useGameAuth";
import { useEquippedSkin } from "@/hooks/useGameQueries";
import { useGrandLeaderboard } from "@/hooks/useGameScores";
import CyberDriftRacerGame from "@/pages/CyberDriftRacerGame";
import { Eye, EyeOff, Gamepad2, LogOut, Rocket, Trophy } from "lucide-react";
import { useState } from "react";

// Pre-computed starfield data to avoid index key lint issues
const AUTH_STARS = Array.from({ length: 80 }, (_, i) => ({
  id: `auth-star-${i}`,
  w: ((i * 7 + 13) % 20) / 10 + 1,
  h: ((i * 11 + 7) % 20) / 10 + 1,
  left: (i * 137.508) % 100,
  top: (i * 97.31) % 100,
  opacity: ((i * 53) % 60) / 100 + 0.2,
}));

const HUB_STARS = Array.from({ length: 100 }, (_, i) => ({
  id: `hub-star-${i}`,
  w: ((i * 5 + 3) % 15) / 10 + 0.5,
  h: ((i * 9 + 17) % 15) / 10 + 0.5,
  left: (i * 113.517) % 100,
  top: (i * 83.47) % 100,
  opacity: ((i * 41) % 50) / 100 + 0.1,
}));

const THUMB_STARS = Array.from({ length: 30 }, (_, i) => ({
  id: `thumb-star-${i}`,
  left: (i * 127.4) % 100,
  top: (i * 71.3) % 100,
  opacity: ((i * 63) % 80) / 100 + 0.2,
}));

export function GamesHubPage() {
  const {
    currentPlayer,
    isLoggedIn,
    isLoading,
    error,
    register,
    login,
    logout,
    clearError,
  } = useGameAuth();

  if (!isLoggedIn) {
    return (
      <AuthGate
        isLoading={isLoading}
        error={error}
        onRegister={register}
        onLogin={login}
        clearError={clearError}
      />
    );
  }

  return <GameHub player={currentPlayer!} onLogout={logout} />;
}

function AuthGate({
  isLoading,
  error,
  onRegister,
  onLogin,
  clearError,
}: {
  isLoading: boolean;
  error: string | null;
  onRegister: (u: string, p: string) => Promise<boolean>;
  onLogin: (u: string, p: string) => Promise<boolean>;
  clearError: () => void;
}) {
  const [tab, setTab] = useState<"login" | "create">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [validationError, setValidationError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError("");
    clearError();
    if (!username.trim()) {
      setValidationError("Username is required.");
      return;
    }
    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }
    if (tab === "create") {
      await onRegister(username.trim(), password);
    } else {
      await onLogin(username.trim(), password);
    }
  }

  const displayError = validationError || error;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "#0a0a1a" }}
    >
      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none">
        {AUTH_STARS.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{
              width: s.w,
              height: s.h,
              left: `${s.left}%`,
              top: `${s.top}%`,
              opacity: s.opacity,
            }}
          />
        ))}
      </div>

      {/* Glow blobs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Gamepad2 className="w-8 h-8" style={{ color: "#a855f7" }} />
            <h1
              className="text-4xl font-black tracking-widest"
              style={{
                background:
                  "linear-gradient(135deg, #a855f7, #06b6d4, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 20px rgba(168,85,247,0.5))",
              }}
            >
              NEXUS ARENA
            </h1>
          </div>
          <p className="text-sm tracking-widest" style={{ color: "#6b7280" }}>
            ENTER THE GRID
          </p>
        </div>

        {/* Auth Card */}
        <div
          className="rounded-2xl p-6 border"
          style={{
            background: "rgba(15,15,30,0.8)",
            backdropFilter: "blur(16px)",
            borderColor: "rgba(139,92,246,0.3)",
            boxShadow:
              "0 0 40px rgba(139,92,246,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Tabs */}
          <div
            className="flex rounded-lg mb-6 p-1"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            {(["login", "create"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTab(t);
                  setValidationError("");
                  clearError();
                }}
                className="flex-1 py-2 rounded-md text-sm font-semibold tracking-wider transition-all duration-200"
                style={{
                  background:
                    tab === t ? "rgba(139,92,246,0.4)" : "transparent",
                  color: tab === t ? "#e2d9f3" : "#6b7280",
                  boxShadow:
                    tab === t ? "0 0 12px rgba(139,92,246,0.3)" : "none",
                }}
                data-ocid={`games-auth-tab-${t}`}
              >
                {t === "login" ? "LOGIN" : "CREATE ID"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="games-username"
                className="block text-xs tracking-wider mb-1"
                style={{ color: "#9ca3af" }}
              >
                USERNAME
              </label>
              <input
                id="games-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(139,92,246,0.3)",
                  color: "#e2e8f0",
                }}
                data-ocid="games-auth-username-input"
              />
            </div>

            <div>
              <label
                htmlFor="games-password"
                className="block text-xs tracking-wider mb-1"
                style={{ color: "#9ca3af" }}
              >
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={
                    tab === "create" ? "Min 6 characters" : "Enter password"
                  }
                  className="w-full px-4 py-3 pr-10 rounded-lg text-sm outline-none transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(139,92,246,0.3)",
                    color: "#e2e8f0",
                  }}
                  data-ocid="games-auth-password-input"
                  id="games-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#6b7280" }}
                  aria-label="Toggle password visibility"
                >
                  {showPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {displayError && (
              <div
                className="px-3 py-2 rounded-lg text-sm"
                style={{
                  background: "rgba(239,68,68,0.15)",
                  color: "#f87171",
                  border: "1px solid rgba(239,68,68,0.3)",
                }}
                data-ocid="games-auth-error-state"
              >
                {displayError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 py-3 rounded-lg font-bold text-sm tracking-widest transition-all duration-200 disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                color: "#fff",
                boxShadow: "0 0 20px rgba(124,58,237,0.4)",
              }}
              data-ocid="games-auth-submit-button"
            >
              {isLoading
                ? "CONNECTING..."
                : tab === "login"
                  ? "LOGIN"
                  : "CREATE ID"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function GameHub({
  player,
  onLogout,
}: {
  player: { username: string; playerId: string };
  onLogout: () => void;
}) {
  const [activeGame, setActiveGame] = useState<
    "space-shooter" | "cyber-drift" | null
  >(null);
  const { data: grandRankings = [] } = useGrandLeaderboard(10);
  const { data: gamePlayers = [] } = useGamePlayers();
  const playerMap: Record<string, string> = {};
  for (const p of gamePlayers) {
    playerMap[p.playerId.toString()] = p.username;
  }

  const { data: equippedSkinId } = useEquippedSkin(player.playerId);

  // When a game is active, render it fullscreen inline
  if (activeGame === "cyber-drift") {
    return <CyberDriftRacerGame onExit={() => setActiveGame(null)} />;
  }

  if (activeGame === "space-shooter") {
    return (
      <SpaceShooterGame
        playerId={player.playerId}
        username={player.username}
        onExit={() => setActiveGame(null)}
        equippedSkinId={equippedSkinId?.skinId || undefined}
      />
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: "#0a0a1a" }}
    >
      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none">
        {HUB_STARS.map((s) => (
          <div
            key={s.id}
            className="absolute rounded-full bg-white"
            style={{
              width: s.w,
              height: s.h,
              left: `${s.left}%`,
              top: `${s.top}%`,
              opacity: s.opacity,
            }}
          />
        ))}
      </div>

      {/* Glow blobs */}
      <div
        className="absolute top-0 left-1/3 w-[600px] h-[400px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(139,92,246,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/3 w-[400px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(6,182,212,0.1) 0%, transparent 70%)",
        }}
      />

      {/* Hub header */}
      <div className="relative z-10 px-6 pt-8 pb-4 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div>
          <h1
            className="text-3xl font-black tracking-widest"
            style={{
              background: "linear-gradient(135deg, #a855f7, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 16px rgba(168,85,247,0.5))",
            }}
          >
            NEXUS ARENA
          </h1>
          <p className="text-sm mt-1 font-mono" style={{ color: "#a855f7" }}>
            WELCOME,{" "}
            <span style={{ color: "#06b6d4" }}>
              {player.username.toUpperCase()}
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-80"
          style={{
            background: "rgba(239,68,68,0.15)",
            color: "#f87171",
            border: "1px solid rgba(239,68,68,0.3)",
          }}
          data-ocid="games-logout-button"
        >
          <LogOut className="w-4 h-4" />
          LOGOUT
        </button>
      </div>

      {/* Games grid */}
      <div className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <h2
          className="text-xs font-bold tracking-[0.3em] mb-6"
          style={{ color: "#6b7280" }}
        >
          SELECT MISSION
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Space Shooter Card */}
          <div
            className="rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer group"
            style={{
              background: "rgba(15,15,30,0.7)",
              backdropFilter: "blur(12px)",
              borderColor: "rgba(139,92,246,0.3)",
              boxShadow: "0 0 30px rgba(139,92,246,0.1)",
            }}
            data-ocid="games-hub-space-shooter-card"
          >
            {/* Thumbnail */}
            <div
              className="relative h-44 flex items-center justify-center overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #0d0d2b 0%, #1a0533 50%, #0d1a2b 100%)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(139,92,246,0.3) 0%, transparent 70%)",
                }}
              />
              {THUMB_STARS.map((s) => (
                <div
                  key={s.id}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: 2,
                    height: 2,
                    left: `${s.left}%`,
                    top: `${s.top}%`,
                    opacity: s.opacity,
                  }}
                />
              ))}
              <Rocket
                className="w-20 h-20 relative z-10 transition-transform duration-300 group-hover:scale-110"
                style={{
                  color: "#a855f7",
                  filter: "drop-shadow(0 0 20px rgba(168,85,247,0.8))",
                }}
              />
              <div
                className="absolute bottom-2 right-3 text-xs font-mono px-2 py-0.5 rounded"
                style={{
                  background: "rgba(6,182,212,0.2)",
                  color: "#06b6d4",
                  border: "1px solid rgba(6,182,212,0.3)",
                }}
              >
                ENDLESS
              </div>
            </div>

            {/* Card body */}
            <div className="p-5">
              <h3
                className="font-black text-lg tracking-wider mb-1"
                style={{ color: "#e2d9f3" }}
              >
                VOID STRIKER
              </h3>
              <p className="text-xs mb-4" style={{ color: "#6b7280" }}>
                Space shooter · Waves · Boss fights · Power-ups
              </p>
              <button
                type="button"
                onClick={() => setActiveGame("space-shooter")}
                className="w-full py-2.5 rounded-lg font-bold text-sm tracking-widest flex items-center justify-center gap-2 transition-all duration-200 group-hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #0891b2)",
                  color: "#fff",
                  boxShadow: "0 0 15px rgba(124,58,237,0.3)",
                }}
                data-ocid="games-launch-space-shooter-button"
              >
                PLAY NOW
              </button>
            </div>
          </div>

          {/* Cyber Drift Racer Card */}
          <div
            className="rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer group"
            style={{
              background: "rgba(15,15,30,0.7)",
              backdropFilter: "blur(12px)",
              borderColor: "rgba(236,72,153,0.3)",
              boxShadow: "0 0 30px rgba(236,72,153,0.1)",
            }}
            data-ocid="games-hub-cyber-drift-card"
          >
            {/* Thumbnail */}
            <div
              className="relative h-44 flex items-center justify-center overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #1a0033 0%, #0d001a 50%, #001a0d 100%)",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at 50% 60%, rgba(0,255,255,0.25) 0%, rgba(255,0,170,0.15) 50%, transparent 70%)",
                }}
              />
              {/* Neon road lines */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 200 176"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <line
                  x1="100"
                  y1="30"
                  x2="20"
                  y2="176"
                  stroke="#00ffff"
                  strokeWidth="1"
                  opacity="0.4"
                />
                <line
                  x1="100"
                  y1="30"
                  x2="180"
                  y2="176"
                  stroke="#00ffff"
                  strokeWidth="1"
                  opacity="0.4"
                />
                <line
                  x1="100"
                  y1="30"
                  x2="60"
                  y2="176"
                  stroke="#ff00aa"
                  strokeWidth="0.5"
                  opacity="0.3"
                  strokeDasharray="6 8"
                />
                <line
                  x1="100"
                  y1="30"
                  x2="140"
                  y2="176"
                  stroke="#ff00aa"
                  strokeWidth="0.5"
                  opacity="0.3"
                  strokeDasharray="6 8"
                />
              </svg>
              {/* Car icon */}
              <div
                className="relative z-10 transition-transform duration-300 group-hover:scale-110 text-5xl"
                style={{
                  filter:
                    "drop-shadow(0 0 16px #00ffff) drop-shadow(0 0 32px #ff00aa)",
                }}
              >
                🚗
              </div>
              <div
                className="absolute bottom-2 right-3 text-xs font-mono px-2 py-0.5 rounded"
                style={{
                  background: "rgba(255,0,170,0.2)",
                  color: "#ff00aa",
                  border: "1px solid rgba(255,0,170,0.3)",
                }}
              >
                DRIFT
              </div>
            </div>

            {/* Card body */}
            <div className="p-5">
              <h3
                className="font-black text-lg tracking-wider mb-1"
                style={{ color: "#e2d9f3" }}
              >
                CYBER DRIFT RACER
              </h3>
              <p className="text-xs mb-4" style={{ color: "#6b7280" }}>
                Neon roads · Lane drift · Boosts · Obstacles
              </p>
              <button
                type="button"
                onClick={() => setActiveGame("cyber-drift")}
                className="w-full py-2.5 rounded-lg font-bold text-sm tracking-widest flex items-center justify-center gap-2 transition-all duration-200 group-hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #ec4899, #06b6d4)",
                  color: "#fff",
                  boxShadow: "0 0 15px rgba(236,72,153,0.3)",
                }}
                data-ocid="games-launch-cyber-drift-button"
              >
                PLAY NOW
              </button>
            </div>
          </div>

          <div
            className="rounded-2xl border flex flex-col items-center justify-center h-72 gap-3"
            style={{
              background: "rgba(15,15,30,0.3)",
              borderColor: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="text-3xl opacity-30">🎮</div>
            <p
              className="text-xs tracking-widest font-mono"
              style={{ color: "#4b5563" }}
            >
              COMING SOON
            </p>
          </div>
        </div>

        {/* Grand Arena Ranking Panel */}
        <div className="mt-10">
          <div className="flex items-center gap-3 mb-5">
            <Trophy
              className="w-5 h-5"
              style={{
                color: "#a855f7",
                filter: "drop-shadow(0 0 8px rgba(168,85,247,0.6))",
              }}
            />
            <h2
              className="text-sm font-black tracking-[0.3em] font-mono"
              style={{
                background: "linear-gradient(135deg, #a855f7, #ec4899)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              GRAND ARENA RANKING
            </h2>
            <span
              className="text-xs font-mono px-2 py-0.5 rounded-full"
              style={{
                background: "rgba(236,72,153,0.15)",
                color: "#ec4899",
                border: "1px solid rgba(236,72,153,0.3)",
              }}
            >
              ALL GAMES · TOP 10
            </span>
          </div>

          <div
            className="rounded-2xl border overflow-hidden"
            style={{
              background: "rgba(10,5,25,0.8)",
              borderColor: "rgba(139,92,246,0.25)",
              backdropFilter: "blur(12px)",
              boxShadow:
                "0 0 40px rgba(139,92,246,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
            data-ocid="games-hub.grand-ranking.panel"
          >
            {grandRankings.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-14 gap-3"
                data-ocid="games-hub.grand-ranking.empty_state"
              >
                <Trophy
                  className="w-10 h-10 opacity-20"
                  style={{ color: "#a855f7" }}
                />
                <p className="text-sm font-mono" style={{ color: "#4b5563" }}>
                  No rankings yet — be the first to play!
                </p>
              </div>
            ) : (
              <div
                className="divide-y"
                style={{ borderColor: "rgba(255,255,255,0.04)" }}
              >
                {/* Header row */}
                <div
                  className="grid grid-cols-[2.5rem_1fr_auto] gap-3 px-5 py-2.5 text-xs font-bold tracking-widest font-mono"
                  style={{
                    background: "rgba(139,92,246,0.08)",
                    color: "#6b7280",
                  }}
                >
                  <span>RANK</span>
                  <span>PLAYER</span>
                  <span className="text-right">GRAND SCORE</span>
                </div>
                {grandRankings.map((gr) => {
                  const isMe = gr.playerId.toString() === player.playerId;
                  return (
                    <div
                      key={`hub-gr-${Number(gr.rank)}`}
                      className="grid grid-cols-[2.5rem_1fr_auto] gap-3 items-center px-5 py-3 transition-colors"
                      style={{
                        background: isMe
                          ? "rgba(6,182,212,0.06)"
                          : "transparent",
                        borderLeft: isMe
                          ? "3px solid rgba(6,182,212,0.6)"
                          : "3px solid transparent",
                      }}
                      data-ocid={`games-hub.grand-ranking.item.${Number(gr.rank)}`}
                    >
                      <span
                        className="text-sm font-black font-mono"
                        style={{
                          color:
                            Number(gr.rank) === 1
                              ? "#fbbf24"
                              : Number(gr.rank) === 2
                                ? "#9ca3af"
                                : Number(gr.rank) === 3
                                  ? "#d97706"
                                  : "#4b5563",
                        }}
                      >
                        #{Number(gr.rank)}
                      </span>
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{
                            background: isMe
                              ? "rgba(6,182,212,0.2)"
                              : "rgba(168,85,247,0.15)",
                            color: isMe ? "#06b6d4" : "#a855f7",
                          }}
                        >
                          {gr.username.charAt(0).toUpperCase()}
                        </div>
                        <span
                          className="text-sm font-mono truncate"
                          style={{
                            color: isMe ? "#06b6d4" : "#e2d9f3",
                            fontWeight: isMe ? "bold" : "normal",
                          }}
                        >
                          {isMe ? `▶ ${gr.username}` : gr.username}
                        </span>
                      </div>
                      <span
                        className="text-sm font-black font-mono tabular-nums"
                        style={{
                          color: isMe ? "#06b6d4" : "#a855f7",
                          textShadow: isMe
                            ? "0 0 12px rgba(6,182,212,0.5)"
                            : "none",
                        }}
                      >
                        {Number(gr.score).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
