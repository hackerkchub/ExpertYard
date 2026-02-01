// src/components/Footer/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { 
  Wrapper, 
  Container, 
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
  LogoText,
  Tagline,
  BottomLinks,
  BottomLink
} from "./Footer.styles";
import logoImg from "../../../../assets/logo.png";

// Icons
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaInstagram } from "react-icons/fa";

// Static link data
const COMPANY_LINKS = [
  { label: "About Us", path: "/user/about" },
  // { label: "Investor Relations", path: "/investors" },
  { label: "Terms & Conditions", path: "/user/terms" },
  { label: "Privacy Policy", path: "/user/privacy" },
  // { label: "Anti-discrimination Policy", path: "/anti-discrimination" },
  { label: "Careers", path: "/user/careers" },
];

const CUSTOMER_LINKS = [
  { label: "Reviews", path: "/user/reviews" },
  // { label: "Categories Near You", path: "/categories" },
  { label: "Contact Us", path: "/user/contact" },
  { label: "How It Works", path: "/user/how-it-works" },
  { label: "FAQ", path: "/user/faq" },
];

const PROFESSIONAL_LINKS = [
  { label: "Register as an Expert", path: "/expert/register" },
  // { label: "Expert Dashboard", path: "/expert/login" },
  // { label: "Expert Resources", path: "/expert/resources" },
  // { label: "Become a Partner", path: "/partner" },
   { label: "Expert Guidelines", path: "/user/guidelines" },
];

const SOCIAL_LINKS = [
  { icon: <FaFacebookF />, url: "https://www.facebook.com/", label: "Facebook" },
  { icon: <FaTwitter />, url: "https://twitter.com/", label: "Twitter" },
  { icon: <FaLinkedinIn />, url: "https://www.linkedin.com/", label: "LinkedIn" },
  { icon: <FaYoutube />, url: "https://www.youtube.com/", label: "YouTube" },
  { icon: <FaInstagram />, url: "https://www.instagram.com/", label: "Instagram" },
];

// Component
const Footer = () => {
  return (
    <Wrapper>
      <Container>
        {/* Brand Section */}
        <BrandSection>
          <Logo to="/">
            <LogoContainer>
              <LogoImage src={logoImg} alt="ExpertYard Logo" />
              <LogoText>ExpertYard</LogoText>
            </LogoContainer>
          </Logo>

          <Tagline>
            Connect with world-class experts for personalized guidance, consultation, and professional services.
          </Tagline>
          
          {/* Social Links */}
          <SocialLinks>
            {SOCIAL_LINKS.map((social, index) => (
              <SocialIcon
                key={index}
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

        {/* Company Links */}
        <Section>
          <SectionTitle>Company</SectionTitle>
          <LinkList>
            {COMPANY_LINKS.map((link, index) => (
              <li key={index}>
                <FooterLink to={link.path}>
                  {link.label}
                </FooterLink>
              </li>
            ))}
          </LinkList>
        </Section>

        {/* For Customers */}
        <Section>
          <SectionTitle>For Customers</SectionTitle>
          <LinkList>
            {CUSTOMER_LINKS.map((link, index) => (
              <li key={index}>
                <FooterLink to={link.path}>
                  {link.label}
                </FooterLink>
              </li>
            ))}
          </LinkList>
        </Section>

        {/* For Professionals */}
        <Section>
          <SectionTitle>For Experts</SectionTitle>
          <LinkList>
            {PROFESSIONAL_LINKS.map((link, index) => (
              <li key={index}>
                <FooterLink to={link.path}>
                  {link.label}
                </FooterLink>
              </li>
            ))}
          </LinkList>
        </Section>
      </Container>

      {/* Bottom Section */}
      <Container style={{ 
        flexDirection: 'column', 
        alignItems: 'center',
        marginTop: '1rem',
        paddingTop: '2rem'
      }}>
        {/* <BottomLinks>
          <BottomLink to="/sitemap">Sitemap</BottomLink>
          <BottomLink to="/accessibility">Accessibility</BottomLink>
          <BottomLink to="/cookies">Cookie Policy</BottomLink>
          <BottomLink to="/security">Security</BottomLink>
          <BottomLink to="/blog">Blog</BottomLink>
          <BottomLink to="/press">Press</BottomLink>
        </BottomLinks> */}
        
        <Copyright>
          © {new Date().getFullYear()} ExpertYard.com. All rights reserved. ExpertYard is a registered trademark.
        </Copyright>
      </Container>
    </Wrapper>
  );
};

export default Footer;