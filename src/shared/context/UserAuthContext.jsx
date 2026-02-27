import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { loginUserApi } from "../api/userApi";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const TOKEN_KEY = "user_token";
const USER_KEY = "user";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [initializing, setInitializing] = useState(true);

  /* ================= INIT ================= */
  useEffect(() => {
    setInitializing(false);
  }, []);

  useEffect(() => {
  const syncAuth = () => {
  setToken(localStorage.getItem(TOKEN_KEY));

  const savedUser = localStorage.getItem(USER_KEY);
  setUser(savedUser ? JSON.parse(savedUser) : null);
};
  window.addEventListener("storage", syncAuth);
  return () => window.removeEventListener("storage", syncAuth);
}, []);

  /* ================= LOGIN ================= */
  const login = async (payload) => {
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
}
    return res;
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,                // ✅ IMPORTANT
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
