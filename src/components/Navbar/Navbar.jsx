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

  return (
    <Nav>
      <Container>

        {/* Left Section */}
        <BrandBox>
          <BrandLogo src={logo} alt="logo" />
          <BrandName>
            Expert<span>Yard</span>
          </BrandName>
        </BrandBox>

        {/* Desktop Menu */}
        <Menu>
          <NavItem className="active">Home</NavItem>
          <NavItem>Wallet</NavItem>
          <NavItem>Profile</NavItem>
          <NavItem>Sign In</NavItem>
        </Menu>

        {/* Desktop Icons */}
        <IconBox>
          <FaWallet />
          <FiShare2 />
          <FiSearch />
        </IconBox>

        {/* Mobile Toggle */}
        <MobileIcon onClick={() => setOpen(!open)}>
          {open ? <FiX size={26} /> : <FiMenu size={26} />}
        </MobileIcon>
      </Container>

      {/* Mobile Menu */}
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
