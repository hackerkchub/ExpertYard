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

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(14, 165, 255, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(14, 165, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(14, 165, 255, 0); }
`;

/* Main Container */
export const DashboardContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%);

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

export const DashboardHeader = styled.div`
  margin-bottom: 28px;
  animation: ${fadeIn} 0.6s ease-out;

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 8px 0;
    display: flex;
    align-items: center;
    gap: 12px;

    @media (max-width: 768px) {
      font-size: 24px;
    }

    @media (max-width: 480px) {
      font-size: 22px;
    }

    svg {
      color: #0ea5ff;
      background: rgba(14, 165, 255, 0.1);
      padding: 8px;
      border-radius: 12px;
      width: 44px;
      height: 44px;

      @media (max-width: 480px) {
        width: 36px;
        height: 36px;
        padding: 6px;
      }
    }
  }

  p {
    color: #64748b;
    font-size: 15px;
    margin: 0;

    @media (max-width: 480px) {
      font-size: 14px;
    }
  }
`;

/* Filter Bar */
export const FilterBar = styled.div`
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 28px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  animation: ${slideIn} 0.6s ease-out;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    padding: 16px;
    gap: 12px;
  }

  input, select {
    padding: 12px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 14px;
    color: #1e293b;
    background: white;
    transition: all 0.3s ease;
    width: 100%;

    &:focus {
      outline: none;
      border-color: #0ea5ff;
      box-shadow: 0 0 0 4px rgba(14, 165, 255, 0.1);
    }

    &::placeholder {
      color: #94a3b8;
    }
  }

  select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;
    padding-right: 44px;
  }
`;

/* Stats Section */
export const StatsSection = styled.div`
  margin-bottom: 32px;
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: #0ea5ff;
  }

  @media (max-width: 480px) {
    font-size: 16px;
    margin-left: 8px;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const StatCard = styled.div`
  background: ${props => props.$primary ? 
    'linear-gradient(135deg, #0ea5ff, #3b82f6)' : 
    props.$success ? 
    'linear-gradient(135deg, #10b981, #34d399)' :
    props.$warning ?
    'linear-gradient(135deg, #f59e0b, #fbbf24)' :
    props.$danger ?
    'linear-gradient(135deg, #ef4444, #dc2626)' :
    'white'};
  border-radius: 20px;
  padding: 24px;
  color: ${props => props.$primary || props.$success || props.$warning || props.$danger ? 'white' : '#1e293b'};
  box-shadow: 0 8px 30px ${props => {
    if (props.$primary) return 'rgba(14, 165, 255, 0.2)';
    if (props.$success) return 'rgba(16, 185, 129, 0.2)';
    if (props.$warning) return 'rgba(245, 158, 11, 0.2)';
    if (props.$danger) return 'rgba(239, 68, 68, 0.2)';
    return 'rgba(0, 0, 0, 0.05)';
  }};
  border: 1px solid ${props => {
    if (props.$primary) return 'rgba(255, 255, 255, 0.1)';
    if (props.$success) return 'rgba(255, 255, 255, 0.1)';
    if (props.$warning) return 'rgba(255, 255, 255, 0.1)';
    if (props.$danger) return 'rgba(255, 255, 255, 0.1)';
    return '#e2e8f0';
  }};
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px ${props => {
      if (props.$primary) return 'rgba(14, 165, 255, 0.3)';
      if (props.$success) return 'rgba(16, 185, 129, 0.3)';
      if (props.$warning) return 'rgba(245, 158, 11, 0.3)';
      if (props.$danger) return 'rgba(239, 68, 68, 0.3)';
      return 'rgba(0, 0, 0, 0.1)';
    }};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }
`;

export const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;

  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
`;

export const StatLabel = styled.div`
  font-size: 13px;
  font-weight: 500;
  opacity: 0.9;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const StatTrend = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.$positive ? '#10b981' : '#ef4444'};
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 8px;
  border-radius: 20px;
  width: fit-content;

  svg {
    width: 14px;
    height: 14px;
  }
`;

/* Content Grid */
export const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

/* Section Box */
export const SectionBox = styled.div`
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: 20px;
  }

  @media (max-width: 480px) {
    padding: 16px;
  }

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media (max-width: 480px) {
      font-size: 16px;
    }

    span {
      font-size: 13px;
      color: #64748b;
      font-weight: 500;
      background: #f1f5f9;
      padding: 4px 10px;
      border-radius: 20px;
    }
  }
`;

/* Table Styles */
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

export const TableHead = styled.thead`
  background: #f8fafc;
  border-radius: 12px;

  th {
    text-align: left;
    padding: 14px 16px;
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    @media (max-width: 480px) {
      padding: 10px 8px;
      font-size: 12px;
    }
  }
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f8fafc;
  }
`;

export const TableCell = styled.td`
  padding: 14px 16px;
  font-size: 14px;
  color: #1e293b;

  @media (max-width: 480px) {
    padding: 10px 8px;
    font-size: 13px;
  }
`;

export const StatusBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => 
    props.$status === 'ENABLED' || props.$status === 'approved' ? '#d1fae5' :
    props.$status === 'PENDING' ? '#fef3c7' :
    props.$status === 'DISABLED' || props.$status === 'rejected' ? '#fee2e2' :
    '#f1f5f9'};
  color: ${props => 
    props.$status === 'ENABLED' || props.$status === 'approved' ? '#065f46' :
    props.$status === 'PENDING' ? '#92400e' :
    props.$status === 'DISABLED' || props.$status === 'rejected' ? '#991b1b' :
    '#475569'};
`;

export const ActionButton = styled.button`
  padding: 6px 14px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  background: ${props => 
    props.$primary ? '#0ea5ff' :
    props.$danger ? '#ef4444' :
    '#f1f5f9'};
  color: ${props => 
    props.$primary || props.$danger ? 'white' : '#64748b'};
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 10px ${props => 
      props.$primary ? 'rgba(14, 165, 255, 0.3)' :
      props.$danger ? 'rgba(239, 68, 68, 0.3)' :
      'rgba(0, 0, 0, 0.1)'};
  }

  & + & {
    margin-left: 8px;
  }
`;

/* Recent List */
export const RecentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const RecentItem = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 480px) {
    padding: 10px 0;
  }
`;

// In your dashboard styles file
export const RecentAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.src 
    ? `url(${props.src}) center/cover` 
    : 'linear-gradient(135deg, #0ea5ff, #3b82f6)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;
`;

export const RecentInfo = styled.div`
  flex: 1;
`;

export const RecentName = styled.div`
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
`;

export const RecentMeta = styled.div`
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const RecentAmount = styled.div`
  font-weight: 700;
  color: #10b981;
  font-size: 16px;
`;

/* Quick Actions */
export const QuickActions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 20px;
`;

export const QuickActionButton = styled.button`
  padding: 12px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  color: #1e293b;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    border-color: #0ea5ff;
    color: #0ea5ff;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(14, 165, 255, 0.1);
  }

  svg {
    color: #0ea5ff;
  }
`;

/* Row Layout */
export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

/* Chart Container */
export const ChartContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 32px;
`;

export const ChartPlaceholder = styled.div`
  height: 200px;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-style: italic;
  margin-top: 20px;

  svg {
    width: 32px;
    height: 32px;
    margin-bottom: 12px;
    opacity: 0.5;
  }
`;