import React, { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminProtectedRoute from "./AdminProtectedRoute";
import AdminLayout from "../layouts/adminLayout";
import LazyRoute from "../../../routes/LazyRoute";
import AppNotFound from "../../../routes/AppNotFound";

const AdminLogin = lazy(() => import("../pages/AdminLogin"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const CategoryManagement = lazy(() => import("../pages/CategoryManagement"));
const SubCategoryManagement = lazy(() =>
  import("../pages/SubcategoryManagement")
);
const SubscribedExpertsAccessPage = lazy(() => import("../pages/SubscribedExpertsAccessPage"));
const ExpertManagement = lazy(() => import("../pages/ExpertManagement"));
const ExpertApproval = lazy(() => import("../pages/ExpertApproval"));
const PayoutManagement = lazy(() => import("../pages/PayoutManagement"));
const ExpertDetail = lazy(() => import("../pages/ExpertDetail"));
const MembershipPlan = lazy(() => import("../pages/mebership-plan"));
const FinanceDashboard = lazy(() => import("../pages/FinanceDashboard"));
const BannerManagement = lazy(() => import("../pages/BannerManagement"));
const DeletedExperts = lazy(() => import("../pages/DeletedExperts"));
const ReelsManagement = lazy(() => import("../pages/ReelsManagement"));
const MasterServicesManagement = lazy(() => import("../pages/MasterServicesManagement"));
const AdminAllMasterServicesPage = lazy(() => import("../pages/AdminAllMasterServicesPage"));
const MasterServiceDetailsPage = lazy(() => import("../pages/MasterServiceDetailsPage"));
const AdminFormBuilderPage = lazy(() => import("../pages/AdminFormBuilderPage"));
const AdminWorkflowBuilderPage = lazy(() => import("../pages/AdminWorkflowBuilderPage"));
const AdminDocumentBuilderPage = lazy(() => import("../pages/AdminDocumentBuilderPage"));
const AdminPricingRulesPage = lazy(() => import("../pages/AdminPricingRulesPage"));
const AdminServiceTemplatesPage = lazy(() => import("../pages/AdminServiceTemplatesPage"));
const AdminCustomServiceApprovalPage = lazy(() => import("../pages/AdminCustomServiceApprovalPage"));
const AdminWorkspaceMonitoringPage = lazy(() => import("../pages/AdminWorkspaceMonitoringPage"));
const AdminWorkspaceDetailPage = lazy(() => import("../pages/AdminWorkspaceDetailPage"));
const AdminServiceAnalyticsPage = lazy(() => import("../pages/AdminServiceAnalyticsPage"));
const AdminAIDiscoveryAnalyticsPage = lazy(() => import("../pages/AdminAIDiscoveryAnalyticsPage"));
const SendToUsersPage = lazy(() => import("../pages/notifications/SendToUsersPage"));
const SendToExpertsPage = lazy(() => import("../pages/notifications/SendToExpertsPage"));
const AdminNotificationsInboxPage = lazy(() => import("../pages/notifications/AdminNotificationsInboxPage"));
const LegalManagement = lazy(() => import("../pages/LegalManagement/LegalManagement"));
const AdminInquiriesPage = lazy(() => import("../pages/AdminInquiriesPage"));

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
