import styled from "styled-components";

export const StyledButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ textColor }) => textColor || "#fff"};
  min-height: 46px;
  padding: 11px 18px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.2;
  letter-spacing: 0.01em;
  position: relative;
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
  box-shadow: ${({ theme }) => theme.shadow.xs};

  &:hover {
    opacity: ${({ disabled }) => (disabled ? 0.7 : 0.92)};
    transform: ${({ disabled }) => (disabled ? "none" : "translateY(-1px)")};
    box-shadow: ${({ disabled, theme }) =>
      disabled ? theme.shadow.xs : theme.shadow.sm};
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: ${({ theme }) => theme.screens.sm}) {
    min-height: 44px;
    padding: 10px 16px;
  }
`;

export const ButtonContent = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
`;

export const ButtonSpinner = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.28);
  border-top-color: currentColor;
  animation: button-spin 0.7s linear infinite;
  position: ${({ $overlay }) => ($overlay ? "absolute" : "static")};

  @keyframes button-spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
