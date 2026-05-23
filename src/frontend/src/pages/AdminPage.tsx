import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarDays,
  CheckCircle,
  Gamepad2,
  Lock,
  LockOpen,
  Search,
  ShieldCheck,
  Terminal,
  Trash2,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { EditCalendarTab } from "../components/EditCalendarTab";
import {
  useAllGameScores,
  useDeleteGamePlayer,
  useDeleteGameScore,
  useGamePlayers,
} from "../hooks/useAdminGames";
import { useApplications } from "../hooks/useApplications";
import { useApproveApplication } from "../hooks/useApproveApplication";
import { useDeleteApplication } from "../hooks/useDeleteApplication";
import { useGrandLeaderboard } from "../hooks/useGameScores";
import { ApplicationStatus } from "../types";
import type { Application } from "../types";
import type { GamePlayer, GameScore } from "../types/game";

// ─── Utilities ───────────────────────────────────────────────────────────────

function isApproved(app: Application): boolean {
  return app.status === ApplicationStatus.approved;
}

function formatTimestamp(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  return new Date(ms).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ─── Passcode Lock Screen ─────────────────────────────────────────────────────

const CORRECT_PASSCODE = "RaiArya@ipec99";

function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [shaking, setShaking] = useState(false);

  function handleUnlock() {
    if (passcode === CORRECT_PASSCODE) {
      setError("");
      onUnlock();
    } else {
      setError("Incorrect passcode. Please try again.");
      setShaking(true);
      setPasscode("");
      setTimeout(() => setShaking(false), 500);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleUnlock();
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-px flex-1 bg-border" />
          <Terminal className="w-4 h-4 text-primary" />
          <div className="h-px flex-1 bg-border" />
        </div>

        <div
          className={`bg-card border border-primary/25 rounded-xl p-8 card-elevated text-center transition-all duration-200 ${shaking ? "animate-[shake_0.4s_ease-in-out]" : ""}`}
        >
          <div className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-5 bg-primary/12">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>

          <h1 className="font-display text-2xl font-bold text-foreground mb-1 tracking-wider">
            ADMIN ACCESS
          </h1>
          <p className="text-muted-foreground text-sm mb-6">
            Enter the passcode to access the admin dashboard.
          </p>

          <div className="flex flex-col gap-3">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                type="password"
                placeholder="Enter passcode…"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setError("");
                }}
                onKeyDown={handleKeyDown}
                className="pl-9 bg-muted/40 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/40 font-mono text-sm"
                data-ocid="passcode-input"
                autoComplete="off"
              />
            </div>

            {error && (
              <p
                className="text-xs text-destructive font-mono text-left"
                role="alert"
              >
                {error}
              </p>
            )}

            <Button
              data-ocid="unlock-btn"
              onClick={handleUnlock}
              className="w-full btn-primary flex items-center justify-center gap-2 h-11"
            >
              <LockOpen className="w-4 h-4" />
              Unlock Dashboard
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-5 font-mono">
            CODEX_LETHALIS · Admin Portal
          </p>
        </div>

        <div className="flex items-center gap-2 mt-6">
          <div className="h-px flex-1 bg-border" />
          <Terminal className="w-4 h-4 text-primary" />
          <div className="h-px flex-1 bg-border" />
        </div>
      </div>
    </div>
  );
}

// ─── Table Skeleton ───────────────────────────────────────────────────────────

const SKELETON_ROW_IDS = ["sk-a", "sk-b", "sk-c", "sk-d", "sk-e", "sk-f"];
const SKELETON_COL_IDS = ["c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9"];

function TableSkeleton() {
  return (
    <>
      {SKELETON_ROW_IDS.map((rowId) => (
        <TableRow key={rowId} className="border-border/40">
          {SKELETON_COL_IDS.map((colId) => (
            <TableCell key={`${rowId}-${colId}`}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

// ─── Application Row ─────────────────────────────────────────────────────────

function AppRow({
  app,
  index,
  onClick,
  onDelete,
  onApprove,
}: {
  app: Application;
  index: number;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onApprove: (e: React.MouseEvent) => void;
}) {
  const approved = isApproved(app);
  return (
    <TableRow
      className="border-border/40 hover:bg-muted/20 transition-colors cursor-pointer"
      data-ocid={`application.item.${index + 1}`}
      onClick={onClick}
    >
      <TableCell className="text-muted-foreground font-mono text-xs w-10">
        {index + 1}
      </TableCell>
      <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
        {formatTimestamp(app.submittedAt)}
      </TableCell>
      <TableCell className="font-medium text-foreground whitespace-nowrap">
        <div className="flex items-center gap-2">
          {app.name}
          {approved && (
            <Badge
              variant="outline"
              className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-mono text-[10px] uppercase tracking-wider"
            >
              Approved
            </Badge>
          )}
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap">
        <a
          href={`mailto:${app.email}`}
          className="text-primary transition-colors hover:opacity-80 text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {app.email}
        </a>
      </TableCell>
      <TableCell className="text-foreground whitespace-nowrap font-mono text-sm">
        {app.phone}
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className="border-border text-muted-foreground font-mono text-xs"
        >
          {app.yearOfStudy}
        </Badge>
      </TableCell>
      <TableCell className="text-foreground whitespace-nowrap text-sm">
        {app.department}
      </TableCell>
      <TableCell className="max-w-[220px]">
        <p className="text-foreground text-sm line-clamp-2 leading-relaxed">
          {app.reasonForJoining}
        </p>
      </TableCell>
      <TableCell className="max-w-[180px]">
        {app.priorExperience ? (
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {app.priorExperience}
          </p>
        ) : (
          <span className="italic text-muted-foreground/50 text-sm">None</span>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          {!approved && (
            <button
              type="button"
              data-ocid={`application.approve_button.${index + 1}`}
              aria-label={`Approve application from ${app.name}`}
              onClick={onApprove}
              className="p-1.5 rounded-md text-muted-foreground/50 hover:text-emerald-600 hover:bg-emerald-500/10 transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5" />
            </button>
          )}
          {!approved && (
            <button
              type="button"
              data-ocid={`application.delete_button.${index + 1}`}
              aria-label={`Delete application from ${app.name}`}
              onClick={onDelete}
              className="p-1.5 rounded-md text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── Game Players Tab ────────────────────────────────────────────────────────

const PLAYER_SKEL_IDS = ["ps-a", "ps-b", "ps-c", "ps-d"];
const PLAYER_COL_IDS = ["p1", "p2", "p3", "p4"];

function GamePlayersTab() {
  const { data: players = [], isLoading, isError } = useGamePlayers();
  const { mutate: deletePlayer, isPending: isDeleting } = useDeleteGamePlayer();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function formatTs(ns: bigint): string {
    const ms = Number(ns / 1_000_000n);
    return new Date(ms).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const PLAYER_HEADERS = ["#", "Username", "Player ID", "Joined", ""];

  return (
    <main
      className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8"
      data-ocid="game-players.section"
    >
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-foreground tracking-wide flex items-center gap-2">
          <Gamepad2 className="w-5 h-5 text-primary" />
          Game Players
        </h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          {isLoading
            ? "Loading players…"
            : `${players.length} registered players`}
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden card-elevated">
        <div className="overflow-x-auto" data-ocid="game-players.table">
          <Table>
            <TableHeader>
              <TableRow className="border-border/60 bg-muted/40">
                {PLAYER_HEADERS.map((col) => (
                  <TableHead
                    key={col}
                    className="text-muted-foreground font-display text-xs tracking-widest uppercase whitespace-nowrap py-3"
                  >
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <>
                  {PLAYER_SKEL_IDS.map((rowId) => (
                    <TableRow key={rowId} className="border-border/40">
                      {PLAYER_COL_IDS.map((colId) => (
                        <TableCell key={`${rowId}-${colId}`}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-destructive text-sm"
                    data-ocid="game-players.error_state"
                  >
                    Failed to load game players. Please try again.
                  </TableCell>
                </TableRow>
              ) : players.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-48 text-center"
                    data-ocid="game-players.empty_state"
                  >
                    <div className="flex flex-col items-center gap-3 py-8">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-muted/50">
                        <Gamepad2 className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-display font-semibold text-foreground">
                          No players yet
                        </p>
                        <p className="text-muted-foreground text-sm mt-1">
                          Players will appear here once they register in the
                          Games Hub.
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                players.map((player: GamePlayer, i: number) => (
                  <TableRow
                    key={player.playerId}
                    className="border-border/40 hover:bg-muted/20 transition-colors"
                    data-ocid={`game-players.item.${i + 1}`}
                  >
                    <TableCell className="text-muted-foreground font-mono text-xs w-10">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {player.username}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {player.playerId}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                      {formatTs(player.createdAt)}
                    </TableCell>
                    <TableCell>
                      {confirmDeleteId === player.playerId ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-destructive font-mono whitespace-nowrap">
                            Are you sure?
                          </span>
                          <button
                            type="button"
                            data-ocid={`game-players.cancel_button.${i + 1}`}
                            onClick={() => setConfirmDeleteId(null)}
                            className="text-[10px] px-2 py-1 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
                          >
                            No
                          </button>
                          <button
                            type="button"
                            data-ocid={`game-players.confirm_button.${i + 1}`}
                            disabled={isDeleting}
                            onClick={() =>
                              deletePlayer(player.playerId, {
                                onSuccess: () => setConfirmDeleteId(null),
                              })
                            }
                            className="text-[10px] px-2 py-1 rounded bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors flex items-center gap-1 disabled:opacity-60"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                            {isDeleting ? "…" : "Yes"}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          data-ocid={`game-players.delete_button.${i + 1}`}
                          aria-label={`Delete player ${player.username}`}
                          onClick={() => setConfirmDeleteId(player.playerId)}
                          className="p-1.5 rounded-md text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}

// ─── Game Leaderboards Tab ────────────────────────────────────────────────────

const LB_SKEL_IDS = ["lb-a", "lb-b", "lb-c", "lb-d", "lb-e"];
const LB_COL_IDS = ["l1", "l2", "l3", "l4", "l5", "l6", "l7"];

function GameLeaderboardsTab() {
  const {
    data: scores = [],
    isLoading: scoresLoading,
    isError: scoresError,
  } = useAllGameScores();
  const { data: players = [], isLoading: playersLoading } = useGamePlayers();
  const { mutate: deleteScore, isPending: isDeletingScore } =
    useDeleteGameScore();
  const [confirmDeleteScoreId, setConfirmDeleteScoreId] = useState<
    string | null
  >(null);

  const isLoading = scoresLoading || playersLoading;

  const playerMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const p of players) {
      m[p.playerId] = p.username;
    }
    return m;
  }, [players]);

  const spaceShooterTop10 = useMemo(() => {
    return [...scores]
      .filter((s: GameScore) => s.gameId === "space-shooter")
      .sort((a: GameScore, b: GameScore) => Number(b.score - a.score))
      .slice(0, 10);
  }, [scores]);

  const { data: grandRankings = [] } = useGrandLeaderboard(20);

  function formatDate(ns: bigint): string {
    const ms = Number(ns / 1_000_000n);
    return new Date(ms).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const LB_HEADERS = [
    "Rank",
    "Username",
    "Score",
    "Enemies Killed",
    "Waves",
    "Date",
    "",
  ];

  return (
    <main
      className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8"
      data-ocid="game-leaderboards.section"
    >
      <div className="mb-6">
        <h2 className="font-display font-bold text-xl text-foreground tracking-wide flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Game Leaderboards
        </h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          Top 10 scores per game. Delete any score with confirmation.
        </p>
      </div>

      {/* Space Shooter Section */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/12">
            <Gamepad2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-foreground tracking-wide text-base">
              Space Shooter Leaderboard
            </h3>
            <p className="text-muted-foreground text-xs font-mono">
              game-id: space-shooter
            </p>
          </div>
          <Badge
            variant="outline"
            className="ml-auto text-xs font-mono bg-primary/8 text-primary border-primary/30"
          >
            Top {Math.min(spaceShooterTop10.length, 10)}
          </Badge>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden card-elevated">
          <div className="overflow-x-auto" data-ocid="game-leaderboards.table">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 bg-muted/40">
                  {LB_HEADERS.map((col) => (
                    <TableHead
                      key={col}
                      className="text-muted-foreground font-display text-xs tracking-widest uppercase whitespace-nowrap py-3"
                    >
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <>
                    {LB_SKEL_IDS.map((rowId) => (
                      <TableRow key={rowId} className="border-border/40">
                        {LB_COL_IDS.map((colId) => (
                          <TableCell key={`${rowId}-${colId}`}>
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </>
                ) : scoresError ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-destructive text-sm"
                      data-ocid="game-leaderboards.error_state"
                    >
                      Failed to load scores. Please try again.
                    </TableCell>
                  </TableRow>
                ) : spaceShooterTop10.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-48 text-center"
                      data-ocid="game-leaderboards.empty_state"
                    >
                      <div className="flex flex-col items-center gap-3 py-8">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-muted/50">
                          <Trophy className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-display font-semibold text-foreground">
                            No scores yet
                          </p>
                          <p className="text-muted-foreground text-sm mt-1">
                            Scores will appear here once players finish a game.
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  spaceShooterTop10.map((score: GameScore, i: number) => (
                    <TableRow
                      key={score.scoreId}
                      className="border-border/40 hover:bg-muted/20 transition-colors"
                      data-ocid={`game-leaderboards.item.${i + 1}`}
                    >
                      <TableCell className="font-mono text-sm w-12">
                        <span
                          className={`font-bold ${
                            i === 0
                              ? "text-yellow-500"
                              : i === 1
                                ? "text-slate-400"
                                : i === 2
                                  ? "text-amber-600"
                                  : "text-muted-foreground"
                          }`}
                        >
                          #{i + 1}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {playerMap[score.playerId] ?? score.playerId}
                      </TableCell>
                      <TableCell className="font-mono font-bold text-primary tabular-nums">
                        {Number(score.score).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-foreground tabular-nums">
                        {Number(score.killedEnemies).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-foreground tabular-nums">
                        {Number(score.wavesCleared)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                        {formatDate(score.achievedAt)}
                      </TableCell>
                      <TableCell>
                        {confirmDeleteScoreId === score.scoreId ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-destructive font-mono whitespace-nowrap">
                              Are you sure?
                            </span>
                            <button
                              type="button"
                              data-ocid={`game-leaderboards.cancel_button.${i + 1}`}
                              onClick={() => setConfirmDeleteScoreId(null)}
                              className="text-[10px] px-2 py-1 rounded border border-border text-muted-foreground hover:text-foreground transition-colors"
                            >
                              No
                            </button>
                            <button
                              type="button"
                              data-ocid={`game-leaderboards.confirm_button.${i + 1}`}
                              disabled={isDeletingScore}
                              onClick={() =>
                                deleteScore(score.scoreId, {
                                  onSuccess: () =>
                                    setConfirmDeleteScoreId(null),
                                })
                              }
                              className="text-[10px] px-2 py-1 rounded bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors flex items-center gap-1 disabled:opacity-60"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                              {isDeletingScore ? "…" : "Yes"}
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            data-ocid={`game-leaderboards.delete_button.${i + 1}`}
                            aria-label={`Delete score from ${playerMap[score.playerId] ?? score.playerId}`}
                            onClick={() =>
                              setConfirmDeleteScoreId(score.scoreId)
                            }
                            className="p-1.5 rounded-md text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Grand Arena Rankings */}
      <div className="mt-10">
        <div className="mb-4">
          <h3 className="font-display font-bold text-lg text-foreground tracking-wide flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Grand Arena Rankings
          </h3>
          <p className="text-muted-foreground text-sm mt-0.5">
            Cumulative total scores across all games — top 20 players.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden card-elevated">
          <div
            className="overflow-x-auto"
            data-ocid="admin.grand-rankings.table"
          >
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 bg-muted/40">
                  {["Rank", "Username", "Grand Score"].map((col) => (
                    <TableHead
                      key={col}
                      className="text-muted-foreground font-display text-xs tracking-widest uppercase whitespace-nowrap py-3"
                    >
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {grandRankings.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-32 text-center"
                      data-ocid="admin.grand-rankings.empty_state"
                    >
                      <div className="flex flex-col items-center gap-2 py-6">
                        <Trophy className="w-8 h-8 text-muted-foreground opacity-40" />
                        <p className="text-muted-foreground text-sm">
                          No grand rankings yet — scores appear once players
                          submit.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  grandRankings.map((gr) => (
                    <TableRow
                      key={`admin-gr-${Number(gr.rank)}`}
                      className="border-border/40 hover:bg-muted/20 transition-colors"
                      data-ocid={`admin.grand-rankings.item.${Number(gr.rank)}`}
                    >
                      <TableCell className="font-mono text-sm w-16">
                        <span
                          className={`font-bold ${
                            Number(gr.rank) === 1
                              ? "text-yellow-500"
                              : Number(gr.rank) === 2
                                ? "text-slate-400"
                                : Number(gr.rank) === 3
                                  ? "text-amber-600"
                                  : "text-muted-foreground"
                          }`}
                        >
                          #{Number(gr.rank)}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium text-foreground">
                        {gr.username}
                      </TableCell>
                      <TableCell className="font-mono font-bold text-primary tabular-nums">
                        {Number(gr.score).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ onLock }: { onLock: () => void }) {
  const { data: applications = [], isLoading } = useApplications();
  const { mutate: deleteApplication, isPending: isDeleting } =
    useDeleteApplication();
  const { mutate: approveApplication, isPending: isApproving } =
    useApproveApplication();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<
    "applications" | "calendar" | "game-players" | "game-leaderboards"
  >("applications");
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<bigint | null>(null);
  const [confirmApproveId, setConfirmApproveId] = useState<bigint | null>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedApplication(null);
    }
    if (selectedApplication) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedApplication]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const sorted = [...applications].sort((a, b) =>
      Number(b.submittedAt - a.submittedAt),
    );
    if (!q) return sorted;
    return sorted.filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q),
    );
  }, [applications, search]);

  function handleRowApprove(app: Application, e: React.MouseEvent) {
    e.stopPropagation();
    setConfirmApproveId(app.id);
  }

  function handleConfirmApprove(id: bigint) {
    approveApplication(id, {
      onSuccess: () => {
        setConfirmApproveId(null);
        setSelectedApplication(null);
      },
    });
  }

  const TABLE_HEADERS = [
    "#",
    "Date Submitted",
    "Full Name",
    "Email",
    "Phone",
    "Year",
    "Department",
    "Why They Want to Join",
    "Prior Experience",
    "",
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header */}
      <header className="bg-card border-b border-primary/20 sticky top-0 z-10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Terminal className="w-5 h-5 flex-shrink-0 text-primary" />
            <span className="font-display font-bold text-foreground tracking-wider text-sm sm:text-base truncate">
              ADMIN DASHBOARD
            </span>
            <Badge
              data-ocid="submission-count"
              className="text-xs font-mono hidden sm:flex items-center gap-1 flex-shrink-0 bg-primary/12 text-primary border-primary/30"
              variant="outline"
            >
              <Users className="w-3 h-3" />
              {isLoading ? "…" : `${applications.length} applications`}
            </Badge>
          </div>

          <Button
            data-ocid="lock-btn"
            onClick={onLock}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-smooth text-xs flex-shrink-0"
          >
            <Lock className="w-3.5 h-3.5" />
            Lock
          </Button>
        </div>
      </header>

      {/* Tab bar */}
      <div className="border-b border-border bg-card">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="flex gap-0" data-ocid="admin-tabs">
            <button
              type="button"
              onClick={() => setActiveTab("applications")}
              data-ocid="admin-tab.applications"
              className={`flex items-center gap-2 px-4 py-3 text-sm font-display font-semibold border-b-2 transition-colors ${
                activeTab === "applications"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="w-4 h-4" />
              Member Applications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("calendar")}
              data-ocid="admin-tab.calendar"
              className={`flex items-center gap-2 px-4 py-3 text-sm font-display font-semibold border-b-2 transition-colors ${
                activeTab === "calendar"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              Edit Calendar
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("game-players")}
              data-ocid="admin-tab.game-players"
              className={`flex items-center gap-2 px-4 py-3 text-sm font-display font-semibold border-b-2 transition-colors ${
                activeTab === "game-players"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              Game Players
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("game-leaderboards")}
              data-ocid="admin-tab.game-leaderboards"
              className={`flex items-center gap-2 px-4 py-3 text-sm font-display font-semibold border-b-2 transition-colors ${
                activeTab === "game-leaderboards"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Trophy className="w-4 h-4" />
              Game Leaderboards
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      {activeTab === "calendar" ? (
        <EditCalendarTab />
      ) : activeTab === "game-players" ? (
        <GamePlayersTab />
      ) : activeTab === "game-leaderboards" ? (
        <GameLeaderboardsTab />
      ) : (
        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display font-bold text-xl text-foreground tracking-wide">
                Member Applications
              </h2>
              <p className="text-muted-foreground text-sm mt-0.5">
                {isLoading
                  ? "Loading submissions…"
                  : `${filtered.length} of ${applications.length} shown`}
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                data-ocid="search-input"
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/40"
              />
            </div>
          </div>

          {/* Table card */}
          <div className="bg-card border border-border rounded-xl overflow-hidden card-elevated">
            <div className="overflow-x-auto" data-ocid="applications-table">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/60 bg-muted/40">
                    {TABLE_HEADERS.map((col) => (
                      <TableHead
                        key={col}
                        className="text-muted-foreground font-display text-xs tracking-widest uppercase whitespace-nowrap py-3"
                      >
                        {col}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableSkeleton />
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={10}
                        className="h-48 text-center"
                        data-ocid="empty-state"
                      >
                        <div className="flex flex-col items-center gap-3 py-8">
                          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-muted/50">
                            <Users className="w-6 h-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-display font-semibold text-foreground">
                              {search
                                ? "No matches found"
                                : "No applications yet"}
                            </p>
                            <p className="text-muted-foreground text-sm mt-1">
                              {search
                                ? "Try a different name or email address."
                                : "Submissions from the Join Now form will appear here."}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((app, i) => (
                      <AppRow
                        key={String(app.id)}
                        app={app}
                        index={i}
                        onClick={() => setSelectedApplication(app)}
                        onDelete={(e) => {
                          e.stopPropagation();
                          setConfirmDeleteId(app.id);
                        }}
                        onApprove={(e) => handleRowApprove(app, e)}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile count */}
          {!isLoading && applications.length > 0 && (
            <p className="text-muted-foreground text-xs text-center mt-4 sm:hidden">
              {filtered.length} of {applications.length} applications
            </p>
          )}
        </main>
      )}

      {/* Approve Confirmation Popup */}
      {confirmApproveId !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          data-ocid="approve-confirm.dialog"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setConfirmApproveId(null)}
            aria-label="Cancel approval"
          />
          <div className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl card-elevated p-6 text-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 bg-emerald-500/10">
              <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-display font-bold text-foreground text-base mb-2">
              Approve Application
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Are you sure you want to approve this application? The status will
              be permanently set to{" "}
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                Approved
              </span>{" "}
              and cannot be deleted afterward.
            </p>
            <div className="flex items-center gap-3 justify-center">
              <Button
                type="button"
                data-ocid="approve-confirm.cancel_button"
                variant="outline"
                size="sm"
                onClick={() => setConfirmApproveId(null)}
                className="border-border text-muted-foreground hover:text-foreground text-xs flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                data-ocid="approve-confirm.confirm_button"
                size="sm"
                disabled={isApproving}
                onClick={() => handleConfirmApprove(confirmApproveId)}
                className="bg-emerald-600 text-white hover:bg-emerald-700 transition-smooth text-xs flex items-center gap-1.5 flex-1"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {isApproving ? "Approving…" : "Yes, Approve"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Standalone Row-Delete Confirmation Dialog (fires when modal is NOT open) */}
      {confirmDeleteId !== null &&
        selectedApplication === null &&
        (() => {
          const targetApp =
            applications.find((a) => a.id === confirmDeleteId) ?? null;
          return (
            <div
              className="fixed inset-0 z-[60] flex items-center justify-center p-4"
              data-ocid="delete-confirm.dialog"
            >
              <button
                type="button"
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setConfirmDeleteId(null)}
                aria-label="Cancel delete"
              />
              <div className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl card-elevated p-6 text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 bg-destructive/10">
                  <Trash2 className="w-6 h-6 text-destructive" />
                </div>
                <h3 className="font-display font-bold text-foreground text-base mb-2">
                  Delete Application
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-1">
                  Are you sure you want to delete the application from{" "}
                  <span className="text-foreground font-medium">
                    {targetApp?.name ?? "this applicant"}
                  </span>
                  ?
                </p>
                <p className="text-muted-foreground/70 text-xs mb-6 font-mono">
                  This action cannot be undone.
                </p>
                <div className="flex items-center gap-3 justify-center">
                  <Button
                    type="button"
                    data-ocid="delete-confirm.cancel_button"
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmDeleteId(null)}
                    className="border-border text-muted-foreground hover:text-foreground text-xs flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    data-ocid="delete-confirm.confirm_button"
                    size="sm"
                    disabled={isDeleting}
                    onClick={() => {
                      deleteApplication(confirmDeleteId, {
                        onSuccess: () => {
                          setConfirmDeleteId(null);
                        },
                      });
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-smooth text-xs flex items-center gap-1.5 flex-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {isDeleting ? "Deleting..." : "Yes, Delete"}
                  </Button>
                </div>
              </div>
            </div>
          );
        })()}

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div
          className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6"
          data-ocid="application-detail.dialog"
        >
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedApplication(null)}
            aria-label="Close modal"
          />

          {/* Modal card */}
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl card-elevated"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-card/95 backdrop-blur-sm">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-lg text-foreground tracking-wide">
                    Application Details
                  </h3>
                  {isApproved(selectedApplication) ? (
                    <Badge
                      variant="outline"
                      className="border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 font-mono text-[10px] uppercase tracking-wider"
                    >
                      Approved
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-border text-muted-foreground bg-muted/40 font-mono text-[10px] uppercase tracking-wider"
                    >
                      Pending
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-xs mt-0.5 font-mono">
                  Submitted {formatTimestamp(selectedApplication.submittedAt)}
                </p>
              </div>
              <button
                type="button"
                data-ocid="application-detail.close_button"
                onClick={() => setSelectedApplication(null)}
                className="p-2 rounded-lg hover:bg-muted/60 transition-colors text-muted-foreground hover:text-foreground"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-6">
              {/* Short fields grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                    Full Name
                  </p>
                  <p className="text-foreground font-medium">
                    {selectedApplication.name}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                    Email
                  </p>
                  <a
                    href={`mailto:${selectedApplication.email}`}
                    className="text-primary hover:opacity-80 transition-colors font-medium"
                  >
                    {selectedApplication.email}
                  </a>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                    Phone
                  </p>
                  <p className="text-foreground font-mono text-sm">
                    {selectedApplication.phone}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                    Year of Study
                  </p>
                  <Badge
                    variant="outline"
                    className="border-border text-muted-foreground font-mono text-xs"
                  >
                    {selectedApplication.yearOfStudy}
                  </Badge>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                    Department
                  </p>
                  <p className="text-foreground">
                    {selectedApplication.department}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-border" />

              {/* Long text fields */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                    Why They Want to Join
                  </p>
                  <div className="bg-muted/30 border border-border/50 rounded-lg p-4">
                    <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedApplication.reasonForJoining}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                    Prior Experience
                  </p>
                  <div className="bg-muted/30 border border-border/50 rounded-lg p-4">
                    {selectedApplication.priorExperience ? (
                      <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedApplication.priorExperience}
                      </p>
                    ) : (
                      <p className="italic text-muted-foreground/60 text-sm">
                        No prior experience provided.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 z-10 px-6 py-4 border-t border-border bg-card/95 backdrop-blur-sm flex items-center justify-between gap-3">
              {confirmDeleteId === selectedApplication.id ? (
                <>
                  <span className="text-xs text-destructive font-mono">
                    Confirm delete? This cannot be undone.
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      data-ocid="application-detail.cancel_button"
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmDeleteId(null)}
                      className="border-border text-muted-foreground hover:text-foreground text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      data-ocid="application-detail.confirm_button"
                      size="sm"
                      disabled={isDeleting}
                      onClick={() => {
                        // Use confirmDeleteId (not selectedApplication.id) as the source of truth
                        deleteApplication(confirmDeleteId, {
                          onSuccess: () => {
                            setConfirmDeleteId(null);
                            setSelectedApplication(null);
                          },
                        });
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {isDeleting ? "Deleting…" : "Delete"}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {!isApproved(selectedApplication) && (
                    <Button
                      type="button"
                      data-ocid="application-detail.delete_button"
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmDeleteId(selectedApplication.id)}
                      className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:border-destructive/60 transition-smooth text-xs flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Application
                    </Button>
                  )}
                  <div className="flex items-center gap-2 ml-auto">
                    {!isApproved(selectedApplication) && (
                      <Button
                        type="button"
                        data-ocid="application-detail.approve_button"
                        size="sm"
                        disabled={isApproving}
                        onClick={() =>
                          setConfirmApproveId(selectedApplication.id)
                        }
                        className="bg-emerald-600 text-white hover:bg-emerald-700 transition-smooth text-xs flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Approve
                      </Button>
                    )}
                    <Button
                      type="button"
                      data-ocid="application-detail.close_button.footer"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedApplication(null)}
                      className="border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-smooth text-xs"
                    >
                      Close
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) {
    return <LockScreen onUnlock={() => setUnlocked(true)} />;
  }

  return <Dashboard onLock={() => setUnlocked(false)} />;
}
