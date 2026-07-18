import { useCallback, useEffect, lazy, useMemo, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { PushNotifications } from "@capacitor/push-notifications";
import { Capacitor } from "@capacitor/core";

import { socket } from "../shared/api/socket";
import BottomNavbar from "../shared/components/BottomNavbar/BottomNavbar";
import NetworkStatus from "../shared/components/NetworkStatus/NetworkStatus";
import SplashScreen from "../shared/components/SplashScreen";
import { ExpertProvider } from "../shared/context/ExpertContext";
import { useSoundInit } from "../shared/services/sound/useSoundInit";
import MainLayout from "../apps/user/layouts/MainLayout";
import UserRouteBoundary from "../apps/user/layouts/UserRouteBoundary";
import LazyRoute from "./LazyRoute";
import RootRedirect from "./RootRedirect";
import { shouldShowBottomNavbar } from "./routeShells";

import AppGuard from "../core/AppGuard";
import { APP_CONFIG } from "../config/appConfig";

import useNativeIncomingCall from "../shared/hooks/useNativeIncomingCall";

const UserAppRoutes =
  APP_CONFIG.APP_TYPE !== "expert"
    ? lazy(() => import("../apps/user/routes"))
    : null;

const ExpertAppRoutes =
  APP_CONFIG.APP_TYPE !== "user"
    ? lazy(() => import("../apps/expert/routes"))
    : null;

const AdminAppRoutes =
  APP_CONFIG.APP_TYPE === "web"
    ? lazy(() => import("../apps/admin/routes"))
    : null;

const PublicCategoriesPage = lazy(() => import("../apps/user/pages/Category/Categories"));
const PublicCategoryPage = lazy(() => import("../apps/user/pages/Subcategory/SubcategoryPage"));
const PublicExpertListPage = lazy(() => import("../apps/user/pages/ExpertList/ExpertList"));

const APP_SHELL_STYLE = {
  width: "100%",
  overflowX: "hidden",
  position: "relative",
};

const CONTENT_WRAPPER_STYLE = {
  width: "100%",
  overflowX: "hidden",
};

const isCallScreenPath = (pathname = "") => {
  const normalizedPath = pathname.toLowerCase();
  return (
    normalizedPath.startsWith("/user/voice-call") ||
    normalizedPath.startsWith("/user/video-call") ||
    normalizedPath.startsWith("/expert/voice-call") ||
    normalizedPath.startsWith("/expert/video-call")
  );
};

export default function AppRouter() {
  useNativeIncomingCall();
  useSoundInit();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    PushNotifications.setPresentationOptions({
      presentationOptions: ["badge", "sound", "alert"],
    }).catch(err => console.error("Error setting presentation options:", err));

    const clickListener = PushNotifications.addListener(
      "pushNotificationActionPerformed",
      async (action) => {
        console.log("Push notification action performed:", action);
        const data = action.notification?.data;
        if (!data) return;

        try {
          await PushNotifications.removeAllDeliveredNotifications();
        } catch (err) {
          console.error("Failed to clear notifications:", err);
        }

        let url = data.target_url || data.url || data.click_action;
        if (url) {
          try {
            if (url.startsWith("http")) {
              const parsed = new URL(url);
              url = parsed.pathname + parsed.search;
            }
          } catch (e) {
            console.error("Error parsing target url:", e);
          }
          if (url) {
            navigate(url);
            return;
          }
        }

        const type = data.type;
        const callId = data.callId || data.call_id;
        const chatId = data.chatId || data.chat_id || data.room_id || data.roomId;
        const role = APP_CONFIG.APP_TYPE === "expert" ? "expert" : "user";

        if (type === "incoming_call" || type === "voice_call") {
          if (callId) {
            navigate(`/${role}/voice-call/${callId}`, { replace: true });
          }
        } else if (type === "video_call") {
          if (callId) {
            navigate(`/${role}/video-call/${callId}`, { replace: true });
          }
        } else if (type === "chat_message" || type === "chat_request") {
          if (chatId) {
            navigate(`/${role}/chat/${chatId}`);
          }
        } else {
          const relatedId = data.related_id;
          const relatedType = data.related_type;

          if (relatedType === "booking" && relatedId) {
            navigate(`/${role}/bookings/${relatedId}`);
          } else if (relatedType === "service" && relatedId) {
            navigate(`/${role}/services/${relatedId}`);
          } else {
            navigate(`/${role}/notifications`);
          }
        }
      }
    );

    return () => {
      clickListener.remove();
    };
  }, [navigate]);
  const [showSplash, setShowSplash] = useState(
    () =>
      typeof window !== "undefined" && !isCallScreenPath(window.location.pathname)
  );

  const showNavbar = useMemo(
    () => shouldShowBottomNavbar(location.pathname),
    [location.pathname]
  );

  const hideSplash = useCallback(() => {
    setShowSplash(false);
  }, []);

  useEffect(() => {
    if (isCallScreenPath(location.pathname)) {
      setShowSplash(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && !socket.connected) {
        socket.connect();
      }
      reportVisibility();
    };

    const reportVisibility = () => {
      if (socket.connected) {
        socket.emit("page_visibility", {
          isVisible: document.visibilityState === "visible",
        });
      }
    };

    const handleConnect = () => {
      reportVisibility();
    };

    socket.on("connect", handleConnect);
    document.addEventListener("visibilitychange", handleVisibility);

    // Emit initial state if already connected
    reportVisibility();

    return () => {
      socket.off("connect", handleConnect);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div className="app-main-layout" style={APP_SHELL_STYLE}>
      {showSplash && !isCallScreenPath(location.pathname) ? (
        <SplashScreen onDone={hideSplash} />
      ) : null}

      <NetworkStatus />

      <div
        className={`main-content-wrapper${showNavbar ? " has-mobile-bottom-nav" : ""}`}
        style={CONTENT_WRAPPER_STYLE}
      >
        <AppGuard>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route element={<UserRouteBoundary />}>
              <Route element={<MainLayout />}>
                <Route
                  path="/categories"
                  element={
                    <LazyRoute>
                      <PublicCategoriesPage />
                    </LazyRoute>
                  }
                />
                <Route
                  path="/category/:slug"
                  element={
                    <LazyRoute>
                      <PublicCategoryPage />
                    </LazyRoute>
                  }
                />
                <Route
                  path="/category/:categoryId/subcategories"
                  element={
                    <LazyRoute>
                      <PublicCategoryPage />
                    </LazyRoute>
                  }
                />
                <Route
                  path="/category/:slug/subcategory/:subcategoryId"
                  element={
                    <LazyRoute>
                      <PublicCategoryPage />
                    </LazyRoute>
                  }
                />
                <Route
                  path="/experts/:categorySlug/:citySlug"
                  element={
                    <LazyRoute>
                      <PublicExpertListPage />
                    </LazyRoute>
                  }
                />
                <Route
                  path="/experts/:categorySlug/:citySlug/:areaSlug"
                  element={
                    <LazyRoute>
                      <PublicExpertListPage />
                    </LazyRoute>
                  }
                />
                <Route
                  path="/experts/:categorySlug/pincode/:pincode"
                  element={
                    <LazyRoute>
                      <PublicExpertListPage />
                    </LazyRoute>
                  }
                />
              </Route>
            </Route>
            
            {UserAppRoutes && (
              <Route
                path="/user/*"
                element={
                  <LazyRoute variant="app">
                    <UserAppRoutes />
                  </LazyRoute>
                }
              />
            )}
            
            {ExpertAppRoutes && (
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
            )}
            
            {AdminAppRoutes && (
              <Route
                path="/admin/*"
                element={
                  <LazyRoute variant="app">
                    <AdminAppRoutes />
                  </LazyRoute>
                }
              />
            )}
            
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </AppGuard>
      </div>

      {showNavbar && !location.pathname.toLowerCase().startsWith("/expert") ? <BottomNavbar /> : null}
    </div>
  );
}