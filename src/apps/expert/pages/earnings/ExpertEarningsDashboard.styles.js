import styled, { keyframes, css } from "styled-components";

/* Animations */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(139, 92, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
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

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 200px;
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    opacity: 0.05;
    pointer-events: none;
  }
`;

export const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 0.6s ease-out;
`;

/* Header Section */
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

  @media (min-width: 640px) {
    font-size: 28px;
  }

  @media (min-width: 1024px) {
    font-size: 32px;
  }

  svg {
    margin-right: 8px;
    color: #8b5cf6;

    @media (min-width: 640px) {
      margin-right: 10px;
    }

    @media (min-width: 1024px) {
      margin-right: 12px;
    }
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export const HeaderLeft = styled.div`
  flex: 1;
`;

export const HeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;

  @media (min-width: 480px) {
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }

  @media (min-width: 768px) {
    width: auto;
  }
`;

export const BalanceDisplay = styled.div`
  text-align: left;
  padding: 12px 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);

  @media (min-width: 480px) {
    text-align: right;
    padding: 8px 20px;
  }

  @media (min-width: 768px) {
    padding: 8px 24px;
  }

  .balance-label {
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
    margin-bottom: 4px;

    @media (min-width: 480px) {
      font-size: 13px;
    }
  }

  .balance-value {
    font-size: 22px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.2;

    @media (min-width: 480px) {
      font-size: 24px;
    }

    @media (min-width: 768px) {
      font-size: 28px;
    }
  }
`;

export const PayoutButton = styled.button`
  padding: 12px 20px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  width: 100%;

  @media (min-width: 480px) {
    width: auto;
    padding: 12px 24px;
    font-size: 14px;
  }

  @media (min-width: 768px) {
    padding: 12px 28px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

/* Stats Grid */
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 24px;

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 32px;
  }
`;

export const StatCard = styled.div`
  background: ${props => props.$primary ? 
    'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)' : 
    props.$accent ? 
    'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : 
    '#ffffff'};
  border: 1px solid ${props => props.$primary ? '#8b5cf6' : 
    props.$accent ? '#fbbf24' : '#e2e8f0'};
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.6s ease-out;

  @media (min-width: 640px) {
    padding: 24px;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    @media (min-width: 640px) {
      width: 56px;
      height: 56px;
    }
    
    svg {
      width: 20px;
      height: 20px;
      color: ${props => props.$primary ? '#8b5cf6' : 
        props.$accent ? '#f59e0b' : '#0ea5e9'};

      @media (min-width: 640px) {
        width: 24px;
        height: 24px;
      }
    }
  }
  
  .stat-content {
    flex: 1;
    min-width: 0;
  }
  
  .stat-label {
    font-size: 13px;
    color: #64748b;
    font-weight: 500;
    margin-bottom: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (min-width: 640px) {
      font-size: 14px;
      margin-bottom: 8px;
    }
  }
  
  .stat-value {
    font-size: 22px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.2;
    margin-bottom: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (min-width: 640px) {
      font-size: 26px;
      margin-bottom: 8px;
    }

    @media (min-width: 1024px) {
      font-size: 28px;
    }
  }
  
  .stat-change {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: #10b981;
    font-weight: 500;

    @media (min-width: 640px) {
      font-size: 12px;
      gap: 6px;
    }
    
    svg {
      width: 12px;
      height: 12px;
      margin-top: 1px;

      @media (min-width: 640px) {
        width: 14px;
        height: 14px;
      }
    }
  }
`;

/* Main Content Grid */
export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 380px;
    gap: 24px;
  }

  @media (min-width: 1280px) {
    grid-template-columns: 1fr 400px;
    gap: 24px;
  }
`;

/* Chart Container */
export const ChartContainer = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  animation: ${slideIn} 0.6s ease-out;

  @media (min-width: 640px) {
    padding: 24px;
  }

  @media (min-width: 1024px) {
    margin-bottom: 24px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;

  @media (min-width: 640px) {
    font-size: 20px;
  }
`;

export const TimeFilter = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;

  @media (min-width: 640px) {
    gap: 8px;
  }
`;

export const FilterPill = styled.button`
  padding: 6px 14px;
  border: 2px solid ${props => props.$active ? '#8b5cf6' : '#e2e8f0'};
  background: ${props => props.$active ? '#8b5cf6' : 'transparent'};
  color: ${props => props.$active ? '#ffffff' : '#64748b'};
  border-radius: 30px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  @media (min-width: 640px) {
    padding: 6px 16px;
    font-size: 13px;
  }
  
  &:hover {
    border-color: #7c3aed;
    background: ${props => props.$active ? '#7c3aed' : '#f8fafc'};
  }
`;

export const ChartPlaceholder = styled.div`
  height: 180px;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-style: italic;
  text-align: center;
  padding: 20px;

  @media (min-width: 640px) {
    height: 200px;
  }

  svg {
    margin-bottom: 12px;
    opacity: 0.5;
  }
`;

/* Transaction History */
export const TransactionHistory = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.6s ease-out 0.2s both;

  @media (min-width: 640px) {
    padding: 24px;
  }
`;

export const TransactionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: #f8fafc;
  border-radius: 14px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;

  @media (min-width: 640px) {
    padding: 16px;
    gap: 16px;
  }
  
  &:hover {
    border-color: #8b5cf6;
    background: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.1);
  }
  
  .transaction-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;

    @media (min-width: 640px) {
      width: 40px;
      height: 40px;
    }
  }
  
  .transaction-details {
    flex: 1;
    min-width: 0;
  }
  
  .transaction-title {
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 4px;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (min-width: 640px) {
      font-size: 15px;
    }
  }
  
  .transaction-date {
    font-size: 11px;
    color: #64748b;

    @media (min-width: 640px) {
      font-size: 12px;
    }
  }
  
  .transaction-amount {
    text-align: right;
    min-width: 90px;

    @media (min-width: 640px) {
      min-width: 100px;
    }
  }
  
  .amount {
    font-weight: 700;
    color: #10b981;
    margin-bottom: 4px;
    font-size: 14px;

    @media (min-width: 640px) {
      font-size: 15px;
    }
  }
  
  .status {
    font-size: 10px;
    font-weight: 500;
    text-transform: capitalize;

    @media (min-width: 640px) {
      font-size: 11px;
    }
  }
  
  .transaction-action {
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 4px;
    flex-shrink: 0;
    
    &:hover {
      color: #8b5cf6;
    }

    svg {
      width: 16px;
      height: 16px;

      @media (min-width: 640px) {
        width: 18px;
        height: 18px;
      }
    }
  }
`;

/* Right Column Components */
export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (min-width: 1024px) {
    gap: 24px;
  }
`;

export const AccountStatus = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  animation: ${slideIn} 0.6s ease-out;

  @media (min-width: 640px) {
    padding: 24px;
  }
`;

export const VerificationBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => 
    props.$status === 'verified' ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' :
    props.$status === 'pending' ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' :
    props.$status === 'rejected' ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' :
    '#f1f5f9'};
  color: ${props => 
    props.$status === 'verified' ? '#065f46' :
    props.$status === 'pending' ? '#92400e' :
    props.$status === 'rejected' ? '#991b1b' :
    '#64748b'};
  white-space: nowrap;

  @media (min-width: 640px) {
    padding: 6px 14px;
    font-size: 13px;
  }
`;

export const PayoutProgress = styled.div`
  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .progress-label {
    font-size: 13px;
    color: #64748b;

    @media (min-width: 640px) {
      font-size: 14px;
    }
  }
  
  .progress-percentage {
    font-size: 16px;
    font-weight: 700;
    color: #8b5cf6;

    @media (min-width: 640px) {
      font-size: 18px;
    }
  }
  
  .progress-bar {
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 20px;

    @media (min-width: 640px) {
      margin-bottom: 24px;
    }
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%);
    border-radius: 4px;
    transition: width 0.3s ease;
  }
  
  .progress-steps {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-bottom: 20px;
    
    &::before {
      content: '';
      position: absolute;
      top: 12px;
      left: 15px;
      right: 15px;
      height: 2px;
      background: #e2e8f0;
      z-index: 1;

      @media (min-width: 640px) {
        left: 20px;
        right: 20px;
      }
    }
  }
  
  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;
    flex: 1;
  }
  
  .step-number {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: ${props => props.$completed ? '#8b5cf6' : '#e2e8f0'};
    color: ${props => props.$completed ? '#ffffff' : '#64748b'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 600;
    margin-bottom: 6px;

    @media (min-width: 640px) {
      width: 24px;
      height: 24px;
      font-size: 12px;
    }
  }
  
  .step-label {
    font-size: 10px;
    color: #64748b;
    text-align: center;
    max-width: 70px;

    @media (min-width: 640px) {
      font-size: 11px;
      max-width: 80px;
    }
  }
`;

export const SetupButton = styled.button`
  width: 100%;
  padding: 12px;
  background: ${props => props.$verified ? '#f8fafc' : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'};
  color: ${props => props.$verified ? '#64748b' : 'white'};
  border: ${props => props.$verified ? '1px solid #e2e8f0' : 'none'};
  border-radius: 14px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;

  @media (min-width: 640px) {
    padding: 14px;
    font-size: 14px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$verified ? 
      '0 4px 12px rgba(0, 0, 0, 0.1)' : 
      '0 8px 20px rgba(139, 92, 246, 0.4)'};
  }
`;

export const SummaryCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.6s ease-out 0.1s both;

  @media (min-width: 640px) {
    padding: 24px;
  }
  
  .summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #e2e8f0;
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .summary-label {
    font-size: 13px;
    color: #64748b;

    @media (min-width: 640px) {
      font-size: 14px;
    }
  }
  
  .summary-value {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;

    @media (min-width: 640px) {
      font-size: 15px;
    }
  }
`;

export const SecurityNote = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 14px;
  margin-top: 20px;
  color: #92400e;
  animation: ${pulse} 2s ease-in-out infinite;

  @media (min-width: 640px) {
    padding: 16px 20px;
  }

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;

    @media (min-width: 640px) {
      width: 20px;
      height: 20px;
    }
  }

  .security-text {
    flex: 1;
  }

  .security-title {
    font-weight: 600;
    margin-bottom: 4px;
    font-size: 13px;

    @media (min-width: 640px) {
      font-size: 14px;
    }
  }

  .security-description {
    font-size: 12px;

    @media (min-width: 640px) {
      font-size: 13px;
    }
  }
`;

export const BankDetailsCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  animation: ${slideIn} 0.6s ease-out 0.2s both;

  @media (min-width: 640px) {
    padding: 24px;
  }
  
  .bank-detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    border-bottom: 1px solid #e2e8f0;
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .detail-label {
    font-size: 13px;
    color: #64748b;

    @media (min-width: 640px) {
      font-size: 14px;
    }
  }
  
  .detail-value {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    font-family: 'Courier New', monospace;

    @media (min-width: 640px) {
      font-size: 15px;
    }
  }
`;

export const InfoCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.6s ease-out 0.3s both;

  @media (min-width: 640px) {
    padding: 20px;
    gap: 16px;
  }

  svg {
    width: 22px;
    height: 22px;
    color: #8b5cf6;
    flex-shrink: 0;

    @media (min-width: 640px) {
      width: 24px;
      height: 24px;
    }
  }

  .info-content {
    flex: 1;
  }

  .info-title {
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 4px;
    font-size: 14px;

    @media (min-width: 640px) {
      font-size: 15px;
    }
  }

  .info-description {
    font-size: 12px;
    color: #64748b;

    @media (min-width: 640px) {
      font-size: 13px;
    }
  }
`;

export const InfoButton = styled.button`
  padding: 8px 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  color: #64748b;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  @media (min-width: 640px) {
    padding: 8px 16px;
    font-size: 13px;
  }

  &:hover {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }
`;

/* Modal */
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 12px;
  animation: ${fadeIn} 0.3s ease;

  @media (min-width: 640px) {
    padding: 20px;
  }
`;

export const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 24px;
  padding: 24px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${slideUp} 0.4s ease;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

  @media (min-width: 640px) {
    padding: 32px;
    border-radius: 28px;
  }

  @media (min-width: 1024px) {
    border-radius: 32px;
  }
  
  &::-webkit-scrollbar {
    width: 6px;

    @media (min-width: 640px) {
      width: 8px;
    }
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
    
    &:hover {
      background: #94a3b8;
    }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  @media (min-width: 640px) {
    margin-bottom: 24px;
  }

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;

    @media (min-width: 640px) {
      font-size: 24px;
    }
  }
`;

export const ModalClose = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  transition: all 0.2s ease;

  @media (min-width: 640px) {
    width: 40px;
    height: 40px;
  }

  &:hover {
    background: #fee2e2;
    color: #ef4444;
    transform: rotate(90deg);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

/* Forms */
export const AccountForm = styled.form`
  margin-top: 20px;

  @media (min-width: 640px) {
    margin-top: 24px;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 18px;
  }

  @media (min-width: 640px) {
    gap: 20px;
  }
`;

export const InputGroup = styled.div`
  margin-bottom: 0;

  ${props => props.$fullWidth && css`
    @media (min-width: 480px) {
      grid-column: span 2;
    }
  `}
`;

export const FormLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 6px;

  @media (min-width: 640px) {
    font-size: 14px;
    gap: 8px;
    margin-bottom: 8px;
  }
  
  svg {
    color: #64748b;
    width: 14px;
    height: 14px;

    @media (min-width: 640px) {
      width: 16px;
      height: 16px;
    }
  }
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  color: #1e293b;
  background: #ffffff;
  transition: all 0.3s ease;

  @media (min-width: 640px) {
    padding: 12px 16px;
    font-size: 15px;
    border-radius: 14px;
  }
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
  
  &:disabled {
    background: #f8fafc;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

export const SelectInput = styled.select`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  color: #1e293b;
  background: #ffffff;
  transition: all 0.3s ease;
  cursor: pointer;

  @media (min-width: 640px) {
    padding: 12px 16px;
    font-size: 15px;
    border-radius: 14px;
  }
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }

  option {
    background: #ffffff;
  }
`;

export const FormActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  flex-direction: column;

  @media (min-width: 480px) {
    flex-direction: row;
    margin-top: 28px;
  }

  @media (min-width: 640px) {
    margin-top: 32px;
  }
`;

export const FormButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  border: ${props => props.$primary ? 'none' : '2px solid #e2e8f0'};
  background: ${props => props.$primary ? 
    'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 
    '#ffffff'};
  color: ${props => props.$primary ? '#ffffff' : '#64748b'};
  border-radius: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: ${props => props.disabled ? 0.7 : 1};

  @media (min-width: 640px) {
    padding: 14px 24px;
    font-size: 15px;
    border-radius: 16px;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${props => props.$primary ? 
      '0 8px 20px rgba(139, 92, 246, 0.4)' : 
      '0 4px 12px rgba(0, 0, 0, 0.1)'};
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

/* Payout Options */
export const PayoutOption = styled.div`
  padding: 16px;
  border: 2px solid ${props => props.$selected ? '#8b5cf6' : '#e2e8f0'};
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 12px;
  background: ${props => props.$selected ? 
    'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)' : 
    '#ffffff'};

  @media (min-width: 640px) {
    padding: 20px;
  }
  
  &:hover {
    border-color: #8b5cf6;
    background: #f8fafc;
  }

  .option-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;

    @media (min-width: 640px) {
      width: 40px;
      height: 40px;
    }
  }

  .option-title {
    font-weight: 600;
    color: #1e293b;
    font-size: 14px;

    @media (min-width: 640px) {
      font-size: 15px;
    }
  }

  .option-subtitle {
    font-size: 12px;
    color: #64748b;

    @media (min-width: 640px) {
      font-size: 13px;
    }
  }
`;

/* Loader */
export const Loader = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid #e2e8f0;
  border-top-color: #8b5cf6;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-right: 8px;

  @media (min-width: 640px) {
    width: 20px;
    height: 20px;
  }
`;

/* Success Message */
export const SuccessMessage = styled.div`
  padding: 16px;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-radius: 16px;
  border: 1px solid #10b981;
  color: #065f46;
  text-align: center;
  margin-top: 20px;
  animation: ${fadeIn} 0.5s ease;

  @media (min-width: 640px) {
    padding: 20px;
  }
  
  svg {
    width: 32px;
    height: 32px;
    margin-bottom: 12px;

    @media (min-width: 640px) {
      width: 40px;
      height: 40px;
    }
  }
  
  h3 {
    margin: 0 0 8px 0;
    font-size: 16px;

    @media (min-width: 640px) {
      font-size: 18px;
    }
  }
  
  p {
    margin: 0;
    font-size: 13px;

    @media (min-width: 640px) {
      font-size: 14px;
    }
  }
`;