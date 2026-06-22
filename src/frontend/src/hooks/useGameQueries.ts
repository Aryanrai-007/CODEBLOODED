import type {
  AchievementResult,
  PlayerAchievement,
  PlayerSkin,
  SkinResult,
} from "@/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { mockBackend } from "../mocks/backend";

export function usePlayerAchievements(playerId: string | null) {
  return useQuery<Array<PlayerAchievement>>({
    queryKey: ["playerAchievements", playerId],
    queryFn: () =>
      playerId ? mockBackend.getPlayerAchievements(playerId) : [],
    enabled: !!playerId,
  });
}

export function usePlayerSkins(playerId: string | null) {
  return useQuery<Array<PlayerSkin>>({
    queryKey: ["playerSkins", playerId],
    queryFn: () => (playerId ? mockBackend.getPlayerSkins(playerId) : []),
    enabled: !!playerId,
  });
}

export function useEquippedSkin(playerId: string | null) {
  return useQuery<PlayerSkin | null>({
    queryKey: ["equippedSkin", playerId],
    queryFn: () => (playerId ? mockBackend.getEquippedSkin(playerId) : null),
    enabled: !!playerId,
  });
}

export function useUnlockAchievement() {
  const queryClient = useQueryClient();
  return useMutation<
    AchievementResult,
    Error,
    { playerId: string; achievementId: string }
  >({
    mutationFn: ({ playerId, achievementId }) =>
      mockBackend.unlockAchievement(playerId, achievementId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["playerAchievements", variables.playerId],
      });
    },
  });
}

export function useUnlockSkin() {
  const queryClient = useQueryClient();
  return useMutation<SkinResult, Error, { playerId: string; skinId: string }>({
    mutationFn: ({ playerId, skinId }) =>
      mockBackend.unlockSkin(playerId, skinId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["playerSkins", variables.playerId],
      });
    },
  });
}

export function useEquipSkin() {
  const queryClient = useQueryClient();
  return useMutation<SkinResult, Error, { playerId: string; skinId: string }>({
    mutationFn: ({ playerId, skinId }) =>
      mockBackend.equipSkin(playerId, skinId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["equippedSkin", variables.playerId],
      });
      queryClient.invalidateQueries({
        queryKey: ["playerSkins", variables.playerId],
      });
    },
  });
}
