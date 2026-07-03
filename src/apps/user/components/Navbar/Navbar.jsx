import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Nav,
  Container,
  NavbarSpacer,
  BrandBox,
  BrandLogo,
  HeaderBrandGroup,
  HeaderBackButton,
  HeaderMobileTitle,
  HeaderCategoryButton,
  HeaderCategoryMenu,
  HeaderCategoryMenuCard,
  HeaderCategoryMenuGrid,
  HeaderCategoryMenuItem,
  HeaderCategoryMenuShell,
  HeaderCategoryMenuState,
  HeaderMobileLocation,
  HeaderMenuButton,
  HeaderActions,
  HeaderDesktopIconButton,
  HeaderProfileButton,
  HeaderSearch,
  HeaderWalletPill,
  AuthButton,
  LanguageIcon,
  MobileLanguageButton,
  MobileLanguageDropdown,
  MobileLanguageMenu,
  MobileIcon,
  MobileMenu,
  MobileItem,
  MobileMenuOverlay,
  MobileMenuHeader,
  MobileMenuSection,
  MobileMenuTitle,
  MobileMenuFooter,
  MenuWalletValue,
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
  FiGlobe,
  FiLogIn,
  FiShare2,
  FiSearch,
  FiArrowLeft,
  FiBell,
  FiSliders,
} from "react-icons/fi";
import { FaWallet } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../../../../assets/logo.webp";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useCategory } from "../../../../shared/context/CategoryContext";
import { useWallet } from "../../../../shared/context/WalletContext";
import { getCategoryPath } from "../../../../shared/utils/categoryRoutes";
import ProfilePopup from "../ProfilePopup";
import GlobalSearchBar from "../search/GlobalSearchBar";
import { LocationSelector } from "../../../../shared/components";

const getMobileHeaderTitle = (pathname) => {
  if (pathname === "/user/search") return "Search";
  if (pathname === "/user/all-services") return "Services";
  if (pathname === "/user/categories") return "Categories";
  if (pathname === "/user/call-chat") return "Experts";
  if (pathname === "/user/experts") return "Experts";
  if (pathname.startsWith("/user/experts/")) return "Expert Profile";
  if (pathname === "/user/wallet") return "Wallet";
  if (pathname === "/user/user-profile") return "Profile";
  if (pathname === "/user/chat-history" || pathname.startsWith("/user/chat-history/")) return "History";
  if (pathname.startsWith("/user/service-details/")) return "Service Details";
  if (pathname.startsWith("/user/category/") || pathname.startsWith("/user/categories/")) return "Categories";
  if (pathname === "/user/my-offers") return "Offers";
  if (pathname.startsWith("/user/my-booking/")) return "Booking";
  if (pathname === "/user/about") return "About";
  if (pathname === "/user/how-it-works") return "How It Works";
  if (pathname === "/user/reviews") return "Reviews";
  if (pathname === "/user/guidelines") return "Guidelines";
  if (pathname === "/user/terms") return "Terms";
  if (pathname === "/user/privacy") return "Privacy";
  if (pathname === "/user/faq") return "FAQ";
  if (pathname === "/user/contact") return "Contact";
  if (pathname === "/user/careers") return "Careers";
  if (pathname === "/user/find-experts") return "Find Experts";
  if (pathname === "/user/become-expert") return "Become Expert";
  if (pathname === "/user/earnings-model") return "Earnings";
  if (pathname === "/user/support") return "Support";
  if (pathname === "/user/marketing") return "Marketing";
  return "G9 Expert";
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { isLoggedIn, user, logout } = useAuth();
  const { categories, loading: categoriesLoading } = useCategory();
  const { balance } = useWallet();

  const [open, setOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupPos, setPopupPos] = useState({
    top: 0,
    left: 0,
    width: 280,
  });

  const userBtnRef = useRef(null);
  const showMobileBack = location.pathname !== "/user";
  const mobileHeaderTitle = getMobileHeaderTitle(location.pathname);
  const isSearchRoute = location.pathname === "/user/search";
  const isProfileRoute = location.pathname === "/user/user-profile";

  const handleBack = () => {
    const historyIndex = typeof window !== "undefined" ? window.history.state?.idx : 0;

    if (historyIndex > 0) {
      navigate(-1);
      return;
    }

    navigate("/user");
  };

  const handleNav = (path) => {
    navigate(path);
    setOpen(false);
    setCategoryMenuOpen(false);
    setLanguageOpen(false);
  };

  const openLogin = () => {
    const redirectPath = `${location.pathname}${location.search}${location.hash}`;
    navigate(`/user/auth?redirect=${encodeURIComponent(redirectPath)}`, {
      state: { from: location },
    });
    setOpen(false);
    setCategoryMenuOpen(false);
    setLanguageOpen(false);
  };

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    setLanguageOpen(false);
  };

  const shareReferral = async () => {
    if (!isLoggedIn || !user?.referral_code) {
      console.error("No referral code found");
      return;
    }

    const referralLink = `${window.location.origin}/expert/register?ref=${user.referral_code}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "G9Expert Refer & Earn",
          text: "Join G9Expert as an expert using my referral link and earn rewards!",
          url: referralLink,
        });
      } else {
        await navigator.clipboard.writeText(referralLink);
        alert("Referral link copied!");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error(err);
        alert("Failed to share referral link");
      }
    }
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
    const timer = window.setTimeout(() => {
      setOpen(false);
      setPopupOpen(false);
      setLanguageOpen(false);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    if (!open || !window.matchMedia("(max-width: 768px)").matches) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

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
    { label: t("common.offers"), path: "/user/all-services", icon: FiGift },
    { label: t("common.categories"), path: "/user/categories", icon: FiGrid, mobileOnly: true },
    { label: t("common.history"), path: "/user/chat-history", icon: FiClock },
  ];

  return (
    <>
      <Nav className={showMobileBack ? "user-common-mobile-header" : undefined}>
        <Container>
          {showMobileBack && (
            <HeaderBackButton type="button" onClick={handleBack} aria-label="Go back">
              <FiArrowLeft />
            </HeaderBackButton>
          )}

          {showMobileBack && (
            <HeaderMenuButton
              type="button"
              className="mobile-menu-trigger"
              onClick={() => setOpen((prev) => !prev)}
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            >
              {open ? <FiX size={20} /> : <FiMenu size={20} />}
            </HeaderMenuButton>
          )}

          {showMobileBack && (
            <HeaderMobileTitle title={mobileHeaderTitle}>
              {mobileHeaderTitle}
            </HeaderMobileTitle>
          )}

          <HeaderBrandGroup className={showMobileBack ? "mobile-hidden" : undefined}>
            <HeaderMenuButton
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            >
              {open ? <FiX size={20} /> : <FiMenu size={20} />}
            </HeaderMenuButton>

            <BrandBox to="/user" onClick={() => setOpen(false)}>
              <BrandLogo src={logo} alt="G9Expert" />
            </BrandBox>
          </HeaderBrandGroup>

          <HeaderCategoryMenuShell
            onMouseEnter={() => setCategoryMenuOpen(true)}
            onMouseLeave={() => setCategoryMenuOpen(false)}
            onFocus={() => setCategoryMenuOpen(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setCategoryMenuOpen(false);
              }
            }}
          >
            <HeaderCategoryButton
              type="button"
              $active={location.pathname === "/user/categories"}
              onClick={() => handleNav("/user/categories")}
              aria-haspopup="true"
              aria-expanded={categoryMenuOpen}
            >
              <FiGrid />
              <span>{t("common.categories")}</span>
              <FiChevronDown />
            </HeaderCategoryButton>

            {categoryMenuOpen && (
              <HeaderCategoryMenu>
                <HeaderCategoryMenuCard>
                  <h3>{t("common.categories")}</h3>
                  {categoriesLoading ? (
                    <HeaderCategoryMenuState>{t("common.loading")}</HeaderCategoryMenuState>
                  ) : categories.length > 0 ? (
                    <HeaderCategoryMenuGrid>
                      {categories.slice(0, 12).map((category) => (
                        <HeaderCategoryMenuItem
                          key={category.id || category.slug || category.name}
                          type="button"
                          onClick={() => handleNav(getCategoryPath(category))}
                        >
                          <span>
                            {category.image_url ? (
                              <img src={category.image_url} alt="" loading="lazy" />
                            ) : (
                              category.name?.charAt(0)
                            )}
                          </span>
                          <strong>{category.name}</strong>
                        </HeaderCategoryMenuItem>
                      ))}
                    </HeaderCategoryMenuGrid>
                  ) : (
                    <HeaderCategoryMenuState>No categories available</HeaderCategoryMenuState>
                  )}
                </HeaderCategoryMenuCard>
              </HeaderCategoryMenu>
            )}
          </HeaderCategoryMenuShell>

          <HeaderSearch>
            <GlobalSearchBar
              className="navbar-global-search"
              placeholder="Search experts, services, categories..."
            />
          </HeaderSearch>

          <HeaderDesktopIconButton
            type="button"
            onClick={() => handleNav("/user/search")}
            aria-label="Open search filters"
            title="Filters"
          >
            <FiSliders />
          </HeaderDesktopIconButton>

          <div className="desktop-only-location" style={{ marginLeft: "12px", marginRight: "12px" }}>
            <LocationSelector onLocationSelect={(loc) => {
              window.dispatchEvent(new CustomEvent("g9-location-changed", { detail: loc }));
            }} />
          </div>

          {!isSearchRoute && (
            <MobileIcon onClick={() => navigate("/user/search")} aria-label="Open search page">
              <FiSearch size={20} />
            </MobileIcon>
          )}

          <HeaderMobileLocation className={showMobileBack ? "common-mobile-location" : undefined}>
            <LocationSelector />
          </HeaderMobileLocation>

          {!isProfileRoute && (
            <HeaderProfileButton
              type="button"
              className="mobile-profile-shortcut"
              onClick={() => handleNav("/user/user-profile")}
              aria-label={t("nav.profile")}
              title={t("nav.profile")}
            >
              <FiUser />
            </HeaderProfileButton>
          )}

          <HeaderActions className={showMobileBack ? "common-mobile-hidden" : undefined}>
            <HeaderDesktopIconButton
              type="button"
              className="desktop-notification-button"
              onClick={() => handleNav("/user/notifications")}
              aria-label="Notifications"
              title="Notifications"
            >
              <FiBell />
            </HeaderDesktopIconButton>

            <HeaderWalletPill
              type="button"
              onClick={() => handleNav("/user/wallet")}
              aria-label="Wallet"
              title="Wallet"
            >
              <FaWallet />
              <span>Rs {Math.floor(Number(balance || 0))}</span>
            </HeaderWalletPill>

            <LanguageSwitcher aria-label={t("common.language")}>
              <LanguageIcon aria-hidden="true">
                <FiGlobe />
              </LanguageIcon>
              <LanguageOption
                type="button"
                $active={i18n.language === "en"}
                onClick={() => changeLanguage("en")}
              >
                EN
              </LanguageOption>
              <LanguageOption
                type="button"
                $active={i18n.language === "hi"}
                onClick={() => changeLanguage("hi")}
              >
                Hindi
              </LanguageOption>
            </LanguageSwitcher>

            <MobileLanguageMenu>
              <MobileLanguageButton
                type="button"
                onClick={() => setLanguageOpen((prev) => !prev)}
                aria-label={t("common.language")}
                aria-expanded={languageOpen}
              >
                <FiGlobe />
              </MobileLanguageButton>
              {languageOpen && (
                <MobileLanguageDropdown>
                  <button type="button" onClick={() => changeLanguage("en")} className={i18n.language === "en" ? "active" : ""}>
                    EN
                  </button>
                  <button type="button" onClick={() => changeLanguage("hi")} className={i18n.language === "hi" ? "active" : ""}>
                    Hindi
                  </button>
                </MobileLanguageDropdown>
              )}
            </MobileLanguageMenu>

            {isLoggedIn ? (
              <HeaderProfileButton
                ref={userBtnRef}
                type="button"
                onClick={togglePopup}
                title={t("nav.profile")}
                aria-label={t("nav.profile")}
              >
                <FiUser />
              </HeaderProfileButton>
            ) : (
              <AuthButton
                type="button"
                onClick={openLogin}
                aria-label="Login"
                title="Login"
              >
                <FiLogIn />
                <span>Login</span>
              </AuthButton>
            )}
          </HeaderActions>
        </Container>

        {open && (
          <>
            <MobileMenuOverlay onClick={() => setOpen(false)} />
            <MobileMenu>
              <MobileMenuHeader>
                <BrandLogo src={logo} alt="G9Expert" />
                <button type="button" onClick={() => setOpen(false)} aria-label="Close navigation menu">
                  <FiX />
                </button>
              </MobileMenuHeader>

              <MobileMenuSection>
                <MobileMenuTitle>Location</MobileMenuTitle>
                <div style={{ padding: "8px 16px 12px" }}>
                  <LocationSelector onLocationSelect={(loc) => {
                    window.dispatchEvent(new CustomEvent("g9-location-changed", { detail: loc }));
                  }} />
                </div>
                <MobileMenuTitle>Navigation</MobileMenuTitle>
                {primaryMenuItems.map((item) => (
                  <MobileItem
                    key={item.label}
                    className={item.mobileOnly ? "mobile-only-menu-item" : undefined}
                    onClick={() => handleNav(item.path)}
                  >
                    {React.createElement(item.icon)}
                    {item.label}
                  </MobileItem>
                ))}
              </MobileMenuSection>

              <MobileMenuSection>
                <MobileMenuTitle>Account</MobileMenuTitle>
                <MobileItem onClick={() => handleNav("/user/wallet")}>
                  <FaWallet />
                  {t("common.wallet")}
                  {isLoggedIn && balance > 0 && <MenuWalletValue>Rs {Math.floor(balance)}</MenuWalletValue>}
                </MobileItem>

                {isLoggedIn ? (
                  <>
                    <MobileItem onClick={shareReferral}>
                      <FiShare2 />
                      {t("Share")}
                    </MobileItem>
                    <MobileItem ref={userBtnRef} onClick={togglePopup}>
                      <FiUser />
                      {t("nav.profile")}
                    </MobileItem>
                  </>
                ) : (
                  <MobileItem onClick={openLogin}>
                    <FiLogIn />
                    Login
                  </MobileItem>
                )}
              </MobileMenuSection>

              <MobileMenuFooter>
                <MobileMenuTitle>{t("common.language")}</MobileMenuTitle>
                <LanguageSwitcher aria-label={t("common.language")}>
                  <LanguageIcon aria-hidden="true">
                    <FiGlobe />
                  </LanguageIcon>
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
                    Hindi
                  </LanguageOption>
                </LanguageSwitcher>

                {isLoggedIn && (
                  <MobileItem
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                  >
                    <FiLogOut color="#dc2626" />
                    {t("common.logout")}
                  </MobileItem>
                )}
              </MobileMenuFooter>
            </MobileMenu>
          </>
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
