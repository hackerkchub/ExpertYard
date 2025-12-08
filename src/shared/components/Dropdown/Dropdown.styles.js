// shared/components/Dropdown/Dropdown.styles.js
import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  width: ${({ width }) => width || "100%"};
`;

export const Trigger = styled.button`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const Menu = styled.ul`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.md};
  width: 100%;
  list-style: none;
  padding: 6px 0;
  z-index: 1000;
  animation: fadeIn 0.2s ease;

  max-height: 260px;
  overflow-y: auto;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0px);
    }
  }
`;

export const MenuItem = styled.li`
  padding: 10px 12px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
  }
`;
