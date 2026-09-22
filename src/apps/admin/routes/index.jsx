import React from "react";
import lazyWithRetry from "../../../utils/lazyWithRetry";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminLayout from "../layouts/adminLayout";
import LazyRoute from "../../../routes/LazyRoute";
import AppNotFound from "../../../routes/AppNotFound";

const AdminLogin = lazyWithRetry(() => import("../pages/AdminLogin"));
const Dashboard = lazyWithRetry(() => import("../pages/Dashboard"));
const CategoryManagement = lazyWithRetry(() => import("../pages/CategoryManagement"));
const SubCategoryManagement = lazyWithRetry(() =>
  import("../pages/SubcategoryManagement")
);
const SubscribedExpertsAccessPage = lazyWithRetry(() => import("../pages/SubscribedExpertsAccessPage"));
const ExpertManagement = lazyWithRetry(() => import("../pages/ExpertManagement"));
const ExpertApproval = lazyWithRetry(() => import("../pages/ExpertApproval"));
const PayoutManagement = lazyWithRetry(() => import("../pages/PayoutManagement"));
const ExpertDetail = lazyWithRetry(() => import("../pages/ExpertDetail"));
const MembershipPlan = lazyWithRetry(() => import("../pages/mebership-plan"));
const FinanceDashboard = lazyWithRetry(() => import("../pages/FinanceDashboard"));
const BannerManagement = lazyWithRetry(() => import("../pages/BannerManagement"));
const DeletedExperts = lazyWithRetry(() => import("../pages/DeletedExperts"));
const ReelsManagement = lazyWithRetry(() => import("../pages/ReelsManagement"));
const MasterServicesManagement = lazyWithRetry(() => import("../pages/MasterServicesManagement"));
const AdminAllMasterServicesPage = lazyWithRetry(() => import("../pages/AdminAllMasterServicesPage"));
const MasterServiceDetailsPage = lazyWithRetry(() => import("../pages/MasterServiceDetailsPage"));
const AdminFormBuilderPage = lazyWithRetry(() => import("../pages/AdminFormBuilderPage"));
const AdminWorkflowBuilderPage = lazyWithRetry(() => import("../pages/AdminWorkflowBuilderPage"));
const AdminDocumentBuilderPage = lazyWithRetry(() => import("../pages/AdminDocumentBuilderPage"));
const AdminPricingRulesPage = lazyWithRetry(() => import("../pages/AdminPricingRulesPage"));
const AdminServiceTemplatesPage = lazyWithRetry(() => import("../pages/AdminServiceTemplatesPage"));
const AdminCustomServiceApprovalPage = lazyWithRetry(() => import("../pages/AdminCustomServiceApprovalPage"));
const AdminWorkspaceMonitoringPage = lazyWithRetry(() => import("../pages/AdminWorkspaceMonitoringPage"));
const AdminWorkspaceDetailPage = lazyWithRetry(() => import("../pages/AdminWorkspaceDetailPage"));
const AdminServiceAnalyticsPage = lazyWithRetry(() => import("../pages/AdminServiceAnalyticsPage"));
const AdminAIDiscoveryAnalyticsPage = lazyWithRetry(() => import("../pages/AdminAIDiscoveryAnalyticsPage"));
const SendToUsersPage = lazyWithRetry(() => import("../pages/notifications/SendToUsersPage"));
const SendToExpertsPage = lazyWithRetry(() => import("../pages/notifications/SendToExpertsPage"));
const AdminNotificationsInboxPage = lazyWithRetry(() => import("../pages/notifications/AdminNotificationsInboxPage"));
const LegalManagement = lazyWithRetry(() => import("../pages/LegalManagement/LegalManagement"));
const AdminInquiriesPage = lazyWithRetry(() => import("../pages/AdminInquiriesPage"));

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
          <Route path="inquiries" element={withLazyRoute(<AdminInquiriesPage />)} />
          <Route path="notifications" element={withLazyRoute(<AdminNotificationsInboxPage />)} />
          <Route path="category-management" element={withLazyRoute(<CategoryManagement />)} />
          <Route
            path="sub-category-management"
            element={withLazyRoute(<SubCategoryManagement />)}
          />
          <Route path="expert-management" element={withLazyRoute(<ExpertManagement />)} />
          <Route path="subscribed-experts" element={withLazyRoute(<SubscribedExpertsAccessPage />)} />
          <Route path="deleted-experts" element={withLazyRoute(<DeletedExperts />)} />
          <Route path="expert-approval" element={withLazyRoute(<ExpertApproval />)} />
          <Route path="payout-management" element={withLazyRoute(<PayoutManagement />)} />
          <Route path="expert/:id" element={withLazyRoute(<ExpertDetail />)} />
          <Route path="membership-plan" element={withLazyRoute(<MembershipPlan/>)}/>
          <Route path="finance" element={withLazyRoute(<FinanceDashboard/>)}/>
          <Route path="banner" element={withLazyRoute(<BannerManagement/>)}/>
          <Route path="reels-management" element={withLazyRoute(<ReelsManagement/>)}/>
          <Route path="master-services" element={withLazyRoute(<MasterServicesManagement/>)}/>
          <Route path="master-services/list" element={withLazyRoute(<AdminAllMasterServicesPage/>)}/>
          <Route path="master-services/:id" element={withLazyRoute(<MasterServiceDetailsPage/>)}/>
          <Route path="form-builder" element={withLazyRoute(<AdminFormBuilderPage/>)}/>
          <Route path="form-builder/:id" element={withLazyRoute(<AdminFormBuilderPage/>)}/>
          <Route path="workflow-builder" element={withLazyRoute(<AdminWorkflowBuilderPage/>)}/>
          <Route path="workflow-builder/:id" element={withLazyRoute(<AdminWorkflowBuilderPage/>)}/>
          <Route path="document-builder" element={withLazyRoute(<AdminDocumentBuilderPage/>)}/>
          <Route path="document-builder/:id" element={withLazyRoute(<AdminDocumentBuilderPage/>)}/>
          <Route path="pricing-rules" element={withLazyRoute(<AdminPricingRulesPage/>)}/>
          <Route path="pricing-rules/:id" element={withLazyRoute(<AdminPricingRulesPage/>)}/>
          <Route path="service-templates" element={withLazyRoute(<AdminServiceTemplatesPage/>)}/>
          <Route path="custom-service-approval" element={withLazyRoute(<AdminCustomServiceApprovalPage/>)}/>
          <Route path="workspace-monitoring" element={withLazyRoute(<AdminWorkspaceMonitoringPage/>)}/>
          <Route path="workspace/:bookingId" element={withLazyRoute(<AdminWorkspaceDetailPage/>)}/>
          <Route path="service-analytics" element={withLazyRoute(<AdminServiceAnalyticsPage/>)}/>
          <Route path="ai-analytics" element={withLazyRoute(<AdminAIDiscoveryAnalyticsPage/>)}/>
          <Route path="notifications/users" element={withLazyRoute(<SendToUsersPage />)} />
          <Route path="notifications/experts" element={withLazyRoute(<SendToExpertsPage />)} />
          <Route path="legal-management" element={withLazyRoute(<LegalManagement/>)}/>
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
