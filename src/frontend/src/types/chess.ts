export interface ChessPlayer {
  playerId: string;
  username: string;
  createdAt: bigint;
}

export interface ChessScore {
  playerId: string;
  botName: string;
  score: bigint;
  result: string;
  movesCount: bigint;
  createdAt: bigint;
  id?: string;
}
