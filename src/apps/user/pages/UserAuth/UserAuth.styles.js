import styled from "styled-components";

/* ================= PAGE WRAP ================= */
export const PageWrap = styled.div`
  min-height: 100vh;
  background-color: #f4f2ee; /* Exact LinkedIn Light Background */
  background-image: 
    radial-gradient(at 0% 0%, rgba(10, 102, 194, 0.03) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(10, 102, 194, 0.03) 0px, transparent 50%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

/* ================= CARD ================= */
export const Card = styled.div`
  width: 100%;
  max-width: 560px;
  background: #ffffff;
  border-radius: 12px; /* Professional curvature */
  padding: 44px;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 32px 24px;
    max-width: 500px;
  }

  @media (max-width: 480px) {
    padding: 24px 16px;
    border-radius: 10px;
  }
`;

/* ================= TEXT / LABELS ================= */
export const Caption = styled.h1`
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  color: rgba(0, 0, 0, 0.9);
  margin-bottom: 8px;
  letter-spacing: -0.01em;

  @media (max-width: 480px) {
    font-size: 22px;
  }
`;

export const SubCaption = styled.p`
  font-size: 14px;
  text-align: center;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 32px;
  line-height: 1.5;

  @media (max-width: 480px) {
    margin-bottom: 24px;
  }
`;

/* ================= TABS ================= */
export const Tabs = styled.div`
  display: flex;
  background: #f4f2ee;
  border-radius: 24px;
  padding: 4px;
  margin-bottom: 32px;
  border: 1px solid #e0e0e0;
`;

export const Tab = styled.div`
  flex: 1;
  text-align: center;
  padding: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  border-radius: 20px;
  transition: all 0.2s ease;

  background: ${({ active }) => (active ? "#ffffff" : "transparent")};
  color: ${({ active }) => (active ? "rgba(0, 0, 0, 0.9)" : "rgba(0, 0, 0, 0.6)")};
  box-shadow: ${({ active }) => (active ? "0 2px 4px rgba(0, 0, 0, 0.08)" : "none")};

  &:hover {
    color: rgba(0, 0, 0, 0.9);
  }
`;

/* ================= FORM ================= */
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

/* Responsive Flex Grid: No Overflows! */
export const InputGroup = styled.div`
  display: flex;
  flex-wrap: wrap; 
  gap: 16px;
  width: 100%;

  & > div {
    flex: 1 1 calc(50% - 8px); 
    min-width: 200px; 
  }

  @media (max-width: 480px) {
    flex-direction: column;
    & > div {
      flex: 1 1 100%;
    }
  }
`;

export const InputWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.6); /* Standard professional border */
  background: #ffffff;
  transition: all 0.2s ease;
  width: 100%;

  svg {
    color: rgba(0, 0, 0, 0.6);
    font-size: 18px;
    flex-shrink: 0;
  }

  &:focus-within {
    border-width: 2px;
    border-color: #000080; /* LinkedIn Blue on focus */
    padding: 13px 15px; /* Offset to prevent input jumping */
    box-shadow: 0 0 0 1px #000080;
  }
`;

export const Input = styled.input`
  border: none;
  outline: none;
  flex: 1;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.9);
  background: transparent;
  min-width: 0;

  &::placeholder {
    color: rgba(0, 0, 0, 0.6);
  }
`;

/* ================= BUTTONS (LinkedIn Blue Styling) ================= */
export const VerifyBtn = styled.button`
  padding: 0 24px;
  height: 48px;
  border-radius: 24px;
  border: 1px solid #000080; /* LinkedIn Outline Blue */
  background: #ffffff;
  color: #000080;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background-color: rgba(10, 102, 194, 0.06);
    border-width: 2px;
    padding: 0 23px;
  }

  @media (max-width: 480px) {
    width: 100%;
    height: 48px;
  }
`;

export const PrimaryBtn = styled.button`
  margin-top: 12px;
  padding: 14px 24px;
  height: 52px;
  border-radius: 28px;
  border: none;
  background-color: #000080; /* Exact LinkedIn Button Blue */
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #004182; /* Rich dark blue LinkedIn hover state */
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 480px) {
    font-size: 15px;
    padding: 14px;
  }
`;

/* ================= SWITCH TEXT ================= */
export const SwitchText = styled.div`
  text-align: center;
  font-size: 14px;
  margin-top: 20px;
  color: rgba(0, 0, 0, 0.6);

  span {
    color: #000080;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
      color: #004182;
    }
  }
`;