import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const SidebarWrap = styled.aside`
  width: 280px;
  min-width: 280px;
  height: calc(100vh - 70px);
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(25px) saturate(180%);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  padding: 32px 20px;
  position: fixed;
  top: 70px;
  left: 0;
  z-index: 1200;
  box-shadow: 
    4px 0 24px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  overflow: hidden;

  /* Premium Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(14, 165, 255, 0.4), rgba(59, 130, 246, 0.4));
    border-radius: 3px;
  }

  /* DESKTOP ONLY */
  @media (max-width: 1024px) {
    display: none;
  }
`;

export const Logo = styled.div`
  font-size: 24px;
  font-weight: 800;
  color: #f1f5f9;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 36px;
  padding: 16px 20px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(14, 165, 255, 0.1), rgba(59, 130, 246, 0.1));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(14, 165, 255, 0.2);
  letter-spacing: -0.02em;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    background: linear-gradient(135deg, rgba(14, 165, 255, 0.2), rgba(59, 130, 246, 0.2));
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(14, 165, 255, 0.25);
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.6s;
  }

  &:hover:before {
    left: 100%;
  }

  span {
    background: linear-gradient(135deg, #0ea5ff, #38bdf8, #60a5fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

export const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  padding-right: 8px;
  overflow-y: auto;
`;

export const NavItem = styled(NavLink)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 600;
  color: #94a3b8;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: -0.01em;
  overflow: hidden;

  /* Ripple Effect */
  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translate(-50%, -50%);
  }

  /* Hover */
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: #e2e8f0;
    transform: translateX(4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    padding-left: 24px;
  }

  &:hover:before {
    width: 300px;
    height: 300px;
  }

  /* ACTIVE STATE - Premium Glow */
  &.active {
    color: #ffffff;
    background: linear-gradient(135deg, rgba(14, 165, 255, 0.2), rgba(59, 130, 246, 0.2));
    box-shadow: 
      0 8px 32px rgba(14, 165, 255, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(14, 165, 255, 0.4);

    /* Active Indicator Bar */
    &:after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(180deg, #0ea5ff, #38bdf8);
      border-radius: 2px 0 0 2px;
      box-shadow: 0 0 20px rgba(14, 165, 255, 0.5);
    }
  }

  /* Active Hover */
  &.active:hover {
    transform: translateX(4px) scale(1.02);
    box-shadow: 
      0 12px 40px rgba(14, 165, 255, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
`;

export const IconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  svg {
    font-size: 20px;
    color: #94a3b8;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Hover Animation */
  ${NavItem}:hover & {
    background: rgba(14, 165, 255, 0.15);
    border-color: rgba(14, 165, 255, 0.3);
    transform: scale(1.05) rotate(5deg);

    svg {
      color: #0ea5ff;
    }
  }

  /* Active State */
  ${NavItem}.active & {
    background: linear-gradient(135deg, rgba(14, 165, 255, 0.25), rgba(59, 130, 246, 0.25));
    border-color: rgba(14, 165, 255, 0.5);
    box-shadow: 0 4px 16px rgba(14, 165, 255, 0.3);

    svg {
      color: #ffffff;
    }
  }
`;

/* Status Indicator */
export const SidebarStatus = styled.div`
  position: absolute;
  bottom: 32px;
  left: 20px;
  right: 20px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
`;

export const StatusText = styled.div`
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
`;

export const StatusDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #34d399);
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
  margin-right: 8px;
  display: inline-block;
`;
