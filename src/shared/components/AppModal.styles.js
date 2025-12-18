// src/shared/components/AppModal.styles.js
import styled from "styled-components";

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15,23,42,0.48);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

export const ModalShell = styled.div`
  width: 100%;
  max-width: 460px;
  background: linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.75));
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border-radius: 24px;
  padding: 22px 22px 20px;
  box-shadow:
    0 30px 60px rgba(15,23,42,0.35),
    0 0 0 1px rgba(255,255,255,0.8);
  border: 1px solid rgba(148,163,184,0.32);
`;

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #020617;
`;

export const CloseIconBtn = styled.button`
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: rgba(15,23,42,0.04);
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  color: #64748b;

  &:hover {
    background: rgba(15,23,42,0.08);
  }
`;

export const ModalBody = styled.div`
  margin-top: 18px;
`;

export const ModalFooter = styled.div`
  margin-top: 18px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  button {
    border-radius: 999px;
    padding: 9px 18px;
    border: none;
    cursor: pointer;
    font-size: 13px;
  }
`;
