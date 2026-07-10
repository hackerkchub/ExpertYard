import { Navigate, useLocation } from "react-router-dom";
import AppIdentity, { APP_TYPES } from "../config/appIdentity";

export default function AppGuard({ children }) {
  const { pathname } = useLocation();

  const path = pathname.toLowerCase();

  const appType = AppIdentity.getType();

  /* =====================================
            WEB
  ===================================== */

  if (appType === APP_TYPES.WEB) {
    return children;
  }

  /* =====================================
            USER APK
  ===================================== */

  if (appType === APP_TYPES.USER) {

    if (path.startsWith("/expert")) {
      return <Navigate to="/user" replace />;
    }

    if (path.startsWith("/admin")) {
      return <Navigate to="/user" replace />;
    }

    return children;
  }

  /* =====================================
            EXPERT APK
  ===================================== */

  if (appType === APP_TYPES.EXPERT) {

    if (path.startsWith("/user")) {
      return <Navigate to="/expert" replace />;
    }

    if (path.startsWith("/admin")) {
      return <Navigate to="/expert" replace />;
    }

    return children;
  }

  return children;
}