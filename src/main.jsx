import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import AppRouter from "./routes";
import { CategoryProvider } from "./shared/context/CategoryContext";
import { AuthProvider } from "./shared/context/UserAuthContext";
import { WalletProvider } from "./shared/context/WalletContext";
import { soundManager } from "./shared/services/sound/soundManager";
import GlobalStyles from "./shared/styles/GlobalStyles";
import { theme } from "./shared/styles/theme";

soundManager.preload();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      let registration = await navigator.serviceWorker.getRegistration();

      if (!registration) {
        registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
          scope: "/",
        });
        console.log("Firebase service worker registered:", registration.scope);
      }

      await navigator.serviceWorker.ready;
    } catch (err) {
      console.error("Firebase service worker registration failed:", err);
    }
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
