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
export type ChessScoreResult = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export interface ChessPlayer {
    username: string;
    playerId: string;
    createdAt: Timestamp;
}
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
export interface ChessScore {
    result: string;
    playerId: string;
    createdAt: Timestamp;
    botName: string;
    score: bigint;
    movesCount: bigint;
}
export type CreateResult = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: string;
};
export enum ApplicationStatus {
    pending = "pending",
    approved = "approved"
}
export interface backendInterface {
    approveApplication(id: bigint): Promise<boolean>;
    createChessPlayer(username: string): Promise<CreateResult>;
    createEvent(input: CreateEventInput): Promise<bigint>;
    deleteApplication(id: bigint): Promise<boolean>;
    deleteChessPlayer(playerId: string): Promise<boolean>;
    deleteEvent(id: bigint): Promise<boolean>;
    getApplications(): Promise<Array<Application>>;
    getChessLeaderboard(): Promise<Array<ChessScore>>;
    getChessPlayers(): Promise<Array<ChessPlayer>>;
    getChessScores(): Promise<Array<ChessScore>>;
    getEvents(): Promise<Array<CalendarEvent>>;
    submitApplication(name: string, email: string, phone: string, yearOfStudy: string, department: string, reasonForJoining: string, priorExperience: string): Promise<SubmitResult>;
    submitChessScore(playerId: string, botName: string, score: bigint, result: string, movesCount: bigint): Promise<ChessScoreResult>;
    updateEvent(id: bigint, input: CreateEventInput): Promise<boolean>;
}
