import React from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiAward,
  FiBarChart2,
  FiCheckCircle,
  FiCreditCard,
  FiGlobe,
  FiMessageCircle,
  FiPhoneCall,
  FiSearch,
  FiShield,
  FiStar,
  FiTarget,
  FiTrendingUp,
  FiUserCheck,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import styled from "styled-components";

import { useSeo } from "../../../shared/seo/useSeo";
import { SITE_CONFIG, toAbsoluteUrl } from "../../../shared/seo/siteConfig";

const heroHighlights = [
  { label: "Verified Expert Visibility", icon: FiUserCheck },
  { label: "More Customer Leads", icon: FiTarget },
  { label: "Instant Chat & Call Connect", icon: FiMessageCircle },
  { label: "Digital Growth Support", icon: FiTrendingUp },
];

const userCards = [
  {
    title: "Easy Expert Discovery",
    text: "Find experts by category, subcategory, skills, experience, and availability.",
    icon: FiSearch,
  },
  {
    title: "Verified Profiles",
    text: "Connect with experts whose details, documents, and profile information are reviewed.",
    icon: FiShield,
  },
  {
    title: "Instant Consultation",
    text: "Start chat or call quickly after wallet recharge and get advice without waiting.",
    icon: FiZap,
  },
  {
    title: "Transparent Pricing",
    text: "See expert per-minute pricing before starting a paid consultation.",
    icon: FiCreditCard,
  },
];

const expertCards = [
  {
    title: "Online Expert Profile",
    text: "Create a professional profile with your photo, category, education, skills, and experience.",
    icon: FiUserCheck,
  },
  {
    title: "Lead Generation",
    text: "Get discovered by users actively searching for advice in your category.",
    icon: FiTarget,
  },
  {
    title: "Earn Per Minute",
    text: "Set your consultation price and earn through chat or call sessions.",
    icon: FiBarChart2,
  },
  {
    title: "Reputation Building",
    text: "Build trust through ratings, reviews, completed consultations, and helpful advice.",
    icon: FiStar,
  },
];

const benefits = [
  "Category-based expert promotion",
  "SEO-friendly expert and category pages",
  "Social media promotion support",
  "Verified badge and trust-building content",
  "User engagement through chat and call CTAs",
  "Wallet recharge flow for paid consultation",
  "Lead tracking and conversion support",
  "Growth-focused expert onboarding",
];

const flowSteps = [
  {
    title: "Expert Creates Profile",
    text: "Expert registers and completes profile verification.",
    icon: FiUserCheck,
  },
  {
    title: "Platform Promotes Expert",
    text: "Expert appears in relevant categories and user search flows.",
    icon: FiGlobe,
  },
  {
    title: "User Connects",
    text: "User views profile, checks price, recharges wallet, and starts chat or call.",
    icon: FiPhoneCall,
  },
  {
    title: "Expert Earns & Grows",
    text: "Expert provides consultation, earns money, and builds reputation.",
    icon: FiTrendingUp,
  },
];

const trustPoints = [
  "100% Verified Expert Profiles",
  "Secure Wallet-Based Payment",
  "Instant Chat & Call Support",
  "Transparent Pricing",
  "Ratings & Reviews",
  "Multi-category Expert Marketplace",
];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Marketing",
    description:
      "Learn how G9Expert helps users discover trusted experts and helps verified experts grow through digital visibility, lead generation, and online consultation.",
    url: toAbsoluteUrl("/user/marketing"),
    isPartOf: {
      "@type": "WebSite",
      name: SITE_CONFIG.siteName,
      url: SITE_CONFIG.baseUrl,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: toAbsoluteUrl("/user"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Marketing",
        item: toAbsoluteUrl("/user/marketing"),
      },
    ],
  },
];

const Marketing = () => {
  useSeo({
    title: `Marketing | ${SITE_CONFIG.siteName}`,
    description:
      "G9Expert marketing helps users find trusted experts quickly and helps verified experts build visibility, generate leads, and grow online consultations.",
    canonicalPath: "/user/marketing",
    keywords:
      "expert marketing, verified expert promotion, online consultation marketing, expert lead generation, G9Expert marketing",
    og: {
      title: `Marketing | ${SITE_CONFIG.siteName}`,
      description:
        "Discover how G9Expert supports digital visibility, verified expert promotion, lead generation, chat, call, and wallet-based consultation growth.",
    },
    twitter: {
      title: `Marketing | ${SITE_CONFIG.siteName}`,
      description:
        "Smart marketing for users finding trusted experts and verified experts growing online consultations.",
    },
    structuredData,
  });

  return (
    <Page>
      <Hero>
        <HeroInner>
          <Breadcrumb aria-label="Breadcrumb">
            <Link to="/user">Home</Link>
            <span>/</span>
            <span>Marketing</span>
          </Breadcrumb>

          <HeroGrid>
            <HeroContent>
              <Eyebrow>
                <FiAward aria-hidden="true" />
                Marketing for Expert Growth
              </Eyebrow>
              <HeroTitle>Grow Faster with Smart Marketing</HeroTitle>
              <HeroText>
                We help users find trusted experts quickly and help verified experts build their online presence,
                generate leads, and connect with real customers.
              </HeroText>
              <HeroActions>
                <PrimaryLink to="/user/call-chat?page=1&mode=chat">
                  Explore Experts
                  <FiArrowRight aria-hidden="true" />
                </PrimaryLink>
                <SecondaryLink to="/expert/register">
                  Join as Expert
                  <FiArrowRight aria-hidden="true" />
                </SecondaryLink>
              </HeroActions>
            </HeroContent>

            <HighlightPanel aria-label="Marketing highlights">
              {heroHighlights.map(({ label, icon: Icon }) => (
                <HighlightItem key={label}>
                  <span>
                    <Icon aria-hidden="true" />
                  </span>
                  {label}
                </HighlightItem>
              ))}
            </HighlightPanel>
          </HeroGrid>
        </HeroInner>
      </Hero>

      <Container>
        <Section>
          <SectionHeader>
            <Kicker>For Users</Kicker>
            <h2>For Users: Find the Right Expert Easily</h2>
            <p>
              Our marketing system helps users discover verified experts across categories like legal advice, health
              guidance, astrology, finance, property, fitness, education, career, and more. Users can compare profiles,
              check expertise, view pricing, and instantly connect through chat or call.
            </p>
          </SectionHeader>
          <CardGrid>
            {userCards.map((card) => (
              <InfoCard key={card.title} {...card} />
            ))}
          </CardGrid>
        </Section>

        <Section>
          <SectionHeader>
            <Kicker>For Experts</Kicker>
            <h2>For Experts: Build Your Personal Brand</h2>
            <p>
              Our platform gives experts a digital identity where they can showcase their knowledge, experience, pricing,
              services, and availability. Experts can receive leads, consult users, earn through chat or call, and grow
              their professional reputation.
            </p>
          </SectionHeader>
          <CardGrid>
            {expertCards.map((card) => (
              <InfoCard key={card.title} {...card} />
            ))}
          </CardGrid>
        </Section>

        <SplitSection>
          <SectionHeader>
            <Kicker>Marketing Benefits</Kicker>
            <h2>Marketing Benefits We Provide</h2>
          </SectionHeader>
          <Checklist>
            {benefits.map((benefit) => (
              <li key={benefit}>
                <FiCheckCircle aria-hidden="true" />
                <span>{benefit}</span>
              </li>
            ))}
          </Checklist>
        </SplitSection>

        <Section>
          <SectionHeader>
            <Kicker>Flow</Kicker>
            <h2>How Our Marketing Flow Works</h2>
          </SectionHeader>
          <StepsGrid>
            {flowSteps.map(({ title, text, icon: Icon }, index) => (
              <StepCard key={title}>
                <StepNumber>{String(index + 1).padStart(2, "0")}</StepNumber>
                <IconBubble>
                  <Icon aria-hidden="true" />
                </IconBubble>
                <h3>{title}</h3>
                <p>{text}</p>
              </StepCard>
            ))}
          </StepsGrid>
        </Section>

        <TrustSection>
          <TrustCopy>
            <Kicker>Trust</Kicker>
            <h2>Built for Trust, Growth, and Real Connections</h2>
            <p>
              Our marketing approach focuses on trust, verified experts, transparent pricing, secure wallet payments, and
              instant communication. This helps users make better decisions and helps experts grow with real consultation
              opportunities.
            </p>
          </TrustCopy>
          <TrustGrid>
            {trustPoints.map((point) => (
              <TrustPoint key={point}>
                <FiShield aria-hidden="true" />
                {point}
              </TrustPoint>
            ))}
          </TrustGrid>
        </TrustSection>

        <FinalCta>
          <div>
            <Kicker>Ready to Grow</Kicker>
            <h2>Ready to Grow with Us?</h2>
            <p>
              Whether you are a user looking for trusted advice or an expert looking to grow your online consultation
              business, our platform gives you the right tools to connect, consult, and grow.
            </p>
          </div>
          <HeroActions>
            <PrimaryLink to="/user/call-chat?page=1&mode=chat">
              Find an Expert
              <FiArrowRight aria-hidden="true" />
            </PrimaryLink>
            <SecondaryLink to="/expert/register">
              Register as Expert
              <FiArrowRight aria-hidden="true" />
            </SecondaryLink>
          </HeroActions>
        </FinalCta>
      </Container>
    </Page>
  );
};

const InfoCard = ({ title, text, icon: Icon }) => (
  <Card>
    <IconBubble>
      <Icon aria-hidden="true" />
    </IconBubble>
    <h3>{title}</h3>
    <p>{text}</p>
  </Card>
);

const Page = styled.main`
  --marketing-primary: #000080;
  --marketing-primary-dark: #05054f;
  --marketing-gold: #ffc107;
  --marketing-ink: #111827;
  --marketing-muted: #5f6b7a;
  --marketing-border: #e5e7eb;
  --marketing-bg: #f7f8fc;

  background: var(--marketing-bg);
  color: var(--marketing-ink);
  overflow: hidden;
  padding-bottom: clamp(44px, 7vw, 88px);
`;

const Hero = styled.section`
  position: relative;
  color: #ffffff;
  background: linear-gradient(135deg, #000080 0%, #07075c 58%, #030329 100%);
  padding: clamp(48px, 7vw, 86px) 18px clamp(46px, 7vw, 78px);

  &::before {
    content: "";
    position: absolute;
    inset: auto -120px -170px auto;
    width: 360px;
    height: 360px;
    border-radius: 50%;
    background: rgba(255, 193, 7, 0.16);
    pointer-events: none;
  }
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  width: min(1120px, 100%);
  margin: 0 auto;
`;

const Breadcrumb = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: clamp(24px, 4vw, 34px);
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.9rem;

  a {
    color: #ffffff;
    text-decoration: none;
    font-weight: 700;
  }
`;

const HeroGrid = styled.div`
  display: grid;
  gap: 28px;
  align-items: center;

  @media (min-width: 900px) {
    grid-template-columns: minmax(0, 1.15fr) minmax(320px, 0.85fr);
  }
`;

const HeroContent = styled.div`
  max-width: 760px;
`;

const Eyebrow = styled.span`
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
  font-weight: 800;
`;

const HeroTitle = styled.h1`
  margin: 16px 0 0;
  color: #ffffff;
  font-size: clamp(2.15rem, 5vw, 4.15rem);
  line-height: 1.06;
  letter-spacing: 0;
`;

const HeroText = styled.p`
  max-width: 720px;
  margin: 18px 0 0;
  color: rgba(255, 255, 255, 0.86);
  font-size: clamp(1rem, 2vw, 1.16rem);
  line-height: 1.75;
`;

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 26px;
`;

const BaseLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 999px;
  font-weight: 800;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const PrimaryLink = styled(BaseLink)`
  color: #111827;
  background: linear-gradient(135deg, #ffd23f, #ffc107);
  border: 1px solid rgba(255, 193, 7, 0.72);
  box-shadow: 0 16px 34px rgba(255, 193, 7, 0.24);
`;

const SecondaryLink = styled(BaseLink)`
  color: #ffffff;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const HighlightPanel = styled.div`
  display: grid;
  gap: 12px;
  padding: clamp(16px, 3vw, 22px);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(14px);
`;

const HighlightItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 58px;
  padding: 12px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-weight: 800;

  span {
    width: 38px;
    height: 38px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
    border-radius: 14px;
    color: #111827;
    background: var(--marketing-gold);
  }
`;

const Container = styled.div`
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  display: grid;
  gap: clamp(28px, 5vw, 48px);
  padding-top: clamp(34px, 6vw, 72px);
`;

const Section = styled.section`
  padding: clamp(22px, 4vw, 34px);
  border: 1px solid var(--marketing-border);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);
`;

const SectionHeader = styled.div`
  max-width: 850px;

  h2 {
    margin: 8px 0 0;
    color: var(--marketing-primary);
    font-size: clamp(1.45rem, 3vw, 2.15rem);
    line-height: 1.18;
    letter-spacing: 0;
  }

  p {
    margin: 12px 0 0;
    color: var(--marketing-muted);
    line-height: 1.75;
  }
`;

const Kicker = styled.span`
  display: inline-flex;
  width: fit-content;
  color: var(--marketing-primary);
  font-size: 0.82rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0;
`;

const CardGrid = styled.div`
  display: grid;
  gap: 16px;
  margin-top: 22px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 980px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const Card = styled.article`
  min-width: 0;
  height: 100%;
  padding: 18px;
  border: 1px solid rgba(0, 0, 128, 0.08);
  border-radius: 20px;
  background: linear-gradient(180deg, #ffffff 0%, #fbfcff 100%);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);

  h3 {
    margin: 14px 0 8px;
    color: var(--marketing-ink);
    font-size: 1.02rem;
  }

  p {
    margin: 0;
    color: var(--marketing-muted);
    font-size: 0.94rem;
    line-height: 1.65;
  }
`;

const IconBubble = styled.span`
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  color: #ffd23f;
  background: linear-gradient(135deg, var(--marketing-primary), var(--marketing-primary-dark));
  box-shadow: 0 12px 26px rgba(0, 0, 128, 0.22);
  font-size: 1.18rem;
`;

const SplitSection = styled(Section)`
  display: grid;
  gap: 22px;

  @media (min-width: 900px) {
    grid-template-columns: minmax(0, 0.75fr) minmax(0, 1.25fr);
    align-items: start;
  }
`;

const Checklist = styled.ul`
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  li {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 14px;
    border: 1px solid #edf2f7;
    border-radius: 16px;
    background: #f8fafc;
    color: #374151;
    line-height: 1.55;
    font-weight: 700;
  }

  svg {
    flex: 0 0 auto;
    margin-top: 2px;
    color: var(--marketing-primary);
  }
`;

const StepsGrid = styled.div`
  display: grid;
  gap: 16px;
  margin-top: 22px;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 980px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const StepCard = styled(Card)`
  position: relative;
  overflow: hidden;
`;

const StepNumber = styled.strong`
  position: absolute;
  top: 14px;
  right: 16px;
  color: rgba(0, 0, 128, 0.12);
  font-size: 2rem;
  line-height: 1;
`;

const TrustSection = styled.section`
  display: grid;
  gap: 24px;
  padding: clamp(24px, 5vw, 42px);
  border-radius: 28px;
  color: #ffffff;
  background: linear-gradient(135deg, #000080 0%, #08085b 58%, #02022a 100%);
  box-shadow: 0 24px 60px rgba(0, 0, 128, 0.2);

  @media (min-width: 900px) {
    grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
    align-items: center;
  }
`;

const TrustCopy = styled.div`
  h2 {
    margin: 8px 0 0;
    color: #ffffff;
    font-size: clamp(1.55rem, 3vw, 2.35rem);
    line-height: 1.18;
  }

  p {
    margin: 12px 0 0;
    color: rgba(255, 255, 255, 0.82);
    line-height: 1.75;
  }

  ${Kicker} {
    color: #fff4c7;
  }
`;

const TrustGrid = styled.div`
  display: grid;
  gap: 10px;

  @media (min-width: 560px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const TrustPoint = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 56px;
  padding: 12px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #ffffff;
  font-weight: 800;

  svg {
    flex: 0 0 auto;
    color: var(--marketing-gold);
  }
`;

const FinalCta = styled(TrustSection)`
  background: #ffffff;
  color: var(--marketing-ink);
  border: 1px solid var(--marketing-border);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);

  h2 {
    margin: 8px 0 0;
    color: var(--marketing-primary);
    font-size: clamp(1.55rem, 3vw, 2.35rem);
    line-height: 1.18;
  }

  p {
    margin: 12px 0 0;
    color: var(--marketing-muted);
    line-height: 1.75;
  }

  ${SecondaryLink} {
    color: var(--marketing-primary);
    background: #ffffff;
    border-color: rgba(0, 0, 128, 0.2);
  }
`;

export default Marketing;
