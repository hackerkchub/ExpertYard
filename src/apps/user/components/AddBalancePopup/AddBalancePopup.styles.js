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
`;

export const PresetText = styled.div`
  text-align: center;
  color: #ffffff;
  font-size: 18px;
  margin-bottom: 16px;
  font-weight: 500;
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
`;
