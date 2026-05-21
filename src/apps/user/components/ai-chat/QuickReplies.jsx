import React from 'react';
import {
  QuickRepliesContainer,
  RepliesWrapper,
  QuickReplyButton,
} from './chat.styles';

const QuickReplies = ({ replies = [], onQuickReply }) => {
  return (
    <QuickRepliesContainer>
      <RepliesWrapper>
        {replies.map((reply) => (
          <QuickReplyButton
            key={reply.key}
            type="button"
            onClick={() => onQuickReply(reply)}
          >
            {reply.text}
          </QuickReplyButton>
        ))}
      </RepliesWrapper>
    </QuickRepliesContainer>
  );
};

export default QuickReplies;
