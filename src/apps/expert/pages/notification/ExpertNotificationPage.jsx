import React from "react";
import styled from "styled-components";
import { FiCheckCircle } from "react-icons/fi";
import NotificationHistory from "../../../../shared/components/notification/NotificationHistory";
import { useExpertNotifications } from "./../../context/ExpertNotificationsContext";

/* ================= LAYOUT ================= */

const PageWrap = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #f8fbff, #eef4fb);
`;

const StickyTop = styled.div`
  position: sticky;
  top: 0;
  z-index: 50;
  background: #f8fbff;
  padding: 22px 24px 16px;
  border-bottom: 1px solid #e2e8f0;
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px 80px;
`;

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
  background: #0f172a;
  color: white;
`;

const Count = styled.span`
  background: #ef4444;
  color: white;
  font-size: 11px;
  padding: 2px 7px;
  border-radius: 999px;
`;

/* ================= COMPONENT ================= */

export default function ExpertNotificationPage() {
  const {
    notifications,
    unreadCount,
    onNotificationTap,
  } = useExpertNotifications();

  return (
    <PageWrap>
      <StickyTop>
        <Header>
          <div>
            <Title>Expert Notifications 🔔</Title>
            <Sub>Stay updated with calls, chats and system activity</Sub>
          </div>

          <Btn>
            <FiCheckCircle />
            Unread
            {unreadCount > 0 && <Count>{unreadCount}</Count>}
          </Btn>
        </Header>
      </StickyTop>

      <ScrollArea>
        <NotificationHistory
          title="All Notifications"
          data={notifications}
          onTap={onNotificationTap}
        />
      </ScrollArea>
    </PageWrap>
  );
}
