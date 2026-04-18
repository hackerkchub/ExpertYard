// src/apps/user/pages/chat/Chat.jsx - UPGRADED VERSION
import React, { useState, useEffect, useRef, useCallback, useLayoutEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiPaperclip, FiImage, FiVideo, FiFile, FiX, FiArrowLeft, FiClock, FiUser } from "react-icons/fi";
import { IoMdSend } from "react-icons/io";
import {
  PageWrap,
  Header,
  ExpertInfo,
  Avatar,
  AvatarPlaceholder,
  AvatarWrapper,
  CallButton,
  StatusDot,
  MessagesArea,
  MessageRow,
  MessageBubble,
  InputBar,
  InputBox,
  SendButton,
  MessageTime,
  TypingIndicator,
  FileUploadMenu,
  UploadButton,
  ChatGlobalStyle,
  LoadingSpinner,
  ErrorMessage,
  NoMessages,
  EndChatButton,
  EmptyChatMessage,
  MobileBackButton,
  TimerDisplay,
  UnlimitedBadge,
  HeaderActions,
} from "./Chat.styles";

import { socket } from "../../../../shared/api/socket";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { usePublicExpert as useExpert } from "../../context/PublicExpertContext";
import { useWallet } from "../../../../shared/context/WalletContext";
import useChatTimer from "../../../../shared/hooks/useChatTimer";

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
  const [input, setInput] = useState("");
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatData, setChatData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sessionActive, setSessionActive] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [endTime, setEndTime] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  
  const scrollRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  
  const { user } = useAuth();
  const { experts, expertData, expertPrice } = useExpert();
  const { balance: walletBalance } = useWallet();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Detect if subscription is unlimited
  const isUnlimited = useMemo(() => !endTime, [endTime]);

  // Fetch chat details
  const fetchChatDetails = useCallback(async () => {
    if (!room_id) return;
    
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem('user_token');
      
      const response = await fetch(`https://softmaxs.com/api/chat/details/${room_id}`, {
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
        time: new Date(msg.created_at).toLocaleTimeString('en-US', { 
          hour: '2-digit', minute: '2-digit', hour12: true 
        })
      })));
      
      setSessionActive(Number(session.is_active) === 1);

      if (session?.end_time) {
        setEndTime(session.end_time);
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
  }, [room_id]);

  // Auto end chat
  const handleAutoEndChat = useCallback(() => {
    if (isUnlimited) {
      console.log("♾️ Unlimited subscription - no auto-end");
      return;
    }
    
    console.log("⏰ Timer expired - Auto ending chat");
    setSessionActive(false);

    socket.emit("end_chat", {
      room_id,
      reason: "time_up"
    });

    navigate("/user/chat-history", {
      replace: true,
      state: {
        from: "chat",
        expertId: chatData?.expert_id
      }
    });
  }, [room_id, navigate, isUnlimited, chatData?.expert_id]);

  // Manual end chat
  const handleEndChat = useCallback(() => {
    if (!room_id) return;

    const ok = window.confirm("Are you sure you want to end this chat?");

    if (!ok) return;

    socket.emit("end_chat", {
      room_id,
      reason: "user_ended"
    });

    setSessionActive(false);
    navigate("/user/chat-history", {
      replace: true,
      state: {
        from: "chat",
        expertId: chatData?.expert_id
      }
    });
  }, [room_id, navigate, chatData?.expert_id]);

  // Handle back button
  const handleBack = () => {
    if (sessionActive) {
      const ok = window.confirm("Are you sure you want to leave and end this chat?");
      if (ok) {
        socket.emit("end_chat", { room_id, reason: "user_left" });
        navigate("/user/chat-history", {
          replace: true,
          state: {
            from: "chat",
            expertId: chatData?.expert_id
          }
        });
      }
    } else {
      navigate("/user/chat-history", {
        replace: true,
        state: {
          from: "chat",
          expertId: chatData?.expert_id
        }
      });
    }
  };

  // Popstate handler
  useEffect(() => {
    if (!sessionActive) return;

    const handlePopState = () => {
      const ok = window.confirm("Are you sure you want to leave and end this chat?");
      
      if (ok) {
        socket.emit("end_chat", { room_id, reason: "user_left" });
        navigate("/user/chat-history", {
          replace: true,
          state: {
            from: "chat",
            expertId: chatData?.expert_id
          }
        });
      } else {
        window.history.go(1);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [sessionActive, room_id, navigate, chatData?.expert_id]);

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

  // Handle go home
  const handleGoHome = () => {
    setShowEndPopup(false);
    socket.emit("end_chat", { room_id, reason: "user_ended" });
    navigate("/user");
  };

  // Improved keyboard handling
  useEffect(() => {
    if (!isMobile) return;

    let viewportHeight = window.visualViewport?.height || window.innerHeight;
    let originalHeight = window.innerHeight;

    const handleResize = () => {
      const currentHeight = window.visualViewport?.height || window.innerHeight;
      const keyboardOpen = currentHeight < originalHeight - 100;
      
      setIsKeyboardOpen(keyboardOpen);
      
      if (keyboardOpen && messagesContainerRef.current) {
        setTimeout(() => {
          scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, [isMobile]);

  // Socket events
  useEffect(() => {
    if (!room_id || !socket) return;

    if (!socket.connected) {
      socket.connect();
    }

    console.log(`🔌 User joining room: ${room_id}`);
    socket.emit("join_room", { 
      room_id,
      user_id: user?.id 
    });

    const handleNewMessage = (msgData) => {
      if (msgData.room_id !== room_id) return;

      setMessages(prev => {
        if (
          prev.some(
            m =>
              m.id === msgData.id ||
              (msgData.client_id && m.client_id === msgData.client_id)
          )
        ) {
          return prev;
        }

        return [...prev, {
          id: msgData.id,
          client_id: msgData.client_id,
          sender_type: msgData.sender_type,
          sender_id: msgData.sender_id,
          message: msgData.message,
          time: new Date(msgData.time).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }];
      });
      
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
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

    const handleChatEnded = ({ room_id: endedRoomId }) => {
      if (endedRoomId === room_id) {
        setSessionActive(false);
        setShowEndPopup(true);
      }
    };

    socket.on("message", handleNewMessage);
    socket.on("chat_accepted", handleChatAccepted);
    socket.on("chat_updated", handleChatUpdate);
    socket.on("chat_ended", handleChatEnded);

    return () => {
      socket.off("message", handleNewMessage);
      socket.off("chat_accepted", handleChatAccepted);
      socket.off("chat_updated", handleChatUpdate);
      socket.off("chat_ended", handleChatEnded);
      
      if (socket.connected) {
        socket.emit("leave_room", { room_id });
      }
    };
  }, [room_id, user?.id, fetchChatDetails]);

  // Expert info
  const expertInfo = useMemo(() => {
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
  }, [chatData?.expert_id, experts, expertData]);

  // Scroll to bottom
  useLayoutEffect(() => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages.length]);

  // Initial fetch
  useEffect(() => {
    fetchChatDetails();
  }, [fetchChatDetails]);

  // Send message
  const sendMessage = useCallback(() => {
    if (!input.trim() || !room_id || !sessionActive) return;

    const tempId = Date.now();

    setMessages(prev => [
      ...prev,
      {
        id: tempId,
        sender_type: "user",
        sender_id: user.id,
        message: input.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);

    socket.emit("sendMessage", {
      room_id,
      message: input.trim(),
    });

    setInput("");
    
    // Keep focus on mobile
    if (isMobile && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 0);
    }
  }, [input, room_id, user?.id, sessionActive, isMobile]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  const isChatDisabled = sessionActive === false;

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
      <ChatGlobalStyle />
      <PageWrap>
        <Header>
          {isMobile && (
            <MobileBackButton onClick={handleBack}>
              <FiArrowLeft size={24} />
            </MobileBackButton>
          )}
          
          {chatData && expertInfo ? (
            <>
              <ExpertInfo>
                <AvatarWrapper>
                  {expertInfo.avatar ? (
                    <Avatar src={expertInfo.avatar} alt={expertInfo.name} />
                  ) : (
                    <AvatarPlaceholder>
                      {getInitials(expertInfo.name)}
                    </AvatarPlaceholder>
                  )}
                  {/* <StatusDot $active={sessionActive === true} /> */}
                </AvatarWrapper>
                <div className="expert-details">
                  <div className="expert-name">
                    {expertInfo.name}
                    {expertInfo.position && (
                      <span className="expert-position"> • {expertInfo.position}</span>
                    )}
                  </div>
                  <div className="status">
                    {sessionActive === true ? '🟢 Active' : '🔴 Ended'}
                  </div>
                </div>
              </ExpertInfo>
              
              <HeaderActions>
                {/* Timer for limited plans */}
                {!isUnlimited && sessionActive === true && (
                  <TimerDisplay $color={getTimerColor()}>
                    <FiClock size={14} />
                    <span>{formatted}</span>
                  </TimerDisplay>
                )}

                {/* Unlimited badge */}
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
            </>
          ) : (
            <div style={{ color: "#64748b", padding: "20px" }}>Loading expert info...</div>
          )}
        </Header>

        <MessagesArea ref={messagesContainerRef}>
          {error && !showEndPopup ? (
            <ErrorMessage>
              <FiX size={48} />
              <h3>{error}</h3>
              <button onClick={() => navigate("/user/dashboard")}>Back to Dashboard</button>
            </ErrorMessage>
          ) : messages.length === 0 ? (
            <EmptyChatMessage>
              💬 Chat connected! Start typing to chat with {expertInfo?.name || 'expert'}.
            </EmptyChatMessage>
          ) : (
            messages.map((msg, index) => (
              <MessageRow key={msg.id || index} $senderType={msg.sender_type}>
                <MessageBubble $senderType={msg.sender_type}>
                  <div className="message-text">{msg.message}</div>
                  <MessageTime>{msg.time}</MessageTime>
                </MessageBubble>
              </MessageRow>
            ))
          )}
          <div ref={scrollRef} />
        </MessagesArea>

        <InputBar $isKeyboardOpen={isKeyboardOpen}>
          <UploadButton 
            onClick={() => setShowFileMenu(!showFileMenu)} 
            disabled={isChatDisabled}
          >
            <FiPaperclip size={20} />
          </UploadButton>

          {showFileMenu && (
            <FileUploadMenu>
              <div className="menu-item" onClick={() => {
                console.log('📎 Uploading image');
                setShowFileMenu(false);
              }}>
                <FiImage size={18} /><span>Photos</span>
              </div>
              <div className="menu-item" onClick={() => {
                console.log('📎 Uploading video');
                setShowFileMenu(false);
              }}>
                <FiVideo size={18} /><span>Videos</span>
              </div>
              <div className="menu-item" onClick={() => {
                console.log('📎 Uploading file');
                setShowFileMenu(false);
              }}>
                <FiFile size={18} /><span>Documents</span>
              </div>
            </FileUploadMenu>
          )}

          <InputBox
            ref={inputRef}
            placeholder={isChatDisabled ? "Chat session ended" : "Type your message..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isChatDisabled}
            maxLength={1000}
          />

          <SendButton 
            onClick={sendMessage} 
            disabled={!input.trim() || isChatDisabled}
          >
            <IoMdSend size={20} />
          </SendButton>
        </InputBar>

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