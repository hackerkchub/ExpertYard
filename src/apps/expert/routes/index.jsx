import lazyWithRetry from "../../../utils/lazyWithRetry";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

import AppNotFound from "../../../routes/AppNotFound";
import { useExpert } from "../../../shared/context/ExpertContext";
import LazyRoute from "../../../routes/LazyRoute";
import ExpertLayout from "../layouts/ExpertLayout";
import ProtectedExpertRoute from "./ProtectedExpertRoute";

const StepAccount = lazyWithRetry(() => import("../pages/register/StepAccount"));
const StepCategory = lazyWithRetry(() => import("../pages/register/StepCategory"));
const StepSubcategory = lazyWithRetry(() => import("../pages/register/StepSubcategory"));
const StepProfile = lazyWithRetry(() => import("../pages/register/StepProfile"));
const StepPricing = lazyWithRetry(() => import("../pages/register/StepPricing"));
const Dashboard = lazyWithRetry(() => import("../pages/Dashboard"));
const Profile = lazyWithRetry(() => import("../pages/Profile/ExpertProfile"));
const MyContent = lazyWithRetry(() => import("../pages/MyContent/MyContent"));
const ExpertChat = lazyWithRetry(() => import("../pages/chat/ExpertChat"));
const ExpertChatHistory = lazyWithRetry(() => import("../pages/chat-history/ExpertChatHistory"));
const ExpertVoiceCall = lazyWithRetry(() => import("../pages/voice-call/ExpertVoiceCall"));
const ExpertVideoCall = lazyWithRetry(() => import("../pages/video-call/ExpertVideoCall"));
const VideoMediaTestPage = lazyWithRetry(() => import("../../../shared/components/VideoMediaTestPage"));
const ExpertNotificationPage = lazyWithRetry(() => import("../pages/notification/ExpertNotificationPage"));
const EarningDashboard = lazyWithRetry(() => import("../pages/earnings/ExpertEarningsDashboard"));
const ExpertLeads = lazyWithRetry(() => import("../pages/leads/ExpertLeads"));
const Calendar = lazyWithRetry(() => import("../pages/calendar/Calendar"));
const ExpertSettings = lazyWithRetry(() => import("../pages/settings/ExpertSettings"));
const CreateService = lazyWithRetry(() => import("../pages/services/CreateServices"));
const MyServices = lazyWithRetry(() => import("../pages/services/MyServices"));
const ExpertBookings = lazyWithRetry(() => import("../pages/services/ExpertBookings"));
const SubscriptionPlan = lazyWithRetry(() => import("../pages/register/SubscriptionPlan"));
const G9Plan = lazyWithRetry(() => import("../pages/GuidexaExpertPlan/GuidexaExpertPlan"));
const ManageReels = lazyWithRetry(() => import("../pages/Reels/ManageReels"));
const ExpertInquiriesPage = lazyWithRetry(() => import("../pages/Inquiry/ExpertInquiriesPage"));
const ExpertServiceActivationPage = lazyWithRetry(() => import("../pages/services/ExpertServiceActivationPage"));
const CustomServiceRequestPage = lazyWithRetry(() => import("../pages/services/CustomServiceRequestPage"));
const ExpertWorkspacePage = lazyWithRetry(() => import("../pages/Workspace/ExpertWorkspacePage"));

const withLazyRoute = (node) => <LazyRoute>{node}</LazyRoute>;

const MobileBackShell = ({ children }) => {
  return <>{children}</>;
};

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
          path="inquiries"
          element={
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
              <LazyRoute>
                <ExpertInquiriesPage />
              </LazyRoute>
            </ProtectedExpertRoute>
          }
        />
        <Route
          path="g9-plan"
          element={
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
              <LazyRoute>
                <G9Plan />
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
        <Route path="my-bookings" element={<Navigate to="/expert/mybookings" replace />} />
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
          path="services/activation"
          element={
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
              <LazyRoute>
                <ExpertServiceActivationPage />
              </LazyRoute>
            </ProtectedExpertRoute>
          }
        />
        <Route
          path="services/available"
          element={
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
              <LazyRoute>
                <ExpertServiceActivationPage />
              </LazyRoute>
            </ProtectedExpertRoute>
          }
        />
        <Route
          path="services/custom-requests"
          element={
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
              <LazyRoute>
                <CustomServiceRequestPage />
              </LazyRoute>
            </ProtectedExpertRoute>
          }
        />
        <Route
          path="workspace/:bookingId"
          element={
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
              <LazyRoute>
                <ExpertWorkspacePage />
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
          path="reels"
          element={
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
              <LazyRoute>
                <ManageReels />
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
          path="leads"
          element={
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
              <LazyRoute>
                <ExpertLeads />
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
        <Route
          path="services/activation"
          element={
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
              <LazyRoute>
                <ExpertServiceActivationPage />
              </LazyRoute>
            </ProtectedExpertRoute>
          }
        />
        <Route
          path="workspace/:bookingId"
          element={
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
              <LazyRoute>
                <ExpertWorkspacePage />
              </LazyRoute>
            </ProtectedExpertRoute>
          }
        />
        <Route
          path="notification"
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

      <Route
        path="video-call/:callId"
        element={
          <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
            <LazyRoute>
              <ExpertVideoCall />
            </LazyRoute>
          </ProtectedExpertRoute>
        }
      />

      <Route
        path="video-media-test"
        element={withLazyRoute(<VideoMediaTestPage role="expert-diagnostic" />)}
      />

      <Route path="register" element={<MobileBackShell>{withLazyRoute(<StepAccount />)}</MobileBackShell>} />
      <Route path="register/subscription" element={<MobileBackShell>{withLazyRoute(<SubscriptionPlan />)}</MobileBackShell>} />
      <Route
        path="register/category"
        element={
          <MobileBackShell>
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/home">
              <LazyRoute>
                <StepCategory />
              </LazyRoute>
            </ProtectedExpertRoute>
          </MobileBackShell>
        }
      />
      <Route
        path="register/subcategory"
        element={
          <MobileBackShell>
            <ProtectedExpertRoute
              condition={expertData.expertId && expertData.categoryId}
              redirectTo="/expert/register/category"
            >
              <LazyRoute>
                <StepSubcategory />
              </LazyRoute>
            </ProtectedExpertRoute>
          </MobileBackShell>
        }
      />
      <Route
        path="register/profile"
        element={
          <MobileBackShell>
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
          </MobileBackShell>
        }
      />
      <Route
        path="register/pricing"
        element={
          <MobileBackShell>
            <ProtectedExpertRoute condition={expertData.expertId} redirectTo="/expert/register/profile">
              <LazyRoute>
                <StepPricing />
              </LazyRoute>
            </ProtectedExpertRoute>
          </MobileBackShell>
        }
      />
      <Route
        path="*"
        element={
          <AppNotFound
            title="Expert page not found"
            description="The requested expert route does not exist."
            homePath="/expert"
            actionLabel="Go to expert home"
          />
        }
      />
    </Routes>
  );
}
