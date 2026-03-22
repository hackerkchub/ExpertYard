import styled, { keyframes } from 'styled-components';

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

// --- Animations ---
const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

const scrollHintLoop = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-15px); }
  50% { transform: translateX(0); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

// --- Layout & Containers ---
export const PageContainer = styled.div`
  background-color: ${colors.bgBody};
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden; /* Prevent global horizontal scroll */
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

export const PageLayout = styled.div`
  max-width: 1128px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 10px 12px 80px;
  box-sizing: border-box;

  @media (min-width: 992px) {
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr); /* minmax(0, 1fr) prevents overflow */
    padding: 24px 16px;
    align-items: start;
  }
`;

export const MainContent = styled.div` 
  width: 100%;
  min-width: 0; /* Important for grid children overflow */
`;

// --- Header & Breadcrumbs ---
export const PageHeader = styled.header`
  background-color: ${colors.white};
  border-bottom: 1px solid ${colors.border};
  padding: 16px 0;
  margin-top: 10px;
  width: 100%;
  @media (min-width: 768px) { padding: 25px 0; }
`;

export const HeaderContent = styled.div` 
  max-width: 1128px; 
  margin: 0 auto; 
  padding: 0 16px; 
  box-sizing: border-box;
`;

export const HeaderTitle = styled.h1` font-size: 22px; font-weight: 800; color: ${colors.textMain}; margin: 0; `;
export const HeaderSubtitle = styled.p` color: ${colors.textSecondary}; font-size: 14px; margin-top: 6px; line-height: 1.4; `;

export const Breadcrumb = styled.div` 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  font-size: 13px; 
  padding: 12px 16px; 
  color: ${colors.textSecondary}; 
  flex-wrap: wrap; /* Wrap on small screens */
`;

export const BreadcrumbItem = styled.span` cursor: pointer; color: ${props => props.active ? colors.textMain : colors.primary}; font-weight: ${props => props.active ? '600' : '500'}; `;
export const BreadcrumbSeparator = styled.span` display: flex; align-items: center; font-size: 12px; `;

// --- Search ---
export const SearchContainer = styled.div`
  display: flex; background: #eef3f8; border-radius: 10px; margin-top: 15px; border: 1.5px solid transparent;
  width: 100%;
  box-sizing: border-box;
  &:focus-within { background: white; border: 1.5px solid ${colors.primary}; }
  @media (min-width: 768px) { max-width: 500px; }
`;

export const SearchInput = styled.input` flex: 1; padding: 12px 16px; border: none; background: transparent; outline: none; font-size: 15px; width: 100%; `;
export const SearchButton = styled.button` background: ${colors.primary}; color: white; border: none; padding: 0 18px; border-radius: 0 10px 10px 0; cursor: pointer; flex-shrink: 0; `;

// --- HORIZONTAL CHIPS ---
export const FilterChipsContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 8px 4px 16px;
  scroll-behavior: smooth;
  position: relative;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  box-sizing: border-box;
  &::-webkit-scrollbar { display: none; }

  animation: ${scrollHintLoop} 2s ease-in-out;

  &:after {
    content: '';
    position: absolute;
    right: 0; top: 0; height: 100%; width: 30px;
    background: linear-gradient(to right, transparent, ${colors.bgBody});
    pointer-events: none;
  }
`;

export const FilterChip = styled.button`
  white-space: nowrap;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid ${props => props.isActive ? colors.primary : colors.border};
  background: ${props => props.isActive ? colors.primary : colors.white};
  color: ${props => props.isActive ? colors.white : colors.textMain};
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  flex-shrink: 0; /* Prevent chips from shrinking */
  .count { margin-left: 6px; font-size: 12px; opacity: 0.7; }
`;

// --- EXPERT CARD ---
export const ExpertsGrid = styled.div` 
  display: flex; 
  flex-direction: column; 
  gap: 14px; 
  width: 100%;
`;

export const ExpertCardPremium = styled.div`
  background: white; border: 1px solid ${colors.border}; border-radius: 12px; padding: 14px;
  display: flex; flex-direction: column; gap: 10px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden; /* Critical for desktop overflow */
`;

export const ExpertHeader = styled.div` 
  display: flex; 
  flex-direction: row; 
  align-items: center; 
  gap: 14px; 
  width: 100%;
`;

export const ExpertAvatar = styled.img` width: 70px; height: 70px; border-radius: 50%; object-fit: cover; border: 2px solid ${colors.primaryLight}; flex-shrink: 0; `;

export const ExpertInfo = styled.div` 
  flex: 1; 
  min-width: 0; /* Allows text truncation to work */
`;

export const ExpertName = styled.h3` 
  font-size: 17px; color: ${colors.primary}; font-weight: 700; margin: 0; 
  display: flex; align-items: center; gap: 6px; 
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;

export const ExpertVerified = styled.span` color: ${colors.verified}; font-size: 14px; flex-shrink: 0; `;
export const VerificationBadge = styled.div` display: flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 700; color: ${colors.verified}; `;
export const ExpertTitle = styled.p` font-size: 14px; font-weight: 600; color: ${colors.textMain}; margin: 2px 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; `;
export const ExpertSpeciality = styled.p` font-size: 13px; color: ${colors.textSecondary}; margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; `;
export const ExpertLocation = styled.p` font-size: 12px; color: ${colors.textSecondary}; margin-top: 4px; display: flex; align-items: center; gap: 4px; `;

export const ExpertStats = styled.div` 
  display: flex; 
  gap: 15px; 
  padding: 10px 0; 
  border-top: 1px solid #f3f2ef; 
  overflow: hidden;
`;

export const StatItem = styled.div` display: flex; align-items: center; gap: 5px; font-size: 13px; white-space: nowrap; `;
export const StatIcon = styled.div` color: ${colors.star}; display: flex; `;
export const StatValue = styled.span` font-weight: 700; color: ${colors.textMain}; `;
export const StatLabel = styled.span` color: ${colors.textSecondary}; font-size: 12px; `;

// --- PRICING ---
export const ExpertPricing = styled.div` 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 8px; 
  padding: 4px 0;
  width: 100%;
`;

export const PriceTag = styled.div` 
  background: #f9fafb; border: 1px solid #f0f0f0; padding: 6px 10px; 
  border-radius: 8px; display: flex; align-items: center; justify-content: center; gap: 6px;
  min-width: 0;
`;

export const PriceIcon = styled.div` color: ${colors.primary}; display: flex; font-size: 14px; `;
export const PriceAmount = styled.span` font-weight: 800; font-size: 14px; color: ${colors.textMain}; `;
export const PriceUnit = styled.span` font-size: 11px; color: ${colors.textSecondary}; font-weight: 500; `;

export const ActionButtons = styled.div` 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 10px; 
  margin-top: 5px; 
  width: 100%;
`;

export const StartChatButton = styled.button` background: ${colors.primary}; color: white; border: none; padding: 12px; border-radius: 25px; font-weight: 700; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; `;
export const ViewProfileButton = styled.button` background: white; color: ${colors.primary}; border: 2px solid ${colors.primary}; padding: 10px; border-radius: 25px; font-weight: 700; font-size: 14px; cursor: pointer; `;

// --- Sidebar & Filters ---
export const FiltersSidebar = styled.aside`
  min-width: 0;
  @media (max-width: 991px) {
    position: fixed; top: 0; left: 0; bottom: 0; width: 280px; background: white; z-index: 2001; padding: 25px;
    display: ${props => props.show ? 'block' : 'none'}; animation: ${slideIn} 0.3s ease-out; overflow-y: auto;
  }
`;

export const FilterSection = styled.div` background: white; border: 1px solid ${colors.border}; border-radius: 10px; padding: 16px; margin-bottom: 15px; width: 100%; box-sizing: border-box; `;
export const FilterSectionTitle = styled.h3` font-size: 15px; font-weight: 700; margin-bottom: 12px; color: ${colors.textMain}; `;
export const SubcategoryFilterList = styled.div` display: flex; flex-direction: column; gap: 8px; `;
export const SubcategoryFilterItem = styled.div` display: flex; align-items: center; padding: 8px; border-radius: 8px; cursor: pointer; background: ${props => props.isSelected ? colors.primaryLight : 'transparent'}; `;
export const SubcategoryRadio = styled.div` width: 16px; height: 16px; border-radius: 50%; border: 2px solid ${colors.border}; margin-right: 10px; flex-shrink: 0; background: ${props => props.isSelected ? colors.primary : 'transparent'}; `;
export const SubcategoryFilterLabel = styled.span` font-size: 14px; font-weight: 500; color: ${props => props.isSelected ? colors.primary : colors.textMain}; `;
export const SubcategoryCount = styled.span` margin-left: auto; font-size: 12px; color: ${colors.textSecondary}; font-weight: 600; background: #f0f2f5; padding: 2px 8px; border-radius: 12px; `;

export const SortSelect = styled.select` width: 100%; padding: 10px; border-radius: 8px; font-size: 14px; border: 1px solid ${colors.border}; `;
export const ClearFiltersButton = styled.button` background: none; border: none; color: ${colors.danger}; font-size: 13px; margin-top: 15px; cursor: pointer; font-weight: 700; text-decoration: underline; `;

// --- Titles & Results ---
export const PageTitleSection = styled.div` margin-bottom: 12px; width: 100%; `;
export const PageTitle = styled.h2` font-size: 18px; font-weight: 800; color: ${colors.textMain}; margin: 0; `;
export const ResultsInfo = styled.div` font-size: 13px; color: ${colors.textSecondary}; display: flex; gap: 10px; align-items: center; margin-top: 6px; flex-wrap: wrap; `;
export const SelectedInfo = styled.span` color: ${colors.primary}; font-weight: 700; `;
export const DesktopInfo = styled.span` @media (max-width: 768px) { display: none; } `;

// --- ERROR & SKELETONS ---
export const NoCategories = styled.div` text-align: center; padding: 60px 20px; background: white; border-radius: 12px; margin: 20px 0; width: 100%; box-sizing: border-box; `;
export const CategoryErrorTitle = styled.h2` font-size: 20px; font-weight: 800; color: ${colors.textMain}; `;
export const CategoryErrorText = styled.p` font-size: 14px; color: ${colors.textSecondary}; margin-bottom: 20px; `;
export const LoadingGrid = styled.div` display: flex; flex-direction: column; gap: 14px; width: 100%; `;
export const SkeletonCard = styled.div` height: 160px; background: white; border-radius: 12px; border: 1px solid ${colors.border}; animation: ${pulse} 1.5s infinite; width: 100%; `;
export const SkeletonAvatar = styled.div``;
export const SkeletonLine = styled.div``;
export const SkeletonButton = styled.div``;

// --- Astrology ---
export const HoroscopeSection = styled.section` margin: 24px 0; background: white; padding: 20px; border-radius: 12px; border: 1px solid ${colors.border}; width: 100%; box-sizing: border-box; `;
export const HoroscopeTitle = styled.h2` font-size: 18px; font-weight: 800; margin-bottom: 15px; `;
export const HoroscopeGrid = styled.div` display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; `;
export const HoroscopeCard = styled.div` border: 1px solid #f3f2ef; padding: 12px; border-radius: 10px; text-align: center; background: #fafbfc; `;
export const HoroscopeSign = styled.div` h4 { font-size: 14px; font-weight: 700; margin: 0; color: ${colors.primary}; } span { font-size: 10px; color: ${colors.textSecondary}; } `;
export const ReadButton = styled.button` margin-top: 8px; background: ${colors.primary}; color: white; border: none; padding: 5px 12px; border-radius: 15px; font-size: 11px; font-weight: 700; `;

// --- Other UI Elements ---
export const ExpertRating = styled.div` display: flex; align-items: center; gap: 6px; margin-top: 4px; `;
export const RatingStars = styled.div` color: ${colors.star}; display: flex; font-size: 12px; `;
export const RatingValue = styled.span` font-size: 12px; color: ${colors.textSecondary}; font-weight: 600; `;
export const PremiumBadge = styled.div` background: #fff9e6; border: 1px solid #ffeeba; padding: 12px; border-radius: 10px; display: flex; gap: 10px; width: 100%; box-sizing: border-box; `;
export const BadgeIcon = styled.div` color: ${colors.star}; font-size: 18px; `;
export const BadgeText = styled.div` font-size: 12px; color: #856404; line-height: 1.4; `;

export const MobileFilterToggle = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; width: 100%; @media (min-width: 992px) { display: none; } `;
export const FilterToggleButton = styled.button` background: white; border: 1px solid ${colors.border}; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 6px; `;
export const MobileResultsInfo = styled.span` font-size: 13px; font-weight: 600; color: ${colors.textSecondary}; `;
export const MobileFilterOverlay = styled.div` position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 2000; display: ${props => props.show ? 'block' : 'none'}; `;
export const MobileFilterHeader = styled.div` display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; h3 { font-size: 18px; font-weight: 800; } `;
export const MobileFilterClose = styled.button` background: none; border: none; font-size: 24px; cursor: pointer; `;

export const NoResults = styled.div` text-align: center; padding: 60px 20px; width: 100%; `;
export const NoResultsTitle = styled.h2` font-size: 20px; font-weight: 700; `;
export const NoResultsText = styled.p` font-size: 14px; color: ${colors.textSecondary}; `;

export const CtaSection = styled.section` margin-top: 30px; width: 100%; `;
export const RatingBanner = styled.div` text-align: center; margin-bottom: 12px; `;
export const Stars = styled.div` color: ${colors.star}; display: flex; justify-content: center; gap: 2px; `;
export const RatingText = styled.p` font-size: 11px; color: ${colors.textSecondary}; `;
export const CtaBanner = styled.div` background: ${colors.primary}; color: white; padding: 25px 15px; border-radius: 12px; text-align: center; width: 100%; box-sizing: border-box; `;
export const CtaTitle = styled.h2` font-size: 17px; margin-bottom: 6px; `;
export const CtaDescription = styled.p` font-size: 12px; opacity: 0.9; margin-bottom: 15px; `;
export const PrimaryButton = styled.button` background: white; color: ${colors.primary}; border: none; padding: 10px 20px; border-radius: 20px; font-weight: 700; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 8px; margin: 0 auto; `;
export const SecondaryButton = styled.button` background: ${colors.primaryLight}; color: ${colors.primary}; border: none; padding: 10px 20px; border-radius: 20px; font-weight: 600; font-size: 13px; `;