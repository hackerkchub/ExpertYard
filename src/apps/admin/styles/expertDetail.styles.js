// src/apps/admin/styles/expertDetail.styles.js
import styled, { keyframes, css } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const PageContainer = styled.div`
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%);

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

export const DetailHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  animation: ${fadeIn} 0.6s ease-out;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

export const BackButton = styled.button`
  background: #1e293b;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 14px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: #0ea5ff;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(14, 165, 255, 0.2);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const ExpertTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #0ea5ff, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  gap: 12px;
`;

export const ActionButton = styled.button`
  padding: 12px 24px;
  background: ${props => props.$danger ? '#ef4444' : '#0ea5ff'};
  color: white;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px ${props => props.$danger ? 'rgba(239, 68, 68, 0.2)' : 'rgba(14, 165, 255, 0.2)'};
    background: ${props => props.$danger ? '#dc2626' : '#0284c7'};
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 28px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(14, 165, 255, 0.1);
    border-color: #0ea5ff;
  }
`;

export const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: linear-gradient(135deg, #0ea5ff, #3b82f6);
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
  color: #64748b;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
`;

export const StatValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
`;

export const StatTrend = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${props => props.$positive ? '#10b981' : '#64748b'};
`;

export const InfoCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 28px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.6s ease-out;

  h3 {
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 20px 0;
    display: flex;
    align-items: center;
    gap: 10px;
    padding-bottom: 12px;
    border-bottom: 2px solid #e2e8f0;

    svg {
      color: #0ea5ff;
    }
  }
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  strong {
    font-size: 13px;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  span, p {
    font-size: 16px;
    color: #1e293b;
    font-weight: 500;
    margin: 0;
  }
`;

export const DetailSection = styled.div`
  margin-bottom: 32px;
  background: white;
  border-radius: 20px;
  padding: 28px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.6s ease-out;

  h3 {
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 20px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 2px solid #e2e8f0;

    .badge {
      background: #0ea5ff10;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 14px;
      color: #0ea5ff;
      font-weight: 600;
    }
  }
`;

export const Card = styled.div`
  background: #f8fafc;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(4px);
    border-color: #0ea5ff;
    box-shadow: 0 4px 12px rgba(14, 165, 255, 0.1);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
`;

export const CardTitle = styled.h4`
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`;

export const CardMeta = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 12px;
  font-size: 13px;
  color: #64748b;

  span {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const CardContent = styled.p`
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  margin: 12px 0;
`;

export const RatingStars = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 8px;

  svg {
    color: #fbbf24;
    width: 18px;
    height: 18px;
  }
`;

export const DeleteButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #dc2626;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const ViewButton = styled.button`
  background: #0ea5ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #0284c7;
    transform: translateY(-2px);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #0ea5ff;

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #e2e8f0;
    border-top-color: #0ea5ff;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
    margin-bottom: 20px;
  }

  p {
    color: #64748b;
    font-size: 16px;
    font-weight: 500;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #64748b;

  svg {
    width: 64px;
    height: 64px;
    margin-bottom: 20px;
    opacity: 0.5;
  }

  h4 {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 14px;
    margin: 0;
  }
`;

export const PriceTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #10b98110;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #10b981;
`;

export const PlanBadge = styled.span`
  background: ${props => {
    switch(props.$plan) {
      case 'standard': return '#0ea5ff';
      case 'premium': return '#8b5cf6';
      default: return '#64748b';
    }
  }};
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
`;