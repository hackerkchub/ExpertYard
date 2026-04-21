import styled, { css } from "styled-components";

import Loader from "../shared/components/Loader/Loader";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ $variant }) =>
    $variant === "app"
      ? css`
          min-height: 100vh;
          padding: 24px;
        `
      : css`
          min-height: 320px;
          padding: 32px 16px;
        `}
`;

export default function RouteFallback({ variant = "page" }) {
  return (
    <Wrapper $variant={variant}>
      <Loader />
    </Wrapper>
  );
}
