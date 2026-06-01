import styled from "styled-components";

export const PageWrap = styled.div`
  position: relative;
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(255, 198, 39, 0.26), transparent 32%),
    radial-gradient(circle at top right, rgba(0, 0, 128, 0.12), transparent 28%),
    linear-gradient(180deg, #f6f8fc 0%, #edf3fb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 18px;
  font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  overflow-x: hidden;

  @media (max-width: 768px) {
    min-height: 100dvh;
    width: 100%;
    align-items: stretch;
    justify-content: flex-start;
    padding: 20px 16px calc(24px + env(safe-area-inset-bottom, 0px));
    overflow-y: auto;
    overflow-x: hidden;
  }
`;

export const AuthBackWrap = styled.div`
  position: fixed;
  top: 18px;
  left: 18px;
  z-index: 5;

  @media (max-width: 480px) {
    top: 12px;
    left: 12px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Card = styled.div`
  width: 100%;
  max-width: 580px;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 28px;
  padding: 42px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    max-width: 440px;
    margin: auto;
    background: transparent;
    border: 0;
    box-shadow: none;
    backdrop-filter: none;
    padding: 34px 24px 28px;
    border-radius: 0;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    padding: 28px 18px 24px;
  }
`;

export const BrandMark = styled.img`
  display: block;
  width: 420px;
  height: 90px;
  object-fit: contain;
  margin: 0 auto 18px;
 

  @media (max-width: 480px) {
    width: min(300px, 82vw);
    height: 80px;
    margin-bottom: 14px;
  }
`;

export const Caption = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  text-align: center;
  color: #081a51;
  margin-bottom: 10px;
  letter-spacing: -0.03em;
  line-height: 1.1;

  @media (max-width: 480px) {
    font-size: 1.7rem;
  }
`;

export const SubCaption = styled.p`
  font-size: 0.98rem;
  text-align: center;
  color: #51607f;
  margin: 0 auto 22px;
  line-height: 1.6;
  max-width: 380px;

  @media (max-width: 480px) {
    font-size: 0.93rem;
    margin-bottom: 18px;
  }
`;

export const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 26px;
`;

export const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 8px 14px;
  border-radius: 999px;
  background: #f8fbff;
  border: 1px solid rgba(0, 0, 128, 0.08);
  color: #22304d;
  font-size: 0.84rem;
  font-weight: 700;
  white-space: nowrap;

  span:first-child {
    color: #f4b400;
    font-size: 0.95rem;
  }
`;

export const Tabs = styled.div`
  display: flex;
  background: #eef3fb;
  border-radius: 18px;
  padding: 5px;
  margin-bottom: 22px;
  border: 1px solid rgba(0, 0, 128, 0.08);
`;

export const Tab = styled.div`
  flex: 1;
  text-align: center;
  padding: 12px 16px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 700;
  border-radius: 14px;
  transition: all 0.2s ease;

  background: ${({ active }) => (active ? "#000080" : "transparent")};
  color: ${({ active }) => (active ? "#ffffff" : "#5a6786")};
  box-shadow: ${({ active }) => (active ? "0 10px 22px rgba(0, 0, 128, 0.22)" : "none")};

  &:hover {
    color: ${({ active }) => (active ? "#ffffff" : "#081a51")};
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
  align-items: stretch;

  & > div {
    flex: 1 1 calc(50% - 8px);
    min-width: 200px;
  }

  @media (max-width: 640px) {
    flex-direction: column;
    & > div {
      flex: 1 1 100%;
      min-width: 100%;
    }
  }
`;

export const InputWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 58px;
  padding: 10px 16px 10px 12px;
  border-radius: 18px;
  border: 1px solid #d8e1f0;
  background: #ffffff;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;

  svg {
    color: #000080;
    font-size: 18px;
    flex-shrink: 0;
  }

  &:focus-within {
    border-color: rgba(0, 0, 128, 0.35);
    box-shadow: 0 0 0 4px rgba(0, 0, 128, 0.08);
  }

  @media (max-width: 480px) {
    min-height: 56px;
    border-radius: 16px;
  }
`;

export const Input = styled.input`
  border: none;
  outline: none;
  flex: 1;
  font-size: 16px;
  color: #101828;
  background: transparent;
  min-width: 0;
  width: 100%;

  &::placeholder {
    color: #7d89a6;
  }
`;

export const InputIconCircle = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #fff7d7 0%, #ffeaa0 100%);
  border: 1px solid rgba(244, 180, 0, 0.25);
  flex-shrink: 0;
`;

export const PasswordToggle = styled.button`
  border: none;
  background: transparent;
  color: #667085;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
`;

export const UtilityRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: -2px;
  flex-wrap: wrap;
`;

export const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: #475467;
  font-size: 0.92rem;
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
    accent-color: #000080;
    cursor: pointer;
  }
`;

export const TextLink = styled.span`
  color: #000080;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const MessageBar = styled.div`
  margin: 8px 0 4px;
  padding: 12px 14px;
  background: ${({ $isError }) =>
    $isError ? "rgba(239, 68, 68, 0.08)" : "rgba(34, 197, 94, 0.09)"};
  border: 1px solid
    ${({ $isError }) =>
      $isError ? "rgba(239, 68, 68, 0.24)" : "rgba(34, 197, 94, 0.22)"};
  color: ${({ $isError }) => ($isError ? "#dc2626" : "#15803d")};
  border-radius: 16px;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
`;

export const VerifyBtn = styled.button`
  padding: 0 20px;
  min-height: 58px;
  border-radius: 18px;
  border: 1px solid #000080;
  background: #ffffff;
  color: #000080;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  white-space: nowrap;

  &:hover {
    background-color: rgba(0, 0, 128, 0.05);
  }

  @media (max-width: 640px) {
    width: 100%;
    min-height: 52px;
  }
`;

export const PrimaryBtn = styled.button`
  margin-top: 4px;
  padding: 16px 24px;
  min-height: 58px;
  border-radius: 18px;
  border: none;
  background: linear-gradient(135deg, #000080 0%, #092293 100%);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 18px 30px rgba(0, 0, 128, 0.22);

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.72;
    transform: none;
  }

  @media (max-width: 480px) {
    padding: 15px 18px;
  }
`;

export const SwitchText = styled.div`
  text-align: center;
  font-size: 0.94rem;
  margin-top: 8px;
  color: #667085;
  line-height: 1.6;

  span {
    color: #000080;
    font-weight: 700;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const BottomTrustText = styled.p`
  margin: 18px 0 0;
  text-align: center;
  color: #667085;
  font-size: 0.86rem;
  font-weight: 700;
  letter-spacing: 0.02em;
`;
