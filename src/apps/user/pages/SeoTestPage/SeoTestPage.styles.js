import styled from "styled-components";
import { Link } from "react-router-dom";

const colors = {
  primary: "#000080",
  primaryDeep: "#02044a",
  primarySoft: "#f1f5f9",
  yellow: "#f59e0b",
  yellowLight: "#fef3c7",
  bgLight: "#f8fafc",
  white: "#ffffff",
  textMain: "#0f172a",
  textMuted: "#334155",
  textSubtle: "#64748b",
  border: "#cbd5e1",
  cardBg: "#ffffff",
  shadow: "0 4px 16px rgba(15, 23, 42, 0.06)",
};

export const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
  overflow-x: hidden;
  background: ${colors.bgLight};
  color: ${colors.textMain};
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  padding-bottom: 60px;
`;

/* ================= HERO SECTION (DARK BLUE BACKGROUND) ================= */
export const HeroSection = styled.header`
  background: linear-gradient(135deg, ${colors.primaryDeep} 0%, ${colors.primary} 100%);
  color: #ffffff !important;
  padding: 44px 20px 54px;
  text-align: center;
  position: relative;
  width: 100%;
  box-sizing: border-box;

  h1, h2, h3, p, span, a {
    color: #ffffff;
    overflow-wrap: break-word;
    word-break: break-word;
  }

  @media (max-width: 768px) {
    padding: 32px 16px 44px;
  }
`;

export const HeroWrapper = styled.div`
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
`;

export const BreadcrumbNav = styled.nav`
  margin-bottom: 20px;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9) !important;
  word-wrap: break-word;
  overflow-wrap: break-word;

  a {
    color: #fde047 !important;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }

  span.separator {
    margin: 0 8px;
    color: rgba(255, 255, 255, 0.6) !important;
  }

  span.current {
    color: #ffffff !important;
    font-weight: 600;
  }
`;

export const MainTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
  line-height: 1.25;
  color: #ffffff !important;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 1.85rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

export const IntroText = styled.p`
  font-size: 1.05rem;
  line-height: 1.65;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  color: rgba(255, 255, 255, 0.95) !important;
  word-wrap: break-word;
  overflow-wrap: break-word;
  box-sizing: border-box;

  @media (max-width: 768px) {
    font-size: 0.95rem;
    line-height: 1.55;
  }
`;

export const ContentWrapper = styled.main`
  max-width: 1040px;
  width: 100%;
  margin: -24px auto 0;
  padding: 0 20px;
  position: relative;
  z-index: 2;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0 12px;
    margin-top: -16px;
  }
`;

/* ================= LIGHT SECTIONS & CARDS ================= */
export const Card = styled.section`
  background: ${colors.cardBg};
  color: ${colors.textMain};
  border-radius: 12px;
  border: 1px solid ${colors.border};
  box-shadow: ${colors.shadow};
  padding: 32px;
  margin-bottom: 28px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 768px) {
    padding: 20px 16px;
    margin-bottom: 20px;
    border-radius: 10px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.primaryDeep} !important;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  word-wrap: break-word;
  overflow-wrap: break-word;

  &::before {
    content: "";
    display: inline-block;
    width: 4px;
    height: 22px;
    background: ${colors.yellow};
    border-radius: 2px;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 16px;
  }
`;

export const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

export const ServiceCard = styled.div`
  background: ${colors.primarySoft};
  border-radius: 8px;
  padding: 20px;
  border: 1px solid ${colors.border};
  border-left: 4px solid ${colors.primary};
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const ServiceCardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${colors.primaryDeep} !important;
  margin-bottom: 8px;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

export const ServiceCardDesc = styled.p`
  font-size: 0.925rem;
  color: ${colors.textMuted} !important;
  line-height: 1.55;
  margin: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

export const Paragraph = styled.p`
  font-size: 1rem;
  line-height: 1.75;
  color: ${colors.textMuted} !important;
  margin-bottom: 16px;
  word-wrap: break-word;
  overflow-wrap: break-word;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
    line-height: 1.6;
  }
`;

/* ================= FULLY RESPONSIVE EXPERT GRID ================= */
export const ExpertGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const ExpertCard = styled.div`
  background: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 128, 0.08);
  }

  @media (max-width: 768px) {
    padding: 18px 16px;
  }
`;

export const ExpertHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
  width: 100%;
  box-sizing: border-box;
`;

export const ExpertAvatarInitials = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${colors.primaryDeep} 0%, ${colors.primary} 100%);
  color: ${colors.white} !important;
  font-weight: 700;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  flex-shrink: 0;
`;

export const ExpertAvatarImg = styled.img`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${colors.primarySoft};
  flex-shrink: 0;
`;

export const ExpertMeta = styled.div`
  overflow: hidden;
  flex: 1;
  min-width: 0;
`;

export const ExpertName = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${colors.textMain} !important;
  margin: 0 0 2px 0;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
`;

export const ExpertPosition = styled.div`
  font-size: 0.825rem;
  font-weight: 600;
  color: ${colors.textSubtle} !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ExpertSpecialization = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.primary} !important;
  margin-bottom: 6px;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

export const ExpertLocation = styled.div`
  font-size: 0.825rem;
  color: ${colors.textSubtle} !important;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

export const ExpertBadgeGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
  width: 100%;
  box-sizing: border-box;
`;

export const ExpertTag = styled.span`
  background: ${colors.primarySoft};
  color: ${colors.primaryDeep} !important;
  font-size: 0.775rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid ${colors.border};
  max-width: 100%;
  box-sizing: border-box;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

export const ExpertDesc = styled.p`
  font-size: 0.9rem;
  color: ${colors.textMuted} !important;
  line-height: 1.55;
  margin-bottom: 16px;
  flex-grow: 1;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

export const ExpertBarCouncil = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${colors.primaryDeep} !important;
  background: #f1f5f9;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  padding: 4px 8px;
  margin-top: 6px;
  margin-bottom: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  box-sizing: border-box;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

/* ================= FULL-WIDTH SINGLE ACTION CTA ================= */
export const ExpertActionGroup = styled.div`
  display: block;
  width: 100%;
  margin-top: 16px;
  box-sizing: border-box;
`;

export const ExpertCardCta = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  background: ${colors.primary};
  color: ${colors.white} !important;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 12px 16px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;

  &:hover {
    background: ${colors.primaryDeep};
    color: ${colors.white} !important;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(2, 4, 74, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
  background: ${colors.primarySoft};
  border-radius: 12px;
  border: 1px dashed ${colors.border};
  width: 100%;
  box-sizing: border-box;
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${colors.primaryDeep} !important;
  margin-bottom: 8px;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

export const EmptyStateText = styled.p`
  font-size: 0.95rem;
  color: ${colors.textMuted} !important;
  max-width: 500px;
  width: 100%;
  margin: 0 auto 20px;
  line-height: 1.6;
  word-wrap: break-word;
  overflow-wrap: break-word;
  box-sizing: border-box;
`;

/* ================= CTA BANNER SECTION (DARK BLUE BACKGROUND) ================= */
export const CtaBanner = styled.div`
  background: linear-gradient(135deg, #1e1b4b 0%, ${colors.primaryDeep} 100%);
  color: #ffffff !important;
  border-radius: 12px;
  padding: 36px 28px;
  text-align: center;
  margin-bottom: 28px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: ${colors.shadow};
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;

  h1, h2, h3, h4, p, span {
    color: #ffffff;
    overflow-wrap: break-word;
  }

  @media (max-width: 768px) {
    padding: 24px 16px;
    margin-bottom: 20px;
  }
`;

export const CtaTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 12px;
  color: #ffffff !important;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 1.35rem;
  }
`;

export const CtaText = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.95) !important;
  max-width: 640px;
  width: 100%;
  margin: 0 auto 24px;
  line-height: 1.6;
  word-wrap: break-word;
  overflow-wrap: break-word;
  box-sizing: border-box;

  @media (max-width: 768px) {
    font-size: 0.925rem;
  }
`;

export const CtaButton = styled.a`
  display: inline-block;
  background: #fde047 !important;
  color: ${colors.primaryDeep} !important;
  font-weight: 800;
  font-size: 1rem;
  padding: 14px 32px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(253, 224, 71, 0.3);
  max-width: 100%;
  box-sizing: border-box;
  word-wrap: break-word;
  overflow-wrap: break-word;

  &:hover {
    background: #fef08a !important;
    color: ${colors.primaryDeep} !important;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(253, 224, 71, 0.4);
  }

  @media (max-width: 480px) {
    display: block;
    width: 100%;
    padding: 12px 20px;
  }
`;

/* ================= FAQ SECTION ================= */
export const FaqList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;
`;

export const FaqItem = styled.details`
  background: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  padding: 16px 20px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
  transition: background 0.2s ease;

  &[open] {
    background: ${colors.white};
    border-color: ${colors.primary};
  }

  @media (max-width: 768px) {
    padding: 14px 16px;
  }
`;

export const FaqQuestion = styled.summary`
  font-weight: 700;
  font-size: 1.05rem;
  color: ${colors.textMain} !important;
  cursor: pointer;
  outline: none;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  word-wrap: break-word;
  overflow-wrap: break-word;

  &::-webkit-details-marker {
    display: none;
  }

  &::after {
    content: "+";
    font-size: 1.25rem;
    font-weight: 800;
    color: ${colors.primary} !important;
    flex-shrink: 0;
    margin-left: 8px;
  }

  details[open] &::after {
    content: "−";
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

export const FaqAnswer = styled.p`
  margin-top: 12px;
  font-size: 0.95rem;
  color: ${colors.textMuted} !important;
  line-height: 1.6;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

/* ================= RELATED LINKS SECTION ================= */
export const LinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

export const RelatedLink = styled.a`
  display: block;
  background: ${colors.white};
  border: 1px solid ${colors.border};
  padding: 14px 18px;
  border-radius: 8px;
  color: ${colors.primaryDeep} !important;
  font-weight: 600;
  text-decoration: none;
  font-size: 0.925rem;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.primarySoft};
    border-color: ${colors.primary};
    color: ${colors.primary} !important;
  }

  @media (max-width: 768px) {
    padding: 12px 14px;
  }
`;

/* ================= LOCAL HUBS & MICRO-LOCALITIES ================= */
export const LocalHubList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 16px 0 0 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

export const LocalHubItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #f8fafc;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 0.925rem;
  font-weight: 500;
  color: ${colors.primaryDeep};
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;

  span.icon {
    font-size: 1.1rem;
    line-height: 1;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 0.875rem;
  }
`;

export const MicroLocalityGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
`;

export const MicroLocalityTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 20px;
  max-width: 100%;
  box-sizing: border-box;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 4px 10px;
  }
`;
