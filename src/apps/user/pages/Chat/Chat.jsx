// src/apps/user/pages/chat/Chat.jsx - REDESIGNED WITH PREMIUM UI
import React, { useState, useEffect, useRef, useCallback, useLayoutEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { FiPaperclip, FiX, FiClock, FiCheck, FiSend, FiUser, FiMail, FiPhone } from "react-icons/fi";
import { IoMdSend } from "react-icons/io";
import {
  PageWrap,
  ChatLayout,
  RightPanel,
  UserHeader,
  UserInfo,
  Avatar,
  AvatarPlaceholder,
  UserMeta,
  ChatArea,
  Messages,
  Message,
  Bubble,
  ChatInputWrap,
  ChatInput,
  SendButton,
  AttachButton,
  NoChatSelected,
  LoadingSpinner,
  ErrorMessage,
  EmptyChatMessage,
  TypingIndicator,
  ImagePreview,
  InputStack,
  HeaderActions,
  TimerDisplay,
  UnlimitedBadge,
  EndChatButton,
  PricingBadge,
  StatusDot,
  ChatGlobalStyle,
} from "./Chat.styles";

import { socket } from "../../../../shared/api/socket";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { usePublicExpert as useExpert } from "../../context/PublicExpertContext";
import useChatTimer from "../../../../shared/hooks/useChatTimer";
import { saveActiveChatSession, clearActiveChatSession } from "../../../../shared/utils/chatSession";
import { hotToast } from "../../../../shared/utils/lazyNotifications";
import { APP_CONFIG } from "../../../../config/appConfig";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";

// Helper function to get initials
const getInitials = (name) => {
  if (!name) return "E";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const Chat = () => {
  const { room_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatData, setChatData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sessionActive, setSessionActive] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [endTime, setEndTime] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [peerTyping, setPeerTyping] = useState(false);

  const typingTimeoutRef = useRef(null);
  const peerTypingTimeoutRef = useRef(null);
  
  // IMAGE UPLOAD STATES
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputWrapRef = useRef(null);
  
  const { user } = useAuth();
  const { experts, expertData } = useExpert();

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ------------------ BODY LOCK (SAFER FOR ALL BROWSERS) ------------------ */
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
      const height =
        window.visualViewport?.height ||
        window.innerHeight;

      document.documentElement.style.setProperty(
        "--chat-height",
        `${height}px`
      );

      if (inputWrapRef.current) {
        const inputHeight = inputWrapRef.current.offsetHeight;
        document.documentElement.style.setProperty(
          "--input-height",
          `${inputHeight}px`
        );
      }

      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({
          block: "end"
        });
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

  useEffect(() => {
    if (inputWrapRef.current) {
      const inputHeight = inputWrapRef.current.offsetHeight;
      document.documentElement.style.setProperty(
        "--input-height",
        `${inputHeight}px`
      );
    }
  }, [selectedImage, peerTyping, uploading]);

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let listener;

    const setupBackHandler = async () => {
      listener = await App.addListener("backButton", () => {
        navigate("/user/chat-history", {
          replace: true,
          state: {
            from: "chat",
            expertId: chatData?.expert_id,
          },
        });
      });
    };

    setupBackHandler();

    return () => {
      listener?.remove();
    };
  }, [room_id, navigate, chatData?.expert_id]);

  const getRemainingMinutes = useCallback(() => {
    return chatData?.remainingMinutes ?? chatData?.remaining_minutes;
  }, [chatData]);

  const isUnlimited = useMemo(() => {
    const remaining = getRemainingMinutes();
    return (
      chatData?.pricing_mode === "subscription" &&
      remaining == null
    );
  }, [chatData, getRemainingMinutes]);

  const pricingLabel = useMemo(() => {
    if (!chatData) return "";

    if (chatData.pricing_mode === "per_minute") {
      const price = chatData.pricePerMinute || chatData.price_per_minute;
      return `₹${price}/min`;
    }

    if (chatData.pricing_mode === "session") {
      const duration = chatData.sessionDuration || chatData.session_duration;
      return `${duration} min session`;
    }

    if (chatData.pricing_mode === "subscription") {
      const remaining = getRemainingMinutes();
      return remaining == null
        ? "Unlimited"
        : `${remaining} min left`;
    }

    return "";
  }, [chatData, getRemainingMinutes]);

  // FETCH CHAT DETAILS
  const fetchChatDetails = useCallback(async () => {
    if (!room_id) {
      setError("Unable to load chat: missing room ID.");
      setChatData(null);
      setMessages([]);
      setSessionActive(false);
      setLoading(false);
      setIsInitialized(true);
      return;
    }
  
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem('user_token');
      if (!token) {
        throw new Error("Login required to open this chat.");
      }
      
      const response = await fetch(`${APP_CONFIG.API_BASE_URL}/chat/details/${room_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || 'Chat not found'}`);
      }
      
      const result = await response.json();
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Chat session not found');
      }
      
      const { session, messages: fetchedMessages } = result.data;
      if (!session) {
        throw new Error('No session data found');
      }
      
      setChatData(session);
      setMessages((fetchedMessages || []).map(msg => ({
        id: msg.id || Date.now() + Math.random(),
        sender_type: msg.sender_type,
        sender_id: msg.sender_id,
        message: msg.message,
        message_type: msg.message_type || "text",
        image_url: msg.image_url || null,
        is_seen: Number(msg.is_seen) === 1 || msg.is_seen === true,
        seen_at: msg.seen_at || null,
        time: new Date(msg.created_at).toLocaleTimeString('en-US', { 
          hour: '2-digit', minute: '2-digit', hour12: true 
        })
      })));
      
      setSessionActive(Number(session.is_active) === 1);

      if (Number(session.is_active) === 1) {
        setTimeout(() => markMessagesSeen(), 100);
      }

      if (session?.end_time) {
        setEndTime(session.end_time);
      } else if (location.state?.endTime) {
        setEndTime(location.state.endTime);
      } else {
        setEndTime(null);
      }

      setError("");
      
    } catch (err) {
      console.error("❌ Chat fetch error:", err);
      setError(err.message || 'Chat session not found');
      setChatData(null);
      setMessages([]);
      setSessionActive(false);
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  }, [room_id, location.state?.endTime]);

  const handleAutoEndChat = useCallback(() => {
    if (isUnlimited) {
      console.log("♾️ Unlimited subscription - no auto-end");
      return;
    }
    
    console.log("⏰ Timer expired - Auto ending chat");
    setSessionActive(false);

    if (socket.connected) {
      socket.emit("end_chat", {
        room_id
      });
    }

    navigate("/user/chat-history", {
      replace: true,
      state: {
        from: "chat",
        expertId: chatData?.expert_id
      }
    });
  }, [room_id, navigate, isUnlimited, chatData?.expert_id]);

  const handleEndChat = useCallback(() => {
    if (!room_id) return;

    const ok = window.confirm("Are you sure you want to end this chat?");

    if (!ok) return;

    if (socket.connected) {
      socket.emit("end_chat", {
        room_id
      });
    }

    setSessionActive(false);
    navigate("/user/chat-history", {
      replace: true,
      state: {
        from: "chat",
        expertId: chatData?.expert_id
      }
    });
  }, [room_id, navigate, chatData?.expert_id]);

  const handleBack = () => {
    navigate("/user/chat-history", {
      replace: true,
      state: {
        from: "chat",
        expertId: chatData?.expert_id
      }
    });
  };

  // Before unload handler
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (sessionActive) {
        e.preventDefault();
        e.returnValue = "Chat may be disconnected upon reloading!";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [sessionActive]);

  // Use chat timer hook
  const { formatted, secondsLeft, isExpired } = useChatTimer(
    isUnlimited ? null : endTime,
    handleAutoEndChat
  );

  // Timer color logic
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

  // IMAGE UPLOAD FUNCTION
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/chat/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

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

  const ensureSocketConnected = useCallback(() => {
    if (!socket.connected) {
      socket.connect();
    }
  }, []);

  const markMessagesSeen = useCallback(() => {
    if (!room_id || !user?.id) return;

    if (socket.connected) {
      socket.emit("message:seen", { room_id });
      return;
    }

    fetch(`${APP_CONFIG.API_BASE_URL}/chat/seen/${room_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        viewer_id: user.id,
        viewer_type: "user",
      }),
    }).catch(() => {});
  }, [room_id, user?.id]);

  const emitTyping = useCallback((value) => {
    if (!room_id || !socket.connected) return;
    socket.emit(value ? "typing:start" : "typing:stop", { room_id });
  }, [room_id]);

  const handleInputChange = useCallback((e) => {
    setInput(e.target.value);

    emitTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      emitTyping(false);
    }, 1200);
  }, [emitTyping]);

  /* ------------------ SCROLL TO BOTTOM ------------------ */
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        block: "end",
        behavior: "auto",
      });
    });
  }, []);

  const sendMessage = useCallback(async () => {
    if (!room_id || !sessionActive) return;
    if (uploading) return;

    emitTyping(false);
    ensureSocketConnected();

    // TEXT MESSAGE ONLY
    if (!selectedImage && input.trim()) {
      const tempId = Date.now();
      const messageData = {
        id: tempId,
        client_id: tempId,
        sender_type: "user",
        sender_id: user?.id,
        message: input.trim(),
        message_type: "text",
        image_url: null,
        time: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        isTemp: true
      };
      
      setMessages(prev => [...prev, messageData]);
      
      const payload = {
        room_id: String(room_id),
        client_id: tempId,
        message: input.trim(),
        type: "text"
      };

      socket.emit("sendMessage", payload);

      setInput("");
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }

    // IMAGE MESSAGE
    if (selectedImage) {
      try {
        setUploading(true);
        
        const tempId = Date.now();
        
        const messageData = {
          id: tempId,
          client_id: tempId,
          sender_type: "user",
          sender_id: user?.id,
          message: input.trim() || "",
          message_type: "image",
          image_url: previewUrl,
          time: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          isTemp: true
        };
        
        setMessages(prev => [...prev, messageData]);
        scrollToBottom();
        
        const imageUrl = await uploadImage(selectedImage);
        
        setMessages(prev => prev.map(msg => 
          msg.client_id === tempId 
            ? { ...msg, image_url: imageUrl, isTemp: false }
            : msg
        ));
        
        const payload = {
          room_id: String(room_id),
          client_id: tempId,
          message: input.trim() || "",
          type: "image",
          image_url: imageUrl
        };

        socket.emit("sendMessage", payload);

        setSelectedImage(null);
        setPreviewUrl(null);
        setInput("");
        
      } catch (err) {
        console.error("Upload failed:", err);
        hotToast("error", "Failed to upload image");
        setMessages(prev => prev.filter(msg => !msg.isTemp));
      } finally {
        setUploading(false);
        scrollToBottom();
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }
  }, [room_id, sessionActive, uploading, selectedImage, previewUrl, input, user?.id, ensureSocketConnected, scrollToBottom]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey && !uploading) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage, uploading]);

  const isChatDisabled = sessionActive === false;
  
  const isAIChat = useMemo(() => {
    return chatData?.is_ai_chat === true ||
      chatData?.is_ai_chat === 1 ||
      chatData?.is_ai_chat === "1";
  }, [chatData?.is_ai_chat]);

  // Socket events
  useEffect(() => {
    if (!room_id || !socket) return;

    const joinChatRoom = () => {
      if (!user?.id) return;
      socket.emit("register", {
        userId: Number(user.id),
        role: "user",
      });
      socket.emit("join_room", { room_id });
      markMessagesSeen();
    };

    socket.on("connect", joinChatRoom);

    if (socket.connected) {
      joinChatRoom();
    } else {
      socket.connect();
    }

    const handleNewMessage = (msgData) => {
      setAiTyping(false);
      
      const incomingRoomId = msgData.room_id || msgData.roomId;
      if (String(incomingRoomId) !== String(room_id)) {
        return;
      }

      setMessages(prev => {
        const exists = prev.some(
          m => m.id === msgData.id || 
          (msgData.client_id && m.client_id === msgData.client_id)
        );
        
        if (exists) {
          return prev.map(m => {
            if (m.id === msgData.id || (msgData.client_id && m.client_id === msgData.client_id)) {
              return {
                ...m,
                id: msgData.id,
                message_type: msgData.message_type || "text",
                image_url: msgData.image_url || m.image_url,
                is_seen: Number(msgData.is_seen) === 1 || msgData.is_seen === true || m.is_seen,
                seen_at: msgData.seen_at || m.seen_at || null,
                isTemp: false
              };
            }
            return m;
          });
        }

        return [...prev, {
          id: msgData.id,
          client_id: msgData.client_id,
          sender_type: msgData.sender_type,
          sender_id: msgData.sender_id,
          message: msgData.message,
          message_type: msgData.message_type || "text",
          image_url: msgData.image_url || null,
          is_seen: Number(msgData.is_seen) === 1 || msgData.is_seen === true,
          seen_at: msgData.seen_at || null,
          time: new Date(
            msgData.time || msgData.created_at || Date.now()
          ).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }];
      });

      if (msgData.sender_type !== "user") {
        markMessagesSeen();
      }
      
      scrollToBottom();
    };

    const handleChatAccepted = (data) => {
      if (data.room_id === room_id) {
        if (data.endTime) {
          setEndTime(data.endTime);
        } else {
          setEndTime(null);
        }
        setSessionActive(true); 
      }
    };

    const handleChatUpdate = ({ room_id: updatedRoomId }) => {
      if (updatedRoomId === room_id) {
        fetchChatDetails();
      }
    };

    const handleChatEnded = (data = {}) => {
      if (String(data.room_id) === String(room_id) || !data.room_id) {
        setSessionActive(false);
        clearActiveChatSession();
        hotToast("success", "Chat ended", { id: "chat-ended" });
        navigate("/user/chat-history", {
          replace: true,
          state: {
            from: "chat",
            expertId: chatData?.expert_id
          }
        });
      }
    };

    const handleAITyping = (data = {}) => {
      setAiTyping(!!data.isTyping);
    };

    const handlePeerTypingStart = (data = {}) => {
      if (String(data.room_id) !== String(room_id) || data.sender_type !== "expert") return;

      setPeerTyping(true);
      if (peerTypingTimeoutRef.current) {
        clearTimeout(peerTypingTimeoutRef.current);
      }
      peerTypingTimeoutRef.current = setTimeout(() => {
        setPeerTyping(false);
      }, 1600);
    };

    const handlePeerTypingStop = (data = {}) => {
      if (String(data.room_id) !== String(room_id) || data.sender_type !== "expert") return;

      setPeerTyping(false);
      if (peerTypingTimeoutRef.current) {
        clearTimeout(peerTypingTimeoutRef.current);
        peerTypingTimeoutRef.current = null;
      }
    };

    const handleMessagesSeen = (data = {}) => {
      if (String(data.room_id) !== String(room_id) || data.viewer_type !== "expert") return;

      const seenIds = new Set((data.message_ids || []).map((id) => Number(id)));
      setMessages((prev) => prev.map((msg) => (
        seenIds.has(Number(msg.id))
          ? { ...msg, is_seen: true, seen_at: data.seen_at || msg.seen_at }
          : msg
      )));
    };

    socket.on("message", handleNewMessage);
    socket.on("message_sent", handleNewMessage);
    socket.on("chat_accepted", handleChatAccepted);
    socket.on("chat_updated", handleChatUpdate);
    socket.on("chat_ended", handleChatEnded);
    socket.on("ai_typing", handleAITyping);
    socket.on("typing:start", handlePeerTypingStart);
    socket.on("typing:stop", handlePeerTypingStop);
    socket.on("messages:seen", handleMessagesSeen);

    return () => {
      socket.off("message", handleNewMessage);
      socket.off("message_sent", handleNewMessage);
      socket.off("chat_accepted", handleChatAccepted);
      socket.off("chat_updated", handleChatUpdate);
      socket.off("chat_ended", handleChatEnded);
      socket.off("ai_typing", handleAITyping);
      socket.off("typing:start", handlePeerTypingStart);
      socket.off("typing:stop", handlePeerTypingStop);
      socket.off("messages:seen", handleMessagesSeen);
      socket.off("connect", joinChatRoom);
      
      if (socket.connected) {
        socket.emit("leave_room", { room_id });
      }
    };
  }, [room_id, user?.id, fetchChatDetails, markMessagesSeen, navigate, chatData?.expert_id, scrollToBottom]);

  const expertInfo = useMemo(() => {
    if (isAIChat) {
      return {
        name: "AI Expert",
        position: "Instant AI Consultation",
        avatar: null,
      };
    }

    if (!chatData?.expert_id) return null;

    if (expertData?.expertId === chatData.expert_id) {
      return {
        name: expertData.name || `Expert #${chatData.expert_id}`,
        position: expertData.position || '',
        avatar: expertData.profile_photo || null,
      };
    }

    const expert = experts.find(e => e.id == chatData.expert_id);

    if (expert) {
      return {
        name: expert.name,
        position: expert.position || '',
        avatar: expert.profile_photo || null,
      };
    }

    return {
      name: `Expert #${chatData.expert_id}`,
      position: '',
      avatar: null,
    };
  }, [chatData?.expert_id, isAIChat, experts, expertData]);

  // Scroll to bottom on messages change
  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  // Initial fetch
  useEffect(() => {
    fetchChatDetails();
  }, [fetchChatDetails]);

  // Synchronize active chat session state
  useEffect(() => {
    if (chatData && sessionActive === true && room_id) {
      const pName = isAIChat 
        ? "AI Expert" 
        : (expertData?.expertId === chatData.expert_id ? expertData.name : null) || 
          experts.find(e => e.id == chatData.expert_id)?.name || 
          `Expert #${chatData.expert_id}`;

      saveActiveChatSession({
        room_id: String(room_id),
        chatPath: `/user/chat/${room_id}`,
        participantName: pName,
        role: "user",
        module: "user",
        isActive: true,
        timestamp: Date.now()
      });
    } else if (sessionActive === false) {
      clearActiveChatSession();
    }
  }, [chatData, sessionActive, room_id, isAIChat, experts, expertData]);

  if (loading && !isInitialized) {
    return (
      <>
        <ChatGlobalStyle />
        <PageWrap>
          <LoadingSpinner>Loading chat...</LoadingSpinner>
        </PageWrap>
      </>
    );
  }

  return (
    <>
      <Toaster position="top-center" />
      <ChatGlobalStyle />
      <PageWrap>
        <ChatLayout>
          <RightPanel>
            {chatData && expertInfo ? (
              <>
                <UserHeader>
                  <UserInfo>
                    {expertInfo.avatar ? (
                      <Avatar src={expertInfo.avatar} alt={expertInfo.name} />
                    ) : (
                      <AvatarPlaceholder>
                        {getInitials(expertInfo.name)}
                      </AvatarPlaceholder>
                    )}

                    <UserMeta>
                      <h4>{expertInfo.name}</h4>
                      <div className="user-details">
                        {sessionActive === true ? (
                          <span className="status active">🟢 Active</span>
                        ) : (
                          <span className="status ended">🔴 Ended</span>
                        )}
                        {expertInfo.position && (
                          <span className="detail-item">{expertInfo.position}</span>
                        )}
                      </div>
                    </UserMeta>
                  </UserInfo>

                  <HeaderActions>
                    {!isUnlimited && sessionActive === true && endTime && (
                      <TimerDisplay $color={getTimerColor()}>
                        <FiClock size={14} />
                        <span>{formatted}</span>
                      </TimerDisplay>
                    )}

                    {isUnlimited && sessionActive === true && (
                      <UnlimitedBadge>
                        <span>♾️</span> Unlimited
                      </UnlimitedBadge>
                    )}

                    <EndChatButton
                      onClick={handleEndChat}
                      disabled={isChatDisabled}
                      $active={!isChatDisabled}
                    >
                      <FiX size={20} />
                    </EndChatButton>
                  </HeaderActions>
                </UserHeader>

                <ChatArea>
                  <Messages>
                    {messages.length === 0 ? (
                      <EmptyChatMessage>
                        <span>💬</span>
                        <span>Start your conversation</span>
                        <span>Say hello to get started</span>
                      </EmptyChatMessage>
                    ) : (
                      messages.map((msg) => {
                        const isMine = msg.sender_type === "user";
                        
                        return (
                          <Message key={msg.id} $expert={!isMine}>
                            <Bubble $expert={!isMine} $hasText={!!msg.message}>
                              {msg.message_type === "image" && msg.image_url && (
                                <img
                                  src={msg.image_url}
                                  alt="chat-img"
                                  onError={(e) => {
                                    if (msg.isTemp) {
                                      e.target.style.opacity = "0.5";
                                    } else {
                                      e.target.style.display = "none";
                                    }
                                  }}
                                />
                              )}
                              
                              {msg.message && (
                                <div>{msg.message}</div>
                              )}
                              
                              <span className="time">
                                {msg.time}
                                {msg.isTemp && " (sending...)"}
                                {!msg.isTemp && isMine && (
                                  <span className="seen-indicator">
                                    {msg.is_seen ? (
                                      <>
                                        <FiCheck size={11} />
                                        <span>Seen</span>
                                      </>
                                    ) : (
                                      <>
                                        <FiCheck size={11} />
                                        <span>Sent</span>
                                      </>
                                    )}
                                  </span>
                                )}
                              </span>
                            </Bubble>
                          </Message>
                        );
                      })
                    )}
                    
                    <div ref={messagesEndRef} />
                  </Messages>

                  <InputStack>
                    {selectedImage && (
                      <ImagePreview>
                        <img
                          src={previewUrl}
                          alt="preview"
                        />
                        <span>{selectedImage.name}</span>
                        <button 
                          onClick={() => {
                            setSelectedImage(null);
                            setPreviewUrl(null);
                          }}
                          aria-label="Remove image"
                        >
                          <FiX size={18} />
                        </button>
                      </ImagePreview>
                    )}

                    {(aiTyping || peerTyping) && (
                      <TypingIndicator>
                        {aiTyping ? "AI Expert is typing..." : `${expertInfo?.name || "Expert"} is typing...`}
                      </TypingIndicator>
                    )}

                    <ChatInputWrap ref={inputWrapRef}>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                      />

                      {!isAIChat && (
                        <AttachButton
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isChatDisabled || uploading}
                          aria-label="Attach image"
                        >
                          <FiPaperclip size={18} />
                        </AttachButton>
                      )}

                      <ChatInput
                        ref={inputRef}
                        value={input}
                        onFocus={scrollToBottom}
                        onChange={handleInputChange}
                        onBlur={() => emitTyping(false)}
                        onKeyDown={handleKeyPress}
                        placeholder={
                          isChatDisabled 
                            ? "Chat ended" 
                            : (uploading ? "Uploading image..." : "Type a message...")
                        }
                        disabled={isChatDisabled || uploading}
                        rows={1}
                      />

                      <SendButton
                        onClick={sendMessage}
                        disabled={(uploading || (!input.trim() && !selectedImage)) || isChatDisabled}
                      >
                        {uploading ? (
                          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>...</span>
                        ) : (
                          <IoMdSend />
                        )}
                      </SendButton>
                    </ChatInputWrap>
                  </InputStack>
                </ChatArea>
              </>
            ) : error ? (
              <ErrorMessage>
                <FiX size={40} />
                <h3>{error}</h3>
                <p>Please try again or go back to dashboard</p>
                <div className="chat-error-actions">
                  <button onClick={fetchChatDetails}>Retry</button>
                  <button className="secondary" onClick={() => navigate("/user/chat-history")}>
                    Chat History
                  </button>
                </div>
              </ErrorMessage>
            ) : (
              <NoChatSelected>
                <FiClock size={48} />
                <h3>No Chat Selected</h3>
                <p>Select a conversation from the sidebar to start messaging</p>
              </NoChatSelected>
            )}
          </RightPanel>
        </ChatLayout>

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
    </>
  );
};

export default Chat;