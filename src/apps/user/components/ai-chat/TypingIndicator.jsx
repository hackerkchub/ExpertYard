// components/ai-chat/TypingIndicator.jsx
import React from 'react';
import {
  TypingWrapper,
  TypingBubble,
  DotsContainer,
  Dot,
  TypingText,
} from './chat.styles';

const TypingIndicator = () => {
  return (
    <TypingWrapper>
      <TypingBubble>
        <DotsContainer>
          <Dot delay="-0.32s" />
          <Dot delay="-0.16s" />
          <Dot delay="0s" />
        </DotsContainer>
        <TypingText>Gia is typing...</TypingText>
      </TypingBubble>
    </TypingWrapper>
  );
};

export default TypingIndicator;