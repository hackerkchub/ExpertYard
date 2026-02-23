import styled, { keyframes, css } from "styled-components";

// Animations
const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(100px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
`;

const ring = keyframes`
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(5deg);
  }
  75% {
    transform: rotate(-5deg);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
  }
  50% {
    box-shadow: 0 0 40px rgba(34, 197, 94, 0.8);
  }
`;

// Main Wrapper
export const PopupWrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  width: 100%;
  max-width: 420px;
  padding: 16px;
  animation: ${slideIn} 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  
  @media (max-width: 480px) {
    max-width: 100%;
    padding: 12px;
    top: auto;
    bottom: 0;
    transform: translateX(-50%);
    animation: slideIn 0.3s ease-out;
  }
`;

// Glassmorphism Card
export const GlassmorphismCard = styled.div`
  position: relative;
  background: rgba(20, 30, 40, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 32px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  overflow: hidden;
  
  @media (max-width: 480px) {
    border-radius: 24px 24px 0 0;
    padding: 20px;
  }
`;

// Animated Background
export const AnimatedBackground = styled.div`
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at 70% 30%,
    rgba(34, 197, 94, 0.15) 0%,
    rgba(59, 130, 246, 0.15) 50%,
    transparent 70%
  );
  animation: ${shimmer} 8s linear infinite;
  pointer-events: none;
`;

// Header
export const CallHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
`;

export const CallStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.$ringing ? '#22c55e' : '#94a3b8'};
  
  .dot {
    width: 8px;
    height: 8px;
    background: ${props => props.$ringing ? '#22c55e' : '#94a3b8'};
    border-radius: 50%;
    animation: ${props => props.$ringing ? css`${pulse} 1s ease-in-out infinite` : 'none'};
  }
  
  .icon {
    animation: ${props => props.$ringing ? 'none' : css`${pulse} 2s ease-in-out infinite`};
  }
`;

export const CallQuality = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  font-size: 11px;
  color: #10b981;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

// Caller Info
export const CallerInfo = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
  }
`;

export const AvatarContainer = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const AvatarRing = styled.div`
  padding: 4px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22c55e, #3b82f6);
  animation: ${props => props.$ringing ? css`${glow} 1.5s ease-in-out infinite` : 'none'};
`;

export const AvatarWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #2d3a4a, #1a2634);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border: 3px solid rgba(255, 255, 255, 0.2);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  svg {
    width: 40px;
    height: 40px;
    opacity: 0.7;
  }
`;

export const VideoBadge = styled.div`
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 12px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  animation: ${pulse} 2s ease-in-out infinite;
`;

export const CallerDetails = styled.div`
  flex: 1;
`;

export const CallerName = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 4px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

export const CallerTitle = styled.p`
  font-size: 14px;
  color: #94a3b8;
  margin: 0 0 12px;
`;

export const CallMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #cbd5e1;
  
  svg {
    width: 14px;
    height: 14px;
    color: #64748b;
  }
`;

// Call Controls (during active call)
export const CallControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
`;

export const ControlButton = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: ${props => 
    props.$active 
      ? 'linear-gradient(135deg, #3b82f6, #2563eb)' 
      : props.$volume 
      ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
      : 'rgba(255, 255, 255, 0.1)'
  };
  color: ${props => props.$active || props.$volume ? '#fff' : '#94a3b8'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    background: ${props => 
      props.$active 
        ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' 
        : props.$volume
        ? 'linear-gradient(135deg, #7c3aed, #6d28d9)'
        : 'rgba(255, 255, 255, 0.2)'
    };
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Action Buttons
export const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  position: relative;
  z-index: 1;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const BaseButton = styled.button`
  flex: ${props => props.$fullWidth ? '1' : 'none'};
  padding: 14px 24px;
  border-radius: 40px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  &:hover::before {
    width: 300px;
    height: 300px;
  }
  
  svg {
    font-size: 18px;
  }
  
  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const AcceptButton = styled(BaseButton)`
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: #fff;
  box-shadow: 0 10px 20px rgba(34, 197, 94, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(34, 197, 94, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const RejectButton = styled(BaseButton)`
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: #fff;
  box-shadow: 0 10px 20px rgba(239, 68, 68, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(239, 68, 68, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Quick Actions
export const QuickActions = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  justify-content: center;
  position: relative;
  z-index: 1;
`;

export const QuickActionBtn = styled.button`
  padding: 8px 16px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
  color: #cbd5e1;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  svg {
    font-size: 14px;
  }
`;

// Encryption Info
export const EncryptionInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 10px;
  color: #64748b;
  position: relative;
  z-index: 1;
  
  svg {
    color: #10b981;
  }
`;

export const CloseBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  border: none;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(10px);
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;

  &:hover {
    background: rgba(255,255,255,0.25);
  }
`;