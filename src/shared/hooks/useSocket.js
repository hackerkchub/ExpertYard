import { useEffect, useRef } from "react";
import { socket } from "../api/socket";

export function useSocket(userId, role = "user") {
  const registeredRef = useRef(false);

  useEffect(() => {
    if (!userId) return;

    if (!socket.connected) {
      socket.connect();
    }

    // always register when identity changes
    socket.emit("register", {
      userId: Number(userId),
      role,
    });

    registeredRef.current = true;

    console.log("🟢 Socket registered:", `${role}:${userId}`);

    // ❌ DO NOT disconnect here
  }, [userId, role]);

  return socket;
}
