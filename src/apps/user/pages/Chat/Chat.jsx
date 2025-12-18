import React, { useState, useEffect, useRef } from "react";
import { FiPhoneCall } from "react-icons/fi";


import {
  PageWrap,
  Layout,
  LeftPanelToggle,
  ChatContainer,
  TypingBubble,
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
  SendButton
} from "./Chat.styles";

import ConversationList from "../../components/ConversationList/ConversationList";
import Navbar from "../../components/Navbar/Navbar";

const Chat = () => {
  const [showLeft, setShowLeft] = useState(false);

  // Mock previous chats
  const [conversations] = useState([
    {
      id: 1,
      name: "Dr. Anya Sharma",
      avatar: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg",
      lastMsg: "Sure, let me help you.",
      online: true,
      messages: [
        { sender: "expert", text: "Hello! How can I assist you today?" }
      ]
    },
    {
      id: 2,
      name: "Rajeev Kumar",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
      lastMsg: "I sent the document.",
      online: false,
      messages: [
        { sender: "expert", text: "Send me your requirement file." }
      ]
    }
  ]);

  const [activeChat, setActiveChat] = useState(conversations[0]);
  const [input, setInput] = useState("");

  const [typing, setTyping] = useState(false);
  const scrollRef = useRef();

  // When user replies -> expert typing simulation
  useEffect(() => {
    const last = activeChat.messages[activeChat.messages.length - 1];

    if (last?.sender === "user") {
      setTyping(true);

      setTimeout(() => {
        setTyping(false);

        setActiveChat((prev) => ({
          ...prev,
          messages: [...prev.messages, { sender: "expert", text: "Working on it..." }]
        }));
      }, 1200);
    }
  }, [activeChat]);

  // Scroll to last message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat]);

  // Send message
  const sendMessage = () => {
    if (!input.trim()) return;

    const updated = {
      ...activeChat,
      messages: [...activeChat.messages, { sender: "user", text: input }]
    };

    setActiveChat(updated);
    setInput("");
  };

  return (
    <>
      {/* NAVBAR */}
    

      {/* CHAT PAGE */}
      <PageWrap>

        {/* Mobile toggle */}
        {/* <LeftPanelToggle onClick={() => setShowLeft(true)}>
          ☰ Chats
        </LeftPanelToggle> */}

        <Layout>

          {/* LEFT PANEL — conversations */}
          <ConversationList
            show={showLeft}
            close={() => setShowLeft(false)}
            items={conversations}
            onSelect={(c) => {
              setActiveChat(c);
              setShowLeft(false);
            }}
          />

          {/* RIGHT — chat window */}
          <ChatContainer>

            {/* Header */}
           <Header>

  {/* LEFT SIDE: Avatar + Info */}
  <ExpertInfo>
    <AvatarWrapper>
      <Avatar src={activeChat.avatar} />
      <StatusDot active={activeChat.online} />
    </AvatarWrapper>

    <div className="expert-text">
      <strong>{activeChat.name}</strong>
      <span>{activeChat.online ? "Online" : "Offline"}</span>
    </div>
  </ExpertInfo>

  {/* RIGHT SIDE: CALL BUTTON */}
  <CallButton>
    <FiPhoneCall size={20} />
  </CallButton>

</Header>


            {/* MESSAGES */}
            <MessagesArea>
              {activeChat.messages.map((msg, index) => (
                <MessageRow
                  key={index}
                  className={msg.sender === "user" ? "user" : "expert"}
                >
                  <MessageBubble className={msg.sender}>
                    {msg.text}
                  </MessageBubble>
                </MessageRow>
              ))}

              {/* Typing animation */}
              {typing && (
                <MessageRow className="expert">
                  <TypingBubble>
                    <span></span><span></span><span></span>
                  </TypingBubble>
                </MessageRow>
              )}

              <div ref={scrollRef}></div>
            </MessagesArea>

            {/* INPUT BAR */}
            <InputBar>
              <InputBox
                placeholder="Write a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <SendButton onClick={sendMessage}>Send</SendButton>
            </InputBar>

          </ChatContainer>
        </Layout>
      </PageWrap>
    </>
  );
};

export default Chat;
