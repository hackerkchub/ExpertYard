import styled, { css, keyframes } from "styled-components";

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const LoaderWrap = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #334155;

  ${({ $variant }) =>
    $variant === "page" &&
    css`
      width: 100%;
      min-height: min(50vh, 360px);
      flex-direction: column;
      padding: 32px 20px;
      text-align: center;
    `}

  ${({ $variant }) =>
    $variant === "overlay" &&
    css`
      position: absolute;
      inset: 0;
      z-index: 10;
      background: rgba(255, 255, 255, 0.72);
      backdrop-filter: blur(4px);
    `}
`;

export const Spinner = styled.span`
  width: ${({ $size }) => ($size === "sm" ? "16px" : $size === "lg" ? "32px" : "22px")};
  height: ${({ $size }) => ($size === "sm" ? "16px" : $size === "lg" ? "32px" : "22px")};
  border-radius: 999px;
  border: 2.5px solid rgba(37, 99, 235, 0.18);
  border-top-color: #1d4ed8;
  animation: ${spin} 0.75s linear infinite;
  flex-shrink: 0;
`;

export const LoaderText = styled.span`
  font-size: ${({ $size }) => ($size === "sm" ? "13px" : "14px")};
  font-weight: 600;
  color: #475569;
`;
