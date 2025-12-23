// src/apps/expert/components/QueueCard.jsx

import React, { useEffect, useState } from "react";
import {
  QueueCardWrap,
  QueueTabs,
  QueueItem,
  ActionBtn,
  RedDot
} from "../styles/Dashboard.styles";

import { socket } from "../../../shared/api/socket";

export default function QueueCard() {
  const [activeTab, setActiveTab] = useState("call");

  const [callRequests, setCallRequests] = useState([]);
  const [chatRequests, setChatRequests] = useState([]);

  /* =========================
     SOCKET LISTENERS
  ========================= */
  useEffect(() => {
    // 🔔 CHAT REQUEST
    const onChatRequest = ({ request_id, user_id }) => {
      setChatRequests(prev => {
        if (prev.some(r => r.id === request_id)) return prev;

        return [
          {
            id: request_id,
            user_id,
            type: "chat",
            name: `User #${user_id}`,
            meta: "Chat request · just now"
          },
          ...prev
        ];
      });
    };

    // 🔔 CALL REQUEST (future-ready)
    const onCallRequest = ({ request_id, user_id }) => {
      setCallRequests(prev => {
        if (prev.some(r => r.id === request_id)) return prev;

        return [
          {
            id: request_id,
            user_id,
            type: "call",
            name: `User #${user_id}`,
            meta: "Call request · just now"
          },
          ...prev
        ];
      });
    };

    socket.on("incoming_chat_request", onChatRequest);
    socket.on("incoming_call_request", onCallRequest);

    return () => {
      socket.off("incoming_chat_request", onChatRequest);
      socket.off("incoming_call_request", onCallRequest);
    };
  }, []);

  /* =========================
     ACTIONS
  ========================= */
  const acceptRequest = (req) => {
    if (req.type === "chat") {
      socket.emit("accept_chat", { request_id: req.id });
      setChatRequests(prev => prev.filter(r => r.id !== req.id));
    } else {
      socket.emit("accept_call", { request_id: req.id });
      setCallRequests(prev => prev.filter(r => r.id !== req.id));
    }
  };

  const declineRequest = (req) => {
    if (req.type === "chat") {
      socket.emit("reject_chat", { request_id: req.id });
      setChatRequests(prev => prev.filter(r => r.id !== req.id));
    } else {
      socket.emit("reject_call", { request_id: req.id });
      setCallRequests(prev => prev.filter(r => r.id !== req.id));
    }
  };

  const activeList =
    activeTab === "call" ? callRequests : chatRequests;

  /* =========================
     RENDER
  ========================= */
  return (
    <QueueCardWrap>
      {/* ================= TABS ================= */}
      <QueueTabs>
        <button
          className={activeTab === "call" ? "active" : ""}
          onClick={() => setActiveTab("call")}
        >
          Call Requests
          {callRequests.length > 0 && <RedDot />}
        </button>

        <button
          className={activeTab === "chat" ? "active" : ""}
          onClick={() => setActiveTab("chat")}
        >
          Chat Requests
          {chatRequests.length > 0 && <RedDot />}
        </button>
      </QueueTabs>

      {/* ================= LIST ================= */}
      {activeList.length === 0 ? (
        <div style={{ padding: 14, fontSize: 13, color: "#64748b" }}>
          No {activeTab} requests
        </div>
      ) : (
        activeList.map((req) => (
          <QueueItem key={req.id}>
            <div>
              <strong>{req.name}</strong>
              <span>{req.meta}</span>
            </div>

            <div>
              <ActionBtn
                className="accept"
                onClick={() => acceptRequest(req)}
              >
                Accept {req.type}
              </ActionBtn>

              <ActionBtn
                onClick={() => declineRequest(req)}
              >
                Decline
              </ActionBtn>
            </div>
          </QueueItem>
        ))
      )}
    </QueueCardWrap>
  );
}
