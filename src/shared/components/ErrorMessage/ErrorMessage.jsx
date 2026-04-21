import React, { useEffect, useMemo, useState } from "react";
import styled, { css, keyframes } from "styled-components";

const fadeSlide = keyframes`
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const toneStyles = {
  error: css`
    background: linear-gradient(180deg, #fff1f2 0%, #ffe4e6 100%);
    border-color: #fda4af;
    color: #9f1239;
  `,
  success: css`
    background: linear-gradient(180deg, #ecfdf5 0%, #dcfce7 100%);
    border-color: #86efac;
    color: #166534;
  `,
  warning: css`
    background: linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%);
    border-color: #fcd34d;
    color: #92400e;
  `,
  info: css`
    background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%);
    border-color: #93c5fd;
    color: #1d4ed8;
  `,
};

const Alert = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 12px 14px;
  border: 1px solid;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
  animation: ${fadeSlide} 0.25s ease;

  ${({ $tone }) => toneStyles[$tone] || toneStyles.error}

  @media (max-width: 480px) {
    padding: 11px 12px;
    border-radius: 10px;
  }
`;

const Message = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.55;
  min-width: 0;
`;

const Dismiss = styled.button`
  background: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
  padding: 2px;
  flex-shrink: 0;
  opacity: 0.82;

  &:hover {
    opacity: 1;
  }
`;

export default function ErrorMessage({
  message,
  autoHideDuration = 5000,
  dismissible = true,
  tone = "error",
}) {
  const normalizedMessage = useMemo(() => {
    if (typeof message === "string") return message;
    return message ? String(message) : "";
  }, [message]);

  const [visible, setVisible] = useState(Boolean(normalizedMessage));

  useEffect(() => {
    setVisible(Boolean(normalizedMessage));
  }, [normalizedMessage]);

  useEffect(() => {
    if (!normalizedMessage || !autoHideDuration) return undefined;

    const timer = setTimeout(() => {
      setVisible(false);
    }, autoHideDuration);

    return () => clearTimeout(timer);
  }, [normalizedMessage, autoHideDuration]);

  if (!normalizedMessage || !visible) return null;

  return (
    <Alert $tone={tone} role="alert" aria-live="polite">
      <Message>{normalizedMessage}</Message>
      {dismissible ? <Dismiss onClick={() => setVisible(false)}>×</Dismiss> : null}
    </Alert>
  );
}
