// src/apps/user/pages/chat-history/UserChatHistory.jsx
// 🎨 PREMIUM POLISHED VERSION - Blue Theme
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMessageSquare,
  FiClock,
  FiChevronRight,
  FiChevronDown,
  FiSearch,
  FiX,
  FiDollarSign,
  FiUser,
  FiCalendar,
  FiMessageCircle,
  FiEye,
  FiTrendingUp,
  FiWatch,
  FiHeart,
  FiStar,
  FiBriefcase,
} from "react-icons/fi";
import { HiUsers } from "react-icons/hi";
import { BsChatLeftText, BsLightningCharge } from "react-icons/bs";
import { MdWorkspacePremium } from "react-icons/md";

import {
  PageContainer,
  Header,
  Title,
  HistoryList,
  HistoryItem,
  ChatHeader,
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
  StatsContainer,
  StatCard,
  FilterBar,
  PillBadge,
  // EarningsBadge,
  SessionHeader,
  PremiumContainer,
  ExpertBadge,
  UserMessageAvatar,
  SummaryCard,
  ChatAgainButton,
  ViewChatButton,
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
        chat_per_minute: null,
        total_minutes: 0,
        total_spent: 0,
        last_end_time: chat.end_time,
        sessions: [],
        rating: chat.expert_rating || 0,
        sessions_count: 0,
      };
    }

    acc[id].sessions.push(chat);
    acc[id].sessions_count++;

    const mins = Number(chat.duration_minutes || 0);
    const ppm = Number(chat.price_per_minute || 16);

    acc[id].total_minutes += mins;
    acc[id].total_spent += calculateBilledAmount(mins, ppm);

    if (chat.expert_rating && chat.expert_rating > acc[id].rating) {
      acc[id].rating = chat.expert_rating;
    }

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
  const [filterType, setFilterType] = useState("all");

  // ✅ Popups
  const [chatRequestId, setChatRequestId] = useState(null);
  const [showWaitingPopup, setShowWaitingPopup] = useState(false);
  const [showRecharge, setShowRecharge] = useState(false);
  const [requiredAmount, setRequiredAmount] = useState(0);
  const [waitingText, setWaitingText] = useState(
    "Waiting for expert to accept your request..."
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
          rating: e.rating || 0,
        };
      }
    });
    return map;
  }, [experts]);

  const filteredCounterparties = useMemo(() => {
    let arr = [...(counterparties || [])];
    
    // Search filter
    if (search) {
      arr = arr.filter((c) =>
        (c.expert_name || "").toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Type filter
    if (filterType === "recent") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      arr = arr.filter(c => new Date(c.last_end_time) > oneWeekAgo);
    } else if (filterType === "top") {
      arr.sort((a, b) => b.sessions_count - a.sessions_count);
    } else if (filterType === "expensive") {
      arr.sort((a, b) => b.chat_per_minute - a.chat_per_minute);
    }
    
    return arr;
  }, [counterparties, search, filterType]);

  // ✅ Calculate summary stats
  const summary = useMemo(() => {
    let totalMinutes = 0;
    let totalSpent = 0;
    let totalSessions = 0;
    let favoriteExpert = { name: 'None', sessions: 0 };

    counterparties.forEach((c) => {
      totalMinutes += Number(c.total_minutes || 0);
      totalSpent += Number(c.total_spent || 0);
      totalSessions += c.sessions_count || 0;
      
      if (c.sessions_count > favoriteExpert.sessions) {
        favoriteExpert = { 
          name: c.expert_name, 
          sessions: c.sessions_count 
        };
      }
    });

    return {
      totalMinutes: Math.round(totalMinutes || 0),
      totalSpent: Math.round(totalSpent || 0),
      totalSessions,
      favoriteExpert,
      avgSessionLength: totalSessions > 0 ? (totalMinutes / totalSessions).toFixed(1) : 0,
      expertCount: counterparties.length,
    };
  }, [counterparties]);

  const handleStartChat = useCallback(
    (expertId) => {
      if (!isLoggedIn) {
        navigate("/user/auth", { state: { from: "/user/chat-history" } });
        return;
      }

      const perMinute = Number(
        expertById[expertId]?.chat_per_minute || 16
      );

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
    },
    [isLoggedIn, navigate, expertById, balance, user?.id]
  );

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
          expert_position: ctxExpert?.position || c.expert_position || "Professional Advisor",
          expert_avatar:
            ctxExpert?.profile_photo ||
            c.expert_avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(c.expert_name || 'Expert')}&background=0ea5e9&color=fff`,
          chat_per_minute:
            Number(expertById[c.expert_id]?.chat_per_minute) || 16,
          rating: ctxExpert?.rating || c.rating || 0,
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

  // ✅ USER ONLINE REGISTRATION
  useEffect(() => {
    if (user?.id) {
      socket.emit("user_online", { user_id: user.id });
    }

    return () => {
      if (user?.id) {
        socket.emit("user_offline", { user_id: user.id });
      }
    };
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) fetchGrouped();
  }, [user?.id, fetchGrouped]);

  // ✅ SOCKET EVENTS
  useEffect(() => {
    const handleRequestPending = ({ request_id }) => {
      setChatRequestId(request_id);
      setShowWaitingPopup(true);
      setWaitingText("Waiting for expert to accept your request...");
    };

    const handleChatAccepted = ({ user_id, room_id }) => {
      if (Number(user_id) !== Number(user?.id)) return;
      setShowWaitingPopup(false);
      setChatRequestId(null);
      navigate(`/user/chat/${room_id}`, { replace: true });
    };

    const handleChatRejected = ({ user_id, message }) => {
      if (Number(user_id) !== Number(user?.id)) return;
      setShowWaitingPopup(false);
      setChatRequestId(null);
      setChatRejectedMessage(message || "Expert declined your chat request");
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
  }, [chatRequestId, user?.id]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (minutes = 0) => {
    const m = Number(minutes || 0);
    if (m < 1) return `${Math.round(m * 60)}s`;
    if (m < 60) return `${Math.round(m)}m`;
    const hours = Math.floor(m / 60);
    const mins = m % 60;
    return `${hours}h ${mins}m`;
  };

  const renderStars = (rating) => {
    return (
      <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            size={12}
            color={star <= rating ? "#fbbf24" : "#e2e8f0"}
            fill={star <= rating ? "#fbbf24" : "none"}
          />
        ))}
        <span style={{ fontSize: 12, marginLeft: 4, color: '#64748b' }}>
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const Spinner = () => (
    <div
      style={{
        width: 32,
        height: 32,
        border: "3px solid rgba(14, 165, 233, 0.1)",
        borderTopColor: "#0ea5e9",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        margin: "0 auto",
      }}
    />
  );

  if (loading && counterparties.length === 0) {
    return (
      <PremiumContainer>
        <PageContainer>
          <LoadingSpinner>
            <div className="spinner"></div>
            <p>Loading your consultation history...</p>
          </LoadingSpinner>
        </PageContainer>
      </PremiumContainer>
    );
  }

  return (
    <PremiumContainer>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .user-gradient-text {
          background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          display: inline-block;
        }
        
        .premium-card {
          background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid rgba(14, 165, 233, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        
        .premium-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(14, 165, 233, 0.12);
        }
        
        .expert-badge {
          background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
      `}</style>

      <PageContainer>
        {/* Enhanced Header with Stats */}
        <Header>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%', marginBottom: 32 }}>
            <div>
              <Title>
                <FiMessageSquare style={{ marginRight: 12, color: '#0ea5e9' }} />
                <span className="user-gradient-text">Consultation History</span>
              </Title>
              <p style={{ color: '#64748b', marginTop: 8, fontSize: 14, maxWidth: 600 }}>
                Review your past consultations, messages, and spending with experts
              </p>
            </div>
            
            <SummaryCard>
              <div className="summary-header">
                <FiTrendingUp size={20} />
                <span>Your Consultation Summary</span>
              </div>
              <div className="summary-stats">
                <div className="summary-stat">
                  <span className="stat-value">{summary.totalSessions}</span>
                  <span className="stat-label">Total Sessions</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-value">{summary.totalMinutes}</span>
                  <span className="stat-label">Total Minutes</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-value">₹{summary.totalSpent}</span>
                  <span className="stat-label">Total Spent</span>
                </div>
              </div>
              <div className="summary-meta">
                <span className="meta-item">
                  <HiUsers size={14} /> {summary.expertCount} experts
                </span>
                <span className="meta-item">
                  <FiHeart size={14} /> {summary.favoriteExpert.name} ({summary.favoriteExpert.sessions} sessions)
                </span>
              </div>
            </SummaryCard>
          </div>

          {/* Stats Grid */}
          <StatsContainer>
            <StatCard accent>
              <div className="stat-icon" style={{ background: 'rgba(14, 165, 233, 0.1)' }}>
                <BsLightningCharge color="#0ea5e9" />
              </div>
              <div className="stat-content">
                <span className="stat-value">{summary.totalSessions}</span>
                <span className="stat-label">Consultations</span>
              </div>
            </StatCard>
            
            <StatCard>
              <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                <FiWatch color="#22c55e" />
              </div>
              <div className="stat-content">
                <span className="stat-value">{summary.totalMinutes}</span>
                <span className="stat-label">Total Minutes</span>
              </div>
            </StatCard>
            
            <StatCard primary>
              <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                <FiDollarSign color="#8b5cf6" />
              </div>
              <div className="stat-content">
                <span className="stat-value">₹{summary.totalSpent}</span>
                <span className="stat-label">Total Spent</span>
              </div>
            </StatCard>
            
            <StatCard>
              <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                <FiStar color="#f59e0b" />
              </div>
              <div className="stat-content">
                <span className="stat-value">{summary.expertCount}</span>
                <span className="stat-label">Experts Consulted</span>
              </div>
            </StatCard>
          </StatsContainer>

          {/* Enhanced Filter Bar */}
          <FilterBar>
            <SearchBar premium>
              <FiSearch size={18} />
              <input
                placeholder="Search experts by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <FiX
                  size={18}
                  onClick={() => setSearch("")}
                  style={{ cursor: "pointer", color: '#64748b' }}
                />
              )}
            </SearchBar>
            
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <PillBadge 
                active={filterType === 'all'} 
                onClick={() => setFilterType('all')}
              >
                All Experts
              </PillBadge>
              <PillBadge 
                active={filterType === 'recent'} 
                onClick={() => setFilterType('recent')}
              >
                Recent
              </PillBadge>
              <PillBadge 
                active={filterType === 'top'} 
                onClick={() => setFilterType('top')}
              >
                Most Consulted
              </PillBadge>
              <PillBadge 
                active={filterType === 'expensive'} 
                onClick={() => setFilterType('expensive')}
              >
                Premium First
              </PillBadge>
            </div>
          </FilterBar>
        </Header>

        {/* History List */}
        <HistoryList>
          {filteredCounterparties.length === 0 ? (
            <EmptyState premium>
              <div className="empty-icon">
                <BsChatLeftText size={56} />
              </div>
              <h3>No Consultation History Yet</h3>
              <p>Start your first consultation to see your history here</p>
              <button 
                className="premium-btn"
                onClick={() => navigate("/user/call-chat")}
              >
                <BsLightningCharge style={{ marginRight: 8 }} />
                Find Experts
              </button>
            </EmptyState>
          ) : (
            filteredCounterparties.map((c) => {
              const isOpen = expandedExpertId === c.expert_id;
              const totalSessions = c.sessions_count || 0;
              const totalSpent = c.total_spent || 0;

              return (
                <HistoryItem key={c.expert_id} premium className="premium-card">
                  <ChatHeader
                    onClick={() => setExpandedExpertId(isOpen ? null : c.expert_id)}
                    premium
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <Avatar premium src={c.expert_avatar}>
                        {!c.expert_avatar && (
                          <FiUser size={24} />
                        )}
                      </Avatar>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                          <h4>{c.expert_name}</h4>
                          <ExpertBadge>
                            <FiBriefcase size={12} />
                            {c.expert_position}
                          </ExpertBadge>
                          {/* <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                            {renderStars(c.rating)} */}
                            <div style={{ 
                              background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
                              color: 'white',
                              padding: '4px 12px',
                              borderRadius: '20px',
                              fontSize: '13px',
                              fontWeight: '600'
                            }}>
                              ₹{c.chat_per_minute}/min
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                          <span className="meta-item">
                            <FiClock size={12} /> {formatTime(c.total_minutes)} total
                          </span>
                          <span className="meta-item">
                            <FiMessageSquare size={12} /> {totalSessions} sessions
                          </span>
                          <span className="meta-item">
                             ₹{totalSpent.toFixed(0)} spent
                          </span>
                        </div>
                      </div>
                    
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 12, color: '#64748b' }}>Last consultation</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a' }}>{formatDate(c.last_end_time)}</div>
                      </div>
                      {isOpen ? (
                        <FiChevronDown size={20} className="chevron-icon" />
                      ) : (
                        <FiChevronRight size={20} className="chevron-icon" />
                      )}
                    </div>
                  </ChatHeader>

                  {isOpen && (
                    <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '0 0 16px 16px', borderTop: '1px solid #e2e8f0' }}>
                      <SessionHeader>
                        <h5>Consultation Sessions</h5>
                        <div className="expert-badge">
                          <FiCalendar size={12} /> {totalSessions} consultations
                        </div>
                      </SessionHeader>
                      
                      <SessionsWrap>
                        {c.sessions.map((s, idx) => {
                          const ppm = Number(s.price_per_minute || c.chat_per_minute || 16);
                          const actualMins = Number(s.duration_minutes || 0);
                          const billedAmount = calculateBilledAmount(actualMins, ppm);
                          const seconds = Math.round(actualMins * 60);

                          return (
                            <SessionCard key={s.id || `${s.room_id}_${s.end_time}`} premium>
                              <div className="session-indicator">
                                <div className="session-number">{idx + 1}</div>
                              </div>
                              
                              <div className="session-info">
                                <div className="session-details">
                                  <div className="date">
                                    <FiCalendar size={14} />
                                    {formatDate(s.end_time)}
                                  </div>
                                  <div className="duration">
                                    <FiWatch size={14} />
                                    {formatTime(actualMins)} • {seconds}s total
                                  </div>
                                </div>
                                <div className="session-meta">
                                  <span className="rate-label">
                                    @ ₹{ppm}/min
                                  </span>
                                  {/* <span className="room-id">
                                    Session ID: #{s.room_id?.slice(-6) || 'N/A'}
                                  </span> */}
                                </div>
                              </div>
                              
                              <div className="session-amount">
                                <div className="amount-label">Amount Paid</div>
                                <div className="amount">₹{billedAmount}</div>
                              </div>
                              
                              <ActionButtons>
                                <ViewChatButton onClick={() => openSession(s)}>
                                  <FiEye size={14} />
                                  View Chat
                                </ViewChatButton>
                                
                                <ChatAgainButton onClick={() => handleStartChat(c.expert_id)}>
                                  <FiMessageSquare size={14} />
                                  Chat Again
                                </ChatAgainButton>
                              </ActionButtons>
                            </SessionCard>
                          );
                        })}
                      </SessionsWrap>
                    </div>
                  )}
                </HistoryItem>
              );
            })
          )}
        </HistoryList>

        {/* Enhanced Chat Modal */}
        {showDetails && selectedSession && (
          <ModalOverlay onClick={() => setShowDetails(false)}>
            <ModalContent premium onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-user-info">
                  <Avatar 
                    premium 
                    src={selectedSession.expert_avatar}
                    style={{ width: 56, height: 56 }}
                  />
                  <div>
                    <h3>{selectedSession.expert_name || "Expert"}</h3>
                    <div className="modal-meta">
                      <span>{formatDate(selectedSession.end_time)}</span>
                      <span>•</span>
                      <span>{formatTime(selectedSession.duration_minutes)} duration</span>
                      {/* <span>•</span> */}
                      {/* <span className="spent">
                        ₹{calculateBilledAmount(
                          selectedSession.duration_minutes,
                          selectedSession.price_per_minute || selectedSession.chat_per_minute || 16
                        )} spent
                      </span> */}
                    </div>
                  </div>
                </div>
                <button
                  className="modal-close"
                  onClick={() => setShowDetails(false)}
                >
                  ×
                </button>
              </div>

              <ChatMessagesArea premium>
                <div className="messages-scroll">
                  {messages.length ? (
                    messages.map((msg, index) => (
                      <ChatMessageBubble
                        key={msg.id || index}
                        isExpert={msg.sender_type === "expert"}
                        premium
                      >
                        <div className="message-header">
                          <div className="sender-info">
                            <UserMessageAvatar isExpert={msg.sender_type === "expert"}>
                              {msg.sender_type === "expert" ? (
                                <FiBriefcase size={12} />
                              ) : (
                                <FiUser size={12} />
                              )}
                            </UserMessageAvatar>
                            <div>
                              <strong>{msg.sender_name}</strong>
                              <span className="sender-role">
                                {msg.sender_type === "expert" ? "Expert" : "You"}
                              </span>
                            </div>
                          </div>
                          <span className="message-time">
                            {msg.time_sent
                              ? new Date(msg.time_sent).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "-"}
                          </span>
                        </div>
                        <div className="message-content">
                          {msg.message}
                        </div>
                      </ChatMessageBubble>
                    ))
                  ) : (
                    <div className="no-messages">
                      <FiMessageCircle size={48} />
                      <p>No messages available for this session</p>
                    </div>
                  )}
                </div>
              </ChatMessagesArea>

              <div className="modal-footer">
                <div className="footer-note">
                  <MdWorkspacePremium size={16} />
                  Previous consultation session (read-only)
                </div>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}

        {/* Enhanced Waiting Popup */}
        {showWaitingPopup && (
          <div className="waiting-popup-overlay">
            <div className="waiting-popup">
              <div className="popup-icon">
                <BsLightningCharge size={32} />
              </div>
              <h3>Request Sent</h3>
              <p>{waitingText}</p>
              <div className="popup-spinner">
                <Spinner />
              </div>
              <button
                className="cancel-request-btn"
                onClick={handleCancelRequest}
              >
                Cancel Request
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Recharge Popup */}
        {showRecharge && (
          <div className="recharge-popup-overlay">
            <div className="recharge-popup">
              <div className="popup-icon warning">
                {/* <FiDollarSign size={32} /> */}
              </div>
              <h3>Insufficient Balance</h3>
              <p>
                You need <strong>₹{requiredAmount.toFixed(2)}</strong> more to start this consultation
              </p>
              <div className="popup-actions">
                <ActionButton 
                  primary 
                  onClick={() => {
                    setShowRecharge(false);
                    navigate("/user/wallet");
                  }}
                >
                  Recharge Now
                </ActionButton>
                <ActionButton onClick={handleRechargeClose}>
                  Cancel
                </ActionButton>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Chat Rejected Popup */}
        {showChatRejected && chatRejectedMessage && (
          <div className="reject-popup-overlay">
            <div className="reject-popup">
              <div className="popup-icon error">
                <FiX size={32} />
              </div>
              <h3>Request Declined</h3>
              <p>{chatRejectedMessage}</p>
              <ActionButton 
                primary 
                onClick={() => {
                  setShowChatRejected(false);
                  setChatRejectedMessage("");
                }}
              >
                OK
              </ActionButton>
            </div>
          </div>
        )}

        {/* Enhanced Chat Cancelled Popup */}
        {showChatCancelled && (
          <div className="cancel-popup-overlay">
            <div className="cancel-popup">
              <div className="popup-icon">
                <FiMessageSquare size={32} />
              </div>
              <h3>Request Cancelled</h3>
              <p>Your chat request has been cancelled</p>
              <ActionButton 
                primary 
                onClick={() => setShowChatCancelled(false)}
              >
                OK
              </ActionButton>
            </div>
          </div>
        )}
      </PageContainer>
    </PremiumContainer>
  );
};

export default UserChatHistory;