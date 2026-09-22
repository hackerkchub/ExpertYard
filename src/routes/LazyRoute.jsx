import { Suspense } from "react";
import AppErrorBoundary from "../shared/components/ErrorBoundary/AppErrorBoundary";
import RouteFallback from "./RouteFallback";

export default function LazyRoute({ children, variant = "page" }) {
  return (
    <AppErrorBoundary label="LazyRoute">
      <Suspense fallback={<RouteFallback variant={variant} />}>
        {children}
      </Suspense>
    </AppErrorBoundary>
  );
}
