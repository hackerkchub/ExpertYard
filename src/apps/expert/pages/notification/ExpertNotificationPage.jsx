import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { FiRefreshCw, FiCheckCircle } from "react-icons/fi";
import NotificationHistory from "../../../../shared/components/notification/NotificationHistory";

/* ================= LAYOUT ================= */

const PageWrap = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #f8fbff, #eef4fb);
`;

/* 🔥 Sticky Top Section */
const StickyTop = styled.div`
  position: sticky;
  top: 0;
  z-index: 50;
  background: #f8fbff;
  padding: 22px 24px 16px;
  border-bottom: 1px solid #e2e8f0;
`;

/* Scroll only here */
const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px 80px;
`;

/* ================= HEADER ================= */

const Header = styled.div`
  max-width: 900px;
  margin: 0 auto 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: 800;
`;

const Sub = styled.p`
  font-size: 13px;
  color: #64748b;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
`;

const Btn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;

  background: ${({ secondary }) => (secondary ? "#e2e8f0" : "#0f172a")};
  color: ${({ secondary }) => (secondary ? "#0f172a" : "white")};

  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};

  transition: 0.2s;

  &:hover {
    transform: ${({ disabled }) =>
      disabled ? "none" : "translateY(-2px)"};
  }
`;

const Count = styled.span`
  background: #ef4444;
  color: white;
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 999px;
`;

/* ================= DATA ================= */

const initialData = [
  {
    id: 1,
    type: "call",
    title: "New Call Request",
    message: "User waiting for your call",
    time: Date.now() - 1000 * 60 * 2,
  },
  {
    id: 2,
    type: "chat",
    title: "Chat Started",
    message: "User started chat session",
    time: Date.now() - 1000 * 60 * 15,
  },
  {
    id: 3,
    type: "system",
    title: "Payout Updated",
    message: "Monthly earnings credited",
    time: Date.now() - 1000 * 60 * 60 * 6,
  },
];

/* ================= COMPONENT ================= */

export default function ExpertNotificationPage() {
  const [notifications, setNotifications] = useState(initialData);
  const [readIds, setReadIds] = useState([]);

  /* unread counter */
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !readIds.includes(n.id)).length;
  }, [notifications, readIds]);

  /* mark all read */
  const markAllRead = () => {
    setReadIds(notifications.map((n) => n.id));
  };

  /* refresh simulation */
  const refresh = () => {
    const newItem = {
      id: Date.now(),
      type: "chat",
      title: "New Message",
      message: "A new user message arrived",
      time: Date.now(),
    };

    setNotifications((prev) => [newItem, ...prev]);
  };

  return (
    <PageWrap>
      {/* 🔥 Sticky Top */}
      <StickyTop>
        <Header>
          <div>
            <Title>Expert Notifications 🔔</Title>
            <Sub>
              Stay updated with calls, chats and system activity
            </Sub>
          </div>
          <Actions>
            <Btn secondary onClick={refresh}>
              <FiRefreshCw />
              Refresh
            </Btn>

            <Btn
              onClick={markAllRead}
              disabled={unreadCount === 0}
            >
              <FiCheckCircle />
              Mark all read
              {unreadCount > 0 && <Count>{unreadCount}</Count>}
            </Btn>
          </Actions>
        </Header>
      </StickyTop>

      {/* 🔥 Only this scrolls */}
      <ScrollArea>
        <NotificationHistory
          title="All Notifications"
          data={notifications.map((n) => ({
            ...n,
            read: readIds.includes(n.id),
          }))}
        />
      </ScrollArea>
    </PageWrap>
  );
}
