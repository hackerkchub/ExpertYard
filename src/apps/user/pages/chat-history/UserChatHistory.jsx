import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMessageSquare,
  FiClock,
  FiChevronRight,
  FiChevronDown,
} from "react-icons/fi";

import {
  PageContainer,
  Header,
  Title,
  HistoryList,
  HistoryItem,
  ChatHeader,
  ChatMeta,
  Avatar,
  EmptyState,
  LoadingSpinner,
  ModalOverlay,
  ModalContent,
  MessagesArea,
  MessageBubble,
  SessionsWrap,
  SessionRow,
  TwoCol,
} from "./UserChatHistory.styles";

import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useExpert } from "../../../../shared/context/ExpertContext";
import {
  getUserChatHistoryApi,
  getChatHistoryMessagesApi,
} from "../../../../shared/api/chatHistory.api";

/* =========================
   HELPERS: GROUP BY EXPERT
========================= */
const groupByExpert = (rows = []) => {
  const map = rows.reduce((acc, chat) => {
    const id = chat.expert_id;
    if (!id) return acc;

    if (!acc[id]) {
      acc[id] = {
        expert_id: chat.expert_id,
        expert_name: chat.expert_name,
        expert_avatar: chat.expert_avatar,
        expert_position: chat.expert_position,
        total_minutes: 0,
        total_spent: 0,
        last_end_time: chat.end_time,
        sessions: [],
      };
    }

    acc[id].sessions.push(chat);

    const mins = Number(chat.duration_minutes || 0);
    const ppm = Number(chat.price_per_minute || 0);

    acc[id].total_minutes += mins;
    acc[id].total_spent += mins * ppm;

    if (
      chat.end_time &&
      (!acc[id].last_end_time ||
        new Date(chat.end_time) > new Date(acc[id].last_end_time))
    ) {
      acc[id].last_end_time = chat.end_time;
    }

    return acc;
  }, {});

  return Object.values(map)
    .map((g) => ({
      ...g,
      sessions: [...g.sessions].sort(
        (a, b) => new Date(b.end_time) - new Date(a.end_time)
      ),
    }))
    .sort((a, b) => new Date(b.last_end_time) - new Date(a.last_end_time));
};

export const UserChatHistory = () => {
  const { user } = useAuth();
  const { experts } = useExpert(); // ✅ list already loaded from /expert-profile/list
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [counterparties, setCounterparties] = useState([]);
  const [expandedExpertId, setExpandedExpertId] = useState(null);

  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  /* =========================
     BUILD EXPERT LOOKUP MAP
     experts[] -> { [id]: expert }
  ========================= */
  const expertById = useMemo(() => {
    const map = {};
    (experts || []).forEach((e) => {
      if (e?.id) map[e.id] = e;
    });
    return map;
  }, [experts]);

  /* =========================
     FETCH + GROUP
  ========================= */
  const fetchGrouped = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getUserChatHistoryApi(user?.id);
      const rows = res?.success ? res.data || [] : [];

      const grouped = groupByExpert(rows);

      // ✅ Merge expert details from context (photo/position/name)
      const merged = grouped.map((c) => {
        const ctxExpert = expertById[c.expert_id];

        return {
          ...c,
          expert_name: ctxExpert?.name || c.expert_name,
          expert_position: ctxExpert?.position || c.expert_position,
          expert_avatar: ctxExpert?.profile_photo || c.expert_avatar,
        };
      });

      setCounterparties(merged);
    } catch (e) {
      console.error("❌ user grouped history error:", e);
      setCounterparties([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, expertById]);

  useEffect(() => {
    if (user?.id) fetchGrouped();
  }, [user?.id, fetchGrouped]);

  /* =========================
     OPEN SESSION => LOAD MESSAGES
  ========================= */
  const openSession = useCallback(async (session) => {
    try {
      const res = await getChatHistoryMessagesApi(session.room_id);
      if (res?.success) {
        setSelectedSession(session);
        setMessages(res.data || []);
        setShowDetails(true);
      }
    } catch (e) {
      console.error("❌ messages error:", e);
    }
  }, []);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatTime = (minutes = 0) =>
    minutes > 60
      ? `${Math.floor(minutes / 60)}h ${minutes % 60}m`
      : `${minutes}m`;

  const totalChats = useMemo(
    () => counterparties.reduce((sum, c) => sum + (c.sessions?.length || 0), 0),
    [counterparties]
  );

  if (loading && counterparties.length === 0) {
    return (
      <PageContainer>
        <LoadingSpinner>Loading your chat history...</LoadingSpinner>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Title>Your Chat History</Title>
        <p>
          Experts list is unique; sessions are nested ({totalChats} total
          sessions).
        </p>
      </Header>

      <HistoryList>
        {counterparties.length === 0 ? (
          <EmptyState>
            <FiMessageSquare size={48} />
            <h3>No Chat History Yet</h3>
            <p>Start your first chat to see history here</p>
            <button onClick={() => navigate("/user/call-chat")}>
              Find Experts
            </button>
          </EmptyState>
        ) : (
          counterparties.map((c) => {
            const isOpen = expandedExpertId === c.expert_id;

            return (
              <HistoryItem key={c.expert_id}>
                <ChatHeader
                  onClick={() =>
                    setExpandedExpertId(isOpen ? null : c.expert_id)
                  }
                >
                  <Avatar
                    src={
                      c.expert_avatar ||
                      `https://i.pravatar.cc/150?img=${c.expert_id}`
                    }
                  />
                  <div style={{ flex: 1 }}>
                    <h4>{c.expert_name || "Expert"}</h4>
                    <p>{c.expert_position || "Expert"}</p>
                  </div>
                  {isOpen ? (
                    <FiChevronDown size={18} />
                  ) : (
                    <FiChevronRight size={18} />
                  )}
                </ChatHeader>

                <ChatMeta>
                  <span>
                    <FiClock size={14} /> Last:{" "}
                    {c.last_end_time ? formatDate(c.last_end_time) : "-"}
                  </span>
                  <span>•</span>
                  <span>{formatTime(c.total_minutes || 0)} total</span>
                  <span>•</span>
                  <span>{c.sessions?.length || 0} sessions</span>
                </ChatMeta>

                {isOpen && (
                  <SessionsWrap>
                    {(c.sessions || []).map((s) => (
                      <SessionRow
                        key={s.room_id}
                        type="button"
                        onClick={() => openSession(s)}
                      >
                        <TwoCol>
                          <div>
                            <div className="title">Session #{s.room_id}</div>
                            <div className="sub">
                              {formatDate(s.end_time)} •{" "}
                              {formatTime(s.duration_minutes)}
                            </div>
                          </div>
                          <div className="right">
                            {/* optional: show msg count or cost */}
                            {/* <div className="sub">{s.message_count || 0} msgs</div> */}
                          </div>
                        </TwoCol>
                      </SessionRow>
                    ))}
                  </SessionsWrap>
                )}
              </HistoryItem>
            );
          })
        )}
      </HistoryList>

      {showDetails && selectedSession && (
        <ModalOverlay onClick={() => setShowDetails(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <div>
                <h3>Session #{selectedSession.room_id}</h3>
                <p style={{ color: "#64748b", fontSize: 14 }}>
                  {formatDate(selectedSession.end_time)} •{" "}
                  {formatTime(selectedSession.duration_minutes)}
                </p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 24,
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                ×
              </button>
            </div>

            <MessagesArea>
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  isExpert={msg.sender_type === "expert"}
                >
                  <div className="message-header">
                    <strong>{msg.sender_name}</strong>
                    <span className="message-time">{msg.time}</span>
                  </div>
                  <div className="message-content">{msg.message}</div>
                </MessageBubble>
              ))}
            </MessagesArea>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default UserChatHistory;
