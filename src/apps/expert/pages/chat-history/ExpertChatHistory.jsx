// src/apps/expert/pages/chat-history/ExpertChatHistory.jsx
// ✅ MERGED VERSION: Best of both + Fixed loading issue
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMessageSquare,
  FiClock,
  FiChevronRight,
  FiChevronDown,
  FiSearch,
  FiX,
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
  SearchBar,
  SessionsWrap,
  SessionCard,
  ActionButton,
  ModalOverlay,
  ModalContent,
  MessagesArea,
  MessageBubble,
} from "./ExpertChatHistory.styles";

import { useExpert } from "../../../../shared/context/ExpertContext";
import {
  getExpertChatHistoryApi,
  getChatHistoryMessagesApi,
} from "../../../../shared/api/chatHistory.api";

// ✅ FIXED BILLING: 1 MIN MINIMUM + ceil seconds
const calculateEarnings = (durationMinutes, pricePerMinute) => {
  const totalSeconds = Math.round(Number(durationMinutes || 0) * 60);
  const billedMinutes = Math.ceil(totalSeconds / 60);
  return Math.max(1, billedMinutes) * Number(pricePerMinute || 16);
};

// ✅ FIXED: groupByUser - handles both user_name & username
const groupByUser = (rows = [], expertPricePerMinute = 0) => {
  const map = rows.reduce((acc, chat) => {
    const id = chat.user_id;
    if (!id) return acc;

    if (!acc[id]) {
      acc[id] = {
        user_id: chat.user_id,
        username: chat.user_name || chat.username, // ✅ Both formats
        user_avatar: chat.user_avatar,
        total_minutes: 0,
        total_earnings: 0,
        last_end_time: chat.end_time,
        sessions: [],
      };
    }

    acc[id].sessions.push(chat);

    const mins = Number(chat.duration_minutes || 0);
    const ppm = Number(chat.price_per_minute || expertPricePerMinute || 16);
    
    acc[id].total_minutes += mins;
    acc[id].total_earnings += calculateEarnings(mins, ppm);

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
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  // ✅ FIXED: Try both expert_id & expertId
  const fetchGrouped = useCallback(async () => {
    const expertId = expertData?.expert_id || expertData?.expertId;
    
    console.log("🔍 Expert ID:", expertId, "expertData:", expertData); // DEBUG
    
    if (!expertId) {
      console.log("❌ No expert ID found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("📡 Calling getExpertChatHistoryApi...");
      
      const res = await getExpertChatHistoryApi(expertId);
      console.log("📡 API Response:", res);
      
      const rows = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : res?.success
        ? res.data || []
        : [];
        
      console.log("📊 Raw rows:", rows.length);
      
      const grouped = groupByUser(rows, expertPrice?.chat_per_minute || 16);
      console.log("✅ Grouped:", grouped.length, "users");
      
      setCounterparties(grouped);
    } catch (e) {
      console.error("❌ API Error:", e);
      setCounterparties([]);
    } finally {
      setLoading(false);
    }
  }, [expertData?.expert_id, expertData?.expertId, expertPrice?.chat_per_minute]);


  useEffect(() => {
  // ⛔ History stack se is page ko replace kar do
  navigate("/expert/chat-history", { replace: true });

  const handleBack = () => {
    navigate("/expert", { replace: true });
  };

  window.addEventListener("popstate", handleBack);

  return () => {
    window.removeEventListener("popstate", handleBack);
  };
}, [navigate]);

  useEffect(() => {
    fetchGrouped();
  }, [fetchGrouped]);

  // ✅ SEARCH + FILTER
  const filtered = useMemo(() => {
    let arr = [...(counterparties || [])];
    
    if (searchTerm) {
      arr = arr.filter((c) =>
        c.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return arr;
  }, [counterparties, searchTerm]);

  const openSession = useCallback(async (session) => {
    try {
      const res = await getChatHistoryMessagesApi(session.room_id);
      if (res?.success && res.data?.length) {
        setSelectedSession(session);
        setMessages(res.data);
        setShowDetails(true);
      } else {
        alert("No messages found");
      }
    } catch (e) {
      console.error("❌ Messages error:", e);
      alert("Failed to load messages");
    }
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTime = (minutes = 0) => {
    const m = Number(minutes || 0);
    return m > 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
  };

  // ✅ FIXED: Only show loading if no data
  if (loading && counterparties.length === 0) {
    return (
      <PageContainer>
        <LoadingSpinner>Loading chat history...</LoadingSpinner>
      </PageContainer>
    );
  }

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <PageContainer>
        <Header>
          <Title>Chat History</Title>
          <p>
            Found {counterparties.length} users • {filtered.length} shown
          </p>
          <SearchBar>
            <FiSearch size={18} />
            <input
              placeholder="Search by user name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <FiX
                size={18}
                onClick={() => setSearchTerm("")}
                style={{ cursor: "pointer" }}
              />
            )}
          </SearchBar>
        </Header>

        <HistoryList>
          {filtered.length === 0 ? (
            <EmptyState>
              <FiMessageSquare size={48} />
              <h3>No Chat History Found</h3>
              <button onClick={() => navigate("/expert")}>
                Go to Dashboard
              </button>
            </EmptyState>
          ) : (
            filtered.map((c) => {
              const isOpen = expandedUserId === c.user_id;
              const totalSessions = c.sessions?.length || 0;
              const totalEarnings = c.total_earnings || 0;

              return (
                <HistoryItem key={c.user_id}>
                  <ChatHeader
                    onClick={() =>
                      setExpandedUserId(isOpen ? null : c.user_id)
                    }
                  >
                    <Avatar
                      src={
                        c.user_avatar ||
                        `https://i.pravatar.cc/150?img=${c.user_id}`
                      }
                    />
                    <div style={{ flex: 1 }}>
                      <h4>{c.username}</h4>
                      <p>
                        {totalSessions} sessions • {formatTime(c.total_minutes)}
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
                      <FiClock size={14} /> Last: {formatDate(c.last_end_time)}
                    </span>
                    <span>• {totalSessions} sessions</span>
                    <span>• ₹{totalEarnings.toFixed(1)} earned</span>
                  </ChatMeta>

                  {isOpen && (
                    <SessionsWrap>
                      {c.sessions.map((s) => {
                        const ppm = Number(
                          s.price_per_minute || expertPrice?.chat_per_minute || 16
                        );
                        const actualMins = Number(s.duration_minutes || 0);
                        const earnings = calculateEarnings(actualMins, ppm);
                        const seconds = Math.round(actualMins * 60);

                        return (
                          <SessionCard key={s.id || s.room_id}>
                            <div className="session-info">
                              <div className="date">
                                {formatDate(s.end_time)}
                              </div>
                              <div className="duration">
                                Duration: {seconds}s
                              </div>
                            </div>
                            <div className="amount">₹{earnings}</div>
                            <ActionButton onClick={() => openSession(s)}>
                              View Chat
                            </ActionButton>
                          </SessionCard>
                        );
                      })}
                    </SessionsWrap>
                  )}
                </HistoryItem>
              );
            })
          )}
        </HistoryList>

        {/* ✅ FULL MODAL WITH PROPER MESSAGE HEADERS */}
        {showDetails && selectedSession && (
          <ModalOverlay onClick={() => setShowDetails(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid #e2e8f0",
                  background: "#ffffff",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar
                    src={
                      selectedSession.user_avatar ||
                      `https://i.pravatar.cc/150?img=${selectedSession.user_id}`
                    }
                    style={{ width: 40, height: 40 }}
                  />
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#8b5cf6",
                      }}
                    >
                      {selectedSession.username || selectedSession.user_name}
                    </h3>
                    <p
                      style={{
                        margin: "2px 0 0 0",
                        fontSize: 12,
                        color: "#64748b",
                      }}
                    >
                      {formatDate(selectedSession.end_time)} •{" "}
                      {formatTime(selectedSession.duration_minutes)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: 20,
                    cursor: "pointer",
                    color: "#64748b",
                  }}
                >
                  ×
                </button>
              </div>

              <MessagesArea>
                {messages.length ? (
                  messages.map((msg, index) => (
                    <MessageBubble
                      key={msg.id || index}
                      isExpert={msg.sender_type === "expert"}
                    >
                      <div
                        className="message-header"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: 4,
                        }}
                      >
                        <strong>{msg.sender_name}</strong>
                        <span style={{ fontSize: 12, color: "#94a3b8" }}>
                          {msg.time_sent
                            ? new Date(msg.time_sent).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-" }
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          color: "#334155",
                          lineHeight: 1.5,
                        }}
                      >
                        {msg.message}
                      </div>
                    </MessageBubble>
                  ))
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#94a3b8",
                      padding: "60px 20px",
                    }}
                  >
                    No messages found.
                  </div>
                )}
              </MessagesArea>

              <div
                style={{
                  padding: "12px 16px",
                  borderTop: "1px solid #e2e8f0",
                  background: "#f8fafc",
                }}
              >
                <div
                  style={{
                    opacity: 0.6,
                    fontSize: 14,
                    color: "#64748b",
                    padding: "10px 16px",
                    background: "#e2e8f0",
                    borderRadius: 20,
                    fontStyle: "italic",
                  }}
                >
                  Previous chat session (read-only)
                </div>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}
      </PageContainer>
    </>
  );
};

export default ExpertChatHistory;
