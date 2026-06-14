import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
const FINAL_STATES = ["missed", "rejected", "ended", "low_balance", "cancelled"];

const timeAgo = (timestamp) => {
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export default function NotificationPopover({
  notifications = [],
  unreadCount = 0,
  markAllRead,
  acceptNotification,
  rejectNotification,
  removeById,
  onNotificationTap,
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const ringAudioRef = useRef(null);
  const prevRingingRef = useRef(0);
  const [, forceUpdate] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => forceUpdate((n) => n + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const sorted = useMemo(
    () => [...notifications].sort((a, b) => b.createdAt - a.createdAt),
    [notifications]
  );

  const calls = useMemo(
    () => sorted.filter((n) => n.type === "voice_call"),
    [sorted]
  );
  const chats = useMemo(
    () => sorted.filter((n) => n.type === "chat_request"),
    [sorted]
  );
  const social = useMemo(
    () => sorted.filter((n) => !["voice_call", "chat_request"].includes(n.type)),
    [sorted]
  );

  useEffect(() => {
    const ringingCount = calls.filter((c) => c.status === "ringing").length;
    if (ringingCount > prevRingingRef.current) {
      ringAudioRef.current?.play().catch(() => {});
    }
    prevRingingRef.current = ringingCount;
  }, [calls]);

  const bgStyle = (unread) => ({
    background: unread ? "#eef2ff" : "#ffffff",
    borderLeft: unread ? "4px solid #6366f1" : "4px solid transparent",
  });

  const visible = (rows) => showAll ? rows : rows.slice(0, DEFAULT_LIMIT);

  const openNotification = (n) => {
    if (n.type === "voice_call" && n.status === "ringing" && n.payload?.callId) {
      navigate(`/expert/voice-call/${n.payload.callId}`);
      return;
    }
    onNotificationTap?.(n);
  };

  const renderGeneric = (rows, emptyText) => (
    <Section>
      {visible(rows).length === 0 ? (
        <Empty>{emptyText}</Empty>
      ) : (
        visible(rows).map((n) => (
          <PopItem
            key={n.id}
            ringing={n.status === "ringing"}
            style={bgStyle(n.unread)}
            clickable
            onClick={() => openNotification(n)}
          >
            <strong>{n.title}</strong>
            <Meta>
              {n.message || n.meta} {"\u2022"} {n.status === "ringing" ? "Ringing..." : timeAgo(n.createdAt)}
            </Meta>
          </PopItem>
        ))
      )}
    </Section>
  );

  return (
    <Popover>
      <audio ref={ringAudioRef} src="/sounds/incoming.mp3" preload="auto" />

      <HeaderRow>
        <Title>Notifications</Title>
        {unreadCount > 0 && (
          <MarkAll onClick={markAllRead}>Mark all as read</MarkAll>
        )}
      </HeaderRow>

      <Tabs>
        <Tab active={activeTab === "all"} onClick={() => setActiveTab("all")}>
          All
        </Tab>
        <Tab active={activeTab === "calls"} onClick={() => setActiveTab("calls")}>
          Calls {calls.some((c) => c.status === "ringing") && <RingDot />}
        </Tab>
        <Tab active={activeTab === "chats"} onClick={() => setActiveTab("chats")}>
          Chats
        </Tab>
        <Tab active={activeTab === "social"} onClick={() => setActiveTab("social")}>
          Social
        </Tab>
      </Tabs>

      {activeTab === "all" && renderGeneric(sorted, "No notifications yet")}

      {activeTab === "calls" && (
        <Section>
          {visible(calls).length === 0 ? (
            <Empty>No call notifications</Empty>
          ) : (
            visible(calls).map((n) => (
              <PopItem
                key={n.id}
                ringing={n.status === "ringing"}
                style={bgStyle(n.unread)}
                clickable
                onClick={() => openNotification(n)}
              >
                <strong>{n.title}</strong>
                <Meta>
                  {n.message || n.meta} {"\u2022"} {n.status === "ringing" ? "Ringing..." : timeAgo(n.createdAt)}
                </Meta>

                {n.status === "ringing" && (
                  <ActionRow>
                    <ActionBtn
                      success
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/expert/voice-call/${n.payload?.callId}`);
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

      {activeTab === "chats" && (
        <Section>
          {visible(chats).length === 0 ? (
            <Empty>No chat notifications</Empty>
          ) : (
            visible(chats).map((n) => (
              <PopItem key={n.id} style={bgStyle(n.unread)} clickable onClick={() => openNotification(n)}>
                <strong>{n.title}</strong>
                <Meta>{n.message || n.meta} {"\u2022"} {timeAgo(n.createdAt)}</Meta>

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

      {activeTab === "social" && renderGeneric(social, "No social notifications")}

      {sorted.length > DEFAULT_LIMIT && (
        <Footer>
          <ViewAll onClick={() => setShowAll((s) => !s)}>
            {showAll ? "Show Less" : "View All"}
          </ViewAll>
        </Footer>
      )}
    </Popover>
  );
}
