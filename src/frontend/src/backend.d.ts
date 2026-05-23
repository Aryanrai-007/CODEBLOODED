import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type SubmitResult = {
    __kind__: "ok";
    ok: bigint;
} | {
    __kind__: "err";
    err: string;
};
export type Timestamp = bigint;
export type RegisterResult = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: string;
};
export interface CreateEventInput {
    subject: string;
    date: string;
    time: string;
    description: string;
    category: string;
}
export interface CalendarEvent {
    id: bigint;
    subject: string;
    date: string;
    createdAt: Timestamp;
    time: string;
    description: string;
    category: string;
}
export interface GameScore {
    playerId: string;
    achievedAt: Timestamp;
    gameId: string;
    wavesCleared: bigint;
    scoreId: string;
    score: bigint;
    killedEnemies: bigint;
}
export type SubmitScoreResult = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: string;
};
export interface GamePlayer {
    username: string;
    playerId: string;
    createdAt: Timestamp;
    passwordHash: string;
}
export type LoginResult = {
    __kind__: "ok";
    ok: GamePlayer;
} | {
    __kind__: "err";
    err: string;
};
export interface Application {
    id: bigint;
    status: ApplicationStatus;
    reasonForJoining: string;
    name: string;
    submittedAt: Timestamp;
    email: string;
    phone: string;
    department: string;
    priorExperience: string;
    yearOfStudy: string;
}
export interface PlayerRank {
    username: string;
    playerId: string;
    rank: bigint;
    score: bigint;
}
export enum ApplicationStatus {
    pending = "pending",
    approved = "approved"
}
export interface backendInterface {
    approveApplication(id: bigint): Promise<boolean>;
    createEvent(input: CreateEventInput): Promise<bigint>;
    deleteApplication(id: bigint): Promise<boolean>;
    deleteEvent(id: bigint): Promise<boolean>;
    deleteGamePlayer(playerId: string): Promise<boolean>;
    deleteGameScore(scoreId: string): Promise<boolean>;
    getAllGameScores(): Promise<Array<GameScore>>;
    getApplications(): Promise<Array<Application>>;
    getEvents(): Promise<Array<CalendarEvent>>;
    getGamePlayers(): Promise<Array<GamePlayer>>;
    getGrandLeaderboard(limit: bigint): Promise<Array<PlayerRank>>;
    getPlayerRank(gameId: string, playerId: string): Promise<PlayerRank | null>;
    getTopScores(gameId: string, limit: bigint): Promise<Array<GameScore>>;
    loginGamePlayer(username: string, password: string): Promise<LoginResult>;
    registerGamePlayer(username: string, password: string): Promise<RegisterResult>;
    submitApplication(name: string, email: string, phone: string, yearOfStudy: string, department: string, reasonForJoining: string, priorExperience: string): Promise<SubmitResult>;
    submitGameScore(playerId: string, gameId: string, score: bigint, kills: bigint, waves: bigint): Promise<SubmitScoreResult>;
    updateEvent(id: bigint, input: CreateEventInput): Promise<boolean>;
}
