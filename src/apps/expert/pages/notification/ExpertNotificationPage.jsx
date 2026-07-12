import React, { useMemo, useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  FiBell,
  FiCheckCircle,
  FiMessageCircle,
  FiPhone,
  FiSettings,
  FiTrash2,
  FiMoreHorizontal,
  FiCheck,
} from "react-icons/fi";
import { useExpertNotifications } from "./../../context/ExpertNotificationsContext";

const FILTERS = ["all", "call", "chat", "system"];

const iconMap = {
  call: { icon: <FiPhone />, color: "#16a34a", bg: "#dcfce7" },
  chat: { icon: <FiMessageCircle />, color: "#2563eb", bg: "#dbeafe" },
  system: { icon: <FiSettings />, color: "#d97706", bg: "#fef3c7" },
  default: { icon: <FiBell />, color: "#475569", bg: "#e2e8f0" },
};

const PageWrap = styled.main`
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  background-color: #f3f2ef; /* LinkedIn Gray */
  padding: 24px 16px 64px;

  @media (max-width: 768px) {
    padding: 0 0 44px;
  }
`;

const Container = styled.div`
  max-width: 1128px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 225px 1fr;
  gap: 24px;

  @media (max-width: 991px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const SidebarCard = styled.div`
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e0dfdc;
  padding: 16px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 12px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #191919;
  }

  p {
    margin: 0;
    font-size: 13px;
    color: #666666;
    line-height: 1.4;
  }

  @media (max-width: 991px) {
    display: none;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const HeaderCard = styled.div`
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e0dfdc;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    border-radius: 0;
    border-left: none;
    border-right: none;
    padding: 16px;
    flex-direction: column;
    align-items: stretch;
  }
`;

const TitleBlock = styled.div`
  min-width: 0;
`;

const Title = styled.h1`
  margin: 0;
  color: #191919;
  font-size: 20px;
  font-weight: 600;
`;

const Sub = styled.p`
  margin: 4px 0 0;
  color: #666666;
  font-size: 13px;
`;

const MarkAllBtn = styled.button`
  background: none;
  border: none;
  color: #0a66c2;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(10, 102, 194, 0.08);
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    align-self: flex-start;
    padding-left: 0;
  }
`;

const FilterBar = styled.nav`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 0 8px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const FilterChip = styled.button`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid ${({ $active }) => ($active ? "#057642" : "#5e5e5e")};
  background: ${({ $active }) => ($active ? "#057642" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#5e5e5e")};
  cursor: pointer;
  transition: all 0.2s;
  text-transform: capitalize;

  &:hover {
    background: ${({ $active }) => ($active ? "#046237" : "#f3f2ef")};
    color: ${({ $active }) => ($active ? "#ffffff" : "#191919")};
  }
`;

const NotificationListCard = styled.div`
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e0dfdc;
  overflow: hidden;

  @media (max-width: 768px) {
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
`;

const NotificationItem = styled.div`
  display: grid;
  grid-template-columns: 48px 1fr auto;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid #e0dfdc;
  background: ${({ $read }) => ($read ? "#ffffff" : "#f4f7f9")};
  position: relative;
  transition: background-color 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ $read }) => ($read ? "#f9f9f9" : "#eef3f8")};
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    gap: 12px;
    grid-template-columns: 40px 1fr auto;
  }
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 48px;
  height: 48px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e0dfdc;
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
  font-size: 20px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const BadgeIcon = styled.div`
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: ${({ $bg }) => $bg};
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  border: 1.5px solid #ffffff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
`;

const ItemContent = styled.div`
  min-width: 0;
`;

const HeadingRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
`;

const Heading = styled.h2`
  margin: 0;
  color: #191919;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
`;

const TimeText = styled.span`
  font-size: 12px;
  color: #666666;
`;

const MessageText = styled.p`
  margin: 4px 0 0;
  color: #191919;
  font-size: 13.5px;
  line-height: 1.45;
  overflow-wrap: anywhere;
  word-break: break-word;
`;

const MetaRow = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 12px;
  background: #f3f2ef;
  color: #666666;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
`;

const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
`;

const UnreadDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #0a66c2;
  flex-shrink: 0;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #666666;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
    color: #191919;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  top: 36px;
  background: #ffffff;
  border: 1px solid #e0dfdc;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 10;
  min-width: 160px;
  overflow: hidden;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 10px 16px;
  background: none;
  border: none;
  text-align: left;
  font-size: 13px;
  color: ${({ $danger }) => ($danger ? "#d11a2a" : "#191919")};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f2ef;
  }

  svg {
    font-size: 14px;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  background: #ffffff;
`;

const EmptyIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #f3f2ef;
  color: #666666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #191919;
`;

const EmptyText = styled.p`
  margin: 8px 0 0;
  font-size: 14px;
  color: #666666;
  max-width: 320px;
`;

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
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(timestamp));
};

const isRead = (notification) =>
  !notification?.unread || notification?.is_read === 1 || notification?.is_read === true;

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
        <SidebarCard>
          <h3>Notifications settings</h3>
          <p>You can customize notifications related to incoming calls, customer chats, and marketing campaigns in your settings panel.</p>
        </SidebarCard>

        <MainContent>
          <HeaderCard>
            <TitleBlock>
              <Title>Notifications</Title>
              <Sub>You have {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}</Sub>
            </TitleBlock>

            {unreadCount > 0 && (
              <MarkAllBtn onClick={markAllRead}>
                <FiCheckCircle size={16} />
                <span>Mark all as read</span>
              </MarkAllBtn>
            )}
          </HeaderCard>

          <FilterBar aria-label="Notification filters">
            {FILTERS.map((item) => (
              <FilterChip
                key={item}
                type="button"
                $active={filter === item}
                onClick={() => setFilter(item)}
              >
                {item}
              </FilterChip>
            ))}
          </FilterBar>

          <NotificationListCard>
            {filtered.length === 0 ? (
              <EmptyState>
                <EmptyIcon>
                  <FiBell />
                </EmptyIcon>
                <EmptyTitle>No notifications yet</EmptyTitle>
                <EmptyText>
                  Incoming call updates, text messages, and alerts will appear here.
                </EmptyText>
              </EmptyState>
            ) : (
              filtered.map((notification) => {
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

                return (
                  <NotificationItem
                    key={notification.id}
                    $read={read}
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
                        <TimeText>• {time}</TimeText>
                      </HeadingRow>
                      {message && <MessageText>{message}</MessageText>}

                      <MetaRow>
                        {notification.senderName && (
                          <StatusPill>{notification.senderName}</StatusPill>
                        )}
                        {notification.status && (
                          <StatusPill>{notification.status}</StatusPill>
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
        </MainContent>
      </Container>
    </PageWrap>
  );
}
