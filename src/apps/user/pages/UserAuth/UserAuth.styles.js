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
    padding: calc(8px + env(safe-area-inset-top, 0px)) 14px calc(16px + env(safe-area-inset-bottom, 0px));
    overflow-y: auto;
    overflow-x: hidden;
    background: #ffffff;
    -webkit-overflow-scrolling: touch;

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }
  }

  @media (min-width: 1024px) {
    background:
      radial-gradient(circle at 8% 0%, rgba(0, 0, 128, 0.08), transparent 30%),
      radial-gradient(circle at 92% 8%, rgba(255, 213, 74, 0.16), transparent 28%),
      #f8fafc;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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
    margin: 0 auto;
    background: transparent;
    border: 0;
    box-shadow: none;
    backdrop-filter: none;
    padding: 8px 10px 18px;
    border-radius: 0;
  }

  @media (max-width: 480px) {
    max-width: 100%;
    padding: 6px 2px 14px;
  }

  @media (min-width: 1024px) {
    max-width: 620px;
    border-radius: 22px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    box-shadow: 0 16px 42px rgba(15, 23, 42, 0.075);
  }
`;

export const BrandMark = styled.img`
  display: block;
  width: 420px;
  height: 90px;
  object-fit: contain;
  margin: 0 auto 18px;
 

  @media (max-width: 768px) {
    width: min(245px, 72vw);
    height: 58px;
    margin: 0 auto 8px;
  }

  @media (max-width: 480px) {
    width: min(220px, 70vw);
    height: 54px;
    margin-bottom: 6px;
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

  @media (max-width: 768px) {
    margin: 0 0 6px;
    font-size: clamp(22px, 6.2vw, 26px);
    letter-spacing: -0.02em;
  }

  @media (max-width: 480px) {
    font-size: clamp(21px, 6.2vw, 24px);
  }

  @media (min-width: 1024px) {
    color: #111827;
    font-size: clamp(30px, 2.2vw, 36px);
    font-weight: 900;
    letter-spacing: -0.02em;
  }
`;

export const LoginTrustLine = styled.p`
  display: none;
  margin: 0;

  @media (max-width: 768px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    margin: -1px 0 7px;
    color: #64748b;
    font-size: clamp(12px, 3.5vw, 13.5px);
    line-height: 1.3;
    font-weight: 650;
    text-align: center;

    svg {
      width: 14px;
      height: 14px;
      flex: 0 0 auto;
      color: #000080;
    }
  }
`;

export const SubCaption = styled.p`
  font-size: 0.98rem;
  text-align: center;
  color: #51607f;
  margin: 0 auto 22px;
  line-height: 1.6;
  max-width: 380px;

  @media (max-width: 768px) {
    max-width: 310px;
    margin-bottom: 12px;
    font-size: 13px;
    line-height: 1.4;
  }

  @media (max-width: 480px) {
    font-size: 12.5px;
    margin-bottom: 10px;
  }

  @media (min-width: 1024px) {
    color: #64748b;
    font-size: 15px;
    font-weight: 650;
    line-height: 1.6;
  }
`;

export const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 26px;

  @media (max-width: 768px) {
    display: none;
    margin: 0;
  }
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

  @media (max-width: 768px) {
    margin-bottom: 14px;
    padding: 4px;
    border-radius: 13px;
    background: #f3f4f6;
  }
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

  @media (max-width: 768px) {
    min-height: 40px;
    padding: 9px 12px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 700;
    box-shadow: ${({ active }) => (active ? "0 8px 18px rgba(0, 0, 128, 0.16)" : "none")};
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 10px;
  }
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
    gap: 10px;

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

  @media (max-width: 768px) {
    min-height: 46px;
    gap: 9px;
    padding: 7px 12px 7px 10px;
    border-radius: 12px;
    border-color: #d1d5db;
    background: #f3f4f6;

    svg {
      font-size: 16px;
    }

    &:focus-within {
      background: #ffffff;
      border-color: rgba(37, 99, 235, 0.5);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }
  }

  @media (max-width: 480px) {
    min-height: 45px;
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

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 1.35;
    font-weight: 500;

    &::placeholder {
      color: #8b95a5;
      font-weight: 400;
    }
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

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    background: transparent;
    border: 0;
  }
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

  @media (max-width: 768px) {
    min-width: 34px;
    height: 34px;
    padding: 0;
    border-radius: 999px;
  }
`;

export const UtilityRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: -2px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    margin-top: -1px;
    gap: 8px;
  }
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

  @media (max-width: 768px) {
    gap: 8px;
    font-size: 13px;
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

  @media (max-width: 768px) {
    font-size: 13px;
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

  @media (max-width: 768px) {
    margin: 0 0 8px;
    padding: 9px 11px;
    border-radius: 12px;
    font-size: 12.5px;
    line-height: 1.35;
  }
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
    min-height: 44px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 750;
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

  @media (max-width: 768px) {
    width: 100%;
    min-height: 46px;
    margin-top: 2px;
    padding: 0 16px;
    border-radius: 12px;
    background: linear-gradient(135deg, #000080 0%, #2563eb 100%);
    font-size: 14px;
    font-weight: 800;
    box-shadow: 0 10px 22px rgba(37, 99, 235, 0.2);
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

  @media (max-width: 768px) {
    margin-top: 4px;
    font-size: 13px;
    line-height: 1.45;
  }
`;

export const BottomTrustText = styled.p`
  margin: 18px 0 0;
  text-align: center;
  color: #667085;
  font-size: 0.86rem;
  font-weight: 700;
  letter-spacing: 0.02em;

  @media (max-width: 768px) {
    margin-top: 10px;
    font-size: 11.5px;
    color: #94a3b8;
    font-weight: 650;
  }
`;
