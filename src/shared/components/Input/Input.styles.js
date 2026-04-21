import styled from "styled-components";

export const InputField = styled.input`
  width: 100%;
  min-height: 48px;
  padding: 12px 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  outline: none;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 4px rgba(63, 81, 181, 0.12);
    background: ${({ theme }) => theme.colors.white};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.borderStrong};
  }
`;
