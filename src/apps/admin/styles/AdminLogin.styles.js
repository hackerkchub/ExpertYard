import styled, { keyframes } from "styled-components";

/* Animations */
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(14, 165, 255, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(14, 165, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(14, 165, 255, 0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

/* Main Container */
export const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #0f172a 0%, #1e293b 100%);
  padding: 16px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 20% 30%, rgba(14, 165, 255, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.08) 0%, transparent 50%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.5;
    pointer-events: none;
  }
`;

export const LoginCard = styled.div`
  width: 100%;
  max-width: 460px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 32px;
  padding: 48px 40px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) {
    padding: 40px 24px;
  }

  @media (max-width: 360px) {
    padding: 32px 20px;
  }
`;

/* Logo Section */
export const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 40px;

  @media (max-width: 480px) {
    margin-bottom: 32px;
  }
`;

export const LogoIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #0ea5ff, #3b82f6);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 15px 30px -8px rgba(14, 165, 255, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transform: rotate(45deg);
    animation: ${shimmer} 3s infinite;
  }

  svg {
    width: 40px;
    height: 40px;
    color: white;
    position: relative;
    z-index: 1;
  }
`;

export const LogoText = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.5px;

  @media (max-width: 480px) {
    font-size: 24px;
  }

  span {
    background: linear-gradient(135deg, #0ea5ff, #3b82f6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

export const Subtitle = styled.p`
  font-size: 15px;
  color: #64748b;
  margin-top: 8px;
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

/* Form */
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 480px) {
    gap: 20px;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    color: #0ea5ff;
  }
`;

export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s ease;

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 15px;
  color: #0f172a;
  background: #ffffff;
  transition: all 0.3s ease;

  @media (max-width: 480px) {
    padding: 14px 14px 14px 46px;
    font-size: 14px;
  }

  &:focus {
    outline: none;
    border-color: #0ea5ff;
    box-shadow: 0 0 0 4px rgba(14, 165, 255, 0.1);
  }

  &:focus + ${InputIcon} {
    color: #0ea5ff;
  }

  &::placeholder {
    color: #94a3b8;
  }

  &:disabled {
    background: #f8fafc;
    cursor: not-allowed;
  }
`;

export const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: color 0.3s ease;

  &:hover {
    color: #0ea5ff;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

/* Options Row */
export const OptionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

export const Checkbox = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #64748b;
  user-select: none;

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #0ea5ff;
  }
`;

export const ForgotPassword = styled.button`
  background: none;
  border: none;
  color: #0ea5ff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;

  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

/* Button */
export const LoginButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #0ea5ff, #3b82f6);
  border: none;
  border-radius: 16px;
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  margin-top: 8px;

  @media (max-width: 480px) {
    padding: 14px;
    font-size: 15px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(14, 165, 255, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

/* Loading Spinner */
export const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

/* Error Message */
export const ErrorMessage = styled.div`
  background: #fee2e2;
  border: 1px solid #ef4444;
  color: #b91c1c;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  animation: ${slideIn} 0.3s ease;

  svg {
    color: #ef4444;
    flex-shrink: 0;
  }
`;

/* Footer */
export const Footer = styled.div`
  text-align: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;

  @media (max-width: 480px) {
    margin-top: 28px;
    padding-top: 20px;
  }
`;

export const FooterText = styled.p`
  font-size: 13px;
  color: #94a3b8;

  span {
    color: #0ea5ff;
    font-weight: 600;
  }
`;

/* Security Badge */
export const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 30px;
  font-size: 13px;
  color: #64748b;

  svg {
    color: #10b981;
  }
`;