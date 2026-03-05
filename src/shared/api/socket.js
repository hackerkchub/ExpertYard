import { io } from "socket.io-client";

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

/* -------------------------------------------------------
   🌐 CREATE SOCKET INSTANCE
------------------------------------------------------- */
export const socket = io("https://softmaxs.com", {
  path: "/socket.io",
  transports: ["websocket"],
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 2000,
  reconnectionDelayMax: 5000,
});

/* -------------------------------------------------------
   🟢 CONNECT FUNCTION
------------------------------------------------------- */
export const connectSocket = ({ userId, role }) => {
  const token = getAuthToken(role);

  if (!token) {
    console.warn("❌ No token found for role:", role);
    return;
  }

  socket.auth = { token };

  if (!socket.connected) {
    socket.connect();
  }

  socket.off("connect");

  socket.on("connect", () => {
    console.log("🟢 Socket connected:", socket.id);

    socket.emit("register", {
      userId,
      role,
    });
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
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && socket.auth?.token) {
      if (!socket.connected) {
        console.log("👁️ Reconnecting socket on tab focus...");
        socket.connect();
      }
    }
  });

  window.__socket = socket;
}