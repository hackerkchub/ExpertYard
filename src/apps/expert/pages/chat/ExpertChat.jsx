// src/apps/expert/pages/chat/ExpertChat.jsx - ✅ FIXED: User Profile + Earning + Pause
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
  LeftPanel,
  RightPanel,
  SectionTitle,
  ChatList,
  ChatItem,
  StatusDot,
  UserName,
  TimeText,
  UserHeader,
  UserInfo,
  Avatar,
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
  LeftHeader,
  LeftTitle,
  LeftTabs,
  LeftTab,
} from "./ExpertChat.styles";
import { FiSend, FiUserX, FiClock, FiPause } from "react-icons/fi";
import { socket } from "../../../../shared/api/socket";
import { useExpert } from "../../../../shared/context/ExpertContext";
import { useExpertNotifications } from "../../context/ExpertNotificationsContext";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { getUserProfileApi } from "../../../../shared/api/userApi"; // ✅ NEW: User API

const ExpertChat = () => {
  const { room_id } = useParams();
  const navigate = useNavigate();

  // ✅ NEW: User Profile States
  const [userProfile, setUserProfile] = useState(null);
  const [userProfileLoading, setUserProfileLoading] = useState(false);

  const [chatData, setChatData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [allChats, setAllChats] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [leftFilter, setLeftFilter] = useState("all");
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [displaySeconds, setDisplaySeconds] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [timerPaused, setTimerPaused] = useState(false);
  const messagesEndRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const { user: loggedInUser } = useAuth();
  const { expert, expertPrice } = useExpert();
  const { notifications } = useExpertNotifications();

  /* ========= HELPER: CURRENT EXPERT ID ========= */
  const getCurrentExpertId = useCallback(() => {
    if (expert?.id || expert?.expert_id) {
      return expert.id || expert.expert_id;
    }
    try {
      const raw = localStorage.getItem("expert_data");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.id || data.expert_id) {
          return data.id || data.expert_id;
        }
      }
    } catch {
      // ignore
    }
    console.warn("⚠️ No expert id found");
    return null;
  }, [expert]);

  /* ✅ NEW: FETCH USER PROFILE ========= */
  const fetchUserProfile = useCallback(async (userId) => {
    if (!userId) return;
    
    try {
      setUserProfileLoading(true);
      const response = await getUserProfileApi(userId);
      if (response?.success) {
        setUserProfile(response.data);
      }
    } catch (err) {
      console.error("❌ User profile fetch failed:", err);
    } finally {
      setUserProfileLoading(false);
    }
  }, []);

  /* ========= FETCH CHAT DETAILS ========= */
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

      const response = await fetch(`/api/chat/details/${room_id}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || "Unknown error"}`);
      }

      const result = await response.json();
      if (!result.success || !result.data) {
        throw new Error(result.message || "Failed to fetch chat details");
      }

      const { session, messages: fetchedMessages } = result.data;
      if (!session) {
        throw new Error("No session data found");
      }

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
      setError("");

      // ✅ Initialize from server data
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

      // ✅ NEW: Fetch user profile when chat loads
      if (session.user_id) {
        fetchUserProfile(session.user_id);
      }
      
    } catch (err) {
      console.error("❌ Chat fetch error:", err);
      setError(err.message || "Failed to load chat");
      resetSession();
    } finally {
      setLoading(false);
    }
  }, [room_id, fetchUserProfile]);

  // ✅ Reset session completely
  const resetSession = () => {
    setChatData(null);
    setSessionActive(false);
    setSessionSeconds(0);
    setDisplaySeconds(0);
    setSessionStartTime(null);
    setTimerPaused(true);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  };

  /* ========= FETCH ALL CHATS ========= */
  const fetchAllChats = useCallback(async () => {
    try {
      const expertId = getCurrentExpertId();
      if (!expertId) return;

      const response = await fetch(`/api/chat/expert-chats?expert_id=${encodeURIComponent(expertId)}`);

      if (!response.ok) {
        const txt = await response.text();
        console.error("❌ expert-chats error:", response.status, txt);
        return;
      }

      const result = await response.json();
      if (result.success) {
        setAllChats(result.data.chats || []);
      }
    } catch (err) {
      console.error("❌ Failed to fetch chats list:", err);
    }
  }, [getCurrentExpertId]);

  /* ✅ UPDATED: LEFT PANEL DATA WITH USER PROFILES ========= */
  const leftPanelData = useMemo(() => {
    const pendingRequests = notifications?.filter(
      (n) => n.type === "chat_request" && n.status === "pending"
    ) || [];
    const pendingMapped = pendingRequests.map((n) => ({
      id: `room_${n.payload?.user_id}_${n.payload?.expert_id}`,
      type: "pending",
      user_id: n.payload?.user_id,
      userName: n.title?.replace("New chat request from ", "") || "Unknown User",
      waitingTime: "New",
      lastMessage: "New chat request",
    }));

    let currentChats = (allChats || [])
      .filter((chat) => chat.is_active)
      .map((chat) => ({
        id: chat.room_id,
        type: "current",
        user_id: chat.user_id,
        userName: `User #${chat.user_id}`, // Will be overridden if profile available
        lastMessage: chat.last_message || "No messages yet",
        time: new Date(chat.start_time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

    if (chatData?.is_active && chatData?.room_id && !currentChats.some((c) => c.id === chatData.room_id)) {
      currentChats = [{
        id: chatData.room_id,
        type: "current",
        user_id: chatData.user_id,
        userName: `User #${chatData.user_id}`,
        lastMessage: "Live chat",
        time: new Date(chatData.start_time || Date.now()).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }, ...currentChats];
    }

    const historyChats = (allChats || [])
      .filter((chat) => !chat.is_active)
      .map((chat) => ({
        id: chat.room_id,
        type: "history",
        user_id: chat.user_id,
        userName: `User #${chat.user_id}`,
        lastMessage: chat.last_message || "Chat ended",
        time: new Date(chat.end_time || chat.start_time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

    return {
      pending: pendingMapped,
      current: currentChats,
      history: historyChats,
      all: [...pendingMapped, ...currentChats, ...historyChats],
    };
  }, [notifications, allChats, chatData]);

  const visibleList = useMemo(() => leftPanelData[leftFilter] || [], [leftPanelData, leftFilter]);

  /* ========= PRECISE SESSION TIMER ========= */
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

  /* ========= SOCKET HANDLERS ========= */
  useEffect(() => {
    if (!room_id || !socket) return;

    const roomId = room_id;
    socket.emit("join_chat", { room_id: roomId });

    const handleNewMessage = (msgData) => {
      if (msgData.room_id === roomId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msgData.id)) return prev;
          return [...prev, {
            id: msgData.id || Date.now() + Math.random(),
            sender_type: msgData.sender_type,
            sender_id: msgData.sender_id,
            message: msgData.message,
            time: new Date(msgData.time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }];
        });
      }
    };

    const handleChatUpdate = ({ room_id: updatedRoomId }) => {
      if (updatedRoomId === roomId) {
        fetchChatDetails();
        fetchAllChats();
      }
    };

    const handleChatEnded = ({ room_id: endedRoomId, reason }) => {
      if (endedRoomId === roomId) {
        console.log('🔚 Expert: Chat ended:', reason);
        setSessionActive(false);
        setTimerPaused(true);
        setError(`Chat ended: ${reason}`);
        setChatData((prev) => prev ? { ...prev, is_active: 0 } : prev);
      }
    };

    socket.on("message", handleNewMessage);
    socket.on("message_sent", handleNewMessage);
    socket.on("chat_updated", handleChatUpdate);
    socket.on("chat_ended", handleChatEnded);

    return () => {
      socket.off("message", handleNewMessage);
      socket.off("message_sent", handleNewMessage);
      socket.off("chat_updated", handleChatUpdate);
      socket.off("chat_ended", handleChatEnded);
      socket.emit("leave_chat", { room_id: roomId });
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [room_id, fetchChatDetails, fetchAllChats]);

  /* ========= AUTO SCROLL ========= */
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }, [messages]);

  /* ========= INITIAL LOAD ========= */
  useEffect(() => {
    const init = async () => {
      await Promise.all([fetchChatDetails(), fetchAllChats()]);
      setIsInitialized(true);
    };
    init();

    const interval = setInterval(fetchAllChats, 30000);
    return () => clearInterval(interval);
  }, [fetchChatDetails, fetchAllChats]);

  /* ========= SEND MESSAGE ========= */
  const handleSendMessage = useCallback(() => {
    if (!message.trim() || !chatData?.is_active || !room_id) return;

    const payload = {
      room_id,
      sender_type: "expert",
      sender_id: chatData.expert_id,
      message: message.trim(),
    };

    socket.emit("sendMessage", payload);
    setMessage("");
  }, [message, chatData, room_id]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const selectChat = useCallback((chatId) => {
    if (chatId !== room_id) {
      navigate(`/expert/chat/${chatId}`);
    }
  }, [navigate, room_id]);

  /* ✅ UPDATED: selectedUser with Real Profile Data */
  const selectedUser = useMemo(() => {
    if (!chatData) return null;
    
    // Priority: API data > fallback
    if (userProfile) {
      return {
        id: userProfile.id,
        name: userProfile.full_name || `User #${chatData.user_id}`,
        email: userProfile.email,
        phone: userProfile.phone,
        avatar: `https://i.pravatar.cc/150?img=${userProfile.id}`,
      };
    }
    
    // Fallback
    return {
      id: chatData.user_id,
      name: `User #${chatData.user_id}`,
      avatar: `https://i.pravatar.cc/150?img=${chatData.user_id}`,
    };
  }, [chatData, userProfile]);

  // ✅ Earning calculation
  const perMinute = expertPrice?.chat_per_minute || chatData?.price_per_minute || 0;
  const completedMinutes = Math.floor(displaySeconds / 60);
  const totalEarning = perMinute * (completedMinutes + 1);

  // ✅ Format display time MM:SS
  const formatSessionTime = () => {
    const mins = Math.floor(displaySeconds / 60);
    const secs = displaySeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading && !isInitialized) {
    return (
      <PageWrap>
        <LoadingSpinner>Loading chat...</LoadingSpinner>
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <ChatLayout>
        {/* LEFT PANEL */}
        <LeftPanel>
          <LeftHeader>
            <LeftTitle>Chat Queue</LeftTitle>
            <LeftTabs>
              <LeftTab active={leftFilter === "all"} onClick={() => setLeftFilter("all")}>All</LeftTab>
              <LeftTab active={leftFilter === "pending"} onClick={() => setLeftFilter("pending")}>Pending</LeftTab>
              <LeftTab active={leftFilter === "current"} onClick={() => setLeftFilter("current")}>Active</LeftTab>
              <LeftTab active={leftFilter === "history"} onClick={() => setLeftFilter("history")}>History</LeftTab>
            </LeftTabs>
          </LeftHeader>

          <SectionTitle>
            {leftFilter === "all" ? `All Chats (${visibleList.length})` :
             leftFilter === "pending" ? `Pending Requests (${visibleList.length})` :
             leftFilter === "current" ? `Current Chats (${visibleList.length})` :
             `Previous Chats (${visibleList.length})`}
          </SectionTitle>

          <ChatList>
            {visibleList.length === 0 ? (
              <ChatItem style={{ justifyContent: "center", color: "#9ca3af", padding: "14px" }}>
                No chats in this filter
              </ChatItem>
            ) : (
              visibleList.map((item) => (
                <ChatItem key={item.id} onClick={() => selectChat(item.id)} active={room_id === item.id}>
                  <StatusDot online={item.type === "current" || item.type === "pending"} />
                  <div style={{ flex: 1 }}>
                    <UserName>{item.userName}</UserName>
                    <TimeText>{item.time || item.waitingTime}</TimeText>
                  </div>
                </ChatItem>
              ))
            )}
          </ChatList>
        </LeftPanel>

        {/* RIGHT PANEL */}
        <RightPanel>
          {chatData && selectedUser ? (
            <>
              <UserHeader>
                <UserInfo>
                  <Avatar src={selectedUser.avatar} />
                  <UserMeta>
                    <h4>{selectedUser.name}</h4>
                    {/* ✅ Real user data */}
                    {userProfile ? (
                      <>
                        <span>{selectedUser.email}</span>
                        <span>{selectedUser.phone}</span>
                      </>
                    ) : userProfileLoading ? (
                      <span>Loading user info...</span>
                    ) : (
                      <span>—</span>
                    )}
                  </UserMeta>
                </UserInfo>
                <div style={{ textAlign: "right" }}>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: sessionActive ? "#10b981" : "#ef4444",
                    marginBottom: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    justifyContent: 'flex-end'
                  }}>
                    {sessionActive ? "🟢 Chat Active" : (
                      <>
                        🔴 Chat Ended {timerPaused && <FiPause size={12} />}
                      </>
                    )}
                  </div>
                  <div style={{ 
                    fontSize: 12, 
                    color: timerPaused ? "#6b7280" : "#10b981",
                    fontWeight: timerPaused ? 400 : 600
                  }}>
                    Session: {formatSessionTime()}
                  </div>
                  <div style={{ fontSize: 13, color: "#111827", marginTop: 2, fontWeight: 600 }}>
                    Earning: ₹{totalEarning}
                  </div>
                </div>
              </UserHeader>

              <ChatArea>
                <Messages>
                  {messages.length === 0 ? (
                    <EmptyChatMessage>
                      💬 Chat ready! Send first message or wait for user.
                    </EmptyChatMessage>
                  ) : (
                    messages.map((msg, index) => (
                      <Message key={msg.id || index} expert={msg.sender_type === "expert"}>
                        <Bubble expert={msg.sender_type === "expert"}>
                          <div>{msg.message}</div>
                          <span className="time">{msg.time}</span>
                        </Bubble>
                      </Message>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </Messages>

                <ChatInputWrap>
                  <ChatInput
                    placeholder={sessionActive ? "Type your response..." : "Chat session ended"}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={!sessionActive}
                    maxLength={1000}
                  />
                  <SendButton onClick={handleSendMessage} disabled={!message.trim() || !sessionActive}>
                    <FiSend size={18} />
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
              <p>Click any chat from left panel to start messaging</p>
            </NoChatSelected>
          )}
        </RightPanel>
      </ChatLayout>
    </PageWrap>
  );
};

export default ExpertChat;
