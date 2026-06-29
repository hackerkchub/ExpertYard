import styled, { keyframes } from "styled-components";

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
  border-top-color: #000080;
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
  min-height: 100%;
  width: 100%;
  overflow-x: hidden;
  background:
    radial-gradient(circle at top left, rgba(37, 99, 235, 0.08), transparent 26%),
    linear-gradient(180deg, #f8fafc 0%, #eef3f8 100%);
  padding: 24px 0 56px;
  color: #111827;
  
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  @media (max-width: 1024px) {
    padding: 20px 0 48px;
  }

  @media (max-width: 768px) {
    padding: 0 0 40px;
  }
`;

export const Content = styled.div`
  width: min(100%, 1128px);
  margin: 0 auto;
  animation: ${fadeIn} 0.5s ease-out;
  padding: 0 16px;
  min-width: 0;

  @media (max-width: 768px) {
    padding: 0 12px;
  }

  @media (max-width: 390px) {
    padding: 0 10px;
  }
`;

/* Premium Header */
export const PremiumHeader = styled.div`
  background: #ffffff;
  border: 1px solid #d8e0eb;
  border-radius: 12px;
  padding: 18px 20px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    border-radius: 10px;
    padding: 16px;
  }
`;

export const HeaderGlow = styled.div`
  display: none;
`;

export const HeaderContent = styled.div`
  min-width: 0;
`;

export const HeaderTitle = styled.h1`
  font-size: clamp(22px, 3vw, 28px);
  line-height: 1.15;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  overflow-wrap: anywhere;
`;

export const HeaderGreeting = styled.span`
  font-size: 14px;
  color: #64748b;
  font-weight: 600;
`;

export const HeaderBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  background: #eff6ff;
  color: #1d4ed8;
  padding: 6px 10px;
  border: 1px solid #bfdbfe;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 800;
`;

export const HeaderStats = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

export const HeaderStat = styled.div`
  min-width: 132px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  text-align: left;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    border-color: ${props => props.clickable ? '#bfdbfe' : '#e2e8f0'};
    box-shadow: ${props => props.clickable ? '0 10px 22px rgba(15, 23, 42, 0.08)' : 'none'};
    transform: ${props => props.clickable ? 'translateY(-1px)' : 'none'};
  }

  @media (max-width: 430px) {
    flex: 1 1 calc(50% - 8px);
    min-width: 0;
  }
`;

export const HeaderStatIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
`;

export const HeaderStatInfo = styled.div`
  min-width: 0;
`;

export const HeaderStatLabel = styled.div`
  font-size: 11px;
  color: #737373;
`;

export const HeaderStatValue = styled.div`
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
  overflow-wrap: anywhere;
`;

/* Profile Card */
export const ProfileCard = styled.div`
  position: relative;
  background: #fff;
  border: 1px solid #d8e0eb;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 18px;
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.06);

  &::before {
    content: "";
    display: block;
    height: 164px;
    background:
      linear-gradient(135deg, rgba(0, 0, 128, 0.92), rgba(37, 99, 235, 0.82)),
      radial-gradient(circle at 82% 10%, rgba(255, 255, 255, 0.45), transparent 22%);
  }

  @media (max-width: 768px) {
    border-radius: 10px;
    margin-bottom: 16px;

    &::before {
      height: 124px;
    }
  }

  @media (max-width: 390px) {
    &::before {
      height: 110px;
    }
  }
`;

export const ProfileCardInner = styled.div`
  padding: 0 28px 28px;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  @media (max-width: 768px) {
    padding: 0 18px 22px;
  }

  @media (max-width: 390px) {
    padding: 0 14px 18px;
  }
`;

export const ProfileLeftColumn = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;
  min-width: 0;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    gap: 14px;
  }
`;

export const ProfileRightColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media (max-width: 1024px) {
    align-items: flex-start;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const PremiumAvatar = styled.div`
  position: relative;
  width: 148px;
  height: 148px;
  border-radius: 50%;
  border: 5px solid #fff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.22), 0 0 0 1px #d8e0eb;
  overflow: hidden;
  background: #e2e8f0;
  
  img { 
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
  }

  @media (max-width: 768px) {
    width: 116px;
    height: 116px;
    border-width: 4px;
  }
`;

export const AvatarContainer = styled.div`
  margin-top: -74px;
  flex: 0 0 auto;

  @media (max-width: 768px) {
    margin-top: -58px;
  }
`;

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

  @media (max-width: 768px) {
    opacity: 1;
    inset: auto 8px 8px auto;
    width: 36px;
    height: 36px;
    border-radius: 999px;
    background: #0f172a;
  }
`;

export const ExpertNameSection = styled.div`
  flex: 1 1 420px;
  min-width: 0;
  padding-top: 22px;

  @media (max-width: 768px) {
    width: 100%;
    flex-basis: auto;
    padding-top: 0;
  }
`;

export const ExpertName = styled.h2`
  font-size: clamp(24px, 3vw, 32px);
  line-height: 1.16;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 6px;
  overflow-wrap: break-word;
  word-break: normal;
`;

export const ExpertTitle = styled.p`
  font-size: 16px;
  color: #475569;
  margin: 0 0 12px;
  line-height: 1.45;
  overflow-wrap: break-word;
  word-break: normal;
`;

export const ExpertCategories = styled.div`
  display: flex;
  column-gap: 8px;
  row-gap: 6px;
  margin-top: 8px;
  flex-wrap: wrap;
  align-items: center;
  min-width: 0;
  max-width: 100%;

  > span:not(:last-child) {
    flex: 0 0 auto;
  }
`;

export const CategoryPill = styled.span`
  display: inline-flex;
  align-items: center;
  flex: 0 1 auto;
  max-width: 100%;
  background: #eef6ff;
  border: 1px solid #bfdbfe;
  padding: 5px 11px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: #1d4ed8;
  line-height: 1.25;
  white-space: normal;
  word-break: normal;
  overflow-wrap: break-word;
  hyphens: manual;
`;

/* Quick Stats */
export const QuickStatsGrid = styled.div`
  flex: 1 0 100%;
  display: grid;
  grid-template-columns: repeat(4, minmax(104px, 1fr));
  gap: 10px;
  margin-top: 18px;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 360px) {
    grid-template-columns: 1fr;
  }
`;

export const QuickStatCard = styled.div`
  min-width: 0;
  background: #f8fafc;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  cursor: ${props => props.clickable ? 'pointer' : 'default'};
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    border-color: ${props => props.clickable ? '#bfdbfe' : '#e2e8f0'};
    box-shadow: ${props => props.clickable ? '0 10px 22px rgba(15, 23, 42, 0.08)' : 'none'};
    transform: ${props => props.clickable ? 'translateY(-2px)' : 'none'};
  }
`;

export const QuickStatIcon = styled.div`
  display: none;
`;

export const QuickStatContent = styled.div``;

export const QuickStatValue = styled.div`
  font-size: 18px;
  line-height: 1.15;
  font-weight: 800;
  color: #0f172a;
  overflow-wrap: anywhere;
`;

export const QuickStatLabel = styled.div`
  margin-top: 3px;
  font-size: 11px;
  line-height: 1.25;
  color: #64748b;
  font-weight: 700;
`;

/* Buttons */
export const ActionButton = styled.button`
  background: ${props => props.primary ? '#000080' : 'transparent'};
  color: ${props => props.primary ? '#fff' : '#000080'};
  border: ${props => props.primary ? '1px solid #000080' : '1px solid #000080'};
  min-height: 42px;
  padding: 9px 18px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
  
  &:hover:not(:disabled) {
    background: ${props => props.primary ? '#004182' : 'rgba(10, 102, 194, 0.1)'};
    transform: translateY(-1px);
    box-shadow: 0 10px 18px rgba(0, 0, 128, 0.14);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ActionButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 0;

  @media (max-width: 768px) {
    width: 100%;
    gap: 10px;
  }
`;

/* Pricing Section */
export const PricingSection = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const PricingCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #d8e0eb;
  
  &[gradient="call"] {
    background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%);
    color: white;
  }
  
  &[gradient="chat"] {
    background: linear-gradient(135deg, #0f766e 0%, #0ea5e9 100%);
    color: white;
  }
  
  &[gradient="session"] {
    background: linear-gradient(135deg, #6d28d9 0%, #2563eb 100%);
    color: white;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 16px;
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
  font-size: 24px;
  line-height: 1.1;
  font-weight: 800;
  overflow-wrap: anywhere;
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
  gap: 6px;
  border: 1px solid #d8e0eb;
  border-radius: 12px;
  margin-bottom: 18px;
  background: #fff;
  padding: 6px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const PremiumTab = styled.button`
  flex: 1;
  min-width: max-content;
  background: ${props => props.active ? '#eef6ff' : 'transparent'};
  border: none;
  padding: 12px 14px;
  border-radius: 9px;
  font-size: 14px;
  font-weight: ${props => props.active ? '800' : '700'};
  color: ${props => props.active ? '#1d4ed8' : '#64748b'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  
  &:hover {
    background: #f8f9fa;
  }

  @media (max-width: 430px) {
    font-size: 13px;
    padding: 11px 12px;
  }
`;

export const TabContent = styled.div`
  min-width: 0;
`;

/* Cards & Lists */
export const InfoCard = styled.div`
  background: #fff;
  border: 1px solid #d8e0eb;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 0;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.055);
  min-width: 0;

  @media (max-width: 768px) {
    padding: 18px;
  }

  @media (max-width: 390px) {
    padding: 16px 14px;
  }

  label {
    display: inline-block;
    max-width: 100%;
    line-height: 1.35;
  }

  button {
    max-width: 100%;
    min-height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-weight: 700;
    line-height: 1.2;
    white-space: normal;
  }

  div[style*="display: flex"][style*="gap: 8px"],
  div[style*="display: flex"][style*="gap: '8px'"],
  div[style*="display: flex"][style*='gap: "8px"'] {
    flex-wrap: wrap;
  }

  div[style*="grid-template-columns: 1fr 1fr"],
  div[style*="grid-template-columns: '1fr 1fr'"],
  div[style*='grid-template-columns: "1fr 1fr"'],
  div[style*="gridTemplateColumns"] {
    min-width: 0;
  }

  @media (max-width: 430px) {
    div[style*="gridTemplateColumns"],
    div[style*="grid-template-columns"] {
      grid-template-columns: 1fr !important;
    }

    button {
      width: 100%;
    }
  }
`;

export const CardHeader = styled.div`
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  svg { color: #000080; }
`;

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InfoItem = styled.div`
  display: flex;
  gap: 12px;
  min-width: 0;

  @media (max-width: 430px) {
    gap: 10px;
  }
`;

export const InfoIcon = styled.div`
  color: #64748b;
  font-size: 18px;
  flex: 0 0 auto;
  padding-top: 2px;
`;

export const InfoContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const InfoLabel = styled.div`
  font-size: 12px;
  color: #737373;
  margin-bottom: 4px;
`;

export const InfoValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.45;
  overflow-wrap: anywhere;
`;

export const Description = styled.p`
  font-size: 14px;
  color: #334155;
  line-height: 1.65;
  margin: 0;
  overflow-wrap: anywhere;
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
  display: inline-flex;
  max-width: 100%;
  background: #e7f3ff;
  color: #000080;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.25;
  overflow-wrap: anywhere;
`;

/* Form Elements */
export const PremiumInput = styled.input`
  width: 100%;
  min-width: 0;
  min-height: 42px;
  padding: 11px 13px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #0f172a;
  background: #ffffff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus { 
    outline: none; 
    border-color: #2563eb; 
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
    background: #ffffff;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-width: 0;
  padding: 12px 13px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  min-height: 100px;
  line-height: 1.55;
  color: #0f172a;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
  }
`;

/* Grid System */
export const OverviewGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
  gap: 16px;
  align-items: start;
  min-width: 0;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const ExperienceGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

/* Documents */
export const DocumentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 16px;
  min-width: 0;

  @media (max-width: 430px) {
    grid-template-columns: 1fr;
  }
`;

export const DocumentCard = styled.div`
  border: 1px solid #d8e0eb;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  min-width: 0;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.05);
`;

export const DocumentPreview = styled.div`
  height: 148px;
  background: #f1f5f9;
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
  gap: 10px;
  min-width: 0;
`;

export const DocumentTitle = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  overflow-wrap: anywhere;
`;

export const DocumentUploadButton = styled.label`
  cursor: pointer;
  color: #000080;
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
  min-width: 0;
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
  min-width: 0;
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
  min-width: 0;
`;

export const ExperienceTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #1f2937;
  overflow-wrap: anywhere;
`;

export const ExperienceCompany = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #6b7280;
  overflow-wrap: anywhere;
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
  flex-wrap: wrap;

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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  min-width: 0;

  @media (max-width: 430px) {
    grid-template-columns: 1fr;
  }
`;

export const PlanCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #e2e8f0;
  min-width: 0;
  
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
  gap: 12px;
`;

export const PlanName = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  overflow-wrap: anywhere;
`;

export const PlanActions = styled.div`
  display: flex;
  gap: 8px;
  flex: 0 0 auto;
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
  min-width: 0;
  overflow-wrap: anywhere;
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
  padding: 16px;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 14px;
  width: min(100%, 600px);
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  min-width: 0;
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

  @media (max-width: 430px) {
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
  }
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
  min-width: 0;
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
  min-width: 0;
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
  min-width: 0;
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
  overflow-wrap: anywhere;
  min-width: 0;
`;

export const FilePreview = styled.div`
  margin-top: 12px;
  
  img {
    max-width: 100%;
    max-height: 200px;
    border-radius: 8px;
  }
`;
