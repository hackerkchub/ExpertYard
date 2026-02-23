import { Routes, Route, Navigate } from "react-router-dom";
import ExpertLayout from "../layouts/ExpertLayout";
import StepAccount from "../pages/register/StepAccount";
import StepCategory from "../pages/register/StepCategory";
import StepSubcategory from "../pages/register/StepSubcategory";
import StepProfile from "../pages/register/StepProfile";
import StepPricing from "../pages/register/StepPricing";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile/ExpertProfile";
import MyContent from "../pages/MyContent/MyContent";
import ExpertChat from "../pages/chat/ExpertChat";
import ExpertChatHistory from "../pages/chat-history/ExpertChatHistory";
import ProtectedExpertRoute from "./ProtectedExpertRoute";
import { useExpert } from "../../../shared/context/ExpertContext";
import ExpertVoiceCall from "../pages/voice-call/ExpertVoiceCall";
import ExpertNotificationPage from "../pages/notification/ExpertNotificationPage";
import EarningDashboard from "../pages/earnings/ExpertEarningsDashboard";
import Calendar from "../pages/calendar/Calendar";

export default function ExpertAppRoutes() {
  const { expertData } = useExpert();

  return (
    <Routes>
      {/* Default redirect */}
      <Route index element={<Navigate to="home" />} />

      {/* 🔐 PROTECTED ROUTES WITH EXPERT LAYOUT (SIDEBAR + TOPBAR) */}
      <Route element={<ExpertLayout />}>
        {/* DASHBOARD */}
        <Route
          path="home"
          element={
            <ProtectedExpertRoute
              condition={expertData.expertId}
              redirectTo="/expert/register"
            >
              <Dashboard />
            </ProtectedExpertRoute>
          }
        />

        {/* PROFILE */}
        <Route
          path="profile"
          element={
            <ProtectedExpertRoute
              condition={expertData.expertId}
              redirectTo="/expert/home"
            >
              <Profile />
            </ProtectedExpertRoute>
          }
        />

        {/* MY CONTENT */}
        <Route
          path="my-content"
          element={
            <ProtectedExpertRoute
              condition={expertData.expertId}
              redirectTo="/expert/home"
            >
              <MyContent />
            </ProtectedExpertRoute>
          }
        />

        {/* 📅 CALENDAR - NOW INSIDE LAYOUT ✅ */}
        <Route
          path="calendar"
          element={
            <ProtectedExpertRoute
              condition={expertData.expertId}
              redirectTo="/expert/home"
            >
              <Calendar />
            </ProtectedExpertRoute>
          }
        />

        {/* 💰 EARNINGS - NOW INSIDE LAYOUT ✅ */}
        <Route
          path="earnings"
          element={
            <ProtectedExpertRoute
              condition={expertData.expertId}
              redirectTo="/expert/home"
            >
              <EarningDashboard />
            </ProtectedExpertRoute>
          }
        />

        {/* 💬 LIVE CHAT ROUTES */}
        <Route
          path="chat"
          element={
            <ProtectedExpertRoute
              condition={expertData.expertId}
              redirectTo="/expert/home"
            >
              <ExpertChat />
            </ProtectedExpertRoute>
          }
        />

        <Route
          path="chat/:room_id"
          element={
            <ProtectedExpertRoute
              condition={expertData.expertId}
              redirectTo="/expert/home"
            >
              <ExpertChat />
            </ProtectedExpertRoute>
          }
        />

        {/* 📋 CHAT HISTORY ROUTES */}
        <Route
          path="chat-history"
          element={
            <ProtectedExpertRoute
              condition={expertData.expertId}
              redirectTo="/expert/home"
            >
              <ExpertChatHistory />
            </ProtectedExpertRoute>
          }
        />

        <Route
          path="chat-history/:session_id"
          element={
            <ProtectedExpertRoute
              condition={expertData.expertId}
              redirectTo="/expert/home"
            >
              <ExpertChatHistory />
            </ProtectedExpertRoute>
          }
        />

        {/* 🔔 NOTIFICATIONS - INSIDE LAYOUT (with sidebar) */}
        <Route
          path="notifications"
          element={
            <ProtectedExpertRoute
              condition={expertData.expertId}
              redirectTo="/expert/home"
            >
              <ExpertNotificationPage />
            </ProtectedExpertRoute>
          }
        />
      </Route>

      {/* 📞 VOICE CALL - OUTSIDE LAYOUT (FULL SCREEN) ✅ */}
      <Route
        path="voice-call/:callId"
        element={
          <ProtectedExpertRoute
            condition={expertData.expertId}
            redirectTo="/expert/home"
          >
            <ExpertVoiceCall />
          </ProtectedExpertRoute>
        }
      />

      {/* 🔓 REGISTER FLOW - NO LAYOUT */}
      <Route path="register" element={<StepAccount />} />
      
      <Route
        path="register/category"
        element={
          <ProtectedExpertRoute
            condition={expertData.expertId}
            redirectTo="/expert/home"
          >
            <StepCategory />
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
            <StepSubcategory />
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
            <StepProfile />
          </ProtectedExpertRoute>
        }
      />
      
      <Route
        path="register/pricing"
        element={
          <ProtectedExpertRoute
            condition={expertData.expertId}
            redirectTo="/expert/register/profile"
          >
            <StepPricing />
          </ProtectedExpertRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<h1>Expert 404 - Page Not Found</h1>} />
    </Routes>
  );
}