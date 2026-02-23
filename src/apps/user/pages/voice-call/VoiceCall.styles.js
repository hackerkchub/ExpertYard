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

/* Base Container */
export const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(145deg, #0b1a23 0%, #041016 100%);
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
    background: radial-gradient(circle at 30% 50%, rgba(64, 224, 208, 0.03) 0%, transparent 50%);
    pointer-events: none;
  }
`;

export const CallCard = styled.div`
  width: 100%;
  max-width: 480px;
  background: rgba(18, 34, 44, 0.95);
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
    background: radial-gradient(circle at 70% 30%, rgba(64, 224, 208, 0.05), transparent 70%);
    pointer-events: none;
  }
`;

/* Top Section */
export const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
`;

export const UserBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

export const Avatar = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 3px solid #40e0d0;
  object-fit: cover;
  box-shadow: 0 8px 16px -4px rgba(64, 224, 208, 0.3);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (min-width: 640px) {
    width: 80px;
    height: 80px;
  }
`;

export const Name = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.5px;
`;

/* Call Status */
export const CallIconRing = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: rgba(64, 224, 208, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 2s infinite, ${ring} 0.8s ease-in-out;
  border: 2px solid #40e0d0;
  position: relative;

  @media (min-width: 640px) {
    width: 80px;
    height: 80px;
  }

  span {
    font-size: 32px;
    animation: ${glow} 2s infinite;
  }
`;

export const StatusText = styled.div`
  margin: 24px 0 20px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  background: linear-gradient(90deg, #40e0d0, #7fffd4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (min-width: 640px) {
    font-size: 18px;
    margin: 28px 0 24px;
  }
`;

/* Timer */
export const Timer = styled.div`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #40e0d0;
  text-shadow: 0 0 20px rgba(64, 224, 208, 0.5);
  letter-spacing: 2px;
  font-variant-numeric: tabular-nums;
  animation: ${breathe} 2s ease-in-out infinite;

  @media (min-width: 640px) {
    font-size: 48px;
    margin-bottom: 32px;
  }
`;

/* Controls */
export const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;

  @media (min-width: 640px) {
    gap: 24px;
  }
`;

export const ControlBtn = styled.button`
  background: ${({ $danger, $active }) => 
    $danger ? '#ff4d4d' : $active ? '#40e0d0' : 'rgba(255, 255, 255, 0.1)'};
  color: ${({ $active, $danger }) => 
    $danger ? '#fff' : $active ? '#0b1a23' : '#fff'};
  border: none;
  border-radius: 20px;
  padding: 12px 18px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  @media (min-width: 640px) {
    padding: 14px 24px;
    font-size: 24px;
    min-width: 100px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    background: ${({ $danger, $active }) => 
      $danger ? '#ff3333' : $active ? '#3cb0a0' : 'rgba(255, 255, 255, 0.15)'};
  }

  &:active {
    transform: translateY(0);
  }

  span {
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

/* End Call Button */
export const EndCallButton = styled.button`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(145deg, #ff4d4d, #cc0000);
  border: none;
  color: #fff;
  margin: 0 auto 24px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(255, 77, 77, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.2);

  @media (min-width: 640px) {
    width: 80px;
    height: 80px;
  }

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 12px 28px rgba(255, 77, 77, 0.6);
  }

  &:active {
    transform: scale(0.95);
  }

  span {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
  }
`;

/* Expert Section */
export const ExpertSection = styled.div`
  margin-top: 24px;
  position: relative;
  z-index: 1;
`;

export const ExpertAvatarWrapper = styled.div`
  width: 140px;
  height: 140px;
  margin: 0 auto 16px;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(135deg, #40e0d0, #7fffd4);
  box-shadow: 0 15px 30px -8px rgba(64, 224, 208, 0.4);
  position: relative;

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
    background: linear-gradient(135deg, #40e0d0, #7fffd4);
    opacity: 0.3;
    filter: blur(10px);
    z-index: -1;
  }
`;

export const ExpertAvatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #0b1a23;
`;

export const ExpertName = styled.div`
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 6px;
  background: linear-gradient(90deg, #fff, #e0e0e0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (min-width: 640px) {
    font-size: 24px;
  }
`;

export const ExpertRole = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const ConnectingBar = styled.div`
  width: 80%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  margin: 16px auto;
  border-radius: 4px;
  overflow: hidden;
  position: relative;

  span {
    display: block;
    height: 100%;
    width: 100%;
    background: linear-gradient(90deg, #40e0d0, #7fffd4, #40e0d0);
    animation: ${loading} 1.5s infinite;
  }
`;

export const Brand = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 2px;
  margin-top: 20px;
  text-transform: uppercase;
`;

/* Reconnecting Badge */
export const ReconnectingBadge = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 193, 7, 0.95);
  backdrop-filter: blur(5px);
  color: #0b1a23;
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 20px rgba(255, 193, 7, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 10;

  &::before {
    content: '🔄';
    font-size: 14px;
    animation: ${pulse} 1s infinite;
  }
`;

/* Wave Animation for Active Call */
export const WaveContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin: 16px 0;
  height: 40px;
`;

export const WaveBar = styled.div`
  width: 4px;
  height: ${({ $index }) => 15 + $index * 8}px;
  background: #40e0d0;
  border-radius: 4px;
  animation: ${wave} 1s ease-in-out infinite;
  animation-delay: ${({ $index }) => $index * 0.1}s;
  box-shadow: 0 0 10px #40e0d0;
`;

/* Incoming Call Actions */
export const IncomingActions = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin: 24px 0;
`;

export const ActionBtn = styled.button`
  padding: 14px 28px;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  background: ${({ $accept }) => 
    $accept ? 'linear-gradient(145deg, #40e0d0, #2aa88a)' : 'linear-gradient(145deg, #ff4d4d, #cc0000)'};
  color: #fff;
  box-shadow: 0 8px 20px ${({ $accept }) => 
    $accept ? 'rgba(64, 224, 208, 0.4)' : 'rgba(255, 77, 77, 0.4)'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 28px ${({ $accept }) => 
      $accept ? 'rgba(64, 224, 208, 0.6)' : 'rgba(255, 77, 77, 0.6)'};
  }

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
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  color: #fff;
  padding: 8px 20px;
  border-radius: 50px;
  font-size: 14px;
  border: 1px solid #40e0d0;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  z-index: 100;
`;