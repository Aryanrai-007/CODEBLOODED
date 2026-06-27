import { createActor } from "@/backend";
import type { ChessPlayer } from "@/types/chess";
import { useActor } from "@caffeineai/core-infrastructure";
import { useCallback, useState } from "react";

const STORAGE_KEY = "chessPlayer";

function getStoredPlayer(): ChessPlayer | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as ChessPlayer) : null;
  } catch {
    return null;
  }
}

export function useChessAuth() {
  const { actor } = useActor(createActor);
  const [currentPlayer, setCurrentPlayer] = useState<ChessPlayer | null>(
    getStoredPlayer,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persist = useCallback((player: ChessPlayer | null) => {
    setCurrentPlayer(player);
    if (player) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const registerChessPlayer = useCallback(
    async (username: string): Promise<boolean> => {
      if (!actor) {
        setError("Backend not connected.");
        return false;
      }
      const trimmed = username.trim();
      if (!trimmed) {
        setError("Username is required.");
        return false;
      }
      setIsLoading(true);
      setError(null);
      try {
        const result = await actor.createChessPlayer(trimmed);
        if (result.__kind__ === "err") {
          setError(result.err);
          return false;
        }
        // Fetch all players to get the newly created one
        const players = await actor.getChessPlayers();
        const me = players.find((p) => p.username === trimmed);
        if (me) {
          persist(me);
          return true;
        }
        setError("Player created but could not be retrieved.");
        return false;
      } catch (_e) {
        setError("Registration failed. Please try again.");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [actor, persist],
  );

  const loginChessPlayer = useCallback(
    async (username: string): Promise<boolean> => {
      if (!actor) {
        setError("Backend not connected.");
        return false;
      }
      const trimmed = username.trim();
      if (!trimmed) {
        setError("Username is required.");
        return false;
      }
      setIsLoading(true);
      setError(null);
      try {
        const players = await actor.getChessPlayers();
        const me = players.find((p) => p.username === trimmed);
        if (me) {
          persist(me);
          return true;
        }
        setError("Username not found. Please create an account first.");
        return false;
      } catch (_e) {
        setError("Login failed. Please try again.");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [actor, persist],
  );

  const logoutChessPlayer = useCallback(() => {
    persist(null);
  }, [persist]);

  return {
    currentPlayer,
    isLoggedIn: !!currentPlayer,
    isLoading,
    error,
    registerChessPlayer,
    loginChessPlayer,
    logoutChessPlayer,
    clearError: () => setError(null),
  };
}
