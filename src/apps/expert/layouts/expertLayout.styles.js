import styled from "styled-components";

export const LayoutWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
overflow: hidden;
  background: #F3F2EF; 

   /*scrollbar hide*/
    & *::-webkit-scrollbar-thumb {
    background: #F3F2EF !important;
  }

  & *::-webkit-scrollbar-track {
    background: transparent !important;
  }

  /* Premium Loading Animation */
  @keyframes shimmer {
    0% { background-position: -468px 0; }
    100% { background-position: 468px 0; }
  }
`;

export const ContentWrapper = styled.main`
  /* DESKTOP: Sidebar + Topbar spacing */
  margin-top: 70px;
  margin-left: 280px;
  flex: 1;
  display: flex;
  flex-direction: column;
   height: calc(100vh - 70px);   
  overflow-y: auto;
  padding: 24px;
  min-height: calc(100vh - 70px);
  width: calc(100% - 260px);
   box-sizing: border-box;
  color: #f1f5f9;
    overflow-y: auto;
  overflow-x: hidden;
   background: #F3F2EF;  
  color: #1D2226;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);


  /* TABLET: Compact layout */
  @media (max-width: 1024px) {
    margin-left: 280px;
    padding: 28px 24px 32px;
  }

  /* MOBILE: Full width, no sidebar margin */
  @media (max-width: 1023px) {
    margin-left: 0;
    padding: 24px 20px 32px;
  }

  @media (max-width: 768px) {
    padding: 20px 16px 28px;
     width: 100%;
    margin-top: 60px;
  }

  @media (max-width: 480px) {
    padding: 16px 12px 24px;
    margin-top: 50px;
  }

  /* Premium Content Container */
  & > * {
    max-width: 100%;
    overflow-x: hidden;
  }

  /* Responsive Typography */
  h1 { font-size: clamp(24px, 4vw, 32px); margin-bottom: 20px; }
  h2 { font-size: clamp(20px, 3.5vw, 26px); margin-bottom: 16px; }
  h3 { font-size: clamp(18px, 3vw, 22px); }

  &::-webkit-scrollbar {
  width: 0px !important;
  height: 0px !important;
}

`;
