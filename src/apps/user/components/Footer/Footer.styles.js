import styled from "styled-components";
import { Link } from "react-router-dom";

const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
};

export const Wrapper = styled.footer`
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 12% 0%, rgba(255, 210, 63, 0.2), transparent 26%),
    radial-gradient(circle at 92% 18%, rgba(96, 165, 250, 0.18), transparent 28%),
    linear-gradient(135deg, #000080 0%, #05054d 48%, #020225 100%);
  color: #ffffff;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  padding: 56px 0 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
      linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    background-size: 72px 72px;
    mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent 72%);
  }

  @media (max-width: ${breakpoints.md}) {
    display: none;
  }
`;

export const Container = styled.div`
  position: relative;
  z-index: 1;
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;

  @media (max-width: ${breakpoints.sm}) {
    width: min(100% - 28px, 520px);
  }
`;

export const FooterTop = styled.div`
  display: grid;
  grid-template-columns: minmax(260px, 1.4fr) repeat(4, minmax(130px, 1fr));
  gap: 32px;
  align-items: start;

  @media (max-width: ${breakpoints.lg}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: 28px;
    text-align: center;
  }
`;

export const BrandSection = styled.div`
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 22px 55px rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(14px);

  @media (max-width: ${breakpoints.lg}) {
    grid-column: 1 / -1;
  }

  @media (max-width: ${breakpoints.sm}) {
    padding: 22px 18px;
  }
`;

export const Logo = styled(Link)`
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  margin-bottom: 16px;
  -webkit-tap-highlight-color: transparent;
`;

export const LogoContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 58px;
  padding: 10px 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.18);
`;

export const LogoImage = styled.img`
  width: 172px;
  height: auto;
  object-fit: contain;
  display: block;

  @media (max-width: ${breakpoints.sm}) {
    width: 148px;
  }
`;

export const Tagline = styled.p`
  max-width: 340px;
  margin: 0 0 20px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.96rem;
  line-height: 1.65;

  @media (max-width: ${breakpoints.sm}) {
    margin-left: auto;
    margin-right: auto;
    font-size: 0.93rem;
  }
`;

export const SocialLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: ${breakpoints.sm}) {
    justify-content: center;
  }
`;

export const SocialIcon = styled.a`
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  text-decoration: none;
  transition: transform 0.25s ease, color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    color: #000080;
    background: linear-gradient(135deg, #ffd23f, #ffc107);
    transform: translateY(-3px);
    box-shadow: 0 12px 26px rgba(255, 193, 7, 0.28);
  }
`;

export const Section = styled.nav`
  min-width: 0;

  @media (max-width: ${breakpoints.sm}) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const SectionTitle = styled.h4`
  position: relative;
  margin: 0 0 18px;
  padding-bottom: 12px;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 34px;
    height: 3px;
    border-radius: 999px;
    background: linear-gradient(90deg, #ffd23f, rgba(255, 255, 255, 0.45));
  }

  @media (max-width: ${breakpoints.sm}) {
    &::after {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

export const LinkList = styled.ul`
  display: grid;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const FooterLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.74);
  font-size: 0.94rem;
  line-height: 1.45;
  text-decoration: none;
  transition: color 0.25s ease, transform 0.25s ease;
  -webkit-tap-highlight-color: transparent;

  &::before {
    content: "";
    width: 5px;
    height: 5px;
    border-radius: 999px;
    background: rgba(255, 210, 63, 0.72);
    opacity: 0;
    transform: scale(0.5);
    transition: opacity 0.25s ease, transform 0.25s ease;
  }

  &:hover {
    color: #ffd23f;
    transform: translateX(4px);
  }

  &:hover::before {
    opacity: 1;
    transform: scale(1);
  }

  @media (max-width: ${breakpoints.sm}) {
    justify-content: center;
    font-size: 0.95rem;

    &:hover {
      transform: none;
    }
  }
`;

export const BottomBar = styled.div`
  position: relative;
  z-index: 1;
  width: min(1180px, calc(100% - 40px));
  margin: 34px auto 0;
  padding-top: 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;

  @media (max-width: ${breakpoints.md}) {
    flex-direction: column;
    text-align: center;
    margin-top: 30px;
  }

  @media (max-width: ${breakpoints.sm}) {
    width: min(100% - 28px, 520px);
  }
`;

export const BottomMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Copyright = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.86rem;
  line-height: 1.45;
`;

export const PoweredBy = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.86rem;
  font-weight: 700;

  span {
    color: #ffd23f;
  }
`;

export const TrustText = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 9px 14px;
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.88);
  font-size: 0.84rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);

  &::before {
    content: "";
    width: 9px;
    height: 9px;
    border-radius: 999px;
    background: #ffd23f;
    box-shadow: 0 0 16px rgba(255, 210, 63, 0.75);
  }
`;
