// shared/styles/GlobalStyles.js
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: "Inter", sans-serif;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    overflow-x: hidden;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  img {
    max-width: 100%;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 5px;
  }
`;

export default GlobalStyles;
