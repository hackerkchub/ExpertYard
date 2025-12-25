// src/shared/api/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || "https://softmaxs.com/";

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  transports: ["websocket", "polling"],
  // ✅ FORCE same namespace
  forceNew: false
});

// ✅ Manual connect on app load
socket.connect();
