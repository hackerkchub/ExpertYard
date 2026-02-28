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
  padding: 8px;
  position: relative;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 480px) {
    padding: 12px;
  }

  @media (min-width: 640px) {
    padding: 16px;
  }

  @media (min-width: 768px) {
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
  width: 100%;
`;

/* Loading Spinner */
export const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  width: 100%;

  @media (min-width: 640px) {
    min-height: 400px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #e2e8f0;
    border-top: 3px solid #8b5cf6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;

    @media (min-width: 640px) {
      width: 50px;
      height: 50px;
      border-width: 4px;
    }
  }

  p {
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
    margin: 0;
    text-align: center;

    @media (min-width: 640px) {
      font-size: 16px;
    }
  }
`;

/* Header Section */
export const Header = styled.div`
  margin-bottom: 16px;
  width: 100%;

  @media (min-width: 480px) {
    margin-bottom: 20px;
  }

  @media (min-width: 640px) {
    margin-bottom: 24px;
  }

  @media (min-width: 1024px) {
    margin-bottom: 32px;
  }
`;

export const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  @media (min-width: 480px) {
    font-size: 22px;
  }

  @media (min-width: 640px) {
    font-size: 24px;
    margin-bottom: 6px;
  }

  @media (min-width: 768px) {
    font-size: 26px;
  }

  @media (min-width: 1024px) {
    font-size: 32px;
    margin-bottom: 8px;
  }

  svg {
    margin-right: 6px;
    color: #8b5cf6;
    width: 20px;
    height: 20px;

    @media (min-width: 480px) {
      width: 22px;
      height: 22px;
      margin-right: 8px;
    }

    @media (min-width: 640px) {
      width: 24px;
      height: 24px;
      margin-right: 10px;
    }

    @media (min-width: 1024px) {
      width: 28px;
      height: 28px;
      margin-right: 12px;
    }
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;

  @media (min-width: 480px) {
    gap: 14px;
  }

  @media (min-width: 640px) {
    gap: 16px;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export const HeaderLeft = styled.div`
  flex: 1;
  width: 100%;
`;

export const HeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;

  @media (min-width: 480px) {
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }

  @media (min-width: 640px) {
    gap: 12px;
    width: auto;
  }

  @media (min-width: 768px) {
    gap: 16px;
  }
`;

export const BalanceDisplay = styled.div`
  text-align: left;
  padding: 10px 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
  width: 100%;

  @media (min-width: 480px) {
    text-align: right;
    padding: 10px 16px;
    width: auto;
    min-width: 160px;
  }

  @media (min-width: 640px) {
    padding: 10px 20px;
    min-width: 180px;
  }

  @media (min-width: 768px) {
    padding: 8px 24px;
    min-width: 200px;
  }

  .balance-label {
    font-size: 11px;
    color: #64748b;
    font-weight: 500;
    margin-bottom: 2px;

    @media (min-width: 480px) {
      font-size: 12px;
      margin-bottom: 4px;
    }

    @media (min-width: 640px) {
      font-size: 13px;
    }
  }

  .balance-value {
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.2;

    @media (min-width: 480px) {
      font-size: 20px;
    }

    @media (min-width: 640px) {
      font-size: 22px;
    }

    @media (min-width: 768px) {
      font-size: 24px;
    }

    @media (min-width: 1024px) {
      font-size: 28px;
    }
  }
`;

export const PayoutButton = styled.button`
  padding: 10px 16px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  width: 100%;

  @media (min-width: 480px) {
    width: auto;
    min-width: 140px;
    padding: 10px 18px;
    font-size: 13px;
    gap: 8px;
  }

  @media (min-width: 640px) {
    padding: 12px 20px;
    font-size: 14px;
    min-width: 160px;
  }

  @media (min-width: 768px) {
    padding: 12px 24px;
    min-width: 180px;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 16px;
    height: 16px;

    @media (min-width: 640px) {
      width: 18px;
      height: 18px;
    }
  }
`;

/* Stats Grid */
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-bottom: 20px;
  width: 100%;

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  @media (min-width: 640px) {
    gap: 16px;
    margin-bottom: 24px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 32px;
  }
`;

/* Main Content Grid */
export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  width: 100%;

  @media (min-width: 640px) {
    gap: 20px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 360px;
    gap: 24px;
  }
`;

/* Chart Container */
export const ChartContainer = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  margin-bottom: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  animation: ${slideIn} 0.6s ease-out;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 480px) {
    padding: 18px;
    border-radius: 18px;
  }

  @media (min-width: 640px) {
    padding: 20px;
    margin-bottom: 20px;
  }

  @media (min-width: 768px) {
    border-radius: 20px;
    padding: 24px;
  }

  @media (min-width: 1024px) {
    margin-bottom: 24px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;

  @media (min-width: 480px) {
    font-size: 17px;
  }

  @media (min-width: 640px) {
    font-size: 18px;
  }

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

export const TimeFilter = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;

  @media (min-width: 480px) {
    gap: 6px;
  }

  @media (min-width: 640px) {
    gap: 8px;
  }
`;

export const FilterPill = styled.button`
  padding: 4px 10px;
  border: 1px solid ${props => props.$active ? '#8b5cf6' : '#e2e8f0'};
  background: ${props => props.$active ? '#8b5cf6' : 'transparent'};
  color: ${props => props.$active ? '#ffffff' : '#64748b'};
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  @media (min-width: 480px) {
    padding: 5px 12px;
    font-size: 12px;
  }

  @media (min-width: 640px) {
    padding: 6px 14px;
    font-size: 12px;
  }

  @media (min-width: 768px) {
    padding: 6px 16px;
    font-size: 13px;
  }
  
  &:hover {
    border-color: #7c3aed;
    background: ${props => props.$active ? '#7c3aed' : '#f8fafc'};
  }
`;

export const ChartPlaceholder = styled.div`
  height: 160px;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-style: italic;
  text-align: center;
  padding: 16px;
  font-size: 12px;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 480px) {
    height: 170px;
    font-size: 13px;
  }

  @media (min-width: 640px) {
    height: 180px;
    border-radius: 14px;
  }

  @media (min-width: 768px) {
    height: 200px;
    border-radius: 16px;
  }

  svg {
    margin-bottom: 8px;
    opacity: 0.5;
    width: 24px;
    height: 24px;

    @media (min-width: 640px) {
      width: 28px;
      height: 28px;
    }
  }
`;

/* Transaction History */
export const TransactionHistory = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  animation: ${fadeIn} 0.6s ease-out 0.2s both;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 480px) {
    padding: 18px;
  }

  @media (min-width: 640px) {
    padding: 20px;
    border-radius: 18px;
  }

  @media (min-width: 768px) {
    padding: 24px;
    border-radius: 20px;
  }
`;

/* Right Column Components */
export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;

  @media (min-width: 640px) {
    gap: 20px;
  }

  @media (min-width: 1024px) {
    gap: 24px;
  }
`;

export const AccountStatus = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  animation: ${slideIn} 0.6s ease-out;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 480px) {
    padding: 18px;
  }

  @media (min-width: 640px) {
    padding: 20px;
    border-radius: 18px;
  }

  @media (min-width: 768px) {
    padding: 24px;
    border-radius: 20px;
  }
`;

export const PayoutProgress = styled.div`
  width: 100%;
  
  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    width: 100%;
  }
  
  .progress-label {
    font-size: 12px;
    color: #64748b;

    @media (min-width: 480px) {
      font-size: 12px;
    }

    @media (min-width: 640px) {
      font-size: 13px;
    }

    @media (min-width: 768px) {
      font-size: 14px;
    }
  }
  
  .progress-percentage {
    font-size: 14px;
    font-weight: 700;
    color: #8b5cf6;

    @media (min-width: 480px) {
      font-size: 15px;
    }

    @media (min-width: 640px) {
      font-size: 16px;
    }

    @media (min-width: 768px) {
      font-size: 18px;
    }
  }
  
  .progress-bar {
    height: 6px;
    background: #e2e8f0;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 16px;
    width: 100%;

    @media (min-width: 480px) {
      margin-bottom: 18px;
    }

    @media (min-width: 640px) {
      margin-bottom: 20px;
      height: 8px;
    }
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%);
    border-radius: 3px;
    transition: width 0.3s ease;
  }
  
  .progress-steps {
    display: flex;
    justify-content: space-between;
    position: relative;
    margin-bottom: 16px;
    width: 100%;
    
    &::before {
      content: '';
      position: absolute;
      top: 10px;
      left: 10px;
      right: 10px;
      height: 2px;
      background: #e2e8f0;
      z-index: 1;

      @media (min-width: 480px) {
        left: 15px;
        right: 15px;
      }

      @media (min-width: 640px) {
        top: 11px;
        left: 18px;
        right: 18px;
      }

      @media (min-width: 768px) {
        top: 12px;
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
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${props => props.$completed ? '#8b5cf6' : '#e2e8f0'};
    color: ${props => props.$completed ? '#ffffff' : '#64748b'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 600;
    margin-bottom: 4px;

    @media (min-width: 480px) {
      width: 20px;
      height: 20px;
      font-size: 11px;
    }

    @media (min-width: 640px) {
      width: 22px;
      height: 22px;
      font-size: 11px;
      margin-bottom: 5px;
    }

    @media (min-width: 768px) {
      width: 24px;
      height: 24px;
      font-size: 12px;
      margin-bottom: 6px;
    }
  }
  
  .step-label {
    font-size: 9px;
    color: #64748b;
    text-align: center;
    max-width: 60px;

    @media (min-width: 480px) {
      font-size: 10px;
      max-width: 70px;
    }

    @media (min-width: 640px) {
      font-size: 11px;
      max-width: 80px;
    }
  }
`;

export const SetupButton = styled.button`
  width: 100%;
  padding: 10px;
  background: ${props => props.$verified ? '#f8fafc' : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'};
  color: ${props => props.$verified ? '#64748b' : 'white'};
  border: ${props => props.$verified ? '1px solid #e2e8f0' : 'none'};
  border-radius: 12px;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.3s ease;

  @media (min-width: 480px) {
    padding: 11px;
    font-size: 12px;
    gap: 7px;
  }

  @media (min-width: 640px) {
    padding: 12px;
    font-size: 13px;
    gap: 8px;
    border-radius: 14px;
  }

  @media (min-width: 768px) {
    padding: 14px;
    font-size: 14px;
  }

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: ${props => props.$verified ? 
      '0 4px 12px rgba(0, 0, 0, 0.05)' : 
      '0 6px 16px rgba(139, 92, 246, 0.3)'};
  }

  svg {
    width: 14px;
    height: 14px;

    @media (min-width: 640px) {
      width: 16px;
      height: 16px;
    }
  }
`;

export const BankDetailsCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  animation: ${slideIn} 0.6s ease-out 0.2s both;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 480px) {
    padding: 18px;
  }

  @media (min-width: 640px) {
    padding: 20px;
    border-radius: 18px;
  }

  @media (min-width: 768px) {
    padding: 24px;
    border-radius: 20px;
  }
  
  .bank-detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #e2e8f0;
    width: 100%;
    
    &:last-child {
      border-bottom: none;
    }

    @media (min-width: 480px) {
      padding: 9px 0;
    }

    @media (min-width: 640px) {
      padding: 10px 0;
    }
  }
  
  .detail-label {
    font-size: 12px;
    color: #64748b;

    @media (min-width: 480px) {
      font-size: 12px;
    }

    @media (min-width: 640px) {
      font-size: 13px;
    }

    @media (min-width: 768px) {
      font-size: 14px;
    }
  }
  
  .detail-value {
    font-size: 12px;
    font-weight: 600;
    color: #1e293b;
    font-family: 'Courier New', monospace;

    @media (min-width: 480px) {
      font-size: 12px;
    }

    @media (min-width: 640px) {
      font-size: 13px;
    }

    @media (min-width: 768px) {
      font-size: 14px;
    }
  }
`;

export const InfoCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  padding: 14px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  animation: ${fadeIn} 0.6s ease-out 0.3s both;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 480px) {
    padding: 16px;
    gap: 12px;
  }

  @media (min-width: 640px) {
    padding: 18px;
    gap: 14px;
  }

  @media (min-width: 768px) {
    padding: 20px;
    gap: 16px;
  }

  svg {
    width: 20px;
    height: 20px;
    color: #8b5cf6;
    flex-shrink: 0;

    @media (min-width: 480px) {
      width: 21px;
      height: 21px;
    }

    @media (min-width: 640px) {
      width: 22px;
      height: 22px;
    }

    @media (min-width: 768px) {
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
    margin-bottom: 2px;
    font-size: 13px;

    @media (min-width: 480px) {
      font-size: 13px;
    }

    @media (min-width: 640px) {
      font-size: 14px;
      margin-bottom: 4px;
    }

    @media (min-width: 768px) {
      font-size: 15px;
    }
  }

  .info-description {
    font-size: 11px;
    color: #64748b;

    @media (min-width: 480px) {
      font-size: 11px;
    }

    @media (min-width: 640px) {
      font-size: 12px;
    }

    @media (min-width: 768px) {
      font-size: 13px;
    }
  }
`;

export const InfoButton = styled.button`
  padding: 6px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  @media (min-width: 480px) {
    padding: 7px 14px;
    font-size: 12px;
  }

  @media (min-width: 640px) {
    padding: 8px 16px;
    font-size: 12px;
  }

  @media (min-width: 768px) {
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
  backdrop-filter: blur(4px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 1000;
  padding: 0;
  animation: ${fadeIn} 0.3s ease;

  @media (min-width: 480px) {
    align-items: center;
    padding: 12px;
  }

  @media (min-width: 640px) {
    backdrop-filter: blur(6px);
    padding: 16px;
  }

  @media (min-width: 768px) {
    padding: 20px;
    backdrop-filter: blur(8px);
  }
`;

export const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 20px 20px 0 0;
  padding: 20px;
  max-width: 100%;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${slideUp} 0.4s ease;
  box-shadow: 0 -5px 25px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;

  @media (min-width: 480px) {
    border-radius: 20px;
    max-width: 600px;
    padding: 24px;
  }

  @media (min-width: 640px) {
    max-width: 700px;
    padding: 28px;
    border-radius: 24px;
  }

  @media (min-width: 768px) {
    max-width: 800px;
    padding: 32px;
    border-radius: 28px;
  }
  
  &::-webkit-scrollbar {
    width: 4px;

    @media (min-width: 640px) {
      width: 6px;
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
  margin-bottom: 16px;
  width: 100%;

  @media (min-width: 480px) {
    margin-bottom: 18px;
  }

  @media (min-width: 640px) {
    margin-bottom: 20px;
  }

  @media (min-width: 768px) {
    margin-bottom: 24px;
  }

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;

    @media (min-width: 480px) {
      font-size: 20px;
    }

    @media (min-width: 640px) {
      font-size: 22px;
    }

    @media (min-width: 768px) {
      font-size: 24px;
    }
  }
`;

export const ModalClose = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
  flex-shrink: 0;

  @media (min-width: 480px) {
    width: 34px;
    height: 34px;
    font-size: 23px;
  }

  @media (min-width: 640px) {
    width: 36px;
    height: 36px;
    font-size: 24px;
    border-radius: 9px;
  }

  @media (min-width: 768px) {
    width: 38px;
    height: 38px;
    border-radius: 10px;
  }

  @media (min-width: 1024px) {
    width: 40px;
    height: 40px;
  }

  &:hover:not(:disabled) {
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
  margin-top: 16px;
  width: 100%;

  @media (min-width: 480px) {
    margin-top: 18px;
  }

  @media (min-width: 640px) {
    margin-top: 20px;
  }

  @media (min-width: 768px) {
    margin-top: 24px;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  width: 100%;

  @media (min-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (min-width: 640px) {
    gap: 18px;
  }

  @media (min-width: 768px) {
    gap: 20px;
  }
`;

export const InputGroup = styled.div`
  margin-bottom: 0;
  width: 100%;

  ${props => props.$fullWidth && css`
    @media (min-width: 480px) {
      grid-column: span 2;
    }
  `}
`;

export const FormLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;

  @media (min-width: 480px) {
    gap: 5px;
    font-size: 12px;
    margin-bottom: 5px;
  }

  @media (min-width: 640px) {
    gap: 6px;
    font-size: 13px;
    margin-bottom: 6px;
  }

  @media (min-width: 768px) {
    font-size: 14px;
    gap: 8px;
    margin-bottom: 8px;
  }
  
  svg {
    color: #64748b;
    width: 12px;
    height: 12px;

    @media (min-width: 480px) {
      width: 13px;
      height: 13px;
    }

    @media (min-width: 640px) {
      width: 14px;
      height: 14px;
    }

    @media (min-width: 768px) {
      width: 16px;
      height: 16px;
    }
  }
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 13px;
  color: #1e293b;
  background: #ffffff;
  transition: all 0.3s ease;
  box-sizing: border-box;

  @media (min-width: 480px) {
    padding: 11px 13px;
    font-size: 13px;
  }

  @media (min-width: 640px) {
    padding: 12px 14px;
    font-size: 14px;
    border-radius: 12px;
  }

  @media (min-width: 768px) {
    padding: 12px 16px;
    font-size: 15px;
    border-radius: 14px;
  }
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
  }
  
  &:disabled {
    background: #f8fafc;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: #94a3b8;
    font-size: 12px;
  }
`;

export const FormActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-direction: column;
  width: 100%;

  @media (min-width: 400px) {
    flex-direction: row;
  }

  @media (min-width: 480px) {
    gap: 12px;
    margin-top: 22px;
  }

  @media (min-width: 640px) {
    gap: 14px;
    margin-top: 24px;
  }

  @media (min-width: 768px) {
    margin-top: 28px;
  }
`;

export const FormButton = styled.button`
  flex: 1;
  padding: 10px 16px;
  border: ${props => props.$primary ? 'none' : '2px solid #e2e8f0'};
  background: ${props => props.$primary ? 
    'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 
    '#ffffff'};
  color: ${props => props.$primary ? '#ffffff' : '#64748b'};
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  opacity: ${props => props.disabled ? 0.7 : 1};

  @media (min-width: 480px) {
    padding: 11px 18px;
    font-size: 13px;
  }

  @media (min-width: 640px) {
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 14px;
    gap: 8px;
  }

  @media (min-width: 768px) {
    padding: 14px 24px;
    font-size: 15px;
    border-radius: 16px;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: ${props => props.$primary ? 
      '0 6px 16px rgba(139, 92, 246, 0.3)' : 
      '0 4px 12px rgba(0, 0, 0, 0.05)'};
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }

  svg {
    width: 14px;
    height: 14px;

    @media (min-width: 640px) {
      width: 16px;
      height: 16px;
    }

    @media (min-width: 768px) {
      width: 18px;
      height: 18px;
    }
  }
`;

/* Payout Options */
export const PayoutOption = styled.div`
  padding: 14px;
  border: 2px solid ${props => props.$selected ? '#8b5cf6' : '#e2e8f0'};
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 10px;
  background: ${props => props.$selected ? 
    'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)' : 
    '#ffffff'};
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 480px) {
    padding: 16px;
    margin-bottom: 12px;
  }

  @media (min-width: 640px) {
    padding: 18px;
    border-radius: 16px;
  }

  @media (min-width: 768px) {
    padding: 20px;
  }
  
  &:hover {
    border-color: #8b5cf6;
    background: #f8fafc;
  }

  .option-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;

    @media (min-width: 480px) {
      width: 34px;
      height: 34px;
    }

    @media (min-width: 640px) {
      width: 36px;
      height: 36px;
      border-radius: 9px;
    }

    @media (min-width: 768px) {
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }
  }

  .option-title {
    font-weight: 600;
    color: #1e293b;
    font-size: 13px;

    @media (min-width: 480px) {
      font-size: 13px;
    }

    @media (min-width: 640px) {
      font-size: 14px;
    }

    @media (min-width: 768px) {
      font-size: 15px;
    }
  }

  .option-subtitle {
    font-size: 11px;
    color: #64748b;

    @media (min-width: 480px) {
      font-size: 11px;
    }

    @media (min-width: 640px) {
      font-size: 12px;
    }

    @media (min-width: 768px) {
      font-size: 13px;
    }
  }
`;

/* Loader */
export const Loader = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #e2e8f0;
  border-top-color: #8b5cf6;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-right: 6px;

  @media (min-width: 480px) {
    width: 17px;
    height: 17px;
  }

  @media (min-width: 640px) {
    width: 18px;
    height: 18px;
    border-width: 2px;
    margin-right: 8px;
  }

  @media (min-width: 768px) {
    width: 20px;
    height: 20px;
  }
`;

/* Success Message */
export const SuccessMessage = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-radius: 16px;
  border: 1px solid #10b981;
  color: #065f46;
  text-align: center;
  animation: ${fadeIn} 0.5s ease;
  z-index: 1100;
  max-width: 90%;
  width: 400px;
  box-sizing: border-box;

  @media (min-width: 480px) {
    padding: 24px;
    border-radius: 20px;
  }

  @media (min-width: 640px) {
    padding: 28px;
  }
  
  svg {
    width: 32px;
    height: 32px;
    margin-bottom: 12px;

    @media (min-width: 480px) {
      width: 36px;
      height: 36px;
    }

    @media (min-width: 640px) {
      width: 40px;
      height: 40px;
      margin-bottom: 16px;
    }
  }
  
  h3 {
    margin: 0 0 6px 0;
    font-size: 18px;

    @media (min-width: 480px) {
      font-size: 20px;
    }
  }
  
  p {
    margin: 0;
    font-size: 14px;

    @media (min-width: 480px) {
      font-size: 15px;
    }
  }
`;

/* Withdrawal History */
export const WithdrawalHistory = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  animation: ${fadeIn} 0.6s ease-out 0.15s both;
  margin-top: 16px;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 480px) {
    padding: 18px;
  }

  @media (min-width: 640px) {
    padding: 20px;
    border-radius: 18px;
    margin-top: 20px;
  }

  @media (min-width: 768px) {
    padding: 24px;
    border-radius: 20px;
  }
`;

export const WithdrawalItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #e2e8f0;
  width: 100%;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  @media (min-width: 480px) {
    padding: 11px 0;
  }

  @media (min-width: 640px) {
    padding: 12px 0;
  }
`;

export const StatusBadge = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => 
    props.$status === 'approved' || props.$status === 'paid' || props.$status === 'completed' ? 'rgba(16, 185, 129, 0.1)' :
    props.$status === 'pending' || props.$status === 'processing' ? 'rgba(245, 158, 11, 0.1)' :
    props.$status === 'rejected' || props.$status === 'failed' ? 'rgba(239, 68, 68, 0.1)' :
    '#f1f5f9'};
  color: ${props => 
    props.$status === 'approved' || props.$status === 'paid' || props.$status === 'completed' ? '#10b981' :
    props.$status === 'pending' || props.$status === 'processing' ? '#f59e0b' :
    props.$status === 'rejected' || props.$status === 'failed' ? '#ef4444' :
    '#64748b'};
  flex-shrink: 0;

  @media (min-width: 480px) {
    width: 34px;
    height: 34px;
  }

  @media (min-width: 640px) {
    width: 36px;
    height: 36px;
    border-radius: 9px;
  }

  svg {
    width: 14px;
    height: 14px;

    @media (min-width: 480px) {
      width: 15px;
      height: 15px;
    }

    @media (min-width: 640px) {
      width: 16px;
      height: 16px;
    }
  }
`;

/* All Withdrawals Section */
export const AllWithdrawalsSection = styled.section`
  margin-top: 20px;
  padding: 16px;
  background: white;
  border-radius: 16px;
  border: 1px solid #eef2f6;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
  
  ${props => !props.$expanded && `
    display: none;
  `}

  @media (min-width: 480px) {
    padding: 18px;
    border-radius: 18px;
  }

  @media (min-width: 640px) {
    margin-top: 24px;
    padding: 20px;
    border-radius: 20px;
  }

  @media (min-width: 768px) {
    margin-top: 28px;
    padding: 24px;
    border-radius: 24px;
  }
`;

export const WithdrawalsTable = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 16px 0;
  border-radius: 12px;
  border: 1px solid #eef2f6;
  
  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 800px;
    
    @media (max-width: 768px) {
      min-width: 700px;
    }
    
    @media (max-width: 480px) {
      min-width: 600px;
    }
  }
`;

export const TableHeaderCell = styled.th`
  text-align: left;
  padding: 10px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;

  @media (min-width: 480px) {
    padding: 12px 14px;
    font-size: 12px;
  }

  @media (min-width: 640px) {
    padding: 12px 16px;
    font-size: 13px;
  }
`;

export const TableRow = styled.tr`
  &:hover {
    background: #f8fafc;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #eef2f6;
  }
`;

export const TableCell = styled.td`
  padding: 10px 12px;
  font-size: 12px;
  color: #1e293b;

  @media (min-width: 480px) {
    padding: 12px 14px;
    font-size: 12px;
  }

  @media (min-width: 640px) {
    padding: 14px 16px;
    font-size: 13px;
  }
`;

export const WithdrawalDetailsModal = styled.div`
  padding: 0;
  width: 100%;

  @media (min-width: 480px) {
    padding: 4px;
  }

  @media (min-width: 640px) {
    padding: 8px;
  }

  @media (min-width: 768px) {
    padding: 16px;
  }
`;
export const ExportButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 14px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #8b5cf6;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  @media (min-width: 480px) {
    width: auto;
    padding: 8px 16px;
  }

  @media (min-width: 640px) {
    gap: 8px;
    padding: 10px 18px;
    font-size: 13px;
    border-radius: 10px;
  }
  
  &:hover {
    background: #f5f3ff;
    border-color: #8b5cf6;
  }

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
`;


// Add these to your existing styles file

export const DesktopOnly = styled.div`
  display: none;
  
  @media (min-width: 1024px) {
    display: block;
  }
`;

export const MobileOnly = styled.div`
  display: block;
  
  @media (min-width: 1024px) {
    display: none;
  }
`;

export const BalanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;

  @media (min-width: 480px) {
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    width: auto;
  }
`;

export const RightColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  
  @media (min-width: 640px) and (max-width: 1023px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoCardsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  
  @media (min-width: 480px) and (max-width: 1023px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const StatsRow = styled.div`
  display: flex;
  gap: 8px;
  font-size: 11px;
  
  @media (min-width: 640px) {
    font-size: 12px;
    gap: 12px;
  }
`;

export const TransactionMeta = styled.div`
  font-size: 11px;
  color: #94a3b8;
  margin-top: 2px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  
  @media (min-width: 640px) {
    font-size: 12px;
    gap: 12px;
  }
`;



// ExpertEarningsDashboard.styles.js (Add these new components)
// Add these to your existing styled components file

export const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 2px solid #eef2f6;
  padding-bottom: 8px;
  overflow-x: auto;
  
  @media (min-width: 640px) {
    gap: 12px;
  }
`;

export const Tab = styled.button`
  padding: 10px 16px;
  background: ${props => props.$active ? '#8b5cf6' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#64748b'};
  border: ${props => props.$active ? 'none' : '1px solid #e2e8f0'};
  border-radius: 30px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$active ? '#7c3aed' : '#f8fafc'};
    color: ${props => props.$active ? 'white' : '#1e293b'};
  }
  
  @media (min-width: 640px) {
    padding: 12px 24px;
    font-size: 14px;
  }
  
  svg {
    font-size: 14px;
    
    @media (min-width: 640px) {
      font-size: 16px;
    }
  }
`;


export const FilterDrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
  }
`;

export const FilterDrawerBody = styled.div`
  margin-bottom: 20px;
`;

export const FilterDrawerFooter = styled.div`
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
`;
// ExpertEarningsDashboard.styles.js - Fix text visibility and mobile layout
// Add/modify these styles in your existing file

/* Fix text visibility issues - Add these color variables */
export const textColors = {
  primary: '#0f172a',      // Dark blue-gray for primary text
  secondary: '#334155',    // Slightly lighter for secondary text
  tertiary: '#475569',     // For less important text
  muted: '#64748b',        // Muted text (was too light)
  accent: '#8b5cf6',       // Purple accent
  success: '#059669',      // Darker green for better contrast
  warning: '#b45309',      // Darker orange
  error: '#b91c1c',        // Darker red
  info: '#2563eb',         // Darker blue
};

/* Update StatCard for better text contrast */
export const StatCard = styled.div`
  background: ${props => props.$primary ? 
    'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)' : 
    props.$accent ? 
    'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : 
    '#ffffff'};
  border: 1px solid ${props => props.$primary ? '#8b5cf6' : 
    props.$accent ? '#fbbf24' : '#e2e8f0'};
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  animation: ${fadeIn} 0.6s ease-out;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 480px) {
    padding: 18px;
    gap: 14px;
  }

  @media (min-width: 640px) {
    padding: 20px;
    gap: 16px;
  }

  @media (min-width: 768px) {
    border-radius: 18px;
  }

  @media (min-width: 1024px) {
    border-radius: 20px;
    padding: 24px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .stat-content {
    flex: 1;
    min-width: 0;
  }
  
  .stat-label {
    font-size: 12px;
    color: #334155; /* Darker for better contrast */
    font-weight: 600;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  
  .stat-value {
    font-size: 18px;
    font-weight: 700;
    color: #0f172a; /* Darker primary text */
    line-height: 1.2;
    margin-bottom: 4px;
  }
  
  .stat-change {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    color: #059669; /* Darker green */
    font-weight: 600;
  }
`;

/* Update TransactionItem for better text contrast */
export const TransactionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box;

  .transaction-title {
    font-weight: 600;
    color: #0f172a; /* Darker primary */
    margin-bottom: 2px;
    font-size: 12px;
  }
  
  .transaction-date {
    font-size: 10px;
    color: #475569; /* Darker than before */
    font-weight: 500;
  }
  
  .amount {
    font-weight: 700;
    color: #059669; /* Darker green */
    margin-bottom: 2px;
    font-size: 12px;
  }
  
  .status {
    font-size: 9px;
    font-weight: 600;
    text-transform: capitalize;
    color: #475569; /* Darker */
  }
`;

/* Update SummaryCard for better text contrast */
export const SummaryCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  
  .summary-label {
    font-size: 12px;
    color: #334155; /* Darker */
    font-weight: 500;
  }
  
  .summary-value {
    font-size: 13px;
    font-weight: 600;
    color: #0f172a; /* Darker */
  }
`;

/* Update SecurityNote for better contrast */
export const SecurityNote = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  margin-top: 16px;
  color: #92400e; /* Darker orange */
  border: 1px solid #fbbf24;
  
  .security-title {
    font-weight: 600;
    margin-bottom: 2px;
    font-size: 12px;
    color: #78350f; /* Even darker */
  }
  
  .security-description {
    font-size: 11px;
    color: #92400e; /* Darker */
  }
`;

/* Update VerificationBadge for better contrast */
export const VerificationBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 600;
  background: ${props => 
    props.$status === 'verified' ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)' :
    props.$status === 'pending' ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' :
    props.$status === 'rejected' ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' :
    '#f1f5f9'};
  color: ${props => 
    props.$status === 'verified' ? '#065f46' : /* Darker green */
    props.$status === 'pending' ? '#92400e' : /* Darker orange */
    props.$status === 'rejected' ? '#991b1b' : /* Darker red */
    '#334155'}; /* Darker gray */
  border: 1px solid ${props => 
    props.$status === 'verified' ? '#10b981' :
    props.$status === 'pending' ? '#f59e0b' :
    props.$status === 'rejected' ? '#ef4444' :
    '#cbd5e1'};
`;

/* Update EmptyState for better contrast */
export const EmptyState = styled.div`
  text-align: center;
  padding: 30px 16px;
  
  svg {
    color: #64748b;
  }
  
  h3 {
    margin: 0 0 6px 0;
    font-size: 15px;
    font-weight: 600;
    color: #0f172a; /* Darker */
  }
  
  p {
    margin: 0;
    font-size: 12px;
    color: #475569; /* Darker */
  }
`;

/* Mobile Transaction Card - Fix for mobile visibility */
export const MobileTransactionCard = styled.div`
  background: white;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  padding: 14px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
  
  .transaction-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0; /* Allow text to truncate */
  }
  
  .transaction-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }
  
  .transaction-info {
    flex: 1;
    min-width: 0; /* Allow truncation */
  }
  
  .transaction-title {
    font-size: 13px;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .transaction-meta {
    font-size: 11px;
    color: #475569;
    display: flex;
    gap: 8px;
  }
  
  .transaction-right {
    text-align: right;
    flex-shrink: 0;
    margin-left: 8px;
  }
  
  .transaction-amount {
    font-size: 15px;
    font-weight: 700;
    color: #059669;
    margin-bottom: 2px;
    white-space: nowrap;
  }
  
  .transaction-rate {
    font-size: 10px;
    color: #64748b;
    white-space: nowrap;
  }
`;

/* Mobile Withdrawal Card - Fix for mobile */
export const MobileWithdrawalCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-bottom: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  width: 100%;
`;

export const MobileCardHeader = styled.div`
  padding: 12px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  
  strong {
    color: #0f172a;
    font-size: 13px;
  }
`;

export const MobileCardBody = styled.div`
  padding: 12px;
  
  .detail-label {
    font-size: 11px;
    color: #475569;
    font-weight: 500;
    margin-bottom: 2px;
  }
  
  .detail-value {
    font-size: 14px;
    color: #0f172a;
    font-weight: 600;
  }
`;

export const MobileCardFooter = styled.div`
  padding: 12px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
`;

/* Fix DateRangePicker for mobile */
export const DateRangePicker = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;

  @media (min-width: 480px) {
    flex-direction: row;
    align-items: center;
    width: auto;
    gap: 8px;
  }
  
  input[type="date"] {
    padding: 10px 12px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 13px;
    color: #0f172a;
    background: white;
    width: 100%;
    
    &:focus {
      outline: none;
      border-color: #8b5cf6;
    }
  }
  
  span {
    color: #475569;
    font-size: 13px;
    text-align: center;
  }
`;

/* Fix FilterBar for mobile */
export const FilterBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 640px) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }
`;

/* Fix SearchInput for mobile */
export const SearchInput = styled.div`
  flex: 1;
  min-width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;

  @media (min-width: 640px) {
    min-width: 250px;
  }
  
  input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 13px;
    color: #0f172a;
    background: transparent;
    width: 100%;
    
    &::placeholder {
      color: #64748b;
      font-size: 13px;
    }
  }

  svg {
    width: 16px;
    height: 16px;
    color: #64748b;
    flex-shrink: 0;
  }
`;

/* Fix SelectInput for better visibility */
export const SelectInput = styled.select`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 13px;
  color: #0f172a;
  background: white;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
  }
  
  option {
    color: #0f172a;
    background: white;
    padding: 8px;
  }
`;

/* Fix FilterDrawer for mobile */
export const FilterDrawer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  padding: 20px;
  box-shadow: 0 -5px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 85vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
  
  h3 {
    color: #0f172a;
    font-size: 18px;
    font-weight: 600;
  }
`;

/* Fix Pagination for mobile */
export const Pagination = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  width: 100%;
  
  span {
    color: #475569;
    font-size: 13px;
  }
`;

export const PageButton = styled.button`
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  border: 1px solid ${props => props.$active ? '#8b5cf6' : '#e2e8f0'};
  border-radius: 8px;
  background: ${props => props.$active ? '#8b5cf6' : 'white'};
  color: ${props => props.$active ? 'white' : '#0f172a'};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background: ${props => props.$active ? '#7c3aed' : '#f1f5f9'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* Fix ActionButton for mobile */
export const ActionButton = styled.button`
  padding: 8px 14px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #8b5cf6;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e2e8f0;
    color: #7c3aed;
  }
  
  @media (max-width: 480px) {
    padding: 10px 16px;
    font-size: 13px;
    width: 100%;
    justify-content: center;
  }
`;

/* Add missing Label component */
export const Label = styled.label`
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 6px;
`;

/* Fix mobile tab bar */
export const MobileTabBar = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 20px;
  padding: 6px;
  background: white;
  border-radius: 40px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  width: 100%;
  
  ${Tab} {
    flex: 1;
    justify-content: center;
    border: none;
    background: ${props => props.$active ? '#8b5cf6' : 'transparent'};
    color: ${props => props.$active ? 'white' : '#475569'};
    font-size: 12px;
    padding: 10px 8px;
    
    &:hover {
      background: ${props => props.$active ? '#7c3aed' : '#f1f5f9'};
    }
    
    svg {
      font-size: 14px;
    }
  }
`;

/* Fix mobile filter button */
export const MobileFilterButton = styled.button`
  padding: 10px 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 30px;
  color: #475569;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background: #f1f5f9;
    border-color: #8b5cf6;
    color: #8b5cf6;
  }
`;

/* Fix mobile search bar */
export const MobileSearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  width: 100%;
  
  svg {
    color: #64748b;
    width: 16px;
    height: 16px;
  }
  
  input {
    flex: 1;
    border: none;
    outline: none;
    font-size: 14px;
    color: #0f172a;
    background: transparent;
    width: 100%;
    
    &::placeholder {
      color: #64748b;
      font-size: 14px;
    }
  }
`;

/* Fix filter tag for mobile */
export const FilterTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f1f5f9;
  border-radius: 20px;
  font-size: 12px;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  
  button {
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 2px 4px;
    font-size: 14px;
    
    &:hover {
      color: #ef4444;
    }
  }
`;

/* Fix clear filters button */
export const ClearFilters = styled.button`
  padding: 8px 16px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 20px;
  color: #b91c1c;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    background: #fecaca;
  }
`;

/* Fix primary/secondary buttons */
export const PrimaryButton = styled.button`
  flex: 1;
  padding: 14px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  }
`;

export const SecondaryButton = styled.button`
  flex: 1;
  padding: 14px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  
  &:hover:not(:disabled) {
    background: #e2e8f0;
  }
`;