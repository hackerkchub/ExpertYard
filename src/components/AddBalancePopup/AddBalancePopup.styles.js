import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

export const PopupBox = styled.div`
  width: 360px;
  padding: 24px;
  background: rgba(255,255,255,0.09);
  border-radius: 16px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.2);
  box-shadow: 0 0 22px rgba(0,200,255,0.25);

  h2 {
    text-align: center;
    margin-bottom: 16px;
    color: #9aefff;
    letter-spacing: 0.5px;
  }
`;

export const InputField = styled.input`
  width: 100%;
  padding: 12px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 10px;
  color: white;
  font-size: 16px;
  margin-bottom: 18px;
`;

export const PresetText = styled.div`
  text-align: center;
  color: #d4f9ff;
  font-size: 18px;
  margin-bottom: 16px;
`;

export const BillingBox = styled.div`
  background: rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 16px;
  backdrop-filter: blur(12px);

  div {
    display: flex;
    justify-content: space-between;
    margin: 6px 0;
  }

  hr {
    border: none;
    border-bottom: 1px solid rgba(255,255,255,0.15);
    margin: 10px 0;
  }

  .total strong {
    color: #7befd8;
    font-size: 17px;
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

  &:hover {
    transform: ${(p) => (p.disabled ? "none" : "translateY(-2px)")};
  }
`;

export const CloseBtn = styled.div`
  text-align: center;
  margin-top: 12px;
  opacity: 0.7;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;
