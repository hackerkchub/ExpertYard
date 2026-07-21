import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import HomeHeader from "../pages/Home/components/HomeHeader";
import { HomeLeftSidebar, HomeRightSidebar } from "../pages/Home/components/HomeSidebars";
import { useAuth } from "../../../shared/context/UserAuthContext";
import { useWallet } from "../../../shared/context/WalletContext";
import "../pages/Home/Home.css"; // Ensure layouts and sidebars styles are loaded globally

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isDesktop;
}

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
  const { balance } = useWallet();
  const isDesktop = useIsDesktop();

  // Step 1: Home page check
  const isUserHome = location.pathname === "/user" || location.pathname === "/user/";

  // Check if current page is Reels page
  const isReelsPage = 
    location.pathname.startsWith("/user/reels") || 
    location.pathname === "/user/reels" ||
    location.pathname.startsWith("/reels") || 
    location.pathname === "/reels";

  // Step 2: No footer pages (includes Reels page)
  const isNoFooterPage =
    isReelsPage ||
    location.pathname.startsWith("/user/my-inquiries") ||
    location.pathname === "/user/my-inquiries" ||
    location.pathname.startsWith("/user/chat") ||
    location.pathname === "/user/chat";

  // Hide mobile header on Reels, My Inquiries, and Chat pages
  const isHideMobileHeader = 
    isReelsPage || 
    location.pathname.startsWith("/user/my-inquiries") || 
    location.pathname === "/user/my-inquiries" ||
    location.pathname.startsWith("/user/chat") ||
    location.pathname === "/user/chat";

  const openLogin = () => {
    const redirectPath = `${location.pathname}${location.search}${location.hash}`;
    navigate(`/user/auth?redirect=${encodeURIComponent(redirectPath)}`, {
      state: { from: location },
    });
  };

  // For Home page - render with its own layout (Home component handles its own footer)
  if (isUserHome) {
    return (
      <>
        <Outlet />
      </>
    );
  }

  // Desktop layout for non-home pages
  if (isDesktop) {
    return (
      <div className="desktop-layout-wrapper">
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
        <div className="home-desktop-shell layout--full-content">
          <HomeLeftSidebar
            isLoggedIn={isLoggedIn}
            user={user}
            balance={balance}
            onLogin={openLogin}
            onLogout={logout}
          />
          <main className="home-center-column">
            <Outlet />
          </main>
        </div>
        {/* Step 3: Desktop Footer - hidden on Reels, My Inquiries, Chat pages */}
        {!isNoFooterPage && (
          <div className="default-footer-container">
            <Footer />
          </div>
        )}
      </div>
    );
  }

  // Mobile layout
  return (
    <>
      {!isHideMobileHeader && (
        <div className="mobile-only-header">
          <Navbar />
        </div>
      )}
      <Outlet />
      {/* Step 4: Mobile Footer - hidden on Reels, My Inquiries, Chat pages */}
      {!isNoFooterPage && (
        <div className="default-footer-container">
          <Footer />
        </div>
      )}
    </>
  );
}