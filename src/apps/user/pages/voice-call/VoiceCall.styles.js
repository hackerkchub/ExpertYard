// VoiceCall.styles.js
import styled, { keyframes, css } from "styled-components";

/* Modern Animations */
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

const pulseRing = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 15px rgba(99, 102, 241, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
  }
`;

const waveAnimation = keyframes`
  0%, 100% {
    transform: scaleY(0.3);
  }
  50% {
    transform: scaleY(1);
  }
`;

const breathe = keyframes`
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

/* Base Container */
export const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 2000"><path fill="rgba(255,255,255,0.05)" d="M0,0 L2000,0 L2000,2000 L0,2000 Z M1000,500 C800,500 600,700 600,1000 C600,1300 800,1500 1000,1500 C1200,1500 1400,1300 1400,1000 C1400,700 1200,500 1000,500 Z"/></svg>') repeat;
    opacity: 0.1;
    pointer-events: none;
  }
`;

export const CallCard = styled.div`
  width: 100%;
  max-width: 450px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(0px);
  border-radius: 40px;
  padding: 0;
  color: #1f2937;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease-out;

  @media (min-width: 640px) {
    max-width: 480px;
  }
`;

/* Header Section with Timer & Controls */
export const CallHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 24px 24px 20px;
  position: relative;
`;

export const TimerSection = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

export const TimerLabel = styled.div`
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
`;

export const Timer = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: #fff;
  font-variant-numeric: tabular-nums;
  letter-spacing: 2px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  font-family: 'Monaco', 'Courier New', monospace;

  @media (min-width: 640px) {
    font-size: 56px;
  }
`;

export const HeaderControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 16px;
`;

export const HeaderControlBtn = styled.button`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  font-size: 22px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  ${props => props.$active && css`
    background: #ef4444;
    border-color: #ef4444;
    
    &:hover {
      background: #dc2626;
    }
  `}

  ${props => props.$danger && css`
    background: #ef4444;
    border-color: #ef4444;
    
    &:hover {
      background: #dc2626;
      transform: scale(1.05);
    }
  `}
`;

/* Expert Info Section */
export const ExpertInfo = styled.div`
  padding: 32px 24px;
  text-align: center;
  background: #fff;
`;

export const ExpertAvatarWrapper = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &.active::before {
    opacity: 1;
    animation: ${pulseRing} 1.5s ease-in-out infinite;
  }
`;

export const ExpertAvatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
`;

export const ExpertName = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
`;

export const ExpertRole = styled.p`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 20px;
`;

export const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 600;
  background: ${props => {
    switch(props.$status) {
      case 'calling': return '#fef3c7';
      case 'connected': return '#d1fae5';
      case 'ended': return '#fee2e2';
      case 'busy': return '#fee2e2';
      case 'offline': return '#f3f4f6';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch(props.$status) {
      case 'calling': return '#d97706';
      case 'connected': return '#059669';
      case 'ended': return '#dc2626';
      case 'busy': return '#dc2626';
      case 'offline': return '#6b7280';
      default: return '#6b7280';
    }
  }};

  span {
    font-size: 16px;
  }
`;

/* Wave Animation */
export const WaveContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 20px 0;
  height: 40px;
`;

export const WaveBar = styled.div`
  width: 4px;
  height: ${({ $index }) => 12 + $index * 5}px;
  background: linear-gradient(180deg, #667eea, #764ba2);
  border-radius: 4px;
  animation: ${waveAnimation} 0.8s ease-in-out infinite;
  animation-delay: ${({ $index }) => $index * 0.1}s;
`;

/* Connecting Animation */
export const ConnectingAnimation = styled.div`
  margin: 20px 0;
`;

export const ConnectingDots = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 20px 0;
`;

export const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  animation: ${breathe} 1s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay}s;
`;

export const ConnectingText = styled.p`
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
`;

/* Bottom Action Buttons */
export const BottomActions = styled.div`
  padding: 20px 24px 32px;
  background: #fff;
  border-top: 1px solid #f3f4f6;
`;

export const ActionButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  ${props => props.$primary && css`
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: #fff;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    }
  `}

  ${props => props.$danger && css`
    background: #ef4444;
    color: #fff;

    &:hover {
      background: #dc2626;
      transform: translateY(-2px);
    }
  `}

  ${props => props.$secondary && css`
    background: #f3f4f6;
    color: #4b5563;

    &:hover {
      background: #e5e7eb;
      transform: translateY(-2px);
    }
  `}

  &:active {
    transform: translateY(0);
  }
`;

/* Network Status */
export const NetworkStatus = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => {
    switch(props.$quality) {
      case 'poor': return '#ef4444';
      case 'average': return '#f59e0b';
      default: return '#10b981';
    }
  }};
  color: #fff;
  padding: 8px 20px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;

  span:first-child {
    font-size: 16px;
  }
`;

export const ReconnectingBadge = styled.div`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #f59e0b;
  color: #fff;
  padding: 8px 20px;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;

  &::before {
    content: '🔄';
    animation: ${breathe} 1s ease-in-out infinite;
  }
`;

/* Shimmer effect for loading */
export const Shimmer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
`;