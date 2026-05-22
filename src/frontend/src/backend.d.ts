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
export interface Application {
    id: bigint;
    reasonForJoining: string;
    name: string;
    submittedAt: Timestamp;
    email: string;
    phone: string;
    department: string;
    priorExperience: string;
    yearOfStudy: string;
}
export interface backendInterface {
    getApplications(): Promise<Array<Application>>;
    submitApplication(name: string, email: string, phone: string, yearOfStudy: string, department: string, reasonForJoining: string, priorExperience: string): Promise<SubmitResult>;
}
