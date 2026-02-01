import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCategory } from "../../../../shared/context/CategoryContext";
import { FiSearch, FiGrid, FiList, FiChevronRight, FiStar, FiUsers, FiClock, FiAward } from "react-icons/fi";
import { IoSparkles, IoShieldCheckmark, IoTrendingUp, IoStatsChart } from "react-icons/io5";

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
  CategoryMeta,
  MetaItem,
  CategoryAction,
  ViewButton,
  PremiumBadge,
  TrendingTag,
  SkeletonGrid,
  SkeletonCard,
  SkeletonImage,
  SkeletonText,
  SkeletonButton,
  EmptyState,
  EmptyIcon,
  EmptyTitle,
  EmptyMessage,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
  CategoryStats,
  StatNumber,
  CategoryFeatures,
  FeatureItem,
  GradientOverlay,
  PopularSection,
  PopularTitle,
  PopularGrid,
  PopularCategory
} from "./Categories.styles";

const DEFAULT_CATEGORY_IMAGE = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h-300&fit=crop";

const Categories = () => {
  const navigate = useNavigate();
  const { categories, loading } = useCategory();
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("popular");

  // Set default category
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  const handleCategoryClick = (categoryId, categoryName) => {
    navigate(`/user/subcategories/${categoryId}`, {
      state: { categoryName: categoryName }
    });
  };

  // Filter categories based on search
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Sort categories
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "popular":
        return (b.popularity || 0) - (a.popularity || 0);
      case "newest":
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      default:
        return (b.popularity || 0) - (a.popularity || 0);
    }
  });

  // Get popular categories (top 3)
  const popularCategories = [...categories]
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 3);

  // Show skeleton loading
  if (loading) {
    return (
      <PageContainer>
        <HeroSection>
          <HeroContent>
            <SkeletonText width="300px" height="40px" />
            <SkeletonText width="400px" height="24px" />
          </HeroContent>
        </HeroSection>
        <MainContent>
          <SkeletonGrid>
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index}>
                <SkeletonImage />
                <SkeletonText width="80%" height="20px" />
                <SkeletonText width="60%" height="16px" />
                <SkeletonButton />
              </SkeletonCard>
            ))}
          </SkeletonGrid>
        </MainContent>
      </PageContainer>
    );
  }

  // Show empty state
  if (!loading && categories.length === 0) {
    return (
      <PageContainer>
        <EmptyState>
          <EmptyIcon>
            <IoSparkles size={48} />
          </EmptyIcon>
          <EmptyTitle>No Categories Available</EmptyTitle>
          <EmptyMessage>
            Categories will be available soon. Please check back later.
          </EmptyMessage>
        </EmptyState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbItem onClick={() => navigate('/')}>Home</BreadcrumbItem>
        <BreadcrumbSeparator><FiChevronRight /></BreadcrumbSeparator>
        <BreadcrumbItem active>Categories</BreadcrumbItem>
      </Breadcrumb>

      {/* Hero Section */}
      <HeroSection>
        <GradientOverlay />
        <HeroContent>
          <HeroTitle>Explore Expert Categories</HeroTitle>
          <HeroSubtitle>
            Discover professional guidance across various specialized fields
          </HeroSubtitle>
          
          <SearchContainer>
            <SearchInput
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchButton>
              <FiSearch size={20} />
              Search
            </SearchButton>
          </SearchContainer>
        </HeroContent>
      </HeroSection>

      {/* Stats Bar */}
      <StatsBar>
        <StatItem>
          <StatIcon>
            <FiUsers />
          </StatIcon>
          <StatValue>{categories.length}</StatValue>
          <StatLabel>Categories</StatLabel>
        </StatItem>
        <StatItem>
          <StatIcon>
            <FiStar />
          </StatIcon>
          <StatValue>500+</StatValue>
          <StatLabel>Verified Experts</StatLabel>
        </StatItem>
        <StatItem>
          <StatIcon>
            <FiClock />
          </StatIcon>
          <StatValue>24/7</StatValue>
          <StatLabel>Availability</StatLabel>
        </StatItem>
        <StatItem>
          <StatIcon>
            <FiAward />
          </StatIcon>
          <StatValue>100%</StatValue>
          <StatLabel>Satisfaction</StatLabel>
        </StatItem>
      </StatsBar>

      {/* Popular Categories Section */}
      {popularCategories.length > 0 && (
        <PopularSection>
          <PopularTitle>
            <IoSparkles size={24} />
            Most Popular Categories
          </PopularTitle>
          <PopularGrid>
            {popularCategories.map((cat) => (
              <PopularCategory
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id, cat.name)}
              >
                <CategoryImage src={cat.image_url || DEFAULT_CATEGORY_IMAGE} />
                <CategoryName>{cat.name}</CategoryName>
                <CategoryStats>
                  <StatNumber>{cat.popularity || "50+"}</StatNumber>
                  <span>active experts</span>
                </CategoryStats>
              </PopularCategory>
            ))}
          </PopularGrid>
        </PopularSection>
      )}

      {/* Main Content */}
      <MainContent>
        <CategoriesHeader>
          <HeaderTitle>
            All Categories
            <span className="count">{sortedCategories.length}</span>
          </HeaderTitle>
          <HeaderActions>
            <ViewToggle>
              <ToggleButton
                $active={viewMode === "grid"}
                onClick={() => setViewMode("grid")}
              >
                <FiGrid size={18} />
              </ToggleButton>
              <ToggleButton
                $active={viewMode === "list"}
                onClick={() => setViewMode("list")}
              >
                <FiList size={18} />
              </ToggleButton>
            </ViewToggle>
            <SortSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="popular">Most Popular</option>
              <option value="name">A to Z</option>
              <option value="newest">Newest</option>
            </SortSelect>
          </HeaderActions>
        </CategoriesHeader>

        {/* Categories Grid */}
        <CategoriesGrid $view={viewMode}>
          {sortedCategories.map((cat) => (
            <CategoryCard
              key={cat.id}
              $view={viewMode}
              $active={cat.id === activeCategory}
              onClick={() => handleCategoryClick(cat.id, cat.name)}
            >
              <CategoryImage
                src={cat.image_url || DEFAULT_CATEGORY_IMAGE}
                alt={cat.name}
                $view={viewMode}
              />
              
              <CategoryInfo $view={viewMode}>
                <CategoryName>{cat.name}</CategoryName>
                
                {cat.description && (
                  <CategoryDescription>
                    {cat.description.length > 100 
                      ? `${cat.description.substring(0, 100)}...` 
                      : cat.description}
                  </CategoryDescription>
                )}
                
                <CategoryMeta>
                  <MetaItem>
                    <IoStatsChart size={14} />
                    <span>{cat.popularity || "50+"} experts</span>
                  </MetaItem>
                  <MetaItem>
                    <IoSparkles size={14} />
                    <span>{cat.rating || "4.8"} rating</span>
                  </MetaItem>
                </CategoryMeta>

                {cat.is_trending && (
                  <TrendingTag>
                    <IoTrendingUp size={12} />
                    Trending
                  </TrendingTag>
                )}

                {cat.is_premium && (
                  <PremiumBadge>
                    <IoShieldCheckmark size={12} />
                    Premium
                  </PremiumBadge>
                )}
              </CategoryInfo>

              <CategoryAction $view={viewMode}>
                <ViewButton>
                  Explore Experts
                  <FiChevronRight size={16} />
                </ViewButton>
              </CategoryAction>
            </CategoryCard>
          ))}
        </CategoriesGrid>

        {/* Features Section */}
        <CategoryFeatures>
          <FeatureItem>
            <IoShieldCheckmark size={32} />
            <h3>Verified Experts</h3>
            <p>All professionals are thoroughly vetted and verified</p>
          </FeatureItem>
          <FeatureItem>
            <FiClock size={32} />
            <h3>24/7 Availability</h3>
            <p>Connect with experts anytime, anywhere</p>
          </FeatureItem>
          <FeatureItem>
            <FiAward size={32} />
            <h3>Quality Guarantee</h3>
            <p>100% satisfaction guaranteed on all consultations</p>
          </FeatureItem>
        </CategoryFeatures>
      </MainContent>
    </PageContainer>
  );
};

export default Categories;