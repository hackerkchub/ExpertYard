import PremiumCenterLoader from "../components/Loader/PremiumCenterLoader";
import { useLoader } from "./LoaderContext";

export default function GlobalLoader() {
  const { isAppBooting, isGlobalPageLoading } = useLoader();

  if (isAppBooting || !isGlobalPageLoading) return null;

  return <PremiumCenterLoader />;
}