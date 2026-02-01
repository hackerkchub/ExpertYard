// src/shared/api/socket.js
import { io } from "socket.io-client";

const userToken = localStorage.getItem("user_token");
const expertToken = localStorage.getItem("expert_token");

// ⚠️ decide once
const token = userToken || expertToken;

export const socket = io("https://softmaxs.com", {
  path: "/socket.io",
  transports: ["websocket"],   // 🔥 polling hata do
  autoConnect: false,
  auth: {
    token,                     // ✅ handshake-safe
  },
});

if (typeof window !== "undefined") {
  window.__socket = socket;
}