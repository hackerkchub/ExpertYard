// Chat.styles.js - NO FOOTER + NO BOUNCE + PERFECT LAYOUT
import styled, { createGlobalStyle } from "styled-components";

// Remove all body/footer scroll
export const ChatGlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    height: 100vh;
    overflow: hidden;
  }
  
  .chat-icon {
    color: #64748b !important;
    cursor: pointer !important;
    transition: all 0.3s ease !important;
  }
  .chat-icon:hover {
    color: #3b82f6 !important;
    transform: scale(1.1) !important;
  }
`;

export const PageWrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  overflow: hidden;
  padding-bottom: 70px; /* ✅ Fixed bottom space */
`;

export const Header = styled.div`
  height: 70px;
  padding: 16px 24px;
  background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
  border-bottom: 2px solid #cbd5e1;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  z-index: 100;
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
  width: 42px;
  height: 42px;
  flex-shrink: 0;
`;

export const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  object-fit: cover;
  border: 2px solid #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

export const StatusDot = styled.span`
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 10px;
  height: 10px;
  background: ${(p) => (p.active ? "#10b981" : "#94a3b8")};
  border-radius: 50%;
  border: 2px solid #f8fafc;
`;

export const CallButton = styled.button`
  width: 44px;
  height: 44px;
  border: none;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 12px;
  color: white !important;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  }
`;

export const MessagesArea = styled.div`
  flex: 1;
  padding: 20px 16px;
  overflow-y: auto;
  overflow-x: hidden;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  scroll-behavior: smooth;
`;

export const MessageRow = styled.div`
  display: flex;
  margin-bottom: 16px;
  width: 100%;

  &.user { justify-content: flex-end; }
  &.expert { justify-content: flex-start; }
`;

export const MessageBubble = styled.div`
  max-width: 75%;
  display: flex;
  flex-direction: column;

  &.expert .message-text {
    background: #ffffff !important;
    color: #1e293b !important;
    border: 1px solid #e2e8f0;
    border-radius: 16px 16px 16px 4px;
    padding: 12px 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    word-wrap: break-word;
    line-height: 1.5;
  }

  &.user .message-text {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
    color: white !important;
    border-radius: 16px 16px 4px 16px;
    padding: 12px 16px;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    word-wrap: break-word;
    line-height: 1.5;
  }
`;

export const MessageTime = styled.div`
  font-size: 10px !important;
  color: #94a3b8 !important;
  margin-top: 4px;
  font-weight: 500;
`;

export const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #f1f5f9;
  border-radius: 16px 16px 16px 4px;
  border: 1px solid #e2e8f0;

  .dots {
    display: flex;
    gap: 3px;
    span {
      width: 6px;
      height: 6px;
      background: #3b82f6;
      border-radius: 50%;
      animation: typing 1.4s infinite ease-in-out;
    }
    span:nth-child(2) { animation-delay: 0.2s; }
    span:nth-child(3) { animation-delay: 0.4s; }
  }

  div {
    font-size: 12px;
    color: #475569 !important;
  }

  @keyframes typing {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-4px); opacity: 1; }
  }
`;

export const InputBar = styled.div`
  height: 70px;
  padding: 12px 20px;
  background: #ffffff !important;
  border-top: 2px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  z-index: 100;
  /* ✅ REMOVED sticky - No overlap */
`;

export const UploadButton = styled.button`
  width: 42px;
  height: 42px;
  border: 2px solid #e2e8f0;
  background: #ffffff;
  border-radius: 12px;
  color: #64748b !important;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
  position: relative;

  &:hover {
    border-color: #3b82f6;
    background: #f0f9ff;
    color: #3b82f6 !important;
  }
`;

export const FileUploadMenu = styled.div`
  position: absolute;
  bottom: 85px; /* ✅ Increased from 60px to 85px */
  left: 16px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  border: 1px solid #e2e8f0;
  padding: 8px 0;
  min-width: 140px;
  z-index: 200;

  .menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 13px;
    color: #374151;

    &:hover {
      background: #f8fafc;
      color: #1e293b;
    }
  }
`;

export const InputBox = styled.input`
  flex: 1;
  min-width: 0;
  padding: 12px 18px;
  background: #f8fafc !important;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  color: #1e293b !important;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  transition: all 0.3s ease;

  &::placeholder {
    color: #94a3b8 !important;
  }

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    background: #ffffff;
  }
`;

export const SendButton = styled.button`
  width: 44px;
  height: 44px;
  border: none;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 12px;
  color: white !important;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Add these styled components to Chat.styles.js
export const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60vh;
  color: #64748b;
  font-size: 16px;
`;

export const NoMessages = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50vh;
  color: #64748b;
  font-size: 16px;
  text-align: center;
`;

export const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  color: #dc2626;
  text-align: center;
  gap: 16px;

  svg { opacity: 0.7; }
  h3 { margin: 0; color: #dc2626; }
  button {
    padding: 10px 20px;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
  }
`;

// export const EndChatButton = styled.button`
//   padding: 8px;
//   background: #ef4444;
//   color: white;
//   border: none;
//   border-radius: 8px;
//   cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
//   opacity: ${props => props.disabled ? 0.5 : 1};
// `;

// Chat.styles.js में ये add करें (अगर नहीं हैं):
export const EmptyChatMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #64748b;
  font-size: 16px;
  text-align: center;
  line-height: 1.5;
`;

export const EndChatButton = styled.button`
  padding: 8px 12px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  display: flex;
  align-items: center;
  justify-content: center;
`;
