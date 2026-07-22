import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import styled, { keyframes } from "styled-components";
import {
  FiSend,
  FiUserX,
  FiClock,
  FiMail,
  FiPhone,
  FiVideo,
  FiPaperclip,
  FiX,
  FiCheck,
  FiArrowLeft,
} from "react-icons/fi";
import { socket } from "../../../../shared/api/socket";
import { useExpert } from "../../../../shared/context/ExpertContext";
import { getUserPublicProfileApi } from "../../../../shared/api/userApi";
import { hotToast } from "../../../../shared/utils/lazyNotifications";
import { APP_CONFIG } from "../../../../config/appConfig";
import { getChatRoomCandidates, getChatRoomId, waitForChatDetailsRetry } from "../../../../shared/utils/chatRoom";
import { saveActiveChatSession, clearActiveChatSession } from "../../../../shared/utils/chatSession";

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

const MessagesArea = styled.div`
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 16px;
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
  font-size: 0.66rem;
  color: #667781;
`;

const ReadStatus = styled.span`
  font-size: 0.72rem;
  color: ${(props) => (props.$seen ? "#53bdeb" : "#8696a0")};
  display: inline-flex;
  align-items: center;
`;

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

const InputBarArea = styled.div`
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

const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function ExpertChat() {
  const { room_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { expert } = useExpert();

  const [chatData, setChatData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [peerTyping, setPeerTyping] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const peerTypingTimeoutRef = useRef(null);
  const inputWrapRef = useRef(null);

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

  const expertId = useMemo(() => {
    return expert?.id || expert?.expert_id || chatData?.expert_id || null;
  }, [expert, chatData]);

  const roomCandidates = useMemo(
    () => getChatRoomCandidates(location.state?.roomCandidates || [], location.state || {}, room_id),
    [location.state, room_id]
  );

  const fetchUserProfile = async (userId) => {
    try {
      const res = await getUserPublicProfileApi(userId);
      if (res?.success) setUserProfile(res.data);
    } catch (e) {}
  };

  const fetchChat = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("expert_token");

      let res = null;
      let data = null;
      let lastErrorText = "";
      let loadedRoomId = room_id;

      for (let attempt = 0; attempt < 5; attempt += 1) {
        for (const candidateRoomId of roomCandidates) {
          res = await fetch(`${APP_CONFIG.API_BASE_URL}/chat/details/${candidateRoomId}`, {
            headers: token
              ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
              : undefined,
            cache: "no-cache",
          });

          if (res.ok) {
            loadedRoomId = candidateRoomId;
            data = await res.json();
            break;
          }
          lastErrorText = await res.text();
          if (res.status !== 404) break;
        }
        if (res?.ok || res?.status !== 404 || attempt === 4) break;
        await waitForChatDetailsRetry();
      }

      if (!res?.ok || !data?.success || !data?.data) {
        throw new Error(lastErrorText || data?.message || "Chat not found");
      }

      const { session, messages: fetchedMessages } = data.data;
      setChatData(session);
      setSessionActive(!!session.is_active);

      setMessages(
        (fetchedMessages || []).map((m) => ({
          id: m.id,
          message: m.message,
          message_type: m.message_type || "text",
          image_url: m.image_url || null,
          is_seen: Number(m.is_seen) === 1 || m.is_seen === true,
          seen_at: m.seen_at || null,
          sender_type: m.sender_type,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }))
      );

      if (session.user_id) fetchUserProfile(session.user_id);
      if (String(loadedRoomId) !== String(room_id)) {
        navigate(`/expert/chat/${loadedRoomId}`, {
          replace: true,
          state: { ...location.state, roomCandidates },
        });
      }
    } catch {
      setError("Failed to load chat");
    } finally {
      setLoading(false);
    }
  }, [room_id, location.state, navigate, roomCandidates]);

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
  };

  const markMessagesSeen = useCallback(() => {
    if (!room_id || !expertId) return;
    if (socket.connected) {
      socket.emit("message:seen", { room_id });
      return;
    }
    fetch(`${APP_CONFIG.API_BASE_URL}/chat/seen/${room_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ viewer_id: expertId, viewer_type: "expert" }),
    }).catch(() => {});
  }, [room_id, expertId]);

  const emitTyping = useCallback(
    (value) => {
      if (!room_id || !socket.connected) return;
      socket.emit(value ? "typing:start" : "typing:stop", { room_id });
    },
    [room_id]
  );

  const handleMessageChange = useCallback(
    (e) => {
      setMessage(e.target.value);
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

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!room_id || !sessionActive || uploading) return;

    if (!selectedImage && message.trim()) {
      const tempId = Date.now();
      setMessages((prev) => [
        ...prev,
        {
          id: tempId,
          client_id: tempId,
          sender_type: "expert",
          sender_id: expertId,
          message: message.trim(),
          message_type: "text",
          is_seen: false,
          seen_at: null,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isTemp: true,
        },
      ]);

      socket.emit("sendMessage", {
        room_id,
        client_id: tempId,
        message: message.trim(),
        type: "text",
      });

      emitTyping(false);
      setMessage("");
      scrollToBottom();
      return;
    }

    if (selectedImage) {
      try {
        setUploading(true);
        const tempId = Date.now();
        const tempImageUrl = URL.createObjectURL(selectedImage);

        setMessages((prev) => [
          ...prev,
          {
            id: tempId,
            client_id: tempId,
            sender_type: "expert",
            sender_id: expertId,
            message: message.trim() || "",
            message_type: "image",
            image_url: tempImageUrl,
            is_seen: false,
            seen_at: null,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            isTemp: true,
          },
        ]);
        scrollToBottom();

        const imageUrl = await uploadImage(selectedImage);
        setMessages((prev) =>
          prev.map((msg) => (msg.client_id === tempId ? { ...msg, image_url: imageUrl, isTemp: false } : msg))
        );

        socket.emit("sendMessage", {
          room_id,
          client_id: tempId,
          message: message.trim() || "",
          type: "image",
          imageUrl,
        });
        setSelectedImage(null);
        emitTyping(false);
        setMessage("");
      } catch (err) {
        console.error("Upload failed:", err);
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
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (!room_id || !expertId) return;

    const joinChatRoom = () => {
      socket.emit("register", { userId: Number(expertId), role: "expert" });
      socket.emit("join_room", { room_id });
      markMessagesSeen();
    };

    socket.on("connect", joinChatRoom);
    if (socket.connected) joinChatRoom();
    else socket.connect();

    const handleNewMessage = (msgData) => {
      const incomingRoomId = msgData.room_id || msgData.roomId || msgData.chat_room_id || msgData.chatRoomId;
      if (String(incomingRoomId) !== String(room_id)) return;

      setMessages((prev) => {
        const exists = prev.some(
          (m) => m.id === msgData.id || (msgData.client_id && m.client_id === msgData.client_id)
        );
        if (exists) {
          return prev.map((m) => {
            if (m.id === msgData.id || (msgData.client_id && m.client_id === msgData.client_id)) {
              return {
                ...m,
                id: msgData.id,
                message_type: msgData.message_type || "text",
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
            time: new Date(msgData.time || msgData.created_at || Date.now()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ];
      });
      scrollToBottom();
      if (msgData.sender_type === "user") markMessagesSeen();
    };

    socket.on("message", handleNewMessage);
    socket.on("message_sent", handleNewMessage);

    const handlePeerTypingStart = (data = {}) => {
      if (String(data.room_id) !== String(room_id) || data.sender_type !== "user") return;
      setPeerTyping(true);
      if (peerTypingTimeoutRef.current) clearTimeout(peerTypingTimeoutRef.current);
      peerTypingTimeoutRef.current = setTimeout(() => setPeerTyping(false), 1600);
    };

    const handlePeerTypingStop = (data = {}) => {
      if (String(data.room_id) !== String(room_id) || data.sender_type !== "user") return;
      setPeerTyping(false);
      if (peerTypingTimeoutRef.current) {
        clearTimeout(peerTypingTimeoutRef.current);
        peerTypingTimeoutRef.current = null;
      }
    };

    const handleMessagesSeen = (data = {}) => {
      if (String(data.room_id) !== String(room_id) || data.viewer_type !== "user") return;
      const seenIds = new Set((data.message_ids || []).map((id) => Number(id)));
      setMessages((prev) =>
        prev.map((msg) => (seenIds.has(Number(msg.id)) ? { ...msg, is_seen: true, seen_at: data.seen_at || msg.seen_at } : msg))
      );
    };

    socket.on("typing:start", handlePeerTypingStart);
    socket.on("typing:stop", handlePeerTypingStop);
    socket.on("messages:seen", handleMessagesSeen);

    const handleChatEnded = (data = {}) => {
      if (String(getChatRoomId(data)) !== String(room_id)) return;
      setSessionActive(false);
      clearActiveChatSession();
      hotToast("success", "Chat ended", { id: "chat-ended" });
      navigate("/expert/chat-history", { replace: true });
    };

    socket.on("chat_ended", handleChatEnded);

    return () => {
      emitTyping(false);
      socket.emit("leave_room", { room_id });
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
  }, [room_id, expertId, navigate, markMessagesSeen, emitTyping, scrollToBottom]);

  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  useEffect(() => {
    if (chatData && sessionActive === true && room_id) {
      const pName = userProfile?.full_name || "User";
      saveActiveChatSession({
        room_id: String(room_id),
        participantName: pName,
        role: "expert",
        module: "expert",
        isActive: true,
        timestamp: Date.now(),
      });
    } else if (sessionActive === false) {
      clearActiveChatSession();
    }
  }, [chatData, sessionActive, room_id, userProfile]);

  const user = useMemo(() => {
    if (!chatData) return null;
    return {
      name: userProfile?.full_name || `User`,
      email: userProfile?.email,
      phone: userProfile?.phone,
      avatar: userProfile?.avatar,
    };
  }, [chatData, userProfile]);

  const handleInitiateVoiceCall = () => {
    if (user?.phone) {
      window.location.href = `tel:${user.phone}`;
    } else {
      alert(`Initiating voice call with ${user?.name || "Client"}...`);
    }
  };

  const handleInitiateVideoCall = () => {
    navigate("/expert/video-call", { state: { roomId: room_id, userId: chatData?.user_id } });
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
      {chatData && user ? (
        <>
          {/* WHATSAPP STICKY HEADER (SAFE AREA TOP COMPLIANT) */}
          <HeaderBar>
            <HeaderLeft>
              <HeaderBackBtn onClick={() => navigate("/expert/chat-history")}>
                <FiArrowLeft size={20} />
              </HeaderBackBtn>
              <HeaderAvatarWrap>
                {user.avatar ? (
                  <HeaderAvatar src={user.avatar} alt={user.name} />
                ) : (
                  <HeaderAvatarPlaceholder>{getInitials(user.name)}</HeaderAvatarPlaceholder>
                )}
                <OnlineDot />
              </HeaderAvatarWrap>
              <HeaderTitleGroup>
                <HeaderName>{user.name}</HeaderName>
                <HeaderSubtext>{sessionActive ? "🟢 Active" : "🔴 Offline"}</HeaderSubtext>
              </HeaderTitleGroup>
            </HeaderLeft>
          </HeaderBar>

          {/* MESSAGES AREA */}
          <MessagesArea>
            {messages.length === 0 ? (
              <EmptyStateContainer>
                <span style={{ fontSize: "2rem" }}>💬</span>
                <h4 style={{ margin: 0, color: "#111b21" }}>Start your conversation</h4>
                <p style={{ margin: 0, fontSize: "0.85rem" }}>Say hello to get started</p>
              </EmptyStateContainer>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender_type === "expert" || msg.sender_type === "ai";
                return (
                  <MessageGroup key={msg.id} $isMe={isMe}>
                    <MessageBubble $isMe={isMe}>
                      {msg.message_type === "image" && msg.image_url && (
                        <img
                          src={msg.image_url}
                          alt="attachment"
                          onError={(e) => {
                            if (msg.isTemp) e.target.style.opacity = "0.5";
                            else e.target.style.display = "none";
                          }}
                        />
                      )}
                      {msg.message && <div>{msg.message}</div>}
                      <MessageFooter>
                        <TimeStamp>
                          {msg.time}
                          {msg.isTemp && " (sending...)"}
                        </TimeStamp>
                        {!msg.isTemp && isMe && (
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
          <InputBarArea ref={inputWrapRef}>
            {selectedImage && (
              <ImagePreviewRow>
                <img src={URL.createObjectURL(selectedImage)} alt="preview" />
                <span>{selectedImage.name}</span>
                <button onClick={() => setSelectedImage(null)}>
                  <FiX size={18} />
                </button>
              </ImagePreviewRow>
            )}

            <InputRow as="form" onSubmit={handleSendMessage}>
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
                disabled={!sessionActive || uploading}
                title="Attach Image"
              >
                <FiPaperclip size={20} />
              </AttachIconButton>

              <TextInput
                ref={inputRef}
                type="text"
                value={message}
                onFocus={scrollToBottom}
                onChange={handleMessageChange}
                onBlur={() => emitTyping(false)}
                onKeyDown={handleKeyPress}
                placeholder={
                  sessionActive
                    ? uploading
                      ? "Uploading image..."
                      : "Type a message..."
                    : "Chat ended"
                }
                disabled={!sessionActive || uploading}
              />

              <SendCircleBtn
                type="submit"
                onMouseDown={(e) => e.preventDefault()}
                onTouchStart={(e) => e.preventDefault()}
                disabled={uploading || (!message.trim() && !selectedImage) || !sessionActive}
              >
                {uploading ? "..." : <FiSend size={18} />}
              </SendCircleBtn>
            </InputRow>
          </InputBarArea>
        </>
      ) : error ? (
        <EmptyStateContainer>
          <FiUserX size={44} color="#ef4444" />
          <h3>{error}</h3>
          <p>Please try again or return to dashboard</p>
          <button
            onClick={() => navigate("/expert/home")}
            style={{
              padding: "10px 20px",
              borderRadius: "20px",
              background: "#00a884",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Go to Dashboard
          </button>
        </EmptyStateContainer>
      ) : (
        <EmptyStateContainer>
          <FiClock size={48} color="#00a884" />
          <h3>No Chat Selected</h3>
          <p>Select a conversation from the sidebar to start messaging</p>
        </EmptyStateContainer>
      )}
    </PageWrap>
  );
}