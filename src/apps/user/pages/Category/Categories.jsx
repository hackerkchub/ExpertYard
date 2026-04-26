import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCategory } from "../../../../shared/context/CategoryContext";
import { useSeo } from "../../../../shared/seo/useSeo";
import { toAbsoluteUrl } from "../../../../shared/seo/siteConfig";
import {
  buildCategorySeoDescription,
  getCategoryPath,
} from "../../../../shared/utils/categoryRoutes";

// Icons
import { FiSearch, FiGrid, FiList, FiChevronRight, FiStar, FiUsers, FiClock, FiAward } from "react-icons/fi";
import { IoSparkles, IoShieldCheckmark, IoTrendingUp, IoStatsChart } from "react-icons/io5";

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
  CategoryMeta,
  MetaItem,
  ViewButton,
  PremiumBadge,
  TrendingTag,
  EmptyState,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
  PopularSection,
  PopularGrid,
  PopularCategory
} from "./Categories.styles";

const DEFAULT_CATEGORY_IMAGE = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h-300&fit=crop";

const Categories = () => {
  const navigate = useNavigate();
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

  const popularCategories = [...categories]
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 3);
  const categoriesStructuredData = useMemo(
    () => [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Expert Categories",
        url: toAbsoluteUrl("/user/categories"),
        description:
          "Browse expert categories and connect with verified professionals on G9Expert.",
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
            item: toAbsoluteUrl("/user/categories"),
          },
        ],
      },
    ],
    []
  );

  useSeo({
    title: "Browse Expert Categories | G9Expert",
    description:
      "Explore expert categories on G9Expert and connect instantly with verified professionals across legal, health, astrology, fitness, finance, property, and more.",
    canonicalPath: "/user/categories",
    og: {
      title: "Browse Expert Categories | G9Expert",
      description:
        "Explore expert categories on G9Expert and connect instantly with verified professionals across legal, health, astrology, fitness, finance, property, and more.",
    },
    structuredData: categoriesStructuredData,
  });

  if (loading) return null; // Or show your SkeletonGrid here

  return (
    <PageContainer>
      {/* 1. Breadcrumb - Desktop only or subtle on mobile */}
      <Breadcrumb>
        <BreadcrumbItem onClick={() => navigate('/')}>Home</BreadcrumbItem>
        <BreadcrumbSeparator><FiChevronRight /></BreadcrumbSeparator>
        <BreadcrumbItem active>Categories</BreadcrumbItem>
      </Breadcrumb>

      {/* 2. Hero Section - Professional Dark Theme */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>Expert Solutions for Every Need</HeroTitle>
          <HeroSubtitle>Browse top-rated categories and connect with verified professionals.</HeroSubtitle>
          
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search for skills or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchButton>
              <FiSearch /> <span>Search</span>
            </SearchButton>
          </SearchContainer>
        </HeroContent>
      </HeroSection>

      {/* 3. Stats Bar - Floating effect */}
      <StatsBar>
        <StatItem>
          <StatValue>{categories.length}</StatValue>
          <StatLabel>Categories</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue></StatValue>
          <StatLabel></StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>24/7</StatValue>
          <StatLabel>Support</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>100%</StatValue>
          <StatLabel>Secure</StatLabel>
        </StatItem>
      </StatsBar>

      <MainContent>
       
        {/* 5. Header Actions - Grid/List Toggle */}
        <CategoriesHeader>
          <HeaderTitle>
            All Categories <span className="count">{sortedCategories.length}</span>
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
              <option value="popular">Most Popular</option>
              <option value="name">A to Z</option>
              <option value="newest">Newest</option>
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
                to={getCategoryPath(cat)}
                aria-label={`Browse ${cat.name} experts`}
              >
                <CategoryImage 
                  src={cat.image_url || DEFAULT_CATEGORY_IMAGE} 
                  alt={cat.name}
                  $view={viewMode}
                />
                
                <CategoryInfo>
                  {cat.is_trending && (
                    <TrendingTag><IoTrendingUp size={12} /> Trending</TrendingTag>
                  )}
                  
                  <CategoryName>
                    {cat.name}
                    {cat.is_premium && <PremiumBadge>PRO</PremiumBadge>}
                  </CategoryName>
                  
                  <CategoryDescription>
                    {cat.meta_desc?.trim() || buildCategorySeoDescription(cat)}
                  </CategoryDescription>
                  
                 

                  <ViewButton>
                    View Details <FiChevronRight />
                  </ViewButton>
                </CategoryInfo>
              </CategoryCard>
            ))}
          </CategoriesGrid>
        ) : (
          <EmptyState>
            <h3>No results found</h3>
            <p>Try adjusting your search to find what you're looking for.</p>
          </EmptyState>
        )}
      </MainContent>
    </PageContainer>
  );
};

export default Categories;
