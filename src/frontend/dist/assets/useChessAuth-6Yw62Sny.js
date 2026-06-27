import { a as useActor, r as reactExports, b as createActor } from "./index-Cczox6Vj.js";
const STORAGE_KEY = "chessPlayer";
function getStoredPlayer() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}
function useChessAuth() {
  const { actor } = useActor(createActor);
  const [currentPlayer, setCurrentPlayer] = reactExports.useState(
    getStoredPlayer
  );
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const persist = reactExports.useCallback((player) => {
    setCurrentPlayer(player);
    if (player) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);
  const registerChessPlayer = reactExports.useCallback(
    async (username) => {
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
    [actor, persist]
  );
  const loginChessPlayer = reactExports.useCallback(
    async (username) => {
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
    [actor, persist]
  );
  const logoutChessPlayer = reactExports.useCallback(() => {
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
    clearError: () => setError(null)
  };
}
export {
  useChessAuth as u
};
