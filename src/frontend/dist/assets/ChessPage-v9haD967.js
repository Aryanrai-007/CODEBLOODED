import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, C as Crown, B as Button, U as Users } from "./index-Cczox6Vj.js";
import { u as useChessAuth } from "./useChessAuth-6Yw62Sny.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserPlus = createLucideIcon("user-plus", __iconNode);
const PIECE_UNICODE = {
  w: { k: "♔", q: "♕", r: "♖", b: "♗", n: "♘", p: "♙" },
  b: { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" }
};
function createInitialBoard() {
  const board = Array.from(
    { length: 8 },
    () => Array.from({ length: 8 }, () => null)
  );
  const backRow = ["r", "n", "b", "q", "k", "b", "n", "r"];
  for (let c = 0; c < 8; c++) {
    board[0][c] = { type: backRow[c], color: "b" };
    board[1][c] = { type: "p", color: "b" };
    board[6][c] = { type: "p", color: "w" };
    board[7][c] = { type: backRow[c], color: "w" };
  }
  return board;
}
function isInBounds(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}
function cloneBoard(board) {
  return board.map((row) => [...row]);
}
function findKing(board, color) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type === "k" && p.color === color) return { row: r, col: c };
    }
  }
  return null;
}
function isSquareAttacked(board, square, byColor) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p || p.color !== byColor) continue;
      if (canAttack({ row: r, col: c }, square, p, board)) return true;
    }
  }
  return false;
}
function canAttack(from, to, piece, board) {
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
      return adR === 2 && adC === 1 || adR === 1 && adC === 2;
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
function pathClear(from, to, board) {
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
function getValidMoves(board, from, turn) {
  const piece = board[from.row][from.col];
  if (!piece || piece.color !== turn) return [];
  const moves = [];
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
function isValidMove(board, from, to, turn) {
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
      valid = adR === 2 && adC === 1 || adR === 1 && adC === 2;
      break;
    case "b":
      valid = adR === adC && pathClear(from, to, board);
      break;
    case "r":
      valid = (dr === 0 || dc === 0) && pathClear(from, to, board);
      break;
    case "q":
      valid = (adR === adC || dr === 0 || dc === 0) && pathClear(from, to, board);
      break;
    case "k":
      valid = adR <= 1 && adC <= 1;
      break;
  }
  if (!valid) return false;
  const sim = cloneBoard(board);
  sim[to.row][to.col] = piece;
  sim[from.row][from.col] = null;
  if (piece.type === "p" && (to.row === 0 || to.row === 7)) {
    sim[to.row][to.col] = { type: "q", color: piece.color };
  }
  const kingPos = findKing(sim, turn);
  if (!kingPos) return false;
  const opp = turn === "w" ? "b" : "w";
  return !isSquareAttacked(sim, kingPos, opp);
}
function isInCheck(board, color) {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  const opp = color === "w" ? "b" : "w";
  return isSquareAttacked(board, kingPos, opp);
}
function hasAnyLegalMove(board, color) {
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
function ChessPage() {
  const {
    currentPlayer,
    isLoggedIn,
    isLoading,
    error,
    registerChessPlayer,
    loginChessPlayer,
    logoutChessPlayer,
    clearError
  } = useChessAuth();
  const [board, setBoard] = reactExports.useState(createInitialBoard);
  const [turn, setTurn] = reactExports.useState("w");
  const [selected, setSelected] = reactExports.useState(null);
  const [validMoves, setValidMoves] = reactExports.useState([]);
  const [lastMove, setLastMove] = reactExports.useState(null);
  const [capturedWhite, setCapturedWhite] = reactExports.useState([]);
  const [capturedBlack, setCapturedBlack] = reactExports.useState([]);
  const [gameOver, setGameOver] = reactExports.useState(
    null
  );
  const [winner, setWinner] = reactExports.useState(null);
  const status = reactExports.useMemo(() => {
    if (gameOver === "checkmate") {
      return winner === "w" ? "Checkmate! White wins" : "Checkmate! Black wins";
    }
    if (gameOver === "stalemate") return "Stalemate! Draw";
    const inCheck = isInCheck(board, turn);
    return `${turn === "w" ? "White" : "Black"} to move${inCheck ? " — Check!" : ""}`;
  }, [board, turn, gameOver, winner]);
  const handleSquareClick = reactExports.useCallback(
    (row, col) => {
      if (gameOver) return;
      const clickedPiece = board[row][col];
      if (clickedPiece && clickedPiece.color === turn) {
        setSelected({ row, col });
        setValidMoves(getValidMoves(board, { row, col }, turn));
        return;
      }
      if (selected) {
        const target = { row, col };
        const isValid = validMoves.some(
          (m) => m.row === target.row && m.col === target.col
        );
        if (isValid) {
          const piece = board[selected.row][selected.col];
          const captured = board[target.row][target.col];
          const newBoard = cloneBoard(board);
          newBoard[target.row][target.col] = piece;
          newBoard[selected.row][selected.col] = null;
          if (piece.type === "p" && (target.row === 0 || target.row === 7)) {
            newBoard[target.row][target.col] = {
              type: "q",
              color: piece.color
            };
          }
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
    [board, turn, selected, validMoves, gameOver]
  );
  const resetGame = reactExports.useCallback(() => {
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
  reactExports.useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        setSelected(null);
        setValidMoves([]);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  if (!isLoggedIn) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      AuthGate,
      {
        isLoading,
        error,
        onRegister: registerChessPlayer,
        onLogin: loginChessPlayer,
        clearError
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/12 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-5 h-5 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-xl text-foreground tracking-wide", children: "Chess Arena" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-xs font-mono", children: [
            "Welcome,",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: currentPlayer.username })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          onClick: logoutChessPlayer,
          className: "flex items-center gap-2 border-border text-muted-foreground hover:text-foreground",
          "data-ocid": "chess-logout-button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4" }),
            "Logout"
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 flex flex-col items-center justify-center p-4 sm:p-6 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `w-full max-w-xl text-center px-4 py-3 rounded-xl border font-display font-semibold tracking-wide text-sm transition-all ${gameOver === "checkmate" ? "bg-primary/10 border-primary/30 text-primary" : gameOver === "stalemate" ? "bg-muted border-border text-muted-foreground" : isInCheck(board, turn) ? "bg-destructive/10 border-destructive/30 text-destructive" : "bg-card border-border text-foreground"}`,
          "data-ocid": "chess-status-banner",
          children: status
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-xl flex items-center gap-1 min-h-[28px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-mono mr-2", children: "White captured:" }),
        capturedWhite.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/50", children: "—" }) : capturedWhite.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-lg leading-none select-none",
            children: PIECE_UNICODE[p.color][p.type]
          },
          `${p.color}-${p.type}-${i}`
        ))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-8 gap-0 border-2 border-border rounded-lg overflow-hidden shadow-lg",
          style: { width: "min(90vw, 560px)", height: "min(90vw, 560px)" },
          "data-ocid": "chess-board",
          children: Array.from({ length: 64 }, (_, i) => {
            const row = Math.floor(i / 8);
            const col = i % 8;
            const isLight = (row + col) % 2 === 0;
            const piece = board[row][col];
            const isSelected = selected && selected.row === row && selected.col === col;
            const isValidMove2 = validMoves.some(
              (m) => m.row === row && m.col === col
            );
            const isLastMove = lastMove && (lastMove.from.row === row && lastMove.from.col === col || lastMove.to.row === row && lastMove.to.col === col);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => handleSquareClick(row, col),
                className: `relative flex items-center justify-center select-none transition-colors duration-150 ${isLight ? "bg-[#f0d9b5] dark:bg-[#b58863]/60" : "bg-[#b58863] dark:bg-[#8b5a2b]/70"} ${isSelected ? "ring-2 ring-primary ring-inset z-10" : ""} ${isLastMove ? "brightness-110" : ""}`,
                style: { aspectRatio: "1" },
                "data-ocid": `chess-square-${row}-${col}`,
                children: [
                  isValidMove2 && !piece && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full bg-primary/50 dark:bg-primary/60" }),
                  isValidMove2 && piece && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 border-2 border-primary/60 dark:border-primary/70 rounded-sm" }),
                  piece && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `text-3xl sm:text-4xl leading-none select-none transition-transform duration-150 ${isSelected ? "scale-110" : ""}`,
                      style: {
                        color: piece.color === "w" ? "#1a1a1a" : "#0a0a0a",
                        textShadow: piece.color === "w" ? "0 0 2px rgba(255,255,255,0.6)" : "0 0 2px rgba(0,0,0,0.4)"
                      },
                      children: PIECE_UNICODE[piece.color][piece.type]
                    }
                  ),
                  col === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute top-0.5 left-1 text-[10px] font-mono leading-none opacity-60 text-foreground/70", children: 8 - row }),
                  row === 7 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute bottom-0.5 right-1 text-[10px] font-mono leading-none opacity-60 text-foreground/70", children: String.fromCharCode(97 + col) })
                ]
              },
              `${row}-${col}`
            );
          })
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-xl flex items-center gap-1 min-h-[28px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-mono mr-2", children: "Black captured:" }),
        capturedBlack.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground/50", children: "—" }) : capturedBlack.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-lg leading-none select-none",
            children: PIECE_UNICODE[p.color][p.type]
          },
          `${p.color}-${p.type}-${i}`
        ))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          onClick: resetGame,
          className: "flex items-center gap-2 border-border text-muted-foreground hover:text-foreground",
          "data-ocid": "chess-new-game-button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-4 h-4" }),
            "New Game"
          ]
        }
      ) })
    ] })
  ] });
}
function AuthGate({
  isLoading,
  error,
  onRegister,
  onLogin,
  clearError
}) {
  const [tab, setTab] = reactExports.useState("login");
  const [username, setUsername] = reactExports.useState("");
  const [validationError, setValidationError] = reactExports.useState("");
  async function handleSubmit(e) {
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background flex items-center justify-center p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-xl bg-primary/12 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "w-8 h-8 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground tracking-wide", children: "Chess Arena" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: "Create an account or log in to play." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-6 card-elevated", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex rounded-lg mb-6 p-1 bg-muted/40", children: ["login", "create"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => {
            setTab(t);
            setValidationError("");
            clearError();
          },
          className: `flex-1 py-2 rounded-md text-sm font-display font-semibold tracking-wide transition-all duration-200 ${tab === t ? "bg-primary/20 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
          "data-ocid": `chess-auth-tab-${t}`,
          children: t === "login" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4" }),
            "Login"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-4 h-4" }),
            "Create Account"
          ] })
        },
        t
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "flex flex-col gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "label",
            {
              htmlFor: "chess-username",
              className: "block text-xs font-display uppercase tracking-wider text-muted-foreground mb-1.5",
              children: "Username"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              id: "chess-username",
              type: "text",
              value: username,
              onChange: (e) => setUsername(e.target.value),
              placeholder: "Enter your username",
              className: "w-full px-4 py-3 rounded-lg text-sm bg-muted/40 border border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40 outline-none transition-all",
              "data-ocid": "chess-auth-username-input"
            }
          )
        ] }),
        displayError && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "px-3 py-2 rounded-lg text-sm bg-destructive/10 text-destructive border border-destructive/30",
            "data-ocid": "chess-auth-error-state",
            children: displayError
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            disabled: isLoading,
            className: "w-full btn-primary h-11",
            "data-ocid": "chess-auth-submit-button",
            children: isLoading ? "Connecting…" : tab === "login" ? "Login" : "Create Account"
          }
        )
      ] })
    ] })
  ] }) });
}
export {
  ChessPage
};
