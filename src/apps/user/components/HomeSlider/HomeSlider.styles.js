import styled from "styled-components";

/* =========================================================
   FULL-WIDTH, EDGE-TO-EDGE HERO WRAPPER
========================================================= */
export const SliderWrapper = styled.div`
  position: relative;

  /* TRUE full-width bleed */
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  width: 100vw;

  height: 320px;
  overflow: hidden;
  padding: 0 !important;

  @media (max-width: 900px) {
    height: 260px;
  }

  @media (max-width: 600px) {
    height: 220px;
  }
`;


/* =========================================================
   SLIDES CONTAINER
========================================================= */
export const Slides = styled.div`
  display: flex;
  height: 100%;
  transition: transform 0.7s ease;

  /* Prevent awkward shrink */
  flex-shrink: 0;
`;

/* =========================================================
   EACH SLIDE
========================================================= */
export const Slide = styled.div`
  width: 100vw;            /* Ensures each slide covers full width */
  flex-shrink: 0;          /* Never shrink */
  height: 100%;

  background-image: url(${(p) => p.bg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  position: relative;
  filter: brightness(0.55);

  /* Ultra-wide / ultra-short screen fallback */
  @media (max-height: 500px) {
    background-position: center top;
  }
`;

/* =========================================================
   DARK OVERLAY
========================================================= */
export const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.18);
  backdrop-filter: blur(2px);
`;

/* =========================================================
   OVERLAY TEXT (Auto-center on mobile)
========================================================= */
export const Content = styled.div`
  position: absolute;
  bottom: 40px;
  left: 40px;
  color: white;
  z-index: 2;

  max-width: 75%;
  text-shadow: 0px 2px 6px rgba(0,0,0,0.8);

  @media (max-width: 900px) {
    bottom: 28px;
    left: 28px;
    max-width: 80%;
  }

  /* ⭐ Mobile center mode */
  @media (max-width: 600px) {
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    max-width: 90%;
    text-align: center;
  }
`;

export const Title = styled.h2`
  font-size: 32px;
  font-weight: 800;

  @media (max-width: 900px) {
    font-size: 26px;
  }

  @media (max-width: 600px) {
    font-size: 20px;
  }
`;

export const Subtitle = styled.p`
  font-size: 18px;
  margin-top: 6px;
  opacity: 0.95;

  @media (max-width: 900px) {
    font-size: 16px;
  }

  @media (max-width: 600px) {
    font-size: 13px;
  }
`;

/* =========================================================
   DOT INDICATORS
========================================================= */
export const Dots = styled.div`
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;

  display: flex;
  gap: 8px;

  @media (max-width: 600px) {
    bottom: 10px;
    gap: 6px;
  }
`;

export const Dot = styled.div`
  width: ${(p) => (p.active ? "11px" : "8px")};
  height: ${(p) => (p.active ? "11px" : "8px")};

  background: ${(p) =>
    p.active ? "#fff" : "rgba(255,255,255,0.55)"};

  border-radius: 50%;
  cursor: pointer;
  transition: 0.25s;

  @media (max-width: 600px) {
    width: ${(p) => (p.active ? "9px" : "7px")};
    height: ${(p) => (p.active ? "9px" : "7px")};
  }
`;
