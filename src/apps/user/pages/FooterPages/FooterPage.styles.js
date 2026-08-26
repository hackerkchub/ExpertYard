import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Page = styled.main`
  --g9-navy: #000080;
  --g9-gold: #ffc107;
  --g9-ink: #111827;
  --g9-muted: #5f6b7a;
  --g9-border: #e5e7eb;
  --g9-bg: #f7f8fc;

  background:
    radial-gradient(circle at 8% 10%, rgba(0, 0, 128, 0.1), transparent 28rem),
    radial-gradient(circle at 92% 18%, rgba(255, 193, 7, 0.13), transparent 24rem),
    var(--g9-bg);
  color: var(--g9-ink);
  padding-bottom: clamp(40px, 7vw, 88px);

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }
  }
`;

export const Hero = styled.section`
  position: relative;
  overflow: hidden;
  color: #ffffff;
  background: linear-gradient(135deg, #000080 0%, #07075c 56%, #030329 100%);
  padding: clamp(32px, 5vw, 56px) clamp(20px, 4vw, 44px) clamp(54px, 6vw, 76px);
  border-radius: 24px;
  margin: 16px auto 0;
  max-width: 1140px;
  width: calc(100% - 32px);
  box-sizing: border-box;
  box-shadow: 0 20px 50px rgba(0, 0, 128, 0.16);

  @media (max-width: 768px) {
    border-radius: 18px;
    width: calc(100% - 24px);
    padding: clamp(24px, 5vw, 36px) clamp(16px, 3vw, 24px) clamp(44px, 6vw, 60px);
  }

  &::before,
  &::after {
    content: "";
    position: absolute;
    border-radius: 999px;
    pointer-events: none;
  }

  &::before {
    width: 340px;
    height: 340px;
    top: -150px;
    right: -90px;
    background: rgba(255, 193, 7, 0.18);
    filter: blur(10px);
  }

  &::after {
    width: 220px;
    height: 220px;
    bottom: -120px;
    left: 12%;
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1120px;
  margin: 0 auto;
  display: grid;
  gap: 24px;
`;

export const Breadcrumb = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;

  a {
    color: #ffffff;
    text-decoration: none;
  }
`;

export const Eyebrow = styled.span`
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: #fff4c7 !important;
  font-size: 0.83rem;
  font-weight: 700;
  letter-spacing: 0;
`;

export const HeroContent = styled.div`
  max-width: 820px;
  animation: ${fadeUp} 0.55s ease both;
`;

export const Title = styled.h1`
  margin: 12px 0 0;
  font-size: clamp(2.1rem, 4.5vw, 3.8rem);
  line-height: 1.08;
  letter-spacing: -0.01em;
  color: #ffffff !important;
`;

export const Subtitle = styled.p`
  max-width: 760px;
  margin: 16px 0 0;
  color: rgba(255, 255, 255, 0.92) !important;
  font-size: clamp(1rem, 2vw, 1.18rem);
  line-height: 1.7;
`;

export const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
`;

export const CtaLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 20px;
  border-radius: 999px;
  font-weight: 800;
  text-decoration: none;
  color: ${({ $variant }) => ($variant === "secondary" ? "#ffffff !important" : "#0f172a !important")};
  background: ${({ $variant }) =>
    $variant === "secondary" ? "rgba(255, 255, 255, 0.16)" : "linear-gradient(135deg, #ffd23f, #ffc107)"};
  border: 1px solid ${({ $variant }) => ($variant === "secondary" ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 193, 7, 0.65)")};
  box-shadow: ${({ $variant }) => ($variant === "secondary" ? "none" : "0 14px 34px rgba(255, 193, 7, 0.25)")};
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.18);
  }
`;

export const HeroBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  color: ${({ $light }) => ($light ? "#ffffff !important" : "#1f2937 !important")};
  background: ${({ $light }) => ($light ? "rgba(255, 255, 255, 0.14)" : "#ffffff")};
  border: 1px solid ${({ $light }) => ($light ? "rgba(255, 255, 255, 0.25)" : "#e5e7eb")};
  font-size: 0.88rem;
  font-weight: 700;

  svg {
    color: ${({ $light }) => ($light ? "#60a5fa !important" : "#000080")};
    stroke: ${({ $light }) => ($light ? "#60a5fa !important" : "#000080")};
  }
`;

export const Container = styled.div`
  width: min(1140px, calc(100% - 32px));
  margin: 28px auto 0;
`;

export const StatsGrid = styled.section`
  margin-top: 0;
  margin-bottom: 28px;
  position: relative;
  z-index: 5;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.article`
  min-width: 0;
  padding: 20px 22px;
  border-radius: 18px !important;
  overflow: hidden !important;
  border: 1.5px solid #e2e8f0;
  background: #ffffff;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 34px rgba(15, 23, 42, 0.09);
  }

  strong {
    display: block;
    color: #000080 !important;
    font-size: clamp(1.35rem, 3vw, 1.85rem);
    font-weight: 850;
    line-height: 1.1;
  }

  span {
    display: block;
    margin-top: 6px;
    color: #475569 !important;
    font-weight: 700;
    font-size: 0.88rem;
  }
`;

export const Content = styled.div`
  margin-top: 0;
  display: grid;
  gap: 24px;
`;

export const SplitLayout = styled.div`
  display: grid;
  grid-template-columns: 270px minmax(0, 1fr);
  gap: 28px;
  align-items: start;
  position: relative;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const Toc = styled.aside`
  position: sticky;
  top: calc(var(--user-header-height, 62px) + 20px);
  z-index: 30;
  height: fit-content;
  max-height: calc(100vh - var(--user-header-height, 62px) - 40px);
  overflow-y: auto;
  padding: 22px 20px;
  border-radius: 20px !important;
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05) !important;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }

  h2 {
    margin: 0 0 14px;
    font-size: 1.05rem;
    font-weight: 850;
    color: #000080 !important;
    letter-spacing: -0.01em;
    padding-bottom: 10px;
    border-bottom: 2px solid #eff6ff;
  }

  a {
    display: block;
    padding: 10px 0;
    color: #475569 !important;
    font-size: 0.92rem;
    font-weight: 700;
    text-decoration: none;
    border-top: 1px solid #f1f5f9;
    transition: color 0.18s ease, transform 0.18s ease;

    &:first-of-type {
      border-top: none;
    }

    &:hover {
      color: #2563eb !important;
      transform: translateX(4px);
    }
  }

  @media (max-width: 900px) {
    position: static;
    max-height: none;
    margin-bottom: 20px;
  }
`;

export const Section = styled.section`
  scroll-margin-top: 110px;
  padding: clamp(24px, 4vw, 36px);
  border-radius: 20px !important;
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05) !important;
  animation: ${fadeUp} 0.55s ease both;
  box-sizing: border-box;

  h2 {
    margin: 0 0 12px;
    color: #000080 !important;
    font-size: clamp(1.35rem, 2.6vw, 1.85rem);
    font-weight: 850;
    letter-spacing: -0.01em;
  }

  > p {
    margin: 10px 0 0;
    color: #475569 !important;
    line-height: 1.75;
    font-size: 0.98rem;
  }
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoCard = styled.article`
  min-width: 0;
  height: 100%;
  padding: 20px;
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06);
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(0, 0, 128, 0.2);
    box-shadow: 0 16px 38px rgba(15, 23, 42, 0.1);
  }

  h3 {
    margin: 14px 0 8px;
    color: #000080 !important;
    font-size: 1.05rem;
    font-weight: 800;
  }

  p {
    margin: 0;
    color: #475569 !important;
    line-height: 1.65;
    font-size: 0.95rem;
  }
`;

export const IconWrap = styled.span`
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  color: #000080 !important;
  background: #eff6ff;
  border: 1px solid #dbeafe;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
  font-size: 1.25rem;

  svg {
    color: #000080 !important;
    stroke: #000080 !important;
  }
`;

export const Timeline = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const StepCard = styled(InfoCard)`
  position: relative;

  strong {
    position: absolute;
    top: 16px;
    right: 16px;
    color: rgba(0, 0, 128, 0.15) !important;
    font-size: 2rem;
    line-height: 1;
    font-weight: 900;
  }
`;

export const Checklist = styled.ul`
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const CheckItem = styled.li`
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 14px 16px;
  border-radius: 14px;
  background: #ffffff;
  color: #1e293b !important;
  border: 1px solid #e2e8f0;
  line-height: 1.55;

  svg {
    flex: 0 0 auto;
    margin-top: 2px;
    color: #2563eb !important;
    stroke: #2563eb !important;
  }
`;

export const FaqList = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 20px;
`;

export const FaqItem = styled.details`
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);

  summary {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 20px;
    color: #0f172a !important;
    font-weight: 800;
    list-style: none;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  p {
    margin: 0;
    padding: 0 20px 20px;
    color: #475569 !important;
    line-height: 1.7;
  }
`;

export const LinkGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
`;

export const PillLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 16px;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid #dbe3ef;
  color: #000080 !important;
  font-weight: 800;
  text-decoration: none;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 0, 128, 0.3);
    box-shadow: 0 12px 24px rgba(0, 0, 128, 0.08);
  }
`;

export const CtaSection = styled.section`
  margin-top: clamp(32px, 6vw, 64px);
  padding: clamp(28px, 5vw, 46px);
  border-radius: 24px;
  color: #ffffff;
  background: linear-gradient(135deg, #000080 0%, #08085b 58%, #02022a 100%);
  box-shadow: 0 24px 60px rgba(0, 0, 128, 0.2);
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 20px;
  align-items: center;

  h2 {
    margin: 0;
    font-size: clamp(1.55rem, 3vw, 2.35rem);
    color: #ffffff !important;
  }

  p {
    margin: 10px 0 0;
    color: rgba(255, 255, 255, 0.92) !important;
    line-height: 1.7;
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const LegalText = styled.div`
  display: grid;
  gap: 14px;
  margin-top: 18px;

  article {
    padding-top: 14px;
    border-top: 1px solid #eef2f7;
  }

  h3 {
    margin: 0 0 8px;
    color: #0f172a !important;
    font-size: 1.04rem;
    font-weight: 800;
  }

  p {
    margin: 0;
    color: #475569 !important;
    line-height: 1.75;
  }
`;

export const SearchBox = styled.form`
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 620px;
  margin-top: 20px;
  padding: 8px 8px 8px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.16);

  input {
    min-width: 0;
    flex: 1;
    border: 0;
    outline: 0;
    background: transparent;
    padding: 0 4px;
    color: #111827 !important;
    font: inherit;
  }

  button,
  span {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 0;
    outline: 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #111827 !important;
    background: linear-gradient(135deg, #ffd23f, #ffc107);
    transition: transform 0.18s ease;

    &:hover {
      transform: scale(1.06);
    }

    svg {
      color: #111827 !important;
      stroke: #111827 !important;
    }
  }
`;
