import React from "react";
import { Link } from "react-router-dom";
import { Bell, Menu, SlidersHorizontal, Wallet } from "lucide-react";

import logo from "../../../../../assets/logo.webp";
import { LocationSelector } from "../../../../../shared/components";
import GlobalSearchBar from "../../../components/search/GlobalSearchBar";

const HomeHeader = React.memo(function HomeHeader({
  onMenuOpen,
  onProfileOpen,
  onLocationSelect,
  onNotificationOpen,
  onWalletOpen,
  onFilterOpen,
  balance = 0,
  user,
}) {
  const displayName = user?.first_name || user?.name || "Profile";
  const walletAmount = Math.floor(Number(balance || 0));

  return (
    <>
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
          {user?.id && <span className="notification-badge-number">3</span>}
        </button>

        <button type="button" className="home-wallet-pill" onClick={onWalletOpen} aria-label="Open wallet">
          <Wallet size={17} className="wallet-icon" />
          <div className="wallet-info">
            <small className="wallet-label">Wallet Balance</small>
            <strong className="wallet-amount">₹ {walletAmount}</strong>
          </div>
          <span className="wallet-arrow">▼</span>
        </button>

        <button type="button" className="home-profile-avatar-btn" onClick={onProfileOpen} aria-label="Open profile">
          <div className="home-profile-avatar-wrapper">
            {user?.profile_photo ? (
              <img src={user.profile_photo} alt={displayName} />
            ) : (
              <span className="home-profile-initials">
                {displayName.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <span className="profile-arrow">▼</span>
        </button>
      </header>

      <header className="mobile-header-only">
        <button type="button" className="mobile-header-menu-btn" onClick={onMenuOpen} aria-label="Open menu">
          <Menu size={24} />
        </button>

        <Link className="mobile-header-logo-link" to="/user">
          <img src={logo} alt="G9Expert" />
        </Link>

        <div className="mobile-header-location">
          <LocationSelector onLocationSelect={onLocationSelect} fallbackText="Indore, MP" />
        </div>

        <button type="button" className="mobile-header-bell-btn" onClick={onNotificationOpen} aria-label="Open notifications">
          <Bell size={22} />
          <span className="mobile-bell-badge">3</span>
        </button>
      </header>
    </>
  );
});

export default HomeHeader;
