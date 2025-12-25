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

// ✅ PROPS VERSION - NO INTERNAL HOOK!
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

  const handleAccept = (n) => {
    const requestId = n.payload?.request_id;
    if (!requestId) return;
    console.log("🎯 Accepting:", requestId);
    onAccept(requestId);
  };

  const handleDecline = (n) => {
    const requestId = n.payload?.request_id;
    if (!requestId) return;
    console.log("❌ Declining:", requestId);
    onDecline(requestId);
  };

  return (
    <Popover>
      <TitleRow>
        <Title>Notifications</Title>
        {unreadCount > 0 && (
          <MarkAll onClick={markAllRead}>
            Mark all read ({unreadCount})
          </MarkAll>
        )}
      </TitleRow>

      {visible.length === 0 ? (
        <div style={{ padding: 16, color: "#64748b", fontSize: 13 }}>
          No notifications
        </div>
      ) : (
        visible.map((n) => (
         // NotificationPopover.jsx में ये changes:
<PopItem key={n.id} unread={n.unread} status={n.status}>
  <div style={{ fontWeight: 500, fontSize: 14 }}>
    {n.title}
    {/* ✅ STATUS BADGE */}
    {n.status && n.status !== "pending" && (
      <span style={{
        padding: "2px 8px",
        background: n.status === "cancelled" ? "#fecaca" : "#fed7aa",
        color: n.status === "cancelled" ? "#dc2626" : "#d97706",
        borderRadius: "12px",
        fontSize: "11px",
        fontWeight: "600",
        marginLeft: "8px"
      }}>
        {n.status === "cancelled" ? "Cancelled" : "Rejected"}
      </span>
    )}
  </div>
  
  {/* ✅ ONLY PENDING REQUESTS GET BUTTONS */}
  {n.type === "chat_request" && n.status === "pending" && n.payload?.request_id && (
    <ActionRow>
      <ActionBtn onClick={() => handleAccept(n)} style={{ background: "#10b981", color: "white" }}>
        Accept
      </ActionBtn>
      <ActionBtn variant="outline" onClick={() => handleDecline(n)} style={{ color: "#ef4444" }}>
        Decline
      </ActionBtn>
    </ActionRow>
  )}
</PopItem>

        ))
      )}

      <Footer>
        {hasMore ? (
          <ViewAll onClick={() => setPage(p => p + 1)}>Load more</ViewAll>
        ) : (
          <ViewAll>View all</ViewAll>
        )}
      </Footer>
    </Popover>
  );
}
