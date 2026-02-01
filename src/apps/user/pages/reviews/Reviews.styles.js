// src/pages/Reviews/Reviews.styles.js
import styled from "styled-components";
import { Link } from "react-router-dom";

export const ReviewsContainer = styled.div`
  position: relative;
  top: 80px;
  overflow: hidden;
  background: #ffffff;
`;

export const HeroSection = styled.div`
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
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
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.15) 0%, transparent 50%);
    z-index: 1;
  }

  @media (max-width: 768px) {
    min-height: 50vh;
    padding: 3rem 1rem;
  }
`;

export const HeroContent = styled.div`
  max-width: 1200px;
  position: relative;
  z-index: 2;
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
  opacity: 0.95;
  line-height: 1.6;
  margin-bottom: 3rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  color: rgba(255, 255, 255, 0.95);

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 2rem;
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
  position: relative;

  ${props => props.center && `
    &::after {
      content: '';
      display: block;
      width: 60px;
      height: 4px;
      background: linear-gradient(90deg, #4f46e5, #7c3aed);
      margin: 1rem auto 0;
      border-radius: 2px;
    }
  `}

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

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2.5rem;
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
  padding: 2.5rem 2rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  transition: all 0.4s ease;
  border: 1px solid rgba(255, 255, 255, 0.25);

  &:hover {
    transform: translateY(-8px);
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  }
`;

export const StatNumber = styled.div`
  font-size: 3rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const StatLabel = styled.div`
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 600;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export const TrustBadges = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4rem;
  flex-wrap: wrap;
  padding: 3rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
  margin: 0 auto;
  max-width: 1000px;
  border: 1px solid #f3f4f6;

  @media (max-width: 768px) {
    gap: 2.5rem;
    padding: 2rem;
  }

  @media (max-width: 480px) {
    gap: 2rem;
    padding: 1.5rem;
  }
`;

export const TrustBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: #374151;
  font-weight: 600;

  div {
    font-size: 2.5rem;
    color: #4f46e5;
    margin-bottom: 0.75rem;
  }

  span {
    font-size: 0.95rem;
    color: #6b7280;
  }

  @media (max-width: 768px) {
    div {
      font-size: 2rem;
    }
  }
`;

export const PlatformMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2.5rem;
  margin-top: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricCard = styled.div`
  background: white;
  padding: 2.5rem 2rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.4s ease;
  border: 1px solid #f3f4f6;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4f46e5, #7c3aed);
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 16px;
  border: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.75rem;
  }
`;

export const FilterButton = styled.button`
  padding: 0.75rem 1.75rem;
  background: ${props => props.active ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : 'white'};
  color: ${props => props.active ? 'white' : '#374151'};
  border: 1px solid ${props => props.active ? 'transparent' : '#d1d5db'};
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)' : '#f3f4f6'};
    transform: translateY(-2px);
    box-shadow: ${props => props.active ? '0 5px 15px rgba(79, 70, 229, 0.3)' : '0 3px 10px rgba(0, 0, 0, 0.05)'};
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;

  @media (max-width: 768px) {
    min-width: 100%;
    order: -1;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1.25rem 1rem 3.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  color: #111827;
  background: white;
  transition: all 0.3s ease;
  font-weight: 500;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
  }
`;

export const ReviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 2.5rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

export const ReviewCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  border: 1px solid #f3f4f6;
  overflow: hidden;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
    border-color: #4f46e5;
  }

  ${props => props.featured && `
    border: 2px solid #10b981;
    background: white;
    
    &::before {
      content: '⭐ Featured Review';
      position: absolute;
      top: 20px;
      right: 20px;
      background: #10b981;
      color: white;
      padding: 0.5rem 1.25rem;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      z-index: 1;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
  `}
`;

export const ReviewerInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.75rem;
`;

export const ReviewerAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin-right: 1.25rem;
  flex-shrink: 0;
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.3);
`;

export const ReviewerDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ReviewerName = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ReviewerCategory = styled.div`
  font-size: 0.9rem;
  color: #4f46e5;
  background: #f5f3ff;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  display: inline-block;
  font-weight: 600;
  border: 1px solid #ede9fe;
`;

export const RatingStars = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.75rem;
  gap: 0.5rem;
`;

export const StarIcon = styled.span`
  color: #f59e0b;
  font-size: 1.5rem;

  &.empty {
    color: #e5e7eb;
  }
`;

export const ReviewContent = styled.div`
  margin-bottom: 2rem;
  position: relative;
`;

export const ReviewText = styled.p`
  color: #374151;
  line-height: 1.7;
  font-size: 1.05rem;
  font-style: italic;
`;

export const ReviewDate = styled.div`
  font-size: 0.9rem;
  color: #9ca3af;
  text-align: right;
  font-weight: 500;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
`;

export const VerifiedBadge = styled.span`
  color: #10b981;
  font-size: 1rem;
  margin-left: 0.5rem;
  vertical-align: middle;
  cursor: help;
`;

export const FeaturedReview = styled.div`
  background: white;
  color: #111827;
  padding: 3rem;
  border-radius: 24px;
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  border: 2px solid #4f46e5;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: linear-gradient(90deg, #4f46e5, #7c3aed);
  }

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  margin-top: 4rem;
`;

export const PageButton = styled.button`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.active ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : 'white'};
  color: ${props => props.active ? 'white' : '#374151'};
  border: 1px solid ${props => props.active ? 'transparent' : '#e5e7eb'};
  border-radius: 12px;
  font-size: 1rem;
  font-weight: ${props => props.active ? '700' : '600'};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 6px 20px rgba(79, 70, 229, 0.3)' : '0 3px 10px rgba(0, 0, 0, 0.05)'};

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    background: ${props => props.active ? 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)' : '#f9fafb'};
    box-shadow: ${props => props.active ? '0 10px 25px rgba(79, 70, 229, 0.4)' : '0 6px 15px rgba(0, 0, 0, 0.1)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;

export const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1.125rem 2.5rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  text-decoration: none;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.4s ease;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(79, 70, 229, 0.3);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 15px 40px rgba(79, 70, 229, 0.4);
    background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  text-align: center;
  background: #f9fafb;
  border-radius: 24px;
  border: 2px dashed #e5e7eb;

  svg {
    font-size: 4rem;
    color: #d1d5db;
    margin-bottom: 1.5rem;
  }

  h3 {
    font-size: 1.75rem;
    color: #111827;
    margin-bottom: 0.75rem;
    font-weight: 700;
  }

  p {
    color: #6b7280;
    font-size: 1.1rem;
    max-width: 500px;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
    
    svg {
      font-size: 3rem;
    }
    
    h3 {
      font-size: 1.5rem;
    }
  }
`;

export const SecondaryButton = styled(CTAButton)`
  background: transparent;
  border: 2px solid #4f46e5;
  color: #4f46e5;
  box-shadow: none;

  &:hover {
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: white;
    box-shadow: 0 15px 40px rgba(79, 70, 229, 0.4);
  }
`;

export const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
  margin: 2rem 0;
`;

export const ReviewStats = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  color: #6b7280;
  font-size: 0.95rem;

  strong {
    color: #111827;
  }
`;

export const ReviewMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f3f4f6;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;