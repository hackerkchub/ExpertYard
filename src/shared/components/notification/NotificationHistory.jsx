import React, { useState, useMemo } from "react";
import {
  Wrapper,
  FilterBar,
  StickyHeader,
  ScrollArea,
  FilterBtn,
  Timeline,
  Item,
  Dot,
  Card,
  Content,
  Heading,
  Message,
  Time,
  MarkReadBtn,
  EmptyState,
} from "./Notification.styles";

import {
  FiPhone,
  FiMessageCircle,
  FiSettings,
  FiBell,
} from "react-icons/fi";

const iconMap = {
  call: { icon: <FiPhone />, color: "#22c55e" },
  chat: { icon: <FiMessageCircle />, color: "#3b82f6" },
  system: { icon: <FiSettings />, color: "#f59e0b" },
};

const timeAgo = (time) => {
  const value = typeof time === "number" ? time : new Date(time).getTime();
  if (!Number.isFinite(value)) return "";

  const diff = Math.floor((Date.now() - value) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export default function NotificationHistory({
  data = [],
}) {
  const [filter, setFilter] = useState("all");
  const [readIds, setReadIds] = useState([]);

  const filtered = useMemo(() => {
    const rows = Array.isArray(data) ? data : [];
    if (filter === "all") return rows;

    return rows.filter((n) => {
      const type = String(n.type || "");
      if (filter === "chat") return type.includes("chat");
      if (filter === "call") return type.includes("call");
      return type === filter;
    });
  }, [filter, data]);

  const markRead = (id) => {
    setReadIds((prev) => [...new Set([...prev, id])]);
  };

  const isRead = (n) => readIds.includes(n.id) || n.is_read === 1 || n.is_read === true;

  return (
    <Wrapper>
      <StickyHeader>
        <FilterBar>
          {["all", "call", "chat", "system"].map((f) => (
            <FilterBtn
              key={f}
              $active={filter === f}
              onClick={() => setFilter(f)}
            >
              {f.toUpperCase()}
            </FilterBtn>
          ))}
        </FilterBar>
      </StickyHeader>

      <ScrollArea>
        <Timeline>
          {filtered.length === 0 && (
            <EmptyState>No notifications yet</EmptyState>
          )}

          {filtered.map((n) => {
            const type = String(n.type || "");
            const iconKey = type.includes("chat")
              ? "chat"
              : type.includes("call")
                ? "call"
                : "system";
            const { icon, color } = iconMap[iconKey] || {
              icon: <FiBell />,
              color: "#64748b",
            };

            const read = isRead(n);

            return (
              <Item key={n.id}>
                <Dot color={color}>{icon}</Dot>

                <Card $read={read}>
                  <Content>
                    <Heading>{n.title}</Heading>
                    <Message>{n.message || n.meta}</Message>
                  </Content>

                  <div>
                    <Time>{timeAgo(n.time || n.createdAt || n.created_at)}</Time>

                    {!read && (
                      <MarkReadBtn onClick={() => markRead(n.id)}>
                        Mark as read
                      </MarkReadBtn>
                    )}
                  </div>
                </Card>
              </Item>
            );
          })}
        </Timeline>
      </ScrollArea>
    </Wrapper>
  );
}
