import styled from "styled-components";

export const StyledButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ textColor }) => textColor || "#fff"};
  padding: 10px 18px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: none;
  cursor: pointer;
  transition: 0.3s ease;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: ${({ theme }) => theme.screens.sm}) {
    padding: 8px 14px;
  }
`;
