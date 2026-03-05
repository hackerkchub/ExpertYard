import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { socket } from "../shared/api/socket";
 import { useSoundInit } from "../shared/services/sound/useSoundInit";

import UserAppRoutes from "../apps/user/routes";
import ExpertAppRoutes from "../apps/expert/routes";
import AdminAppRoutes from "../apps/admin/routes";
import { ExpertProvider } from "../shared/context/ExpertContext"; // ✅ ADD
import BottomNavbar from "../shared/components/BottomNavbar/BottomNavbar";

export default function AppRouter() {
useSoundInit();
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

   const showNavbar = location.pathname.startsWith("/user") || location.pathname.startsWith("/expert");

  return (
    <div className="app-main-layout" style={{ width: '100%', overflowX: 'hidden', position: 'relative' }}>
      {/* Padding tabhi add hogi jab screen mobile size (max-width: 768px) hogi */}
      <div 
        className="main-content-wrapper" 
        style={{ 
          paddingBottom: showNavbar ? "var(--nav-height, 70px)" : "0px",
          width: '100%',
          overflowX: 'hidden'
        }}
      >
    <Routes>
      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/user" />} />

      {/* User */}
      <Route path="/user/*" element={<UserAppRoutes />} />

      {/* Expert */}
     <Route
  path="/expert/*"
  element={
    <ExpertProvider>
      <ExpertAppRoutes />
    </ExpertProvider>
  }
/>
      {/* Admin */}
      <Route path="/admin/*" element={<AdminAppRoutes />} />
    </Routes>
     </div>
     {showNavbar && <BottomNavbar />}
    </div>
    
  );
}
