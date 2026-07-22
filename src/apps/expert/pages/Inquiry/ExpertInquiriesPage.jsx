import React, { useState, useEffect, useRef, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import {
  FiSend,
  FiInbox,
  FiArrowLeft,
  FiUser,
  FiInfo,
  FiSearch,
  FiClock,
  FiTag,
} from "react-icons/fi";
import { useSearchParams, useNavigate } from "react-router-dom";
import { APP_CONFIG } from "../../../../config/appConfig";
import { socket } from "../../../../shared/api/socket";

/* ------------------ ANIMATIONS ------------------ */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

const typingBounce = keyframes`
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

/* ------------------ STYLED COMPONENTS ------------------ */
const PageContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: var(--chat-viewport-height, 100dvh);
  max-height: var(--chat-viewport-height, 100dvh);
  background-color: #efeae2; /* WhatsApp Wallpaper Background */
  background-image: radial-gradient(#d1d7db 1px, transparent 1px);
  background-size: 20px 20px;
  display: flex;
  overflow: hidden;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  z-index: 999;
`;

const Sidebar = styled.div`
  width: 380px;
  flex-shrink: 0;
  background: #ffffff;
  border-right: 1px solid #e0dfdc;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  z-index: 10;

  @media (max-width: 768px) {
    width: 100%;
    display: ${(props) => (props.$active ? "none" : "flex")};
  }
`;

const ListHeader = styled.div`
  padding-top: max(14px, calc(10px + env(safe-area-inset-top, 0px)));
  padding-bottom: 14px;
  padding-left: 16px;
  padding-right: 16px;
  background: #f0f2f5;
  border-bottom: 1px solid #e9edef;
  display: flex;
  flex-direction: column;
  gap: 10px;
  box-sizing: border-box;
`;

const ListHeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ListTitle = styled.h2`
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #111b21;
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px 8px 36px;
  border-radius: 8px;
  border: none;
  background: #ffffff;
  font-size: 0.875rem;
  color: #111b21;
  outline: none;
  box-shadow: inset 0 0 0 1px #e9edef;

  &:focus {
    box-shadow: inset 0 0 0 1.5px #00a884;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #667781;
  font-size: 0.95rem;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 2px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterChip = styled.button`
  padding: 5px 12px;
  border-radius: 16px;
  font-size: 0.78rem;
  font-weight: 600;
  border: 1px solid ${(props) => (props.$active ? "#00a884" : "#e9edef")};
  background: ${(props) => (props.$active ? "#e7fce3" : "#ffffff")};
  color: ${(props) => (props.$active ? "#007a5a" : "#54656f")};
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;

  &:hover {
    background: ${(props) => (props.$active ? "#e7fce3" : "#f5f6f6")};
  }
`;

const InquiryList = styled.div`
  flex: 1;
  overflow-y: auto;
  background: #ffffff;
  -webkit-overflow-scrolling: touch;
`;

const InquiryItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f0f2f5;
  cursor: pointer;
  background: ${(props) => (props.$selected ? "#f0f2f5" : "#ffffff")};
  border-left: 4px solid ${(props) => (props.$selected ? "#00a884" : "transparent")};
  transition: background 0.15s;
  display: flex;
  gap: 12px;

  &:hover {
    background: #f5f6f6;
  }
`;

const ClientAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00a884 0%, #008069 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.05rem;
  flex-shrink: 0;
  position: relative;
`;

const OnlineDot = styled.span`
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #25d366;
  border: 2px solid #ffffff;
`;

const ItemContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 3px;
`;

const ClientName = styled.h4`
  margin: 0;
  font-size: 0.92rem;
  font-weight: 600;
  color: #111b21;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const StatusBadge = styled.span`
  font-size: 0.68rem;
  padding: 2px 7px;
  border-radius: 10px;
  font-weight: 700;
  text-transform: capitalize;
  background: ${(props) => {
    switch (props.$status) {
      case "new": return "#e7fce3";
      case "opened": return "#fff3e0";
      case "expert_replied": return "#dcf8c6";
      case "user_replied": return "#e3f2fd";
      case "converted": return "#f3e8ff";
      case "closed": return "#f0f2f5";
      default: return "#f0f2f5";
    }
  }};
  color: ${(props) => {
    switch (props.$status) {
      case "new": return "#007a5a";
      case "opened": return "#e65100";
      case "expert_replied": return "#007a5a";
      case "user_replied": return "#0288d1";
      case "converted": return "#6b21a8";
      case "closed": return "#667781";
      default: return "#667781";
    }
  }};
`;

const SubjectText = styled.p`
  margin: 0 0 2px 0;
  font-size: 0.84rem;
  font-weight: 600;
  color: #3b4a54;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MessagePreview = styled.p`
  margin: 0;
  font-size: 0.78rem;
  color: #667781;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DateText = styled.span`
  font-size: 0.72rem;
  color: #667781;
`;

/* ------------------ MAIN CHAT DISPLAY ------------------ */
const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;

  @media (max-width: 768px) {
    display: ${(props) => (props.$active ? "flex" : "none")};
  }
`;

/* ------------------ FIXED WHATSAPP HEADER (SAFE AREA COMPLIANT) ------------------ */
const WhatsAppHeader = styled.div`
  flex: 0 0 auto;
  min-height: calc(60px + env(safe-area-inset-top, 0px));
  background: #f0f2f5;
  border-bottom: 1px solid #e9edef;
  padding-top: max(8px, env(safe-area-inset-top, 0px));
  padding-bottom: 8px;
  padding-left: 12px;
  padding-right: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 20;
  box-shadow: 0 1px 3px rgba(11, 20, 26, 0.08);
  box-sizing: border-box;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const HeaderBackBtn = styled.button`
  background: none;
  border: none;
  color: #54656f;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.15s;

  &:hover {
    background: #e9edef;
  }
`;

const HeaderAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00a884 0%, #008069 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  flex-shrink: 0;
  cursor: pointer;
`;

const HeaderTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  cursor: pointer;
`;

const HeaderName = styled.h3`
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #111b21;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HeaderSubtext = styled.span`
  font-size: 0.75rem;
  color: #667781;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    gap: 3px;
  }
`;

const HeaderIconButton = styled.button`
  background: none;
  border: none;
  color: #54656f;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #e9edef;
    color: #111b21;
  }
`;

const ActionPill = styled.button`
  padding: 5px 10px;
  border-radius: 16px;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  border: 1px solid ${(props) => (props.$primary ? "transparent" : "#cbd5e1")};
  background: ${(props) => (props.$primary ? "#00a884" : "#ffffff")};
  color: ${(props) => (props.$primary ? "#ffffff" : "#334155")};
  transition: all 0.15s;

  &:hover:not(:disabled) {
    background: ${(props) => (props.$primary ? "#008069" : "#f1f5f9")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* ------------------ COLLAPSIBLE MODERN INQUIRY CARDS ------------------ */
const InfoCardsDrawer = styled.div`
  flex: 0 0 auto;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 12px 16px;
  max-height: 45vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.2s ease-out;
  z-index: 15;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
`;

const ModernCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #f1f5f9;
`;

const CardRow = styled.div`
  font-size: 0.78rem;
  color: #475569;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  gap: 8px;

  strong {
    color: #0f172a;
    font-weight: 600;
  }
`;

/* ------------------ MESSAGES SCROLL AREA ------------------ */
const MessagesArea = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  -webkit-overflow-scrolling: touch;
  min-height: 0;
`;

const DatePill = styled.div`
  align-self: center;
  background: rgba(255, 255, 255, 0.92);
  color: #54656f;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(11, 20, 26, 0.12);
  margin: 6px 0;
`;

const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-self: ${(props) => (props.$isMe ? "flex-end" : "flex-start")};
  max-width: 82%;
  animation: ${fadeIn} 0.2s ease-out;
`;

const MessageBubble = styled.div`
  background: ${(props) => (props.$isMe ? "#dcf8c6" : "#ffffff")};
  color: #111b21;
  padding: 8px 12px;
  border-radius: ${(props) => (props.$isMe ? "12px 12px 2px 12px" : "12px 12px 12px 2px")};
  box-shadow: 0 1px 2px rgba(11, 20, 26, 0.13);
  position: relative;
  word-break: break-word;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const MessageSenderName = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${(props) => (props.$isMe ? "#075e54" : "#00a884")};
  margin-bottom: 2px;
`;

const MessageFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  margin-top: 2px;
  float: right;
  margin-left: 12px;
`;

const TimeStamp = styled.span`
  font-size: 0.66rem;
  color: #667781;
`;

const ReadStatus = styled.span`
  font-size: 0.72rem;
  color: ${(props) => (props.$seen ? "#53bdeb" : "#8696a0")};
  display: inline-flex;
  align-items: center;
`;

/* ------------------ TYPING INDICATOR ------------------ */
const TypingBubble = styled.div`
  align-self: flex-start;
  background: #ffffff;
  padding: 8px 14px;
  border-radius: 12px 12px 12px 2px;
  box-shadow: 0 1px 2px rgba(11, 20, 26, 0.13);
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  background: #8696a0;
  border-radius: 50%;
  display: inline-block;
  animation: ${typingBounce} 1.4s infinite ease-in-out both;
  animation-delay: ${(props) => props.$delay || "0s"};
`;

/* ------------------ FIXED MESSAGING INPUT BAR (SAFE AREA COMPLIANT) ------------------ */
const InputArea = styled.form`
  flex: 0 0 auto;
  width: 100%;
  max-width: 100%;
  background: #f0f2f5;
  border-top: 1px solid #e9edef;
  padding-top: 8px;
  padding-bottom: max(8px, env(safe-area-inset-bottom, 0px));
  padding-left: 12px;
  padding-right: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 20;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding-left: 8px;
    padding-right: 8px;
    gap: 6px;
  }
`;

const TextInput = styled.input`
  flex: 1 1 auto;
  min-width: 0;
  width: 100%;
  background: #ffffff;
  border: none;
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 0.92rem;
  color: #111b21;
  outline: none;
  box-sizing: border-box;
  box-shadow: inset 0 0 0 1px #e9edef;

  @media (max-width: 480px) {
    padding: 9px 12px;
    font-size: 0.88rem;
  }

  &:focus {
    box-shadow: inset 0 0 0 1.5px #00a884;
  }

  &:disabled {
    background: #f5f6f6;
    color: #8696a0;
  }
`;

const SendTextButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #00a884;
  color: #ffffff;
  border: none;
  border-radius: 20px;
  padding: 9px 16px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;
  white-space: nowrap;
  box-sizing: border-box;
  transition: background 0.15s, transform 0.15s;
  box-shadow: 0 2px 4px rgba(0, 168, 132, 0.2);

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.82rem;
  }

  &:hover:not(:disabled) {
    background: #008069;
  }

  &:active:not(:disabled) {
    transform: scale(0.96);
  }

  &:disabled {
    background: #cbd5e1;
    color: #94a3b8;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 40px 20px;
  color: #667781;
  text-align: center;
  height: 100%;
  background: #ffffff;
`;

/* ------------------ SKELETON ------------------ */
const SkeletonBox = styled.div`
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite linear;
  border-radius: 8px;
  height: ${(props) => props.$height || "60px"};
  margin-bottom: 12px;
`;

/* ------------------ MAIN COMPONENT ------------------ */
export default function ExpertInquiriesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get("id");

  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showInfoCards, setShowInfoCards] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  /* ------------------ KEYBOARD & VISUAL VIEWPORT ------------------ */
  useEffect(() => {
    const handleViewportResize = () => {
      if (window.visualViewport) {
        const height = window.visualViewport.height;
        document.documentElement.style.setProperty("--chat-viewport-height", `${height}px`);
      }
    };
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportResize);
      window.visualViewport.addEventListener("scroll", handleViewportResize);
      handleViewportResize();
    }
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleViewportResize);
        window.visualViewport.removeEventListener("scroll", handleViewportResize);
      }
    };
  }, []);

  /* ------------------ FETCH INQUIRIES ------------------ */
  const fetchInquiries = async (autoSelectId = null) => {
    try {
      const token = localStorage.getItem("expert_token");
      const res = await fetch(`${APP_CONFIG.API_BASE_URL}/inquiries/expert/all`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = await res.json();
      if (res.ok) {
        setInquiries(data.data || []);

        const selId = autoSelectId || initialId;
        if (selId && data.data) {
          const match = data.data.find((item) => Number(item.id) === Number(selId));
          if (match) {
            handleSelectInquiry(match);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [initialId]);

  /* ------------------ REAL-TIME SOCKET MESSAGES ------------------ */
  useEffect(() => {
    if (!socket || !selectedInquiry) return;

    const handleInquiryMessage = (data) => {
      if (Number(data.inquiry_id || data.inquiryId) === Number(selectedInquiry.id)) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("inquiry_message", handleInquiryMessage);
    return () => socket.off("inquiry_message", handleInquiryMessage);
  }, [selectedInquiry]);

  /* ------------------ AUTO SCROLL ------------------ */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ------------------ SELECT INQUIRY ------------------ */
  const handleSelectInquiry = async (inquiry) => {
    setSelectedInquiry(inquiry);
    setMessages([]);
    setError("");
    try {
      const token = localStorage.getItem("expert_token");
      const res = await fetch(`${APP_CONFIG.API_BASE_URL}/inquiries/expert/${inquiry.id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setMessages(data.data.messages || []);
        setSelectedInquiry(data.data.inquiry);
        setInquiries((prev) =>
          prev.map((item) => (item.id === inquiry.id ? { ...item, status: data.data.inquiry.status } : item))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ------------------ SEND MESSAGE ------------------ */
  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedInquiry) return;

    const messageContent = replyText.trim();
    setReplyText("");
    setLoading(true);

    try {
      const token = localStorage.getItem("expert_token");
      const res = await fetch(`${APP_CONFIG.API_BASE_URL}/inquiries/expert/${selectedInquiry.id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ message: messageContent }),
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setMessages((prev) => [...prev, data.data]);
        setInquiries((prev) =>
          prev.map((item) =>
            item.id === selectedInquiry.id ? { ...item, status: "expert_replied", message: messageContent } : item
          )
        );
      } else {
        setError(data.message || "Failed to send message");
      }
    } catch (err) {
      setError("Failed to send message. Please check connection.");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ INQUIRY ACTIONS ------------------ */
  const handleRejectInquiry = async () => {
    if (!selectedInquiry) return;
    if (!window.confirm("Are you sure you want to reject this inquiry?")) return;

    try {
      const token = localStorage.getItem("expert_token");
      const res = await fetch(`${APP_CONFIG.API_BASE_URL}/inquiries/expert/${selectedInquiry.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ status: "rejected" }),
      });
      if (res.ok) {
        setSelectedInquiry((prev) => ({ ...prev, status: "rejected" }));
        setInquiries((prev) =>
          prev.map((item) => (item.id === selectedInquiry.id ? { ...item, status: "rejected" } : item))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseInquiry = async () => {
    if (!selectedInquiry) return;
    if (!window.confirm("Are you sure you want to close this inquiry?")) return;

    try {
      const token = localStorage.getItem("expert_token");
      const res = await fetch(`${APP_CONFIG.API_BASE_URL}/inquiries/expert/${selectedInquiry.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ status: "closed" }),
      });
      if (res.ok) {
        setSelectedInquiry((prev) => ({ ...prev, status: "closed" }));
        setInquiries((prev) =>
          prev.map((item) => (item.id === selectedInquiry.id ? { ...item, status: "closed" } : item))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConvertInquiry = async () => {
    if (!selectedInquiry) return;
    try {
      const token = localStorage.getItem("expert_token");
      const res = await fetch(`${APP_CONFIG.API_BASE_URL}/inquiries/expert/${selectedInquiry.id}/convert`, {
        method: "POST",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (res.ok) {
        setSelectedInquiry((prev) => ({ ...prev, status: "converted" }));
        setInquiries((prev) =>
          prev.map((item) => (item.id === selectedInquiry.id ? { ...item, status: "converted" } : item))
        );
        alert("Inquiry converted successfully!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ------------------ FILTERED INQUIRIES ------------------ */
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      const matchesSearch =
        item.user_name_snapshot?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.subject?.toLowerCase().includes(searchText.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && item.status !== "closed" && item.status !== "rejected") ||
        (statusFilter === "closed" && item.status === "closed") ||
        (statusFilter === "rejected" && item.status === "rejected");

      return matchesSearch && matchesStatus;
    });
  }, [inquiries, searchText, statusFilter]);

  const getInitials = (name = "") => {
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + (words[1]?.charAt(0) || "")).toUpperCase();
  };

  return (
    <PageContainer>
      {/* ------------------ SIDEBAR (INQUIRY LIST) ------------------ */}
      <Sidebar $active={!!selectedInquiry}>
        <ListHeader>
          <ListHeaderTop>
            <HeaderBackBtn onClick={() => navigate("/expert/home")}>
              <FiArrowLeft size={20} />
            </HeaderBackBtn>
            <ListTitle>Inquiries</ListTitle>
          </ListHeaderTop>
          <SearchContainer>
            <SearchIcon />
            <SearchInput
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by client or subject..."
            />
          </SearchContainer>
          <FilterRow>
            <FilterChip $active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>
              All
            </FilterChip>
            <FilterChip $active={statusFilter === "active"} onClick={() => setStatusFilter("active")}>
              Active
            </FilterChip>
            <FilterChip $active={statusFilter === "closed"} onClick={() => setStatusFilter("closed")}>
              Closed
            </FilterChip>
            <FilterChip $active={statusFilter === "rejected"} onClick={() => setStatusFilter("rejected")}>
              Rejected
            </FilterChip>
          </FilterRow>
        </ListHeader>

        <InquiryList>
          {listLoading ? (
            <div style={{ padding: "16px" }}>
              <SkeletonBox $height="64px" />
              <SkeletonBox $height="64px" />
              <SkeletonBox $height="64px" />
            </div>
          ) : filteredInquiries.length === 0 ? (
            <EmptyStateContainer>
              <FiInbox size={36} color="#8696a0" />
              <p style={{ margin: 0, fontSize: "0.9rem" }}>No inquiries found.</p>
            </EmptyStateContainer>
          ) : (
            filteredInquiries.map((item) => (
              <InquiryItem
                key={item.id}
                $selected={selectedInquiry?.id === item.id}
                onClick={() => handleSelectInquiry(item)}
              >
                <ClientAvatar>
                  {getInitials(item.user_name_snapshot)}
                  <OnlineDot />
                </ClientAvatar>
                <ItemContent>
                  <ItemHeader>
                    <ClientName>{item.user_name_snapshot}</ClientName>
                    <StatusBadge $status={item.status}>{item.status}</StatusBadge>
                  </ItemHeader>
                  <SubjectText>{item.subject}</SubjectText>
                  <MessagePreview>{item.message}</MessagePreview>
                  <div style={{ marginTop: "4px", display: "flex", justifyContent: "flex-end" }}>
                    <DateText>{new Date(item.last_message_at || item.created_at).toLocaleDateString()}</DateText>
                  </div>
                </ItemContent>
              </InquiryItem>
            ))
          )}
        </InquiryList>
      </Sidebar>

      {/* ------------------ MAIN CHAT DISPLAY (IMMERSIVE WHATSAPP LOOK) ------------------ */}
      <MainContent $active={!!selectedInquiry}>
        {selectedInquiry ? (
          <>
            {/* FIXED WHATSAPP HEADER (SAFE AREA TOP COMPLIANT) */}
            <WhatsAppHeader>
              <HeaderLeft>
                <HeaderBackBtn onClick={() => setSelectedInquiry(null)}>
                  <FiArrowLeft size={20} />
                </HeaderBackBtn>
                <HeaderAvatar onClick={() => setShowInfoCards((prev) => !prev)}>
                  {getInitials(selectedInquiry.user_name_snapshot)}
                </HeaderAvatar>
              </HeaderLeft>

              <HeaderActions>
                <HeaderIconButton onClick={() => setShowInfoCards((prev) => !prev)} title="Inquiry Info">
                  <FiInfo size={18} />
                </HeaderIconButton>
                {selectedInquiry.status !== "converted" && selectedInquiry.status !== "closed" && (
                  <ActionPill $primary onClick={handleConvertInquiry}>
                    Convert
                  </ActionPill>
                )}
                {selectedInquiry.status !== "rejected" && selectedInquiry.status !== "closed" && (
                  <ActionPill onClick={handleRejectInquiry}>Reject</ActionPill>
                )}
                {selectedInquiry.status !== "closed" && <ActionPill onClick={handleCloseInquiry}>Close</ActionPill>}
              </HeaderActions>
            </WhatsAppHeader>

            {/* COLLAPSIBLE MODERN INQUIRY CARDS */}
            {showInfoCards && (
              <InfoCardsDrawer>
                <CardsGrid>
                  <ModernCard>
                    <CardHeader>
                      <FiUser color="#00a884" /> Client Overview
                    </CardHeader>
                    <CardRow>
                      <span>Name:</span> <strong>{selectedInquiry.user_name_snapshot}</strong>
                    </CardRow>
                  </ModernCard>

                  <ModernCard>
                    <CardHeader>
                      <FiTag color="#00a884" /> Service & Category
                    </CardHeader>
                    <CardRow>
                      <span>Category:</span> <strong>{selectedInquiry.category_name || "Consultation"}</strong>
                    </CardRow>
                    <CardRow>
                      <span>Subcategory:</span> <strong>{selectedInquiry.subcategory_name || "General"}</strong>
                    </CardRow>
                    <CardRow>
                      <span>Subject:</span> <strong>{selectedInquiry.subject}</strong>
                    </CardRow>
                  </ModernCard>

                  <ModernCard>
                    <CardHeader>
                      <FiClock color="#00a884" /> Preferences & Budget
                    </CardHeader>
                    <CardRow>
                      <span>Budget:</span> <strong>{selectedInquiry.budget ? `Rs ${selectedInquiry.budget}` : "Standard"}</strong>
                    </CardRow>
                    <CardRow>
                      <span>Contact Method:</span> <strong>{selectedInquiry.preferred_contact_method || "Chat"}</strong>
                    </CardRow>
                    <CardRow>
                      <span>Preferred Time:</span> <strong>{selectedInquiry.preferred_contact_time || "Anytime"}</strong>
                    </CardRow>
                    <CardRow>
                      <span>Created Date:</span> <strong>{new Date(selectedInquiry.created_at).toLocaleDateString()}</strong>
                    </CardRow>
                  </ModernCard>
                </CardsGrid>
              </InfoCardsDrawer>
            )}

            {/* MESSAGES SCROLL AREA */}
            <MessagesArea>
              <DatePill>{new Date(selectedInquiry.created_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</DatePill>

              {messages.map((msg) => {
                const isMe = msg.sender_type === "expert";
                const timeStr = new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                return (
                  <MessageGroup key={msg.id} $isMe={isMe}>
                    <MessageBubble $isMe={isMe}>
                      <MessageSenderName $isMe={isMe}>
                        {isMe ? "You" : selectedInquiry.user_name_snapshot}
                      </MessageSenderName>
                      <div>{msg.message}</div>
                      <MessageFooter>
                        <TimeStamp>{timeStr}</TimeStamp>
                        {isMe && <ReadStatus $seen={true}>✓✓</ReadStatus>}
                      </MessageFooter>
                    </MessageBubble>
                  </MessageGroup>
                );
              })}

              {isTyping && (
                <TypingBubble>
                  <Dot $delay="0s" />
                  <Dot $delay="0.2s" />
                  <Dot $delay="0.4s" />
                </TypingBubble>
              )}

              <div ref={messagesEndRef} />
            </MessagesArea>

            {error && (
              <div style={{ padding: "8px 16px", background: "#fef2f2", color: "#991b1b", fontSize: "0.82rem" }}>
                {error}
              </div>
            )}

            {/* FIXED WHATSAPP MESSAGING INPUT BAR (TEXT INPUT + ALWAYS VISIBLE SEND BUTTON) */}
            <InputArea onSubmit={handleSendReply}>
              <TextInput
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={
                  selectedInquiry.status === "closed" || selectedInquiry.status === "rejected"
                    ? "Inquiry is inactive"
                    : "Type your message..."
                }
                disabled={selectedInquiry.status === "closed" || selectedInquiry.status === "rejected" || loading}
              />
              <SendTextButton
                type="submit"
                onMouseDown={(e) => e.preventDefault()}
                onTouchStart={(e) => e.preventDefault()}
                disabled={selectedInquiry.status === "closed" || selectedInquiry.status === "rejected" || !replyText.trim() || loading}
              >
                <FiSend size={15} style={{ marginRight: 6 }} />
                Send
              </SendTextButton>
            </InputArea>
          </>
        ) : (
          <EmptyStateContainer>
            <FiInbox size={52} color="#00a884" />
            <h3 style={{ margin: "0", color: "#111b21", fontSize: "1.25rem", fontWeight: 600 }}>
              Select an Inquiry
            </h3>
            <p style={{ margin: 0, fontSize: "0.9rem" }}>
              Choose an inquiry from the sidebar to start messaging.
            </p>
          </EmptyStateContainer>
        )}
      </MainContent>
    </PageContainer>
  );
}
