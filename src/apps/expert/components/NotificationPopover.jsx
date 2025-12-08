import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  notifications,
  unreadCount,
  markAllRead,
  onAccept,
  onDecline,
}) {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const pageSize = 3;

  const start = 0;
  const end = page * pageSize;
  const visible = notifications.slice(start, end);
  const hasMore = notifications.length > end;

  return (
    <Popover>
      <TitleRow>
        <Title>Notifications</Title>
        {unreadCount > 0 && (
          <MarkAll onClick={markAllRead}>Mark all as read</MarkAll>
        )}
      </TitleRow>

      {visible.map((n) => (
        <PopItem key={n.id} unread={n.unread}>
          <div>{n.title}</div>
          {n.meta && <Meta>{n.meta}</Meta>}

          {n.type === "request" && (
            <ActionRow>
              <ActionBtn onClick={() => onAccept(n.id)}>Accept</ActionBtn>
              <ActionBtn
                variant="outline"
                onClick={() => onDecline(n.id)}
              >
                Decline
              </ActionBtn>
            </ActionRow>
          )}
        </PopItem>
      ))}

      {hasMore && (
        <Footer>
          <ViewAll onClick={() => setPage((p) => p + 1)}>
            Load more
          </ViewAll>
        </Footer>
      )}

      {!hasMore && (
        <Footer>
          <ViewAll onClick={() => navigate("/expert/notifications")}>
            View all notifications
          </ViewAll>
        </Footer>
      )}
    </Popover>
  );
}
