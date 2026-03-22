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
  background: #F4F2EE;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #191919;
`;

export const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 25px 20px;

  @media (max-width: 768px) {
    padding: 30px 16px;
  }

  @media (max-width: 480px) {
    padding: 25px 12px;
  }
`;

export const Header = styled.div`
  margin-bottom: 32px;

  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

export const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #191919;
  display: flex;
  align-items: center;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

export const ResponsiveGrid = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 16px;
  margin: 24px 0 16px;
  border-bottom: 2px solid #E9E5DF;
  padding-bottom: 12px;

  @media (max-width: 480px) {
    gap: 8px;
    margin: 16px 0 12px;
  }
`;

export const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 28px;
  background: ${props => props.active ? '#0A66C2' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666666'};
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? '#0A66C2' : '#F3F2F0'};
    color: ${props => props.active ? 'white' : '#191919'};
  }

  @media (max-width: 768px) {
    padding: 8px 20px;
    font-size: 14px;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }

  @media (max-width: 480px) {
    padding: 6px 16px;
    font-size: 13px;
    flex: 1;
    justify-content: center;
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

export const MobileSummaryToggle = styled.button`
  display: none;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #E9E5DF;
  border-radius: 24px;
  color: #0A66C2;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  width: fit-content;

  @media (max-width: 768px) {
    display: flex;
  }

  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
  }
`;

export const SummaryCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 20px 24px;
  border: 1px solid #E9E5DF;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  min-width: 300px;

  @media (max-width: 768px) {
    min-width: 100%;
    display: ${props => props.className?.includes('mobile-visible') ? 'block' : 'none'};
    margin-top: 8px;
  }

  .summary-header {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #0A66C2;
    font-weight: 600;
    margin-bottom: 16px;
    font-size: 14px;
  }

  .summary-stats {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    gap: 8px;
  }

  .summary-stat {
    text-align: center;
    flex: 1;
  }

  .stat-value {
    display: block;
    font-size: 20px;
    font-weight: 700;
    color: #191919;

    @media (max-width: 480px) {
      font-size: 16px;
    }
  }

  .stat-label {
    font-size: 12px;
    color: #666666;

    @media (max-width: 480px) {
      font-size: 10px;
    }
  }

  .summary-meta {
    display: flex;
    justify-content: space-between;
    padding-top: 12px;
    border-top: 1px solid #E9E5DF;
    font-size: 12px;
    color: #666666;
    gap: 8px;
    flex-wrap: wrap;
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 24px 0;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const StatCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #E9E5DF;
  transition: all 0.3s ease;

  ${props => props.accent && `
    background: white;
    border-left: 4px solid #0A66C2;
  `}

  ${props => props.primary && `
    background: white;
    border-left: 4px solid #0A66C2;
  `}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
    gap: 12px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    background: #F3F2F0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;

    @media (max-width: 768px) {
      width: 40px;
      height: 40px;
      font-size: 20px;
    }

    @media (max-width: 480px) {
      width: 36px;
      height: 36px;
      font-size: 18px;
    }
  }

  .stat-content {
    display: flex;
    flex-direction: column;
  }

  .stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #191919;
    line-height: 1.2;

    @media (max-width: 768px) {
      font-size: 20px;
    }

    @media (max-width: 480px) {
      font-size: 18px;
    }
  }

  .stat-label {
    font-size: 13px;
    color: #666666;
    font-weight: 500;

    @media (max-width: 480px) {
      font-size: 11px;
    }
  }
`;

export const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

export const SearchBar = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #E9E5DF;
  border-radius: 40px;
  padding: 8px 16px;
  transition: all 0.2s ease;

  ${props => props.premium && `
    box-shadow: 0 2px 8px rgba(10, 102, 194, 0.08);
    
    &:focus-within {
      border-color: #0A66C2;
      box-shadow: 0 0 0 4px rgba(10, 102, 194, 0.1);
    }
  `}

  input {
    flex: 1;
    border: none;
    outline: none;
    padding: 8px 12px;
    font-size: 14px;
    background: transparent;

    @media (max-width: 480px) {
      font-size: 13px;
      padding: 6px 8px;
    }
  }

  svg {
    color: #999999;
    flex-shrink: 0;
  }
`;

export const PillBadge = styled.button`
  padding: 8px 16px;
  border-radius: 30px;
  border: 1px solid ${props => props.active ? '#0A66C2' : '#E9E5DF'};
  background: ${props => props.active ? '#0A66C2' : 'white'};
  color: ${props => props.active ? 'white' : '#666666'};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;

  &:hover {
    background: ${props => props.active ? '#0A66C2' : '#F3F2F0'};
    border-color: ${props => props.active ? '#0A66C2' : '#D0CBC4'};
  }

  @media (max-width: 768px) {
    padding: 6px 14px;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 11px;
    flex: 1;
    justify-content: center;
  }
`;

export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 24px;

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

export const HistoryItem = styled.div`
  background: ${props => props.premium ? 'white' : 'white'};
  border-radius: 20px;
  border: 1px solid #E9E5DF;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.5s ease;

  ${props => props.premium && `
    border-color: rgba(10, 102, 194, 0.2);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  `}

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  .expanded-content {
    padding: 24px;
    background: #FAF9F7;
    border-radius: 0 0 16px 16px;
    border-top: 1px solid #E9E5DF;

    @media (max-width: 768px) {
      padding: 16px;
    }

    @media (max-width: 480px) {
      padding: 12px;
    }
  }

  .call-stats-badges {
    display: flex;
    gap: 8px;
    margin-top: 4px;
    flex-wrap: wrap;

    @media (max-width: 480px) {
      gap: 4px;
    }
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 500;

    &.completed {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }

    &.missed {
      background: rgba(245, 158, 11, 0.1);
      color: #f59e0b;
    }

    &.rejected {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }
  }
`;

export const ChatHeader = styled.div`
  padding: 20px 24px;
  cursor: ${props => props.onClick ? 'pointer' : 'default'};
  transition: background 0.2s ease;

  ${props => props.premium && `
    &:hover {
      background: rgba(10, 102, 194, 0.02);
    }
  `}

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }

  .chat-header-content {
    display: flex;
    align-items: center;
    gap: 16px;

    @media (max-width: 768px) {
      gap: 12px;
    }

    @media (max-width: 480px) {
      flex-wrap: wrap;
    }
  }

  .expert-info {
    flex: 1;
    min-width: 0;

    @media (max-width: 480px) {
      width: calc(100% - 60px);
    }
  }

  .expert-name-section {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 6px;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      gap: 8px;
    }

    h4 {
      font-size: 16px;
      font-weight: 600;
      color: #191919;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 200px;

      @media (max-width: 768px) {
        font-size: 15px;
        max-width: 150px;
      }

      @media (max-width: 480px) {
        font-size: 14px;
        max-width: 120px;
      }
    }
  }

  .rate-badge {
    background: #0A66C2;
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;

    @media (max-width: 768px) {
      padding: 3px 10px;
      font-size: 12px;
    }

    @media (max-width: 480px) {
      padding: 2px 8px;
      font-size: 11px;
    }
  }

  .expert-stats {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      gap: 12px;
    }

    @media (max-width: 480px) {
      gap: 8px;
    }
  }

  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: #666666;

    @media (max-width: 480px) {
      font-size: 11px;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;

    @media (max-width: 768px) {
      gap: 12px;
    }

    .last-consultation {
      text-align: right;

      div:first-child {
        font-size: 12px;
        color: #666666;
      }

      .last-date {
        font-size: 13px;
        font-weight: 600;
        color: #191919;

        @media (max-width: 480px) {
          font-size: 12px;
        }
      }
    }
  }

  .chevron-icon {
    color: #999999;
    transition: transform 0.2s ease;
    flex-shrink: 0;
  }
`;

export const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${props => props.premium ? '#0A66C2' : '#E9E5DF'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

export const ExpertBadge = styled.span`
  background: #0A66C2;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 3px 10px;
    font-size: 11px;
  }

  @media (max-width: 480px) {
    padding: 2px 8px;
    font-size: 10px;
    
    .expert-position {
      max-width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

export const SessionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  h5 {
    font-size: 14px;
    font-weight: 600;
    color: #191919;
    margin: 0;
  }

  .expert-badge {
    background: #F3F2F0;
    color: #666666;
    padding: 4px 10px;
    border-radius: 16px;
    font-size: 11px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 4px;
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
  padding: 16px;
  background: white;
  border-radius: 16px;
  border: 1px solid #E9E5DF;
  transition: all 0.2s ease;

  ${props => props.premium && `
    &:hover {
      border-color: #0A66C2;
      box-shadow: 0 4px 12px rgba(10, 102, 194, 0.08);
    }
  `}

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 12px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 12px;
  }

  .session-indicator {
    .session-number {
      width: 32px;
      height: 32px;
      background: #F3F2F0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      color: #666666;

      @media (max-width: 480px) {
        width: 28px;
        height: 28px;
        font-size: 11px;
      }
    }
  }

  .session-info {
    flex: 2;
    min-width: 200px;

    @media (max-width: 768px) {
      min-width: 180px;
    }

    @media (max-width: 480px) {
      width: 100%;
      min-width: auto;
    }
  }

  .session-details {
    display: flex;
    gap: 16px;
    margin-bottom: 4px;
    flex-wrap: wrap;

    @media (max-width: 480px) {
      gap: 8px;
    }

    .date, .duration {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: #666666;

      @media (max-width: 480px) {
        font-size: 12px;
      }
    }
  }

  .session-meta {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;

    @media (max-width: 480px) {
      gap: 8px;
    }

    .rate-label {
      font-size: 11px;
      color: #999999;

      @media (max-width: 480px) {
        font-size: 10px;
      }
    }

    .call-type-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 500;

      &.voice {
        background: rgba(10, 102, 194, 0.1);
        color: #0A66C2;
      }

      &.video {
        background: rgba(139, 92, 246, 0.1);
        color: #8b5cf6;
      }
    }
  }

  .session-amount {
    text-align: right;

    @media (max-width: 480px) {
      width: 100%;
      text-align: left;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .amount-label {
      font-size: 10px;
      color: #999999;
      margin-bottom: 2px;

      @media (max-width: 480px) {
        margin-bottom: 0;
      }
    }

    .amount {
      font-size: 16px;
      font-weight: 700;
      color: #0A66C2;

      @media (max-width: 480px) {
        font-size: 14px;
      }
    }
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
    justify-content: flex-end;
  }

  @media (max-width: 480px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

export const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: 24px;
  border: 1px solid #E9E5DF;
  background: white;
  color: #666666;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  ${props => props.primary && `
    background: #0A66C2;
    color: white;
    border: none;
    
    &:hover {
      background: #004182;
    }
  `}

  &:hover {
    background: ${props => props.primary ? '#004182' : '#F3F2F0'};
    border-color: ${props => props.primary ? '#004182' : '#D0CBC4'};
  }

  @media (max-width: 768px) {
    padding: 6px 14px;
    font-size: 12px;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 11px;
    flex: 1;
    justify-content: center;
  }
`;

export const ViewChatButton = styled(ActionButton)`
  background: white;
  color: #0A66C2;
  border-color: #0A66C2;

  &:hover {
    background: #0A66C2;
    color: white;
  }
`;

export const ChatAgainButton = styled(ActionButton)`
  background: #0A66C2;
  color: white;
  border: none;

  &:hover {
    background: #004182;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: ${props => props.premium ? 'white' : 'white'};
  border-radius: 30px;
  border: 2px dashed #E9E5DF;

  @media (max-width: 768px) {
    padding: 40px 16px;
  }

  @media (max-width: 480px) {
    padding: 30px 12px;
  }

  .empty-icon {
    color: #999999;
    margin-bottom: 20px;

    @media (max-width: 480px) {
      svg {
        width: 48px;
        height: 48px;
      }
    }
  }

  h3 {
    font-size: 20px;
    font-weight: 600;
    color: #191919;
    margin-bottom: 8px;

    @media (max-width: 480px) {
      font-size: 18px;
    }
  }

  p {
    color: #666666;
    margin-bottom: 24px;
    font-size: 14px;

    @media (max-width: 480px) {
      font-size: 13px;
    }
  }

  .premium-btn {
    background: #0A66C2;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 24px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(10, 102, 194, 0.3);
    }

    @media (max-width: 480px) {
      padding: 10px 20px;
      font-size: 13px;
      width: 100%;
      justify-content: center;
    }
  }
`;

export const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;

  .spinner {
    width: 48px;
    height: 48px;
    border: 3px solid rgba(10, 102, 194, 0.1);
    border-top-color: #0A66C2;
    border-radius: 50%;
    animation: ${spin} 0.8s linear infinite;
    margin-bottom: 16px;
  }

  p {
    color: #666666;
    font-size: 14px;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const ModalContent = styled.div`
  background: ${props => props.premium ? 'white' : 'white'};
  border-radius: 30px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

  @media (max-width: 480px) {
    max-height: 90vh;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #E9E5DF;

    @media (max-width: 768px) {
      padding: 20px;
    }

    @media (max-width: 480px) {
      padding: 16px;
    }
  }

  .modal-user-info {
    display: flex;
    align-items: center;
    gap: 16px;

    @media (max-width: 480px) {
      gap: 12px;
    }
  }

  .modal-meta {
    display: flex;
    gap: 8px;
    font-size: 12px;
    color: #666666;
    margin-top: 4px;
    flex-wrap: wrap;

    @media (max-width: 480px) {
      font-size: 11px;
    }
  }

  .modal-close {
    background: #F3F2F0;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #666666;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover {
      background: #E9E5DF;
      color: #191919;
    }

    @media (max-width: 480px) {
      width: 28px;
      height: 28px;
      font-size: 18px;
    }
  }

  .modal-footer {
    padding: 16px 24px;
    border-top: 1px solid #E9E5DF;

    @media (max-width: 480px) {
      padding: 12px 16px;
    }

    .footer-note {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #999999;
      font-size: 12px;

      @media (max-width: 480px) {
        font-size: 11px;
      }
    }
  }
`;

export const ChatMessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: ${props => props.premium ? '#FAF9F7' : '#F3F2F0'};

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 16px;
  }

  .messages-scroll {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .no-messages {
    text-align: center;
    padding: 40px 20px;
    color: #999999;

    @media (max-width: 480px) {
      padding: 30px 16px;
      
      svg {
        width: 40px;
        height: 40px;
      }
    }
  }
`;

export const ChatMessageBubble = styled.div`
  background: ${props => props.isExpert ? 'white' : '#0A66C2'};
  color: ${props => props.isExpert ? '#191919' : 'white'};
  padding: 16px;
  border-radius: 20px;
  max-width: 80%;
  align-self: ${props => props.isExpert ? 'flex-start' : 'flex-end'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.3s ease;

  ${props => props.premium && `
    border: ${props.isExpert ? '1px solid rgba(10, 102, 194, 0.1)' : 'none'};
  `}

  @media (max-width: 768px) {
    max-width: 85%;
    padding: 14px;
  }

  @media (max-width: 480px) {
    max-width: 90%;
    padding: 12px;
  }

  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 12px;

    @media (max-width: 480px) {
      font-size: 11px;
    }
  }

  .sender-info {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .sender-role {
    opacity: 0.8;
  }

  .message-time {
    font-size: 10px;
    opacity: 0.7;
  }

  .message-content {
    font-size: 14px;
    line-height: 1.5;
    word-break: break-word;

    @media (max-width: 480px) {
      font-size: 13px;
    }
  }
`;

export const UserMessageAvatar = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.isExpert ? '#F3F2F0' : 'rgba(255, 255, 255, 0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;

  @media (max-width: 480px) {
    width: 20px;
    height: 20px;
    font-size: 10px;
  }
`;