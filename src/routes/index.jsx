import { useEffect, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { socket } from "../shared/api/socket";
import { useSoundInit } from "../shared/services/sound/useSoundInit";

// ✅ Code Splitting (Breaking the 429KB chain)
const UserAppRoutes = lazy(() => import("../apps/user/routes"));
const ExpertAppRoutes = lazy(() => import("../apps/expert/routes"));
const AdminAppRoutes = lazy(() => import("../apps/admin/routes"));

import { ExpertProvider } from "../shared/context/ExpertContext";
import BottomNavbar from "../shared/components/BottomNavbar/BottomNavbar";
import RouteLoader from "../shared/loaders/RouteLoader";
import RootRedirect from "./RootRedirect";
import NetworkStatus from "../shared/components/NetworkStatus/NetworkStatus";

export default function AppRouter() {
  useSoundInit();
  const location = useLocation();

  const showNavbar =
    location.pathname.startsWith("/user") ||
    location.pathname.startsWith("/expert");

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && !socket.connected) {
        socket.connect();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return (
    /* Aapka Original CSS Layout - NO CHANGES HERE */
    <div className="app-main-layout" style={{ width: "100%", overflowX: "hidden", position: "relative" }}>
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
        
        <Suspense fallback={<RouteLoader />}>
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
        </Suspense>
      </div>

      {showNavbar && <BottomNavbar />}
    </div>
  );
}