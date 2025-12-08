import React from "react";
import {
  SidebarWrap,
  Logo,
  NavList,
  NavItem,
  IconWrap
} from "../styles/Sidebar.styles";

import {
  FiHome,
  FiFileText,
  FiCalendar,
  FiBarChart2,
  FiSettings
} from "react-icons/fi";

export default function ExpertSidebar({ mobileOpen, setMobileOpen }) {
  return (
    <SidebarWrap open={mobileOpen}>

      {/* Brand */}
      <Logo>
        <span>Expert</span>Yard
      </Logo>

      {/* Menu */}
      <NavList>
        <NavItem to="/expert" end onClick={() => setMobileOpen(false)}>
          <IconWrap><FiHome /></IconWrap>
          Dashboard
        </NavItem>

        <NavItem to="/expert/content" onClick={() => setMobileOpen(false)}>
          <IconWrap><FiFileText /></IconWrap>
          My Content
        </NavItem>

        <NavItem to="/expert/calendar" onClick={() => setMobileOpen(false)}>
          <IconWrap><FiCalendar /></IconWrap>
          Calendar
        </NavItem>

        <NavItem to="/expert/earnings" onClick={() => setMobileOpen(false)}>
          <IconWrap><FiBarChart2 /></IconWrap>
          Earnings
        </NavItem>

        <NavItem to="/expert/settings" onClick={() => setMobileOpen(false)}>
          <IconWrap><FiSettings /></IconWrap>
          Settings
        </NavItem>
      </NavList>
    </SidebarWrap>
  );
}
