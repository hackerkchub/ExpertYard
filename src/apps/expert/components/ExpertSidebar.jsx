import React, { useState, useEffect } from "react";
import {
  SidebarWrap,
  Logo,
  LogoIcon,
  NavList,
  NavItem,
  IconWrap,
  SidebarStatus,
  StatusHeader,
  StatusLabel,
  StatusText,
  StatusSubtext,
  StatusDot,
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
  FiClock,
  FiDollarSign,
  FiBell,
  FiLogOut,
  FiUser,
} from "react-icons/fi";

import { useNavigate, useLocation } from "react-router-dom";
import { socket } from "../../../shared/api/socket";
import { useExpert } from "../../../shared/context/ExpertContext";

export default function ExpertSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [onlineStatus, setOnlineStatus] = useState("online");
  const { logoutExpert } = useExpert();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

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

  const handleLogout = () => {
   try {
     // 🧠 1️⃣ socket disconnect (VERY IMPORTANT)
     if (socket?.connected) {
       socket.disconnect();
     }
 
     // 🧹 2️⃣ clear storage
     localStorage.clear();
     sessionStorage.clear();
 
     // 🧠 3️⃣ reset expert context
     logoutExpert();
 
     // 🚀 4️⃣ redirect
     navigate("/expert/register", { replace: true });
 
     // 💣 5️⃣ optional hard reload (recommended for realtime apps)
     setTimeout(() => {
       window.location.reload();
     }, 50);
 
   } catch (err) {
     console.error("Logout error:", err);
   }
 };
 

  const menuItems = [
    { path: "/expert", icon: FiHome, label: "Dashboard", exact: true },
    { path: "/expert/my-content", icon: FiFileText, label: "My Content" },
    { path: "/expert/chat-history", icon: FiMessageSquare, label: "Chat History" },
    { path: "/expert/calendar", icon: FiCalendar, label: "Calendar" },
    { path: "/expert/earnings", icon: FiBarChart2, label: "Earnings" },
    { path: "/expert/settings", icon: FiSettings, label: "Settings" },
  ];

  return (
    <>
      {/* <MenuToggle onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '✕' : '☰'}
      </MenuToggle> */}

      <SidebarWrap className={isOpen ? 'open' : ''}>
        {/* Premium Badge */}
        <PremiumBadge>PRO</PremiumBadge>

        {/* Premium Logo with Icon */}
        <Logo onClick={() => navigate("/expert")}>
         
          <div>
            <span>Expert</span>-Panel
          </div>
        </Logo>

        {/* Main Navigation */}
        <NavList>
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

        {/* Secondary Navigation */}
        <NavList>
          <NavItem to="/expert/profile">
            <IconWrap>
              <FiUser />
            </IconWrap>
            Profile
          </NavItem>

          <NavItem to="/expert/notifications">
            <IconWrap>
              <FiBell />
              {/* {notifications > 0 && (
                <NotificationBadge>{notifications}</NotificationBadge>
              )} */}
            </IconWrap>
            Notifications
          </NavItem>

          <NavItem as="div" onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <IconWrap>
              <FiLogOut />
            </IconWrap>
            Logout
          </NavItem>
        </NavList>

        {/* Enhanced Status Indicator */}
        <SidebarStatus>
          <StatusHeader>
            <StatusLabel>Status</StatusLabel>
            <StatusDot />
          </StatusHeader>
          
          <StatusText>
            {onlineStatus === 'online' ? 'Online & Available' : 'Away'}
          </StatusText>
          
          <StatusSubtext>
            <FiClock />
            Ready to accept chats
          </StatusSubtext>

          {/* Quick Stats */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Today</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0' }}>
                <FiDollarSign style={{ display: 'inline', marginRight: 2 }} />
                2.4k
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Sessions</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0' }}>12</div>
            </div>
          </div>
        </SidebarStatus>
      </SidebarWrap>
    </>
  );
}