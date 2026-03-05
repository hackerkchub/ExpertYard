import React from "react";
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

/* ================================
   🔔 FIREBASE SERVICE WORKER
================================ */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("✅ Firebase SW registered:", registration.scope);
      })
      .catch((err) => {
        console.error("❌ Firebase SW registration failed:", err);
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
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
);