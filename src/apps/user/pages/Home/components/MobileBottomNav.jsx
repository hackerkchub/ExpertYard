import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Users, Film, Wallet, User } from "lucide-react";
import "./MobileBottomNav.css";

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [visible, setVisible] = useState(false); // Default hidden until scroll/interaction
  const lastScrollY = useRef(0);
  const hideTimeoutRef = useRef(null);

  const resetHideTimer = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setVisible(false);
    }, 3200); // Auto-hide after 3.2s of inactivity
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check if user is approaching bottom (footer)
      const nearFooter = windowHeight + currentScrollY >= documentHeight - 180;

      if (nearFooter) {
        setVisible(false);
        return;
      }

      // Show on scroll up or significant interaction
      if (currentScrollY < lastScrollY.current - 5 && currentScrollY > 100) {
        setVisible(true);
        resetHideTimer();
      } else if (currentScrollY > lastScrollY.current + 15) {
        // Hide on active scroll down
        setVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    const handleTouchStart = () => {
      // Show when user touches screen
      if (window.scrollY > 80) {
        setVisible(true);
        resetHideTimer();
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const navItems = [
    { label: "Home", path: "/user", icon: Home, exact: true },
    { label: "Experts", path: "/user/call-chat?page=1", icon: Users },
    { label: "Reels", path: "/user/reels", icon: Film },
    { label: "Wallet", path: "/user/wallet", icon: Wallet },
    { label: "Profile", path: "/user/user-profile", icon: User },
  ];

  const checkActive = (item) => {
    if (item.exact) {
      return location.pathname === "/user" || location.pathname === "/user/";
    }
    return location.pathname.startsWith(item.path.split("?")[0]);
  };

  return (
    <nav
      className={`g9-mobile-bottom-nav ${visible ? "is-visible" : "is-hidden"}`}
      aria-label="Mobile bottom navigation"
    >
      <div className="mobile-bottom-nav-inner">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = checkActive(item);
          return (
            <button
              type="button"
              key={item.label}
              className={`mobile-bottom-nav-item ${isActive ? "active" : ""}`}
              onClick={() => {
                navigate(item.path);
                resetHideTimer();
              }}
            >
              <Icon size={20} className="nav-item-icon" />
              <span className="nav-item-label">{item.label}</span>
              {isActive && <span className="active-dot-indicator" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
