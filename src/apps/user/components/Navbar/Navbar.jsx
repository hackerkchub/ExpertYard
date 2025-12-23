// Updated Navbar.jsx with My Offer icon
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
  FiHome,
  FiGift  // 🎁 My Offer icon
} from "react-icons/fi";

import { FaWallet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../../../../assets/logo.png";

// ✅ CONTEXTS
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useWallet } from "../../../../shared/context/WalletContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navigate = useNavigate();

  // 🔐 AUTH
  const { isLoggedIn, logout } = useAuth();

  // 💰 WALLET
  const { balance } = useWallet();

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    navigate("/", { replace: true }); // 🏠 always go Home
    logout();     
  };

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

            <button onClick={() => navigate("/user/my-offers")}>
              <FiGift title="My Offers" />
            </button>

            <button onClick={() => navigate("/user/wallet")}>
              <FaWallet />
              {isLoggedIn && (
                <WalletBadge>
                  ₹{Number(balance || 0).toFixed(0)}
                </WalletBadge>
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
          {!isLoggedIn ? (
            <AuthButton onClick={() => navigate("/user/auth")}>
              Sign In / Up
            </AuthButton>
          ) : (
            <AuthButton onClick={handleLogout}>
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
          <MobileItem to="/" onClick={() => setOpen(false)}>
            Home
          </MobileItem>

          <MobileItem 
            to="/user/my-offers" 
            onClick={() => setOpen(false)}
          >
            My Offers
          </MobileItem>

          <MobileItem
            to="/user/wallet"
            onClick={() => setOpen(false)}
          >
            Wallet
          </MobileItem>

          {!isLoggedIn ? (
            <MobileItem
              to="/user/auth"
              onClick={() => setOpen(false)}
            >
              Sign In / Up
            </MobileItem>
          ) : (
            <MobileItem
              as="button"
              onClick={() => {
                handleLogout();
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
