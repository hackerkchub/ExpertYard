import { useEffect, useMemo, useState } from "react";

import logo from "../../assets/logo.webp";
import {
  AppName,
  LoadingRow,
  LogoShell,
  OfflinePanel,
  ProgressTrack,
  RetryButton,
  ReviewLine,
  Spinner,
  SplashCard,
  SplashOverlay,
  TrustMessage,
} from "./SplashScreen.styles";

const SPLASH_DURATION_MS = 3000;
const FADE_OUT_MS = 220;

const isMobileViewport = () => {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(max-width: 767px)").matches;
};

export default function SplashScreen({ onDone }) {
  const [isMobile, setIsMobile] = useState(isMobileViewport);
  const [isOnline, setIsOnline] = useState(() => {
    if (typeof navigator === "undefined") return true;
    return navigator.onLine;
  });
  const [isExiting, setIsExiting] = useState(false);

  const shouldBlockForOffline = useMemo(
    () => isMobile && !isOnline,
    [isMobile, isOnline]
  );

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateMobile = () => setIsMobile(mediaQuery.matches);
    const updateOnline = () => setIsOnline(true);
    const updateOffline = () => setIsOnline(false);

    updateMobile();
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOffline);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", updateMobile);
    } else {
      mediaQuery.addListener(updateMobile);
    }

    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOffline);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", updateMobile);
      } else {
        mediaQuery.removeListener(updateMobile);
      }
    };
  }, []);

  useEffect(() => {
    if (shouldBlockForOffline) return undefined;

    let fadeTimer;
    const exitTimer = window.setTimeout(() => {
      setIsExiting(true);
      fadeTimer = window.setTimeout(onDone, FADE_OUT_MS);
    }, SPLASH_DURATION_MS);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(fadeTimer);
    };
  }, [onDone, shouldBlockForOffline]);

  const handleRetry = () => {
    if (typeof navigator === "undefined" || navigator.onLine) {
      setIsOnline(true);
    }
  };

  return (
    <SplashOverlay $exiting={isExiting} role="status" aria-live="polite">
      <SplashCard>
        <LogoShell>
          <img src={logo} alt="G9Expert" />
        </LogoShell>
        <AppName>G9Expert</AppName>
        <TrustMessage>
          Trusted Experts. Real Guidance. Secure Consultation.
        </TrustMessage>
        <ReviewLine>
          Verified professionals for chat, call, video call & services.
        </ReviewLine>

        {shouldBlockForOffline ? (
          <OfflinePanel>
            <h2>No internet connection</h2>
            <p>Please check your network and try again.</p>
            <RetryButton type="button" onClick={handleRetry}>
              Retry
            </RetryButton>
          </OfflinePanel>
        ) : (
          <>
            <LoadingRow>
              <Spinner aria-hidden="true" />
              <span>Connecting you with trusted experts...</span>
            </LoadingRow>
            <ProgressTrack aria-hidden="true" />
          </>
        )}
      </SplashCard>
    </SplashOverlay>
  );
}
