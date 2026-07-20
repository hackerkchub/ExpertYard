import { Navigate } from "react-router-dom";

import AppIdentity, { APP_TYPES } from "../config/appIdentity";

export default function RootRedirect() {
  const redirectedPath = new URLSearchParams(window.location.search).get("redirect");

  if (redirectedPath && redirectedPath.startsWith("/")) {
    return <Navigate to={redirectedPath} replace />;
  }

  // ✅ Direct-to-Call: If a pending native call exists with targetUrl, route directly to it without hitting Home page
  const pendingCall = typeof window !== "undefined" ? window.G9?.native?.pendingCall : null;
  if (pendingCall) {
    const targetUrl = pendingCall.targetUrl || pendingCall.target_url;
    if (targetUrl && targetUrl.startsWith("/")) {
      console.log("⚡ Direct-to-Call (RootRedirect): Navigating directly to targetUrl:", targetUrl);
      return <Navigate to={targetUrl} state={{ native: true, autoAccept: true, acceptSent: true, action: "accept", ...pendingCall }} replace />;
    }
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