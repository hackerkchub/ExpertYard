// src/components/Footer/Footer.styles.js
import styled from "styled-components";
import { Link } from "react-router-dom";

// Breakpoints
const breakpoints = {
  xs: '320px',
  sm: '480px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1536px'
};

// Media query helpers - FIXED: Removed maxSm and other problematic queries
const media = {
  xs: `@media (max-width: ${breakpoints.xs})`,
  sm: `@media (max-width: ${breakpoints.sm})`,
  md: `@media (max-width: ${breakpoints.md})`,
  lg: `@media (max-width: ${breakpoints.lg})`,
  xl: `@media (max-width: ${breakpoints.xl})`,
  xxl: `@media (max-width: ${breakpoints.xxl})`,
  minSm: `@media (min-width: ${breakpoints.sm})`,
  minMd: `@media (min-width: ${breakpoints.md})`,
  minLg: `@media (min-width: ${breakpoints.lg})`,
  minXl: `@media (min-width: ${breakpoints.xl})`,
  minXxl: `@media (min-width: ${breakpoints.xxl})`
};

// Helper function for max-width queries
const maxWidth = (breakpoint) => `@media (max-width: ${breakpoint})`;

export const Wrapper = styled.footer`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  color: #334155;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  position: relative;
  overflow: hidden;
  border-top: 1px solid #e2e8f0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
  padding: 2.5rem 0 1.5rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #cbd5e1, transparent);
  }

  ${media.minSm} {
    padding: 3rem 0 2rem;
  }

  ${media.minMd} {
    padding: 4rem 0 2rem;
  }

  ${maxWidth(breakpoints.xs)} {
    padding: 2rem 0 1.25rem;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column; 
  gap: 2rem;

  max-width: 1200px;     
  margin: 0 auto;        
  padding: 0 1.5rem;     

  @media (min-width: 768px) {
    flex-direction: row;
  }
;
  

  ${media.minSm} {
    padding: 0 1.25rem;
  }

  ${media.minMd} {
    padding: 0 1.5rem;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 2.5rem;
  }

  ${media.minLg} {
    padding: 0 2rem;
    gap: 3rem;
  }

  ${maxWidth(breakpoints.xs)} {
    padding: 0 0.75rem;
    gap: 2rem;
  }
`;

export const Section = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start; 

  ${media.minLg} {
    min-width: calc(20% - 1.8rem);
  }
`;

export const BrandSection = styled.div`
width: 100%;  
`;

export const SectionTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 1px;
  min-height: 48px;   
  display: flex;
  align-items: flex-end;
  position: relative;
  padding-bottom: 0.625rem;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 30px;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    border-radius: 2px;
  }

  ${media.minSm} {
    font-size: 0.925rem;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;

    &::after {
      width: 35px;
    }
  }

  ${media.minMd} {
    font-size: 0.95rem;

    &::after {
      width: 40px;
    }
  }

  ${maxWidth(breakpoints.xs)} {
    font-size: 0.875rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;

    &::after {
      width: 25px;
    }
  }

  /* Center align for mobile */
  @media (max-width: ${breakpoints.sm}) {
    text-align: center;
    
    &::after {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

export const LinksRow = styled.div`
 display: flex;
  flex-direction: row;
  gap: 2rem;
  width: 100%;
  align-items: flex-start;
  @media (max-width: 768px) {
    flex-direction: column; 
}
`;


export const LinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  

  ${media.minSm} {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  ${media.minMd} {
    display: block;
  }

  ${maxWidth(breakpoints.xs)} {
    grid-template-columns: 1fr;
  }

  @media (max-width: ${breakpoints.sm}) and (min-width: ${breakpoints.xs}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const FooterLink = styled(Link)`
  display: flex;
  color: #64748b;
  text-decoration: none;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  line-height: 1.4;
  padding: 0.375rem 0;
  position: relative;
   min-height: 48px;              
  display: flex;                 
  align-items: left; 
  -webkit-tap-highlight-color: transparent;          

  word-break: break-word;        
  text-align: left;

  &:hover {
    color: #3b82f6;
  }

  &::before {
    content: '';
    position: absolute;
    left: -10px;
    top: 50%;
    transform: translateY(-50%) scale(0);
    width: 4px;
    height: 4px;
    background: linear-gradient(45deg, #3b82f6, #8b5cf6);
    border-radius: 50%;
    transition: transform 0.3s ease;
  }

  &:hover::before {
    transform: translateY(-50%) scale(1);
  }

  ${media.minSm} {
    font-size: 0.9rem;
    margin-bottom: 0.625rem;
    
    &:hover {
      transform: translateX(5px);
    }
  }

  ${media.minMd} {
    font-size: 0.95rem;
    margin-bottom: 0.875rem;
  }

  ${maxWidth(breakpoints.xs)} {
    font-size: 0.85rem;
    padding: 0.5rem 0.75rem;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    margin-bottom: 0.375rem;
    
    &:hover {
      background: #ffffff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transform: none;
    }
    
    &::before {
      display: none;
    }
  }

  @media (max-width: ${breakpoints.sm}) {
    font-size: 0.875rem;
  }
`;

export const SocialLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
  justify-content: center;

  ${media.minSm} {
    gap: 0.875rem;
    margin-top: 2rem;
    justify-content: flex-start;
  }

  ${media.minMd} {
    gap: 1rem;
  }

  ${maxWidth(breakpoints.xs)} {
    gap: 0.625rem;
    margin-top: 1.25rem;
  }

  @media (max-width: ${breakpoints.sm}) {
    text-align: left;     
  
  &::after {
    left: 0;
    transform: none;
  }
  }
`;

export const SocialIcon = styled.a`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #e2e8f0;
  text-decoration: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(59, 130, 246, 0.2);
    border-color: transparent;
  }

  &:active {
    transform: translateY(0);
  }

  ${media.minSm} {
    width: 38px;
    height: 38px;
    font-size: 0.9375rem;
  }

  ${media.minMd} {
    width: 40px;
    height: 40px;
    font-size: 1rem;
    border-radius: 10px;
  }

  ${maxWidth(breakpoints.xs)} {
    width: 34px;
    height: 34px;
    font-size: 0.8125rem;
    border-radius: 6px;
  }
`;

export const Copyright = styled.p`
  color: #94a3b8;
  font-size: 0.75rem;
  margin: 0;
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
  width: 100%;
  line-height: 1.4;

  ${media.minSm} {
    font-size: 0.8rem;
    padding-top: 2rem;
  }

  ${media.minMd} {
    font-size: 0.85rem;
  }

  ${maxWidth(breakpoints.xs)} {
    font-size: 0.7rem;
    padding-top: 1.25rem;
  }
`;

export const Logo = styled(Link)`
  display: inline-block;
  text-decoration: none;
  margin-bottom: 0.75rem;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    opacity: 0.95;
  }

  @media (max-width: ${breakpoints.sm}) {
    display: block;
    text-align: center;
    margin-bottom: 1rem;
  }

  ${media.minSm} {
    margin-bottom: 1rem;
  }
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  justify-content: center;

  ${media.minSm} {
    gap: 0.75rem;
    justify-content: flex-start;
  }

  @media (max-width: ${breakpoints.sm}) {
    justify-content: center;
  }
`;

export const LogoImage = styled.img`
  height: 40px;
  width: auto;
  object-fit: contain;
  border-radius: 6px;
  transition: transform 0.3s ease;

  ${Logo}:hover & {
    transform: scale(1.05);
  }

  ${media.minSm} {
    height: 42px;
    border-radius: 7px;
  }

  ${media.minMd} {
    height: 45px;
    border-radius: 8px;
  }

  ${maxWidth(breakpoints.xs)} {
    height: 36px;
    border-radius: 5px;
  }
`;

export const LogoText = styled.span`
  font-size: 1.6rem;
  font-weight: 800;
  color: transparent;
  background: linear-gradient(135deg, #1e293b 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  background-clip: text;
  letter-spacing: -0.5px;
  line-height: 1;

  ${media.minSm} {
    font-size: 1.7rem;
  }

  ${media.minMd} {
    font-size: 1.8rem;
  }

  ${media.minLg} {
    font-size: 2rem;
  }

  ${maxWidth(breakpoints.xs)} {
    font-size: 1.5rem;
  }
`;

export const Tagline = styled.p`
  color: #64748b;
  font-size: 0.85rem;
  line-height: 1.5;
  margin-top: 0.75rem;
  text-align: center;
  max-width: 100%;

  ${media.minSm} {
    font-size: 0.875rem;
    margin-top: 1rem;
    text-align: left;
    max-width: 320px;
  }

  ${media.minMd} {
    font-size: 0.95rem;
    line-height: 1.6;
  }

  ${maxWidth(breakpoints.xs)} {
    font-size: 0.8rem;
    line-height: 1.4;
    margin-top: 0.625rem;
  }

  @media (max-width: ${breakpoints.sm}) {
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }
`;

export const BottomLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.25rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;

  ${media.minSm} {
    gap: 1.25rem;
    margin-top: 1.5rem;
    padding-top: 2rem;
  }

  ${media.minMd} {
    gap: 1.5rem;
  }

  ${media.minLg} {
    gap: 2rem;
  }

  ${maxWidth(breakpoints.xs)} {
    gap: 0.75rem;
    margin-top: 1rem;
    padding-top: 1.25rem;
  }
`;

export const BottomLink = styled(Link)`
  color: #64748b;
  text-decoration: none;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  position: relative;
  -webkit-tap-highlight-color: transparent;
  white-space: nowrap;

  &:hover {
    color: #3b82f6;
    background: rgba(59, 130, 246, 0.1);
  }

  ${media.minSm} {
    font-size: 0.825rem;
  }

  ${media.minMd} {
    font-size: 0.85rem;
  }

  ${media.minLg} {
    font-size: 0.9rem;
  }

  ${maxWidth(breakpoints.xs)} {
    font-size: 0.75rem;
    padding: 0.25rem 0.375rem;
  }

  @media (max-width: ${breakpoints.sm}) {
    font-size: 0.8rem;
  }
`;

// New responsive grid component
export const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  width: 100%;

  ${media.minSm} {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem 1.5rem;
  }

  ${media.minMd} {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }

  ${media.minLg} {
    grid-template-columns: 2fr repeat(3, 1fr);
    gap: 3rem;
  }

  ${maxWidth(breakpoints.xs)} {
    gap: 1.5rem;
  }
`;

// Responsive brand wrapper
export const BrandWrapper = styled.div`
  ${media.minSm} {
    grid-column: 1 / -1;
  }

  ${media.minMd} {
    grid-column: 1;
  }

  ${media.minLg} {
    grid-column: 1;
  }
`;

// Responsive links wrapper
export const LinksWrapper = styled.div`
  ${media.minSm} {
    &:nth-child(2) {
      grid-column: 1;
      grid-row: 2;
    }
    &:nth-child(3) {
      grid-column: 2;
      grid-row: 2;
    }
    &:nth-child(4) {
      grid-column: 1;
      grid-row: 3;
    }
    &:nth-child(5) {
      grid-column: 2;
      grid-row: 3;
    }
  }

  ${media.minMd} {
    &:nth-child(2) {
      grid-column: 2;
      grid-row: 1;
    }
    &:nth-child(3) {
      grid-column: 3;
      grid-row: 1;
    }
    &:nth-child(4) {
      grid-column: 4;
      grid-row: 1;
    }
    &:nth-child(5) {
      grid-column: 1;
      grid-row: 2;
      margin-top: 1rem;
    }
  }

  ${media.minLg} {
    &:nth-child(2) {
      grid-column: 2;
      grid-row: 1;
    }
    &:nth-child(3) {
      grid-column: 3;
      grid-row: 1;
    }
    &:nth-child(4) {
      grid-column: 4;
      grid-row: 1;
    }
    &:nth-child(5) {
      grid-column: 1 / -1;
      grid-row: 2;
      margin-top: 0;
    }
  }
`;

// If you want to keep it simple, here's a minimal working version:

// Alternative minimal version without complex media queries:
export const SimpleFooterContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;

  display: flex;
    gap: 1rem;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }
`;

export const FooterColumn = styled.div`
  flex: 1;                
`;

export const FooterList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  display: flex;
  flex-direction: column;   /* Links vertical rahenge */
`;


export const SimpleSection = styled.div`
  margin-bottom: 2rem;
  flex: 0 0 33.33%;  

`;

export const SimpleSectionTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1e293b;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  @media (max-width: 767px) {
    text-align: center;
  }
`;