import styled, { keyframes } from "styled-components";

/* Base */
export const PageWrapper = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at top, #0f2c3a, #07151c);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px;
`;

export const CallCard = styled.div`
  width: 100%;
  max-width: 420px;
  background: linear-gradient(180deg, #0e2a35, #071b22);
  border-radius: 24px;
  padding: 24px;
  color: #fff;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
`;

export const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const UserBlock = styled.div``;

export const Avatar = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 3px solid #f4d27a;
`;

export const Name = styled.div`
  font-size: 13px;
  margin-top: 6px;
  opacity: 0.8;
`;

/* Animations */
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(40,220,170,.7); }
  70% { box-shadow: 0 0 0 18px rgba(40,220,170,0); }
  100% { box-shadow: 0 0 0 0 rgba(40,220,170,0); }
`;

export const CallIconRing = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 2px solid #28dcaa;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulse} 1.6s infinite;
  font-size: 26px;
`;

export const StatusText = styled.div`
  margin: 24px 0 16px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
`;

export const EndCallButton = styled.button`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #e74c3c;
  border: none;
  color: #fff;
  margin: 0 auto 20px;
  cursor: pointer;

  span {
    font-size: 10px;
    display: block;
  }
`;

/* Incoming */
export const IncomingActions = styled.div`
  display: flex;
  gap: 14px;
  justify-content: center;
  margin-bottom: 20px;
`;

export const ActionBtn = styled.button`
  padding: 10px 16px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  background: ${({ accept }) => (accept ? "#28dcaa" : "#e74c3c")};
  color: #000;
`;

/* Connected */
export const Timer = styled.div`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 14px;
`;

export const Controls = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

export const ControlBtn = styled.button`
  background: ${({ danger, active }) =>
    danger ? "#e74c3c" : active ? "#28dcaa" : "#122f3c"};
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 10px 12px;
  font-size: 18px;
  cursor: pointer;

  span {
    font-size: 10px;
    display: block;
  }
`;

/* Expert */
export const ExpertSection = styled.div`
  margin-top: 20px;
`;

export const ExpertAvatarWrapper = styled.div`
  width: 140px;
  height: 140px;
  margin: auto;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(135deg, #28dcaa, #f4d27a);
`;

export const ExpertAvatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

export const ExpertName = styled.div`
  margin-top: 14px;
  font-weight: 600;
`;

export const ExpertRole = styled.div`
  font-size: 13px;
  opacity: 0.75;
`;

const loading = keyframes`
  from { width: 0 }
  to { width: 100% }
`;

export const ConnectingBar = styled.div`
  width: 70%;
  height: 6px;
  background: rgba(255,255,255,0.1);
  margin: 14px auto;
  border-radius: 6px;
  overflow: hidden;

  span {
    display: block;
    height: 100%;
    background: linear-gradient(90deg,#28dcaa,#f4d27a);
    animation: ${loading} 2s infinite;
  }
`;

export const Brand = styled.div`
  font-size: 13px;
  opacity: 0.85;
  margin-top: 10px;
`;

export const ReconnectingBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ffb020;
  color: #000;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  animation: pulse 1.2s infinite;

  @keyframes pulse {
    0% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(0.95); }
    100% { opacity: 1; transform: scale(1); }
  }
`;
