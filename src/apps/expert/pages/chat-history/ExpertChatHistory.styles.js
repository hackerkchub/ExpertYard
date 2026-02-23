import styled, { keyframes, css } from "styled-components";

/* Animations */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

/* Main Container */
export const PremiumContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(145deg, #f9fafb 0%, #f3f4f6 100%);
  padding: 12px;
  position: relative;
  overflow-x: hidden;

  @media (min-width: 640px) {
    padding: 20px;
  }

  @media (min-width: 1024px) {
    padding: 24px;
  }
`;

export const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  animation: ${fadeIn} 0.6s ease-out;
`;

/* Header */
export const Header = styled.div`
  margin-bottom: 24px;

  @media (min-width: 640px) {
    margin-bottom: 28px;
  }

  @media (min-width: 1024px) {
    margin-bottom: 32px;
  }
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 6px 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  @media (min-width: 640px) {
    font-size: 28px;
  }

  @media (min-width: 1024px) {
    font-size: 32px;
  }
  
  svg {
    color: #8b5cf6;
    margin-right: 8px;

    @media (min-width: 640px) {
      margin-right: 10px;
    }

    @media (min-width: 1024px) {
      margin-right: 12px;
    }
  }
`;

export const GradientTitle = styled(Title)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
`;

/* Stats Container */
export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 24px 0;

  @media (min-width: 480px) {
    gap: 16px;
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin: 32px 0;
  }
`;

export const StatCard = styled.div`
  background: ${props => props.accent ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : 
               props.primary ? 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)' : 
               '#ffffff'};
  border: 1px solid ${props => props.accent ? '#fbbf24' : props.primary ? '#8b5cf6' : '#e2e8f0'};
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;

  @media (min-width: 480px) {
    padding: 18px;
    gap: 14px;
  }

  @media (min-width: 768px) {
    padding: 20px;
    gap: 16px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    @media (min-width: 480px) {
      width: 48px;
      height: 48px;
      border-radius: 14px;
    }

    @media (min-width: 768px) {
      width: 56px;
      height: 56px;
      border-radius: 16px;
    }
    
    svg {
      width: 18px;
      height: 18px;

      @media (min-width: 480px) {
        width: 20px;
        height: 20px;
      }

      @media (min-width: 768px) {
        width: 24px;
        height: 24px;
      }
    }
  }
  
  .stat-content {
    flex: 1;
    min-width: 0;
  }
  
  .stat-value {
    display: block;
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (min-width: 480px) {
      font-size: 20px;
    }

    @media (min-width: 768px) {
      font-size: 24px;
    }
  }
  
  .stat-label {
    font-size: 11px;
    color: #64748b;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (min-width: 480px) {
      font-size: 12px;
    }

    @media (min-width: 768px) {
      font-size: 14px;
    }
  }
`;

/* Filter Bar */
export const FilterBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    margin-bottom: 24px;
  }
`;

export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${props => props.premium ? '#f8fafc' : '#ffffff'};
  border: 2px solid ${props => props.premium ? '#e2e8f0' : '#ddd'};
  border-radius: 12px;
  padding: ${props => props.premium ? '10px 16px' : '8px 14px'};
  width: 100%;
  transition: all 0.3s ease;

  @media (min-width: 640px) {
    width: 300px;
    padding: ${props => props.premium ? '12px 20px' : '8px 16px'};
  }
  
  &:focus-within {
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
  
  svg {
    width: 16px;
    height: 16px;
    color: #94a3b8;
    flex-shrink: 0;

    @media (min-width: 640px) {
      width: 18px;
      height: 18px;
    }
  }
  
  input {
    flex: 1;
    border: none;
    background: none;
    font-size: 14px;
    color: #1e293b;
    min-width: 0;
    
    @media (min-width: 640px) {
      font-size: 15px;
    }
    
    &::placeholder {
      color: #94a3b8;
    }
    
    &:focus {
      outline: none;
    }
  }
`;

export const PillBadge = styled.button`
  padding: 8px 16px;
  border: 2px solid ${props => props.active ? '#8b5cf6' : '#e2e8f0'};
  background: ${props => props.active ? '#8b5cf6' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : '#64748b'};
  border-radius: 30px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  @media (min-width: 640px) {
    padding: 8px 20px;
    font-size: 14px;
  }
  
  &:hover {
    border-color: #7c3aed;
    background: ${props => props.active ? '#7c3aed' : '#f1f5f9'};
  }
`;

/* History List */
export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 640px) {
    gap: 14px;
  }

  @media (min-width: 1024px) {
    gap: 16px;
  }
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
  flex-direction: column;
  gap: 16px;
  padding: ${props => props.premium ? '20px' : '16px'};
  cursor: pointer;
  background: ${props => props.premium ? '#ffffff' : '#f8f9fa'};
  transition: background-color 0.2s ease;

  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: ${props => props.premium ? '24px' : '16px'};
  }
  
  &:hover {
    background: ${props => props.premium ? '#f8fafc' : '#e9ecef'};
  }
  
  h4 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    word-break: break-word;

    @media (min-width: 640px) {
      font-size: 18px;
    }
  }
  
  .meta-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #64748b;
    
    @media (min-width: 640px) {
      font-size: 13px;
    }
    
    svg {
      width: 12px;
      height: 12px;
      flex-shrink: 0;
    }
  }
  
  .chevron-icon {
    color: #8b5cf6;
    transition: transform 0.3s ease;
    width: 18px;
    height: 18px;
    align-self: flex-end;

    @media (min-width: 640px) {
      width: 20px;
      height: 20px;
      align-self: center;
    }
  }
`;

export const Avatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${props => props.premium ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#8b5cf6'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 16px;
  background-image: ${props => props.src ? `url(${props.src})` : 'none'};
  background-size: cover;
  background-position: center;
  border: ${props => props.premium ? '3px solid white' : '2px solid white'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;

  @media (min-width: 640px) {
    width: 52px;
    height: 52px;
    font-size: 18px;
  }

  @media (min-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: 20px;
  }
`;

export const EarningsBadge = styled.span`
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  white-space: nowrap;

  @media (min-width: 640px) {
    padding: 4px 12px;
    font-size: 12px;
  }
`;

/* Sessions Section */
export const SessionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;

  @media (min-width: 480px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  h5 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;

    @media (min-width: 640px) {
      font-size: 18px;
    }
  }

  .session-badge {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    width: fit-content;
  }
`;

export const SessionsWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (min-width: 640px) {
    gap: 12px;
  }
`;

export const SessionCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;

  @media (min-width: 480px) {
    flex-direction: row;
    align-items: center;
    gap: 16px;
    padding: 18px;
  }

  @media (min-width: 640px) {
    padding: 20px;
  }
  
  ${props => props.premium && `
    &:hover {
      border-color: #8b5cf6;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.1);
    }
  `}
  
  .session-indicator {
    .session-number {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 13px;

      @media (min-width: 640px) {
        width: 36px;
        height: 36px;
        font-size: 14px;
      }
    }
  }
  
  .session-info {
    flex: 1;
    
    .session-details {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 8px;

      @media (min-width: 480px) {
        gap: 20px;
      }
      
      .date, .duration {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: #64748b;

        @media (min-width: 640px) {
          font-size: 14px;
          gap: 8px;
        }
        
        svg {
          width: 14px;
          height: 14px;
          color: #8b5cf6;
          flex-shrink: 0;
        }
      }
    }
    
    .session-meta {
      .room-id {
        font-size: 11px;
        color: #94a3b8;
        background: #f1f5f9;
        padding: 4px 10px;
        border-radius: 12px;
        display: inline-block;

        @media (min-width: 640px) {
          font-size: 12px;
        }
      }
    }
  }
  
  .session-earnings {
    text-align: left;

    @media (min-width: 480px) {
      text-align: center;
    }
    
    .amount-label {
      font-size: 11px;
      color: #64748b;
      margin-bottom: 4px;

      @media (min-width: 640px) {
        font-size: 12px;
      }
    }
    
    .amount {
      font-size: 18px;
      font-weight: 700;
      color: #10b981;

      @media (min-width: 640px) {
        font-size: 20px;
      }
    }
  }
`;

export const ActionButton = styled.button`
  padding: 10px 16px;
  background: ${props => props.premium ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : '#8b5cf6'};
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s ease;
  width: 100%;

  @media (min-width: 480px) {
    width: auto;
    padding: 10px 18px;
  }

  @media (min-width: 640px) {
    padding: 10px 20px;
    font-size: 14px;
    gap: 8px;
  }
  
  &:hover {
    background: ${props => props.premium ? 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' : '#7c3aed'};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

/* Empty State */
export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: #ffffff;
  border-radius: 20px;
  border: 2px dashed #e2e8f0;

  @media (min-width: 640px) {
    padding: 80px 40px;
  }
  
  ${props => props.premium && `
    .empty-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;

      @media (min-width: 640px) {
        width: 100px;
        height: 100px;
        margin: 0 auto 24px;
      }
      
      svg {
        width: 40px;
        height: 40px;
        color: #94a3b8;

        @media (min-width: 640px) {
          width: 56px;
          height: 56px;
        }
      }
    }
  `}
  
  h3 {
    font-size: 20px;
    color: #1e293b;
    margin-bottom: 10px;

    @media (min-width: 640px) {
      font-size: 24px;
    }
  }
  
  p {
    color: #64748b;
    margin-bottom: 20px;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
    font-size: 14px;

    @media (min-width: 640px) {
      font-size: 15px;
      margin-bottom: 24px;
    }
  }
  
  .premium-btn {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    color: white;
    border: none;
    padding: 12px 28px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    
    @media (min-width: 640px) {
      padding: 14px 32px;
      font-size: 15px;
    }
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
    }
  }
`;

/* Loading Spinner */
export const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;

  @media (min-width: 640px) {
    min-height: 400px;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e2e8f0;
    border-top: 3px solid #8b5cf6;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
    margin-bottom: 16px;

    @media (min-width: 640px) {
      width: 60px;
      height: 60px;
      border-width: 4px;
      margin-bottom: 24px;
    }
  }
  
  p {
    color: #64748b;
    font-size: 14px;
    font-weight: 500;

    @media (min-width: 640px) {
      font-size: 16px;
    }
  }
`;

/* Modal */
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  animation: ${fadeIn} 0.25s ease;

  @media (min-width: 640px) {
    padding: 20px;
  }
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
  animation: ${slideUp} 0.3s ease;
  
  ${props => props.premium && `
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.1);
  `}
  
  .modal-header {
    padding: 16px;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);

    @media (min-width: 480px) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
    }

    @media (min-width: 640px) {
      padding: 24px;
    }
    
    .modal-user-info {
      display: flex;
      align-items: center;
      gap: 12px;

      @media (min-width: 480px) {
        gap: 16px;
      }
      
      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 700;
        color: #1e293b;

        @media (min-width: 480px) {
          font-size: 18px;
        }

        @media (min-width: 640px) {
          font-size: 20px;
        }
      }
      
      .modal-meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 6px;
        margin-top: 4px;
        font-size: 12px;
        color: #64748b;

        @media (min-width: 640px) {
          font-size: 14px;
          gap: 8px;
        }
        
        .earnings {
          color: #10b981;
          font-weight: 600;
        }
      }
    }
    
    .modal-close {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      border: none;
      background: #f1f5f9;
      color: #64748b;
      font-size: 22px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      align-self: flex-end;

      @media (min-width: 480px) {
        align-self: center;
        width: 40px;
        height: 40px;
        font-size: 24px;
      }
      
      &:hover {
        background: #e2e8f0;
        color: #1e293b;
      }
    }
  }
  
  .modal-footer {
    padding: 12px 16px;
    border-top: 1px solid #e2e8f0;
    background: #f8fafc;

    @media (min-width: 640px) {
      padding: 16px 24px;
    }
    
    .footer-note {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #64748b;
      font-size: 12px;
      font-style: italic;

      @media (min-width: 640px) {
        gap: 12px;
        font-size: 14px;
      }
      
      svg {
        width: 14px;
        height: 14px;
        color: #8b5cf6;

        @media (min-width: 640px) {
          width: 16px;
          height: 16px;
        }
      }
    }
  }
`;

/* Messages Area */
export const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  background: ${props => props.premium ? '#f8fafc' : '#f9f9f9'};
  padding: 16px;

  @media (min-width: 640px) {
    padding: 20px;
  }

  @media (min-width: 768px) {
    padding: 24px;
  }

  scrollbar-width: thin;

  &::-webkit-scrollbar {
    width: 4px;

    @media (min-width: 768px) {
      width: 6px;
    }
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
    
    &:hover {
      background: #94a3b8;
    }
  }

  .messages-scroll {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .no-messages {
    text-align: center;
    padding: 40px 20px;
    color: #94a3b8;
    
    svg {
      width: 40px;
      height: 40px;
      margin-bottom: 16px;

      @media (min-width: 640px) {
        width: 48px;
        height: 48px;
      }
    }
    
    p {
      font-size: 14px;

      @media (min-width: 640px) {
        font-size: 16px;
      }
    }
  }
`;

export const MessageBubble = styled.div`
  max-width: 85%;
  margin-bottom: 16px;
  margin-left: ${props => props.isExpert ? 'auto' : '0'};

  @media (min-width: 480px) {
    max-width: 75%;
  }

  @media (min-width: 768px) {
    max-width: 70%;
  }
  
  ${props => props.premium && `
    .message-header {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 6px;

      @media (min-width: 480px) {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }
      
      .sender-info {
        display: flex;
        align-items: center;
        gap: 8px;
        
        strong {
          font-size: 13px;
          color: #1e293b;

          @media (min-width: 640px) {
            font-size: 14px;
          }
        }
        
        .sender-role {
          font-size: 11px;
          color: #64748b;
          margin-left: 4px;

          @media (min-width: 640px) {
            font-size: 12px;
            margin-left: 8px;
          }
        }
      }
      
      .message-time {
        font-size: 11px;
        color: #94a3b8;

        @media (min-width: 640px) {
          font-size: 12px;
        }
      }
    }
    
    .message-content {
      padding: 12px;
      background: ${props.isExpert ? 
        'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 
        '#ffffff'};
      color: ${props.isExpert ? '#ffffff' : '#1e293b'};
      border-radius: 14px;
      border-bottom-${props.isExpert ? 'left' : 'right'}-radius: 4px;
      font-size: 13px;
      line-height: 1.5;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      word-break: break-word;

      @media (min-width: 640px) {
        padding: 14px;
        font-size: 14px;
      }

      @media (min-width: 768px) {
        padding: 16px;
      }
    }
  `}
`;

export const MessageAvatar = styled.div`
  width: ${props => props.size === 'large' ? '48px' : 
           props.small ? '24px' : '36px'};
  height: ${props => props.size === 'large' ? '48px' : 
           props.small ? '24px' : '36px'};
  border-radius: ${props => props.size === 'large' ? '14px' : 
                  props.small ? '6px' : '10px'};
  background: ${props => props.isExpert ? 
    'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 
    'linear-gradient(135deg, #10b981 0%, #34d399 100%)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: ${props => props.small ? '11px' : '14px'};
  background-image: ${props => props.src ? `url(${props.src})` : 'none'};
  background-size: cover;
  background-position: center;
  border: ${props => props.size === 'large' ? '2px solid white' : '2px solid white'};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;

  @media (min-width: 640px) {
    width: ${props => props.size === 'large' ? '56px' : 
             props.small ? '28px' : '40px'};
    height: ${props => props.size === 'large' ? '56px' : 
              props.small ? '28px' : '40px'};
    font-size: ${props => props.small ? '12px' : '16px'};
    border-radius: ${props => props.size === 'large' ? '16px' : 
                    props.small ? '8px' : '12px'};
  }
`;

/* Chat Meta */
export const ChatMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 0 0 12px 12px;
  font-size: 13px;
  color: #64748b;

  @media (min-width: 640px) {
    gap: 16px;
    padding: 8px 16px;
    font-size: 14px;
  }
  
  span {
    display: flex;
    align-items: center;
    gap: 4px;
    
    svg {
      width: 14px;
      height: 14px;
      margin-right: 4px;
    }
  }
`;