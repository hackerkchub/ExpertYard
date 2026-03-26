import styled, { keyframes } from 'styled-components';

const colors = {
  primary: '#0a66c2',
  primaryLight: '#e7f3ff',
  primaryDark: '#004182',
  bgBody: '#f3f2ef',
  border: '#dce6e9',
  textMain: '#191919', /* Pure/Main Black */
  textSecondary: '#2b2b2b', /* Updated from #666666 to Dark Charcoal Black */
  white: '#ffffff',
  verified: '#057642',
  star: '#e08e00', /* Better visible Gold/Star color */
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
  overflow-x: hidden;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

export const PageLayout = styled.div`
  max-width: 1128px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px 14px 80px; /* Slight padding increase */
  box-sizing: border-box;

  @media (min-width: 992px) {
    display: grid;
    grid-template-columns: 280px minmax(0, 1fr);
    padding: 24px 16px;
    align-items: start;
  }
`;

export const MainContent = styled.div` 
  width: 100%;
  min-width: 0;
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

export const HeaderTitle = styled.h1` 
  font-size: 24px; /* Increased from 22px */
  font-weight: 800; 
  color: ${colors.textMain}; 
  margin: 0; 
`;

export const HeaderSubtitle = styled.p` 
  color: ${colors.textSecondary}; 
  font-size: 15px; /* Increased from 14px */
  margin-top: 8px; 
  line-height: 1.5; 
`;

export const Breadcrumb = styled.div` 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  font-size: 14px; /* Increased from 13px */
  padding: 12px 16px; 
  color: ${colors.textSecondary}; 
  flex-wrap: wrap; 
`;

export const BreadcrumbItem = styled.span` 
  cursor: pointer; 
  color: ${props => props.active ? colors.textMain : colors.primary}; 
  font-weight: ${props => props.active ? '700' : '600'}; /* Increased font weight */
`;

export const BreadcrumbSeparator = styled.span` 
  display: flex; 
  align-items: center; 
  font-size: 13px; /* Increased from 12px */
`;

// --- Search ---
export const SearchContainer = styled.div`
  display: flex; 
  background: #eef3f8; 
  border-radius: 10px; 
  margin-top: 15px; 
  border: 1.5px solid transparent;
  width: 100%;
  box-sizing: border-box;
  &:focus-within { background: white; border: 1.5px solid ${colors.primary}; }
  @media (min-width: 768px) { max-width: 500px; }
`;

export const SearchInput = styled.input` 
  flex: 1; 
  padding: 14px 16px; /* Increased padding */
  border: none; 
  background: transparent; 
  outline: none; 
  font-size: 16px; /* Increased from 15px (good for mobile zoom prevention) */
  width: 100%; 
  color: ${colors.textMain};
`;

export const SearchButton = styled.button` 
  background: ${colors.primary}; 
  color: white; 
  border: none; 
  padding: 0 20px; 
  border-radius: 0 10px 10px 0; 
  cursor: pointer; 
  flex-shrink: 0; 
  font-weight: 600;
  font-size: 15px;
`;

// --- HORIZONTAL CHIPS ---
export const FilterChipsContainer = styled.div`
  display: flex;
  gap: 12px;
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
  padding: 10px 18px; /* Increased padding */
  border-radius: 24px;
  font-size: 15px; /* Increased from 14px */
  font-weight: 600;
  border: 1px solid ${props => props.isActive ? colors.primary : colors.border};
  background: ${props => props.isActive ? colors.primary : colors.white};
  color: ${props => props.isActive ? colors.white : colors.textMain};
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  flex-shrink: 0; 
  .count { margin-left: 6px; font-size: 13px; font-weight: 700; opacity: 0.85; }
`;

// --- EXPERT CARD ---
export const ExpertsGrid = styled.div` 
  display: flex; 
  flex-direction: column; 
  gap: 16px; /* Increased from 14px */
  width: 100%;
`;

export const ExpertCardPremium = styled.div`
  background: white; 
  border: 1px solid ${colors.border}; 
  border-radius: 12px; 
  padding: 16px; /* Increased from 14px */
  display: flex; 
  flex-direction: column; 
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden; 
`;

export const ExpertHeader = styled.div` 
  display: flex; 
  flex-direction: row; 
  align-items: center; 
  gap: 14px; 
  width: 100%;
`;

export const ExpertAvatar = styled.img` 
  width: 80px; /* Increased from 70px */
  height: 80px; 
  border-radius: 50%; 
  object-fit: cover; 
  border: 2px solid ${colors.primaryLight}; 
  flex-shrink: 0; 
`;

export const ExpertInfo = styled.div` 
  flex: 1; 
  min-width: 0; 
`;

export const ExpertName = styled.h3` 
  font-size: 18px; /* Increased from 17px */
  color: ${colors.primary}; 
  font-weight: 800; /* Increased font weight */
  margin: 0; 
  display: flex; 
  align-items: center; 
  gap: 6px; 
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis;
`;

export const ExpertVerified = styled.span` 
  color: ${colors.verified}; 
  font-size: 15px; 
  flex-shrink: 0; 
`;

export const VerificationBadge = styled.div` 
  display: flex; 
  align-items: center; 
  gap: 4px; 
  font-size: 12.5px; /* Increased from 11px */
  font-weight: 700; 
  color: ${colors.verified}; 
`;

export const ExpertTitle = styled.p` 
  font-size: 15px; /* Increased from 14px */
  font-weight: 700; /* Increased weight */
  color: ${colors.textMain}; 
  margin: 3px 0; 
  overflow: hidden; 
  text-overflow: ellipsis; 
  white-space: nowrap; 
`;

export const ExpertSpeciality = styled.p` 
  font-size: 14px; /* Increased from 13px */
  color: ${colors.textSecondary}; 
  margin: 0; 
  overflow: hidden; 
  text-overflow: ellipsis; 
  white-space: nowrap; 
  font-weight: 500;
`;

export const ExpertLocation = styled.p` 
  font-size: 13px; /* Increased from 12px */
  color: ${colors.textSecondary}; 
  margin-top: 5px; 
  display: flex; 
  align-items: center; 
  gap: 4px; 
  font-weight: 500;
`;

export const ExpertStats = styled.div` 
  display: flex; 
  gap: 20px; /* Increased from 15px */
  padding: 12px 0; 
  border-top: 1px solid #eef0f2; 
  overflow: hidden;
`;

export const StatItem = styled.div` 
  display: flex; 
  align-items: center; 
  gap: 6px; 
  font-size: 14px; /* Increased from 13px */
  white-space: nowrap; 
`;

export const StatIcon = styled.div` 
  color: ${colors.star}; 
  display: flex; 
  font-size: 14px;
`;

export const StatValue = styled.span` 
  font-weight: 800; 
  color: ${colors.textMain}; 
`;

export const StatLabel = styled.span` 
  color: ${colors.textSecondary}; 
  font-size: 13px; /* Increased from 12px */
  font-weight: 600;
`;

// --- PRICING ---
export const ExpertPricing = styled.div` 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 10px; 
  padding: 6px 0;
  width: 100%;
`;

export const PriceTag = styled.div` 
  background: #f9fafb; 
  border: 1px solid #eef0f2; 
  padding: 8px 12px; /* Increased padding */
  border-radius: 10px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 8px;
  min-width: 0;
`;

export const PriceIcon = styled.div` 
  color: ${colors.primary}; 
  display: flex; 
  font-size: 15px; 
`;

export const PriceAmount = styled.span` 
  font-weight: 800; 
  font-size: 15px; /* Increased from 14px */
  color: ${colors.textMain}; 
`;

export const PriceUnit = styled.span` 
  font-size: 12px; /* Increased from 11px */
  color: ${colors.textSecondary}; 
  font-weight: 600; 
`;

export const ActionButtons = styled.div` 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 12px; 
  margin-top: 8px; 
  width: 100%;
`;

export const StartChatButton = styled.button` 
  background: ${colors.primary}; 
  color: white; 
  border: none; 
  padding: 13px; 
  border-radius: 28px; 
  font-weight: 700; 
  font-size: 15px; /* Increased from 14px */
  cursor: pointer; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 8px; 
`;

export const ViewProfileButton = styled.button` 
  background: white; 
  color: ${colors.primary}; 
  border: 2px solid ${colors.primary}; 
  padding: 11px; 
  border-radius: 28px; 
  font-weight: 700; 
  font-size: 15px; /* Increased from 14px */
  cursor: pointer; 
`;

// --- Sidebar & Filters ---
export const FiltersSidebar = styled.aside`
  min-width: 0;
  @media (max-width: 991px) {
    position: fixed; top: 0; left: 0; bottom: 0; width: 290px; background: white; z-index: 2001; padding: 25px;
    display: ${props => props.show ? 'block' : 'none'}; animation: ${slideIn} 0.3s ease-out; overflow-y: auto;
  }
`;

export const FilterSection = styled.div` 
  background: white; 
  border: 1px solid ${colors.border}; 
  border-radius: 12px; 
  padding: 18px; 
  margin-bottom: 16px; 
  width: 100%; 
  box-sizing: border-box; 
`;

export const FilterSectionTitle = styled.h3` 
  font-size: 16px; /* Increased from 15px */
  font-weight: 700; 
  margin-bottom: 14px; 
  color: ${colors.textMain}; 
`;

export const SubcategoryFilterList = styled.div` 
  display: flex; 
  flex-direction: column; 
  gap: 10px; 
`;

export const SubcategoryFilterItem = styled.div` 
  display: flex; 
  align-items: center; 
  padding: 10px; /* Increased padding */
  border-radius: 8px; 
  cursor: pointer; 
  background: ${props => props.isSelected ? colors.primaryLight : 'transparent'}; 
`;

export const SubcategoryRadio = styled.div` 
  width: 18px; /* Increased size */
  height: 18px; 
  border-radius: 50%; 
  border: 2px solid ${colors.border}; 
  margin-right: 12px; 
  flex-shrink: 0; 
  background: ${props => props.isSelected ? colors.primary : 'transparent'}; 
`;

export const SubcategoryFilterLabel = styled.span` 
  font-size: 15px; /* Increased from 14px */
  font-weight: 600; /* Increased weight */
  color: ${props => props.isSelected ? colors.primary : colors.textMain}; 
`;

export const SubcategoryCount = styled.span` 
  margin-left: auto; 
  font-size: 13px; /* Increased from 12px */
  color: ${colors.textSecondary}; 
  font-weight: 700; 
  background: #f0f2f5; 
  padding: 3px 10px; 
  border-radius: 14px; 
`;

export const SortSelect = styled.select` 
  width: 100%; 
  padding: 12px; /* Increased padding */
  border-radius: 8px; 
  font-size: 15px; /* Increased from 14px */
  font-weight: 600;
  color: ${colors.textMain};
  border: 1px solid ${colors.border}; 
  background: white;
`;

export const ClearFiltersButton = styled.button` 
  background: none; 
  border: none; 
  color: ${colors.danger}; 
  font-size: 14px; /* Increased from 13px */
  margin-top: 15px; 
  cursor: pointer; 
  font-weight: 700; 
  text-decoration: underline; 
`;

// --- Titles & Results ---
export const PageTitleSection = styled.div` margin-bottom: 14px; width: 100%; `;

export const PageTitle = styled.h2` 
  font-size: 20px; /* Increased from 18px */
  font-weight: 800; 
  color: ${colors.textMain}; 
  margin: 0; 
`;

export const ResultsInfo = styled.div` 
  font-size: 14px; /* Increased from 13px */
  color: ${colors.textSecondary}; 
  display: flex; 
  gap: 10px; 
  align-items: center; 
  margin-top: 8px; 
  flex-wrap: wrap; 
  font-weight: 500;
`;

export const SelectedInfo = styled.span` 
  color: ${colors.primary}; 
  font-weight: 700; 
`;

export const DesktopInfo = styled.span` @media (max-width: 768px) { display: none; } `;

// --- ERROR & SKELETONS ---
export const NoCategories = styled.div` text-align: center; padding: 60px 20px; background: white; border-radius: 12px; margin: 20px 0; width: 100%; box-sizing: border-box; `;

export const CategoryErrorTitle = styled.h2` 
  font-size: 22px; /* Increased from 20px */
  font-weight: 800; 
  color: ${colors.textMain}; 
`;

export const CategoryErrorText = styled.p` 
  font-size: 15px; /* Increased from 14px */
  color: ${colors.textSecondary}; 
  margin-bottom: 20px; 
  font-weight: 500;
`;

export const LoadingGrid = styled.div` display: flex; flex-direction: column; gap: 14px; width: 100%; `;
export const SkeletonCard = styled.div` height: 160px; background: white; border-radius: 12px; border: 1px solid ${colors.border}; animation: ${pulse} 1.5s infinite; width: 100%; `;
export const SkeletonAvatar = styled.div``;
export const SkeletonLine = styled.div``;
export const SkeletonButton = styled.div``;

// --- Astrology ---
export const HoroscopeSection = styled.section` 
  margin: 24px 0; 
  background: white; 
  padding: 24px; /* Increased padding */
  border-radius: 12px; 
  border: 1px solid ${colors.border}; 
  width: 100%; 
  box-sizing: border-box; 
`;

export const HoroscopeTitle = styled.h2` 
  font-size: 20px; /* Increased from 18px */
  font-weight: 800; 
  margin-bottom: 18px; 
  color: ${colors.textMain};
`;

export const HoroscopeGrid = styled.div` 
  display: grid; 
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); /* Increased min width */
  gap: 12px; 
`;

export const HoroscopeCard = styled.div` 
  border: 1px solid #eef0f2; 
  padding: 14px; 
  border-radius: 12px; 
  text-align: center; 
  background: #fafbfc; 
`;

export const HoroscopeSign = styled.div` 
  h4 { 
    font-size: 15px; /* Increased from 14px */
    font-weight: 700; 
    margin: 0; 
    color: ${colors.primary}; 
  } 
  span { 
    font-size: 11px; /* Increased from 10px */
    color: ${colors.textSecondary}; 
    font-weight: 600;
  } 
`;

export const ReadButton = styled.button` 
  margin-top: 10px; 
  background: ${colors.primary}; 
  color: white; 
  border: none; 
  padding: 6px 14px; 
  border-radius: 18px; 
  font-size: 12px; /* Increased from 11px */
  font-weight: 700; 
  cursor: pointer;
`;

// --- Other UI Elements ---
export const ExpertRating = styled.div` 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  margin-top: 5px; 
`;

export const RatingStars = styled.div` 
  color: ${colors.star}; 
  display: flex; 
  font-size: 13px; /* Increased from 12px */
`;

export const RatingValue = styled.span` 
  font-size: 13px; /* Increased from 12px */
  color: ${colors.textSecondary}; 
  font-weight: 700; /* Made bolder */
`;

export const PremiumBadge = styled.div` 
  background: #fff9e6; 
  border: 1px solid #ffeeba; 
  padding: 14px; 
  border-radius: 12px; 
  display: flex; 
  gap: 12px; 
  width: 100%; 
  box-sizing: border-box; 
`;

export const BadgeIcon = styled.div` 
  color: ${colors.star}; 
  font-size: 20px; /* Increased from 18px */
`;

export const BadgeText = styled.div` 
  font-size: 13px; /* Increased from 12px */
  color: #594300; /* Darker/Visible gold shade */
  line-height: 1.5; 
  font-weight: 600;
`;

export const MobileFilterToggle = styled.div` 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 14px; 
  width: 100%; 
  @media (min-width: 992px) { display: none; } 
`;

export const FilterToggleButton = styled.button` 
  background: white; 
  border: 1px solid ${colors.border}; 
  padding: 10px 18px; 
  border-radius: 24px; 
  font-size: 14px; /* Increased from 13px */
  font-weight: 700; 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  cursor: pointer;
  color: ${colors.textMain};
`;

export const MobileResultsInfo = styled.span` 
  font-size: 14px; /* Increased from 13px */
  font-weight: 700; 
  color: ${colors.textSecondary}; 
`;

export const MobileFilterOverlay = styled.div` 
  position: fixed; 
  top: 0; left: 0; right: 0; bottom: 0; 
  background: rgba(0,0,0,0.5); 
  z-index: 2000; 
  display: ${props => props.show ? 'block' : 'none'}; 
`;

export const MobileFilterHeader = styled.div` 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 20px; 
  h3 { 
    font-size: 19px; 
    font-weight: 800; 
    color: ${colors.textMain};
  } 
`;

export const MobileFilterClose = styled.button` 
  background: none; 
  border: none; 
  font-size: 26px; 
  cursor: pointer; 
  color: ${colors.textMain};
`;

export const NoResults = styled.div` text-align: center; padding: 60px 20px; width: 100%; `;

export const NoResultsTitle = styled.h2` 
  font-size: 22px; /* Increased from 20px */
  font-weight: 700; 
  color: ${colors.textMain};
`;

export const NoResultsText = styled.p` 
  font-size: 15px; /* Increased from 14px */
  color: ${colors.textSecondary}; 
  font-weight: 500;
`;

export const CtaSection = styled.section` margin-top: 30px; width: 100%; `;
export const RatingBanner = styled.div` text-align: center; margin-bottom: 12px; `;

export const Stars = styled.div` 
  color: ${colors.star}; 
  display: flex; 
  justify-content: center; 
  gap: 3px; 
  font-size: 14px;
`;

export const RatingText = styled.p` 
  font-size: 13px; /* Increased from 11px */
  color: ${colors.textSecondary}; 
  font-weight: 600;
  margin-top: 4px;
`;

export const CtaBanner = styled.div` 
  background: ${colors.primary}; 
  color: white; 
  padding: 30px 20px; /* Increased padding */
  border-radius: 12px; 
  text-align: center; 
  width: 100%; 
  box-sizing: border-box; 
`;

export const CtaTitle = styled.h2` 
  font-size: 19px; /* Increased from 17px */
  margin-bottom: 8px; 
  font-weight: 800;
`;

export const CtaDescription = styled.p` 
  font-size: 13px; /* Increased from 12px */
  opacity: 0.95; 
  margin-bottom: 18px; 
  font-weight: 500;
  line-height: 1.5;
`;

export const PrimaryButton = styled.button` 
  background: white; 
  color: ${colors.primary}; 
  border: none; 
  padding: 12px 24px; /* Increased padding */
  border-radius: 24px; 
  font-weight: 700; 
  font-size: 14px; /* Increased from 13px */
  cursor: pointer; 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  margin: 0 auto; 
`;

export const SecondaryButton = styled.button` 
  background: ${colors.primaryLight}; 
  color: ${colors.primary}; 
  border: none; 
  padding: 12px 24px; 
  border-radius: 24px; 
  font-weight: 700; 
  font-size: 14px; 
`;