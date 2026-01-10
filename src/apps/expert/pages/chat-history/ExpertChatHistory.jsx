import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  SearchBar,
  FilterButtons,
  SessionsWrap,
  SessionRow,
  TwoCol,
} from "./ExpertChatHistory.styles";

import { useExpert } from "../../../../shared/context/ExpertContext";
import {
  getExpertChatHistoryApi,
  getChatHistoryMessagesApi,
} from "../../../../shared/api/chatHistory.api";

/* =========================
   HELPERS: GROUP BY USER
========================= */
const groupByUser = (rows = [], expertPricePerMinute = 0) => {
  const map = rows.reduce((acc, chat) => {
    const id = chat.user_id;
    if (!id) return acc;

    if (!acc[id]) {
      acc[id] = {
        user_id: chat.user_id,
        user_name: chat.user_name,
        user_avatar: chat.user_avatar,
        total_minutes: 0,
        total_earnings: 0,
        last_end_time: chat.end_time,
        sessions: [],
      };
    }

    acc[id].sessions.push(chat);

    const mins = Number(chat.duration_minutes || 0);
    acc[id].total_minutes += mins;
    acc[id].total_earnings += mins * Number(expertPricePerMinute || 0);

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

const ExpertChatHistory = () => {
  const { expertData, expertPrice } = useExpert();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [counterparties, setCounterparties] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  /* =========================
     FETCH + GROUP
  ========================= */
  const fetchGrouped = useCallback(async () => {
    const expertId = expertData?.expertId;
    if (!expertId) return;

    try {
      setLoading(true);

      const res = await getExpertChatHistoryApi(expertId);

      // your expert API earlier sometimes returned array directly
      const rows = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : res?.success
        ? res.data || []
        : [];

      const grouped = groupByUser(rows, expertPrice?.chat_per_minute || 0);
      setCounterparties(grouped);
    } catch (e) {
      console.error("❌ expert grouped history error:", e);
      setCounterparties([]);
    } finally {
      setLoading(false);
    }
  }, [expertData?.expertId, expertPrice?.chat_per_minute]);

  useEffect(() => {
    if (expertData?.expertId) fetchGrouped();
  }, [expertData?.expertId, fetchGrouped]);

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

  /* =========================
     FILTERED LIST
  ========================= */
  const filtered = useMemo(() => {
    let arr = [...counterparties];

    if (searchTerm) {
      arr = arr.filter((c) =>
        c.user_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filter !== "all") {
      const now = new Date();
      arr = arr.filter((c) => {
        const d = c.last_end_time ? new Date(c.last_end_time) : null;
        if (!d) return false;

        if (filter === "today") return d.toDateString() === now.toDateString();
        if (filter === "week") {
          const w = new Date(now);
          w.setDate(now.getDate() - 7);
          return d >= w;
        }
        if (filter === "month") {
          const m = new Date(now);
          m.setMonth(now.getMonth() - 1);
          return d >= m;
        }
        return true;
      });
    }

    return arr;
  }, [counterparties, searchTerm, filter]);

  if (loading && counterparties.length === 0) {
    return (
      <PageContainer>
        <LoadingSpinner>Loading chat history...</LoadingSpinner>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Title>Chat History</Title>
        <p>Users appear once; sessions are nested.</p>
      </Header>

      <div style={{ marginBottom: 20, display: "flex", gap: 12 }}>
        <SearchBar
          placeholder="Search by user name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <FilterButtons>
          {["all", "today", "week", "month"].map((f) => (
            <button
              key={f}
              className={filter === f ? "active" : ""}
              onClick={() => setFilter(f)}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </FilterButtons>
      </div>

      <HistoryList>
        {filtered.length === 0 ? (
          <EmptyState>
            <FiMessageSquare size={48} />
            <h3>No Chat History Found</h3>
            <button onClick={() => navigate("/expert")}>Go to Dashboard</button>
          </EmptyState>
        ) : (
          filtered.map((c) => {
            const isOpen = expandedUserId === c.user_id;

            return (
              <HistoryItem key={c.user_id}>
                <ChatHeader
                  onClick={() => setExpandedUserId(isOpen ? null : c.user_id)}
                >
                  <Avatar
                    src={c.user_avatar || `https://i.pravatar.cc/150?img=${c.user_id}`}
                  />
                  <div style={{ flex: 1 }}>
                    <h4>{c.user_name}</h4>
                    <p>
                      {(c.sessions?.length || 0)} sessions •{" "}
                      {formatTime(c.total_minutes || 0)} total
                    </p>
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
                  <span>{(c.sessions?.length || 0)} sessions</span>
                  <span>•</span>
                  <span style={{ color: "#7c3aed", fontWeight: 700 }}>
                    ₹{Number(c.total_earnings ).toFixed(2)}
                  </span>
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
                            <div className="amount">
                              {/* ₹{Number(s.total_cost || 0).toFixed(2)} */}
                            </div>
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
            <h3>Session #{selectedSession.room_id}</h3>
            <p style={{ color: "#64748b", fontSize: 14, marginTop: 6 }}>
              {formatDate(selectedSession.end_time)} •{" "}
              {formatTime(selectedSession.duration_minutes)}
            </p>

            <MessagesArea>
              {messages.map((msg) => (
                <MessageBubble key={msg.id} isExpert={msg.sender_type === "expert"}>
                  {msg.message}
                </MessageBubble>
              ))}
            </MessagesArea>
          </ModalContent>
        </ModalOverlay>
      )}
    </PageContainer>
  );
};

export default ExpertChatHistory;
