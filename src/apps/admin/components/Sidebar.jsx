import React, { useState, useRef, useEffect } from "react";
import {
  FiHome,
  FiLayers,
  FiGrid,
  FiUsers,
  FiCheckCircle,
  FiMenu,
  FiDollarSign,
  FiLogOut,
  FiSettings,
  FiHelpCircle,
} from "react-icons/fi";
import { MdPendingActions } from "react-icons/md";
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
} from "../styles/Sidebar.styles";

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState({
    pendingApprovals: 3,
    pendingPayouts: 5,
  });
  const ref = useRef();

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

  const menuItems = [
    {
      section: "Main",
      items: [
        { path: "/admin/dashboard", icon: FiHome, label: "Dashboard" },
        { path: "/admin/category-management", icon: FiLayers, label: "Categories" },
        { path: "/admin/sub-category-management", icon: FiGrid, label: "Sub-Categories" },
      ]
    },
    {
      section: "Experts",
      items: [
        { 
          path: "/admin/expert-management", 
          icon: FiUsers, 
          label: "All Experts",
          badge: null 
        },
        { 
          path: "/admin/expert-approval", 
          icon: FiCheckCircle, 
          label: "Approvals",
          badge: notifications.pendingApprovals 
        },
      ]
    },
    {
      section: "Finance",
      items: [
        { 
          path: "/admin/payout-management", 
          icon: FiDollarSign, 
          label: "Payouts",
          badge: notifications.pendingPayouts 
        },
      ]
    },
    {
      section: "System",
      items: [
        { path: "/admin/settings", icon: FiSettings, label: "Settings" },
        { path: "/admin/help", icon: FiHelpCircle, label: "Help" },
      ]
    }
  ];

  const handleLogout = () => {
    // Add logout logic here
    console.log("Logging out...");
  };

  return (
    <>
      <MobileToggle onClick={() => setMobileOpen(!mobileOpen)}>
        <FiMenu />
      </MobileToggle>

      <Side ref={ref} collapsed={collapsed} mobileOpen={mobileOpen}>
        {/* Logo Section */}
        <Logo collapsed={collapsed}>
          <LogoIcon>AD</LogoIcon>
          <LogoText collapsed={collapsed}>
            Admin<span>Panel</span>
          </LogoText>
        </Logo>

        {/* Collapse Button */}
        <CollapseBtn 
          collapsed={collapsed} 
          onClick={() => setCollapsed((c) => !c)}
        >
          <FiMenu />
        </CollapseBtn>

        {/* Navigation Menu */}
        <Menu>
          {menuItems.map((section, idx) => (
            <React.Fragment key={idx}>
              <SectionTitle collapsed={collapsed}>
                {collapsed ? "•••" : section.section}
              </SectionTitle>
              
              {section.items.map((item, itemIdx) => (
                <MenuItem
                  key={itemIdx}
                  to={item.path}
                  collapsed={collapsed}
                  className={({ isActive }) => isActive ? "active" : ""}
                  onClick={handleCloseMobile}
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

        {/* User Info Section */}
        <UserInfo collapsed={collapsed}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: collapsed ? '0' : '12px',
            flexDirection: collapsed ? 'column' : 'row'
          }}>
            <UserAvatar collapsed={collapsed}>
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
                  fontSize: '18px'
                }}
                onClick={handleLogout}
              />
            )}
          </div>

          {collapsed && (
            <FiLogOut 
              style={{ 
                marginTop: '16px',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '18px'
              }}
              onClick={handleLogout}
            />
          )}
        </UserInfo>
      </Side>

      <Overlay show={mobileOpen} onClick={handleCloseMobile} />
    </>
  );
}