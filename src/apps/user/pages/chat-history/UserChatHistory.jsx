import React, { useEffect, useMemo, useState, useCallback } from "react";
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
  SessionCard,
  ActionButtons,
  ActionButton,
  SessionsWrap,
  ModalOverlay,
  ModalContent,
  ChatMessagesArea,
  ChatMessageBubble,
  ChatHeaderBar,
  ChatInputArea,
  ChatAvatar,
  ActionButton as StyledActionButton, // For popups
} from "./UserChatHistory.styles";

import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useExpert } from "../../../../shared/context/ExpertContext";
import { useWallet } from "../../../../shared/context/WalletContext";
import { socket } from "../../../../shared/api/socket";
import {
  getUserChatHistoryApi,
  getChatHistoryMessagesApi,
} from "../../../../shared/api/chatHistory.api";

// ✅ MINIMUM 1 MIN BILLING + PRICE FIX
const calculateBilledAmount = (durationMinutes, pricePerMinute) => {
  const totalSeconds = Math.round(Number(durationMinutes || 0) * 60);
  const billedMinutes = Math.ceil(totalSeconds / 60);
  return Math.max(1, billedMinutes) * Number(pricePerMinute || 16);
};

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
chat_per_minute: null, // expert-level price yahan mat bharo


        total_minutes: 0,
        total_spent: 0,
        last_end_time: chat.end_time,
        sessions: [],
      };
    }

    acc[id].sessions.push(chat);

    const mins = Number(chat.duration_minutes || 0);
    const ppm = Number(chat.price_per_minute || 16);

    acc[id].total_minutes += mins;
    acc[id].total_spent += calculateBilledAmount(mins, ppm);

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
  const { user, isLoggedIn } = useAuth();
  const { experts } = useExpert();
  const { balance } = useWallet();
  const navigate = useNavigate();

  // History states
  const [loading, setLoading] = useState(true);
  const [counterparties, setCounterparties] = useState([]);
  const [expandedExpertId, setExpandedExpertId] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  // ✅ Popups (same behavior as ExpertProfilePage)
  const [chatRequestId, setChatRequestId] = useState(null);
  const [showWaitingPopup, setShowWaitingPopup] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);
const [requiredAmount, setRequiredAmount] = useState(0);

  const [waitingText, setWaitingText] = useState(
    "Waiting for expert to accept..."
  );
  const [showChatRejected, setShowChatRejected] = useState(false);
  const [chatRejectedMessage, setChatRejectedMessage] = useState("");
  const [showChatCancelled, setShowChatCancelled] = useState(false);

  const expertById = useMemo(() => {
    const map = {};
    (experts || []).forEach((e) => {
      if (e?.id) {
        map[e.id] = {
          ...e,
          chat_per_minute: e.chat_per_minute || e.price?.chat_per_minute || 16,
        };
      }
    });
    return map;
  }, [experts]);

  const filteredCounterparties = useMemo(
    () =>
      (counterparties || []).filter((c) =>
        (c.expert_name || "").toLowerCase().includes(search.toLowerCase())
      ),
    [counterparties, search]
  );

  // ✅ EXACT SAME EXPERT PROFILE LOGIC FOR 5 MIN CHECK
 const handleStartChat = useCallback(
  (expertId) => {
    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: "/user/chat-history" } });
      return;
    }

    // ✅ PRIORITY 1: History data (chat_per_minute already mapped)
    const sessionData = counterparties.find(c => c.expert_id == expertId);
    // ✅ PRIORITY 2: Context data (backup)
    const ctxExpert = (experts || []).find(e => e.id == expertId);
    
    // ✅ DEBUG LOG
    console.log("💰 Price Debug:", {
      historyPrice: sessionData?.chat_per_minute,
      contextPrice: ctxExpert?.chat_per_minute,
      expertId,
      sessionData
    });

   const perMinute = Number(
  expertById[expertId]?.chat_per_minute || 16
);

    console.log("🎯 FINAL PRICE:", perMinute);

    const minRequired = perMinute * 5;
    const userBalance = Number(balance || 0);

    if (userBalance >= minRequired) {
      socket.emit("request_chat", {
  user_id: user.id,
  expert_id: expertId,
  user_name: `${user?.first_name || ""} ${user?.last_name || ""}`.trim(),
});
    } else {
      setRequiredAmount(Math.max(0, minRequired - userBalance));
      setShowRecharge(true);
    }
 }, [isLoggedIn, navigate, experts, expertById, balance, user?.id, counterparties]);



const handleRechargeClose = useCallback(() => {
  setShowRecharge(false);
  setRequiredAmount(0);
}, []);

const fetchGrouped = useCallback(async () => {
  try {
    setLoading(true);
    const res = await getUserChatHistoryApi(user?.id);
    const rows = res?.success ? res.data || [] : [];

    if (!rows.length) {
      setCounterparties([]);
      setLoading(false);
      return;
    }

    const grouped = groupByExpert(rows);

    const merged = grouped.map((c) => {
      const ctxExpert = expertById[c.expert_id];
      return {
        ...c,
        expert_name: ctxExpert?.name || c.expert_name || "Expert",
        expert_position: ctxExpert?.position || c.expert_position || "Expert",
        expert_avatar:
          ctxExpert?.profile_photo ||
          c.expert_avatar ||
          `https://i.pravatar.cc/150?img=${c.expert_id}`,
        // ✅ CORRECT: Session price use karo (rows me hai)
       chat_per_minute:
  Number(expertById[c.expert_id]?.chat_per_minute) ||
  16,


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

// useEffect(() => {
//   console.table(
//     experts.map(e => ({
//       id: e.id,
//       name: e.name,
//       price: e.chat_per_minute
//     }))
//   );
// }, [experts]);

// ✅ USER ONLINE REGISTRATION (MUST)
useEffect(() => {
  if (user?.id) {
    console.log("🟢 USER ONLINE (history page):", user.id);
    socket.emit("user_online", { user_id: user.id });
  }

  return () => {
    if (user?.id) {
      console.log("🔴 USER OFFLINE (history page):", user.id);
      socket.emit("user_offline", { user_id: user.id });
    }
  };
}, [user?.id]);


  useEffect(() => {
    if (user?.id) fetchGrouped();
  }, [user?.id, fetchGrouped]);

  // ✅ SOCKET EVENTS (same as ExpertProfilePage)
  useEffect(() => {
    const handleRequestPending = ({ request_id }) => {
      setChatRequestId(request_id);
      setShowWaitingPopup(true);
      setWaitingText("Waiting for expert to accept...");
    };

    const handleChatAccepted = ({ user_id, room_id }) => {
  if (Number(user_id) !== Number(user?.id)) return;

  console.log("✅ USER: Chat accepted → redirect", room_id);

  setShowWaitingPopup(false);
  setChatRequestId(null);
  navigate(`/user/chat/${room_id}`, { replace: true });
};

    const handleChatRejected = ({ user_id, message }) => {
      if (Number(user_id) !== Number(user?.id)) return;
      setShowWaitingPopup(false);
      setChatRequestId(null);
      setChatRejectedMessage(message || "Chat request was rejected");
      setShowChatRejected(true);
    };

    const handleChatCancelled = ({ user_id }) => {
      if (Number(user_id) !== Number(user?.id)) return;
      setShowWaitingPopup(false);
      setChatRequestId(null);
      setShowChatCancelled(true);
    };

    socket.on("request_pending", handleRequestPending);
    socket.on("chat_accepted", handleChatAccepted);
    socket.on("chat_rejected", handleChatRejected);
    socket.on("chat_cancelled", handleChatCancelled);

    return () => {
      socket.off("request_pending", handleRequestPending);
      socket.off("chat_accepted", handleChatAccepted);
      socket.off("chat_rejected", handleChatRejected);
      socket.off("chat_cancelled", handleChatCancelled);
    };
  }, [navigate, user?.id]);

  const openSession = useCallback(async (session) => {
    try {
      const res = await getChatHistoryMessagesApi(session.room_id);
      if (res?.success && res.data?.length) {
        setSelectedSession(session);
        setMessages(res.data);
        setShowDetails(true);
      } else {
        alert("No messages found for this session");
      }
    } catch (e) {
      console.error("❌ messages error:", e);
      alert("Failed to load chat messages");
    }
  }, []);

  const handleCancelRequest = useCallback(() => {
    if (chatRequestId && user?.id) {
      socket.emit("cancel_chat_request", {
        request_id: chatRequestId,
        user_id: user.id,
      });
    }
    setShowWaitingPopup(false);
    setChatRequestId(null);
  }, [chatRequestId, user?.id, user?.id]);

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

  const formatSeconds = (minutes = 0) => Math.round(Number(minutes || 0) * 60);
  const formatTime = (minutes = 0) => {
    const m = Number(minutes || 0);
    return m > 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
  };

  const selectedExpert = selectedSession
    ? expertById[selectedSession.expert_id]
    : null;

  const Spinner = () => (
    <div
      style={{
        width: 28,
        height: 28,
        border: "3px solid #e2e8f0",
        borderTopColor: "#0ea5e9",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        margin: "0 auto",
      }}
    />
  );

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner>Loading your chat history...</LoadingSpinner>
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
          <Title>Consultation History</Title>
          <SearchBar>
            <FiSearch size={18} />
            <input
              placeholder="Search by expert name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <FiX
                size={18}
                onClick={() => setSearch("")}
                style={{ cursor: "pointer" }}
              />
            )}
          </SearchBar>
        </Header>

        <HistoryList>
          {filteredCounterparties.length === 0 ? (
            <EmptyState>
              <FiMessageSquare size={48} />
              <h3>No Chat History Yet</h3>
              <p>Start your first chat to see history here.</p>
              <button onClick={() => navigate("/user/call-chat")}>
                Find Experts
              </button>
            </EmptyState>
          ) : (
            filteredCounterparties.map((c) => {
              const isOpen = expandedExpertId === c.expert_id;
              const totalSessions = c.sessions?.length || 0;
              const totalSpent = c.total_spent?.toFixed(1) || 0;

              return (
                <HistoryItem key={c.expert_id}>
                  <ChatHeader
                    onClick={() =>
                      setExpandedExpertId(isOpen ? null : c.expert_id)
                    }
                  >
                    <Avatar src={c.expert_avatar} />
                    <div style={{ flex: 1 }}>
                      <h4>
                        {c.expert_name}{" "}
                        <span style={{ fontSize: "12px", color: "#3b82f6" }}>
                          ₹{c.chat_per_minute}/min
                        </span>
                      </h4>
                      <p>{c.expert_position}</p>
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
                    <span>• ₹{totalSpent} total</span>
                  </ChatMeta>

                  {isOpen && (
                    <SessionsWrap>
                      {c.sessions.map((s) => {
                        const ppm = Number(
                          s.price_per_minute || c.chat_per_minute || 16
                        );
                        const actualMins = Number(s.duration_minutes || 0);
                        const billedAmount = calculateBilledAmount(
                          actualMins,
                          ppm
                        );
                        const seconds = formatSeconds(actualMins);

                        return (
                         <SessionCard key={s.id || `${s.room_id}_${s.end_time}`}>

                            <div className="session-info">
                              <div className="date">{formatDate(s.end_time)}</div>
                              <div className="rate">@ ₹{ppm}/min</div>
                              <div className="duration">
                                Duration: {seconds}s (₹{billedAmount})
                              </div>
                            </div>

                            <div className="amount">₹{billedAmount}</div>

                            <ActionButtons>
                              <ActionButton onClick={() => openSession(s)}>
                                View Chat
                              </ActionButton>

                              <ActionButton
                                onClick={() => handleStartChat(c.expert_id)}
                              >
                                <FiMessageSquare /> Chat Again
                              </ActionButton>
                            </ActionButtons>
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

        {/* ✅ READ-ONLY CHAT MODAL */}
        {showDetails && selectedSession && selectedExpert && (
          <ModalOverlay onClick={() => setShowDetails(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ChatHeaderBar>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <ChatAvatar
                    src={
                      selectedExpert.profile_photo || selectedExpert.expert_avatar
                    }
                  />
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
                      {selectedExpert.name || selectedExpert.expert_name}
                    </h3>
                    <p style={{ margin: "2px 0 0 0", fontSize: 12, color: "#64748b" }}>
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
                    padding: 4,
                    borderRadius: 4,
                  }}
                >
                  ×
                </button>
              </ChatHeaderBar>

              <ChatMessagesArea>
                {messages.length ? (
                  messages.map((msg, index) => (
                    <ChatMessageBubble
                      key={msg.id || index}
                      isExpert={msg.sender_type === "expert"}
                    >
                      <div className="message-header">
                        <strong>{msg.sender_name}</strong>
                        <span className="message-time">{msg.time}</span>
                      </div>
                      <div className="message-content">{msg.message}</div>
                    </ChatMessageBubble>
                  ))
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      color: "#94a3b8",
                      padding: "60px 20px",
                      fontSize: 14,
                    }}
                  >
                    No messages found.
                  </div>
                )}
              </ChatMessagesArea>

              <ChatInputArea>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 12,
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
                    This is a previous chat session (read-only).
                  </div>
                </div>
              </ChatInputArea>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* ✅ WAITING POPUP (same flow) */}
        {showWaitingPopup && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.55)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: 28,
                borderRadius: 18,
                width: "min(90vw, 420px)",
                textAlign: "center",
                boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
              }}
            >
              <h3 style={{ margin: 0, color: "#0f172a" }}>Request Sent</h3>
              <p style={{ marginTop: 12, color: "#475569" }}>{waitingText}</p>
              <div style={{ marginTop: 18 }}>
                <Spinner />
              </div>
              <button
                onClick={handleCancelRequest}
                style={{
                  marginTop: 22,
                  padding: "10px 18px",
                  borderRadius: 999,
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  color: "#334155",
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Cancel Request
              </button>
            </div>
          </div>
        )}
       {showRecharge && (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 }}>
    <div style={{ background: "#fff", padding: 28, borderRadius: 16, width: "min(90vw, 380px)", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}>
      <h3 style={{ margin: 0, marginBottom: 12, color: "#0f172a" }}>Low Balance</h3>
      <p style={{ margin: 0, marginBottom: 20, color: "#475569" }}>
        You need <strong>₹{requiredAmount.toFixed(2)}</strong> more to start this chat.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        {/* ✅ FIXED: StyledActionButton use karo */}
        <StyledActionButton
          $primary
          onClick={() => {
            setShowRecharge(false);
            navigate("/user/wallet");
          }}
        >
          Recharge Now
        </StyledActionButton>
        <StyledActionButton onClick={handleRechargeClose}>
          Cancel
        </StyledActionButton>
      </div>
    </div>
  </div>
)}


        {/* ✅ CHAT REJECTED POPUP */}
        {showChatRejected && chatRejectedMessage && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: 24,
                borderRadius: 16,
                width: "min(90vw, 400px)",
                textAlign: "center",
                boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
              }}
            >
              <FiX size={24} color="#ef4444" style={{ marginBottom: 12 }} />
              <h3 style={{ margin: 0, marginBottom: 8, color: "#dc2626" }}>
                Request Declined
              </h3>
              <p style={{ margin: 0, marginBottom: 20, color: "#475569" }}>
                {chatRejectedMessage}
              </p>
              <StyledActionButton
                $primary
                onClick={() => {
                  setShowChatRejected(false);
                  setChatRejectedMessage("");
                }}
              >
                OK
              </StyledActionButton>
            </div>
          </div>
        )}

        {/* ✅ CHAT CANCELLED POPUP */}
        {showChatCancelled && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
            }}
          >
            <div
              style={{
                background: "#fff",
                padding: 24,
                borderRadius: 16,
                width: "min(90vw, 400px)",
                textAlign: "center",
                boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
              }}
            >
              <FiX size={24} color="#6b7280" style={{ marginBottom: 12 }} />
              <h3 style={{ margin: 0, marginBottom: 8, color: "#475569" }}>
                Request Cancelled
              </h3>
              <p style={{ margin: 0, marginBottom: 20, color: "#475569" }}>
                Your chat request has been cancelled.
              </p>
              <StyledActionButton
                $primary
                onClick={() => setShowChatCancelled(false)}
              >
                OK
              </StyledActionButton>
            </div>
          </div>
        )}
      </PageContainer>
    </>
  );
};

export default UserChatHistory;
