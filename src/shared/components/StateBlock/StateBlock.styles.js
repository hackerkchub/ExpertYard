import styled, { css } from "styled-components";

export const StateCard = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 28px 20px;
  border-radius: 18px;
  border: 1px solid #e2e8f0;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  text-align: center;

  ${({ $compact }) =>
    $compact &&
    css`
      padding: 20px 16px;
      border-radius: 14px;
      gap: 12px;
    `}

  @media (max-width: 480px) {
    padding: 24px 16px;
  }
`;

export const StateIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #1d4ed8;
  background: rgba(37, 99, 235, 0.08);
`;

export const StateBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 100%;
  max-width: 560px;
`;

export const StateEyebrow = styled.p`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #2563eb;
`;

export const StateTitle = styled.h3`
  font-size: clamp(18px, 3vw, 24px);
  line-height: 1.3;
  color: #0f172a;
`;

export const StateDescription = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #475569;
`;

export const StateAction = styled.div`
  margin-top: 8px;
  width: 100%;
  display: flex;
  justify-content: center;
`;
