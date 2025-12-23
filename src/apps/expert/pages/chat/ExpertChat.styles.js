// src/apps/expert/pages/chat/ExpertChat.styles.js
import styled from "styled-components";

export const PageWrap = styled.div`
  height: 100vh;
  background: #f5f7fb;
  padding: 20px;
`;

export const ChatLayout = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 20px;
`;

export const LeftPanel = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
`;

export const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
`;

export const ChatList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ChatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  background: ${({ active }) => active ? "#eef2ff" : "transparent"};

  &:hover {
    background: #f1f4ff;
  }
`;

export const StatusDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${({ online }) => online ? "#22c55e" : "#f97316"};
`;

export const UserName = styled.div`
  font-weight: 600;
  font-size: 14px;
`;

export const TimeText = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

export const RightPanel = styled.div`
  background: #ffffff;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
`;

export const UserHeader = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #eef2f7;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
`;

export const UserMeta = styled.div`
  h4 {
    margin: 0;
    font-size: 15px;
  }

  span {
    font-size: 13px;
    color: #6b7280;
  }
`;

export const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const Messages = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
`;

export const Message = styled.div`
  display: flex;
  justify-content: ${({ expert }) => expert ? "flex-end" : "flex-start"};
`;

export const Bubble = styled.div`
  max-width: 60%;
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 14px;
  background: ${({ expert }) => expert ? "#4f46e5" : "#f1f5f9"};
  color: ${({ expert }) => expert ? "#ffffff" : "#111827"};
`;

export const ChatInputWrap = styled.div`
  padding: 16px;
  border-top: 1px solid #eef2f7;
  display: flex;
  gap: 12px;
`;

export const ChatInput = styled.input`
  flex: 1;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  outline: none;
  font-size: 14px;

  &:focus {
    border-color: #6366f1;
  }
`;

export const SendButton = styled.button`
  background: #4f46e5;
  border: none;
  color: white;
  border-radius: 12px;
  padding: 0 16px;
  cursor: pointer;

  &:hover {
    background: #4338ca;
  }
`;
