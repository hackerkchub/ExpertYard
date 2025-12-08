import styled from "styled-components";

export const LayoutWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: #020617;
`;

export const ContentWrapper = styled.main`
  flex: 1;
  padding-top: 64px;
  padding-left: 260px;
  padding-right: 24px;
  padding-bottom: 24px;
  color: white;

  @media (max-width: 768px) {
    padding-left: 16px;
    padding-right: 16px;
  }
`;
