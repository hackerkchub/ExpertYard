import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import styled, { keyframes } from "styled-components";
import {
  FiSend,
  FiX,
  FiClock,
  FiCheck,
  FiUser,
  FiPhone,
  FiVideo,
  FiPaperclip,
  FiArrowLeft,
} from "react-icons/fi";
import { socket } from "../../../../shared/api/socket";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { usePublicExpert as useExpert } from "../../context/PublicExpertContext";
import { getExpertProfileByExpertIdApi } from "../../../../shared/api/expertapi/expert.api";
import useChatTimer from "../../../../shared/hooks/useChatTimer";
import { saveActiveChatSession, clearActiveChatSession } from "../../../../shared/utils/chatSession";
import { hotToast } from "../../../../shared/utils/lazyNotifications";
import { APP_CONFIG } from "../../../../config/appConfig";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { presenceService } from "../../../../shared/services/presence/presenceService";

/* ------------------ ANIMATIONS ------------------ */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

const typingBounce = keyframes`
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
`;

/* ------------------ WHATSAPP STYLED LAYOUT ------------------ */
const PageWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: var(--chat-height, 100dvh);
  max-height: var(--chat-height, 100dvh);
  background-color: #efeae2;
  background-image: radial-gradient(#d1d7db 1px, transparent 1px);
  background-size: 20px 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  z-index: 999;
`;

const HeaderBar = styled.div`
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

const HeaderAvatarWrap = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
`;

const HeaderAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

const HeaderAvatarPlaceholder = styled.div`
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

const HeaderTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
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

const TimerPill = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(16, 185, 129, 0.12);
  color: ${(props) => props.$color || "#10b981"};
  padding: 4px 10px;
  border-radius: 14px;
  font-size: 0.76rem;
  font-weight: 700;
`;

const EndChatPill = styled.button`
  background: #ef4444;
  color: #ffffff;
  border: none;
  border-radius: 16px;
  padding: 5px 12px;
  font-size: 0.76rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background 0.15s;

  &:hover {
    background: #dc2626;
  }
`;

const MessagesArea = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 16px;
  padding-bottom: calc(70px + max(8px, env(safe-area-inset-bottom, 0px)) + var(--native-keyboard-height, 0px));
  display: flex;
  flex-direction: column;
  gap: 10px;
  -webkit-overflow-scrolling: touch;
  min-height: 0;
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

  img {
    max-width: 240px;
    max-height: 240px;
    border-radius: 8px;
    object-fit: cover;
    display: block;
    margin-bottom: 4px;
  }
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
  font-size: 0.68rem;
  color: #667781;
`;

const ReadStatus = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${(props) => (props.$seen ? "#53bdeb" : "#667781")};
  font-size: 0.75rem;
  margin-left: 2px;
`;

const TypingBubble = styled.div`
  background: #ffffff;
  padding: 10px 16px;
  border-radius: 12px 12px 12px 2px;
  box-shadow: 0 1px 2px rgba(11, 20, 26, 0.13);
  align-self: flex-start;
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

const InputBarArea = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: var(--native-keyboard-height, 0px);
  width: 100%;
  max-width: 100%;
  background: #f0f2f5;
  border-top: 1px solid #e9edef;
  padding-top: 8px;
  padding-bottom: max(8px, env(safe-area-inset-bottom, 0px));
  padding-left: 12px;
  padding-right: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 20;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding-left: 8px;
    padding-right: 8px;
  }
`;

const ImagePreviewRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  padding: 6px 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;

  img {
    width: 38px;
    height: 38px;
    border-radius: 6px;
    object-fit: cover;
  }

  span {
    flex: 1;
    font-size: 0.8rem;
    color: #475569;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  button {
    background: none;
    border: none;
    color: #ef4444;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
`;

const InputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const AttachIconButton = styled.button`
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
  flex-shrink: 0;
  transition: background 0.15s;

  &:hover {
    background: #e9edef;
    color: #111b21;
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

const SendCircleBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #00a884;
  color: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s, background 0.15s;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: #008069;
    transform: scale(1.04);
  }

  &:active:not(:disabled) {
    transform: scale(0.96);
  }

  &:disabled {
    background: #cbd5e1;
    color: #94a3b8;
    cursor: not-allowed;
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

const ServiceEmptyCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: auto;
  max-width: 440px;
  width: 92%;
  padding: 28px 24px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e9edef;
  text-align: center;
  gap: 12px;
  animation: ${fadeIn} 0.25s ease-out;
`;

const ServiceBadgePill = styled.span`
  display: inline-block;
  background: #e6f4ea;
  color: #137333;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.5px;
  padding: 6px 14px;
  border-radius: 12px;
  text-transform: uppercase;
  margin-top: 4px;
`;

const ServiceEmptyTitle = styled.h3`
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #111b21;
`;

const ServiceEmptyMainMsg = styled.h4`
  margin: 4px 0 0 0;
  font-size: 1rem;
  font-weight: 600;
  color: #00a884;
`;

const ServiceEmptyDesc = styled.p`
  margin: 0;
  font-size: 0.88rem;
  color: #54656f;
  line-height: 1.45;
`;

const ServiceEmptySupport = styled.p`
  margin: 4px 0 0 0;
  font-size: 0.8rem;
  color: #8696a0;
  line-height: 1.4;
`;

const getInitials = (name) => {
  if (!name) return "E";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function Chat() {
  const { room_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatData, setChatData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sessionActive, setSessionActive] = useState(null);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [endTime, setEndTime] = useState(null);
  const [peerTyping, setPeerTyping] = useState(false);

  const typingTimeoutRef = useRef(null);
  const peerTypingTimeoutRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputWrapRef = useRef(null);

  const { user } = useAuth();
  const { experts, expertData } = useExpert();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  /* ------------------ BODY LOCK ------------------ */
  useEffect(() => {
    const topbar = document.querySelector(".main-app-topbar");
    const sidebar =
      document.querySelector("aside") ||
      document.querySelector("[class*='Sidebar']");

    if (topbar) topbar.style.display = "none";
    if (sidebar) sidebar.style.display = "none";

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.height = "100%";

    return () => {
      if (topbar) topbar.style.display = "flex";
      if (sidebar) sidebar.style.display = "flex";

      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, []);

  /* ------------------ VISUAL VIEWPORT MANAGEMENT ------------------ */
  useEffect(() => {
    if (Capacitor.isNativePlatform()) return;

    const updateHeight = () => {
      const height = window.visualViewport?.height || window.innerHeight;
      document.documentElement.style.setProperty("--chat-height", `${height}px`);

      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
      });
    };

    updateHeight();

    const viewport = window.visualViewport;
    if (viewport) {
      viewport.addEventListener("resize", updateHeight);
      viewport.addEventListener("scroll", updateHeight);
    }
    window.addEventListener("resize", updateHeight);

    return () => {
      if (viewport) {
        viewport.removeEventListener("resize", updateHeight);
        viewport.removeEventListener("scroll", updateHeight);
      }
      window.removeEventListener("resize", updateHeight);
    };
  }, []);



  const getRemainingMinutes = useCallback(() => {
    return chatData?.remainingMinutes ?? chatData?.remaining_minutes;
  }, [chatData]);

  const isUnlimited = useMemo(() => {
    const remaining = getRemainingMinutes();
    return chatData?.pricing_mode === "subscription" && remaining == null;
  }, [chatData, getRemainingMinutes]);

  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const queryExpertId = useMemo(() => searchParams.get("expert_id") || searchParams.get("expertId"), [searchParams]);

  const targetExpId = useMemo(() => {
    const rawId = chatData?.expert_id || queryExpertId;
    return rawId && Number(rawId) > 0 ? Number(rawId) : null;
  }, [chatData?.expert_id, queryExpertId]);

  const [resolvedExpert, setResolvedExpert] = useState(null);
  const [isFetchingExpert, setIsFetchingExpert] = useState(false);

  useEffect(() => {
    if (!targetExpId) {
      setResolvedExpert(null);
      setIsFetchingExpert(false);
      return;
    }

    if (chatData?.expert_name && Number(chatData?.expert_id) === Number(targetExpId)) {
      setResolvedExpert({
        id: Number(targetExpId),
        name: chatData.expert_name,
        avatar: chatData.expert_avatar || "",
        title: chatData.expert_title || chatData.expert_position || "",
      });
      setIsFetchingExpert(false);
      return;
    }

    const contextExp = (experts || []).find(
      (e) => Number(e.id) === Number(targetExpId) || Number(e.expert_id) === Number(targetExpId)
    );
    if (contextExp && (contextExp.name || contextExp.expert_name)) {
      setResolvedExpert({
        id: Number(targetExpId),
        name: contextExp.name || contextExp.expert_name,
        avatar: contextExp.profile_photo || contextExp.avatar || contextExp.profile_picture || "",
        title: contextExp.position || contextExp.title || "",
      });
      setIsFetchingExpert(false);
      return;
    }

    if (
      expertData &&
      (Number(expertData.id) === Number(targetExpId) || Number(expertData.expert_id) === Number(targetExpId) || Number(expertData.expertId) === Number(targetExpId)) &&
      (expertData.name || expertData.position)
    ) {
      setResolvedExpert({
        id: Number(targetExpId),
        name: expertData.name || "Expert",
        avatar: expertData.profile_photo || expertData.avatar || expertData.profile_picture || expertData.profile_image || "",
        title: expertData.position || expertData.title || "",
      });
      setIsFetchingExpert(false);
      return;
    }

    let isMounted = true;
    setIsFetchingExpert(true);

    getExpertProfileByExpertIdApi(targetExpId)
      .then((res) => {
        if (!isMounted) return;
        const data = res?.data || res?.profile || res;
        if (data && (data.name || data.expert_name || data.user_name)) {
          setResolvedExpert({
            id: Number(targetExpId),
            name: data.name || data.expert_name || data.user_name,
            avatar: data.profile_photo || data.avatar || data.profile_picture || data.profile_image || "",
            title: data.position || data.title || "",
          });
        } else {
          setResolvedExpert({
            id: Number(targetExpId),
            name: "Expert",
            avatar: "",
            title: "",
          });
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn("Failed to fetch expert profile for chat:", err);
        setResolvedExpert({
          id: Number(targetExpId),
          name: "Expert",
          avatar: "",
          title: "",
        });
      })
      .finally(() => {
        if (isMounted) {
          setIsFetchingExpert(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [targetExpId, chatData?.expert_id, chatData?.expert_name, experts, expertData]);

  const effectiveRoomId = useMemo(() => {
    if (room_id) return room_id;
    if (location.state?.room_id) return location.state.room_id;
    if (user?.id) {
      if (queryExpertId && Number(queryExpertId) > 0) {
        return `chat_${user.id}_${queryExpertId}`;
      }
      const bId = location.state?.bookingId || searchParams.get("booking_id");
      if (bId) {
        return `chat_service_${user.id}_${bId}`;
      }
      return `chat_service_${user.id}`;
    }
    return chatData?.room_id || null;
  }, [room_id, location.state, user?.id, queryExpertId, searchParams, chatData]);

  const fetchChatDetails = useCallback(async () => {
    const targetRoomId = effectiveRoomId;

    if (!targetRoomId) {
      setError("Unable to load chat: missing room ID or user session.");
      setChatData(null);
      setMessages([]);
      setSessionActive(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token") || localStorage.getItem("user_token") || localStorage.getItem("userToken") || "";

      let resultData = null;
      if (token) {
        try {
          const response = await fetch(`${APP_CONFIG.API_BASE_URL}/chat/details/${targetRoomId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: "no-cache",
          });

          if (response.ok) {
            const resJson = await response.json();
            if (resJson.success && resJson.data) {
              resultData = resJson.data;
            }
          }
        } catch (fetchErr) {
          console.warn("API fetch warning:", fetchErr);
        }
      }

      // 🟢 NO CONVERSATION YET IS NORMAL! Initialize clean Service Chat state
      const session = resultData?.session || {
        room_id: targetRoomId,
        user_id: user?.id,
        expert_id: queryExpertId && Number(queryExpertId) > 0 ? Number(queryExpertId) : null,
        is_active: 1,
        pricing_mode: "subscription",
        is_new_conversation: true,
      };

      const fetchedMessages = resultData?.messages || [];

      setChatData(session);
      setMessages(
        (fetchedMessages || []).map((msg) => ({
          id: msg.id || Date.now() + Math.random(),
          sender_type: msg.sender_type,
          sender_id: msg.sender_id,
          message: msg.message,
          message_type: msg.message_type || "text",
          image_url: msg.image_url || null,
          is_seen: Number(msg.is_seen) === 1 || msg.is_seen === true,
          seen_at: msg.seen_at || null,
          time: new Date(msg.created_at).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
        }))
      );

      setSessionActive(session ? Number(session.is_active) === 1 : true);
      if (session?.end_time) setEndTime(session.end_time);
      else if (location.state?.endTime) setEndTime(location.state.endTime);
      else setEndTime(null);

      setError("");
    } catch (err) {
      console.error("❌ Chat fetch error:", err);
      setError(err.message || "Unable to load chat");
      setChatData(null);
      setMessages([]);
      setSessionActive(false);
    } finally {
      setLoading(false);
    }
  }, [effectiveRoomId, location.state?.endTime, queryExpertId, user?.id]);

  const isRealExpertChat = useMemo(() => {
    const isExpertAssignment = chatData?.assignment_type ? chatData.assignment_type === "expert" : true;
    return Boolean(targetExpId && targetExpId > 0 && isExpertAssignment);
  }, [targetExpId, chatData?.assignment_type]);

  const isServiceChat = useMemo(() => {
    if (!isRealExpertChat) return true;
    const activeRoom = room_id || effectiveRoomId;
    return (
      String(activeRoom || "").startsWith("chat_") ||
      chatData?.pricing_mode === "subscription" ||
      location.state?.fromService ||
      location.state?.fromWorkspace
    );
  }, [isRealExpertChat, room_id, effectiveRoomId, chatData, location.state]);

  const navigateBackOrPrevious = useCallback(() => {
    const returnUrl = location.state?.returnUrl || location.state?.fromUrl;
    const bookingId = chatData?.booking_id || location.state?.bookingId;
    if (returnUrl) {
      navigate(returnUrl, { replace: true });
    } else if (isServiceChat || location.state?.fromWorkspace || location.state?.fromService) {
      if (window.history.length > 1) {
        navigate(-1);
      } else if (bookingId) {
        navigate(`/user/workspace/${bookingId}`, { replace: true });
      } else {
        navigate(-1);
      }
    } else {
      navigate("/user/chat-history", {
        replace: true,
        state: { from: "chat", expertId: chatData?.expert_id },
      });
    }
  }, [location.state, chatData?.booking_id, chatData?.expert_id, isServiceChat, navigate]);

  const handleAutoEndChat = useCallback(() => {
    if (isUnlimited) return;
    setSessionActive(false);
    if (socket.connected) {
      socket.emit("end_chat", { room_id });
    }
    navigateBackOrPrevious();
  }, [room_id, isUnlimited, navigateBackOrPrevious]);

  const handleEndChat = useCallback(() => {
    if (isServiceChat) {
      hotToast("info", "Service communication remains active throughout service fulfillment.", { id: "service-chat-info" });
      return;
    }
    if (!room_id) return;
    const ok = window.confirm("Are you sure you want to end this paid consultation chat?");
    if (!ok) return;

    if (socket.connected) {
      socket.emit("end_chat", { room_id });
    }
    setSessionActive(false);
    navigateBackOrPrevious();
  }, [room_id, isServiceChat, navigateBackOrPrevious]);

  const handleBack = useCallback(() => {
    if (isServiceChat) {
      clearActiveChatSession();
    }
    navigateBackOrPrevious();
  }, [isServiceChat, navigateBackOrPrevious]);

  useEffect(() => {
    if (user?.id) {
      presenceService.setIdentity(user.id, "user");
    }
    if (room_id) {
      presenceService.setActiveRoom(room_id, window.location.pathname);
    }
    return () => {
      presenceService.clearActiveRoom();
    };
  }, [user?.id, room_id]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let listener;
    const setupBackHandler = async () => {
      listener = await App.addListener("backButton", () => {
        handleBack();
      });
    };
    setupBackHandler();
    return () => {
      listener?.remove();
    };
  }, [handleBack]);

  const { formatted, secondsLeft } = useChatTimer(isUnlimited ? null : endTime, handleAutoEndChat);

  const getTimerColor = useCallback(() => {
    if (isUnlimited) return "#10b981";
    return secondsLeft <= 60 ? "#ef4444" : "#10b981";
  }, [isUnlimited, secondsLeft]);

  const handleGoHome = () => {
    setShowEndPopup(false);
    if (socket.connected) {
      socket.emit("end_chat", { room_id });
    }
    navigate("/user");
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/chat/upload`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Upload failed");
    const data = await response.json();
    const backendHost = APP_CONFIG.API_BASE_URL.replace("/api", "");
    return `${backendHost}${data.imageUrl}`;
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      hotToast("error", "Image size should be less than 5MB");
      return;
    }
    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const markMessagesSeen = useCallback(() => {
    if (!room_id || !user?.id) return;
    if (socket.connected) {
      socket.emit("message:seen", { room_id });
      return;
    }
    fetch(`${APP_CONFIG.API_BASE_URL}/chat/seen/${room_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ viewer_id: user.id, viewer_type: "user" }),
    }).catch(() => {});
  }, [room_id, user?.id]);

  const emitTyping = useCallback(
    (value) => {
      if (!room_id || !socket.connected) return;
      socket.emit(value ? "typing:start" : "typing:stop", { room_id });
    },
    [room_id]
  );

  const handleInputChange = useCallback(
    (e) => {
      setInput(e.target.value);
      emitTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => emitTyping(false), 1200);
    },
    [emitTyping]
  );
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
    });
  }, []);

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    const searchParams = new URLSearchParams(location.search);
    const queryExpertId = searchParams.get("expert_id") || searchParams.get("expertId");
    const effectiveRoomId = room_id || location.state?.room_id || (user?.id && queryExpertId ? `chat_${user.id}_${queryExpertId}` : null) || chatData?.room_id;

    if (!effectiveRoomId || uploading) return;

    if (!selectedImage && input.trim()) {
      const tempId = Date.now();
      const messageText = input.trim();
      setInput("");

      setMessages((prev) => [
        ...prev,
        {
          id: tempId,
          client_id: tempId,
          sender_type: "user",
          sender_id: user?.id,
          message: messageText,
          message_type: "text",
          is_seen: false,
          seen_at: null,
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
          isTemp: false,
        },
      ]);

      if (socket.connected) {
        socket.emit("sendMessage", {
          room_id: effectiveRoomId,
          client_id: tempId,
          message: messageText,
          type: "text",
        });
      } else {
        try {
          const token = localStorage.getItem("token") || localStorage.getItem("user_token") || localStorage.getItem("userToken") || "";
          await fetch(`${APP_CONFIG.API_BASE_URL}/chat/send`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
            body: JSON.stringify({
              room_id: effectiveRoomId,
              message: messageText,
              message_type: "text",
              sender_type: "user",
              sender_id: user?.id,
            }),
          });
        } catch (httpErr) {
          console.warn("HTTP message send fallback:", httpErr);
        }
      }

      emitTyping(false);
      scrollToBottom();
      return;
    }

    if (selectedImage) {
      try {
        setUploading(true);
        const tempId = Date.now();
        const messageText = input.trim();
        setInput("");

        setMessages((prev) => [
          ...prev,
          {
            id: tempId,
            client_id: tempId,
            sender_type: "user",
            sender_id: user?.id,
            message: messageText || "",
            message_type: "image",
            image_url: previewUrl,
            is_seen: false,
            seen_at: null,
            time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
            isTemp: true,
          },
        ]);
        scrollToBottom();

        const imageUrl = await uploadImage(selectedImage);
        setMessages((prev) =>
          prev.map((msg) => (String(msg.client_id) === String(tempId) || String(msg.id) === String(tempId) ? { ...msg, image_url: imageUrl, isTemp: false } : msg))
        );

        if (socket.connected) {
          socket.emit("sendMessage", {
            room_id: effectiveRoomId,
            client_id: tempId,
            message: messageText || "",
            type: "image",
            image_url: imageUrl,
            imageUrl: imageUrl,
          });
        } else {
          try {
            const token = localStorage.getItem("token") || localStorage.getItem("user_token") || localStorage.getItem("userToken") || "";
            await fetch(`${APP_CONFIG.API_BASE_URL}/chat/send`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
              },
              body: JSON.stringify({
                room_id: effectiveRoomId,
                message: messageText || "",
                message_type: "image",
                image_url: imageUrl,
                sender_type: "user",
                sender_id: user?.id,
              }),
            });
          } catch (httpErr) {
            console.warn("HTTP image message send fallback:", httpErr);
          }
        }

        setSelectedImage(null);
        setPreviewUrl(null);
        emitTyping(false);
      } catch (err) {
        console.error(err);
        hotToast("error", "Failed to upload image");
        setMessages((prev) => prev.filter((msg) => !msg.isTemp));
      } finally {
        setUploading(false);
        scrollToBottom();
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !uploading) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getMediaUrl = useCallback((url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:") || url.startsWith("data:")) {
      return url;
    }
    const backendHost = APP_CONFIG.API_BASE_URL.replace(/\/api\/?$/, "");
    return `${backendHost}${url.startsWith("/") ? "" : "/"}${url}`;
  }, []);

  useEffect(() => {
    const targetRoomId = room_id || effectiveRoomId;
    if (!targetRoomId || !user?.id) return;

    const joinChatRoom = () => {
      socket.emit("register", { userId: Number(user.id), role: "user" });
      socket.emit("join_room", { room_id: targetRoomId });
      markMessagesSeen();
    };

    socket.on("connect", joinChatRoom);
    if (socket.connected) joinChatRoom();
    else socket.connect();

    const handleNewMessage = (msgData) => {
      const incomingRoomId = msgData.room_id || msgData.roomId || msgData.chat_room_id || msgData.chatRoomId;
      if (targetRoomId && String(incomingRoomId) !== String(targetRoomId)) return;

      setMessages((prev) => {
        const isMatch = (m) =>
          (msgData.id && String(m.id) === String(msgData.id)) ||
          (msgData.client_id && m.client_id && String(m.client_id) === String(msgData.client_id));

        const exists = prev.some(isMatch);
        if (exists) {
          return prev.map((m) => {
            if (isMatch(m)) {
              return {
                ...m,
                id: msgData.id,
                message_type: msgData.message_type || (msgData.image_url ? "image" : m.message_type) || "text",
                image_url: msgData.image_url || m.image_url,
                is_seen: Number(msgData.is_seen) === 1 || msgData.is_seen === true || m.is_seen,
                seen_at: msgData.seen_at || m.seen_at || null,
                isTemp: false,
              };
            }
            return m;
          });
        }

        return [
          ...prev,
          {
            id: msgData.id,
            client_id: msgData.client_id,
            message: msgData.message,
            message_type: msgData.message_type || "text",
            image_url: msgData.image_url || null,
            is_seen: Number(msgData.is_seen) === 1 || msgData.is_seen === true,
            seen_at: msgData.seen_at || null,
            sender_type: msgData.sender_type,
            time: new Date(msgData.time || msgData.created_at || Date.now()).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
          },
        ];
      });
      scrollToBottom();
      if (msgData.sender_type === "expert") markMessagesSeen();
    };

    socket.on("message", handleNewMessage);
    socket.on("message_sent", handleNewMessage);

    const handlePeerTypingStart = (data = {}) => {
      if (String(data.room_id) !== String(targetRoomId) || data.sender_type === "user") return;
      setPeerTyping(true);
      if (peerTypingTimeoutRef.current) clearTimeout(peerTypingTimeoutRef.current);
      peerTypingTimeoutRef.current = setTimeout(() => setPeerTyping(false), 1600);
    };

    const handlePeerTypingStop = (data = {}) => {
      if (String(data.room_id) !== String(targetRoomId) || data.sender_type === "user") return;
      setPeerTyping(false);
      if (peerTypingTimeoutRef.current) {
        clearTimeout(peerTypingTimeoutRef.current);
        peerTypingTimeoutRef.current = null;
      }
    };

    const handleMessagesSeen = (data = {}) => {
      if (String(data.room_id) !== String(targetRoomId) || data.viewer_type === "user") return;
      const seenIds = new Set((data.message_ids || []).map((id) => Number(id)));
      setMessages((prev) =>
        prev.map((msg) => (seenIds.has(Number(msg.id)) ? { ...msg, is_seen: true, seen_at: data.seen_at || msg.seen_at } : msg))
      );
    };

    socket.on("typing:start", handlePeerTypingStart);
    socket.on("typing:stop", handlePeerTypingStop);
    socket.on("messages:seen", handleMessagesSeen);

    const handleChatEnded = (data = {}) => {
      if (String(data.room_id) !== String(targetRoomId)) return;
      setSessionActive(false);
      clearActiveChatSession();
      hotToast("success", "Chat ended");
      navigateBackOrPrevious();
    };

    socket.on("chat_ended", handleChatEnded);

    return () => {
      emitTyping(false);
      socket.emit("leave_room", { room_id: targetRoomId });
      socket.off("message", handleNewMessage);
      socket.off("message_sent", handleNewMessage);
      socket.off("typing:start", handlePeerTypingStart);
      socket.off("typing:stop", handlePeerTypingStop);
      socket.off("messages:seen", handleMessagesSeen);
      socket.off("chat_ended", handleChatEnded);
      socket.off("connect", joinChatRoom);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (peerTypingTimeoutRef.current) clearTimeout(peerTypingTimeoutRef.current);
    };
  }, [room_id, effectiveRoomId, user?.id, navigate, markMessagesSeen, emitTyping, scrollToBottom, navigateBackOrPrevious]);

  useEffect(() => {
    fetchChatDetails();
  }, [fetchChatDetails]);

  useEffect(() => {
    const activeRoom = room_id || effectiveRoomId;
    if (chatData && sessionActive === true && activeRoom) {
      const pName = chatData.expert_name || "Expert";
      saveActiveChatSession({
        room_id: String(activeRoom),
        participantName: pName,
        role: "user",
        module: "user",
        isActive: true,
        timestamp: Date.now(),
      });
    } else if (sessionActive === false) {
      clearActiveChatSession();
    }
  }, [chatData, sessionActive, room_id, effectiveRoomId]);

  const [isExpertOnline, setIsExpertOnline] = useState(false);

  useEffect(() => {
    const targetExpertId = chatData?.expert_id || queryExpertId;
    if (!isRealExpertChat || !targetExpertId) return;

    const numericExpertId = Number(targetExpertId);

    const handleExpertStatus = (data = {}) => {
      if (Number(data.expertId || data.expert_id) === numericExpertId) {
        setIsExpertOnline(Boolean(data.online));
      }
    };

    const handleExpertOnline = (data = {}) => {
      if (Number(data.expert_id || data.expertId) === numericExpertId) {
        setIsExpertOnline(true);
      }
    };

    const handleExpertOffline = (data = {}) => {
      if (Number(data.expert_id || data.expertId) === numericExpertId) {
        setIsExpertOnline(false);
      }
    };

    socket.emit("check_expert_online", { expertId: numericExpertId });
    socket.on("expert_status", handleExpertStatus);
    socket.on("expert_online", handleExpertOnline);
    socket.on("expert_offline", handleExpertOffline);

    return () => {
      socket.off("expert_status", handleExpertStatus);
      socket.off("expert_online", handleExpertOnline);
      socket.off("expert_offline", handleExpertOffline);
    };
  }, [isRealExpertChat, chatData?.expert_id, queryExpertId]);

  const expertInfo = useMemo(() => {
    if (resolvedExpert && Number(resolvedExpert.id) === Number(targetExpId)) {
      return resolvedExpert;
    }
    if (chatData && chatData.expert_name && Number(chatData.expert_id) === Number(targetExpId)) {
      return {
        id: Number(targetExpId),
        name: chatData.expert_name,
        avatar: chatData.expert_avatar,
        title: chatData.expert_title,
      };
    }
    const contextExp = (experts || []).find(
      (e) => Number(e.id) === Number(targetExpId) || Number(e.expert_id) === Number(targetExpId)
    );
    if (contextExp && (contextExp.name || contextExp.expert_name)) {
      return {
        id: Number(targetExpId),
        name: contextExp.name || contextExp.expert_name,
        avatar: contextExp.profile_photo || contextExp.avatar || contextExp.profile_picture || "",
        title: contextExp.position || contextExp.title || "",
      };
    }
    if (
      expertData &&
      (Number(expertData.id) === Number(targetExpId) || Number(expertData.expert_id) === Number(targetExpId) || Number(expertData.expertId) === Number(targetExpId)) &&
      (expertData.name || expertData.position)
    ) {
      return {
        id: Number(targetExpId),
        name: expertData.name || "Expert",
        avatar: expertData.profile_photo || expertData.avatar || expertData.profile_picture || expertData.profile_image || "",
        title: expertData.position || expertData.title || "",
      };
    }
    return {
      id: targetExpId ? Number(targetExpId) : null,
      name: targetExpId ? (isFetchingExpert ? "Loading expert..." : "Expert") : "Service Q&A Chat",
      avatar: "",
    };
  }, [resolvedExpert, chatData, experts, expertData, targetExpId, isFetchingExpert]);

  const isChatDisabled = useMemo(() => {
    return (sessionActive === false && !isServiceChat) || loading;
  }, [sessionActive, isServiceChat, loading]);

  const handleInitiateVoiceCall = () => {
    navigate("/user/voice-call", { state: { roomId: room_id || effectiveRoomId, expertId: chatData?.expert_id } });
  };

  const handleInitiateVideoCall = () => {
    navigate("/user/video-call", { state: { roomId: room_id || effectiveRoomId, expertId: chatData?.expert_id } });
  };

  if (loading) {
    return (
      <PageWrap>
        <EmptyStateContainer>
          <FiClock size={40} color="#00a884" />
          <p>Loading conversation...</p>
        </EmptyStateContainer>
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <Toaster position="top-center" />
      {chatData ? (
        <>
          {/* STICKY HEADER */}
          <HeaderBar className="chat-header-bar">
            <HeaderLeft>
              <HeaderBackBtn onClick={handleBack}>
                <FiArrowLeft size={20} />
              </HeaderBackBtn>
              <HeaderAvatarWrap>
                {isRealExpertChat && expertInfo?.avatar ? (
                  <HeaderAvatar src={getMediaUrl(expertInfo.avatar)} alt={expertInfo.name} />
                ) : isRealExpertChat && expertInfo?.name ? (
                  <HeaderAvatarPlaceholder>{getInitials(expertInfo.name)}</HeaderAvatarPlaceholder>
                ) : (
                  <HeaderAvatarPlaceholder style={{ background: "linear-gradient(135deg, #00a884 0%, #008069 100%)", fontSize: "1.1rem" }}>
                    💬
                  </HeaderAvatarPlaceholder>
                )}
                {isRealExpertChat && isExpertOnline && <OnlineDot />}
              </HeaderAvatarWrap>
              <HeaderTitleGroup>
                <HeaderName>
                  {isRealExpertChat ? expertInfo?.name || "Loading expert..." : "Service Q&A Chat"}
                </HeaderName>
                <HeaderSubtext>
                  {isRealExpertChat
                    ? isExpertOnline
                      ? "🟢 Online"
                      : "🔴 Offline"
                    : "FREE SERVICE CHAT"}
                </HeaderSubtext>
              </HeaderTitleGroup>
            </HeaderLeft>

            <HeaderActions>
              {isRealExpertChat && !isUnlimited && sessionActive === true && endTime && (
                <TimerPill $color={getTimerColor()}>
                  <FiClock size={12} />
                  <span>{formatted}</span>
                </TimerPill>
              )}
            </HeaderActions>
          </HeaderBar>

          {/* MESSAGES AREA */}
          <MessagesArea>
            {messages.length === 0 ? (
              <ServiceEmptyCard>
                <div style={{ fontSize: "2.4rem", marginBottom: "2px" }}>💬</div>
                <ServiceEmptyTitle>Service Q&A Chat</ServiceEmptyTitle>
                <ServiceEmptyMainMsg>Have a question about this service?</ServiceEmptyMainMsg>
                <ServiceEmptyDesc>
                  Ask anything related to your service, requirements, documents, process, or order.
                </ServiceEmptyDesc>
                <ServiceBadgePill>FREE SERVICE CHAT</ServiceBadgePill>
                <ServiceEmptySupport>
                  This chat is free and is available for service-related questions and assistance.
                </ServiceEmptySupport>
              </ServiceEmptyCard>
            ) : (
              messages.map((msg) => {
                const isMine = msg.sender_type === "user";
                return (
                  <MessageGroup key={msg.id} $isMe={isMine}>
                    <MessageBubble $isMe={isMine}>
                      {(msg.message_type === "image" || msg.image_url) && msg.image_url && (
                        <div style={{ marginBottom: 4 }}>
                          <img
                            src={getMediaUrl(msg.image_url)}
                            alt="attachment"
                            style={{ maxWidth: "100%", maxHeight: 260, borderRadius: 8, objectFit: "cover", cursor: "pointer", display: "block" }}
                            onClick={() => window.open(getMediaUrl(msg.image_url), "_blank")}
                            onError={(e) => {
                              if (msg.isTemp) e.target.style.opacity = "0.5";
                            }}
                          />
                        </div>
                      )}
                      {msg.message && <div>{msg.message}</div>}
                      <MessageFooter>
                        <TimeStamp>
                          {msg.time}
                          {msg.isTemp && " (sending...)"}
                        </TimeStamp>
                        {!msg.isTemp && isMine && (
                          <ReadStatus $seen={msg.is_seen}>
                            <FiCheck size={11} />
                            {msg.is_seen ? "✓" : ""}
                          </ReadStatus>
                        )}
                      </MessageFooter>
                    </MessageBubble>
                  </MessageGroup>
                );
              })
            )}

            {peerTyping && (
              <TypingBubble>
                <Dot $delay="0s" />
                <Dot $delay="0.2s" />
                <Dot $delay="0.4s" />
              </TypingBubble>
            )}

            <div ref={messagesEndRef} />
          </MessagesArea>

          {/* FIXED BOTTOM CHAT INPUT (SAFE AREA BOTTOM COMPLIANT) */}
          <InputBarArea className="chat-input-bar" ref={inputWrapRef}>
            {selectedImage && (
              <ImagePreviewRow>
                <img src={previewUrl} alt="preview" />
                <span>{selectedImage.name}</span>
                <button
                  onClick={() => {
                    setSelectedImage(null);
                    setPreviewUrl(null);
                  }}
                >
                  <FiX size={18} />
                </button>
              </ImagePreviewRow>
            )}

            <InputRow as="form" onSubmit={sendMessage}>
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleImageSelect}
              />
              <AttachIconButton
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isChatDisabled || uploading}
                title="Attach Image"
              >
                <FiPaperclip size={20} />
              </AttachIconButton>

              <TextInput
                ref={inputRef}
                type="text"
                value={input}
                onFocus={scrollToBottom}
                onChange={handleInputChange}
                onBlur={() => emitTyping(false)}
                onKeyDown={handleKeyPress}
                placeholder={
                  isChatDisabled
                    ? "Chat ended"
                    : uploading
                    ? "Uploading image..."
                    : isRealExpertChat
                    ? "Type a message..."
                    : "Ask a question about your service..."
                }
                disabled={isChatDisabled || uploading}
              />

              <SendCircleBtn
                type="submit"
                disabled={uploading || (!input.trim() && !selectedImage) || isChatDisabled}
              >
                {uploading ? "..." : <FiSend size={18} />}
              </SendCircleBtn>
            </InputRow>
          </InputBarArea>
        </>
      ) : error ? (
        <EmptyStateContainer>
          <FiX size={44} color="#ef4444" />
          <h3>{error}</h3>
          <p>Please try again or return to chat history</p>
          <button
            onClick={() => navigate("/user/chat-history")}
            style={{
              padding: "10px 20px",
              borderRadius: "20px",
              background: "#00a884",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Go to Chat History
          </button>
        </EmptyStateContainer>
      ) : (
        <EmptyStateContainer>
          <FiClock size={48} color="#00a884" />
          <h3>No Chat Selected</h3>
          <p>Select a conversation from the sidebar to start messaging</p>
        </EmptyStateContainer>
      )}

      {/* Chat End Popup */}
      {showEndPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <FiX size={64} className="popup-icon" />
            <h2>Chat Ended</h2>
            <p>Your chat session has ended. Thank you for using our service!</p>
            <button onClick={handleGoHome} className="popup-button">
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </PageWrap>
  );
}