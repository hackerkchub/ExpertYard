import styled, { keyframes, css } from "styled-components";
import { NavLink } from "react-router-dom";

/* Animations */
const slideIn = keyframes`
  from {
    transform: translateX(-20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const glowPulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(14, 165, 255, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(14, 165, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(14, 165, 255, 0); }
`;

/* Main Sidebar */
export const Side = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${props => props.collapsed ? '80px' : '280px'};
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1200;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  overflow-x: hidden;

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(14, 165, 255, 0.3);
    border-radius: 4px;
    
    &:hover {
      background: rgba(14, 165, 255, 0.5);
    }
  }

  /* Mobile Styles */
  @media (max-width: 768px) {
    width: ${props => props.collapsed ? '80px' : '260px'};
    transform: ${props => props.mobileOpen ? 'translateX(0)' : 'translateX(-100%)'};
    box-shadow: ${props => props.mobileOpen ? '4px 0 30px rgba(0, 0, 0, 0.3)' : 'none'};
  }

  /* Desktop hover effect */
  &:hover {
    box-shadow: 4px 0 30px rgba(14, 165, 255, 0.1);
  }
`;

/* Logo Area */
export const Logo = styled.div`
  padding: 24px 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  ${props => props.collapsed && css`
    padding: 24px 16px;
    justify-content: center;
  `}
`;

export const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0ea5ff, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  color: white;
  box-shadow: 0 8px 16px rgba(14, 165, 255, 0.3);
  transition: all 0.3s ease;

  ${Logo}:hover & {
    transform: rotate(5deg) scale(1.05);
    box-shadow: 0 12px 24px rgba(14, 165, 255, 0.4);
  }
`;

export const LogoText = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #f1f5f9;
  white-space: nowrap;
  transition: all 0.3s ease;

  span {
    background: linear-gradient(135deg, #0ea5ff, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  ${props => props.collapsed && css`
    display: none;
  `}
`;

/* Collapse Button */
export const CollapseBtn = styled.button`
  position: absolute;
  top: 24px;
  right: -12px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ea5ff, #3b82f6);
  border: 2px solid #1e293b;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(14, 165, 255, 0.3);

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(14, 165, 255, 0.4);
  }

  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
  }

  ${props => props.collapsed && css`
    svg {
      transform: rotate(180deg);
    }
  `}

  @media (max-width: 768px) {
    display: none;
  }
`;

/* Navigation Menu */
export const Menu = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 16px 12px;
  gap: 4px;
`;

/* Section Title */
export const SectionTitle = styled.div`
  padding: 16px 16px 8px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
  white-space: nowrap;
  transition: all 0.3s ease;

  ${props => props.collapsed && css`
    text-align: center;
    padding: 16px 0 8px;
    font-size: 10px;

    span {
      display: none;
    }
  `}

  svg {
    display: none;
  }

  ${props => props.collapsed && css`
    svg {
      display: inline-block;
      width: 16px;
      height: 16px;
    }
  `}
`;

/* Menu Item */
export const MenuItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  border-radius: 12px;
  color: #94a3b8;
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: ${slideIn} 0.5s ease backwards;

  /* Stagger animation */
  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.15s; }
  &:nth-child(3) { animation-delay: 0.2s; }
  &:nth-child(4) { animation-delay: 0.25s; }
  &:nth-child(5) { animation-delay: 0.3s; }
  &:nth-child(6) { animation-delay: 0.35s; }
  &:nth-child(7) { animation-delay: 0.4s; }

  /* Ripple effect */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #f1f5f9;
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    &::before {
      width: 300px;
      height: 300px;
    }
  }

  /* Active State */
  &.active {
    background: linear-gradient(90deg, rgba(14, 165, 255, 0.15), rgba(59, 130, 246, 0.05));
    color: #0ea5ff;
    border-left: 3px solid #0ea5ff;

    svg {
      color: #0ea5ff;
    }
  }

  /* Collapsed State */
  ${props => props.collapsed && css`
    padding: 14px 0;
    justify-content: center;

    span {
      display: none;
    }

    svg {
      width: 20px;
      height: 20px;
    }

    &:hover {
      transform: scale(1.1);
      background: rgba(14, 165, 255, 0.1);
    }
  `}

  /* Icon */
  svg {
    width: 18px;
    height: 18px;
    transition: all 0.3s ease;
    color: #64748b;
  }

  /* Label */
  span {
    white-space: nowrap;
    transition: all 0.3s ease;
  }

  /* Notification Badge */
  .badge {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 10px;
    background: #ef4444;
    color: white;
    font-size: 11px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);

    ${props => props.collapsed && css`
      right: 4px;
      top: 4px;
      min-width: 16px;
      height: 16px;
      font-size: 9px;
    `}
  }
`;

/* Mobile Overlay */
export const Overlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1100;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    display: ${props => props.show ? 'block' : 'none'};
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

/* Mobile Toggle Button */
export const MobileToggle = styled.button`
  display: none;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1300;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #0ea5ff, #3b82f6);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(14, 165, 255, 0.3);
  transition: all 0.3s ease;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    display: flex;
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 28px rgba(14, 165, 255, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }
`;

/* User Info (Bottom) */
export const UserInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);

  ${props => props.collapsed && css`
    padding: 20px 0;
    text-align: center;
  `}
`;

export const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #10b981, #34d399);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;

  ${props => props.collapsed && css`
    margin: 0 auto;
  `}
`;

export const UserName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #f1f5f9;
  white-space: nowrap;

  ${props => props.collapsed && css`
    display: none;
  `}
`;

export const UserRole = styled.div`
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;

  ${props => props.collapsed && css`
    display: none;
  `}
`;

export const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;