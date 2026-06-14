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
  ProfileDropdownContainer 
} from "../styles/Topbar.styles";

import { 
  FiBell, 
  FiMessageSquare, 
  FiMenu, 
  FiPlus, 
  FiHome, 
  FiFileText, 
  FiCalendar, 
  FiBarChart2, 
  FiSettings, 
  FiX, 
  FiClock, 
  FiDollarSign, 
  FiLogOut, 
  FiUser, 
  FiShare2
} from "react-icons/fi";
import Logo from "../../../assets/logo.webp";
import NotificationPopover from "./NotificationPopover";
import ProfileDropdown from "./ProfileDropdown";

import useDebounce from "../hooks/useDebounce";
import { useExpertNotifications } from "../context/ExpertNotificationsContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useExpert } from "../../../shared/context/ExpertContext";
import { socket, disconnectSocket } from "../../../shared/api/socket";
import { getChatRoomCandidates, getChatRoomId } from "../../../shared/utils/chatRoom";

const DEFAULT_AVATAR = "https://i.pravatar.cc/40?img=12";
const FINAL_STATES = ["missed", "rejected", "ended", "low_balance", "cancelled"];

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

  // SHARE REFERRAL FUNCTION
  const handleShareReferral = async () => {
    if (!expertData?.referral_code) {
      alert("Referral code not found");
      return;
    }

    const referralLink = `${window.location.origin}/expert/register?ref=${expertData.referral_code}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join G9Expert as Expert",
          text: "Join G9Expert using my referral link and start earning.",
          url: referralLink
        });
      } else {
        await navigator.clipboard.writeText(referralLink);
        alert("Referral link copied!");
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error sharing referral:", err);
        alert("Failed to share. Please try again.");
      }
    }
  };

  // LOGOUT
  const handleLogout = async () => {
    try {
      disconnectSocket();
      localStorage.setItem("last_panel", "expert");
      await logoutExpert();
      navigate("/expert/register", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // CHAT REDIRECT
  useEffect(() => {
    const onChatStarted = (data = {}) => {
      const room_id = getChatRoomId(data);
      if (!room_id) return;

      console.log("🚀 Topbar redirecting to chat:", room_id);
      navigate(`/expert/chat/${room_id}`, {
        state: { roomCandidates: getChatRoomCandidates(data) },
      });
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

  // COMPLETE MOBILE NAV ITEMS (Same as Sidebar)
  const mobileNavItems = [
    { icon: FiHome, label: "Dashboard", path: "/expert", exact: true },
    { icon: FiFileText, label: "My Content", path: "/expert/my-content" },
    { icon: FiMessageSquare, label: "Chat History", path: "/expert/chat-history" },
    { icon: FiBarChart2, label: "Earnings", path: "/expert/earnings" },
    { icon: FiBell, label: "My Service", path: "/expert/myservices" },
    { icon: FiClock, label: "G9-Plan", path: "/expert/g9-plan" },
  ];

  const isActivePath = (path) => {
    if (path === "/expert") {
      return location.pathname === "/expert";
    }
    return location.pathname.startsWith(path);
  };

  const hasUnreadChat = notifications.some(
    n => n.type === "chat_request" && n.unread && !FINAL_STATES.includes(n.status)
  );

  const hasRingingCall = notifications.some(
    n => n.type === "voice_call" && n.status === "ringing"
  );

  return (
    <>
      <TopbarWrap className="main-app-topbar">
        <LeftBlock>
          {/* MOBILE HAMBURGER */}
          <IconBtn 
            onClick={() => setMobileMenuOpen(true)}
            className="mobile-only"
            title="Menu"
          >
            <FiMenu />
          </IconBtn>

          {/* BRAND - ONLY LOGO, NO TEXT */}
          <Brand onClick={() => navigate("/expert")}>
            <img src={Logo} alt="G9Expert" />
          </Brand>
        </LeftBlock>

        <RightActions>
          {/* NOTIFICATIONS */}
          <div ref={notifRef} style={{ position: "relative" }}>
            <IconBtn onClick={() => setShowNotif(p => !p)} title="Notifications">
              <FiBell />
              {(hasUnreadChat || hasRingingCall) && <UnreadDot />}
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

          {/* SHARE REFERRAL BUTTON */}
          <IconBtn
            onClick={handleShareReferral}
            title="Refer Expert"
          >
            <FiShare2 />
          </IconBtn>

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

      {/* MOBILE MENU - Enhanced with complete sidebar navigation */}
      <MobileMenu open={mobileMenuOpen}>
        <MobileMenuHeader>
          <MobileMenuTitle>Expert Panel</MobileMenuTitle>
          <MobileMenuSubtitle>{user.name}</MobileMenuSubtitle>
        </MobileMenuHeader>

        {/* Main Navigation */}
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

        <MobileSectionTitle>Account</MobileSectionTitle>
        
        <MobileNavList style={{ paddingBottom: '24px' }}>
          {/* REFERRAL EXPERT IN MOBILE MENU */}
          <MobileNavItem
            onClick={() => {
              handleShareReferral();
              setMobileMenuOpen(false);
            }}
          >
            <MobileNavIcon>
              <FiShare2 />
            </MobileNavIcon>
            Refer Expert
          </MobileNavItem>

          <MobileNavItem
            onClick={() => {
              navigate("/expert/profile");
              setMobileMenuOpen(false);
            }}
          >
            <MobileNavIcon>
              <FiUser />
            </MobileNavIcon>
            Profile
          </MobileNavItem>
          
          <MobileNavItem
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
          >
            <MobileNavIcon>
              <FiLogOut />
            </MobileNavIcon>
            Logout
          </MobileNavItem>
        </MobileNavList>
      </MobileMenu>
    </>
  );
}
