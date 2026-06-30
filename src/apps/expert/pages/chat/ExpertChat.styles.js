import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const shimmer = keyframes`
  0%, 100% { background-position: 0% 0%; }
  50% { background-position: 100% 0%; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

/* 🔥 PAGE WRAP - Premium gradient background */
export const PageWrap = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: var(--chat-height, 100dvh);
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: 
    radial-gradient(ellipse at 0% 0%, rgba(0, 0, 128, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 100% 100%, rgba(0, 0, 128, 0.05) 0%, transparent 50%),
    #e8edf5;
`;

/* LAYOUT */
export const ChatLayout = styled.div`
  flex: 1;
  display: flex;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

/* 🔥 PANEL - Full screen on all devices */
export const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
`;

/* 🔥 HEADER - Premium with gradient accent */
export const UserHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 8px 16px;
  padding-top: max(8px, env(safe-area-inset-top));
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  flex-shrink: 0;
  min-height: 56px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #000080, #4a4a8a, #000080);
    background-size: 200% 100%;
    animation: ${shimmer} 3s ease-in-out infinite;
  }
`;

/* USER INFO - Compact */
export const UserInfo = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex: 1;
  min-width: 0;
`;

export const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(0, 0, 128, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

export const AvatarPlaceholder = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #000080, #4a4a8a);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 128, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
`;

export const UserMeta = styled.div`
  flex: 1;
  min-width: 0;
  
  h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: #1a1a2e;
    letter-spacing: -0.2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-details {
    display: flex;
    gap: 8px;
    margin-top: 1px;
    flex-wrap: nowrap;
    overflow: hidden;
  }

  .detail-item {
    font-size: 11px;
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 3px;
    background: rgba(0, 0, 0, 0.04);
    padding: 1px 8px 1px 6px;
    border-radius: 10px;
    white-space: nowrap;
    transition: background 0.2s;

    &:hover {
      background: rgba(0, 0, 128, 0.08);
    }

    svg {
      width: 10px;
      height: 10px;
      opacity: 0.6;
      flex-shrink: 0;
    }
  }
`;

/* CHAT AREA */
export const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  background: 
    radial-gradient(ellipse at 50% 0%, rgba(0, 0, 128, 0.03) 0%, transparent 70%);
`;

/* 🔥 MESSAGES - Fixed spacing */
export const Messages = styled.div`
  flex: 1;
  padding-top: 20px;
  padding-bottom: 20px;
  overflow-y: auto;
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  height: 0;
  
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  scrollbar-gutter: stable;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 128, 0.2);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 128, 0.3);
  }

  background-image: 
    radial-gradient(circle at 20% 50%, rgba(0, 0, 128, 0.02) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(0, 0, 128, 0.02) 0%, transparent 50%);
`;

/* 🔥 INPUT STACK - Premium glass effect */
export const InputStack = styled.div`
  position: sticky;
  bottom: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.06);
`;

/* 🔥 IMAGE PREVIEW - Enhanced */
export const ImagePreview = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 16px;
  background: rgba(248, 250, 252, 0.95);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.3s ease;
  
  img {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    object-fit: cover;
    border: 2px solid rgba(0, 0, 128, 0.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }
  
  span {
    font-size: 13px;
    color: #374151;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
  }
  
  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    color: #9ca3af;
    border-radius: 50%;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background: #fef2f2;
      color: #ef4444;
      transform: rotate(90deg);
    }
  }
`;

/* 🔥 TYPING INDICATOR - Animated */
export const TypingIndicator = styled.div`
  min-height: 30px;
  padding: 4px 16px;
  font-size: 13px;
  color: #6b7280;
  background: rgba(248, 250, 252, 0.95);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  &::before {
    content: '● ● ●';
    letter-spacing: 4px;
    font-size: 10px;
    color: #000080;
    animation: ${pulse} 1.4s ease-in-out infinite;
  }

  &::after {
    content: 'typing...';
    opacity: 0.7;
    font-style: normal;
  }
`;

/* 🔥 INPUT WRAP - Premium input area */
export const ChatInputWrap = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 6px 12px;
  background: transparent;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-bottom: max(6px, env(safe-area-inset-bottom));

  @media (min-width: 1024px) {
    padding: 6px 16px;
  }
`;

/* 🔥 INPUT - Premium WhatsApp-style */
export const ChatInput = styled.textarea`
  flex: 1;
  min-height: 20px;
  max-height: 100px;
  padding: 6px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  line-height: 20px;
  resize: none;
  overflow-y: auto;
  background: #fafbfc;
  color: #1a1a2e;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;

  &::placeholder {
    color: #9ca3af;
    font-size: 14px;
    font-weight: 400;
  }

  &:focus {
    outline: none;
    border-color: #000080;
    background: #ffffff;
    box-shadow: 0 0 0 3px rgba(0, 0, 128, 0.06);
    transform: translateY(-1px);
  }

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
    opacity: 0.7;
  }

  scroll-behavior: smooth;
`;

/* 🔥 ATTACH BUTTON - Premium with hover effect */
export const AttachButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #6b7280;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  position: relative;

  &:hover:not(:disabled) {
    background: rgba(0, 0, 128, 0.06);
    color: #000080;
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }

  &:active:not(:disabled) {
    transform: scale(0.92);
  }

  &::after {
    content: 'Attach';
    position: absolute;
    bottom: -28px;
    left: 50%;
    transform: translateX(-50%);
    background: #1a1a2e;
    color: white;
    padding: 2px 10px;
    border-radius: 6px;
    font-size: 10px;
    font-weight: 500;
    opacity: 0;
    pointer-events: none;
    transition: all 0.2s;
    white-space: nowrap;
  }

  &:hover:not(:disabled)::after {
    opacity: 1;
    transform: translateX(-50%) translateY(-2px);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

/* 🔥 SEND BUTTON - Premium gradient with pulse */
export const SendButton = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #000080, #4a4a8a);
  color: #ffffff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 128, 0.25);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transform: skewX(-25deg);
    transition: all 0.6s;
  }

  &:hover:not(:disabled)::before {
    left: 100%;
  }

  &:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 6px 24px rgba(0, 0, 128, 0.35);
  }

  &:active:not(:disabled) {
    transform: scale(0.92);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.2s;
  }

  &:hover:not(:disabled) svg {
    transform: translateX(2px);
  }

  ${({ $hasUnread }) => $hasUnread && `
    &::after {
      content: '';
      position: absolute;
      top: -2px;
      right: -2px;
      width: 12px;
      height: 12px;
      background: #ef4444;
      border-radius: 50%;
      border: 2px solid white;
      animation: ${pulse} 1.5s ease-in-out infinite;
    }
  `}
`;

/* 🔥 MESSAGE - Premium with smooth animations */
export const Message = styled.div`
  display: flex;
  justify-content: ${({ $expert }) =>
    $expert ? "flex-end" : "flex-start"};
  animation: ${fadeIn} 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 1px;
  padding: 0 2px;
`;

export const Bubble = styled.div`
  max-width: min(78%, 720px);
  padding: 6px 12px;
  border-radius: ${({ $expert }) =>
    $expert 
      ? "16px 16px 4px 16px"
      : "16px 16px 16px 4px"};
  background: ${({ $expert }) =>
    $expert 
      ? "linear-gradient(135deg, #000080, #1a1a5e)" 
      : "rgba(255, 255, 255, 0.95)"};
  color: ${({ $expert }) =>
    $expert ? "#ffffff" : "#1a1a2e"};
  box-shadow: ${({ $expert }) =>
    $expert 
      ? "0 2px 12px rgba(0, 0, 128, 0.15)" 
      : "0 1px 4px rgba(0, 0, 0, 0.04)"};
  word-wrap: break-word;
  position: relative;
  backdrop-filter: ${({ $expert }) => $expert ? 'none' : 'blur(10px)'};
  border: ${({ $expert }) => $expert ? "none" : "1px solid rgba(0, 0, 0, 0.04)"};
  transition: all 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ $expert }) =>
      $expert 
        ? "0 4px 16px rgba(0, 0, 128, 0.2)" 
        : "0 2px 8px rgba(0, 0, 0, 0.06)"};
  }

  img {
    max-width: 100%;
    max-height: 250px;
    border-radius: 8px;
    margin-bottom: ${({ $hasText }) => $hasText ? "4px" : "0"};
    object-fit: cover;
    display: block;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s;

    &:hover {
      transform: scale(1.02);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
  }

  .time {
    font-size: 9px;
    opacity: ${({ $expert }) => ($expert ? "0.8" : "0.5")};
    text-align: right;
    margin-top: 3px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 3px;
    font-weight: 400;
    letter-spacing: 0.2px;

    svg {
      opacity: 0.6;
    }
  }

  .seen-indicator {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    color: ${({ $expert }) => ($expert ? "#8b8bff" : "#6b7280")};
    font-size: 9px;
  }
`;

/* 🔥 STATES - Enhanced */
export const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 16px;
  color: #6b7280;
  gap: 16px;

  &::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 3px solid rgba(0, 0, 128, 0.1);
    border-top-color: #000080;
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
  }
`;

export const NoChatSelected = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #6b7280;
  gap: 14px;
  padding: 20px;

  svg {
    color: rgba(0, 0, 128, 0.2);
  }

  h3 {
    font-weight: 600;
    margin: 0;
    font-size: 18px;
    color: #374151;
  }

  p {
    color: #9ca3af;
    font-size: 14px;
    margin: 0;
    max-width: 300px;
    text-align: center;
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #ef4444;
  gap: 14px;
  padding: 20px;

  svg {
    opacity: 0.5;
  }

  h3 {
    font-weight: 600;
    margin: 0;
    font-size: 18px;
    color: #1a1a2e;
  }

  p {
    color: #6b7280;
    font-size: 14px;
    margin: 0;
  }

  button {
    padding: 10px 28px;
    background: linear-gradient(135deg, #000080, #4a4a8a);
    color: #fff;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s;
    box-shadow: 0 4px 16px rgba(0, 0, 128, 0.2);
    margin-top: 8px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(0, 0, 128, 0.3);
    }

    &:active {
      transform: scale(0.98);
    }
  }
`;

export const EmptyChatMessage = styled.div`
  text-align: center;
  color: #6b7280;
  font-size: 15px;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  span:first-child {
    font-size: 48px;
    display: block;
    opacity: 0.6;
  }

  span:last-child {
    font-size: 14px;
    color: #9ca3af;
  }
`;

/* EMPTY EXPORTS (DON'T REMOVE) */
export const PopoverContainer = styled.div``;
export const ProfileDropdownContainer = styled.div``;
export const BackButton = styled.button``;