import { ApplicationStatus } from "../backend";
export { ApplicationStatus };
export type {
  GamePlayer,
  GameScore,
  RegisterResult,
  LoginResult,
  PlayerRank,
} from "./game";

export interface Application {
  id: bigint;
  name: string;
  email: string;
  phone: string;
  yearOfStudy: string;
  department: string;
  reasonForJoining: string;
  priorExperience: string;
  submittedAt: bigint;
  status: ApplicationStatus;
}

export type SubmitApplicationResult =
  | { __kind__: "ok"; ok: bigint }
  | { __kind__: "err"; err: string };

export interface SubmitApplicationInput {
  name: string;
  email: string;
  phone: string;
  yearOfStudy: string;
  department: string;
  reasonForJoining: string;
  priorExperience: string;
}

export interface CalendarEvent {
  id: bigint;
  subject: string;
  date: string;
  time: string;
  description: string;
  category: string;
  createdAt: bigint;
}

export interface CreateEventInput {
  subject: string;
  description: string;
  date: string;
  time: string;
  category: string;
}
