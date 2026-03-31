import {useEffect} from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { WalletProvider } from "./shared/context/WalletContext";
// import { ExpertProvider } from "./shared/context/ExpertContext";
import { CategoryProvider } from "./shared/context/CategoryContext";
import { AuthProvider } from "./shared/context/UserAuthContext";
// import { ExpertNotificationsProvider } from "./apps/expert/context/ExpertNotificationsContext"; // ✅ ADD

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

  soundManager.preload();

// /* ================================
//    🔔 SERVICE WORKER REGISTRATION
// ================================ */
// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", () => {
//     navigator.serviceWorker
//       .register("/sw.js", { scope: "/" }) // /public/sw.js [web:234][web:106]
//       .then((registration) => {
//         console.log("✅ Web Push Service Worker registered:", registration.scope);
//       })
//       .catch((err) => {
//         console.error("❌ Service Worker registration failed:", err);
//       });
//   });
// }


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

        console.log("✅ Firebase SW registered:", registration.scope);

      } else {

        console.log("🔥 Service Worker already registered:", registration.scope);

      }

      // IMPORTANT
      await navigator.serviceWorker.ready;

      console.log("🚀 Service Worker ready for push");

    } catch (err) {

      console.error("❌ Firebase SW registration failed:", err);

    }

  });

}

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <GlobalStyles />

    <LoaderProvider>

      <LoaderInjector />
      <GlobalLoader />

      <CategoryProvider>
        <BrowserRouter>
          <AuthProvider>
            <WalletProvider>

              <AppRouter />

            </WalletProvider>
          </AuthProvider>
        </BrowserRouter>
      </CategoryProvider>

    </LoaderProvider>

  </ThemeProvider>
);