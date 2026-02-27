import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/adminLayout";
import Dashboard from "../pages/Dashboard";
import CategoryManagement from "../pages/CategoryManagement";
import SubCategoryManagement from "../pages/SubcategoryManagement";
import ExpertManagement from "../pages/ExpertManagement";
import ExpertApproval from "../pages/ExpertApproval";
import AdminLogin from "../pages/AdminLogin";
import AdminProtectedRoute from "./AdminProtectedRoute";
import PayoutManagement from "../pages/PayoutManagement";

export default function AdminAppRoutes() {
  return (
    <Routes>
      {/* DEFAULT */}
      <Route index element={<Navigate to="login" />} />

      {/* PUBLIC */}
      <Route path="login" element={<AdminLogin />} />

      {/* PROTECTED */}
      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="category-management" element={<CategoryManagement />} />
          <Route path="sub-category-management" element={<SubCategoryManagement />} />
          <Route path="expert-management" element={<ExpertManagement />} />
          <Route path="expert-approval" element={<ExpertApproval />} />
          <Route path="payout-management" element={<PayoutManagement />} />
        </Route>
      </Route>
    </Routes>
  );
}