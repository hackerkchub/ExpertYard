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
  const [activeTab, setActiveTab] = useState("chat");
  const listRef = useRef(null);
  const prevCountRef = useRef(0);
const navigate = useNavigate();
  // force re-render for timeAgo
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

  /* ---------------- STATUS COLOR ---------------- */
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

  /* ---------------- SPLIT ---------------- */
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

  const activeList = activeTab === "chat" ? chatRequests : callRequests;

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    if (activeList.length > prevCountRef.current) {
      listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
    prevCountRef.current = activeList.length;
  }, [activeList]);

  return (
    <QueueCardWrap>
      {/* ---------------- TABS ---------------- */}
      <QueueTabs>
        <button
          className={activeTab === "chat" ? "active" : ""}
          onClick={() => setActiveTab("chat")}
        >
          💬 Chat ({chatRequests.length})
        </button>

        <button
          className={activeTab === "call" ? "active" : ""}
          onClick={() => setActiveTab("call")}
        >
          📞 Calls ({callRequests.length})
          {callRequests.some((c) => c.status === "ringing") && <RedDot />}
        </button>
      </QueueTabs>

      {/* ---------------- LIST ---------------- */}
      <div ref={listRef} style={{ maxHeight: 400, overflowY: "auto" }}>
        {activeList.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", color: "#64748b" }}>
            No pending {activeTab} requests
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
                  {req.meta} •{" "}
                  {req.status === "ringing"
                    ? "Ringing..."
                    : getTimeAgo(req.createdAt)}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                {/* ACCEPT CHAT */}
                {req.type === "chat_request" && req.status === "pending" && (
                  <ActionBtn
                    className="accept"
                    onClick={() => acceptNotification(req)}
                  >
                    Accept
                  </ActionBtn>
                )}

                {/* ACCEPT CALL */}
                {req.type === "voice_call" && req.status === "ringing" && (
                  <ActionBtn
                    className="accept"
                   onClick={() =>
  navigate(`/expert/voice-call/${req.payload.callId}`)
}

                  >
                    Tap to Answer
                  </ActionBtn>
                )}

                {/* DECLINE */}
                {(req.status === "pending" || req.status === "ringing") && (
                  <ActionBtn
                    className="decline"
                    onClick={() => rejectNotification(req)}
                  >
                    Decline
                  </ActionBtn>
                )}

                {/* CLOSE */}
                {["rejected", "cancelled", "ended", "missed", "low_balance"].includes(
                  req.status
                ) && (
                  <ActionBtn
                    className="decline"
                    onClick={() => removeById(req.id)}
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
