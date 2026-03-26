import styled from "styled-components";

// -- Sidebar Width Constant --
const SIDEBAR_WIDTH = "260px";
const TOPBAR_HEIGHT = "70px";

export const LayoutWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden; /* Main window scroll block taaki dashboard smooth scroll ho */
  background: #F3F2EF; 

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
  margin-top: ${TOPBAR_HEIGHT};
  margin-left: ${SIDEBAR_WIDTH};
  width: calc(100% - ${SIDEBAR_WIDTH});
  
  height: calc(100vh - ${TOPBAR_HEIGHT}); 
  min-height: calc(100vh - ${TOPBAR_HEIGHT});
  
  padding: 24px;
  box-sizing: border-box;
  background: #F3F2EF;  
  color: #1D2226;
  
  /* Smooth scrolling behaviour */
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch; 
  
  transition: all 0.3s ease-in-out;

  /* --- TABLET VIEW (Up to 1024px) --- */
  @media (max-width: 1024px) {
    /* Tablet par sidebar thoda chota ya toggle layout ho sakta hai */
    margin-left: 240px; 
    width: calc(100% - 240px);
    padding: 24px;
  }

  /* --- LARGE MOBILE & SMALL TABLETS (Up to 991px) --- */
  @media (max-width: 991px) {
    margin-left: 0; /* Sidebar niche overlay ya drawer me shift hoga */
    width: 100%;
    padding: 20px;
  }

  /* --- MOBILE VIEW (Up to 768px) --- */
  @media (max-width: 768px) {
    margin-top: 60px; /* Chota Header height */
    height: calc(100vh - 60px);
    min-height: calc(100vh - 60px);
    padding: 16px;
  }

  /* --- SMALL MOBILE (Up to 480px) --- */
  @media (max-width: 480px) {
    margin-top: 56px;
    height: calc(100vh - 56px);
    min-height: calc(100vh - 56px);
    padding: 12px;
  }

  /* Content inside children constraint */
  & > * {
    max-width: 100%;
    overflow-wrap: break-word;
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
`;