import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* WRAPPER */
export const PageWrap = styled.div`
  position: fixed;
  inset: 0;
  height: 100dvh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(circle at top left, rgba(63, 81, 181, 0.08), transparent 24%),
    #eef3f8;
  overflow: hidden;
`;

/* LAYOUT */
export const ChatLayout = styled.div`
  flex: 1;
  display: flex;
  height: 100%;
  overflow: hidden;
`;

/* PANEL */
export const RightPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;

  @media (min-width: 1024px) {
    max-width: 900px;
    margin: 0 auto;
  }
`;

/* HEADER (FIXED ALWAYS) */
export const UserHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.94);
  padding: 14px 16px;
  border-bottom: 1px solid #d8e0eb;
  backdrop-filter: blur(18px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
`;

/* USER INFO */
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

/* CHAT AREA */
export const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

/* ONLY THIS SCROLLS */
export const Messages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);

  /* 🔥 IMPORTANT */
  height: 0;
`;

/* MESSAGE */
export const Message = styled.div`
  display: flex;
  justify-content: ${({ $expert }) =>
    $expert ? "flex-end" : "flex-start"};
  animation: ${fadeIn} 0.2s;
`;

export const Bubble = styled.div`
  max-width: min(72%, 720px);
  padding: 12px 14px;
  border-radius: 18px;
  background: ${({ $expert }) =>
    $expert ? "#000080" : "#fff"};
  color: ${({ $expert }) =>
    $expert ? "#fff" : "#000"};
  border: ${({ $expert }) => ($expert ? "none" : "1px solid #d8e0eb")};
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);

  .time {
    font-size: 10px;
    text-align: right;
  }
`;

/* INPUT FIX (KEYBOARD SAFE) */
export const ChatInputWrap = styled.div`
  position: sticky;
  bottom: 0;
  z-index: 50;

  display: flex;
  gap: 10px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.96);
  border-top: 1px solid #d8e0eb;
  backdrop-filter: blur(16px);

  /* 🔥 KEYBOARD FIX */
  padding-bottom: max(10px, env(safe-area-inset-bottom));
`;

export const ChatInput = styled.textarea`
  flex: 1;
  padding: 12px 14px;
  border-radius: 20px;
  border: 1px solid #d8e0eb;
  font-size: 16px;
  resize: none;
  background: #f8fafc;

  &:focus {
    outline: none;
    border-color: #000080;
    box-shadow: 0 0 0 4px rgba(0, 0, 128, 0.1);
    background: #fff;
  }
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

/* EMPTY EXPORTS (DON'T REMOVE) */
export const PopoverContainer = styled.div``;
export const ProfileDropdownContainer = styled.div``;
export const BackButton = styled.button``;
