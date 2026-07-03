import { Outlet, useLocation, useNavigate } from "react-router-dom";

import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import HomeHeader from "../pages/Home/components/HomeHeader";
import { useAuth } from "../../../shared/context/UserAuthContext";
import { useWallet } from "../../../shared/context/WalletContext";

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const { balance } = useWallet();

  const isUserHome = location.pathname === "/user" || location.pathname === "/user/";

  if (isUserHome) {
    return (
      <>
        <Outlet />
      </>
    );
  }

  return (
    <>
      <div className="desktop-only-header">
        <HomeHeader
          onMenuOpen={() => {}}
          onProfileOpen={() => navigate(isLoggedIn ? "/user/user-profile" : "/user/auth")}
          onLocationSelect={(loc) => {
            window.dispatchEvent(new CustomEvent("g9-location-changed", { detail: loc }));
          }}
          onNotificationOpen={() => navigate("/user/notifications")}
          onWalletOpen={() => navigate("/user/wallet")}
          onFilterOpen={() => navigate("/user/search")}
          balance={balance}
          user={user}
        />
      </div>
      <div className="mobile-only-header">
        <Navbar />
      </div>
      <Outlet />
      <Footer />
    </>
  );
}
