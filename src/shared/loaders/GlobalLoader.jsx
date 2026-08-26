import { createPortal } from "react-dom";
import PremiumCenterLoader from "../components/Loader/PremiumCenterLoader";
import { useLoader } from "./LoaderContext";

export default function GlobalLoader() {
  const { isAppBooting, isGlobalPageLoading } = useLoader();

  if (isAppBooting || !isGlobalPageLoading) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="g9-premium-loader-overlay">
      <PremiumCenterLoader />
    </div>,
    document.body
  );
}