import React, { useState } from "react";
import {
  Nav,
  Container,
  BrandBox,
  BrandLogo,
  BrandName,
  Menu,
  NavItem,
  IconBox,
  MobileIcon,
  MobileMenu,
  MobileItem
} from "./Navbar.styles";

import { FiMenu, FiX, FiSearch, FiShare2 } from "react-icons/fi";
import { FaWallet } from "react-icons/fa";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const handleCloseMobile = () => {
    setOpen(false);
  };

  return (
    <Nav>
      <Container>
        {/* Left Section - Logo / Brand */}
        <BrandBox to="/" onClick={handleCloseMobile}>
          <BrandLogo src={logo} alt="ExpertYard logo" />
          <BrandName>
            Expert<span>Yard</span>
          </BrandName>
        </BrandBox>

        {/* Desktop Menu */}
        <Menu>
          <NavItem to="/" end>
            Home
          </NavItem>
          <NavItem to="/wallet">Wallet</NavItem>
          <NavItem to="/profile">Profile</NavItem>
          <NavItem to="/signin">Sign In</NavItem>
        </Menu>

        {/* Desktop Icons */}
        <IconBox>
          <button type="button" aria-label="Wallet">
            <FaWallet />
          </button>
          <button type="button" aria-label="Share">
            <FiShare2 />
          </button>
          <button type="button" aria-label="Search">
            <FiSearch />
          </button>
        </IconBox>

        {/* Mobile Toggle */}
        <MobileIcon onClick={() => setOpen((prev) => !prev)}>
          {open ? <FiX size={26} /> : <FiMenu size={26} />}
        </MobileIcon>
      </Container>

      {/* Mobile Menu */}
      {open && (
        <MobileMenu>
          <MobileItem to="/" end onClick={handleCloseMobile}>
            Home
          </MobileItem>
          <MobileItem to="/wallet" onClick={handleCloseMobile}>
            Wallet
          </MobileItem>
          <MobileItem to="/profile" onClick={handleCloseMobile}>
            Profile
          </MobileItem>
          <MobileItem to="/signin" onClick={handleCloseMobile}>
            Sign In
          </MobileItem>
        </MobileMenu>
      )}
    </Nav>
  );
};

export default Navbar;
