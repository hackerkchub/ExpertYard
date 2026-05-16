// components/ai-chat/MessageList.jsx
import React from 'react';
import useChatStore from '../../stores/chatStore';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import {
  MessageListContainer,
  EmptyState,
  EmptyStateContent,
  EmptyStateEmoji,
  EmptyStateTitle,
  EmptyStateText,
} from './chat.styles';

const MessageList = ({ messagesEndRef }) => {
  const { messages, isTyping } = useChatStore();

  if (messages.length === 0) {
    return (
      <EmptyState>
        <EmptyStateContent>
          <EmptyStateEmoji>✨</EmptyStateEmoji>
          <EmptyStateTitle>Hello! I'm Gia</EmptyStateTitle>
          <EmptyStateText>
            Ask me anything about astrology, consultations, or help with your account.
          </EmptyStateText>
        </EmptyStateContent>
      </EmptyState>
    );
  }

  return (
    <MessageListContainer>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </MessageListContainer>
  );
};

export default MessageList;