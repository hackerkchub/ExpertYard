// ExpertNotificationPage.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import {
  FiBell,
  FiCheckCircle,
  FiMessageCircle,
  FiPhone,
  FiSettings,
  FiTrash2,
  FiMoreHorizontal,
  FiCheck,
  FiClock,
  FiUser,
  FiInbox,
  FiMail,
  FiAlertCircle,
  FiX
} from "react-icons/fi";
import { useExpertNotifications } from "./../../context/ExpertNotificationsContext";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "call", label: "Calls" },
  { id: "chat", label: "Chats" },
  { id: "system", label: "System" }
];

const iconMap = {
  call: { icon: <FiPhone />, color: "#16a34a", bg: "#dcfce7", label: "Call" },
  chat: { icon: <FiMessageCircle />, color: "#2563eb", bg: "#dbeafe", label: "Chat" },
  system: { icon: <FiSettings />, color: "#d97706", bg: "#fef3c7", label: "System" },
  default: { icon: <FiBell />, color: "#475569", bg: "#e2e8f0", label: "Notification" },
};

// ===== STYLED COMPONENTS =====

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageWrap = styled.main`
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  background-color: #f8fafc;
  padding: 24px 24px 80px;

  @media (max-width: 768px) {
    padding: 0 0 80px;
  }
`;

const Container = styled.div`
  max-width: 1128px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

// ===== HERO HEADER =====
const HeroHeader = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 22px;
  padding: 28px 32px;
  margin-bottom: 24px;
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  border: 1px solid rgba(226, 232, 240, 0.5);

  @media (max-width: 768px) {
    border-radius: 0;
    padding: 20px 16px;
    margin-bottom: 16px;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

const HeroLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const HeroIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #000080, #1a1a6e);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffd23f;
  font-size: 24px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
`;

const HeroContent = styled.div`
  h1 {
    margin: 0;
    font-size: 22px;
    font-weight: 700;
    color: #0a1628;
    letter-spacing: -0.3px;

    @media (max-width: 768px) {
      font-size: 18px;
    }
  }

  p {
    margin: 4px 0 0;
    font-size: 14px;
    color: #64748b;
    line-height: 1.5;

    @media (max-width: 768px) {
      font-size: 13px;
    }
  }
`;

const HeroActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const MarkAllBtn = styled.button`
  background: #000080;
  border: none;
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 128, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 128, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 12px;
    width: 100%;
    justify-content: center;
  }
`;

// ===== INFO CARD (Replaces Sidebar) =====
const InfoCard = styled.div`
  background: #ffffff;
  border-radius: 14px;
  padding: 14px 20px;
  margin-bottom: 20px;
  border: 1px solid #e8edf4;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
  display: flex;
  align-items: center;
  gap: 14px;
  height: 70px;

  .icon {
    font-size: 22px;
    color: #000080;
    flex-shrink: 0;
  }

  .info-content {
    display: flex;
    flex-direction: column;

    .info-title {
      font-size: 14px;
      font-weight: 600;
      color: #0a1628;
    }

    .info-desc {
      font-size: 12px;
      color: #64748b;
      margin: 0;
    }
  }

  @media (max-width: 768px) {
    border-radius: 0;
    margin-bottom: 12px;
    padding: 12px 16px;
    height: auto;
  }
`;

// ===== FILTER CHIPS =====
const FilterBar = styled.nav`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding: 0 4px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    padding: 0 16px;
    gap: 8px;
    margin-bottom: 16px;
  }
`;

const FilterChip = styled.button`
  padding: 10px 24px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  border: 2px solid ${({ $active }) => ($active ? "#000080" : "#e8edf4")};
  background: ${({ $active }) => ($active ? "#000080" : "#f8fafc")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#64748b")};
  cursor: pointer;
  transition: all 0.25s ease;
  text-transform: capitalize;
  letter-spacing: 0.2px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 128, 0.1);
    border-color: ${({ $active }) => ($active ? "#000080" : "#cbd5e1")};
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 12px;
    flex: 1;
    text-align: center;
    min-width: 60px;
  }
`;

const FilterCount = styled.span`
  display: inline-block;
  background: ${({ $active }) => ($active ? "rgba(255,255,255,0.2)" : "#e8edf4")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#64748b")};
  padding: 0 8px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  margin-left: 6px;
  line-height: 20px;
`;

// ===== NOTIFICATION LIST =====
const NotificationListCard = styled.div`
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid #e8edf4;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);

  @media (max-width: 768px) {
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
`;

const NotificationItem = styled.div`
  display: grid;
  grid-template-columns: 56px 1fr auto;
  gap: 20px;
  padding: 20px 24px;
  border-bottom: 1px solid #f1f5f9;
  background: ${({ $read }) => ($read ? "#ffffff" : "#f8faff")};
  position: relative;
  transition: all 0.25s ease;
  animation: ${fadeInUp} 0.3s ease forwards;
  animation-delay: ${({ $index }) => `${$index * 0.05}s`};
  opacity: 0;
  border-left: 4px solid ${({ $read }) => ($read ? "transparent" : "#000080")};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ $read }) => ($read ? "#f8fafc" : "#f0f4ff")};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
    position: relative;
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: 16px;
    gap: 14px;
    grid-template-columns: 44px 1fr auto;
  }
`;

// ===== AVATAR =====
const AvatarContainer = styled.div`
  position: relative;
  width: 56px;
  height: 56px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #f1f5f9;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
`;

const AvatarFallback = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: ${({ $bg }) => $bg || "#e2e8f0"};
  color: ${({ $color }) => $color || "#475569"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  border: 2px solid #f1f5f9;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const BadgeIcon = styled.div`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 22px;
  height: 22px;
  border-radius: 10px;
  background: ${({ $bg }) => $bg};
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);

  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
    font-size: 9px;
  }
`;

// ===== CONTENT =====
const ItemContent = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HeadingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const Heading = styled.h2`
  margin: 0;
  color: #0a1628;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.2px;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const TimeText = styled.span`
  font-size: 13px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 14px;
    height: 14px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const MessageText = styled.p`
  margin: 0;
  color: #4b5563;
  font-size: 14px;
  line-height: 1.6;
  overflow-wrap: anywhere;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

// ===== META ROW =====
const MetaRow = styled.div`
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const MetaPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 100px;
  background: ${({ $bg }) => $bg || "#f1f5f9"};
  color: ${({ $color }) => $color || "#475569"};
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;

  svg {
    width: 14px;
    height: 14px;
  }

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 3px 10px;
  }
`;

// ===== ACTION WRAPPER =====
const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
`;

const UnreadDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #000080;
  flex-shrink: 0;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  @media (max-width: 768px) {
    width: 8px;
    height: 8px;
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;

  &:hover {
    background-color: #f1f5f9;
    color: #0a1628;
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`;

// ===== DROPDOWN =====
const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: 44px;
  background: #ffffff;
  border: 1px solid #e8edf4;
  border-radius: 14px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
  z-index: 100;
  min-width: 200px;
  overflow: hidden;
  animation: ${slideDown} 0.2s ease;

  @media (max-width: 768px) {
    right: -10px;
    min-width: 180px;
  }
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  font-size: 13px;
  font-weight: 500;
  color: ${({ $danger }) => ($danger ? "#ef4444" : "#0a1628")};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8fafc;
  }

  svg {
    font-size: 16px;
    color: ${({ $danger }) => ($danger ? "#ef4444" : "#64748b")};
  }

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 12px;
  }
`;

// ===== EMPTY STATE =====
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;
  background: #ffffff;

  .icon {
    font-size: 56px;
    margin-bottom: 16px;
    display: block;
  }

  h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #0a1628;
  }

  p {
    margin: 8px 0 0;
    font-size: 14px;
    color: #64748b;
    max-width: 360px;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    padding: 40px 20px;

    .icon {
      font-size: 40px;
    }

    h3 {
      font-size: 17px;
    }

    p {
      font-size: 13px;
    }
  }
`;

// ===== HELPER FUNCTIONS =====
const getIconKey = (type = "") => {
  const value = String(type).toLowerCase();
  if (value.includes("chat")) return "chat";
  if (value.includes("call")) return "call";
  if (value.includes("system")) return "system";
  return "default";
};

const getMessage = (notification) => {
  const message = notification?.message || notification?.meta || "";
  if (typeof message === "string") return message;
  if (message && typeof message === "object") {
    return message.body || message.message || JSON.stringify(message);
  }
  return "";
};

const formatTime = (value) => {
  const timestamp = typeof value === "number" ? value : new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "";
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(timestamp));
};

const isRead = (notification) =>
  !notification?.unread || notification?.is_read === 1 || notification?.is_read === true;

// ===== MAIN COMPONENT =====
export default function ExpertNotificationPage() {
  const {
    notifications = [],
    unreadCount,
    onNotificationTap,
    markAsRead,
    removeById,
    markAllRead,
  } = useExpertNotifications();
  
  const [filter, setFilter] = useState("all");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Get counts for each filter
  const getFilterCount = (filterType) => {
    const rows = Array.isArray(notifications) ? notifications : [];
    if (filterType === "all") return rows.length;
    
    return rows.filter((notification) => {
      const type = String(notification.type || "").toLowerCase();
      if (filterType === "chat") return type.includes("chat");
      if (filterType === "call") return type.includes("call");
      if (filterType === "system") return !type.includes("chat") && !type.includes("call");
      return type === filterType;
    }).length;
  };

  const filtered = useMemo(() => {
    const rows = Array.isArray(notifications) ? notifications : [];
    if (filter === "all") return rows;

    return rows.filter((notification) => {
      const type = String(notification.type || "").toLowerCase();
      if (filter === "chat") return type.includes("chat");
      if (filter === "call") return type.includes("call");
      if (filter === "system") return !type.includes("chat") && !type.includes("call");
      return type === filter;
    });
  }, [filter, notifications]);

  return (
    <PageWrap>
      <Container>
        {/* HERO HEADER */}
        <HeroHeader>
          <HeroLeft>
            <HeroIcon>
              <FiBell />
            </HeroIcon>
            <HeroContent>
              <h1>Notifications</h1>
              <p>
                Stay updated with consultations, chat requests and important account alerts.
              </p>
            </HeroContent>
          </HeroLeft>
          <HeroActions>
            <MarkAllBtn 
              onClick={markAllRead} 
              disabled={unreadCount === 0}
            >
              <FiCheckCircle size={16} />
              <span>Mark all as read</span>
            </MarkAllBtn>
          </HeroActions>
        </HeroHeader>

        {/* INFO CARD - Replaces Sidebar */}
        <InfoCard>
          <span className="icon">⚙️</span>
          <div className="info-content">
            <span className="info-title">Notification Center</span>
            <p className="info-desc">
              Manage your calls, chats and system updates from one place.
            </p>
          </div>
        </InfoCard>

        {/* FILTER CHIPS */}
        <FilterBar>
          {FILTERS.map((item) => {
            const count = getFilterCount(item.id);
            const isActive = filter === item.id;
            return (
              <FilterChip
                key={item.id}
                type="button"
                $active={isActive}
                onClick={() => setFilter(item.id)}
              >
                {item.label}
                <FilterCount $active={isActive}>{count}</FilterCount>
              </FilterChip>
            );
          })}
        </FilterBar>

        {/* NOTIFICATION LIST */}
        <NotificationListCard>
          {filtered.length === 0 ? (
            <EmptyState>
              <span className="icon">🔔</span>
              <h3>You're all caught up!</h3>
              <p>
                New chat requests, consultation alerts and account updates will appear here.
              </p>
            </EmptyState>
          ) : (
            filtered.map((notification, index) => {
              const read = isRead(notification);
              const iconKey = getIconKey(notification.type);
              const iconConfig = iconMap[iconKey] || iconMap.default;
              const title = notification.title || "Alert Notification";
              const message = getMessage(notification);
              const time = formatTime(
                notification.createdAt ||
                  notification.time ||
                  notification.created_at
              );
              const isMenuOpen = activeMenuId === notification.id;
              const senderName = notification.senderName || notification.sender_name;
              const status = notification.status || notification.call_status;

              return (
                <NotificationItem
                  key={notification.id}
                  $read={read}
                  $index={index}
                  onClick={() => onNotificationTap?.(notification)}
                >
                  <AvatarContainer>
                    {notification.senderAvatar ? (
                      <AvatarImg src={notification.senderAvatar} alt="" />
                    ) : (
                      <AvatarFallback $bg={iconConfig.bg} $color={iconConfig.color}>
                        {iconConfig.icon}
                      </AvatarFallback>
                    )}
                    {notification.senderAvatar && (
                      <BadgeIcon $bg={iconConfig.color}>
                        {iconConfig.icon}
                      </BadgeIcon>
                    )}
                  </AvatarContainer>

                  <ItemContent>
                    <HeadingRow>
                      <Heading>{title}</Heading>
                      <TimeText>
                        <FiClock />
                        {time}
                      </TimeText>
                    </HeadingRow>
                    {message && <MessageText>{message}</MessageText>}

                    <MetaRow>
                      {senderName && (
                        <MetaPill $bg="#e8edf4" $color="#0a1628">
                          <FiUser size={12} />
                          {senderName}
                        </MetaPill>
                      )}
                      {status && (
                        <MetaPill $bg={iconConfig.bg} $color={iconConfig.color}>
                          {iconConfig.icon}
                          {status}
                        </MetaPill>
                      )}
                      {iconKey !== "default" && (
                        <MetaPill $bg={iconConfig.bg} $color={iconConfig.color}>
                          {iconConfig.icon}
                          {iconConfig.label}
                        </MetaPill>
                      )}
                    </MetaRow>
                  </ItemContent>

                  <ActionWrapper onClick={(e) => e.stopPropagation()}>
                    {!read && <UnreadDot />}
                    <MenuButton
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(isMenuOpen ? null : notification.id);
                      }}
                    >
                      <FiMoreHorizontal size={20} />
                    </MenuButton>

                    {isMenuOpen && (
                      <DropdownMenu ref={dropdownRef}>
                        {!read && markAsRead && (
                          <DropdownItem
                            onClick={() => {
                              markAsRead(notification.id);
                              setActiveMenuId(null);
                            }}
                          >
                            <FiCheck />
                            <span>Mark as read</span>
                          </DropdownItem>
                        )}
                        {removeById && (
                          <DropdownItem
                            $danger
                            onClick={() => {
                              removeById(notification);
                              setActiveMenuId(null);
                            }}
                          >
                            <FiTrash2 />
                            <span>Delete notification</span>
                          </DropdownItem>
                        )}
                      </DropdownMenu>
                    )}
                  </ActionWrapper>
                </NotificationItem>
              );
            })
          )}
        </NotificationListCard>
      </Container>
    </PageWrap>
  );
}