import styled, { createGlobalStyle } from "styled-components";

export const ChatGlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden; 
    background-color: #f4f2ee;
  }

  /* ✅ Navbar aur Spacer ko force hide karne ke liye */
  nav, 
  header, 
  .main-layout footer, 
  .footer,
  [class*="NavbarSpacer"], /* Spacer component ko target karne ke liye */
  header + div { 
    display: none !important;
  }

  /* Specific Nav class agar styled component name use ho raha ho */
  .sc-nav, .nav-container { 
    display: none !important;
  }
`;

export const PageWrap = styled.div`
  display: flex;
  flex-direction: column;
  /* dvh keyboard khulne par height ko automatically kam kar deta hai */
  height: 100vh;
  height: 100dvh; 
  width: 100%;
  background: #f4f2ee;
  position: fixed;
  top: 0; /* Page ke ekdum top se start hoga */
  left: 0;
  z-index: 9999; /* Isse navbar iske niche chup jayega */
`;

export const Header = styled.div`
  height: 60px; /* Header height fix ki hai taaki clean dikhe */
  background: white;
  border-bottom: 1px solid rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  flex-shrink: 0; 
  
  @media (max-width: 480px) {
    height: 55px;
    gap: 8px;
  }
`;

export const ExpertInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;

  .expert-name {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 120px; 
    
    @media (min-width: 768px) {
      max-width: 200px;
      font-size: 16px;
    }
  }

  .status {
    font-size: 10px;
    font-weight: 500;
  }
`;

export const AvatarWrapper = styled.div`
  position: relative;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
`;

export const Avatar = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
`;

export const StatusDot = styled.span`
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 9px;
  height: 9px;
  background: ${props => props.$active ? "#10b981" : "#ef4444"};
  border-radius: 50%;
  border: 1.5px solid white;
`;

export const TimerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid ${props => props.$color || "#10b981"};
  font-size: 12px;
  font-weight: 700;
  color: ${props => props.$color || "#10b981"};
  white-space: nowrap;

  @media (max-width: 360px) {
    font-size: 11px;
    padding: 3px 6px;
    span { display: none; } 
  }
`;

export const MessagesArea = styled.div`
  flex: 1; 
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  background: #f4f2ee;
  -webkit-overflow-scrolling: touch;
`;

export const MessageRow = styled.div`
  display: flex;
  margin-bottom: 10px;
  width: 100%;
  &.user { justify-content: flex-end; }
  &.expert { justify-content: flex-start; }
`;

export const MessageBubble = styled.div`
  max-width: 85%;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1.4;

  &.expert {
    background: white;
    border-radius: 0px 12px 12px 12px;
    border: 1px solid rgba(0,0,0,0.05);
  }

  &.user {
    background: #0a66c2;
    color: white;
    border-radius: 12px 0px 12px 12px;
  }
`;

export const MessageTime = styled.div`
  font-size: 9px;
  margin-top: 3px;
  opacity: 0.7;
  text-align: right;
`;

export const InputBar = styled.div`
  background: white;
  border-top: 1px solid rgba(0,0,0,0.1);
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0; 
  padding-bottom: max(8px, env(safe-area-inset-bottom));
`;

export const InputBox = styled.input`
  flex: 1;
  height: 40px;
  padding: 0 12px;
  background: #eef3f8;
  border: 1px solid transparent;
  border-radius: 20px;
  font-size: 14px;
  outline: none;
  width: 100%;

  &:focus {
    background: white;
    border-color: #0a66c2;
  }
`;

export const SendButton = styled.button`
  background: #0a66c2;
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;

  &:disabled { background: #ccc; }
`;

export const UploadButton = styled.button`
  color: #666;
  background: transparent;
  border: none;
  padding: 5px;
  display: flex;
  flex-shrink: 0;
`;

export const EndChatButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  flex-shrink: 0;
`;

export const FileUploadMenu = styled.div`
  position: absolute; bottom: 65px; left: 10px; background: white;
  border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 100;
  .menu-item { padding: 10px 15px; display: flex; align-items: center; gap: 8px; font-size: 13px; }
`;

export const LoadingSpinner = styled.div` height: 100%; display: flex; align-items: center; justify-content: center; `;
export const ErrorMessage = styled.div` padding: 20px; text-align: center; color: red; `;
export const EmptyChatMessage = styled.div` padding: 20px; text-align: center; font-size: 13px; color: #666; `;
export const TypingIndicator = styled.div` padding: 5px 15px; font-size: 11px; `;
export const NoMessages = styled.div` text-align: center; padding: 20px; `;
export const CallButton = styled.button` display: none; `;