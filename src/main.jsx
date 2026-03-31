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

// Sound preload ko background mein rehne dein
setTimeout(() => soundManager.preload(), 3000);

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
              {/* Suspense fallback ko GlobalLoader par set kiya taaki white screen na dikhe */}
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