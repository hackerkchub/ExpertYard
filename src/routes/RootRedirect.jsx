import { Navigate } from "react-router-dom";

export default function RootRedirect() {

  const adminToken = localStorage.getItem("admin_token");
  const expertToken = localStorage.getItem("expert_token");
  const userToken = localStorage.getItem("user_token");

  if (adminToken) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (expertToken) {
    return <Navigate to="/expert/home" replace />;
  }

  if (userToken) {
    return <Navigate to="/user" replace />;
  }

  return <Navigate to="/user" replace />;
}