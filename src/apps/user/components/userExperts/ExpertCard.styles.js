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
  border-radius: 28px;
  background: linear-gradient(135deg, #ffffff 0%, #fafbff 100%);
  box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
`;

export const CardInner = styled.div`
  position: relative;
  z-index: 2;
  padding: 20px;
  
  @media (max-width: 480px) {
    padding: 16px;
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
  border-radius: 28px;
  padding: 1.5px;
  background: ${({ isHovered }) => isHovered 
    ? 'linear-gradient(135deg, #667eea, #764ba2, #f093fb, #4facfe)' 
    : 'linear-gradient(135deg, #e2e8f0, #f1f5f9)'};
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
  transition: all 0.3s ease;
`;

// Header Section
export const CardHeader = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  
  @media (max-width: 640px) {
    gap: 12px;
  }
`;

export const AvatarSection = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const AvatarWrap = styled.div`
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  padding: 2px;
  background: ${({ $isAI, isHovered }) => $isAI
    ? "conic-gradient(from 160deg, #38bdf8, #a855f7, #f97316, #38bdf8)"
    : isHovered
    ? "linear-gradient(135deg, #667eea, #764ba2)"
    : "linear-gradient(135deg, #cbd5e1, #94a3b8)"};
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: ${({ isHovered }) => isHovered ? 'radial-gradient(circle at 30% 30%, #667eea, #764ba2)' : 'none'};
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 0.5;
  }
  
  @media (max-width: 640px) {
    width: 60px;
    height: 60px;
  }
`;

export const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  background: #f1f5f9;
  border: 2px solid white;
`;

export const StatusDot = styled.span`
  position: absolute;
  right: 4px;
  bottom: 4px;
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
`;

export const Name = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 640px) {
    font-size: 16px;
  }
`;

export const VerifiedBadge = styled.span`
  display: inline-flex;
  color: #3b82f6;
  background: #eff6ff;
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
  color: #64748b;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: 640px) {
    font-size: 12px;
  }
`;

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 8px;
  
  @media (max-width: 640px) {
    gap: 8px;
  }
`;

export const MetaItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #64748b;
  
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
  margin-top: 6px;
`;

export const CategoryChip = styled.span`
  font-size: 11px;
  padding: 3px 8px;
  background: #f1f5f9;
  border-radius: 12px;
  color: #475569;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

// Stats Grid
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
  margin: 16px 0;
  padding: 12px 0;
  border-top: 1px solid #e2e8f0;
  border-bottom: 1px solid #e2e8f0;
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
`;

export const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #f1f5f9;
    transform: translateY(-2px);
  }
  
  svg {
    color: #3b82f6;
    flex-shrink: 0;
  }
  
  div {
    display: flex;
    flex-direction: column;
    
    strong {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
    }
    
    span {
      font-size: 10px;
      color: #64748b;
    }
  }
`;

// Pricing Section
export const PricingSection = styled.div`
  margin: 12px 0;
`;

export const PricingBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
`;

export const PricingBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  
  ${props => props.type === 'per_minute' && css`
    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
    color: #1e40af;
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
  gap: 20px;
  ${props => props.$fullWidth && css`
    width: 100%;
  `}
  
  > div {
    flex: ${props => props.$fullWidth ? 1 : 'auto'};
    
    &:first-child {
      flex: 1;
    }
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 12px;
  }
`;

export const PriceLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #94a3b8;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const PriceTag = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
  flex-wrap: wrap;
  
  ${props => props.$premium && css`
    background: linear-gradient(135deg, #8b5cf6, #6d28d9);
    padding: 6px 12px;
    border-radius: 12px;
    color: white;
    display: inline-flex;
  `}
`;

export const PriceValue = styled.span`
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  
  @media (max-width: 640px) {
    font-size: 18px;
  }
`;

export const PricingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
  padding: 10px 12px;
  background: linear-gradient(135deg, #f3e8ff, #fae8ff);
  border-radius: 14px;
  font-size: 12px;
  color: #6b21a5;
  
  svg {
    flex-shrink: 0;
  }
  
  span {
    flex: 1;
    font-weight: 500;
  }
`;

// Action Buttons
export const ActionRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const PrimaryBtn = styled(motion.button)`
  flex: 1;
  border: none;
  border-radius: 40px;
  padding: 12px 20px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  @media (max-width: 640px) {
    padding: 10px 16px;
    font-size: 12px;
  }
`;

export const GhostBtn = styled(motion.button)`
  min-width: 100px;
  border: 1.5px solid #e2e8f0;
  border-radius: 40px;
  background: transparent;
  color: #475569;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 10px 20px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f8fafc;
    border-color: #3b82f6;
    color: #3b82f6;
    transform: translateY(-2px);
  }
  
  @media (max-width: 640px) {
    padding: 8px 16px;
    font-size: 12px;
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
  border-radius: 28px;
  background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), 
    rgba(59, 130, 246, 0.15) 0%, 
    transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 1;
  
  ${Card}:hover & {
    opacity: 1;
  }
`;
