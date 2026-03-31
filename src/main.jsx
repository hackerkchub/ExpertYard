import { useEffect, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { WalletProvider } from "./shared/context/WalletContext";
import { CategoryProvider } from "./shared/context/CategoryContext";
import { AuthProvider } from "./shared/context/UserAuthContext";

import { theme } from "./shared/styles/theme";
import GlobalStyles from "./shared/styles/GlobalStyles";
import AppRouter from "./routes";
import { soundManager } from "./shared/services/sound/soundManager";
import { LoaderProvider, useLoader } from "./shared/loaders/LoaderContext";
import GlobalLoader from "./shared/loaders/GlobalLoader";
import { injectUserLoader } from "./shared/api/userApi/axiosInstance";
import { injectExpertLoader } from "./shared/api/expertapi/axiosInstance";
import { injectAdminLoader } from "./shared/api/admin/axiosInstance";
import { injectLoader } from "./shared/api/axiosInstance";

// Sounds ko background mein load hone dein
soundManager.preload();

function LoaderInjector() {
  const loader = useLoader();
  useEffect(() => {
    injectLoader(loader);
    injectUserLoader(loader);
    injectExpertLoader(loader);
    injectAdminLoader(loader);
  }, [loader]);
  return null;
}

/* ================================
    🔔 FIREBASE SERVICE WORKER
================================ */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      let registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
          { scope: "/" }
        );
      }
      await navigator.serviceWorker.ready;
    } catch (err) {
      console.error("❌ Firebase SW error:", err);
    }
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    <LoaderProvider>
      <LoaderInjector />
      {/* GlobalLoader yahan white screen ko rokne mein madad karega */}
      <GlobalLoader />
      <CategoryProvider>
        <BrowserRouter>
          <AuthProvider>
            <WalletProvider>
              {/* Suspense is key to avoid white screen during lazy loading */}
              <Suspense fallback={<GlobalLoader />}>
                <AppRouter />
              </Suspense>
            </WalletProvider>
          </AuthProvider>
        </BrowserRouter>
      </CategoryProvider>
    </LoaderProvider>
  </ThemeProvider>
);