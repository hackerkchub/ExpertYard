// src/apps/user/pages/chat-history/UserChatHistory.styles.js
import styled from 'styled-components';

export const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px;
  background: #f8fafc;
  min-height: 100vh;
`;

export const Header = styled.div`
  margin-bottom: 32px;
  
  p {
    color: #64748b;
    font-size: 16px;
    margin-top: 50px;
  }
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

export const StatsCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  
  svg {
    color: #3b82f6;
    background: #eff6ff;
    padding: 12px;
    border-radius: 10px;
  }
  
  h3 {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }
  
  p {
    color: #64748b;
    font-size: 14px;
    margin: 0;
  }
`;

export const HistoryList = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

export const HistoryItem = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f8fafc;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

export const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }
  
  p {
    font-size: 14px;
    color: #64748b;
    margin: 0;
  }
`;

export const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

export const ChatMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
  flex-wrap: wrap;
  
  svg {
    margin-right: 4px;
  }
`;

export const ChatPreview = styled.div`
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
  background: #f8fafc;
  padding: 12px;
  border-radius: 8px;
  margin-top: 8px;
`;

export const ChatDetails = styled.div`
  margin-top: 16px;
  font-size: 14px;
  color: #475569;
`;

export const LoadMoreButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #f8fafc;
  border: none;
  border-top: 1px solid #e2e8f0;
  color: #3b82f6;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #e2e8f0;
  }
`;

export const EmptyState = styled.div`
  padding: 64px 24px;
  text-align: center;
  
  svg {
    color: #cbd5e1;
    margin-bottom: 16px;
  }
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #475569;
    margin: 0 0 8px;
  }
  
  p {
    color: #94a3b8;
    margin-bottom: 24px;
  }
  
  button {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    
    &:hover {
      background: #2563eb;
    }
  }
`;

export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #64748b;
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0; /* top:0 left:0 right:0 bottom:0 */
  background: rgba(2, 6, 23, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999; /* higher than any navbar/sidebar */
  padding: 16px;

  /* if any parent creates stacking context, fixed+high z-index still helps */
`;
export const MessagesArea = styled.div`
  flex: 1;                 /* take remaining height in modal */
  overflow-y: auto;
  padding: 16px;
  background: #f8fafc;
  border-radius: 0;        /* modal already rounded */
`;

export const MessageBubble = styled.div`
  margin-bottom: 16px;
  padding: 12px 16px;
  background: ${props => props.isExpert ? '#dbeafe' : '#f1f5f9'};
  border-radius: 12px;
  border-top-left-radius: ${props => props.isExpert ? '12px' : '4px'};
  border-top-right-radius: ${props => props.isExpert ? '4px' : '12px'};
  
  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
    
    strong {
      font-size: 14px;
      color: ${props => props.isExpert ? '#1d4ed8' : '#475569'};
    }
    
    .message-time {
      font-size: 12px;
      color: #94a3b8;
    }
  }
  
  .message-content {
    font-size: 14px;
    color: #334155;
    line-height: 1.5;
  }
`;


export const SessionsWrap = styled.div`
  margin-top: 12px;
  border-top: 1px solid #e2e8f0;
  padding-top: 12px;
  display: grid;
  gap: 10px;
`;

export const SessionRow = styled.button`
  width: 100%;
  text-align: left;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  padding: 12px 14px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: #cbd5e1;
    transform: translateY(-1px);
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
  }
`;

export const TwoCol = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  .title {
    font-weight: 700;
    color: #0f172a;
    font-size: 14px;
  }

  .sub {
    margin-top: 2px;
    color: #64748b;
    font-size: 12px;
  }

  .right {
    text-align: right;
    min-width: 96px;
  }

  .amount {
    font-weight: 800;
    color: #0f172a;
    font-size: 14px;
  }

  @media (max-width: 520px) {
    flex-direction: column;
    align-items: flex-start;

    .right {
      text-align: left;
      min-width: auto;
    }
  }
`;

// small mobile polish
export const ModalContent = styled.div`
  background: #ffffff;
  color: #0f172a; /* ensure text visible */
  border-radius: 16px;
  width: min(860px, 100%);
  max-height: calc(100vh - 32px);
  overflow: hidden; /* header + body layout */
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(148, 163, 184, 0.35);

  display: flex;
  flex-direction: column;

  @media (max-width: 520px) {
    border-radius: 14px;
    max-height: calc(100vh - 20px);
  }
`;

// Add these to existing styles file
export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border-radius: 12px;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  margin-top: 16px;

  input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
  }
`;

export const SessionCard = styled.div`
  background: #fefefe;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .session-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .date {
    font-weight: 600;
    color: #0f172a;
    font-size: 14px;
  }

  .rate {
    color: #475569;
    font-size: 13px;
  }

  .duration {
    color: #64748b;
    font-size: 12px;
  }

  .amount {
    font-weight: 800;
    color: #0f172a;
    font-size: 18px;
    text-align: right;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

export const ActionButton = styled.button`
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  background: #3b82f6; /* Blue as requested */
  color: white;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #2563eb;
  }
`;

// Add these new styles for REAL CHAT MODAL
export const ChatHeaderBar = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ChatAvatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;

export const ChatMessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  max-height: calc(80vh - 140px);
`;

export const ChatMessageBubble = styled.div`
  margin-bottom: 16px;
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
  
  ${props => props.isExpert ? `
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    margin-left: auto;
    border-bottom-right-radius: 4px;
  ` : `
    background: #ffffff;
    border: 1px solid #e2e8f0;
    margin-right: auto;
    border-bottom-left-radius: 4px;
  `}

  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
    font-size: 12px;
    
    strong {
      font-weight: 600;
      ${props => props.isExpert ? 'color: #f8fafc;' : 'color: #1e293b;'}
    }
    
    .message-time {
      opacity: 0.8;
    }
  }
  
  .message-content {
    font-size: 14px;
    line-height: 1.4;
    word-wrap: break-word;
  }
`;

export const ChatInputArea = styled.div`
  background: #ffffff;
  border-top: 1px solid #e2e8f0;
`;
