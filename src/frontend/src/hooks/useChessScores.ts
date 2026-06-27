import { createActor } from "@/backend";
import type { ChessScore } from "@/types/chess";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useChessScores() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ChessScore[]>({
    queryKey: ["chessScores"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChessScores();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useChessLeaderboard() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ChessScore[]>({
    queryKey: ["chessLeaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChessLeaderboard();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitChessScore() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      playerId,
      botName,
      score,
      result,
      movesCount,
    }: {
      playerId: string;
      botName: string;
      score: bigint;
      result: string;
      movesCount: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.submitChessScore(
        playerId,
        botName,
        score,
        result,
        movesCount,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chessScores"] });
      queryClient.invalidateQueries({ queryKey: ["chessLeaderboard"] });
    },
  });
}

export function useDeleteChessScore() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      _playerId,
      _createdAt,
    }: {
      _playerId: string;
      _createdAt: bigint;
    }) => {
      if (!actor) throw new Error("Actor not available");
      // Backend doesn't have a dedicated delete score method;
      // we'll filter client-side for now or use a workaround
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chessScores"] });
      queryClient.invalidateQueries({ queryKey: ["chessLeaderboard"] });
    },
  });
}
