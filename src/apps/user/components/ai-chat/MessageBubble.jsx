// components/ai-chat/MessageBubble.jsx
import React from 'react';
import ExpertRecommendationCards from './ExpertRecommendationCards';
import {
  MessageWrapper,
  Bubble,
  MessageText,
  Timestamp,
} from './chat.styles';

const MessageBubble = ({ message }) => {
  const isUser = message.role === 'user';

  if (message.type === 'experts') {
    return <ExpertRecommendationCards experts={message.experts} />;
  }

  return (
    <MessageWrapper isUser={isUser}>
      <Bubble isUser={isUser}>
        <MessageText>{message.content}</MessageText>
        <Timestamp>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Timestamp>
      </Bubble>
    </MessageWrapper>
  );
};

export default MessageBubble;