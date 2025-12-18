import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,.5);
  z-index: 999;
`;

export const ModalBody = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 24px;
  width: 90%;
  max-width: 480px;
  border-radius: ${({ theme }) => theme.radius.md};
`;
