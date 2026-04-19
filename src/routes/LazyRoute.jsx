import { Suspense } from "react";

import RouteFallback from "./RouteFallback";

export default function LazyRoute({ children }) {
  return <Suspense fallback={<RouteFallback />}>{children}</Suspense>;
}
