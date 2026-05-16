// components/ai-chat/QuickReplies.jsx
import React from 'react';
import {
  QuickRepliesContainer,
  RepliesWrapper,
  QuickReplyButton,
} from './chat.styles';

const QUICK_REPLIES = [
  { text: '🔮 Find astrologers', value: 'Find astrologers for consultation' },
  { text: '💰 Wallet help', value: 'How to add money to wallet?' },
  { text: '📖 How to book?', value: 'How to book a consultation?' },
  { text: '🌟 Popular experts', value: 'Show me popular experts' },
  { text: '🔄 Refund help', value: 'How to get a refund?' },
];

const QuickReplies = ({ onQuickReply }) => {
  return (
    <QuickRepliesContainer>
      <RepliesWrapper>
        {QUICK_REPLIES.map((reply, index) => (
          <QuickReplyButton
            key={index}
            onClick={() => onQuickReply(reply.value)}
          >
            {reply.text}
          </QuickReplyButton>
        ))}
      </RepliesWrapper>
    </QuickRepliesContainer>
  );
};

export default QuickReplies;