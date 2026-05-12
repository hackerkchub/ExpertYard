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
  overflow-x: hidden;
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
  padding: clamp(58px, 7vw, 96px) 20px clamp(42px, 6vw, 72px);

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
  gap: 28px;
`;

export const Breadcrumb = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  color: rgba(255, 255, 255, 0.78);
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
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: #fff4c7;
  font-size: 0.83rem;
  font-weight: 700;
  letter-spacing: 0;
`;

export const HeroContent = styled.div`
  max-width: 820px;
  animation: ${fadeUp} 0.55s ease both;
`;

export const Title = styled.h1`
  margin: 0;
  font-size: clamp(2.25rem, 5vw, 4.25rem);
  line-height: 1.04;
  letter-spacing: 0;
  color: #ffffff;
`;

export const Subtitle = styled.p`
  max-width: 760px;
  margin: 18px 0 0;
  color: rgba(255, 255, 255, 0.86);
  font-size: clamp(1rem, 2vw, 1.2rem);
  line-height: 1.7;
`;

export const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 26px;
`;

export const CtaLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 999px;
  font-weight: 800;
  text-decoration: none;
  color: ${({ $variant }) => ($variant === "secondary" ? "#ffffff" : "#111827")};
  background: ${({ $variant }) =>
    $variant === "secondary" ? "rgba(255, 255, 255, 0.12)" : "linear-gradient(135deg, #ffd23f, #ffc107)"};
  border: 1px solid ${({ $variant }) => ($variant === "secondary" ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 193, 7, 0.65)")};
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
  padding: 9px 12px;
  border-radius: 999px;
  color: ${({ $light }) => ($light ? "#ffffff" : "#1f2937")};
  background: ${({ $light }) => ($light ? "rgba(255, 255, 255, 0.12)" : "#ffffff")};
  border: 1px solid ${({ $light }) => ($light ? "rgba(255, 255, 255, 0.18)" : "#e5e7eb")};
  font-size: 0.88rem;
  font-weight: 700;
`;

export const Container = styled.div`
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
`;

export const StatsGrid = styled.section`
  margin-top: -30px;
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const StatCard = styled.article`
  min-width: 0;
  padding: 18px;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 128, 0.08);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(10px);

  strong {
    display: block;
    color: var(--g9-navy);
    font-size: clamp(1.35rem, 3vw, 1.9rem);
    line-height: 1;
  }

  span {
    display: block;
    margin-top: 8px;
    color: var(--g9-muted);
    font-weight: 700;
    font-size: 0.9rem;
  }
`;

export const Content = styled.div`
  margin-top: clamp(38px, 6vw, 76px);
  display: grid;
  gap: clamp(24px, 4vw, 42px);
`;

export const SplitLayout = styled.div`
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 28px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Toc = styled.aside`
  position: sticky;
  top: 92px;
  padding: 18px;
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid var(--g9-border);
  box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);

  h2 {
    margin: 0 0 12px;
    font-size: 1rem;
    color: var(--g9-navy);
  }

  a {
    display: block;
    padding: 9px 0;
    color: #374151;
    font-weight: 700;
    text-decoration: none;
    border-top: 1px solid #eef2f7;
  }

  @media (max-width: 900px) {
    position: static;
  }
`;

export const Section = styled.section`
  scroll-margin-top: 110px;
  padding: clamp(24px, 4vw, 34px);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid var(--g9-border);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);
  animation: ${fadeUp} 0.55s ease both;

  h2 {
    margin: 0;
    color: var(--g9-navy);
    font-size: clamp(1.35rem, 2.6vw, 2rem);
    letter-spacing: 0;
  }

  > p {
    margin: 10px 0 0;
    color: var(--g9-muted);
    line-height: 1.75;
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
  padding: 18px;
  border-radius: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
  border: 1px solid rgba(0, 0, 128, 0.08);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(0, 0, 128, 0.2);
    box-shadow: 0 18px 42px rgba(15, 23, 42, 0.1);
  }

  h3 {
    margin: 14px 0 8px;
    color: var(--g9-ink);
    font-size: 1.04rem;
  }

  p {
    margin: 0;
    color: var(--g9-muted);
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
  border-radius: 16px;
  color: #ffd23f;
  background: linear-gradient(135deg, #000080, #07075c);
  box-shadow: 0 12px 26px rgba(0, 0, 128, 0.22);
  font-size: 1.2rem;
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
    color: rgba(0, 0, 128, 0.12);
    font-size: 2rem;
    line-height: 1;
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
  padding: 14px;
  border-radius: 16px;
  background: #f8fafc;
  color: #374151;
  border: 1px solid #edf2f7;
  line-height: 1.55;

  svg {
    flex: 0 0 auto;
    margin-top: 2px;
    color: var(--g9-navy);
  }
`;

export const FaqList = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 20px;
`;

export const FaqItem = styled.details`
  border-radius: 18px;
  background: #ffffff;
  border: 1px solid #e8edf5;
  overflow: hidden;

  summary {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    gap: 16px;
    padding: 16px 18px;
    color: var(--g9-ink);
    font-weight: 800;
    list-style: none;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  p {
    margin: 0;
    padding: 0 18px 18px;
    color: var(--g9-muted);
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
  padding: 0 14px;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid #dbe3ef;
  color: var(--g9-navy);
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
  border-radius: 28px;
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
    color: #ffffff;
  }

  p {
    margin: 10px 0 0;
    color: rgba(255, 255, 255, 0.82);
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
    color: var(--g9-ink);
    font-size: 1.04rem;
  }

  p {
    margin: 0;
    color: var(--g9-muted);
    line-height: 1.75;
  }
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 620px;
  margin-top: 24px;
  padding: 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.16);

  input {
    min-width: 0;
    flex: 1;
    border: 0;
    outline: 0;
    background: transparent;
    padding: 0 8px;
    color: #111827;
    font: inherit;
  }

  span {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #111827;
    background: linear-gradient(135deg, #ffd23f, #ffc107);
  }
`;
