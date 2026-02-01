import styled, { keyframes, css } from 'styled-components';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

const glow = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(99, 102, 241, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(99, 102, 241, 0.8);
  }
`;

// Common Styles
const colors = {
  primary: '#6366f1',
  primaryLight: '#818cf8',
  primaryDark: '#4f46e5',
  secondary: '#10b981',
  secondaryLight: '#34d399',
  dark: '#1f2937',
  darker: '#111827',
  light: '#f9fafb',
  lighter: '#ffffff',
  gray: '#6b7280',
  grayLight: '#9ca3af',
  grayLighter: '#e5e7eb',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6'
};

const shadows = {
  small: '0 1px 3px rgba(0, 0, 0, 0.1)',
  medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xlarge: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  glow: `0 0 20px ${colors.primary}20`
};

const gradients = {
  primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  secondary: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
  dark: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
  light: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)'
};

// Main Container
export const PageContainer = styled.div`
  min-height: 100vh;
  background: ${colors.light};
  animation: ${fadeIn} 0.5s ease-out;
`;

// Breadcrumb
export const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  padding: 1.25rem 2rem;
  background: ${colors.lighter};
  border-bottom: 1px solid ${colors.grayLighter};

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 0.875rem;
  }
`;

export const BreadcrumbItem = styled.button`
  background: none;
  border: none;
  color: ${props => props.active ? colors.primary : colors.gray};
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.active ? colors.primaryDark : colors.dark};
    background: ${props => props.active ? 'transparent' : colors.grayLighter};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${colors.primary}20;
  }
`;

export const BreadcrumbSeparator = styled.span`
  margin: 0 0.5rem;
  color: ${colors.grayLight};
  display: flex;
  align-items: center;
`;

// Header
export const PageHeader = styled.header`
  background: ${gradients.primary};
  color: white;
  padding: 3rem 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

export const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

export const HeaderTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.9) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.025em;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const HeaderSubtitle = styled.p`
  font-size: 1.125rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  max-width: 600px;
`;

export const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  max-width: 600px;
  margin-top: 2rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  }
`;

export const SearchButton = styled.button`
  padding: 1rem 2rem;
  background: white;
  color: ${colors.primary};
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.large};
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  }
`;

// Layout
export const PageLayout = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  gap: 2rem;

  @media (max-width: 1024px) {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
`;

// Sidebar Filters
export const FiltersSidebar = styled.aside`
  width: 280px;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 300px;
    background: white;
    z-index: 1000;
    padding: 1.5rem;
    transform: translateX(${props => props.show ? '0' : '-100%'});
    transition: transform 0.3s ease;
    box-shadow: ${shadows.xlarge};
    overflow-y: auto;
  }
`;

export const MobileFilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${colors.grayLighter};

  h3 {
    margin: 0;
    font-size: 1.25rem;
    color: ${colors.dark};
  }
`;

export const MobileFilterClose = styled.button`
  background: none;
  border: none;
  color: ${colors.gray};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.grayLighter};
    color: ${colors.dark};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${colors.primary}20;
  }
`;

export const FilterSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: ${shadows.medium};
  border: 1px solid ${colors.grayLighter};
`;

export const FilterSectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${colors.dark};

  svg {
    color: ${colors.primary};
  }
`;

export const SubcategoryFilterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const SubcategoryFilterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.isSelected ? `${colors.primary}15` : 'transparent'};
  border: 1px solid ${props => props.isSelected ? colors.primary : 'transparent'};

  &:hover {
    background: ${props => props.isSelected ? `${colors.primary}15` : colors.grayLighter};
    transform: translateX(4px);
  }
`;

export const SubcategoryRadio = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${props => props.isSelected ? colors.primary : colors.grayLight};
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${props => props.isSelected ? colors.primary : 'transparent'};
    transition: all 0.2s ease;
  }
`;

export const SubcategoryFilterLabel = styled.span`
  flex: 1;
  font-size: 0.875rem;
  color: ${props => props.isSelected ? colors.primary : colors.dark};
  font-weight: ${props => props.isSelected ? '600' : '400'};
`;

export const SubcategoryCount = styled.span`
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: ${colors.grayLighter};
  border-radius: 999px;
  color: ${colors.gray};
  font-weight: 500;
`;

export const SortSelect = styled.select`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 1px solid ${colors.grayLighter};
  border-radius: 0.75rem;
  font-size: 0.875rem;
  color: ${colors.dark};
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.primary}20;
  }

  &:hover {
    border-color: ${colors.gray};
  }
`;

export const ClearFiltersButton = styled.button`
  width: 100%;
  margin-top: 1rem;
  padding: 0.875rem 1rem;
  background: transparent;
  color: ${colors.gray};
  border: 1px solid ${colors.grayLighter};
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.grayLighter};
    color: ${colors.dark};
    border-color: ${colors.gray};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${colors.primary}20;
  }
`;

export const PremiumBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 0.75rem;
  border: 1px solid #fbbf24;
  margin-top: 2rem;
`;

export const BadgeIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

export const BadgeText = styled.div`
  flex: 1;
  
  strong {
    display: block;
    font-size: 0.875rem;
    color: ${colors.darker};
    margin-bottom: 0.25rem;
  }
  
  span {
    font-size: 0.75rem;
    color: ${colors.gray};
  }
`;

// Main Content
export const MainContent = styled.main`
  flex: 1;
  min-width: 0;
`;

export const FilterChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 1rem;
  box-shadow: ${shadows.medium};
  border: 1px solid ${colors.grayLighter};
`;

export const FilterChip = styled.button`
  padding: 0.75rem 1.25rem;
  background: ${props => props.isActive ? colors.primary : colors.light};
  color: ${props => props.isActive ? 'white' : colors.dark};
  border: none;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.medium};
    background: ${props => props.isActive ? colors.primaryDark : colors.grayLighter};
  }

  .count {
    background: ${props => props.isActive ? 'rgba(255,255,255,0.2)' : colors.grayLighter};
    color: ${props => props.isActive ? 'white' : colors.gray};
    padding: 0.125rem 0.5rem;
    border-radius: 999px;
    font-size: 0.75rem;
  }
`;

export const PageTitleSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${colors.grayLighter};
`;

export const PageTitle = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: ${colors.darker};
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

export const ExpertRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const RatingStars = styled.div`
  display: flex;
  gap: 0.125rem;
  color: #fbbf24;
`;

export const RatingValue = styled.span`
  font-size: 0.875rem;
  color: ${colors.gray};
  font-weight: 500;
`;

export const ResultsInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-size: 0.875rem;
  color: ${colors.gray};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

export const SelectedInfo = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: ${colors.primary}15;
  color: ${colors.primary};
  border-radius: 999px;
  font-weight: 500;
`;

export const DesktopInfo = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`;

// Expert Grid
export const ExpertsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const ExpertCardPremium = styled.div`
  background: white;
  border-radius: 1.25rem;
  padding: 1.5rem;
  box-shadow: ${shadows.medium};
  border: 1px solid ${colors.grayLighter};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${gradients.primary};
    opacity: ${props => props.isHovered ? 1 : 0};
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${shadows.xlarge};
    
    &::before {
      opacity: 1;
    }
  }
`;

export const ExpertHeader = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.25rem;
`;

export const ExpertAvatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${colors.grayLighter};
  transition: all 0.3s ease;

  ${ExpertCardPremium}:hover & {
    border-color: ${colors.primary};
    transform: scale(1.05);
  }
`;

export const ExpertInfo = styled.div`
  flex: 1;
`;

export const ExpertName = styled.h3`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${colors.darker};
  margin: 0 0 0.25rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ExpertVerified = styled.div`
  flex-shrink: 0;
`;

export const VerificationBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: ${colors.success};
  background: ${colors.success}15;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  font-weight: 500;
`;

export const ExpertTitle = styled.p`
  font-size: 0.875rem;
  color: ${colors.primary};
  margin: 0 0 0.25rem 0;
  font-weight: 600;
`;

export const ExpertSpeciality = styled.p`
  font-size: 0.875rem;
  color: ${colors.dark};
  margin: 0 0 0.25rem 0;
  font-weight: 500;
`;

export const ExpertLocation = styled.p`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: ${colors.gray};
  margin: 0;
`;

export const ExpertStats = styled.div`
  display: flex;
  gap: 1.5rem;
  padding: 1rem;
  background: ${colors.light};
  border-radius: 0.75rem;
  margin-bottom: 1.25rem;
`;

export const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const StatIcon = styled.div`
  width: 32px;
  height: 32px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.primary};
  box-shadow: ${shadows.small};
`;

export const StatValue = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: ${colors.darker};
`;

export const StatLabel = styled.span`
  font-size: 0.75rem;
  color: ${colors.gray};
`;

export const ExpertPricing = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const PriceTag = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: linear-gradient(135deg, ${colors.light} 0%, ${colors.lighter} 100%);
  border-radius: 0.75rem;
  border: 1px solid ${colors.grayLighter};
`;

export const PriceIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${colors.primary};
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PriceAmount = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${colors.darker};
`;

export const PriceUnit = styled.span`
  font-size: 0.75rem;
  color: ${colors.gray};
  margin-left: auto;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

export const ViewProfileButton = styled.button`
  flex: 1;
  padding: 0.875rem;
  background: transparent;
  color: ${colors.primary};
  border: 1px solid ${colors.primary};
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.primary}15;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${colors.primary}20;
  }
`;

export const StartChatButton = styled.button`
  flex: 1;
  padding: 0.875rem;
  background: ${gradients.primary};
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.primaryDark};
    transform: translateY(-2px);
    box-shadow: ${shadows.glow};
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${colors.primary}40;
  }
`;

// Horoscope Section
export const HoroscopeSection = styled.section`
  margin: 3rem 0;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1.5rem;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
    border-radius: 50%;
  }
`;

export const HoroscopeTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 1;
`;

export const HoroscopeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const HoroscopeCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }
`;

export const HoroscopeSign = styled.div`
  margin-bottom: 1rem;

  h4 {
    font-size: 1.125rem;
    font-weight: 700;
    margin: 0 0 0.25rem 0;
  }

  span {
    font-size: 0.75rem;
    opacity: 0.8;
  }
`;

export const ReadButton = styled.button`
  width: 100%;
  padding: 0.625rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: white;
    color: #764ba2;
    transform: translateY(-2px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
  }
`;

// CTA Section
export const CtaSection = styled.section`
  margin-top: 4rem;
`;

export const RatingBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  background: ${colors.light};
  border-radius: 1rem;
  margin-bottom: 2rem;
  border: 1px solid ${colors.grayLighter};
`;

export const Stars = styled.div`
  display: flex;
  gap: 0.25rem;
  color: #fbbf24;
`;

export const RatingText = styled.span`
  font-size: 0.875rem;
  color: ${colors.gray};
  font-weight: 500;
`;

export const CtaBanner = styled.div`
  padding: 3rem;
  background: ${gradients.dark};
  border-radius: 1.5rem;
  color: white;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%);
    border-radius: 50%;
  }
`;

export const CtaTitle = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const CtaDescription = styled.p`
  font-size: 1.125rem;
  opacity: 0.9;
  margin: 0 0 2rem 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

// Buttons
export const PrimaryButton = styled.button`
  padding: 1rem 2.5rem;
  background: ${gradients.primary};
  color: white;
  border: none;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  animation: ${glow} 2s infinite;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 40px rgba(99, 102, 241, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.3);
  }
`;

export const SecondaryButton = styled.button`
  padding: 1rem 2.5rem;
  background: transparent;
  color: ${colors.primary};
  border: 2px solid ${colors.primary};
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${colors.primary}15;
    transform: translateY(-2px);
    box-shadow: ${shadows.medium};
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${colors.primary}20;
  }
`;

// Mobile Components
export const MobileFilterToggle = styled.div`
  display: none;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-bottom: 1px solid ${colors.grayLighter};
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 1024px) {
    display: flex;
  }
`;

export const FilterToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: ${colors.primary};
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors.primaryDark};
    transform: translateY(-2px);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${colors.primary}40;
  }
`;

export const MobileResultsInfo = styled.span`
  font-size: 0.875rem;
  color: ${colors.gray};
  font-weight: 500;
`;

export const MobileFilterOverlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    display: block;
  }
`;

// Loading Skeletons
export const LoadingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

export const SkeletonCard = styled.div`
  background: white;
  border-radius: 1.25rem;
  padding: 1.5rem;
  box-shadow: ${shadows.medium};
  border: 1px solid ${colors.grayLighter};
  animation: ${pulse} 2s infinite;
`;

export const SkeletonAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${colors.grayLighter};
  margin-bottom: 1rem;
`;

export const SkeletonLine = styled.div`
  height: 12px;
  background: ${colors.grayLighter};
  border-radius: 6px;
  margin-bottom: 0.5rem;
  width: ${props => props.width || '100%'};
`;

export const SkeletonButton = styled.div`
  height: 40px;
  background: ${colors.grayLighter};
  border-radius: 0.75rem;
  margin-top: 1rem;
`;

// No Results/Error States
export const NoResults = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1.5rem;
  box-shadow: ${shadows.medium};
  border: 1px solid ${colors.grayLighter};
`;

export const NoResultsTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.darker};
  margin: 0 0 1rem 0;
`;

export const NoResultsText = styled.p`
  font-size: 1rem;
  color: ${colors.gray};
  margin: 0 0 2rem 0;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

export const NoCategories = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 2rem;
  text-align: center;
`;

export const CategoryErrorTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.darker};
  margin: 0 0 1rem 0;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const CategoryErrorText = styled.p`
  font-size: 1.125rem;
  color: ${colors.gray};
  margin: 0 0 2rem 0;
  max-width: 400px;
`;