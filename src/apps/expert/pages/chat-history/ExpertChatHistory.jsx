// src/apps/expert/pages/chat-history/ExpertChatHistory.jsx
// 🎨 POLISHED PREMIUM VERSION
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
} from "react-icons/fi";
import { HiUsers } from "react-icons/hi";
import { BsChatLeftText } from "react-icons/bs";

import {
  PageContainer,
  Header,
  Title,
  HistoryList,
  HistoryItem,
  ChatHeader,
  // ChatMeta,
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
  StatsContainer,
  StatCard,
  FilterBar,
  PillBadge,
  // GradientTitle,
  EarningsBadge,
  SessionHeader,
  MessageAvatar,
  PremiumContainer,
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
        username: chat.user_name || chat.username,
        user_avatar: chat.user_avatar,
        total_minutes: 0,
        total_earnings: 0,
        last_end_time: chat.end_time,
        sessions: [],
        session_count: 0,
      };
    }

    acc[id].sessions.push(chat);
    acc[id].session_count++;

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
  const [filterType, setFilterType] = useState("all");

  // ✅ Fetch grouped chat history
  const fetchGrouped = useCallback(async () => {
    const expertId = expertData?.expert_id || expertData?.expertId;
    
    if (!expertId) {
      console.log("❌ No expert ID found");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await getExpertChatHistoryApi(expertId);
      
      const rows = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : res?.success
        ? res.data || []
        : [];
        
      const grouped = groupByUser(rows, expertPrice?.chat_per_minute || 16);
      setCounterparties(grouped);
    } catch (e) {
      console.error("❌ API Error:", e);
      setCounterparties([]);
    } finally {
      setLoading(false);
    }
  }, [expertData?.expert_id, expertData?.expertId, expertPrice?.chat_per_minute]);

  useEffect(() => {
    const handleBack = () => {
      navigate("/expert", { replace: true });
    };

    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, [navigate]);

  useEffect(() => {
    fetchGrouped();
  }, [fetchGrouped]);

  // ✅ Enhanced search + filter
  const filtered = useMemo(() => {
    let arr = [...(counterparties || [])];
    
    // Search filter
    if (searchTerm) {
      arr = arr.filter((c) =>
        c.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Type filter
    if (filterType === "recent") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      arr = arr.filter(c => new Date(c.last_end_time) > oneWeekAgo);
    } else if (filterType === "top") {
      arr.sort((a, b) => b.total_earnings - a.total_earnings);
    }
    
    return arr;
  }, [counterparties, searchTerm, filterType]);

  // ✅ Enhanced summary with metrics
  const summary = useMemo(() => {
    const ppm = Number(expertPrice?.chat_per_minute || 16);
    let totalMinutes = 0;
    let totalSessions = 0;
    let avgSessionLength = 0;

    counterparties.forEach((c) => {
      totalMinutes += Number(c.total_minutes || 0);
      totalSessions += c.sessions?.length || 0;
    });

    avgSessionLength = totalSessions > 0 ? totalMinutes / totalSessions : 0;
    const gross = totalMinutes * ppm;
    const company = gross * 0.2;
    const expertEarn = gross - company;

    return {
      totalMinutes: Math.round(totalMinutes || 0),
      expertEarn: expertEarn || 0,
      totalSessions,
      avgSessionLength: Math.round(avgSessionLength * 10) / 10,
      topEarner: counterparties.reduce((max, c) => 
        c.total_earnings > max.total_earnings ? c : max, 
        { username: 'None', total_earnings: 0 }
      ),
    };
  }, [counterparties, expertPrice?.chat_per_minute]);

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

  if (loading && counterparties.length === 0) {
    return (
      <PageContainer>
        <LoadingSpinner>
          <div className="spinner"></div>
          <p>Loading your chat history...</p>
        </LoadingSpinner>
      </PageContainer>
    );
  }

  return (
    <PremiumContainer>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          display: inline-block;
        }
        
        .premium-card {
          background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
          border: 1px solid rgba(139, 92, 246, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        
        .premium-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(139, 92, 246, 0.12);
        }
        
        .session-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div>
              <Title>
                <FiMessageSquare style={{ marginRight: 12 }} />
                <span className="gradient-text">Chat History</span>
              </Title>
              <p style={{ color: '#64748b', marginTop: 8, fontSize: 14 }}>
                Track conversations and earnings from all your chat sessions
              </p>
            </div>
            
            <StatsContainer>
              <StatCard>
                <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                  <HiUsers color="#8b5cf6" />
                </div>
                <div className="stat-content">
                  <span className="stat-value">{counterparties.length}</span>
                  <span className="stat-label">Total Users</span>
                </div>
              </StatCard>
              
              <StatCard>
                <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                  <FiTrendingUp color="#22c55e" />
                </div>
                <div className="stat-content">
                  <span className="stat-value">{summary.totalSessions}</span>
                  <span className="stat-label">Total Sessions</span>
                </div>
              </StatCard>
              
              <StatCard accent>
                <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                  <FiWatch color="#f59e0b" />
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
                  <span className="stat-value">₹{(summary.expertEarn || 0).toFixed(0)}</span>
                  <span className="stat-label">Total Earnings</span>
                </div>
              </StatCard>
            </StatsContainer>
          </div>

          {/* Enhanced Filter Bar */}
          <FilterBar>
            <SearchBar premium>
              <FiSearch size={18} />
              <input
                placeholder="Search users by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <FiX
                  size={18}
                  onClick={() => setSearchTerm("")}
                  style={{ cursor: "pointer", color: '#64748b' }}
                />
              )}
            </SearchBar>
            
            <div style={{ display: 'flex', gap: 12 }}>
              <PillBadge 
                active={filterType === 'all'} 
                onClick={() => setFilterType('all')}
              >
                All Users
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
                Top Earners
              </PillBadge>
            </div>
          </FilterBar>
        </Header>

        {/* History List */}
        <HistoryList>
          {filtered.length === 0 ? (
            <EmptyState premium>
              <div className="empty-icon">
                <BsChatLeftText size={56} />
              </div>
              <h3>No Chat History Found</h3>
              <p>Start chatting with users to see your history here</p>
              <button 
                className="premium-btn"
                onClick={() => navigate("/expert")}
              >
                Go to Dashboard
              </button>
            </EmptyState>
          ) : (
            filtered.map((c) => {
              const isOpen = expandedUserId === c.user_id;
              const totalSessions = c.sessions?.length || 0;
              const totalEarnings = c.total_earnings || 0;
              const avgEarning = totalSessions > 0 ? totalEarnings / totalSessions : 0;

              return (
                <HistoryItem key={c.user_id} premium className="premium-card">
                  <ChatHeader
                    onClick={() => setExpandedUserId(isOpen ? null : c.user_id)}
                    premium
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <Avatar premium src={c.user_avatar} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <h4>{c.username}</h4>
                          <EarningsBadge>₹{totalEarnings.toFixed(0)}</EarningsBadge>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 4 }}>
                          <span className="meta-item">
                            <FiUser size={12} /> {totalSessions} sessions
                          </span>
                          <span className="meta-item">
                            <FiClock size={12} /> {formatTime(c.total_minutes)}
                          </span>
                          <span className="meta-item">
                            {/* <FiDollarSign size={12} />*/} ₹{avgEarning.toFixed(0)} avg 
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 12, color: '#64748b' }}>Last session</div>
                        <div style={{ fontSize: 13,color: '#64748b', fontWeight: 600 }}>{formatDate(c.last_end_time)}</div>
                      </div>
                      {isOpen ? (
                        <FiChevronDown size={20} className="chevron-icon" />
                      ) : (
                        <FiChevronRight size={20} className="chevron-icon" />
                      )}
                    </div>
                  </ChatHeader>

                  {isOpen && (
                    <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '0 0 12px 12px' }}>
                      <SessionHeader>
                        <h5>Chat Sessions</h5>
                        <div className="session-badge">
                          <FiCalendar size={12} /> {totalSessions} total
                        </div>
                      </SessionHeader>
                      
                      <SessionsWrap>
                        {c.sessions.map((s, idx) => {
                          const ppm = Number(
                            s.price_per_minute || expertPrice?.chat_per_minute || 16
                          );
                          const actualMins = Number(s.duration_minutes || 0);
                          const earnings = calculateEarnings(actualMins, ppm);
                          const seconds = Math.round(actualMins * 60);

                          return (
                            <SessionCard key={s.id || s.room_id} premium>
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
                                    <FiClock size={14} />
                                    {seconds}s duration
                                  </div>
                                </div>
                                <div className="session-meta">
                                  {/* <span className="room-id">Room: #{s.room_id?.slice(-6)}</span> */}
                                </div>
                              </div>
                              
                              <div className="session-earnings">
                                <div className="amount-label">Earned</div>
                                <div className="amount">₹{earnings}</div>
                              </div>
                              
                              <ActionButton premium onClick={() => openSession(s)}>
                                <FiEye size={14} />
                                View Chat
                              </ActionButton>
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
                  <MessageAvatar 
                    src={selectedSession.user_avatar}
                    size="large"
                  />
                  <div>
                    <h3>{selectedSession.username || selectedSession.user_name}</h3>
                    <div className="modal-meta">
                      <span>{formatDate(selectedSession.end_time)}</span>
                      <span>•</span>
                      <span>{formatTime(selectedSession.duration_minutes)} duration</span>
                      <span>•</span>
                      <span className="earnings">₹{calculateEarnings(
                        selectedSession.duration_minutes,
                        selectedSession.price_per_minute || expertPrice?.chat_per_minute || 16
                      )} earned</span>
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

              <MessagesArea premium>
                <div className="messages-scroll">
                  {messages.length ? (
                    messages.map((msg, index) => (
                      <MessageBubble
                        key={msg.id || index}
                        isExpert={msg.sender_type === "expert"}
                        premium
                      >
                        <div className="message-header">
                          <div className="sender-info">
                            <MessageAvatar 
                              isExpert={msg.sender_type === "expert"}
                              small
                            />
                            <div>
                              <strong>{msg.sender_name}</strong>
                              <span className="sender-role">
                                {msg.sender_type === "expert" ? "Expert" : "User"}
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
                      </MessageBubble>
                    ))
                  ) : (
                    <div className="no-messages">
                      <FiMessageCircle size={48} />
                      <p>No messages available</p>
                    </div>
                  )}
                </div>
              </MessagesArea>

              <div className="modal-footer">
                <div className="footer-note">
                  <FiMessageSquare />
                  Previous chat session (read-only)
                </div>
              </div>
            </ModalContent>
          </ModalOverlay>
        )}
      </PageContainer>
    </PremiumContainer>
  );
};

export default ExpertChatHistory;