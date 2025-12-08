import styled from "styled-components";

export const Layout = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: #0c1116;
`;

export const MainContainer = styled.div`
  margin-left: ${({ collapsed }) => (collapsed ? "75px" : "260px")};
  padding: 20px;
  width: calc(100% - ${({ collapsed }) => (collapsed ? "75px" : "260px")});
  transition: 0.3s ease;

  @media (max-width: 768px) {
    margin-left: 0;
    width: 100%;
  }

  /* ✅ global text fix */
  color: #ffffff;
`;
