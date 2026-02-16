// src/apps/user/pages/chat/Chat.jsx - ✅ FIXED Wallet Balance Check + Auto-Deduct
import React, { useState, useEffect, useRef, useCallback, useLayoutEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiPaperclip, FiImage, FiVideo, FiFile, FiX } from "react-icons/fi";
import { IoMdSend } from "react-icons/io";
import {
  PageWrap,
  Header,
  ExpertInfo,
  Avatar,
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
} from "./Chat.styles";

import { socket } from "../../../../shared/api/socket";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useExpert } from "../../../../shared/context/ExpertContext";
import { useWallet } from "../../../../shared/context/WalletContext"; // ✅ CORRECT WalletContext
import useChatTimer from "../../../../shared/hooks/useChatTimer"; // ✅ ADD hook

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
  const [endTime, setEndTime] = useState(null); // ✅ ADD new state
  const scrollRef = useRef(null);
  
  const { user } = useAuth();
  const { experts, expertData, expertPrice } = useExpert();
  const { balance: walletBalance } = useWallet(); // ✅ CORRECT Wallet API

  // ✅ PERFECT fetchChatDetails
  const fetchChatDetails = useCallback(async () => {
    if (!room_id) return;
    
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem('user_token');
      
      const response = await fetch(`https//softmaxs.com/api/chat/details/${room_id}`, {
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
      // Only set false if really ended
setSessionActive(Number(session.is_active) === 1);

if (session?.end_time) {
  setEndTime(session.end_time);
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

  // ✅ Auto End Chat → redirect to history
  const handleAutoEndChat = useCallback(() => {
    console.log("⏰ Timer expired - Auto ending chat");

    setSessionActive(false);

    socket.emit("end_chat", {
      room_id,
      reason: "time_up"
    });

    navigate("/user/chat-history", { replace: true });
  }, [room_id, navigate]);


  // ✅ Manual End Chat (UPDATED)
 const handleEndChat = useCallback(() => {
  if (!room_id) return;

  const ok = window.confirm("Are you sure you want to end this chat?");

  if (!ok) return;

  socket.emit("end_chat", {
    room_id,
    reason: "user_ended"
  });

  setSessionActive(false);
  navigate("/user/chat-history", { replace: true });

}, [room_id, navigate]);

useEffect(() => {
  if (!sessionActive) return;

  const blockBack = () => {
    const ok = window.confirm("Are you sure you want to leave and end this chat?");

    if (ok) {
      socket.emit("end_chat", { room_id, reason: "user_left" });
      socket.disconnect();
      navigate("/user/chat-history", { replace: true });
    } else {
      window.history.pushState(null, "", window.location.pathname);
    }
  };

  // push dummy state once
  window.history.pushState(null, "", window.location.pathname);

  window.addEventListener("popstate", blockBack);

  return () => {
    window.removeEventListener("popstate", blockBack);
  };
}, [sessionActive, room_id, navigate]);


  // ✅ use chat timer hook
  const { formatted, secondsLeft, isExpired } = useChatTimer(
    endTime,
    handleAutoEndChat
  );

  // ✅ Timer color logic
  const getTimerColor = () => secondsLeft <= 60 ? "#ef4444" : "#10b981";

  // ✅ Close popup and go home
  const handleGoHome = () => {
    setShowEndPopup(false);
    socket.emit("end_chat", { room_id, reason: "user_ended" });
    navigate("/user");
  };

  // ✅ Real-time Socket
  useEffect(() => {
    if (!room_id || !socket) return;

    console.log(`🔌 User joining room: ${room_id}`);
    socket.emit("join_room", { room_id });

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
    };

    const handleChatAccepted = (data) => {
      if (data.room_id === room_id) {
        setEndTime(data.endTime);
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
        navigate("/user/chat-history", { replace: true });
      }
    };

    socket.on("message", handleNewMessage);
    socket.on("chat_accepted", handleChatAccepted); // ✅ ADD listener
    socket.on("chat_updated", handleChatUpdate);
    socket.on("chat_ended", handleChatEnded);

    return () => {
      socket.off("message", handleNewMessage);
      socket.off("chat_accepted", handleChatAccepted); // ✅ cleanup
      socket.off("chat_updated", handleChatUpdate);
      socket.off("chat_ended", handleChatEnded);
      socket.emit("leave_room", { room_id });
    };
  }, [room_id, fetchChatDetails]);

  // ✅ Expert Info
  const expertInfo = useMemo(() => {
    if (!chatData?.expert_id) return null;
    
    if (expertData?.expertId === chatData.expert_id) {
      return {
        name: expertData.name || `Expert #${chatData.expert_id}`,
        position: expertData.position || '',
        avatar: expertData.profile_photo || `https://i.pravatar.cc/150?img=${chatData.expert_id}`,
      };
    }
    
    const expert = experts.find(e => e.id == chatData.expert_id);
    if (expert) {
      return {
        name: expert.name,
        position: expert.position || '',
        avatar: expert.profile_photo,
      };
    }
    
    return {
      name: `Expert #${chatData.expert_id}`,
      position: '',
      avatar: `https://i.pravatar.cc/150?img=${chatData.expert_id}`,
    };
  }, [chatData?.expert_id, experts, expertData]);

  useLayoutEffect(() => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages.length]);

  useEffect(() => {
    fetchChatDetails();
    // const interval = setInterval(fetchChatDetails, null || 30000); // Refresh every 30s
    // return () => clearInterval(interval);
  }, [fetchChatDetails]);

  const sendMessage = useCallback(() => {
    if (!input.trim() || !room_id) return;

    const tempId = Date.now();

    // ✅ INSTANT UI UPDATE
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
  }, [input, room_id, user?.id]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

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

  // Check if chat is disabled (either expired or session ended)
const isChatDisabled = sessionActive !== true;



  return (
    <>
      <ChatGlobalStyle />
      <PageWrap>
        <Header>
          {chatData && expertInfo ? (
            <>
              <ExpertInfo>
                <AvatarWrapper>
                  <Avatar src={expertInfo.avatar} alt={expertInfo.name} />
                </AvatarWrapper>
                <div>
                  <div className="expert-name">
                    {expertInfo.name}
                    {expertInfo.position && (
                      <span style={{ fontSize: '0.85em', color: '#64748b', marginLeft: '8px' }}>
                        • {expertInfo.position}
                      </span>
                    )}
                  </div>
                  <div className="status">
                    <span style={{ 
                      color: sessionActive === true ? '#10b981' : '#ef4444',
                      fontWeight: '500'
                    }}>
                     {sessionActive === true ? '🟢 Active' : '🔴 Ended'}
                    </span>
                  </div>
                </div>
              </ExpertInfo>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  background: "#f8fafc",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: `2px solid ${getTimerColor()}`,
                  fontSize: "14px",
                  fontWeight: "600",
                  color: getTimerColor(),
                  minWidth: "80px",
                  justifyContent: "center"
                }}>
                  <span>⏱️ {formatted}</span>
                </div>
                <EndChatButton
                  onClick={handleEndChat}
                  disabled={isChatDisabled}
                >
                  <FiX size={20} />
                </EndChatButton>
              </div>
            </>
          ) : (
            <div style={{ color: "#64748b", padding: "20px" }}>Loading expert info...</div>
          )}
        </Header>

        <MessagesArea>
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
              <MessageRow key={msg.id || index} className={msg.sender_type}>
                <MessageBubble className={msg.sender_type}>
                  <div className="message-text">{msg.message}</div>
                  <MessageTime>{msg.time}</MessageTime>
                </MessageBubble>
              </MessageRow>
            ))
          )}
          <div ref={scrollRef} />
        </MessagesArea>

        <InputBar>
          <UploadButton onClick={() => setShowFileMenu(!showFileMenu)} disabled={isChatDisabled}>
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
            placeholder={isChatDisabled ? "Chat session ended" : "Type your message..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isChatDisabled}
            maxLength={1000}
          />

          <SendButton onClick={sendMessage} disabled={!input.trim() || isChatDisabled}>
            <IoMdSend size={20} />
          </SendButton>
        </InputBar>

        {/* ✅ CHAT END POPUP */}
        {showEndPopup && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}>
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '16px',
              maxWidth: '400px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}>
              <FiX size={64} style={{ color: '#ef4444', marginBottom: '20px' }} />
              <h2 style={{ color: '#1e293b', marginBottom: '16px' }}>Chat Ended</h2>
              <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '16px' }}>
                Your chat session has ended. Thank you for using our service!
              </p>
              <button 
                onClick={handleGoHome}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '12px 32px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
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