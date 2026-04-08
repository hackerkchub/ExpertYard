import styled, { keyframes, css } from "styled-components";

/* Animations */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

/* Loading Styles */
export const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f3f2ef;
`;

export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 102, 194, 0.1);
  border-radius: 50%;
  border-top-color: #0a66c2;
  animation: ${spin} 1s linear infinite;
`;

export const LoadingSpinnerSmall = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
  display: inline-block;
  margin-right: 8px;
`;

export const LoadingText = styled.p`
  margin-top: 16px;
  color: #666;
  font-size: 14px;
  font-weight: 500;
`;

/* Page Layout - LinkedIn Background */
export const PageWrap = styled.div`
  min-height: 100vh;
  background-color: #f3f2ef;
  padding: 24px 0;
  
  @media (max-width: 768px) {
    padding: 0;
  }
`;

export const Content = styled.div`
  max-width: 1128px;
  margin: 0 auto;
  animation: ${fadeIn} 0.5s ease-out;
  padding: 0 16px;

  @media (max-width: 768px) {
    padding: 0;
  }
`;

/* Premium Header */
export const PremiumHeader = styled.div`
  background: #ffffff;
  border: 1px solid #dbdbdb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    border-radius: 0;
  }
`;

export const HeaderGlow = styled.div`
  display: none;
`;

export const HeaderContent = styled.div``;

export const HeaderTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #000;
  margin: 0;
`;

export const HeaderGreeting = styled.span`
  font-size: 14px;
  color: #737373;
  font-weight: 400;
`;

export const HeaderBadge = styled.div`
  background: #e7f3ff;
  color: #0a66c2;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
`;

export const HeaderStats = styled.div`
  display: flex;
  gap: 16px;
`;

export const HeaderStat = styled.div`
  text-align: right;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  transition: opacity 0.2s;
  
  &:hover {
    opacity: ${props => props.clickable ? '0.8' : '1'};
  }
`;

export const HeaderStatIcon = styled.div`
  display: none;
`;

export const HeaderStatInfo = styled.div``;

export const HeaderStatLabel = styled.div`
  font-size: 11px;
  color: #737373;
`;

export const HeaderStatValue = styled.div`
  font-size: 16px;
  font-weight: 700;
`;

/* Profile Card */
export const ProfileCard = styled.div`
  background: #fff;
  border: 1px solid #dbdbdb;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
`;

export const ProfileCardInner = styled.div`
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const ProfileLeftColumn = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

export const ProfileRightColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

export const PremiumAvatar = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 0 0 1px #dbdbdb;
  overflow: hidden;
  
  img { 
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
  }
`;

export const AvatarContainer = styled.div``;

export const AvatarBadge = styled.div`
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: #0095f6;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #fff;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AvatarUploadButton = styled.label`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  opacity: 0;
  transition: 0.2s;
  ${PremiumAvatar}:hover & { opacity: 1; }
`;

export const ExpertNameSection = styled.div`
  flex: 1;
`;

export const ExpertName = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #000;
  margin: 0 0 4px;
`;

export const ExpertTitle = styled.p`
  font-size: 16px;
  color: #737373;
  margin: 0 0 12px;
`;

export const ExpertCategories = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
`;

export const CategoryPill = styled.span`
  background: #f3f2ef;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  color: #666;
`;

/* Quick Stats */
export const QuickStatsGrid = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 12px;
  flex-wrap: wrap;
`;

export const QuickStatCard = styled.div`
  background: #fafafa;
  padding: 10px;
  border-radius: 8px;
  flex: 1;
  min-width: 100px;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.clickable ? '#f0f0f0' : '#fafafa'};
    transform: ${props => props.clickable ? 'translateY(-2px)' : 'none'};
  }
`;

export const QuickStatIcon = styled.div`
  display: none;
`;

export const QuickStatContent = styled.div``;

export const QuickStatValue = styled.div`
  font-size: 14px;
  font-weight: 700;
`;

export const QuickStatLabel = styled.div`
  font-size: 10px;
  color: #737373;
`;

/* Buttons */
export const ActionButton = styled.button`
  background: ${props => props.primary ? '#0A66C2' : 'transparent'};
  color: ${props => props.primary ? '#fff' : '#0A66C2'};
  border: ${props => props.primary ? 'none' : '1px solid #0A66C2'};
  padding: 8px 24px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  
  &:hover:not(:disabled) {
    background: ${props => props.primary ? '#004182' : 'rgba(10, 102, 194, 0.1)'};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ActionButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;

/* Pricing Section */
export const PricingSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

export const PricingCard = styled.div`
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  &[gradient="call"] {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  &[gradient="chat"] {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
  }
  
  &[gradient="session"] {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: white;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

export const PricingIconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

export const PricingContent = styled.div`
  flex: 1;
  margin-top: 12px;
`;

export const PricingValue = styled.div`
  font-size: 20px;
  font-weight: 700;
`;

export const PricingLabel = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  opacity: 0.9;
`;

export const PricingPeriod = styled.span`
  font-size: 12px;
  opacity: 0.8;
`;

export const PricingSlider = styled.div`
  margin-top: 16px;
`;

export const SliderLabel = styled.div`
  font-size: 11px;
  margin-bottom: 8px;
  opacity: 0.9;
`;

export const PremiumSlider = styled.input`
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    cursor: pointer;
  }
`;

/* Tabs */
export const PremiumTabs = styled.div`
  display: flex;
  border-bottom: 1px solid #dbdbdb;
  margin-bottom: 20px;
  background: #fff;
`;

export const PremiumTab = styled.button`
  flex: 1;
  background: none;
  border: none;
  padding: 16px;
  font-size: 14px;
  font-weight: ${props => props.active ? '700' : '400'};
  color: ${props => props.active ? '#000' : '#737373'};
  border-bottom: ${props => props.active ? '2px solid #000' : 'none'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  
  &:hover {
    background: #f8f9fa;
  }
`;

export const TabContent = styled.div``;

/* Cards & Lists */
export const InfoCard = styled.div`
  background: #fff;
  border: 1px solid #dbdbdb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
`;

export const CardHeader = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  svg { color: #0a66c2; }
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
  color: #737373;
  font-size: 18px;
`;

export const InfoContent = styled.div`
  flex: 1;
`;

export const InfoLabel = styled.div`
  font-size: 12px;
  color: #737373;
  margin-bottom: 4px;
`;

export const InfoValue = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

export const Description = styled.p`
  font-size: 14px;
  color: #262626;
  line-height: 1.5;
`;

export const InputGroup = styled.div`
  margin-bottom: 12px;
`;

export const VerifyButton = styled(ActionButton)`
  padding: 6px 12px;
  font-size: 12px;
`;

/* Categories */
export const CategoriesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const CategoryTag = styled.span`
  background: #e7f3ff;
  color: #0a66c2;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
`;

/* Form Elements */
export const PremiumInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dbdbdb;
  border-radius: 8px;
  font-size: 14px;
  &:focus { 
    outline: none; 
    border-color: #0a66c2; 
    box-shadow: 0 0 0 1px #0a66c2; 
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #dbdbdb;
  border-radius: 8px;
  font-size: 14px;
  min-height: 100px;
  &:focus {
    outline: none;
    border-color: #0a66c2;
  }
`;

/* Grid System */
export const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.2fr;
  gap: 20px;
  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

export const ExperienceGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* Documents */
export const DocumentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

export const DocumentCard = styled.div`
  border: 1px solid #dbdbdb;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
`;

export const DocumentPreview = styled.div`
  height: 120px;
  background: #f3f2ef;
  position: relative;
  img { width: 100%; height: 100%; object-fit: cover; }
`;

export const DocumentOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: 0.2s;
  ${DocumentPreview}:hover & { opacity: 1; }
`;

export const DocumentActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const DocumentAction = styled.a`
  color: white;
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.1);
  }
`;

export const DocumentInfo = styled.div`
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const DocumentTitle = styled.span`
  font-size: 13px;
  font-weight: 500;
`;

export const DocumentUploadButton = styled.label`
  cursor: pointer;
  color: #0a66c2;
  position: relative;
  
  input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

export const NoDocument = styled.div`
  padding: 20px;
  text-align: center;
  color: #737373;
  border: 1px dashed #dbdbdb;
`;

export const PdfPreview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #ff3040;
`;

/* Experience Section */
export const ExperienceSection = styled.div`
  margin-top: 24px;
`;

export const ExperienceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`;

export const AddExperienceButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

export const ExperienceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ExperienceItem = styled.div`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

export const ExperienceItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 12px;
`;

export const ExperienceTitleSection = styled.div`
  flex: 1;
`;

export const ExperienceTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #1f2937;
`;

export const ExperienceCompany = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #6b7280;
`;

export const ExperienceActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const ExperienceEditButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    transform: scale(1.1);
  }
`;

export const ExperienceDeleteButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    transform: scale(1.1);
  }
`;

export const ExperienceDate = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 12px;
`;

export const ExperienceCertificate = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;

  a {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #667eea;
    text-decoration: none;
    font-size: 13px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const NoExperienceMessage = styled.div`
  text-align: center;
  padding: 48px 24px;
  background: #f9fafb;
  border-radius: 12px;
  border: 2px dashed #e5e7eb;

  svg {
    color: #9ca3af;
    margin-bottom: 16px;
  }

  h3 {
    font-size: 18px;
    margin: 0 0 8px 0;
    color: #374151;
  }

  p {
    color: #6b7280;
    margin: 0;
  }
`;

export const TotalExperienceDisplay = styled.div`
  display: flex;
  gap: 16px;
  align-items: baseline;
  padding: 16px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 12px;
  flex-wrap: wrap;
`;

export const TotalExperienceYears = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
`;

export const TotalExperienceMonths = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #764ba2;
`;

/* Plans Tab Styles */
export const PlansContainer = styled.div`
  margin-top: 24px;
`;

export const PlansHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e2e8f0;
  flex-wrap: wrap;
  gap: 12px;
`;

export const AddPlanButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const PlansGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
`;

export const PlanCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

export const PlanHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const PlanName = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

export const PlanActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const PlanEditButton = styled.button`
  background: none;
  border: none;
  color: #0ea5ff;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
  
  &:hover {
    background: #e0f2fe;
  }
`;

export const PlanDeleteButton = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
  
  &:hover {
    background: #fee2e2;
  }
`;

export const PlanPrice = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: #0ea5ff;
  margin: 16px 0 8px;
`;

export const PlanDuration = styled.div`
  font-size: 14px;
  color: #64748b;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
`;

export const PlanFeatures = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const PlanFeature = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #475569;
`;

export const NoPlansMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: #f8fafc;
  border-radius: 20px;
  color: #64748b;
  
  h3 {
    margin: 16px 0 8px;
    color: #1e293b;
  }
  
  p {
    font-size: 14px;
  }
`;

/* Modal Styles */
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 24px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  
  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #1e293b;
  }
`;

export const ModalCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #64748b;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.2s;
  
  &:hover {
    background: #f1f5f9;
    color: #ef4444;
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
`;

export const ModalCancelButton = styled.button`
  padding: 10px 20px;
  background: #f1f5f9;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #e2e8f0;
  }
`;

export const ModalSubmitButton = styled.button`
  padding: 10px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/* Form Elements for Modal */
export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const FormLabel = styled.label`
  display: block;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
  font-size: 14px;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

export const FormSelect = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

export const FormHint = styled.small`
  display: block;
  color: #64748b;
  font-size: 12px;
  margin-top: 4px;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 14px;
  color: #1e293b;
`;

export const CheckboxInput = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #667eea;
`;

export const FileInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const FileInputLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f1f5f9;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  
  &:hover {
    background: #e2e8f0;
  }
`;

export const FileName = styled.span`
  font-size: 13px;
  color: #64748b;
`;

export const FilePreview = styled.div`
  margin-top: 12px;
  
  img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 8px;
  }
`;