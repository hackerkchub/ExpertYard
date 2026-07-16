import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { HelmetProvider } from "react-helmet-async";

import "./i18n";

import AppRouter from "./routes";
import { APP_CONFIG } from "./config/appConfig";

import { CategoryProvider } from "./shared/context/CategoryContext";
import { AuthProvider } from "./shared/context/UserAuthContext";
import { WalletProvider } from "./shared/context/WalletContext";

import { soundManager } from "./shared/services/sound/soundManager";

import GlobalStyles from "./shared/styles/GlobalStyles";
import { theme } from "./shared/styles/theme";

const isNativeApp = Capacitor.isNativePlatform();

soundManager.preload();
startReact();

/* ================= NATIVE APP ONLY ================= */

if (isNativeApp) {
  App.addListener("backButton", () => {
    const path = window.location.pathname;

    const homeRoutes = [
      "/",
      "/user",
      "/user/dashboard",
      "/user/home",
      "/expert",
      "/expert/home",
      "/expert/dashboard",
      "/admin",
      "/admin/dashboard",
    ];

    if (homeRoutes.includes(path)) {
      App.exitApp();
    } else {
      window.history.back();
    }
  });
}

/* ================= WEB / PWA ONLY ================= */

if (!isNativeApp && "serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      let registration = await navigator.serviceWorker.getRegistration();

      if (!registration) {
        registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
          {
            scope: "/",
          }
        );

        console.log(
          "✅ Firebase service worker registered:",
          registration.scope
        );
      }

      await navigator.serviceWorker.ready;

      // Force browser to check for new SW
      await registration.update();

      // Listen for new Service Worker
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;

        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            console.log("🆕 New Service Worker found");

            newWorker.postMessage({
              type: "SKIP_WAITING",
            });
          }
        });
      });

      // Reload only once after new SW becomes active
      let refreshing = false;

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing) return;

        refreshing = true;

        console.log("♻️ Service Worker updated. Reloading...");

        window.location.reload();
      });

    } catch (err) {
      console.error("Service worker registration failed:", err);
    }
  });
}

/* ================= REACT APP ================= */

function startReact() {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <CategoryProvider>
          <BrowserRouter>
            <AuthProvider>
              <WalletProvider>
                <AppRouter />
              </WalletProvider>
            </AuthProvider>
          </BrowserRouter>
        </CategoryProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}