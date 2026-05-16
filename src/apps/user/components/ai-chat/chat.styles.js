// components/ai-chat/chat.styles.js
import styled, { keyframes, css } from 'styled-components';

// Animations
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const bounce = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

// Common Components
export const Container = styled.div`
  position: fixed;
  z-index: 99999;
`;

// Chat Launcher Styles
export const LauncherButton = styled.button`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background: linear-gradient(135deg, #9333ea 0%, #db2777 100%);
  color: white;
  border-radius: 9999px;
  padding: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  z-index: 99999;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
    padding: 0.875rem;
  }
`;

export const ButtonContent = styled.div`
  position: relative;
`;

export const ButtonText = styled.span`
  font-size: 1.5rem;
`;

export const AskText = styled.span`
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
`;

export const UnreadBadge = styled.span`
  position: absolute;
  top: -0.5rem;
  right: -1.5rem;
  background-color: #ef4444;
  color: white;
  font-size: 0.75rem;
  border-radius: 9999px;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 1s infinite;
`;

// Chat Window Styles
export const ChatWindowDesktop = styled.div`
  position: fixed;
  bottom: 6rem;
  right: 1.5rem;
  z-index: 99999;
  width: 380px;
  height: 650px;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  animation: ${slideIn} 0.3s ease-out;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const ChatWindowMobile = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: white;
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.3s ease-out;

  @media (min-width: 768px) {
    display: none;
  }
`;

// Header Styles
export const Header = styled.div`
  background: linear-gradient(135deg, #9333ea 0%, #db2777 100%);
  color: white;
  padding: 1rem;
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const Avatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  background: white;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
`;

export const HeaderInfo = styled.div``;

export const HeaderTitle = styled.h2`
  font-weight: 600;
  font-size: 1rem;
  margin: 0;
`;

export const HeaderStatus = styled.p`
  font-size: 0.75rem;
  opacity: 0.9;
  margin: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const IconButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 9999px;
  transition: all 0.2s;
  font-size: 1rem;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

// Message List Styles
export const MessageListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #c4b5fd;
    border-radius: 3px;
  }
`;

export const EmptyState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
`;

export const EmptyStateContent = styled.div`
  text-align: center;
  color: #6b7280;
`;

export const EmptyStateEmoji = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #374151;
`;

export const EmptyStateText = styled.p`
  font-size: 0.875rem;
`;

// Message Bubble Styles
export const MessageWrapper = styled.div`
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
`;

export const Bubble = styled.div`
  max-width: 80%;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  background: ${props => props.isUser ? '#9333ea' : '#f3f4f6'};
  color: ${props => props.isUser ? 'white' : '#1f2937'};
  border-bottom-${props => props.isUser ? 'right' : 'left'}-radius: 0;
`;

export const MessageText = styled.p`
  font-size: 0.875rem;
  white-space: pre-wrap;
  margin: 0;
  line-height: 1.5;
`;

export const Timestamp = styled.span`
  font-size: 0.75rem;
  opacity: 0.7;
  display: block;
  margin-top: 0.25rem;
`;

// Typing Indicator Styles
export const TypingWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;

export const TypingBubble = styled.div`
  background: #f3f4f6;
  border-radius: 1rem;
  border-bottom-left-radius: 0;
  padding: 0.75rem 1rem;
`;

export const DotsContainer = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const Dot = styled.span`
  width: 0.5rem;
  height: 0.5rem;
  background: #9ca3af;
  border-radius: 50%;
  animation: ${bounce} 1.4s infinite ease-in-out both;
  animation-delay: ${props => props.delay};

  &:nth-child(1) {
    animation-delay: -0.32s;
  }
  &:nth-child(2) {
    animation-delay: -0.16s;
  }
`;

export const TypingText = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
  margin-left: 0.5rem;
`;

// Expert Card Styles
export const ExpertsContainer = styled.div`
  margin: 1rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ExpertsTitle = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin: 0;
`;

export const ExpertCardContainer = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

export const ExpertCardInner = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const ExpertAvatar = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  object-fit: cover;
`;

export const ExpertInfo = styled.div`
  flex: 1;
`;

export const ExpertName = styled.h4`
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
`;

export const ExpertExpertise = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0 0 0.25rem 0;
`;

export const ExpertMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
`;

export const ExpertRating = styled.span`
  font-size: 0.75rem;
  color: #eab308;
`;

export const ExpertPrice = styled.span`
  font-size: 0.75rem;
  color: #10b981;
`;

export const CardButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

export const ViewProfileButton = styled.button`
  flex: 1;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #9333ea;
  background: transparent;
  border: 1px solid #9333ea;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f3e8ff;
  }
`;

// Quick Replies Styles
export const QuickRepliesContainer = styled.div`
  padding: 0.75rem 1rem;
  border-top: 1px solid #f3f4f6;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c4b5fd;
    border-radius: 2px;
  }
`;

export const RepliesWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const QuickReplyButton = styled.button`
  flex-shrink: 0;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  color: #9333ea;
  background: #f3e8ff;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: #e9d5ff;
  }
`;

// Input Form Styles
export const InputForm = styled.form`
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  background: white;
`;

export const InputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const ChatInput = styled.input`
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #9333ea;
    box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SendButton = styled.button`
  padding: 0.5rem 1rem;
  background: #9333ea;
  color: white;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;

  &:hover:not(:disabled) {
    background: #7e22ce;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;