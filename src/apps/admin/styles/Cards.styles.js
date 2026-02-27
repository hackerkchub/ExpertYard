import styled from "styled-components";

export const Grid = styled.div`
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
  background: ${props => {
    if (props.$primary) return 'linear-gradient(135deg, #0ea5ff, #3b82f6)';
    if (props.$success) return 'linear-gradient(135deg, #10b981, #34d399)';
    if (props.$warning) return 'linear-gradient(135deg, #f59e0b, #fbbf24)';
    if (props.$danger) return 'linear-gradient(135deg, #ef4444, #dc2626)';
    return 'white';
  }};
  border-radius: 20px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  color: ${props => props.$primary || props.$success || props.$warning || props.$danger ? 'white' : '#1e293b'};
  box-shadow: 0 8px 30px ${props => {
    if (props.$primary) return 'rgba(14, 165, 255, 0.2)';
    if (props.$success) return 'rgba(16, 185, 129, 0.2)';
    if (props.$warning) return 'rgba(245, 158, 11, 0.2)';
    if (props.$danger) return 'rgba(239, 68, 68, 0.2)';
    return 'rgba(0, 0, 0, 0.05)';
  }};
  border: 1px solid ${props => props.$primary || props.$success || props.$warning || props.$danger ? 'rgba(255,255,255,0.1)' : '#e2e8f0'};
  transition: all 0.3s ease;

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
`;

export const StatIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 28px;
    height: 28px;
    color: white;
  }
`;

export const StatBody = styled.div`
  flex: 1;
`;

export const StatLabel = styled.div`
  font-size: 13px;
  font-weight: 500;
  opacity: 0.9;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;

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
  margin-top: 6px;
`;