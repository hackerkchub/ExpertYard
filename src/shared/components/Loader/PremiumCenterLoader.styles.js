import styled, { keyframes } from "styled-components";

const g9Spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const g9DotSequence = keyframes`
  0%, 100% { opacity: 0.25; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-2px); }
`;

export const OverlayWrapper = styled.div`
  position: fixed !important;
  inset: 0 !important;
  top: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  left: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  height: 100dvh !important;
  z-index: 99999 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  margin: 0 !important;
  padding: 0 !important;
  background: rgba(15, 23, 42, 0.10);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  pointer-events: auto;
`;

export const CardContainer = styled.div`
  position: relative !important;
  inset: auto !important;
  margin: 0 !important;
  flex: 0 0 auto;
  opacity: ${({ $exiting }) => ($exiting ? 0 : 1)};
  transform: ${({ $exiting }) => ($exiting ? "scale(0.96)" : "scale(1)")};
  transition: opacity 280ms cubic-bezier(0.22, 1, 0.36, 1),
              transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
`;

export const GlassCard = styled.div`
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.10), 0 2px 8px rgba(0, 0, 0, 0.03);
  border-radius: 24px;
  width: min(210px, 80vw);
  padding: 22px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export const GraphicContainer = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ArcSvg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform-origin: center;
  animation: ${g9Spin} 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
`;

export const CenterLogoWrap = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;

  img {
    width: 32px;
    height: 32px;
    object-fit: contain;
    display: block;
    user-select: none;
  }
`;

export const DotsContainer = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 2px;
  align-items: center;
  justify-content: center;
`;

export const Dot = styled.div`
  width: 6.5px;
  height: 6.5px;
  border-radius: 9999px;
  background: #2563eb;
  animation: ${g9DotSequence} 1.4s infinite;
  animation-delay: ${({ $delay }) => $delay || "0s"};
`;
