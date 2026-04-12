// src/apps/user/pages/chat-history/UserChatHistory.jsx
// 🎨 PREMIUM POLISHED VERSION - Blue Theme with Chat & Call Tabs
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
  FiPhone,
  FiVideo,
  FiPhoneMissed,
  FiXCircle,
  FiCheckCircle,
  FiZap,
  FiBookOpen,
} from "react-icons/fi";
import { HiUsers } from "react-icons/hi";
import { BsChatLeftText, BsLightningCharge, BsTelephone } from "react-icons/bs";
import { MdWorkspacePremium, MdCallEnd } from "react-icons/md";
import { IoMdCall } from "react-icons/io";

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
  SessionHeader,
  PremiumContainer,
  ExpertBadge,
  UserMessageAvatar,
  SummaryCard,
  ChatAgainButton,
  ViewChatButton,
  TabContainer,
  TabButton,
  MobileSummaryToggle,
  ResponsiveGrid,
  AvatarFallback,
} from "./UserChatHistory.styles";

import { useAuth } from "../../../../shared/context/UserAuthContext";
import { usePublicExpert as useExpert } from "../../context/PublicExpertContext";
import { useWallet } from "../../../../shared/context/WalletContext";
import { socket } from "../../../../shared/api/socket";
import {
  getUserChatHistoryApi,
  getChatHistoryMessagesApi,
} from "../../../../shared/api/chatHistory.api";
import { getUserCallHistoryApi } from "../../../../shared/api/callHistory.api";
import { getExpertPriceByIdApi } from "../../../../shared/api/expertapi/price.api";
import { getPlansApi } from "../../../../shared/api/userApi/subscription.api";
import useChatRequest from "../../../../shared/hooks/useChatRequest";

// ✅ MINIMUM 1 MIN BILLING + PRICE FIX
const calculateBilledAmount = (durationMinutes, pricePerMinute) => {
  const totalSeconds = Math.round(Number(durationMinutes || 0) * 60);
  const billedMinutes = Math.ceil(totalSeconds / 60);
  return Math.max(1, billedMinutes) * Number(pricePerMinute || 16);
};

// ✅ Status display mapping for calls
const STATUS_CONFIG = {
  completed: {
    label: 'Completed',
    icon: FiCheckCircle,
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)'
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
    icon: FiVideo,
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)'
  }
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

// ✅ Group chat history by expert
const groupChatByExpert = (rows = []) => {
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

// ✅ Group calls by expert
const groupCallsByExpert = (calls = []) => {
  const map = calls.reduce((acc, call) => {
    const id = call.expert_id;
    if (!id) return acc;

    if (!acc[id]) {
      acc[id] = {
        expert_id: call.expert_id,
        expert_name: call.expert_name,
        expert_avatar: call.expert_avatar,
        expert_position: call.expert_position,
        expert_rating: call.expert_rating || 0,
        total_calls: 0,
        total_duration: 0,
        total_spent: 0,
        last_call_time: call.ended_at || call.created_at,
        calls: [],
        missed_count: 0,
        rejected_count: 0,
        completed_count: 0,
      };
    }

    acc[id].calls.push(call);
    acc[id].total_calls++;

    const displayStatus = call.status === 'ended' ? 'completed' : call.status;
    if (displayStatus === 'completed') {
      acc[id].completed_count++;
      const mins = Number(call.duration || 0);
      const ppm = Number(call.price_per_minute || 16);
      acc[id].total_duration += mins;
      acc[id].total_spent += calculateBilledAmount(mins, ppm);
    } else if (call.status === 'missed') {
      acc[id].missed_count++;
    } else if (call.status === 'rejected') {
      acc[id].rejected_count++;
    }

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

export const UserChatHistory = () => {
  const { user, isLoggedIn } = useAuth();
  const { experts } = useExpert();
  const { balance, fetchWallet } = useWallet();
  const navigate = useNavigate();
  const { startChat, ChatPopups } = useChatRequest();

  // Tab states
  const [activeMainTab, setActiveMainTab] = useState('chat');
  const [activeCallSubTab, setActiveCallSubTab] = useState('all');
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  // Chat history states
  const [chatLoading, setChatLoading] = useState(true);
  const [counterparties, setCounterparties] = useState([]);
  const [expandedExpertId, setExpandedExpertId] = useState(null);
  
  // Call history states
  const [callLoading, setCallLoading] = useState(false);
  const [calls, setCalls] = useState([]);
  const [groupedCallExperts, setGroupedCallExperts] = useState([]);
  const [expandedCallExpertId, setExpandedCallExpertId] = useState(null);

  // Common states
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  // Chat modal states
  const [selectedSession, setSelectedSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  
  // Expert pricing and plans data
  const [expertPricing, setExpertPricing] = useState({});
  const [expertPlans, setExpertPlans] = useState({});

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

  // Fetch expert pricing and plans
  const fetchExpertPricing = useCallback(async (expertId) => {
    try {
      const [priceRes, plansRes] = await Promise.allSettled([
        getExpertPriceByIdApi(expertId),
        getPlansApi(expertId)
      ]);

      const priceData = priceRes.status === "fulfilled" ? priceRes.value?.data?.data || priceRes.value?.data || {} : {};
      const plansData = plansRes.status === "fulfilled" && plansRes.value?.data?.success ? plansRes.value.data.data || [] : [];

      let pricingModes = priceData.pricing_modes || [];
      if (typeof pricingModes === 'string') {
        try {
          pricingModes = JSON.parse(pricingModes);
        } catch {
          pricingModes = [];
        }
      }

      const hasPerMinute = pricingModes.includes('per_minute');
      const hasSession = pricingModes.includes('session');
      const hasPlans = plansData.length > 0;

      const chatPrice = priceData.chat?.per_minute || priceData.chat_per_minute || 0;
      const callPrice = priceData.call?.per_minute || priceData.call_per_minute || 0;
      const sessionPrice = priceData.session?.price || priceData.session_price || 0;
      const sessionDuration = priceData.session?.duration || priceData.session_duration || 0;

      return {
        hasPerMinute,
        hasSession,
        hasPlans,
        chatPrice: Number(chatPrice),
        callPrice: Number(callPrice),
        sessionPrice: Number(sessionPrice),
        sessionDuration: Number(sessionDuration),
        pricingModes,
      };
    } catch (error) {
      console.error(`Failed to fetch pricing for expert ${expertId}:`, error);
      return {
        hasPerMinute: false,
        hasSession: false,
        hasPlans: false,
        chatPrice: 0,
        callPrice: 0,
        sessionPrice: 0,
        sessionDuration: 0,
        pricingModes: [],
      };
    }
  }, []);

  // Handle chat start with balance check
  const handleStartChat = useCallback(async (expertId) => {
    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: "/user/chat-history" } });
      return;
    }

    const pricing = expertPricing[expertId] || await fetchExpertPricing(expertId);
    
    if (!expertPricing[expertId]) {
      setExpertPricing(prev => ({ ...prev, [expertId]: pricing }));
    }

    // Check if user has per-minute pricing
    if (pricing.hasPerMinute) {
      const minRequired = pricing.chatPrice * 5;
      const userBalance = Number(balance || 0);

      if (userBalance >= minRequired) {
        startChat({
          expertId: expertId,
          chatPrice: pricing.chatPrice,
          expertName: expertById[expertId]?.name || "Expert"
        });
      } else {
        // Show low balance popup
        alert(`Insufficient balance. Need ₹${minRequired} for 5 minutes of chat. Please recharge.`);
        navigate("/user/wallet");
      }
    } 
    // Check if user has session pricing
    else if (pricing.hasSession) {
      const userBalance = Number(balance || 0);
      if (userBalance >= pricing.sessionPrice) {
        navigate(`/user/experts/${expertId}`, { 
          state: { scrollToBooking: true, bookingType: "session" }
        });
      } else {
        alert(`Insufficient balance. Need ₹${pricing.sessionPrice} for session booking. Please recharge.`);
        navigate("/user/wallet");
      }
    }
    // Check if user has subscription plans
    else if (pricing.hasPlans) {
      navigate(`/user/experts/${expertId}`, { 
        state: { scrollToPlans: true }
      });
    }
    else {
      alert("This expert doesn't have chat pricing available. Please contact support.");
    }
  }, [isLoggedIn, navigate, balance, expertPricing, fetchExpertPricing, startChat, expertById]);

  // Handle call start with balance check
  const handleStartCall = useCallback(async (expertId, callType = 'voice') => {
    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: "/user/chat-history" } });
      return;
    }

    const pricing = expertPricing[expertId] || await fetchExpertPricing(expertId);
    
    if (!expertPricing[expertId]) {
      setExpertPricing(prev => ({ ...prev, [expertId]: pricing }));
    }

    if (pricing.hasPerMinute) {
      const minRequired = pricing.callPrice * 5;
      const userBalance = Number(balance || 0);

      if (userBalance >= minRequired) {
        navigate(`/user/voice-call/${expertId}`, {
          state: { fromHistory: true, callType },
        });
      } else {
        alert(`Insufficient balance. Need ₹${minRequired} for 5 minutes of call. Please recharge.`);
        navigate("/user/wallet");
      }
    } else if (pricing.hasSession) {
      const userBalance = Number(balance || 0);
      if (userBalance >= pricing.sessionPrice) {
        navigate(`/user/experts/${expertId}`, { 
          state: { scrollToBooking: true, bookingType: "call_session" }
        });
      } else {
        alert(`Insufficient balance. Need ₹${pricing.sessionPrice} for session booking. Please recharge.`);
        navigate("/user/wallet");
      }
    } else if (pricing.hasPlans) {
      navigate(`/user/experts/${expertId}`, { 
        state: { scrollToPlans: true }
      });
    } else {
      alert("This expert doesn't have call pricing available. Please contact support.");
    }
  }, [isLoggedIn, navigate, balance, expertPricing, fetchExpertPricing, expertById]);

  // Filter chat history
  const filteredCounterparties = useMemo(() => {
    let arr = [...(counterparties || [])];
    
    if (search) {
      arr = arr.filter((c) =>
        (c.expert_name || "").toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (filterType === "recent") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      arr = arr.filter(c => new Date(c.last_end_time) > oneWeekAgo);
    } else if (filterType === "top") {
      arr.sort((a, b) => b.sessions_count - a.sessions_count);
    } else if (filterType === "expensive") {
      arr.sort((a, b) => (expertPricing[a.expert_id]?.chatPrice || 0) - (expertPricing[b.expert_id]?.chatPrice || 0));
    }
    
    return arr;
  }, [counterparties, search, filterType, expertPricing]);

  // Filter calls
  const filteredCalls = useMemo(() => {
    if (activeMainTab !== 'call') return [];
    
    let filtered = [...calls];
    
    if (search) {
      filtered = filtered.filter(call => 
        (call.expert_name || "").toLowerCase().includes(search.toLowerCase()) ||
        (call.expert_position || "").toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (activeCallSubTab !== 'all') {
      filtered = filtered.filter(call => {
        if (activeCallSubTab === 'completed') {
          return call.status === 'ended';
        }
        return call.status === activeCallSubTab;
      });
    }
    
    return filtered;
  }, [calls, search, activeMainTab, activeCallSubTab]);

  // Filter grouped call experts
  const filteredGroupedCallExperts = useMemo(() => {
    let filtered = [...groupedCallExperts];
    
    if (search) {
      filtered = filtered.filter(g =>
        (g.expert_name || "").toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return filtered;
  }, [groupedCallExperts, search]);

  // Calculate chat summary stats
  const chatSummary = useMemo(() => {
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

  // Calculate call summary stats
  const callSummary = useMemo(() => {
    let totalCalls = 0;
    let totalDuration = 0;
    let totalSpent = 0;
    let missedCalls = 0;
    let rejectedCalls = 0;
    let completedCalls = 0;
    let favoriteExpert = { name: 'None', calls: 0 };

    groupedCallExperts.forEach((g) => {
      totalCalls += g.total_calls || 0;
      totalDuration += g.total_duration || 0;
      totalSpent += g.total_spent || 0;
      missedCalls += g.missed_count || 0;
      rejectedCalls += g.rejected_count || 0;
      completedCalls += g.completed_count || 0;
      
      if (g.total_calls > favoriteExpert.calls) {
        favoriteExpert = { 
          name: g.expert_name, 
          calls: g.total_calls 
        };
      }
    });

    return {
      totalCalls,
      totalDuration: Math.round(totalDuration || 0),
      totalSpent: Math.round(totalSpent || 0),
      missedCalls,
      rejectedCalls,
      completedCalls,
      favoriteExpert,
      expertCount: groupedCallExperts.length,
      avgDuration: totalCalls > 0 ? (totalDuration / totalCalls).toFixed(1) : 0,
    };
  }, [groupedCallExperts]);

  // Fetch chat history
  const fetchChatHistory = useCallback(async () => {
    try {
      setChatLoading(true);
      const res = await getUserChatHistoryApi(user?.id);
      const rows = res?.success ? res.data || [] : [];

      if (!rows.length) {
        setCounterparties([]);
        setChatLoading(false);
        return;
      }

      const grouped = groupChatByExpert(rows);

      const merged = await Promise.all(grouped.map(async (c) => {
        const expertId = Number(c.expert_id);
        const ctxExpert = expertById[expertId];
        const pricing = await fetchExpertPricing(expertId);
        
        if (!expertPricing[expertId]) {
          setExpertPricing(prev => ({ ...prev, [expertId]: pricing }));
        }

        return {
          ...c,
          expert_name: ctxExpert?.name || c.expert_name || "Expert",
          expert_position: ctxExpert?.position || c.expert_position || "Professional Advisor",
          expert_avatar: ctxExpert?.profile_photo || null,
          chat_per_minute: pricing.chatPrice || 0,
          call_per_minute: pricing.callPrice || 0,
          hasPerMinute: pricing.hasPerMinute,
          hasSession: pricing.hasSession,
          hasPlans: pricing.hasPlans,
          rating: ctxExpert?.rating || c.rating || 0,
        };
      }));

      setCounterparties(merged);
    } catch (e) {
      console.error("❌ user grouped history error:", e);
      setCounterparties([]);
    } finally {
      setChatLoading(false);
    }
  }, [user?.id, expertById, fetchExpertPricing, expertPricing]);

  // Fetch call history
  const fetchCallHistory = useCallback(async () => {
    try {
      setCallLoading(true);
      const params = {};
      if (activeCallSubTab !== 'all') {
        params.status = activeCallSubTab === 'completed' ? 'ended' : activeCallSubTab;
      }
      
      const res = await getUserCallHistoryApi(params);
      const callsData = res?.data?.data || [];
      
      const filteredCallsData = callsData.filter(call => call.status !== 'ringing');
      
      setCalls(filteredCallsData);
      
      const grouped = groupCallsByExpert(filteredCallsData);
      
      const merged = await Promise.all(grouped.map(async (g) => {
        const ctxExpert = expertById[Number(g.expert_id)];
        const pricing = await fetchExpertPricing(Number(g.expert_id));
        
        if (!expertPricing[g.expert_id]) {
          setExpertPricing(prev => ({ ...prev, [g.expert_id]: pricing }));
        }

        return {
          ...g,
          expert_name: ctxExpert?.name || g.expert_name || "Expert",
          expert_position: ctxExpert?.position || g.expert_position || "Professional Advisor",
          expert_avatar: ctxExpert?.profile_photo || null,
          expert_rating: ctxExpert?.rating || g.expert_rating || 0,
          hasPerMinute: pricing.hasPerMinute,
          hasSession: pricing.hasSession,
          hasPlans: pricing.hasPlans,
        };
      }));
      
      setGroupedCallExperts(merged);
    } catch (error) {
      console.error("❌ Error fetching call history:", error);
      setCalls([]);
      setGroupedCallExperts([]);
    } finally {
      setCallLoading(false);
    }
  }, [activeCallSubTab, expertById, fetchExpertPricing, expertPricing]);

  // User online registration
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

  // Fetch data based on active tab
  useEffect(() => {
    if (user?.id) {
      if (activeMainTab === 'chat') {
        fetchChatHistory();
      } else {
        fetchCallHistory();
      }
    }
  }, [user?.id, activeMainTab, activeCallSubTab, fetchChatHistory, fetchCallHistory]);

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
      console.error("❌ messages error:", e);
      alert("Failed to load chat messages");
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

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleAvatarClick = (expertId, e) => {
    e.stopPropagation();
    navigate(`/user/experts/${expertId}`);
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

  const isLoading = () => {
    if (activeMainTab === 'chat') {
      return chatLoading && counterparties.length === 0;
    } else {
      return callLoading && calls.length === 0;
    }
  };

  if (isLoading()) {
    return (
      <PremiumContainer>
        <PageContainer>
          <LoadingSpinner>
            <div className="spinner"></div>
            <p>Loading your {activeMainTab} history...</p>
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
          background: #000080;
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
        
        .avatar-clickable {
          cursor: pointer;
          transition: transform 0.2s;
        }
        
        .avatar-clickable:hover {
          transform: scale(1.05);
        }
        
        .pricing-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 500;
        }
        
        .pricing-badge.per-minute {
          background: rgba(14, 165, 233, 0.1);
          color: #0ea5e9;
        }
        
        .pricing-badge.session {
          background: rgba(245, 158, 11, 0.1);
          color: #d97706;
        }
        
        .pricing-badge.plans {
          background: rgba(139, 92, 246, 0.1);
          color: #7c3aed;
        }
        
        @media (max-width: 768px) {
          .hide-on-mobile {
            display: none;
          }
        }
      `}</style>

      <PageContainer>
        <Header>
          <ResponsiveGrid>
            <div>
              <Title>
                {activeMainTab === 'chat' ? (
                  <FiMessageSquare style={{ marginRight: 12, color: '#000080' }} />
                ) : (
                  <FiPhone style={{ marginRight: 12, color: '#000080' }} />
                )}
                <span className="user-gradient-text">
                  {activeMainTab === 'chat' ? 'Consultation History' : 'Call History'}
                </span>
              </Title>
              <p style={{ color: '#64748b', marginTop: 8, fontSize: 14 }}>
                {activeMainTab === 'chat' 
                  ? 'Review your past consultations, messages, and spending with experts'
                  : 'View your complete call history with experts'}
              </p>
            </div>

            <MobileSummaryToggle onClick={() => setShowMobileSummary(!showMobileSummary)}>
              {showMobileSummary ? 'Hide Summary' : 'Show Summary'}
              {showMobileSummary ? <FiChevronDown /> : <FiChevronRight />}
            </MobileSummaryToggle>

            {(showMobileSummary || window.innerWidth > 768) && (
              <SummaryCard className={showMobileSummary ? 'mobile-visible' : ''}>
                <div className="summary-header">
                  <FiTrendingUp size={20} />
                  <span>{activeMainTab === 'chat' ? 'Chat Summary' : 'Call Summary'}</span>
                </div>
                <div className="summary-stats">
                  {activeMainTab === 'chat' ? (
                    <>
                      <div className="summary-stat">
                        <span className="stat-value">{chatSummary.totalSessions}</span>
                        <span className="stat-label">Sessions</span>
                      </div>
                      <div className="summary-stat">
                        <span className="stat-value">{formatTime(chatSummary.totalMinutes)}</span>
                        <span className="stat-label">Time</span>
                      </div>
                      <div className="summary-stat">
                        <span className="stat-value">₹{chatSummary.totalSpent}</span>
                        <span className="stat-label">Spent</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="summary-stat">
                        <span className="stat-value">{callSummary.totalCalls}</span>
                        <span className="stat-label">Calls</span>
                      </div>
                      <div className="summary-stat">
                        <span className="stat-value">{formatDuration(callSummary.totalDuration)}</span>
                        <span className="stat-label">Time</span>
                      </div>
                      <div className="summary-stat">
                        <span className="stat-value">₹{callSummary.totalSpent}</span>
                        <span className="stat-label">Spent</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="summary-meta">
                  <span className="meta-item">
                    <HiUsers size={14} /> 
                    {activeMainTab === 'chat' ? chatSummary.expertCount : callSummary.expertCount} experts
                  </span>
                  <span className="meta-item">
                    <FiHeart size={14} /> 
                    {activeMainTab === 'chat' 
                      ? `${chatSummary.favoriteExpert.name} (${chatSummary.favoriteExpert.sessions})`
                      : `${callSummary.favoriteExpert.name} (${callSummary.favoriteExpert.calls})`
                    }
                  </span>
                </div>
              </SummaryCard>
            )}
          </ResponsiveGrid>

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

          {activeMainTab === 'chat' && counterparties.length > 0 && (
            <StatsContainer>
              <StatCard accent>
                <div className="stat-icon" style={{ background: 'rgba(14, 165, 233, 0.1)' }}>
                  <BsLightningCharge color="#0ea5e9" />
                </div>
                <div className="stat-content">
                  <span className="stat-value">{chatSummary.totalSessions}</span>
                  <span className="stat-label">Consultations</span>
                </div>
              </StatCard>
              
              <StatCard>
                <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                  <FiWatch color="#22c55e" />
                </div>
                <div className="stat-content">
                  <span className="stat-value">{formatTime(chatSummary.totalMinutes)}</span>
                  <span className="stat-label">Total Time</span>
                </div>
              </StatCard>
              
              <StatCard primary>
                <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                  <FiDollarSign color="#8b5cf6" />
                </div>
                <div className="stat-content">
                  <span className="stat-value">₹{chatSummary.totalSpent}</span>
                  <span className="stat-label">Total Spent</span>
                </div>
              </StatCard>
              
              <StatCard>
                <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                  <FiStar color="#f59e0b" />
                </div>
                <div className="stat-content">
                  <span className="stat-value">{chatSummary.expertCount}</span>
                  <span className="stat-label">Experts</span>
                </div>
              </StatCard>
            </StatsContainer>
          )}

          {activeMainTab === 'call' && groupedCallExperts.length > 0 && (
            <StatsContainer>
              <StatCard accent>
                <div className="stat-icon" style={{ background: 'rgba(14, 165, 233, 0.1)' }}>
                  <IoMdCall color="#0ea5e9" />
                </div>
                <div className="stat-content">
                  <span className="stat-value">{callSummary.totalCalls}</span>
                  <span className="stat-label">Total Calls</span>
                </div>
              </StatCard>
              
              <StatCard>
                <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
                  <FiWatch color="#22c55e" />
                </div>
                <div className="stat-content">
                  <span className="stat-value">{formatDuration(callSummary.totalDuration)}</span>
                  <span className="stat-label">Total Time</span>
                </div>
              </StatCard>
              
              <StatCard primary>
                <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                  <FiDollarSign color="#8b5cf6" />
                </div>
                <div className="stat-content">
                  <span className="stat-value">₹{callSummary.totalSpent}</span>
                  <span className="stat-label">Total Spent</span>
                </div>
              </StatCard>
              
              <StatCard>
                <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                  <FiCheckCircle color="#f59e0b" />
                </div>
                <div className="stat-content">
                  <span className="stat-value">{callSummary.completedCalls}</span>
                  <span className="stat-label">Completed</span>
                </div>
              </StatCard>
            </StatsContainer>
          )}

          {activeMainTab === 'call' && (
            <FilterBar style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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

          {activeMainTab === 'chat' && (
            <FilterBar style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
                  Most Active
                </PillBadge>
              </div>
            </FilterBar>
          )}

          <FilterBar style={{ marginTop: 16 }}>
            <SearchBar premium>
              <FiSearch size={18} />
              <input
                placeholder={activeMainTab === 'chat' 
                  ? "Search experts by name..." 
                  : "Search calls by expert name..."
                }
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
          </FilterBar>
        </Header>

        <HistoryList>
          {activeMainTab === 'chat' ? (
            filteredCounterparties.length === 0 ? (
              <EmptyState premium>
                <div className="empty-icon">
                  <BsChatLeftText size={56} />
                </div>
                <h3>No Chat History Yet</h3>
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
                const pricing = expertPricing[c.expert_id] || c;

                return (
                  <HistoryItem key={c.expert_id} premium className="premium-card">
                    <ChatHeader
                      onClick={() => setExpandedExpertId(isOpen ? null : c.expert_id)}
                      premium
                    >
                      <div className="chat-header-content">
                        {c.expert_avatar ? (
                          <Avatar
                            premium
                            src={c.expert_avatar}
                            className="avatar-clickable"
                            onClick={(e) => handleAvatarClick(c.expert_id, e)}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.parentElement.innerHTML = `<div class="avatar-fallback">${getInitials(c.expert_name)}</div>`;
                            }}
                          />
                        ) : (
                          <AvatarFallback className="avatar-clickable" onClick={(e) => handleAvatarClick(c.expert_id, e)}>
                            {getInitials(c.expert_name)}
                          </AvatarFallback>
                        )}
                        
                        <div className="expert-info">
                          <div className="expert-name-section">
                            <h4>{c.expert_name}</h4>
                            <ExpertBadge>
                              <FiBriefcase size={12} />
                              <span className="expert-position">{c.expert_position}</span>
                            </ExpertBadge>
                            {pricing.hasPerMinute && (
                              <span className="pricing-badge per-minute">
                                <BsChatLeftText size={10} /> ₹{pricing.chatPrice}/min
                              </span>
                            )}
                            {pricing.hasSession && !pricing.hasPerMinute && (
                              <span className="pricing-badge session">
                                <FiBookOpen size={10} /> Session ₹{pricing.sessionPrice}
                              </span>
                            )}
                            {pricing.hasPlans && !pricing.hasPerMinute && !pricing.hasSession && (
                              <span className="pricing-badge plans">
                                <FiZap size={10} /> Plans Available
                              </span>
                            )}
                          </div>
                          
                          <div className="expert-stats">
                            <span className="meta-item">
                              <FiClock size={12} /> {formatTime(c.total_minutes)} total
                            </span>
                            <span className="meta-item">
                              <FiMessageSquare size={12} /> {c.sessions_count} sessions
                            </span>
                            <span className="meta-item">
                              ₹{c.total_spent.toFixed(0)} spent
                            </span>
                          </div>
                        </div>
                        
                        <div className="header-right">
                          <div className="last-consultation hide-on-mobile">
                            <div>Last consultation</div>
                            <div className="last-date">{formatDate(c.last_end_time)}</div>
                          </div>
                          {isOpen ? (
                            <FiChevronDown size={20} className="chevron-icon" />
                          ) : (
                            <FiChevronRight size={20} className="chevron-icon" />
                          )}
                        </div>
                      </div>
                    </ChatHeader>

                    {isOpen && (
                      <div className="expanded-content">
                        <SessionHeader>
                          <h5>Consultation Sessions</h5>
                          <div className="expert-badge">
                            <FiCalendar size={12} /> {c.sessions_count} consultations
                          </div>
                        </SessionHeader>
                        
                        <SessionsWrap>
                          {c.sessions.map((s, idx) => {
                            const ppm = Number(s.price_per_minute || c.chat_per_minute || 16);
                            const actualMins = Number(s.duration_minutes || 0);
                            const billedAmount = calculateBilledAmount(actualMins, ppm);

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
                                      {formatTime(actualMins)}
                                    </div>
                                  </div>
                                  <div className="session-meta">
                                    <span className="rate-label">
                                      @ ₹{ppm}/min
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="session-amount">
                                  <div className="amount-label">Amount</div>
                                  <div className="amount">₹{billedAmount}</div>
                                </div>
                                
                                <ActionButtons>
                                  <ViewChatButton onClick={() => openSession(s)}>
                                    <FiEye size={14} />
                                    <span className="hide-on-mobile">View</span>
                                  </ViewChatButton>
                                  
                                  <ChatAgainButton onClick={() => handleStartChat(c.expert_id)}>
                                    <FiMessageSquare size={14} />
                                    <span className="hide-on-mobile">Chat</span>
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
            )
          ) : (
            filteredGroupedCallExperts.length === 0 ? (
              <EmptyState premium>
                <div className="empty-icon">
                  <FiPhone size={56} />
                </div>
                <h3>No Call History Found</h3>
                <p>
                  {activeCallSubTab === 'all' 
                    ? "You haven't made any calls yet" 
                    : `No ${activeCallSubTab} calls found`}
                </p>
                <button 
                  className="premium-btn"
                  onClick={() => navigate("/user/call-chat")}
                >
                  <BsLightningCharge style={{ marginRight: 8 }} />
                  Find Experts to Call
                </button>
              </EmptyState>
            ) : (
              filteredGroupedCallExperts.map((g) => {
                const isOpen = expandedCallExpertId === g.expert_id;
                const pricing = expertPricing[g.expert_id] || g;

                return (
                  <HistoryItem key={g.expert_id} premium className="premium-card">
                    <ChatHeader
                      onClick={() => setExpandedCallExpertId(isOpen ? null : g.expert_id)}
                      premium
                    >
                      <div className="chat-header-content">
                        {g.expert_avatar ? (
                          <Avatar
                            premium
                            src={g.expert_avatar}
                            className="avatar-clickable"
                            onClick={(e) => handleAvatarClick(g.expert_id, e)}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.parentElement.innerHTML = `<div class="avatar-fallback">${getInitials(g.expert_name)}</div>`;
                            }}
                          />
                        ) : (
                          <AvatarFallback className="avatar-clickable" onClick={(e) => handleAvatarClick(g.expert_id, e)}>
                            {getInitials(g.expert_name)}
                          </AvatarFallback>
                        )}
                        
                        <div className="expert-info">
                          <div className="expert-name-section">
                            <h4>{g.expert_name}</h4>
                            <ExpertBadge>
                              <FiBriefcase size={12} />
                              <span className="expert-position">{g.expert_position}</span>
                            </ExpertBadge>
                            {pricing.hasPerMinute && (
                              <span className="pricing-badge per-minute">
                                <FiPhone size={10} /> ₹{pricing.callPrice}/min
                              </span>
                            )}
                            {pricing.hasSession && !pricing.hasPerMinute && (
                              <span className="pricing-badge session">
                                <FiBookOpen size={10} /> Session ₹{pricing.sessionPrice}
                              </span>
                            )}
                            {pricing.hasPlans && !pricing.hasPerMinute && !pricing.hasSession && (
                              <span className="pricing-badge plans">
                                <FiZap size={10} /> Plans Available
                              </span>
                            )}
                          </div>
                          
                          <div className="expert-stats">
                            <span className="meta-item">
                              <FiPhone size={12} /> {g.total_calls} calls
                            </span>
                            <span className="meta-item">
                              <FiClock size={12} /> {formatDuration(g.total_duration)}
                            </span>
                            <span className="meta-item">
                              ₹{g.total_spent} spent
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
                          <div className="last-consultation hide-on-mobile">
                            <div>Last call</div>
                            <div className="last-date">{formatDate(g.last_call_time)}</div>
                          </div>
                          {isOpen ? (
                            <FiChevronDown size={20} className="chevron-icon" />
                          ) : (
                            <FiChevronRight size={20} className="chevron-icon" />
                          )}
                        </div>
                      </div>
                    </ChatHeader>

                    {isOpen && (
                      <div className="expanded-content">
                        <SessionHeader>
                          <h5>Call Sessions</h5>
                          <div className="expert-badge">
                            <FiCalendar size={12} /> {g.total_calls} calls
                          </div>
                        </SessionHeader>
                        
                        <SessionsWrap>
                          {g.calls.map((call, idx) => {
                            const config = STATUS_CONFIG[call.status === 'ended' ? 'completed' : call.status] || STATUS_CONFIG.missed;
                            const StatusIcon = config.icon;
                            const billedAmount = calculateBilledAmount(
                              call.duration, 
                              call.price_per_minute
                            );

                            return (
                              <SessionCard key={call.id} premium>
                                <div className="session-indicator">
                                  <div className="session-number">{idx + 1}</div>
                                </div>
                                
                                <div className="session-info">
                                  <div className="session-details">
                                    <div className="date">
                                      <FiCalendar size={14} />
                                      {formatDate(call.created_at)}
                                    </div>
                                    <div className="duration">
                                      <FiWatch size={14} />
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
                                
                                <div className="session-amount">
                                  <div className="amount-label">Amount</div>
                                  <div className="amount">₹{billedAmount}</div>
                                </div>
                                
                                <ActionButtons>
                                  <ViewChatButton onClick={() => navigate(`/user/experts/${call.expert_id}`)}>
                                    <FiEye size={14} />
                                    <span className="hide-on-mobile">Profile</span>
                                  </ViewChatButton>
                                  
                                  <ChatAgainButton onClick={() => handleStartCall(call.expert_id, call.call_type)}>
                                    <FiPhone size={14} />
                                    <span className="hide-on-mobile">Call</span>
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
            )
          )}
        </HistoryList>

        {/* Chat Details Modal */}
        {showDetails && selectedSession && (
          <ModalOverlay onClick={() => setShowDetails(false)}>
            <ModalContent premium onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-user-info">
                  {selectedSession.expert_avatar ? (
                    <Avatar
                      premium
                      src={selectedSession.expert_avatar}
                      onClick={() => navigate(`/user/experts/${selectedSession.expert_id}`)}
                      style={{ cursor: "pointer" }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <AvatarFallback style={{ cursor: "pointer" }} onClick={() => navigate(`/user/experts/${selectedSession.expert_id}`)}>
                      {getInitials(selectedSession.expert_name)}
                    </AvatarFallback>
                  )}
                  <div>
                    <h3>{selectedSession.expert_name || "Expert"}</h3>
                    <div className="modal-meta">
                      <span>{formatDate(selectedSession.end_time)}</span>
                      <span>•</span>
                      <span>{formatTime(selectedSession.duration_minutes)} duration</span>
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
      </PageContainer>
      
      {/* Chat Popups from hook */}
      <ChatPopups />
    </PremiumContainer>
  );
};

export default UserChatHistory;