import styled, { createGlobalStyle } from "styled-components";

export const ReelsPageGlobalStyle = createGlobalStyle`
  html.g9-reels-page-active,
  body.g9-reels-page-active {
    overflow: hidden;
    overscroll-behavior-y: none;
  }

  body.g9-reels-page-active .desktop-layout-wrapper {
    height: 100svh;
    overflow: hidden;
  }

  body.g9-reels-page-active .home-desktop-shell {
    min-height: 0;
    overflow: hidden;
  }

  body.g9-reels-page-active .home-center-column {
    min-height: 0;
    overflow: hidden;
  }
`;

export const Container = styled.div`
  width: 100%;
  max-width: 100vw;
  --reels-mobile-bottom-nav: 68px;
  --reels-mobile-safe-bottom: calc(env(safe-area-inset-bottom, 0px) + var(--reels-mobile-bottom-nav));
  --reels-mobile-safe-top: env(safe-area-inset-top, 0px);
  height: calc(100svh - var(--reels-header-offset, 56px));
  min-height: calc(100svh - var(--reels-header-offset, 56px));
  background:
    radial-gradient(circle at 16% 0%, rgba(0, 61, 145, 0.28), transparent 32vw),
    linear-gradient(135deg, #05070f 0%, #09090b 52%, #07111f 100%);
  color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  overscroll-behavior: contain;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  @media (max-width: 767px) {
    height: calc(100dvh - var(--reels-header-offset, 56px));
    min-height: calc(100dvh - var(--reels-header-offset, 56px));
  }

  @media (min-width: 768px) {
    --reels-header-offset: 76px;
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

  @media (min-width: 1200px) {
    padding: 24px clamp(28px, 4vw, 76px);
  }

  @media (min-width: 1024px) {
    padding: 0 clamp(28px, 4vw, 76px);
    scroll-padding: 0;
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

  @media (min-width: 1536px) {
    width: min(100%, 1140px);
    max-width: 1140px;
    gap: 28px;
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

  @media (max-width: 360px) {
    width: 58px;
    height: 58px;
  }

  @media (min-width: 992px) {
    width: 78px;
    height: 78px;
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

  @media (max-width: 360px) {
    padding: 16px 14px;
  }

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
  margin-bottom: calc(82px + env(safe-area-inset-bottom, 0px));

  @media (max-width: 767px) {
    margin-bottom: calc(var(--reels-mobile-safe-bottom) + 70px);
  }

  @media (max-width: 360px) {
    gap: 7px;
    max-width: calc(100vw - 98px);
    margin-bottom: calc(var(--reels-mobile-safe-bottom) + 64px);
  }

  @media (min-width: 768px) and (max-width: 991px) {
    max-width: calc(100% - 118px);
    margin-bottom: calc(88px + env(safe-area-inset-bottom, 0px));
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
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  border: 2px solid #ffffff;
  object-fit: cover;
  object-position: center;
  display: block;
  flex-shrink: 0;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

  @media (max-width: 360px) {
    width: 38px;
    height: 38px;
    min-width: 38px;
  }

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
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  border: 2px solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
  background: linear-gradient(135deg, #1d4ed8, #0f172a);
  color: #ffffff;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  cursor: pointer;

  @media (max-width: 360px) {
    width: 38px;
    height: 38px;
    min-width: 38px;
    font-size: 12px;
  }

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
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.55);
  cursor: pointer;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 360px) {
    font-size: 15px;
  }
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
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  overflow-wrap: anywhere;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.55);

  @media (min-width: 768px) {
    -webkit-line-clamp: 3;
  }
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

  @media (min-width: 1200px) {
    height: min(100%, calc(100svh - 48px));
    max-height: 900px;
  }
`;

export const DesktopHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
  min-width: 0;

  > div {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
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
  bottom: calc(102px + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  gap: 14px;
  z-index: 10;
  align-items: center;

  &.reel-actions-sidebar {
    display: none;
  }

  @media (max-width: 360px) {
    right: 8px;
    bottom: calc(96px + env(safe-area-inset-bottom, 0px));
    gap: 10px;
  }

  @media (max-width: 767px) {
    bottom: calc(var(--reels-mobile-safe-bottom) + 82px);
  }

  @media (min-width: 768px) and (max-width: 991px) {
    right: 14px;
    bottom: calc(112px + env(safe-area-inset-bottom, 0px));
  }

  @media (min-width: 992px) {
    position: static;
    width: 100%;
    margin-bottom: 4px;

    &.reel-actions-overlay {
      display: none;
    }

    &.reel-actions-sidebar {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
      align-items: stretch;
    }
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

  @media (max-width: 360px) {
    width: 42px;
    height: 42px;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  @media (min-width: 992px) {
    width: 100%;
    min-height: 44px;
    height: auto;
    border-radius: 14px;
    flex-direction: row;
    gap: 7px;
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.09);
    box-shadow: none;
    color: ${props => props.active ? "#ff5a72" : "#d4d4d8"};
    font-size: 12px;

    span {
      min-width: 0;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &:hover {
      transform: translateY(-1px);
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.16);
    }
  }
`;

export const ActionLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  margin-top: -8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.65);

  @media (min-width: 992px) {
    display: none;
  }
`;

export const CommentsSection = styled.div`
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (min-width: 992px) {
    background: rgba(255, 255, 255, 0.035);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 18px;
    padding: 14px;
  }
`;

export const CommentsHeader = styled.h3`
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 12px;
  color: #f4f4f5;
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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
    height: min(68dvh, calc(100dvh - var(--reels-mobile-safe-bottom) - 96px));
    margin-bottom: var(--reels-mobile-safe-bottom);
    padding-bottom: 16px;
    border-radius: 20px;
  }

  @media (min-width: 768px) and (max-width: 991px) {
    max-width: 640px;
    height: min(68vh, 620px);
    border-radius: 22px 22px 0 0;
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
  bottom: calc(14px + env(safe-area-inset-bottom, 0px));
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
  z-index: 10;

  @media (max-width: 767px) {
    bottom: calc(var(--reels-mobile-safe-bottom) + 12px);
    left: 12px;
    right: 68px;
  }

  @media (min-width: 768px) and (max-width: 991px) {
    left: 24px;
    right: 92px;
    bottom: calc(20px + env(safe-area-inset-bottom, 0px));
    gap: 10px;
  }

  @media (min-width: 992px) {
    position: static;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-top: 16px;
    width: 100%;
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

  @media (max-width: 360px) {
    padding: 8px 4px;
    font-size: 9.5px;

    svg {
      width: 14px;
      height: 14px;
    }
  }

  @media (min-width: 992px) {
    flex-direction: row;
    padding: 12px 10px;
    min-height: 44px;
    font-size: 12px;
    border-radius: 14px;
    gap: 8px;
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

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }

  @media (max-width: 767px) {
    top: calc(var(--reels-mobile-safe-top) + 18px);
    right: 14px;
    width: 42px;
    height: 42px;
    z-index: 30;
    background: rgba(0, 0, 0, 0.58);
    border-color: rgba(255, 255, 255, 0.22);

    svg {
      width: 20px;
      height: 20px;
    }
  }

  @media (min-width: 768px) {
    top: 18px;
    right: 18px;
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
