import styled from "styled-components";

const colors = {
  primary: "#000080",
  primaryDeep: "#02044a",
  primarySoft: "#eef2ff",
  yellow: "#f4c542",
  yellowLight: "#ffe27a",
  bgLight: "#f5f7fb",
  white: "#ffffff",
  textMain: "#13203a",
  textSecondary: "#667085",
  border: "#e5e7eb",
  shadow: "0 18px 42px rgba(10, 20, 60, 0.08)",
  trending: "#d9541f",
};

const media = {
  sm: "@media (max-width: 640px)",
  md: "@media (max-width: 900px)",
  lg: "@media (max-width: 1180px)",
};

export const PageContainer = styled.div`
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(244, 197, 66, 0.11), transparent 24%),
    linear-gradient(180deg, #f8f9fe 0%, ${colors.bgLight} 100%);
  color: ${colors.textMain};
  font-family: Inter, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  overflow-x: hidden;
`;

export const Breadcrumb = styled.div`
  width: min(100%, 1180px);
  margin: 0 auto;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.86rem;
`;

export const BreadcrumbItem = styled.span`
  color: ${(props) => (props.active ? colors.textMain : colors.textSecondary)};
  cursor: pointer;
  font-weight: ${(props) => (props.active ? "700" : "500")};

  &:hover {
    color: ${colors.primary};
  }
`;

export const BreadcrumbSeparator = styled.span`
  color: ${colors.textSecondary};
  display: inline-flex;
`;

export const HeroSection = styled.section`
  position: relative;
  overflow: hidden;
  width: min(calc(100% - 32px), 1180px);
  margin: 0 auto;
  border-radius: 28px;
  padding: 44px 24px 50px;
  color: #ffffff;
  text-align: center;
  background:
    radial-gradient(circle at 86% 28%, rgba(244, 197, 66, 0.23), transparent 24%),
    radial-gradient(circle at 10% 0%, rgba(96, 165, 250, 0.24), transparent 28%),
    linear-gradient(145deg, ${colors.primary} 0%, #02005c 72%, ${colors.primaryDeep} 100%);
  box-shadow: 0 24px 58px rgba(0, 0, 128, 0.2);

  &::after {
    content: "";
    position: absolute;
    right: -76px;
    top: 18px;
    width: 260px;
    height: 260px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.13);
    background:
      radial-gradient(circle, rgba(255, 226, 122, 0.14), transparent 58%),
      linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0));
    pointer-events: none;
  }

  ${media.sm} {
    width: min(calc(100% - 20px), 1180px);
    border-radius: 22px;
    padding: 28px 14px 34px;
  }
`;

export const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 760px;
  margin: 0 auto;
`;

export const HeroTitle = styled.h1`
  margin: 0;
  color: #ffffff;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 850;
  line-height: 1.08;
  letter-spacing: -0.035em;

  ${media.sm} {
    font-size: clamp(1.75rem, 8vw, 2.2rem);
  }
`;

export const HeroSubtitle = styled.p`
  max-width: 620px;
  margin: 12px auto 22px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 1rem;
  line-height: 1.6;

  ${media.sm} {
    margin-bottom: 18px;
    font-size: 0.92rem;
  }
`;

export const SearchContainer = styled.div`
  max-width: 610px;
  min-height: 58px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.75);
  box-shadow: 0 18px 38px rgba(0, 0, 0, 0.2);

  ${media.sm} {
    width: 100%;
    min-height: 54px;
    border-radius: 17px;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  padding: 0 14px;
  font-size: 0.95rem;
  color: ${colors.textMain};
  background: transparent;

  &::placeholder {
    color: #8c95aa;
  }
`;

export const SearchButton = styled.button`
  border: 0;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 15px;
  background: linear-gradient(135deg, ${colors.yellowLight} 0%, ${colors.yellow} 100%);
  color: ${colors.primaryDeep};
  font-weight: 850;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 12px 24px rgba(244, 197, 66, 0.28);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 16px 30px rgba(244, 197, 66, 0.34);
  }

  ${media.sm} {
    min-width: 46px;
    padding: 0 13px;

    span {
      display: none;
    }
  }
`;

export const StatsBar = styled.div`
  position: relative;
  z-index: 2;
  width: min(calc(100% - 56px), 1060px);
  margin: -28px auto 28px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  ${media.md} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.sm} {
    width: min(calc(100% - 20px), 1060px);
    margin: -20px auto 22px;
    gap: 9px;
  }
`;

export const StatItem = styled.div`
  min-width: 0;
  min-height: 78px;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 12px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(0, 0, 128, 0.08);
  box-shadow: ${colors.shadow};
`;

export const StatIcon = styled.span`
  width: 42px;
  height: 42px;
  border-radius: 15px;
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${colors.yellowLight};
  background:
    radial-gradient(circle at 28% 18%, rgba(244, 197, 66, 0.52), transparent 34%),
    linear-gradient(145deg, ${colors.primary} 0%, #1721a2 100%);
  box-shadow: 0 10px 22px rgba(0, 0, 128, 0.2);
`;

export const StatValue = styled.span`
  display: block;
  color: ${colors.primary};
  font-size: 1.12rem;
  font-weight: 850;
  line-height: 1;
`;

export const StatLabel = styled.span`
  display: block;
  margin-top: 5px;
  color: ${colors.textSecondary};
  font-size: 0.74rem;
  font-weight: 750;
  line-height: 1.2;
  text-transform: uppercase;
`;

export const MainContent = styled.main`
  width: min(100%, 1180px);
  margin: 0 auto;
  padding: 0 20px 46px;

  ${media.sm} {
    padding: 0 10px 34px;
  }
`;

export const CategoriesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 14px;
  margin-bottom: 16px;

  ${media.sm} {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }
`;

export const HeaderTitle = styled.h2`
  margin: 0;
  color: ${colors.textMain};
  font-size: 1.18rem;
  line-height: 1.25;

  .count {
    display: inline-flex;
    align-items: center;
    min-height: 24px;
    margin-left: 8px;
    padding: 0 10px;
    border-radius: 999px;
    background: rgba(0, 0, 128, 0.08);
    color: ${colors.primary};
    font-size: 0.78rem;
    font-weight: 850;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  ${media.sm} {
    width: 100%;
    justify-content: space-between;
  }
`;

export const ViewToggle = styled.div`
  display: inline-flex;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
  box-shadow: 0 8px 18px rgba(10, 20, 60, 0.05);
`;

export const ToggleButton = styled.button`
  border: 0;
  min-width: 40px;
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${(props) => (props.$active ? colors.white : colors.textSecondary)};
  background: ${(props) =>
    props.$active ? `linear-gradient(135deg, ${colors.primary} 0%, #1b249d 100%)` : colors.white};
  transition: background 0.2s ease, color 0.2s ease;

  &:first-child {
    border-right: 1px solid ${colors.border};
  }
`;

export const SortSelect = styled.select`
  min-height: 38px;
  padding: 0 12px;
  border-radius: 14px;
  border: 1px solid ${colors.border};
  background: ${colors.white};
  color: ${colors.textMain};
  font-size: 0.83rem;
  font-weight: 650;
  outline: 0;
  box-shadow: 0 8px 18px rgba(10, 20, 60, 0.05);
`;

export const CategoriesGrid = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: ${(props) =>
    props.$view === "grid" ? "repeat(5, minmax(0, 1fr))" : "1fr"};

  ${media.lg} {
    grid-template-columns: ${(props) =>
      props.$view === "grid" ? "repeat(3, minmax(0, 1fr))" : "1fr"};
  }

  ${media.sm} {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

export const CategoryCard = styled.div`
  min-width: 0;
  min-height: ${(props) => (props.$view === "list" ? "132px" : "248px")};
  border: 1px solid ${colors.border};
  border-radius: 20px;
  background:
    radial-gradient(circle at top right, rgba(244, 197, 66, 0.1), transparent 40%),
    ${colors.white};
  box-shadow: 0 12px 28px rgba(10, 20, 60, 0.06);
  color: inherit;
  text-decoration: none;
  overflow: hidden;
  display: flex;
  flex-direction: ${(props) => (props.$view === "list" ? "row" : "column")};
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(0, 0, 128, 0.18);
    box-shadow: 0 20px 42px rgba(10, 20, 60, 0.11);
  }

  ${media.sm} {
    min-height: 90px;
    border-radius: 18px;
    flex-direction: row;
    align-items: center;
    padding: 10px;
  }
`;

export const CategoryImage = styled.img`
  width: ${(props) => (props.$view === "list" ? "118px" : "100%")};
  height: ${(props) => (props.$view === "list" ? "118px" : "112px")};
  padding: ${(props) => (props.$view === "list" ? "12px" : "14px")};
  box-sizing: border-box;
  object-fit: contain;
  background:
    radial-gradient(circle at top left, rgba(244, 197, 66, 0.18), transparent 36%),
    linear-gradient(135deg, ${colors.primarySoft} 0%, #ffffff 100%);
  flex: 0 0 auto;
  transition: transform 0.35s ease;

  ${CategoryCard}:hover & {
    transform: scale(1.04);
  }

  ${media.sm} {
    width: 68px;
    height: 68px;
    padding: 8px;
    border-radius: 16px;
  }
`;

export const CategoryInfo = styled.div`
  min-width: 0;
  flex: 1;
  padding: ${(props) => (props.$view === "list" ? "14px 16px" : "13px")};
  display: flex;
  flex-direction: column;

  ${media.sm} {
    padding: 0 8px 0 12px;
  }
`;

export const TrendingTag = styled.div`
  width: fit-content;
  margin-bottom: 7px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  color: ${colors.trending};
  background: #fff2e9;
  font-size: 0.7rem;
  font-weight: 850;

  ${media.sm} {
    display: none;
  }
`;

export const CategoryName = styled.h3`
  margin: 0;
  color: ${colors.textMain};
  font-size: 0.98rem;
  font-weight: 850;
  line-height: 1.25;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;

  ${media.sm} {
    font-size: 0.92rem;
    -webkit-line-clamp: 1;
  }
`;

export const PremiumBadge = styled.span`
  display: inline-flex;
  align-items: center;
  min-height: 18px;
  margin-left: 6px;
  padding: 0 6px;
  border-radius: 999px;
  background: rgba(244, 197, 66, 0.18);
  color: #7a5b00;
  font-size: 0.64rem;
  font-weight: 850;
  vertical-align: middle;
`;

export const CategoryDescription = styled.p`
  margin: 8px 0 12px;
  color: ${colors.textSecondary};
  font-size: 0.82rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  ${media.sm} {
    margin: 4px 0 0;
    font-size: 0.76rem;
    line-height: 1.35;
    -webkit-line-clamp: 2;
  }
`;

export const ViewButton = styled.div`
  margin-top: auto;
  min-height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 1px solid rgba(0, 0, 128, 0.14);
  color: ${colors.primary};
  background: rgba(0, 0, 128, 0.04);
  font-size: 0.8rem;
  font-weight: 850;
  transition: background 0.2s ease, color 0.2s ease;

  ${CategoryCard}:hover & {
    background: ${colors.primary};
    color: #ffffff;
  }

  ${media.sm} {
    width: 32px;
    min-width: 32px;
    height: 32px;
    min-height: 32px;
    padding: 0;
    margin-left: auto;
    align-self: center;
    font-size: 0;

    svg {
      font-size: 1rem;
    }
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 46px 20px;
  background: ${colors.white};
  border-radius: 20px;
  border: 1px solid ${colors.border};
  box-shadow: ${colors.shadow};

  h3 {
    margin: 0 0 8px;
    color: ${colors.textMain};
  }

  p {
    margin: 0;
    color: ${colors.textSecondary};
  }
`;

export const SeoContent = styled.section`
  margin-top: 22px;
  border: 1px solid rgba(0, 0, 128, 0.08);
  border-radius: 22px;
  padding: 20px;
  background:
    radial-gradient(circle at top right, rgba(244, 197, 66, 0.12), transparent 30%),
    ${colors.white};
  box-shadow: 0 12px 28px rgba(10, 20, 60, 0.06);

  h2 {
    margin: 0;
    color: ${colors.textMain};
    font-size: clamp(1.15rem, 2.6vw, 1.5rem);
    line-height: 1.25;
  }

  p {
    margin: 10px 0 0;
    color: ${colors.textSecondary};
    font-size: 0.95rem;
    line-height: 1.7;
  }

  ${media.sm} {
    border-radius: 18px;
    padding: 16px;

    p {
      font-size: 0.9rem;
    }
  }
`;

export const CtaBlock = styled.section`
  margin-top: 28px;
  border-radius: 24px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  color: #ffffff;
  background:
    radial-gradient(circle at 10% 0%, rgba(244, 197, 66, 0.2), transparent 26%),
    linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDeep} 100%);
  box-shadow: 0 20px 46px rgba(0, 0, 128, 0.18);

  h2 {
    margin: 0;
    color: #ffffff;
    font-size: clamp(1.25rem, 3.6vw, 1.7rem);
    line-height: 1.18;
  }

  p {
    margin: 7px 0 0;
    color: rgba(255, 255, 255, 0.78);
    line-height: 1.5;
  }

  ${media.sm} {
    flex-direction: column;
    align-items: stretch;
    padding: 18px;
  }
`;

export const CtaButton = styled.button`
  border: 0;
  min-height: 48px;
  padding: 0 18px;
  border-radius: 16px;
  flex: 0 0 auto;
  background: linear-gradient(135deg, ${colors.yellowLight} 0%, ${colors.yellow} 100%);
  color: ${colors.primaryDeep};
  font-weight: 900;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(244, 197, 66, 0.28);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 16px 30px rgba(244, 197, 66, 0.34);
  }
`;

export const CategoryMeta = styled.div``;
export const MetaItem = styled.div``;
export const PopularSection = styled.div``;
export const PopularGrid = styled.div``;
export const PopularCategory = styled.div``;
