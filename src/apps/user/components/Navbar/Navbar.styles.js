import styled from "styled-components";
import { Link } from "react-router-dom";

export const Nav = styled.nav`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  background: rgba(255, 255, 255, 0.98);
  border-bottom: 1px solid rgba(226, 232, 240, 0.9);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
`;

export const Container = styled.div`
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  height: 68px;
  padding: 0 clamp(14px, 3vw, 24px);

  @media (max-width: 768px) {
    height: 64px;
    padding: 0 16px;
  }

  @media (max-width: 480px) {
    height: 60px;
    gap: 0.75rem;
    padding: 0 12px;
  }
`;

export const NavbarSpacer = styled.div`
  height: 68px;

  @media (max-width: 768px) {
    height: 64px;
  }

  @media (max-width: 480px) {
    height: 60px;
  }
`;

export const BrandBox = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  cursor: pointer;
  flex-shrink: 0;

  .back-btn-mobile {
    display: none;
  }

  @media (max-width: 768px) {
    .back-btn-mobile {
      display: flex;
    }

    .hide-logo-on-mobile {
      display: none !important;
    }
  }
`;

export const BrandLogo = styled.img`
  width: 92px;
  height: auto;
  object-fit: contain;
  flex-shrink: 0;

  @media (min-width: 481px) and (max-width: 1024px) {
    width: 128px;
  }

  @media (min-width: 1025px) {
    width: 182px;
    height: 40px;
  }
`;

export const BrandName = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #000080;

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

export const DesktopNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;

  @media (max-width: 991px) {
    display: none;
  }
`;

export const NavList = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.3rem;
  border-radius: 999px;
  background: #f8fbff;
  border: 1px solid rgba(219, 229, 240, 0.9);
`;

export const NavItem = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 40px;
  padding: 0 1rem;
  border: none;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? "rgba(0, 0, 128, 0.08)" : "transparent")};
  color: ${({ $active }) => ($active ? "#000080" : "#334155")};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    font-size: 15px;
  }

  &:hover {
    color: #000080;
    background: rgba(0, 0, 128, 0.08);
  }
`;

export const RightActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  min-width: 0;
  flex-shrink: 0;
`;

export const IconBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  button,
  .wallet-btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 1px solid #dbe5f0;
    border-radius: 12px;
    background: #ffffff;
    color: #334155;
    cursor: pointer;
    transition: all 0.2s ease;

    svg {
      font-size: 18px;
    }

    &:hover {
      background: #f5f9ff;
      color: #000080;
      border-color: rgba(0, 0, 128, 0.2);
      transform: translateY(-1px);
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
    }
  }

  @media (max-width: 768px) {
    gap: 4px;

    button:not(.essential) {
      display: none;
    }

    button,
    .wallet-btn {
      width: 36px;
      height: 36px;
      border-radius: 10px;
    }
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
  padding: 2px 6px;
  border-radius: 20px;
  border: 2px solid white;
  background: #facc15;
  color: #1f2937;
  font-size: 10px;
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(250, 204, 21, 0.3);
`;

export const AuthButton = styled.button`
  border: none;
  border-radius: 12px;
  background: #000080;
  color: #ffffff;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 10px 20px rgba(0, 0, 128, 0.16);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 24px rgba(0, 0, 128, 0.22);
  }

  @media (max-width: 768px) {
    padding: 8px 14px;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 13px;
    border-radius: 10px;
  }
`;

export const MobileIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid #dbe5f0;
  border-radius: 12px;
  background: #ffffff;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f9ff;
    color: #000080;
    border-color: rgba(0, 0, 128, 0.2);
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    border-radius: 10px;
  }
`;

export const MobileMenu = styled.div`
  position: fixed;
  top: 76px;
  right: clamp(12px, 2vw, 24px);
  width: min(320px, calc(100vw - 24px));
  display: grid;
  gap: 8px;
  padding: 12px;
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 24px 44px rgba(15, 23, 42, 0.14);
  backdrop-filter: blur(18px);
  z-index: 999;

  @media (max-width: 768px) {
    top: 70px;
  }

  @media (max-width: 480px) {
    top: 64px;
    right: 12px;
    width: calc(100vw - 24px);
  }
`;

export const MobileItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 14px;
  background: #f8fafc;
  color: #334155;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  svg {
    font-size: 18px;
    color: #000080;
  }

  &:hover,
  &:active {
    background: #eef4ff;
    color: #000080;
  }
`;
