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
import ExpertChat from "../pages/chat/ExpertChat"; // ✅ Import
import ProtectedExpertRoute from "./ProtectedExpertRoute";
import { useExpert } from "../../../shared/context/ExpertContext";

export default function ExpertAppRoutes() {
  const { expertData } = useExpert();

  return (
    <Routes>
      {/* Default */}
      <Route index element={<Navigate to="home" />} />

      {/* 🔐 EXPERT DASHBOARD (WITH LAYOUT) */}
      <Route element={<ExpertLayout />}>
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

        {/* ✅ CHAT ROUTE - INSIDE LAYOUT! */}
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

        {/* ✅ CHAT ROOM ROUTE - DYNAMIC PARAMS */}
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
      </Route>

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
      <Route path="*" element={<h1>Expert 404</h1>} />
    </Routes>
  );
}
