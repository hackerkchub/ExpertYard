// src/apps/user/pages/chat/Chat.styles.js
import styled, { createGlobalStyle, keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

export const ChatGlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #f4f2ee;
  }

  /* Hide navbar and spacer */
  nav, 
  header, 
  .main-layout footer, 
  .footer,
  [class*="NavbarSpacer"],
  header + div { 
    display: none !important;
  }

  .sc-nav, .nav-container { 
    display: none !important;
  }
  
  /* Popup styles */
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: ${fadeIn} 0.3s ease;
  }
  
  .popup-content {
    background: white;
    padding: 40px;
    border-radius: 20px;
    max-width: 400px;
    width: 90%;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    animation: ${slideIn} 0.3s ease;
    
    @media (max-width: 480px) {
      padding: 30px 20px;
    }
  }
  
  .popup-icon {
    color: #ef4444;
    margin-bottom: 20px;
  }
  
  .popup-content h2 {
    color: #1e293b;
    margin-bottom: 16px;
    font-size: 24px;
    
    @media (max-width: 480px) {
      font-size: 20px;
    }
  }
  
  .popup-content p {
    color: #64748b;
    margin-bottom: 32px;
    font-size: 16px;
    line-height: 1.5;
  }
  
  .popup-button {
    background: #000080;
    color: white;
    border: none;
    padding: 12px 32px;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    transition: all 0.2s;
    
    &:hover {
      background: #000066;
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
`;

export const PageWrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
height: -webkit-fill-available;
  width: 100%;
  background: #f4f2ee;
  position: fixed;
  inset: 0;
  z-index: 9999;
`;

export const Header = styled.div`
  min-height: 60px;
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  flex-shrink: 0;
  gap: 12px;
  
  @media (max-width: 768px) {
    padding: 8px 12px;
    min-height: 56px;
  }
`;

export const MobileBackButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  color: #1e293b;
  transition: all 0.2s;
  flex-shrink: 0;
  
  &:hover {
    background: #f1f5f9;
  }
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const ExpertInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
  
  .expert-details {
    min-width: 0;
    flex: 1;
  }
  
  .expert-name {
    font-size: 15px;
    font-weight: 600;
    color: #1e293b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    
    @media (min-width: 768px) {
      font-size: 16px;
    }
  }
  
  .expert-position {
    font-size: 12px;
    font-weight: 400;
    color: #64748b;
    
    @media (max-width: 480px) {
      display: none;
    }
  }
  
  .status {
    font-size: 11px;
    font-weight: 500;
    margin-top: 2px;
    
    @media (min-width: 768px) {
      font-size: 12px;
    }
  }
`;

export const AvatarWrapper = styled.div`
  position: relative;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

export const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

export const AvatarPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #000080, #1a1a8e);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const StatusDot = styled.span`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: ${props => props.$active ? "#10b981" : "#ef4444"};
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

export const TimerDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${props => props.$color === '#ef4444' ? '#fef2f2' : '#f0fdf4'};
  padding: 6px 12px;
  border-radius: 24px;
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.$color || '#10b981'};
  white-space: nowrap;
  border: 1px solid ${props => props.$color || '#10b981'};
  
  @media (max-width: 480px) {
    padding: 4px 8px;
    font-size: 11px;
    gap: 4px;
  }
`;

export const UnlimitedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #ecfdf5;
  padding: 6px 12px;
  border-radius: 24px;
  font-size: 13px;
  font-weight: 600;
  color: #10b981;
  white-space: nowrap;
  
  @media (max-width: 480px) {
    padding: 4px 8px;
    font-size: 11px;
    gap: 4px;
  }
`;

export const EndChatButton = styled.button`
  background: ${props => props.$active ? '#ef4444' : '#cbd5e1'};
  color: white;
  border: none;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.$active ? 'pointer' : 'not-allowed'};
  flex-shrink: 0;
  transition: all 0.2s;
  width: 36px;
  height: 36px;
  
  &:hover {
    background: ${props => props.$active ? '#dc2626' : '#cbd5e1'};
    transform: ${props => props.$active ? 'scale(1.05)' : 'none'};
  }
  
  &:active {
    transform: ${props => props.$active ? 'scale(0.95)' : 'none'};
  }
  
  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

export const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: #f8fafc;
  -webkit-overflow-scrolling: touch;
  
  @media (max-width: 768px) {
    padding: 12px;
  }
`;

export const MessageRow = styled.div`
  display: flex;
  margin-bottom: 12px;
  width: 100%;
  justify-content: ${props => props.$senderType === 'user' ? 'flex-end' : 'flex-start'};
  animation: ${fadeIn} 0.2s ease-out;
`;

export const MessageBubble = styled.div`
  max-width: 75%;
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.5;
  background: ${props => props.$senderType === 'user' ? '#000080' : 'white'};
  color: ${props => props.$senderType === 'user' ? 'white' : '#1e293b'};
  border-radius: ${props => props.$senderType === 'user' 
    ? '18px 18px 4px 18px' 
    : '18px 18px 18px 4px'};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  word-wrap: break-word;
  
  @media (max-width: 768px) {
    max-width: 85%;
    padding: 8px 12px;
    font-size: 15px;
  }
  
  .message-text {
    margin-bottom: 4px;
  }
`;

export const MessageTime = styled.div`
  font-size: 9px;
  margin-top: 4px;
  opacity: 0.7;
  text-align: right;
`;

export const InputBar = styled.div`
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  position: sticky;
  padding-bottom: calc(10px + env(safe-area-inset-bottom));
  transition: all 0.2s;
  
  @media (max-width: 768px) {
    padding: 8px 12px;
    gap: 8px;
  }
`;

export const InputBox = styled.input`
  flex: 1;
  height: 44px;
  padding: 0 16px;
  background: #f1f5f9;
  border: 1.5px solid transparent;
  border-radius: 24px;
  font-size: 15px;
  outline: none;
  width: 100%;
  transition: all 0.2s;
  
  @media (max-width: 768px) {
    height: 40px;
    font-size: 16px;
    padding: 0 14px;
  }
  
  &:focus {
    background: white;
    border-color: #000080;
    box-shadow: 0 0 0 3px rgba(0, 0, 128, 0.1);
  }
  
  &:disabled {
    background: #f8fafc;
    color: #94a3b8;
    cursor: not-allowed;
  }
`;

export const SendButton = styled.button`
  background: #000080;
  color: white;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: all 0.2s;
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
  
  &:hover {
    background: #000066;
    transform: scale(1.02);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
    transform: none;
  }
`;

export const UploadButton = styled.button`
  color: #64748b;
  background: transparent;
  border: none;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  flex-shrink: 0;
  border-radius: 50%;
  transition: all 0.2s;
  
  &:hover {
    background: #f1f5f9;
    color: #1e293b;
  }
  
  @media (max-width: 768px) {
    padding: 6px;
  }
`;

export const FileUploadMenu = styled.div`
  position: absolute;
  bottom: 70px;
  left: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 100;
  overflow: hidden;
  animation: ${fadeIn} 0.2s ease;
  
  .menu-item {
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: #1e293b;
    cursor: pointer;
    transition: background 0.2s;
    
    &:hover {
      background: #f1f5f9;
    }
    
    svg {
      color: #64748b;
    }
  }
  
  @media (max-width: 768px) {
    bottom: 65px;
    left: 12px;
    
    .menu-item {
      padding: 10px 16px;
      font-size: 13px;
    }
  }
`;

export const LoadingSpinner = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #000080;
  font-weight: 500;
`;

export const ErrorMessage = styled.div`
  padding: 40px 20px;
  text-align: center;
  color: #ef4444;
  
  h3 {
    margin: 16px 0;
    font-size: 18px;
  }
  
  button {
    margin-top: 20px;
    padding: 10px 24px;
    background: #000080;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
    
    &:hover {
      background: #000066;
    }
  }
`;

export const EmptyChatMessage = styled.div`
  padding: 40px 20px;
  text-align: center;
  font-size: 14px;
  color: #94a3b8;
  background: #f8fafc;
  border-radius: 12px;
  margin: 20px;
`;

export const TypingIndicator = styled.div`
  padding: 8px 16px;
  font-size: 12px;
  color: #64748b;
  font-style: italic;
`;

export const NoMessages = styled.div`
  text-align: center;
  padding: 40px;
  color: #94a3b8;
`;

export const CallButton = styled.button`
  display: none;
`;