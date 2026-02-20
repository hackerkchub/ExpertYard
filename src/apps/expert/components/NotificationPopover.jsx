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
import { useNavigate } from "react-router-dom";


const DEFAULT_LIMIT = 5;
const FINAL_STATES = ["missed", "rejected", "ended", "low_balance", "cancelled"];

export default function NotificationPopover({
  notifications = [],
  unreadCount = 0,
  markAllRead,
  acceptNotification,
  rejectNotification,
  removeById,
}) {
  const [activeTab, setActiveTab] = useState("calls");
  const [showAll, setShowAll] = useState(false);
  const ringAudioRef = useRef(null);
  const prevRingingRef = useRef(0);

  const [, forceUpdate] = useState(0);
  const navigate = useNavigate();


  useEffect(() => {
    const interval = setInterval(() => forceUpdate((n) => n + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  /* ---------------- TIME AGO ---------------- */
  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  /* ---------------- SPLIT + SORT ---------------- */
  const { calls, chats } = useMemo(() => ({
    calls: notifications
      .filter((n) => n.type === "voice_call")
      .sort((a, b) => b.createdAt - a.createdAt),

    chats: notifications
      .filter((n) => n.type === "chat_request")
      .sort((a, b) => b.createdAt - a.createdAt),
  }), [notifications]);

  const visibleCalls = showAll ? calls : calls.slice(0, DEFAULT_LIMIT);
  const visibleChats = showAll ? chats : chats.slice(0, DEFAULT_LIMIT);

  /* ---------------- RING SOUND ---------------- */
  useEffect(() => {
    const ringingCount = calls.filter((c) => c.status === "ringing").length;

    if (ringingCount > prevRingingRef.current) {
      ringAudioRef.current?.play().catch(() => {});
    }

    prevRingingRef.current = ringingCount;
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
          📞 Calls {calls.some((c) => c.status === "ringing") && <RingDot />}
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
                ringing={n.status === "ringing"}
                style={bgStyle(n.unread)}
                clickable={n.status === "ringing"}
                onClick={() =>
  n.status === "ringing" &&
  navigate(`/expert/voice-call/${n.payload.callId}`)
}

              >
                <strong>{n.title}</strong>

                <Meta>
                  {n.meta} •{" "}
                  {n.status === "ringing"
                    ? "Ringing..."
                    : getTimeAgo(n.createdAt)}
                </Meta>

                {n.status === "ringing" && (
                  <ActionRow>
                    <ActionBtn
                      success
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/expert/voice-call/${n.payload.callId}`)
                        removeById(n);
                      }}
                    >
                      Tap to answer
                    </ActionBtn>

                    <ActionBtn
                      danger
                      outline
                      onClick={(e) => {
                        e.stopPropagation();
                        rejectNotification(n);
                      }}
                    >
                      Decline
                    </ActionBtn>
                  </ActionRow>
                )}

                {FINAL_STATES.includes(n.status) && (
                  <ActionRow>
                    <ActionBtn
                      outline
                      onClick={(e) => {
                        e.stopPropagation();
                        removeById(n);
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

      {/* ================= CHAT TAB ================= */}
      {activeTab === "chats" && (
        <Section>
          {visibleChats.length === 0 ? (
            <Empty>No chat notifications</Empty>
          ) : (
            visibleChats.map((n) => (
              <PopItem key={n.id} style={bgStyle(n.unread)}>
                <strong>{n.title}</strong>

                <Meta>
                  {n.meta} • {getTimeAgo(n.createdAt)}
                </Meta>

                {n.status === "pending" ? (
                  <ActionRow>
                    <ActionBtn
                      success
                      onClick={(e) => {
                        e.stopPropagation();
                        acceptNotification(n);
                      }}
                    >
                      Accept
                    </ActionBtn>

                    <ActionBtn
                      danger
                      outline
                      onClick={(e) => {
                        e.stopPropagation();
                        rejectNotification(n);
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
                        removeById(n);
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
