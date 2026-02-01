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

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

// Colors
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
  danger: '#ef4444'
};

// Gradients
const gradients = {
  primary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  secondary: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
  dark: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
  light: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)'
};

// Shadows
const shadows = {
  small: '0 1px 3px rgba(0, 0, 0, 0.1)',
  medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  large: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xlarge: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

// Breakpoints
const breakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1536px'
};

// Responsive Mixins
const media = {
  xs: `@media (max-width: ${breakpoints.xs})`,
  sm: `@media (max-width: ${breakpoints.sm})`,
  md: `@media (max-width: ${breakpoints.md})`,
  lg: `@media (max-width: ${breakpoints.lg})`,
  xl: `@media (max-width: ${breakpoints.xl})`,
  xxl: `@media (max-width: ${breakpoints.xxl})`,
  minSm: `@media (min-width: ${breakpoints.sm})`,
  minMd: `@media (min-width: ${breakpoints.md})`,
  minLg: `@media (min-width: ${breakpoints.lg})`
};

// Main Container
export const PageContainer = styled.div`
  min-height: 100vh;
  background: ${colors.light};
  overflow-x: hidden;
`;

// Breadcrumb
export const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  padding: 1rem;
  background: ${colors.lighter};
  border-bottom: 1px solid ${colors.grayLighter};
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  
  ${media.minMd} {
    padding: 1.25rem 2rem;
  }
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export const BreadcrumbItem = styled.button`
  background: none;
  border: none;
  color: ${props => props.active ? colors.primary : colors.gray};
  font-size: 0.75rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  ${media.minMd} {
    font-size: 0.875rem;
  }

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
  margin: 0 0.25rem;
  color: ${colors.grayLight};
  display: flex;
  align-items: center;
  flex-shrink: 0;
  
  ${media.minMd} {
    margin: 0 0.5rem;
  }
`;

// Hero Section
export const HeroSection = styled.header`
  background: ${gradients.primary};
  color: white;
  padding: 2rem 1rem;
  position: relative;
  overflow: hidden;
  
  ${media.minMd} {
    padding: 4rem 2rem;
  }
  
  ${media.md} {
    padding: 3rem 1.5rem;
  }
`;

export const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 50%);
  
  ${media.xs} {
    background-size: 200% 200%;
  }
`;

export const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 0 0.5rem;
  
  ${media.minMd} {
    padding: 0;
  }
`;

export const HeroTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
  letter-spacing: -0.025em;
  background: linear-gradient(to right, #ffffff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
  
  ${media.sm} {
    font-size: 2rem;
  }
  
  ${media.minMd} {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  ${media.lg} {
    font-size: 3rem;
  }
  
  ${media.xl} {
    font-size: 3.5rem;
  }
`;

export const HeroSubtitle = styled.p`
  font-size: 0.875rem;
  opacity: 0.9;
  max-width: 100%;
  margin: 0 auto 1.5rem;
  line-height: 1.5;
  padding: 0;
  
  ${media.sm} {
    font-size: 1rem;
    max-width: 90%;
  }
  
  ${media.minMd} {
    font-size: 1.1rem;
    max-width: 600px;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
  
  ${media.lg} {
    font-size: 1.25rem;
  }
`;

export const SearchContainer = styled.div`
  max-width: 100%;
  margin: 1.5rem auto 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
  z-index: 1;
  padding: 0;
  
  ${media.sm} {
    flex-direction: row;
    max-width: 500px;
    gap: 0.5rem;
  }
  
  ${media.minMd} {
    max-width: 600px;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  ${media.xs} {
    padding: 0 0.5rem;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  background: rgba(255, 255, 255, 0.95);
  color: ${colors.dark};
  box-shadow: ${shadows.medium};
  transition: all 0.3s ease;
  -webkit-appearance: none;
  
  ${media.sm} {
    font-size: 1rem;
    padding: 0.75rem 1.25rem;
    border-radius: 10px;
  }
  
  ${media.minMd} {
    padding: 1rem 1.5rem;
    border-radius: 12px;
    font-size: 1rem;
  }

  &::placeholder {
    color: ${colors.gray};
    font-size: 0.875rem;
    
    ${media.sm} {
      font-size: 0.9375rem;
    }
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
    
    ${media.minMd} {
      transform: translateY(-2px);
    }
  }
  
  /* Remove iOS input styling */
  -webkit-tap-highlight-color: transparent;
`;

export const SearchButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  background: white;
  color: ${colors.primary};
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${shadows.medium};
  -webkit-tap-highlight-color: transparent;
  
  ${media.sm} {
    width: auto;
    min-width: 120px;
    padding: 0.75rem 1.25rem;
    font-size: 0.875rem;
  }
  
  ${media.minMd} {
    padding: 1rem 2rem;
    font-size: 1rem;
    border-radius: 12px;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    
    ${media.minMd} {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
  }

  &:active {
    transform: translateY(0);
  }
  
  /* Mobile touch optimization */
  touch-action: manipulation;
  
  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

// Stats Bar
export const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  max-width: 1200px;
  margin: -1rem auto 2rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: ${shadows.large};
  border: 1px solid ${colors.grayLighter};
  position: relative;
  z-index: 10;
  
  ${media.sm} {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
    margin: -1.5rem auto 2.5rem;
    padding: 1.25rem;
    border-radius: 16px;
  }
  
  ${media.minMd} {
    margin: -2rem auto 3rem;
    padding: 1.5rem 2rem;
    border-radius: 20px;
    gap: 0;
  }
  
  ${media.xs} {
    margin: -0.75rem auto 1.5rem;
    padding: 0.75rem;
  }
`;

export const StatItem = styled.div`
  text-align: center;
  padding: 0.5rem;
  
  ${media.sm} {
    padding: 0.25rem;
  }
  
  ${media.minMd} {
    padding: 0 1rem;
    
    &:not(:last-child) {
      border-right: 1px solid ${colors.grayLighter};
    }
  }
  
  /* Remove border on mobile */
  &:nth-child(odd):not(:last-child) {
    border-right: 1px solid ${colors.grayLighter};
    
    ${media.sm} {
      border-right: none;
    }
  }
  
  &:nth-child(-n+2) {
    border-bottom: 1px solid ${colors.grayLighter};
    padding-bottom: 1rem;
    
    ${media.sm} {
      border-bottom: none;
      padding-bottom: 0;
    }
  }
`;

export const StatIcon = styled.div`
  width: 36px;
  height: 36px;
  background: ${colors.primary}15;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  color: ${colors.primary};
  
  ${media.sm} {
    width: 40px;
    height: 40px;
    margin-bottom: 0.75rem;
  }
  
  ${media.minMd} {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    margin-bottom: 1rem;
  }
  
  svg {
    width: 16px;
    height: 16px;
    
    ${media.sm} {
      width: 18px;
      height: 18px;
    }
    
    ${media.minMd} {
      width: 20px;
      height: 20px;
    }
  }
`;

export const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.darker};
  margin-bottom: 0.125rem;
  
  ${media.sm} {
    font-size: 1.375rem;
  }
  
  ${media.minMd} {
    font-size: 1.75rem;
    margin-bottom: 0.25rem;
  }
`;

export const StatLabel = styled.div`
  font-size: 0.75rem;
  color: ${colors.gray};
  font-weight: 500;
  line-height: 1.2;
  
  ${media.sm} {
    font-size: 0.8125rem;
  }
  
  ${media.minMd} {
    font-size: 0.875rem;
  }
`;

// Popular Section
export const PopularSection = styled.section`
  max-width: 1200px;
  margin: 0 auto 2rem;
  padding: 0 1rem;
  
  ${media.sm} {
    margin-bottom: 2.5rem;
    padding: 0 1.5rem;
  }
  
  ${media.minMd} {
    margin-bottom: 3rem;
    padding: 0 2rem;
  }
`;

export const PopularTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.darker};
  margin-bottom: 1rem;
  
  ${media.sm} {
    font-size: 1.375rem;
    gap: 0.625rem;
  }
  
  ${media.minMd} {
    font-size: 1.75rem;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  svg {
    color: ${colors.primary};
    width: 20px;
    height: 20px;
    
    ${media.minMd} {
      width: 24px;
      height: 24px;
    }
  }
`;

export const PopularGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  ${media.sm} {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
  
  ${media.minMd} {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
  
  ${media.xs} {
    gap: 0.75rem;
  }
`;

export const PopularCategory = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: ${shadows.medium};
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  text-align: center;
  -webkit-tap-highlight-color: transparent;
  
  ${media.sm} {
    border-radius: 14px;
    padding: 1.25rem;
  }
  
  ${media.minMd} {
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: ${shadows.large};
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.large};
    border-color: ${colors.primary};
    
    ${media.minMd} {
      transform: translateY(-4px);
      box-shadow: ${shadows.xlarge};
    }
  }
  
  &:active {
    transform: translateY(0);
  }
`;

// Main Content
export const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem 2rem;
  
  ${media.sm} {
    padding: 0 1.5rem 2.5rem;
  }
  
  ${media.minMd} {
    padding: 0 2rem 4rem;
  }
  
  ${media.xs} {
    padding: 0 0.75rem 1.5rem;
  }
`;

export const CategoriesHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  ${media.sm} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 0;
    margin-bottom: 2rem;
  }
`;

export const HeaderTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.darker};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${media.sm} {
    font-size: 1.375rem;
  }
  
  ${media.minMd} {
    font-size: 1.75rem;
    gap: 0.75rem;
  }

  .count {
    background: ${colors.primary}15;
    color: ${colors.primary};
    padding: 0.25rem 0.5rem;
    border-radius: 50px;
    font-size: 0.75rem;
    font-weight: 600;
    
    ${media.sm} {
      font-size: 0.875rem;
      padding: 0.25rem 0.75rem;
    }
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  
  ${media.sm} {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }
  
  ${media.xs} {
    width: 100%;
  }
`;

export const ViewToggle = styled.div`
  display: flex;
  background: ${colors.light};
  border-radius: 8px;
  padding: 0.25rem;
  border: 1px solid ${colors.grayLighter};
  width: fit-content;
  
  ${media.sm} {
    border-radius: 10px;
  }
  
  ${media.minMd} {
    border-radius: 12px;
  }
  
  ${media.xs} {
    width: 100%;
    justify-content: center;
  }
`;

export const ToggleButton = styled.button`
  padding: 0.5rem 0.75rem;
  background: ${props => props.$active ? colors.primary : 'transparent'};
  color: ${props => props.$active ? 'white' : colors.gray};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  
  ${media.sm} {
    padding: 0.5rem 1rem;
    border-radius: 7px;
  }
  
  ${media.minMd} {
    border-radius: 8px;
  }

  &:hover {
    background: ${props => props.$active ? colors.primaryDark : colors.grayLighter};
  }

  &:focus {
    outline: none;
  }
  
  svg {
    width: 16px;
    height: 16px;
    
    ${media.minMd} {
      width: 18px;
      height: 18px;
    }
  }
  
  ${media.xs} {
    flex: 1;
    text-align: center;
  }
`;

export const SortSelect = styled.select`
  padding: 0.625rem 0.75rem 0.625rem 2.25rem;
  border: 1px solid ${colors.grayLighter};
  border-radius: 8px;
  font-size: 0.8125rem;
  color: ${colors.dark};
  background: white;
  cursor: pointer;
  font-weight: 500;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: left 0.75rem center;
  background-size: 0.875rem;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  
  ${media.sm} {
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    font-size: 0.875rem;
    border-radius: 10px;
    background-size: 1rem;
  }
  
  ${media.minMd} {
    border-radius: 12px;
  }
  
  ${media.xs} {
    width: 100%;
  }

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px ${colors.primary}15;
  }
  
  /* Remove default arrow in Firefox */
  -moz-appearance: none;
  text-indent: 0.01px;
  text-overflow: '';
  
  /* Remove default arrow in IE */
  &::-ms-expand {
    display: none;
  }
`;

// Categories Grid
export const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
  
  ${media.sm} {
    grid-template-columns: ${props => props.$view === 'list' ? '1fr' : 'repeat(2, 1fr)'};
    gap: 1.25rem;
    margin-bottom: 2.5rem;
  }
  
  ${media.minMd} {
    grid-template-columns: ${props => props.$view === 'list' ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))'};
    gap: 1.5rem;
    margin-bottom: 3rem;
  }
  
  ${media.xs} {
    gap: 0.75rem;
  }
`;

export const CategoryCard = styled.div`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${shadows.medium};
  border: 1px solid ${colors.grayLighter};
  transition: all 0.3s ease;
  cursor: pointer;
  display: ${props => props.$view === 'list' ? 'flex' : 'block'};
  flex-direction: ${props => props.$view === 'list' ? 'row' : 'column'};
  align-items: ${props => props.$view === 'list' ? 'center' : 'stretch'};
  padding: ${props => props.$view === 'list' ? '0.75rem' : '0'};
  border: ${props => props.$active ? `2px solid ${colors.primary}` : `1px solid ${colors.grayLighter}`};
  -webkit-tap-highlight-color: transparent;
  
  ${media.sm} {
    border-radius: 14px;
    padding: ${props => props.$view === 'list' ? '1rem' : '0'};
  }
  
  ${media.minMd} {
    border-radius: 16px;
    box-shadow: ${shadows.large};
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.large};
    border-color: ${colors.primary};
    
    ${media.minMd} {
      transform: translateY(-4px);
      box-shadow: ${shadows.xlarge};
    }
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const CategoryImage = styled.img`
  width: ${props => props.$view === 'list' ? '60px' : '100%'};
  height: ${props => props.$view === 'list' ? '60px' : '160px'};
  object-fit: cover;
  border-radius: ${props => props.$view === 'list' ? '8px' : '12px 12px 0 0'};
  flex-shrink: 0;
  margin-right: ${props => props.$view === 'list' ? '1rem' : '0'};
  
  ${media.sm} {
    width: ${props => props.$view === 'list' ? '70px' : '100%'};
    height: ${props => props.$view === 'list' ? '70px' : '180px'};
    border-radius: ${props => props.$view === 'list' ? '10px' : '14px 14px 0 0'};
    margin-right: ${props => props.$view === 'list' ? '1.25rem' : '0'};
  }
  
  ${media.minMd} {
    width: ${props => props.$view === 'list' ? '80px' : '100%'};
    height: ${props => props.$view === 'list' ? '80px' : '200px'};
    border-radius: ${props => props.$view === 'list' ? '12px' : '16px 16px 0 0'};
    margin-right: ${props => props.$view === 'list' ? '1.5rem' : '0'};
  }
`;

export const CategoryInfo = styled.div`
  padding: ${props => props.$view === 'list' ? '0' : '1rem'};
  flex: 1;
  
  ${media.sm} {
    padding: ${props => props.$view === 'list' ? '0' : '1.25rem'};
  }
  
  ${media.minMd} {
    padding: ${props => props.$view === 'list' ? '0' : '1.5rem'};
  }
`;

export const CategoryName = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${colors.darker};
  margin-bottom: 0.375rem;
  line-height: 1.3;
  
  ${media.sm} {
    font-size: 1.0625rem;
    margin-bottom: 0.5rem;
  }
  
  ${media.minMd} {
    font-size: 1.25rem;
  }
`;

export const CategoryDescription = styled.p`
  color: ${colors.gray};
  line-height: 1.5;
  margin-bottom: 0.75rem;
  font-size: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  ${media.sm} {
    font-size: 0.8125rem;
    margin-bottom: 1rem;
  }
  
  ${media.minMd} {
    font-size: 0.875rem;
    -webkit-line-clamp: 3;
  }
`;

export const CategoryMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  
  ${media.sm} {
    flex-direction: row;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  ${media.xs} {
    flex-direction: column;
  }
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6875rem;
  color: ${colors.gray};
  
  ${media.sm} {
    font-size: 0.75rem;
    gap: 0.375rem;
  }

  svg {
    color: ${colors.primary};
    width: 12px;
    height: 12px;
    
    ${media.sm} {
      width: 13px;
      height: 13px;
    }
    
    ${media.minMd} {
      width: 14px;
      height: 14px;
    }
  }
`;

export const CategoryStats = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: ${colors.gray};
  line-height: 1.2;
  
  ${media.sm} {
    font-size: 0.8125rem;
  }
  
  ${media.minMd} {
    font-size: 0.875rem;
    gap: 0.5rem;
  }

  span {
    opacity: 0.7;
  }
`;

export const StatNumber = styled.span`
  font-weight: 700;
  color: ${colors.primary};
  font-size: 0.875rem;
  
  ${media.sm} {
    font-size: 0.9375rem;
  }
  
  ${media.minMd} {
    font-size: 1rem;
  }
`;

// Badges
export const PremiumBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: ${colors.darker};
  padding: 0.25rem 0.5rem;
  border-radius: 50px;
  font-size: 0.625rem;
  font-weight: 600;
  border: 1px solid #fbbf24;
  margin-top: 0.5rem;
  
  ${media.sm} {
    font-size: 0.6875rem;
    padding: 0.375rem 0.625rem;
    gap: 0.3125rem;
  }
  
  ${media.minMd} {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
    gap: 0.375rem;
  }

  svg {
    color: ${colors.primary};
    width: 10px;
    height: 10px;
    
    ${media.sm} {
      width: 11px;
      height: 11px;
    }
    
    ${media.minMd} {
      width: 12px;
      height: 12px;
    }
  }
`;

export const TrendingTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: ${colors.primary}15;
  color: ${colors.primary};
  padding: 0.25rem 0.5rem;
  border-radius: 50px;
  font-size: 0.625rem;
  font-weight: 600;
  margin-left: 0.5rem;
  
  ${media.sm} {
    font-size: 0.6875rem;
    padding: 0.25rem 0.625rem;
    gap: 0.3125rem;
  }
  
  ${media.minMd} {
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
    gap: 0.375rem;
  }
`;

// Action Section
export const CategoryAction = styled.div`
  padding: ${props => props.$view === 'list' ? '0' : '0 1rem 1rem'};
  flex-shrink: 0;
  width: ${props => props.$view === 'list' ? '120px' : 'auto'};
  
  ${media.sm} {
    padding: ${props => props.$view === 'list' ? '0' : '0 1.25rem 1.25rem'};
    width: ${props => props.$view === 'list' ? '140px' : 'auto'};
  }
  
  ${media.minMd} {
    padding: ${props => props.$view === 'list' ? '0' : '0 1.5rem 1.5rem'};
    width: ${props => props.$view === 'list' ? '200px' : 'auto'};
  }
`;

export const ViewButton = styled.button`
  width: 100%;
  padding: 0.625rem 0.75rem;
  background: ${gradients.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;
  
  ${media.sm} {
    padding: 0.75rem 1rem;
    font-size: 0.8125rem;
    border-radius: 10px;
    gap: 0.5rem;
  }
  
  ${media.minMd} {
    padding: 0.875rem 1.5rem;
    font-size: 0.875rem;
    border-radius: 12px;
  }

  &:hover {
    background: ${colors.primaryDark};
    transform: translateY(-1px);
    
    ${media.minMd} {
      transform: translateY(-2px);
    }
  }

  &:active {
    transform: translateY(0);
  }
  
  svg {
    width: 14px;
    height: 14px;
    
    ${media.minMd} {
      width: 16px;
      height: 16px;
    }
  }
`;

// Features Section
export const CategoryFeatures = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-top: 2.5rem;
  padding: 1.5rem;
  background: ${gradients.dark};
  border-radius: 12px;
  color: white;
  
  ${media.sm} {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.75rem;
    padding: 2rem;
    border-radius: 16px;
    margin-top: 3rem;
  }
  
  ${media.minMd} {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    padding: 3rem;
    border-radius: 20px;
    margin-top: 4rem;
  }
  
  ${media.xs} {
    padding: 1.25rem;
    gap: 1.25rem;
  }
`;

export const FeatureItem = styled.div`
  text-align: center;

  svg {
    margin-bottom: 0.75rem;
    color: ${colors.primaryLight};
    width: 28px;
    height: 28px;
    
    ${media.sm} {
      width: 30px;
      height: 30px;
    }
    
    ${media.minMd} {
      width: 32px;
      height: 32px;
      margin-bottom: 1rem;
    }
  }

  h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.375rem;
    
    ${media.sm} {
      font-size: 1.0625rem;
    }
    
    ${media.minMd} {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }
  }

  p {
    opacity: 0.8;
    line-height: 1.5;
    font-size: 0.75rem;
    
    ${media.sm} {
      font-size: 0.8125rem;
    }
    
    ${media.minMd} {
      font-size: 0.875rem;
      line-height: 1.6;
    }
  }
`;

// Loading Skeletons
export const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  ${media.sm} {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
  
  ${media.minMd} {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }
`;

export const SkeletonCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: ${shadows.medium};
  border: 1px solid ${colors.grayLighter};
  animation: ${pulse} 2s infinite;
  
  ${media.sm} {
    border-radius: 14px;
    padding: 1.25rem;
  }
  
  ${media.minMd} {
    border-radius: 16px;
    padding: 1.5rem;
  }
`;

export const SkeletonImage = styled.div`
  width: 100%;
  height: 160px;
  background: linear-gradient(90deg, ${colors.grayLighter} 25%, ${colors.light} 50%, ${colors.grayLighter} 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 8px;
  margin-bottom: 1rem;
  
  ${media.sm} {
    height: 180px;
    border-radius: 10px;
  }
  
  ${media.minMd} {
    height: 200px;
    border-radius: 12px;
  }
`;

export const SkeletonText = styled.div`
  height: ${props => props.height || '16px'};
  background: linear-gradient(90deg, ${colors.grayLighter} 25%, ${colors.light} 50%, ${colors.grayLighter} 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  width: ${props => props.width || '100%'};
  
  ${media.minMd} {
    height: ${props => props.height || '20px'};
  }
`;

export const SkeletonButton = styled.div`
  height: 36px;
  background: linear-gradient(90deg, ${colors.grayLighter} 25%, ${colors.light} 50%, ${colors.grayLighter} 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: 6px;
  margin-top: 1rem;
  
  ${media.sm} {
    height: 38px;
  }
  
  ${media.minMd} {
    height: 40px;
    border-radius: 8px;
  }
`;

// Empty State
export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  max-width: 100%;
  margin: 0 auto;
  
  ${media.sm} {
    padding: 4rem 1.5rem;
    max-width: 500px;
  }
  
  ${media.minMd} {
    padding: 6rem 2rem;
    max-width: 600px;
  }
`;

export const EmptyIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${colors.primary}15;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.primary};
  margin: 0 auto 1rem;
  
  ${media.sm} {
    width: 70px;
    height: 70px;
    margin-bottom: 1.25rem;
  }
  
  ${media.minMd} {
    width: 80px;
    height: 80px;
    margin-bottom: 1.5rem;
  }
  
  svg {
    width: 32px;
    height: 32px;
    
    ${media.minMd} {
      width: 48px;
      height: 48px;
    }
  }
`;

export const EmptyTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors.darker};
  margin-bottom: 0.75rem;
  
  ${media.sm} {
    font-size: 1.375rem;
    margin-bottom: 0.875rem;
  }
  
  ${media.minMd} {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }
`;

export const EmptyMessage = styled.p`
  color: ${colors.gray};
  line-height: 1.5;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  
  ${media.sm} {
    font-size: 0.9375rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }
  
  ${media.minMd} {
    font-size: 1rem;
  }
`;