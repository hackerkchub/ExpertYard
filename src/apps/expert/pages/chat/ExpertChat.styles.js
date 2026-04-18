import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

/* --- 1. Main Page Wrappers --- */
export const PageWrap = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh;

  display: flex;
  flex-direction: column;
  background: #f4f5f7;

  overflow: hidden;
  overscroll-behavior: none;
`;

export const ChatLayout = styled.div`
  flex: 1;
  display: flex;
  width: 100%;
  height: 100%;
  background: #ffffff;
  overflow: hidden;
`;

/* --- 2. Right Panel (Chat View) --- */
export const RightPanel = styled.div`
  background: #ffffff;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  min-height: 0;
  overflow: hidden;

  /* Desktop center layout */
  @media (min-width: 1024px) {
    max-width: 900px;
    margin: 0 auto;
    border-left: 1px solid #e9ecef;
    border-right: 1px solid #e9ecef;
  }
`;

export const UserHeader = styled.div`
  flex-shrink: 0;
  padding: 12px 20px;
  border-bottom: 1px solid #e9ecef;
  background: #ffffff;
  z-index: 20;

  display: flex;
  align-items: center;
  gap: 12px;

  padding-top: max(12px, env(safe-area-inset-top));

  @media (min-width: 1024px) {
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
  }
`;

export const MobileBackButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  color: #000080;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
`;

export const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e9ecef;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
  }
`;

export const AvatarPlaceholder = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #000080, #1a1a8e);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  flex-shrink: 0;
  border: 2px solid #e9ecef;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
`;

export const UserMeta = styled.div`
  flex: 1;

  h4 {
    margin: 0 0 4px 0;
    font-size: 16px;
    font-weight: 600;
    color: #1a1a2e;
  }

  .user-details {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    @media (max-width: 480px) {
      flex-direction: column;
      gap: 4px;
    }
  }

  .detail-item {
    font-size: 12px;
    color: #6c757d;
  }
`;

export const TimerDisplay = styled.div`
  font-size: 12px;
  color: #057642;
`;

/* --- 3. Chat Area --- */
export const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  background: #f8f9fa;
`;

export const Messages = styled.div`
  flex: 1;
  min-height: 0;

  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  scroll-behavior: smooth;

  padding: 16px;

  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 1024px) {
    padding: 24px 32px;
  }
`;

export const Message = styled.div`
  display: flex;
  width: 100%;
  justify-content: ${({ $expert }) =>
    $expert ? "flex-end" : "flex-start"};
  animation: ${fadeIn} 0.2s ease-out;
`;

export const Bubble = styled.div`
  max-width: 80%;
  padding: 10px 14px;
  border-radius: ${({ $expert }) =>
    $expert ? "12px 12px 2px 12px" : "12px 12px 12px 2px"};

  font-size: 15px;
  line-height: 1.4;

  background: ${({ $expert }) =>
    $expert ? "#000080" : "#ffffff"};
  color: ${({ $expert }) =>
    $expert ? "#ffffff" : "#000000"};

  word-wrap: break-word;

  .time {
    font-size: 10px;
    margin-top: 5px;
    text-align: right;
    opacity: 0.7;
  }

  @media (min-width: 1024px) {
    max-width: 60%;
  }
`;

/* --- 4. Input Area --- */
export const ChatInputWrap = styled.div`
  position: sticky;
  bottom: 0;

  flex-shrink: 0;
  background: #ffffff;

  padding: 10px 16px;
  border-top: 1px solid #e9ecef;

  display: flex;
  align-items: flex-end;
  gap: 10px;

  z-index: 50;

  padding-bottom: max(10px, env(safe-area-inset-bottom));

  @media (min-width: 1024px) {
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
  }
`;

export const ChatInput = styled.textarea`
  flex: 1;

  padding: 10px 14px;
  border-radius: 20px;

  border: 1px solid #dbdbdb;

  font-size: 16px;
  background: #fafafa;

  resize: none;
  max-height: 120px;
  min-height: 40px;

  outline: none;
  font-family: inherit;

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

  transition: all 0.2s;

  &:active {
    transform: scale(0.95);
  }

  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
`;

/* --- 5. Status Components --- */
export const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #000080;
`;

export const NoChatSelected = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
`;

export const ErrorMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: red;

  button {
    margin-top: 10px;
    padding: 10px 20px;
    background: #000080;
    color: white;
    border: none;
    border-radius: 6px;
  }
`;

export const EmptyChatMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #888;
`;

/* Empty placeholders */
export const PopoverContainer = styled.div` display: none; `;
export const ProfileDropdownContainer = styled.div` display: none; `;
export const BackButton = styled.button` display: none; `;