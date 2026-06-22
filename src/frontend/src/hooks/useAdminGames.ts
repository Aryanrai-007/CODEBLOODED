import type { GamePlayer, GameScore } from "@/types/game";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockBackend } from "../mocks/backend";

export function useGamePlayers() {
  return useQuery<GamePlayer[]>({
    queryKey: ["gamePlayers"],
    queryFn: () => mockBackend.getGamePlayers(),
  });
}

export function useAllGameScores() {
  return useQuery<GameScore[]>({
    queryKey: ["allGameScores"],
    queryFn: () => mockBackend.getAllGameScores(),
  });
}

export function useDeleteGamePlayer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (playerId: string) => mockBackend.deleteGamePlayer(playerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gamePlayers"] });
      queryClient.invalidateQueries({ queryKey: ["allGameScores"] });
    },
  });
}

export function useDeleteGameScore() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (scoreId: string) => mockBackend.deleteGameScore(scoreId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allGameScores"] });
      queryClient.invalidateQueries({ queryKey: ["topScores"] });
      queryClient.invalidateQueries({ queryKey: ["grandLeaderboard"] });
    },
  });
}
