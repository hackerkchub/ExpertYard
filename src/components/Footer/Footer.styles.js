// src/components/Footer/Footer.styles.js
import styled from "styled-components";

/* MAIN FOOTER WRAPPER */
export const Wrapper = styled.footer`
  width: 100%;
  padding: 45px 20px;
  text-align: center;

  /* ⚡ Cyber Neon Blue Animated BG */
  background: linear-gradient(135deg, #001a33, #003d80, #0066ff);
  background-size: 400% 400%;
  animation: neonFlow 12s ease infinite;

  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  border-top: 1px solid rgba(0, 153, 255, 0.5);
  box-shadow: 0 -8px 40px rgba(0, 140, 255, 0.3);

  @keyframes neonFlow {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

/* TOP CATEGORY LINKS */
export const TopLinks = styled.div`
  max-width: 1100px;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 15px;
  justify-content: center;
  line-height: 1.9;
`;

export const LinkItem = styled.span`
  font-size: 15px;
  cursor: pointer;
  color: #ffffff;
  opacity: 0.95;

  &:hover {
    color: #66b3ff;
  }

  &::after {
    content: " | ";
    opacity: 0.4;
    color: #ccc;
  }

  &:last-child::after {
    content: "";
  }
`;

/* MID LINKS */
export const MiddleLinks = styled.div`
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  justify-content: center;
`;

export const SmallLink = styled.span`
  font-size: 14px;
  cursor: pointer;
  color: #ffffff;
  opacity: 0.85;

  &:hover {
    color: #66b3ff;
    opacity: 1;
  }

  &::after {
    content: " | ";
    opacity: 0.4;
    color: #ccc;
  }

  &:last-child::after {
    content: "";
  }
`;

/* COPYRIGHT SECTION */
export const Copy = styled.div`
  margin-top: 28px;
  font-size: 14px;
  color: #ffffff;
  opacity: 0.9;
`;

export const Brand = styled.span`
  font-weight: 600;
  color: #66b3ff;
`;
