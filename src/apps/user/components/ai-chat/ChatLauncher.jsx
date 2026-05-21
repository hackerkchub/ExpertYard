import React, { useState, useEffect } from 'react';
import useChatStore from '../../stores/chatStore';
import ChatWindow from './ChatWindow';
import {
  LauncherButton,
  ButtonContent,
  ButtonText,
  AskText,
  UnreadBadge,
} from './chat.styles';

const ChatLauncher = () => {
  const { isOpen, toggleChat, messages } = useChatStore();
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastMessageCount, setLastMessageCount] = useState(messages.length);

  useEffect(() => {
    if (!isOpen && messages.length > lastMessageCount) {
      const newMessages = messages.slice(lastMessageCount);
      const assistantMessages = newMessages.filter((message) => message.role === 'assistant');
      setUnreadCount((prev) => prev + assistantMessages.length);
    }
    setLastMessageCount(messages.length);
  }, [messages, isOpen, lastMessageCount]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  return (
    <>
      <LauncherButton type="button" onClick={toggleChat} aria-label="Open G9 Experts assistant">
        <ButtonContent>
          <ButtonText>G9</ButtonText>
          <AskText>Ask</AskText>
          {unreadCount > 0 && <UnreadBadge>{unreadCount}</UnreadBadge>}
        </ButtonContent>
      </LauncherButton>
      {isOpen && <ChatWindow />}
    </>
  );
};

export default ChatLauncher;
