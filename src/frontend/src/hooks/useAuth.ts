import { useCallback, useState } from "react";

export function useAuth() {
  const [isAuthenticated] = useState(false);
  const [isLoading] = useState(false);

  const login = useCallback(async () => {}, []);
  const logout = useCallback(() => {}, []);

  return {
    identity: null,
    loginStatus: "idle" as const,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
