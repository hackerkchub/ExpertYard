import React, { useState, useMemo } from "react";
import {
  Wrapper,
  Title,
  TitleRow,
  Badge,
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

/* ================= ICON MAP ================= */

const iconMap = {
  call: { icon: <FiPhone />, color: "#22c55e" },
  chat: { icon: <FiMessageCircle />, color: "#3b82f6" },
  system: { icon: <FiSettings />, color: "#f59e0b" },
};

/* ================= DUMMY DATA ================= */

const dummyData = [
  {
    id: 1,
    type: "call",
    title: "Incoming Call",
    message: "User Rahul started a call",
    time: Date.now() - 1000 * 60 * 3,
  },
  {
    id: 2,
    type: "chat",
    title: "New Message",
    message: "You received a new chat",
    time: Date.now() - 1000 * 60 * 15,
  },
  {
    id: 3,
    type: "system",
    title: "System Update",
    message: "Your profile updated successfully",
    time: Date.now() - 1000 * 60 * 60,
  },
];

/* ================= TIME FORMAT ================= */

const timeAgo = (time) => {
  const diff = Math.floor((Date.now() - time) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

/* ================= COMPONENT ================= */

export default function NotificationHistory({
  title = "Notifications",
  data = dummyData,
}) {
  const [filter, setFilter] = useState("all");
  const [readIds, setReadIds] = useState([]);

  const filtered = useMemo(() => {
    if (filter === "all") return data;
    return data.filter((n) => n.type === filter);
  }, [filter, data]);

  const markRead = (id) => {
    setReadIds((prev) => [...new Set([...prev, id])]);
  };

  const isRead = (n) => readIds.includes(n.id);

  const unreadCount = data.filter((n) => !isRead(n)).length;

  return (
    <Wrapper>
      {/* TITLE + BADGE */}
      <StickyHeader>
      

      {/* FILTER */}
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
      {/* TIMELINE */}
       <ScrollArea>
      <Timeline>
        {filtered.length === 0 && (
          <EmptyState>No notifications yet 🚀</EmptyState>
        )}

        {filtered.map((n) => {
          const { icon, color } = iconMap[n.type] || {
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
                  <Message>{n.message}</Message>
                </Content>

                <div>
                  <Time>{timeAgo(n.time)}</Time>

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
