import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useCategory } from "../../../../shared/context/CategoryContext";
import { useSeo } from "../../../../shared/seo/useSeo";
import { toAbsoluteUrl } from "../../../../shared/seo/siteConfig";
import { buildCategoryCanonicalPath } from "../../../../shared/seo/categorySeoData";
import {
  buildCategorySeoDescription,
} from "../../../../shared/utils/categoryRoutes";

// Icons
import {
  FiChevronRight,
  FiGrid,
  FiHeadphones,
  FiList,
  FiSearch,
  FiShield,
  FiUsers,
} from "react-icons/fi";
import { IoTrendingUp } from "react-icons/io5";

// Styled Components
import {
  PageContainer,
  HeroSection,
  HeroContent,
  HeroTitle,
  HeroSubtitle,
  SearchContainer,
  SearchInput,
  SearchButton,
  MainContent,
  StatsBar,
  StatItem,
  StatIcon,
  StatValue,
  StatLabel,
  CategoriesHeader,
  HeaderTitle,
  HeaderActions,
  ViewToggle,
  ToggleButton,
  SortSelect,
  CategoriesGrid,
  CategoryCard,
  CategoryImage,
  CategoryInfo,
  CategoryName,
  CategoryDescription,
  ViewButton,
  PremiumBadge,
  TrendingTag,
  EmptyState,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
  CtaBlock,
  CtaButton,
  SeoContent
} from "./Categories.styles";

const DEFAULT_CATEGORY_IMAGE = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h-300&fit=crop";
const CATEGORIES_SEO_TITLE =
  "Expert Categories Online | Legal, Health, Astrology & Finance Experts - G9Experts";
const CATEGORIES_SEO_DESCRIPTION =
  "Explore verified expert categories on G9Experts. Connect online with legal, health, astrology, fitness, finance, property, career, business and education experts by chat or call.";

const Categories = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { categories, loading } = useCategory();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("popular");

  // Filter & Sort Logic
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "newest") return new Date(b.created_at) - new Date(a.created_at);
    return (b.popularity || 0) - (a.popularity || 0);
  });

  const categoriesStructuredData = useMemo(
    () => [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Expert Categories Online",
        url: toAbsoluteUrl("/categories"),
        description: CATEGORIES_SEO_DESCRIPTION,
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: toAbsoluteUrl("/user"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Categories",
            item: toAbsoluteUrl("/categories"),
          },
        ],
      },
    ],
    []
  );

  useSeo({
    title: CATEGORIES_SEO_TITLE,
    description: CATEGORIES_SEO_DESCRIPTION,
    canonicalPath: "/categories",
    robots: "index, follow",
    og: {
      title: CATEGORIES_SEO_TITLE,
      description: CATEGORIES_SEO_DESCRIPTION,
      url: "/categories",
    },
    twitter: {
      title: CATEGORIES_SEO_TITLE,
      description: CATEGORIES_SEO_DESCRIPTION,
      url: "/categories",
    },
    structuredData: categoriesStructuredData,
  });

  if (loading) return null; // Or show your SkeletonGrid here

  return (
    <PageContainer>
      {/* 1. Breadcrumb - Desktop only or subtle on mobile */}
      <Breadcrumb>
        <BreadcrumbItem onClick={() => navigate('/')}>{t("common.home")}</BreadcrumbItem>
        <BreadcrumbSeparator><FiChevronRight /></BreadcrumbSeparator>
        <BreadcrumbItem active>{t("common.categories")}</BreadcrumbItem>
      </Breadcrumb>

      {/* 2. Hero Section - Professional Dark Theme */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>Browse Expert Categories Online</HeroTitle>
          <HeroSubtitle>{t("categoriesPage.heroSubtitle")}</HeroSubtitle>
          
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder={t("categoriesPage.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchButton>
              <FiSearch /> <span>{t("common.search")}</span>
            </SearchButton>
          </SearchContainer>
        </HeroContent>
      </HeroSection>

      {/* 3. Stats Bar - Floating effect */}
      <StatsBar>
        <StatItem>
          <StatIcon><FiGrid /></StatIcon>
          <div>
            <StatValue>13+</StatValue>
            <StatLabel>{t("common.categories")}</StatLabel>
          </div>
        </StatItem>
        <StatItem>
          <StatIcon><FiUsers /></StatIcon>
          <div>
            <StatValue>20K+</StatValue>
            <StatLabel>{t("categoriesPage.experts")}</StatLabel>
          </div>
        </StatItem>
        <StatItem>
          <StatIcon><FiHeadphones /></StatIcon>
          <div>
            <StatValue>24/7</StatValue>
            <StatLabel>{t("categoriesPage.support")}</StatLabel>
          </div>
        </StatItem>
        <StatItem>
          <StatIcon><FiShield /></StatIcon>
          <div>
            <StatValue>100%</StatValue>
            <StatLabel>{t("common.secure")}</StatLabel>
          </div>
        </StatItem>
      </StatsBar>

      <MainContent>
       
        {/* 5. Header Actions - Grid/List Toggle */}
        <CategoriesHeader>
          <HeaderTitle>
            {t("categoriesPage.allCategories")} <span className="count">{sortedCategories.length}</span>
          </HeaderTitle>
          <HeaderActions>
            <ViewToggle>
              <ToggleButton $active={viewMode === "grid"} onClick={() => setViewMode("grid")}>
                <FiGrid size={18} />
              </ToggleButton>
              <ToggleButton $active={viewMode === "list"} onClick={() => setViewMode("list")}>
                <FiList size={18} />
              </ToggleButton>
            </ViewToggle>
            <SortSelect value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="popular">{t("categoriesPage.mostPopular")}</option>
              <option value="name">{t("categoriesPage.aToZ")}</option>
              <option value="newest">{t("categoriesPage.newest")}</option>
            </SortSelect>
          </HeaderActions>
        </CategoriesHeader>

        {/* 6. Main Grid */}
        {sortedCategories.length > 0 ? (
          <CategoriesGrid $view={viewMode}>
            {sortedCategories.map((cat) => (
              <CategoryCard
                as={Link}
                key={cat.id} 
                $view={viewMode}
                to={buildCategoryCanonicalPath(cat)}
                aria-label={`Browse ${cat.name} experts`}
              >
                <CategoryImage 
                  src={cat.image_url || DEFAULT_CATEGORY_IMAGE} 
                  alt={cat.name}
                  $view={viewMode}
                />
                
                <CategoryInfo $view={viewMode}>
                  {cat.is_trending && (
                    <TrendingTag><IoTrendingUp size={12} /> {t("categoriesPage.trending")}</TrendingTag>
                  )}
                  
                  <CategoryName>
                    {cat.name}
                    {cat.is_premium && <PremiumBadge>PRO</PremiumBadge>}
                  </CategoryName>
                  
                  <CategoryDescription>
                    {cat.meta_desc?.trim() || buildCategorySeoDescription(cat)}
                  </CategoryDescription>
                  
                 

                  <ViewButton>
                    {t("common.viewDetails")} <FiChevronRight />
                  </ViewButton>
                </CategoryInfo>
              </CategoryCard>
            ))}
          </CategoriesGrid>
        ) : (
          <EmptyState>
            <h3>{t("categoriesPage.noResultsTitle")}</h3>
            <p>{t("categoriesPage.noResultsText")}</p>
          </EmptyState>
        )}

        <SeoContent aria-labelledby="categories-seo-heading">
          <h2 id="categories-seo-heading">Find verified experts by consultation category</h2>
          <p>
            G9Experts helps users explore expert categories online and connect with verified professionals by chat or call.
            Browse legal consultation, health advice, astrology guidance, fitness support, finance planning, property advice,
            career guidance, business consultation, relationship advice and education experts in one place. Each category is
            organized to help you compare relevant experts, review consultation options, and start an online discussion when
            you need quick, practical and trusted guidance.
          </p>
        </SeoContent>

        <CtaBlock>
          <div>
            <h2>{t("categoriesPage.ctaTitle")}</h2>
            <p>{t("categoriesPage.ctaText")}</p>
          </div>
          <CtaButton type="button" onClick={() => navigate("/user/call-chat?page=1&mode=chat")}>
            {t("common.talkToExpert")}
          </CtaButton>
        </CtaBlock>
      </MainContent>
    </PageContainer>
  );
};

export default Categories;
