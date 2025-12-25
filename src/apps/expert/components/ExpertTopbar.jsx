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
import { useExpertNotifications } from "../context/ExpertNotificationsContext";
import { useNavigate } from "react-router-dom";
import { useExpert } from "../../../shared/context/ExpertContext";
import { socket } from "../../../shared/api/socket";

const DEFAULT_AVATAR = "https://i.pravatar.cc/40?img=12";

export default function ExpertTopbar({ setMobileOpen }) {
  const navigate = useNavigate();
  const { expertData, logoutExpert } = useExpert();

  const user = {
    name: expertData?.name || "Expert",
    role: expertData?.position || "Expert",
    avatar: expertData?.profile_photo || DEFAULT_AVATAR,
  };

  // STATES
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // ✅ NOTIFICATIONS HOOK
  const {
    notifications,
    unreadCount,
    markAllRead,
    acceptRequest,
    declineRequest,
  } = useExpertNotifications();

  // LOGOUT
  const handleLogout = () => {
    logoutExpert();
    localStorage.removeItem("expert_session");
    sessionStorage.clear();
    navigate("/expert/register", { replace: true });
  };

  // CHAT REDIRECT
  useEffect(() => {
    const onChatStarted = ({ room_id }) => {
      console.log("🚀 Topbar redirecting to chat:", room_id);
      navigate(`/expert/chat/${room_id}`);
    };

    socket.on("chat_started", onChatStarted);
    return () => socket.off("chat_started", onChatStarted);
  }, [navigate]);

  // OUTSIDE CLICK
  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // SEARCH (unchanged)
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
      setSuggestions([]);
      setLoadingSuggestions(false);
      setShowSuggestions(true);
    }, 200);

    return () => clearTimeout(t);
  }, [debouncedTerm]);

  return (
    <TopbarWrap>
      <LeftBlock>
        <IconBtn
          onClick={() => setMobileOpen(prev => !prev)}
          className="mobile-only"
        >
          <FiMenu />
        </IconBtn>

        <Brand onClick={() => navigate("/expert/dashboard")}>
          <img src={Logo} alt="ExpertYard" />
          ExpertYard
        </Brand>

        <SearchWrap ref={searchRef}>
          <SearchRow>
            <SearchBox
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchRow>
          {showSuggestions && (
            <SearchSuggestions suggestions={suggestions} loading={loadingSuggestions} />
          )}
        </SearchWrap>
      </LeftBlock>

      <RightActions>
        {/* 🔔 NOTIFICATIONS */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <IconBtn onClick={() => setShowNotif(p => !p)}>
            <FiBell />
            {unreadCount > 0 && <UnreadDot />}
          </IconBtn>
          
          {/* ✅ PROPS VERSION - MATCHES Hook */}
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

        {/* 💬 CHATS */}
        <IconBtn onClick={() => navigate("/expert/chat")}>
          <FiMessageSquare />
        </IconBtn>

        <CreateBtn onClick={() => navigate("/expert/my-content?mode=create")}>
          <FiPlus /> Create
        </CreateBtn>

        {/* <div ref={notifRef} style={{ position: "relative" }}>
        <IconBtn onClick={() => setShowNotif(p => !p)}>
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
      </div>  */}

        {/* 👤 PROFILE */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <ProfileImg onClick={() => setShowProfile(p => !p)}>
            <img
              src={user.avatar}
              alt={user.name}
              onError={(e) => (e.target.src = DEFAULT_AVATAR)}
            />
          </ProfileImg>
          {showProfile && <ProfileDropdown user={user} onLogout={handleLogout} />}
        </div>
      </RightActions>
    </TopbarWrap>
  );
}
