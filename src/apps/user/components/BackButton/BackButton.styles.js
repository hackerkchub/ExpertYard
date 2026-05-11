import styled from "styled-components";

const NAVY = "#000080";
const YELLOW = "#FFC107";

export const BackButtonRoot = styled.button`
  --back-button-size: ${({ $iconOnly }) => ($iconOnly ? "42px" : "auto")};

  min-width: var(--back-button-size);
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: ${({ $iconOnly }) => ($iconOnly ? "0" : "0 14px 0 12px")};
  border: 1px solid rgba(0, 0, 128, 0.14);
  border-radius: ${({ $iconOnly }) => ($iconOnly ? "15px" : "999px")};
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 255, 0.86));
  color: ${NAVY};
  box-shadow:
    0 12px 24px rgba(0, 0, 128, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.92);
  font-size: 13px;
  font-weight: 850;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease,
    color 0.2s ease;
  -webkit-tap-highlight-color: transparent;

  svg {
    width: 18px;
    height: 18px;
    flex: 0 0 auto;
    color: currentColor;
  }

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(255, 193, 7, 0.68);
    background:
      radial-gradient(circle at 20% 10%, rgba(255, 193, 7, 0.28), transparent 40%),
      linear-gradient(180deg, #ffffff, #f8faff);
    box-shadow:
      0 16px 30px rgba(0, 0, 128, 0.12),
      0 0 0 4px rgba(255, 193, 7, 0.1);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 3px solid rgba(255, 193, 7, 0.42);
    outline-offset: 2px;
  }

  @media (max-width: 768px) {
    min-width: 38px;
    height: 38px;
    border-radius: ${({ $iconOnly }) => ($iconOnly ? "13px" : "999px")};
    padding: ${({ $iconOnly }) => ($iconOnly ? "0" : "0 11px 0 10px")};
    font-size: 12px;

    svg {
      width: 17px;
      height: 17px;
    }
  }

  @media (max-width: 420px) {
    .back-button__label {
      display: none;
    }

    padding: 0;
    min-width: 38px;
    border-radius: 13px;
  }
`;
