// ==================== FINAL UPDATED RESPONSIVE STYLED COMPONENTS ====================
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const PremiumContainer = styled.div`
  min-height: 100vh;
  background: #f3f2ef; 
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #000000;
`;

export const PageContainer = styled.div`
  max-width: 1128px;
  margin: 0 auto;
  padding: 24px 16px;
  @media (max-width: 768px) { padding: 12px 8px; }
`;

export const Header = styled.div`
  margin-bottom: 24px;
`;

export const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #000000;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 16px 0;
  @media (max-width: 768px) { font-size: 22px; }
`;

export const ResponsiveGrid = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 24px;
  @media (max-width: 992px) { flex-direction: column; align-items: stretch; }
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 12px;
  margin: 16px 0;
  border-bottom: 2px solid #dbdbdb;
  padding-bottom: 12px;
  overflow-x: auto; /* Scrollable tabs on small screens */
  &::-webkit-scrollbar { display: none; }
`;

export const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 28px;
  background: ${props => props.active ? '#0a66c2' : 'transparent'};
  color: ${props => props.active ? 'white' : '#000000'};
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  &:hover { background: ${props => props.active ? '#004182' : '#e0e0e0'}; }
`;

export const MobileSummaryToggle = styled.button`
  display: none;
  @media (max-width: 992px) {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: white;
    border: 2px solid #0a66c2;
    border-radius: 24px;
    color: #0a66c2;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 16px;
    cursor: pointer;
  }
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;

  /* FIX: Mobile view mein hide nahi hoga, 2x2 grid ban jayega */
  @media (max-width: 992px) {
    display: grid; 
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    gap: 10px;
  }
`;

export const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #dbdbdb;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  
  .stat-icon {
    width: 44px; height: 44px;
    border-radius: 10px;
    background: #f3f2ef;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; color: #0a66c2;
    flex-shrink: 0;
  }

  .stat-value { 
    font-size: 20px; 
    font-weight: 800; 
    color: #000000;
    display: block;
  }
  .stat-label { font-size: 13px; color: #000000; font-weight: 600; opacity: 0.8; }

  @media (max-width: 480px) {
    padding: 12px;
    .stat-icon { width: 36px; height: 36px; font-size: 18px; }
    .stat-value { font-size: 16px; }
    .stat-label { font-size: 11px; }
  }
`;

export const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
  @media (max-width: 768px) { flex-direction: column; align-items: stretch; }
`;

export const SearchBar = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #dbdbdb;
  border-radius: 8px;
  padding: 0 16px;
  height: 48px;

  input {
    flex: 1; border: none; outline: none; background: transparent;
    padding: 10px; font-size: 16px; color: #000000;
    &::placeholder { color: #757575; }
  }
`;

export const PillBadge = styled.button`
  padding: 8px 20px;
  border-radius: 20px;
  border: 2px solid ${props => props.active ? '#0a66c2' : '#dbdbdb'};
  background: ${props => props.active ? '#0a66c2' : 'white'};
  color: ${props => props.active ? 'white' : '#000000'};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  &:hover { background: ${props => props.active ? '#004182' : '#f3f2ef'}; }
`;

export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;
`;

export const HistoryItem = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #dbdbdb;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.4s ease;
  &:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }

  .expanded-content {
    background: #fafafa;
    border-top: 1px solid #dbdbdb;
    padding: 20px;
    @media (max-width: 480px) { padding: 12px; }
  }
`;

export const ChatHeader = styled.div`
  padding: 16px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background: #ffffff;

  .chat-header-content {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
    min-width: 0;
  }

  .user-info {
    flex: 1;
    min-width: 0;
    h4 {
      font-size: 17px;
      font-weight: 700;
      color: #000000;
      margin: 0 0 4px 0;
    }
  }

  .user-stats { 
    display: flex; 
    gap: 12px; 
    align-items: center;
    flex-wrap: wrap; 
  }

  .meta-item {
    font-size: 13px;
    color: #000000;
    font-weight: 700; /* Bold for visibility */
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
    .last-activity {
      text-align: right;
      font-size: 13px;
      color: #000000;
      font-weight: 600;
      @media (max-width: 600px) { display: none; }
    }
  }
`;

export const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #e0e0e0;
  overflow: hidden;
  border: 2px solid #0a66c2;
  flex-shrink: 0;
  display: none; /* FIX: Image wapas dikhegi */
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: none; /* FIX: Image hidden nahi rahegi */
  }
  @media (max-width: 480px) { width: 48px; height: 48px; }
`;

export const EarningsBadge = styled.span`
  background: #e1f0fe;
  color: #0a66c2;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 800;
`;

export const SessionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  h5 { font-size: 16px; font-weight: 800; margin: 0; color: #000000; }
`;

export const SessionsWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SessionCard = styled.div`
  display: flex;
  align-items: center;
  padding: 14px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #dbdbdb;
  gap: 12px;

  .session-number {
    width: 30px; height: 30px;
    background: #f3f2ef;
    border-radius: 50%;
    font-size: 12px; font-weight: 800;
    display: flex; align-items: center; justify-content: center;
    color: #0a66c2;
    flex-shrink: 0;
  }

  .session-info { flex: 1; font-size: 14px; color: #000000; font-weight: 600; }
  .session-earnings { font-weight: 800; color: #0a66c2; font-size: 15px; }
`;

export const ActionButton = styled.button`
  background: white;
  border: 2px solid #0a66c2;
  color: #0a66c2;
  padding: 8px 20px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #0a66c2; color: white; }

  ${props => props.primary && `
    background: #0a66c2; color: white; border: none;
    &:hover { background: #004182; }
  `}
`;

export const EmptyState = styled.div`
  background: white;
  border-radius: 12px;
  padding: 60px 20px;
  text-align: center;
  border: 1px solid #dbdbdb;
  h3 { font-size: 22px; color: #000000; font-weight: 800; }
  p { color: #000000; font-size: 15px; opacity: 0.7; }
`;

export const LoadingSpinner = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px;
  .spinner {
    width: 40px; height: 40px;
    border: 4px solid #dbdbdb; border-top: 4px solid #0a66c2;
    border-radius: 50%; animation: ${spin} 0.8s linear infinite;
  }
`;

// ==================== UPDATED MODAL & CHAT DESIGN ====================
export const ModalOverlay = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  z-index: 2000;
  @media (max-width: 480px) { align-items: flex-end; }
`;

export const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 16px;
  width: 95%;
  max-width: 650px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 480px) { 
    width: 100%; 
    height: 92vh; 
    border-radius: 16px 16px 0 0; 
  }

  .modal-header {
    padding: 16px 20px;
    border-bottom: 1px solid #dbdbdb;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #ffffff;
    h3 { font-size: 18px; font-weight: 800; color: #000000; }
  }

  .modal-close {
    background: #f3f2ef; border: none; width: 32px; height: 32px; 
    border-radius: 50%; font-size: 20px; cursor: pointer; color: #000;
    display: flex; align-items: center; justify-content: center;
    &:hover { background: #dbdbdb; }
  }
`;

export const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f8f9fa; /* Slight contrast for bubbles */
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const MessageBubble = styled.div`
  align-self: ${props => props.isExpert ? 'flex-start' : 'flex-end'};
  max-width: 85%;
  display: flex;
  flex-direction: column;
  
  .message-content {
    background: ${props => props.isExpert ? '#ffffff' : '#0a66c2'};
    color: ${props => props.isExpert ? '#000000' : '#ffffff'};
    padding: 12px 16px;
    border-radius: 18px;
    font-size: 15px;
    font-weight: 500;
    line-height: 1.5;
    border: ${props => props.isExpert ? '1px solid #dbdbdb' : 'none'};
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }

  .message-time {
    font-size: 11px;
    color: #000000;
    opacity: 0.5;
    margin-top: 4px;
    align-self: ${props => props.isExpert ? 'flex-start' : 'flex-end'};
  }
`;

export const MessageAvatar = styled(Avatar)`
  width: 32px;
  height: 32px;
  margin-right: 8px;
  border: 1px solid #dbdbdb;
`;

export const StatusBadge = styled.span`
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 4px;
  font-weight: 800;
  text-transform: uppercase;
  color: #000000;
  
  &.completed { background: #e1f0fe; color: #0a66c2; border: 1px solid #0a66c2; }
  &.missed { background: #ffebee; color: #d32f2f; border: 1px solid #d32f2f; }
  &.rejected { background: #f5f5f5; color: #616161; border: 1px solid #616161; }
`;

// Add this to your existing styles file

export const PricingBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  background: #f3f4f6;
  color: #374151;
  
  &.per-minute {
    background: #dbeafe;
    color: #1e40af;
  }
  
  &.session {
    background: #fef3c7;
    color: #92400e;
  }
`;