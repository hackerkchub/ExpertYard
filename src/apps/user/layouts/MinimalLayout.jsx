import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function MinimalLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const showMobileBack = location.pathname !== "/user";

  return (
    <>
      {showMobileBack && (
        <header className="mobile-route-back-header">
          <button type="button" onClick={() => navigate(-1)} aria-label="Go back">
            <FiArrowLeft />
          </button>
        </header>
      )}
      <Outlet />
    </>
  );
}
