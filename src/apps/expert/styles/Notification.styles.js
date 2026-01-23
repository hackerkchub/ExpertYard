import styled, { keyframes } from "styled-components";

const fade = keyframes`
  from { opacity:0; transform:translateY(-6px); }
  to { opacity:1; transform:translateY(0); }
`;

const ring = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.6); }
  70% { box-shadow: 0 0 0 12px rgba(34,197,94,0); }
  100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
`;

export const Popover = styled.div`
  position: absolute;
  top: 50px;
  right: -10px;
  width: 280px;
  background: #ffffff;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.1);
  animation: ${fade} 0.22s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1400;
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
`;

export const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

export const Title = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #0f1e36;
`;

export const MarkAll = styled.button`
  border: none;
  background: none;
  font-size: 11px;
  cursor: pointer;
  color: #2563eb;

  &:hover {
    text-decoration: underline;
  }
`;
export const Tabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
`;

export const Tab = styled.div`
  flex: 1;
  padding: 8px;
  text-align: center;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  background: ${({ active }) => (active ? "#e0e7ff" : "#f8fafc")};
`;

export const Section = styled.div``;

export const PopItem = styled.div`
  padding: 8px;
  border-radius: 8px;
  background: ${({ unread }) => (unread ? "#f1f5f9" : "#f9fafb")};
  font-size: 13px;
  color: #111827;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Meta = styled.div`
  font-size: 11px;
  color: #6b7280;
`;

export const ActionRow = styled.div`
  margin-top: 4px;
  display: flex;
  gap: 6px;
`;

export const ActionBtn = styled.button`
  flex: 1;
  padding: 4px 6px;
  border-radius: 6px;
  border: none;
  font-size: 11px;
  cursor: pointer;
  font-weight: 500;
  background: ${({ variant }) =>
    variant === "outline" ? "#ffffff" : "#0ea5ff"};
  color: ${({ variant }) => (variant === "outline" ? "#111827" : "#ffffff")};
  border: ${({ variant }) =>
    variant === "outline" ? "1px solid #e5e7eb" : "none"};

  &:hover {
    opacity: 0.9;
  }
`;

export const RingDot = styled.span`
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
`;

export const Empty = styled.div`
  font-size: 12px;
  color: #94a3b8;
`;


export const Footer = styled.div`
  margin-top: 4px;
  border-top: 1px solid #e5e7eb;
  padding-top: 6px;
  display: flex;
  justify-content: center;
`;

export const ViewAll = styled.span`
  font-size: 12px;
  color: #2563eb;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;
