// Navbar.jsx (Updated - AuthButton OUTSIDE IconBox)
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Nav, Container, NavbarSpacer, BrandBox, BrandLogo, BrandName,
  IconBox, MobileIcon, MobileMenu, MobileItem,
  WalletIconWrap, WalletBadge, SearchWrap,
  SearchInput, AuthButton, RightActions
} from "./Navbar.styles";

import { FiMenu, FiX, FiSearch, FiShare2, FiHome, FiGift, FiUser, FiLogOut, FiMail, FiPhone } from "react-icons/fi";
import { FaWallet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../../../../assets/logo.png";

import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useWallet } from "../../../../shared/context/WalletContext";
import { getUserProfileApi } from "../../../../shared/api/userApi/auth.api";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
  const { balance } = useWallet();

  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [profile, setProfile] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0, width: 280 });

  const userBtnRef = useRef(null);
  const navbarRef = useRef(null);
  const popupRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      getUserProfileApi(user.id)
        .then(res => res?.success && setProfile(res.data))
        .catch(() => setProfile(null));
    }
  }, [isLoggedIn, user?.id]);

  const calculatePopupPosition = useCallback(() => {
    if (!userBtnRef.current || !navbarRef.current) return;
    
    const navbarRect = navbarRef.current.getBoundingClientRect();
    const userRect = userBtnRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const popupWidth = Math.min(300, viewportWidth * 0.9);
    
    let left = userRect.right - popupWidth;
    left = Math.max(20, Math.min(left, viewportWidth - popupWidth - 20));
    const top = navbarRect.bottom + 12;
    
    setPopupPos({ top, left, width: popupWidth });
  }, []);

  const toggleUserPopup = (e) => {
    e.stopPropagation();
    calculatePopupPosition();
    setPopupOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target) &&
          navbarRef.current && !navbarRef.current.contains(e.target)) {
        setPopupOpen(false);
      }
    };
    
    if (popupOpen) {
      document.addEventListener("click", handleClickOutside);
      window.addEventListener("resize", calculatePopupPosition);
    }
    
    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", calculatePopupPosition);
    };
  }, [popupOpen, calculatePopupPosition]);

  const handleLogout = () => {
    console.clear();
    localStorage.clear();
    logout();
    setPopupOpen(false);
    setOpen(false);
    navigate("/", { replace: true });
  };

  const handleMobileProfile = () => {
    setOpen(false);
    setTimeout(() => {
      toggleUserPopup({ stopPropagation: () => {} });
    }, 200);
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    const trimmedQuery = query.trim();
    
    if (/^\d+$/.test(trimmedQuery)) {
      navigate(`/user/experts/${trimmedQuery}`);
    } else {
      navigate(`/user/call-chat?q=${encodeURIComponent(trimmedQuery)}`);
    }
    
    setQuery("");
    setSearchOpen(false);
  };

  const toggleMobileMenu = () => {
    setOpen(prev => !prev);
  };

  const toggleSearch = () => {
    setSearchOpen(prev => !prev);
  };

  const closeAllMenus = () => {
    setOpen(false);
    setSearchOpen(false);
    setQuery("");
  };

  return (
    <>
      <Nav ref={navbarRef}>
        <Container>
          <BrandBox to="/">
            <BrandLogo src={logo} alt="ExpertYard" />
            <BrandName>Expert<span>Yard</span></BrandName>
          </BrandBox>

          <RightActions>
            {/* ✅ IconBox - ONLY 40x40 icon buttons */}
            <IconBox>
              <button onClick={() => navigate("/")} title="Home">
                <FiHome />
              </button>
              
              <button onClick={() => navigate("/user/my-offers")} title="My Offers">
                <FiGift />
              </button>
              
              <WalletIconWrap onClick={() => navigate("/user/wallet")} title="Wallet">
                <FaWallet />
                {isLoggedIn && balance > 0 && (
                  <WalletBadge>₹{Number(balance).toFixed(0)}</WalletBadge>
                )}
              </WalletIconWrap>

              <button title="Share">
                <FiShare2 />
              </button>

              <SearchWrap>
                <button onClick={toggleSearch} title="Search">
                  <FiSearch />
                </button>
                <SearchInput
                  data-open={searchOpen}
                  autoFocus={searchOpen}
                  value={query}
                  placeholder="Search expert ID, name, category..."
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                    if (e.key === "Escape") closeAllMenus();
                  }}
                />
                {searchOpen && (
                  <div style={{
                    position: "absolute",
                    bottom: "-32px",
                    right: 0,
                    background: "rgba(15,23,42,0.9)",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 500,
                    backdropFilter: "blur(10px)",
                    whiteSpace: "nowrap",
                    boxShadow: "0 4px 20px rgba(15,23,42,0.2)"
                  }}>
                    ⏎ Enter to search, Esc to close
                  </div>
                )}
              </SearchWrap>

              {/* ✅ User icon ONLY when logged in */}
              {isLoggedIn && (
                <button ref={userBtnRef} onClick={toggleUserPopup} title="Profile">
                  <FiUser />
                </button>
              )}
            </IconBox>

            {/* ✅ AuthButton OUTSIDE IconBox - Full size blue button */}
            {!isLoggedIn && (
              <AuthButton onClick={() => navigate("/user/auth")}>
                Sign In
              </AuthButton>
            )}
          </RightActions>

          <MobileIcon onClick={toggleMobileMenu} title="Menu">
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </MobileIcon>
        </Container>

        {open && (
          <MobileMenu ref={mobileMenuRef}>
            <MobileItem onClick={() => {
              closeAllMenus();
              navigate("/");
            }}>
              <FiHome size={20} /> Home
            </MobileItem>
            
            <MobileItem onClick={() => {
              closeAllMenus();
              navigate("/user/my-offers");
            }}>
              <FiGift size={20} /> My Offers
            </MobileItem>
            
            <MobileItem onClick={() => {
              closeAllMenus();
              navigate("/user/wallet");
            }}>
              <FaWallet size={20} /> Wallet
            </MobileItem>
            
            {isLoggedIn ? (
              <>
                <MobileItem onClick={handleMobileProfile}>
                  <FiUser size={20} /> Profile
                </MobileItem>
                <MobileItem onClick={handleLogout}>
                  <FiLogOut size={20} /> Sign Out
                </MobileItem>
              </>
            ) : (
              <MobileItem onClick={() => {
                closeAllMenus();
                navigate("/user/auth");
              }}>
                <FiUser size={20} /> Sign In
              </MobileItem>
            )}
          </MobileMenu>
        )}
      </Nav>

      {/* Profile Popup - Unchanged */}
      {popupOpen && profile && (
        <div
          ref={popupRef}
          style={{
            position: "fixed",
            top: `${popupPos.top}px`,
            left: `${popupPos.left}px`,
            width: popupPos.width,
            maxWidth: "calc(100vw - 40px)",
            background: "rgba(255,255,255,0.98)",
            backdropFilter: "blur(20px)",
            borderRadius: 20,
            padding: "24px",
            boxShadow: "0 35px 90px rgba(15,23,42,0.25)",
            border: "1px solid rgba(148,163,184,0.12)",
            zIndex: 9999,
            fontSize: 14
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Profile Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{
              width: 48, 
              height: 48, 
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              color: "white", 
              fontWeight: 700, 
              fontSize: 18
            }}>
              {profile.full_name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 16, marginBottom: 2 }}>
                {profile.full_name || "User"}
              </div>
              <div style={{ fontSize: 13, color: "#64748b" }}>
                ID: #{user?.id || "--"}
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, marginBottom: 12, color: "#64748b", fontWeight: 600 }}>
              Contact Info
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <FiMail style={{ color: "#0284c7", width: 18, height: 18, flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: "#374151", overflow: "hidden", textOverflow: "ellipsis" }}>
                {profile.email || "--"}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <FiPhone style={{ color: "#16a34a", width: 18, height: 18, flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: "#374151" }}>
                {profile.phone || "--"}
              </span>
            </div>
          </div>

          <hr style={{ 
            margin: "20px -4px", 
            border: "none", 
            height: 1, 
            background: "linear-gradient(to right, transparent, #e2e8f0, transparent)" 
          }} />

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
              color: "#dc2626", 
              border: "1px solid #fecaca", 
              borderRadius: 14,
              padding: "14px 20px", 
              fontWeight: 600, 
              fontSize: 15,
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: 10,
              cursor: "pointer", 
              transition: "all 0.25s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#fecaca";
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 8px 25px rgba(220, 38, 38, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)";
              e.target.style.transform = "none";
              e.target.style.boxShadow = "none";
            }}
          >
            <FiLogOut style={{ width: 18, height: 18 }} /> Sign Out
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
