import styled, { keyframes, css } from 'styled-components';

const colors = {
  primary: '#0a66c2',
  primaryLight: '#e7f3ff',
  primaryDark: '#004182',
  bgBody: '#f3f2ef',
  border: '#dce6e9',
  textMain: '#1d2226',
  textSecondary: '#666666',
  white: '#ffffff',
  verified: '#057642',
  star: '#f59e0b',
  danger: '#ef4444'
};

const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

// --- Global Layout ---
export const PageContainer = styled.div`
  background-color: ${colors.bgBody};
  min-height: 100vh;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

export const PageLayout = styled.div`
  max-width: 1128px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 12px 60px;

  @media (min-width: 992px) {
    display: grid;
    grid-template-columns: 300px 1fr;
    padding: 24px 16px;
  }
`;

// --- Header Section ---
export const PageHeader = styled.header`
  background-color: ${colors.white};
  border-bottom: 1px solid ${colors.border};
  padding: 20px 0;
  margin-bottom: 0;

  @media (min-width: 768px) { padding: 32px 0; }
`;

export const HeaderContent = styled.div`
  max-width: 1128px;
  margin: 0 auto;
  padding: 0 16px;
  text-align: center;
  @media (min-width: 768px) { text-align: left; }
`;

export const HeaderTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: ${colors.textMain};
  @media (min-width: 768px) { font-size: 28px; }
`;

export const HeaderSubtitle = styled.p`
  color: ${colors.textSecondary};
  font-size: 14px;
  margin-top: 6px;
  max-width: 600px;
  line-height: 1.5;
`;

export const SearchContainer = styled.div`
  display: flex;
  background: #eef3f8;
  border-radius: 8px;
  margin-top: 20px;
  width: 100%;
  border: 1px solid transparent;
  transition: all 0.2s;
  &:focus-within { background: white; border: 1px solid ${colors.primary}; box-shadow: 0 0 0 1px ${colors.primary}; }
  @media (min-width: 768px) { max-width: 560px; }
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: transparent;
  outline: none;
  font-size: 14px;
`;

export const SearchButton = styled.button`
  background: ${colors.primary};
  color: white;
  border: none;
  padding: 0 20px;
  border-radius: 0 8px 8px 0;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  &:hover { background: ${colors.primaryDark}; }
  @media (max-width: 480px) { span { display: none; } padding: 0 15px; }
`;

// --- Sidebar (Drawer on Mobile) ---
export const FiltersSidebar = styled.aside`
  @media (max-width: 991px) {
    position: fixed;
    top: 0; left: 0; bottom: 0;
    width: 280px;
    background: white;
    z-index: 2001;
    padding: 20px;
    overflow-y: auto;
    display: ${props => props.show ? 'block' : 'none'};
    animation: ${slideIn} 0.3s ease-out;
  }
`;

export const MobileFilterOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 2000;
  display: ${props => props.show ? 'block' : 'none'};
`;

export const MobileFilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${colors.border};
`;

export const MobileFilterClose = styled.button`
  background: none; border: none; cursor: pointer; color: ${colors.textMain};
`;

// --- Components Inside Sidebar ---
export const FilterSection = styled.div`
  background: white;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

export const FilterSectionTitle = styled.h3`
  font-size: 16px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
`;

export const SubcategoryFilterItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 4px;
  background: ${props => props.isSelected ? colors.primaryLight : 'transparent'};
  &:hover { background: #f3f3f3; }
`;

export const SubcategoryRadio = styled.div`
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid ${props => props.isSelected ? colors.primary : '#b2b2b2'};
  margin-right: 12px;
  position: relative;
  &::after {
    content: '';
    display: ${props => props.isSelected ? 'block' : 'none'};
    width: 10px; height: 10px; background: ${colors.primary};
    border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  }
`;

export const SubcategoryFilterLabel = styled.span`
  font-size: 14px;
  color: ${props => props.isSelected ? colors.primaryDark : colors.textMain};
  font-weight: ${props => props.isSelected ? '600' : '400'};
`;

export const SortSelect = styled.select`
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid ${colors.border};
  background-color: #f9fafb;
  font-size: 14px;
`;

export const ClearFiltersButton = styled.button`
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid ${colors.primary};
  background: transparent;
  color: ${colors.primary};
  font-weight: 600;
  cursor: pointer;
  &:hover { background: ${colors.primaryLight}; }
`;

// --- Main Content & Expert Cards ---
export const MainContent = styled.div` width: 100%; `;

export const FilterChipsContainer = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 0 16px;
  margin-bottom: 8px;
  &::-webkit-scrollbar { display: none; }
  @media (max-width: 991px) { margin-top: 10px; }
`;

export const FilterChip = styled.button`
  white-space: nowrap;
  padding: 8px 16px;
  border-radius: 24px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid ${props => props.isActive ? colors.primary : colors.border};
  background: ${props => props.isActive ? colors.primary : colors.white};
  color: ${props => props.isActive ? colors.white : colors.textSecondary};
  transition: all 0.2s;
  .count { margin-left: 6px; opacity: 0.8; font-weight: 400; }
  &:hover { border-color: ${colors.primary}; }
`;

export const ExpertCardPremium = styled.div`
  background: white;
  border: 1px solid ${colors.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
`;

export const ExpertHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
  @media (min-width: 576px) { flex-direction: row; text-align: left; }
`;

export const ExpertAvatar = styled.img`
  width: 90px; height: 90px; border-radius: 50%; object-fit: cover;
  border: 3px solid ${colors.primaryLight};
`;

export const ExpertInfo = styled.div` flex: 1; `;

export const ExpertName = styled.h3`
  font-size: 20px; color: ${colors.primary}; font-weight: 700;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  @media (min-width: 576px) { justify-content: flex-start; }
`;

export const ExpertTitle = styled.p` font-weight: 600; color: ${colors.textMain}; font-size: 15px; `;
export const ExpertSpeciality = styled.p` color: ${colors.textSecondary}; font-size: 13px; margin: 4px 0; `;
export const ExpertLocation = styled.p` font-size: 12px; color: ${colors.textSecondary}; display: flex; align-items: center; justify-content: center; gap: 4px; @media (min-width: 576px) { justify-content: flex-start; } `;

export const ExpertStats = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid #f3f2ef; padding-top: 16px;
  @media (min-width: 480px) { display: flex; gap: 30px; }
`;

export const StatItem = styled.div` display: flex; align-items: center; gap: 8px; font-size: 14px; `;
export const StatValue = styled.span` font-weight: 700; `;
export const StatLabel = styled.span` color: ${colors.textSecondary}; font-size: 12px; `;

export const ExpertPricing = styled.div`
  display: grid; grid-template-columns: 1fr; gap: 10px;
  @media (min-width: 480px) { grid-template-columns: 1fr 1fr; }
`;

export const PriceTag = styled.div`
  background: #f8f9fa; border: 1px solid #eee; padding: 10px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
`;

export const PriceAmount = styled.span` font-weight: 800; font-size: 16px; color: ${colors.textMain}; `;
export const PriceUnit = styled.span` font-size: 11px; color: ${colors.textSecondary}; `;

export const ActionButtons = styled.div`
  display: grid; grid-template-columns: 1fr; gap: 12px;
  @media (min-width: 480px) { grid-template-columns: 1fr 1fr; }
`;

export const StartChatButton = styled.button`
  background: ${colors.primary}; color: white; border: none; padding: 14px; border-radius: 28px;
  font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
  &:hover { background: ${colors.primaryDark}; }
`;

export const ViewProfileButton = styled.button`
  background: white; color: ${colors.primary}; border: 1.5px solid ${colors.primary};
  padding: 14px; border-radius: 28px; font-weight: 700; cursor: pointer;
  &:hover { background: ${colors.primaryLight}; }
`;

// --- Skeleton Loaders ---
export const SkeletonCard = styled.div`
  height: 250px; background: white; border-radius: 12px; border: 1px solid ${colors.border};
  padding: 20px; display: flex; flex-direction: column; gap: 15px;
`;

export const SkeletonAvatar = styled.div` width: 80px; height: 80px; border-radius: 50%; background: #f0f0f0; `;
export const SkeletonLine = styled.div` height: 14px; background: #f0f0f0; border-radius: 4px; width: ${props => props.width || '100%'}; `;
export const SkeletonButton = styled.div` height: 45px; border-radius: 24px; background: #f0f0f0; width: 140px; `;

// --- Breadcrumb & Utils ---
export const Breadcrumb = styled.div` 
  display: flex; align-items: center; gap: 8px; font-size: 13px; padding: 15px 16px; 
  color: ${colors.textSecondary}; overflow-x: auto; white-space: nowrap;
`;
export const BreadcrumbItem = styled.span` cursor: pointer; color: ${props => props.active ? colors.textMain : 'inherit'}; font-weight: ${props => props.active ? '600' : '400'}; &:hover { text-decoration: underline; } `;
export const BreadcrumbSeparator = styled.span` display: flex; align-items: center; `;

export const PageTitleSection = styled.div` margin-bottom: 20px; `;
export const PageTitle = styled.h2` font-size: 24px; font-weight: 700; @media (max-width: 768px) { font-size: 20px; } `;
export const ResultsInfo = styled.div` font-size: 14px; color: ${colors.textSecondary}; margin-top: 5px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center; `;
export const SelectedInfo = styled.span` color: ${colors.primary}; font-weight: 600; display: flex; align-items: center; gap: 4px; `;
export const DesktopInfo = styled.span` @media (max-width: 991px) { display: none; } `;

// --- Mobile Toggle Bar ---
export const MobileFilterToggle = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 16px; background: white; border-radius: 12px; margin: 0 12px 16px; border: 1px solid ${colors.border};
  @media (min-width: 992px) { display: none; }
`;

export const FilterToggleButton = styled.button`
  background: ${colors.primaryLight}; color: ${colors.primary}; border: none; padding: 8px 16px;
  border-radius: 20px; font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 8px;
`;

export const MobileResultsInfo = styled.span` font-size: 13px; font-weight: 500; color: ${colors.textSecondary}; `;

// --- Remaining Exports (For logic compatibility) ---
export const ExpertsGrid = styled.div` display: flex; flex-direction: column; `;
export const LoadingGrid = styled.div` display: flex; flex-direction: column; gap: 16px; `;
export const NoResults = styled.div` text-align: center; padding: 60px 20px; background: white; border-radius: 12px; `;
export const NoResultsTitle = styled.h3` margin-bottom: 10px; `;
export const NoResultsText = styled.p` color: ${colors.textSecondary}; margin-bottom: 20px; `;
export const PremiumBadge = styled.div` background: #fff9e6; border: 1px solid #ffeeba; padding: 15px; border-radius: 10px; margin-top: 15px; display: flex; gap: 12px; `;
export const BadgeIcon = styled.div` color: ${colors.star}; `;
export const BadgeText = styled.div` font-size: 12px; strong { display: block; margin-bottom: 2px; } `;
export const VerificationBadge = styled.div` display: flex; align-items: center; gap: 4px; color: ${colors.verified}; font-size: 12px; font-weight: 700; `;
export const ExpertVerified = styled.span` margin-left: 6px; `;
export const ExpertRating = styled.div` display: flex; align-items: center; gap: 8px; margin-top: 8px; `;
export const RatingStars = styled.div` display: flex; color: ${colors.star}; `;
export const RatingValue = styled.span` font-size: 13px; color: ${colors.textSecondary}; `;
export const HoroscopeSection = styled.div` margin-top: 30px; background: white; padding: 20px; border-radius: 12px; border: 1px solid ${colors.border}; `;
export const HoroscopeTitle = styled.h3` font-size: 18px; display: flex; align-items: center; gap: 10px; margin-bottom: 20px; `;
export const HoroscopeGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 12px; `;
export const HoroscopeCard = styled.div` border: 1px solid #eee; padding: 12px; border-radius: 8px; text-align: center; &:hover { border-color: ${colors.primary}; } `;
export const HoroscopeSign = styled.div` h4 { font-size: 14px; margin-bottom: 4px; } span { font-size: 10px; color: ${colors.textSecondary}; } `;
export const ReadButton = styled.button` background: none; border: none; color: ${colors.primary}; font-size: 12px; font-weight: 700; cursor: pointer; margin-top: 8px; `;
export const CtaSection = styled.div` margin-top: 40px; `;
export const RatingBanner = styled.div` text-align: center; margin-bottom: 20px; `;
export const Stars = styled.div` display: flex; justify-content: center; gap: 4px; color: ${colors.star}; margin-bottom: 8px; `;
export const RatingText = styled.p` font-size: 14px; color: ${colors.textSecondary}; `;
export const CtaBanner = styled.div` background: white; padding: 40px 20px; border-radius: 12px; border: 1px solid ${colors.border}; text-align: center; `;
export const CtaTitle = styled.h3` font-size: 24px; margin-bottom: 12px; `;
export const CtaDescription = styled.p` color: ${colors.textSecondary}; margin-bottom: 25px; `;
export const PrimaryButton = styled(StartChatButton)` max-width: 300px; margin: 0 auto; `;
export const SecondaryButton = styled(ViewProfileButton)` max-width: 300px; margin: 10px auto 0; `;
export const NoCategories = styled.div` text-align: center; padding: 100px 20px; `;
export const CategoryErrorTitle = styled.h2` margin-bottom: 10px; `;
export const CategoryErrorText = styled.p` color: ${colors.textSecondary}; margin-bottom: 30px; `;
export const SubcategoryFilterList = styled.div``;
export const PriceIcon = styled.div` color: ${colors.primary}; display: flex; `;
export const StatIcon = styled.div` color: ${colors.star}; display: flex; `;
export const SubcategoryCount = styled.span``;