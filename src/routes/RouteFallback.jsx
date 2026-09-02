import PremiumCenterLoader from "../shared/components/Loader/PremiumCenterLoader";
import { useLoader } from "../shared/loaders/LoaderContext";

export default function RouteFallback() {
  const { isAppBooting, isGlobalPageLoading } = useLoader();

  if (isAppBooting || isGlobalPageLoading) return null;

  return <PremiumCenterLoader />;
}
