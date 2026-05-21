// components/ai-chat/chat.styles.js
import styled, { keyframes } from 'styled-components';

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
  background: #000080;
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
  width: min(420px, calc(100vw - 2rem));
  height: min(650px, calc(100vh - 7rem));
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
  left: 0;
  right: 0;
  bottom: 0;
  top: auto;
  z-index: 99999;
  background: white;
  display: flex;
  flex-direction: column;
  height: min(88vh, 720px);
  border-radius: 1rem 1rem 0 0;
  box-shadow: 0 -18px 45px rgba(15, 23, 42, 0.18);
  animation: ${slideUp} 0.3s ease-out;

  @media (min-width: 768px) {
    display: none;
  }
`;

// Header Styles
export const Header = styled.div`
  background: #000080;
  color: white;
  padding: 0.875rem 1rem;
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
  min-width: 0;
`;

export const Avatar = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  background: white;
  color: #000080;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
`;

export const HeaderInfo = styled.div`
  min-width: 0;
`;

export const HeaderTitle = styled.h2`
  font-weight: 600;
  font-size: 1rem;
  margin: 0;
  line-height: 1.2;
  color:#ffffff;
`;

export const HeaderStatus = styled.p`
  font-size: 0.75rem;
  opacity: 0.9;
  margin: 0;
  line-height: 1.3;
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
  font-size: 0.75rem;
  font-weight: 600;

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
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  background: #000080;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
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
  background: ${props => props.isUser ? '#000080' : '#f3f4f6'};
  color: ${props => props.isUser ? 'white' : '#1f2937'};
  border-bottom-${props => props.isUser ? 'right' : 'left'}-radius: 0;
`;

export const MessageText = styled.p`
  font-size: 0.875rem;
  white-space: pre-wrap;
  margin: 0;
  line-height: 1.5;
`;

export const MessageLink = styled.a`
  color: #000080;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 0.15rem;
  overflow-wrap: anywhere;
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
  width: 100%;
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
  max-width: 100%;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

export const ExpertCardInner = styled.div`
  display: flex;
  gap: 0.75rem;
  min-width: 0;
`;

export const ExpertAvatar = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  object-fit: cover;
`;

export const ExpertInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ExpertName = styled.h4`
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ExpertExpertise = styled.p`
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0 0 0.25rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ExpertMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
  flex-wrap: wrap;
`;

export const ExpertRating = styled.span`
  font-size: 0.75rem;
  color: #eab308;
`;

export const ExpertPrice = styled.span`
  font-size: 0.75rem;
  color: #10b981;
`;

export const OnlineStatus = styled.span`
  display: inline-flex;
  margin-top: 0.35rem;
  color: #047857;
  background: #ecfdf5;
  border-radius: 9999px;
  padding: 0.125rem 0.5rem;
  font-size: 0.6875rem;
  font-weight: 600;
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
  color: #000080;
  background: transparent;
  border: 1px solid #000080;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #eef2ff;
  }
`;

export const CtaButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid #000080;
  color: #000080;
  background: #ffffff;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #eef2ff;
  }
`;

// Quick Replies Styles
export const QuickRepliesContainer = styled.div`
  padding: 0.75rem 1rem;
  border-top: 1px solid #f3f4f6;
  overflow: hidden;
`;

export const RepliesWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const QuickReplyButton = styled.button`
  flex: 0 1 auto;
  min-height: 2.25rem;
  max-width: 100%;
  padding: 0.425rem 0.75rem;
  font-size: 0.8125rem;
  color: #000080;
  background: #f5f7ff;
  border: 1px solid #dbe3ff;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: normal;
  text-align: left;

  &:hover {
    background: #eef2ff;
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
  min-width: 0;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #000080;
    box-shadow: 0 0 0 2px rgba(0, 0, 128, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SendButton = styled.button`
  padding: 0.5rem 1rem;
  background: #000080;
  color: white;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;

  &:hover:not(:disabled) {
    background: #000066;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SkeletonCard = styled.div`
  display: grid;
  grid-template-columns: 3rem 1fr;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  background: #ffffff;
`;

export const SkeletonAvatar = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  background: linear-gradient(90deg, #eef2f7 25%, #f8fafc 50%, #eef2f7 75%);
  background-size: 200% 100%;
  animation: ${pulse} 1.2s ease-in-out infinite;
`;

export const SkeletonLine = styled.div`
  width: ${(props) => props.$width || '100%'};
  height: 0.75rem;
  margin: 0.25rem 0;
  border-radius: 9999px;
  background: linear-gradient(90deg, #eef2f7 25%, #f8fafc 50%, #eef2f7 75%);
  background-size: 200% 100%;
  animation: ${pulse} 1.2s ease-in-out infinite;
`;
