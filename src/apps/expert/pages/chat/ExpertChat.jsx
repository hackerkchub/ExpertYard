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

import { FiSend, FiUserX, FiClock, FiMail, FiPhone } from "react-icons/fi";
import { socket } from "../../../../shared/api/socket";
import { useExpert } from "../../../../shared/context/ExpertContext";
import { getUserPublicProfileApi } from "../../../../shared/api/userApi";
import { toast } from "react-hot-toast";

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

/* ================= COMPONENT ================= */
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

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  /* ------------------ EXPERT ID ------------------ */
  const expertId = useMemo(() => {
    return expert?.id || expert?.expert_id || chatData?.expert_id || null;
  }, [expert, chatData]);

  /* ------------------ FETCH USER ------------------ */
  const fetchUserProfile = async (userId) => {
    try {
      const res = await getUserPublicProfileApi(userId);
      if (res?.success) {
        setUserProfile(res.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  /* ------------------ FETCH CHAT ------------------ */
  const fetchChat = useCallback(async () => {
    if (!room_id) return;

    try {
      setLoading(true);

      const res = await fetch(
        `https://softmaxs.com/api/chat/details/${room_id}`
      );
      const data = await res.json();

      const { session, messages } = data.data;

      setChatData(session);
      setSessionActive(!!session.is_active);

      setMessages(
        messages.map((m) => ({
          id: m.id,
          message: m.message,
          sender_type: m.sender_type,
          time: new Date(m.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }))
      );

      if (session.user_id) fetchUserProfile(session.user_id);
    } catch (e) {
      setError("Failed to load chat");
    } finally {
      setLoading(false);
    }
  }, [room_id]);

  /* ------------------ SOCKET ------------------ */
  useEffect(() => {
    if (!room_id) return;

    socket.emit("join_room", { room_id });

    socket.on("message", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          id: msg.id,
          message: msg.message,
          sender_type: msg.sender_type,
          time: new Date(msg.time).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      scrollToBottom();
    });

    socket.on("chat_ended", () => {
      setSessionActive(false);
      toast.success("Chat Ended");
      navigate("/expert/chat-history");
    });

    return () => {
      socket.emit("leave_room", { room_id });
      socket.off("message");
      socket.off("chat_ended");
    };
  }, [room_id, navigate]);

  /* ------------------ INIT ------------------ */
  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  /* ------------------ SCROLL ------------------ */
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* ------------------ SEND MESSAGE ------------------ */
  const handleSendMessage = () => {
    if (!message.trim()) return;

    const msg = {
      id: Date.now(),
      message,
      sender_type: "expert",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, msg]);

    socket.emit("sendMessage", {
      room_id,
      message,
    });

    setMessage("");

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  /* ------------------ ENTER KEY ------------------ */
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /* ------------------ USER ------------------ */
  const user = useMemo(() => {
    if (!chatData) return null;

    return {
      name: userProfile?.full_name || `User #${chatData.user_id}`,
      email: userProfile?.email,
      phone: userProfile?.phone,
      avatar: userProfile?.avatar,
    };
  }, [chatData, userProfile]);

  /* ------------------ LOADING ------------------ */
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
              {/* HEADER */}
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

              {/* CHAT */}
              <ChatArea>
                <Messages>
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
                          <div>{msg.message}</div>
                          <span className="time">{msg.time}</span>
                        </Bubble>
                      </Message>
                    ))
                  )}

                  <div ref={messagesEndRef} />
                </Messages>

                {/* INPUT */}
                <ChatInputWrap>
                  <ChatInput
                    ref={inputRef}
                    value={message}
                    placeholder={
                      sessionActive
                        ? "Type message..."
                        : "Chat ended"
                    }
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={!sessionActive}
                  />

                  <SendButton
                    onClick={handleSendMessage}
                    disabled={!message.trim() || !sessionActive}
                  >
                    <FiSend />
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