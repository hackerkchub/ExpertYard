// src/apps/user/pages/chat/Chat.jsx - ✅ FIXED Wallet Balance Check + Auto-Deduct
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
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

const Chat = () => {
  const { room_id } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatData, setChatData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sessionActive, setSessionActive] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes = 300 seconds
  const [timerRunning, setTimerRunning] = useState(false);
  const [lastMinuteAlertShown, setLastMinuteAlertShown] = useState(false);
  const [showEndPopup, setShowEndPopup] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const scrollRef = useRef(null);
  
  const { user } = useAuth();
  const { experts, expertData, expertPrice } = useExpert();
  const { balance: walletBalance, loading: walletLoadingContext, deductMoney, fetchWallet } = useWallet(); // ✅ CORRECT Wallet API

  // ✅ PERFECT fetchChatDetails
  const fetchChatDetails = useCallback(async () => {
    if (!room_id) return;
    
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem('user_token');
      
      const response = await fetch(`/api/chat/details/${room_id}`, {
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
      setSessionActive(!!session.is_active);
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

  // ✅ FIXED Wallet Auto-Extend + Deduct
  const checkWalletAndExtend = useCallback(async () => {
    if (!user?.id) return false;
    
    const chatPricePerMin = expertPrice?.chat_per_minute || chatData?.price_per_minute || 0;
    const costFor1Min = chatPricePerMin;
    
    console.log('💰 Wallet check:', { 
      walletBalance, 
      chatPricePerMin, 
      costFor1Min,
      userId: user.id 
    });
    
    if (walletBalance >= costFor1Min) {
      setWalletLoading(true);
      
      try {
        // ✅ ACTUAL DEDUCT from WalletContext
        const deductResult = await deductMoney(user.id, costFor1Min);
        
        if (deductResult?.success) {
          // ✅ Extend by 1 minute
          setTimeLeft(prev => prev + 60);
          setLastMinuteAlertShown(false);
          setSessionActive(true);
          console.log('✅ ✅ Wallet deducted + Extended 1 more minute');
          return true;
        } else {
          console.log('❌ Deduct failed:', deductResult);
          return false;
        }
      } catch (err) {
        console.error('❌ Wallet deduct error:', err);
        return false;
      } finally {
        setWalletLoading(false);
      }
    } else {
      console.log('❌ Insufficient wallet balance:', walletBalance, '<', costFor1Min);
      return false;
    }
  }, [walletBalance, expertPrice?.chat_per_minute, chatData?.price_per_minute, user?.id, deductMoney]);

  // ✅ 5min Timer Logic + Wallet Check
  useEffect(() => {
    if (!sessionActive || !timerRunning) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        
        if (newTime === 60 && !lastMinuteAlertShown) {
          setLastMinuteAlertShown(true);
        }
        
        if (newTime <= 0) {
          // ✅ Check wallet before ending
          checkWalletAndExtend().then(canExtend => {
            if (!canExtend) {
              handleAutoEndChat();
            }
          });
          return 0; // Show 0:00 while checking
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionActive, timerRunning, lastMinuteAlertShown, checkWalletAndExtend]);

  // ✅ Auto End Chat with POPUP
  const handleAutoEndChat = useCallback(() => {
    console.log('⏰ Timer expired - Showing end popup');
    setSessionActive(false);
    setTimerRunning(false);
    setShowEndPopup(true);
  }, []);

  // ✅ Manual End Chat
  const handleEndChat = useCallback(() => {
    console.log('🔚 Manual end chat');
    setTimerRunning(false);
    setShowEndPopup(true);
  }, []);

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
    socket.emit("join_chat", { room_id });

    const handleNewMessage = (msgData) => {
      if (msgData.room_id === room_id) {
        setMessages(prev => {
          const exists = prev.some(m => m.id === msgData.id);
          if (exists) return prev;
          return [...prev, {
            id: msgData.id || Date.now() + Math.random(),
            sender_type: msgData.sender_type,
            sender_id: msgData.sender_id,
            message: msgData.message,
            time: new Date(msgData.time).toLocaleTimeString('en-US', { 
              hour: '2-digit', minute: '2-digit', hour12: true 
            })
          }];
        });
      }
    };

    const handleChatUpdate = ({ room_id: updatedRoomId }) => {
      if (updatedRoomId === room_id) {
        fetchChatDetails();
      }
    };

    const handleChatEnded = ({ room_id: endedRoomId, reason }) => {
      if (endedRoomId === room_id) {
        setSessionActive(false);
        setTimerRunning(false);
        setShowEndPopup(true);
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
      socket.emit("leave_chat", { room_id });
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

  // ✅ Start Timer
  useEffect(() => {
    if (sessionActive && chatData && !timerRunning) {
      setTimeLeft(300);
      setTimerRunning(true);
      setLastMinuteAlertShown(false);
      console.log('⏰ 5min timer started');
    }
  }, [sessionActive, chatData, timerRunning]);

  // Auto-scroll
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  }, [messages]);

  // Initial load
  useEffect(() => {
    fetchChatDetails();
    const interval = setInterval(fetchChatDetails, 45000);
    return () => clearInterval(interval);
  }, [fetchChatDetails]);

  const sendMessage = useCallback(() => {
    if (!input.trim() || !chatData || !room_id || !sessionActive || timeLeft <= 0) return;

    const payload = {
      room_id,
      sender_type: "user",
      sender_id: user?.id || chatData.user_id,
      message: input.trim()
    };

    socket.emit("sendMessage", payload);
    setInput("");
  }, [input, chatData, room_id, sessionActive, timeLeft, user?.id]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    return timeLeft <= 60 ? '#ef4444' : '#10b981';
  };

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
          {chatData && expertInfo ? (
            <>
              <ExpertInfo>
                <AvatarWrapper>
                  <Avatar src={expertInfo.avatar} alt={expertInfo.name} />
                  <StatusDot active={sessionActive && timeLeft > 0 && !walletLoading} />
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
                      color: sessionActive && timeLeft > 0 && !walletLoading ? '#10b981' : '#ef4444',
                      fontWeight: '500'
                    }}>
                      {walletLoading ? '⏳ Processing...' : 
                       sessionActive && timeLeft > 0 ? '🟢 Active' : '🔴 Ended'}
                    </span>
                  </div>
                </div>
              </ExpertInfo>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  background: walletLoading ? "#fef3c7" : "#f8fafc",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: `2px solid ${walletLoading ? '#f59e0b' : getTimerColor()}`,
                  fontSize: "14px",
                  fontWeight: "600",
                  color: walletLoading ? '#b45309' : getTimerColor(),
                  minWidth: "80px",
                  justifyContent: "center"
                }}>
                  {walletLoading ? '💳' : '⏱️'} 
                  <span>{walletLoading ? 'Checking...' : formatTime(timeLeft)}</span>
                </div>
                <EndChatButton onClick={handleEndChat} disabled={!sessionActive || timeLeft <= 0 || walletLoading}>
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
              {walletLoading && <div style={{fontSize:'12px', color:'#f59e0b'}}>Wallet being checked...</div>}
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
          <UploadButton onClick={() => setShowFileMenu(!showFileMenu)} disabled={!sessionActive || timeLeft <= 0 || walletLoading}>
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
            placeholder={walletLoading ? "Processing payment..." : 
                        sessionActive && timeLeft > 0 ? "Type your message..." : "Chat session ended"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={!sessionActive || timeLeft <= 0 || walletLoading}
            maxLength={1000}
          />

          <SendButton onClick={sendMessage} disabled={!input.trim() || !sessionActive || timeLeft <= 0 || walletLoading}>
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
