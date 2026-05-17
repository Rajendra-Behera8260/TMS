import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { axiosInstance } from "../api/axiosInstance";
import { clearAuthSession, getStoredToken, getStoredUser, isTokenValid, storeAuthSession } from "../utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => getStoredUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getStoredToken();
      const storedUser = getStoredUser();

      if (!storedToken || !isTokenValid(storedToken)) {
        clearAuthSession();
        setToken(null);
        setUser(null);
        setIsLoading(false);
        return;
      }

      setToken(storedToken);
      setUser(storedUser);

      try {
        const { data: profile } = await axiosInstance.get("/api/dashboard/me", {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        setUser(profile);
        storeAuthSession({ token: storedToken, user: profile });
      } catch {
        clearAuthSession();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = ({ token: nextToken, user: nextUser }) => {
    storeAuthSession({ token: nextToken, user: nextUser });
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    clearAuthSession();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isLoading,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
    }),
    [token, user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
