import styled from "styled-components";

/* PAGE + LAYOUT - Edge-to-Edge */
export const PageWrap = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 60px; 
  left: 0;
  right: 0;
  bottom: 0;
  background: #f3f2ef;
  overflow: hidden; /* Screen level scroll block */
`;

export const ChatLayout = styled.div`
  height: 100%;
  max-width: 1128px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 320px 1fr;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  overflow: hidden; /* Layout level fixed height */

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    border: none;
  }
`;

/* LEFT PANEL */
export const LeftPanel = styled.div`
  background: #ffffff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

export const LeftHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
`;

export const LeftTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.9);
`;

export const LeftTabs = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px 0 4px;
`;

export const LeftTab = styled.button`
  border: none;
  cursor: pointer;
  border-radius: 16px;
  padding: 4px 12px;
  font-size: 13px;
  font-weight: 600;
  background: ${({ active }) => (active ? "#057642" : "transparent")};
  color: ${({ active }) => (active ? "#ffffff" : "rgba(0,0,0,0.6)")};
  border: 1px solid ${({ active }) => (active ? "#057642" : "rgba(0,0,0,0.6)")};
`;

export const ChatList = styled.div`
  flex: 1;
  overflow-y: auto; /* List level scrolling */
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-thumb { background: #cfcfcf; border-radius: 10px; }
`;

export const ChatItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  border-left: 4px solid ${({ active }) => (active ? "#057642" : "transparent")};
  background: ${({ active }) => (active ? "#f3f2ef" : "#ffffff")};
  border-bottom: 1px solid #f3f2ef;
  &:hover { background: #f3f2ef; }
`;

export const StatusDot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 10px;
  background: ${({ online }) => (online ? "#057642" : "#919191")};
  border: 1.5px solid white;
`;

export const UserName = styled.div`
  font-weight: 600;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const TimeText = styled.div`
  font-size: 11px;
  color: rgba(0, 0, 0, 0.6);
`;

/* RIGHT PANEL */
export const RightPanel = styled.div`
  background: #ffffff;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden; /* Stop right panel from pushing parent height */
  min-width: 0;
`;

export const UserHeader = styled.div`
  flex-shrink: 0;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  background: #ffffff;
  z-index: 5;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Avatar = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
`;

export const UserMeta = styled.div`
  h4 { margin: 0; font-size: 14px; color: rgba(0,0,0,0.9); }
  span { font-size: 12px; color: rgba(0,0,0,0.6); }
`;

/* CHAT AREA - Fix for Scrolling */
export const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0; /* Webkit fix for inner scroll */
  background: #ffffff;
`;

export const Messages = styled.div`
  flex: 1;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto; /* Scroll work karega ab */
  scroll-behavior: smooth;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #cfcfcf; border-radius: 10px; }
`;

export const Message = styled.div`
  display: flex;
  width: 100%;
  justify-content: ${({ expert }) => (expert ? "flex-end" : "flex-start")};
`;

/* BUBBLE - Fix for Overflow Text */
export const Bubble = styled.div`
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  background: ${({ expert }) => (expert ? "#f3f2ef" : "#ffffff")};
  color: rgba(0, 0, 0, 0.9);
  border: 1px solid #e0e0e0;
  
  /* Text overflow fix */
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word; 

  display: flex;
  flex-direction: column;

  .time {
    font-size: 11px;
    color: rgba(0,0,0,0.5);
    margin-top: 4px;
    align-self: flex-end;
  }

  @media (max-width: 600px) {
    max-width: 85%;
  }
`;

/* INPUT FOOTER */
export const ChatInputWrap = styled.div`
  flex-shrink: 0;
  background: #ffffff;
  padding: 16px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  align-items: flex-end;
  gap: 12px;
`;

export const ChatInput = styled.textarea`
  flex: 1;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  font-size: 14px;
  background: #f9fafb;
  resize: none;
  min-height: 40px;
  max-height: 120px;
  outline: none;
  font-family: inherit;

  &:focus {
    border-color: #888;
    background: #ffffff;
  }
`;

export const SendButton = styled.button`
  background: #0a66c2;
  border: none;
  color: white;
  border-radius: 16px;
  padding: 6px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  height: 32px;
  flex-shrink: 0;

  &:hover { background: #004182; }
  &:disabled { background: #e0e0e0; color: #999; cursor: not-allowed; }
`;

/* States */
export const LoadingSpinner = styled.div` display: flex; align-items: center; justify-content: center; height: 100%; `;
export const NoChatSelected = styled.div` display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #666; `;
export const ErrorMessage = styled.div` display: flex; align-items: center; justify-content: center; height: 100%; color: #d11124; `;
export const EmptyChatMessage = styled.div` display: flex; align-items: center; justify-content: center; height: 100%; color: #999; `;