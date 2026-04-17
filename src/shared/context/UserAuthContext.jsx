import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { loginUserApi } from "../api/userApi";
import { disconnectSocket } from "../api/socket";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const TOKEN_KEY = "user_token";
const USER_KEY = "user";

// ✅ Helper function to clear API cache properly
const clearApiCache = async () => {
  if ("caches" in window) {
    try {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name.includes("api-cache")) {
            console.log(`🗑️ Clearing cache: ${name}`);
            return caches.delete(name);
          }
          return Promise.resolve();
        })
      );
      console.log("✅ API cache cleared successfully");
    } catch (err) {
      console.error("❌ Cache clear error:", err);
    }
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [initializing, setInitializing] = useState(true);
  const [prevUserId, setPrevUserId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // ✅ ADD refresh trigger

  // ✅ USER SWITCH DETECTION - No reload, just refresh
  useEffect(() => {
    const currentUserId = user?.id;

    if (!currentUserId) return;

    // 🔥 USER SWITCH DETECTED
    if (prevUserId && prevUserId !== currentUserId) {
      console.log("⚠️ User switched from", prevUserId, "to", currentUserId, "- clearing cache & refreshing...");
      
      // ✅ Clear cache and trigger refresh without reload
      const handleUserSwitch = async () => {
        await clearApiCache();
        disconnectSocket();
        setRefreshKey(prev => prev + 1); // 🔥 Trigger UI refresh across all components
        console.log("✅ User switch completed - UI refresh triggered");
      };
      
      handleUserSwitch();
    }

    setPrevUserId(currentUserId);
  }, [user, prevUserId]);

  // ✅ Clean up reload flag on mount (not needed anymore but keeping for compatibility)
  useEffect(() => {
    sessionStorage.removeItem("reloaded");
  }, []);

  /* ================= INIT ================= */
  useEffect(() => {
    setInitializing(false);
  }, []);

  /* ================= SYNC AUTH ACROSS TABS ================= */
  useEffect(() => {
    const syncAuth = () => {
      const newToken = localStorage.getItem(TOKEN_KEY);
      const newUserRaw = localStorage.getItem(USER_KEY);
      const newUser = newUserRaw ? JSON.parse(newUserRaw) : null;
      
      // Check if user actually changed
      const oldUserId = user?.id;
      const newUserId = newUser?.id;
      
      setToken(newToken);
      setUser(newUser);
      
      // If user changed in another tab, trigger refresh
      if (oldUserId && newUserId && oldUserId !== newUserId) {
        console.log("⚠️ User changed in another tab - triggering refresh");
        setRefreshKey(prev => prev + 1);
      }
    };
    
    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, [user?.id]);

  /* ================= LOGIN ================= */
  const login = async (payload) => {
    // ✅ Clear cache before login
    await clearApiCache();
    
    const res = await loginUserApi(payload);

    /**
     * EXPECTED BACKEND RESPONSE:
     * {
     *   success: true,
     *   token: "...",
     *   user: { id: 6, name: "Rahul", email: "..." }
     * }
     */
    if (res?.success && res?.token && res?.user) {
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(res.user));

      setToken(res.token);
      setUser(res.user);
      
      // ✅ Trigger refresh after login
      setRefreshKey(prev => prev + 1);
    }
    
    return res;
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    // ✅ Clear local storage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    // ✅ Clear service worker caches properly
    await clearApiCache();

    // ✅ Reset state
    setToken(null);
    setUser(null);

    // 🔌 Disconnect socket
    disconnectSocket();
    
    // ✅ Trigger refresh instead of reload
    setRefreshKey(prev => prev + 1);
  };

  const value = {
    token,
    user,                // ✅ IMPORTANT
    refreshKey,          // ✅ ADD refresh trigger for components
    isLoggedIn: Boolean(token),
    login,
    logout
  };

  if (initializing) return null;

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};