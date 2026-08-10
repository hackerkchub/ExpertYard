import React, { useState, useEffect } from "react";
import {
  SidebarWrap,
  Logo,
  LogoIcon,
  NavList,
  NavItem,
  IconWrap,
  Divider,
  PremiumBadge,
  NotificationBadge,
  MenuToggle,
} from "../styles/Sidebar.styles";

import {
  FiHome,
  FiFileText,
  FiCalendar,
  FiBarChart2,
  FiSettings,
  FiMessageSquare,
  FiUsers,
  FiClock,
  FiDollarSign,
  FiBell,
  FiLogOut,
  FiUser,
  FiVideo,
  FiMail,
  FiPlusCircle,
  FiZap,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import { disconnectSocket } from "../../../shared/api/socket";
import { useExpert } from "../../../shared/context/ExpertContext";

export default function ExpertSidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { logoutExpert } = useExpert();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      // 🔌 socket disconnect
      disconnectSocket();

      // ✅ optional UI memory (allowed)
      localStorage.setItem("last_panel", "expert");

      // 🔥 MAIN LOGIC → context handle karega
      await logoutExpert();

      // ✅ redirect
      navigate("/expert/register", { replace: true });

    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const menuItems = [
    { path: "/expert", icon: FiHome, label: "Dashboard", exact: true },
    { path: "/expert/g9-plan", icon: FiZap, label: "G9 Plan" },
    { path: "/expert/services/activation", icon: FiFileText, label: "Available Services" },
    { path: "/expert/myservices", icon: FiFileText, label: "My Services" },
    { path: "/expert/services/custom-requests", icon: FiPlusCircle, label: "Custom Service Request" },
    { path: "/expert/mybookings", icon: FiCalendar, label: "Bookings" },
    { path: "/expert/earnings", icon: FiBarChart2, label: "Earnings" },
    { path: "/expert/leads", icon: FiUsers, label: "Leads" },
    { path: "/expert/inquiries", icon: FiMail, label: "Inquiries" },
    { path: "/expert/reels", icon: FiVideo, label: "Manage Reels" },
    { path: "/expert/my-content", icon: FiFileText, label: "My Content" },
  ];

  return (
    <>
      <SidebarWrap className={isOpen ? 'open' : ''}>
        {/* Premium Badge */}
        <PremiumBadge>PRO</PremiumBadge>

        {/* Premium Logo with Icon */}
        <Logo onClick={() => navigate("/expert")}>
          <div>
            <span>Expert</span>-Panel
          </div>
        </Logo>

        {/* Main Navigation - Scrollable */}
        <NavList className="main-menu">
          {menuItems.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <IconWrap>
                <item.icon />
                {item.badge && (
                  <NotificationBadge>{item.badge}</NotificationBadge>
                )}
              </IconWrap>
              {item.label}
            </NavItem>
          ))}
        </NavList>

        <Divider />

        {/* Bottom Navigation - Fixed at bottom */}
        <NavList className="bottom-menu">
          <NavItem to="/expert/profile">
            <IconWrap>
              <FiUser />
            </IconWrap>
            Profile
          </NavItem>

          <NavItem as="div" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <IconWrap>
              <FiLogOut />
            </IconWrap>
            Logout
          </NavItem>
        </NavList>
        
      </SidebarWrap>
    </>
  );
}