import styled from "styled-components";

/* PAGE */
export const PageWrap = styled.div`
  width: 100%;
  height: calc(100vh - 75px); /* minus navbar height */
  background: radial-gradient(circle at top left, #1a2140, #0b0f25 70%);
  display: flex;
  justify-content: center;
  padding: 10px;
  overflow: hidden;
`;

/* MAIN LAYOUT */
export const Layout = styled.div`
  width: 100%;
  max-width: 1280px;
  height: 100%;
  display: flex;
  border-radius: 20px;
  overflow: hidden;

  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(22px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

/* MOBILE TOGGLE */
export const LeftPanelToggle = styled.button`
  display: none;

  @media (max-width: 820px) {
    display: block;
    position: absolute;
    top: 85px;
    left: 16px;
    z-index: 200;
    padding: 10px 14px;
    border: none;
    background: rgba(255,255,255,0.1);
    border-radius: 10px;
    color: #bfeaff;
    font-size: 14px;
    backdrop-filter: blur(10px);
  }
`;

/* RIGHT PANEL */
export const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

/* HEADER */
export const Header = styled.div`
  padding: 18px 22px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  display: flex;
  align-items: center;
`;

export const ExpertInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .expert-text strong {
    color: #e4f7ff;
    font-size: 16px;
    display: block;
  }

  .expert-text span {
    color: #9acbea;
    font-size: 13px;
    opacity: 0.7;
  }
`;


export const Avatar = styled.img`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(0,200,255,0.4);
`;


export const AvatarWrapper = styled.div`
  position: relative;
  width: 46px;
  height: 46px;
`;


export const StatusDot = styled.span`
  position: absolute;
  bottom: 3px;
  right: 3px;
  
  width: 10px;
  height: 10px;

  background: ${(p) => (p.active ? "#3bff9d" : "#777")};
  border-radius: 50%;
  border: 2px solid #0b0f25; /* Creates a clean ring */
`;


/* MESSAGES */
export const MessagesArea = styled.div`
  flex: 1;
  padding: 18px 22px;
  overflow-y: auto;
`;

export const MessageRow = styled.div`
  display: flex;
  margin: 10px 0;

  &.user {
    justify-content: flex-end;
  }
`;

export const MessageBubble = styled.div`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 15px;
  line-height: 1.4;

  &.expert {
    background: rgba(0,200,255,0.15);
    color: #bcefff;
    border: 1px solid rgba(0,200,255,0.2);
    border-bottom-left-radius: 4px;
  }

  &.user {
    background: linear-gradient(135deg, #00d0ff, #0088ff);
    color: white;
    border-bottom-right-radius: 4px;
  }
`;

/* TYPING INDICATOR */
export const TypingBubble = styled.div`
  background: rgba(0,200,255,0.15);
  border-radius: 14px;
  padding: 10px 14px;
  width: 60px;
  display: flex;
  justify-content: space-between;

  span {
    width: 8px;
    height: 8px;
    background: #baf2ff;
    border-radius: 50%;
    animation: blink 1.2s infinite ease-in-out;
  }

  span:nth-child(2) { animation-delay: 0.2s; }
  span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes blink {
    0% { opacity: 0.2; transform: translateY(0); }
    50% { opacity: 1; transform: translateY(-3px); }
    100% { opacity: 0.2; transform: translateY(0); }
  }
`;

/* INPUT */
export const InputBar = styled.div`
  padding: 16px 18px;
  background: rgba(255,255,255,0.05);
  border-top: 1px solid rgba(255,255,255,0.1);
  display: flex;
  gap: 10px;
`;

export const InputBox = styled.input`
  flex: 1;
  padding: 14px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 14px;
  color: white;
  outline: none;
  font-size: 15px;

  ::placeholder {
    color: rgba(255,255,255,0.4);
  }
`;

export const SendButton = styled.button`
  padding: 0 22px;
  background: linear-gradient(135deg, #00d0ff, #0094ff);
  border: none;
  border-radius: 14px;
  color: white;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 14px rgba(0,200,255,0.3);
  }
`;
export const CallButton = styled.button`
  margin-left: auto;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
  color: #c9ecff;
  display: flex;
  align-items: center;
  transition: 0.2s;

  &:hover {
    background: rgba(0,200,255,0.2);
    box-shadow: 0 0 10px rgba(0,200,255,0.3);
  }
`;

