import React, { useEffect, useRef, useState } from "react";
import {
  TopbarWrap,
  LeftBlock,
  Brand,
  SearchWrap,
  SearchRow,
  SearchBox,
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
import { useExpert } from "../../../shared/context/ExpertContext";
import { socket } from "../../../shared/api/socket";


const DEFAULT_AVATAR = "https://i.pravatar.cc/40?img=12";

export default function ExpertTopbar({ setMobileOpen }) {
  const navigate = useNavigate();
  const { expertData, logoutExpert } = useExpert();

  // USER DATA
  const user = {
    name: expertData?.name || "Expert",
    role: expertData?.position || "Expert",
    avatar: expertData?.profile_photo || DEFAULT_AVATAR,
  };

  /* LOGOUT */
  const handleLogout = () => {
    logoutExpert();
    localStorage.removeItem("expert_session");
    sessionStorage.clear();
    navigate("/expert/register", { replace: true });
  };

  /* NOTIFICATIONS */
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
useEffect(() => {
  const onChatStarted = ({ room_id }) => {
    // Expert ko chat room me le jao
    navigate(`/expert/chat/${room_id}`);
  };

  socket.on("chat_started", onChatStarted);

  return () => {
    socket.off("chat_started", onChatStarted);
  };
}, [navigate]);

  // OUTSIDE CLICK CLOSE
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

  /* SEARCH */
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const debouncedTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (!debouncedTerm.trim()) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      setShowSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);
    const t = setTimeout(() => {
      setSuggestions([]); // 🔜 later API
      setLoadingSuggestions(false);
      setShowSuggestions(true);
    }, 200);

    return () => clearTimeout(t);
  }, [debouncedTerm]);

  /* ================= RENDER ================= */
  return (
    <TopbarWrap>
      {/* LEFT */}
      <LeftBlock>
        <IconBtn
          onClick={() => setMobileOpen((prev) => !prev)}
          className="mobile-only"
        >
          <FiMenu />
        </IconBtn>

        <Brand>
          <img src={Logo} alt="ExpertYard" />
          ExpertYard
        </Brand>

        <SearchWrap ref={searchRef}>
          <SearchRow>
            <SearchBox
              placeholder="Search clients, or reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchRow>

          {showSuggestions && (
            <SearchSuggestions
              suggestions={suggestions}
              loading={loadingSuggestions}
            />
          )}
        </SearchWrap>
      </LeftBlock>

      {/* RIGHT */}
      <RightActions>
        {/* Notifications */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <IconBtn onClick={() => setShowNotif((p) => !p)}>
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
        <IconBtn>
          <FiMessageSquare />
        </IconBtn>

        {/* CREATE POST → ONLY NAVIGATION */}
        <CreateBtn onClick={() => navigate("/expert/my-content?mode=create")}>
          <FiPlus /> Create New
        </CreateBtn>

        {/* PROFILE */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <ProfileImg onClick={() => setShowProfile((p) => !p)}>
            <img
              src={user.avatar}
              alt={user.name}
              onError={(e) => (e.target.src = DEFAULT_AVATAR)}
            />
          </ProfileImg>

          {showProfile && (
            <ProfileDropdown user={user} onLogout={handleLogout} />
          )}
        </div>
      </RightActions>
    </TopbarWrap>
  );
}
