import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(20, 24, 40, 0.55);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;

  @media (max-width: 768px) {
    align-items: flex-end;
    justify-content: center;
    z-index: 20060;
    background: rgba(15, 23, 42, 0.62);
    padding: 0;
  }
`;

export const PopupBox = styled.div`
  width: 360px;
  padding: 24px;
  background: rgba(28, 32, 57, 0.45);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 28px rgba(0, 200, 255, 0.28);

  h2 {
    text-align: center;
    margin-bottom: 16px;
    color: #ffffff;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-shadow: 0 0 6px rgba(0, 255, 255, 0.6);
  }

  @media (max-width: 768px) {
    position: relative;
    width: 100%;
    max-width: 100%;
    max-height: 86dvh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding: 24px 16px calc(18px + env(safe-area-inset-bottom, 0px));
    border-radius: 26px 26px 0 0;
    background: #ffffff;
    border: 1px solid rgba(15, 23, 42, 0.08);
    box-shadow: 0 -18px 44px rgba(15, 23, 42, 0.26);
    backdrop-filter: blur(16px);

    &::before {
      content: "";
      position: absolute;
      top: 9px;
      left: 50%;
      width: 44px;
      height: 4px;
      border-radius: 999px;
      background: #cbd5e1;
      transform: translateX(-50%);
    }

    h2 {
      margin: 2px 0 14px;
      color: #000080;
      font-size: 20px;
      line-height: 1.25;
      font-weight: 800;
      letter-spacing: 0;
      text-shadow: none;
    }
  }
`;

export const InputField = styled.input`
  width: 100%;
  padding: 12px;
  background: rgba(89, 105, 137, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  color: #e6faff;
  font-size: 16px;
  margin-bottom: 18px;

  &::placeholder {
    color: rgba(230, 250, 255, 0.45);
  }

  @media (max-width: 768px) {
    min-height: 46px;
    margin-bottom: 12px;
    background: #f8fafc;
    border: 1px solid rgba(15, 23, 42, 0.1);
    color: #111827;
    border-radius: 14px;

    &::placeholder {
      color: #94a3b8;
    }
  }
`;

export const PresetText = styled.div`
  text-align: center;
  color: #ffffff;
  font-size: 18px;
  margin-bottom: 16px;
  font-weight: 500;

  @media (max-width: 768px) {
    margin-bottom: 12px;
    color: #111827;
    font-size: 16px;
  }
`;

export const BillingBox = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 16px;
  backdrop-filter: blur(12px);

  div {
    display: flex;
    justify-content: space-between;
    margin: 6px 0;
    color: #e6faff;
  }

  hr {
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.18);
    margin: 10px 0;
  }

  .total strong {
    color: #00f0ff;
    font-size: 17px;
    text-shadow: 0 0 5px rgba(0, 240, 255, 0.6);
  }

  @media (max-width: 768px) {
    margin-bottom: 12px;
    padding: 12px;
    background: #f8fafc;
    border: 1px solid rgba(15, 23, 42, 0.08);

    div {
      color: #334155;
      font-size: 13px;
    }

    .total strong {
      color: #000080;
      text-shadow: none;
    }
  }
`;

export const PayButton = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #00d0ff, #0096ff);
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  opacity: ${(p) => (p.disabled ? "0.4" : "1")};
  transition: 0.2s;
  font-size: 16px;
  box-shadow: 0 4px 16px rgba(0, 200, 255, 0.2);

  &:hover {
    transform: ${(p) => (p.disabled ? "none" : "translateY(-2px)")};
    box-shadow: ${(p) =>
      p.disabled
        ? "none"
        : "0 6px 22px rgba(0, 200, 255, 0.35)"};
  }

  @media (max-width: 768px) {
    min-height: 46px;
    border-radius: 999px;
    background: linear-gradient(135deg, #000080, #2563eb);
    box-shadow: 0 12px 24px rgba(0, 0, 128, 0.18);
    font-size: 14px;
  }
`;

export const CloseBtn = styled.div`
  text-align: center;
  margin-top: 12px;
  color: rgba(255, 255, 255, 0.65);
  cursor: pointer;
  font-size: 14px;

  &:hover {
    color: #ffffff;
  }

  @media (max-width: 768px) {
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
    color: #64748b;
    font-weight: 700;

    &:hover {
      color: #000080;
    }
  }
`;
