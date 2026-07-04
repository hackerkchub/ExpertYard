import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AppNotFound from "../../../routes/AppNotFound";
import LazyRoute from "../../../routes/LazyRoute";
import AdminLayout from "../layouts/adminLayout";
import AdminProtectedRoute from "./AdminProtectedRoute";

const Dashboard = lazy(() => import("../pages/Dashboard"));
const CategoryManagement = lazy(() => import("../pages/CategoryManagement"));
const SubCategoryManagement = lazy(() => import("../pages/SubcategoryManagement"));
const ExpertManagement = lazy(() => import("../pages/ExpertManagement"));
const ExpertApproval = lazy(() => import("../pages/ExpertApproval"));
const AdminLogin = lazy(() => import("../pages/AdminLogin"));
const PayoutManagement = lazy(() => import("../pages/PayoutManagement"));
const ExpertDetail = lazy(() => import("../pages/ExpertDetail"));
const MembershipPlan = lazy(() => import("../pages/mebership-plan"));
const FinanceDashboard = lazy(() => import("../pages/FinanceDashboard"));
const BannerManagement = lazy(() => import("../pages/BannerManagement"));
const DeletedExperts = lazy(() => import("../pages/DeletedExperts"));
const ReelsManagement = lazy(() => import("../pages/ReelsManagement"));

const withLazyRoute = (node) => <LazyRoute>{node}</LazyRoute>;

export default function AdminAppRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="login" replace />} />
      <Route path="login" element={withLazyRoute(<AdminLogin />)} />

      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={withLazyRoute(<Dashboard />)} />
          <Route path="category-management" element={withLazyRoute(<CategoryManagement />)} />
          <Route
            path="sub-category-management"
            element={withLazyRoute(<SubCategoryManagement />)}
          />
          <Route path="expert-management" element={withLazyRoute(<ExpertManagement />)} />
          <Route path="deleted-experts" element={withLazyRoute(<DeletedExperts />)} />
          <Route path="expert-approval" element={withLazyRoute(<ExpertApproval />)} />
          <Route path="payout-management" element={withLazyRoute(<PayoutManagement />)} />
          <Route path="expert/:id" element={withLazyRoute(<ExpertDetail />)} />
          <Route path="membership-plan" element={withLazyRoute(<MembershipPlan/>)}/>
          <Route path="finance" element={withLazyRoute(<FinanceDashboard/>)}/>
          <Route path="banner" element={withLazyRoute(<BannerManagement/>)}/>
          <Route path="reels-management" element={withLazyRoute(<ReelsManagement/>)}/>
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <AppNotFound
            title="Admin page not found"
            description="The requested admin route does not exist."
            homePath="/admin/login"
            actionLabel="Go to admin login"
          />
        }
      />
    </Routes>
  );
}
