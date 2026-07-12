import React, { useState, useMemo, useEffect, useRef } from "react";
import { useExpertNotifications } from "../context/ExpertNotificationsContext";

import {
  QueueCardWrap,
  QueueTabs,
  QueueItem,
  ActionBtn,
  RedDot,
  StatusBadge,
} from "../styles/Dashboard.styles";
import { useNavigate } from "react-router-dom";

export default function QueueCard() {
  const [activeTab, setActiveTab] = useState("call");
  const listRef = useRef(null);
  const prevCountRef = useRef(0);
  const navigate = useNavigate();
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate((n) => n + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const {
    notifications,
    acceptNotification,
    rejectNotification,
    removeById,
  } = useExpertNotifications();

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

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#f59e0b";

      case "ringing":
        return "#22c55e";

      case "missed":
        return "#ef4444";

      case "rejected":
        return "#ef4444";

      case "cancelled":
        return "#6b7280";

      case "ended":
        return "#3b82f6";

      case "low_balance":
        return "#a855f7";

      default:
        return "#6b7280";
    }
  };

  const chatRequests = useMemo(
    () =>
      notifications
        .filter((n) => n.type === "chat_request")
        .sort((a, b) => b.createdAt - a.createdAt),
    [notifications]
  );

  const callRequests = useMemo(
    () =>
      notifications
        .filter((n) => n.type === "voice_call")
        .sort((a, b) => b.createdAt - a.createdAt),
    [notifications]
  );

  const videoCallRequests = useMemo(
    () =>
      notifications
        .filter((n) => n.type === "video_call")
        .sort((a, b) => b.createdAt - a.createdAt),
    [notifications]
  );

  const queueTabs = [
    {
      key: "call",
      label: "Call",
      count: callRequests.length,
      hasAlert: callRequests.some((c) => c.status === "ringing"),
    },
    {
      key: "chat",
      label: "Chat",
      count: chatRequests.length,
    },
    {
      key: "video",
      label: "Video Call",
      count: videoCallRequests.length,
      hasAlert: videoCallRequests.some((c) => c.status === "ringing"),
    },
  ];

  const linkTabs = [
    { label: "Leads", path: "/expert/leads" },
    { label: "Enquiry", path: "/expert/inquiries" },
    { label: "My Booking", path: "/expert/mybookings" },
  ];

  const activeLists = {
    chat: chatRequests,
    call: callRequests,
    video: videoCallRequests,
  };

  const emptyLabels = {
    chat: "chat",
    call: "call",
    video: "video call",
  };

  const activeList = activeLists[activeTab] || [];

  useEffect(() => {
    if (activeList.length > prevCountRef.current) {
      listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
    prevCountRef.current = activeList.length;
  }, [activeList]);

  return (
    <QueueCardWrap>
      <QueueTabs>
        {queueTabs.map((tab) => (
          <button
            key={tab.key}
            className={activeTab === tab.key ? "active" : ""}
            onClick={() => setActiveTab(tab.key)}
            type="button"
          >
            {tab.label} ({tab.count})
            {tab.hasAlert && <RedDot />}
          </button>
        ))}

        {linkTabs.map((tab) => (
          <button
            key={tab.path}
            className="link-tab"
            onClick={() => navigate(tab.path)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </QueueTabs>

      <div ref={listRef} style={{ maxHeight: 400, overflowY: "auto" }}>
        {activeList.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "#64748b" }}>
            No pending {emptyLabels[activeTab] || "queue"} requests
          </div>
        ) : (
          activeList.map((req) => (
            <QueueItem key={req.id} className={req.status || "pending"}>
              <div>
                <strong>{req.title}</strong>

                <StatusBadge style={{ background: getStatusColor(req.status) }}>
                  {req.status}
                </StatusBadge>

                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  {req.meta} -{" "}
                  {req.status === "ringing"
                    ? "Ringing..."
                    : getTimeAgo(req.createdAt)}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                {req.type === "chat_request" &&
                  (req.status === "pending" || req.status === "accepting") && (
                    <ActionBtn
                      className="accept"
                      disabled={req.status === "accepting"}
                      onClick={() => acceptNotification(req)}
                    >
                      {req.status === "accepting" ? "Accepting..." : "Accept"}
                    </ActionBtn>
                  )}

                {req.type === "voice_call" && req.status === "ringing" && (
                  <ActionBtn
                    className="accept"
                    onClick={() => {
                      navigate(`/expert/voice-call/${req.payload.callId}`);
                    }}
                  >
                    Tap to Answer
                  </ActionBtn>
                )}

                {req.type === "video_call" && req.status === "ringing" && (
                  <ActionBtn
                    className="accept"
                    onClick={() => {
                      navigate(`/expert/video-call/${req.payload.callId}`);
                    }}
                  >
                    Tap to Answer
                  </ActionBtn>
                )}

                {(req.status === "pending" || req.status === "ringing") && (
                  <ActionBtn
                    className="decline"
                    onClick={() => rejectNotification(req)}
                  >
                    Decline
                  </ActionBtn>
                )}

                {["rejected", "cancelled", "ended", "missed", "low_balance"].includes(
                  req.status
                ) && (
                  <ActionBtn
                    className="decline"
                    onClick={() => removeById(req)}
                  >
                    Close
                  </ActionBtn>
                )}
              </div>
            </QueueItem>
          ))
        )}
      </div>
    </QueueCardWrap>
  );
}
