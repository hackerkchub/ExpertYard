import { io } from "socket.io-client";

/* -------------------------------------------------------
   🔐 GET TOKEN DYNAMICALLY (IMPORTANT FOR RECONNECT)
------------------------------------------------------- */
const getAuthToken = () => {
  const userToken = localStorage.getItem("user_token");
  const expertToken = localStorage.getItem("expert_token");
  return userToken || expertToken;
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

  auth: {
    token: getAuthToken(),
  },
});

/* -------------------------------------------------------
   ♻️ AUTO UPDATE TOKEN BEFORE RECONNECT
------------------------------------------------------- */
socket.on("reconnect_attempt", () => {
  socket.auth = {
    token: getAuthToken(),
  };
});

/* -------------------------------------------------------
   🟢 CONNECT FUNCTION (CALL AFTER LOGIN)
------------------------------------------------------- */
export const connectSocket = ({ userId, role }) => {
  if (!socket.connected) {
    socket.auth = {
      token: getAuthToken(),
    };

    socket.connect();
  }

  socket.off("connect"); // prevent duplicate listener

  socket.on("connect", () => {
    console.log("🟢 Socket connected:", socket.id);

    socket.emit("register", {
      userId,
      role,
    });
  });
};

/* -------------------------------------------------------
   🔴 DISCONNECT FUNCTION (CALL ON LOGOUT)
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
    if (document.visibilityState === "visible") {
      if (!socket.connected) {
        console.log("👁️ Reconnecting socket on tab focus...");
        socket.connect();
      }
    }
  });

  window.__socket = socket; // debug helper
}
