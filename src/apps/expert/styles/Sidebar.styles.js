// src/apps/expert/styles/Sidebar.styles.js
import styled from "styled-components";
import { NavLink } from "react-router-dom";

/* SIDEBAR WRAPPER */

export const SidebarWrap = styled.aside`
  width: 260px;
  min-width: 260px;
  height: calc(100vh - 64px);
  backdrop-filter: blur(18px);
  background: rgba(12, 17, 22, 0.80);
  border-right: 1px solid rgba(255,255,255,0.06);
  display: flex;
  flex-direction: column;
  padding: 24px 18px;
  position: fixed;
  top: 64px;
  left: 0;
  z-index: 1100;
  transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);

  @media(max-width: 768px) {
    transform: translateX(${({ open }) => (open ? "0" : "-100%")});
    box-shadow: 4px 0 18px rgba(0,0,0,0.3);
  }
`;

/* BRAND TOP */

export const Logo = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #eef4ff;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
  padding-left: 6px;
  letter-spacing: 0.4px;
  font-family: 'Inter', sans-serif;

  span {
    background: linear-gradient(90deg, #0ea5ff, #38bdf8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

/* SCROLLABLE NAV */

export const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
  padding-right: 4px;
`;

/* NAV ITEM */

export const NavItem = styled(NavLink)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 12px 14px 12px 16px;
  border-radius: 10px;
  font-size: 15px;
  color: #d7dde9;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  transition: 0.25s ease;

  /* Hover */
  &:hover {
    background: rgba(255,255,255,0.04);
    color: white;
  }

  /* ACTIVE STATE */
  &.active {
    color: #f8fafc;
    background: rgba(3, 105, 161, 0.28);
    box-shadow: inset 0 0 22px rgba(14, 165, 233, 0.16);
  }

  /* Accent Bar */
  &.active::before {
    content: "";
    position: absolute;
    left: -8px;
    top: 10px;
    width: 4px;
    height: 22px;
    border-radius: 10px;
    background: linear-gradient(180deg, #0ea5ff, #38bdf8);
  }
`;

/* ICON */

export const IconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  transition: 0.22s ease;

  svg {
    font-size: 19px;
    color: #cbd5e1;
    transition: 0.22s ease;
  }

  /* Change icon color when active */
  ${NavItem}.active & svg {
    color: #0ea5ff;
  }
`;
