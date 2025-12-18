import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/adminLayout";
import Dashboard from "../pages/Dashboard";
import CategoryManagement from "../pages/CategoryManagement";
import SubCategoryManagement from "../pages/SubcategoryManagement";
import ExpertManagement from "../pages/ExpertManagement";
import ExpertApproval from "../pages/ExpertApproval";

export default function AdminAppRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="category-management" element={<CategoryManagement />} />
        <Route path="sub-category-management" element={<SubCategoryManagement />} />
        <Route path="expert-management" element={<ExpertManagement />} />
        <Route path="expert-approval" element={<ExpertApproval />} />
      </Route>
    </Routes>
  );
}
