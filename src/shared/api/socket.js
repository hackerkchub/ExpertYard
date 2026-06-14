import { io } from "socket.io-client";
import { APP_CONFIG } from "../../config/appConfig";

/* -------------------------------------------------------
   🔐 GET TOKEN BY ROLE
------------------------------------------------------- */
const getAuthToken = (role) => {
  if (role === "user") {
    return localStorage.getItem("user_token");
  }

  if (role === "expert") {
    return localStorage.getItem("expert_token");
  }

  return null;
};

const getSocketBaseUrl = () => {
  try {
    const apiUrl = new URL(APP_CONFIG.API_BASE_URL);
    apiUrl.pathname = apiUrl.pathname.replace(/\/api\/?$/, "") || "/";
    apiUrl.search = "";
    apiUrl.hash = "";
    return apiUrl.origin;
  } catch {
    return "http://localhost:5000";
  }
};

/* -------------------------------------------------------
   🌐 CREATE SOCKET INSTANCE
------------------------------------------------------- */
export const socket = io(getSocketBaseUrl(), {
  path: "/socket.io",
 transports: ["websocket", "polling"],
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 2000,
  reconnectionDelayMax: 5000,
});

/* -------------------------------------------------------
   🟢 CONNECT FUNCTION
------------------------------------------------------- */
let registerOnConnectHandler = null;

export const connectSocket = ({ userId, role }) => {
  const token = getAuthToken(role);

  if (!token) {
    console.warn("❌ No token found for role:", role);
    return;
  }

  socket.auth = { token };

  if (registerOnConnectHandler) {
    socket.off("connect", registerOnConnectHandler);
  }

  registerOnConnectHandler = () => {
    console.log("🟢 Socket connected:", socket.id);

    socket.emit("register", {
      userId,
      role,
    });
  };

  socket.on("connect", registerOnConnectHandler);

  if (!socket.connected) {
    socket.connect();
    return;
  }

  socket.emit("register", {
    userId,
    role,
  });
};

/* -------------------------------------------------------
   🔴 DISCONNECT FUNCTION
------------------------------------------------------- */
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("🔴 Socket disconnected");
  }
};

/* -------------------------------------------------------
   👁️ TAB VISIBILITY RECONNECT FIX
------------------------------------------------------- */
if (typeof window !== "undefined") {
  const isNativeApp =
    window.location.origin.includes("localhost") &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (!isNativeApp) {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && socket.auth?.token) {
        if (!socket.connected) {
          console.log("👁️ Reconnecting socket on tab focus...");
          socket.connect();
        }
      }
    });
  }

  window.__socket = socket;
}
