import styled, { keyframes } from "styled-components";

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 24px, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

export const HeroSection = styled.section`
  --hero-shadow: 0 26px 60px rgba(0, 0, 128, 0.18);

  position: relative;
  overflow: hidden;
  border-radius: 32px;
  min-height: 320px;
  padding: 0;
  background:
    radial-gradient(circle at 78% 28%, rgba(255, 213, 74, 0.18), transparent 22%),
    radial-gradient(circle at 75% 42%, rgba(59, 130, 246, 0.35), transparent 35%),
    linear-gradient(135deg, #000080 0%, #02005c 58%, #01033f 100%);
  color: #ffffff;
  box-shadow: var(--hero-shadow);
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 1180px) {
    min-height: auto;
  }

  @media (max-width: 767px) {
    border-radius: 26px;
    min-height: auto;
  }
`;

export const HeroBackdrop = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  background:
    radial-gradient(circle at 78% 34%, rgba(255, 214, 102, 0.14), transparent 18%),
    radial-gradient(circle at 84% 56%, rgba(129, 189, 255, 0.12), transparent 22%);

  &::before {
    content: "";
    position: absolute;
    inset: -22% auto auto -8%;
    width: 58%;
    height: 150%;
    border-radius: 42%;
    border: 1px solid rgba(255, 255, 255, 0.08);
    opacity: 0.55;
    transform: rotate(-10deg);
  }

  &::after {
    content: "";
    position: absolute;
    inset: auto;
    border-radius: 999px;
    opacity: 0.45;
  }

  &::after {
    top: 22%;
    left: -4%;
    width: 38%;
    height: 1px;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(141, 199, 255, 0.5), rgba(255, 255, 255, 0));
    box-shadow: 0 0 18px rgba(141, 199, 255, 0.22);
    transform: rotate(-10deg);
  }

  @media (max-width: 767px) {
    &::before,
    &::after {
      opacity: 0.3;
    }
  }
`;

export const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  min-height: 320px;
  padding: 26px 55px 18px 0;

  @media (max-width: 1180px) {
    min-height: 318px;
    padding: 24px 34px 18px 0;
  }

  @media (max-width: 767px) {
    display: flex;
    flex-direction: column;
    min-height: auto;
    padding: 16px 18px 18px;
  }
`;

export const HeroCopy = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  min-width: 0;
  width: 56%;
  max-width: 720px;
  padding-left: 70px;
  padding-top: 2px;

  @media (max-width: 767px) {
    width: 100%;
    max-width: 100%;
    padding-left: 0;
    padding-top: 0;
  }
`;

export const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  margin-bottom: 10px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.92);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
  opacity: 0;
  animation: ${fadeUp} 0.7s ease forwards;
  animation-delay: 0.02s;

  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ffd54a;
    box-shadow: 0 0 14px rgba(255, 213, 74, 0.45);
    flex-shrink: 0;
  }

  @media (max-width: 767px) {
    margin-bottom: 8px;
    font-size: 0.72rem;
  }
`;

export const HeroTitle = styled.h1`
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  font-size: clamp(34px, 2.55vw, 40px);
  line-height: 1.06;
  letter-spacing: -0.03em;
  font-weight: 800;
  white-space: nowrap;
  position: relative;

  @media (max-width: 767px) {
    font-size: clamp(28px, 7.2vw, 32px);
    line-height: 1.1;
    white-space: normal;
  }
`;

export const HeroTitleLine = styled.span`
  display: block;
  color: #ffffff;
  opacity: 0;
  animation: ${fadeUp} 0.7s ease forwards;
  animation-delay: ${(props) => props.$delay || "0s"};
`;

export const HeroGradientWord = styled.span`
  color: #ffd54a;
  opacity: 0;
  animation: ${fadeUp} 0.7s ease forwards;
  animation-delay: ${(props) => props.$delay || "0s"};
`;

export const HeroTitleAccent = styled.span`
  width: 88px;
  height: 4px;
  margin-top: 8px;
  border-radius: 999px;
  background: linear-gradient(90deg, #ffd54a 0%, rgba(255, 213, 74, 0.28) 100%);
  box-shadow: 0 8px 18px rgba(255, 213, 74, 0.18);
  opacity: 0;
  animation: ${fadeUp} 0.7s ease forwards;
  animation-delay: 0.28s;
`;

export const HeroSubtitle = styled.p`
  max-width: 520px;
  margin: 10px 0 0;
  color: rgba(255, 255, 255, 0.84);
  font-size: clamp(16px, 1.5vw, 18px);
  line-height: 1.45;
  font-weight: 500;
  opacity: 0;
  animation: ${fadeUp} 0.7s ease forwards;
  animation-delay: 0.3s;

  @media (max-width: 767px) {
    margin-top: 8px;
    max-width: 100%;
    line-height: 1.45;
  }
`;

export const HeroHighlight = styled.div`
  margin-top: 8px;
  color: rgba(255, 229, 148, 0.96);
  font-size: 0.88rem;
  font-weight: 700;
  letter-spacing: 0.01em;
  opacity: 0;
  animation: ${fadeUp} 0.7s ease forwards;
  animation-delay: 0.38s;

  @media (max-width: 767px) {
    font-size: 0.84rem;
    line-height: 1.5;
  }
`;

export const HeroSearchArea = styled.div`
  position: relative;
  z-index: 3;
  width: 58%;
  max-width: min(650px, calc(100% - 660px));
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  margin-left: 70px;
  margin-top: 14px;

  @media (max-width: 1180px) {
    max-width: min(610px, calc(100% - 560px));
  }

  @media (max-width: 980px) {
    width: calc(100% - 120px);
    max-width: 520px;
  }

  @media (max-width: 767px) {
    width: 100%;
    max-width: 100%;
    margin-left: 0;
    margin-top: 12px;
  }
`;

export const SearchForm = styled.form`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 58px;
  height: 58px;
  padding: 6px 6px 6px 14px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.74);
  box-shadow:
    0 18px 36px rgba(0, 0, 0, 0.18),
    0 0 0 1px rgba(255, 255, 255, 0.18);
  opacity: 0;
  animation: ${fadeUp} 0.7s ease forwards;
  animation-delay: 0.34s;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

  &:hover,
  &:focus-within {
    transform: translateY(-1px);
    box-shadow:
      0 22px 40px rgba(0, 0, 0, 0.2),
      0 0 24px rgba(255, 214, 102, 0.14);
  }

  @media (max-width: 767px) {
    max-width: 100%;
    min-height: 56px;
    height: 56px;
    padding: 6px;
    gap: 10px;
    border-radius: 16px;
  }
`;

export const SearchIconWrap = styled.span`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: #3150bf;
  background: linear-gradient(180deg, rgba(0, 0, 128, 0.08), rgba(0, 0, 128, 0.03));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
  font-size: 1rem;

  @media (max-width: 767px) {
    width: 40px;
    height: 40px;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #18233d;
  font-size: 16px;
  font-weight: 500;

  &::placeholder {
    color: #8c95aa;
  }
`;

export const SearchButton = styled.button`
  border: 0;
  width: 130px;
  min-width: 130px;
  height: 46px;
  padding: 0 16px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #ffe27a 0%, #ffcb3c 100%);
  color: #07104f;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(255, 206, 71, 0.28);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    filter 0.25s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 16px 28px rgba(255, 206, 71, 0.34);
    filter: saturate(1.05);
  }

  @media (max-width: 767px) {
    min-width: 48px;
    height: 40px;
    width: 48px;
    padding: 0 14px;
    border-radius: 12px;
  }
`;

export const SearchButtonText = styled.span`
  font-size: 0.95rem;

  @media (max-width: 767px) {
    display: none;
  }
`;

export const PillRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  opacity: 0;
  animation: ${fadeUp} 0.7s ease forwards;
  animation-delay: 0.42s;
`;

export const HeroPopularLabel = styled.span`
  color: rgba(255, 255, 255, 0.78);
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  margin-right: 2px;
`;

export const PillButton = styled.button`
  border: 1px solid rgba(255, 224, 123, 0.2);
  min-height: 40px;
  padding: 10px 18px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: #f6f8ff;
  font-size: clamp(14px, 1.15vw, 15px);
  font-weight: 600;
  letter-spacing: 0.01em;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    background 0.25s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(255, 224, 123, 0.45);
    background: rgba(255, 255, 255, 0.14);
  }
`;

export const HeroVisual = styled.div`
  position: absolute;
  right: 50px;
  bottom: -4px;
  z-index: 1;
  width: 54%;
  max-width: 650px;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  pointer-events: none;
  isolation: isolate;

  @media (max-width: 1180px) {
    right: 36px;
    width: 48%;
    max-width: 500px;
  }

  @media (max-width: 767px) {
    position: relative;
    right: auto;
    bottom: auto;
    z-index: 1;
    width: 100%;
    max-width: 340px;
    height: auto;
    margin: 18px auto 0;
    pointer-events: auto;
  }
`;

export const VisualOrb = styled.div`
  position: absolute;
  inset: 44% auto auto 52%;
  width: min(22vw, 260px);
  aspect-ratio: 1;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background:
    radial-gradient(circle at 50% 50%, rgba(120, 188, 255, 0.18) 0%, rgba(120, 188, 255, 0.06) 34%, rgba(120, 188, 255, 0) 62%),
    radial-gradient(circle at 50% 50%, rgba(255, 217, 111, 0.1) 0%, rgba(255, 217, 111, 0) 72%);
  filter: drop-shadow(0 0 28px rgba(93, 168, 255, 0.2));

  &::before,
  &::after {
    content: "";
    position: absolute;
    inset: 50%;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid rgba(164, 209, 255, 0.24);
  }

  &::before {
    width: 78%;
    height: 78%;
    box-shadow: 0 0 20px rgba(91, 176, 255, 0.14);
  }

  &::after {
    width: 98%;
    height: 98%;
    border-color: rgba(255, 224, 123, 0.22);
  }

  @media (max-width: 1180px) {
    width: min(26vw, 240px);
  }

  @media (max-width: 767px) {
    inset: 48% auto auto 50%;
    width: min(68vw, 220px);
  }
`;

export const ImageShell = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  background: transparent;

  &::before {
    content: "";
    position: absolute;
    right: 20px;
    bottom: 20px;
    width: 520px;
    height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.35), transparent 65%);
    filter: blur(18px);
    z-index: -1;
  }

  @media (max-width: 767px) {
    height: auto;

    &::before {
      right: 50%;
      bottom: 18px;
      width: 250px;
      height: 160px;
      transform: translateX(50%);
    }
  }
`;

export const HeroImage = styled.img`
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 1;
  display: block;
  width: 100%;
  max-width: 620px;
  height: auto;
  border-radius: 0;
  object-fit: contain;
  object-position: bottom right;
  filter:
    drop-shadow(0 18px 35px rgba(0, 0, 0, 0.35))
    saturate(1.02);
  transform: translateY(-18px);
  background: transparent;
  mask-image: radial-gradient(circle at 50% 62%, #000 58%, transparent 88%);
  -webkit-mask-image: radial-gradient(circle at 50% 62%, #000 58%, transparent 88%);
  opacity: 0;
  animation: ${fadeUp} 0.8s ease forwards;
  animation-delay: 0.18s;

  @media (max-width: 767px) {
    position: relative;
    width: 100%;
    height: auto;
    max-width: 340px;
    max-height: none;
    transform: none;
    mask-image: none;
    -webkit-mask-image: none;
  }
`;
