import type { backendInterface, CreateResult } from "../backend";
import { ApplicationStatus } from "../backend";

const mockChessScores: any[] = [];

export const mockBackend: backendInterface = {
  approveApplication: async (_id: bigint) => true,
  createChessPlayer: async (_username: string): Promise<CreateResult> => ({ __kind__: "ok", ok: "chess-001" }),
  createEvent: async (_input) => BigInt(1),
  deleteApplication: async (_id: bigint) => true,
  deleteChessPlayer: async (_playerId: string) => true,
  deleteEvent: async (_id: bigint) => true,
  getApplications: async () => [
    {
      id: BigInt(1),
      status: ApplicationStatus.pending,
      reasonForJoining: "I love hackathons and building innovative projects.",
      name: "Aryan Rai",
      submittedAt: BigInt(Date.now()) * BigInt(1000000),
      email: "aryan@example.com",
      phone: "9876543210",
      department: "Computer Science",
      priorExperience: "2 years of React and Node.js development.",
      yearOfStudy: "3rd Year",
    },
    {
      id: BigInt(2),
      status: ApplicationStatus.approved,
      reasonForJoining: "Want to learn and collaborate with talented devs.",
      name: "Priya Sharma",
      submittedAt: BigInt(Date.now()) * BigInt(1000000),
      email: "priya@example.com",
      phone: "9123456789",
      department: "Information Technology",
      priorExperience: "Python, ML basics.",
      yearOfStudy: "2nd Year",
    },
  ],
  getChessPlayers: async () => [
    {
      username: "ChessMaster",
      playerId: "chess-001",
      createdAt: BigInt(Date.now()) * BigInt(1000000),
    },
    {
      username: "KnightRider",
      playerId: "chess-002",
      createdAt: BigInt(Date.now()) * BigInt(1000000),
    },
  ],
  getEvents: async () => [
    {
      id: BigInt(1),
      subject: "Hackathon Kickoff 2026",
      date: "2026-06-15",
      createdAt: BigInt(Date.now()) * BigInt(1000000),
      time: "10:00 AM",
      description: "Annual hackathon kickoff with team formation and problem statements.",
      category: "Hackathon",
    },
    {
      id: BigInt(2),
      subject: "AI/ML Workshop",
      date: "2026-06-22",
      createdAt: BigInt(Date.now()) * BigInt(1000000),
      time: "2:00 PM",
      description: "Hands-on workshop on machine learning fundamentals.",
      category: "Workshop",
    },
  ],
  submitApplication: async (
    _name: string,
    _email: string,
    _phone: string,
    _yearOfStudy: string,
    _department: string,
    _reasonForJoining: string,
    _priorExperience: string
  ) => ({
    __kind__: "ok",
    ok: BigInt(3),
  }),
  updateEvent: async (_id: bigint, _input) => true,
  submitChessScore: async (playerId: string, botName: string, score: bigint, result: string, movesCount: bigint) => {
    mockChessScores.push({
      playerId,
      botName,
      score: Number(score),
      result,
      movesCount: Number(movesCount),
      createdAt: Date.now(),
    });
    return { __kind__: "ok", ok: null };
  },
  getChessScores: async () => mockChessScores,
  getChessLeaderboard: async () => {
    const sorted = [...mockChessScores].sort((a, b) => b.score - a.score).slice(0, 10);
    return sorted;
  },
};
