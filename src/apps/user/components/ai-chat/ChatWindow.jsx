import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import useChatStore from '../../stores/chatStore';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import QuickReplies from './QuickReplies';
import {
  ChatWindowDesktop,
  ChatWindowMobile,
  InputForm,
  InputContainer,
  ChatInput,
  SendButton,
} from './chat.styles';

const ChatWindow = () => {
  const { messages, isLoading, sendMessage, sendIntentSuggestion, closeChat } = useChatStore();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const lastSendAtRef = useRef(0);

  const intentSuggestions = useMemo(
    () => [
      {
        key: 'relationship-help',
        text: 'Relationship help',
        value: 'I need relationship help',
        categoryKeywords: [
          'marriage-bureau-and-relationship-consultant',
          'marriage bureau and relationship consultant',
        ],
        subCategoryKeywords: ['marriage', 'love', 'relationship', 'couple', 'dating'],
      },
      {
        key: 'career-guidance',
        text: 'Career guidance',
        value: 'I want career guidance',
        categoryKeywords: [
          'career-roadmap-consultant',
          'job-and-career-gateway-consultant',
          'career roadmap consultant',
          'job and career gateway consultant',
        ],
        subCategoryKeywords: ['career roadmap', 'job support', 'career', 'interview', 'resume'],
      },
      {
        key: 'stressed',
        text: 'I am stressed',
        value: 'I am stressed',
        categoryKeywords: [
          'wellness-nutrition-and-fitness-consulting',
          'doctor-and-medical-consultant',
          'wellness nutrition and fitness consulting',
          'doctor and medical consultant',
        ],
        subCategoryKeywords: ['mental wellness', 'stress', 'emotional support', 'counselling', 'therapy'],
      },
      {
        key: 'legal-advice',
        text: 'Legal advice',
        value: 'I need legal advice',
        categoryKeywords: ['lawyer-and-legal-consultant', 'lawyer and legal consultant'],
        subCategoryKeywords: ['legal advice', 'lawyer', 'family law', 'civil', 'criminal'],
      },
      {
        key: 'business-consultation',
        text: 'Business consultation',
        value: 'I need business consultation',
        categoryKeywords: [
          'it-and-technology-consultant',
          'digital-marketing-and-seo-consultant',
          'financial-advisor-consultation',
          'it and technology consultant',
          'digital marketing and seo consultant',
          'financial advisor consultation',
        ],
        subCategoryKeywords: ['business consultant', 'startup', 'business', 'marketing', 'sales'],
      },
      {
        key: 'fitness-guidance',
        text: 'Fitness guidance',
        value: 'I want fitness guidance',
        categoryKeywords: [
          'gym-and-personal-training-consultation',
          'wellness-nutrition-and-fitness-consulting',
          'gym and personal training consultation',
          'wellness nutrition and fitness consulting',
        ],
        subCategoryKeywords: ['fitness', 'gym', 'diet', 'weight loss', 'nutrition'],
      },
      {
        key: 'breakup-move-on',
        text: 'Move on after breakup',
        value: 'I need help moving on after breakup',
        categoryKeywords: ['heartbreak-and-move-on-consultation', 'heartbreak and move on consultation'],
        subCategoryKeywords: ['heartbreak', 'move on', 'breakup', 'relationship'],
      },
      {
        key: 'parenting-advice',
        text: 'Parenting advice',
        value: 'I want parenting advice',
        categoryKeywords: ['parenting-and-child-care-consultation', 'parenting and child care consultation'],
        subCategoryKeywords: ['parenting', 'child care', 'children', 'parent advice'],
      },
    ],
    []
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || isLoading) return;
    const now = Date.now();
    if (now - lastSendAtRef.current < 500) return;
    lastSendAtRef.current = now;

    const message = inputMessage;
    setInputMessage('');

    await sendMessage(message);
  };

  const handleQuickReply = useCallback((reply) => {
    sendIntentSuggestion(reply);
  }, [sendIntentSuggestion]);

  const showSuggestions = messages.length === 0 && !inputMessage.trim() && !isLoading;

  return (
    <>
      <ChatWindowDesktop>
        <ChatHeader onClose={closeChat} />

        <MessageList messagesEndRef={messagesEndRef} />

        {showSuggestions && (
          <QuickReplies replies={intentSuggestions} onQuickReply={handleQuickReply} />
        )}

        <InputForm onSubmit={handleSend}>
          <InputContainer>
            <ChatInput
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              autoFocus
            />

            <SendButton
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
            >
              {isLoading ? '...' : 'Send'}
            </SendButton>
          </InputContainer>
        </InputForm>
      </ChatWindowDesktop>

      <ChatWindowMobile>
        <ChatHeader onClose={closeChat} />

        <MessageList messagesEndRef={messagesEndRef} />

        {showSuggestions && (
          <QuickReplies replies={intentSuggestions} onQuickReply={handleQuickReply} />
        )}

        <InputForm onSubmit={handleSend}>
          <InputContainer>
            <ChatInput
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              autoFocus
            />

            <SendButton
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
            >
              {isLoading ? '...' : 'Send'}
            </SendButton>
          </InputContainer>
        </InputForm>
      </ChatWindowMobile>
    </>
  );
};

export default ChatWindow;
