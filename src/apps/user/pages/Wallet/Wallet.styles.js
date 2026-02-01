import styled, { keyframes } from "styled-components";

/* ================= ANIMATIONS ================= */
const fadeIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const gradientShift = keyframes`
  0% { 
    background-position: 0% 50%; 
  }
  50% { 
    background-position: 100% 50%; 
  }
  100% { 
    background-position: 0% 50%; 
  }
`;

const pulse = keyframes`
  0% { 
    transform: scale(1); 
    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); 
  }
  70% { 
    transform: scale(1.02); 
    box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); 
  }
  100% { 
    transform: scale(1); 
    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); 
  }
`;

/* ================= PREMIUM STYLES ================= */
const premiumGlass = `
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 20px 60px rgba(15, 23, 42, 0.12),
    0 4px 24px rgba(15, 23, 42, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
`;

const hoverScale = `
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 25px 50px rgba(15, 23, 42, 0.15),
      0 10px 30px rgba(37, 99, 235, 0.2);
  }
`;

/* ================= PAGE ================= */
export const PageWrap = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    #f8fafc 0%,
    #eef2ff 25%,
    #f1f5f9 50%,
    #e0e7ff 75%,
    #f8fafc 100%
  );
  background-size: 200% 200%;
  animation: ${gradientShift} 15s ease infinite;
  padding: clamp(40px, 5vw, 60px) clamp(16px, 3vw, 32px);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  animation: ${fadeIn} 0.6s ease-out;
`;

/* ================= CONTAINER ================= */
export const WalletBox = styled.div`
  width: 100%;
  max-width: 1200px;
  ${premiumGlass};
  border-radius: 32px;
  padding: clamp(32px, 3vw, 48px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(99, 102, 241, 0.4), 
      rgba(56, 189, 248, 0.4), 
      rgba(99, 102, 241, 0.4), 
      transparent
    );
  }
`;

/* ================= HEADER ================= */
export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: clamp(32px, 3vw, 48px);
  flex-wrap: wrap;
  gap: 20px;

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .logo-container {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-icon {
    font-size: 32px;
    color: #2563eb;
    filter: drop-shadow(0 4px 12px rgba(37, 99, 235, 0.3));
  }

  .logo-text {
    font-size: 20px;
    font-weight: 800;
    background: linear-gradient(135deg, #2563eb, #4f46e5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.5px;
  }

  .page-title {
    font-size: clamp(24px, 2.5vw, 32px);
    font-weight: 700;
    color: #0f172a;
    margin: 0;
    letter-spacing: -0.5px;
  }

  .header-right {
    display: flex;
    align-items: center;
  }

  .user-badge {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 20px;
    background: rgba(241, 245, 249, 0.8);
    border-radius: 16px;
    border: 1px solid rgba(226, 232, 240, 0.8);
  }

  .user-icon {
    font-size: 24px;
    color: #64748b;
  }

  .user-name {
    font-weight: 600;
    color: #334155;
    font-size: 14px;
  }
`;

/* ================= BALANCE ================= */
export const BalanceCard = styled.div`
  margin-top: 20px;
  padding: clamp(32px, 3vw, 40px);
  border-radius: 28px;
  background: linear-gradient(135deg, 
    #2563eb 0%, 
    #4f46e5 25%, 
    #7c3aed 50%, 
    #9333ea 75%, 
    #c026d3 100%
  );
  background-size: 200% 200%;
  animation: ${gradientShift} 8s ease infinite;
  color: #fff;
  position: relative;
  overflow: hidden;
  ${hoverScale};

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.1) 0%,
      transparent 70%
    );
  }

  .balance-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    position: relative;
    z-index: 2;
  }

  h3 {
    font-size: clamp(16px, 1.5vw, 18px);
    font-weight: 500;
    opacity: 0.95;
    margin: 0;
  }

  .balance-label {
    font-size: 12px;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.2);
    padding: 6px 12px;
    border-radius: 999px;
    backdrop-filter: blur(10px);
  }

  .balance-footer {
    display: flex;
    gap: clamp(24px, 3vw, 32px);
    margin-top: 32px;
    position: relative;
    z-index: 2;
  }

  .balance-stat {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    backdrop-filter: blur(10px);
    flex: 1;

    .stat-icon {
      font-size: 24px;
      opacity: 0.9;
    }

    .stat-label {
      display: block;
      font-size: 12px;
      opacity: 0.8;
      margin-bottom: 4px;
    }

    .stat-value {
      display: block;
      font-size: 16px;
      font-weight: 700;
    }
  }
`;

export const BalanceAmount = styled.div`
  display: flex;
  align-items: center;
  gap: clamp(12px, 1.5vw, 16px);
  position: relative;
  z-index: 2;

  .currency-icon {
    font-size: 48px;
    filter: drop-shadow(0 4px 12px rgba(255, 255, 255, 0.3));
  }

  .amount {
    font-size: clamp(48px, 5vw, 64px);
    font-weight: 800;
    letter-spacing: -1px;
    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .currency {
    font-size: 20px;
    opacity: 0.9;
    align-self: flex-end;
    margin-bottom: 12px;
  }
`;

/* ================= STATS GRID ================= */
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 32px 0;
`;

export const StatCard = styled.div`
  ${premiumGlass};
  padding: 24px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  ${hoverScale};

  &.stat-1 {
    border-left: 4px solid #2563eb;
  }
  
  &.stat-2 {
    border-left: 4px solid #10b981;
  }
  
  &.stat-3 {
    border-left: 4px solid #8b5cf6;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;

    &.stat-1 { background: #2563eb; }
    &.stat-2 { background: #10b981; }
    &.stat-3 { background: #8b5cf6; }
  }

  .stat-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .stat-label {
    font-size: 12px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
  }

  .stat-value {
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
  }
`;

/* ================= SECTIONS ================= */
export const ExpenseSection = styled.div`
  margin-top: 48px;
`;

export const SectionTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 20px;

  .section-header {
    h2 {
      font-size: clamp(20px, 2vw, 24px);
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 8px 0;
    }

    .section-subtitle {
      font-size: 14px;
      color: #64748b;
      margin: 0;
    }
  }

  .filter-section {
    display: flex;
    gap: 12px;
    align-items: center;
  }
`;

/* ================= FILTERS ================= */
export const FilterDropdown = styled.div`
  position: relative;
  min-width: 180px;

  select {
    width: 100%;
    padding: 12px 40px 12px 16px;
    border-radius: 12px;
    border: 2px solid #e2e8f0;
    background: white;
    color: #0f172a;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    appearance: none;
    outline: none;
    transition: all 0.3s ease;

    &:hover {
      border-color: #cbd5e1;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
    }

    &:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
    }
  }

  .filter-icon {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #64748b;
    pointer-events: none;
  }
`;

export const DateRangePicker = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  background: #f8fafc;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;

  .date-input {
    flex: 1;
    padding: 12px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 14px;
    color: #0f172a;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover, &:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
  }

  .date-separator {
    color: #64748b;
    font-weight: 500;
    font-size: 14px;
  }
`;

/* ================= CARDS ================= */
export const ExpertCard = styled.div`
  ${premiumGlass};
  padding: 20px;
  border-radius: 20px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(226, 232, 240, 0.6);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 20px 40px rgba(15, 23, 42, 0.12),
      0 8px 24px rgba(37, 99, 235, 0.1);
    border-color: rgba(37, 99, 235, 0.3);
  }

  &.topup-card {
    background: rgba(241, 245, 249, 0.8);
  }
`;

export const ExpertLeft = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

export const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e0e7ff, #dbeafe);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #2563eb;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const ExpertInfo = styled.div`
  .expert-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 6px;
  }

  strong {
    font-size: 16px;
    color: #0f172a;
    font-weight: 700;
  }

  .expert-role {
    display: block;
    color: #64748b;
    font-size: 13px;
    margin-bottom: 8px;
  }

  .expert-meta {
    display: flex;
    gap: 16px;
    align-items: center;

    .date {
      font-size: 12px;
      color: #94a3b8;
    }

    .status {
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 999px;
      text-transform: uppercase;

      &.completed {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
      }

      &.pending {
        background: rgba(245, 158, 11, 0.1);
        color: #f59e0b;
      }
    }
  }
`;

export const ExpertRight = styled.div``;

export const AmountBox = styled.div`
  text-align: right;

  .amount-label {
    display: block;
    font-size: 12px;
    color: #64748b;
    margin-bottom: 4px;
  }

  .amount-value {
    display: block;
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 8px;
  }

  .amount-progress {
    width: 120px;
    height: 4px;
    background: #e2e8f0;
    border-radius: 2px;
    overflow: hidden;
  }

  &.status-success {
    color: #10b981;
    font-weight: 600;
  }
`;

export const TransactionBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  color: white;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const ProgressBar = styled.div`
  height: 100%;
  width: ${props => props.width}%;
  background: ${props => props.color || '#2563eb'};
  border-radius: 2px;
  transition: width 0.6s ease;
`;

/* ================= TOPUP ================= */
export const TopupSection = styled.div`
  margin-top: 48px;

  .topup-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg, #22c55e, #16a34a);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 20px;
  }

  .action-section {
    margin-top: 32px;
  }
`;

export const AddBalanceBtn = styled.button`
  width: 100%;
  padding: 18px 24px;
  margin-top: 20px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  background-size: 200% 200%;
  animation: ${gradientShift} 6s ease infinite;
  border: none;
  border-radius: 16px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 16px 32px rgba(34, 197, 94, 0.3);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 24px 48px rgba(34, 197, 94, 0.4);
    animation: ${pulse} 1s ease infinite;
  }

  .btn-icon {
    font-size: 20px;
  }
`;

export const QuickAddRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;

  .quick-label {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
    margin-right: 8px;
  }
`;

export const QuickAddBtn = styled.button`
  padding: 12px 24px;
  background: ${props => props.className === 'premium' 
    ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' 
    : '#f1f5f9'};
  color: ${props => props.className === 'premium' ? 'white' : '#0f172a'};
  border-radius: 12px;
  border: ${props => props.className === 'premium' 
    ? 'none' 
    : '1px solid #e2e8f0'};
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.2), 
      transparent
    );
    transition: left 0.6s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(37, 99, 235, 0.15);

    &::before {
      left: 100%;
    }

    &.premium {
      box-shadow: 0 12px 24px rgba(139, 92, 246, 0.3);
    }
  }
`;

/* ================= CHART ================= */
export const ChartContainer = styled.div`
  ${premiumGlass};
  border-radius: 20px;
  padding: 24px;
  margin: 32px 0;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;

  .chart-placeholder {
    text-align: center;
    color: #64748b;
    
    .chart-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }
    
    p {
      margin: 8px 0;
      font-size: 14px;
    }
  }
`;

/* ================= EMPTY STATES ================= */
export const EmptyState = styled.div`
  padding: clamp(40px, 5vw, 60px) clamp(20px, 3vw, 40px);
  text-align: center;
  border-radius: 20px;
  background: rgba(241, 245, 249, 0.7);
  border: 2px dashed rgba(37, 99, 235, 0.3);
  margin: 24px 0;
  animation: ${fadeIn} 0.6s ease;

  &.small {
    padding: 32px 24px;
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  h3 {
    font-size: 18px;
    color: #0f172a;
    margin: 0 0 8px 0;
  }

  p {
    color: #64748b;
    font-size: 14px;
    margin: 0;
    max-width: 400px;
    margin: 0 auto;
  }
`;