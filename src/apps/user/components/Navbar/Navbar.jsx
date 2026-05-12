import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Nav,
  Container,
  HeaderLeft,
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
  LanguageSwitcher,
  LanguageOption,
} from "./Navbar.styles";
import {
  FiMenu,
  FiX,
  FiHome,
  FiGift,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiClock,
  FiGrid,
} from "react-icons/fi";
import { FaWallet } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../../../../assets/logo.webp";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useWallet } from "../../../../shared/context/WalletContext";
import ProfilePopup from "../ProfilePopup";
import BackButton from "../BackButton/BackButton";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
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
  const normalizedPath = location.pathname.replace(/\/+$/, "") || "/user";
  const isHomePage = normalizedPath === "/user";

  const handleNav = (path) => {
    navigate(path);
    setOpen(false);
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
    { label: t("common.home"), path: "/user", icon: FiHome },
    { label: t("common.categories"), path: "/user/categories", icon: FiGrid, hasArrow: true },
    { label: t("common.offers"), path: "/user/all-services", icon: FiGift },
    { label: t("common.history"), path: "/user/chat-history", icon: FiClock },
  ];

  return (
    <>
      <Nav>
        <Container>
          <HeaderLeft $compact={!isHomePage}>
            {!isHomePage && <BackButton iconOnly />}
            {isHomePage && (
              <BrandBox
                to="/user"
                onClick={() => setOpen(false)}
              >
                <BrandLogo
                  src={logo}
                  alt="G9Expert"
                />
              </BrandBox>
            )}
          </HeaderLeft>

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

          <RightActions>
            <IconBox>
              <WalletIconWrap
                className="wallet-btn essential"
                onClick={() => navigate("/user/wallet")}
                title={t("common.wallet")}
              >
                <FaWallet />
                {isLoggedIn && balance > 0 && <WalletBadge>₹{Math.floor(balance)}</WalletBadge>}
              </WalletIconWrap>

              <LanguageSwitcher aria-label={t("common.language")}>
                <LanguageOption
                  type="button"
                  $active={i18n.language === "en"}
                  onClick={() => i18n.changeLanguage("en")}
                >
                  EN
                </LanguageOption>
                <LanguageOption
                  type="button"
                  $active={i18n.language === "hi"}
                  onClick={() => i18n.changeLanguage("hi")}
                >
                  हिंदी
                </LanguageOption>
              </LanguageSwitcher>

              {isLoggedIn && (
                <button
                  ref={userBtnRef}
                  className="essential"
                  onClick={togglePopup}
                  title={t("nav.profile")}
                >
                  <FiUser />
                </button>
              )}
            </IconBox>

            {!isLoggedIn && <AuthButton onClick={() => navigate("/user/auth")}>{t("common.signIn")}</AuthButton>}

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
              {t("common.wallet")}
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
                  {t("common.logout")}
                </MobileItem>
              </>
            ) : (
              <MobileItem onClick={() => handleNav("/user/auth")}>
                <FiUser />
                {t("common.signIn")}
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
