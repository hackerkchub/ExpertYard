import React, { useState } from "react";
import {
  Nav,
  Container,
  BrandBox,
  BrandLogo,
  BrandName,
  IconBox,
  MobileIcon,
  MobileMenu,
  MobileItem,
  WalletBadge,
  SearchWrap,
  SearchInput,
  AuthButton,
  RightActions
} from "./Navbar.styles";

import {
  FiMenu,
  FiX,
  FiSearch,
  FiShare2,
  FiHome
} from "react-icons/fi";

import { FaWallet } from "react-icons/fa";
import { useWallet } from "../../../../shared/context/WalletContext";
import { useNavigate } from "react-router-dom";
import logo from "../../../../assets/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { balance, isLogged, logout } = useWallet();
  const navigate = useNavigate();

  return (
    <Nav>
      <Container>
        {/* LOGO */}
        <BrandBox to="/">
          <BrandLogo src={logo} />
          <BrandName>
            Expert<span>Yard</span>
          </BrandName>
        </BrandBox>

        {/* DESKTOP RIGHT */}
        <RightActions>
          {/* ICONS */}
          <IconBox>
            <button onClick={() => navigate("/")}>
              <FiHome />
            </button>

            <button onClick={() => navigate("/user/wallet")}>
              <FaWallet />
              {isLogged && (
                <WalletBadge>₹{balance.toFixed(0)}</WalletBadge>
              )}
            </button>

            <button>
              <FiShare2 />
            </button>

            {/* SEARCH */}
            <SearchWrap $open={searchOpen}>
              <FiSearch onClick={() => setSearchOpen((v) => !v)} />
              {searchOpen && (
                <SearchInput
                  autoFocus
                  placeholder="Search experts, skills..."
                />
              )}
            </SearchWrap>
          </IconBox>

          {/* AUTH BUTTON */}
          {!isLogged ? (
            <AuthButton onClick={() => navigate("/user/auth")}>
              Sign In/Up
            </AuthButton>
          ) : (
            <AuthButton onClick={logout}>
              Sign Out
            </AuthButton>
          )}
        </RightActions>

        {/* MOBILE ICON */}
        <MobileIcon onClick={() => setOpen(!open)}>
          {open ? <FiX size={26} /> : <FiMenu size={26} />}
        </MobileIcon>
      </Container>

      {/* MOBILE MENU */}
      {open && (
        <MobileMenu>
          <MobileItem to="/" onClick={() => setOpen(false)}>Home</MobileItem>
          <MobileItem to="/user/wallet" onClick={() => setOpen(false)}>Wallet</MobileItem>

          {!isLogged ? (
            <MobileItem to="/user/auth" onClick={() => setOpen(false)}>
              Sign In/Up
            </MobileItem>
          ) : (
            <MobileItem
              as="button"
              onClick={() => {
                logout();
                setOpen(false);
              }}
            >
              Sign Out
            </MobileItem>
          )}
        </MobileMenu>
      )}
    </Nav>
  );
};

export default Navbar;
