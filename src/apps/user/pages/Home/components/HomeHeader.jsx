import React from "react";
import { Link } from "react-router-dom";
import { Bell, Menu, SlidersHorizontal, Wallet, LogIn, LogOut } from "lucide-react";

import logo from "../../../../../assets/logo.webp";
import { LocationSelector } from "../../../../../shared/components";
import GlobalSearchBar from "../../../components/search/GlobalSearchBar";

// Helper function to get initials from name
const getInitials = (name = "") => {
  if (!name) return "";
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + (words[words.length - 1]?.charAt(0) || "")).toUpperCase();
};

// Check if there's a valid profile photo
const hasValidPhoto = (photo) => {
  return photo && 
    !photo.includes("default") && 
    !photo.includes("placeholder") &&
    !photo.includes("avatar") &&
    photo.length > 10;
};

const HomeHeader = React.memo(function HomeHeader({
  onMenuOpen,
  onProfileOpen,
  onLocationSelect,
  onNotificationOpen,
  onWalletOpen,
  onFilterOpen,
  onLogin,
  onLogout,
  balance = 0,
  user,
  isLoggedIn = false,
}) {
  const displayName = user?.full_name || user?.first_name || user?.name || "User";
  const walletAmount = Math.floor(Number(balance || 0));
  const initials = getInitials(displayName);
  const validPhoto = hasValidPhoto(user?.profile_photo);

  return (
    <>
      {/* Desktop Header */}
      <header className="home-feed-header desktop-header-only">
        <div className="home-header-inner-container">
          <button type="button" className="home-icon-button home-menu-toggle" onClick={onMenuOpen} aria-label="Open menu">
            <Menu size={20} />
          </button>

          <Link className="home-feed-logo" to="/user" aria-label="G9Expert home">
            <img src={logo} alt="G9Expert" />
          </Link>

          <div className="home-header-search">
            <GlobalSearchBar
              className="home-global-search"
              placeholder="Search experts, services, categories..."
            />
            <button type="button" className="home-header-filter" onClick={onFilterOpen} aria-label="Open search filters">
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {/* Right Actions Group (Location, Notification, Wallet, Profile) */}
          <div className="home-header-right-actions">
            <div className="home-feed-location">
              <LocationSelector onLocationSelect={onLocationSelect} />
            </div>

            <button type="button" className="home-header-icon home-header-notification" onClick={onNotificationOpen} aria-label="Open notifications">
              <Bell size={18} />
            </button>

            {isLoggedIn ? (
              <button type="button" className="home-wallet-pill" onClick={onWalletOpen} aria-label="Open wallet">
                <Wallet size={16} className="wallet-icon" />
                <div className="wallet-info">
                  <small className="wallet-label">Wallet Balance</small>
                  <strong className="wallet-amount">₹ {walletAmount}</strong>
                </div>
                <span className="wallet-arrow">▼</span>
              </button>
            ) : (
              <button 
                type="button" 
                className="home-login-btn"
                onClick={onLogin}
              >
                <LogIn size={16} />
                <span>Login</span>
              </button>
            )}

            {/* Profile Avatar - Only shows when logged in */}
            {isLoggedIn && (
              <button type="button" className="home-profile-avatar-btn" onClick={onProfileOpen} aria-label="Open profile">
                <div className="home-profile-avatar-wrapper">
                  {validPhoto ? (
                    <img src={user.profile_photo} alt={displayName} />
                  ) : (
                    <span className="home-profile-initials">
                      {initials}
                    </span>
                  )}
                </div>
                <span className="profile-arrow">▼</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Header - Flutter Native App Bar Style */}
      <header className="mobile-header-only">
        <button 
          type="button" 
          className="mobile-header-menu-btn" 
          onClick={onMenuOpen} 
          aria-label="Open menu" 
        >
          <Menu size={20} strokeWidth={2.2} />
        </button>

        <div className="mobile-header-location">
          <LocationSelector onLocationSelect={onLocationSelect} fallbackText="Indore, MP" />
        </div>

        <div className="mobile-header-right-actions">
          <button 
            type="button" 
            className="mobile-header-bell-btn" 
            onClick={onNotificationOpen} 
            aria-label="Open notifications"
          >
            <Bell size={18} strokeWidth={2.2} />
            <span className="mobile-bell-badge" style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#ef4444",
              boxShadow: "0 0 0 2px #ffffff",
            }} />
          </button>

          {/* Live Wallet Amount (Replaces Profile Icon) */}
          <button 
            type="button" 
            className="mobile-header-wallet-btn" 
            onClick={onWalletOpen}
            aria-label="Open wallet"
            title="Wallet Balance"
          >
            <Wallet size={16} strokeWidth={2.2} />
            <span style={{ whiteSpace: "nowrap" }}>₹{walletAmount}</span>
          </button>
        </div>
      </header>

      {/* Mobile Menu Panel - This should be rendered in the parent component */}
      {/* The login/logout buttons inside the mobile menu should be handled in the parent */}
    </>
  );
});

export default HomeHeader;