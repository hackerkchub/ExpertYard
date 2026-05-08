import React from "react";
import {
  Wrapper,
  Container,
  FooterTop,
  Section,
  BrandSection,
  SectionTitle,
  LinkList,
  FooterLink,
  SocialLinks,
  SocialIcon,
  Copyright,
  Logo,
  LogoContainer,
  LogoImage,
  Tagline,
  BottomBar,
  BottomMeta,
  PoweredBy,
  TrustText,
} from "./Footer.styles";
import logoImg from "../../../../assets/logo.webp";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaInstagram } from "react-icons/fa";

const COMPANY_LINKS = [
  { label: "About Us", path: "/user/about" },
  { label: "Careers", path: "/user/careers" },
  { label: "Privacy Policy", path: "/user/privacy" },
  { label: "Terms & Conditions", path: "/user/terms" },
];

const CUSTOMER_LINKS = [
  { label: "Find Experts", path: "/user/call-chat?page=1&mode=chat" },
  { label: "Reviews", path: "/user/reviews" },
  { label: "How It Works", path: "/user/how-it-works" },
  { label: "FAQ", path: "/user/faq" },
];

const PROFESSIONAL_LINKS = [
  { label: "Become an Expert", path: "/expert/register" },
  { label: "Expert Guidelines", path: "/user/guidelines" },
  { label: "Earnings Model", path: "/user/guidelines" },
  { label: "Support", path: "/user/contact" },
];

const SERVICE_LINKS = [
  { label: "Legal Advice", path: "/user/categories" },
  { label: "Career Guidance", path: "/user/categories" },
  { label: "Business Consultation", path: "/user/categories" },
  { label: "Health & Wellness", path: "/user/categories" },
];

const SOCIAL_LINKS = [
  { icon: <FaFacebookF />, url: "https://www.facebook.com/", label: "Facebook" },
  { icon: <FaTwitter />, url: "https://twitter.com/", label: "Twitter/X" },
  { icon: <FaLinkedinIn />, url: "https://www.linkedin.com/", label: "LinkedIn" },
  { icon: <FaInstagram />, url: "https://www.instagram.com/", label: "Instagram" },
  { icon: <FaYoutube />, url: "https://www.youtube.com/", label: "YouTube" },
];

const FooterColumn = ({ title, links }) => (
  <Section aria-label={title}>
    <SectionTitle>{title}</SectionTitle>
    <LinkList>
      {links.map((link) => (
        <li key={`${title}-${link.label}`}>
          <FooterLink to={link.path}>{link.label}</FooterLink>
        </li>
      ))}
    </LinkList>
  </Section>
);

const Footer = () => {
  return (
    <Wrapper>
      <Container>
        <FooterTop>
          <BrandSection>
            <Logo to="/user">
              <LogoContainer>
                <LogoImage src={logoImg} alt="G9 Experts" />
              </LogoContainer>
            </Logo>

            <Tagline>
              Connect with verified experts for instant guidance, consultation, and online services.
            </Tagline>

            <SocialLinks>
              {SOCIAL_LINKS.map((social) => (
                <SocialIcon
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  {social.icon}
                </SocialIcon>
              ))}
            </SocialLinks>
          </BrandSection>

          <FooterColumn title="Company" links={COMPANY_LINKS} />
          <FooterColumn title="For Customers" links={CUSTOMER_LINKS} />
          <FooterColumn title="For Experts" links={PROFESSIONAL_LINKS} />
          <FooterColumn title="Services" links={SERVICE_LINKS} />
        </FooterTop>
      </Container>

      <BottomBar>
        <BottomMeta>
          <Copyright>© {new Date().getFullYear()} G9 Experts. All rights reserved.</Copyright>
          <PoweredBy>
            Powered by <span>Softmaxs Solutions</span>
          </PoweredBy>
        </BottomMeta>
        <TrustText>Secure consultations with trusted professionals</TrustText>
      </BottomBar>
    </Wrapper>
  );
};

export default Footer;
