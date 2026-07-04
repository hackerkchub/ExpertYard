import styled, { keyframes } from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  height: -webkit-fill-available;
  background: #09090b;
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

export const ReelsFeed = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const ReelWrapper = styled.div`
  width: 100%;
  height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  display: flex;
  position: relative;

  @media (min-width: 992px) {
    display: grid;
    grid-template-columns: 1fr 400px;
    height: 100%;
  }
`;

export const PlayerSection = styled.div`
  flex: 1;
  height: 100%;
  background: #000000;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (min-width: 992px) {
    aspect-ratio: 9/16;
    height: 90%;
    max-height: 800px;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  }
`;

export const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const VideoOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.8) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  pointer-events: none;

  @media (min-width: 992px) {
    display: none; /* Overlay details moved to desktop sidebar */
  }
`;

export const MobileOverlayContent = styled.div`
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 80%;
  margin-bottom: 24px; /* Space for CTA buttons */
`;

export const ExpertMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

export const Avatar = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  object-fit: cover;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
`;

export const NameText = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
`;

export const CategoryTag = styled.span`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(8px);
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const TitleText = styled.h4`
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
`;

export const CaptionText = styled.p`
  font-size: 13px;
  margin: 0;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
`;

// Sidebar for desktop
export const DesktopSidebar = styled.div`
  display: none;

  @media (min-width: 992px) {
    display: flex;
    flex-direction: column;
    background: #121214;
    border-left: 1px solid #27272a;
    padding: 24px;
    height: 100%;
    overflow-y: auto;
  }
`;

export const DesktopHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
`;

export const DesktopInfo = styled.div`
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SectionDivider = styled.hr`
  border: 0;
  border-top: 1px solid #27272a;
  margin: 18px 0;
`;

// Action buttons (Floating on mobile, inline on desktop)
export const ActionColumn = styled.div`
  position: absolute;
  right: 12px;
  bottom: 120px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 10;
  align-items: center;

  @media (min-width: 992px) {
    position: static;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    margin-bottom: 18px;
  }
`;

export const ActionButton = styled.button`
  background: rgba(18, 18, 20, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${props => props.active ? "#ef4444" : "#ffffff"};
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);

  &:hover {
    transform: scale(1.1);
    background: rgba(255,255,255,0.15);
  }

  svg {
    width: 22px;
    height: 22px;
  }

  @media (min-width: 992px) {
    flex-direction: column;
    background: none;
    border: none;
    width: auto;
    height: auto;
    border-radius: 0;
    box-shadow: none;
    gap: 6px;
    font-size: 12px;
    color: #a1a1aa;

    span {
      font-weight: 500;
    }
  }
`;

export const ActionLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #ffffff;
  margin-top: 4px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);

  @media (min-width: 992px) {
    color: #a1a1aa;
    text-shadow: none;
    margin-top: 0;
  }
`;

// Comments list container
export const CommentsSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  overflow: hidden;
`;

export const CommentsHeader = styled.h3`
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 12px;
  color: #f4f4f5;
`;

export const CommentsList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 4px;
`;

export const CommentRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 8px 0;
`;

export const CommentAvatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
`;

export const CommentContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const CommentName = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #f4f4f5;
`;

export const CommentText = styled.p`
  font-size: 13px;
  color: #d4d4d8;
  margin: 0;
  line-height: 1.4;
`;

export const CommentInputRow = styled.form`
  display: flex;
  gap: 10px;
  margin-top: 14px;
  align-items: center;
`;

export const CommentInput = styled.input`
  flex: 1;
  background: #27272a;
  border: 1px solid #3f3f46;
  border-radius: 99px;
  padding: 10px 16px;
  color: #ffffff;
  font-size: 13px;

  &:focus {
    outline: none;
    border-color: #ffd23f;
  }
`;

export const CommentSubmitButton = styled.button`
  background: #ffd23f;
  border: none;
  color: #000080;
  font-weight: 700;
  font-size: 13px;
  padding: 10px 18px;
  border-radius: 99px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }
`;

// CTA Buttons Row
export const CtaRow = styled.div`
  position: absolute;
  bottom: 24px;
  left: 20px;
  right: 80px; /* Leave space for ActionColumn */
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  z-index: 10;

  @media (min-width: 992px) {
    position: static;
    grid-template-columns: 1fr;
    gap: 12px;
    margin-top: auto;
    width: 100%;
  }
`;

export const CtaButton = styled.button`
  background: ${props => props.variant === "primary" ? "linear-gradient(135deg, #ffd23f, #f4c542)" : "rgba(255, 255, 255, 0.1)"};
  border: 1px solid ${props => props.variant === "primary" ? "transparent" : "rgba(255, 255, 255, 0.2)"};
  backdrop-filter: blur(10px);
  color: ${props => props.variant === "primary" ? "#000080" : "#ffffff"};
  padding: 10px 6px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    transform: translateY(-2px);
    background: ${props => props.variant === "primary" ? "#ffd23f" : "rgba(255, 255, 255, 0.2)"};
  }

  @media (min-width: 992px) {
    flex-direction: row;
    padding: 14px;
    font-size: 13px;
    border-radius: 14px;
    gap: 10px;
  }
`;

// Helper overlays
export const SoundToggle = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  cursor: pointer;
  z-index: 10;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,0.5);
  z-index: 5;
`;

export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: #ffd23f;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
