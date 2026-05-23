import { createActor } from "@/backend";
import type { GameScore, PlayerRank } from "@/types/game";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useTopScores(gameId: string, limit = 10) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<GameScore[]>({
    queryKey: ["topScores", gameId, limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTopScores(gameId, BigInt(limit));
    },
    enabled: !!actor && !isFetching,
  });
}

export function usePlayerRank(gameId: string, playerId: string | undefined) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PlayerRank | null>({
    queryKey: ["playerRank", gameId, playerId],
    queryFn: async () => {
      if (!actor || !playerId) return null;
      return actor.getPlayerRank(gameId, playerId);
    },
    enabled: !!actor && !isFetching && !!playerId,
  });
}

export function useGrandLeaderboard(limit = 10) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PlayerRank[]>({
    queryKey: ["grandLeaderboard", limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGrandLeaderboard(BigInt(limit));
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitGameScore() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      playerId: string;
      gameId: string;
      score: number;
      kills: number;
      waves: number;
    }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.submitGameScore(
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
