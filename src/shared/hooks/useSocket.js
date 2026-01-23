// src/shared/hooks/useSocket.js
import { useEffect, useRef } from "react";
import { socket } from "../api/socket";

let globalIdentity = null; // 🔒 HARD LOCK

export function useSocket(userId, role = "user") {
  const registeredRef = useRef(false);

  useEffect(() => {
    if (!userId) return;

    const identity = `${role}:${userId}`;

    // ❌ Prevent identity clash
    if (globalIdentity && globalIdentity !== identity) {
      console.warn(
        "⛔ Socket already registered as",
        globalIdentity,
        "→ ignoring",
        identity
      );
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    if (!registeredRef.current) {
      socket.emit("register", {
        userId: Number(userId),
        role,
      });

      console.log("🟢 Socket registered:", identity);

      registeredRef.current = true;
      globalIdentity = identity;
    }

    return () => {
      // ❌ NEVER disconnect here
    };
  }, [userId, role]);

  return socket;
}
