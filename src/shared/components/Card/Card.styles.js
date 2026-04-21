import styled from "styled-components";

export const CardBox = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow.sm};

  @media (max-width: ${({ theme }) => theme.screens.sm}) {
    padding: 16px;
  }
`;
