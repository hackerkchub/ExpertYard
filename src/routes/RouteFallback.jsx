import { createPortal } from "react-dom";
import PremiumCenterLoader from "../shared/components/Loader/PremiumCenterLoader";
import { useLoader } from "../shared/loaders/LoaderContext";

export default function RouteFallback() {
  const { isAppBooting, isGlobalPageLoading } = useLoader();

  // Suppress PremiumCenterLoader during initial app boot or if GlobalLoader overlay is already active
  if (isAppBooting || isGlobalPageLoading) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="g9-premium-loader-overlay">
      <PremiumCenterLoader />
    </div>,
    document.body
  );
}
