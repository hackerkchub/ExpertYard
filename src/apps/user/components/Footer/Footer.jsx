import React from "react";
import { useTranslation } from "react-i18next";
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
import { FaFacebookF, FaLinkedinIn, FaYoutube, FaInstagram } from "react-icons/fa";

const COMPANY_LINKS = [
  { labelKey: "footer.aboutUs", path: "/user/about" },
  { labelKey: "footer.careers", path: "/user/careers" },
  { labelKey: "footer.privacyPolicy", path: "/user/privacy" },
  { labelKey: "footer.terms", path: "/user/terms" },
  { labelKey: "Refund & Cancellation", path: "/user/refund-cancellation" },
];

const CUSTOMER_LINKS = [
  { labelKey: "footer.findExperts", path: "/user/find-experts" },
  { labelKey: "footer.reviews", path: "/user/reviews" },
  { labelKey: "footer.howItWorks", path: "/user/how-it-works" },
  { labelKey: "footer.faq", path: "/user/faq" },
  { labelKey: "Contact Us", path: "/user/contact" },
];

const PROFESSIONAL_LINKS = [
  { labelKey: "footer.becomeExpert", path: "/user/become-expert" },
  { labelKey: "footer.expertGuidelines", path: "/user/guidelines" },
  { labelKey: "footer.earningsModel", path: "/user/earnings-model" },
  { label: "Marketing", path: "/user/marketing" },
  { labelKey: "common.support", path: "/user/support" },
];

const SERVICE_LINKS = [
  { labelKey: "footer.legalAdvice", path: "/user/categories" },
  { labelKey: "footer.careerGuidance", path: "/user/categories" },
  { labelKey: "footer.businessConsultation", path: "/user/categories" },
  { labelKey: "footer.healthWellness", path: "/user/categories" },
];

// Updated social links with correct URLs
const SOCIAL_LINKS = [
  { 
    icon: <FaInstagram />, 
    url: "https://www.instagram.com/g9expert_/", 
    labelKey: "footer.social.instagram" 
  },
  { 
    icon: <FaLinkedinIn />, 
    url: "https://www.linkedin.com/in/g9-experts-expert-464271408", 
    labelKey: "footer.social.linkedin" 
  },
  { 
    icon: <FaYoutube />, 
    url: "https://www.youtube.com/@G9Experts", 
    labelKey: "footer.social.youtube" 
  },
  { 
    icon: <FaFacebookF />, 
    url: "#", 
    labelKey: "footer.social.facebook",
    disabled: true // Facebook link not available
  },
];

const FooterColumn = ({ title, links, t }) => (
  <Section aria-label={title}>
    <SectionTitle>{title}</SectionTitle>
    <LinkList>
      {links.map((link) => (
        <li key={`${title}-${link.labelKey || link.label}`}>
          <FooterLink to={link.path}>{link.label || t(link.labelKey)}</FooterLink>
        </li>
      ))}
    </LinkList>
  </Section>
);

const Footer = () => {
  const { t } = useTranslation();

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
              {t("footer.description")}
            </Tagline>

            <SocialLinks>
              {SOCIAL_LINKS.map((social) => (
                <SocialIcon
                  key={social.labelKey}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(social.labelKey)}
                  style={social.disabled ? { 
                    opacity: 0.4, 
                    cursor: 'default',
                    pointerEvents: 'none' 
                  } : {}}
                >
                  {social.icon}
                </SocialIcon>
              ))}
            </SocialLinks>
          </BrandSection>

          <FooterColumn title={t("footer.company")} links={COMPANY_LINKS} t={t} />
          <FooterColumn title={t("footer.forCustomers")} links={CUSTOMER_LINKS} t={t} />
          <FooterColumn title={t("footer.forExperts")} links={PROFESSIONAL_LINKS} t={t} />
          <FooterColumn title={t("footer.services")} links={SERVICE_LINKS} t={t} />
        </FooterTop>
      </Container>

      <BottomBar>
        <BottomMeta>
          <Copyright>© {new Date().getFullYear()} {t("footer.copyright")}</Copyright>
          <PoweredBy>
            {t("footer.poweredBy")} <span>Softmaxs Solutions</span>
          </PoweredBy>
        </BottomMeta>
        <TrustText>{t("footer.trustedText")}</TrustText>
      </BottomBar>
    </Wrapper>
  );
};

export default Footer;