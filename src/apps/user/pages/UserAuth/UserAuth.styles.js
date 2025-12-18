import styled from "styled-components";

/* ================= PAGE ================= */

export const PageWrap = styled.div`
  min-height: 100vh;
  background:
    radial-gradient(circle at top, #ffffff 0%, #e9f0f8 40%, #dde7f3 100%),
    linear-gradient(120deg, #eef3f9, #f8fbff);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 24px;

  &:before {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(31,60,136,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(31,60,136,0.04) 1px, transparent 1px);
    background-size: 80px 80px;
    pointer-events: none;
  }
`;

/* ================= CARD ================= */

export const Card = styled.div`
  width: 520px;   /* ⬅ increased */
  background: linear-gradient(180deg, #ffffff, #f6f9fe);
  border-radius: 18px;
  padding: 36px;

  @media (max-width: 1024px) {
    width: 480px;
  }

  @media (max-width: 768px) {
    width: 100%;
    max-width: 400px;
    padding: 26px;
  }
`;
/* ================= LOGO ================= */

export const Caption = styled.div`
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  color: #1f3c88;
  margin-bottom: 6px;
`;

export const SubCaption = styled.div`
  font-size: 14px;
  text-align: center;
  color: #6b7a99;
  margin-bottom: 26px;
`;

/* ================= TABS ================= */

export const Tabs = styled.div`
  display: flex;
  background: #eef3fb;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 26px;
`;

export const Tab = styled.div`
  flex: 1;
  text-align: center;
  padding: 11px;
  cursor: pointer;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.35s ease;

  background: ${({ active }) =>
    active
      ? "linear-gradient(135deg, #1f3c88, #3b82f6)"
      : "transparent"};

  color: ${({ active }) => (active ? "#fff" : "#5b6b86")};

  box-shadow: ${({ active }) =>
    active ? "0 8px 18px rgba(31,60,136,0.35)" : "none"};

  @media (max-width: 768px) {
    padding: 10px;
    font-size: 14px;
  }
`;

/* ================= FORM ================= */

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InputGroup = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
  }
`;


export const Input = styled.input`
  border: none;
  outline: none;
  flex: 1;
  font-size: 14px;
  background: transparent;
`;


/* ================= BUTTONS ================= */

export const VerifyBtn = styled.button`
  padding: 0 18px;
  border-radius: 12px;
  border: none;
  background: #eef3fb;
  color: #1f3c88;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background: linear-gradient(135deg, #1f3c88, #3b82f6);
    color: #fff;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 12px;
  }
`;

export const PrimaryBtn = styled.button`
  margin-top: 8px;
  padding: 15px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #1f3c88, #2563eb);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.35s;
  box-shadow: 0 14px 28px rgba(31,60,136,0.45);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 18px 36px rgba(31,60,136,0.55);
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 14px;
  }
`;

/* ================= SWITCH TEXT ================= */

export const SwitchText = styled.div`
  text-align: center;
  font-size: 13px;
  margin-top: 12px;
  color: #6b7a99;

  span {
    color: #1f3c88;
    font-weight: 600;
    cursor: pointer;
  }

  @media (max-width: 480px) {
    font-size: 12px;
  }
`;
export const InputWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #d7e0ee;
  background: #fff;

  svg {
    color: #6b7a99;
    font-size: 18px;
  }

  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
  }
`;
