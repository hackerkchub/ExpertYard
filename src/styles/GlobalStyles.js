// src/styles/GlobalStyle.js
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  /* RESET */
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* ROOT FIX */
  html, body {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden !important;
    background-color: #ffffff;
    -webkit-font-smoothing: antialiased;
  }

  #root {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden !important;
    position: relative;
  }

  img, video, canvas {
    display: block;
    max-width: 100%;
  }

  /* Prevents accidental zoom overflow on small screens */
  body {
    overscroll-behavior-x: none;
  }
`;

export default GlobalStyle;
