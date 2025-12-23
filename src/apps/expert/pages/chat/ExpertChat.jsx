// src/apps/expert/pages/chat/ExpertChat.jsx
import React, { useState } from "react";
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
  SendButton
} from "./ExpertChat.styles";

import { FiSend } from "react-icons/fi";

const ExpertChat = () => {
  const [message, setMessage] = useState("");

  return (
    <PageWrap>
      <ChatLayout>

        {/* LEFT : Pending Requests */}
        <LeftPanel>
          <SectionTitle>Pending Requests</SectionTitle>

          <ChatList>
            <ChatItem active>
              <StatusDot online />
              <div>
                <UserName>Amit Verma</UserName>
                <TimeText>Waiting · 4 min</TimeText>
              </div>
            </ChatItem>

            <ChatItem>
              <StatusDot />
              <div>
                <UserName>Sneha Gupta</UserName>
                <TimeText>Pending</TimeText>
              </div>
            </ChatItem>

            <ChatItem>
              <StatusDot />
              <div>
                <UserName>John Doe</UserName>
                <TimeText>New Request</TimeText>
              </div>
            </ChatItem>
          </ChatList>
        </LeftPanel>

        {/* RIGHT : User Info + Chat */}
        <RightPanel>

          {/* User Details */}
          <UserHeader>
            <UserInfo>
              <Avatar src="https://i.pravatar.cc/150?img=32" />
              <UserMeta>
                <h4>Sneha Gupta</h4>
                <span>API Integration · Premium User</span>
              </UserMeta>
            </UserInfo>
          </UserHeader>

          {/* Chat Messages */}
          <ChatArea>
            <Messages>
              <Message>
                <Bubble>User: My API integration is failing.</Bubble>
              </Message>

              <Message expert>
                <Bubble expert>Hello Sneha, checking the logs now.</Bubble>
              </Message>

              <Message>
                <Bubble>User: Getting rate limit error.</Bubble>
              </Message>
            </Messages>

            {/* Input */}
            <ChatInputWrap>
              <ChatInput
                placeholder="Type your response..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <SendButton>
                <FiSend size={18} />
              </SendButton>
            </ChatInputWrap>
          </ChatArea>

        </RightPanel>

      </ChatLayout>
    </PageWrap>
  );
};

export default ExpertChat;
