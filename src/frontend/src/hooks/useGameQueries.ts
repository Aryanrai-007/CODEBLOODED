import { createActor } from "@/backend";
import type {
  AchievementResult,
  PlayerAchievement,
  PlayerSkin,
  SkinResult,
  backendInterface,
} from "@/backend";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface ExtendedBackend extends backendInterface {
  getPlayerAchievements(playerId: string): Promise<Array<PlayerAchievement>>;
  getPlayerSkins(playerId: string): Promise<Array<PlayerSkin>>;
  getEquippedSkin(playerId: string): Promise<PlayerSkin | null>;
  equipSkin(playerId: string, skinId: string): Promise<SkinResult>;
  unlockAchievement(
    playerId: string,
    achievementId: string,
  ): Promise<AchievementResult>;
  unlockSkin(playerId: string, skinId: string): Promise<SkinResult>;
}

export function usePlayerAchievements(playerId: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Array<PlayerAchievement>>({
    queryKey: ["playerAchievements", playerId],
    queryFn: async () => {
      if (!actor || !playerId) return [];
      return (actor as unknown as ExtendedBackend).getPlayerAchievements(
        playerId,
      );
    },
    enabled: !!actor && !isFetching && !!playerId,
  });
}

export function usePlayerSkins(playerId: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Array<PlayerSkin>>({
    queryKey: ["playerSkins", playerId],
    queryFn: async () => {
      if (!actor || !playerId) return [];
      return (actor as unknown as ExtendedBackend).getPlayerSkins(playerId);
    },
    enabled: !!actor && !isFetching && !!playerId,
  });
}

export function useEquippedSkin(playerId: string | null) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<PlayerSkin | null>({
    queryKey: ["equippedSkin", playerId],
    queryFn: async () => {
      if (!actor || !playerId) return null;
      return (actor as unknown as ExtendedBackend).getEquippedSkin(playerId);
    },
    enabled: !!actor && !isFetching && !!playerId,
  });
}

export function useUnlockAchievement() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      playerId,
      achievementId,
    }: { playerId: string; achievementId: string }) => {
      if (!actor) return false;
      return (actor as unknown as ExtendedBackend).unlockAchievement(
        playerId,
        achievementId,
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["playerAchievements", variables.playerId],
      });
    },
  });
}

export function useUnlockSkin() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      playerId,
      skinId,
    }: { playerId: string; skinId: string }) => {
      if (!actor) return false;
      return (actor as unknown as ExtendedBackend).unlockSkin(playerId, skinId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["playerSkins", variables.playerId],
      });
    },
  });
}

export function useEquipSkin() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      playerId,
      skinId,
    }: { playerId: string; skinId: string }) => {
      if (!actor) return false;
      return (actor as unknown as ExtendedBackend).equipSkin(playerId, skinId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["equippedSkin", variables.playerId],
      });
    },
  });
}
