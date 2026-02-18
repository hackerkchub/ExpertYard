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
  MobileMenuOverlay,
  MobileMenu,
  MobileMenuHeader,
  MobileMenuTitle,
  MobileMenuSubtitle,
  MobileNavList,
  MobileNavItem,
  MobileNavIcon,
  MobileSectionTitle,
  PopoverContainer,        // ✅ NEW
  ProfileDropdownContainer 
} from "../styles/Topbar.styles"; // ✅ REMOVED SearchSuggestions

import { FiBell, FiMessageSquare, FiMenu, FiPlus, FiHome, FiFileText, FiCalendar, FiBarChart2, FiSettings, FiX } from "react-icons/fi";
import Logo from "../../../assets/logo.png";
import NotificationPopover from "./NotificationPopover";
import ProfileDropdown from "./ProfileDropdown";

import useDebounce from "../hooks/useDebounce";
import { useExpertNotifications } from "../context/ExpertNotificationsContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useExpert } from "../../../shared/context/ExpertContext";
import { socket } from "../../../shared/api/socket";

const DEFAULT_AVATAR = "https://i.pravatar.cc/40?img=12";

export default function ExpertTopbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { expertData, logoutExpert } = useExpert();

  const user = {
    name: expertData?.name || "Expert",
    role: expertData?.position || "Expert",
    avatar: expertData?.profile_photo || DEFAULT_AVATAR,
  };

  // STATES
  const [showNotif, setShowNotif] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  // NOTIFICATIONS HOOK
 const {
  notifications,
  unreadCount,
  acceptNotification,
  rejectNotification,
  removeById,
} = useExpertNotifications();

  // LOGOUT
  const handleLogout = () => {
  try {
    // 🧠 1️⃣ socket disconnect (VERY IMPORTANT)
    if (socket?.connected) {
      socket.disconnect();
    }

    // 🧹 2️⃣ clear storage
    localStorage.clear();
    sessionStorage.clear();

    // 🧠 3️⃣ reset expert context
    logoutExpert();

    // 🚀 4️⃣ redirect
    navigate("/expert/register", { replace: true });

    // 💣 5️⃣ optional hard reload (recommended for realtime apps)
    setTimeout(() => {
      window.location.reload();
    }, 50);

  } catch (err) {
    console.error("Logout error:", err);
  }
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

useEffect(() => {
  const handleConnected = ({ callId }) => {
    setShowNotif(false);

    if (!location.pathname.includes("/expert/voice-call/")) {
      navigate(`/expert/voice-call/${callId}`);
    }
  };

  const handleEnded = () => {
    setShowNotif(false);
  };

  socket.on("call:connected", handleConnected);
  socket.on("call:ended", handleEnded);

  return () => {
    socket.off("call:connected", handleConnected);
    socket.off("call:ended", handleEnded);
  };
}, [navigate, location.pathname]);

useEffect(() => {
  const handler = (e) => {
    navigate(`/expert/voice-call/${e.detail}`);
  };

  window.addEventListener("go_to_call_page", handler);
  return () => window.removeEventListener("go_to_call_page", handler);
}, [navigate]);


  // MOBILE MENU CLOSE ON ROUTE CHANGE
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // SEARCH STATES (KEEP FOR FUTURE)
  const [searchTerm, setSearchTerm] = useState("");

  // MOBILE NAV ITEMS
  const mobileNavItems = [
    { icon: FiHome, label: "Dashboard", path: "/expert" },
    { icon: FiFileText, label: "My Content", path: "/expert/my-content" },
    { icon: FiCalendar, label: "Calendar", path: "/expert/calendar" },
    { icon: FiBarChart2, label: "Earnings", path: "/expert/earnings" },
    { icon: FiSettings, label: "Settings", path: "/expert/settings" },
  ];

  const isActivePath = (path) => location.pathname === path;
const hasRingingCall = notifications.some(
  (n) => n.type === "voice_call" && n.status === "ringing"
);

  return (
    <>
      <TopbarWrap>
        <LeftBlock>
          {/* MOBILE HAMBURGER */}
          <IconBtn 
            onClick={() => setMobileMenuOpen(true)}
            className="mobile-only"
            title="Menu"
          >
            <FiMenu />
          </IconBtn>

          <Brand onClick={() => navigate("/expert")}>
            <img src={Logo} alt="ExpertYard" />
            ExpertYard
          </Brand>

          {/* DESKTOP SEARCH - SIMPLIFIED */}
          <SearchWrap ref={searchRef}>
            <SearchRow>
              <SearchBox
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchRow>
          </SearchWrap>
        </LeftBlock>

        <RightActions>
          {/* NOTIFICATIONS */}
          <div ref={notifRef} style={{ position: "relative" }}>
            <IconBtn onClick={() => setShowNotif(p => !p)} title="Notifications">
  <FiBell />
  {hasRingingCall && <UnreadDot />}
</IconBtn>

           {showNotif && (
 <NotificationPopover
  notifications={notifications}
  unreadCount={unreadCount}
  acceptNotification={(n) => {
    acceptNotification(n);
    setShowNotif(false);
  }}
  rejectNotification={(n) => {
    rejectNotification(n);
    setShowNotif(false);
  }}
  removeById={removeById}
/>


)}

          </div>

          {/* CHATS */}
          <IconBtn onClick={() => navigate("/expert/chat-history")} title="Messages">
            <FiMessageSquare />
          </IconBtn>

          {/* CREATE */}
          <CreateBtn onClick={() => navigate("/expert/my-content?mode=create")}>
            <FiPlus /> Create
          </CreateBtn>

          {/* PROFILE */}
          <div ref={profileRef} style={{ position: "relative" }}>
            <ProfileImg onClick={() => setShowProfile(p => !p)} title="Profile">
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

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <MobileMenuOverlay 
          open={mobileMenuOpen} 
          onClick={() => setMobileMenuOpen(false)} 
        />
      )}

      {/* MOBILE MENU */}
      <MobileMenu open={mobileMenuOpen}>
        <MobileMenuHeader>
          <MobileMenuTitle>ExpertYard</MobileMenuTitle>
          <MobileMenuSubtitle>Manage your account</MobileMenuSubtitle>
        </MobileMenuHeader>

        <MobileNavList>
          {mobileNavItems.map(({ icon: Icon, label, path }) => (
            <MobileNavItem
              key={path}
              onClick={() => {
                navigate(path);
                setMobileMenuOpen(false);
              }}
              className={isActivePath(path) ? 'active' : ''}
            >
              <MobileNavIcon>
                <Icon />
              </MobileNavIcon>
              {label}
            </MobileNavItem>
          ))}
        </MobileNavList>

        <MobileSectionTitle>Quick Actions</MobileSectionTitle>
        
        <MobileNavList style={{ paddingBottom: '24px' }}>
          <MobileNavItem
            onClick={() => {
              navigate("/expert/chat-history");
              setMobileMenuOpen(false);
            }}
          >
            <MobileNavIcon>
              <FiMessageSquare />
            </MobileNavIcon>
            Messages
          </MobileNavItem>
          
          <MobileNavItem
            onClick={() => {
              navigate("/expert/my-content?mode=create");
              setMobileMenuOpen(false);
            }}
          >
            <MobileNavIcon>
              <FiPlus />
            </MobileNavIcon>
            Create Content
          </MobileNavItem>
        </MobileNavList>
      </MobileMenu>
    </>
  );
}
