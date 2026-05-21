import React from 'react';
import useChatStore from '../../stores/chatStore';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { ExpertCardsSkeleton } from './ExpertRecommendationCards';
import {
  MessageListContainer,
  EmptyState,
  EmptyStateContent,
  EmptyStateEmoji,
  EmptyStateTitle,
  EmptyStateText,
} from './chat.styles';

const MessageList = ({ messagesEndRef }) => {
  const { messages, isTyping, isLoading } = useChatStore();

  if (messages.length === 0) {
    return (
      <EmptyState>
        <EmptyStateContent>
          <EmptyStateEmoji>G9</EmptyStateEmoji>
          <EmptyStateTitle>Hi, I'm your G9 Experts assistant.</EmptyStateTitle>
          <EmptyStateText>What do you need help with today?</EmptyStateText>
        </EmptyStateContent>
      </EmptyState>
    );
  }

  return (
    <MessageListContainer>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      {isTyping && (
        <>
          <TypingIndicator />
          {isLoading && <ExpertCardsSkeleton />}
        </>
      )}
      <div ref={messagesEndRef} />
    </MessageListContainer>
  );
};

export default MessageList;
