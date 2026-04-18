import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* WRAPPER */
export const PageWrap = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: #f4f5f7;
  overflow: hidden;
`;

export const ChatLayout = styled.div`
  flex: 1;
  display: flex;
  height: 100%;
`;

/* PANEL */
export const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (min-width: 1024px) {
    max-width: 900px;
    margin: 0 auto;
  }
`;

/* HEADER */
export const UserHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: #fff;
  padding: 12px;
  border-bottom: 1px solid #eee;
`;

export const UserInfo = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

export const AvatarPlaceholder = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #000080;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const UserMeta = styled.div`
  h4 {
    margin: 0;
    font-size: 14px;
  }

  .detail-item {
    font-size: 12px;
    color: #666;
  }
`;

/* CHAT */
export const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Message = styled.div`
  display: flex;
  justify-content: ${({ $expert }) =>
    $expert ? "flex-end" : "flex-start"};
  animation: ${fadeIn} 0.2s;
`;

export const Bubble = styled.div`
  max-width: 70%;
  padding: 10px;
  border-radius: 10px;
  background: ${({ $expert }) =>
    $expert ? "#000080" : "#fff"};
  color: ${({ $expert }) =>
    $expert ? "#fff" : "#000"};

  .time {
    font-size: 10px;
    text-align: right;
  }
`;

/* INPUT */
export const ChatInputWrap = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  gap: 10px;
  padding: 10px;
  background: #fff;
`;

export const ChatInput = styled.textarea`
  flex: 1;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ccc;
  font-size: 16px;
  resize: none;
`;

export const SendButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #000080;
  color: #fff;
  border: none;
`;

/* STATES */
export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const NoChatSelected = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const ErrorMessage = styled.div`
  text-align: center;
`;

export const EmptyChatMessage = styled.div`
  text-align: center;
`;

/* EMPTY EXPORTS */
export const PopoverContainer = styled.div``;
export const ProfileDropdownContainer = styled.div``;
export const BackButton = styled.button``;