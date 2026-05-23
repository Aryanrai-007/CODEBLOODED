import { createActor } from "@/backend";
import type { GamePlayer, GameScore } from "@/types/game";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGamePlayers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<GamePlayer[]>({
    queryKey: ["gamePlayers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getGamePlayers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllGameScores() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<GameScore[]>({
    queryKey: ["allGameScores"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGameScores();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeleteGamePlayer() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (playerId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteGamePlayer(playerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gamePlayers"] });
      queryClient.invalidateQueries({ queryKey: ["allGameScores"] });
    },
  });
}

export function useDeleteGameScore() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (scoreId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteGameScore(scoreId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allGameScores"] });
      queryClient.invalidateQueries({ queryKey: ["topScores"] });
      queryClient.invalidateQueries({ queryKey: ["grandLeaderboard"] });
    },
  });
}
