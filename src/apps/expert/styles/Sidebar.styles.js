import styled, { keyframes, css } from "styled-components";
import { NavLink } from "react-router-dom";

/* Animations */
const glowPulse = keyframes`
  0% { box-shadow: 0 0 5px rgba(14, 165, 255, 0.3); }
  50% { box-shadow: 0 0 20px rgba(14, 165, 255, 0.5); }
  100% { box-shadow: 0 0 5px rgba(14, 165, 255, 0.3); }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

/* Main Container */
export const SidebarWrap = styled.aside`
  width: 280px;
  min-width: 280px;
  height: 100vh;
  background: linear-gradient(180deg, 
    rgba(17, 25, 40, 0.98) 0%, 
    rgba(8, 15, 26, 0.98) 100%
  );
  backdrop-filter: blur(25px) saturate(180%);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  padding: 100px 20px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1200;
  box-shadow: 
    8px 0 32px rgba(0, 0, 0, 0.25),
    inset 0 1px 1px rgba(255, 255, 255, 0.06);
  overflow-y: auto;
  overflow-x: hidden;

  /* Premium Scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, 
      rgba(14, 165, 255, 0.3), 
      rgba(59, 130, 246, 0.3)
    );
    border-radius: 4px;
    
    &:hover {
      background: linear-gradient(180deg, 
        rgba(14, 165, 255, 0.5), 
        rgba(59, 130, 246, 0.5)
      );
    }
  }

  /* Desktop Only */
  @media (max-width: 1024px) {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    
    &.open {
      transform: translateX(0);
    }
  }
`;

/* Logo Section */
export const Logo = styled.div`
  font-size: 26px;
  font-weight: 800;
  color: #f1f5f9;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
  padding: 18px 20px;
  border-radius: 18px;
  background: linear-gradient(135deg, 
    rgba(14, 165, 255, 0.12), 
    rgba(59, 130, 246, 0.12)
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(14, 165, 255, 0.2);
  letter-spacing: -0.02em;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -150%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.2),
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transform: skewX(-15deg);
    transition: left 0.7s ease;
  }

  &:hover {
    background: linear-gradient(135deg, 
      rgba(14, 165, 255, 0.18), 
      rgba(59, 130, 246, 0.18)
    );
    transform: translateY(-2px) scale(1.02);
    box-shadow: 
      0 12px 32px -8px rgba(14, 165, 255, 0.3),
      inset 0 1px 1px rgba(255, 255, 255, 0.2);
    border-color: rgba(14, 165, 255, 0.4);

    &::before {
      left: 50%;
    }
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }

  span {
    background: linear-gradient(135deg, 
      #0ea5ff, 
      #38bdf8, 
      #60a5fa,
      #818cf8
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    background-size: 300% 300%;
    animation: ${shimmer} 8s ease infinite;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, 
        transparent, 
        rgba(14, 165, 255, 0.5), 
        transparent
      );
      border-radius: 2px;
    }
  }
`;

/* Logo Icon */
export const LogoIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0ea5ff, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: 700;
  box-shadow: 0 6px 16px rgba(14, 165, 255, 0.3);
  transition: all 0.3s ease;

  ${Logo}:hover & {
    transform: rotate(10deg) scale(1.1);
    box-shadow: 0 8px 20px rgba(14, 165, 255, 0.4);
  }
`;

/* Navigation List */
export const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  padding-right: 8px;
  margin-top: 8px;
`;

/* Navigation Item */
export const NavItem = styled(NavLink)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 600;
  color: #94a3b8;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: -0.01em;
  overflow: hidden;
  animation: ${slideIn} 0.5s ease backwards;

  /* Stagger animation for nav items */
  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.15s; }
  &:nth-child(3) { animation-delay: 0.2s; }
  &:nth-child(4) { animation-delay: 0.25s; }
  &:nth-child(5) { animation-delay: 0.3s; }
  &:nth-child(6) { animation-delay: 0.35s; }

  /* Background Shine Effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.05),
      rgba(255, 255, 255, 0.08),
      rgba(255, 255, 255, 0.05),
      transparent
    );
    transition: left 0.5s ease;
  }

  /* Hover State */
  &:hover {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.05),
      rgba(255, 255, 255, 0.08)
    );
    color: #e2e8f0;
    transform: translateX(6px);
    box-shadow: 
      0 8px 20px -6px rgba(0, 0, 0, 0.3),
      inset 0 1px 1px rgba(255, 255, 255, 0.1);

    &::before {
      left: 100%;
    }
  }

  /* Active State */
  &.active {
    color: #ffffff;
    background: linear-gradient(
      90deg,
      rgba(14, 165, 255, 0.15),
      rgba(59, 130, 246, 0.15)
    );
    border: 1px solid rgba(14, 165, 255, 0.3);
    box-shadow: 
      0 8px 24px -4px rgba(14, 165, 255, 0.25),
      inset 0 1px 1px rgba(255, 255, 255, 0.2);

    /* Active Indicator Bar */
    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 60%;
      background: linear-gradient(180deg, #0ea5ff, #3b82f6);
      border-radius: 0 4px 4px 0;
      box-shadow: 0 0 15px rgba(14, 165, 255, 0.5);
    }
  }

  /* Disabled State */
  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

/* Icon Wrapper */
export const IconWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  svg {
    font-size: 18px;
    color: #94a3b8;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
  }

  /* Glow Effect */
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at center,
      rgba(14, 165, 255, 0.2),
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  /* Hover Animation */
  ${NavItem}:hover & {
    background: rgba(14, 165, 255, 0.12);
    border-color: rgba(14, 165, 255, 0.3);
    transform: scale(1.05) rotate(3deg);

    &::before {
      opacity: 1;
    }

    svg {
      color: #0ea5ff;
      transform: scale(1.1);
    }
  }

  /* Active State */
  ${NavItem}.active & {
    background: linear-gradient(135deg, 
      rgba(14, 165, 255, 0.2), 
      rgba(59, 130, 246, 0.2)
    );
    border-color: rgba(14, 165, 255, 0.4);
    box-shadow: 0 4px 12px rgba(14, 165, 255, 0.2);

    svg {
      color: #ffffff;
      filter: drop-shadow(0 2px 4px rgba(14, 165, 255, 0.3));
    }
  }
`;

/* Divider */
export const Divider = styled.div`
  margin: 20px 0 16px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0.2),
    rgba(255, 255, 255, 0.1),
    transparent
  );
`;

/* Status Section */
export const SidebarStatus = styled.div`
  position: relative;
  margin-top: 20px;
  padding: 20px;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.03),
    rgba(255, 255, 255, 0.02)
  );
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(14, 165, 255, 0.2);
    box-shadow: 0 8px 20px -8px rgba(0, 0, 0, 0.3);
  }
`;

export const StatusHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const StatusLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #64748b;
`;

export const StatusDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #34d399);
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.5);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(16, 185, 129, 0.4), transparent 70%);
    animation: ${glowPulse} 2s ease infinite;
  }
`;

export const StatusText = styled.div`
  font-size: 14px;
  color: #e2e8f0;
  font-weight: 500;
  margin-bottom: 4px;
`;

export const StatusSubtext = styled.div`
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    font-size: 12px;
  }
`;

/* Premium Badge */
export const PremiumBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 4px 10px;
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  border-radius: 30px;
  font-size: 10px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  z-index: 10;
`;

/* Notification Badge */
export const NotificationBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 30px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
  border: 2px solid rgba(15, 23, 42, 0.95);
`;

/* Menu Toggle (Mobile) */
export const MenuToggle = styled.button`
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

  @media (max-width: 1024px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 28px rgba(14, 165, 255, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }
`;