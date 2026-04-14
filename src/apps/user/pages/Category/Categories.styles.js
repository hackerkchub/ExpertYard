import styled, { keyframes, css } from 'styled-components';

// Professional Colors (LinkedIn Palette)
const colors = {
  primary: '#000080',
  primaryLight: '#e7f3ff',
  primaryDark: '#004182',
  bgLight: '#f3f2ef', // LinkedIn gray background
  white: '#ffffff',
  textMain: '#1d2226',
  textSecondary: '#666666',
  border: '#dce6e9',
  trending: '#ff5c35',
  star: '#f59e0b'
};

const media = {
  sm: '@media (max-width: 640px)',
  md: '@media (max-width: 768px)',
  lg: '@media (max-width: 1024px)'
};

export const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${colors.bgLight};
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

// --- Hero & Search ---
export const HeroSection = styled.div`
  background:#000080;
  color: white;
  padding: 60px 20px;
  text-align: center;
  ${media.sm} { padding: 40px 15px; }
`;

export const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

export const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 12px;
  ${media.sm} { font-size: 1.8rem; }
`;

export const HeroSubtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 30px;
`;

export const SearchContainer = styled.div`
  max-width: 550px;
  margin: 0 auto;
  display: flex;
  background: white;
  padding: 6px;
  border-radius: 32px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 0 20px;
  font-size: 16px;
  color: ${colors.textMain};
  border-radius: 32px;
`;

export const SearchButton = styled.button`
  background: ${colors.primary};
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 24px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.2s;
  &:hover { background: ${colors.primaryDark}; }
  ${media.sm} { span { display: none; } padding: 12px; }
`;

// --- Stats Bar ---
export const StatsBar = styled.div`
  max-width: 1128px;
  margin: -30px auto 40px;
  background: white;
  display: flex;
  justify-content: space-around;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid ${colors.border};
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  ${media.sm} { 
    margin: -20px 10px 30px;
    display: grid; 
    grid-template-columns: 1fr 1fr; 
    gap: 20px; 
  }
`;

export const StatItem = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
`;

export const StatValue = styled.span`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${colors.primary};
`;

export const StatLabel = styled.span`
  font-size: 12px;
  color: ${colors.textSecondary};
  text-transform: uppercase;
  font-weight: 600;
`;

// --- Main Content & Headers ---
export const MainContent = styled.main`
  max-width: 1128px;
  margin: 0 auto;
  padding: 0 20px 50px;
`;

export const CategoriesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  ${media.sm} { flex-direction: column; align-items: flex-start; gap: 15px; }
`;

export const HeaderTitle = styled.h2`
  font-size: 20px;
  color: ${colors.textMain};
  .count {
    font-size: 14px;
    background: ${colors.primaryLight};
    color: ${colors.primary};
    padding: 2px 10px;
    border-radius: 12px;
    margin-left: 8px;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

export const ViewToggle = styled.div`
  display: flex;
  border: 1px solid ${colors.border};
  border-radius: 4px;
  overflow: hidden;
`;

export const ToggleButton = styled.button`
  padding: 8px 12px;
  background: ${props => props.$active ? colors.primaryLight : 'white'};
  color: ${props => props.$active ? colors.primary : colors.textSecondary};
  border: none;
  cursor: pointer;
  display: flex;
  &:first-child { border-right: 1px solid ${colors.border}; }
`;

export const SortSelect = styled.select`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid ${colors.border};
  color: ${colors.textMain};
  outline: none;
`;

// --- Grid & Cards ---
export const CategoriesGrid = styled.div`
  display: grid;
  gap: 16px;
  /* Desktop 4 columns, Tablet 2-3, Mobile 1-2 */
  grid-template-columns: ${props => props.$view === 'grid' ? 'repeat(auto-fill, minmax(250px, 1fr))' : '1fr'};
  
  ${media.sm} {
    /* Agli baar category mobile me 2 column chahiye to yahan grid-template-columns: repeat(2, 1fr) karsakte hain */
    grid-template-columns: ${props => props.$view === 'grid' ? 'repeat(auto-fill, minmax(140px, 1fr))' : '1fr'};
    gap: 12px;
  }
`;

export const CategoryCard = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid ${colors.border};
  transition: 0.3s;
  cursor: pointer;
  overflow: hidden; /* Image corners round karne ke liye */
  display: flex;
  flex-direction: ${props => props.$view === 'list' ? 'row' : 'column'};
  &:hover { box-shadow: 0 8px 20px rgba(0,0,0,0.1); transform: translateY(-2px); }
`;

export const ImageWrapper = styled.div`
  width: ${props => props.$view === 'list' ? '150px' : '100%'};
  height: ${props => props.$view === 'list' ? '150px' : '200px'}; /* Height 200px set kardi */
  background-color: #f8fafc; /* Image load na hone par neutral bg */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  ${media.sm} { 
    width: ${props => props.$view === 'list' ? '100px' : '100%'}; 
    height: ${props => props.$view === 'list' ? '100px' : '160px'}; /* Mobile me thodi kam height */
  }
`;

export const CategoryImage = styled.img`
  width: 100%;
  height: 100%;
  /* Yahan focus karein: contain se puri image dikhegi bina kate, cover se full box fill hoga */
  object-fit: ${props => props.contain ? 'contain' : 'cover'}; 
  transition: 0.5s;
  &:hover { transform: scale(1.05); }
`;

export const CategoryInfo = styled.div`
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const CategoryName = styled.h3`
  font-size: 17px;
  font-weight: 600;
  color: ${colors.textMain};
  margin-bottom: 6px;
  &:hover { color: ${colors.primary}; text-decoration: underline; }
  ${media.sm} { font-size: 15px; }
`;

export const CategoryDescription = styled.p`
  font-size: 14px;
  color: ${colors.textSecondary};
  line-height: 1.4;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  ${media.sm} { font-size: 12px; }
`;

export const CategoryMeta = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  margin-top: auto; /* Buttons niche align karne ke liye */
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${colors.textSecondary};
  svg { color: ${colors.primary}; }
`;

export const ViewButton = styled.div`
  text-align: center;
  padding: 8px;
  border: 1px solid ${colors.primary};
  color: ${colors.primary};
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  &:hover { background: ${colors.primaryLight}; }
`;

// --- Extras ---
export const TrendingTag = styled.div`
  font-size: 11px;
  color: ${colors.trending};
  background: #fff0ed;
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
  margin-bottom: 8px;
`;

export const PremiumBadge = styled.span`
  background: #f8e7cd;
  color: #855f1d;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  margin-left: 8px;
`;

export const Breadcrumb = styled.div`
  max-width: 1128px;
  margin: 0 auto;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
`;

export const BreadcrumbItem = styled.span`
  color: ${props => props.active ? colors.textMain : colors.textSecondary};
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : '400'};
  &:hover { text-decoration: underline; }
`;

export const BreadcrumbSeparator = styled.span`
  color: ${colors.textSecondary};
`;

export const PopularSection = styled.div`
  margin-bottom: 35px;
  .title { font-size: 18px; font-weight: 600; margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }
`;

export const PopularGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  ${media.sm} { grid-template-columns: 1fr; }
`;

export const PopularCategory = styled.div`
  background: white;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  img { width: 100%; height: 80px; object-fit: cover; border-radius: 4px; }
  h4 { margin: 8px 0; font-size: 14px; }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 50px;
  background: white;
  border-radius: 8px;
  border: 1px solid ${colors.border};
`;