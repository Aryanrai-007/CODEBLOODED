import { u as useSubmitChessScore, r as reactExports, j as jsxRuntimeExports, L as Link } from "./index-Cczox6Vj.js";
import { u as useChessAuth } from "./useChessAuth-6Yw62Sny.js";
const BOTS = [
  {
    name: "Undead",
    id: "undead",
    difficulty: 1,
    description: "A mindless horde that moves at random",
    thinkingTime: 500,
    cssClass: "bot-card-undead"
  },
  {
    name: "Bull",
    id: "bull",
    difficulty: 2,
    description: "Charges at any piece it can capture",
    thinkingTime: 800,
    cssClass: "bot-card-bull"
  },
  {
    name: "Gargoyle",
    id: "gargoyle",
    difficulty: 3,
    description: "Calculates the best immediate move",
    thinkingTime: 1e3,
    cssClass: "bot-card-gargoyle"
  },
  {
    name: "Dragon",
    id: "dragon",
    difficulty: 4,
    description: "Sees 2 moves ahead with fiery precision",
    thinkingTime: 1500,
    cssClass: "bot-card-dragon"
  },
  {
    name: "Lost Knight",
    id: "lostknight",
    difficulty: 5,
    description: "A wandering spirit with deep positional knowledge",
    thinkingTime: 2e3,
    cssClass: "bot-card-lostknight"
  },
  {
    name: "Sorrow Queen",
    id: "sorrowqueen",
    difficulty: 6,
    description: "Mourns every piece lost, plans 3 moves ahead",
    thinkingTime: 2500,
    cssClass: "bot-card-sorrowqueen"
  },
  {
    name: "Ruin King",
    id: "ruinking",
    difficulty: 7,
    description: "The fallen monarch who sees all endings",
    thinkingTime: 3e3,
    cssClass: "bot-card-ruinking"
  }
];
const PIECE_VALUE = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 2e4
};
const PAWN_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0]
];
const KNIGHT_TABLE = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50]
];
const BISHOP_TABLE = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20]
];
const ROOK_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 5, 5, 0, 0, 0]
];
const QUEEN_TABLE = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 5, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20]
];
const KING_MIDDLE_TABLE = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20]
];
const KING_END_TABLE = [
  [-50, -40, -30, -20, -20, -30, -40, -50],
  [-30, -20, -10, 0, 0, -10, -20, -30],
  [-30, -10, 20, 30, 30, 20, -10, -30],
  [-30, -10, 30, 40, 40, 30, -10, -30],
  [-30, -10, 30, 40, 40, 30, -10, -30],
  [-30, -10, 20, 30, 30, 20, -10, -30],
  [-30, -30, 0, 0, 0, 0, -30, -30],
  [-50, -30, -30, -30, -30, -30, -30, -50]
];
const PST = {
  p: PAWN_TABLE,
  n: KNIGHT_TABLE,
  b: BISHOP_TABLE,
  r: ROOK_TABLE,
  q: QUEEN_TABLE,
  k: KING_MIDDLE_TABLE
};
const OPENING_BOOK = {
  // Starting position responses
  start: [
    { from: { row: 1, col: 4 }, to: { row: 3, col: 4 } },
    // e5
    { from: { row: 1, col: 3 }, to: { row: 3, col: 3 } },
    // d5
    { from: { row: 1, col: 2 }, to: { row: 3, col: 2 } }
    // c5
  ]
};
function cloneBoard$1(board) {
  return board.map((row) => [...row]);
}
function isInBounds(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
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
  const sim = cloneBoard$1(board);
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
function getAllLegalMoves$1(board, color) {
  const moves = [];
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
function makeMove(board, from, to) {
  const newBoard = cloneBoard$1(board);
  const piece = newBoard[from.row][from.col];
  if (!piece) return newBoard;
  newBoard[to.row][to.col] = piece;
  newBoard[from.row][from.col] = null;
  if (piece.type === "p" && (to.row === 0 || to.row === 7)) {
    newBoard[to.row][to.col] = { type: "q", color: piece.color };
  }
  return newBoard;
}
function isInCheck$1(board, color) {
  const kingPos = findKing(board, color);
  if (!kingPos) return false;
  const opp = color === "w" ? "b" : "w";
  return isSquareAttacked(board, kingPos, opp);
}
function countMaterial(board, color) {
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
function isEndgame(board) {
  const whiteMaterial = countMaterial(board, "w");
  const blackMaterial = countMaterial(board, "b");
  return whiteMaterial < 2e4 + 900 + 500 && blackMaterial < 2e4 + 900 + 500;
}
function evaluateBoard(board, color) {
  let score = 0;
  const endgame = isEndgame(board);
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (!p) continue;
      const value = PIECE_VALUE[p.type];
      let pstValue = 0;
      if (p.type === "k" && endgame) {
        pstValue = p.color === "w" ? KING_END_TABLE[r][c] : KING_END_TABLE[7 - r][c];
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
  const myMoves = getAllLegalMoves$1(board, color).length;
  const oppMoves = getAllLegalMoves$1(board, color === "w" ? "b" : "w").length;
  score += (myMoves - oppMoves) * 10;
  const opp = color === "w" ? "b" : "w";
  if (isInCheck$1(board, opp)) score += 50;
  if (isInCheck$1(board, color)) score -= 50;
  return score;
}
function minimax(board, depth, alpha, beta, maximizing, color) {
  const opp = color === "w" ? "b" : "w";
  const currentColor = maximizing ? color : opp;
  if (depth === 0) {
    return evaluateBoard(board, color);
  }
  const moves = getAllLegalMoves$1(board, currentColor);
  if (moves.length === 0) {
    if (isInCheck$1(board, currentColor)) {
      return maximizing ? -1e5 + (10 - depth) : 1e5 - (10 - depth);
    }
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
function getBotMoveUndead(board, color) {
  const moves = getAllLegalMoves$1(board, color);
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}
function getBotMoveBull(board, color) {
  const moves = getAllLegalMoves$1(board, color);
  if (moves.length === 0) return null;
  const captures = moves.filter((m) => board[m.to.row][m.to.col] !== null);
  if (captures.length > 0) {
    captures.sort((a, b) => {
      var _a, _b;
      const valA = ((_a = board[a.to.row][a.to.col]) == null ? void 0 : _a.type) ? PIECE_VALUE[board[a.to.row][a.to.col].type] : 0;
      const valB = ((_b = board[b.to.row][b.to.col]) == null ? void 0 : _b.type) ? PIECE_VALUE[board[b.to.row][b.to.col].type] : 0;
      return valB - valA;
    });
    return captures[0];
  }
  return moves[Math.floor(Math.random() * moves.length)];
}
function getBotMoveGargoyle(board, color) {
  const moves = getAllLegalMoves$1(board, color);
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
function getBotMoveMinimax(board, depth, color) {
  const moves = getAllLegalMoves$1(board, color);
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
      color
    );
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
}
function getBotMoveDragon(board, color) {
  return getBotMoveMinimax(board, 2, color);
}
function getBotMoveLostKnight(board, color) {
  return getBotMoveMinimax(board, 3, color);
}
function getBotMoveSorrowQueen(board, color) {
  return getBotMoveMinimax(board, 4, color);
}
function getBotMoveRuinKing(board, color) {
  const totalPieces = board.flat().filter((p) => p !== null).length;
  if (totalPieces >= 30) {
    const bookMoves = OPENING_BOOK.start;
    if (bookMoves) {
      const validBookMoves = bookMoves.filter(
        (m) => isValidMove(board, m.from, m.to, color)
      );
      if (validBookMoves.length > 0) {
        return validBookMoves[Math.floor(Math.random() * validBookMoves.length)];
      }
    }
  }
  return getBotMoveMinimax(board, 5, color);
}
function getBotMove(board, color, difficulty) {
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
const INITIAL_BOARD = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"]
];
const PIECE_UNICODE = {
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
  k: "♚"
};
function cloneBoard(b) {
  return b.map((row) => [...row]);
}
function isWhitePiece(p) {
  return p !== null && p === p.toUpperCase();
}
function getPieceColor(p) {
  if (!p) return null;
  return p === p.toUpperCase() ? "w" : "b";
}
function inBounds(r, c) {
  return r >= 0 && r < 8 && c >= 0 && c < 8;
}
function getLegalMoves(board, square, color) {
  const piece = board[square.row][square.col];
  if (!piece) return [];
  const pieceColor = getPieceColor(piece);
  if (pieceColor !== color) return [];
  const moves = [];
  const p = piece.toLowerCase();
  const addIfValid = (r, c) => {
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
      if (square.row === startRow && inBounds(fr + dir, square.col) && !board[fr + dir][square.col]) {
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
      [2, 1]
    ];
    for (const [dr, dc] of deltas) {
      addIfValid(square.row + dr, square.col + dc);
    }
  } else if (p === "b" || p === "r" || p === "q") {
    const directions = [];
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
  const validMoves = [];
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
function getAllLegalMoves(board, color) {
  const all = [];
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
function isInCheck(board, color) {
  let kingPos = null;
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
        if (moves.some((m) => m.row === kingPos.row && m.col === kingPos.col))
          return true;
      }
    }
  }
  return false;
}
function isCheckmate(board, color) {
  return isInCheck(board, color) && getAllLegalMoves(board, color).length === 0;
}
function isStalemate(board, color) {
  return !isInCheck(board, color) && getAllLegalMoves(board, color).length === 0;
}
const BOT_COMMENTARY = {
  Undead: ["Grrr...", "Brains...", "Uuuuh...", "*moans*", "Crush..."],
  Bull: ["Charge!", "Stampede!", "Rumble!", "Smash!", "Trample!"],
  Gargoyle: [
    "Stone watches...",
    "You will crack...",
    "I see you...",
    "Turn to dust...",
    "Eternal vigil..."
  ],
  Dragon: [
    "Burn!",
    "My hoard!",
    "Feel the fire!",
    "Wings of flame!",
    "Incinerate!"
  ],
  "Lost Knight": [
    "Forgotten...",
    "My kingdom fell...",
    "I wander still...",
    "Honor remains...",
    "One last charge..."
  ],
  "Sorrow Queen": [
    "Every move is a tear in time...",
    "I mourn the pieces already lost...",
    "Your strategy is but a fleeting shadow...",
    "Checkmate is merely another form of grief...",
    "I have seen a thousand endings..."
  ],
  "Ruin King": [
    "All kingdoms fall before me...",
    "I am the end of all things...",
    "Bow to the ruins...",
    "Your resistance is meaningless...",
    "I have conquered death itself..."
  ]
};
function getBotCommentary(botName, moveCount) {
  const lines = BOT_COMMENTARY[botName];
  if (!lines || lines.length === 0) return null;
  const freq = botName === "Ruin King" || botName === "Sorrow Queen" ? 3 : 4;
  if (moveCount > 0 && moveCount % freq === 0) {
    return lines[Math.floor(Math.random() * lines.length)];
  }
  return null;
}
function AuthGate({ children }) {
  const {
    currentPlayer,
    registerChessPlayer,
    loginChessPlayer,
    logoutChessPlayer
  } = useChessAuth();
  const [username, setUsername] = reactExports.useState("");
  const [mode, setMode] = reactExports.useState("choose");
  if (currentPlayer) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6 px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg font-bold text-primary", children: currentPlayer.username.charAt(0).toUpperCase() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: currentPlayer.username }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Player ID: ",
              currentPlayer.playerId
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: logoutChessPlayer,
            className: "px-3 py-1.5 text-sm rounded-md bg-muted hover:bg-muted/80 transition-colors text-muted-foreground",
            "data-ocid": "chess.logout_button",
            children: "Logout"
          }
        )
      ] }),
      children
    ] });
  }
  if (mode === "choose") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center min-h-[60vh] gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold text-foreground", children: "Enter the Arena" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-center max-w-sm", children: "Create a username to track your scores and challenge the bots." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setMode("create"),
            className: "px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors",
            "data-ocid": "chess.create_id_button",
            children: "Create ID"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setMode("login"),
            className: "px-6 py-3 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors",
            "data-ocid": "chess.login_button",
            children: "Login"
          }
        )
      ] })
    ] });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    if (mode === "create") await registerChessPlayer(username.trim());
    else await loginChessPlayer(username.trim());
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center min-h-[60vh] gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold text-foreground", children: mode === "create" ? "Create Your ID" : "Login" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: handleSubmit,
        className: "flex flex-col gap-4 w-full max-w-xs",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: username,
              onChange: (e) => setUsername(e.target.value),
              placeholder: "Enter username",
              className: "px-4 py-3 rounded-lg bg-card border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50",
              "data-ocid": "chess.username_input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              className: "px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors",
              "data-ocid": "chess.submit_auth_button",
              children: mode === "create" ? "Create" : "Login"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setMode("choose"),
              className: "text-sm text-muted-foreground hover:text-foreground transition-colors",
              "data-ocid": "chess.back_button",
              children: "Back"
            }
          )
        ]
      }
    )
  ] });
}
function ChessBotPage() {
  const { currentPlayer: chessPlayer } = useChessAuth();
  const submitScore = useSubmitChessScore();
  const [gameMode, setGameMode] = reactExports.useState("select");
  const [selectedBot, setSelectedBot] = reactExports.useState(null);
  const [board, setBoard] = reactExports.useState(cloneBoard(INITIAL_BOARD));
  const [currentPlayer, setCurrentPlayer] = reactExports.useState("w");
  const [selectedSquare, setSelectedSquare] = reactExports.useState(null);
  const [legalMoves, setLegalMoves] = reactExports.useState([]);
  const [capturedWhite, setCapturedWhite] = reactExports.useState([]);
  const [capturedBlack, setCapturedBlack] = reactExports.useState([]);
  const [moveCount, setMoveCount] = reactExports.useState(0);
  const [startTime, setStartTime] = reactExports.useState(null);
  const [elapsedSeconds, setElapsedSeconds] = reactExports.useState(0);
  const [gameResult, setGameResult] = reactExports.useState(
    null
  );
  const [totalScore, setTotalScore] = reactExports.useState(0);
  const [isBotThinking, setIsBotThinking] = reactExports.useState(false);
  const [humanColor, setHumanColor] = reactExports.useState("w");
  const [botMessage, setBotMessage] = reactExports.useState(null);
  const botTimeoutRef = reactExports.useRef(null);
  const botMessageTimeoutRef = reactExports.useRef(
    null
  );
  const boardRef = reactExports.useRef(cloneBoard(INITIAL_BOARD));
  reactExports.useEffect(() => {
    boardRef.current = board;
  }, [board]);
  reactExports.useEffect(() => {
    if (gameMode !== "playing" || !startTime) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime) / 1e3));
    }, 1e3);
    return () => clearInterval(interval);
  }, [gameMode, startTime]);
  const toBotBoard = reactExports.useCallback((b) => {
    return b.map(
      (row) => row.map((p) => {
        if (!p) return null;
        return {
          type: p.toLowerCase(),
          color: p === p.toUpperCase() ? "w" : "b"
        };
      })
    );
  }, []);
  const handleGameOver = reactExports.useCallback(
    (result) => {
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
          result: result === "win" ? "win" : result === "draw" ? "draw" : "loss",
          movesCount: BigInt(moveCount)
        });
      }
    },
    [
      capturedBlack.length,
      elapsedSeconds,
      chessPlayer,
      selectedBot,
      moveCount,
      submitScore
    ]
  );
  reactExports.useEffect(() => {
    const botColor = humanColor === "w" ? "b" : "w";
    if (gameMode !== "playing" || currentPlayer !== botColor || !selectedBot || isBotThinking)
      return;
    setIsBotThinking(true);
    botTimeoutRef.current = setTimeout(() => {
      const currentBoard = boardRef.current;
      const botBoard = toBotBoard(currentBoard);
      const move = getBotMove(
        botBoard,
        botColor,
        selectedBot.difficulty
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
        newBoard[move.to.row][move.to.col] = newBoard[move.from.row][move.from.col];
        newBoard[move.from.row][move.from.col] = null;
        if (move.to.row === 0 && newBoard[move.to.row][move.to.col] === "p") {
          newBoard[move.to.row][move.to.col] = "q";
        }
        if (move.to.row === 7 && newBoard[move.to.row][move.to.col] === "P") {
          newBoard[move.to.row][move.to.col] = "Q";
        }
        setBoard(newBoard);
        setMoveCount((prev) => prev + 1);
        const msg = getBotCommentary(selectedBot.name, moveCount + 1);
        if (msg) {
          setBotMessage(msg);
          if (botMessageTimeoutRef.current)
            clearTimeout(botMessageTimeoutRef.current);
          botMessageTimeoutRef.current = setTimeout(
            () => setBotMessage(null),
            3e3
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
    moveCount
  ]);
  const startGame = reactExports.useCallback((bot) => {
    setSelectedBot(bot);
    setGameMode("color-select");
  }, []);
  const beginPlay = reactExports.useCallback(
    (color) => {
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
        setIsBotThinking(true);
        botTimeoutRef.current = setTimeout(() => {
          const botBoard = toBotBoard(cloneBoard(INITIAL_BOARD));
          const move = getBotMove(
            botBoard,
            "w",
            selectedBot.difficulty
          );
          if (move) {
            const newBoard = cloneBoard(INITIAL_BOARD);
            const target = newBoard[move.to.row][move.to.col];
            if (target) {
              setCapturedWhite((prev) => [...prev, target]);
            }
            newBoard[move.to.row][move.to.col] = newBoard[move.from.row][move.from.col];
            newBoard[move.from.row][move.from.col] = null;
            if (move.to.row === 7 && newBoard[move.to.row][move.to.col] === "P") {
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
        }, selectedBot.thinkingTime);
      }
    },
    [selectedBot, toBotBoard, handleGameOver]
  );
  const handleSquareClick = reactExports.useCallback(
    (row, col) => {
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
      currentPlayer
    ]
  );
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };
  if (!chessPlayer) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGate, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}) }) });
  }
  if (gameMode === "select") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGate, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 py-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl md:text-4xl font-display font-bold text-foreground mb-2", children: "Chess Arena — Bot Challenge" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Choose your opponent and prove your skill" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8", children: BOTS.map((bot) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => startGame(bot),
          className: `${bot.cssClass} group relative p-5 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm hover:bg-card/80 transition-all duration-200 text-left flex flex-col gap-3`,
          "data-ocid": `chess.bot_select.${bot.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-3xl", children: [
                bot.id === "undead" && "🧟",
                bot.id === "bull" && "🐂",
                bot.id === "gargoyle" && "🗿",
                bot.id === "dragon" && "🐉",
                bot.id === "lostknight" && "🛡️",
                bot.id === "sorrowqueen" && "👑",
                bot.id === "ruinking" && "⚔️"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-bold text-foreground", children: bot.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium", children: [
                  "Novice",
                  "Easy",
                  "Medium",
                  "Hard",
                  "Expert",
                  "Master",
                  "Legend"
                ][bot.difficulty - 1] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground leading-relaxed", children: bot.description })
          ]
        },
        bot.id
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/chess",
          className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors",
          "data-ocid": "chess.back_to_local_link",
          children: "Back to Local Play"
        }
      ) })
    ] }) }) });
  }
  if (gameMode === "color-select" && selectedBot) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGate, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto px-4 py-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-5xl mb-4", children: [
        selectedBot.id === "undead" && "🧟",
        selectedBot.id === "bull" && "🐂",
        selectedBot.id === "gargoyle" && "🗿",
        selectedBot.id === "dragon" && "🐉",
        selectedBot.id === "lostknight" && "🛡️",
        selectedBot.id === "sorrowqueen" && "👑",
        selectedBot.id === "ruinking" && "⚔️"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold text-foreground mb-1", children: selectedBot.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mb-8", children: "Choose your side" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 justify-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => beginPlay("w"),
            className: "flex flex-col items-center gap-3 px-8 py-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:bg-card/80 transition-all duration-200 min-w-[160px]",
            "data-ocid": "chess.play_white_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-5xl",
                  style: {
                    color: "#000000",
                    textShadow: "0 1px 3px rgba(0,0,0,0.3)"
                  },
                  children: "♔"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground text-lg", children: "Play as White" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "You go first" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => beginPlay("b"),
            className: "flex flex-col items-center gap-3 px-8 py-6 rounded-xl bg-card border border-border/50 hover:border-primary/50 hover:bg-card/80 transition-all duration-200 min-w-[160px]",
            "data-ocid": "chess.play_black_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-5xl",
                  style: {
                    color: "#000000",
                    textShadow: "0 0 4px rgba(255,255,255,0.6)"
                  },
                  children: "♚"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground text-lg", children: "Play as Black" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Bot goes first" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => setGameMode("select"),
          className: "mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors",
          "data-ocid": "chess.back_to_bots_button",
          children: "Back to bot selection"
        }
      )
    ] }) }) });
  }
  if (gameMode === "playing" && selectedBot) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGate, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 py-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hud-glass flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl bg-card/70 backdrop-blur-md border border-border/50 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl", children: [
            selectedBot.id === "undead" && "🧟",
            selectedBot.id === "bull" && "🐂",
            selectedBot.id === "gargoyle" && "🗿",
            selectedBot.id === "dragon" && "🐉",
            selectedBot.id === "lostknight" && "🛡️",
            selectedBot.id === "sorrowqueen" && "👑",
            selectedBot.id === "ruinking" && "⚔️"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-sm", children: selectedBot.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: [
              "Novice",
              "Easy",
              "Medium",
              "Hard",
              "Expert",
              "Master",
              "Legend"
            ][selectedBot.difficulty - 1] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Moves" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono font-bold text-foreground", children: moveCount })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono font-bold text-foreground", children: formatTime(elapsedSeconds) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Captures" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono font-bold text-foreground", children: humanColor === "w" ? capturedBlack.length : capturedWhite.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "You" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono font-bold text-foreground", children: humanColor === "w" ? "White" : "Black" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setGameMode("select"),
            className: "px-3 py-1.5 text-xs rounded-md bg-muted hover:bg-muted/80 transition-colors text-muted-foreground",
            "data-ocid": "chess.exit_button",
            children: "Exit"
          }
        )
      ] }),
      humanColor === "b" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-block px-3 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium", children: "You are playing Black — board shows White's perspective" }) }),
      botMessage && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium animate-pulse", children: [
        selectedBot.name,
        ': "',
        botMessage,
        '"'
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: `inline-block px-4 py-1.5 rounded-full text-sm font-medium ${currentPlayer === humanColor ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}`,
          children: currentPlayer === humanColor ? "Your turn" : `${selectedBot.name} is thinking...`
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "relative",
          style: {
            width: "min(90vw, 560px)",
            height: "min(90vw, 560px)",
            margin: "0 auto"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "grid grid-cols-8 gap-0 border-2 border-border rounded-lg overflow-hidden shadow-lg",
                style: { width: "100%", height: "100%" },
                children: board.map(
                  (row, r) => row.map((piece, c) => {
                    const displayRow = 7 - r;
                    const isLight = (displayRow + c) % 2 === 0;
                    const isSelected = (selectedSquare == null ? void 0 : selectedSquare.row) === r && (selectedSquare == null ? void 0 : selectedSquare.col) === c;
                    const isLegal = legalMoves.some(
                      (m) => m.row === r && m.col === c
                    );
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleSquareClick(r, c),
                        className: `relative w-full aspect-square flex items-center justify-center text-3xl md:text-4xl select-none transition-colors duration-150 ${isLight ? "bg-[#f0d9b5]" : "bg-[#b58863]"} ${isSelected ? "ring-2 ring-yellow-400 ring-inset" : ""}`,
                        "data-ocid": `chess.square.${r}.${c}`,
                        children: [
                          piece && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "relative z-10",
                              style: isWhitePiece(piece) ? {
                                color: "#1a1a1a",
                                textShadow: "0 1px 2px rgba(0,0,0,0.3), 0 0 1px rgba(0,0,0,0.5)",
                                fontWeight: 700
                              } : {
                                color: "#1a1a1a",
                                textShadow: "0 0 3px rgba(255,255,255,0.8), 0 0 6px rgba(255,255,255,0.5), 0 0 10px rgba(255,255,255,0.3)",
                                fontWeight: 700
                              },
                              children: PIECE_UNICODE[piece]
                            }
                          ),
                          isLegal && !piece && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute w-3 h-3 rounded-full bg-blue-500/60" }),
                          isLegal && piece && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 border-2 border-blue-500/60 rounded-none" })
                        ]
                      },
                      `sq-${String.fromCharCode(97 + c)}${displayRow + 1}`
                    );
                  })
                )
              }
            ),
            isBotThinking && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-lg",
                style: { pointerEvents: "none" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "px-4 py-2 rounded-lg bg-card/90 text-foreground font-medium text-sm animate-pulse",
                    style: { pointerEvents: "none" },
                    children: [
                      selectedBot.name,
                      " is thinking..."
                    ]
                  }
                )
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center justify-between text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs mr-1", children: "You captured:" }),
          (humanColor === "w" ? capturedBlack : capturedWhite).map(
            (p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-lg",
                children: p ? PIECE_UNICODE[p] : null
              },
              `cap-you-${p}-${i}-${Date.now()}`
            )
          ),
          (humanColor === "w" ? capturedBlack : capturedWhite).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs mr-1", children: "Bot captured:" }),
          (humanColor === "w" ? capturedWhite : capturedBlack).map(
            (p, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-lg",
                children: p ? PIECE_UNICODE[p] : null
              },
              `cap-bot-${p}-${i}-${Date.now()}`
            )
          ),
          (humanColor === "w" ? capturedWhite : capturedBlack).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "—" })
        ] })
      ] })
    ] }) }) });
  }
  if (gameMode === "game-over" && selectedBot) {
    const resultClass = gameResult === "win" ? "result-win" : gameResult === "loss" ? "result-loss" : "result-draw";
    const resultText = gameResult === "win" ? "Victory!" : gameResult === "loss" ? "Defeat" : "Draw";
    const base = gameResult === "win" ? 100 : gameResult === "draw" ? 50 : 0;
    const capturesBonus = capturedBlack.length * 10;
    const timeBonus = Math.max(0, 300 - elapsedSeconds);
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background flex items-center justify-center px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthGate, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `${resultClass} w-full max-w-md p-8 rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 text-center shadow-2xl`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-5xl mb-4", children: [
            selectedBot.id === "undead" && "🧟",
            selectedBot.id === "bull" && "🐂",
            selectedBot.id === "gargoyle" && "🗿",
            selectedBot.id === "dragon" && "🐉",
            selectedBot.id === "lostknight" && "🛡️",
            selectedBot.id === "sorrowqueen" && "👑",
            selectedBot.id === "ruinking" && "⚔️"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-display font-bold text-foreground mb-1", children: resultText }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground mb-6", children: [
            "vs ",
            selectedBot.name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-left bg-muted/40 rounded-xl p-4 mb-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Base Score" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-bold text-foreground", children: [
                "+",
                base
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Captures Bonus" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-bold text-foreground", children: [
                "+",
                capturesBonus
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Time Bonus" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-bold text-foreground", children: [
                "+",
                timeBonus
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-2 flex justify-between text-base", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-primary text-lg", children: totalScore })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => startGame(selectedBot),
                className: "px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors",
                "data-ocid": "chess.play_again_button",
                children: "Play Again"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setGameMode("select"),
                className: "px-6 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors",
                "data-ocid": "chess.choose_bot_button",
                children: "Choose Another Bot"
              }
            )
          ] })
        ]
      }
    ) }) });
  }
  return null;
}
export {
  ChessBotPage as default
};
