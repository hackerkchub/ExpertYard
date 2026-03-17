import { Navigate } from "react-router-dom";

export default function RootRedirect() {

  const adminToken = localStorage.getItem("admin_token");
  const expertToken = localStorage.getItem("expert_token");
  const userToken = localStorage.getItem("user_token");
  const lastPanel = localStorage.getItem("last_panel");

  // TOKEN BASED REDIRECT
  if (adminToken) return <Navigate to="/admin/dashboard" replace />;
  if (expertToken) return <Navigate to="/expert/home" replace />;
  if (userToken) return <Navigate to="/user" replace />;

  // LAST PANEL BASED REDIRECT
  if (lastPanel === "expert") {
    return <Navigate to="/expert/register" replace />;
  }

  if (lastPanel === "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  if (lastPanel === "user") {
    return <Navigate to="/user/login" replace />;
  }

  // DEFAULT
  return <Navigate to="/user/login" replace />;
}