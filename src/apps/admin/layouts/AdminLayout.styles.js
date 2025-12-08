import styled from "styled-components";

export const LayoutWrap = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: radial-gradient(circle at 0% 0%, #020617, #020617 40%, #020617 100%);
`;

export const ContentWrap = styled.main`
  flex: 1;
  padding-top: 64px;          /* below Topbar */
  padding-left: 260px;        /* sidebar width */
  padding-right: 24px;
  padding-bottom: 24px;
  transition: 0.25s ease;

  @media (max-width: 768px) {
    padding-left: 16px;
    padding-right: 16px;
  }
`;
