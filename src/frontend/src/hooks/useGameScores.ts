import type { GameScore, PlayerRank } from "@/types/game";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockBackend } from "../mocks/backend";

export function useTopScores(gameId: string, limit = 10) {
  return useQuery<GameScore[]>({
    queryKey: ["topScores", gameId, limit],
    queryFn: () => mockBackend.getTopScores(gameId, BigInt(limit)),
  });
}

export function usePlayerRank(gameId: string, playerId: string | undefined) {
  return useQuery<PlayerRank | null>({
    queryKey: ["playerRank", gameId, playerId],
    queryFn: () =>
      playerId ? mockBackend.getPlayerRank(gameId, playerId) : null,
    enabled: !!playerId,
  });
}

export function useGrandLeaderboard(limit = 10) {
  return useQuery<PlayerRank[]>({
    queryKey: ["grandLeaderboard", limit],
    queryFn: () => mockBackend.getGrandLeaderboard(BigInt(limit)),
  });
}

export function useSubmitGameScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      playerId: string;
      gameId: string;
      score: number;
      kills: number;
      waves: number;
    }) => {
      const result = await mockBackend.submitGameScore(
        params.playerId,
        params.gameId,
        BigInt(params.score),
        BigInt(params.kills),
        BigInt(params.waves),
      );
      if (result.__kind__ === "err") throw new Error(result.err);
      return result.ok;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["topScores", vars.gameId] });
      queryClient.invalidateQueries({
        queryKey: ["playerRank", vars.gameId, vars.playerId],
      });
      queryClient.invalidateQueries({ queryKey: ["grandLeaderboard"] });
    },
  });
}
