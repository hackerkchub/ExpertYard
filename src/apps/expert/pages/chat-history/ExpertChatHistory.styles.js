// src/apps/expert/pages/chat-history/ExpertChatHistory.styles.js
import styled from 'styled-components';

export const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
`;

export const Header = styled.div`
  margin-bottom: 32px;
  
  p {
    color: #64748b;
    font-size: 16px;
    margin-top: 8px;
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
    color: #8b5cf6;
    background: #f5f3ff;
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

// ✅ UPDATED: SearchBar as DIV container (matches UserChatHistory exactly)
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
    transform: translateX(4px);
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
  width: ${props => props.size === 'small' ? '32px' : '48px'};
  height: ${props => props.size === 'small' ? '32px' : '48px'};
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
  
  // ✅ Earnings styling (purple highlight)
  span:last-child {
    color: #7c3aed !important;
    font-weight: 700 !important;
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
    background: #8b5cf6;
    color: white;
    border: none;
    padding: 10px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    
    &:hover {
      background: #7c3aed;
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
  inset: 0;
  background: rgba(2, 6, 23, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 16px;
`;

export const ModalContent = styled.div`
  background: #ffffff;
  color: #0f172a;
  border-radius: 16px;
  width: min(900px, 100%);
  max-height: calc(100vh - 32px);
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(148, 163, 184, 0.35);
  display: flex;
  flex-direction: column;

  @media (max-width: 520px) {
    border-radius: 14px;
    max-height: calc(100vh - 20px);
  }
`;

export const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f8fafc;
`;

export const MessageBubble = styled.div`
  margin-bottom: 16px;
  padding: 12px 16px;
  background: ${props => props.isExpert ? '#ede9fe' : '#f1f5f9'};
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
      color: ${props => props.isExpert ? '#7c3aed' : '#475569'};
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

// ✅ NEW: SessionsWrap (grid container)
export const SessionsWrap = styled.div`
  margin-top: 12px;
  border-top: 1px solid #e2e8f0;
  padding-top: 12px;
  display: grid;
  gap: 10px;
`;

// ✅ NEW: SessionCard (main session display - matches UserChatHistory)
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

// ✅ NEW: ActionButton (View Chat only - purple theme)
export const ActionButton = styled.button`
  width: 100%;
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  background: #8b5cf6;
  color: white;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 12px;

  &:hover {
    background: #7c3aed;
  }
`;

// ✅ REMOVED unused components:
// - FilterButtons (no date filtering needed)
// - SessionRow (using SessionCard instead)
// - TwoCol (using flex layout in SessionCard)
// - ChatPreview, ChatDetails, LoadMoreButton (not used)
