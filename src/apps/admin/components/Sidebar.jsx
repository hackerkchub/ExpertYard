import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FiHome,
  FiLayers,
  FiGrid,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiCheckCircle,
  FiMenu,
  FiDollarSign,
  FiLogOut,
  FiCreditCard,
  FiBarChart2,
  FiImage,
  FiArchive,
  FiBell,
  FiFileText,
  FiFilm,
  FiList,
  FiGitCommit,
  FiTag,
  FiCopy,
  FiActivity,
  FiPieChart,
  FiCpu,
  FiShield,
  FiSend,
} from "react-icons/fi";
import {
  Side,
  Overlay,
  CollapseBtn,
  Menu,
  MenuItem,
  SectionTitle,
  Logo,
  LogoIcon,
  LogoText,
  MobileToggle,
  UserInfo,
  UserAvatar,
  UserDetails,
  UserName,
  UserRole,
  ScrollableArea,
  BottomFixedArea,
} from "../styles/Sidebar.styles";

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState({
    pendingApprovals: 3,
    pendingPayouts: 5,
  });
  const ref = useRef();
  const location = useLocation();

  const handleCloseMobile = () => setMobileOpen(false);

  useEffect(() => {
    function close(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        handleCloseMobile();
      }
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileOpen, setMobileOpen]);

  const isPathActive = (itemPath) => {
    const currentPath = location.pathname;
    if (currentPath === itemPath) return true;
    
    // Nested route active state matching
    if (itemPath === "/admin/expert-management" && (currentPath.startsWith("/admin/expert/") || currentPath === "/admin/expert-management")) return true;
    if (itemPath === "/admin/master-services/list" && currentPath.startsWith("/admin/master-services/")) return true;
    if (itemPath === "/admin/form-builder" && currentPath.startsWith("/admin/form-builder")) return true;
    if (itemPath === "/admin/workflow-builder" && currentPath.startsWith("/admin/workflow-builder")) return true;
    if (itemPath === "/admin/document-builder" && currentPath.startsWith("/admin/document-builder")) return true;
    if (itemPath === "/admin/pricing-rules" && currentPath.startsWith("/admin/pricing-rules")) return true;
    if (itemPath === "/admin/workspace-monitoring" && currentPath.startsWith("/admin/workspace/")) return true;
    
    return false;
  };

  const menuItems = [
    {
      section: "Main Overview & Catalog",
      items: [
        { path: "/admin/dashboard", icon: FiHome, label: "Dashboard" },
        { path: "/admin/category-management", icon: FiLayers, label: "Categories" },
        { path: "/admin/sub-category-management", icon: FiGrid, label: "Sub Categories" },
        { path: "/admin/banner", icon: FiImage, label: "Banners" },
        { path: "/admin/reels-management", icon: FiFilm, label: "Reels & Media" },
      ]
    },
    {
      section: "Expert & User Operations",
      items: [
        { path: "/admin/expert-management", icon: FiUsers, label: "Experts List" },
        { path: "/admin/subscribed-experts", icon: FiUserCheck, label: "Subscribed Experts" },
        { path: "/admin/expert-approval", icon: FiCheckCircle, label: "Expert Approvals", badge: notifications.pendingApprovals },
        { path: "/admin/deleted-experts", icon: FiUserX, label: "Deleted Experts" },
      ]
    },
    {
      section: "Master Service Engine",
      items: [
        { path: "/admin/master-services/list", icon: FiLayers, label: "All Master Services" },
        { path: "/admin/master-services", icon: FiGrid, label: "+ Create Master Service" },
        { path: "/admin/custom-service-approval", icon: FiCheckCircle, label: "Custom Service Approvals" },
        { path: "/admin/form-builder", icon: FiList, label: "Dynamic Form Builder" },
        { path: "/admin/workflow-builder", icon: FiGitCommit, label: "Workflow Builder" },
        { path: "/admin/document-builder", icon: FiArchive, label: "Document Builder" },
        { path: "/admin/pricing-rules", icon: FiTag, label: "Pricing Rules" },
        { path: "/admin/service-templates", icon: FiCopy, label: "Service Templates" },
      ]
    },
    {
      section: "Live Workspaces & Analytics",
      items: [
        { path: "/admin/workspace-monitoring", icon: FiActivity, label: "Workspace Monitoring" },
        { path: "/admin/service-analytics", icon: FiPieChart, label: "Service Analytics" },
        { path: "/admin/ai-analytics", icon: FiCpu, label: "AI Discovery Analytics" },
      ]
    },
    {
      section: "Finance & Subscriptions",
      items: [
        { path: "/admin/finance", icon: FiDollarSign, label: "Finance & Earnings" },
        { path: "/admin/payout-management", icon: FiCreditCard, label: "Payout Requests", badge: notifications.pendingPayouts },
        { path: "/admin/membership-plan", icon: FiShield, label: "Membership & Plans" },
      ]
    },
    {
      section: "Notifications & Legal",
      items: [
        { path: "/admin/notifications/users", icon: FiBell, label: "User Notifications" },
        { path: "/admin/notifications/experts", icon: FiSend, label: "Expert Notifications" },
        { path: "/admin/legal-management", icon: FiFileText, label: "Legal Management" },
      ]
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <>
      <MobileToggle onClick={() => setMobileOpen(!mobileOpen)}>
        <FiMenu />
      </MobileToggle>

      <Side ref={ref} $collapsed={collapsed} $mobileOpen={mobileOpen}>
        {/* Logo Section */}
        <Logo $collapsed={collapsed}>
          <LogoIcon>AD</LogoIcon>
          <LogoText $collapsed={collapsed}>
            Admin<span>Panel</span>
          </LogoText>
        </Logo>

        {/* Collapse Button */}
        <CollapseBtn 
          $collapsed={collapsed} 
          onClick={() => setCollapsed((c) => !c)}
        >
          <FiMenu />
        </CollapseBtn>

        {/* Scrollable Navigation Area */}
        <ScrollableArea $collapsed={collapsed}>
          <Menu>
            {menuItems.map((section, idx) => (
              <React.Fragment key={idx}>
                <SectionTitle $collapsed={collapsed}>
                  {collapsed ? "•••" : section.section}
                </SectionTitle>
                
                {section.items.map((item, itemIdx) => (
                  <MenuItem
                    key={itemIdx}
                    to={item.path}
                    $collapsed={collapsed}
                    className={({ isActive }) => (isActive || isPathActive(item.path)) ? "active" : ""}
                    onClick={handleCloseMobile}
                    $hasBadge={item.badge > 0}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                    {item.badge > 0 && (
                      <span className="badge">{item.badge}</span>
                    )}
                  </MenuItem>
                ))}
              </React.Fragment>
            ))}
          </Menu>
        </ScrollableArea>

        {/* Fixed Bottom Area with User Info and Logout */}
        <BottomFixedArea $collapsed={collapsed}>
          <UserInfo $collapsed={collapsed}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: collapsed ? '0' : '12px',
              flexDirection: collapsed ? 'column' : 'row',
              width: '100%'
            }}>
              <UserAvatar $collapsed={collapsed}>
                A
              </UserAvatar>
              
              {!collapsed && (
                <UserDetails>
                  <UserName>Admin User</UserName>
                  <UserRole>Super Admin</UserRole>
                </UserDetails>
              )}

              {!collapsed && (
                <FiLogOut 
                  style={{ 
                    marginLeft: 'auto', 
                    color: '#64748b',
                    cursor: 'pointer',
                    fontSize: '18px',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={handleLogout}
                  className="logout-icon"
                />
              )}
            </div>

            {collapsed && (
              <FiLogOut 
                style={{ 
                  marginTop: '16px',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: '18px',
                  transition: 'all 0.3s ease',
                }}
                onClick={handleLogout}
                className="logout-icon"
              />
            )}
          </UserInfo>
        </BottomFixedArea>
      </Side>

      <Overlay show={mobileOpen} onClick={handleCloseMobile} />
    </>
  );
}
