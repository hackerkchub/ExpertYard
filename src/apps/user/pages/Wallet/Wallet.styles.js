import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const NAVY = "#000080";
const YELLOW = "#FFC107";

export const PageWrap = styled.div`
  width: 100%;
  min-height: 100vh;
  background:
    radial-gradient(circle at 8% 0%, rgba(0, 0, 128, 0.08), transparent 30%),
    radial-gradient(circle at 92% 8%, rgba(255, 193, 7, 0.14), transparent 28%),
    #f8fafc;
  display: flex;
  justify-content: center;
  padding: 28px 18px 48px;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #111827;

  @media (max-width: 640px) {
    padding: 18px 12px 34px;
  }

  @media (min-width: 1024px) {
    background:
      radial-gradient(circle at 8% 0%, rgba(0, 0, 128, 0.08), transparent 30%),
      radial-gradient(circle at 92% 8%, rgba(255, 213, 74, 0.14), transparent 28%),
      #f8fafc;
    padding: 28px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
`;

export const WalletBox = styled.div`
  width: 100%;
  max-width: 1180px;
  animation: ${fadeIn} 0.45s ease;

  @media (min-width: 1024px) {
    max-width: none;
  }

  .wallet-safety-card {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 22px;
    padding: 15px 18px;
    border-radius: 18px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    color: #374151;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);

    svg {
      flex: 0 0 auto;
      font-size: 22px;
      color: ${NAVY};
    }
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;

  .page-title {
    margin: 0;
    color: #111827;
    font-size: clamp(1.35rem, 2vw, 2rem);
    font-weight: 900;
    letter-spacing: -0.03em;
  }

  @media (min-width: 1024px) {
    .page-title {
      font-size: clamp(30px, 2.45vw, 38px);
      font-weight: 900;
      letter-spacing: -0.02em;
    }
  }

  .user-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #ffffff;
    padding: 9px 13px;
    border-radius: 999px;
    border: 1px solid #e5e7eb;
    color: #1f2937;
    font-size: 0.9rem;
    font-weight: 750;
    box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);

    svg {
      color: ${NAVY};
    }
  }

  @media (max-width: 560px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const BalanceCard = styled.div`
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 90% 10%, rgba(255, 210, 63, 0.28), transparent 28%),
    linear-gradient(135deg, ${NAVY} 0%, #080866 52%, #020229 100%);
  padding: clamp(24px, 4vw, 36px);
  border-radius: 24px;
  color: #ffffff;
  box-shadow: 0 24px 54px rgba(0, 0, 128, 0.22);
  margin-bottom: 18px;
  border: 1px solid rgba(255, 255, 255, 0.12);

  @media (min-width: 1024px) {
    color: #ffffff !important;

    :where(h3, p, small, strong, span:not(.stat-label), svg) {
      color: inherit !important;
    }

    .stat-label {
      color: rgba(255, 255, 255, 0.78) !important;
    }
  }

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px),
      linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
    background-size: 58px 58px;
    mask-image: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent 82%);
    pointer-events: none;
  }

  .balance-header,
  .balance-footer {
    position: relative;
    z-index: 1;
  }

  .balance-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 14px;

    h3 {
      color: #ffffff !important;
  -webkit-text-fill-color: #ffffff !important;
  opacity: 1 !important;
  visibility: visible !important;
  position: relative;
  z-index: 5;
    }

    &::after {
      content: "Secure Wallet";
      display: inline-flex;
      align-items: center;
      min-height: 34px;
      padding: 0 12px;
      border-radius: 999px;
      color: #111827;
      background: linear-gradient(135deg, #ffd23f, ${YELLOW});
      font-size: 0.78rem;
      font-weight: 900;
      white-space: nowrap;
      box-shadow: 0 10px 22px rgba(255, 193, 7, 0.28);
    }
  }

  .balance-footer {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 24px;
    padding-top: 18px;
    border-top: 1px solid rgba(255,255,255,0.16);
  }

  .balance-stat {
    min-width: 150px;
    padding: 11px 13px;
    border-radius: 16px;
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.14);
  }

  .stat-label {
    font-size: 0.76rem;
    opacity: 0.74;
    display: block;
    margin-bottom: 4px;
  }

  .stat-value {
    font-weight: 900;
    font-size: 1rem;
  }
`;

export const BalanceAmount = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: baseline;
  gap: 10px;

  svg {
    align-self: center;
    font-size: clamp(2rem, 4vw, 3.4rem);
    color: #ffd23f;
    filter: drop-shadow(0 8px 18px rgba(255, 193, 7, 0.24));
  }

  .amount {
    font-size: clamp(2.6rem, 6vw, 4.8rem);
    line-height: 1;
    font-weight: 950;
    letter-spacing: -0.06em;
  }

  .currency {
    font-size: clamp(0.95rem, 2vw, 1.2rem);
    color: rgba(255, 255, 255, 0.72);
    font-weight: 800;
  }
`;

export const TopupSection = styled.div`
  background: #ffffff;
  padding: 22px;
  border-radius: 22px;
  border: 1px solid #e5e7eb;
  margin-bottom: 24px;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.07);

  .action-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    flex-wrap: wrap;
  }

  @media (min-width: 940px) {
    .action-section::before {
      content: "Recharge Wallet";
      display: block;
      width: 100%;
      color: #111827;
      font-size: 1.15rem;
      font-weight: 900;
      letter-spacing: -0.02em;
    }
  }
`;

export const AddBalanceBtn = styled.button`
  min-height: 46px;
  padding: 0 20px;
  background: linear-gradient(135deg, #ffd23f, ${YELLOW});
  color: #111827;
  border: none;
  border-radius: 999px;
  font-weight: 950;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 14px 28px rgba(255, 193, 7, 0.26);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 34px rgba(255, 193, 7, 0.34);
  }

  @media (max-width: 560px) {
    width: 100%;
  }
`;

export const QuickAddRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;

  .quick-label {
    font-size: 0.82rem;
    color: #64748b;
    font-weight: 800;
  }

  @media (max-width: 560px) {
    width: 100%;
    align-items: flex-start;

    .quick-label {
      width: 100%;
    }
  }
`;

export const QuickAddBtn = styled.button`
  min-height: 38px;
  padding: 0 15px;
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 128, 0.12);
  background: #f8fafc;
  color: #1f2937;
  font-size: 0.85rem;
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease, color 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(0, 0, 128, 0.32);
    background: rgba(0, 0, 128, 0.06);
    color: ${NAVY};
  }

  &.premium {
    background: rgba(255, 193, 7, 0.14);
    border-color: rgba(255, 193, 7, 0.42);
    color: #92400e;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const StatCard = styled.div`
  background: #ffffff;
  padding: 16px;
  border-radius: 18px;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 18px 36px rgba(15, 23, 42, 0.1);
  }

  .stat-icon {
    width: 42px;
    height: 42px;
    flex: 0 0 auto;
    color: #ffd23f;
    background: linear-gradient(135deg, ${NAVY}, #1515a8);
    padding: 10px;
    border-radius: 14px;
    box-shadow: 0 12px 24px rgba(0, 0, 128, 0.16);
  }

  .stat-label {
    font-size: 0.78rem;
    color: #64748b;
    font-weight: 800;
  }

  .stat-value {
    margin-top: 3px;
    color: #111827;
    font-size: 0.95rem;
    font-weight: 950;
    display: block;
    word-break: break-word;
  }
`;

export const ExpenseSection = styled.div`
  background: #ffffff;
  border-radius: 22px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.07);
`;

export const SectionTitle = styled.div`
  padding: 20px 22px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(180deg, #ffffff, #fbfdff);

  h2 {
    font-size: 16px;
    font-weight: 800;
    margin: 0;
  }

  .tab-group {
    display: inline-flex;
    gap: 5px;
    padding: 5px;
    border-radius: 999px;
    background: #f1f5f9;
    border: 1px solid #e5e7eb;
  }

  .tab {
    cursor: pointer;
    font-size: 0.88rem;
    color: #64748b;
    padding: 9px 15px;
    border-radius: 999px;
    font-weight: 850;
    transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
  }

  .tab.active {
    color: #ffffff;
    background: linear-gradient(135deg, ${NAVY}, #1010a8);
    box-shadow: 0 10px 22px rgba(0, 0, 128, 0.16);
  }

  @media (max-width: 560px) {
    padding: 16px;

    .tab-group,
    .tab {
      width: 100%;
    }

    .tab {
      text-align: center;
    }
  }
`;

export const ExpertCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 17px 22px;
  border-bottom: 1px solid #eef2f7;
  transition: background 0.2s ease;

  &:hover {
    background: #f8fafc;
  }

  @media (max-width: 700px) {
    align-items: flex-start;
    flex-direction: column;
    margin: 12px;
    padding: 16px;
    border: 1px solid #e5e7eb;
    border-radius: 18px;
    box-shadow: 0 10px 26px rgba(15, 23, 42, 0.06);
  }
`;

export const ExpertLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
`;

export const Avatar = styled.div`
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  border-radius: 15px;
  background: #edf2f7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

export const ExpertInfo = styled.div`
  min-width: 0;

  strong {
    font-size: 0.94rem;
    color: #111827;
    display: block;
    font-weight: 900;
    line-height: 1.35;
  }

  .expert-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 7px;
    font-size: 0.78rem;
    color: #64748b;
    margin-top: 6px;
  }

  .status {
    font-size: 0.68rem;
    padding: 3px 8px;
    border-radius: 999px;
    text-transform: uppercase;
    font-weight: 900;
    background: #eef2ff;
    color: #3730a3;
  }

  .status.success,
  .status.completed,
  .status.paid {
    background: #dcfce7;
    color: #166534;
  }

  .status.failed,
  .status.cancelled {
    background: #fee2e2;
    color: #991b1b;
  }

  .status.pending {
    background: #fef3c7;
    color: #92400e;
  }
`;

export const AmountBox = styled.div`
  text-align: right;
  flex: 0 0 auto;

  .amount-value {
    display: inline-flex;
    align-items: center;
    min-height: 34px;
    padding: 0 12px;
    border-radius: 999px;
    font-size: 0.95rem;
    font-weight: 950;
    background: #f8fafc;
  }

  &.credit .amount-value {
    color: #047857;
    background: #dcfce7;
  }

  &.debit .amount-value {
    color: #b91c1c;
    background: #fee2e2;
  }

  @media (max-width: 700px) {
    width: 100%;
    text-align: left;
  }
`;

export const LoadMoreBtn = styled.button`
  width: 100%;
  padding: 16px;
  border: none;
  background: #ffffff;
  color: ${NAVY};
  font-weight: 900;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(0, 0, 128, 0.06);
  }
`;

export const FilterDropdown = styled.div`
  select {
    border: 1px solid #e5e7eb;
    padding: 8px;
    border-radius: 10px;
    font-size: 12px;
  }
`;

export const TransactionBadge = styled.span`
  font-size: 10px;
  padding: 2px 6px;
  background: #edf2f7;
  border-radius: 4px;
  margin-left: 5px;
`;

export const ProgressBar = styled.div`
  height: 3px;
  background: ${(props) => props.color};
  width: ${(props) => props.width}%;
  margin-top: 5px;
`;

export const EmptyState = styled.div`
  padding: 52px 20px;
  text-align: center;
  color: #64748b;
  font-weight: 800;
`;

export const LoadingState = styled.div`
  width: min(520px, 100%);
  margin: 12vh auto;
  padding: 32px;
  border-radius: 22px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  text-align: center;
  color: ${NAVY};
  font-weight: 900;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08);
`;

export const ErrorState = styled.div`
  padding: 40px;
  text-align: center;
  color: #b91c1c;
`;
