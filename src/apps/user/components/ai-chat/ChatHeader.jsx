// components/ai-chat/ChatHeader.jsx
import React from 'react';
import useChatStore from '../../stores/chatStore';
import {
  Header,
  HeaderContent,
  HeaderLeft,
  Avatar,
  HeaderInfo,
  HeaderTitle,
  HeaderStatus,
  HeaderActions,
  IconButton,
} from './chat.styles';

const ChatHeader = ({ onClose }) => {
  const { clearChat } = useChatStore();

  return (
    <Header>
      <HeaderContent>
        <HeaderLeft>
          <Avatar>
            <span>✨</span>
          </Avatar>
          <HeaderInfo>
            <HeaderTitle>Ask Gia</HeaderTitle>
            <HeaderStatus>Online • Usually replies instantly</HeaderStatus>
          </HeaderInfo>
        </HeaderLeft>
        <HeaderActions>
          <IconButton onClick={clearChat} aria-label="Clear chat">
            🗑️
          </IconButton>
          <IconButton onClick={onClose} aria-label="Close chat">
            ✕
          </IconButton>
        </HeaderActions>
      </HeaderContent>
    </Header>
  );
};

export default ChatHeader;