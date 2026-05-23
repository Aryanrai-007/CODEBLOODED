import { createActor } from "@/backend";
import type { GamePlayer } from "@/types/game";
import { useActor } from "@caffeineai/core-infrastructure";
import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "gamePlayer";

export function useGameAuth() {
  const { actor } = useActor(createActor);
  const [currentPlayer, setCurrentPlayer] = useState<GamePlayer | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as GamePlayer) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persist = useCallback((player: GamePlayer | null) => {
    setCurrentPlayer(player);
    if (player) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const register = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      if (!actor) return false;
      setIsLoading(true);
      setError(null);
      try {
        const result = await actor.registerGamePlayer(username, password);
        if (result.__kind__ === "err") {
          setError(result.err);
          return false;
        }
        // After registering, login to get player object
        const loginResult = await actor.loginGamePlayer(username, password);
        if (loginResult.__kind__ === "err") {
          setError(loginResult.err);
          return false;
        }
        persist(loginResult.ok);
        return true;
      } catch (_e) {
        setError("Registration failed. Please try again.");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [actor, persist],
  );

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      if (!actor) return false;
      setIsLoading(true);
      setError(null);
      try {
        const result = await actor.loginGamePlayer(username, password);
        if (result.__kind__ === "err") {
          setError(result.err);
          return false;
        }
        persist(result.ok);
        return true;
      } catch (_e) {
        setError("Login failed. Please try again.");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [actor, persist],
  );

  const logout = useCallback(() => {
    persist(null);
  }, [persist]);

  return {
    currentPlayer,
    isLoggedIn: !!currentPlayer,
    isLoading,
    error,
    register,
    login,
    logout,
    clearError: () => setError(null),
  };
}
