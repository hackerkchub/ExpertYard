import React, { useState } from "react";
import styled from "styled-components";
import { FiMenu, FiX, FiSearch, FiShare2 } from "react-icons/fi";
import { FaWallet } from "react-icons/fa";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <Nav>
      <Container>

        {/* Left Section */}
        <BrandBox>
          <BrandLogo src={logo} alt="logo" />
          <BrandName>Expert<span>Yard</span></BrandName>
        </BrandBox>

        {/* Desktop Menu */}
        <Menu>
          <NavItem className="active">Home</NavItem>
          <NavItem>Wallet</NavItem>
          <NavItem>Profile</NavItem>
          <NavItem>Sign In</NavItem>
        </Menu>

        {/* Icons */}
        <IconBox>
          <FaWallet />
          <FiShare2 />
          <FiSearch />
        </IconBox>

        {/* Mobile Menu Toggle */}
        <MobileIcon onClick={() => setOpen(!open)}>
          {open ? <FiX size={26} /> : <FiMenu size={26} />}
        </MobileIcon>
      </Container>

      {/* Mobile Dropdown */}
      {open && (
        <MobileMenu>
          <MobileItem>Home</MobileItem>
          <MobileItem>Wallet</MobileItem>
          <MobileItem>Profile</MobileItem>
          <MobileItem>Sign In</MobileItem>
        </MobileMenu>
      )}
    </Nav>
  );
};

export default Navbar;

// ------------------------
// Styled Components
// ------------------------

const Nav = styled.nav`
  width: 100%;
  background: #ffffff;
  border-bottom: 1px solid #e5e5e5;
  position: sticky;
  top: 0;
  z-index: 999;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: auto;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 22px;
`;

const BrandBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BrandLogo = styled.img`
  width: 42px;
  height: 42px;
`;

const BrandName = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #141414;
  letter-spacing: 0.5px;

  span {
    color: #0077ff;
  }
`;

const Menu = styled.div`
  display: flex;
  align-items: center;
  gap: 35px;

  @media (max-width: 900px) {
    display: none;
  }
`;

const NavItem = styled.div`
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  text-transform: uppercase;

  &.active::after {
    content: "";
    position: absolute;
    bottom: -7px;
    left: 0;
    width: 100%;
    height: 2.2px;
    background: #0077ff;
    border-radius: 8px;
  }

  &:hover {
    color: #0077ff;
  }
`;

const IconBox = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 20px;

  @media (max-width: 900px) {
    display: none;
  }
`;

const MobileIcon = styled.div`
  display: none;

  @media (max-width: 900px) {
    display: block;
    cursor: pointer;
  }
`;

const MobileMenu = styled.div`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-top: 1px solid #e5e5e5;
  padding: 15px 25px;

  @media (min-width: 900px) {
    display: none;
  }
`;

const MobileItem = styled.div`
  padding: 12px 0;
  font-size: 16px;
  font-weight: 500;

  &:active,
  &:hover {
    color: #0077ff;
  }
`;
