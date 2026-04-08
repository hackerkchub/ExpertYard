// src/apps/expert/pages/chat/ExpertChat.styles.js
import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const PageWrap = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  /* Desktop settings */
  top: 60px; 
  bottom: 0;
  left: 260px; 
  width: calc(100% - 260px); 
  background: #f4f5f7;
  overflow: hidden;

  @media (max-width: 768px) {
    top: 0; /* Header alignment fix for mobile */
    left: 0; 
    width: 100%; 
    /* Use dvh to prevent shifting when keyboard/address bar appears */
    height: 100dvh; 
    bottom: env(safe-area-inset-bottom);
  }
`;

export const ChatLayout = styled.div`
  height: 100%;
  width: 100%; 
  grid-template-columns: 320px 1fr;
  background: #ffffff;
  border-top: 1px solid #e1e4e8;
  overflow: hidden;

  @media (max-width: 960px) {
    grid-template-columns: 280px 1fr;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    grid-template-columns: 1fr; 
    border: none;
  }
`;

export const LeftPanel = styled.div`
  background: #ffffff;
  border-right: 1px solid #e1e4e8;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 100%;
    /* Hide list when a chat is active on mobile if you handle it in JS */
    display: ${({ isChatting }) => (isChatting ? "none" : "flex")};
    border-right: none;
  }
`;

export const LeftHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e1e4e8;
  flex-shrink: 0;
  background: #ffffff;
`;

export const LeftTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #000000;
`;

export const LeftTabs = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 0 2px;
  overflow-x: auto;
  &::-webkit-scrollbar { display: none; } 
`;

export const LeftTab = styled.button`
  border: none;
  cursor: pointer;
  border-radius: 20px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  background: ${({ active }) => (active ? "#0a66c2" : "#ffffff")};
  color: ${({ active }) => (active ? "#ffffff" : "#666666")};
  border: 1.5px solid ${({ active }) => (active ? "#0a66c2" : "#8c8c8c")};
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${({ active }) => (active ? "#004182" : "#f3f6f8")};
    border-color: ${({ active }) => (active ? "#004182" : "#000000")};
  }
`;

export const ChatList = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { background: #cfcfcf; border-radius: 10px; }
`;

export const ChatItem = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 16px;
  cursor: pointer;
  border-left: 4px solid ${({ active }) => (active ? "#0a66c2" : "transparent")};
  background: ${({ active }) => (active ? "#f3f6f8" : "#ffffff")};
  border-bottom: 1px solid #f1f2f4;
  transition: background 0.15s ease-in-out;

  &:hover { background: #f3f6f8; }
`;

export const StatusDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 12px;
  background: ${({ online }) => (online ? "#057642" : "#919191")};
  border: 2px solid white;
  flex-shrink: 0;
`;

export const UserName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: #000000;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TimeText = styled.div`
  font-size: 12px;
  color: #666666;
  margin-left: 8px;
`;

export const RightPanel = styled.div`
  background: #ffffff;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  min-width: 0;
  position: relative;
`;

export const UserHeader = styled.div`
  flex-shrink: 0;
  padding: 14px 16px;
  border-bottom: 1px solid #e1e4e8;
  background: #ffffff;
  z-index: 10;
  /* Fix header at top for mobile */
  position: sticky;
  top: 0;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Avatar = styled.img`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e1e4e8;
`;

export const UserMeta = styled.div`
  h4 { margin: 0; font-size: 15px; font-weight: 600; color: #000000; }
  span { font-size: 13px; color: #666666; font-weight: 400; }
`;

export const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: #ffffff;
  position: relative;
`;

export const Messages = styled.div`
  flex: 1;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #b2b2b2; border-radius: 10px; }

  @media (max-width: 480px) {
    padding: 12px 10px;
  }
`;

export const Message = styled.div`
  display: flex;
  width: 100%;
  justify-content: ${({ expert }) => (expert ? "flex-end" : "flex-start")};
  animation: ${fadeIn} 0.3s ease-out;
`;

export const Bubble = styled.div`
  max-width: 70%;
  padding: 12px 14px;
  border-radius: ${({ expert }) => (expert ? "18px 18px 2px 18px" : "18px 18px 18px 2px")};
  font-size: 14px;
  line-height: 1.5;
  background: ${({ expert }) => (expert ? "#0a66c2" : "#efefef")};
  color: ${({ expert }) => (expert ? "#ffffff" : "#000000")};
  border: none;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word; 

  display: flex;
  flex-direction: column;

  .time {
    font-size: 11px;
    color: ${({ expert }) => (expert ? "rgba(255,255,255,0.8)" : "#666666")};
    margin-top: 6px;
    align-self: flex-end;
  }

  @media (max-width: 768px) {
    max-width: 85%;
  }
`;

export const ChatInputWrap = styled.div`
  flex-shrink: 0;
  background: #ffffff;
  padding: 12px 16px;
  display: flex;
  align-items: center; 
  gap: 12px;
  border-top: 1px solid #efefef;
  /* Fix footer at bottom for mobile */
  position: sticky;
  bottom: 0;
  z-index: 10;
  padding-bottom: max(12px, env(safe-area-inset-bottom));

  @media (max-width: 480px) {
    padding: 10px;
    gap: 8px;
  }
`;

export const ChatInput = styled.textarea`
  flex: 1;
  padding: 10px 16px;
  border-radius: 20px; 
  border: 1px solid #dbdbdb;
  font-size: 16px; /* 16px prevents iOS auto-zoom on focus */
  background: #fafafa;
  resize: none;
  min-height: 40px;
  max-height: 100px;
  outline: none;
  font-family: inherit;
  color: #000000;
  transition: all 0.2s ease;

  &:focus {
    border-color: #0a66c2;
    background: #ffffff;
  }

  &::placeholder {
    color: #8e8e8e;
  }
`;

export const SendButton = styled.button`
  background: transparent; 
  border: none;
  color: #0095f6; 
  padding: 4px 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  height: auto;
  flex-shrink: 0;
  transition: color 0.2s ease, transform 0.1s ease;

  &:hover:not(:disabled) {
    color: #1877f2;
    transform: scale(1.05);
  }

  &:disabled {
    color: #b2dffc; 
    cursor: not-allowed;
  }
`;

/* --- RE-EXPORTING ALL MISSING COMPONENTS TO PREVENT ERRORS --- */
export const LoadingSpinner = styled.div` display: flex; align-items: center; justify-content: center; height: 100%; color: #0a66c2; font-weight: 600; `;
export const NoChatSelected = styled.div` display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #666; font-size: 15px; font-weight: 500; `;
export const ErrorMessage = styled.div` display: flex; align-items: center; justify-content: center; height: 100%; color: #d11124; font-weight: 600; `;
export const EmptyChatMessage = styled.div` display: flex; align-items: center; justify-content: center; height: 100%; color: #888; font-size: 14px; `;

export const PopoverContainer = styled.div` display: none; `;
export const ProfileDropdownContainer = styled.div` display: none; `;