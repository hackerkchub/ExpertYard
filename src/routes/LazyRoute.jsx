import { Suspense } from "react";

import RouteFallback from "./RouteFallback";

export default function LazyRoute({ children, variant = "page" }) {
  return (
    <Suspense fallback={<RouteFallback variant={variant} />}>
      {children}
    </Suspense>
  );
}
