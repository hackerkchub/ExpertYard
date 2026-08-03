import { Navigate, useLocation } from "react-router-dom";
import { useExpert } from "../../../shared/context/ExpertContext";

const ALLOWED_AFTER_TRIAL = [
  "/expert/g9-plan",
  "/expert/register",
  "/expert/register/subscription",
];

const ProtectedExpertRoute = ({
  condition,
  redirectTo,
  children,
}) => {
  const location = useLocation();
  const { expertData } = useExpert();

  // Only check the main condition
  if (!condition) {
    return <Navigate to={redirectTo} replace />;
  }

  // ✅ REMOVED: Trial expired redirect logic
  // Now it only returns children without any trial-based redirect

  return children;
};

export default ProtectedExpertRoute;