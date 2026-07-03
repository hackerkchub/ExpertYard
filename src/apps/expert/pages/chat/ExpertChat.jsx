import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
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
} from "./ExpertChat.styles";

import { FiSend, FiUserX, FiClock, FiMail, FiPhone, FiPaperclip, FiX, FiCheck } from "react-icons/fi";
import { socket } from "../../../../shared/api/socket";
import { useExpert } from "../../../../shared/context/ExpertContext";
import { getUserPublicProfileApi } from "../../../../shared/api/userApi";
import { hotToast } from "../../../../shared/utils/lazyNotifications";
import { APP_CONFIG } from "../../../../config/appConfig";
import { getChatRoomCandidates, getChatRoomId, waitForChatDetailsRetry } from "../../../../shared/utils/chatRoom";
import { saveActiveChatSession, clearActiveChatSession } from "../../../../shared/utils/chatSession";

/* ------------------ HELPERS ------------------ */
const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const ExpertChat = () => {
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
  
  // IMAGE UPLOAD STATES
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const peerTypingTimeoutRef = useRef(null);
  const inputWrapRef = useRef(null);

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

  /* ------------------ EXPERT ID ------------------ */
  const expertId = useMemo(() => {
    return expert?.id || expert?.expert_id || chatData?.expert_id || null;
  }, [expert, chatData]);

  const roomCandidates = useMemo(
    () => getChatRoomCandidates(location.state?.roomCandidates || [], location.state || {}, room_id),
    [location.state, room_id]
  );

  /* ------------------ FETCH USER ------------------ */
  const fetchUserProfile = async (userId) => {
    try {
      const res = await getUserPublicProfileApi(userId);
      if (res?.success) setUserProfile(res.data);
    } catch (e) {}
  };

  /* ------------------ FETCH CHAT ------------------ */
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
          res = await fetch(
            `${APP_CONFIG.API_BASE_URL}/chat/details/${candidateRoomId}`,
            {
              headers: token
                ? {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  }
                : undefined,
              cache: "no-cache",
            }
          );

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
          time: new Date(m.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
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

  /* ------------------ IMAGE UPLOAD ------------------ */
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

  /* ------------------ IMAGE SELECT ------------------ */
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
      body: JSON.stringify({
        viewer_id: expertId,
        viewer_type: "expert",
      }),
    }).catch(() => {});
  }, [room_id, expertId]);

  const emitTyping = useCallback((value) => {
    if (!room_id || !socket.connected) return;
    socket.emit(value ? "typing:start" : "typing:stop", { room_id });
  }, [room_id]);

  const handleMessageChange = useCallback((e) => {
    setMessage(e.target.value);

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

  /* ------------------ SEND MESSAGE ------------------ */
  const handleSendMessage = async () => {
    if (!room_id || !sessionActive) return;
    if (uploading) return;

    if (!selectedImage && message.trim()) {
      const tempId = Date.now();
      
      setMessages(prev => [
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
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isTemp: true
        }
      ]);
      
      socket.emit("sendMessage", {
        room_id,
        client_id: tempId,
        message: message.trim(),
        type: "text"
      });

      emitTyping(false);
      setMessage("");
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }

    if (selectedImage) {
      try {
        setUploading(true);
        
        const tempId = Date.now();
        const tempImageUrl = URL.createObjectURL(selectedImage);
        
        setMessages(prev => [
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
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isTemp: true
          }
        ]);
        
        scrollToBottom();
        
        const imageUrl = await uploadImage(selectedImage);
        
        setMessages(prev => prev.map(msg => 
          msg.client_id === tempId 
            ? { ...msg, image_url: imageUrl, isTemp: false }
            : msg
        ));
        
        socket.emit("sendMessage", {
          room_id,
          client_id: tempId,
          message: message.trim() || "",
          type: "image",
          imageUrl
        });
        setSelectedImage(null);
        emitTyping(false);
        setMessage("");
        
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
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !uploading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /* ------------------ SOCKET ------------------ */
  useEffect(() => {
    if (!room_id || !expertId) return;

    const joinChatRoom = () => {
      socket.emit("register", {
        userId: Number(expertId),
        role: "expert",
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
      const incomingRoomId = msgData.room_id || msgData.roomId || msgData.chat_room_id || msgData.chatRoomId;
      
      if (String(incomingRoomId) !== String(room_id)) {
        return;
      }
      
      setMessages((prev) => {
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
          message: msgData.message,
          message_type: msgData.message_type || "text",
          image_url: msgData.image_url || null,
          is_seen: Number(msgData.is_seen) === 1 || msgData.is_seen === true,
          seen_at: msgData.seen_at || null,
          sender_type: msgData.sender_type,
          time: new Date(
            msgData.time || msgData.created_at || Date.now()
          ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }];
      });
      
      scrollToBottom();

      if (msgData.sender_type === "user") {
        markMessagesSeen();
      }
    };

    socket.on("message", handleNewMessage);
    socket.on("message_sent", handleNewMessage);

    const handlePeerTypingStart = (data = {}) => {
      if (String(data.room_id) !== String(room_id) || data.sender_type !== "user") return;

      setPeerTyping(true);
      if (peerTypingTimeoutRef.current) {
        clearTimeout(peerTypingTimeoutRef.current);
      }
      peerTypingTimeoutRef.current = setTimeout(() => {
        setPeerTyping(false);
      }, 1600);
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
      setMessages((prev) => prev.map((msg) => (
        seenIds.has(Number(msg.id))
          ? { ...msg, is_seen: true, seen_at: data.seen_at || msg.seen_at }
          : msg
      )));
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
        timestamp: Date.now()
      });
    } else if (sessionActive === false) {
      clearActiveChatSession();
    }
  }, [chatData, sessionActive, room_id, userProfile]);

  const user = useMemo(() => {
    if (!chatData) return null;
    return {
      name: userProfile?.full_name || `User `,
      email: userProfile?.email,
      phone: userProfile?.phone,
      avatar: userProfile?.avatar,
    };
  }, [chatData, userProfile]);

  if (loading) {
    return (
      <PageWrap>
        <LoadingSpinner>Loading...</LoadingSpinner>
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <Toaster position="top-center" />
      <ChatLayout>
        <RightPanel>
          {chatData && user ? (
            <>
              <UserHeader>
                <UserInfo>
                  {user.avatar ? (
                    <Avatar src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarPlaceholder>
                      {getInitials(user.name)}
                    </AvatarPlaceholder>
                  )}

                  <UserMeta>
                    <h4>{user.name}</h4>
                    <div className="user-details">
                      {user.email && (
                        <span className="detail-item">
                          <FiMail size={11} /> {user.email}
                        </span>
                      )}
                      {user.phone && (
                        <span className="detail-item">
                          <FiPhone size={11} /> {user.phone}
                        </span>
                      )}
                    </div>
                  </UserMeta>
                </UserInfo>
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
                      const isExpert = msg.sender_type === "expert" || msg.sender_type === "ai";
                      
                      return (
                        <Message key={msg.id} $expert={isExpert}>
                          <Bubble $expert={isExpert} $hasText={!!msg.message}>
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
                              {!msg.isTemp && isExpert && (
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
                        src={URL.createObjectURL(selectedImage)}
                        alt="preview"
                      />
                      <span>{selectedImage.name}</span>
                      <button 
                        onClick={() => setSelectedImage(null)}
                        aria-label="Remove image"
                      >
                        <FiX size={18} />
                      </button>
                    </ImagePreview>
                  )}

                  {peerTyping && (
                    <TypingIndicator />
                  )}

                  <ChatInputWrap ref={inputWrapRef}>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      ref={fileInputRef}
                      onChange={handleImageSelect}
                    />

                    <ChatInput
                      ref={inputRef}
                      value={message}
                      onFocus={scrollToBottom}
                      onChange={handleMessageChange}
                      onBlur={() => emitTyping(false)}
                      onKeyDown={handleKeyPress}
                      placeholder={
                        sessionActive 
                          ? (uploading ? "Uploading image..." : "Type a message...") 
                          : "Chat ended"
                      }
                      disabled={!sessionActive || uploading}
                      rows={1}
                    />

                    <AttachButton
                      onClick={() => fileInputRef.current?.click()}
                      disabled={!sessionActive || uploading}
                      aria-label="Attach image"
                    >
                      <FiPaperclip size={18} />
                    </AttachButton>

                    <SendButton
                      onClick={handleSendMessage}
                      disabled={(uploading || (!message.trim() && !selectedImage)) || !sessionActive}
                      $hasUnread={false}
                    >
                      {uploading ? (
                        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>...</span>
                      ) : (
                        <FiSend />
                      )}
                    </SendButton>
                  </ChatInputWrap>
                </InputStack>
              </ChatArea>
            </>
          ) : error ? (
            <ErrorMessage>
              <FiUserX size={40} />
              <h3>{error}</h3>
              <p>Please try again or go back to dashboard</p>
              <button onClick={() => navigate("/expert/dashboard")}>
                Go to Dashboard
              </button>
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
    </PageWrap>
  );
};

export default ExpertChat;