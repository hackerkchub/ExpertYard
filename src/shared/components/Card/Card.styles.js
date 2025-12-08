import styled from "styled-components";

export const CardBox = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.md};

  @media (max-width: ${({ theme }) => theme.screens.sm}) {
    padding: 12px;
  }
`;
