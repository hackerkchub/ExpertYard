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
        <button type="button" className="home-icon-button home-menu-toggle" onClick={onMenuOpen} aria-label="Open menu">
          <Menu size={22} />
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
            <SlidersHorizontal size={18} />
          </button>
        </div>

        <div className="home-feed-location">
          <LocationSelector onLocationSelect={onLocationSelect} />
        </div>

        <button type="button" className="home-header-icon home-header-notification" onClick={onNotificationOpen} aria-label="Open notifications">
          <Bell size={18} />
        </button>

        {isLoggedIn ? (
          <button type="button" className="home-wallet-pill" onClick={onWalletOpen} aria-label="Open wallet">
            <Wallet size={17} className="wallet-icon" />
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
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "999px",
              background: "linear-gradient(135deg, #0a66c2, #004182)",
              color: "#ffffff",
              border: "none",
              fontWeight: "600",
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 8px rgba(10, 102, 194, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(10, 102, 194, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(10, 102, 194, 0.3)";
            }}
          >
            <LogIn size={18} />
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
                <span className="home-profile-initials" style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #0a66c2, #004182)",
                  color: "#ffffff",
                  fontWeight: "700",
                  fontSize: "1rem",
                  textTransform: "uppercase",
                  borderRadius: "50%",
                }}>
                  {initials}
                </span>
              )}
            </div>
            <span className="profile-arrow">▼</span>
          </button>
        )}
      </header>

      {/* Mobile Header */}
      <header className="mobile-header-only" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        background: "#ffffff",
        borderBottom: "1px solid #eef2f7",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 1px 4px rgba(0, 0, 0, 0.04)",
      }}>
        <button 
          type="button" 
          className="mobile-header-menu-btn" 
          onClick={onMenuOpen} 
          aria-label="Open menu" 
          style={{
            background: "none",
            border: "none",
            padding: "6px",
            cursor: "pointer",
            color: "#111827",
          }}
        >
          <Menu size={24} />
        </button>

        <Link className="mobile-header-logo-link" to="/user" style={{ flexShrink: 0 }}>
          <img src={logo} alt="G9Expert" style={{ height: "32px", width: "auto" }} />
        </Link>

        <div className="mobile-header-location" style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <LocationSelector onLocationSelect={onLocationSelect} fallbackText="Indore, MP" />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button 
            type="button" 
            className="mobile-header-bell-btn" 
            onClick={onNotificationOpen} 
            aria-label="Open notifications"
            style={{
              background: "none",
              border: "none",
              padding: "6px",
              cursor: "pointer",
              color: "#111827",
              position: "relative",
            }}
          >
            <Bell size={22} />
            <span className="mobile-bell-badge" style={{
              position: "absolute",
              top: "2px",
              right: "2px",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: "#ef4444",
              color: "#ffffff",
              fontSize: "10px",
              fontWeight: "700",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>3</span>
          </button>

          {/* Mobile Auth - Shows Login or User Avatar */}
          {/* {!isLoggedIn ? (
            <button 
              type="button" 
              onClick={onLogin}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "6px 14px",
                borderRadius: "999px",
                background: "linear-gradient(135deg, #0a66c2, #004182)",
                color: "#ffffff",
                border: "none",
                fontWeight: "600",
                fontSize: "12px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <LogIn size={16} />
              <span>Login</span>
            </button>
          ) : (
            <button 
              type="button" 
              onClick={onProfileOpen}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px",
                borderRadius: "50%",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                overflow: "hidden",
                background: "linear-gradient(135deg, #0a66c2, #004182)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {validPhoto ? (
                  <img src={user.profile_photo} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{
                    color: "#ffffff",
                    fontWeight: "700",
                    fontSize: "14px",
                    textTransform: "uppercase",
                  }}>
                    {initials}
                  </span>
                )}
              </div>
            </button>
          )} */}
        </div>
      </header>

      {/* Mobile Menu Panel - This should be rendered in the parent component */}
      {/* The login/logout buttons inside the mobile menu should be handled in the parent */}
    </>
  );
});

export default HomeHeader;