// src/pages/admin/styles/financeDashboard.styles.js
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

const shimmer = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

/* Main Container */
export const DashboardContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%);
  position: relative;
  overflow-x: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 400px;
    background: radial-gradient(circle at 0% 0%, rgba(14, 165, 255, 0.05) 0%, transparent 100%);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }
`;

/* Header */
export const HeaderContainer = styled.div`
  margin-bottom: 32px;
  animation: ${fadeIn} 0.6s ease-out;
`;

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const HeaderIcon = styled.div`
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #0ea5ff, #3b82f6);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px -5px rgba(14, 165, 255, 0.3);
  animation: ${float} 3s ease-in-out infinite;

  svg {
    width: 28px;
    height: 28px;
    color: white;
  }

  @media (max-width: 480px) {
    width: 48px;
    height: 48px;
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

export const HeaderTitle = styled.div`
  h1 {
    font-size: 28px;
    font-weight: 800;
    color: #0f172a;
    margin: 0 0 6px 0;
    background: linear-gradient(135deg, #0f172a, #1e293b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    @media (max-width: 768px) {
      font-size: 24px;
    }

    @media (max-width: 480px) {
      font-size: 20px;
    }
  }

  p {
    color: #64748b;
    font-size: 14px;
    margin: 0;

    @media (max-width: 480px) {
      font-size: 13px;
    }
  }
`;

export const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #0ea5ff, #3b82f6);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(14, 165, 255, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(14, 165, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: rotate(180deg);
  }
`;

/* Tabs */
export const TabsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0;
`;

export const Tab = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  background: ${props => props.$active ? 'linear-gradient(135deg, #0ea5ff, #3b82f6)' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#64748b'};
  border: none;
  border-radius: 12px 12px 0 0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    color: ${props => props.$active ? 'white' : '#0ea5ff'};
    background: ${props => props.$active ? 'linear-gradient(135deg, #0ea5ff, #3b82f6)' : 'rgba(14, 165, 255, 0.1)'};
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 640px) {
    padding: 8px 16px;
    font-size: 13px;
    
    span {
      display: none;
    }
  }
`;

/* Stats Grid */
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const SummaryCard = styled.div`
  position: relative;
  background: white;
  border-radius: 24px;
  padding: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.6);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }
`;

export const CardGradientBg = styled.div`
  position: absolute;
  top: -50%;
  right: -50%;
  width: 150%;
  height: 150%;
  background: ${props => `linear-gradient(135deg, ${props.$color1}, ${props.$color2})`};
  opacity: 0.08;
  border-radius: 50%;
  transition: all 0.5s ease;

  ${SummaryCard}:hover & {
    transform: scale(1.2);
    opacity: 0.12;
  }
`;

export const CardContent = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 1;
`;

export const CardInfo = styled.div`
  flex: 1;
`;

export const CardLabel = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: #64748b;
  margin: 0 0 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const CardValue = styled.p`
  font-size: 32px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 12px 0;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

export const CardTrend = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: ${props => props.$positive ? '#d1fae5' : '#fee2e2'};
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.$positive ? '#065f46' : '#991b1b'};

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const CardIcon = styled.div`
  width: 52px;
  height: 52px;
  background: ${props => `linear-gradient(135deg, ${props.$color1}, ${props.$color2})`};
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);

  svg {
    width: 26px;
    height: 26px;
    color: white;
  }
`;

/* Chart Container */
export const ChartCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
`;

export const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;

  h3 {
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;

    svg {
      color: #0ea5ff;
    }
  }
`;

export const ChartSelect = styled.select`
  padding: 8px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 13px;
  color: #1e293b;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #0ea5ff;
  }

  &:focus {
    outline: none;
    border-color: #0ea5ff;
    box-shadow: 0 0 0 3px rgba(14, 165, 255, 0.1);
  }
`;

export const ChartWrapper = styled.div`
  height: 350px;
  width: 100%;

  @media (max-width: 768px) {
    height: 280px;
  }
`;

/* Two Column Grid */
export const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const InfoCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
`;

export const InfoCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;

  svg {
    color: #0ea5ff;
  }

  h4 {
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
  }
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  background: ${props => props.$gradient ? 'linear-gradient(135deg, #f8fafc, #ffffff)' : 'transparent'};
  border-radius: 14px;
  margin-bottom: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: #f8fafc;
    transform: translateX(4px);
  }
`;

export const InfoLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
`;

export const InfoValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.$positive ? '#10b981' : props.$negative ? '#ef4444' : '#0f172a'};
`;

/* GST Grid */
export const GstGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 480px) {
    gap: 12px;
  }
`;

export const GstItem = styled.div`
  text-align: center;
  padding: 16px;
  background: linear-gradient(135deg, #f8fafc, #ffffff);
  border-radius: 16px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  svg {
    margin-bottom: 8px;
  }

  p:first-of-type {
    font-size: 12px;
    color: #64748b;
    margin: 8px 0 4px 0;
  }

  p:last-of-type {
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;

    @media (max-width: 480px) {
      font-size: 16px;
    }
  }
`;

/* Table Styles */
export const TableCard = styled.div`
  background: white;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  margin-bottom: 32px;
`;

export const TableHeader = styled.div`
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8fafc, #ffffff);
  border-bottom: 1px solid #e2e8f0;

  h3 {
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 4px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  p {
    font-size: 13px;
    color: #64748b;
    margin: 0;
  }
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background: #f8fafc;

  th {
    text-align: left;
    padding: 16px 20px;
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    @media (max-width: 640px) {
      padding: 12px;
      font-size: 11px;
    }
  }
`;

export const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid #e2e8f0;
    transition: all 0.3s ease;

    &:hover {
      background: #f8fafc;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  td {
    padding: 16px 20px;
    font-size: 14px;
    color: #1e293b;

    @media (max-width: 640px) {
      padding: 12px;
      font-size: 13px;
    }
  }
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => 
    props.$status === 'paid' || props.$status === 'success' ? '#d1fae5' :
    props.$status === 'pending' ? '#fef3c7' :
    props.$status === 'failed' ? '#fee2e2' :
    '#f1f5f9'};
  color: ${props => 
    props.$status === 'paid' || props.$status === 'success' ? '#065f46' :
    props.$status === 'pending' ? '#92400e' :
    props.$status === 'failed' ? '#991b1b' :
    '#475569'};

  svg {
    width: 12px;
    height: 12px;
  }
`;

/* Loading Spinner */
export const LoadingContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Spinner = styled.div`
  text-align: center;

  .spinner-ring {
    position: relative;
    width: 60px;
    height: 60px;
    margin: 0 auto;
  }

  .ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-top-color: #0ea5ff;
    border-radius: 50%;
    animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }

  .ring:nth-child(1) { animation-delay: -0.45s; }
  .ring:nth-child(2) { animation-delay: -0.3s; }
  .ring:nth-child(3) { animation-delay: -0.15s; }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  p {
    margin-top: 20px;
    color: #64748b;
    font-weight: 500;
  }
`;

/* Gradient Card for Wallet Section */
export const GradientCard = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  padding: 28px;
  color: white;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    animation: ${shimmer} 8s ease-in-out infinite;
  }
`;

export const GradientCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;

  h3 {
    font-size: 20px;
    font-weight: 700;
    margin: 0;
  }

  svg {
    opacity: 0.8;
  }
`;

export const GradientCardValue = styled.div`
  position: relative;
  z-index: 1;

  p {
    font-size: 14px;
    opacity: 0.9;
    margin: 0 0 8px 0;
  }

  .amount {
    font-size: 42px;
    font-weight: 800;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 36px;
    }
  }

  .subtitle {
    font-size: 12px;
    opacity: 0.7;
    margin-top: 8px;
  }
`;

/* Action Buttons */
export const RangeButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const RangeButton = styled.button`
  padding: 8px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: ${props => props.$active ? 'linear-gradient(135deg, #0ea5ff, #3b82f6)' : 'white'};
  color: ${props => props.$active ? 'white' : '#64748b'};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: ${props => props.$active ? 'scale(1.05)' : 'translateY(-1px)'};
    border-color: #0ea5ff;
    color: ${props => props.$active ? 'white' : '#0ea5ff'};
  }
`;

/* Responsive Utilities */
export const HideOnMobile = styled.div`
  @media (max-width: 640px) {
    display: none;
  }
`;

export const ShowOnMobile = styled.div`
  display: none;
  
  @media (max-width: 640px) {
    display: block;
  }
`;