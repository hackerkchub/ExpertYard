import styled from "styled-components";

export const PageWrap = styled.div`
  width: 100%;
  min-height: 100vh;
  background: radial-gradient(circle at 20% 20%, #122036, #050814 70%);
  padding: 40px 16px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-family: "Inter", sans-serif;
`;

export const WalletBox = styled.div`
  width: 100%;
  max-width: 760px;
  background: rgba(18, 24, 38, 0.6);
  border-radius: 20px;
  padding: 28px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 255, 255, 0.16);
  box-shadow: 0 0 32px rgba(0, 200, 255, 0.16);
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .wallet-label {
    color: #dffcff;
    letter-spacing: 1px;
    font-weight: 600;
    font-size: 17px;
    text-shadow: 0 0 6px rgba(0, 240, 255, 0.4);
  }
`;

export const BalanceCard = styled.div`
  margin-top: 24px;
  padding: 26px;
  background: rgba(0, 200, 255, 0.1);
  border-radius: 18px;
  text-align: center;
  border: 1px solid rgba(0, 200, 255, 0.28);

  h3 {
    font-size: 16px;
    color: #e9faff;
    margin-bottom: 10px;
    font-weight: 500;
  }
`;

export const BalanceAmount = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #33edff;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.6);

  span {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.7);
    margin-left: 6px;
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
    color: #e2faff;
    font-weight: 500;
    opacity: 0.95;
  }

  .filter button {
    background: transparent;
    border: none;
    margin-left: 10px;
    font-size: 13px;
    cursor: pointer;
    color: #a5faff;
    font-weight: 500;
    opacity: 0.8;

    &.active {
      opacity: 1;
      text-decoration: underline;
    }
  }
`;

export const ExpertCard = styled.div`
  background: rgba(26, 32, 48, 0.65);
  padding: 16px;
  border-radius: 14px;
  backdrop-filter: blur(12px);
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(0, 255, 255, 0.14);
  transition: 0.2s;

  &:hover {
    background: rgba(26, 32, 48, 0.78);
  }
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
    color: #e8fcff;
  }

  small {
    display: block;
    color: rgba(255, 255, 255, 0.65);
    font-size: 12px;
  }
`;

export const ExpertRight = styled.div``;

export const AmountBox = styled.div`
  background: rgba(0, 200, 255, 0.1);
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 13px;
  color: #7cefff;
  border: 1px solid rgba(0, 255, 255, 0.26);
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
  font-weight: 600;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 18px rgba(0, 200, 255, 0.45);
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
  background: rgba(0, 200, 255, 0.16);
  color: #c8feff;
  border-radius: 10px;
  border: 1px solid rgba(0, 255, 255, 0.28);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: 0.2s;

  &:hover {
    background: rgba(0, 200, 255, 0.24);
  }
`;
