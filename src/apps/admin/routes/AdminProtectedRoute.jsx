import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const adminToken =
    localStorage.getItem("admin_token") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("token");

  return adminToken ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminProtectedRoute;