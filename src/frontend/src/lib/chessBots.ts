/* ──────────────────────────── Chess Bot AI Engine ──────────────────────────── */

export type Color = "w" | "b";
export type PieceType = "p" | "r" | "n" | "b" | "q" | "k";

export interface Piece {
  type: PieceType;
  color: Color;
}

export interface Square {
  row: number;
  col: number;
}

export interface BotMove {
  from: Square;
  to: Square;
}

export interface Bot {
  name: string;
  id: string;
  difficulty: number;
  description: string;
  thinkingTime: number;
  cssClass: string;
}

export const BOTS: Bot[] = [
  {
    name: "Undead",
    id: "undead",
    difficulty: 1,
    description: "A mindless horde that moves at random",
    thinkingTime: 500,
    cssClass: "bot-card-undead",
  },
  {
    name: "Bull",
    id: "bull",
    difficulty: 2,
    description: "Charges at any piece it can capture",
    thinkingTime: 800,
    cssClass: "bot-card-bull",
  },
  {
    name: "Gargoyle",
    id: "gargoyle",
    difficulty: 3,
    description: "Calculates the best immediate move",
    thinkingTime: 1000,
    cssClass: "bot-card-gargoyle",
  },
  {
    name: "Dragon",
    id: "dragon",
    difficulty: 4,
    description: "Sees 2 moves ahead with fiery precision",
    thinkingTime: 1500,
    cssClass: "bot-card-dragon",
  },
  {
    name: "Lost Knight",
    id: "lostknight",
    difficulty: 5,
    description: "A wandering spirit with deep positional knowledge",
    thinkingTime: 2000,
    cssClass: "bot-card-lostknight",
  },
  {
    name: "Sorrow Queen",
    id: "sorrowqueen",
    difficulty: 6,
    description: "Mourns every piece lost, plans 3 moves ahead",
    thinkingTime: 2500,
    cssClass: "bot-card-sorrowqueen",
  },
  {
    name: "Ruin King",
    id: "ruinking",
    difficulty: 7,
    description: "The fallen monarch who sees all endings",
    thinkingTime: 3000,
    cssClass: "bot-card-ruinking",
  },
];

// Piece values
const PIECE_VALUE: Record<PieceType, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// Piece-square tables (from white's perspective, flip for black)
const PAWN_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const KNIGHT_TABLE = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
];

const BISHOP_TABLE = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20],
];

const ROOK_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 5, 5, 0, 0, 0],
];

const QUEEN_TABLE = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 5, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20],
];

const KING_MIDDLE_TABLE = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20],
];

const KING_END_TABLE = [
  [-50, -40, -30, -20, -20, -30, -40, -50],
  [-30, -20, -10, 0, 0, -10, -20, -30],
  [-30, -10, 20, 30, 30, 20, -10, -30],
  [-30, -10, 30, 40, 40, 30, -10, -30],
  [-30, -10, 30, 40, 40, 30, -10, -30],
  [-30, -10, 20, 30, 30, 20, -10, -30],
  [-30, -30, 0, 0, 0, 0, -30, -30],
  [-50, -30, -30, -30, -30, -30, -30, -50],
];

const PST: Record<PieceType, number[][]> = {
  p: PAWN_TABLE,
  n: KNIGHT_TABLE,
  b: BISHOP_TABLE,
  r: ROOK_TABLE,
  q: QUEEN_TABLE,
  k: KING_MIDDLE_TABLE,
};

// Simple opening book: first few moves for black
const OPENING_BOOK: Record<string, BotMove[]> = {
  // Starting position responses
  start: [
    { from: { row: 1, col: 4 }, to: { row: 3, col: 4 } }, // e5
    { from: { row: 1, col: 3 }, to: { row: 3, col: 3 } }, // d5
    { from: { row: 1, col: 2 }, to: { row: 3, col: 2 } }, // c5
  ],
};

function cloneBoard(board: (Piece | null)[][]): (Piece | null)[][] {
  return board.map((row) => [...row]);
}

function isInBounds(r: number, c: number) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
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

function getAllLegalMoves(
  board: (Piece | null)[][],
  color: Color,
): { from: Square; to: Square }[] {
  const moves: { from: Square; to: Square }[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p || p.color !== color) continue;
      const from = { row: r, col: c };
      for (let tr = 0; tr < 8; tr++) {
        for (let tc = 0; tc < 8; tc++) {
          if (isValidMove(board, from, { row: tr, col: tc }, color)) {
            moves.push({ from, to: { row: tr, col: tc } });
          }
        }
      }
    }
  }
  return moves;
}

function makeMove(
  board: (Piece | null)[][],
  from: Square,
  to: Square,
): (Piece | null)[][] {
  const newBoard = cloneBoard(board);
  const piece = newBoard[from.row][from.col];
  if (!piece) return newBoard;
  newBoard[to.row][to.col] = piece;
  newBoard[from.row][from.col] = null;
  if (piece.type === "p" && (to.row === 0 || to.row === 7)) {
    newBoard[to.row][to.col] = { type: "q", color: piece.color };
  }
  return newBoard;
}

function isInCheck(board: (Piece | null)[][], color: Color): boolean {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  const opp = color === "w" ? "b" : "w";
  return isSquareAttacked(board, kingPos, opp);
}

function countMaterial(board: (Piece | null)[][], color: Color): number {
  let total = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.color === color) {
        total += PIECE_VALUE[p.type];
      }
    }
  }
  return total;
}

function isEndgame(board: (Piece | null)[][]): boolean {
  const whiteMaterial = countMaterial(board, "w");
  const blackMaterial = countMaterial(board, "b");
  // Endgame when both sides have less than queen + rook worth of material (excluding king)
  return whiteMaterial < 20000 + 900 + 500 && blackMaterial < 20000 + 900 + 500;
}

function evaluateBoard(board: (Piece | null)[][], color: Color): number {
  let score = 0;
  const endgame = isEndgame(board);

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p) continue;
      const value = PIECE_VALUE[p.type];
      let pstValue = 0;
      if (p.type === "k" && endgame) {
        pstValue =
          p.color === "w" ? KING_END_TABLE[r][c] : KING_END_TABLE[7 - r][c];
      } else {
        const table = PST[p.type];
        if (table) {
          pstValue = p.color === "w" ? table[r][c] : table[7 - r][c];
        }
      }
      const total = value + pstValue;
      if (p.color === color) {
        score += total;
      } else {
        score -= total;
      }
    }
  }

  // Mobility bonus
  const myMoves = getAllLegalMoves(board, color).length;
  const oppMoves = getAllLegalMoves(board, color === "w" ? "b" : "w").length;
  score += (myMoves - oppMoves) * 10;

  // Check bonus
  const opp = color === "w" ? "b" : "w";
  if (isInCheck(board, opp)) score += 50;
  if (isInCheck(board, color)) score -= 50;

  return score;
}

function minimax(
  board: (Piece | null)[][],
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean,
  color: Color,
): number {
  const opp = color === "w" ? "b" : "w";
  const currentColor = maximizing ? color : opp;

  if (depth === 0) {
    return evaluateBoard(board, color);
  }

  const moves = getAllLegalMoves(board, currentColor);
  if (moves.length === 0) {
    if (isInCheck(board, currentColor)) {
      // Checkmate - very bad for current player
      return maximizing ? -100000 + (10 - depth) : 100000 - (10 - depth);
    }
    // Stalemate
    return 0;
  }

  if (maximizing) {
    let maxEval = Number.NEGATIVE_INFINITY;
    let a = alpha;
    for (const move of moves) {
      const newBoard = makeMove(board, move.from, move.to);
      const eval_ = minimax(newBoard, depth - 1, a, beta, false, color);
      maxEval = Math.max(maxEval, eval_);
      a = Math.max(a, eval_);
      if (beta <= a) break;
    }
    return maxEval;
  }
  let minEval = Number.POSITIVE_INFINITY;
  let b = beta;
  for (const move of moves) {
    const newBoard = makeMove(board, move.from, move.to);
    const eval_ = minimax(newBoard, depth - 1, alpha, b, true, color);
    minEval = Math.min(minEval, eval_);
    b = Math.min(b, eval_);
    if (b <= alpha) break;
  }
  return minEval;
}

function getBotMoveUndead(
  board: (Piece | null)[][],
  color: Color,
): BotMove | null {
  const moves = getAllLegalMoves(board, color);
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}

function getBotMoveBull(
  board: (Piece | null)[][],
  color: Color,
): BotMove | null {
  const moves = getAllLegalMoves(board, color);
  if (moves.length === 0) return null;

  const captures = moves.filter((m) => board[m.to.row][m.to.col] !== null);
  if (captures.length > 0) {
    captures.sort((a, b) => {
      const valA = board[a.to.row][a.to.col]?.type
        ? PIECE_VALUE[board[a.to.row][a.to.col]!.type]
        : 0;
      const valB = board[b.to.row][b.to.col]?.type
        ? PIECE_VALUE[board[b.to.row][b.to.col]!.type]
        : 0;
      return valB - valA;
    });
    return captures[0];
  }
  return moves[Math.floor(Math.random() * moves.length)];
}

function getBotMoveGargoyle(
  board: (Piece | null)[][],
  color: Color,
): BotMove | null {
  const moves = getAllLegalMoves(board, color);
  if (moves.length === 0) return null;

  let bestMove = moves[0];
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const move of moves) {
    const newBoard = makeMove(board, move.from, move.to);
    const score = evaluateBoard(newBoard, color);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
}

function getBotMoveMinimax(
  board: (Piece | null)[][],
  depth: number,
  color: Color,
): BotMove | null {
  const moves = getAllLegalMoves(board, color);
  if (moves.length === 0) return null;

  let bestMove = moves[0];
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const move of moves) {
    const newBoard = makeMove(board, move.from, move.to);
    const score = minimax(
      newBoard,
      depth - 1,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY,
      false,
      color,
    );
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
}

function getBotMoveDragon(
  board: (Piece | null)[][],
  color: Color,
): BotMove | null {
  return getBotMoveMinimax(board, 2, color);
}

function getBotMoveLostKnight(
  board: (Piece | null)[][],
  color: Color,
): BotMove | null {
  return getBotMoveMinimax(board, 3, color);
}

function getBotMoveSorrowQueen(
  board: (Piece | null)[][],
  color: Color,
): BotMove | null {
  return getBotMoveMinimax(board, 4, color);
}

function getBotMoveRuinKing(
  board: (Piece | null)[][],
  color: Color,
): BotMove | null {
  const totalPieces = board.flat().filter((p) => p !== null).length;
  if (totalPieces >= 30) {
    const bookMoves = OPENING_BOOK.start;
    if (bookMoves) {
      const validBookMoves = bookMoves.filter((m) =>
        isValidMove(board, m.from, m.to, color),
      );
      if (validBookMoves.length > 0) {
        return validBookMoves[
          Math.floor(Math.random() * validBookMoves.length)
        ];
      }
    }
  }
  return getBotMoveMinimax(board, 5, color);
}

export function getBotMove(
  board: (Piece | null)[][],
  color: Color,
  difficulty: number,
): BotMove | null {
  switch (difficulty) {
    case 1:
      return getBotMoveUndead(board, color);
    case 2:
      return getBotMoveBull(board, color);
    case 3:
      return getBotMoveGargoyle(board, color);
    case 4:
      return getBotMoveDragon(board, color);
    case 5:
      return getBotMoveLostKnight(board, color);
    case 6:
      return getBotMoveSorrowQueen(board, color);
    case 7:
      return getBotMoveRuinKing(board, color);
    default:
      return getBotMoveUndead(board, color);
  }
}

export function getThinkingTime(botName: string): number {
  const bot = BOTS.find((b) => b.name === botName);
  return bot?.thinkingTime ?? 1000;
}
