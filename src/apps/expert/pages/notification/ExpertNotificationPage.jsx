import React, { useMemo, useState } from "react";
import styled from "styled-components";
import {
  FiBell,
  FiCheckCircle,
  FiMessageCircle,
  FiPhone,
  FiSettings,
  FiTrash2,
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
  min-height: 100%;
  width: 100%;
  overflow-x: hidden;
  background:
    linear-gradient(180deg, rgba(248, 250, 252, 0.96), rgba(241, 245, 249, 0.98)),
    #f8fafc;
  padding: 32px 24px 64px;

  @media (min-width: 1440px) {
    padding-top: 40px;
  }

  @media (max-width: 1024px) {
    padding: 28px 20px 56px;
  }

  @media (max-width: 768px) {
    padding: 22px 16px 44px;
  }

  @media (max-width: 390px) {
    padding: 18px 12px 36px;
  }
`;

const Container = styled.section`
  width: min(100%, 980px);
  margin: 0 auto;

  @media (min-width: 1440px) {
    width: min(100%, 1040px);
  }

  @media (max-width: 1024px) {
    width: min(100%, 900px);
  }
`;

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 18px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
  }
`;

const TitleBlock = styled.div`
  min-width: 0;
`;

const Title = styled.h1`
  margin: 0;
  color: #0f172a;
  font-size: 30px;
  line-height: 1.2;
  font-weight: 800;

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 360px) {
    font-size: 22px;
  }
`;

const Sub = styled.p`
  margin: 8px 0 0;
  color: #64748b;
  font-size: 14px;
  line-height: 1.5;

  @media (max-width: 360px) {
    font-size: 13px;
  }
`;

const MarkAllBtn = styled.button`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 9px 14px;
  border: 1px solid #0f172a;
  border-radius: 8px;
  background: #0f172a;
  color: #ffffff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background: #1e293b;
    border-color: #1e293b;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Count = styled.span`
  min-width: 22px;
  height: 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 7px;
  border-radius: 999px;
  background: #ef4444;
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
`;

const FilterBar = styled.nav`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const FilterBtn = styled.button`
  min-height: 36px;
  padding: 8px 14px;
  border: 1px solid ${({ $active }) => ($active ? "#2563eb" : "#dbe3ee")};
  border-radius: 999px;
  background: ${({ $active }) => ($active ? "#eff6ff" : "#ffffff")};
  color: ${({ $active }) => ($active ? "#1d4ed8" : "#475569")};
  cursor: pointer;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  &:hover {
    background: #f8fafc;
    border-color: #93c5fd;
    color: #1d4ed8;
  }

  @media (max-width: 768px) {
    flex: 1 1 calc(50% - 8px);
  }

  @media (max-width: 360px) {
    padding-inline: 10px;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const NotificationCard = styled.article`
  position: relative;
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr) auto;
  align-items: start;
  gap: 14px;
  padding: 16px 18px;
  border: 1px solid ${({ $read }) => ($read ? "#e2e8f0" : "#bfdbfe")};
  border-left: 4px solid ${({ $read }) => ($read ? "transparent" : "#2563eb")};
  border-radius: 8px;
  background: ${({ $read }) => ($read ? "#ffffff" : "#f8fbff")};
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
  cursor: ${({ $clickable }) => ($clickable ? "pointer" : "default")};
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  min-width: 0;

  &:hover {
    border-color: ${({ $read }) => ($read ? "#cbd5e1" : "#93c5fd")};
    box-shadow: 0 14px 34px rgba(15, 23, 42, 0.1);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    grid-template-columns: 44px minmax(0, 1fr);
    gap: 12px;
    padding: 14px;
  }

  @media (max-width: 390px) {
    grid-template-columns: 40px minmax(0, 1fr);
    padding: 12px;
    gap: 10px;
  }

  @media (max-width: 360px) {
    grid-template-columns: 1fr;
  }
`;

const IconWrap = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  font-size: 20px;
  font-weight: 800;
  flex: 0 0 auto;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 390px) {
    width: 38px;
    height: 38px;
    font-size: 17px;
  }
`;

const Content = styled.div`
  min-width: 0;
`;

const HeadingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

const Heading = styled.h2`
  margin: 0;
  color: #0f172a;
  font-size: 15px;
  line-height: 1.35;
  font-weight: 800;
  overflow-wrap: anywhere;

  @media (max-width: 390px) {
    font-size: 14px;
  }
`;

const UnreadDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #2563eb;
  flex: 0 0 auto;
`;

const Message = styled.p`
  margin: 5px 0 0;
  color: #475569;
  font-size: 14px;
  line-height: 1.45;
  overflow-wrap: anywhere;
  word-break: break-word;

  @media (max-width: 390px) {
    font-size: 13px;
  }
`;

const MetaRow = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 3px 9px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
`;

const Side = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  min-width: 138px;

  @media (max-width: 768px) {
    grid-column: 2;
    width: 100%;
    min-width: 0;
    align-items: flex-start;
    gap: 8px;
  }

  @media (max-width: 360px) {
    grid-column: 1;
  }
`;

const Time = styled.time`
  color: #64748b;
  font-size: 12px;
  line-height: 1.35;
  white-space: nowrap;
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: flex-start;
  }

  @media (max-width: 360px) {
    width: 100%;
  }
`;

const TextBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-height: 32px;
  padding: 6px 10px;
  border: 1px solid ${({ $danger }) => ($danger ? "#fecaca" : "#bfdbfe")};
  border-radius: 7px;
  background: #ffffff;
  color: ${({ $danger }) => ($danger ? "#dc2626" : "#2563eb")};
  cursor: pointer;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: ${({ $danger }) => ($danger ? "#fef2f2" : "#eff6ff")};
    border-color: ${({ $danger }) => ($danger ? "#fca5a5" : "#93c5fd")};
  }

  @media (max-width: 390px) {
    padding: 6px 8px;
  }

  @media (max-width: 360px) {
    width: 100%;
  }
`;

const EmptyState = styled.div`
  display: grid;
  place-items: center;
  min-height: 260px;
  padding: 32px 20px;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  color: #64748b;
  text-align: center;
`;

const EmptyIcon = styled.div`
  width: 54px;
  height: 54px;
  margin: 0 auto 12px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: #eff6ff;
  color: #2563eb;
  font-size: 24px;
`;

const EmptyTitle = styled.div`
  color: #0f172a;
  font-size: 16px;
  font-weight: 800;
`;

const EmptyText = styled.p`
  margin: 6px 0 0;
  font-size: 14px;
  line-height: 1.5;
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
        <Header>
          <TitleBlock>
            <Title>Expert Notifications</Title>
            <Sub>Stay updated with calls, chats, and account activity.</Sub>
          </TitleBlock>

          {unreadCount > 0 && (
            <MarkAllBtn onClick={markAllRead}>
              <FiCheckCircle />
              <span>Mark all read</span>
              <Count>{unreadCount}</Count>
            </MarkAllBtn>
          )}
        </Header>

        <FilterBar aria-label="Notification filters">
          {FILTERS.map((item) => (
            <FilterBtn
              key={item}
              type="button"
              $active={filter === item}
              onClick={() => setFilter(item)}
            >
              {item}
            </FilterBtn>
          ))}
        </FilterBar>

        <List>
          {filtered.length === 0 ? (
            <EmptyState>
              <div>
                <EmptyIcon>
                  <FiBell />
                </EmptyIcon>
                <EmptyTitle>No notifications yet</EmptyTitle>
                <EmptyText>
                  New calls, chats, and updates will appear here.
                </EmptyText>
              </div>
            </EmptyState>
          ) : (
            filtered.map((notification) => {
              const read = isRead(notification);
              const iconKey = getIconKey(notification.type);
              const iconConfig = iconMap[iconKey] || iconMap.default;
              const title = notification.title || "Notification";
              const message = getMessage(notification);
              const time = formatTime(
                notification.createdAt ||
                  notification.time ||
                  notification.created_at
              );

              return (
                <NotificationCard
                  key={notification.id}
                  $read={read}
                  $clickable={Boolean(onNotificationTap)}
                  onClick={() => onNotificationTap?.(notification)}
                >
                  <IconWrap $bg={iconConfig.bg} $color={iconConfig.color}>
                    {notification.senderAvatar ? (
                      <img src={notification.senderAvatar} alt="" />
                    ) : (
                      iconConfig.icon
                    )}
                  </IconWrap>

                  <Content>
                    <HeadingRow>
                      <Heading>{title}</Heading>
                      {!read && <UnreadDot aria-label="Unread" />}
                    </HeadingRow>
                    {message && <Message>{message}</Message>}

                    <MetaRow>
                      {notification.senderName && (
                        <Pill>{notification.senderName}</Pill>
                      )}
                      {notification.status && <Pill>{notification.status}</Pill>}
                    </MetaRow>
                  </Content>

                  <Side>
                    {time && <Time dateTime={String(notification.createdAt || "")}>{time}</Time>}

                    <ActionRow>
                      {!read && (
                        <TextBtn
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            markAsRead?.(notification.id);
                          }}
                        >
                          <FiCheckCircle />
                          <span>Read</span>
                        </TextBtn>
                      )}

                      {removeById && (
                        <TextBtn
                          type="button"
                          $danger
                          onClick={(event) => {
                            event.stopPropagation();
                            removeById(notification);
                          }}
                        >
                          <FiTrash2 />
                          <span>Delete</span>
                        </TextBtn>
                      )}
                    </ActionRow>
                  </Side>
                </NotificationCard>
              );
            })
          )}
        </List>
      </Container>
    </PageWrap>
  );
}
