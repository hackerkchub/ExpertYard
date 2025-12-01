// src/components/Footer/Footer.jsx
import React from "react";
import {
  Wrapper,
  TopLinks,
  LinkItem,
  MiddleLinks,
  SmallLink,
  Copy,
  Brand,
} from "./Footer.styles";

// -----------------------------
// Static link data (outside component)
// -----------------------------
const CITY_LINKS = [
  "Experts in Delhi",
  "Experts in Mumbai",
  "Experts in Noida",
  "Experts in Gurugram",
  "Experts in Ghaziabad",
  "Experts in Bangalore",
  "Experts in Kolkata",
  "Experts in India",
  "Experts in USA",
  "Experts in UK",
  "Experts in Canada",
  "Experts in Australia",
  "Experts in UAE",
  "Career Experts",
  "Finance Experts",
  "Love Experts",
  "Vastu Experts",
  "Numerologists",
  "Tarot Readers",
  "Reiki Healers",
  "Feng Shui Consultants",
  "Crystal Healers",
  "Live Experts",
  "Chat With Expert",
  "Free Consultation on Phone",
  "Online Consultation",
  "Consultation 2026",
];

const FOOTER_NAV_LINKS = [
  "Feedback",
  "Contact Us",
  "About Us",
  "Privacy Policy",
  "Terms and Conditions",
  "Expert Registration",
];

const Footer = () => {
  return (
    <Wrapper>
      {/* -------- TOP CATEGORY LINKS -------- */}
      <TopLinks aria-label="Popular ExpertYard searches">
        {CITY_LINKS.map((item, i) => (
          <LinkItem key={i}>{item}</LinkItem>
        ))}
      </TopLinks>

      {/* -------- MIDDLE NAV LINKS -------- */}
      <MiddleLinks aria-label="ExpertYard footer navigation">
        {FOOTER_NAV_LINKS.map((item, i) => (
          <SmallLink key={i}>{item}</SmallLink>
        ))}
      </MiddleLinks>

      {/* -------- COPYRIGHT -------- */}
      <Copy>
        © All copyrights reserved {new Date().getFullYear()}{" "}
        <Brand>ExpertYard.com</Brand>
      </Copy>
    </Wrapper>
  );
};

export default Footer;
