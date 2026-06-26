import React from "react";
import { Link } from "react-router-dom";
import { Menu, UserRound } from "lucide-react";

import logo from "../../../../../assets/logo.webp";
import { LocationSelector } from "../../../../../shared/components";

const HomeHeader = React.memo(function HomeHeader({ onMenuOpen, onProfileOpen, onLocationSelect }) {
  return (
    <header className="home-feed-header">
      <button type="button" className="home-icon-button" onClick={onMenuOpen} aria-label="Open menu">
        <Menu size={22} />
      </button>

      <Link className="home-feed-logo" to="/user" aria-label="G9Expert home">
        <img src={logo} alt="G9Expert" />
      </Link>

      <div className="home-feed-location">
        <LocationSelector onLocationSelect={onLocationSelect} />
      </div>

      <button type="button" className="home-icon-button" onClick={onProfileOpen} aria-label="Open profile">
        <UserRound size={21} />
      </button>
    </header>
  );
});

export default HomeHeader;
