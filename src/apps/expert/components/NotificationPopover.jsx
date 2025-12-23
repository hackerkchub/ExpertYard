import React, { useState } from "react";
import {
  Popover,
  PopItem,
  TitleRow,
  Title,
  MarkAll,
  Meta,
  ActionRow,
  ActionBtn,
  Footer,
  ViewAll,
} from "../styles/Notification.styles";

export default function NotificationPopover({
  notifications = [],
  unreadCount = 0,
  markAllRead,
  onAccept,
  onDecline,
}) {
  const [page, setPage] = useState(1);
  const pageSize = 3;

  const visible = notifications.slice(0, page * pageSize);
  const hasMore = notifications.length > visible.length;

  /* ================= HANDLERS ================= */

  const handleAccept = async (n) => {
    const requestId = n.payload?.request_id;
    if (!requestId) return;

    // ✅ ONLY socket emit
    await onAccept(requestId);

    // ❌ NO navigate here
    // redirect ExpertLayout me hoga (chat_started event)
  };

  const handleDecline = (n) => {
    const requestId = n.payload?.request_id;
    if (!requestId) return;

    onDecline(requestId);
  };

  return (
    <Popover>
      {/* HEADER */}
      <TitleRow>
        <Title>Notifications</Title>
        {unreadCount > 0 && (
          <MarkAll onClick={markAllRead}>Mark all as read</MarkAll>
        )}
      </TitleRow>

      {/* LIST */}
      {visible.length === 0 && (
        <div style={{ padding: 16, color: "#64748b", fontSize: 13 }}>
          No notifications
        </div>
      )}

      {visible.map((n) => (
        <PopItem key={n.id} unread={n.unread}>
          <div style={{ fontWeight: 500 }}>{n.title}</div>

          {n.meta && <Meta>{n.meta}</Meta>}

          {n.type === "chat_request" && n.payload?.request_id && (
            <ActionRow>
              <ActionBtn onClick={() => handleAccept(n)}>
                Accept
              </ActionBtn>

              <ActionBtn
                variant="outline"
                onClick={() => handleDecline(n)}
              >
                Decline
              </ActionBtn>
            </ActionRow>
          )}
        </PopItem>
      ))}

      {/* FOOTER */}
      {hasMore ? (
        <Footer>
          <ViewAll onClick={() => setPage((p) => p + 1)}>
            Load more
          </ViewAll>
        </Footer>
      ) : (
        <Footer>
          <ViewAll>View all notifications</ViewAll>
        </Footer>
      )}
    </Popover>
  );
}
