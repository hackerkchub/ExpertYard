import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useChatStore from '../../stores/chatStore';
import ExpertRecommendationCards from './ExpertRecommendationCards';
import {
  MessageWrapper,
  Bubble,
  MessageText,
  MessageLink,
  Timestamp,
  CtaButton,
} from './chat.styles';

const linkPattern = /(https?:\/\/[^\s]+|\/(?:user\/)?(?:categories|subcategories|experts)[^\s]*)/g;

const MessageBubble = ({ message }) => {
  const navigate = useNavigate();
  const closeChat = useChatStore((state) => state.closeChat);
  const sendIntentSuggestion = useChatStore((state) => state.sendIntentSuggestion);
  const isUser = message.role === 'user';

  const handleCta = useCallback(() => {
    if (message.cta?.intent) {
      sendIntentSuggestion(message.cta.intent);
      return;
    }

    if (message.cta?.path) {
      closeChat();
      navigate(message.cta.path);
    }
  }, [closeChat, message.cta, navigate, sendIntentSuggestion]);

  const handleMessageLink = useCallback(
    (event, href) => {
      let targetPath = href;

      try {
        const url = href.startsWith('http') ? new URL(href) : null;
        if (url) {
          targetPath = `${url.pathname}${url.search}${url.hash}`;
        }
      } catch {
        targetPath = href;
      }

      if (
        targetPath.startsWith('/user/categories') ||
        targetPath.startsWith('/user/subcategories') ||
        targetPath.startsWith('/user/experts') ||
        targetPath.startsWith('/categories') ||
        targetPath.startsWith('/subcategories') ||
        targetPath.startsWith('/experts')
      ) {
        event.preventDefault();
        closeChat();
        navigate(targetPath);
      }
    },
    [closeChat, navigate]
  );

  const renderContent = () => {
    const content = String(message.content || '');
    const parts = content.split(linkPattern);

    return parts.map((part, index) => {
      if (!part.match(linkPattern)) return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;

      return (
        <MessageLink
          key={`${part}-${index}`}
          href={part}
          onClick={(event) => handleMessageLink(event, part)}
        >
          {part}
        </MessageLink>
      );
    });
  };

  if (message.type === 'experts') {
    return <ExpertRecommendationCards experts={message.experts} />;
  }

  return (
    <MessageWrapper isUser={isUser}>
      <Bubble isUser={isUser}>
        <MessageText>{renderContent()}</MessageText>
        {message.cta && (
          <CtaButton type="button" onClick={handleCta}>
            {message.cta.label}
          </CtaButton>
        )}
        <Timestamp>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Timestamp>
      </Bubble>
    </MessageWrapper>
  );
};

export default MessageBubble;
