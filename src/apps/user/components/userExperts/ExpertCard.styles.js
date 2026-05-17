// src/apps/user/components/userExperts/ExpertCard.styles.js - PREMIUM STYLES
import styled, { keyframes, css } from "styled-components";
import { motion } from "framer-motion";

const glow = keyframes`
  0% { opacity: 0.3; }
  50% { opacity: 0.6; }
  100% { opacity: 0.3; }
`;

const shine = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const pulseRing = keyframes`
  0% { transform: scale(0.8); opacity: 0.5; }
  100% { transform: scale(1.2); opacity: 0; }
`;

// Card Container
export const Card = styled(motion.div)`
  position: relative;
  width: ${({ $callChat }) => ($callChat ? "100%" : "auto")};
  height: 100%;
  min-height: ${({ $callChat }) => ($callChat ? "356px" : "360px")};
  max-height: ${({ $callChat }) => ($callChat ? "380px" : "none")};
  border-radius: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
  border: 1px solid rgba(0, 0, 128, 0.08);
  box-shadow: 0 14px 30px rgba(16, 24, 40, 0.08);
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
  overflow: hidden;
  ${({ $callChat }) => $callChat && css`
    display: flex;
  `}

  &:hover {
    border-color: rgba(0, 0, 128, 0.18);
    box-shadow: 0 18px 40px rgba(16, 24, 40, 0.13);
  }

  @media (max-width: 640px) {
    min-height: ${({ $callChat }) => ($callChat ? "342px" : "360px")};
    max-height: ${({ $callChat }) => ($callChat ? "none" : "none")};
    border-radius: ${({ $callChat }) => ($callChat ? "18px" : "20px")};
  }
`;

export const CardInner = styled.div`
  position: relative;
  z-index: 2;
  height: 100%;
  min-height: inherit;
  display: flex;
  flex-direction: column;
  padding: ${({ $callChat }) => ($callChat ? "11px" : "13px")};
  width: ${({ $callChat }) => ($callChat ? "100%" : "auto")};
  
  @media (max-width: 480px) {
    padding: ${({ $callChat }) => ($callChat ? "10px" : "13px")};
  }
`;

export const ShineEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transform: translateX(-100%);
  animation: ${({ isHovered }) => isHovered ? css`${shine} 0.6s ease` : 'none'};
  pointer-events: none;
  z-index: 1;
`;

export const GradientBorder = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 1.5px;
  background: ${({ isHovered }) => isHovered 
    ? 'linear-gradient(135deg, #000080, #ffd23f)' 
    : 'linear-gradient(135deg, #e2e8f0, #f1f5f9)'};
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
  transition: all 0.3s ease;
`;

// Header Section
export const CardHeader = styled.div`
  display: flex;
  gap: ${({ $callChat }) => ($callChat ? "10px" : "12px")};
  min-height: ${({ $callChat }) => ($callChat ? "80px" : "74px")};
  margin-bottom: ${({ $callChat }) => ($callChat ? "7px" : "10px")};
  
  @media (max-width: 640px) {
    gap: ${({ $callChat }) => ($callChat ? "9px" : "12px")};
    min-height: ${({ $callChat }) => ($callChat ? "76px" : "74px")};
  }
`;

export const AvatarSection = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const AvatarWrap = styled.div`
  position: relative;
  width: 54px;
  height: 54px;
  border-radius: 18px;
  padding: 2px;
  background: ${({ $isAI, isHovered }) => $isAI
    ? "conic-gradient(from 160deg, #38bdf8, #a855f7, #f97316, #38bdf8)"
    : isHovered
    ? "linear-gradient(135deg, #000080, #ffd23f)"
    : "linear-gradient(135deg, #eef2ff, #c7d2fe)"};
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 18px;
    background: ${({ isHovered }) => isHovered ? 'radial-gradient(circle at 30% 30%, rgba(0,0,128,0.3), rgba(255,210,63,0.3))' : 'none'};
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 0.5;
  }
  
  @media (max-width: 640px) {
    width: ${({ $callChat }) => ($callChat ? "46px" : "52px")};
    height: ${({ $callChat }) => ($callChat ? "46px" : "52px")};
    border-radius: ${({ $callChat }) => ($callChat ? "15px" : "18px")};
  }
`;

export const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 16px;
  object-fit: cover;
  background: #f1f5f9;
  border: 2px solid white;
`;

export const StatusDot = styled.span`
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  background: ${({ $online }) =>
    $online === true ? "#22c55e" : $online === false ? "#ef4444" : "#94a3b8"};
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    background: ${({ $online }) => $online === true ? '#22c55e' : 'transparent'};
    opacity: 0;
    animation: ${({ $online }) => $online === true ? css`${pulseRing} 1.5s infinite` : 'none'};
  }
`;

export const QuickActions = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${AvatarSection}:hover & {
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    opacity: 1;
  }
`;

export const ActionIcon = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ isActive }) => isActive ? '#ef4444' : '#64748b'};
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
    color: ${({ isActive }) => isActive ? '#ef4444' : '#3b82f6'};
  }
`;

// Expert Info
export const ExpertInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const NameRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 4px;
  min-height: ${({ $callChat }) => ($callChat ? "36px" : "0")};

  @media (max-width: 640px) {
    min-height: ${({ $callChat }) => ($callChat ? "22px" : "0")};
    gap: ${({ $callChat }) => ($callChat ? "6px" : "8px")};
  }
`;

export const Name = styled.h3`
  min-width: 0;
  font-size: 16px;
  font-weight: 900;
  color: #111827;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${({ $callChat }) => $callChat && css`
    flex: 1 1 120px;
    line-height: 1.22;
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  `}
  
  @media (max-width: 640px) {
    font-size: ${({ $callChat }) => ($callChat ? "14px" : "16px")};
    ${({ $callChat }) => $callChat && css`
      -webkit-line-clamp: 2;
    `}
  }
`;

export const VerifiedBadge = styled.span`
  display: inline-flex;
  color: #000080;
  background: #eef2ff;
  border-radius: 20px;
  padding: 2px 6px;
  font-size: 10px;
  align-items: center;
  gap: 4px;
`;

export const PremiumBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #92400e;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
`;

export const Role = styled.div`
  font-size: 13px;
  color: #475467;
  margin-bottom: 6px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${({ $callChat }) => $callChat && css`
    min-height: 34px;
    line-height: 17px;
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  `}
  
  @media (max-width: 640px) {
    font-size: 12px;
    ${({ $callChat }) => $callChat && css`
      min-height: 30px;
      line-height: 15px;
    `}
  }
`;

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  min-height: ${({ $callChat }) => ($callChat ? "32px" : "30px")};
  max-height: 34px;
  overflow: hidden;
  margin-bottom: 6px;
  
  @media (max-width: 640px) {
    gap: ${({ $callChat }) => ($callChat ? "6px" : "8px")};
    min-height: ${({ $callChat }) => ($callChat ? "22px" : "30px")};
    max-height: ${({ $callChat }) => ($callChat ? "24px" : "34px")};
  }
`;

export const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #667085;
  font-weight: 700;

  ${({ $callChat }) => $callChat && css`
    min-width: 0;
    max-width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `}
  
  svg {
    flex-shrink: 0;
  }
`;

export const RatingStar = styled.span`
  color: #f59e0b;
  font-weight: 600;
`;

export const CategoryTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 20px;
  max-height: 22px;
  overflow: hidden;
  margin-top: 6px;

  @media (max-width: 640px) {
    display: ${({ $callChat }) => ($callChat ? "none" : "flex")};
  }

  &:empty {
    display: none;
  }
`;

export const CategoryChip = styled.span`
  font-size: 11px;
  padding: 3px 8px;
  background: #eef2ff;
  border-radius: 12px;
  color: #000080;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

// Stats Grid
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  min-height: ${({ $callChat }) => ($callChat ? "54px" : "50px")};
  margin: ${({ $callChat }) => ($callChat ? "6px 0" : "9px 0")};
  padding: ${({ $callChat }) => ($callChat ? "6px 0" : "8px 0")};
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;

  &:empty {
    display: none;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ $callChat }) => ($callChat ? "6px" : "8px")};
    min-height: ${({ $callChat }) => ($callChat ? "44px" : "50px")};
  }
`;

export const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ $callChat }) => ($callChat ? "6px" : "8px")};
  padding: ${({ $callChat }) => ($callChat ? "6px" : "7px")};
  background: #f8fafc;
  border: 1px solid #eef2f7;
  border-radius: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f1f5f9;
    transform: translateY(-2px);
  }
  
  svg {
    color: #000080;
    flex-shrink: 0;
  }
  
  div {
    display: flex;
    flex-direction: column;
    ${({ $callChat }) => $callChat && css`
      min-width: 0;
    `}
    
    strong {
      font-size: ${({ $callChat }) => ($callChat ? "13px" : "14px")};
      font-weight: 700;
      color: #0f172a;
    }
    
    span {
      font-size: 10px;
      color: #64748b;
      ${({ $callChat }) => $callChat && css`
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `}
    }
  }
`;

// Pricing Section
export const PricingSection = styled.div`
  min-height: ${({ $callChat }) => ($callChat ? "46px" : "48px")};
  margin: ${({ $callChat }) => ($callChat ? "6px 0" : "9px 0")};

  @media (max-width: 640px) {
    min-height: ${({ $callChat }) => ($callChat ? "38px" : "48px")};
  }
`;

export const PricingBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-height: 22px;
  max-height: 24px;
  overflow: hidden;
  margin: 8px 0;

  @media (max-width: 640px) {
    margin: ${({ $callChat }) => ($callChat ? "5px 0" : "8px 0")};
    min-height: ${({ $callChat }) => ($callChat ? "18px" : "22px")};
    max-height: ${({ $callChat }) => ($callChat ? "20px" : "24px")};
  }

  &:empty {
    display: none;
  }
`;

export const PricingBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 9px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  
  ${props => props.type === 'per_minute' && css`
    background: #eef2ff;
    color: #000080;
  `}
  
  ${props => props.type === 'session' && css`
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    color: #92400e;
  `}
  
  ${props => props.type === 'plans' && css`
    background: linear-gradient(135deg, #ede9fe, #ddd6fe);
    color: #5b21b6;
  `}
`;

export const PriceRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  ${props => props.$fullWidth && css`
    width: 100%;
  `}
  
  > div {
    min-width: 0;
    flex: ${props => props.$fullWidth ? 1 : 'auto'};
    
    &:first-child {
      flex: 1;
    }
  }
  
  @media (max-width: 480px) {
    flex-direction: ${({ $callChat }) => ($callChat ? "row" : "column")};
    gap: ${({ $callChat }) => ($callChat ? "8px" : "12px")};
  }
`;

export const PriceLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #667085;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;

  ${({ $callChat }) => $callChat && css`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `}
`;

export const PriceTag = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex-wrap: wrap;
  min-width: 0;
  
  ${props => props.$premium && css`
    background: linear-gradient(135deg, #8b5cf6, #6d28d9);
    padding: 6px 12px;
    border-radius: 12px;
    color: white;
    display: inline-flex;
  `}
`;

export const PriceValue = styled.span`
  font-size: 17px;
  font-weight: 950;
  color: #0f172a;
  
  @media (max-width: 640px) {
    font-size: ${({ $callChat }) => ($callChat ? "15px" : "18px")};
  }
`;

export const PricingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
  padding: 7px 10px;
  background: linear-gradient(135deg, #fff7d6, #ffffff);
  border: 1px solid rgba(255, 193, 7, 0.24);
  border-radius: 14px;
  font-size: 12px;
  color: #000080;
  
  svg {
    flex-shrink: 0;
  }
  
  span {
    flex: 1;
    font-weight: 500;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

// Action Buttons
export const ActionRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: auto;
  padding-top: ${({ $callChat }) => ($callChat ? "7px" : "9px")};
  ${({ $callChat }) => $callChat && css`
    align-items: stretch;
  `}
  
  @media (max-width: 640px) {
    flex-direction: ${({ $callChat }) => ($callChat ? "row" : "column")};
    gap: ${({ $callChat }) => ($callChat ? "8px" : "10px")};
  }

  @media (max-width: 380px) {
    flex-direction: column;
  }
`;

export const PrimaryBtn = styled(motion.button)`
  flex: 1;
  border: none;
  border-radius: 40px;
  min-height: 38px;
  padding: 9px 12px;
  font-size: 13px;
  font-weight: 950;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #ffd23f, #ffc107);
  color: #000080;
  box-shadow: 0 12px 22px rgba(255, 193, 7, 0.22);
  transition: transform 180ms ease, box-shadow 180ms ease;

  ${({ $callChat }) => $callChat && css`
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    svg {
      flex-shrink: 0;
    }
  `}
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 16px 28px rgba(255, 193, 7, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (max-width: 640px) {
    min-height: ${({ $callChat }) => ($callChat ? "38px" : "38px")};
    padding: ${({ $callChat }) => ($callChat ? "8px 10px" : "10px 16px")};
    font-size: ${({ $callChat }) => ($callChat ? "11px" : "12px")};
  }
`;

export const GhostBtn = styled(motion.button)`
  min-width: 86px;
  border: 1.5px solid rgba(0, 0, 128, 0.18);
  border-radius: 40px;
  background: #ffffff;
  color: #000080;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  padding: 9px 16px;
  transition: all 0.3s ease;
  ${({ $callChat }) => $callChat && css`
    white-space: nowrap;
  `}
  
  &:hover {
    background: #eef2ff;
    border-color: #000080;
    color: #000080;
    transform: translateY(-2px);
  }
  
  @media (max-width: 640px) {
    min-height: ${({ $callChat }) => ($callChat ? "38px" : "auto")};
    padding: ${({ $callChat }) => ($callChat ? "8px 12px" : "8px 16px")};
    font-size: ${({ $callChat }) => ($callChat ? "11px" : "12px")};
  }

  @media (max-width: 380px) {
    width: ${({ $callChat }) => ($callChat ? "100%" : "auto")};
  }
`;

// Responsive utilities
export const ResponsiveGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 20px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 16px;
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const HoverGlow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 20px;
  background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), 
    rgba(0, 0, 128, 0.12) 0%, 
    transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1;
  
  ${Card}:hover & {
    opacity: 1;
  }
`;
