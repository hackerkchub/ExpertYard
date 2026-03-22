import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); }`;

export const PageWrap = styled.div`
  width: 100%; min-height: 100vh; background: #f4f7fa;
  display: flex; justify-content: center; padding: 20px;
  font-family: 'Inter', sans-serif;
`;

export const WalletBox = styled.div`
  width: 100%; max-width: 900px; animation: ${fadeIn} 0.5s ease;
`;

export const HeaderRow = styled.div`
  display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;
  .page-title { font-size: 20px; font-weight: 700; color: #1a202c; }
  .user-badge { display: flex; align-items: center; gap: 8px; background: white; padding: 6px 12px; border-radius: 20px; border: 1px solid #e2e8f0; }
`;

export const BalanceCard = styled.div`
  background: linear-gradient(135deg, #1a365d 0%, #2a4365 100%);
  padding: 30px; border-radius: 16px; color: white; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  margin-bottom: 15px;
  .balance-header h3 { font-size: 14px; opacity: 0.8; margin-bottom: 10px; }
  .balance-footer { display: flex; gap: 30px; margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); }
  .stat-label { font-size: 11px; opacity: 0.7; display: block; }
  .stat-value { font-weight: 600; font-size: 15px; }
`;

export const BalanceAmount = styled.div`
  display: flex; align-items: center; gap: 10px;
  .amount { font-size: 42px; font-weight: 800; }
  .currency { font-size: 18px; opacity: 0.7; }
`;

export const TopupSection = styled.div`
  background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 25px;
  .action-section { display: flex; align-items: center; justify-content: space-between; gap: 20px; flex-wrap: wrap; }
`;

export const AddBalanceBtn = styled.button`
  padding: 12px 24px; background: #3182ce; color: white; border: none; border-radius: 8px;
  font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px;
  &:hover { background: #2b6cb0; }
`;

export const QuickAddRow = styled.div`
  display: flex; gap: 8px; align-items: center;
  .quick-label { font-size: 12px; color: #718096; font-weight: 600; }
`;

export const QuickAddBtn = styled.button`
  padding: 6px 14px; border-radius: 6px; border: 1px solid #e2e8f0; background: #f7fafc;
  font-size: 12px; font-weight: 600; cursor: pointer; transition: 0.2s;
  &:hover { border-color: #3182ce; color: #3182ce; }
  &.premium { background: #ebf8ff; border-color: #bee3f8; color: #2b6cb0; }
`;

export const StatsGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 25px;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

export const StatCard = styled.div`
  background: white; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0;
  display: flex; align-items: center; gap: 12px;
  .stat-icon { font-size: 18px; color: #3182ce; background: #ebf8ff; padding: 10px; border-radius: 10px; }
  .stat-label { font-size: 12px; color: #718096; }
  .stat-value { font-size: 14px; font-weight: 700; display: block; }
`;

export const ExpenseSection = styled.div`
  background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;
`;

export const SectionTitle = styled.div`
  padding: 20px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;
  h2 { font-size: 16px; font-weight: 700; margin: 0; }
  .tab-group { display: flex; gap: 15px; }
  .tab { cursor: pointer; font-size: 14px; color: #718096; padding-bottom: 4px; border-bottom: 2px solid transparent; }
  .tab.active { color: #3182ce; border-bottom-color: #3182ce; font-weight: 700; }
`;

export const ExpertCard = styled.div`
  display: flex; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f7fafc;
  &:hover { background: #fcfcfd; }
`;

export const ExpertLeft = styled.div` display: flex; gap: 15px; `;
export const Avatar = styled.div` width: 40px; height: 40px; border-radius: 8px; background: #edf2f7; display: flex; align-items: center; justify-content: center; font-size: 18px; `;
export const ExpertInfo = styled.div`
  strong { font-size: 14px; color: #2d3748; display: block; }
  .expert-meta { font-size: 11px; color: #a0aec0; margin-top: 2px; }
  .status { font-size: 10px; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; margin-left: 8px; }
  .status.success { background: #c6f6d5; color: #22543d; }
`;

export const AmountBox = styled.div`
  text-align: right;
  .amount-value { font-size: 15px; font-weight: 700; }
  &.credit { color: #38a169; }
  &.debit { color: #2d3748; }
`;

export const LoadMoreBtn = styled.button`
  width: 100%; padding: 15px; border: none; background: transparent; color: #3182ce;
  font-weight: 600; cursor: pointer; transition: 0.2s;
  &:hover { background: #f7fafc; }
`;

export const FilterDropdown = styled.div` select { border: 1px solid #e2e8f0; padding: 5px; border-radius: 6px; font-size: 12px; } `;
export const TransactionBadge = styled.span` font-size: 10px; padding: 2px 6px; background: #edf2f7; border-radius: 4px; margin-left: 5px; `;
export const ProgressBar = styled.div` height: 3px; background: ${props => props.color}; width: ${props => props.width}%; margin-top: 5px; `;
export const EmptyState = styled.div` padding: 40px; text-align: center; color: #a0aec0; `;
export const LoadingState = styled.div` padding: 50px; text-align: center; `;
export const ErrorState = styled.div` padding: 40px; text-align: center; color: #e53e3e; `;