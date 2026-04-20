import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { useExpert } from "../../../shared/context/ExpertContext";
import LazyRoute from "../../../routes/LazyRoute";
import ExpertLayout from "../layouts/ExpertLayout";
import ProtectedExpertRoute from "./ProtectedExpertRoute";

const StepAccount = lazy(() => import("../pages/register/StepAccount"));
const StepCategory = lazy(() => import("../pages/register/StepCategory"));
const StepSubcategory = lazy(() => import("../pages/register/StepSubcategory"));
const StepProfile = lazy(() => import("../pages/register/StepProfile"));
const StepPricing = lazy(() => import("../pages/register/StepPricing"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Profile = lazy(() => import("../pages/Profile/ExpertProfile"));
const MyContent = lazy(() => import("../pages/MyContent/MyContent"));
const ExpertChat = lazy(() => import("../pages/chat/ExpertChat"));
const ExpertChatHistory = lazy(() => import("../pages/chat-history/ExpertChatHistory"));
const ExpertVoiceCall = lazy(() => import("../pages/voice-call/ExpertVoiceCall"));
const ExpertNotificationPage = lazy(() => import("../pages/notification/ExpertNotificationPage"));
const EarningDashboard = lazy(() => import("../pages/earnings/ExpertEarningsDashboard"));
const Calendar = lazy(() => import("../pages/calendar/Calendar"));
const ExpertSettings = lazy(() => import("../pages/settings/ExpertSettings"));
const CreateService = lazy(() => import("../pages/services/CreateServices"));
const MyServices = lazy(() => import("../pages/services/MyServices"));
const ExpertBookings = lazy(() => import("../pages/services/ExpertBookings"));
const SubscriptionPlan = lazy(() => import("../pages/register/SubscriptionPlan"));
const GuidexaExpertPlan = lazy(() => import("../pages/GuidexaExpertPlan/GuidexaExpertPlan"));

const withLazyRoute = (node) => <LazyRoute>{node}</LazyRoute>;

export default function ExpertAppRoutes() {
  const { expertData } = useExpert();

  return (
    <Routes>
      <Route
        index
        element={
          expertData?.expertId ? (
            <Navigate to="home" replace />
          ) : (
            <Navigate to="register" replace />
          )
        }
      />

      <Route element={<ExpertLayout />}>
        <Route
          path="home"
          element={
            <ProtectedExpertRoute
              condition={expertData.expertId}
              redirectTo="/expert/register"
            >
              <LazyRoute>
                <Dashboard />
              </LazyRoute>
            </ProtectedExpertRoute>
          }
        />
        <Route
          path="guidexa-plan"
          element={
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
              <LazyRoute>
                <GuidexaExpertPlan />
              </LazyRoute>
            </ProtectedExpertRoute>
          }
        />
        <Route
          path="mybookings"
          element={
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
              <LazyRoute>
                <ExpertBookings />
              </LazyRoute>
            </ProtectedExpertRoute>
          }
        />
        <Route
          path="create-services"
          element={
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
              <LazyRoute>
                <CreateService />
              </LazyRoute>
            </ProtectedExpertRoute>
          }
        />
        <Route
          path="myservices"
          element={
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
              <LazyRoute>
                <MyServices />
              </LazyRoute>
            </ProtectedExpertRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
              <LazyRoute>
                <Profile />
              </LazyRoute>
            </ProtectedExpertRoute>
          }
        />
        <Route
          path="my-content"
          element={
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
              <LazyRoute>
                <MyContent />
              </LazyRoute>
            </ProtectedExpertRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
              <LazyRoute>
                <ExpertSettings />
              </LazyRoute>
            </ProtectedExpertRoute>
          }
        />
        <Route
          path="calendar"
          element={
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
              <LazyRoute>
                <Calendar />
              </LazyRoute>
            </ProtectedExpertRoute>
          }
        />
        <Route
          path="earnings"
          element={
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
              <LazyRoute>
                <EarningDashboard />
              </LazyRoute>
            </ProtectedExpertRoute>
          }
        />
        <Route
          path="chat"
          element={
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
              <LazyRoute>
                <ExpertChat />
              </LazyRoute>
            </ProtectedExpertRoute>
          }
        />
        <Route
          path="chat/:room_id"
          element={
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
              <LazyRoute>
                <ExpertChat />
              </LazyRoute>
            </ProtectedExpertRoute>
          }
        />
        <Route
          path="chat-history"
          element={
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
              <LazyRoute>
                <ExpertChatHistory />
              </LazyRoute>
            </ProtectedExpertRoute>
          }
        />
        <Route
          path="chat-history/:session_id"
          element={
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
              <LazyRoute>
                <ExpertChatHistory />
              </LazyRoute>
            </ProtectedExpertRoute>
          }
        />
        <Route
          path="notifications"
          element={
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
              <LazyRoute>
                <ExpertNotificationPage />
              </LazyRoute>
            </ProtectedExpertRoute>
          }
        />
      </Route>

      <Route
        path="voice-call/:callId"
        element={
          <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
            <LazyRoute>
              <ExpertVoiceCall />
            </LazyRoute>
          </ProtectedExpertRoute>
        }
      />

      <Route path="register" element={withLazyRoute(<StepAccount />)} />
      <Route path="register/subscription" element={withLazyRoute(<SubscriptionPlan />)} />
      <Route
        path="register/category"
        element={
          <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
            <LazyRoute>
              <StepCategory />
            </LazyRoute>
          </ProtectedExpertRoute>
        }
      />
      <Route
        path="register/subcategory"
        element={
          <ProtectedExpertRoute
            condition={expertData.expertId && expertData.categoryId}
            redirectTo="/expert/register/category"
          >
            <LazyRoute>
              <StepSubcategory />
            </LazyRoute>
          </ProtectedExpertRoute>
        }
      />
      <Route
        path="register/profile"
        element={
          <ProtectedExpertRoute
            condition={
              expertData.expertId &&
              expertData.categoryId &&
              expertData.subCategoryIds.length > 0
            }
            redirectTo="/expert/register/subcategory"
          >
            <LazyRoute>
              <StepProfile />
            </LazyRoute>
          </ProtectedExpertRoute>
        }
      />
      <Route
        path="register/pricing"
        element={
          <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/register/profile">
            <LazyRoute>
              <StepPricing />
            </LazyRoute>
          </ProtectedExpertRoute>
        }
      />

      <Route path="*" element={<h1>Expert 404 - Page Not Found</h1>} />
    </Routes>
  );
}
