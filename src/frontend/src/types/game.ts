export interface GamePlayer {
  playerId: string;
  username: string;
  passwordHash: string;
  createdAt: bigint;
}

export interface GameScore {
  scoreId: string;
  playerId: string;
  gameId: string;
  score: bigint;
  killedEnemies: bigint;
  wavesCleared: bigint;
  achievedAt: bigint;
}

export type RegisterResult =
  | { __kind__: "ok"; ok: string }
  | { __kind__: "err"; err: string };

export type LoginResult =
  | { __kind__: "ok"; ok: GamePlayer }
  | { __kind__: "err"; err: string };

export interface PlayerRank {
  playerId: string;
  username: string;
  score: bigint;
  rank: bigint;
}
