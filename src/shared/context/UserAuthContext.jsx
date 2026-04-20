import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { disconnectSocket } from "../api/socket";
import { loginUserApi } from "../api/userApi";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const TOKEN_KEY = "user_token";
const USER_KEY = "user";

const clearApiCache = async () => {
  if ("caches" in window) {
    try {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name.includes("api-cache")) {
            console.log(`Clearing cache: ${name}`);
            return caches.delete(name);
          }

          return Promise.resolve();
        })
      );
      console.log("API cache cleared successfully");
    } catch (err) {
      console.error("Cache clear error:", err);
    }
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [initializing, setInitializing] = useState(true);
  const [prevUserId, setPrevUserId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const currentUserId = user?.id;

    if (!currentUserId) return;

    if (prevUserId && prevUserId !== currentUserId) {
      const handleUserSwitch = async () => {
        await clearApiCache();
        disconnectSocket();
        setRefreshKey((prev) => prev + 1);
      };

      handleUserSwitch();
    }

    setPrevUserId(currentUserId);
  }, [user, prevUserId]);

  useEffect(() => {
    sessionStorage.removeItem("reloaded");
  }, []);

  useEffect(() => {
    setInitializing(false);
  }, []);

  useEffect(() => {
    const syncAuth = () => {
      const newToken = localStorage.getItem(TOKEN_KEY);
      const newUserRaw = localStorage.getItem(USER_KEY);
      const newUser = newUserRaw ? JSON.parse(newUserRaw) : null;

      const oldUserId = user?.id;
      const newUserId = newUser?.id;

      setToken(newToken);
      setUser(newUser);

      if (oldUserId && newUserId && oldUserId !== newUserId) {
        setRefreshKey((prev) => prev + 1);
      }
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, [user?.id]);

  const login = async (payload) => {
    await clearApiCache();

    const res = await loginUserApi(payload);

    if (res?.success && res?.token && res?.user) {
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));

      setToken(res.token);
      setUser(res.user);
      setRefreshKey((prev) => prev + 1);
    }

    return res;
  };

  const logout = async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    await clearApiCache();

    setToken(null);
    setUser(null);
    disconnectSocket();
    setRefreshKey((prev) => prev + 1);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      refreshKey,
      isLoggedIn: Boolean(token),
      login,
      logout,
    }),
    [token, user, refreshKey]
  );

  if (initializing) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
