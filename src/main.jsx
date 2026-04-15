import { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";

// Context Providers
import { WalletProvider } from "./shared/context/WalletContext";
import { CategoryProvider } from "./shared/context/CategoryContext";
import { AuthProvider } from "./shared/context/UserAuthContext";

// APIs & Services
import { getCategoriesApi } from "./shared/api/expertapi/category.api"; 
import { theme } from "./shared/styles/theme";
import GlobalStyles from "./shared/styles/GlobalStyles";
import AppRouter from "./routes";
import { soundManager } from "./shared/services/sound/soundManager";
import { LoaderProvider, useLoader } from "./shared/loaders/LoaderContext";
import GlobalLoader from "./shared/loaders/GlobalLoader";

// Axios Injectors
import { injectUserLoader } from "./shared/api/userApi/axiosInstance";
import { injectExpertLoader } from "./shared/api/expertapi/axiosInstance";
import { injectAdminLoader } from "./shared/api/admin/axiosInstance";
import { injectLoader } from "./shared/api/axiosInstance";

/* ========================================================
   🚀 PERFORMANCE OPTIMIZATION (Background Fetch)
   ======================================================== */
// Render hone se pehle hi resources load karna shuru kar dein
soundManager.preload();
getCategoriesApi().catch(() => {
  console.log("Pre-fetch failed, will retry in component");
}); 

/* ========================================================
   🔗 LOADER INJECTION LOGIC
   ======================================================== */
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

/* ========================================================
   🔔 PWA & FIREBASE BACKGROUND NOTIFICATIONS
   ======================================================== */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      // Background notifications ke liye firebase service worker zaroori hai
      let registration = await navigator.serviceWorker.getRegistration("/firebase-messaging-sw.js");

      if (!registration) {
        registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
          { scope: "/" }
        );
        console.log("✅ Firebase SW Registered for Background Notifications");
      }

      // Waiting for SW to be ready
      await navigator.serviceWorker.ready;
      
    } catch (err) {
      console.error("❌ Service Worker Registration Error:", err);
    }
  });
}

/* ========================================================
   ⚛️ REACT ROOT RENDER
   ======================================================== */
ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <GlobalStyles />
    
    <LoaderProvider>
      {/* Axios Loader Injector */}
      <LoaderInjector />
      
      {/* Global Spinner Element */}
      <GlobalLoader />

      <CategoryProvider>
        <BrowserRouter>
          <AuthProvider>
            <WalletProvider>
              
              {/* Main App Routes */}
              <AppRouter />

            </WalletProvider>
          </AuthProvider>
        </BrowserRouter>
      </CategoryProvider>
      
    </LoaderProvider>
  </ThemeProvider>
);