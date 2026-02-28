// src/pages/AboutUs/AboutUs.styles.js
import styled from "styled-components";
import { Link } from "react-router-dom";

export const AboutContainer = styled.div`
  position: relative;
 padding-top: 80px;
  overflow-x: hidden;
  overflow-y: visible;
   width: 100%;
  max-width: 100vw;
  box-sizing: border-box;

`;

export const SectionSpacer = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
  margin: 1rem 0;
  box-sizing: border-box;
`;

export const HeroSection = styled.div`
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  padding: 4rem 1rem;
  text-align: center;
  position: relative;

  @media (max-width: 768px) {
    min-height: 60vh;
    padding: 3rem 1rem;
  }
`;

export const HeroContent = styled.div`
  max-width: 800px;
  z-index: 1;
`;

export const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.2;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

export const GradientText = styled.span`
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

export const Section = styled.section`
  padding: 3rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  text-align: ${props => props.center ? 'center' : 'left'};

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

export const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: #64748b;
  max-width: 700px;
  margin: ${props => props.center ? '0 auto 1.5rem' : '0 0 1.5rem'};
  text-align: ${props => props.center ? 'center' : 'left'};
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const SectionContent = styled.div`
  font-size: 1.1rem;
  color: #475569;
  line-height: 1.7;

  p {
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const StatItem = styled.div`
  text-align: center;
  padding: 2rem 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const StatLabel = styled.div`
  font-size: 1.1rem;
  color: #64748b;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const TeamSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const TeamMember = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-8px);
  }
`;

export const MemberIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2.5rem;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

export const MemberInfo = styled.div``;

export const MemberName = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

export const MemberRole = styled.div`
  font-size: 1rem;
  color: #3b82f6;
  font-weight: 600;
  margin-bottom: 1rem;
`;

export const MemberBio = styled.p`
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
`;

export const ValueCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  @media (min-width: 769px) {
  flex: 1;
}

   @media (max-width: 768px) {
    padding: 1.5rem;
  }

`;

export const ValueIcon = styled.div`
  font-size: 2.5rem;
  color: #3b82f6;
  margin-bottom: 1.5rem;
`;

export const ValueTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
`;

export const ValueDescription = styled.p`
  color: #64748b;
  line-height: 1.6;
  font-size: 0.95rem;
`;

export const ValuesGrid = styled.div`
  display: flex;
  flex-template-columns: repeat(2, 1fr);
  gap: 2rem;

     @media (min-width: 769px) {
    flex-direction: row;
  }

     @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

export const CTAButton = styled(Link)`
  display: inline-block;
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3);
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.95rem;
  }
`;

export const PartnerLogos = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2.5rem;
  flex-wrap: wrap;
  margin-top: 2rem;

  @media (max-width: 768px) {
    gap: 2rem;
  }
`;

export const PartnerIcon = styled.div`
  font-size: 2.5rem;
  color: #64748b;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    color: #3b82f6;
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const TimelineContainer = styled.div`
  position: relative;
  
  margin: 3rem auto 0;
  padding: 0 1rem;
   width: 100%;
  box-sizing: border-box;

   @media (min-width: 769px) {
    max-width: 800px;
  
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 2px;
    height: 100%;
    background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
  }
 }
`;

export const TimelineItem = styled.div`
  position: relative;
  margin-bottom: 2.5rem;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 100%;
    margin-left: 0;
  }

  @media (min-width: 769px) {
    width: 50%;
    margin-left: ${props =>
    props.position === "right"
      ? "margin-left: 50%;"
      : "margin-left: 0;"}
  }
`;

export const TimelineYear = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

export const TimelineContent = styled.div`
  background: white;
  padding: 1.25rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-size: 1rem;
  color: #475569;
  line-height: 1.6;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 0.95rem;
  }
`;

// Mission & Vision Responsive Styles

export const MissionVisionWrapper = styled.div`
  display: grid;
  gap: 2rem;

  /* Desktop */
  @media (min-width: 769px) {
    grid-template-columns: 1fr 1fr;
    background: white;
    padding: 3rem;
    border-radius: 20px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.08);
    align-items: start;
  }

  /* Mobile */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const MissionVisionCard = styled.div`
  padding: 2rem;
  
  /* Desktop */
  @media (min-width: 769px) {
    background: transparent;
    box-shadow: none;
    border-radius: 0;
  }

  /* Mobile */
  @media (max-width: 768px) {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    padding: 1.5rem;
  }
`;