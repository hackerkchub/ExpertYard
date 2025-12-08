// src/apps/expert/components/ExpertTopbar.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  TopbarWrap,
  LeftBlock,
  Brand,
  SearchWrap,
  SearchRow,
  SearchBox,
  SearchFilters,
  FilterChip,
  RightActions,
  IconBtn,
  CreateBtn,
  ProfileImg,
  UnreadDot,
} from "../styles/Topbar.styles";

import { FiBell, FiMessageSquare, FiMenu, FiPlus } from "react-icons/fi";
import Logo from "../../../assets/logo.png";
import NotificationPopover from "./NotificationPopover";
import ProfileDropdown from "./ProfileDropdown";
import SearchSuggestions from "./SearchSuggestions";

import useDebounce from "../hooks/useDebounce";
import { useNotifications } from "../hooks/useNotifications";
import { useNavigate } from "react-router-dom";


// helper to build mock search suggestions
const buildMockSuggestions = (term) => {
  const base = term.trim();
  if (!base) return [];

  return [
    {
      id: 1,
      label: `Client: Rahul Verma`,
      meta: "3 sessions · Career Advice",
      type: "client",
      typeLabel: "Client",
    },
    {
      id: 2,
      label: `Report: ${base} – Monthly Summary`,
      meta: "Report · Created yesterday",
      type: "report",
      typeLabel: "Report",
    },
    {
      id: 3,
      label: `Client: Neha Sharma`,
      meta: "2 sessions · Parenting",
      type: "client",
      typeLabel: "Client",
    },
  ];
};


export default function ExpertTopbar({ setMobileOpen }) {
  const navigate = useNavigate();

  // Dummy user for now (in future use AuthContext)
  const user = {
    name: "Dr. Sharma",
    role: "Expert · Career Coach",
    avatar: "https://i.pravatar.cc/40?img=12",
  };

  /* ------------------------------------------------
     LOGOUT ACTION
     redirect → expert/register
  ------------------------------------------------ */
  const handleLogout = () => {
    // TODO: clear authentication tokens here
    localStorage.removeItem("expert_id");
    sessionStorage.clear();

    navigate("/expert/register");
  };

  const handleAvatarChange = (file) => {
    // TODO: upload to server and update avatar URL
    console.log("Avatar file selected:", file);
  };


  /* ------------------------------------------------
     Notifications
  ------------------------------------------------ */
  const {
    notifications,
    unreadCount,
    markAllRead,
    acceptRequest,
    declineRequest,
  } = useNotifications();

  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // close popups on outside click
  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);


  /* ------------------------------------------------
     Search state
  ------------------------------------------------ */
  const [filter, setFilter] = useState("all"); // all | clients | reports
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (!debouncedTerm.trim()) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);

    // fake API timeout – replace with real fetch later
    const t = setTimeout(() => {
      const all = buildMockSuggestions(debouncedTerm);
      const filtered =
        filter === "all"
          ? all
          : all.filter((s) =>
              s.type === (filter === "clients" ? "client" : "report")
            );

      setSuggestions(filtered);
      setLoadingSuggestions(false);
      setShowSuggestions(true);
    }, 200);

    return () => clearTimeout(t);
  }, [debouncedTerm, filter]);


  const handleSuggestionSelect = (s) => {
    setSearchTerm(s.label);
    setShowSuggestions(false);

    if (s.type === "client") {
      navigate("/expert/clients");
    } else if (s.type === "report") {
      navigate("/expert/reports");
    }
  };


  return (
    <TopbarWrap>
      {/* LEFT: Menu + Brand + Search */}
      <LeftBlock>
        {/* mobile menu */}
        <IconBtn
          onClick={() => setMobileOpen((prev) => !prev)}
          className="mobile-only"
        >
          <FiMenu />
        </IconBtn>

        {/* Logo */}
        <Brand>
          <img src={Logo} alt="ExpertYard" />
          ExpertYard
        </Brand>

        {/* Search */}
        <SearchWrap ref={searchRef}>
          <SearchRow>
            <SearchBox
              placeholder="Search clients, or reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowSuggestions(true);
              }}
            />
          </SearchRow>

          <SearchFilters>
            <FilterChip
              active={filter === "all"}
              onClick={() => setFilter("all")}
            >
              All
            </FilterChip>

            <FilterChip
              active={filter === "clients"}
              onClick={() => setFilter("clients")}
            >
              Clients
            </FilterChip>

            <FilterChip
              active={filter === "reports"}
              onClick={() => setFilter("reports")}
            >
              Reports
            </FilterChip>
          </SearchFilters>

          {showSuggestions && (
            <SearchSuggestions
              suggestions={suggestions}
              loading={loadingSuggestions}
              onSelect={handleSuggestionSelect}
            />
          )}
        </SearchWrap>
      </LeftBlock>

      {/* RIGHT: icons + create + profile */}
      <RightActions>
        {/* Notifications */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <IconBtn
            onClick={() => setShowNotif((prev) => !prev)}
            aria-label="Notifications"
          >
            <FiBell />
            {unreadCount > 0 && <UnreadDot />}
          </IconBtn>

          {showNotif && (
            <NotificationPopover
              notifications={notifications}
              unreadCount={unreadCount}
              markAllRead={markAllRead}
              onAccept={acceptRequest}
              onDecline={declineRequest}
            />
          )}
        </div>

        {/* Messages */}
        <IconBtn aria-label="Messages">
          <FiMessageSquare />
        </IconBtn>

        {/* Create New */}
        <CreateBtn>
          <FiPlus /> Create New
        </CreateBtn>

        {/* Profile Dropdown */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <ProfileImg onClick={() => setShowProfile((prev) => !prev)}>
            <img src={user.avatar} alt={user.name} />
          </ProfileImg>

          {showProfile && (
            <ProfileDropdown
              user={user}
              onLogout={handleLogout}
              onAvatarChange={handleAvatarChange}
            />
          )}
        </div>
      </RightActions>
    </TopbarWrap>
  );
}
