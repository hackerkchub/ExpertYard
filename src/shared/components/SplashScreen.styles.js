import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const progress = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(100%);
  }
`;

export const SplashOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  padding-bottom: calc(24px + env(safe-area-inset-bottom));
  opacity: ${({ $exiting }) => ($exiting ? 0 : 1)};
  background:
    radial-gradient(circle at top, rgba(37, 99, 235, 0.16), transparent 34%),
    linear-gradient(145deg, #ffffff 0%, #f3f4f6 46%, #eef4ff 100%);
  overflow: hidden;
  transition: opacity 220ms ease;

  @media (max-width: 767px) {
    padding: 20px 18px;
    padding-bottom: calc(28px + env(safe-area-inset-bottom));
  }
`;

export const SplashCard = styled.section`
  width: min(440px, 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: #111827;
  animation: ${fadeIn} 520ms ease both;
`;

export const LogoShell = styled.div`
  width: 104px;
  height: 104px;
  border-radius: 28px;
  display: grid;
  place-items: center;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 128, 0.08);
  box-shadow: 0 20px 45px rgba(0, 0, 128, 0.14);
  margin-bottom: 22px;

  img {
    width: 78px;
    height: 78px;
    object-fit: contain;
  }

  @media (max-width: 767px) {
    width: 92px;
    height: 92px;
    border-radius: 24px;
    margin-bottom: 20px;

    img {
      width: 68px;
      height: 68px;
    }
  }
`;

export const AppName = styled.h1`
  margin: 0;
  color: #000080;
  font-size: clamp(30px, 5vw, 44px);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: 0;
`;

export const TrustMessage = styled.p`
  margin: 12px 0 0;
  max-width: 390px;
  color: #1f2937;
  font-size: clamp(15px, 2.4vw, 18px);
  line-height: 1.55;
  font-weight: 600;
`;

export const ReviewLine = styled.p`
  margin: 8px 0 0;
  max-width: 380px;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
`;

export const LoadingRow = styled.div`
  margin-top: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #000080;
  font-size: 13px;
  font-weight: 600;

  @media (max-width: 767px) {
    margin-top: 24px;
  }
`;

export const Spinner = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 3px solid rgba(37, 99, 235, 0.16);
  border-top-color: #2563eb;
  animation: ${spin} 850ms linear infinite;
`;

export const ProgressTrack = styled.div`
  width: min(280px, 78vw);
  height: 4px;
  margin-top: 18px;
  border-radius: 999px;
  background: rgba(0, 0, 128, 0.1);
  overflow: hidden;

  &::before {
    content: "";
    display: block;
    width: 58%;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, transparent, #2563eb, transparent);
    animation: ${progress} 1.25s ease-in-out infinite;
  }
`;

export const OfflinePanel = styled.div`
  width: min(360px, 100%);
  margin-top: 26px;
  padding: 18px;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.1);

  h2 {
    margin: 0 0 8px;
    color: #111827;
    font-size: 18px;
    line-height: 1.25;
  }

  p {
    margin: 0;
    color: #6b7280;
    font-size: 14px;
    line-height: 1.5;
  }
`;

export const RetryButton = styled.button`
  min-height: 44px;
  margin-top: 16px;
  padding: 10px 22px;
  border: 0;
  border-radius: 999px;
  background: #000080;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 12px 22px rgba(0, 0, 128, 0.2);

  &:hover {
    background: #2563eb;
  }
`;
