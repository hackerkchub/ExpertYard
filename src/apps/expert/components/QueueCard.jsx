import React, { useState, useMemo } from "react";
import { useExpertNotifications } from "../context/ExpertNotificationsContext";

import {
  QueueCardWrap,
  QueueTabs,
  QueueItem,
  ActionBtn,
  RedDot,
  StatusBadge,
} from "../styles/Dashboard.styles";

export default function QueueCard() {
  const [activeTab, setActiveTab] = useState("chat");

  const {
    notifications,
    onNotificationTap,
    removeById: removeNotificationEverywhere, // ✅ Renamed for clarity
  } = useExpertNotifications();

  /* ----------------------------------
     SPLIT CHAT & CALL
  ---------------------------------- */
  const chatRequests = useMemo(
    () => notifications.filter((n) => n.type === "chat_request"),
    [notifications]
  );

  const callRequests = useMemo(
    () => notifications.filter((n) => n.type === "voice_call"),
    [notifications]
  );

  const activeList = activeTab === "chat" ? chatRequests : callRequests;

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
          {callRequests.length > 0 && <RedDot />}
        </button>
      </QueueTabs>

      {/* ---------------- LIST ---------------- */}
      {activeList.length === 0 ? (
        <div style={{ padding: 24, textAlign: "center", color: "#64748b" }}>
          No pending {activeTab} requests
        </div>
      ) : (
        activeList.map((req) => (
          <QueueItem key={req.id} className={req.status || "pending"}>
            <div>
              <strong>{req.title}</strong>

              <StatusBadge status={req.status || "pending"}>
                {req.status === "pending" && "⏳ Pending"}
                {req.status === "incoming" && "📞 Incoming"}
                {req.status === "rejected" && "❌ Rejected"}
                {req.status === "cancelled" && "🚫 Cancelled"}
                {req.status === "ended" && "☎️ Ended"}
              </StatusBadge>

              <span>{req.meta}</span>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {/* CHAT */}
              {req.type === "chat_request" &&
                req.status === "pending" && (
                  <ActionBtn
                    className="accept"
                    onClick={() => onNotificationTap(req)}
                  >
                    Accept
                  </ActionBtn>
                )}

              {/* CALL */}
              {req.type === "voice_call" &&
                req.status === "incoming" && (
                  <ActionBtn
                    className="accept"
                    onClick={() => onNotificationTap(req)}
                  >
                    Tap to Answer
                  </ActionBtn>
                )}

              {/* ✅ CLOSE (ALWAYS ACTIVE) */}
              <ActionBtn
                className="decline"
                onClick={() => removeNotificationEverywhere(req.id)}
              >
                Close
              </ActionBtn>
            </div>
          </QueueItem>
        ))
      )}
    </QueueCardWrap>
  );
}