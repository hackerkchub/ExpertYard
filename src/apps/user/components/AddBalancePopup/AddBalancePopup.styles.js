import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.96) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999999;
  padding: 16px;
  box-sizing: border-box;

  @media (max-width: 640px) {
    align-items: flex-end;
    padding: 0;
  }
`;

export const PopupBox = styled.div`
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25);
  padding: 24px 28px;
  box-sizing: border-box;
  animation: ${fadeIn} 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  max-height: calc(100vh - 32px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 640px) {
    max-width: 100%;
    border-radius: 24px 24px 0 0;
    padding: 20px 20px calc(24px + env(safe-area-inset-bottom, 0px));
    max-height: 90dvh;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 14px;
`;

export const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const IconBadge = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const Title = styled.h3`
  margin: 0;
  color: #0f172a;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1.3;
`;

export const Subtitle = styled.p`
  margin: 2px 0 0 0;
  color: #64748b;
  font-size: 12.5px;
  font-weight: 500;
  line-height: 1.4;
`;

export const CloseButton = styled.button`
  background: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s ease;

  &:hover {
    background: #e2e8f0;
    color: #0f172a;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const InputLabel = styled.label`
  font-size: 12.5px;
  font-weight: 700;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.03em;
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1.5px solid #cbd5e1;
  border-radius: 14px;
  padding: 8px 16px;
  transition: all 0.2s ease;

  &:focus-within {
    background: #ffffff;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }
`;

export const CurrencySymbol = styled.span`
  font-size: 1.3rem;
  font-weight: 800;
  color: #2563eb;
  margin-right: 8px;
  user-select: none;
`;

export const AmountInput = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 1.4rem;
  font-weight: 800;
  color: #0f172a;
  font-family: inherit;

  &::placeholder {
    color: #94a3b8;
    font-weight: 600;
  }

  /* Hide spinner buttons */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type=number] {
    -moz-appearance: textfield;
  }
`;

export const QuickAddSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const QuickAddLabel = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const PresetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;

  @media (max-width: 400px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const PresetChip = styled.button`
  background: ${(p) => (p.$active ? "#2563eb" : "#f1f5f9")};
  color: ${(p) => (p.$active ? "#ffffff" : "#334155")};
  border: 1px solid ${(p) => (p.$active ? "#2563eb" : "#e2e8f0")};
  border-radius: 12px;
  padding: 8px 12px;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: ${(p) => (p.$active ? "0 4px 12px rgba(37, 99, 235, 0.25)" : "none")};

  &:hover {
    background: ${(p) => (p.$active ? "#1d4ed8" : "#e2e8f0")};
    color: ${(p) => (p.$active ? "#ffffff" : "#0f172a")};
  }
`;

export const BillingBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const BillingHeader = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 2px;
`;

export const BillingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13.5px;
  color: #475569;

  strong {
    color: #0f172a;
    font-weight: 600;
  }
`;

export const Divider = styled.div`
  height: 1px;
  border-top: 1px dashed #cbd5e1;
  margin: 4px 0;
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;

  span {
    color: #0f172a;
    font-weight: 800;
  }

  strong {
    color: #059669;
    font-size: 1.3rem;
    font-weight: 900;
  }
`;

export const PayButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  border: none;
  border-radius: 14px;
  padding: 14px 20px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.28);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #1d4ed8, #1e40af);
    box-shadow: 0 10px 24px rgba(37, 99, 235, 0.38);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    box-shadow: none;
    background: #94a3b8;
  }
`;

export const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 12px;
  color: #64748b;
  font-weight: 600;

  svg {
    color: #059669;
  }
`;
