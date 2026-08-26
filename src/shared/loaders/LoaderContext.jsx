import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { injectAdminLoader } from "../api/admin/axiosInstance";
import { injectLoader } from "../api/axiosInstance";
import { injectExpertLoader } from "../api/expertapi/axiosInstance";
import { injectUserLoader } from "../api/userApi/axiosInstance";
import GlobalLoader from "./GlobalLoader";

const MIN_VISIBLE_MS = 400;
const EMERGENCY_TIMEOUT_MS = 10000; // 10s failsafe to recover leaked loader state

const LoaderContext = createContext({
  isAppBooting: true,
  isGlobalPageLoading: false,
  loading: false,
  loadingCount: 0,
  finishAppBoot: () => {},
  showLoader: () => {},
  hideLoader: () => {},
  startLoading: () => {},
  stopLoading: () => {},
  resetLoader: () => {},
});

export const LoaderProvider = ({ children }) => {
  const [isAppBooting, setIsAppBooting] = useState(true);
  const [loadingCount, setLoadingCount] = useState(0);
  const startTimeRef = useRef(0);
  const hideTimerRef = useRef(null);
  const emergencyTimerRef = useRef(null);

  const finishAppBoot = useCallback(() => {
    setIsAppBooting(false);
  }, []);

  const resetLoader = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (emergencyTimerRef.current) {
      clearTimeout(emergencyTimerRef.current);
      emergencyTimerRef.current = null;
    }
    if (process.env.NODE_ENV !== "production") {
      console.log("[G9 LOADER] RESET -> count: 0");
    }
    setLoadingCount(0);
  }, []);

  const showLoader = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setLoadingCount((prev) => {
      const next = prev + 1;
      if (prev === 0) {
        startTimeRef.current = Date.now();
        // Set emergency safety timer
        if (emergencyTimerRef.current) clearTimeout(emergencyTimerRef.current);
        emergencyTimerRef.current = setTimeout(() => {
          console.warn("[G9 LOADER] EMERGENCY TIMEOUT — Resetting leaked loading state after 10s");
          resetLoader();
        }, EMERGENCY_TIMEOUT_MS);
      }
      if (process.env.NODE_ENV !== "production") {
        console.log(`[G9 LOADER] START | count: ${next}`);
      }
      return next;
    });
  }, [resetLoader]);

  const hideLoader = useCallback(() => {
    setLoadingCount((prev) => {
      const next = Math.max(0, prev - 1);
      if (next === 0) {
        if (emergencyTimerRef.current) {
          clearTimeout(emergencyTimerRef.current);
          emergencyTimerRef.current = null;
        }
        const elapsed = Date.now() - startTimeRef.current;
        const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

        if (remaining > 0) {
          if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
          hideTimerRef.current = setTimeout(() => {
            setLoadingCount(0);
            hideTimerRef.current = null;
          }, remaining);
          return prev; // Hold count until 400ms threshold completes
        }
      }
      if (process.env.NODE_ENV !== "production") {
        console.log(`[G9 LOADER] STOP | count: ${next}`);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const loaderApi = {
      showLoader,
      hideLoader,
      resetLoader,
    };

    injectUserLoader(loaderApi);
    injectExpertLoader(loaderApi);
    injectAdminLoader(loaderApi);
    injectLoader(loaderApi);
  }, [showLoader, hideLoader, resetLoader]);

  // Strictly mutually exclusive rule: isGlobalPageLoading can ONLY be true when isAppBooting is false!
  const isGlobalPageLoading = !isAppBooting && loadingCount > 0;
  const loading = isGlobalPageLoading;

  const value = useMemo(
    () => ({
      isAppBooting,
      isGlobalPageLoading,
      loading,
      loadingCount,
      finishAppBoot,
      showLoader,
      hideLoader,
      startLoading: showLoader,
      stopLoading: hideLoader,
      resetLoader,
    }),
    [isAppBooting, isGlobalPageLoading, loading, loadingCount, finishAppBoot, showLoader, hideLoader, resetLoader]
  );

  return (
    <LoaderContext.Provider value={value}>
      {children}
      {!isAppBooting && isGlobalPageLoading ? <GlobalLoader /> : null}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
export default LoaderContext;