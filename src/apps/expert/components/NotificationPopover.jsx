import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Popover,
  HeaderRow,
  Title,
  MarkAll,
  Tabs,
  Tab,
  Section,
  PopItem,
  Meta,
  ActionRow,
  ActionBtn,
  Footer,
  ViewAll,
  Empty,
  RingDot,
} from "../styles/Notification.styles";

const DEFAULT_LIMIT = 5;

export default function NotificationPopover({
  notifications = [],
  unreadCount = 0,
  markAllRead,
  onNotificationTap,
  removeById,
}) {
  const [activeTab, setActiveTab] = useState("calls");
  const [showAll, setShowAll] = useState(false);
  const ringAudioRef = useRef(null);

  /* ---------------- SPLIT DATA ---------------- */
  const { calls, chats } = useMemo(() => ({
    calls: notifications.filter((n) => n.type === "voice_call"),
    chats: notifications.filter((n) => n.type === "chat_request"),
  }), [notifications]);

  /* ---------------- LIMIT ---------------- */
  const visibleCalls = showAll ? calls : calls.slice(0, DEFAULT_LIMIT);
  const visibleChats = showAll ? chats : chats.slice(0, DEFAULT_LIMIT);

  /* ---------------- RING ---------------- */
  useEffect(() => {
    const hasIncoming = calls.some((c) => c.status === "incoming");
    if (hasIncoming && ringAudioRef.current) {
      ringAudioRef.current.play().catch(() => {});
    }
  }, [calls]);

  /* ---------------- STYLE ---------------- */
  const bgStyle = (unread) => ({
    background: unread ? "#eef2ff" : "#ffffff",
    borderLeft: unread ? "4px solid #6366f1" : "4px solid transparent",
  });

  return (
    <Popover>
      <audio ref={ringAudioRef} src="/sounds/incoming-call.mp3" preload="auto" />

      {/* HEADER */}
      <HeaderRow>
        <Title>Notifications</Title>
        {unreadCount > 0 && (
          <MarkAll onClick={markAllRead}>Mark all as read</MarkAll>
        )}
      </HeaderRow>

      {/* TABS */}
      <Tabs>
        <Tab active={activeTab === "calls"} onClick={() => setActiveTab("calls")}>
          📞 Calls {calls.length > 0 && <RingDot />}
        </Tab>
        <Tab active={activeTab === "chats"} onClick={() => setActiveTab("chats")}>
          💬 Chats
        </Tab>
      </Tabs>

      {/* ================= CALL TAB ================= */}
      {activeTab === "calls" && (
        <Section>
          {visibleCalls.length === 0 ? (
            <Empty>No call notifications</Empty>
          ) : (
            visibleCalls.map((n) => (
              <PopItem
                key={n.id}
                ringing={n.status === "incoming"}
                style={bgStyle(n.unread)}
                clickable
                onClick={() => onNotificationTap(n)} // ✅ redirect
              >
                <strong>{n.title}</strong>
                {n.meta && <Meta>{n.meta}</Meta>}

                <ActionRow>
                  <ActionBtn success>Tap to answer</ActionBtn>

                  <ActionBtn
                    danger
                    outline
                    onClick={(e) => {
                      e.stopPropagation(); // 🔥 IMPORTANT
                      removeById(n.id);
                    }}
                  >
                    Decline
                  </ActionBtn>
                </ActionRow>
              </PopItem>
            ))
          )}
        </Section>
      )}

      {/* ================= CHAT TAB ================= */}
      {activeTab === "chats" && (
        <Section>
          {visibleChats.length === 0 ? (
            <Empty>No chat notifications</Empty>
          ) : (
            visibleChats.map((n) => (
              <PopItem key={n.id} style={bgStyle(n.unread)}>
                <strong>{n.title}</strong>
                {n.meta && <Meta>{n.meta}</Meta>}

                {n.status === "pending" ? (
                  <ActionRow>
                    <ActionBtn
                      success
                      onClick={(e) => {
                        e.stopPropagation();
                        onNotificationTap(n); // accept chat
                      }}
                    >
                      Accept
                    </ActionBtn>

                    <ActionBtn
                      danger
                      outline
                      onClick={(e) => {
                        e.stopPropagation();
                        removeById(n.id);
                      }}
                    >
                      Decline
                    </ActionBtn>
                  </ActionRow>
                ) : (
                  <ActionRow>
                    <ActionBtn
                      outline
                      onClick={(e) => {
                        e.stopPropagation();
                        removeById(n.id);
                      }}
                    >
                      Close
                    </ActionBtn>
                  </ActionRow>
                )}
              </PopItem>
            ))
          )}
        </Section>
      )}

      {/* FOOTER */}
      {(calls.length > DEFAULT_LIMIT || chats.length > DEFAULT_LIMIT) && (
        <Footer>
          <ViewAll onClick={() => setShowAll((s) => !s)}>
            {showAll ? "Show Less" : "View All"}
          </ViewAll>
        </Footer>
      )}
    </Popover>
  );
}
