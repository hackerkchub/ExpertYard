import { useEffect, lazy, useMemo } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import { socket } from "../shared/api/socket";
import BottomNavbar from "../shared/components/BottomNavbar/BottomNavbar";
import NetworkStatus from "../shared/components/NetworkStatus/NetworkStatus";
import { ExpertProvider } from "../shared/context/ExpertContext";
import { useSoundInit } from "../shared/services/sound/useSoundInit";
import LazyRoute from "./LazyRoute";
import RootRedirect from "./RootRedirect";
import { shouldShowBottomNavbar } from "./routeShells";

const UserAppRoutes = lazy(() => import("../apps/user/routes"));
const ExpertAppRoutes = lazy(() => import("../apps/expert/routes"));
const AdminAppRoutes = lazy(() => import("../apps/admin/routes"));

const APP_SHELL_STYLE = {
  width: "100%",
  overflowX: "hidden",
  position: "relative",
};

const CONTENT_WRAPPER_STYLE = {
  width: "100%",
  overflowX: "hidden",
};

export default function AppRouter() {
  useSoundInit();
  const location = useLocation();

  const showNavbar = useMemo(
    () => shouldShowBottomNavbar(location.pathname),
    [location.pathname]
  );

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
    <div className="app-main-layout" style={APP_SHELL_STYLE}>
      <NetworkStatus />

      <div className="main-content-wrapper" style={CONTENT_WRAPPER_STYLE}>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route
            path="/user/*"
            element={
              <LazyRoute variant="app">
                <UserAppRoutes />
              </LazyRoute>
            }
          />
          <Route
            path="/expert/*"
            element={
              <ExpertProvider>
                <LazyRoute variant="app">
                  <ExpertAppRoutes />
                </LazyRoute>
              </ExpertProvider>
            }
          />
          <Route
            path="/admin/*"
            element={
              <LazyRoute variant="app">
                <AdminAppRoutes />
              </LazyRoute>
            }
          />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </div>

      {showNavbar ? <BottomNavbar /> : null}
    </div>
  );
}
