import styled from "styled-components";

/* ================= PAGE ================= */

export const PageWrap = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc, #eef2ff);
  padding: 40px 16px;
  display: flex;
  justify-content: center;
  font-family: "Inter", sans-serif;
`;

/* ================= CONTAINER ================= */

export const WalletBox = styled.div`
  width: 100%;
  max-width: 780px;
  background: #ffffff;
  border-radius: 22px;
  padding: 28px;
  box-shadow:
    0 20px 40px rgba(15, 23, 42, 0.08),
    0 2px 6px rgba(15, 23, 42, 0.04);
`;

/* ================= HEADER ================= */

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .wallet-label {
    font-size: 18px;
    font-weight: 700;
    color: #2563eb;
    letter-spacing: 0.8px;
  }
`;

/* ================= BALANCE ================= */

export const BalanceCard = styled.div`
  margin-top: 26px;
  padding: 28px;
  border-radius: 20px;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #fff;
  text-align: center;
  box-shadow: 0 16px 30px rgba(37, 99, 235, 0.35);

  h3 {
    font-size: 15px;
    font-weight: 500;
    opacity: 0.9;
    margin-bottom: 10px;
  }
`;

export const BalanceAmount = styled.div`
  font-size: 38px;
  font-weight: 800;
  letter-spacing: 0.5px;

  span {
    font-size: 16px;
    opacity: 0.85;
    margin-left: 6px;
  }
`;

/* ================= SECTIONS ================= */

export const ExpenseSection = styled.div`
  margin-top: 34px;
`;

export const SectionTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;

  span {
    font-size: 16px;
    font-weight: 700;
    color: #0f172a;
  }

  .filter button {
    background: transparent;
    border: none;
    margin-left: 12px;
    font-size: 13px;
    cursor: pointer;
    color: #64748b;
    font-weight: 600;

    &.active {
      color: #2563eb;
      text-decoration: underline;
    }
  }
`;

/* ================= CARDS ================= */

export const ExpertCard = styled.div`
  background: #f8fafc;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e2e8f0;
  transition: 0.25s ease;

  &:hover {
    background: #ffffff;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
    transform: translateY(-2px);
  }
`;

export const ExpertLeft = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
`;

export const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

export const ExpertInfo = styled.div`
  strong {
    font-size: 15px;
    color: #0f172a;
    font-weight: 700;
  }

  small {
    display: block;
    color: #64748b;
    font-size: 12px;
  }
`;

export const ExpertRight = styled.div``;

export const AmountBox = styled.div`
  background: #eef2ff;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  color: #4338ca;
`;

/* ================= TOPUP ================= */

export const TopupSection = styled.div`
  margin-top: 36px;
`;

export const AddBalanceBtn = styled.button`
  width: 100%;
  padding: 15px;
  margin-top: 14px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border: none;
  border-radius: 14px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  font-weight: 700;
  box-shadow: 0 12px 22px rgba(34, 197, 94, 0.35);

  &:hover {
    transform: translateY(-2px);
  }
`;

export const QuickAddRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 18px;
  gap: 12px;
  flex-wrap: wrap;
`;

export const QuickAddBtn = styled.button`
  padding: 10px 22px;
  background: #f1f5f9;
  color: #0f172a;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  transition: 0.2s;

  &:hover {
    background: #e0e7ff;
    color: #1d4ed8;
  }
`;
