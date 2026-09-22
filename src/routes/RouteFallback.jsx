import PremiumCenterLoader from "../shared/components/Loader/PremiumCenterLoader";

export default function RouteFallback() {
  // Always render a visible, elegant loader so Suspense NEVER returns null/blank screen
  return <PremiumCenterLoader />;
}
