import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { HelmetProvider } from "react-helmet-async";

import "./i18n";

import AppRouter from "./routes";
import { APP_CONFIG } from "./config/appConfig";

import { CategoryProvider } from "./shared/context/CategoryContext";
import { AuthProvider } from "./shared/context/UserAuthContext";
import { WalletProvider } from "./shared/context/WalletContext";

import { soundManager } from "./shared/services/sound/soundManager";
import { LegalProvider } from "./shared/context/LegalContext";

import GlobalStyles from "./shared/styles/GlobalStyles";
import { theme } from "./shared/styles/theme";

import { updateRecovery, getCurrentBuildId } from "./utils/updateRecovery";
import { versionChecker } from "./utils/versionChecker";
import { updateCoordinator } from "./utils/updateCoordinator";

if (typeof window !== "undefined") {
  window.__G9_BUILD_ID__ = typeof __G9_BUILD_ID__ !== "undefined" ? __G9_BUILD_ID__ : "dev";
}

const kbPkg = "@capacitor/keyboard";
const appPkg = "@capacitor/app";
const capPkg = "@capacitor/core";

let Capacitor = null;
try {
  const capModule = await import(/* @vite-ignore */ capPkg).catch(() => null);
  Capacitor = capModule?.Capacitor || null;
} catch (e) {}

const isNativeAppSync = typeof window !== "undefined" && (
  (window.Capacitor && typeof window.Capacitor.isNativePlatform === "function" && window.Capacitor.isNativePlatform()) ||
  Boolean(window.G9_APP_TYPE === "user" || window.G9_APP_TYPE === "expert" || window.NativeBridgeManager_Native || window.NativeBridgeManager)
);

const isNativeApp = isNativeAppSync || (Capacitor && typeof Capacitor.isNativePlatform === "function" && Capacitor.isNativePlatform());

soundManager.preload();
startReact();

/* ================= NATIVE APP ONLY ================= */

if (isNativeApp) {
  // Purge any legacy Service Worker registrations inside Capacitor WebView
  if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        console.log("🧹 [Native WebView] Unregistering legacy Service Worker:", registration.scope);
        registration.unregister().catch(() => {});
      }
    }).catch((err) => {
      console.warn("Native WebView SW cleanup warning:", err);
    });
  }

  Promise.all([
    import(/* @vite-ignore */ kbPkg).catch(() => null),
    import(/* @vite-ignore */ appPkg).catch(() => null)
  ]).then(([kbModule, appModule]) => {
    if (kbModule?.Keyboard) {
      kbModule.Keyboard.setResizeMode({ mode: "none" }).catch(() => {});
    }
    if (appModule?.App) {
      appModule.App.addListener("backButton", () => {
        const path = window.location.pathname;
        const homeRoutes = ["/", "/home", "/user/home", "/expert/dashboard"];
        if (homeRoutes.includes(path)) {
          appModule.App.exitApp();
        } else {
          window.history.back();
        }
      });
    }
  }).catch(() => {});
}

/* ================= WEB / PWA ONLY ================= */

if (!isNativeApp && "serviceWorker" in navigator) {
  // Initialize runtime version checking for Web/PWA
  versionChecker.startVersionChecker();

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

      // Controlled update coordination after new SW becomes active
      let refreshing = false;

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (refreshing) return;
        refreshing = true;

        updateCoordinator.notifyServiceWorkerUpdated();
      });

    } catch (err) {
      console.error("Service worker registration failed:", err);
    }
  });
}

import { LoaderProvider } from "./shared/loaders/LoaderContext";

/* ================= REACT APP ================= */

function startReact() {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <LoaderProvider>
          <CategoryProvider>
            <BrowserRouter>
              <AuthProvider>
                <WalletProvider>
                  <LegalProvider>
                    <AppRouter />
                  </LegalProvider>
                </WalletProvider>
              </AuthProvider>
            </BrowserRouter>
          </CategoryProvider>
        </LoaderProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}