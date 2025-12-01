import styled from "styled-components";

/* NAV MAIN */
export const Nav = styled.nav`
  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid #e5e5e5;
  position: sticky;
  top: 0;
  z-index: 999;

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

  height: 75px;
  padding: 0 18px;

  @media (max-width: 480px) {
    padding: 0 14px;
    height: 68px;
  }
`;

/* BRAND SECTION */
export const BrandBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  min-width: 0; /* Prevent overflow */
`;

export const BrandLogo = styled.img`
  width: 42px;
  height: 42px;

  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
  }
`;

export const BrandName = styled.h2`
  font-size: 26px;
  font-weight: 700;
  color: #141414;
  letter-spacing: 0.5px;
  white-space: nowrap;

  span {
    color: #0077ff;
  }

  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

/* DESKTOP MENU */
export const Menu = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;

  @media (max-width: 900px) {
    display: none;
  }
`;

export const NavItem = styled.div`
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  text-transform: uppercase;
  white-space: nowrap;

  &.active::after {
    content: "";
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 100%;
    height: 2px;
    background: #0077ff;
    border-radius: 8px;
  }

  &:hover {
    color: #0077ff;
  }
`;

/* DESKTOP ICONS */
export const IconBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 20px;

  @media (max-width: 900px) {
    display: none;
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
    border-radius: 8px;
    transition: 0.2s;

    &:active {
      background: #f0f0f0;
    }

    /* Prevent tap overflow */
    touch-action: manipulation;
  }
`;

/* MOBILE MENU DROPDOWN */
export const MobileMenu = styled.div`
  width: 100%;
  background: #ffffff;

  border-top: 1px solid #e5e5e5;
  padding: 15px 24px;

  display: flex;
  flex-direction: column;

  animation: dropdown 0.25s ease forwards;

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

export const MobileItem = styled.div`
  padding: 12px 0;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;

  &:active,
  &:hover {
    color: #0077ff;
  }

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;
