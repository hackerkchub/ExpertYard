import { Routes, Route, Navigate } from "react-router-dom";
import ExpertLayout from "../layouts/ExpertLayout";
import StepAccount from "../pages/register/StepAccount";
import StepCategory from "../pages/register/StepCategory";
import StepSubcategory from "../pages/register/StepSubcategory";
import StepProfile from "../pages/register/StepProfile";
import StepPricing from "../pages/register/StepPricing";
import Dashboard from "../pages/Dashboard";

export default function ExpertAppRoutes() {
  return (
    <Routes>

      {/* Expert Root */}
      <Route index element={<Navigate to="home" />} />

      {/* Dashboard under layout */}
      <Route element={<ExpertLayout />}>
        <Route path="home" element={<Dashboard />} />
      </Route>

      {/* Registration Pages */}
      <Route path="register" element={<StepAccount />} />
      <Route path="register/category" element={<StepCategory />} />
      <Route path="register/subcategory" element={<StepSubcategory />} />
      <Route path="register/profile" element={<StepProfile />} />
      <Route path="register/pricing" element={<StepPricing />} />

      {/* fallback */}
      <Route path="*" element={<h1>Expert 404 Not Found</h1>} />
    </Routes>
  );
}
