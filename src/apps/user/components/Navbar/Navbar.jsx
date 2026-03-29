import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Nav, Container, NavbarSpacer, BrandBox, BrandLogo, BrandName,
  IconBox, MobileIcon, MobileMenu, MobileItem,
  WalletIconWrap, WalletBadge, AuthButton, RightActions
} from "./Navbar.styles";

import {
  FiMenu, FiX, FiHome, FiGift, FiUser,
  FiLogOut, FiMessageSquare, FiArrowLeft
} from "react-icons/fi";

import { FaWallet } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../../../assets/logo.png";

import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useWallet } from "../../../../shared/context/WalletContext";

import ProfilePopup from "../ProfilePopup";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isLoggedIn, user, logout } = useAuth();
  const { balance } = useWallet();

  const [open, setOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  const [popupPos, setPopupPos] = useState({
    top: 0,
    left: 0,
    width: 280
  });

  const userBtnRef = useRef(null);

  const handleNav = (path) => {
    navigate(path);
    setOpen(false);
  };

  // ✅ Close popup on resize
  useEffect(() => {
    const close = () => setPopupOpen(false);
    if (popupOpen) window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, [popupOpen]);

  // ✅ Calculate popup position
  const calculatePopupPosition = useCallback(() => {
    if (!userBtnRef.current) return;

    const rect = userBtnRef.current.getBoundingClientRect();
    const popupWidth = Math.min(280, window.innerWidth - 20);

    let left = rect.right - popupWidth;
    left = Math.max(10, Math.min(left, window.innerWidth - popupWidth - 10));

    const top = rect.bottom + 10;

    setPopupPos({ top, left, width: popupWidth });
  }, []);

  // ✅ Toggle popup
  const togglePopup = (e) => {
    e.stopPropagation();
    calculatePopupPosition();
    setPopupOpen((prev) => !prev);
  };

  // 🆕 Home detection
  const homePaths = ["/", "/user", "/user/", "/user/home", "/user/home/"];
  const isHomePage = homePaths.includes(location.pathname);

  return (
    <>
      <Nav>
        <Container>
          <BrandBox
            to={isHomePage ? "/" : "#"}
            onClick={(e) => {
              if (!isHomePage) {
                e.preventDefault();
                navigate(-1);
              }
            }}
          >
            {!isHomePage && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <FiArrowLeft size={24} style={{ color: "#000", marginRight: 8 }} />
              </div>
            )}

            <BrandLogo
              src={logo}
              alt="ExpertYard"
              className={!isHomePage ? "hide-logo-on-mobile" : ""}
            />

            <BrandName className={!isHomePage ? "hide-logo-on-mobile" : ""}>
              Expert<span>Yard</span>
            </BrandName>
          </BrandBox>

          <RightActions>
            <IconBox>
              <button onClick={() => navigate("/user/")} title="Home">
                <FiHome />
              </button>

              <button onClick={() => navigate("/user/my-offers")} title="Offers">
                <FiGift />
              </button>

              <button onClick={() => navigate("/user/chat-history")} title="Messages">
                <FiMessageSquare />
              </button>

              {/* Wallet */}
              <WalletIconWrap
                className="wallet-btn essential"
                onClick={() => navigate("/user/wallet")}
              >
                <FaWallet />
                {isLoggedIn && balance > 0 && (
                  <WalletBadge>₹{Math.floor(balance)}</WalletBadge>
                )}
              </WalletIconWrap>

              {/* Profile */}
              {isLoggedIn && (
                <button
                  ref={userBtnRef}
                  className="essential"
                  onClick={togglePopup}
                  title="Profile"
                >
                  <FiUser />
                </button>
              )}
            </IconBox>

            {!isLoggedIn && (
              <AuthButton onClick={() => navigate("/user/auth")}>
                Sign In
              </AuthButton>
            )}

            <MobileIcon onClick={() => setOpen(!open)}>
              {open ? <FiX size={24} /> : <FiMenu size={24} />}
            </MobileIcon>
          </RightActions>
        </Container>

        {/* Mobile Menu */}
        {open && (
          <MobileMenu>
            <MobileItem onClick={() => handleNav("/")}>
              <FiHome /> Home
            </MobileItem>

            <MobileItem onClick={() => handleNav("/user/my-offers")}>
              <FiGift /> Offers
            </MobileItem>

            <MobileItem onClick={() => handleNav("/user/chat-history")}>
              <FiMessageSquare /> Chat
            </MobileItem>

            <MobileItem onClick={() => handleNav("/user/wallet")}>
              <FaWallet /> Wallet
            </MobileItem>

            {isLoggedIn ? (
              <MobileItem
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
              >
                <FiLogOut color="#ef4444" /> Logout
              </MobileItem>
            ) : (
              <MobileItem onClick={() => handleNav("/user/auth")}>
                <FiUser /> Login
              </MobileItem>
            )}
          </MobileMenu>
        )}
      </Nav>

      {/* ✅ Profile Popup */}
      <ProfilePopup
        popupOpen={popupOpen}
        popupPos={popupPos}
        user={user}
        onClose={() => setPopupOpen(false)}
        onLogout={() => {
          logout();
          setPopupOpen(false);
        }}
      />

      <NavbarSpacer />
    </>
  );
};

export default Navbar;