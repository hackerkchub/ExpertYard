import { Navigate } from "react-router-dom";

import AppIdentity, { APP_TYPES } from "../config/appIdentity";

export default function RootRedirect() {
  const redirectedPath = new URLSearchParams(window.location.search).get("redirect");

  if (redirectedPath && redirectedPath.startsWith("/")) {
    return <Navigate to={redirectedPath} replace />;
  }

  const adminToken = localStorage.getItem("admin_token");
  const expertToken = localStorage.getItem("expert_token");
  const userToken = localStorage.getItem("user_token");
  const lastPanel = localStorage.getItem("last_panel");

  const appType = AppIdentity.getType();

  /* =====================================================
      USER APK
  ====================================================== */
console.log("APP TYPE =", AppIdentity.getType());
  if (appType === APP_TYPES.USER) {
    if (userToken) {
      return <Navigate to="/user" replace />;
    }

    return <Navigate to="/user" replace />;
  }

  /* =====================================================
      EXPERT APK
  ====================================================== */

  if (appType === APP_TYPES.EXPERT) {
    if (expertToken) {
      return <Navigate to="/expert/home" replace />;
    }

    return <Navigate to="/expert/register" replace />;
  }

  /* =====================================================
      WEB
  ====================================================== */

  if (adminToken) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (expertToken) {
    return <Navigate to="/expert/home" replace />;
  }

  if (userToken) {
    return <Navigate to="/user" replace />;
  }

  switch (lastPanel) {
    case "expert":
      return <Navigate to="/expert/register" replace />;

    case "admin":
      return <Navigate to="/admin/login" replace />;

    case "user":
      return <Navigate to="/user" replace />;

    default:
      return <Navigate to="/user" replace />;
  }
}