// src/apps/expert/pages/chat-history/ExpertChatHistory.styles.js
import styled from "styled-components";

export const PremiumContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 24px;
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
  color: #1e293b;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  
  svg {
    color: #8b5cf6;
  }
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 32px 0;
`;

export const StatCard = styled.div`
  background: ${props => props.accent ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : 
               props.primary ? 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)' : 
               '#ffffff'};
  border: 1px solid ${props => props.accent ? '#fbbf24' : props.primary ? '#8b5cf6' : '#e2e8f0'};
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
    color: #1e293b;
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
  background: ${props => props.premium ? '#f8fafc' : '#ffffff'};
  border: 2px solid ${props => props.premium ? '#e2e8f0' : '#ddd'};
  border-radius: 12px;
  padding: ${props => props.premium ? '12px 20px' : '8px 16px'};
  width: 300px;
  transition: all 0.3s ease;
  
  &:focus-within {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
  
  input {
    flex: 1;
    border: none;
    background: none;
    font-size: ${props => props.premium ? '15px' : '14px'};
    color: #1e293b;
    
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
  border: 2px solid ${props => props.active ? '#8b5cf6' : '#e2e8f0'};
  background: ${props => props.active ? '#8b5cf6' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : '#64748b'};
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #7c3aed;
    background: ${props => props.active ? '#7c3aed' : '#f1f5f9'};
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
      border-color: #8b5cf6;
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
    background: ${props => props.premium ? '#f8fafc' : '#e9ecef'};
  }
  
  h4 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
  }
  
  .meta-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: #64748b;
    
    svg {
      margin-right: 4px;
    }
  }
  
  .chevron-icon {
    color: #8b5cf6;
    transition: transform 0.3s ease;
  }
`;

export const Avatar = styled.div`
  width: ${props => props.premium ? '60px' : '48px'};
  height: ${props => props.premium ? '60px' : '48px'};
  border-radius: ${props => props.premium ? '16px' : '12px'};
  background: ${props => props.premium ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#8b5cf6'};
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const EarningsBadge = styled.span`
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
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
    color: #1e293b;
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
      border-color: #8b5cf6;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.1);
    }
  `}
  
  .session-indicator {
    .session-number {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
          color: #8b5cf6;
        }
      }
    }
    
    .session-meta {
      .room-id {
        font-size: 12px;
        color: #94a3b8;
        background: #f1f5f9;
        padding: 4px 12px;
        border-radius: 12px;
      }
    }
  }
  
  .session-earnings {
    text-align: center;
    
    .amount-label {
      font-size: 12px;
      color: #64748b;
      margin-bottom: 4px;
    }
    
    .amount {
      font-size: 20px;
      font-weight: 700;
      color: #10b981;
    }
  }
`;

export const ActionButton = styled.button`
  padding: ${props => props.premium ? '10px 20px' : '8px 16px'};
  background: ${props => props.premium ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : '#8b5cf6'};
  color: white;
  border: none;
  border-radius: ${props => props.premium ? '10px' : '8px'};
  font-size: ${props => props.premium ? '14px' : '13px'};
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.premium ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' : '#7c3aed'};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }
  
  &:active {
    transform: translateY(0);
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
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      
      svg {
        color: #94a3b8;
      }
    }
  `}
  
  h3 {
    font-size: 24px;
    color: #1e293b;
    margin-bottom: 12px;
  }
  
  p {
    color: #64748b;
    margin-bottom: 24px;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .premium-btn {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
    border: none;
    padding: 14px 32px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
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
    border: 4px solid #e2e8f0;
    border-top: 4px solid #8b5cf6;
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
  inset: 0;              /* 🔥 full screen */
  z-index: 9999;         /* 🔥 sabse upar */

  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 24px;
  animation: fadeIn 0.25s ease;
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
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    
    .modal-user-info {
      display: flex;
      align-items: center;
      gap: 16px;
      
      h3 {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        color: #1e293b;
      }
      
      .modal-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 4px;
        font-size: 14px;
        color: #64748b;
        
        .earnings {
          color: #10b981;
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
        color: #1e293b;
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
        color: #8b5cf6;
      }
    }
  }
`;

export const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;     /* 🔥 real scroll */
  background: ${props => props.premium ? '#f8fafc' : '#f9f9f9'};
  padding: 24px;

  scrollbar-width: thin;
`;


export const MessageBubble = styled.div`
  max-width: 70%;
  margin-bottom: 20px;
  margin-left: ${props => props.isExpert ? 'auto' : '0'};
  
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
          color: #1e293b;
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
        'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 
        '#ffffff'};
      color: ${props.isExpert ? '#ffffff' : '#1e293b'};
      border-radius: 16px;
      border-bottom-${props.isExpert ? 'left' : 'right'}-radius: 4px;
      font-size: 14px;
      line-height: 1.5;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  `}
`;

export const MessageAvatar = styled.div`
  width: ${props => props.size === 'large' ? '56px' : 
           props.small ? '28px' : '40px'};
  height: ${props => props.size === 'large' ? '56px' : 
           props.small ? '28px' : '40px'};
  border-radius: ${props => props.size === 'large' ? '16px' : 
                  props.small ? '8px' : '12px'};
  background: ${props => props.isExpert ? 
    'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 
    'linear-gradient(135deg, #10b981 0%, #34d399 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: ${props => props.small ? '12px' : '16px'};
  background-image: ${props => props.src ? `url(${props.src})` : 'none'};
  background-size: cover;
  background-position: center;
  border: ${props => props.size === 'large' ? '3px solid white' : '2px solid white'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

// Add this to ExpertChatHistory.styles.js
export const ChatMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 16px;
  background: #f8fafc;
  border-radius: 0 0 12px 12px;
  font-size: 14px;
  color: #64748b;
  
  span {
    display: flex;
    align-items: center;
    gap: 4px;
    
    svg {
      margin-right: 4px;
    }
  }
`;
// In ExpertChatHistory.styles.js - Add this export
export const GradientTitle = styled(Title)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
`;