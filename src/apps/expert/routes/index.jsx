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
import ExpertChatHistory from "../pages/chat-history/ExpertChatHistory"; // ✅ NEW
import ProtectedExpertRoute from "./ProtectedExpertRoute";
import { useExpert } from "../../../shared/context/ExpertContext";
import ExpertVoiceCall from "../pages/voice-call/ExpertVoiceCall";
import ExpertNotificationPage from "../pages/notification/ExpertNotificationPage";


export default function ExpertAppRoutes() {
  const { expertData } = useExpert();

  return (
    <Routes>
      {/* Default */}
      <Route index element={<Navigate to="home" />} />

      {/* 🔐 EXPERT DASHBOARD (WITH LAYOUT) */}
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
              redirectTo="/expert/register"
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
              redirectTo="/expert/register"
            >
              <MyContent />
            </ProtectedExpertRoute>
          }
        />

        {/* ✅ LIVE CHAT ROUTES */}
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

        {/* ✅ NEW: CHAT HISTORY ROUTES */}
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
      </Route>

      {/* 📞 VOICE CALL (IMPORTANT ✅) */}
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


      {/* 🔓 REGISTER FLOW (NO LAYOUT) */}
      <Route path="register" element={<StepAccount />} />
      <Route
        path="register/category"
        element={
          <ProtectedExpertRoute
            condition={expertData.expertId}
            redirectTo="/expert/register"
          >
            <StepCategory />
          </ProtectedExpertRoute>
        }
      />
      <Route
        path="register/subcategory"
        element={
          <ProtectedExpertRoute
            condition={
              expertData.expertId &&
              expertData.categoryId
            }
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

      {/* Fallback */}
     
      <Route path="*" element={<h1>Expert 404 - Page Not Found</h1>} />
    </Routes>
  );
}