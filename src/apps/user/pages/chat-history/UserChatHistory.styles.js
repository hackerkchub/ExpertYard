// src/apps/user/pages/chat-history/UserChatHistory.styles.js
import styled from "styled-components";

export const PremiumContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 80px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
`;

export const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const Header = styled.div`
  margin-bottom: 32px;
`;

export const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  
  svg {
    color: #0ea5e9;
  }
`;

export const SummaryCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: 20px;
  padding: 24px;
  width: 380px;
  box-shadow: 0 8px 30px rgba(14, 165, 233, 0.1);
  
  .summary-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    
    svg {
      color: #0ea5e9;
    }
    
    span {
      font-size: 16px;
      font-weight: 600;
      color: #0f172a;
    }
  }
  
  .summary-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 20px;
  }
  
  .summary-stat {
    text-align: center;
    
    .stat-value {
      display: block;
      font-size: 24px;
      font-weight: 700;
      color: #0ea5e9;
      line-height: 1.2;
    }
    
    .stat-label {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }
  
  .summary-meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 16px;
    border-top: 1px solid #e2e8f0;
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #64748b;
      
      svg {
        color: #94a3b8;
      }
    }
  }
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 32px 0;
`;

export const StatCard = styled.div`
  background: ${props => props.accent ? 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)' : 
               props.primary ? 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)' : 
               '#ffffff'};
  border: 1px solid ${props => props.accent ? '#7dd3fc' : props.primary ? '#c4b5fd' : '#e2e8f0'};
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
  
  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
  
  .stat-content {
    flex: 1;
  }
  
  .stat-value {
    display: block;
    font-size: 24px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.2;
  }
  
  .stat-label {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
  }
`;

export const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
`;

export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${props => props.premium ? '#f0f9ff' : '#ffffff'};
  border: 2px solid ${props => props.premium ? '#bae6fd' : '#ddd'};
  border-radius: 12px;
  padding: ${props => props.premium ? '12px 20px' : '8px 16px'};
  width: 320px;
  transition: all 0.3s ease;
  
  &:focus-within {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }
  
  input {
    flex: 1;
    border: none;
    background: none;
    font-size: ${props => props.premium ? '15px' : '14px'};
    color: #0f172a;
    
    &::placeholder {
      color: #94a3b8;
    }
    
    &:focus {
      outline: none;
    }
  }
  
  svg {
    color: #94a3b8;
  }
`;

export const PillBadge = styled.button`
  padding: 8px 20px;
  border: 2px solid ${props => props.active ? '#0ea5e9' : '#e2e8f0'};
  background: ${props => props.active ? '#0ea5e9' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : '#64748b'};
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #0284c7;
    background: ${props => props.active ? '#0284c7' : '#f0f9ff'};
  }
`;

export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const HistoryItem = styled.div`
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid ${props => props.premium ? '#e2e8f0' : '#ddd'};
  transition: all 0.3s ease;
  
  ${props => props.premium && `
    &:hover {
      border-color: #0ea5e9;
    }
  `}
`;

export const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.premium ? '24px' : '16px'};
  cursor: pointer;
  background: ${props => props.premium ? '#ffffff' : '#f8f9fa'};
  transition: background-color 0.2s ease;
  
  &:hover {
    background: ${props => props.premium ? '#f0f9ff' : '#e9ecef'};
  }
  
  h4 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #0f172a;
  }
  
  .meta-item {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #64748b;
    background: #f8fafc;
    padding: 4px 12px;
    border-radius: 20px;
    
    svg {
      color: #0ea5e9;
    }
  }
  
  .chevron-icon {
    color: #0ea5e9;
    transition: transform 0.3s ease;
  }
`;

export const Avatar = styled.div`
  width: ${props => props.premium ? '64px' : '48px'};
  height: ${props => props.premium ? '64px' : '48px'};
  border-radius: ${props => props.premium ? '16px' : '12px'};
  background: ${props => props.premium ? 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)' : '#0ea5e9'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: ${props => props.premium ? '20px' : '16px'};
  background-image: ${props => props.src ? `url(${props.src})` : 'none'};
  background-size: cover;
  background-position: center;
  border: ${props => props.premium ? '3px solid white' : '2px solid white'};
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.2);
  overflow: hidden;
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

export const ExpertBadge = styled.span`
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

export const SessionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h5 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #0f172a;
  }
`;

export const SessionsWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SessionCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  
  ${props => props.premium && `
    &:hover {
      border-color: #0ea5e9;
      box-shadow: 0 4px 12px rgba(14, 165, 233, 0.1);
    }
  `}
  
  .session-indicator {
    .session-number {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
      color: white;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
    }
  }
  
  .session-info {
    flex: 1;
    
    .session-details {
      display: flex;
      gap: 24px;
      margin-bottom: 8px;
      
      .date, .duration {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #64748b;
        
        svg {
          color: #0ea5e9;
        }
      }
    }
    
    .session-meta {
      display: flex;
      gap: 16px;
      align-items: center;
      
      .rate-label {
        font-size: 13px;
        color: #10b981;
        font-weight: 600;
        background: #d1fae5;
        padding: 4px 12px;
        border-radius: 12px;
      }
      
      .room-id {
        font-size: 12px;
        color: #94a3b8;
        background: #f1f5f9;
        padding: 4px 12px;
        border-radius: 12px;
      }
    }
  }
  
  .session-amount {
    text-align: center;
    min-width: 100px;
    
    .amount-label {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 4px;
    }
    
    .amount {
      font-size: 20px;
      font-weight: 700;
      color: #ef4444;
    }
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  min-width: 200px;
  justify-content: flex-end;
`;

export const ActionButton = styled.button`
  padding: ${props => props.primary ? '12px 24px' : '10px 20px'};
  background: ${props => props.primary ? 
    'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)' : 
    'transparent'};
  color: ${props => props.primary ? '#ffffff' : '#0ea5e9'};
  border: ${props => props.primary ? 'none' : '2px solid #0ea5e9'};
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  min-width: ${props => props.primary ? '120px' : 'auto'};
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: ${props => props.primary ? 
      '0 4px 12px rgba(14, 165, 233, 0.3)' : 
      '0 2px 8px rgba(14, 165, 233, 0.2)'};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const ViewChatButton = styled(ActionButton)`
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border: none;
  min-width: 120px;
  
  &:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }
`;

export const ChatAgainButton = styled(ActionButton)`
  background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
  color: white;
  border: none;
  min-width: 130px;
  
  &:hover {
    background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 80px 40px;
  background: #ffffff;
  border-radius: 20px;
  border: 2px dashed #e2e8f0;
  
  ${props => props.premium && `
    .empty-icon {
      width: 100px;
      height: 100px;
      background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      
      svg {
        color: #0ea5e9;
      }
    }
  `}
  
  h3 {
    font-size: 24px;
    color: #0f172a;
    margin-bottom: 12px;
  }
  
  p {
    color: #64748b;
    margin-bottom: 24px;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
    font-size: 15px;
  }
  
  .premium-btn {
    background: linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%);
    color: white;
    border: none;
    padding: 14px 32px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(14, 165, 233, 0.3);
    }
  }
`;

export const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  
  .spinner {
    width: 60px;
    height: 60px;
    border: 4px solid #e0f2fe;
    border-top: 4px solid #0ea5e9;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 24px;
  }
  
  p {
    color: #64748b;
    font-size: 16px;
    font-weight: 500;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;               /* 🔥 full screen */
  z-index: 9999;          /* 🔥 sabse upar */

  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 24px;
`;


export const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 20px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease;
  
  ${props => props.premium && `
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.1);
  `}
  
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  .modal-header {
    padding: 24px;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    
    .modal-user-info {
      display: flex;
      align-items: center;
      gap: 16px;
      
      h3 {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        color: #0f172a;
      }
      
      .modal-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 4px;
        font-size: 14px;
        color: #64748b;
        
        .spent {
          color: #ef4444;
          font-weight: 600;
        }
      }
    }
    
    .modal-close {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      border: none;
      background: #f1f5f9;
      color: #64748b;
      font-size: 24px;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        background: #e2e8f0;
        color: #0f172a;
      }
    }
  }
  
  .modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #e2e8f0;
    background: #f8fafc;
    
    .footer-note {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: #64748b;
      font-size: 14px;
      font-style: italic;
      
      svg {
        color: #0ea5e9;
      }
    }
  }
`;

export const ChatMessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;   /* 🔥 enable scroll */
  background: ${props => props.premium ? '#f8fafc' : '#f9f9f9'};
  padding: 24px;

  scrollbar-width: thin;
`;

export const ChatMessageBubble = styled.div`
  max-width: 70%;
  margin-bottom: 20px;
  margin-left: ${props => props.isExpert ? '0' : 'auto'};
  
  ${props => props.premium && `
    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      
      .sender-info {
        display: flex;
        align-items: center;
        gap: 8px;
        
        strong {
          font-size: 14px;
          color: ${props.isExpert ? '#0ea5e9' : '#10b981'};
        }
        
        .sender-role {
          font-size: 12px;
          color: #64748b;
          margin-left: 8px;
        }
      }
      
      .message-time {
        font-size: 12px;
        color: #94a3b8;
      }
    }
    
    .message-content {
      padding: 16px;
      background: ${props.isExpert ? 
        'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)' : 
        'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'};
      color: ${props.isExpert ? '#0f172a' : '#064e3b'};
      border-radius: 16px;
      border-bottom-${props.isExpert ? 'right' : 'left'}-radius: 4px;
      font-size: 14px;
      line-height: 1.5;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      border: 1px solid ${props.isExpert ? '#bae6fd' : '#a7f3d0'};
    }
  `}
`;

export const UserMessageAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${props => props.isExpert ? 
    'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)' : 
    'linear-gradient(135deg, #10b981 0%, #34d399 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

// Popup styles
export const PopupOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

export const PopupContainer = styled.div`
  background: #fff;
  padding: 32px;
  border-radius: 20px;
  width: min(90vw, 400px);
  text-align: center;
  box-shadow: 0 25px 60px rgba(0,0,0,0.2);
`;

// Add these CSS classes to your style tag
const popupStyles = `
  .waiting-popup-overlay,
  .recharge-popup-overlay,
  .reject-popup-overlay,
  .cancel-popup-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: fadeIn 0.3s ease;
  }

  .waiting-popup,
  .recharge-popup,
  .reject-popup,
  .cancel-popup {
    background: #fff;
    padding: 32px;
    border-radius: 20px;
    width: min(90vw, 420px);
    text-align: center;
    box-shadow: 0 25px 60px rgba(0,0,0,0.2);
    animation: slideUp 0.3s ease;
  }

  .popup-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    
    svg {
      color: #0ea5e9;
    }
    
    &.warning {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      svg { color: #f59e0b; }
    }
    
    &.error {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      svg { color: #ef4444; }
    }
  }

  .waiting-popup h3,
  .recharge-popup h3,
  .reject-popup h3,
  .cancel-popup h3 {
    margin: 0 0 12px 0;
    color: #0f172a;
    font-size: 24px;
  }

  .waiting-popup p,
  .recharge-popup p,
  .reject-popup p,
  .cancel-popup p {
    margin: 0 0 24px 0;
    color: #475569;
    font-size: 15px;
    line-height: 1.5;
  }

  .popup-spinner {
    margin: 20px 0;
  }

  .cancel-request-btn {
    padding: 12px 24px;
    border-radius: 12px;
    border: 2px solid #e2e8f0;
    background: #f8fafc;
    color: #334155;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: #e2e8f0;
      border-color: #cbd5e1;
    }
  }

  .popup-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 24px;
  }
`;