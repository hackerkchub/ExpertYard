import styled, { keyframes, css } from "styled-components";

/* Animations */
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(64, 224, 208, 0.7); }
  70% { box-shadow: 0 0 0 20px rgba(64, 224, 208, 0); }
  100% { box-shadow: 0 0 0 0 rgba(64, 224, 208, 0); }
`;

const ring = keyframes`
  0% { transform: rotate(0deg); }
  10% { transform: rotate(15deg); }
  20% { transform: rotate(-15deg); }
  30% { transform: rotate(10deg); }
  40% { transform: rotate(-10deg); }
  50% { transform: rotate(5deg); }
  60% { transform: rotate(-5deg); }
  70% { transform: rotate(2deg); }
  80% { transform: rotate(-2deg); }
  90% { transform: rotate(1deg); }
  100% { transform: rotate(0deg); }
`;

const loading = keyframes`
  0% { transform: translateX(-100%); }
  50% { transform: translateX(0); }
  100% { transform: translateX(100%); }
`;

const glow = keyframes`
  0% { filter: drop-shadow(0 0 2px rgba(64, 224, 208, 0.6)); }
  50% { filter: drop-shadow(0 0 8px rgba(64, 224, 208, 0.9)); }
  100% { filter: drop-shadow(0 0 2px rgba(64, 224, 208, 0.6)); }
`;

const wave = keyframes`
  0% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
  100% { transform: scaleY(0.3); }
`;

const breathe = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.02); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/* Base Container */
export const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(145deg, #0f1a24 0%, #071016 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 70% 30%, rgba(64, 224, 208, 0.03) 0%, transparent 60%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 30% 70%, rgba(244, 210, 122, 0.02) 0%, transparent 50%);
    pointer-events: none;
  }
`;

export const CallCard = styled.div`
  width: 100%;
  max-width: 480px;
  background: rgba(18, 30, 40, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 32px;
  padding: 28px 24px;
  color: #fff;
  text-align: center;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.8),
    0 0 0 1px rgba(64, 224, 208, 0.1) inset;
  border: 1px solid rgba(64, 224, 208, 0.15);
  position: relative;
  overflow: hidden;
  animation: ${slideIn} 0.5s ease-out;

  @media (min-width: 640px) {
    padding: 36px 32px;
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at 30% 50%, rgba(64, 224, 208, 0.05), transparent 70%);
    pointer-events: none;
    z-index: 0;
  }
`;

/* Avatar Section */
export const ExpertAvatarWrapper = styled.div`
  width: 140px;
  height: 140px;
  margin: 0 auto 16px;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(135deg, #40e0d0, #f4d27a);
  box-shadow: 0 15px 30px -8px rgba(64, 224, 208, 0.4);
  position: relative;
  z-index: 1;

  @media (min-width: 640px) {
    width: 160px;
    height: 160px;
  }

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: linear-gradient(135deg, #40e0d0, #f4d27a);
    opacity: 0.3;
    filter: blur(10px);
    z-index: -1;
  }

  &::after {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    background: linear-gradient(135deg, #40e0d0, #f4d27a);
    opacity: 0.1;
    filter: blur(15px);
    z-index: -2;
  }
`;

export const ExpertAvatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #0f1a24;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

export const ExpertName = styled.div`
  margin-top: 20px;
  font-size: 22px;
  font-weight: 700;
  background: linear-gradient(90deg, #fff, #e0e0e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;

  @media (min-width: 640px) {
    font-size: 26px;
  }
`;

export const ExpertRole = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 6px;
  margin-bottom: 20px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  position: relative;
  z-index: 1;
`;

/* Status Text */
export const StatusText = styled.div`
  margin: 24px 0 20px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  background: ${({ $reconnecting }) => 
    $reconnecting 
      ? 'linear-gradient(90deg, #ffb020, #ff9800)' 
      : 'linear-gradient(90deg, #40e0d0, #7fffd4)'};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  z-index: 1;
  animation: ${breathe} 2s ease-in-out infinite;

  @media (min-width: 640px) {
    font-size: 18px;
    margin: 28px 0 24px;
  }
`;

/* Incoming Call Actions */
export const IncomingActions = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin: 24px 0;
  position: relative;
  z-index: 1;
  animation: ${slideIn} 0.5s ease-out;
`;

export const ActionBtn = styled.button`
  padding: 14px 28px;
  border-radius: 50px;
  border: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-weight: 700;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  background: ${({ $accept, disabled }) => 
    disabled 
      ? 'linear-gradient(145deg, #4a5568, #2d3748)' 
      : $accept 
        ? 'linear-gradient(145deg, #40e0d0, #2aa88a)' 
        : 'linear-gradient(145deg, #ff4d4d, #cc0000)'};
  color: #fff;
  box-shadow: ${({ $accept, disabled }) => 
    disabled 
      ? 'none' 
      : $accept 
        ? '0 8px 20px rgba(64, 224, 208, 0.4)' 
        : '0 8px 20px rgba(255, 77, 77, 0.4)'};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  min-width: 120px;
  position: relative;
  overflow: hidden;

  @media (min-width: 640px) {
    padding: 16px 32px;
    min-width: 140px;
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

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${({ $accept }) => 
      $accept 
        ? '0 12px 28px rgba(64, 224, 208, 0.6)' 
        : '0 12px 28px rgba(255, 77, 77, 0.6)'};

    &::before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

/* Timer */
export const Timer = styled.div`
  font-size: 42px;
  font-weight: 700;
  margin: 24px 0;
  color: #40e0d0;
  text-shadow: 0 0 20px rgba(64, 224, 208, 0.5);
  letter-spacing: 4px;
  font-variant-numeric: tabular-nums;
  animation: ${glow} 2s infinite;
  position: relative;
  z-index: 1;

  @media (min-width: 640px) {
    font-size: 56px;
    margin: 32px 0;
  }
`;

/* Controls */
export const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 28px 0;
  position: relative;
  z-index: 1;

  @media (min-width: 640px) {
    gap: 30px;
  }
`;

export const ControlBtn = styled.button`
  background: ${({ $danger, $active }) => 
    $danger 
      ? 'linear-gradient(145deg, #ff4d4d, #cc0000)' 
      : $active 
        ? 'linear-gradient(145deg, #40e0d0, #2aa88a)' 
        : 'linear-gradient(145deg, #1e3340, #12212b)'};
  color: ${({ $active, $danger }) => 
    $danger ? '#fff' : $active ? '#0f1a24' : '#fff'};
  border: none;
  border-radius: 24px;
  padding: 14px 22px;
  font-size: 22px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  box-shadow: ${({ $danger, $active }) => 
    $danger 
      ? '0 8px 20px rgba(255, 77, 77, 0.3)' 
      : $active 
        ? '0 8px 20px rgba(64, 224, 208, 0.3)' 
        : '0 8px 20px rgba(0, 0, 0, 0.3)'};
  position: relative;
  overflow: hidden;

  @media (min-width: 640px) {
    padding: 16px 28px;
    font-size: 26px;
    min-width: 120px;
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

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: ${({ $danger, $active }) => 
      $danger 
        ? '0 12px 28px rgba(255, 77, 77, 0.5)' 
        : $active 
          ? '0 12px 28px rgba(64, 224, 208, 0.5)' 
          : '0 12px 28px rgba(0, 0, 0, 0.5)'};

    &::before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  span {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

/* Brand */
export const Brand = styled.div`
  margin-top: 24px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 2px;
  text-transform: uppercase;
  position: relative;
  z-index: 1;
`;

/* Wave Animation for Active Call */
export const WaveContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin: 20px 0 10px;
  height: 50px;
  position: relative;
  z-index: 1;
`;

export const WaveBar = styled.div`
  width: 6px;
  height: ${({ $index }) => 20 + $index * 8}px;
  background: linear-gradient(180deg, #40e0d0, #f4d27a);
  border-radius: 6px;
  animation: ${wave} 1.2s ease-in-out infinite;
  animation-delay: ${({ $index }) => $index * 0.15}s;
  box-shadow: 0 0 15px rgba(64, 224, 208, 0.6);
`;

/* Reconnecting Badge */
export const ReconnectingBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 176, 32, 0.95);
  backdrop-filter: blur(5px);
  color: #0f1a24;
  padding: 8px 18px;
  border-radius: 30px;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 20px rgba(255, 176, 32, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 20;
  animation: ${pulse} 1.5s infinite;

  &::before {
    content: '🔄';
    font-size: 14px;
    animation: ${glow} 1s infinite;
  }
`;

/* Loading Spinner */
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(64, 224, 208, 0.3);
  border-top-color: #40e0d0;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 20px auto;
`;

/* Network Quality Indicator */
export const NetworkIndicator = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  color: ${({ $quality }) => 
    $quality === 'good' ? '#40e0d0' : 
    $quality === 'average' ? '#ffb020' : 
    '#ff4d4d'};
  border: 1px solid ${({ $quality }) => 
    $quality === 'good' ? 'rgba(64, 224, 208, 0.3)' : 
    $quality === 'average' ? 'rgba(255, 176, 32, 0.3)' : 
    'rgba(255, 77, 77, 0.3)'};
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 20;

  &::before {
    content: ${({ $quality }) => 
      $quality === 'good' ? '"📶"' : 
      $quality === 'average' ? '"⚠️"' : 
      '"🔴"'};
  }
`;