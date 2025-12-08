import styled, { keyframes } from "styled-components";

const fade = keyframes`
  from { opacity:0; transform:translateY(-6px); }
  to { opacity:1; transform:translateY(0); }
`;

export const DropMenu = styled.div`
  position: absolute;
  top: 50px;
  right: 0;
  width: 210px;
  background: #ffffff;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  animation: ${fade} 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 1400;
`;

export const UserHeader = styled.div`
  padding: 6px 4px 8px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const UserName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

export const UserRole = styled.div`
  font-size: 11px;
  color: #6b7280;
`;

export const DropItem = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 8px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  color: ${({ danger }) => (danger ? "#d1323e" : "#232b3a")};
  font-weight: ${({ danger }) => (danger ? 600 : 500)};

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }

  svg {
    font-size: 16px;
  }
`;
