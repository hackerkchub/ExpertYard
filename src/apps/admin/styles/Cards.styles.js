import styled from "styled-components";

export const Grid = styled.div`
  width: 100%;
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 22px;
  background: rgba(12, 18, 27, 0.7);
  border: 1px solid rgba(255,255,255,0.04);
  backdrop-filter: blur(12px);
  border-radius: 14px;
  transition: 0.25s ease;
  box-shadow: 0 4px 18px rgba(2,6,23,0.45);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 28px rgba(2,6,23,0.55);
    border-color: rgba(0,160,255,0.25);
  }

  ${({ highlight }) =>
    highlight &&
    `
      border-color: rgba(255,172,50,0.5);
      box-shadow: 0 6px 20px rgba(255,172,50,0.35);

      &:hover {
        border-color: rgba(255,172,50,0.8);
      }
    `}
`;

export const StatIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width:48px;
  height:48px;
  border-radius:12px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.03);
  color: #4dd4ff;
  font-size: 22px;
`;

export const StatBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const StatLabel = styled.div`
  font-size: 14px;
  color: #9aa7b7;
`;

export const StatValue = styled.div`
  font-weight: 700;
  font-size: 32px;
  color: #ffffff;
  line-height: 1.2;
`;
