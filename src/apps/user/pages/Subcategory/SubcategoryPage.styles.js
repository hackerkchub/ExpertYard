import styled, { keyframes } from 'styled-components';

const colors = {
  primary: '#000080',
  primaryLight: '#eef2ff',
  primaryDark: '#02044a',
  bgBody: '#f8fafc',
  border: '#e5e7eb',
  textMain: '#111827',
  textSecondary: '#667085',
  white: '#ffffff',
  yellow: '#f4c542',
  verified: '#057642',
  star: '#f59e0b',
  danger: '#dc2626'
};

const slideIn = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
`;

const pulse = keyframes`
  0% { opacity: 0.55; }
  50% { opacity: 1; }
  100% { opacity: 0.55; }
`;

export const PageContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: ${colors.textMain};
  background:
    radial-gradient(circle at 8% 0%, rgba(0, 0, 128, 0.08), transparent 30%),
    radial-gradient(circle at 90% 12%, rgba(244, 197, 66, 0.14), transparent 28%),
    linear-gradient(180deg, #f7f8fc 0%, #f8fafc 44%, #ffffff 100%);

  @media (min-width: 1024px) {
    background:
      radial-gradient(circle at 8% 0%, rgba(0, 0, 128, 0.08), transparent 30%),
      radial-gradient(circle at 92% 8%, rgba(255, 213, 74, 0.14), transparent 28%),
      #f8fafc;
  }
`;

export const PageLayout = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 14px 14px 64px;
  box-sizing: border-box;

  @media (min-width: 992px) {
    display: grid;
    grid-template-columns: 252px minmax(0, 1fr);
    align-items: start;
    gap: 16px;
    padding: 18px 16px 68px;
  }

  @media (min-width: 1024px) {
    max-width: none;
    grid-template-columns: minmax(260px, 292px) minmax(0, 1fr);
    gap: 22px;
    padding: 28px;
  }
`;

export const MainContent = styled.div`
  width: 100%;
  min-width: 0;
`;

export const PageHeader = styled.header`
  width: min(calc(100% - 28px), 1440px);
  visibility: hidden;
  padding: 14px;
  color: ${colors.white};
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0 0 24px 24px;
  box-shadow: 0 18px 42px rgba(0, 0, 128, 0.16);
  background:
    radial-gradient(circle at 12% 0%, rgba(255, 255, 255, 0.18), transparent 28%),
    radial-gradient(circle at 88% 20%, rgba(244, 197, 66, 0.28), transparent 24%),
    linear-gradient(135deg, #000080 0%, #03045e 55%, #020329 100%);

  @media (min-width: 1024px) {
    color: ${colors.white} !important;

    :where(h1, h2, h3, h4, p, span, small, strong, div, label, svg) {
      color: inherit !important;
    }

    input,
    input *,
    button,
    button * {
      color: ${colors.textMain} !important;
    }

    button,
    button * {
      color: ${colors.primary} !important;
    }
  }

  @media (max-width: 767px) {
    width: calc(100% - 20px);
    padding: 18px 0 20px;
    display:none;
    border-radius: 0 0 22px 22px;
  }
`;

export const HeaderContent = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 18px;
  box-sizing: border-box;
`;

export const HeaderTitle = styled.h1`
  margin: 0;
  color: ${colors.white};
  font-size: clamp(23px, 2.5vw, 34px);
  font-weight: 900;
  line-height: 1.08;
`;

export const HeaderSubtitle = styled.p`
  max-width: 760px;
  margin: 7px 0 0;
  color: rgba(255, 255, 255, 0.84);
  font-size: 14px;
  line-height: 1.5;
  font-weight: 500;
`;

export const SearchContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.34);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.16);
  box-sizing: border-box;

  &:focus-within {
    border-color: ${colors.yellow};
    box-shadow: 0 16px 42px rgba(244, 197, 66, 0.2);
  }

  @media (min-width: 768px) {
    max-width: 560px;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  width: 100%;
  padding: 12px 14px;
  border: none;
  outline: none;
  background: transparent;
  color: ${colors.textMain};
  font-size: 15px;
  font-weight: 600;

  &::placeholder {
    color: #98a2b3;
  }
`;

export const SearchButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-shrink: 0;
  padding: 0 18px;
  border: none;
  background: linear-gradient(135deg, #ffd95a, ${colors.yellow});
  color: ${colors.primary};
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;

  @media (max-width: 480px) {
    padding: 0 14px;
  }
`;

export const ExpertsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-items: stretch;
  gap: 18px;
  width: 100%;

  > * {
    min-width: 0;
    height: 100%;
  }

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }

  @media (min-width: 992px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 22px;
  }
`;

export const ExpertCardPremium = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  width: 100%;
  min-width: 0;
  height: 100%;
  min-height: 334px;
  padding: 14px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 128, 0.08);
  border-radius: 18px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 255, 255, 0.94)),
    radial-gradient(circle at top right, rgba(0, 0, 128, 0.08), transparent 36%);
  box-shadow: 0 12px 28px rgba(16, 24, 40, 0.08);
  box-sizing: border-box;
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(0, 0, 128, 0.18);
    box-shadow: 0 18px 42px rgba(16, 24, 40, 0.14);
  }

  @media (max-width: 767px) {
    min-height: 312px;
    padding: 13px;
    gap: 8px;
  }
`;

export const ExpertHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-width: 0;
  min-height: 58px;
`;

export const ExpertAvatar = styled.img`
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  object-fit: cover;
  border: 3px solid ${colors.white};
  border-radius: 16px;
  box-shadow: 0 7px 16px rgba(0, 0, 128, 0.13);

  @media (max-width: 767px) {
    width: 46px;
    height: 46px;
    border-radius: 16px;
  }
`;

export const ExpertInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ExpertName = styled.h3`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  color: ${colors.primary};
  font-size: 15px;
  font-weight: 900;
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ExpertTitle = styled.p`
  margin: 3px 0 0;
  color: ${colors.textMain};
  font-size: 12.5px;
  font-weight: 800;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ExpertStats = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  flex-wrap: wrap;
  min-height: 42px;
  max-height: 48px;
  overflow: hidden;
  padding: 7px 8px;
  border: 1px solid #eef2f7;
  border-radius: 14px;
  background: #f8fafc;
`;

export const StatItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  font-size: 11.5px;
  font-weight: 700;
  color: ${colors.textSecondary};
`;

export const StatValue = styled.span`
  color: ${colors.textMain};
  font-weight: 900;
`;

export const ExpertPricing = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  width: 100%;
  min-height: 56px;
`;

export const PriceTag = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  padding: 7px 6px;
  text-align: center;
  border: 1px solid #e8edf5;
  border-radius: 13px;
  background: linear-gradient(180deg, #ffffff, #f8fafc);
`;

export const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  width: 100%;
`;

export const StartChatButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 36px;
  padding: 8px 10px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, ${colors.primary}, #05044f);
  color: ${colors.white};
  font-size: 12.5px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(0, 0, 128, 0.18);
  transition: transform 180ms ease, box-shadow 180ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 26px rgba(0, 0, 128, 0.24);
  }
`;

export const ViewProfileButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 7px 10px;
  border: 1.5px solid rgba(0, 0, 128, 0.4);
  border-radius: 999px;
  background: ${colors.white};
  color: ${colors.primary};
  font-size: 12.5px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${colors.primary};
    background: ${colors.primaryLight};
  }
`;

export const FiltersSidebar = styled.aside`
  min-width: 0;

  @media (min-width: 992px) {
    position: sticky;
    top: 82px;
  }

  @media (max-width: 991px) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: min(320px, 86vw);
    z-index: 2001;
    display: ${props => props.$show ? 'block' : 'none'};
    padding: 22px 16px;
    overflow-y: auto;
    background: ${colors.white};
    box-shadow: 18px 0 45px rgba(15, 23, 42, 0.24);
    animation: ${slideIn} 0.28s ease-out;
  }
`;

export const FilterSection = styled.div`
  width: 100%;
  margin-bottom: 12px;
  padding: 13px;
  border: 1px solid rgba(0, 0, 128, 0.08);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 12px 30px rgba(16, 24, 40, 0.07);
  box-sizing: border-box;
`;

export const FilterSectionTitle = styled.h3`
  margin: 0 0 10px;
  color: ${colors.textMain};
  font-size: 14px;
  font-weight: 900;
`;

export const SubcategoryFilterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

export const SubcategoryFilterItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;
  padding: 8px 9px;
  border: 1px solid ${props => props.$isSelected ? colors.primary : '#edf1f7'};
  border-radius: 12px;
  cursor: pointer;
  background: ${props => props.$isSelected ? colors.primary : '#ffffff'};
  color: ${props => props.$isSelected ? colors.white : colors.textMain};
  transition: background 180ms ease, border-color 180ms ease, transform 180ms ease;

  &:hover {
    transform: translateY(-1px);
    border-color: ${props => props.$isSelected ? colors.primary : 'rgba(0, 0, 128, 0.22)'};
  }
`;

export const SubcategoryRadio = styled.div`
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 2px solid ${props => props.$isSelected ? colors.yellow : '#cbd5e1'};
  background: ${props => props.$isSelected ? colors.yellow : 'transparent'};
  box-shadow: ${props => props.$isSelected ? 'inset 0 0 0 4px #000080' : 'none'};
`;

export const SubcategoryFilterLabel = styled.span`
  min-width: 0;
  color: ${props => props.$isSelected ? colors.white : colors.textMain};
  font-size: 13px;
  font-weight: 800;
`;

export const SubcategoryCount = styled.span`
  margin-left: auto;
  padding: 3px 9px;
  border-radius: 999px;
  color: ${colors.primary};
  background: ${colors.primaryLight};
  font-size: 12px;
  font-weight: 900;
`;

export const SortSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: ${colors.white};
  color: ${colors.textMain};
  font-size: 13px;
  font-weight: 800;
  outline: none;

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 4px rgba(0, 0, 128, 0.08);
  }
`;

export const ClearFiltersButton = styled.button`
  margin-top: 12px;
  padding: 0;
  border: none;
  background: none;
  color: ${colors.danger};
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
`;

export const PageTitleSection = styled.div`
  width: 100%;
  margin-bottom: 12px;
  padding: 14px;
  border: 1px solid rgba(0, 0, 128, 0.08);
  border-radius: 16px;
  background: ${colors.white};
  box-shadow: 0 12px 30px rgba(16, 24, 40, 0.07);
  box-sizing: border-box;
`;

export const PageTitle = styled.h2`
  margin: 0;
  color: ${colors.textMain};
  font-size: 19px;
  font-weight: 900;
`;

export const ResultsInfo = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 10px;
  margin-top: 8px;
  color: ${colors.textSecondary};
  font-size: 13px;
  font-weight: 700;
`;

export const SelectedInfo = styled.span`
  color: ${colors.primary};
  font-weight: 900;
`;

export const DesktopInfo = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`;

export const NoCategories = styled.div`
  width: 100%;
  margin: 18px 0;
  padding: 46px 20px;
  text-align: center;
  border: 1px solid ${colors.border};
  border-radius: 18px;
  background: ${colors.white};
  box-sizing: border-box;
`;

export const CategoryErrorTitle = styled.h2`
  color: ${colors.textMain};
  font-size: 22px;
  font-weight: 900;
`;

export const CategoryErrorText = styled.p`
  margin-bottom: 20px;
  color: ${colors.textSecondary};
  font-size: 15px;
  font-weight: 600;
`;

export const LoadingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  width: 100%;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1380px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

export const SkeletonCard = styled.div`
  width: 100%;
  height: 326px;
  border: 1px solid ${colors.border};
  border-radius: 18px;
  background: linear-gradient(90deg, #ffffff, #eef2ff, #ffffff);
  animation: ${pulse} 1.5s infinite;
`;

export const SkeletonAvatar = styled.div``;
export const SkeletonLine = styled.div``;
export const SkeletonButton = styled.div``;

export const HoroscopeSection = styled.section`
  width: 100%;
  margin: 18px 0;
  padding: 16px;
  border: 1px solid rgba(0, 0, 128, 0.08);
  border-radius: 18px;
  background: ${colors.white};
  box-shadow: 0 12px 30px rgba(16, 24, 40, 0.07);
  box-sizing: border-box;
`;

export const HoroscopeTitle = styled.h2`
  margin: 0 0 16px;
  color: ${colors.textMain};
  font-size: 20px;
  font-weight: 900;
`;

export const HoroscopeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 10px;
`;

export const HoroscopeCard = styled.div`
  padding: 14px;
  text-align: center;
  border: 1px solid #eef2f7;
  border-radius: 14px;
  background: #f8fafc;
`;

export const HoroscopeSign = styled.div`
  h4 {
    margin: 0;
    color: ${colors.primary};
    font-size: 15px;
    font-weight: 900;
  }

  span {
    color: ${colors.textSecondary};
    font-size: 11px;
    font-weight: 700;
  }
`;

export const ReadButton = styled.button`
  margin-top: 10px;
  padding: 7px 14px;
  border: none;
  border-radius: 999px;
  background: ${colors.primary};
  color: ${colors.white};
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
`;

export const ExpertRating = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  min-height: 18px;
`;

export const RatingStars = styled.div`
  display: flex;
  color: ${colors.star};
  font-size: 13px;
`;

export const RatingValue = styled.span`
  color: ${colors.textSecondary};
  font-size: 12px;
  font-weight: 800;
`;

export const PremiumBadge = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  padding: 11px;
  border: 1px solid rgba(244, 197, 66, 0.4);
  border-radius: 16px;
  background: linear-gradient(135deg, #fff9e7, #ffffff);
  box-shadow: 0 10px 24px rgba(244, 197, 66, 0.13);
  box-sizing: border-box;
`;

export const BadgeIcon = styled.div`
  color: ${colors.star};
  font-size: 18px;
`;

export const BadgeText = styled.div`
  color: #594300;
  font-size: 12px;
  font-weight: 800;
  line-height: 1.45;
`;

export const MobileFilterToggle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: min(calc(100% - 28px), 1440px);
  margin: 14px auto 0;

  @media (min-width: 992px) {
    display: none;
  }
`;

export const FilterToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid rgba(0, 0, 128, 0.14);
  border-radius: 999px;
  background: ${colors.white};
  color: ${colors.primary};
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(16, 24, 40, 0.08);
`;

export const MobileResultsInfo = styled.span`
  color: ${colors.textSecondary};
  font-size: 13px;
  font-weight: 800;
`;

export const MobileFilterOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: ${props => props.$show ? 'block' : 'none'};
  background: rgba(2, 6, 23, 0.52);
`;

export const MobileFilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;

  h3 {
    margin: 0;
    color: ${colors.textMain};
    font-size: 19px;
    font-weight: 900;
  }
`;

export const MobileFilterClose = styled.button`
  border: none;
  background: none;
  color: ${colors.textMain};
  font-size: 26px;
  cursor: pointer;
`;

export const NoResults = styled.div`
  width: 100%;
  padding: 54px 20px;
  text-align: center;
  border: 1px solid ${colors.border};
  border-radius: 18px;
  background: ${colors.white};
`;

export const NoResultsTitle = styled.h2`
  color: ${colors.textMain};
  font-size: 22px;
  font-weight: 900;
`;

export const NoResultsText = styled.p`
  color: ${colors.textSecondary};
  font-size: 15px;
  font-weight: 600;
`;

export const CtaSection = styled.section`
  width: 100%;
  margin-top: 20px;
`;

export const RatingBanner = styled.div`
  margin-bottom: 12px;
  text-align: center;
`;

export const Stars = styled.div`
  display: flex;
  justify-content: center;
  gap: 3px;
  color: ${colors.star};
  font-size: 14px;
`;

export const RatingText = styled.p`
  margin-top: 4px;
  color: ${colors.textSecondary};
  font-size: 13px;
  font-weight: 700;
`;

export const CtaBanner = styled.div`
  width: 100%;
  padding: 22px 18px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 20px;
  color: ${colors.white};
  background:
    radial-gradient(circle at 18% 0%, rgba(255, 255, 255, 0.18), transparent 28%),
    radial-gradient(circle at 88% 18%, rgba(244, 197, 66, 0.26), transparent 24%),
    linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark});
  box-shadow: 0 18px 42px rgba(0, 0, 128, 0.18);
  box-sizing: border-box;

  @media (min-width: 1024px) {
    color: ${colors.white} !important;

    :where(h1, h2, h3, h4, p, span, small, strong, div, svg) {
      color: inherit !important;
    }

    button,
    button * {
      color: ${colors.primary} !important;
    }
  }
`;

export const CtaTitle = styled.h2`
  margin: 0 0 8px;
  color: ${colors.white};
  font-size: 19px;
  font-weight: 900;
`;

export const CtaDescription = styled.p`
  max-width: 650px;
  margin: 0 auto 14px;
  color: rgba(255, 255, 255, 0.84);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.6;
`;

export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0 auto;
  padding: 10px 20px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #ffd95a, ${colors.yellow});
  color: ${colors.primary};
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(244, 197, 66, 0.22);
`;

export const SecondaryButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 999px;
  background: ${colors.primaryLight};
  color: ${colors.primary};
  font-size: 14px;
  font-weight: 900;
`;

export const PricingModesBadge = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  min-height: 22px;
  max-height: 24px;
  overflow: hidden;
`;

export const PricingModeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 10.5px;
  font-weight: 800;

  ${props => props.type === 'per_minute' && `
    background: #dbeafe;
    color: #1e40af;
  `}

  ${props => props.type === 'session' && `
    background: #fef3c7;
    color: #92400e;
  `}

  ${props => props.type === 'plans' && `
    background: #ede9fe;
    color: #5b21b6;
  `}
`;

export const StartSessionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 36px;
  padding: 8px 10px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: ${colors.white};
  font-size: 12.5px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 22px rgba(245, 158, 11, 0.26);
  }
`;

export const ViewPlansButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 36px;
  padding: 8px 10px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #6366f1, #4338ca);
  color: ${colors.white};
  font-size: 12.5px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 22px rgba(67, 56, 202, 0.24);
  }
`;

export const PricingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
  padding: 6px 8px;
  border-radius: 12px;
  background: #f5f3ff;
  color: #5b21b6;
  font-size: 10.5px;
  font-weight: 700;

  span {
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

export const FilterChipsContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
  padding: 2px 2px 14px;
  overflow-x: auto;
  scroll-behavior: smooth;
  box-sizing: border-box;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const FilterChip = styled.button`
  flex-shrink: 0;
  white-space: nowrap;
  padding: 8px 13px;
  border: 1px solid ${props => props.$isActive ? colors.primary : '#d9e1ec'};
  border-radius: 999px;
  background: ${props => props.$isActive ? colors.primary : colors.white};
  color: ${props => props.$isActive ? colors.white : colors.primary};
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: ${props => props.$isActive ? '0 10px 22px rgba(0, 0, 128, 0.18)' : '0 8px 18px rgba(16, 24, 40, 0.05)'};
`;

export const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  width: min(calc(100% - 28px), 1440px);
  margin: 0 auto;
  padding: 12px 2px 0;
  color: ${colors.textSecondary};
  font-size: 13px;
  font-weight: 700;
`;

export const BreadcrumbItem = styled.span`
  color: ${props => props.$active ? colors.textMain : colors.primary};
  font-weight: ${props => props.$active ? '900' : '800'};
  cursor: pointer;
`;

export const BreadcrumbSeparator = styled.span`
  display: flex;
  align-items: center;
  font-size: 12px;
`;

export const ExpertVerified = styled.span`
  flex-shrink: 0;
  color: ${colors.verified};
  font-size: 15px;
`;

export const VerificationBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${colors.verified};
  font-size: 12px;
  font-weight: 900;
`;

export const ExpertSpeciality = styled.p`
  margin: 1px 0 0;
  color: ${colors.textSecondary};
  font-size: 12px;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ExpertLocation = styled.p`
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 3px 0 0;
  color: ${colors.textSecondary};
  font-size: 11.5px;
  font-weight: 700;
`;

export const StatIcon = styled.div`
  display: flex;
  color: ${colors.star};
  font-size: 12px;
`;

export const StatLabel = styled.span`
  color: ${colors.textSecondary};
  font-size: 11.5px;
  font-weight: 700;
`;

export const PriceIcon = styled.div`
  display: flex;
  color: ${colors.primary};
  font-size: 12px;
`;

export const PriceAmount = styled.span`
  color: ${colors.textMain};
  font-size: 13px;
  font-weight: 900;
`;

export const PriceUnit = styled.span`
  color: ${colors.textSecondary};
  font-size: 10.5px;
  font-weight: 700;
`;

export const CategoryDetailHero = styled.section`
  width: min(calc(100% - 28px), 1440px);
  margin: 14px auto 0;
  padding: clamp(22px, 4vw, 34px);
  border-radius: 24px;
  color: ${colors.white};
  background:
    radial-gradient(circle at 88% 8%, rgba(244, 197, 66, 0.26), transparent 26%),
    linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark});
  box-shadow: 0 18px 42px rgba(0, 0, 128, 0.18);
  box-sizing: border-box;

  @media (min-width: 1024px) {
    width: 100%;
    margin-top: 0;
    border-radius: 22px;
    box-shadow: 0 20px 48px rgba(0, 0, 128, 0.18);
    color: ${colors.white} !important;

    :where(h1, p, small, strong, svg) {
      color: inherit !important;
    }
  }

  @media (max-width: 767px) {
    width: calc(100% - 20px);
    margin-top: 10px;
    padding: 18px;
    border-radius: 20px;
  }
`;

export const CategoryHeroCopy = styled.div`
  max-width: 820px;
`;

export const CategoryKicker = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 11px;
  border-radius: 999px;
  color: #ffd95a;
  background: rgba(255, 255, 255, 0.12);
  font-size: 12px;
  font-weight: 900;
`;

export const CategoryTitle = styled.h1`
  margin: 12px 0 0;
  color: ${colors.white};
  font-size: clamp(26px, 4vw, 46px);
  line-height: 1.05;
  font-weight: 950;
`;

export const CategoryDescription = styled.p`
  max-width: 760px;
  margin: 10px 0 0;
  color: rgba(255, 255, 255, 0.82);
  font-size: 15px;
  line-height: 1.65;

  @media (max-width: 767px) {
    font-size: 13px;
    line-height: 1.5;
  }
`;

export const CategoryMetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
`;

export const CategoryMetaPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 32px;
  padding: 0 11px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  font-weight: 850;
`;

export const SectionCard = styled.section`
  width: min(calc(100% - 28px), 1440px);
  margin: 16px auto 0;
  padding: 16px;
  border: 1px solid rgba(0, 0, 128, 0.08);
  border-radius: 20px;
  background: ${colors.white};
  box-shadow: 0 12px 30px rgba(16, 24, 40, 0.07);
  box-sizing: border-box;

  @media (min-width: 1024px) {
    width: 100%;
    border-radius: 18px;
    box-shadow: 0 16px 42px rgba(15, 23, 42, 0.075);
  }

  @media (max-width: 767px) {
    width: calc(100% - 20px);
    padding: 12px;
    border-radius: 18px;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${colors.textMain};
  font-size: 20px;
  font-weight: 950;

  @media (max-width: 767px) {
    font-size: 16px;
  }
`;

export const SectionSubtitle = styled.p`
  margin: 4px 0 0;
  color: ${colors.textSecondary};
  font-size: 13px;
  font-weight: 650;
`;

export const SubcategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;

  @media (max-width: 767px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }
`;

export const SubcategoryCard = styled.button`
  min-width: 0;
  min-height: 138px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 10px;
  border: 1px solid ${props => props.$active ? colors.primary : '#e8edf5'};
  border-radius: 18px;
  background: ${props => props.$active ? colors.primaryLight : '#ffffff'};
  color: ${colors.textMain};
  cursor: pointer;
  box-shadow: ${props => props.$active
    ? '0 14px 28px rgba(0, 0, 128, 0.14)'
    : '0 8px 18px rgba(16, 24, 40, 0.05)'};
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 0, 128, 0.28);
  }

  @media (max-width: 767px) {
    min-height: 108px;
    gap: 7px;
    padding: 9px 6px;
    border-radius: 15px;
  }
`;

export const SubcategoryImage = styled.img`
  width: 62px;
  height: 62px;
  object-fit: contain;
  padding: 8px;
  border-radius: 16px;
  background: linear-gradient(135deg, ${colors.primaryLight}, #ffffff);
  box-sizing: border-box;

  @media (max-width: 767px) {
    width: 48px;
    height: 48px;
    padding: 6px;
    border-radius: 14px;
  }
`;

export const SubcategoryName = styled.span`
  width: 100%;
  color: ${colors.textMain};
  text-align: center;
  font-size: 13px;
  font-weight: 900;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 767px) {
    font-size: 11px;
    line-height: 1.2;
  }
`;

export const ExpertArea = styled.section`
  width: min(calc(100% - 28px), 1440px);
  margin: 16px auto 0;

  @media (min-width: 1024px) {
    width: 100%;
  }

  @media (max-width: 767px) {
    width: calc(100% - 20px);
    padding-bottom: 72px;
  }
`;

export const ExpertLayout = styled.div`
  display: grid;
  grid-template-columns: 270px minmax(0, 1fr);
  gap: 16px;

  @media (max-width: 991px) {
    display: block;
  }
`;

export const FilterControl = styled.label`
  display: block;
  margin-top: 10px;
`;

export const FilterLabel = styled.span`
  display: block;
  margin-bottom: 6px;
  color: ${colors.textSecondary};
  font-size: 12px;
  font-weight: 850;
`;

export const FilterInput = styled.input`
  width: 100%;
  min-height: 40px;
  padding: 0 11px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: ${colors.white};
  color: ${colors.textMain};
  font-size: 13px;
  font-weight: 750;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 4px rgba(0, 0, 128, 0.08);
  }
`;

export const FilterSelect = styled.select`
  width: 100%;
  min-height: 40px;
  padding: 0 11px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: ${colors.white};
  color: ${colors.textMain};
  font-size: 13px;
  font-weight: 750;
  outline: none;
  box-sizing: border-box;

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 4px rgba(0, 0, 128, 0.08);
  }
`;

export const FilterActions = styled.div`
  margin-top: 12px;
`;

export const ActiveChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 12px;
`;

export const ActiveChip = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: ${colors.primaryLight};
  color: ${colors.primary};
  font-size: 12px;
  font-weight: 900;
`;

export const ExpertsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  padding: 14px;
  border: 1px solid rgba(0, 0, 128, 0.08);
  border-radius: 18px;
  background: ${colors.white};
  box-shadow: 0 12px 30px rgba(16, 24, 40, 0.07);
  box-sizing: border-box;

  @media (max-width: 767px) {
    align-items: flex-start;
    padding: 12px;
  }
`;

export const ExpertsTitle = styled.h2`
  margin: 0;
  color: ${colors.textMain};
  font-size: 19px;
  font-weight: 950;

  @media (max-width: 767px) {
    font-size: 16px;
  }
`;

export const ExpertsCount = styled.p`
  margin: 4px 0 0;
  color: ${colors.textSecondary};
  font-size: 13px;
  font-weight: 750;
`;

export const EmptyStateBox = styled.div`
  width: 100%;
  padding: 42px 18px;
  text-align: center;
  border: 1px solid ${colors.border};
  border-radius: 18px;
  background: ${colors.white};
  box-sizing: border-box;
`;

export const EmptyStateTitle = styled.h2`
  margin: 0;
  color: ${colors.textMain};
  font-size: 20px;
  font-weight: 950;
`;

export const EmptyStateText = styled.p`
  max-width: 520px;
  margin: 8px auto 0;
  color: ${colors.textSecondary};
  font-size: 14px;
  font-weight: 650;
  line-height: 1.55;
`;

export const PaginationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 18px;
  padding-bottom: 8px;
`;

export const PaginationButton = styled.button`
  min-height: 38px;
  padding: 0 15px;
  border: 1px solid rgba(0, 0, 128, 0.16);
  border-radius: 999px;
  background: ${props => props.disabled ? '#f1f5f9' : colors.white};
  color: ${props => props.disabled ? '#94a3b8' : colors.primary};
  font-size: 13px;
  font-weight: 900;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
`;

export const PaginationInfo = styled.span`
  color: ${colors.textSecondary};
  font-size: 13px;
  font-weight: 850;
`;
