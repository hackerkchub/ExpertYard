// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import { ThemeProvider } from "styled-components";

// import AppRouter from "./routes";
// import "./i18n";
// import { CategoryProvider } from "./shared/context/CategoryContext";
// import { AuthProvider } from "./shared/context/UserAuthContext";
// import { WalletProvider } from "./shared/context/WalletContext";
// import { soundManager } from "./shared/services/sound/soundManager";
// import GlobalStyles from "./shared/styles/GlobalStyles";
// import { theme } from "./shared/styles/theme";
// import { HelmetProvider } from "react-helmet-async";

// soundManager.preload();

// if ("serviceWorker" in navigator) {
//   window.addEventListener("load", async () => {
//     try {
//       let registration = await navigator.serviceWorker.getRegistration();

//       if (!registration) {
//         registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
//           scope: "/",
//         });
//         console.log("Firebase service worker registered:", registration.scope);
//       }

//       await navigator.serviceWorker.ready;
//     } catch (err) {
//       console.error("Firebase service worker registration failed:", err);
//     }
//   });
// }

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <HelmetProvider>
//     <ThemeProvider theme={theme}>
//       <GlobalStyles />
//       <CategoryProvider>
//         <BrowserRouter>
//           <AuthProvider>
//             <WalletProvider>
//             <AppRouter />
//           </WalletProvider>
//         </AuthProvider>
//       </BrowserRouter>
//     </CategoryProvider>
//   </ThemeProvider>
// </HelmetProvider>
// );



import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";

import AppRouter from "./routes";
import "./i18n";
import { CategoryProvider } from "./shared/context/CategoryContext";
import { AuthProvider } from "./shared/context/UserAuthContext";
import { WalletProvider } from "./shared/context/WalletContext";
import { soundManager } from "./shared/services/sound/soundManager";
import GlobalStyles from "./shared/styles/GlobalStyles";
import { theme } from "./shared/styles/theme";
import { HelmetProvider } from "react-helmet-async";

soundManager.preload();

const isNativeApp = Capacitor.isNativePlatform();

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
    } catch (err) {
      console.error("❌ Service worker registration failed:", err);
    }
  });
}

/* ================= APP RENDER ================= */
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