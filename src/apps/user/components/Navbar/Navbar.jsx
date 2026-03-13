import React, { useState, useRef } from "react";
import {
  Nav, Container, NavbarSpacer, BrandBox, BrandLogo, BrandName,
  IconBox, MobileIcon, MobileMenu, MobileItem,
  WalletIconWrap, WalletBadge, AuthButton, RightActions
} from "./Navbar.styles";
import { FiMenu, FiX, FiHome, FiGift, FiUser, FiLogOut, FiMessageSquare } from "react-icons/fi";
import { FaWallet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../../../../assets/logo.png";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useWallet } from "../../../../shared/context/WalletContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const { balance } = useWallet();
  const [open, setOpen] = useState(false);

  const handleNav = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      <Nav>
        <Container>
          <BrandBox to="/">
            <BrandLogo src={logo} alt="ExpertYard" />
            <BrandName>Expert<span>Yard</span></BrandName>
          </BrandBox>

          <RightActions>
            <IconBox>
              {/* Desktop Icons */}
              <button onClick={() => navigate("/")} title="Home"><FiHome /></button>
              <button onClick={() => navigate("/user/my-offers")} title="Offers"><FiGift /></button>
              <button onClick={() => navigate("/user/chat-history")} title="Messages"><FiMessageSquare /></button>
              
              {/* Wallet - Essential (Mobile pe bhi dikhega) */}
              <WalletIconWrap className="wallet-btn essential" onClick={() => navigate("/user/wallet")}>
                <FaWallet />
                {isLoggedIn && balance > 0 && (
                  <WalletBadge>₹{Math.floor(balance)}</WalletBadge>
                )}
              </WalletIconWrap>

              {/* Profile - Essential */}
              {isLoggedIn && (
                <button className="essential" onClick={() => navigate("/user/profile")} title="Profile">
                  <FiUser />
                </button>
              )}
            </IconBox>

            {!isLoggedIn && (
              <AuthButton onClick={() => navigate("/user/auth")}>Sign In</AuthButton>
            )}

            <MobileIcon onClick={() => setOpen(!open)}>
              {open ? <FiX size={24} /> : <FiMenu size={24} />}
            </MobileIcon>
          </RightActions>
        </Container>

        {/* Mobile Menu - Grid Layout for better reach */}
        {open && (
          <MobileMenu>
            <MobileItem onClick={() => handleNav("/")}><FiHome /> Home</MobileItem>
            <MobileItem onClick={() => handleNav("/user/my-offers")}><FiGift /> Offers</MobileItem>
            <MobileItem onClick={() => handleNav("/user/chat-history")}><FiMessageSquare /> Chat</MobileItem>
            <MobileItem onClick={() => handleNav("/user/wallet")}><FaWallet /> Wallet</MobileItem>
            {isLoggedIn ? (
              <>
                <MobileItem onClick={() => handleNav("/user/profile")}><FiUser /> Profile</MobileItem>
                <MobileItem onClick={() => { logout(); setOpen(false); }}><FiLogOut color="#ef4444"/> Logout</MobileItem>
              </>
            ) : (
              <MobileItem onClick={() => handleNav("/user/auth")}><FiUser /> Login</MobileItem>
            )}
          </MobileMenu>
        )}
      </Nav>

      {/* ✅ Ye aapke Back button ko niche dhakelega automatically */}
      <NavbarSpacer />
    </>
  );
};

export default Navbar;