import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Menu, SlidersHorizontal, Wallet, LogIn, LogOut, MapPin, ChevronDown, Search, X } from "lucide-react";

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
  notificationCount = 0,
}) {
  const displayName = user?.full_name || user?.first_name || user?.name || "User";
  const walletAmount = Math.floor(Number(balance || 0));
  const initials = getInitials(displayName);
  const validPhoto = hasValidPhoto(user?.profile_photo);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  return (
    <>
      {/* Desktop Header */}
      <header className="home-feed-header desktop-header-only">
        <div className="home-header-inner-container">
          {/* 1. Far Left: G9Expert Logo */}
          <Link className="home-feed-logo" to="/user" aria-label="G9Expert home">
            <img src={logo} alt="G9Expert" />
          </Link>

          {/* 2. Right Side: Location Selector, Wallet Balance, Notification Bell, Profile/Login */}
          <div className="home-header-right-actions">
            <div className="home-feed-location">
              <LocationSelector onLocationSelect={onLocationSelect} />
            </div>
            {isLoggedIn ? (
              <button type="button" className="home-wallet-pill" onClick={onWalletOpen} aria-label="Open wallet">
                <Wallet size={16} className="wallet-icon" />
                <div className="wallet-info">
                  <small className="wallet-label">Wallet Balance</small>
                  <strong className="wallet-amount">₹ {walletAmount}</strong>
                </div>
                <span className="wallet-arrow">▼</span>
              </button>
            ) : null}

            <button type="button" className="home-header-icon home-header-notification" onClick={onNotificationOpen} aria-label="Open notifications">
              <Bell size={18} />
              {isLoggedIn && typeof notificationCount === "number" && notificationCount > 0 ? (
                <span className="notification-badge-dot" />
              ) : null}
            </button>

            {isLoggedIn ? (
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
          </div>
        </div>
      </header>

      {/* Mobile Header - Single Row Compact Responsive Design */}
      <header className="mobile-header-only">
        {/* Single Row: Brand, Location & Top Actions */}
        <div className="mobile-header-inner">
          {/* Left: Hamburger Menu & Logo */}
          <div className="mobile-header-left">
            <button 
              type="button" 
              className="mobile-header-icon-btn mobile-header-menu-btn" 
              onClick={onMenuOpen} 
              aria-label="Open menu" 
            >
              <Menu size={20} strokeWidth={2} color="currentColor" fill="none" className="header-outlined-icon" />
            </button>

            <Link to="/user" className="mobile-header-logo-link" aria-label="G9Expert Home">
              <img src={logo} alt="G9Expert" className="mobile-header-logo-img" />
            </Link>
          </div>

          {/* Center: Compact Location Selector in Same Row */}
          <div className="mobile-header-location-center" onClick={onLocationSelect}>
            <div className="mobile-header-location-box">
              <MapPin size={12} className="location-pin-icon" />
              <div className="mobile-header-location-selector-wrap">
                <LocationSelector onLocationSelect={onLocationSelect} fallbackText="Indore, Madhya Pradesh" />
              </div>
              <ChevronDown size={11} className="location-caret-icon" />
            </div>
          </div>

          {/* Right: Search Toggle, Notifications, Profile / Login */}
          <div className="mobile-header-right-actions">
            {/* Search Icon / Toggle Button */}
            <button 
              type="button" 
              className={`mobile-header-icon-btn mobile-header-search-btn ${isMobileSearchOpen ? "active" : ""}`}
              onClick={() => setIsMobileSearchOpen((prev) => !prev)} 
              aria-label={isMobileSearchOpen ? "Close search" : "Open search"}
              aria-expanded={isMobileSearchOpen}
            >
              {isMobileSearchOpen ? (
                <X size={18} strokeWidth={2} color="currentColor" fill="none" className="header-outlined-icon" />
              ) : (
                <Search size={18} strokeWidth={2} color="currentColor" fill="none" className="header-outlined-icon" />
              )}
            </button>

            {/* Notification Bell Button */}
            <button 
              type="button" 
              className="mobile-header-icon-btn mobile-header-bell-btn" 
              onClick={onNotificationOpen} 
              aria-label="Open notifications"
            >
              <Bell size={18} strokeWidth={2} color="currentColor" fill="none" className="header-outlined-icon" />
              {isLoggedIn && typeof notificationCount === "number" && notificationCount > 0 ? (
                <span className="mobile-bell-badge-dot" />
              ) : null}
            </button>

            {/* Profile / Login Button */}
            {isLoggedIn ? (
              <button 
                type="button" 
                className="mobile-header-icon-btn mobile-header-profile-btn" 
                onClick={onProfileOpen} 
                aria-label="Open profile"
              >
                <div className="mobile-profile-avatar-wrapper">
                  {validPhoto ? (
                    <img src={user.profile_photo} alt={displayName} />
                  ) : (
                    <span className="mobile-profile-initials">
                      {initials}
                    </span>
                  )}
                </div>
              </button>
            ) : (
              <button 
                type="button" 
                className="mobile-header-login-btn" 
                onClick={onLogin}
                aria-label="Login"
              >
                <LogIn size={14} />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Strip: Revealed when search icon is tapped */}
        {isMobileSearchOpen && (
          <div className="mobile-header-search-strip" role="search">
            <GlobalSearchBar 
              autoFocus={true}
              placeholder="Search doctors, lawyers, CA, services..." 
            />
          </div>
        )}
      </header>

      {/* Mobile Menu Panel - This should be rendered in the parent component */}
      {/* The login/logout buttons inside the mobile menu should be handled in the parent */}
    </>
  );
});

export default HomeHeader;