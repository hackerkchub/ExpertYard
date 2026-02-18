import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { socket } from "../shared/api/socket";

import UserAppRoutes from "../apps/user/routes";
import ExpertAppRoutes from "../apps/expert/routes";
import AdminAppRoutes from "../apps/admin/routes";

export default function AppRouter() {

  /* ---------------------------------------------
     👁️ TAB VISIBILITY → AUTO RECONNECT
  --------------------------------------------- */
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        if (!socket.connected) {
          console.log("👁️ Reconnecting socket on tab focus...");
          socket.connect();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  /* ---------------------------------------------
     OPTIONAL: DEBUG CONNECTION STATE
  --------------------------------------------- */
  useEffect(() => {
    socket.on("connect", () => {
      console.log("🟢 Socket connected from AppRouter:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <Routes>
      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/user" />} />

      {/* User */}
      <Route path="/user/*" element={<UserAppRoutes />} />

      {/* Expert */}
      <Route path="/expert/*" element={<ExpertAppRoutes />} />

      {/* Admin */}
      <Route path="/admin/*" element={<AdminAppRoutes />} />
    </Routes>
  );
}
