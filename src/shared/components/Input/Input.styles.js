import styled from "styled-components";

export const InputField = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;
