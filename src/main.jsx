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
import { injectUserLoader, injectExpertLoader, injectAdminLoader, injectLoader } from "./shared/api/axiosInstance"; // Assuming shared injection

// Background sound loading
setTimeout(() => soundManager.preload(), 4000);

function LoaderInjector() {
  const loader = useLoader();
  useEffect(() => {
    injectLoader(loader);
    injectUserLoader(loader);
    injectExpertLoader(loader);
    injectAdminLoader(loader);
    
    // React load hote hi initial white screen loader ko hata dein
    const initialLoader = document.getElementById('initial-loader');
    if (initialLoader) initialLoader.style.display = 'none';
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