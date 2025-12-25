import styled from "styled-components";

/* PAGE + LAYOUT */

export const PageWrap = styled.div`
  height: 100vh;
  background: linear-gradient(135deg, #f9fafb, #e5edff);
  padding: 12px;
  overflow: hidden;
  @media (min-width: 1024px) {
    padding: 20px;
  }
`;

export const ChatLayout = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 18px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

/* LEFT PANEL */

export const LeftPanel = styled.div`
  background: #ffffff;
  border-radius: 18px;
  padding: 14px 16px 16px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
  display: flex;
  flex-direction: column;
  color: #0f172a;
`;

export const LeftHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 8px;
`;

export const LeftTitle = styled.h2`
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: #0f172a;
`;

/* FILTERS – 2nd row */

export const LeftTabs = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  background: #f1f5f9;
  border-radius: 999px;
  padding: 3px;
  border: 1px solid #e2e8f0;
`;

export const LeftTab = styled.button`
  border: none;
  outline: none;
  cursor: pointer;
  border-radius: 999px;
  padding: 5px 10px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: ${({ active }) =>
    active ? "linear-gradient(135deg, #38bdf8, #6366f1)" : "transparent"};
  color: ${({ active }) => (active ? "#ffffff" : "#475569")};
  font-weight: 600;
  transition: background 0.15s ease, color 0.15s ease;
`;

/* Section label */

export const SectionTitle = styled.h3`
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin: 10px 0 6px;
  color: #9ca3af;
`;

/* Lists – internal scroll only */

export const ChatList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 230px;
  overflow-y: auto;
  padding-right: 4px;
  margin-bottom: 8px;

  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5f5;
    border-radius: 999px;
  }
`;

export const ChatItem = styled.div`
  display: flex;
  align-items: center;
  padding: 9px 9px;
  cursor: pointer;
  border-radius: 12px;
  margin-bottom: 2px;
  background: ${({ active }) => (active ? "#eff6ff" : "#ffffff")};
  border: 1px solid ${({ active }) => (active ? "#60a5fa" : "#e5e7eb")};
  transition: background 0.15s ease, transform 0.1s ease, border-color 0.15s ease;

  &:hover {
    background: ${({ active }) => (active ? "#dbeafe" : "#f8fafc")};
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 8px;
  }
`;

export const StatusDot = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  margin-right: 8px;
  background: ${({ online }) => (online ? "#22c55e" : "#f97316")};
`;

export const UserName = styled.div`
  font-weight: 600;
  font-size: 13px;
  color: #0f172a;
`;

export const TimeText = styled.div`
  font-size: 11px;
  color: #6b7280;
`;

/* RIGHT PANEL */

export const RightPanel = styled.div`
  background: #ffffff;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 35px rgba(15, 23, 42, 0.18);
  overflow: hidden;
`;

/* HEADER – fixed inside panel, page itself not scrolling */

export const UserHeader = styled.div`
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 14px 18px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #eef2ff, #e0f2fe);
  z-index: 10;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

export const Avatar = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #3b82f6;
`;

export const UserMeta = styled.div`
  h4 {
    margin: 0 0 3px 0;
    font-size: 15px;
    color: #0f172a;
  }
  span {
    display: block;
    font-size: 12px;
    color: #6b7280;
    line-height: 1.35;
  }
`;

/* CENTER – chat area scrolls inside panel only */

export const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: #f9fafb;
`;

export const Messages = styled.div`
  flex: 1;
  padding: 14px 16px 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 999px;
  }

  @media (min-width: 1024px) {
    padding: 18px 20px 12px;
    gap: 12px;
  }
`;

export const Message = styled.div`
  display: flex;
  justify-content: ${({ expert }) => (expert ? "flex-end" : "flex-start")};
`;

export const Bubble = styled.div`
  max-width: 70%;
  padding: 9px 11px;
  border-radius: 16px;
  font-size: 13px;
  background: ${({ expert }) =>
    expert ? "linear-gradient(135deg, #4f46e5, #6366f1)" : "#e5e7eb"};
  color: ${({ expert }) => (expert ? "#eef2ff" : "#111827")};
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  box-shadow: 0 6px 18px rgba(148, 163, 184, 0.4);

  .time {
    font-size: 11px;
    color: ${({ expert }) =>
      expert ? "rgba(226,232,240,0.9)" : "rgba(107,114,128,0.9)"};
    align-self: flex-end;
  }

  @media (min-width: 1024px) {
    max-width: 60%;
    font-size: 14px;
    padding: 11px 14px;
  }
`;

/* INPUT FOOTER – fixed to bottom of right panel */

export const ChatInputWrap = styled.div`
  flex-shrink: 0;
  background: #ffffff;
  padding: 10px 12px 12px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 8px;

  @media (min-width: 1024px) {
    padding: 12px 16px 14px;
    gap: 10px;
  }
`;

export const ChatInput = styled.input`
  flex: 1;
  padding: 9px 11px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  outline: none;
  font-size: 13px;
  background: #f9fafb;
  color: #111827;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #6366f1;
    background: #ffffff;
  }

  @media (min-width: 1024px) {
    font-size: 14px;
    padding: 11px 13px;
  }
`;

export const SendButton = styled.button`
  background: linear-gradient(135deg, #38bdf8, #6366f1);
  border: none;
  color: white;
  border-radius: 12px;
  padding: 0 14px;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 18px rgba(59, 130, 246, 0.5);

  &:hover {
    background: linear-gradient(135deg, #0ea5e9, #4f46e5);
  }

  &:disabled {
    background: #e5e7eb;
    color: #9ca3af;
    cursor: not-allowed;
    box-shadow: none;
  }

  @media (min-width: 1024px) {
    padding: 0 16px;
  }
`;

/* GENERIC STATES */

export const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #6b7280;
  font-size: 15px;
`;

export const NoChatSelected = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #6b7280;
  text-align: center;
  gap: 8px;
  svg {
    margin-bottom: 8px;
    opacity: 0.6;
  }
  h3 {
    margin: 0 0 4px 0;
    color: #0f172a;
  }
  p {
    margin: 0;
    font-size: 13px;
  }
`;

export const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #b91c1c;
  text-align: center;
  svg {
    margin-bottom: 12px;
    opacity: 0.9;
  }
  h3 {
    margin: 0 0 10px 0;
    color: #dc2626;
  }
  button {
    padding: 8px 18px;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    font-size: 13px;
  }
`;

export const EmptyChatMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 260px;
  color: #6b7280;
  font-size: 14px;
  text-align: center;
  line-height: 1.5;
`;
