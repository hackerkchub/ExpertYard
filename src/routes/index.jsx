// src/routes/index.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserAppRoutes from "../apps/user/routes";
import ExpertAppRoutes from "../apps/expert/routes";
import AdminAppRoutes from "../apps/admin/routes";

export default function AppRouter() {
  return (
    <Routes>
      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/user" />} />

      {/* User */}
      <Route path="/user/*" element={<UserAppRoutes />} />

      {/* Expert */}
      <Route path="/expert/*" element={<ExpertAppRoutes />} />

      {/* Admin */}
      <Route path="/admin/*" element={<AdminAppRoutes />} />
    </Routes>
  );
}
