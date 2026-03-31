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

// ✅ FIXED IMPORTS: Paths ko original rakha hai taki SyntaxError na aaye
import { injectUserLoader } from "./shared/api/userApi/axiosInstance";
import { injectExpertLoader } from "./shared/api/expertapi/axiosInstance";
import { injectAdminLoader } from "./shared/api/admin/axiosInstance";
import { injectLoader } from "./shared/api/axiosInstance";

// Sound background loading
setTimeout(() => soundManager.preload(), 3000);

function LoaderInjector() {
  const loader = useLoader();
  
  useEffect(() => {
    injectLoader(loader);
    injectUserLoader(loader);
    injectExpertLoader(loader);
    injectAdminLoader(loader);
    
    // React ready hone par HTML loader hata dein
    const initialLoader = document.getElementById('initial-loader');
    if (initialLoader) {
      initialLoader.style.opacity = '0';
      setTimeout(() => { initialLoader.style.display = 'none'; }, 500);
    }
  }, [loader]);

  return null;
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
              {/* Suspense handles white screen for lazy components */}
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