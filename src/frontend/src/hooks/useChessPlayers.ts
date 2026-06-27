import { createActor } from "@/backend";
import type { ChessPlayer } from "@/types/chess";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useChessPlayers() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<ChessPlayer[]>({
    queryKey: ["chessPlayers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getChessPlayers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDeleteChessPlayer() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (playerId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteChessPlayer(playerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chessPlayers"] });
    },
  });
}
