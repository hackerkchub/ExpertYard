// 🎨 POLISHED PREMIUM VERSION - FULLY RESPONSIVE with Call History
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMessageSquare,
  FiClock,
  FiChevronRight,
  FiChevronDown,
  FiSearch,
  FiX,
  FiUser,
  FiCalendar,
  FiMessageCircle,
  FiEye,
  FiTrendingUp,
  FiWatch,
  FiPhone,
  FiVideo,
  FiPhoneMissed,
  FiXCircle,
  FiCheckCircle,
  FiZap,
  FiBookOpen,
} from "react-icons/fi";
import { HiUsers } from "react-icons/hi";
import { BsChatLeftText, BsTelephone } from "react-icons/bs";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { IoMdCall } from "react-icons/io";

import {
  PremiumContainer,
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
  EarningsBadge,
  SessionHeader,
  MessageAvatar,
  TabContainer,
  TabButton,
  MobileSummaryToggle,
  ResponsiveGrid,
  StatusBadge,
  PricingBadge,
} from "./ExpertChatHistory.styles";

import { useExpert } from "../../../../shared/context/ExpertContext";
import {
  getExpertChatHistoryApi,
  getChatHistoryMessagesApi,
} from "../../../../shared/api/chatHistory.api";
import { getExpertCallHistoryApi } from "../../../../shared/api/callHistory.api";

// ✅ FIXED BILLING: 1 MIN MINIMUM + ceil seconds
const calculateEarnings = (durationMinutes, pricePerMinute) => {
  const totalSeconds = Math.round(Number(durationMinutes || 0) * 60);
  const billedMinutes = Math.ceil(totalSeconds / 60);
  return Math.max(1, billedMinutes) * Number(pricePerMinute || 16);
};

// ✅ Format duration for calls
const formatDuration = (minutes = 0) => {
  const m = Number(minutes || 0);
  if (m < 1) return `${Math.round(m * 60)}s`;
  if (m < 60) return `${Math.round(m)}m`;
  const hours = Math.floor(m / 60);
  const mins = m % 60;
  return `${hours}h ${mins}m`;
};

const getAvatarUrl = (name, avatar) => {
  return (
    avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name || "User"
    )}&background=0a66c2&color=fff`
  );
};

// ✅ Status display mapping for calls
const STATUS_CONFIG = {
  completed: {
    label: 'Completed',
    icon: FiCheckCircle,
    color: '#000080',
    bgColor: 'rgba(10, 102, 194, 0.1)'
  },
  missed: {
    label: 'Missed',
    icon: FiPhoneMissed,
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)'
  },
  rejected: {
    label: 'Rejected',
    icon: FiXCircle,
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)'
  },
  accepted: {
    label: 'In Progress',
    icon: FiPhone,
    color: '#000080',
    bgColor: 'rgba(10, 102, 194, 0.1)'
  },
  ended: {
    label: 'Completed',
    icon: FiCheckCircle,
    color: '#000080',
    bgColor: 'rgba(10, 102, 194, 0.1)'
  }
};

// ✅ Get pricing mode display
const getPricingModeDisplay = (priceData) => {
  const modes = priceData?.pricing_modes || [];
  const hasPerMinute = modes.includes('per_minute');
  const hasSession = modes.includes('session');
  const hasPlans = priceData?.hasPlans || false;
  
  if (hasPerMinute) return { type: 'per_minute', label: 'Per Minute', icon: '💰' };
  if (hasSession) return { type: 'session', label: 'Session Based', icon: '📋' };
  if (hasPlans) return { type: 'plans', label: 'Subscription Plans', icon: '📦' };
  return { type: 'none', label: 'Contact', icon: '📞' };
};

// ✅ FIXED: groupByUser for chat - handles both user_name & username
const groupChatByUser = (rows = [], expertPricePerMinute = 0, pricingModes = []) => {
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

// ✅ Group calls by user
const groupCallsByUser = (calls = []) => {
  const map = calls.reduce((acc, call) => {
    const id = call.user_id || call.caller_id;
    if (!id) return acc;

    if (!acc[id]) {
      acc[id] = {
        user_id: id,
        username: call.user_name,
        user_avatar: call.user_avatar,
        total_calls: 0,
        total_duration: 0,
        total_earnings: 0,
        last_call_time: call.ended_at || call.created_at,
        calls: [],
        missed_count: 0,
        rejected_count: 0,
        completed_count: 0,
      };
    }

    acc[id].calls.push(call);
    acc[id].total_calls++;

    // Update counts by status
    if (call.status === 'ended') {
      acc[id].completed_count++;
      const mins = Number(call.duration || 0);
      const ppm = Number(call.price_per_minute || 16);
      acc[id].total_duration += mins;
      acc[id].total_earnings += calculateEarnings(mins, ppm);
    } else if (call.status === 'missed') {
      acc[id].missed_count++;
    } else if (call.status === 'rejected') {
      acc[id].rejected_count++;
    }

    // Update last call time
    const callTime = call.ended_at || call.created_at;
    if (callTime && (!acc[id].last_call_time || new Date(callTime) > new Date(acc[id].last_call_time))) {
      acc[id].last_call_time = callTime;
    }

    return acc;
  }, {});

  return Object.values(map)
    .map(g => ({
      ...g,
      calls: [...g.calls].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      )
    }))
    .sort((a, b) => new Date(b.last_call_time) - new Date(a.last_call_time));
};

const ExpertChatHistory = () => {
  const { expertData, expertPrice } = useExpert();
  const navigate = useNavigate();

  // Tab states
  const [activeMainTab, setActiveMainTab] = useState('chat');
  const [activeCallSubTab, setActiveCallSubTab] = useState('all');
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  // Chat history states
  const [chatLoading, setChatLoading] = useState(true);
  const [chatCounterparties, setChatCounterparties] = useState([]);
  const [expandedChatUserId, setExpandedChatUserId] = useState(null);

  // Call history states
  const [callLoading, setCallLoading] = useState(false);
  const [calls, setCalls] = useState([]);
  const [groupedCallUsers, setGroupedCallUsers] = useState([]);
  const [expandedCallUserId, setExpandedCallUserId] = useState(null);

  // Common states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Get pricing data from context
  const pricingModes = useMemo(() => {
    return expertPrice?.pricing_modes || [];
  }, [expertPrice]);

  const hasPerMinute = useMemo(() => pricingModes.includes('per_minute'), [pricingModes]);
  const hasSession = useMemo(() => pricingModes.includes('session'), [pricingModes]);
  
  const chatPrice = useMemo(() => {
    return Number(expertPrice?.chat || expertPrice?.chat_per_minute || 16);
  }, [expertPrice]);
  
  const callPrice = useMemo(() => {
    return Number(expertPrice?.call || expertPrice?.call_per_minute || 16);
  }, [expertPrice]);
  
  const sessionPrice = useMemo(() => {
    return expertPrice?.session?.price || expertPrice?.session_price || 0;
  }, [expertPrice]);
  
  const sessionDuration = useMemo(() => {
    return expertPrice?.session?.duration || expertPrice?.session_duration || 30;
  }, [expertPrice]);

  const pricingDisplay = useMemo(() => {
    if (hasPerMinute) {
      return {
        type: 'per_minute',
        label: 'Per Minute Pricing',
        chatRate: chatPrice,
        callRate: callPrice,
        icon: '💰'
      };
    }
    if (hasSession) {
      return {
        type: 'session',
        label: 'Session Based Pricing',
        sessionPrice: sessionPrice,
        sessionDuration: sessionDuration,
        icon: '📋'
      };
    }
    return {
      type: 'none',
      label: 'Contact for Pricing',
      icon: '📞'
    };
  }, [hasPerMinute, hasSession, chatPrice, callPrice, sessionPrice, sessionDuration]);

  // Track window width for responsive adjustments
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ Fetch grouped chat history
  const fetchChatHistory = useCallback(async () => {
    const expertId = expertData?.expert_id || expertData?.expertId;
    
    if (!expertId) {
      console.log("❌ No expert ID found");
      setChatLoading(false);
      return;
    }

    try {
      setChatLoading(true);
      const res = await getExpertChatHistoryApi(expertId);
      
      const rows = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : res?.success
        ? res.data || []
        : [];
        
      const grouped = groupChatByUser(rows, chatPrice, pricingModes);
      setChatCounterparties(grouped);
    } catch (e) {
      console.error("❌ API Error:", e);
      setChatCounterparties([]);
    } finally {
      setChatLoading(false);
    }
  }, [expertData?.expert_id, expertData?.expertId, chatPrice, pricingModes]);

  // ✅ Fetch call history
  const fetchCallHistory = useCallback(async () => {
    const expertId = expertData?.expert_id || expertData?.expertId;
    
    if (!expertId) return;

    try {
      setCallLoading(true);
      const params = {};
      if (activeCallSubTab !== 'all') {
        params.status = activeCallSubTab === 'completed' ? 'ended' : activeCallSubTab;
      }
      
      const res = await getExpertCallHistoryApi(params);
      const callsData = res?.data?.data || [];
      
      // Filter out ringing status
      const filteredCalls = callsData.filter(call => call.status !== 'ringing');
      
      setCalls(filteredCalls);
      
      // Group by user for expanded view
      const grouped = groupCallsByUser(filteredCalls);
      setGroupedCallUsers(grouped);
    } catch (error) {
      console.error("❌ Error fetching call history:", error);
      setCalls([]);
      setGroupedCallUsers([]);
    } finally {
      setCallLoading(false);
    }
  }, [expertData?.expert_id, expertData?.expertId, activeCallSubTab]);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handleBack = () => {
      navigate("/expert/home", { replace: true });
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [navigate]);

  // Fetch data based on active tab
  useEffect(() => {
    if (activeMainTab === 'chat') {
      fetchChatHistory();
    } else {
      fetchCallHistory();
    }
  }, [activeMainTab, activeCallSubTab, fetchChatHistory, fetchCallHistory]);

  // ✅ Enhanced search + filter for chat
  const filteredChat = useMemo(() => {
    let arr = [...(chatCounterparties || [])];
    
    if (searchTerm) {
      arr = arr.filter((c) =>
        c.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType === "recent") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      arr = arr.filter(c => new Date(c.last_end_time) > oneWeekAgo);
    } else if (filterType === "top") {
      arr.sort((a, b) => b.total_earnings - a.total_earnings);
    }
    
    return arr;
  }, [chatCounterparties, searchTerm, filterType]);

  // ✅ Filter calls
  const filteredCalls = useMemo(() => {
    if (activeMainTab !== 'call') return [];
    
    let filtered = [...calls];
    
    if (searchTerm) {
      filtered = filtered.filter(call => 
        (call.user_name || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (activeCallSubTab !== 'all') {
      filtered = filtered.filter(call => {
        if (activeCallSubTab === 'completed') {
          return call.status === 'ended';
        }
        return call.status === activeCallSubTab;
      });
    }
    
    return filtered;
  }, [calls, searchTerm, activeMainTab, activeCallSubTab]);

  // Filter grouped call users
  const filteredGroupedCallUsers = useMemo(() => {
    let filtered = [...groupedCallUsers];
    
    if (searchTerm) {
      filtered = filtered.filter(g =>
        (g.username || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [groupedCallUsers, searchTerm]);

  // ✅ Enhanced chat summary with metrics
  const chatSummary = useMemo(() => {
    let totalMinutes = 0;
    let totalSessions = 0;
    let avgSessionLength = 0;

    chatCounterparties.forEach((c) => {
      totalMinutes += Number(c.total_minutes || 0);
      totalSessions += c.sessions?.length || 0;
    });

    avgSessionLength = totalSessions > 0 ? totalMinutes / totalSessions : 0;
    
    // Calculate earnings based on pricing mode
    let expertEarn = 0;
    if (hasPerMinute) {
      expertEarn = totalMinutes * chatPrice;
    } else if (hasSession) {
      expertEarn = totalSessions * sessionPrice;
    }

    const company = expertEarn * 0.2;
    const netEarn = expertEarn - company;

    return {
      totalMinutes: Math.round(totalMinutes || 0),
      expertEarn: netEarn || 0,
      grossEarn: expertEarn || 0,
      totalSessions,
      avgSessionLength: Math.round(avgSessionLength * 10) / 10,
      totalUsers: chatCounterparties.length,
      topEarner: chatCounterparties.reduce((max, c) => 
        c.total_earnings > max.total_earnings ? c : max, 
        { username: 'None', total_earnings: 0 }
      ),
    };
  }, [chatCounterparties, hasPerMinute, hasSession, chatPrice, sessionPrice]);

  // ✅ Call summary metrics
  const callSummary = useMemo(() => {
    let totalCalls = 0;
    let totalDuration = 0;
    let totalEarnings = 0;
    let missedCalls = 0;
    let rejectedCalls = 0;
    let completedCalls = 0;

    groupedCallUsers.forEach((g) => {
      totalCalls += g.total_calls || 0;
      totalDuration += g.total_duration || 0;
      totalEarnings += g.total_earnings || 0;
      missedCalls += g.missed_count || 0;
      rejectedCalls += g.rejected_count || 0;
      completedCalls += g.completed_count || 0;
    });

    // Calculate net earnings after commission
    const companyCut = totalEarnings * 0.2;
    const netEarnings = totalEarnings - companyCut;

    return {
      totalCalls,
      totalDuration: Math.round(totalDuration || 0),
      totalEarnings: Math.round(totalEarnings || 0),
      netEarnings: Math.round(netEarnings || 0),
      missedCalls,
      rejectedCalls,
      completedCalls,
      totalUsers: groupedCallUsers.length,
      avgDuration: totalCalls > 0 ? (totalDuration / totalCalls).toFixed(1) : 0,
    };
  }, [groupedCallUsers]);

  const openSession = useCallback(async (session) => {
    try {
      const res = await getChatHistoryMessagesApi(session.id);
      const messagesData = Array.isArray(res) ? res : res?.data || [];

      if (messagesData.length > 0) {
        setSelectedSession(session);
        setMessages(messagesData);
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

  const isLoading = () => {
    if (activeMainTab === 'chat') {
      return chatLoading && chatCounterparties.length === 0;
    } else {
      return callLoading && calls.length === 0;
    }
  };

  if (isLoading()) {
    return (
      <PremiumContainer>
        <LoadingSpinner>
          <div className="spinner"></div>
          <p>Loading your {activeMainTab} history...</p>
        </LoadingSpinner>
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
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #000080 0%, #000080 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          display: inline-block;
        }
        
        .premium-card {
          background: white;
          border: 1px solid #dbdbdb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
          transition: all 0.3s ease;
        }
        
        .premium-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .call-type-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
        }
        
        .call-type-badge.voice {
          background: rgba(10, 102, 194, 0.1);
          color: #000080;
        }
        
        .call-type-badge.video {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
        }
        
        .pricing-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .pricing-badge.per-minute {
          background: #dbeafe;
          color: #1e40af;
        }
        
        .pricing-badge.session {
          background: #fef3c7;
          color: #92400e;
        }
      `}</style>

      <PageContainer>
        {/* Enhanced Header with Stats */}
        <Header>
          <ResponsiveGrid>
            <div>
              <Title>
                {activeMainTab === 'chat' ? (
                  <FiMessageSquare />
                ) : (
                  <FiPhone />
                )}
                <span className="gradient-text">
                  {activeMainTab === 'chat' ? 'Chat History' : 'Call History'}
                </span>
              </Title>
              <p style={{ 
                color: '#8e8e8e', 
                marginTop: 8, 
                fontSize: windowWidth < 640 ? 13 : 14 
              }}>
                {activeMainTab === 'chat' 
                  ? 'Track conversations and earnings from all your chat sessions'
                  : 'View your complete call history and earnings from calls'}
              </p>
            </div>

            {/* Pricing Mode Badge */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div className={`pricing-badge ${pricingDisplay.type}`}>
                {pricingDisplay.icon} {pricingDisplay.label}
                {hasPerMinute && (
                  <span style={{ marginLeft: 8, fontSize: 11 }}>
                    Chat: ₹{chatPrice}/min | Call: ₹{callPrice}/min
                  </span>
                )}
                {hasSession && (
                  <span style={{ marginLeft: 8, fontSize: 11 }}>
                    ₹{sessionPrice}/{sessionDuration}min session
                  </span>
                )}
              </div>
            </div>

            {/* Mobile Summary Toggle */}
            <MobileSummaryToggle onClick={() => setShowMobileSummary(!showMobileSummary)}>
              {showMobileSummary ? 'Hide Summary' : 'Show Summary'}
              {showMobileSummary ? <FiChevronDown /> : <FiChevronRight />}
            </MobileSummaryToggle>

            {/* Summary Stats - Desktop always visible, mobile toggleable */}
            {(showMobileSummary || windowWidth > 768) && (
              <StatsContainer className={showMobileSummary ? 'mobile-visible' : ''}>
                {activeMainTab === 'chat' ? (
                  <>
                    <StatCard>
                      <div className="stat-icon" style={{ background: 'rgba(10, 102, 194, 0.1)' }}>
                        <HiUsers color="#000080" />
                      </div>
                      <div className="stat-content">
                        <span className="stat-value">{chatSummary.totalUsers}</span>
                        <span className="stat-label">Users</span>
                      </div>
                    </StatCard>
                    
                    <StatCard>
                      <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                        <FiTrendingUp color="#22c55e" />
                      </div>
                      <div className="stat-content">
                        <span className="stat-value">{chatSummary.totalSessions}</span>
                        <span className="stat-label">Sessions</span>
                      </div>
                    </StatCard>
                    
                    <StatCard accent>
                      <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                        <FiWatch color="#f59e0b" />
                      </div>
                      <div className="stat-content">
                        <span className="stat-value">{chatSummary.totalMinutes}</span>
                        <span className="stat-label">Mins</span>
                      </div>
                    </StatCard>
                    
                    <StatCard primary>
                      <div className="stat-icon" style={{ background: 'rgba(10, 102, 194, 0.1)' }}>
                        <FaIndianRupeeSign color="#000080" />
                      </div>
                      <div className="stat-content">
                        <span className="stat-value">₹{(chatSummary.expertEarn || 0).toFixed(0)}</span>
                        <span className="stat-label">Earnings</span>
                      </div>
                    </StatCard>
                  </>
                ) : (
                  <>
                    <StatCard>
                      <div className="stat-icon" style={{ background: 'rgba(10, 102, 194, 0.1)' }}>
                        <IoMdCall color="#000080" />
                      </div>
                      <div className="stat-content">
                        <span className="stat-value">{callSummary.totalCalls}</span>
                        <span className="stat-label">Calls</span>
                      </div>
                    </StatCard>
                    
                    <StatCard>
                      <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                        <FiWatch color="#22c55e" />
                      </div>
                      <div className="stat-content">
                        <span className="stat-value">{formatDuration(callSummary.totalDuration)}</span>
                        <span className="stat-label">Duration</span>
                      </div>
                    </StatCard>
                    
                    <StatCard accent>
                      <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                        <FiCheckCircle color="#f59e0b" />
                      </div>
                      <div className="stat-content">
                        <span className="stat-value">{callSummary.completedCalls}</span>
                        <span className="stat-label">Completed</span>
                      </div>
                    </StatCard>
                    
                    <StatCard primary>
                      <div className="stat-icon" style={{ background: 'rgba(10, 102, 194, 0.1)' }}>
                        <FaIndianRupeeSign color="#000080" />
                      </div>
                      <div className="stat-content">
                        <span className="stat-value">₹{(callSummary.netEarnings || 0).toFixed(0)}</span>
                        <span className="stat-label">Earned</span>
                      </div>
                    </StatCard>
                  </>
                )}
              </StatsContainer>
            )}
          </ResponsiveGrid>

          {/* Main Tabs - Chat / Call */}
          <TabContainer>
            <TabButton 
              active={activeMainTab === 'chat'}
              onClick={() => setActiveMainTab('chat')}
            >
              <BsChatLeftText size={18} />
              <span>Chat History</span>
            </TabButton>
            <TabButton 
              active={activeMainTab === 'call'}
              onClick={() => setActiveMainTab('call')}
            >
              <FiPhone size={18} />
              <span>Call History</span>
            </TabButton>
          </TabContainer>

          {/* Call Sub-tabs (only visible when call tab is active) */}
          {activeMainTab === 'call' && (
            <FilterBar style={{ marginTop: 16 }}>
              <div style={{ 
                display: 'flex', 
                gap: 8, 
                flexWrap: 'wrap',
                justifyContent: windowWidth < 640 ? 'center' : 'flex-start'
              }}>
                <PillBadge 
                  active={activeCallSubTab === 'all'} 
                  onClick={() => setActiveCallSubTab('all')}
                >
                  All
                </PillBadge>
                <PillBadge 
                  active={activeCallSubTab === 'completed'} 
                  onClick={() => setActiveCallSubTab('completed')}
                >
                  <FiCheckCircle size={14} style={{ marginRight: 4 }} />
                  Completed
                </PillBadge>
                <PillBadge 
                  active={activeCallSubTab === 'missed'} 
                  onClick={() => setActiveCallSubTab('missed')}
                >
                  <FiPhoneMissed size={14} style={{ marginRight: 4 }} />
                  Missed
                </PillBadge>
                <PillBadge 
                  active={activeCallSubTab === 'rejected'} 
                  onClick={() => setActiveCallSubTab('rejected')}
                >
                  <FiXCircle size={14} style={{ marginRight: 4 }} />
                  Rejected
                </PillBadge>
              </div>
            </FilterBar>
          )}

          {/* Chat Filter Bar (only for chat tab) */}
          {activeMainTab === 'chat' && (
            <FilterBar style={{ marginTop: 16 }}>
              <div style={{ 
                display: 'flex', 
                gap: 8,
                flexWrap: 'wrap',
                justifyContent: windowWidth < 640 ? 'center' : 'flex-start'
              }}>
                <PillBadge 
                  active={filterType === 'all'} 
                  onClick={() => setFilterType('all')}
                >
                  All
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
          )}

          {/* Enhanced Filter Bar with Search */}
          <FilterBar>
            <SearchBar premium>
              <FiSearch />
              <input
                placeholder={activeMainTab === 'chat' 
                  ? "Search users..." 
                  : "Search by user name..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <FiX
                  onClick={() => setSearchTerm("")}
                  style={{ cursor: "pointer" }}
                />
              )}
            </SearchBar>
          </FilterBar>
        </Header>

        {/* History List */}
        <HistoryList>
          {activeMainTab === 'chat' ? (
            /* ===== CHAT HISTORY ===== */
            filteredChat.length === 0 ? (
              <EmptyState premium>
                <div className="empty-icon">
                  <BsChatLeftText />
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
              filteredChat.map((c) => {
                const isOpen = expandedChatUserId === c.user_id;
                const totalSessions = c.sessions?.length || 0;
                const totalEarnings = c.total_earnings || 0;
                const avgEarning = totalSessions > 0 ? totalEarnings / totalSessions : 0;

                return (
                  <HistoryItem key={c.user_id} premium className="premium-card">
                    <ChatHeader
                      onClick={() => setExpandedChatUserId(isOpen ? null : c.user_id)}
                      premium
                    >
                      <div className="chat-header-content">
                        <Avatar
                          premium
                          src={getAvatarUrl(c.username, c.user_avatar)}
                        />
                        
                        <div className="user-info">
                          <div className="user-name-section">
                            <h4>{c.username}</h4>
                            <EarningsBadge>₹{totalEarnings.toFixed(0)}</EarningsBadge>
                          </div>
                          
                          <div className="user-stats">
                            <span className="meta-item">
                              <FiUser /> {totalSessions} sess
                            </span>
                            <span className="meta-item">
                              <FiClock /> {formatTime(c.total_minutes)}
                            </span>
                            {windowWidth >= 640 && (
                              <span className="meta-item">
                                ₹{avgEarning.toFixed(0)} avg
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="header-right">
                          {windowWidth >= 640 && (
                            <div className="last-activity hide-on-mobile">
                              <div>Last</div>
                              <div className="last-date">{formatDate(c.last_end_time)}</div>
                            </div>
                          )}
                          {isOpen ? (
                            <FiChevronDown className="chevron-icon" />
                          ) : (
                            <FiChevronRight className="chevron-icon" />
                          )}
                        </div>
                      </div>
                    </ChatHeader>

                    {isOpen && (
                      <div className="expanded-content">
                        <SessionHeader>
                          <h5>Chat Sessions</h5>
                          <div className="session-badge">
                            <FiCalendar /> {totalSessions} total
                          </div>
                        </SessionHeader>
                        
                        <SessionsWrap>
                          {c.sessions.map((s, idx) => {
                            const ppm = Number(
                              s.price_per_minute || chatPrice || 16
                            );
                            const actualMins = Number(s.duration_minutes || 0);
                            const earnings = calculateEarnings(actualMins, ppm);

                            return (
                              <SessionCard key={s.id || s.room_id} premium>
                                <div className="session-indicator">
                                  <div className="session-number">{idx + 1}</div>
                                </div>
                                
                                <div className="session-info">
                                  <div className="session-details">
                                    <div className="date">
                                      <FiCalendar />
                                      {windowWidth < 480 ? formatDate(s.end_time).slice(0,6) : formatDate(s.end_time)}
                                    </div>
                                    <div className="duration">
                                      <FiClock />
                                      {formatTime(actualMins)}
                                    </div>
                                  </div>
                                  <div className="rate-badge">
                                    @ ₹{ppm}/min
                                  </div>
                                </div>
                                
                                <div className="session-earnings">
                                  {windowWidth >= 480 && <div className="amount-label">Earned</div>}
                                  <div className="amount">₹{earnings}</div>
                                </div>
                                
                                <ActionButton premium onClick={() => openSession(s)}>
                                  <FiEye />
                                  {windowWidth >= 480 ? 'View' : ''}
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
            )
          ) : (
            /* ===== CALL HISTORY ===== */
            filteredCalls.length === 0 ? (
              <EmptyState premium>
                <div className="empty-icon">
                  <FiPhone size={56} />
                </div>
                <h3>No Call History Found</h3>
                <p>
                  {activeCallSubTab === 'all' 
                    ? "You haven't received any calls yet" 
                    : `No ${activeCallSubTab} calls found`}
                </p>
                <button 
                  className="premium-btn"
                  onClick={() => navigate("/expert")}
                >
                  Go to Dashboard
                </button>
              </EmptyState>
            ) : (
              /* Grouped by user view */
              filteredGroupedCallUsers.map((g) => {
                const isOpen = expandedCallUserId === g.user_id;

                return (
                  <HistoryItem key={g.user_id} premium className="premium-card">
                    <ChatHeader
                      onClick={() => setExpandedCallUserId(isOpen ? null : g.user_id)}
                      premium
                    >
                      <div className="chat-header-content">
                        <Avatar
                          premium
                          src={getAvatarUrl(g.username, g.user_avatar)}
                        />
                        
                        <div className="user-info">
                          <div className="user-name-section">
                            <h4>{g.username}</h4>
                            <EarningsBadge>₹{g.total_earnings}</EarningsBadge>
                          </div>
                          
                          <div className="user-stats">
                            <span className="meta-item">
                              <FiPhone /> {g.total_calls} calls
                            </span>
                            <span className="meta-item">
                              <FiClock /> {formatDuration(g.total_duration)}
                            </span>
                          </div>

                          <div className="call-stats-badges">
                            {g.completed_count > 0 && (
                              <span className="status-badge completed">
                                <FiCheckCircle size={10} /> {g.completed_count}
                              </span>
                            )}
                            {g.missed_count > 0 && (
                              <span className="status-badge missed">
                                <FiPhoneMissed size={10} /> {g.missed_count}
                              </span>
                            )}
                            {g.rejected_count > 0 && (
                              <span className="status-badge rejected">
                                <FiXCircle size={10} /> {g.rejected_count}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="header-right">
                          {windowWidth >= 640 && (
                            <div className="last-activity hide-on-mobile">
                              <div>Last</div>
                              <div className="last-date">{formatDate(g.last_call_time)}</div>
                            </div>
                          )}
                          {isOpen ? (
                            <FiChevronDown className="chevron-icon" />
                          ) : (
                            <FiChevronRight className="chevron-icon" />
                          )}
                        </div>
                      </div>
                    </ChatHeader>

                    {isOpen && (
                      <div className="expanded-content">
                        <SessionHeader>
                          <h5>Call Sessions</h5>
                          <div className="session-badge">
                            <FiCalendar /> {g.total_calls} calls
                          </div>
                        </SessionHeader>
                        
                        <SessionsWrap>
                          {g.calls.map((call, idx) => {
                            const config = STATUS_CONFIG[call.status === 'ended' ? 'completed' : call.status] || STATUS_CONFIG.missed;
                            const StatusIcon = config.icon;
                            const earnings = calculateEarnings(
                              call.duration, 
                              call.price_per_minute || callPrice || 16
                            );

                            return (
                              <SessionCard key={call.id} premium>
                                <div className="session-indicator">
                                  <div className="session-number">{idx + 1}</div>
                                </div>
                                
                                <div className="session-info">
                                  <div className="session-details">
                                    <div className="date">
                                      <FiCalendar />
                                      {windowWidth < 480 ? formatDate(call.created_at).slice(0,6) : formatDate(call.created_at)}
                                    </div>
                                    <div className="duration">
                                      <FiClock />
                                      {formatDuration(call.duration)}
                                    </div>
                                  </div>
                                  
                                  <div className="session-meta">
                                    <span className={`call-type-badge ${call.call_type || 'voice'}`}>
                                      {call.call_type === 'video' ? <FiVideo size={11} /> : <FiPhone size={11} />}
                                      {call.call_type || 'voice'}
                                    </span>
                                    <span className="status-badge" style={{
                                      background: config.bgColor,
                                      color: config.color,
                                      padding: '2px 8px',
                                      borderRadius: '12px',
                                      fontSize: '11px',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}>
                                      <StatusIcon size={10} />
                                      {config.label}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="session-earnings">
                                  {windowWidth >= 480 && <div className="amount-label">Earned</div>}
                                  <div className="amount">₹{earnings}</div>
                                </div>
                                
                                <ActionButton premium onClick={() => {}}>
                                  <FiEye />
                                  {windowWidth >= 480 ? 'Details' : ''}
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
            )
          )}
        </HistoryList>

        {/* Enhanced Chat Modal */}
        {showDetails && selectedSession && (
          <ModalOverlay onClick={() => setShowDetails(false)}>
            <ModalContent premium onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-user-info">
                  <MessageAvatar
                    src={getAvatarUrl(
                      selectedSession.username || selectedSession.user_name,
                      selectedSession.user_avatar
                    )}
                    size={windowWidth < 640 ? "medium" : "large"}
                  />
                  <div>
                    <h3>{selectedSession.username || selectedSession.user_name}</h3>
                    <div className="modal-meta">
                      <span>{formatDate(selectedSession.end_time)}</span>
                      <span>•</span>
                      <span>{formatTime(selectedSession.duration_minutes)}</span>
                      {windowWidth >= 480 && (
                        <>
                          <span>•</span>
                          <span className="earnings">
                            ₹{calculateEarnings(
                              selectedSession.duration_minutes,
                              selectedSession.price_per_minute || chatPrice || 16
                            )}
                          </span>
                        </>
                      )}
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
                              {windowWidth >= 480 && (
                                <span className="sender-role">
                                  {msg.sender_type === "expert" ? "(You)" : "(User)"}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="message-time">
                            {msg.time_sent || msg.created_at
                              ? new Date(msg.time_sent || msg.created_at).toLocaleTimeString([], {
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
                      <FiMessageCircle />
                      <p>No messages available</p>
                    </div>
                  )}
                </div>
              </MessagesArea>

              <div className="modal-footer">
                <div className="footer-note">
                  <FiMessageSquare />
                  {windowWidth < 480 ? 'Read-only' : 'Previous chat session (read-only)'}
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