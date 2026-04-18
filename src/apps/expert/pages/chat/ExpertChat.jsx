// ExpertChat.jsx
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
  TimerDisplay,
  BackButton,
  MobileBackButton,
} from "./ExpertChat.styles";
import { FiSend, FiUserX, FiClock, FiArrowLeft, FiUser, FiPhone, FiMail } from "react-icons/fi";
import { socket } from "../../../../shared/api/socket";
import { useExpert } from "../../../../shared/context/ExpertContext";
import { getUserPublicProfileApi } from "../../../../shared/api/userApi";
import { toast } from "react-hot-toast";

const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=1";

// Helper function to get initials from name
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

  const [userProfile, setUserProfile] = useState(null);
  const [userProfileLoading, setUserProfileLoading] = useState(false);

  const [chatData, setChatData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  const [sessionActive, setSessionActive] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [displaySeconds, setDisplaySeconds] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [timerPaused, setTimerPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const messagesEndRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const pageWrapRef = useRef(null);

  const { expert } = useExpert();

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const expertId = useMemo(() => {
    return (
      expert?.id ||
      expert?.expert_id ||
      chatData?.expert_id ||
      null
    );
  }, [expert, chatData]);

  const getCurrentExpertId = useCallback(() => {
    if (expert?.id || expert?.expert_id) return expert.id || expert.expert_id;

    try {
      const raw = localStorage.getItem("expert_data");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.id || data.expert_id) return data.id || data.expert_id;
      }
    } catch {
      // ignore
    }
    return null;
  }, [expert]);

  const fetchUserProfile = useCallback(async (userId) => {
    if (!userId) return;
    try {
      setUserProfileLoading(true);
      const res = await getUserPublicProfileApi(userId);
      if (res?.success) {
        setUserProfile(res.data);
      }
    } catch (err) {
      console.error("User profile fetch failed", err);
    } finally {
      setUserProfileLoading(false);
    }
  }, []);

  const resetSession = () => {
    setChatData(null);
    setMessages([]);
    setSessionActive(false);
    setSessionSeconds(0);
    setDisplaySeconds(0);
    setSessionStartTime(null);
    setTimerPaused(true);

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  /* ==========================================================
      HIDE SIDEBAR & TOPBAR FOR CHAT (Cleanup on Leave)
     ========================================================== */
  useEffect(() => {
    const topbar = document.querySelector(".main-app-topbar");
    const sidebar = document.querySelector("aside") || document.querySelector("[class*='SidebarWrap']");

    if (topbar) topbar.style.display = "none";
    if (sidebar) sidebar.style.display = "none";

    // Add class to body for mobile optimizations
    document.body.classList.add("chat-active");

    return () => {
      if (topbar) topbar.style.display = "flex";
      if (sidebar) sidebar.style.display = "flex";
      document.body.classList.remove("chat-active");
    };
  }, []);

  /* ==========================================================
      IMPROVED MOBILE KEYBOARD HANDLING - NO PAGE JUMP
     ========================================================== */
  useEffect(() => {
    let initialScrollTop = 0;
    let isKeyboardVisible = false;

    const handleFocus = (e) => {
      if (window.innerWidth <= 768 && e.target === inputRef.current) {
        initialScrollTop = window.scrollY;
        
        // Store current scroll position of messages
        if (messagesContainerRef.current) {
          initialScrollTop = messagesContainerRef.current.scrollTop;
        }

        setTimeout(() => {
          if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        }, 150);
      }
    };

    const handleBlur = () => {
      if (window.innerWidth <= 768) {
        // Restore scroll position
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 100);
      }
    };

    const handleResize = () => {
      if (window.innerWidth <= 768 && window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        
        // Keyboard is open when viewport height is significantly smaller
        const keyboardOpen = viewportHeight < windowHeight - 100;
        
        if (keyboardOpen && !isKeyboardVisible) {
          isKeyboardVisible = true;
          // Smooth scroll to bottom when keyboard opens
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }, 100);
        } else if (!keyboardOpen && isKeyboardVisible) {
          isKeyboardVisible = false;
          // Restore when keyboard closes
          setTimeout(() => {
            window.scrollTo(0, 0);
          }, 100);
        }
      }
    };

    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener('focus', handleFocus);
      inputElement.addEventListener('blur', handleBlur);
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('focus', handleFocus);
        inputElement.removeEventListener('blur', handleBlur);
      }
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  /* ==========================================================
      PREVENT KEYBOARD CLOSE AFTER SEND
     ========================================================== */
  const handleSendMessage = useCallback(() => {
    if (!message.trim() || !room_id || !expertId) return;

    const messageText = message.trim();
    
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender_type: "expert",
        sender_id: expertId,
        message: messageText,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    socket.emit("sendMessage", {
      room_id,
      message: messageText,
    });

    setMessage("");
    
    // Keep focus on input and prevent keyboard from closing
    setTimeout(() => {
      if (inputRef.current && sessionActive) {
        inputRef.current.focus();
        // Ensure smooth scroll after sending
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 0);
  }, [message, room_id, expertId, sessionActive]);

  /* ==========================================================
      HANDLE KEY PRESS - PREVENT DEFAULT ENTER BEHAVIOR
     ========================================================== */
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (message.trim() && sessionActive) {
          handleSendMessage();
        }
      }
    },
    [handleSendMessage, message, sessionActive]
  );

  /* ==========================================================
      BACK BUTTON BLOCK LOGIC
     ========================================================== */
  useEffect(() => {
    if (sessionActive) {
      window.history.pushState(null, null, window.location.pathname);

      const handlePopState = () => {
        window.history.pushState(null, null, window.location.pathname);
        toast.error("Finish chat session to leave!", { id: "back-block" });
      };

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [sessionActive]);

  const fetchChatDetails = useCallback(async () => {
    if (!room_id) {
      resetSession();
      setError("");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`https://softmaxs.com/api/chat/details/${room_id}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || "Unknown error"}`);
      }

      const result = await response.json();
      if (!result.success || !result.data) {
        throw new Error(result.message || "Failed to fetch chat details");
      }

      const { session, messages: fetchedMessages } = result.data;
      if (!session) throw new Error("No session data found");

      setChatData(session);

      const isActive = !!session.is_active;
      setSessionActive(isActive);

      setMessages((fetchedMessages || []).map((msg) => ({
        id: msg.id || Date.now() + Math.random(),
        sender_type: msg.sender_type,
        sender_id: msg.sender_id,
        message: msg.message,
        time: new Date(msg.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })));

      if (isActive && session.start_time) {
        const startTime = new Date(session.start_time).getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);

        setSessionSeconds(elapsed);
        setDisplaySeconds(elapsed);
        setSessionStartTime(startTime);
        setTimerPaused(false);
      } else {
        setTimerPaused(true);
      }

      if (session.user_id) fetchUserProfile(session.user_id);
    } catch (err) {
      console.error("❌ Chat fetch error:", err);
      setError(err.message || "Failed to load chat");
      resetSession();
    } finally {
      setLoading(false);
    }
  }, [room_id, fetchUserProfile]);

  useEffect(() => {
    if (!sessionActive || !sessionStartTime || timerPaused) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - sessionStartTime) / 1000);
      setSessionSeconds(elapsed);
      setDisplaySeconds(elapsed);
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [sessionActive, sessionStartTime, timerPaused]);

  useEffect(() => {
    if (!room_id || !socket) return;

    const roomId = room_id;
    socket.emit("join_room", { room_id });

    const handleNewMessage = (msgData) => {
      if (msgData.room_id === roomId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msgData.id)) return prev;
          return [
            ...prev,
            {
              id: msgData.id || Date.now() + Math.random(),
              sender_type: msgData.sender_type,
              sender_id: msgData.sender_id,
              message: msgData.message,
              time: new Date(msgData.time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          ];
        });
        
        // Auto-scroll to bottom on new message
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        }, 100);
      }
    };

    const handleChatEnded = ({ room_id: endedRoomId }) => {
      if (endedRoomId === roomId) {
        setSessionActive(false);
        setTimerPaused(true);
        setChatData((prev) => (prev ? { ...prev, is_active: 0 } : prev));
        toast.success("Chat ended! Redirecting...");
        setTimeout(() => {
          navigate("/expert/chat-history");
        }, 1500);
      }
    };

    socket.on("message", handleNewMessage);
    socket.on("chat_ended", handleChatEnded);

    return () => {
      socket.off("message", handleNewMessage);
      socket.off("chat_ended", handleChatEnded);
      socket.emit("leave_room", { room_id });
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [room_id, navigate]);

  // Scroll to bottom on messages change
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 80);
  }, [messages]);

  // Initial fetch
  useEffect(() => {
    const init = async () => {
      await fetchChatDetails();
      setIsInitialized(true);
    };
    init();
  }, [fetchChatDetails]);

  const selectedUser = useMemo(() => {
    if (!chatData) return null;

    if (userProfile) {
      return {
        id: userProfile.id,
        name: userProfile.full_name || `User #${chatData.user_id}`,
        email: userProfile.email,
        phone: userProfile.phone,
        avatar: userProfile.avatar || null,
      };
    }

    return {
      id: chatData.user_id,
      name: `User #${chatData.user_id}`,
      email: null,
      phone: null,
      avatar: null,
    };
  }, [chatData, userProfile]);

  // Format timer display
  const formatTimer = () => {
    const hours = Math.floor(displaySeconds / 3600);
    const mins = Math.floor((displaySeconds % 3600) / 60);
    const secs = displaySeconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBack = () => {
    navigate("/expert/chat-history");
  };

  if (loading && !isInitialized) {
    return (
      <PageWrap ref={pageWrapRef} className="page-wrap">
        <LoadingSpinner>Loading chat...</LoadingSpinner>
      </PageWrap>
    );
  }

  return (
    <PageWrap ref={pageWrapRef} className="page-wrap">
      <ChatLayout>
        <RightPanel style={{ width: "100%" }}>
          {chatData && selectedUser ? (
            <>
              <UserHeader>
                {/* {isMobile && (
                  <MobileBackButton onClick={handleBack}>
                    <FiArrowLeft size={24} />
                  </MobileBackButton>
                )} */}
                <UserInfo>
                  {selectedUser.avatar ? (
                    <Avatar src={selectedUser.avatar} alt={selectedUser.name} />
                  ) : (
                    <AvatarPlaceholder>
                      {getInitials(selectedUser.name)}
                    </AvatarPlaceholder>
                  )}
                  <UserMeta>
                    <h4>{selectedUser.name}</h4>
                    {/* {sessionActive && (
                      <TimerDisplay>
                        <FiClock size={12} />
                        <span>{formatTimer()}</span>
                      </TimerDisplay>
                    )} */}
                    <div className="user-details">
                      {selectedUser.email && (
                        <span className="detail-item">
                          <FiMail size={12} />
                          {selectedUser.email}
                        </span>
                      )}
                      {selectedUser.phone && (
                        <span className="detail-item">
                          <FiPhone size={12} />
                          {selectedUser.phone}
                        </span>
                      )}
                      {userProfileLoading && (
                        <span className="detail-item loading">Loading...</span>
                      )}
                    </div>
                  </UserMeta>
                </UserInfo>
              </UserHeader>

              <ChatArea>
                <Messages ref={messagesContainerRef}>
                  {messages.length === 0 ? (
                    <EmptyChatMessage>
                      💬 Chat ready! Send first message or wait for user.
                    </EmptyChatMessage>
                  ) : (
                    messages.map((msg, index) => (
                      <Message key={msg.id || index} $expert={msg.sender_type === "expert"}>
                        <Bubble $expert={msg.sender_type === "expert"}>
                          <div className="message-text">{msg.message}</div>
                          <span className="time">{msg.time}</span>
                        </Bubble>
                      </Message>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </Messages>

                <ChatInputWrap>
                  <ChatInput
                    ref={inputRef}
                    placeholder={sessionActive ? "Type your response..." : "Chat session ended"}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={!sessionActive}
                    maxLength={1000}
                    rows={1}
                  />
                  <SendButton
                    onClick={handleSendMessage}
                    disabled={!message.trim() || !sessionActive}
                  >
                    <FiSend size={20} />
                  </SendButton>
                </ChatInputWrap>
              </ChatArea>
            </>
          ) : error ? (
            <ErrorMessage>
              <FiUserX size={48} />
              <h3>{error}</h3>
              <button onClick={() => navigate("/expert/dashboard")}>Back to Dashboard</button>
            </ErrorMessage>
          ) : !isInitialized ? (
            <NoChatSelected>
              <FiClock size={48} />
              <h3>Initializing Chat...</h3>
              <p>Loading your chats and notifications</p>
            </NoChatSelected>
          ) : (
            <NoChatSelected>
              <FiClock size={48} />
              <h3>Select a Chat</h3>
              <p>Open a chat from history or notifications</p>
            </NoChatSelected>
          )}
        </RightPanel>
      </ChatLayout>
    </PageWrap>
  );
};

export default ExpertChat;