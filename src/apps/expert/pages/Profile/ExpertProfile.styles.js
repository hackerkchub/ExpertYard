import styled, { keyframes, css } from "styled-components";

/* Animations */
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

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
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

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

/* Loading Styles */
export const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

export const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: ${spin} 1s ease-in-out infinite;
`;

export const LoadingSpinnerSmall = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: ${spin} 0.6s linear infinite;
`;

export const LoadingText = styled.p`
  margin-top: 20px;
  color: #fff;
  font-size: 18px;
  font-weight: 500;
`;

/* Page Layout */
export const PageWrap = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
  
  @media (max-width: 768px) {
    padding: 20px 12px;
  }
`;

export const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  animation: ${fadeIn} 0.6s ease-out;
`;

/* Premium Header */
export const PremiumHeader = styled.div`
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 30px;
  padding: 30px 40px;
  margin-bottom: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const HeaderGlow = styled.div`
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%);
  animation: ${shimmer} 8s infinite linear;
  pointer-events: none;
`;

export const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
`;

export const HeaderGreeting = styled.span`
  display: block;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
  margin-bottom: 8px;
`;

export const HeaderTitle = styled.h1`
  color: #fff;
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 12px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

export const HeaderBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  padding: 8px 16px;
  border-radius: 30px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

export const HeaderStats = styled.div`
  position: absolute;
  top: 30px;
  right: 40px;
  display: flex;
  gap: 20px;
  
  @media (max-width: 768px) {
    position: static;
    margin-top: 20px;
    justify-content: flex-start;
  }
`;

export const HeaderStat = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  padding: 12px 20px;
  border-radius: 20px;
  cursor: ${props => props.onClick ? 'pointer' : 'default'};
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
  }
`;

export const HeaderStatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

export const HeaderStatInfo = styled.div``;

export const HeaderStatLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  margin-bottom: 4px;
`;

export const HeaderStatValue = styled.div`
  color: #fff;
  font-size: 20px;
  font-weight: 700;
`;

/* Profile Card */
export const ProfileCard = styled.div`
  background: #fff;
  border-radius: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  overflow: hidden;
`;

export const ProfileCardInner = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 30px;
  padding: 30px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

/* Left Column */
export const ProfileLeftColumn = styled.div`
  display: flex;
  gap: 30px;
   min-width: 0;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

export const AvatarContainer = styled.div`
  flex-shrink: 0;
`;

export const PremiumAvatar = styled.div`
  position: relative;
  width: 140px;
  height: 140px;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const AvatarBadge = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  border: 2px solid #fff;
`;

export const AvatarUploadButton = styled.label`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${PremiumAvatar}:hover & {
    opacity: 1;
  }
`;

export const ExpertNameSection = styled.div`
  flex: 1;
`;

export const ExpertName = styled.h2`
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 8px;
  
  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const ExpertTitle = styled.p`
  font-size: 16px;
  color: #718096;
  margin: 0 0 12px;
`;

export const ExpertCategories = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const CategoryPill = styled.span`
  background: #f7fafc;
  color: #4a5568;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #e2e8f0;
`;

/* Quick Stats */
export const QuickStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const QuickStatCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f7fafc;
  border-radius: 16px;
  transition: all 0.3s ease;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  
  &:hover {
    background: #edf2f7;
    transform: ${props => props.clickable ? 'translateY(-2px)' : 'none'};
  }
`;

export const QuickStatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`;

export const QuickStatContent = styled.div``;

export const QuickStatValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #2d3748;
  line-height: 1.2;
`;

export const QuickStatLabel = styled.div`
  font-size: 11px;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

/* Right Column */
export const ProfileRightColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end; 
  @media (max-width: 1024px) {
    align-items: flex-start;
  }
`;

export const ActionButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  padding: 14px 28px;
  border: none;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  background: ${props => props.primary ? 
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
    '#f7fafc'};
  color: ${props => props.primary ? '#fff' : '#4a5568'};
  box-shadow: ${props => props.primary ? 
    '0 10px 20px rgba(102, 126, 234, 0.3)' : 
    '0 5px 10px rgba(0, 0, 0, 0.05)'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  &:hover {
    transform: ${props => props.disabled ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => !props.disabled && (props.primary ? 
      '0 15px 30px rgba(102, 126, 234, 0.4)' : 
      '0 8px 15px rgba(0, 0, 0, 0.1)')};
  }
  
  @media (max-width: 768px) {
    flex: 1;
  }
`;

/* Pricing Section */
export const PricingSection = styled.div`
   display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const PricingCard = styled.div`
  background: #fff;
  border-radius: 24px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  min-width: 0;  
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
  
  ${props => props.gradient === 'call' && css`
    background: linear-gradient(135deg, #f6f9ff 0%, #fff 100%);
    border-left: 4px solid #3b82f6;
  `}
  
  ${props => props.gradient === 'chat' && css`
    background: linear-gradient(135deg, #f0fdf4 0%, #fff 100%);
    border-left: 4px solid #10b981;
  `}
`;

export const PricingIconWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  
  ${props => props.gradient === 'call' && css`
    background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
    color: #fff;
    box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
  `}
  
  ${props => props.gradient === 'chat' && css`
    background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
    color: #fff;
    box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
  `}
`;

export const PricingContent = styled.div`
  flex: 1;
`;

export const PricingLabel = styled.div`
  font-size: 14px;
  color: #718096;
  margin-bottom: 4px;
`;

export const PricingValue = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #2d3748;
  line-height: 1.2;
`;

export const PricingPeriod = styled.div`
  font-size: 12px;
  color: #a0aec0;
`;

export const PricingSlider = styled.div`
   width: 100%;
  max-width: 200px;
  
  @media (max-width: 1024px) {
    width: 150px;
  }
`;

export const SliderLabel = styled.div`
  font-size: 12px;
  color: #718096;
  margin-bottom: 8px;
  text-align: center;
`;

export const PremiumSlider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 10px;
  background: linear-gradient(90deg, #3b82f6, #10b981);
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border: 2px solid #3b82f6;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      transform: scale(1.1);
    }
  }
`;

/* Premium Tabs */
export const PremiumTabs = styled.div`
  display: flex;
  gap: 4px;
  background: #f7fafc;
  padding: 4px;
  border-radius: 16px;
  margin-bottom: 24px;
`;

export const PremiumTab = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  background: ${props => props.active ? '#fff' : 'transparent'};
  color: ${props => props.active ? '#667eea' : '#718096'};
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none'};
  
  &:hover {
    color: #667eea;
  }
  
  svg {
    font-size: 18px;
  }
`;

/* Tab Content */
export const TabContent = styled.div`
  animation: ${fadeIn} 0.4s ease-out;
`;

/* Overview Grid */
export const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoCard = styled.div`
  background: #fff;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f4f8;
  
  svg {
    color: #667eea;
    font-size: 18px;
  }
`;

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InfoItem = styled.div`
  display: flex;
  gap: 12px;
`;

export const InfoIcon = styled.div`
  width: 36px;
  height: 36px;
  background: #f7fafc;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-size: 16px;
  flex-shrink: 0;
`;

export const InfoContent = styled.div`
  flex: 1;
`;

export const InfoLabel = styled.div`
  font-size: 12px;
  color: #718096;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const InfoValue = styled.div`
  font-size: 15px;
  color: #2d3748;
  font-weight: 500;
`;

export const Description = styled.p`
  font-size: 15px;
  color: #4a5568;
  line-height: 1.7;
  margin: 0;
`;

export const InputGroup = styled.div`
  display: flex;
  gap: 8px;
`;

export const PremiumInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

export const VerifyButton = styled.button`
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
  }
`;

export const CategoriesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const CategoryTag = styled.span`
  background: #f0f4ff;
  color: #667eea;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #e0e7ff;
`;

/* Experience Grid */
export const ExperienceGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const DocumentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const DocumentCard = styled.div`
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

export const DocumentPreview = styled.div`
  position: relative;
  height: 160px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${DocumentCard}:hover img {
    transform: scale(1.05);
  }
`;

export const DocumentOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${DocumentCard}:hover & {
    opacity: 1;
  }
`;

export const DocumentActions = styled.div`
  display: flex;
  gap: 12px;
`;

export const DocumentAction = styled.a`
  width: 40px;
  height: 40px;
  background: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  
  &:hover {
    transform: scale(1.1);
    background: #667eea;
    color: #fff;
  }
`;

export const DocumentInfo = styled.div`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const DocumentTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
`;

export const DocumentUploadButton = styled.label`
  width: 32px;
  height: 32px;
  background: #f7fafc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #718096;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #667eea;
    color: #fff;
  }
`;
// Add these to your existing ExpertProfile.styles.js

// No Document Placeholder
export const NoDocument = styled.div`
  width: 100%;
  height: 100%;
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7fafc;
  color: #a0aec0;
  font-size: 14px;
  border-radius: 12px;
  border: 2px dashed #e2e8f0;
`;

// PDF Preview
export const PdfPreview = styled.div`
  width: 100%;
  height: 100%;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff1f0;
  color: #e53e3e;
  gap: 8px;
  
  svg {
    font-size: 32px;
  }
  
  span {
    font-size: 12px;
    font-weight: 500;
  }
`;

// Update HeaderStat to handle clickable state
// export const HeaderStat = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 12px;
//   background: rgba(255, 255, 255, 0.15);
//   backdrop-filter: blur(5px);
//   padding: 12px 20px;
//   border-radius: 20px;
//   cursor: ${props => props.clickable ? 'pointer' : 'default'};
//   transition: all 0.3s ease;
//   border: 1px solid rgba(255, 255, 255, 0.1);
  
//   &:hover {
//     background: rgba(255, 255, 255, 0.25);
//     transform: ${props => props.clickable ? 'translateY(-2px)' : 'none'};
//   }
// `;