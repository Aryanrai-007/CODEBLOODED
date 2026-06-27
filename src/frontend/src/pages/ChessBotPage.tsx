import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useChessAuth } from "../hooks/useChessAuth";
import { useSubmitChessScore } from "../hooks/useChessScores";
import {
  BOTS,
  type BotMove,
  type Piece as BotPiece,
  getBotMove,
} from "../lib/chessBots";

type Piece =
  | "p"
  | "n"
  | "b"
  | "r"
  | "q"
  | "k"
  | "P"
  | "N"
  | "B"
  | "R"
  | "Q"
  | "K"
  | null;
type Square = { row: number; col: number };

const INITIAL_BOARD: Piece[][] = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

const PIECE_UNICODE: Record<string, string> = {
  P: "♙",
  N: "♘",
  B: "♗",
  R: "♖",
  Q: "♕",
  K: "♔",
  p: "♟",
  n: "♞",
  b: "♝",
  r: "♜",
  q: "♛",
  k: "♚",
};

function cloneBoard(b: Piece[][]): Piece[][] {
  return b.map((row) => [...row]);
}

function isWhitePiece(p: Piece): boolean {
  return p !== null && p === p.toUpperCase();
}

function getPieceColor(p: Piece): "w" | "b" | null {
  if (!p) return null;
  return p === p.toUpperCase() ? "w" : "b";
}

function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}

function getLegalMoves(
  board: Piece[][],
  square: Square,
  color: "w" | "b",
): Square[] {
  const piece = board[square.row][square.col];
  if (!piece) return [];
  const pieceColor = getPieceColor(piece);
  if (pieceColor !== color) return [];
  const moves: Square[] = [];
  const p = piece.toLowerCase();

  const addIfValid = (r: number, c: number) => {
    if (!inBounds(r, c)) return false;
    const target = board[r][c];
    if (!target) {
      moves.push({ row: r, col: c });
      return true;
    }
    const tc = getPieceColor(target);
    if (tc !== color) {
      moves.push({ row: r, col: c });
    }
    return false;
  };

  if (p === "p") {
    const dir = color === "w" ? -1 : 1;
    const startRow = color === "w" ? 6 : 1;
    const fr = square.row + dir;
    if (inBounds(fr, square.col) && !board[fr][square.col]) {
      moves.push({ row: fr, col: square.col });
      if (
        square.row === startRow &&
        inBounds(fr + dir, square.col) &&
        !board[fr + dir][square.col]
      ) {
        moves.push({ row: fr + dir, col: square.col });
      }
    }
    for (const dc of [-1, 1]) {
      const cr = square.row + dir;
      const cc = square.col + dc;
      if (inBounds(cr, cc)) {
        const target = board[cr][cc];
        if (target && getPieceColor(target) !== color) {
          moves.push({ row: cr, col: cc });
        }
      }
    }
  } else if (p === "n") {
    const deltas = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];
    for (const [dr, dc] of deltas) {
      addIfValid(square.row + dr, square.col + dc);
    }
  } else if (p === "b" || p === "r" || p === "q") {
    const directions: [number, number][] = [];
    if (p === "b" || p === "q") {
      directions.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
    }
    if (p === "r" || p === "q") {
      directions.push([-1, 0], [1, 0], [0, -1], [0, 1]);
    }
    for (const [dr, dc] of directions) {
      for (let i = 1; i < 8; i++) {
        const r = square.row + dr * i;
        const c = square.col + dc * i;
        if (!inBounds(r, c)) break;
        const target = board[r][c];
        if (!target) {
          moves.push({ row: r, col: c });
          continue;
        }
        if (getPieceColor(target) !== color) moves.push({ row: r, col: c });
        break;
      }
    }
  } else if (p === "k") {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        addIfValid(square.row + dr, square.col + dc);
      }
    }
  }

  // Filter out moves that leave own king in check
  const validMoves: Square[] = [];
  for (const m of moves) {
    const test = cloneBoard(board);
    test[m.row][m.col] = test[square.row][square.col];
    test[square.row][square.col] = null;
    if (m.row === 0 && test[m.row][m.col] === "P") test[m.row][m.col] = "Q";
    if (m.row === 7 && test[m.row][m.col] === "p") test[m.row][m.col] = "q";
    if (!isInCheck(test, color)) validMoves.push(m);
  }
  return validMoves;
}

function getAllLegalMoves(
  board: Piece[][],
  color: "w" | "b",
): { from: Square; to: Square }[] {
  const all: { from: Square; to: Square }[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && getPieceColor(p) === color) {
        const moves = getLegalMoves(board, { row: r, col: c }, color);
        for (const m of moves) all.push({ from: { row: r, col: c }, to: m });
      }
    }
  }
  return all;
}

function isInCheck(board: Piece[][], color: "w" | "b"): boolean {
  let kingPos: Square | null = null;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.toLowerCase() === "k" && getPieceColor(p) === color) {
        kingPos = { row: r, col: c };
        break;
      }
    }
    if (kingPos) break;
  }
  if (!kingPos) return false;
  const enemy = color === "w" ? "b" : "w";
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && getPieceColor(p) === enemy) {
        const moves = getLegalMoves(board, { row: r, col: c }, enemy);
        if (moves.some((m) => m.row === kingPos!.row && m.col === kingPos!.col))
          return true;
      }
    }
  }
  return false;
}

function isCheckmate(board: Piece[][], color: "w" | "b"): boolean {
  return isInCheck(board, color) && getAllLegalMoves(board, color).length === 0;
}

function isStalemate(board: Piece[][], color: "w" | "b"): boolean {
  return (
    !isInCheck(board, color) && getAllLegalMoves(board, color).length === 0
  );
}

// Bot commentary lines
const BOT_COMMENTARY: Record<string, string[]> = {
  Undead: ["Grrr...", "Brains...", "Uuuuh...", "*moans*", "Crush..."],
  Bull: ["Charge!", "Stampede!", "Rumble!", "Smash!", "Trample!"],
  Gargoyle: [
    "Stone watches...",
    "You will crack...",
    "I see you...",
    "Turn to dust...",
    "Eternal vigil...",
  ],
  Dragon: [
    "Burn!",
    "My hoard!",
    "Feel the fire!",
    "Wings of flame!",
    "Incinerate!",
  ],
  "Lost Knight": [
    "Forgotten...",
    "My kingdom fell...",
    "I wander still...",
    "Honor remains...",
    "One last charge...",
  ],
  "Sorrow Queen": [
    "Every move is a tear in time...",
    "I mourn the pieces already lost...",
    "Your strategy is but a fleeting shadow...",
    "Checkmate is merely another form of grief...",
    "I have seen a thousand endings...",
  ],
  "Ruin King": [
    "All kingdoms fall before me...",
    "I am the end of all things...",
    "Bow to the ruins...",
    "Your resistance is meaningless...",
    "I have conquered death itself...",
  ],
};

function getBotCommentary(botName: string, moveCount: number): string | null {
  const lines = BOT_COMMENTARY[botName];
  if (!lines || lines.length === 0) return null;
  // Comment every 3-5 moves, more often for harder bots
  const freq = botName === "Ruin King" || botName === "Sorrow Queen" ? 3 : 4;
  if (moveCount > 0 && moveCount % freq === 0) {
    return lines[Math.floor(Math.random() * lines.length)];
  }
  return null;
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const {
    currentPlayer,
    registerChessPlayer,
    loginChessPlayer,
    logoutChessPlayer,
  } = useChessAuth();
  const [username, setUsername] = useState("");
  const [mode, setMode] = useState<"choose" | "create" | "login">("choose");

  if (currentPlayer) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-6 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">
              {currentPlayer.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {currentPlayer.username}
              </p>
              <p className="text-xs text-muted-foreground">
                Player ID: {currentPlayer.playerId}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={logoutChessPlayer}
            className="px-3 py-1.5 text-sm rounded-md bg-muted hover:bg-muted/80 transition-colors text-muted-foreground"
            data-ocid="chess.logout_button"
          >
            Logout
          </button>
        </div>
        {children}
      </div>
    );
  }

  if (mode === "choose") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <h2 className="text-2xl font-display font-bold text-foreground">
          Enter the Arena
        </h2>
        <p className="text-muted-foreground text-center max-w-sm">
          Create a username to track your scores and challenge the bots.
        </p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setMode("create")}
            className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            data-ocid="chess.create_id_button"
          >
            Create ID
          </button>
          <button
            type="button"
            onClick={() => setMode("login")}
            className="px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
            data-ocid="chess.login_button"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    if (mode === "create") await registerChessPlayer(username.trim());
    else await loginChessPlayer(username.trim());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <h2 className="text-2xl font-display font-bold text-foreground">
        {mode === "create" ? "Create Your ID" : "Login"}
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
          className="px-4 py-3 rounded-lg bg-card border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          data-ocid="chess.username_input"
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          data-ocid="chess.submit_auth_button"
        >
          {mode === "create" ? "Create" : "Login"}
        </button>
        <button
          type="button"
          onClick={() => setMode("choose")}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="chess.back_button"
        >
          Back
        </button>
      </form>
    </div>
  );
}

export default function ChessBotPage() {
  const { currentPlayer: chessPlayer } = useChessAuth();
  const submitScore = useSubmitChessScore();

  const [gameMode, setGameMode] = useState<
    "select" | "color-select" | "playing" | "game-over"
  >("select");
  const [selectedBot, setSelectedBot] = useState<(typeof BOTS)[0] | null>(null);
  const [board, setBoard] = useState<Piece[][]>(cloneBoard(INITIAL_BOARD));
  const [currentPlayer, setCurrentPlayer] = useState<"w" | "b">("w");
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [capturedWhite, setCapturedWhite] = useState<Piece[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<Piece[]>([]);
  const [moveCount, setMoveCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [gameResult, setGameResult] = useState<"win" | "loss" | "draw" | null>(
    null,
  );
  const [totalScore, setTotalScore] = useState(0);
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [humanColor, setHumanColor] = useState<"w" | "b">("w");
  const [botMessage, setBotMessage] = useState<string | null>(null);

  const botTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const botMessageTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const boardRef = useRef<Piece[][]>(cloneBoard(INITIAL_BOARD));

  // Keep board ref in sync for stale-closure-safe access
  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  // Timer
  useEffect(() => {
    if (gameMode !== "playing" || !startTime) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [gameMode, startTime]);

  // Convert our board to bot format
  const toBotBoard = useCallback((b: Piece[][]): (BotPiece | null)[][] => {
    return b.map((row) =>
      row.map((p) => {
        if (!p) return null;
        return {
          type: p.toLowerCase() as BotPiece["type"],
          color: p === p.toUpperCase() ? ("w" as const) : ("b" as const),
        };
      }),
    );
  }, []);

  const handleGameOver = useCallback(
    (result: "win" | "loss" | "draw") => {
      setGameResult(result);
      setGameMode("game-over");
      const base = result === "win" ? 100 : result === "draw" ? 50 : 0;
      const capturesBonus = capturedBlack.length * 10;
      const timeBonus = Math.max(0, 300 - elapsedSeconds);
      const total = base + capturesBonus + timeBonus;
      setTotalScore(total);
      if (chessPlayer && selectedBot) {
        submitScore.mutate({
          playerId: chessPlayer.playerId,
          botName: selectedBot.name,
          score: BigInt(total),
          result:
            result === "win" ? "win" : result === "draw" ? "draw" : "loss",
          movesCount: BigInt(moveCount),
        });
      }
    },
    [
      capturedBlack.length,
      elapsedSeconds,
      chessPlayer,
      selectedBot,
      moveCount,
      submitScore,
    ],
  );

  // Bot move
  useEffect(() => {
    const botColor = humanColor === "w" ? "b" : "w";
    if (
      gameMode !== "playing" ||
      currentPlayer !== botColor ||
      !selectedBot ||
      isBotThinking
    )
      return;

    setIsBotThinking(true);
    botTimeoutRef.current = setTimeout(() => {
      const currentBoard = boardRef.current;
      const botBoard = toBotBoard(currentBoard);
      const move: BotMove | null = getBotMove(
        botBoard,
        botColor,
        selectedBot.difficulty,
      );
      if (move) {
        const newBoard = cloneBoard(currentBoard);
        const target = newBoard[move.to.row][move.to.col];
        if (target) {
          if (botColor === "w") {
            setCapturedWhite((prev) => [...prev, target]);
          } else {
            setCapturedBlack((prev) => [...prev, target]);
          }
        }
        newBoard[move.to.row][move.to.col] =
          newBoard[move.from.row][move.from.col];
        newBoard[move.from.row][move.from.col] = null;
        // Promotion for bot
        if (move.to.row === 0 && newBoard[move.to.row][move.to.col] === "p") {
          newBoard[move.to.row][move.to.col] = "q";
        }
        if (move.to.row === 7 && newBoard[move.to.row][move.to.col] === "P") {
          newBoard[move.to.row][move.to.col] = "Q";
        }
        setBoard(newBoard);
        setMoveCount((prev) => prev + 1);

        // Bot commentary
        const msg = getBotCommentary(selectedBot.name, moveCount + 1);
        if (msg) {
          setBotMessage(msg);
          if (botMessageTimeoutRef.current)
            clearTimeout(botMessageTimeoutRef.current);
          botMessageTimeoutRef.current = setTimeout(
            () => setBotMessage(null),
            3000,
          );
        }

        if (isCheckmate(newBoard, humanColor)) {
          handleGameOver("loss");
        } else if (isStalemate(newBoard, humanColor)) {
          handleGameOver("draw");
        } else {
          setCurrentPlayer(humanColor);
        }
      }
      setIsBotThinking(false);
    }, selectedBot.thinkingTime);
    return () => {
      if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);
    };
  }, [
    currentPlayer,
    gameMode,
    selectedBot,
    isBotThinking,
    toBotBoard,
    handleGameOver,
    humanColor,
    moveCount,
  ]);

  const startGame = useCallback((bot: (typeof BOTS)[0]) => {
    setSelectedBot(bot);
    setGameMode("color-select");
  }, []);

  const beginPlay = useCallback(
    (color: "w" | "b") => {
      setHumanColor(color);
      const freshBoard = cloneBoard(INITIAL_BOARD);
      setBoard(freshBoard);
      boardRef.current = freshBoard;
      setCurrentPlayer("w");
      setSelectedSquare(null);
      setLegalMoves([]);
      setCapturedWhite([]);
      setCapturedBlack([]);
      setMoveCount(0);
      setStartTime(Date.now());
      setElapsedSeconds(0);
      setGameResult(null);
      setTotalScore(0);
      setIsBotThinking(false);
      setBotMessage(null);
      setGameMode("playing");
      if (color === "b") {
        // Bot (white) goes first after a short delay
        setIsBotThinking(true);
        botTimeoutRef.current = setTimeout(() => {
          const botBoard = toBotBoard(cloneBoard(INITIAL_BOARD));
          const move: BotMove | null = getBotMove(
            botBoard,
            "w",
            selectedBot!.difficulty,
          );
          if (move) {
            const newBoard = cloneBoard(INITIAL_BOARD);
            const target = newBoard[move.to.row][move.to.col];
            if (target) {
              setCapturedWhite((prev) => [...prev, target]);
            }
            newBoard[move.to.row][move.to.col] =
              newBoard[move.from.row][move.from.col];
            newBoard[move.from.row][move.from.col] = null;
            if (
              move.to.row === 7 &&
              newBoard[move.to.row][move.to.col] === "P"
            ) {
              newBoard[move.to.row][move.to.col] = "Q";
            }
            setBoard(newBoard);
            boardRef.current = newBoard;
            setMoveCount((prev) => prev + 1);
            if (isCheckmate(newBoard, "b")) {
              handleGameOver("loss");
            } else if (isStalemate(newBoard, "b")) {
              handleGameOver("draw");
            } else {
              setCurrentPlayer("b");
            }
          }
          setIsBotThinking(false);
        }, selectedBot!.thinkingTime);
      }
    },
    [selectedBot, toBotBoard, handleGameOver],
  );

  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      if (gameMode !== "playing" || isBotThinking) return;
      if (currentPlayer !== humanColor) return;
      const piece = board[row][col];
      if (!selectedSquare) {
        if (piece && getPieceColor(piece) === humanColor) {
          const moves = getLegalMoves(board, { row, col }, humanColor);
          setSelectedSquare({ row, col });
          setLegalMoves(moves);
        }
        return;
      }
      const isLegal = legalMoves.some((m) => m.row === row && m.col === col);
      if (isLegal) {
        const newBoard = cloneBoard(board);
        const target = newBoard[row][col];
        if (target) {
          if (humanColor === "w") {
            setCapturedBlack((prev) => [...prev, target]);
          } else {
            setCapturedWhite((prev) => [...prev, target]);
          }
        }
        newBoard[row][col] = newBoard[selectedSquare.row][selectedSquare.col];
        newBoard[selectedSquare.row][selectedSquare.col] = null;
        // Promotion
        if (humanColor === "w" && row === 0 && newBoard[row][col] === "P") {
          newBoard[row][col] = "Q";
        }
        if (humanColor === "b" && row === 7 && newBoard[row][col] === "p") {
          newBoard[row][col] = "q";
        }
        setBoard(newBoard);
        boardRef.current = newBoard;
        setMoveCount((prev) => prev + 1);
        setSelectedSquare(null);
        setLegalMoves([]);
        const botColor = humanColor === "w" ? "b" : "w";
        if (isCheckmate(newBoard, botColor)) {
          handleGameOver("win");
        } else if (isStalemate(newBoard, botColor)) {
          handleGameOver("draw");
        } else {
          setCurrentPlayer(botColor);
        }
      } else if (piece && getPieceColor(piece) === humanColor) {
        const moves = getLegalMoves(board, { row, col }, humanColor);
        setSelectedSquare({ row, col });
        setLegalMoves(moves);
      } else {
        setSelectedSquare(null);
        setLegalMoves([]);
      }
    },
    [
      gameMode,
      isBotThinking,
      board,
      selectedSquare,
      legalMoves,
      handleGameOver,
      humanColor,
      currentPlayer,
    ],
  );

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (!chessPlayer) {
    return (
      <div className="min-h-screen bg-background">
        <AuthGate>
          <div />
        </AuthGate>
      </div>
    );
  }

  if (gameMode === "select") {
    return (
      <div className="min-h-screen bg-background">
        <AuthGate>
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                Chess Arena — Bot Challenge
              </h1>
              <p className="text-muted-foreground">
                Choose your opponent and prove your skill
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {BOTS.map((bot) => (
                <button
                  type="button"
                  key={bot.id}
                  onClick={() => startGame(bot)}
                  className={`${bot.cssClass} group relative p-5 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-200 text-left flex flex-col gap-3`}
                  data-ocid={`chess.bot_select.${bot.id}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {bot.id === "undead" && "🧟"}
                      {bot.id === "bull" && "🐂"}
                      {bot.id === "gargoyle" && "🗿"}
                      {bot.id === "dragon" && "🐉"}
                      {bot.id === "lostknight" && "🛡️"}
                      {bot.id === "sorrowqueen" && "👑"}
                      {bot.id === "ruinking" && "⚔️"}
                    </span>
                    <div>
                      <h3 className="font-display font-bold text-foreground">
                        {bot.name}
                      </h3>
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium">
                        {
                          [
                            "Novice",
                            "Easy",
                            "Medium",
                            "Hard",
                            "Expert",
                            "Master",
                            "Legend",
                          ][bot.difficulty - 1]
                        }
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {bot.description}
                  </p>
                </button>
              ))}
            </div>
            <div className="text-center">
              <Link
                to="/chess"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
                data-ocid="chess.back_to_local_link"
              >
                Back to Local Play
              </Link>
            </div>
          </div>
        </AuthGate>
      </div>
    );
  }

  if (gameMode === "color-select" && selectedBot) {
    return (
      <div className="min-h-screen bg-background">
        <AuthGate>
          <div className="max-w-md mx-auto px-4 py-12 text-center">
            <div className="text-5xl mb-4">
              {selectedBot.id === "undead" && "🧟"}
              {selectedBot.id === "bull" && "🐂"}
              {selectedBot.id === "gargoyle" && "🗿"}
              {selectedBot.id === "dragon" && "🐉"}
              {selectedBot.id === "lostknight" && "🛡️"}
              {selectedBot.id === "sorrowqueen" && "👑"}
              {selectedBot.id === "ruinking" && "⚔️"}
            </div>
            <h2 className="text-2xl font-display font-bold text-foreground mb-1">
              {selectedBot.name}
            </h2>
            <p className="text-muted-foreground mb-8">Choose your side</p>
            <div className="flex gap-4 justify-center">
              <button
                type="button"
                onClick={() => beginPlay("w")}
                className="flex flex-col items-center gap-3 px-8 py-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:bg-card/80 transition-all duration-200 min-w-[160px]"
                data-ocid="chess.play_white_button"
              >
                <span
                  className="text-5xl"
                  style={{
                    color: "#000000",
                    textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                  }}
                >
                  ♔
                </span>
                <span className="font-bold text-foreground text-lg">
                  Play as White
                </span>
                <span className="text-xs text-muted-foreground">
                  You go first
                </span>
              </button>
              <button
                type="button"
                onClick={() => beginPlay("b")}
                className="flex flex-col items-center gap-3 px-8 py-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:bg-card/80 transition-all duration-200 min-w-[160px]"
                data-ocid="chess.play_black_button"
              >
                <span
                  className="text-5xl"
                  style={{
                    color: "#000000",
                    textShadow: "0 0 4px rgba(255,255,255,0.6)",
                  }}
                >
                  ♚
                </span>
                <span className="font-bold text-foreground text-lg">
                  Play as Black
                </span>
                <span className="text-xs text-muted-foreground">
                  Bot goes first
                </span>
              </button>
            </div>
            <button
              type="button"
              onClick={() => setGameMode("select")}
              className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-ocid="chess.back_to_bots_button"
            >
              Back to bot selection
            </button>
          </div>
        </AuthGate>
      </div>
    );
  }

  if (gameMode === "playing" && selectedBot) {
    return (
      <div className="min-h-screen bg-background">
        <AuthGate>
          <div className="max-w-3xl mx-auto px-4 py-6">
            {/* HUD */}
            <div className="hud-glass flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl bg-card/70 backdrop-blur-md border border-border/50 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {selectedBot.id === "undead" && "🧟"}
                  {selectedBot.id === "bull" && "🐂"}
                  {selectedBot.id === "gargoyle" && "🗿"}
                  {selectedBot.id === "dragon" && "🐉"}
                  {selectedBot.id === "lostknight" && "🛡️"}
                  {selectedBot.id === "sorrowqueen" && "👑"}
                  {selectedBot.id === "ruinking" && "⚔️"}
                </span>
                <div>
                  <p className="font-display font-bold text-foreground text-sm">
                    {selectedBot.name}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {
                      [
                        "Novice",
                        "Easy",
                        "Medium",
                        "Hard",
                        "Expert",
                        "Master",
                        "Legend",
                      ][selectedBot.difficulty - 1]
                    }
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Moves</p>
                  <p className="font-mono font-bold text-foreground">
                    {moveCount}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Time</p>
                  <p className="font-mono font-bold text-foreground">
                    {formatTime(elapsedSeconds)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Captures</p>
                  <p className="font-mono font-bold text-foreground">
                    {humanColor === "w"
                      ? capturedBlack.length
                      : capturedWhite.length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">You</p>
                  <p className="font-mono font-bold text-foreground">
                    {humanColor === "w" ? "White" : "Black"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGameMode("select")}
                className="px-3 py-1.5 text-xs rounded-md bg-muted hover:bg-muted/80 transition-colors text-muted-foreground"
                data-ocid="chess.exit_button"
              >
                Exit
              </button>
            </div>

            {/* Color indicator */}
            {humanColor === "b" && (
              <div className="text-center mb-2">
                <span className="inline-block px-3 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
                  You are playing Black — board shows White's perspective
                </span>
              </div>
            )}

            {/* Bot commentary */}
            {botMessage && (
              <div className="mb-3 text-center">
                <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-pulse">
                  {selectedBot.name}: "{botMessage}"
                </span>
              </div>
            )}

            {/* Turn indicator */}
            <div className="mb-3 text-center">
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
                  currentPlayer === humanColor
                    ? "bg-green-500/20 text-green-400"
                    : "bg-orange-500/20 text-orange-400"
                }`}
              >
                {currentPlayer === humanColor
                  ? "Your turn"
                  : `${selectedBot.name} is thinking...`}
              </span>
            </div>

            {/* Board — ALWAYS from White's perspective */}
            <div
              className="relative"
              style={{
                width: "min(90vw, 560px)",
                height: "min(90vw, 560px)",
                margin: "0 auto",
              }}
            >
              <div
                className="grid grid-cols-8 gap-0 border-2 border-border rounded-lg overflow-hidden shadow-lg"
                style={{ width: "100%", height: "100%" }}
              >
                {board.map((row, r) =>
                  row.map((piece, c) => {
                    const displayRow = 7 - r;
                    const isLight = (displayRow + c) % 2 === 0;
                    const isSelected =
                      selectedSquare?.row === r && selectedSquare?.col === c;
                    const isLegal = legalMoves.some(
                      (m) => m.row === r && m.col === c,
                    );
                    return (
                      <button
                        type="button"
                        key={`sq-${String.fromCharCode(97 + c)}${displayRow + 1}`}
                        onClick={() => handleSquareClick(r, c)}
                        className={`relative w-full aspect-square flex items-center justify-center text-3xl md:text-4xl select-none transition-colors duration-150 ${
                          isLight ? "bg-[#f0d9b5]" : "bg-[#b58863]"
                        } ${isSelected ? "ring-2 ring-yellow-400 ring-inset" : ""}`}
                        data-ocid={`chess.square.${r}.${c}`}
                      >
                        {piece && (
                          <span
                            className="relative z-10"
                            style={
                              isWhitePiece(piece)
                                ? {
                                    color: "#1a1a1a",
                                    textShadow:
                                      "0 1px 2px rgba(0,0,0,0.3), 0 0 1px rgba(0,0,0,0.5)",
                                    fontWeight: 700,
                                  }
                                : {
                                    color: "#1a1a1a",
                                    textShadow:
                                      "0 0 3px rgba(255,255,255,0.8), 0 0 6px rgba(255,255,255,0.5), 0 0 10px rgba(255,255,255,0.3)",
                                    fontWeight: 700,
                                  }
                            }
                          >
                            {PIECE_UNICODE[piece]}
                          </span>
                        )}
                        {isLegal && !piece && (
                          <span className="absolute w-3 h-3 rounded-full bg-blue-500/60" />
                        )}
                        {isLegal && piece && (
                          <span className="absolute inset-0 border-2 border-blue-500/60 rounded-none" />
                        )}
                      </button>
                    );
                  }),
                )}
              </div>
              {isBotThinking && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-lg"
                  style={{ pointerEvents: "none" }}
                >
                  <div
                    className="px-4 py-2 rounded-lg bg-card/90 text-foreground font-medium text-sm animate-pulse"
                    style={{ pointerEvents: "none" }}
                  >
                    {selectedBot.name} is thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Captured pieces */}
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-muted-foreground text-xs mr-1">
                  You captured:
                </span>
                {(humanColor === "w" ? capturedBlack : capturedWhite).map(
                  (p, i) => (
                    <span
                      key={`cap-you-${p}-${i}-${Date.now()}`}
                      className="text-lg"
                    >
                      {p ? PIECE_UNICODE[p] : null}
                    </span>
                  ),
                )}
                {(humanColor === "w" ? capturedBlack : capturedWhite).length ===
                  0 && <span className="text-muted-foreground text-xs">—</span>}
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-muted-foreground text-xs mr-1">
                  Bot captured:
                </span>
                {(humanColor === "w" ? capturedWhite : capturedBlack).map(
                  (p, i) => (
                    <span
                      key={`cap-bot-${p}-${i}-${Date.now()}`}
                      className="text-lg"
                    >
                      {p ? PIECE_UNICODE[p] : null}
                    </span>
                  ),
                )}
                {(humanColor === "w" ? capturedWhite : capturedBlack).length ===
                  0 && <span className="text-muted-foreground text-xs">—</span>}
              </div>
            </div>
          </div>
        </AuthGate>
      </div>
    );
  }

  if (gameMode === "game-over" && selectedBot) {
    const resultClass =
      gameResult === "win"
        ? "result-win"
        : gameResult === "loss"
          ? "result-loss"
          : "result-draw";
    const resultText =
      gameResult === "win"
        ? "Victory!"
        : gameResult === "loss"
          ? "Defeat"
          : "Draw";
    const base = gameResult === "win" ? 100 : gameResult === "draw" ? 50 : 0;
    const capturesBonus = capturedBlack.length * 10;
    const timeBonus = Math.max(0, 300 - elapsedSeconds);

    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <AuthGate>
          <div
            className={`${resultClass} w-full max-w-md p-8 rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 text-center shadow-2xl`}
          >
            <div className="text-5xl mb-4">
              {selectedBot.id === "undead" && "🧟"}
              {selectedBot.id === "bull" && "🐂"}
              {selectedBot.id === "gargoyle" && "🗿"}
              {selectedBot.id === "dragon" && "🐉"}
              {selectedBot.id === "lostknight" && "🛡️"}
              {selectedBot.id === "sorrowqueen" && "👑"}
              {selectedBot.id === "ruinking" && "⚔️"}
            </div>
            <h2 className="text-3xl font-display font-bold text-foreground mb-1">
              {resultText}
            </h2>
            <p className="text-muted-foreground mb-6">vs {selectedBot.name}</p>

            <div className="space-y-2 text-left bg-muted/40 rounded-xl p-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Base Score</span>
                <span className="font-mono font-bold text-foreground">
                  +{base}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Captures Bonus</span>
                <span className="font-mono font-bold text-foreground">
                  +{capturesBonus}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time Bonus</span>
                <span className="font-mono font-bold text-foreground">
                  +{timeBonus}
                </span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between text-base">
                <span className="font-medium text-foreground">Total</span>
                <span className="font-mono font-bold text-primary text-lg">
                  {totalScore}
                </span>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => startGame(selectedBot)}
                className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                data-ocid="chess.play_again_button"
              >
                Play Again
              </button>
              <button
                type="button"
                onClick={() => setGameMode("select")}
                className="px-6 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors"
                data-ocid="chess.choose_bot_button"
              >
                Choose Another Bot
              </button>
            </div>
          </div>
        </AuthGate>
      </div>
    );
  }

  return null;
}
