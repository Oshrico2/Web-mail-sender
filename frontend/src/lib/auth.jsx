import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, setUnauthorizedHandler } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("checking"); // checking | in | out

  // The session lives in an httpOnly cookie; ask the server who we are
  // instead of trusting a token copy in localStorage.
  useEffect(() => {
    let alive = true;
    api
      .get("/login/me")
      .then(({ data }) => {
        if (!alive) return;
        setUser(data.user);
        setStatus("in");
      })
      .catch(() => {
        if (!alive) return;
        setUser(null);
        setStatus("out");
      });
    // Clean up what older versions of the app left behind.
    ["token", "tokenExpiration", "user"].forEach((k) => localStorage.removeItem(k));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      setStatus("out");
    });
  }, []);

  const login = useCallback(async (username, password) => {
    const { data } = await api.post("/login", { username, password });
    setUser(data.user);
    setStatus("in");
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/login/logout");
    } finally {
      localStorage.removeItem("user");
      setUser(null);
      setStatus("out");
    }
  }, []);

  const value = useMemo(() => ({ user, status, login, logout }), [user, status, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
