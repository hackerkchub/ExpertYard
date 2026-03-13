import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { socket } from "../shared/api/socket";
import { useSoundInit } from "../shared/services/sound/useSoundInit";

import UserAppRoutes from "../apps/user/routes";
import ExpertAppRoutes from "../apps/expert/routes";
import AdminAppRoutes from "../apps/admin/routes";
import { ExpertProvider } from "../shared/context/ExpertContext";
import BottomNavbar from "../shared/components/BottomNavbar/BottomNavbar";
import RouteLoader from "../shared/loaders/RouteLoader";
import RootRedirect from "./RootRedirect";

// ✅ NETWORK STATUS COMPONENT IMPORT
import NetworkStatus from "../shared/components/NetworkStatus/NetworkStatus";

export default function AppRouter() {

  useSoundInit();

  const location = useLocation();   // ✅ ADD THIS

  const showNavbar =
    location.pathname.startsWith("/user") ||
    location.pathname.startsWith("/expert");

  /* socket reconnect */
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

//   useEffect(() => {

//   if ("Notification" in window) {
//     Notification.requestPermission();
//   }

// }, []);

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
    <div className="app-main-layout" style={{ width: "100%", overflowX: "hidden", position: "relative" }}>
       {/* ✅ NETWORK STATUS TOAST (Global) */}
      <NetworkStatus />

      <div
        className="main-content-wrapper"
        style={{
          paddingBottom: showNavbar ? "var(--nav-height, 70px)" : "0px",
          width: "100%",
          overflowX: "hidden"
        }}
      >
        <RouteLoader />
        <Routes>

          <Route path="/" element={<RootRedirect />} />

          {/* USER */}
          <Route path="/user/*" element={<UserAppRoutes />} />

          {/* EXPERT */}
          <Route
            path="/expert/*"
            element={
              <ExpertProvider>
                <ExpertAppRoutes />
              </ExpertProvider>
            }
          />

          {/* ADMIN */}
          <Route path="/admin/*" element={<AdminAppRoutes />} />

        </Routes>
      </div>

      {showNavbar && <BottomNavbar />}

    </div>
  );
}