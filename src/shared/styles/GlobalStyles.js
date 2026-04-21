// shared/styles/GlobalStyles.js
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root {
    --safe-area-top: env(safe-area-inset-top, 0px);
    --safe-area-right: env(safe-area-inset-right, 0px);
    --safe-area-bottom: env(safe-area-inset-bottom, 0px);
    --safe-area-left: env(safe-area-inset-left, 0px);
    --app-vh: 100dvh;
  }

  html {
    height: 100%;
    -webkit-text-size-adjust: 100%;
    scroll-behavior: smooth;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  *:focus-visible {
    outline: 3px solid rgba(63, 81, 181, 0.2);
    outline-offset: 2px;
  }

  html,
  body,
  #root {
    min-height: 100%;
  }

  body {
    font-family:
      Inter,
      "Segoe UI",
      Roboto,
      "Helvetica Neue",
      Arial,
      sans-serif;
    font-size: 16px;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    overflow-x: hidden;
    text-rendering: optimizeLegibility;
    line-height: 1.55;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  button {
    -webkit-tap-highlight-color: transparent;
  }

  input,
  textarea,
  select {
    color: ${({ theme }) => theme.colors.text};
  }

  input::placeholder,
  textarea::placeholder {
    color: ${({ theme }) => theme.colors.muted};
  }

  img {
    max-width: 100%;
    display: block;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.18;
    letter-spacing: -0.02em;
  }

  h1 {
    font-size: clamp(1.875rem, 2.8vw, 2.625rem);
  }

  h2 {
    font-size: clamp(1.5rem, 2.1vw, 2rem);
  }

  h3 {
    font-size: clamp(1.125rem, 1.5vw, 1.375rem);
  }

  p,
  li,
  label,
  span {
    line-height: 1.6;
  }

  #root {
    isolation: isolate;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(63, 81, 181, 0.45);
    border-radius: 999px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }
`;

export default GlobalStyles;
