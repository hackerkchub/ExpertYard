// Navbar.styles.js (Updated - Permanent Sticky Navbar)
import styled from "styled-components";
import { NavLink, Link } from "react-router-dom";

export const Nav = styled.nav`
  width: 100%;
  background: rgba(255, 255, 255, 0.98); /* ✅ Slightly more opaque */
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  position: fixed; /* ✅ FIXED instead of sticky */
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999; /* ✅ Higher z-index */
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(15, 23, 42, 0.12); /* ✅ Stronger shadow */
  overflow: visible;
  /* ✅ Prevent hiding on scroll */
  will-change: transform;
  transform: translateZ(0);
`;

export const Container = styled.div`
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 76px;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    padding: 0 16px;
    height: 70px;
  }
  
  @media (max-width: 480px) {
    padding: 0 14px;
    height: 66px;
  }
`;

// ✅ Add Spacer for main content (prevents jump)
export const NavbarSpacer = styled.div`
  height: 76px;
  
  @media (max-width: 768px) {
    height: 70px;
  }
  
  @media (max-width: 480px) {
    height: 66px;
  }
`;

// ... Rest of all other styles remain EXACTLY SAME (BrandBox, BrandLogo, etc.)
export const BrandBox = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  
  &:hover {
    opacity: 0.95;
  }
`;

export const BrandLogo = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  object-fit: cover;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.15);
  
  @media (max-width: 480px) {
    width: 38px;
    height: 38px;
  }
`;

export const BrandName = styled.h2`
  font-size: 26px;
  font-weight: 800;
  background: linear-gradient(135deg, #020617 0%, #1e293b 50%, #334155 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: -0.02em;
  margin: 0;
  white-space: nowrap;
  
  span {
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
  
  @media (max-width: 480px) {
    font-size: 21px;
  }
`;

export const WalletIconWrap = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const WalletBadge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  font-size: 10px;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 12px;
  min-width: 28px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.4);
  opacity: 0;
  transform: scale(0.85) translateY(-2px);
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
  z-index: 20;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  
  ${WalletIconWrap}:hover & {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  
  @media (max-width: 480px) {
    font-size: 9px;
    min-width: 24px;
    height: 18px;
    right: -6px;
  }
`;

export const IconBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 900px) {
    gap: 8px;
  }
  
  button {
    border: none;
    outline: none;
    background: rgba(15, 23, 42, 0.04);
    border-radius: 12px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    
    svg {
      color: #475569;
      font-size: 18px;
      transition: inherit;
    }
    
    &:hover {
      background: rgba(59, 130, 246, 0.12);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
      
      svg {
        color: #3b82f6;
      }
    }
    
    &:active {
      transform: translateY(-1px);
    }
  }
  
  @media (max-width: 900px) {
    display: none;
  }
`;

export const MobileIcon = styled.div`
  display: none;
  
  @media (max-width: 900px) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover,
    &:active {
      background: rgba(15, 23, 42, 0.08);
    }
    
    svg {
      color: #475569;
      font-size: 22px;
    }
  }
`;

export const MobileMenu = styled.div`
  position: fixed; /* ✅ FIXED for mobile menu too */
  top: 76px; /* ✅ Below fixed navbar height */
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  padding: 20px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
  border-radius: 0 0 20px 20px;
  animation: slideDown 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 9998;
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (min-width: 901px) {
    display: none;
  }
  
  @media (max-width: 768px) {
    top: 70px;
  }
  
  @media (max-width: 480px) {
    top: 66px;
  }
`;

export const MobileItem = styled.button`
  width: 100%;
  padding: 14px 0;
  border: none;
  background: none;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
  border-radius: 10px;
  transition: all 0.2s ease;
  
  &:hover {
    color: #1d4ed8;
    background: rgba(59, 130, 246, 0.08);
    padding-left: 8px;
    transform: translateX(4px);
  }
  
  &:active {
    transform: translateX(2px);
  }
  
  @media (max-width: 480px) {
    font-size: 15px;
    gap: 10px;
  }
`;

export const SearchWrap = styled.div`
  position: relative;
  
  button {
    border: none;
    background: rgba(15, 23, 42, 0.04);
    border-radius: 12px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    
    svg {
      color: #6b7280;
      font-size: 18px;
    }
    
    &:hover {
      background: rgba(59, 130, 246, 0.08);
      svg {
        color: #3b82f6;
      }
    }
  }
  
  input {
    position: absolute;
    right: -220px;
    top: 50%;
    transform: translateY(-50%);
    width: 220px;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid rgba(226, 232, 240, 0.8);
    border-radius: 12px;
    padding: 10px 16px;
    font-size: 14px;
    backdrop-filter: blur(10px);
    transition: all 0.25s ease;
    opacity: 0;
    visibility: hidden;
    z-index: 10;
    
    &[data-open="true"] {
      right: 0;
      opacity: 1;
      visibility: visible;
      box-shadow: 0 10px 40px rgba(15, 23, 42, 0.15);
    }
  }
  
  @media (max-width: 480px) {
    input {
      width: 180px;
      right: -190px;
      
      &[data-open="true"] {
        right: 0;
        width: 180px;
      }
    }
  }
`;

export const SearchInput = styled.input`
  outline: none;
  color: #1e293b;
  
  &::placeholder {
    color: #9ca3af;
  }
`;

export const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 900px) {
    display: none;
  }
`;

export const AuthButton = styled.button`
  background: linear-gradient(135deg, #1f3c88 0%, #2563eb 100%);
  color: white !important;
  -webkit-text-fill-color: white !important;
  text-fill-color: white !important;
  border: none;
  padding: 12px 24px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 12px 28px rgba(31, 60, 136, 0.4);
  letter-spacing: 0.02em;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 40px rgba(31, 60, 136, 0.55);
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  }

  &:active {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(31, 60, 136, 0.4);
  }

  @media (max-width: 768px) {
    padding: 12px 20px;
    font-size: 14px;
  }

  @media (max-width: 480px) {
    padding: 11px 18px;
    font-size: 13px;
    width: 100%;
  }
`;
