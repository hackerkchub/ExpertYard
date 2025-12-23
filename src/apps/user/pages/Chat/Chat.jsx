// Chat.jsx - FINAL PERFECT FIX (No Footer + No Bounce + Full Control)
import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiPhoneCall, FiPaperclip,  FiImage, FiVideo, FiFile } from "react-icons/fi";
import { IoMdSend, IoMdClose } from "react-icons/io";

import {
  PageWrap,
  // ChatContainer,
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
    ChatGlobalStyle 
} from "./Chat.styles";

const Chat = () => {
  const [input, setInput] = useState("");
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "expert", text: "Hello! How can I assist you today?", time: "10:30 AM" },
    { sender: "user", text: "I need advice on my blood pressure.", time: "10:32 AM" }
  ]);
  const scrollRef = useRef();

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const messageTime = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', minute: '2-digit', hour12: true 
    });
    
    const newMessage = { sender: "user", text: input, time: messageTime };
    setMessages(prev => [...prev, newMessage]);
    setInput("");
    
    setTimeout(() => {
      const responses = [
        "Understood. Let me analyze this for you.",
        "Great question! Here's what I recommend:",
        "Perfect. I'll prepare a detailed plan.",
        "Thanks for sharing. Give me a moment."
      ];
      setMessages(prev => [...prev, {
        sender: "expert", 
        text: responses[Math.floor(Math.random() * responses.length)], 
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      }]);
    }, 1500);
  };

  const handleFileUpload = (type) => {
    console.log(`Uploading ${type}`);
    setShowFileMenu(false);
  };
  return (
     <>
      <ChatGlobalStyle />
    <PageWrap>
      {/* FIXED HEADER */}
      <Header>
        <ExpertInfo>
          <AvatarWrapper>
            <Avatar src="https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg" />
            <StatusDot active={true} />
          </AvatarWrapper>
          <div>
            <div className="expert-name">Dr. Anya Sharma</div>
            <div className="expert-role">Cardiologist</div>
            <div className="status">Online</div>
          </div>
        </ExpertInfo>
        <CallButton title="Voice Call">
          <FiPhoneCall size={20} />
        </CallButton>
      </Header>

      {/* SCROLLABLE MESSAGES */}
      <MessagesArea>
        {messages.map((msg, index) => (
          <MessageRow key={index} className={msg.sender}>
            <MessageBubble className={msg.sender}>
              <div className="message-text">{msg.text}</div>
              <MessageTime>{msg.time}</MessageTime>
            </MessageBubble>
          </MessageRow>
        ))}
        <div ref={scrollRef} />
      </MessagesArea>

      {/* FIXED BOTTOM INPUT - No bounce */}
     <InputBar>
  <UploadButton onClick={() => setShowFileMenu(!showFileMenu)}>
    <FiPaperclip size={20} />
    {showFileMenu && (
      <IoMdClose 
        size={14} 
        style={{ 
          position: 'absolute', 
          top: '50%', 
          right: '50%', 
          transform: 'translate(50%, -50%)',
          background: '#ef4444',
          borderRadius: '50%',
          padding: '1px'
        }} 
      />
    )}
  </UploadButton>

  {showFileMenu && (
    <FileUploadMenu>
      <div className="menu-item" onClick={() => handleFileUpload('image')}>
        <FiImage size={18} /><span>Photos</span>
      </div>
      <div className="menu-item" onClick={() => handleFileUpload('video')}>
        <FiVideo size={18} /><span>Videos</span>
      </div>
      <div className="menu-item" onClick={() => handleFileUpload('file')}>
        <FiFile size={18} /><span>Documents</span>
      </div>
    </FileUploadMenu>
  )}

  <InputBox
    placeholder="Type your message..."
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    }}
  />

 
  <SendButton onClick={sendMessage} disabled={!input.trim()}>
    <IoMdSend size={20} />
  </SendButton>
</InputBar>

    </PageWrap>
    </>
  );
};

export default Chat;
