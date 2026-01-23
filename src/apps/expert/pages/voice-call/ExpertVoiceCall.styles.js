import styled from "styled-components";

export const PageWrapper = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at top, #1a2430, #0b1218);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
`;

export const CallCard = styled.div`
  width: 100%;
  max-width: 420px;
  background: linear-gradient(180deg, #121c26, #0b1218);
  border-radius: 24px;
  padding: 26px;
  color: #fff;
  text-align: center;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.7);
`;

export const ExpertAvatarWrapper = styled.div`
  width: 150px;
  height: 150px;
  margin: auto;
  border-radius: 50%;
  padding: 4px;
  background: linear-gradient(135deg, #28dcaa, #f4d27a);
`;

export const ExpertAvatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

export const ExpertName = styled.div`
  margin-top: 16px;
  font-size: 18px;
  font-weight: 600;
`;

export const ExpertRole = styled.div`
  font-size: 13px;
  opacity: 0.75;
`;

export const StatusText = styled.div`
  margin: 26px 0 18px;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 1px;
`;

export const IncomingActions = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

export const ActionBtn = styled.button`
  padding: 12px 18px;
  border-radius: 14px;
  border: none;
  font-weight: 600;
  cursor: pointer;
 background: ${({ $accept }) => ($accept ? "#28dcaa" : "#e74c3c")};

  color: #000;
`;

export const Timer = styled.div`
  font-size: 22px;
  font-weight: 600;
  margin: 18px 0;
`;

export const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`;

export const ControlBtn = styled.button`
  background: ${({ danger, active }) =>
    danger ? "#e74c3c" : active ? "#28dcaa" : "#1b2a36"};
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 12px 14px;
  font-size: 18px;
  cursor: pointer;

  span {
    font-size: 10px;
    display: block;
  }
`;

export const Brand = styled.div`
  margin-top: 14px;
  font-size: 12px;
  opacity: 0.75;
`;
