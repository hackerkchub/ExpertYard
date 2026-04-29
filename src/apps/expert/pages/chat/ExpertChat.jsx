import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  NoChatSelected,
  LoadingSpinner,
  ErrorMessage,
  EmptyChatMessage,
} from "./ExpertChat.styles";

import { FiSend, FiUserX, FiClock, FiMail, FiPhone, FiPaperclip, FiX } from "react-icons/fi";
import { socket } from "../../../../shared/api/socket";
import { useExpert } from "../../../../shared/context/ExpertContext";
import { getUserPublicProfileApi } from "../../../../shared/api/userApi";
import { hotToast } from "../../../../shared/utils/lazyNotifications";

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
  const { expert } = useExpert();

  const [chatData, setChatData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  
  // IMAGE UPLOAD STATES
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  /* ------------------ HIDE GLOBAL HEADER ------------------ */
  useEffect(() => {
    const topbar = document.querySelector(".main-app-topbar");
    const sidebar =
      document.querySelector("aside") ||
      document.querySelector("[class*='Sidebar']");

    if (topbar) topbar.style.display = "none";
    if (sidebar) sidebar.style.display = "none";

    document.body.style.overflow = "hidden";

    return () => {
      if (topbar) topbar.style.display = "flex";
      if (sidebar) sidebar.style.display = "flex";

      document.body.style.overflow = "auto";
    };
  }, []);

  /* ------------------ EXPERT ID ------------------ */
  const expertId = useMemo(() => {
    return expert?.id || expert?.expert_id || chatData?.expert_id || null;
  }, [expert, chatData]);

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

      const res = await fetch(
        `https://softmaxs.com/api/chat/details/${room_id}`
      );
      const data = await res.json();

      const { session, messages: fetchedMessages } = data.data;

      setChatData(session);
      setSessionActive(!!session.is_active);

      setMessages(
        (fetchedMessages || []).map((m) => ({
          id: m.id,
          message: m.message,
          message_type: m.message_type || "text",
          image_url: m.image_url || null,
          sender_type: m.sender_type,
          time: new Date(m.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }))
      );

      if (session.user_id) fetchUserProfile(session.user_id);
    } catch {
      setError("Failed to load chat");
    } finally {
      setLoading(false);
    }
  }, [room_id]);

  /* ------------------ IMAGE UPLOAD ------------------ */
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("https://softmaxs.com/api/chat/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
   return `https://softmaxs.com${data.imageUrl}`;
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

  /* ------------------ SEND MESSAGE (with immediate UI update) ------------------ */
  const handleSendMessage = async () => {
    if (!room_id || !sessionActive) return;
    if (uploading) return;

    // TEXT MESSAGE ONLY
    if (!selectedImage && message.trim()) {
      const tempId = Date.now();
      const messageData = {
        id: tempId,
        sender_type: "expert",
        message: message.trim(),
        message_type: "text",
        image_url: null,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isTemp: true
      };
      
      // Add to UI immediately
      setMessages(prev => [...prev, messageData]);
      
      // Send to socket
      socket.emit("sendMessage", { 
        room_id, 
        message: message.trim(),
        type: "text",
        message_type: "text"
      });
      
      setMessage("");
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 100);
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }

    // IMAGE MESSAGE WITH CAPTION
    if (selectedImage) {
      try {
        setUploading(true);
        
        const tempId = Date.now();
        const tempImageUrl = URL.createObjectURL(selectedImage);
        const messageData = {
          id: tempId,
          sender_type: "expert",
          message: message.trim() || "",
          message_type: "image",
          image_url: tempImageUrl,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isTemp: true
        };
        
        // Add to UI immediately with preview
        setMessages(prev => [...prev, messageData]);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }), 100);
        
        // Upload image
        const imageUrl = await uploadImage(selectedImage);
        
        // Update the temporary message with real URL
        setMessages(prev => prev.map(msg => 
          msg.id === tempId 
            ? { ...msg, image_url: imageUrl, isTemp: false }
            : msg
        ));
        
        // Send to socket
        socket.emit("sendMessage", {
          room_id,
          message: message.trim() || "",
          type: "image",
          message_type: "image",
          imageUrl: imageUrl
        });

        setSelectedImage(null);
        setMessage("");
        
      } catch (err) {
        console.error("Upload failed:", err);
        hotToast("error", "Failed to upload image");
        // Remove the temporary message on error
        setMessages(prev => prev.filter(msg => !msg.isTemp));
      } finally {
        setUploading(false);
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
    if (!room_id) return;

    socket.emit("join_room", { room_id });

    const handleNewMessage = (msg) => {
      if (msg.room_id !== room_id) return;
      
      setMessages((prev) => {
        // Check if message already exists (by id)
        const exists = prev.some(m => m.id === msg.id);
        
        if (exists) {
          // Update existing temporary message
          return prev.map(m => 
            m.id === msg.id 
              ? { 
                  ...m, 
                  message_type: msg.message_type || "text",
                  image_url: msg.image_url || m.image_url,
                  isTemp: false 
                }
              : m
          );
        }
        
        // Add new message
        return [...prev, {
          id: msg.id,
          message: msg.message,
          message_type: msg.message_type || "text",
          image_url: msg.image_url || null,
          sender_type: msg.sender_type,
          time: new Date(msg.time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }];
      });
      
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    };

    socket.on("message", handleNewMessage);

    socket.on("chat_ended", () => {
      setSessionActive(false);
      hotToast("success", "Chat Ended");
      navigate("/expert/chat-history");
    });

    return () => {
      socket.emit("leave_room", { room_id });
      socket.off("message", handleNewMessage);
      socket.off("chat_ended");
    };
  }, [room_id, navigate]);

  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  /* ------------------ SCROLL FIX ------------------ */
  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "auto",
        block: "end",
      });
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* ------------------ KEYBOARD FIX ------------------ */
  useEffect(() => {
    const handleResize = () => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    };

    window.visualViewport?.addEventListener("resize", handleResize);

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, []);

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
      <ChatLayout>
        <RightPanel>
          {chatData && user ? (
            <>
              <UserHeader>
                <UserInfo>
                  {user.avatar ? (
                    <Avatar src={user.avatar} />
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
                          <FiMail size={12} /> {user.email}
                        </span>
                      )}
                      {user.phone && (
                        <span className="detail-item">
                          <FiPhone size={12} /> {user.phone}
                        </span>
                      )}
                    </div>
                  </UserMeta>
                </UserInfo>
              </UserHeader>

              <ChatArea>
                <Messages style={{ WebkitOverflowScrolling: "touch" }}>
                  {messages.length === 0 ? (
                    <EmptyChatMessage>
                      💬 Start conversation
                    </EmptyChatMessage>
                  ) : (
                    messages.map((msg) => (
                      <Message
                        key={msg.id}
                        $expert={msg.sender_type === "expert"}
                      >
                        <Bubble $expert={msg.sender_type === "expert"}>
                          {/* IMAGE MESSAGE UI */}
                          {msg.message_type === "image" && msg.image_url && (
                            <img
                              src={msg.image_url}
                              alt="chat-img"
                              style={{
                                maxWidth: "200px",
                                maxHeight: "200px",
                                borderRadius: "10px",
                                marginBottom: msg.message ? "6px" : "0",
                                objectFit: "cover"
                              }}
                              onError={(e) => {
                                if (msg.isTemp) {
                                  e.target.style.opacity = "0.5";
                                } else {
                                  e.target.style.display = "none";
                                }
                              }}
                            />
                          )}
                          
                          {/* TEXT/CAPTION MESSAGE */}
                          {msg.message && (
                            <div>{msg.message}</div>
                          )}
                          
                          <span className="time">
                            {msg.time}
                            {msg.isTemp && " (sending...)"}
                          </span>
                        </Bubble>
                      </Message>
                    ))
                  )}

                  <div ref={messagesEndRef} />
                </Messages>

                {/* IMAGE PREVIEW BEFORE SEND */}
                {selectedImage && (
                  <div style={{ 
                    padding: "10px", 
                    backgroundColor: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    margin: "0 10px",
                    borderRadius: "12px"
                  }}>
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="preview"
                      style={{ 
                        width: "50px", 
                        height: "50px", 
                        borderRadius: "8px",
                        objectFit: "cover"
                      }}
                    />
                    <span style={{ fontSize: "12px", color: "#64748b", flex: 1 }}>
                      {selectedImage.name}
                    </span>
                    <button 
                      onClick={() => setSelectedImage(null)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: "5px"
                      }}
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                )}

                <ChatInputWrap>
                  {/* HIDDEN FILE INPUT */}
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
                    onFocus={() => scrollToBottom()}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={
                      sessionActive 
                        ? (uploading ? "Uploading image..." : "Type message...") 
                        : "Chat ended"
                    }
                    disabled={!sessionActive || uploading}
                  />

                  {/* ATTACH BUTTON */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!sessionActive || uploading}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: !sessionActive || uploading ? "not-allowed" : "pointer",
                      padding: "0 8px",
                      color: "#64748b",
                      opacity: !sessionActive || uploading ? 0.5 : 1
                    }}
                  >
                    <FiPaperclip size={20} />
                  </button>

                  <SendButton
                    onClick={handleSendMessage}
                    disabled={(uploading || (!message.trim() && !selectedImage)) || !sessionActive}
                  >
                    {uploading ? "..." : <FiSend />}
                  </SendButton>
                </ChatInputWrap>
              </ChatArea>
            </>
          ) : error ? (
            <ErrorMessage>
              <FiUserX size={40} />
              <h3>{error}</h3>
              <button onClick={() => navigate("/expert/dashboard")}>
                Back
              </button>
            </ErrorMessage>
          ) : (
            <NoChatSelected>
              <FiClock size={40} />
              <h3>No Chat Selected</h3>
            </NoChatSelected>
          )}
        </RightPanel>
      </ChatLayout>
    </PageWrap>
  );
};

export default ExpertChat;