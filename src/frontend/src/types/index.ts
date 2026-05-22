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
