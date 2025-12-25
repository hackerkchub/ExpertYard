import React, { useState } from "react";
import { useExpertNotifications } from "../context/ExpertNotificationsContext";
import {
  QueueCardWrap,
  QueueTabs,
  QueueItem,
  ActionBtn,
  RedDot,
  StatusBadge // ✅ NEW IMPORT
} from "../styles/Dashboard.styles";

export default function QueueCard() {
  const [activeTab, setActiveTab] = useState("chat");
  const { notifications, acceptRequest, declineRequest, unreadCount } = useExpertNotifications();
  
  const chatRequests = notifications.filter(n => n.type === "chat_request");

  const acceptQueueRequest = (req) => acceptRequest(req.id);
  const declineQueueRequest = (req) => declineRequest(req.id);

  const activeList = chatRequests;

  return (
    <QueueCardWrap>
      <QueueTabs>
        <button className={activeTab === "chat" ? "active" : ""} onClick={() => setActiveTab("chat")}>
          Chat Requests ({unreadCount})
          {unreadCount > 0 && <RedDot />}
        </button>
      </QueueTabs>

      {activeList.length === 0 ? (
        <div style={{ padding: 24, textAlign: "center", color: "#64748b" }}>
          No pending requests
        </div>
      ) : (
        activeList.map((req) => (
          <QueueItem key={req.id} className={req.status || "pending"}>
            <div>
              <strong>{req.title}</strong>
              {/* ✅ STATUS BADGE */}
              <StatusBadge status={req.status || "pending"}>
                {req.status === "pending" ? "⏳ Pending" : "❌ Cancelled"}
              </StatusBadge>
              <span>{req.meta}</span>
            </div>
            <div>
              {req.status === "pending" ? ( // ✅ Only show buttons for pending
                <>
                  <ActionBtn className="accept" onClick={() => acceptQueueRequest(req)}>
                    Accept
                  </ActionBtn>
                  <ActionBtn onClick={() => declineQueueRequest(req)}>
                    Decline
                  </ActionBtn>
                </>
              ) : (
                <ActionBtn onClick={() => {}}>Closed</ActionBtn>
              )}
            </div>
          </QueueItem>
        ))
      )}
    </QueueCardWrap>
  );
}
