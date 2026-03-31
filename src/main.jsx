import { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { WalletProvider } from "./shared/context/WalletContext";
import { CategoryProvider } from "./shared/context/CategoryContext";
import { AuthProvider } from "./shared/context/UserAuthContext";

// ✅ 1. API Import karein
import { getCategoriesApi } from "./shared/api/expertapi/category.api"; 

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

// ✅ 2. Render se pehle hi call trigger kar dein (Background Fetch)
soundManager.preload();
getCategoriesApi().catch(() => {}); 

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

// ... (Service Worker logic same rahega)

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