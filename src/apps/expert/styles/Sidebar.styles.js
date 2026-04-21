import styled from "styled-components";
import { NavLink } from "react-router-dom";

/* Main Sidebar Wrapper */
export const SidebarWrap = styled.aside`
  width: 244px;
  min-width: 244px;
  height: calc(100vh - 70px);
  background: rgba(255, 255, 255, 0.96);
  border-right: 1px solid #d8e0eb;
  display: flex;
  flex-direction: column;
  padding: 18px 12px;
  position: fixed;
  top: 70px;
  left: 0;
  z-index: 1200;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
  box-shadow: 14px 0 40px rgba(15, 23, 42, 0.04);

  &::-webkit-scrollbar { width: 0px; }
  scrollbar-width: none;

  @media (max-width: 1024px) {
    transform: translateX(-100%);
    &.open { transform: translateX(0); }
  }
`;

/* Logo Section */
export const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 12px 30px;
  cursor: pointer;
  
  span {
    font-size: 22px;
    font-weight: 800;
    color: #000;
  }
`;

export const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  img { width: 100%; height: 100%; object-fit: contain; }
`;

/* Navigation */
export const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const NavItem = styled(NavLink)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 13px 14px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 500;
  color: #1f2937;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8fafc;
    color: #000080;
  }

  &.active {
    font-weight: 700;
    background: linear-gradient(135deg, rgba(63, 81, 181, 0.1), rgba(59, 130, 246, 0.08));
    color: #000080;
    &::before {
      content: '';
      position: absolute;
      left: -12px;
      height: 24px;
      width: 4px;
      background-color: #000080;
      border-radius: 0 4px 4px 0;
    }
  }
`;

export const IconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: currentColor;
`;

/* ✅ FIXED: ALL MISSING EXPORTS ADDED BELOW */

export const PremiumBadge = styled.div`
  background: #000; /* Minimal Black Badge */
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  margin-left: 8px;
  display: inline-block;
`;

export const NotificationBadge = styled.div`
  background-color: #ff3040;
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: 10px;
  margin-left: auto;
`;

export const Divider = styled.div`
  margin: 15px 0;
  height: 1px;
  background-color: #dbdbdb;
`;

/* Status Section */
export const SidebarStatus = styled.div`
  margin-top: auto;
  padding: 16px 12px;
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff, #f8fafc);
  border: 1px solid #e5e7eb;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
`;

export const StatusHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const StatusLabel = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #8e8e8e;
  text-transform: uppercase;
`;

export const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #00cf00;
  border-radius: 50%;
`;

export const StatusText = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #262626;
`;

export const StatusSubtext = styled.div`
  font-size: 12px;
  color: #8e8e8e;
  margin-top: 2px;
`;

export const MenuToggle = styled.button`
  display: none;
  @media (max-width: 1024px) {
    display: flex;
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 2000;
    background: #000080;
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 48px;
    height: 48px;
    align-items: center;
    justify-content: center;
    box-shadow: 0 14px 28px rgba(0, 0, 128, 0.22);
  }
`;
