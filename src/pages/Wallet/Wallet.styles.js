import styled from "styled-components";

export const PageWrap = styled.div`
  width: 100%;
  min-height: 100vh;

  background: radial-gradient(circle at 20% 20%, #1e2e47, #0b0f25 70%);
  padding: 40px 16px;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  font-family: "Inter", sans-serif;
`;

export const WalletBox = styled.div`
  width: 100%;
  max-width: 760px;
  background: rgba(255, 255, 255, 0.07);
  border-radius: 20px;
  padding: 28px;
  backdrop-filter: blur(20px);
  box-shadow: 0 0 30px rgba(0, 200, 255, 0.2);

  border: 1px solid rgba(255, 255, 255, 0.14);
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .wallet-label {
    color: #90e5ff;
    letter-spacing: 1px;
    font-weight: 600;
  }
`;

export const BalanceCard = styled.div`
  margin-top: 24px;
  padding: 26px;
  background: rgba(0, 200, 255, 0.08);
  border-radius: 18px;
  text-align: center;
  border: 1px solid rgba(0, 200, 255, 0.25);

  h3 {
    font-size: 15px;
    opacity: 0.7;
    margin-bottom: 10px;
  }
`;

export const BalanceAmount = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #7ae9ff;

  span {
    font-size: 16px;
    opacity: 0.7;
  }
`;

export const ExpenseSection = styled.div`
  margin-top: 28px;
`;

export const SectionTitle = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
  margin-top: 16px;

  span {
    font-size: 15px;
    opacity: 0.85;
  }

  .filter button {
    background: transparent;
    border: none;
    margin-left: 10px;
    font-size: 13px;
    cursor: pointer;
    opacity: 0.6;
    color: #9bdfff;

    &.active {
      opacity: 1;
      text-decoration: underline;
    }
  }
`;

export const ExpertCard = styled.div`
  background: rgba(255, 255, 255, 0.06);
  padding: 16px;
  border-radius: 14px;
  backdrop-filter: blur(12px);
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  border: 1px solid rgba(255, 255, 255, 0.12);
`;

export const ExpertLeft = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const Avatar = styled.img`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
`;

export const ExpertInfo = styled.div`
  strong {
    font-size: 15px;
    color: #e5faff;
  }

  small {
    display: block;
    opacity: 0.7;
    font-size: 12px;
  }
`;

export const ExpertRight = styled.div``;

export const AmountBox = styled.div`
  background: rgba(0, 200, 255, 0.08);
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 13px;
  color: #86eaff;
  border: 1px solid rgba(0, 200, 255, 0.18);
`;

export const TopupSection = styled.div`
  margin-top: 30px;
`;

export const AddBalanceBtn = styled.button`
  width: 100%;
  padding: 14px;
  margin-top: 12px;

  background: linear-gradient(135deg, #00d0ff, #0096ff);
  border: none;
  border-radius: 12px;

  color: white;
  font-size: 15px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 16px rgba(0, 200, 255, 0.4);
  }
`;

export const QuickAddRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 14px;
  gap: 12px;
`;

export const QuickAddBtn = styled.button`
  padding: 10px 20px;
  background: rgba(0, 200, 255, 0.12);
  color: #a8f7ff;
  border-radius: 10px;
  border: 1px solid rgba(0, 200, 255, 0.22);
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: rgba(0, 200, 255, 0.22);
  }
`;
