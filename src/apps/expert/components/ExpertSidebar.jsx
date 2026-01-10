import React from "react";
import {
  SidebarWrap,
  Logo,
  NavList,
  NavItem,
  IconWrap,
  SidebarStatus,
  StatusText,
  StatusDot
} from "../styles/Sidebar.styles";

import {
  FiHome,
  FiFileText,
  FiCalendar,
  FiBarChart2,
  FiSettings
} from "react-icons/fi";

export default function ExpertSidebar() {
  return (
    <SidebarWrap>
      {/* Premium Brand */}
      <Logo onClick={() => window.location.href = "/expert/dashboard"}>
        <span>Expert</span>Yard
      </Logo>

      {/* Premium Navigation */}
      <NavList>
        <NavItem to="/expert" end>
          <IconWrap>
            <FiHome />
          </IconWrap>
          Dashboard
        </NavItem>

        <NavItem to="/expert/my-content">
          <IconWrap>
            <FiFileText />
          </IconWrap>
          My Content
        </NavItem>

        <NavItem to="/expert/calendar">
          <IconWrap>
            <FiCalendar />
          </IconWrap>
          Calendar
        </NavItem>

        <NavItem to="/expert/earnings">
          <IconWrap>
            <FiBarChart2 />
          </IconWrap>
          Earnings
        </NavItem>

        <NavItem to="/expert/settings">
          <IconWrap>
            <FiSettings />
          </IconWrap>
          Settings
        </NavItem>
      </NavList>

      {/* Status Indicator */}
      <SidebarStatus>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <StatusDot />
          <StatusText>Online & Available</StatusText>
        </div>
      </SidebarStatus>
    </SidebarWrap>
  );
}
