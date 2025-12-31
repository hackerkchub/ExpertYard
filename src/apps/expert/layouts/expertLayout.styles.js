import styled from "styled-components";

export const LayoutWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #020617 100%);
  position: relative;
  overflow-x: hidden;

  /* Premium Loading Animation */
  @keyframes shimmer {
    0% { background-position: -468px 0; }
    100% { background-position: 468px 0; }
  }
`;

export const ContentWrapper = styled.main`
  /* DESKTOP: Sidebar + Topbar spacing */
  margin-left: 280px;
  margin-top: 70px;
  flex: 1;
  padding: 32px 32px 40px;
  min-height: calc(100vh - 70px);
  color: #f1f5f9;
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
    margin-top: 65px;
  }

  @media (max-width: 480px) {
    padding: 16px 12px 24px;
  }

  /* Premium Content Container */
  & > * {
    max-width: 100%;
    overflow-x: auto;
  }

  /* Responsive Typography */
  h1 { font-size: clamp(24px, 4vw, 32px); margin-bottom: 20px; }
  h2 { font-size: clamp(20px, 3.5vw, 26px); margin-bottom: 16px; }
  h3 { font-size: clamp(18px, 3vw, 22px); }
`;
