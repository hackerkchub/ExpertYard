import styled from "styled-components";
import { NavLink, Link } from "react-router-dom";

/* NAV MAIN */
export const Nav = styled.nav`
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  position: sticky;
  top: 0;
  z-index: 999;

  /* Modern glass effect */
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);

  /* Prevent overflow issues */
  overflow-x: hidden;
`;

/* CONTAINER */
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

/* BRAND SECTION */
export const BrandBox = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
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
    width: 36px;
    height: 36px;
  }
`;

export const BrandName = styled.h2`
  font-size: 26px;
  font-weight: 700;
  color: #020617;
  letter-spacing: 0.6px;
  white-space: nowrap;

  span {
    background: linear-gradient(135deg, #2563eb, #4f46e5);
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

/* DESKTOP MENU */
export const Menu = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;

  @media (max-width: 900px) {
    display: none;
  }
`;

export const NavItem = styled(NavLink)`
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  text-transform: uppercase;
  white-space: nowrap;
  letter-spacing: 0.08em;
  text-decoration: none;

  color: #0f172a;
  opacity: 0.8;
  padding-bottom: 4px;
  transition: color 0.2s ease, opacity 0.2s ease, transform 0.15s ease;

  &.active {
    color: #1d4ed8;
    opacity: 1;
  }

  &.active::after {
    content: "";
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, #2563eb, #4f46e5);
    border-radius: 999px;
  }

  &:hover {
    color: #1d4ed8;
    opacity: 1;
    transform: translateY(-1px);
  }
`;

/* DESKTOP ICONS */
export const IconBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 900px) {
    display: none;
  }

  button {
    border: none;
    outline: none;
    background: rgba(15, 23, 42, 0.03);
    border-radius: 999px;
    width: 36px;
    height: 36px;

    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 18px;
    cursor: pointer;
    transition: 0.2s ease;

    svg {
      color: #0f172a;
      opacity: 0.85;
      transition: 0.2s ease;
    }

    &:hover {
      background: rgba(37, 99, 235, 0.12);
      transform: translateY(-1px);

      svg {
        color: #1d4ed8;
        opacity: 1;
      }
    }

    &:active {
      transform: translateY(0);
      background: rgba(15, 23, 42, 0.06);
    }
  }
`;

/* MOBILE MENU ICON */
export const MobileIcon = styled.div`
  display: none;

  @media (max-width: 900px) {
    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;
    padding: 8px;
    border-radius: 12px;
    transition: 0.2s ease;

    &:active,
    &:hover {
      background: rgba(15, 23, 42, 0.06);
    }

    touch-action: manipulation;

    svg {
      color: #0f172a;
    }
  }
`;

/* MOBILE MENU DROPDOWN */
export const MobileMenu = styled.div`
  width: 100%;
  background: #ffffff;

  border-top: 1px solid rgba(226, 232, 240, 0.9);
  padding: 12px 20px 16px;

  display: flex;
  flex-direction: column;

  animation: dropdown 0.2s ease forwards;

  @keyframes dropdown {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0px);
    }
  }

  @media (min-width: 900px) {
    display: none;
  }
`;

export const MobileItem = styled(NavLink)`
  padding: 10px 0;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  color: #0f172a;
  opacity: 0.9;

  display: flex;
  align-items: center;
  justify-content: space-between;

  transition: 0.18s ease;

  &.active {
    color: #1d4ed8;
  }

  &:hover {
    color: #1d4ed8;
    transform: translateX(2px);
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

export const WalletBadge = styled.div`
  position: absolute;
  top: -6px;
  right: -12px;

  background: #00d4ff;
  color: white;
  padding: 2px 7px;
  font-size: 11px;
  border-radius: 10px;
  font-weight: 600;
  box-shadow: 0 0 8px rgba(0,200,255,0.5);

  @media (max-width: 480px) {
    font-size: 10px;
    right: -8px;
  }
`;
  /* SEARCH OVERLAY */
export const SearchOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(14px);
  z-index: 2000;

  display: flex;
  align-items: center;
  justify-content: center;
`;

/* SEARCH INPUT */
export const SearchBox = styled.div`
  width: 90%;
  max-width: 520px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 18px;
  padding: 14px 18px;

  display: flex;
  align-items: center;
  gap: 12px;

  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.25);

  svg {
    font-size: 20px;
    color: #2563eb;
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;

    font-size: 16px;
    color: #020617;

    &::placeholder {
      color: #64748b;
    }
  }
`;


/* SEARCH */
export const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  background: ${({ $open }) =>
    $open ? "rgba(255,255,255,0.85)" : "transparent"};

  padding: ${({ $open }) => ($open ? "6px 10px" : "0")};
  border-radius: 999px;

  transition: 0.25s ease;
  box-shadow: ${({ $open }) =>
    $open ? "0 8px 30px rgba(15,23,42,0.15)" : "none"};

  svg {
    font-size: 18px;
    cursor: pointer;
    color: #0f172a;
  }
`;

export const SearchInput = styled.input`
  width: 180px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #020617;

  &::placeholder {
    color: #64748b;
  }
`;

/* AUTH BUTTON */
export const AuthButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  border: none;
  outline: none;

  background: linear-gradient(135deg, #2563eb, #4f46e5);
  color: #ffffff;

  padding: 8px 18px;
  border-radius: 999px;

  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;

  white-space: nowrap;        /* 🔥 SINGLE LINE FIX */
  min-width: max-content;     /* 🔥 TEXT CUT FIX */

  cursor: pointer;
  transition: all 0.2s ease;

  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.25);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 28px rgba(37, 99, 235, 0.35);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 6px 14px rgba(37, 99, 235, 0.25);
  }
`;

export const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  @media (max-width: 900px) {
    display: none;
  }
`;
