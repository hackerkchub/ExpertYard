import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { WalletProvider } from "./shared/context/WalletContext";
import { ExpertProvider } from "./shared/context/ExpertContext";
import { CategoryProvider } from "./shared/context/CategoryContext";
import { AuthProvider } from "./shared/context/UserAuthContext";

import { theme } from "./shared/styles/theme";
import GlobalStyles from "./shared/styles/GlobalStyles";
import AppRouter from "./routes";

/* ================================
   🔔 SERVICE WORKER REGISTRATION
================================ */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js", { scope: "/" }) // /public/sw.js [web:234][web:106]
      .then((registration) => {
        console.log("✅ Web Push Service Worker registered:", registration.scope);
      })
      .catch((err) => {
        console.error("❌ Service Worker registration failed:", err);
      });
  });
}


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyles />

      <CategoryProvider>
        <ExpertProvider>
          <BrowserRouter>
            <AuthProvider>
              <WalletProvider>
                <AppRouter />
              </WalletProvider>
            </AuthProvider>
          </BrowserRouter>
        </ExpertProvider>
      </CategoryProvider>

    </ThemeProvider>
  </React.StrictMode>
);
