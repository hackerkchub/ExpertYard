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

  h1, h2, h3, p, span, a {
    color: #ffffff;
  }
`;

export const HeroWrapper = styled.div`
  max-width: 960px;
  margin: 0 auto;
`;

export const BreadcrumbNav = styled.nav`
  margin-bottom: 20px;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9) !important;

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

  @media (max-width: 640px) {
    font-size: 1.75rem;
  }
`;

export const IntroText = styled.p`
  font-size: 1.05rem;
  line-height: 1.65;
  max-width: 800px;
  margin: 0 auto;
  color: rgba(255, 255, 255, 0.95) !important;
`;

export const ContentWrapper = styled.main`
  max-width: 1040px;
  margin: -24px auto 0;
  padding: 0 20px;
  position: relative;
  z-index: 2;
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

  @media (max-width: 640px) {
    padding: 20px;
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

  &::before {
    content: "";
    display: inline-block;
    width: 4px;
    height: 22px;
    background: ${colors.yellow};
    border-radius: 2px;
  }
`;

export const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`;

export const ServiceCard = styled.div`
  background: ${colors.primarySoft};
  border-radius: 8px;
  padding: 20px;
  border: 1px solid ${colors.border};
  border-left: 4px solid ${colors.primary};
`;

export const ServiceCardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${colors.primaryDeep} !important;
  margin-bottom: 8px;
`;

export const ServiceCardDesc = styled.p`
  font-size: 0.925rem;
  color: ${colors.textMuted} !important;
  line-height: 1.55;
  margin: 0;
`;

export const Paragraph = styled.p`
  font-size: 1rem;
  line-height: 1.75;
  color: ${colors.textMuted} !important;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ExpertGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 128, 0.08);
  }
`;

export const ExpertHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
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
`;

export const ExpertPosition = styled.div`
  font-size: 0.825rem;
  font-weight: 600;
  color: ${colors.textSubtle} !important;
`;

export const ExpertSpecialization = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${colors.primary} !important;
  margin-bottom: 6px;
`;

export const ExpertLocation = styled.div`
  font-size: 0.825rem;
  color: ${colors.textSubtle} !important;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const ExpertBadgeGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
`;

export const ExpertTag = styled.span`
  background: ${colors.primarySoft};
  color: ${colors.primaryDeep} !important;
  font-size: 0.775rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid ${colors.border};
`;

export const ExpertDesc = styled.p`
  font-size: 0.9rem;
  color: ${colors.textMuted} !important;
  line-height: 1.55;
  margin-bottom: 16px;
  flex-grow: 1;
`;

export const ExpertCardCta = styled(Link)`
  display: block;
  text-align: center;
  background: ${colors.primary};
  color: ${colors.white} !important;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 10px 16px;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s ease;

  &:hover {
    background: ${colors.primaryDeep};
    color: ${colors.white} !important;
  }
`;

export const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 40px 20px;
  background: ${colors.primarySoft};
  border-radius: 12px;
  border: 1px dashed ${colors.border};
`;

export const EmptyStateTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${colors.primaryDeep} !important;
  margin-bottom: 8px;
`;

export const EmptyStateText = styled.p`
  font-size: 0.95rem;
  color: ${colors.textMuted} !important;
  max-width: 500px;
  margin: 0 auto 20px;
  line-height: 1.6;
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

  h1, h2, h3, h4, p, span {
    color: #ffffff;
  }
`;

export const CtaTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 12px;
  color: #ffffff !important;
`;

export const CtaText = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.95) !important;
  max-width: 640px;
  margin: 0 auto 24px;
  line-height: 1.6;
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

  &:hover {
    background: #fef08a !important;
    color: ${colors.primaryDeep} !important;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(253, 224, 71, 0.4);
  }
`;

/* ================= FAQ SECTION ================= */
export const FaqList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FaqItem = styled.details`
  background: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  padding: 16px 20px;
  transition: background 0.2s ease;

  &[open] {
    background: ${colors.white};
    border-color: ${colors.primary};
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

  &::-webkit-details-marker {
    display: none;
  }

  &::after {
    content: "+";
    font-size: 1.25rem;
    font-weight: 800;
    color: ${colors.primary} !important;
  }

  details[open] &::after {
    content: "−";
  }
`;

export const FaqAnswer = styled.p`
  margin-top: 12px;
  font-size: 0.95rem;
  color: ${colors.textMuted} !important;
  line-height: 1.6;
`;

/* ================= RELATED LINKS SECTION ================= */
export const LinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
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
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.primarySoft};
    border-color: ${colors.primary};
    color: ${colors.primary} !important;
  }
`;
