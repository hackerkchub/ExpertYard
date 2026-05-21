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
            <span>G9</span>
          </Avatar>
          <HeaderInfo>
            <HeaderTitle>G9 AI Assistant</HeaderTitle>
            <HeaderStatus>Find the right expert instantly</HeaderStatus>
          </HeaderInfo>
        </HeaderLeft>
        <HeaderActions>
          <IconButton type="button" onClick={clearChat} aria-label="Clear chat">
            Clear
          </IconButton>
          <IconButton type="button" onClick={onClose} aria-label="Minimize chat">
            X
          </IconButton>
        </HeaderActions>
      </HeaderContent>
    </Header>
  );
};

export default ChatHeader;
