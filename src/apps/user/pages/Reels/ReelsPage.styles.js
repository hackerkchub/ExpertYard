import styled, { createGlobalStyle } from "styled-components";

export const ReelsPageGlobalStyle = createGlobalStyle`
  html.g9-reels-page-active,
  body.g9-reels-page-active {
    overflow: hidden;
    overscroll-behavior-y: none;
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 100vw;
  --reels-header-offset: 70px;
  height: calc(100svh - var(--reels-header-offset));
  min-height: calc(100svh - var(--reels-header-offset));
  background:
    radial-gradient(circle at 16% 0%, rgba(0, 61, 145, 0.28), transparent 32vw),
    linear-gradient(135deg, #05070f 0%, #09090b 52%, #07111f 100%);
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  @media (max-width: 767px) {
    --reels-header-offset: calc(64px + env(safe-area-inset-top, 0px));
    height: calc(100dvh - var(--reels-header-offset));
    min-height: calc(100dvh - var(--reels-header-offset));
  }
`;

export const ReelsFeed = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  overscroll-behavior-y: contain;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  @media (min-width: 768px) {
    padding: 18px 22px;
  }

  @media (min-width: 1024px) {
    padding: 0 clamp(28px, 4vw, 76px);
  }
`;

export const ReelWrapper = styled.div`
  width: 100%;
  max-width: 100vw;
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  box-sizing: border-box;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  display: flex;
  justify-content: center;
  position: relative;
  overflow: hidden;

  @media (min-width: 768px) {
    height: 100%;
    min-height: 100%;
    align-items: center;
  }

  @media (min-width: 992px) {
    display: grid;
    grid-template-columns: minmax(330px, 520px) minmax(300px, 380px);
    height: 100%;
    min-height: 100%;
    max-height: 100%;
    width: min(100%, 980px);
    max-width: 980px;
    margin: 0 auto;
    gap: 20px;
  }

  @media (min-width: 1200px) {
    grid-template-columns: minmax(360px, 540px) minmax(320px, 420px);
    width: min(100%, 1060px);
    max-width: 1060px;
    gap: 24px;
  }
`;

export const PlayerSection = styled.div`
  flex: 1;
  height: 100%;
  min-width: 0;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  @media (min-width: 768px) {
    flex: 0 1 auto;
    width: min(100%, calc((100svh - 58px) * 0.5625));
    max-width: calc(100vw - 44px);
  }

  @media (min-width: 992px) {
    width: 100%;
  }
`;

export const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000000;
  overflow: hidden;

  @media (min-width: 768px) {
    aspect-ratio: 9 / 16;
    width: auto;
    height: min(100%, calc(100svh - 58px));
    max-height: 860px;
    max-width: min(100%, calc((100svh - 58px) * 0.5625));
    border-radius: 22px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.55);
  }

  @media (min-width: 1200px) {
    height: min(100%, calc(100svh - 48px));
    max-height: 900px;
    max-width: min(100%, calc((100svh - 48px) * 0.5625));
  }
`;

export const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #000000;
`;

export const PlayToggleOverlay = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 9;
  width: clamp(64px, 16vw, 92px);
  height: clamp(64px, 16vw, 92px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.52);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 18px 46px rgba(0, 0, 0, 0.34);
  backdrop-filter: blur(12px);
  pointer-events: none;
  opacity: ${props => props.$visible ? 1 : 0};
  transform: translate(-50%, -50%) scale(${props => props.$visible ? 1 : 0.84});
  transition: opacity 180ms ease, transform 180ms ease;

  svg {
    width: 42%;
    height: 42%;
    margin-left: ${props => props.$persistent ? "3px" : "0"};
    filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.45));
  }
`;

export const VideoOverlay = styled.div`
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to bottom, rgba(0, 0, 0, 0.18) 0%, rgba(0, 0, 0, 0.04) 34%, rgba(0, 0, 0, 0.76) 100%),
    linear-gradient(to right, rgba(0, 0, 0, 0.4) 0%, transparent 58%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  pointer-events: none;

  @media (min-width: 992px) {
    display: none;
  }
`;

export const MobileOverlayContent = styled.div`
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: min(74%, calc(100vw - 104px));
  margin-bottom: 82px;

  @media (max-width: 767px) {
    margin-bottom: 70px;
  }
`;

export const ExpertMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: fit-content;
  max-width: 100%;

  > div {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
`;

export const Avatar = styled.img`
  width: 42px;
  height: 42px;
  min-width: 42px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  object-fit: cover;
  cursor: pointer;

  @media (min-width: 768px) {
    width: 48px;
    height: 48px;
    min-width: 48px;
  }
`;

export const AvatarFallback = styled.div`
  width: 42px;
  height: 42px;
  min-width: 42px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1d4ed8, #0f172a);
  color: #ffffff;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;

  @media (min-width: 768px) {
    width: 48px;
    height: 48px;
    min-width: 48px;
    font-size: 14px;
  }
`;

export const NameText = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: #ffffff !important;
   -webkit-text-fill-color: #fff !important;
  text-shadow: 0 2px 4px rgba(255, 254, 254, 0.55);
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const CategoryTag = styled.span`
  background: rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(8px);
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: #ffffff;
  width: fit-content;
`;

export const TitleText = styled.h4`
  font-size: 15px;
  font-weight: 700;
  margin: 0;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  overflow-wrap: anywhere;
`;

export const CaptionText = styled.p`
  font-size: 13px;
  margin: 0;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.55);
`;

export const DesktopSidebar = styled.div`
  display: none;

  @media (min-width: 992px) {
    display: flex;
    flex-direction: column;
    min-width: 0;
    height: min(100%, calc(100svh - 58px));
    max-height: 860px;
    overflow-y: auto;
    background: rgba(12, 17, 28, 0.86);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 22px;
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.38);
    backdrop-filter: blur(16px);
    padding: clamp(18px, 2vw, 24px);
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.24) transparent;
  }
`;

export const DesktopHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
  min-width: 0;
`;

export const DesktopInfo = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

export const SectionDivider = styled.hr`
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin: 16px 0;
`;

export const ActionColumn = styled.div`
  position: absolute;
  right: 12px;
  bottom: 102px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  z-index: 10;
  align-items: center;

  @media (max-width: 767px) {
    bottom: 82px;
  }

  @media (min-width: 992px) {
    display: none !important;
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
  color: ${props => props.active ? "#ff5a72" : "#ffffff"};
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s, border-color 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: scale(1.08);
    background: rgba(255, 255, 255, 0.15);
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  svg {
    width: 22px;
    height: 22px;
  }
`;

export const ActionLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  margin-top: -8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.65);
`;

export const CommentsList = styled.div`
  flex: 1;
  min-height: 0;
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
  min-width: 0;
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
  overflow-wrap: anywhere;
`;

export const CommentInputRow = styled.form`
  display: flex;
  gap: 10px;
  margin-top: 14px;
  align-items: center;
  flex-shrink: 0;
`;

export const CommentInput = styled.input`
  flex: 1;
  min-width: 0;
  background: #27272a;
  border: 1px solid #3f3f46;
  border-radius: 99px;
  padding: 10px 16px;
  color: #ffffff;
  font-size: 13px;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

export const CommentSubmitButton = styled.button`
  background: #ffffff;
  border: none;
  color: #000080;
  font-weight: 800;
  font-size: 13px;
  padding: 10px 18px;
  border-radius: 99px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
`;

export const MobileCommentsBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 20000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(0, 0, 0, 0.48);

  @media (min-width: 992px) {
    display: none;
  }
`;

export const MobileCommentsPanel = styled.div`
  width: 100%;
  max-width: 520px;
  height: min(72dvh, calc(100dvh - 112px));
  background: #121214;
  border-radius: 20px 20px 0 0;
  border: 1px solid #27272a;
  padding: 16px;
  padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 82px);
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 767px) {
    height: min(68dvh, calc(100dvh - 96px));
    padding-bottom: 16px;
    border-radius: 20px;
  }
`;

export const MobileCommentsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  color: #f4f4f5;

  button {
    background: #27272a;
    border: 1px solid #3f3f46;
    border-radius: 999px;
    color: #ffffff;
    padding: 8px 12px;
    cursor: pointer;
  }
`;

export const CtaRow = styled.div`
  position: absolute;
  left: 12px;
  right: 68px;
  bottom: 14px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
  z-index: 10;

  @media (max-width: 767px) {
    bottom: 12px;
    left: 12px;
    right: 68px;
  }

  @media (min-width: 992px) {
    display: none !important;
  }
`;

export const CtaButton = styled.button`
  background: ${props => props.variant === "primary" ? "linear-gradient(135deg, #ffffff, #dbeafe)" : "rgba(255, 255, 255, 0.1)"};
  border: 1px solid ${props => props.variant === "primary" ? "rgba(255, 255, 255, 0.65)" : "rgba(255, 255, 255, 0.18)"};
  backdrop-filter: blur(10px);
  color: ${props => props.variant === "primary" ? "#000080" : "#ffffff"};
  padding: 9px 5px;
  border-radius: 14px;
  font-size: 10.5px;
  font-weight: 800;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s, border-color 0.2s;
  min-width: 0;

  svg {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
  }

  &:hover {
    transform: translateY(-2px);
    background: ${props => props.variant === "primary" ? "#ffffff" : "rgba(255, 255, 255, 0.18)"};
  }
`;

export const SoundToggle = styled.button`
  position: absolute;
  top: max(16px, env(safe-area-inset-top));
  right: 16px;
  background: rgba(0, 0, 0, 0.48);
  border: 1px solid rgba(255, 255, 255, 0.16);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  cursor: pointer;
  z-index: 10;
  backdrop-filter: blur(10px);

  @media (max-width: 767px) {
    display: none;
  }
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 5;
`;

export const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.12);
  border-left-color: #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;