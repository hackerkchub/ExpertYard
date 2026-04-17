import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* --- 1. Main Page Wrappers --- */
export const PageWrap = styled.div`
  /* Screen ko fix karne ke liye */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  /* Modern Dynamic Viewport Height */
  height: 100vh;
  height: 100dvh; 
  width: 100%;
  
  display: flex;
  flex-direction: column;
  background: #f4f5f7;
  overflow: hidden; 
  /* Prevent system bounce */
  overscroll-behavior: none; 
`;

export const ChatLayout = styled.div`
  flex: 1;
  display: flex;
  width: 100%;
  height: 100%;
  background: #ffffff;
  overflow: hidden;

  @media (min-width: 769px) {
    grid-template-columns: 320px 1fr;
  }
`;

/* --- 2. Left Panel (Chat List) --- */
export const LeftPanel = styled.div`
  background: #ffffff;
  border-right: 1px solid #e1e4e8;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  @media (max-width: 768px) {
    display: ${({ isChatting }) => (isChatting ? "none" : "flex")};
    width: 100%;
  }
`;

export const LeftHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid #e1e4e8;
  flex-shrink: 0;
`;

export const LeftTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #000;
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
  background: ${({ active }) => (active ? "#000080" : "#ffffff")};
  color: ${({ active }) => (active ? "#ffffff" : "#666666")};
  border: 1.5px solid ${({ active }) => (active ? "#000080" : "#8c8c8c")};
  transition: all 0.2s;
`;

export const ChatList = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

export const ChatItem = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 16px;
  cursor: pointer;
  border-left: 4px solid ${({ active }) => (active ? "#000080" : "transparent")};
  background: ${({ active }) => (active ? "#f3f6f8" : "#ffffff")};
  border-bottom: 1px solid #f1f2f4;
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
  color: #000;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TimeText = styled.div`
  font-size: 12px;
  color: #666;
  margin-left: 8px;
`;

/* --- 3. Right Panel (Chat View) --- */
export const RightPanel = styled.div`
  background: #ffffff;
  display: flex;
  flex-direction: column;
  height: 100%; 
  width: 100%;
  overflow: hidden;
  position: relative;
  flex: 1;
  min-height: 0;
`;

export const UserHeader = styled.div`
  flex-shrink: 0;
  padding: 10px 16px;
  border-bottom: 1px solid #e1e4e8;
  background: #ffffff;
  z-index: 20;
  display: flex;
  align-items: center;
  /* Safe Area for Mobile Notch */
  padding-top: max(10px, env(safe-area-inset-top));
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e1e4e8;
  flex-shrink: 0;
`;

export const UserMeta = styled.div`
  h4 { margin: 0; font-size: 15px; font-weight: 600; color: #000; }
  span { font-size: 12px; color: #666; }
`;

export const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; 
  background: #f0f2f5; /* Background for WhatsApp look */
  position: relative;
`;

export const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  /* Prevent background bounce on iOS */
  overscroll-behavior-y: contain; 
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Message = styled.div`
  display: flex;
  width: 100%;
  justify-content: ${({ expert }) => (expert ? "flex-end" : "flex-start")};
  animation: ${fadeIn} 0.2s ease-out;
`;

export const Bubble = styled.div`
  max-width: 80%;
  padding: 10px 14px;
  border-radius: ${({ expert }) => (expert ? "12px 12px 2px 12px" : "12px 12px 12px 2px")};
  font-size: 15px;
  line-height: 1.4;
  background: ${({ expert }) => (expert ? "#000080" : "#ffffff")};
  color: ${({ expert }) => (expert ? "#ffffff" : "#000000")};
  box-shadow: 0 1px 1px rgba(0,0,0,0.1);
  word-wrap: break-word;

  .time {
    font-size: 10px;
    margin-top: 5px;
    text-align: right;
    opacity: 0.7;
    color: inherit;
  }
`;

/* --- 4. Input Area (Locked at bottom) --- */
export const ChatInputWrap = styled.div`
  flex-shrink: 0;
  background: #ffffff;
  padding: 12px 16px;
  border-top: 1px solid #e1e4e8;
  display: flex;
  align-items: flex-end;
  gap: 10px;
  z-index: 20;
  /* Notch/Home-bar support */
  padding-bottom: max(12px, env(safe-area-inset-bottom));
`;

export const ChatInput = styled.textarea`
  flex: 1;
  padding: 10px 16px;
  border-radius: 20px;
  border: 1px solid #dbdbdb;
  font-size: 16px; /* VERY IMPORTANT: Prevents iOS auto-zoom */
  background: #fafafa;
  resize: none;
  max-height: 120px;
  min-height: 40px;
  outline: none;
  font-family: inherit;
  color: #000;
  line-height: 1.4;
  transition: border-color 0.2s;

  &:focus {
    border-color: #000080;
  }
`;

export const SendButton = styled.button`
  background: #000080;
  color: #ffffff;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity 0.2s, transform 0.1s;

  &:active { transform: scale(0.95); }
  &:disabled { background: #cccccc; cursor: not-allowed; }
`;

/* --- 5. Status & Extra Components --- */
export const LoadingSpinner = styled.div` display: flex; align-items: center; justify-content: center; height: 100%; color: #000080; font-weight: 600; `;
export const NoChatSelected = styled.div` 
  display: flex; flex-direction: column; align-items: center; justify-content: center; 
  height: 100%; color: #666; text-align: center; padding: 20px;
  h3 { margin: 10px 0 5px; color: #333; }
  p { margin: 0; font-size: 14px; }
`;
export const ErrorMessage = styled.div` 
  display: flex; flex-direction: column; align-items: center; justify-content: center; 
  height: 100%; color: #d11124; padding: 20px; text-align: center;
  button { margin-top: 15px; padding: 10px 20px; background: #000080; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
`;
export const EmptyChatMessage = styled.div` display: flex; align-items: center; justify-content: center; height: 100%; color: #888; font-size: 14px; `;

/* Empty placeholders to avoid import errors if called in JSX */
export const PopoverContainer = styled.div` display: none; `;
export const ProfileDropdownContainer = styled.div` display: none; `;