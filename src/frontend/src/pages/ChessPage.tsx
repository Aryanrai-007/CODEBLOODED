import { Button } from "@/components/ui/button";
import { useChessAuth } from "@/hooks/useChessAuth";
import { Crown, LogOut, RotateCcw, UserPlus, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

/* ──────────────────────────── Types ──────────────────────────── */

type Color = "w" | "b";
type PieceType = "p" | "r" | "n" | "b" | "q" | "k";

interface Piece {
  type: PieceType;
  color: Color;
}

interface Square {
  row: number;
  col: number;
}

interface Move {
  from: Square;
  to: Square;
  piece: Piece;
  captured: Piece | null;
  promotion?: PieceType;
}

/* ──────────────────────────── Unicode pieces ──────────────────────────── */

const PIECE_UNICODE: Record<Color, Record<PieceType, string>> = {
  w: { k: "♔", q: "♕", r: "♖", b: "♗", n: "♘", p: "♙" },
  b: { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" },
};

/* ──────────────────────────── Initial board ──────────────────────────── */

function createInitialBoard(): (Piece | null)[][] {
  const board: (Piece | null)[][] = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => null),
  );
  const backRow: PieceType[] = ["r", "n", "b", "q", "k", "b", "n", "r"];
  for (let c = 0; c < 8; c++) {
    board[0][c] = { type: backRow[c], color: "b" };
    board[1][c] = { type: "p", color: "b" };
    board[6][c] = { type: "p", color: "w" };
    board[7][c] = { type: backRow[c], color: "w" };
  }
  return board;
}

/* ──────────────────────────── Move validation ──────────────────────────── */

function isInBounds(r: number, c: number) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function cloneBoard(board: (Piece | null)[][]) {
  return board.map((row) => [...row]);
}

function findKing(board: (Piece | null)[][], color: Color): Square | null {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type === "k" && p.color === color) return { row: r, col: c };
    }
  }
  return null;
}

function isSquareAttacked(
  board: (Piece | null)[][],
  square: Square,
  byColor: Color,
): boolean {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p || p.color !== byColor) continue;
      if (canAttack({ row: r, col: c }, square, p, board)) return true;
    }
  }
  return false;
}

function canAttack(
  from: Square,
  to: Square,
  piece: Piece,
  board: (Piece | null)[][],
): boolean {
  const dr = to.row - from.row;
  const dc = to.col - from.col;
  const adR = Math.abs(dr);
  const adC = Math.abs(dc);

  switch (piece.type) {
    case "p": {
      const dir = piece.color === "w" ? -1 : 1;
      return dr === dir && Math.abs(dc) === 1 && board[to.row][to.col] !== null;
    }
    case "n":
      return (adR === 2 && adC === 1) || (adR === 1 && adC === 2);
    case "b":
      if (adR !== adC) return false;
      return pathClear(from, to, board);
    case "r":
      if (dr !== 0 && dc !== 0) return false;
      return pathClear(from, to, board);
    case "q":
      if (adR !== adC && dr !== 0 && dc !== 0) return false;
      return pathClear(from, to, board);
    case "k":
      return adR <= 1 && adC <= 1;
    default:
      return false;
  }
}

function pathClear(
  from: Square,
  to: Square,
  board: (Piece | null)[][],
): boolean {
  const dr = Math.sign(to.row - from.row);
  const dc = Math.sign(to.col - from.col);
  let r = from.row + dr;
  let c = from.col + dc;
  while (r !== to.row || c !== to.col) {
    if (board[r][c] !== null) return false;
    r += dr;
    c += dc;
  }
  return true;
}

function getValidMoves(
  board: (Piece | null)[][],
  from: Square,
  turn: Color,
): Square[] {
  const piece = board[from.row][from.col];
  if (!piece || piece.color !== turn) return [];

  const moves: Square[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const to = { row: r, col: c };
      if (isValidMove(board, from, to, turn)) {
        moves.push(to);
      }
    }
  }
  return moves;
}

function isValidMove(
  board: (Piece | null)[][],
  from: Square,
  to: Square,
  turn: Color,
): boolean {
  if (!isInBounds(to.row, to.col)) return false;
  if (from.row === to.row && from.col === to.col) return false;

  const piece = board[from.row][from.col];
  if (!piece || piece.color !== turn) return false;

  const target = board[to.row][to.col];
  if (target && target.color === turn) return false;

  const dr = to.row - from.row;
  const dc = to.col - from.col;
  const adR = Math.abs(dr);
  const adC = Math.abs(dc);

  let valid = false;
  switch (piece.type) {
    case "p": {
      const dir = piece.color === "w" ? -1 : 1;
      const startRow = piece.color === "w" ? 6 : 1;
      if (dc === 0 && dr === dir && !target) valid = true;
      if (dc === 0 && dr === 2 * dir && from.row === startRow && !target) {
        const mid = board[from.row + dir][from.col];
        if (!mid) valid = true;
      }
      if (Math.abs(dc) === 1 && dr === dir && target) valid = true;
      break;
    }
    case "n":
      valid = (adR === 2 && adC === 1) || (adR === 1 && adC === 2);
      break;
    case "b":
      valid = adR === adC && pathClear(from, to, board);
      break;
    case "r":
      valid = (dr === 0 || dc === 0) && pathClear(from, to, board);
      break;
    case "q":
      valid =
        (adR === adC || dr === 0 || dc === 0) && pathClear(from, to, board);
      break;
    case "k":
      valid = adR <= 1 && adC <= 1;
      break;
  }

  if (!valid) return false;

  // Simulate move and check if king is in check
  const sim = cloneBoard(board);
  sim[to.row][to.col] = piece;
  sim[from.row][from.col] = null;

  // Auto-promote pawn
  if (piece.type === "p" && (to.row === 0 || to.row === 7)) {
    sim[to.row][to.col] = { type: "q", color: piece.color };
  }

  const kingPos = findKing(sim, turn);
  if (!kingPos) return false;
  const opp = turn === "w" ? "b" : "w";
  return !isSquareAttacked(sim, kingPos, opp);
}

function isInCheck(board: (Piece | null)[][], color: Color): boolean {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  const opp = color === "w" ? "b" : "w";
  return isSquareAttacked(board, kingPos, opp);
}

function hasAnyLegalMove(board: (Piece | null)[][], color: Color): boolean {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p || p.color !== color) continue;
      const from = { row: r, col: c };
      for (let tr = 0; tr < 8; tr++) {
        for (let tc = 0; tc < 8; tc++) {
          if (isValidMove(board, from, { row: tr, col: tc }, color)) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

/* ──────────────────────────── Component ──────────────────────────── */

export function ChessPage() {
  const {
    currentPlayer,
    isLoggedIn,
    isLoading,
    error,
    registerChessPlayer,
    loginChessPlayer,
    logoutChessPlayer,
    clearError,
  } = useChessAuth();

  const [board, setBoard] = useState<(Piece | null)[][]>(createInitialBoard);
  const [turn, setTurn] = useState<Color>("w");
  const [selected, setSelected] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Square[]>([]);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [capturedWhite, setCapturedWhite] = useState<Piece[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<Piece[]>([]);
  const [gameOver, setGameOver] = useState<"checkmate" | "stalemate" | null>(
    null,
  );
  const [winner, setWinner] = useState<Color | null>(null);

  const status = useMemo(() => {
    if (gameOver === "checkmate") {
      return winner === "w" ? "Checkmate! White wins" : "Checkmate! Black wins";
    }
    if (gameOver === "stalemate") return "Stalemate! Draw";
    const inCheck = isInCheck(board, turn);
    return `${turn === "w" ? "White" : "Black"} to move${inCheck ? " — Check!" : ""}`;
  }, [board, turn, gameOver, winner]);

  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      if (gameOver) return;

      const clickedPiece = board[row][col];

      // If a piece of current turn is clicked, select it
      if (clickedPiece && clickedPiece.color === turn) {
        setSelected({ row, col });
        setValidMoves(getValidMoves(board, { row, col }, turn));
        return;
      }

      // If a piece is already selected, try to move
      if (selected) {
        const target = { row, col };
        const isValid = validMoves.some(
          (m) => m.row === target.row && m.col === target.col,
        );

        if (isValid) {
          const piece = board[selected.row][selected.col]!;
          const captured = board[target.row][target.col];

          const newBoard = cloneBoard(board);
          newBoard[target.row][target.col] = piece;
          newBoard[selected.row][selected.col] = null;

          // Auto-promote to queen
          if (piece.type === "p" && (target.row === 0 || target.row === 7)) {
            newBoard[target.row][target.col] = {
              type: "q",
              color: piece.color,
            };
          }

          // Track captures
          if (captured) {
            if (captured.color === "w") {
              setCapturedWhite((prev) => [...prev, captured]);
            } else {
              setCapturedBlack((prev) => [...prev, captured]);
            }
          }

          setBoard(newBoard);
          setLastMove({ from: selected, to: target, piece, captured });
          setSelected(null);
          setValidMoves([]);

          const nextTurn = turn === "w" ? "b" : "w";
          setTurn(nextTurn);

          // Check game end
          const hasMoves = hasAnyLegalMove(newBoard, nextTurn);
          const inCheck = isInCheck(newBoard, nextTurn);
          if (!hasMoves) {
            if (inCheck) {
              setGameOver("checkmate");
              setWinner(turn);
            } else {
              setGameOver("stalemate");
            }
          }
        } else {
          setSelected(null);
          setValidMoves([]);
        }
      }
    },
    [board, turn, selected, validMoves, gameOver],
  );

  const resetGame = useCallback(() => {
    setBoard(createInitialBoard());
    setTurn("w");
    setSelected(null);
    setValidMoves([]);
    setLastMove(null);
    setCapturedWhite([]);
    setCapturedBlack([]);
    setGameOver(null);
    setWinner(null);
  }, []);

  // Keyboard: Escape deselects
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSelected(null);
        setValidMoves([]);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!isLoggedIn) {
    return (
      <AuthGate
        isLoading={isLoading}
        error={error}
        onRegister={registerChessPlayer}
        onLogin={loginChessPlayer}
        clearError={clearError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/12 flex items-center justify-center">
              <Crown className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-foreground tracking-wide">
                Chess Arena
              </h1>
              <p className="text-muted-foreground text-xs font-mono">
                Welcome,{" "}
                <span className="text-primary font-semibold">
                  {currentPlayer!.username}
                </span>
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={logoutChessPlayer}
            className="flex items-center gap-2 border-border text-muted-foreground hover:text-foreground"
            data-ocid="chess-logout-button"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Game area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 gap-6">
        {/* Status banner */}
        <div
          className={`w-full max-w-xl text-center px-4 py-3 rounded-xl border font-display font-semibold tracking-wide text-sm transition-all ${
            gameOver === "checkmate"
              ? "bg-primary/10 border-primary/30 text-primary"
              : gameOver === "stalemate"
                ? "bg-muted border-border text-muted-foreground"
                : isInCheck(board, turn)
                  ? "bg-destructive/10 border-destructive/30 text-destructive"
                  : "bg-card border-border text-foreground"
          }`}
          data-ocid="chess-status-banner"
        >
          {status}
        </div>

        {/* Captured pieces — top (White's captures = black pieces) */}
        <div className="w-full max-w-xl flex items-center gap-1 min-h-[28px]">
          <span className="text-xs text-muted-foreground font-mono mr-2">
            White captured:
          </span>
          {capturedWhite.length === 0 ? (
            <span className="text-xs text-muted-foreground/50">—</span>
          ) : (
            capturedWhite.map((p, i) => (
              <span
                key={`${p.color}-${p.type}-${i}`}
                className="text-lg leading-none select-none"
              >
                {PIECE_UNICODE[p.color][p.type]}
              </span>
            ))
          )}
        </div>

        {/* Board */}
        <div className="relative">
          <div
            className="grid grid-cols-8 gap-0 border-2 border-border rounded-lg overflow-hidden shadow-lg"
            style={{ width: "min(90vw, 560px)", height: "min(90vw, 560px)" }}
            data-ocid="chess-board"
          >
            {Array.from({ length: 64 }, (_, i) => {
              const row = Math.floor(i / 8);
              const col = i % 8;
              const isLight = (row + col) % 2 === 0;
              const piece = board[row][col];
              const isSelected =
                selected && selected.row === row && selected.col === col;
              const isValidMove = validMoves.some(
                (m) => m.row === row && m.col === col,
              );
              const isLastMove =
                lastMove &&
                ((lastMove.from.row === row && lastMove.from.col === col) ||
                  (lastMove.to.row === row && lastMove.to.col === col));

              return (
                <button
                  key={`${row}-${col}`}
                  type="button"
                  onClick={() => handleSquareClick(row, col)}
                  className={`relative flex items-center justify-center select-none transition-colors duration-150 ${
                    isLight
                      ? "bg-[#f0d9b5] dark:bg-[#b58863]/60"
                      : "bg-[#b58863] dark:bg-[#8b5a2b]/70"
                  } ${isSelected ? "ring-2 ring-primary ring-inset z-10" : ""} ${
                    isLastMove ? "brightness-110" : ""
                  }`}
                  style={{ aspectRatio: "1" }}
                  data-ocid={`chess-square-${row}-${col}`}
                >
                  {/* Valid move dot */}
                  {isValidMove && !piece && (
                    <div className="w-3 h-3 rounded-full bg-primary/50 dark:bg-primary/60" />
                  )}
                  {/* Valid capture ring */}
                  {isValidMove && piece && (
                    <div className="absolute inset-0 border-2 border-primary/60 dark:border-primary/70 rounded-sm" />
                  )}
                  {/* Piece */}
                  {piece && (
                    <span
                      className={`text-3xl sm:text-4xl leading-none select-none transition-transform duration-150 ${
                        isSelected ? "scale-110" : ""
                      }`}
                      style={{
                        color: piece.color === "w" ? "#1a1a1a" : "#0a0a0a",
                        textShadow:
                          piece.color === "w"
                            ? "0 0 2px rgba(255,255,255,0.6)"
                            : "0 0 2px rgba(0,0,0,0.4)",
                      }}
                    >
                      {PIECE_UNICODE[piece.color][piece.type]}
                    </span>
                  )}
                  {/* Coordinate labels */}
                  {col === 0 && (
                    <span className="absolute top-0.5 left-1 text-[10px] font-mono leading-none opacity-60 text-foreground/70">
                      {8 - row}
                    </span>
                  )}
                  {row === 7 && (
                    <span className="absolute bottom-0.5 right-1 text-[10px] font-mono leading-none opacity-60 text-foreground/70">
                      {String.fromCharCode(97 + col)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Captured pieces — bottom (Black's captures = white pieces) */}
        <div className="w-full max-w-xl flex items-center gap-1 min-h-[28px]">
          <span className="text-xs text-muted-foreground font-mono mr-2">
            Black captured:
          </span>
          {capturedBlack.length === 0 ? (
            <span className="text-xs text-muted-foreground/50">—</span>
          ) : (
            capturedBlack.map((p, i) => (
              <span
                key={`${p.color}-${p.type}-${i}`}
                className="text-lg leading-none select-none"
              >
                {PIECE_UNICODE[p.color][p.type]}
              </span>
            ))
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetGame}
            className="flex items-center gap-2 border-border text-muted-foreground hover:text-foreground"
            data-ocid="chess-new-game-button"
          >
            <RotateCcw className="w-4 h-4" />
            New Game
          </Button>
        </div>
      </main>
    </div>
  );
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
  onRegister: (u: string) => Promise<boolean>;
  onLogin: (u: string) => Promise<boolean>;
  clearError: () => void;
}) {
  const [tab, setTab] = useState<"login" | "create">("login");
  const [username, setUsername] = useState("");
  const [validationError, setValidationError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError("");
    clearError();
    if (!username.trim()) {
      setValidationError("Username is required.");
      return;
    }
    if (tab === "create") {
      await onRegister(username.trim());
    } else {
      await onLogin(username.trim());
    }
  }

  const displayError = validationError || error;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-primary/12 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display font-bold text-2xl text-foreground tracking-wide">
            Chess Arena
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create an account or log in to play.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 card-elevated">
          {/* Tabs */}
          <div className="flex rounded-lg mb-6 p-1 bg-muted/40">
            {(["login", "create"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTab(t);
                  setValidationError("");
                  clearError();
                }}
                className={`flex-1 py-2 rounded-md text-sm font-display font-semibold tracking-wide transition-all duration-200 ${
                  tab === t
                    ? "bg-primary/20 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid={`chess-auth-tab-${t}`}
              >
                {t === "login" ? (
                  <span className="flex items-center justify-center gap-2">
                    <Users className="w-4 h-4" />
                    Login
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Create Account
                  </span>
                )}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="chess-username"
                className="block text-xs font-display uppercase tracking-wider text-muted-foreground mb-1.5"
              >
                Username
              </label>
              <input
                id="chess-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 rounded-lg text-sm bg-muted/40 border border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40 outline-none transition-all"
                data-ocid="chess-auth-username-input"
              />
            </div>

            {displayError && (
              <div
                className="px-3 py-2 rounded-lg text-sm bg-destructive/10 text-destructive border border-destructive/30"
                data-ocid="chess-auth-error-state"
              >
                {displayError}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary h-11"
              data-ocid="chess-auth-submit-button"
            >
              {isLoading
                ? "Connecting…"
                : tab === "login"
                  ? "Login"
                  : "Create Account"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
