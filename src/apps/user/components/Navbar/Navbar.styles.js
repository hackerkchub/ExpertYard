import styled from "styled-components";
import { Link } from "react-router-dom";

export const Nav = styled.nav`
  width: 100%;
  background: rgba(255, 255, 255, 0.98);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  position: fixed; 
  top: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);
`;

export const Container = styled.div`
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 76px;
  padding: 0 clamp(14px, 3vw, 24px);
  
  @media (max-width: 768px) { height: 70px; padding: 0 16px; }
  @media (max-width: 480px) { height: 66px; padding: 0 12px; }
`;

export const NavbarSpacer = styled.div`
  height: 80px;
  @media (max-width: 768px) { height: 70px; }
  @media (max-width: 480px) { height: 66px; }
`;

export const BrandLogo = styled.img`
   /* Mobile (up to 480px) – suitable for navbar */
  width: 100px;          /* Adjust this value as needed */
  height: auto;          /* Maintains original aspect ratio */
  object-fit: contain;   /* No cropping, whole logo visible */
  flex-shrink: 0;
  transition: all 0.2s ease;

  /* Tablet (481px – 1024px) */
  @media (min-width: 481px) and (max-width: 1024px) {
    width: 150px;        /* Slightly bigger than mobile */
    height: auto;
  }

  /* Desktop (1025px and above) – your original working size */
  @media (min-width: 1025px) {
    width: 280px;
    height: 48px;        /* Keep your fixed height for desktop if needed */
    object-fit: cover;   /* Or contain – whichever looks better */
  }
`;

export const BrandName = styled.h2`
  font-size: 24px;
  font-weight: 800;
  background:#000080;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  span { color: #3b82f6; -webkit-text-fill-color: #3b82f6; }
  @media (max-width: 480px) { font-size: 20px; }
`;

export const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

export const IconBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  button, .wallet-btn {
    border: none;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    color: #475569;

    svg { font-size: 20px; }
    &:hover { 
      background: #eff6ff;
      color: #000080;
      transform: translateY(-2px);
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
    }
  }

  /* Desktop par sab dikhega, mobile par icons adjust honge */
  @media (max-width: 768px) {
    gap: 4px;
    button:not(.essential) { display: none; } /* Mobile par sirf zaroori icons */
  }
`;

export const WalletIconWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const WalletBadge = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  background: #10b981;
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 20px;
  border: 2px solid white;
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
`;

export const AuthButton = styled.button`
  background: linear-gradient(135deg, #000080, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(37, 99, 235, 0.3);
  }
  @media (max-width: 480px) { padding: 8px 16px; font-size: 14px; }
`;

export const MobileIcon = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: #f8fafc;
    cursor: pointer;
    color: #475569;
  }
`;

export const MobileMenu = styled.div`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  z-index: 999;
  backdrop-filter: blur(18px);
  @media (max-width: 480px) { top: 66px; }
`;

export const MobileItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  svg { font-size: 22px; color: #3b82f6; }
  &:active { background: #eff6ff; }
`;

export const BrandBox = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  cursor: pointer;

  .back-btn-mobile {
    display: none; /* Desktop pe default hide */
  }

  @media (max-width: 768px) {
    .back-btn-mobile {
      display: flex; /* Mobile pe display flex */
    }

    /* 🆕 Logic to hide the logo inside BrandBox in Mobile View if Back Button is present */
    .hide-logo-on-mobile {
      display: none !important;
    }
  }
`;
