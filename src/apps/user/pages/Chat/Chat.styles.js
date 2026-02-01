// Chat.styles.js - HEADER FIXED + ALL STYLES
import styled, { createGlobalStyle } from "styled-components";

// Chat.jsx में ChatGlobalStyle update करें:

export const ChatGlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body, html, #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  }
  
  /* ✅ Hide footer when chat is active */
  .main-layout footer {
    display: none !important;
  }
  
  /* ✅ Also hide any other unwanted elements */
  .footer,
  footer,
  [class*="footer"],
  [id*="footer"] {
    display: none !important;
  }
  
  /* ✅ Ensure chat takes full height */
  .main-layout {
    height: 100vh !important;
  }
  
  .main-layout > main {
    height: 100vh !important;
    overflow: hidden !important;
  }
`;

// ✅ FIXED: PageWrap with proper dimensions
export const PageWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 90vh;
  width: 100vw;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  bottom: 0px;
`;

// ✅ FIXED: Header with sticky positioning
export const Header = styled.div`
  height: 70px;
  min-height: 70px;
  padding: 0 24px;
  background: white;
  border-bottom: 2px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  z-index: 1000;
  position: sticky;
  top: 0;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
  
  /* Ensure it stays on top of everything */
  & > * {
    flex-shrink: 0;
  }
`;

export const ExpertInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 0;
  
  .expert-name {
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .expert-role {
    font-size: 12px;
    color: #475569;
    font-weight: 500;
  }

  .status {
    font-size: 11px;
    color: #059669;
    font-weight: 600;
  }
`;

export const AvatarWrapper = styled.div`
  position: relative;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
`;

export const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const StatusDot = styled.span`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: ${props => props.$active ? "green" : "red"};
  border-radius: 50%;
  border: 2px solid white;
  z-index: 2;
`;

// ✅ Messages area takes remaining space
export const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px 20px 10px 20px;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

export const MessageRow = styled.div`
  display: flex;
  margin-bottom: 16px;
  width: 100%;

  &.user { 
    justify-content: flex-end; 
    align-self: flex-end;
  }
  &.expert { 
    justify-content: flex-start; 
    align-self: flex-start;
  }
`;

export const MessageBubble = styled.div`
  max-width: 70%;
  display: flex;
  flex-direction: column;

  &.expert .message-text {
    background: white;
    color: #1e293b;
    border: 1px solid #e2e8f0;
    border-radius: 18px 18px 18px 6px;
    padding: 14px 18px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    word-break: break-word;
    line-height: 1.5;
    font-size: 15px;
  }

  &.user .message-text {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    border-radius: 18px 18px 6px 18px;
    padding: 14px 18px;
    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
    word-break: break-word;
    line-height: 1.5;
    font-size: 15px;
  }
`;

export const MessageTime = styled.div`
  font-size: 11px;
  color: #94a3b8;
  margin-top: 6px;
  padding: 0 4px;
  font-weight: 500;
  display: flex;
  align-items: center;
`;

export const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  background: #f1f5f9;
  border-radius: 18px 18px 18px 6px;
  border: 1px solid #e2e8f0;
  max-width: 200px;

  .dots {
    display: flex;
    gap: 4px;
    span {
      width: 8px;
      height: 8px;
      background: #3b82f6;
      border-radius: 50%;
      animation: typing 1.4s infinite ease-in-out;
    }
    span:nth-child(2) { animation-delay: 0.2s; }
    span:nth-child(3) { animation-delay: 0.4s; }
  }

  div {
    font-size: 13px;
    color: #475569;
    font-weight: 500;
  }

  @keyframes typing {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-4px); opacity: 1; }
  }
`;

// ✅ Input bar fixed at bottom
export const InputBar = styled.div`
  height: 80px;
  min-height: 80px;
  padding: 0 24px;
  background: white;
  border-top: 2px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
  z-index: 999;
  position: relative;
`;

export const UploadButton = styled.button`
  width: 46px;
  height: 46px;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 12px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    border-color: #3b82f6;
    background: #f0f9ff;
    color: #3b82f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const FileUploadMenu = styled.div`
  position: absolute;
  bottom: 90px;
  left: 24px;
  background: white;
  border-radius: 14px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  padding: 10px 0;
  min-width: 160px;
  z-index: 1001;
  overflow: hidden;

  .menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 18px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
    color: #374151;

    &:hover {
      background: #f8fafc;
      color: #1e293b;
    }

    svg {
      flex-shrink: 0;
    }
  }
`;

export const InputBox = styled.input`
  flex: 1;
  min-width: 0;
  padding: 14px 20px;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 24px;
  color: #1e293b;
  font-size: 15px;
  font-weight: 500;
  outline: none;
  transition: all 0.3s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: white;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SendButton = styled.button`
  width: 48px;
  height: 48px;
  border: none;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 12px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
  font-size: 16px;
  font-weight: 500;
`;

export const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #dc2626;
  text-align: center;
  padding: 40px 20px;
  gap: 20px;

  svg { 
    opacity: 0.7; 
    color: #dc2626;
  }
  
  h3 { 
    margin: 0; 
    color: #dc2626;
    font-size: 18px;
  }
  
  button {
    padding: 12px 24px;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    transition: all 0.3s;

    &:hover {
      background: #dc2626;
      transform: translateY(-1px);
    }
  }
`;

export const EmptyChatMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
  text-align: center;
  padding: 40px 20px;
  gap: 16px;

  h3 {
    color: #1e293b;
    font-size: 20px;
    margin: 0;
  }

  p {
    font-size: 15px;
    max-width: 300px;
    line-height: 1.5;
  }
`;

export const EndChatButton = styled.button`
  padding: 10px 14px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-weight: 600;

  &:hover:not(:disabled) {
    background: #dc2626;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }
`;

export const CallButton = styled.button`
  width: 48px;
  height: 48px;
  border: none;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 12px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const NoMessages = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #64748b;
  font-size: 16px;
  text-align: center;
  padding: 40px 20px;
`;