import React from "react";
import styled from "styled-components";

const Footer = () => {
  return (
    <Wrapper>

      {/* -------- TOP CATEGORY LINKS -------- */}
      <TopLinks>
        {[
          "Experts in Delhi", "Experts in Mumbai", "Experts in Noida",
          "Experts in Gurugram", "Experts in Ghaziabad", "Experts in Bangalore",
          "Experts in Kolkata", "Experts in India", "Experts in USA",
          "Experts in UK", "Experts in Canada", "Experts in Australia",
          "Experts in UAE", "Career Experts", "Finance Experts", "Love Experts",
          "Vastu Experts", "Numerologists", "Tarot Readers", "Reiki Healers",
          "Feng Shui Consultants", "Crystal Healers", "Live Experts",
          "Chat With Expert", "Free Consultation on Phone",
          "Online Consultation", "Consultation 2026"
        ].map((item, i) => (
          <LinkItem key={i}>{item}</LinkItem>
        ))}
      </TopLinks>

      {/* -------- MIDDLE NAV LINKS -------- */}
      <MiddleLinks>
        <SmallLink>Feedback</SmallLink>
        <SmallLink>Contact Us</SmallLink>
        <SmallLink>About Us</SmallLink>
        <SmallLink>Privacy Policy</SmallLink>
        <SmallLink>Terms and Conditions</SmallLink>
        <SmallLink>Expert Registration</SmallLink>
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


// -------------------------------
// Styled Components
// -------------------------------

const Wrapper = styled.footer`
  width: 100%;
  padding: 45px 20px;
  text-align: center;

  /* ⚡ Cyber Neon Blue Background */
  background: linear-gradient(135deg, #001a33, #003d80, #0066ff);
  background-size: 400% 400%;
  animation: neonFlow 12s ease infinite;

  /* Subtle glossy glass overlay */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  /* Top edge neon border */
  border-top: 1px solid rgba(0, 153, 255, 0.5);

  /* Soft outer glow */
  box-shadow: 0 -8px 40px rgba(0, 140, 255, 0.3);

  @keyframes neonFlow {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const TopLinks = styled.div`
  max-width: 1100px;
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 6px 15px;
  justify-content: center;
  line-height: 1.9;
`;

const LinkItem = styled.span`
  font-size: 15px;
  cursor: pointer;
  color: #ffffff;
  opacity: 0.95;

  &:hover {
    color: #66b3ff; /* neon blue glow */
  }

  &::after {
    content: " | ";
    opacity: 0.4;
    color: #ccc;
  }

  &:last-child::after {
    content: "";
  }
`;

const MiddleLinks = styled.div`
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  justify-content: center;
`;

const SmallLink = styled.span`
  font-size: 14px;
  cursor: pointer;
  color: #ffffff;
  opacity: 0.85;

  &:hover {
    color: #66b3ff;
    opacity: 1;
  }

  &::after {
    content: " | ";
    opacity: 0.4;
    color: #ccc;
  }

  &:last-child::after {
    content: "";
  }
`;


const Copy = styled.div`
  margin-top: 28px;
  font-size: 14px;
  color: #ffffff;
  opacity: 0.9;
`;


const Brand = styled.span`
  font-weight: 600;
  color: #66b3ff; /* neon blue */
`;
