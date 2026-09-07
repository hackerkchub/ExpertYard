import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";
import AskG9Modal from "./AskG9Modal";
import { shouldShowBottomNavbar } from "../../../routes/routeShells";
import "./AskG9FloatingAssistant.css";

/**
 * Clean visibility strategy for Ask G9 Floating Assistant:
 * Panel -> Route/Page -> Viewport
 *
 * Rules:
 * 1. Admin Panel (routes starting with /admin) -> NEVER render
 * 2. Expert Panel (routes starting with /expert) -> NEVER render
 * 3. User Panel Auth, Chat, Call routes -> NEVER render
 * 4. User Panel Mobile view (<= 768px): HIDE on pages with fixed bottom CTAs / actions:
 *    - Service Detail pages (/master-services/*, /services/*, /user/services/*)
 *    - Expert Profile pages (/experts/*, /user/experts/*)
 *    - Workspace / Order pages (/user/workspace/*, /user/orders/*)
 *    - Booking Wizard / Checkout pages (/user/booking/*, /user/checkout/*)
 *    - Reels / Video pages (/reels, /user/reels/*)
 * 5. Desktop User Panel -> Render where appropriate
 */
export function shouldShowAskG9(pathname = "", isMobile = false) {
  if (!pathname) return false;
  const norm = pathname.toLowerCase();

  // 1. NEVER render in Admin Panel or Expert Panel
  if (norm.startsWith("/admin") || norm.startsWith("/expert")) {
    return false;
  }

  // 2. NEVER render on Auth, Chat, or Call routes
  if (
    norm.startsWith("/user/auth") ||
    norm.startsWith("/auth") ||
    norm.includes("/voice-call") ||
    norm.includes("/video-call") ||
    norm === "/user/chat" ||
    norm.startsWith("/user/chat/")
  ) {
    return false;
  }

  // 3. User Panel Mobile-specific exclusions (pages with fixed bottom action controls/CTAs)
  if (isMobile) {
    // Service Detail pages
    if (
      norm.includes("/master-services/") ||
      norm.includes("/services/") ||
      norm.startsWith("/user/service") ||
      norm.startsWith("/user/services") ||
      norm.startsWith("/service/") ||
      norm.startsWith("/services/")
    ) {
      return false;
    }

    // Expert Profile pages
    if (
      norm.includes("/experts/") ||
      norm.startsWith("/user/experts")
    ) {
      return false;
    }

    // Call/Chat / Consultation / Expert Listing pages
    if (
      norm.startsWith("/user/call-chat") ||
      norm.startsWith("/user/call") ||
      norm.startsWith("/user/find-experts") ||
      norm === "/user/experts" ||
      norm === "/user/experts/"
    ) {
      return false;
    }

    // Workspace & Order pages
    if (
      norm.startsWith("/user/workspace") ||
      norm.startsWith("/user/orders") ||
      norm.includes("/workspace/") ||
      norm.includes("/order/")
    ) {
      return false;
    }

    // Booking Wizard & Checkout pages
    if (
      norm.startsWith("/user/booking") ||
      norm.startsWith("/user/checkout")
    ) {
      return false;
    }

    // Fullscreen Reels pages
    if (
      norm === "/user/reels" ||
      norm.startsWith("/user/reels/") ||
      norm === "/reels"
    ) {
      return false;
    }
  }

  return true;
}

export default function AskG9FloatingAssistant() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pathname = location.pathname.toLowerCase();

  // Evaluate panel, route, and viewport visibility
  if (!shouldShowAskG9(pathname, isMobile)) {
    return null;
  }

  // Determine if bottom navbar is active on this route
  const hasBottomNav = shouldShowBottomNavbar(location.pathname) && !pathname.startsWith("/expert");

  // Calculate bottom offset respecting safe area and mobile bottom navbar height
  const bottomOffset = hasBottomNav && isMobile
    ? "calc(76px + env(safe-area-inset-bottom, 0px))"
    : "calc(20px + env(safe-area-inset-bottom, 0px))";

  const handleMouseEnter = () => {
    setIsRevealed(true);
  };

  const handleMouseLeave = () => {
    setIsRevealed(false);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      {/* Floating AI Assistance Trigger Sign */}
      <div
        className={`ask-g9-assistance-trigger-zone ${isRevealed ? "is-revealed" : ""}`}
        style={{ bottom: bottomOffset }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          type="button"
          onClick={handleClick}
          aria-label="AI Assistance"
          className="ask-g9-assistance-btn"
        >
          <div className="ask-g9-assistance-icon-badge">
            <Sparkles size={14} color="#fbbf24" />
          </div>
          <span>Ask G9</span>
        </button>
      </div>

      {/* AI Assistance Modal */}
      <AskG9Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
