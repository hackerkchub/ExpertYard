import { Navigate } from "react-router-dom";
import { useExpert } from "../../../shared/context/ExpertContext";

const ProtectedExpertRoute = ({ condition, redirectTo, children }) => {
  if (!condition) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
};

export default ProtectedExpertRoute;
