import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Nav,
  Container,
  NavbarSpacer,
  BrandBox,
  BrandLogo,
  DesktopNav,
  NavList,
  NavItem,
  IconBox,
  MobileIcon,
  MobileMenu,
  MobileItem,
  WalletIconWrap,
  WalletBadge,
  AuthButton,
  RightActions,
} from "./Navbar.styles";
import {
  FiMenu,
  FiX,
  FiHome,
  FiGift,
  FiUser,
  FiLogOut,
  FiMessageSquare,
  FiArrowLeft,
  FiChevronDown,
  FiClock,
  FiGrid,
} from "react-icons/fi";
import { FaWallet } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../../../assets/logo.webp";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useWallet } from "../../../../shared/context/WalletContext";
import ProfilePopup from "../ProfilePopup";

const HOME_PATHS = ["/", "/user", "/user/", "/user/home", "/user/home/"];

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
    width: 280,
  });

  const userBtnRef = useRef(null);
  const isHomePage = HOME_PATHS.includes(location.pathname);

  const handleNav = (path) => {
    navigate(path);
    setOpen(false);
  };

  const handleSmartBack = () => {
    const state = location.state;

    if (state?.from === "chat" && state?.expertId) {
      navigate(`/user/experts/${state.expertId}`, { replace: true });
      return;
    }

    navigate(-1);
  };

  useEffect(() => {
    const closePopup = () => setPopupOpen(false);
    const closeMenus = () => setOpen(false);

    if (popupOpen) {
      window.addEventListener("resize", closePopup);
    }

    window.addEventListener("resize", closeMenus);

    return () => {
      window.removeEventListener("resize", closePopup);
      window.removeEventListener("resize", closeMenus);
    };
  }, [popupOpen]);

  useEffect(() => {
    setOpen(false);
    setPopupOpen(false);
  }, [location.pathname]);

  const calculatePopupPosition = useCallback(() => {
    if (!userBtnRef.current) return;

    const rect = userBtnRef.current.getBoundingClientRect();
    const popupWidth = Math.min(280, window.innerWidth - 20);
    let left = rect.right - popupWidth;

    left = Math.max(10, Math.min(left, window.innerWidth - popupWidth - 10));

    setPopupPos({
      top: rect.bottom + 10,
      left,
      width: popupWidth,
    });
  }, []);

  const togglePopup = (event) => {
    event.stopPropagation();
    calculatePopupPosition();
    setPopupOpen((prev) => !prev);
  };

  const primaryMenuItems = [
    { label: "Home", path: "/user", icon: FiHome },
    { label: "Categories", path: "/user/categories", icon: FiGrid, hasArrow: true },
    { label: "Offers", path: "/user/all-services", icon: FiGift },
    { label: "History", path: "/user/chat-history", icon: FiClock },
  ];

  return (
    <>
      <Nav>
        <Container>
          <BrandBox
            to={isHomePage ? "/user" : "#"}
            onClick={(event) => {
              if (!isHomePage) {
                event.preventDefault();
                handleSmartBack();
              }
            }}
          >
            {!isHomePage && (
              <div className="back-btn-mobile" style={{ alignItems: "center" }}>
                <FiArrowLeft size={22} style={{ color: "#111827" }} />
              </div>
            )}

            <BrandLogo
              src={logo}
              alt="G9Expert"
              className={!isHomePage ? "hide-logo-on-mobile" : ""}
            />
          </BrandBox>

          {isHomePage && (
            <DesktopNav>
              <NavList>
                {primaryMenuItems.map(({ label, path, hasArrow }) => (
                  <NavItem
                    key={label}
                    type="button"
                    $active={location.pathname === path}
                    onClick={() => handleNav(path)}
                  >
                    {label}
                    {hasArrow && <FiChevronDown />}
                  </NavItem>
                ))}
              </NavList>
            </DesktopNav>
          )}

          <RightActions>
            <IconBox>
              {!isHomePage && (
                <>
                  <button onClick={() => navigate("/user")} title="Home">
                    <FiHome />
                  </button>
                  <button onClick={() => navigate("/user/all-services")} title="Offers">
                    <FiGift />
                  </button>
                  <button onClick={() => navigate("/user/chat-history")} title="History">
                    <FiMessageSquare />
                  </button>
                </>
              )}

              <WalletIconWrap
                className="wallet-btn essential"
                onClick={() => navigate("/user/wallet")}
                title="Wallet"
              >
                <FaWallet />
                {isLoggedIn && balance > 0 && <WalletBadge>₹{Math.floor(balance)}</WalletBadge>}
              </WalletIconWrap>

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

            {!isLoggedIn && <AuthButton onClick={() => navigate("/user/auth")}>Sign In</AuthButton>}

            <MobileIcon onClick={() => setOpen((prev) => !prev)}>
              {open ? <FiX size={20} /> : <FiMenu size={20} />}
            </MobileIcon>
          </RightActions>
        </Container>

        {open && (
          <MobileMenu>
            {primaryMenuItems.map(({ label, path, icon: Icon }) => (
              <MobileItem key={label} onClick={() => handleNav(path)}>
                <Icon />
                {label}
              </MobileItem>
            ))}

            <MobileItem onClick={() => handleNav("/user/wallet")}>
              <FaWallet />
              Wallet
            </MobileItem>

            {isLoggedIn ? (
              <>
                <MobileItem
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                >
                  <FiLogOut color="#dc2626" />
                  Logout
                </MobileItem>
              </>
            ) : (
              <MobileItem onClick={() => handleNav("/user/auth")}>
                <FiUser />
                Sign In
              </MobileItem>
            )}
          </MobileMenu>
        )}
      </Nav>

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
