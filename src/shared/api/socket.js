// src/shared/api/socket.js
import { io } from "socket.io-client";
// import { APP_CONFIG } from "../../config/appConfig";

const SOCKET_URL = "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  transports: ["polling", "websocket"],
  autoConnect: true
});

