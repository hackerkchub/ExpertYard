import styled from "styled-components";

// -- Sidebar Width Constant --
const SIDEBAR_WIDTH = "260px";
const TOPBAR_HEIGHT = "70px";

export const LayoutWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  overflow-x: hidden; /* Prevent horizontal scroll, allow native vertical window scroll */
  background:
    radial-gradient(circle at top left, rgba(63, 81, 181, 0.08), transparent 28%),
    linear-gradient(180deg, #f7f9fc 0%, #eef3f8 100%);

  /* Global Scrollbar Reset for modern UI */
  & * {
    scrollbar-width: thin;
    scrollbar-color: #d1d5db transparent;
  }

  & *::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  & *::-webkit-scrollbar-track {
    background: transparent;
  }

  & *::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
  }

  /* Shimmer Loading Animation */
  @keyframes shimmer {
    0% { background-position: -468px 0; }
    100% { background-position: 468px 0; }
  }
`;

export const ContentWrapper = styled.main`
  /* --- DESKTOP VIEW --- */
  flex: 1;
  display: flex;
  flex-direction: column;
  
  /* Sidebar width ke hisaab se automatic margin aur width handle hogi */
  margin-top: calc(${TOPBAR_HEIGHT} + env(safe-area-inset-top, 0px));
  margin-left: ${SIDEBAR_WIDTH};
  width: calc(100% - ${SIDEBAR_WIDTH});
  
  /* Let content grow and scroll naturally at body/window level */
  min-height: calc(100vh - (${TOPBAR_HEIGHT} + env(safe-area-inset-top, 0px)));
  min-height: calc(100dvh - (${TOPBAR_HEIGHT} + env(safe-area-inset-top, 0px)));
  height: auto;
  
  padding: clamp(16px, 2.2vw, 28px);
  box-sizing: border-box;
  background: transparent;
  color: #1D2226;
  
  /* Standard overflow behavior */
  overflow-y: visible;
  overflow-x: hidden;
  
  transition: all 0.3s ease-in-out;

  /* --- TABLET VIEW (Up to 1024px) --- */
  @media (max-width: 1024px) {
    /* Tablet par sidebar thoda chota ya toggle layout ho sakta hai */
    margin-left: 240px; 
    width: calc(100% - 240px);
    padding: 20px;
  }

  /* --- LARGE MOBILE & SMALL TABLETS (Up to 991px) --- */
  @media (max-width: 991px) {
    margin-left: 0; /* Sidebar niche overlay ya drawer me shift hoga */
    width: 100%;
    padding: 18px 16px calc(88px + env(safe-area-inset-bottom, 0px));
  }

  /* --- MOBILE VIEW (Up to 768px) --- */
  @media (max-width: 768px) {
    margin-top: calc(64px + env(safe-area-inset-top, 0px));
    height: auto;
    min-height: calc(100vh - (64px + env(safe-area-inset-top, 0px)));
    min-height: calc(100dvh - (64px + env(safe-area-inset-top, 0px)));
    padding: 16px 14px calc(88px + env(safe-area-inset-bottom, 0px));
  }

  /* --- SMALL MOBILE (Up to 480px) --- */
  @media (max-width: 480px) {
    margin-top: calc(64px + env(safe-area-inset-top, 0px));
    height: auto;
    min-height: calc(100vh - (64px + env(safe-area-inset-top, 0px)));
    min-height: calc(100dvh - (64px + env(safe-area-inset-top, 0px)));
    padding: 12px 12px calc(84px + env(safe-area-inset-bottom, 0px));
  }

  /* Content inside children constraint */
  & > * {
    max-width: 100%;
    overflow-wrap: break-word;
  }

  & > section,
  & > div {
    min-width: 0;
  }

  /* Responsive Typography using CSS Clamp */
  h1 { 
    font-size: clamp(22px, 5vw, 30px); 
    margin-bottom: 20px; 
    font-weight: 600;
  }
  h2 { 
    font-size: clamp(18px, 4vw, 24px); 
    margin-bottom: 16px; 
    font-weight: 600;
  }
  h3 { 
    font-size: clamp(16px, 3.5vw, 20px); 
    margin-bottom: 12px;
    font-weight: 500;
  }

  /* Content Wrapper scrollbar hide (if needed) */
  &::-webkit-scrollbar {
    width: 0px !important;
    height: 0px !important;
  }
  scrollbar-width: none; /* Firefox */

  &.immersive-inquiry-layout {
    height: calc(100vh - (${TOPBAR_HEIGHT} + env(safe-area-inset-top, 0px)));
    height: calc(100dvh - (${TOPBAR_HEIGHT} + env(safe-area-inset-top, 0px)));
    min-height: calc(100vh - (${TOPBAR_HEIGHT} + env(safe-area-inset-top, 0px)));
    min-height: calc(100dvh - (${TOPBAR_HEIGHT} + env(safe-area-inset-top, 0px)));
    overflow-y: hidden;

    @media (max-width: 991px) {
      margin-top: 0;
      margin-left: 0;
      width: 100%;
      height: 100vh;
      height: 100dvh;
      min-height: 100vh;
      min-height: 100dvh;
      padding: env(safe-area-inset-top, 0px) 0 env(safe-area-inset-bottom, 0px);
    }

    @media (max-width: 768px) {
      margin-top: 0;
      height: 100vh;
      height: 100dvh;
      min-height: 100vh;
      min-height: 100dvh;
      padding: env(safe-area-inset-top, 0px) 0 env(safe-area-inset-bottom, 0px);
    }

    @media (max-width: 480px) {
      margin-top: 0;
      height: 100vh;
      height: 100dvh;
      min-height: 100vh;
      min-height: 100dvh;
      padding: env(safe-area-inset-top, 0px) 0 env(safe-area-inset-bottom, 0px);
    }
  }
`;
