// src/pages/ExpertGuidelines/ExpertGuidelines.styles.js
import styled from "styled-components";
import { Link } from "react-router-dom";

export const GuidelinesContainer = styled.div`
  position: relative;
  top: 80px;
  overflow: hidden;
  background: #ffffff;
`;

export const HeroSection = styled.div`
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  padding: 6rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
    z-index: 1;
  }

  @media (max-width: 768px) {
    min-height: 60vh;
    padding: 4rem 1rem;
  }
`;

export const HeroContent = styled.div`
  max-width: 1000px;
  position: relative;
  z-index: 2;
  margin: 0 auto;
`;

export const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: white;

  span {
    color: #fbbf24;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

export const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  color: rgba(255, 255, 255, 0.95);

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

export const Section = styled.section`
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 1rem;
  text-align: ${props => props.center ? 'center' : 'left'};

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

export const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: #6b7280;
  max-width: 700px;
  margin: ${props => props.center ? '0 auto 2rem' : '0 0 2rem'};
  text-align: ${props => props.center ? 'center' : 'left'};
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const ContentContainer = styled.div`
  margin-top: 2rem;
`;

export const GuidelineCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
    border-color: #3b82f6;
  }
`;

export const GuidelineIcon = styled.div`
  font-size: 2.5rem;
  color: #3b82f6;
  margin-bottom: 1.5rem;
`;

export const GuidelineContent = styled.div``;

export const GuidelineTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.75rem;
`;

export const GuidelineDescription = styled.p`
  color: #6b7280;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

export const GuidelineList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const ListItem = styled.li`
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  color: #4b5563;
  line-height: 1.5;
`;

export const Checklist = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
`;

export const ChecklistItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

export const ChecklistIcon = styled.div`
  color: ${props => props.positive ? '#10b981' : props.negative ? '#ef4444' : '#6b7280'};
  margin-right: 1rem;
  margin-top: 0.25rem;
  flex-shrink: 0;
`;

export const ChecklistContent = styled.div`
  color: #4b5563;
  line-height: 1.5;
`;

export const RequirementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

export const RequirementCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid ${props => props.mandatory ? '#10b981' : '#e5e7eb'};
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }
`;

export const RequirementIcon = styled.div`
  font-size: 2.5rem;
  color: ${props => props.mandatory ? '#10b981' : '#3b82f6'};
  margin-bottom: 1.5rem;
`;

export const RequirementTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.75rem;
`;

export const RequirementDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

export const Badge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.mandatory ? '#10b981' : '#3b82f6'};
  color: white;
`;

export const TabContainer = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
`;

export const TabHeader = styled.div`
  display: flex;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
  overflow-x: auto;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

export const TabButton = styled.button`
  padding: 1.5rem 2rem;
  background: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? '#3b82f6' : '#6b7280'};
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  border-bottom: 3px solid ${props => props.active ? '#3b82f6' : 'transparent'};

  &:hover {
    color: ${props => props.active ? '#3b82f6' : '#4b5563'};
    background: ${props => props.active ? 'white' : '#f1f5f9'};
  }

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }
`;

export const TabContent = styled.div`
  padding: 3rem;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

export const ProcessStep = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 3rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const StepNumber = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin-right: 2rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 1.5rem;
  }
`;

export const StepContent = styled.div`
  flex: 1;
`;

export const StepTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`;

export const StepDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 0.5rem;
`;

export const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1.125rem 2.5rem;
  background: white;
  color: #3b82f6;
  text-decoration: none;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(59, 130, 246, 0.4);
    background: #f8fafc;
  }

  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
`;

export const SecondaryButton = styled(CTAButton)`
  background: transparent;
  border: 2px solid white;
  color: white;
  box-shadow: none;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    box-shadow: 0 10px 30px rgba(255, 255, 255, 0.2);
  }
`;

export const WarningCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const InfoCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const FeatureList = styled.div`
  display: grid;
  gap: 1.5rem;
`;

export const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
`;

export const DownloadSection = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2.5rem;
  margin-top: 3rem;
  border: 1px solid #e5e7eb;
`;

export const CodeBlock = styled.pre`
  background: #1f2937;
  color: #f3f4f6;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  margin: 1.5rem 0;
`;

export const ResourceLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;
  background: #f8fafc;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;

  &:hover {
    background: #f1f5f9;
    border-color: #3b82f6;
    transform: translateY(-2px);
  }
`;

export const FAQSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const FAQItem = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }
`;

export const FAQQuestion = styled.h3`
  display: flex;
  align-items: flex-start;
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.75rem;
`;

export const FAQAnswer = styled.p`
  color: #6b7280;
  line-height: 1.6;
  padding-left: 2.5rem;
`;

export const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
  margin: 2rem auto;
  max-width: 1000px;
`;