import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { injectAdminLoader } from "../api/admin/axiosInstance";
import { injectLoader } from "../api/axiosInstance";
import { injectExpertLoader } from "../api/expertapi/axiosInstance";
import { injectUserLoader } from "../api/userApi/axiosInstance";
import GlobalLoader from "./GlobalLoader";

const MIN_VISIBLE_MS = 300;
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
  const [isVisible, setIsVisible] = useState(false);

  const startTimeRef = useRef(0);
  const hideTimerRef = useRef(null);
  const emergencyTimerRef = useRef(null);
  const pendingCountRef = useRef(0); // Synchronous reference counter

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
    pendingCountRef.current = 0;
    setLoadingCount(0);
    setIsVisible(false);
    if (process.env.NODE_ENV !== "production") {
      console.log("[G9 LOADER] RESET -> count: 0");
    }
  }, []);

  const showLoader = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    pendingCountRef.current += 1;
    const current = pendingCountRef.current;

    if (current === 1) {
      startTimeRef.current = Date.now();
      setIsVisible(true);

      if (emergencyTimerRef.current) clearTimeout(emergencyTimerRef.current);
      emergencyTimerRef.current = setTimeout(() => {
        console.warn("[G9 LOADER] EMERGENCY TIMEOUT — Resetting leaked loading state after 10s");
        pendingCountRef.current = 0;
        setLoadingCount(0);
        setIsVisible(false);
      }, EMERGENCY_TIMEOUT_MS);
    }

    setLoadingCount(current);

    if (process.env.NODE_ENV !== "production") {
      console.log(`[G9 LOADER] START | count: ${current}`);
    }
  }, []);

  const hideLoader = useCallback(() => {
    pendingCountRef.current = Math.max(0, pendingCountRef.current - 1);
    const current = pendingCountRef.current;
    setLoadingCount(current);

    if (current === 0) {
      if (emergencyTimerRef.current) {
        clearTimeout(emergencyTimerRef.current);
        emergencyTimerRef.current = null;
      }

      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

      if (remaining > 0) {
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        hideTimerRef.current = setTimeout(() => {
          if (pendingCountRef.current === 0) {
            setIsVisible(false);
          }
          hideTimerRef.current = null;
        }, remaining);
      } else {
        setIsVisible(false);
      }
    }

    if (process.env.NODE_ENV !== "production") {
      console.log(`[G9 LOADER] STOP | count: ${current}`);
    }
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

  // Strictly mutually exclusive rule: isGlobalPageLoading can ONLY be true when isAppBooting is false and isVisible is true
  const isGlobalPageLoading = !isAppBooting && isVisible;
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