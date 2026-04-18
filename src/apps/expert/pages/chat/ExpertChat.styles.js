// ExpertChat.styles.js
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* --- 1. Main Page Wrappers --- */
export const PageWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  height: 100dvh; 
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #f4f5f7;
  overflow: hidden;
  overscroll-behavior: none;
`;

export const ChatLayout = styled.div`
  flex: 1;
  display: flex;
  width: 100%;
  height: 100%;
  background: #ffffff;
  overflow: hidden;
`;

/* --- 2. Right Panel (Chat View) --- */
export const RightPanel = styled.div`
  background: #ffffff;
  display: flex;
  flex-direction: column;
  height: 100%; 
  width: 100%;
  overflow: hidden;
  position: relative;
  flex: 1;
  min-height: 0;
`;

export const UserHeader = styled.div`
  flex-shrink: 0;
  padding: 12px 20px;
  border-bottom: 1px solid #e9ecef;
  background: #ffffff;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  
  @media (max-width: 768px) {
    padding: 10px 16px;
  }
`;

export const MobileBackButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  color: #000080;
  transition: all 0.2s;
  
  &:hover {
    background: #f0f0f0;
  }
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
`;

export const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e9ecef;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

export const AvatarPlaceholder = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #000080, #1a1a8e);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  flex-shrink: 0;
  border: 2px solid #e9ecef;
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
`;

export const UserMeta = styled.div`
  flex: 1;
  
  h4 {
    margin: 0 0 4px 0;
    font-size: 16px;
    font-weight: 600;
    color: #1a1a2e;
    
    @media (max-width: 768px) {
      font-size: 15px;
    }
  }
  
  .user-details {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 4px;
    
    @media (max-width: 480px) {
      flex-direction: column;
      gap: 4px;
    }
  }
  
  .detail-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #6c757d;
    
    svg {
      opacity: 0.7;
    }
    
    &.loading {
      color: #adb5bd;
      font-style: italic;
    }
  }
`;

export const TimerDisplay = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f8f9fa;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: #057642;
  margin-top: 4px;
  
  svg {
    animation: pulse 1s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

export const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: #f8f9fa;
  position: relative;
`;

export const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const Message = styled.div`
  display: flex;
  width: 100%;
  justify-content: ${({ $expert }) => ($expert ? "flex-end" : "flex-start")};
  animation: ${fadeIn} 0.2s ease-out;
`;

export const Bubble = styled.div`
  max-width: 70%;
  padding: 10px 14px;
  border-radius: ${({ $expert }) => ($expert ? "18px 18px 4px 18px" : "18px 18px 18px 4px")};
  font-size: 14px;
  line-height: 1.5;
  background: ${({ $expert }) => ($expert ? "#000080" : "#ffffff")};
  color: ${({ $expert }) => ($expert ? "#ffffff" : "#1a1a2e")};
  box-shadow: 0 1px 2px rgba(0,0,0,0.08);
  word-wrap: break-word;
  
  @media (max-width: 768px) {
    max-width: 85%;
    font-size: 15px;
    padding: 8px 12px;
  }
  
  .message-text {
    margin-bottom: 4px;
  }
  
  .time {
    font-size: 10px;
    margin-top: 4px;
    text-align: right;
    opacity: 0.7;
    display: block;
    color: inherit;
  }
`;

/* --- 3. Input Area --- */
export const ChatInputWrap = styled.div`
  flex-shrink: 0;
  background: #ffffff;
  padding: 12px 20px;
  border-top: 1px solid #e9ecef;
  display: flex;
  align-items: flex-end;
  gap: 12px;
  z-index: 20;
  padding-bottom: max(12px, env(safe-area-inset-bottom));
  
  @media (max-width: 768px) {
    padding: 10px 16px;
    gap: 8px;
  }
`;

export const ChatInput = styled.textarea`
  flex: 1;
  padding: 10px 16px;
  border-radius: 24px;
  border: 1.5px solid #e9ecef;
  font-size: 14px;
  background: #ffffff;
  resize: none;
  max-height: 120px;
  min-height: 40px;
  outline: none;
  font-family: inherit;
  color: #1a1a2e;
  line-height: 1.4;
  transition: all 0.2s;
  
  @media (max-width: 768px) {
    font-size: 16px;
    padding: 8px 14px;
  }
  
  &:focus {
    border-color: #000080;
    box-shadow: 0 0 0 3px rgba(0,0,128,0.1);
  }
  
  &:disabled {
    background: #f8f9fa;
    color: #adb5bd;
    cursor: not-allowed;
  }
`;

export const SendButton = styled.button`
  background: #000080;
  color: #ffffff;
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
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
    background: #ced4da;
    cursor: not-allowed;
    transform: none;
  }
`;

/* --- 4. Status Components --- */
export const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #000080;
  font-weight: 600;
  font-size: 16px;
`;

export const NoChatSelected = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6c757d;
  text-align: center;
  padding: 20px;
  
  h3 {
    margin: 16px 0 8px;
    color: #1a1a2e;
    font-size: 18px;
  }
  
  p {
    margin: 0;
    font-size: 14px;
  }
  
  svg {
    opacity: 0.5;
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #dc3545;
  padding: 20px;
  text-align: center;
  
  h3 {
    margin: 16px 0;
    font-size: 18px;
  }
  
  button {
    margin-top: 20px;
    padding: 10px 24px;
    background: #000080;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
    
    &:hover {
      background: #000066;
      transform: translateY(-1px);
    }
  }
`;

export const EmptyChatMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #adb5bd;
  font-size: 14px;
  text-align: center;
  padding: 20px;
`;

/* Empty placeholders for compatibility */
export const PopoverContainer = styled.div` display: none; `;
export const ProfileDropdownContainer = styled.div` display: none; `;
export const BackButton = styled.button` display: none; `;