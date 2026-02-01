// src/pages/HowItWorks/HowItWorks.styles.js
import styled from "styled-components";
import { Link } from "react-router-dom";

export const HowItWorksContainer = styled.div`
  position: relative;
  top: 80px;
  overflow: hidden;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
`;

export const HeroSection = styled.div`
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 1rem;
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
      radial-gradient(circle at 15% 50%, rgba(255,255,255,0.15) 0%, transparent 50%),
      radial-gradient(circle at 85% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
      url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
    z-index: 1;
  }

  @media (max-width: 768px) {
    min-height: 60vh;
    padding: 3rem 1rem;
  }
`;

export const HeroContent = styled.div`
  max-width: 800px;
  position: relative;
  z-index: 2;
`;

export const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  span {
    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
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
  opacity: 0.95;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
  text-align: ${props => props.center ? 'center' : 'left'};
  position: relative;
  
  &::after {
    content: '';
    display: ${props => props.center ? 'block' : 'none'};
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    margin: 1rem auto 0;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

export const SectionSubtitle = styled.p`
  font-size: 1.1rem;
  color: #718096;
  max-width: 700px;
  margin: ${props => props.center ? '0 auto 2rem' : '0 0 2rem'};
  text-align: ${props => props.center ? 'center' : 'left'};
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const StepsContainer = styled.section`
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: white;

  @media (max-width: 768px) {
    padding: 4rem 1rem;
  }
`;

export const StepCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  text-align: center;
  position: relative;
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.1);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid #e2e8f0;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #667eea, #764ba2);
    border-radius: 4px 4px 0 0;
  }

  &:hover {
    transform: translateY(-15px);
    box-shadow: 0 25px 50px rgba(102, 126, 234, 0.15);
  }

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

export const StepNumber = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 auto 1.5rem;
  position: relative;
  z-index: 2;
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);

  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    opacity: 0.2;
    z-index: 1;
  }
`;

export const StepIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const StepContent = styled.div``;

export const StepTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

export const StepDescription = styled.p`
  color: #718096;
  line-height: 1.7;
  font-size: 1.05rem;
`;

export const FeaturesSection = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  
  @media (max-width: 768px) {
    padding: 4rem 1rem;
  }
`;

export const FeatureGrid = styled.div`
  max-width: 1200px;
  margin: 3rem auto 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

export const FeatureCard = styled.div`
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #48bb78, #38a169);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

    &::before {
      opacity: 1;
    }
  }
`;

export const FeatureIcon = styled.div`
  font-size: 2.8rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const FeatureTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 1rem;
`;

export const FeatureDescription = styled.p`
  color: #718096;
  line-height: 1.6;
  font-size: 1rem;
`;

export const VideoSection = styled.section`
  padding: 6rem 2rem;
  background: white;
  
  @media (max-width: 768px) {
    padding: 4rem 1rem;
  }
`;

export const VideoContainer = styled.div`
  max-width: 900px;
  margin: 3rem auto 0;
`;

export const VideoPlaceholder = styled.div`
  position: relative;
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  border-radius: 24px;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 30% 30%, rgba(102, 126, 234, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, rgba(118, 75, 162, 0.3) 0%, transparent 50%);
  }

  @media (max-width: 768px) {
    height: 300px;
    border-radius: 16px;
  }
`;

export const PlayButton = styled.button`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);

  &:hover {
    transform: scale(1.15);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6);
  }

  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
    font-size: 1.4rem;
  }
`;

export const FAQSection = styled.section`
  padding: 6rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  
  @media (max-width: 768px) {
    padding: 4rem 1rem;
  }
`;

export const FAQItem = styled.div`
  margin-bottom: 1.5rem;
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border-left: 4px solid transparent;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
    border-left-color: #667eea;
  }
`;

export const FAQQuestion = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
  display: flex;
  align-items: flex-start;

  span {
    color: #667eea;
    margin-right: 1rem;
    font-weight: 700;
  }
`;

export const FAQAnswer = styled.p`
  color: #718096;
  line-height: 1.7;
  font-size: 1rem;
  display: flex;
  align-items: flex-start;

  span {
    color: #48bb78;
    margin-right: 1rem;
    font-weight: 700;
  }
`;

export const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 0.875rem 2rem;
    font-size: 1rem;
  }
`;

export const SecondaryButton = styled(CTAButton)`
  background: transparent;
  border: 2px solid #667eea;
  color: #667eea;
  box-shadow: none;

  &:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
  }
`;