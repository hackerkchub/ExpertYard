// src/apps/expert/pages/earnings/ExpertEarningsDashboard.styles.js
import styled from "styled-components";

export const PremiumContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 24px;
`;

export const DashboardContainer = styled.div`
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
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
`;

export const StatCard = styled.div`
  background: ${props => props.primary ? 
    'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)' : 
    props.accent ? 
    'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' : 
    '#ffffff'};
  border: 1px solid ${props => props.primary ? '#8b5cf6' : 
    props.accent ? '#fbbf24' : '#e2e8f0'};
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
  
  .stat-icon {
    width: 60px;
    height: 60px;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      color: ${props => props.primary ? '#8b5cf6' : 
        props.accent ? '#f59e0b' : '#0ea5e9'};
      width: 24px;
      height: 24px;
    }
  }
  
  .stat-content {
    flex: 1;
  }
  
  .stat-label {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
    margin-bottom: 8px;
  }
  
  .stat-value {
    font-size: 28px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1.2;
    margin-bottom: 8px;
  }
  
  .stat-change {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #10b981;
    font-weight: 500;
    
    svg {
      margin-top: 2px;
    }
  }
`;

export const ChartContainer = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

export const TimeFilter = styled.div`
  display: flex;
  gap: 8px;
`;

export const FilterPill = styled.button`
  padding: 6px 16px;
  border: 2px solid ${props => props.active ? '#8b5cf6' : '#e2e8f0'};
  background: ${props => props.active ? '#8b5cf6' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : '#64748b'};
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #7c3aed;
    background: ${props => props.active ? '#7c3aed' : '#f8fafc'};
  }
`;

export const TransactionHistory = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

export const TransactionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #8b5cf6;
    background: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.1);
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
  }
  
  .transaction-details {
    flex: 1;
  }
  
  .transaction-title {
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 4px;
  }
  
  .transaction-date {
    font-size: 12px;
    color: #64748b;
  }
  
  .transaction-amount {
    text-align: right;
  }
  
  .amount {
    font-weight: 700;
    color: #10b981;
    margin-bottom: 4px;
  }
  
  .status {
    font-size: 12px;
    font-weight: 500;
    text-transform: capitalize;
  }
  
  .transaction-action {
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 4px;
    
    &:hover {
      color: #8b5cf6;
    }
  }
`;

export const AccountStatus = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

export const PayoutProgress = styled.div`
  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  
  .progress-label {
    font-size: 14px;
    color: #64748b;
  }
  
  .progress-percentage {
    font-size: 18px;
    font-weight: 700;
    color: #8b5cf6;
  }
  
  .progress-bar {
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 24px;
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
    
    &::before {
      content: '';
      position: absolute;
      top: 12px;
      left: 20px;
      right: 20px;
      height: 2px;
      background: #e2e8f0;
      z-index: 1;
    }
  }
  
  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;
  }
  
  .step-number {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${props => props.completed ? '#8b5cf6' : '#e2e8f0'};
    color: ${props => props.completed ? '#ffffff' : '#64748b'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .step-label {
    font-size: 12px;
    color: #64748b;
    text-align: center;
    max-width: 80px;
  }
`;

export const SummaryCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  
  .summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #e2e8f0;
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .summary-label {
    font-size: 14px;
    color: #64748b;
  }
  
  .summary-value {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
  }
`;

export const BankDetailsCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  
  .bank-detail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #e2e8f0;
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  .detail-label {
    font-size: 14px;
    color: #64748b;
  }
  
  .detail-value {
    font-size: 15px;
    font-weight: 600;
    color: #1e293b;
    font-family: 'Courier New', monospace;
  }
`;

export const InfoCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
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
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export const ModalContent = styled.div`
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

export const AccountForm = styled.form`
  margin-top: 24px;
`;

export const InputGroup = styled.div`
  margin-bottom: 20px;
`;

export const FormLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
  
  svg {
    color: #64748b;
  }
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  color: #1e293b;
  background: #ffffff;
  transition: all 0.3s ease;
  
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
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 15px;
  color: #1e293b;
  background: #ffffff;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #8b5cf6;
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
  }
`;

export const FormButton = styled.button`
  padding: 14px 24px;
  border: ${props => props.primary ? 'none' : '2px solid #e2e8f0'};
  background: ${props => props.primary ? 
    'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' : 
    '#ffffff'};
  color: ${props => props.primary ? '#ffffff' : '#64748b'};
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: ${props => props.disabled ? 0.7 : 1};
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${props => props.primary ? 
      '0 4px 12px rgba(139, 92, 246, 0.3)' : 
      '0 2px 8px rgba(0, 0, 0, 0.1)'};
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

export const VerificationBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
`;

export const SuccessMessage = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-radius: 12px;
  border: 1px solid #10b981;
  color: #065f46;
  text-align: center;
  margin-top: 20px;
  animation: fadeIn 0.5s ease;
  
  svg {
    margin-bottom: 12px;
  }
  
  h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
  }
  
  p {
    margin: 0;
    font-size: 14px;
  }
`;

export const EarningsChart = styled.div`
  height: 200px;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-style: italic;
`;