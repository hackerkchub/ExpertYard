import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FiFilter, FiSearch, FiCheck, FiX, FiChevronRight } from "react-icons/fi";
import { 
  IoStar, 
  IoPeople, 
  IoChatbubble, 
  IoCall, 
  IoTime,
  IoCalendar,
  IoTrendingUp,
  IoShieldCheckmark
} from "react-icons/io5";
import { useCategory } from "../../../../shared/context/CategoryContext";
import { getExpertsBySubCategoryApi } from "../../../../shared/api/expertapi/auth.api";
import { getExpertPriceById } from "../../../../shared/api/expertapi/price.api";
import { getExpertFollowersApi } from "../../../../shared/api/expertApi/follower.api";
import { getReviewsByExpertApi } from "../../../../shared/api/expertApi/reviews.api";
import ExpertCard from "../../components/userExperts/ExpertCard";
import useChatRequest from "../../../../shared/hooks/useChatRequest";
import {
  PageContainer,
  PageHeader,
  HeaderContent,
  HeaderTitle,
  HeaderSubtitle,
  SearchContainer,
  SearchInput,
  SearchButton,
  PageLayout,
  FiltersSidebar,
  FilterSection,
  FilterSectionTitle,
  SubcategoryFilterList,
  SubcategoryFilterItem,
  SubcategoryRadio,
  SubcategoryFilterLabel,
  SubcategoryCount,
  SortSelect,
  ClearFiltersButton,
  MainContent,
  FilterChipsContainer,
  FilterChip,
  PageTitleSection,
  PageTitle,
  ResultsInfo,
  SelectedInfo,
  DesktopInfo,
  ExpertsGrid,
  LoadingGrid,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonLine,
  SkeletonButton,
  NoResults,
  NoResultsTitle,
  NoResultsText,
  CtaSection,
  RatingBanner,
  Stars,
  RatingText,
  CtaBanner,
  CtaTitle,
  CtaDescription,
  PrimaryButton,
  SecondaryButton,
  MobileFilterToggle,
  FilterToggleButton,
  MobileResultsInfo,
  MobileFilterOverlay,
  MobileFilterHeader,
  MobileFilterClose,
  ExpertStats,
  StatItem,
  StatIcon,
  StatValue,
  StatLabel,
  PremiumBadge,
  BadgeIcon,
  BadgeText,
  ExpertCardPremium,
  ExpertHeader,
  ExpertAvatar,
  ExpertInfo,
  ExpertName,
  ExpertTitle,
  ExpertSpeciality,
  ExpertLocation,
  ExpertPricing,
  PriceTag,
  PriceIcon,
  PriceAmount,
  PriceUnit,
  ActionButtons,
  ViewProfileButton,
  StartChatButton,
  HoroscopeSection,
  HoroscopeTitle,
  HoroscopeGrid,
  HoroscopeCard,
  HoroscopeSign,
  ReadButton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
  ExpertVerified,
  VerificationBadge,
  ExpertRating,
  RatingStars,
  RatingValue,
  NoCategories,
  CategoryErrorTitle,
  CategoryErrorText
} from "./SubcategoryPage.styles";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face";

const SubcategoryPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    subCategories,
    loadSubCategories,
    loading: categoryLoading,
  } = useCategory();

  const { startChat, ChatPopups } = useChatRequest();

  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [experts, setExperts] = useState([]);
  const [expertsLoading, setExpertsLoading] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [sortBy, setSortBy] = useState("price-high");
  const [searchQuery, setSearchQuery] = useState("");
  const [prevCategoryId, setPrevCategoryId] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [expertDetails, setExpertDetails] = useState({});
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [hoveredExpert, setHoveredExpert] = useState(null);

  const resetStateForNewCategory = useCallback(() => {
    console.log("Resetting state for new category:", categoryId);
    setActiveSubCategory(null);
    setExperts([]);
    setExpertDetails({});
    setCategoryName("");
    setSortBy("price-high");
    setSearchQuery("");
    setSelectedSubcategory(null);
    setShowMobileFilters(false);
    
    if (prevCategoryId) {
      localStorage.removeItem(`subcategory_${prevCategoryId}`);
      localStorage.removeItem(`experts_${prevCategoryId}`);
      localStorage.removeItem(`expertDetails_${prevCategoryId}`);
      localStorage.removeItem(`sortBy_${prevCategoryId}`);
      localStorage.removeItem(`selectedSubcategory_${prevCategoryId}`);
    }
    
    loadSubCategories(categoryId);
    setPrevCategoryId(categoryId);
  }, [categoryId, prevCategoryId, loadSubCategories]);

  useEffect(() => {
    if (categoryId && categoryId !== prevCategoryId) {
      resetStateForNewCategory();
    }
  }, [categoryId, prevCategoryId, resetStateForNewCategory]);

  useEffect(() => {
    if (!categoryId || subCategories.length === 0) return;

    const savedId = localStorage.getItem(`selectedSubcategory_${categoryId}`);
    const firstId = subCategories[0]?.id;
    const defaultId = savedId ? Number(savedId) : firstId;

    if (defaultId) {
      setSelectedSubcategory(defaultId);
      setActiveSubCategory(defaultId);
    }
  }, [categoryId, subCategories]);

  useEffect(() => {
    if (selectedSubcategory && categoryId) {
      localStorage.setItem(
        `selectedSubcategory_${categoryId}`,
        selectedSubcategory
      );
    }
  }, [selectedSubcategory, categoryId]);

  useEffect(() => {
    if (subCategories.length > 0) {
      const firstSubCategory = subCategories[0];
      if (firstSubCategory) {
        if (firstSubCategory.category_name) {
          setCategoryName(firstSubCategory.category_name);
        } else if (firstSubCategory.category_name_from_parent) {
          setCategoryName(firstSubCategory.category_name_from_parent);
        } else {
          const name = firstSubCategory.name.split(' ')[0];
          setCategoryName(name);
        }
      }
    }
  }, [subCategories]);

  const loadExpertsForSubcategory = useCallback(async (subCategoryId) => {
    if (!subCategoryId || !categoryId) return;

    try {
      setExpertsLoading(true);
      console.log("Loading experts for subcategory:", subCategoryId);
      
      const res = await getExpertsBySubCategoryApi(subCategoryId);
      console.log("Experts API response:", res?.data?.data);
      const expertsList = res?.data?.data || [];
      
      const expertsWithCategory = expertsList.map(exp => ({
        ...exp,
        category_id: categoryId,
        subcategory_id: subCategoryId
      }));
      
      const newExpertDetails = {};
      const expertPromises = expertsList.map(async (expert) => {
        const expertId = expert.expert_id || expert.id;
        if (!expertId) return null;
        
        try {
          const [priceRes, followersRes, reviewsRes] = await Promise.allSettled([
            getExpertPriceById(expertId),
            getExpertFollowersApi(expertId),
            getReviewsByExpertApi(expertId)
          ]);
          
          const priceData = priceRes.status === 'fulfilled' ? priceRes.value?.data?.data || {} : {};
          const followersData = followersRes.status === 'fulfilled' ? followersRes.value?.data || {} : {};
          const reviewsData = reviewsRes.status === 'fulfilled' ? reviewsRes.value?.data?.data || {} : {};
          
          return {
            expertId,
            details: {
              callPrice: Number(priceData.call_per_minute || priceData.price || 0),
              chatPrice: Number(priceData.chat_per_minute || priceData.price || 0),
              followersCount: followersData.total_followers || followersData.followers?.length || 0,
              avgRating: Number(reviewsData.avg_rating || 0),
              totalReviews: reviewsData.total_reviews || (reviewsData.reviews || []).length || 0,
            }
          };
        } catch (err) {
          console.error(`Failed to load details for expert ${expertId}:`, err);
          return {
            expertId,
            details: {
              callPrice: 0,
              chatPrice: 0,
              followersCount: 0,
              avgRating: 0,
              totalReviews: 0,
            }
          };
        }
      });
      
      const expertDetailsResults = await Promise.all(expertPromises);
      
      expertDetailsResults.forEach(result => {
        if (result) {
          newExpertDetails[result.expertId] = result.details;
        }
      });
      
      setExperts(prev => {
        const otherExperts = prev.filter(exp => exp.subcategory_id !== subCategoryId);
        return [...otherExperts, ...expertsWithCategory];
      });
      
      setExpertDetails(prev => ({ ...prev, ...newExpertDetails }));
      
    } catch (err) {
      console.error("Experts load failed", err);
    } finally {
      setExpertsLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    if (selectedSubcategory && categoryId) {
      loadExpertsForSubcategory(selectedSubcategory);
    }
  }, [selectedSubcategory, categoryId]);

  const handleSubCategoryClick = (subCategoryId) => {
    if (subCategoryId === selectedSubcategory) return;
    setSelectedSubcategory(subCategoryId);
    setActiveSubCategory(subCategoryId);
  };

  const handleSubcategoryFilterChange = (subCategoryId) => {
    setSelectedSubcategory(subCategoryId);
    setActiveSubCategory(subCategoryId);
    setShowMobileFilters(false);
  };

  const resetFilters = () => {
    setSortBy("price-high");
    setSearchQuery("");
    if (subCategories.length > 0) {
      const firstId = subCategories[0].id;
      setSelectedSubcategory(firstId);
      setActiveSubCategory(firstId);
    }
  };

  const getSubcategoryName = (subId) => {
    const sc = subCategories.find((s) => Number(s.id) === Number(subId));
    return sc ? sc.name : "";
  };

  const currentSubcategoryExperts = useMemo(() => {
    if (!selectedSubcategory) return [];
    
    return experts.filter(expert => 
      expert.subcategory_id === selectedSubcategory && 
      (!expert.category_id || expert.category_id === categoryId)
    );
  }, [experts, selectedSubcategory, categoryId]);

  const formatExpertForCard = (expert) => {
    const expertId = expert.expert_id || expert.id;
    const details = expertDetails[expertId] || {};
    
    return {
      id: expertId,
      name: expert.name || expert.expert_name || "Expert",
      profile_photo: expert.profile_photo || DEFAULT_AVATAR,
      position: expert.position || "Expert",
      speciality: getSubcategoryName(expert.subcategory_id) || expert.main_expertise || categoryName,
      location: expert.location || "India",
      callPrice: details.callPrice || 0,
      chatPrice: details.chatPrice || 0,
      followersCount: details.followersCount || 0,
      avgRating: details.avgRating || 0,
      totalReviews: details.totalReviews || 0,
      rawData: expert,
      rawDetails: details
    };
  };

  const filteredAndSortedExperts = useMemo(() => {
    if (expertsLoading || currentSubcategoryExperts.length === 0) return [];

    const expertDataList = currentSubcategoryExperts.map(formatExpertForCard);
    
    let filtered = expertDataList.filter(expert => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const nameMatch = expert.name?.toLowerCase().includes(query);
        const positionMatch = expert.position?.toLowerCase().includes(query);
        const specialityMatch = expert.speciality?.toLowerCase().includes(query);
        
        if (!nameMatch && !positionMatch && !specialityMatch) {
          return false;
        }
      }
      return true;
    });
    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.chatPrice || 0) - (b.chatPrice || 0);
        
        case "price-high":
          return (b.chatPrice || 0) - (a.chatPrice || 0);
        
        case "rating":
          return (b.avgRating || 0) - (a.avgRating || 0);
        
        default:
          return (b.chatPrice || 0) - (a.chatPrice || 0);
      }
    });
    
    return filtered;
  }, [currentSubcategoryExperts, searchQuery, sortBy, expertsLoading]);

  const loading = categoryLoading || expertsLoading;

  const horoscopeSigns = [
    { sign: "Aries", date: "Mar 21 - Apr 19" },
    { sign: "Taurus", date: "Apr 20 - May 20" },
    { sign: "Gemini", date: "May 21 - Jun 20" },
    { sign: "Cancer", date: "Jun 21 - Jul 22" },
    { sign: "Leo", date: "Jul 23 - Aug 22" },
    { sign: "Virgo", date: "Aug 23 - Sep 22" },
    { sign: "Libra", date: "Sep 23 - Oct 22" },
    { sign: "Scorpio", date: "Oct 23 - Nov 21" },
    { sign: "Sagittarius", date: "Nov 22 - Dec 21" },
    { sign: "Capricorn", date: "Dec 22 - Jan 19" },
    { sign: "Aquarius", date: "Jan 20 - Feb 18" },
    { sign: "Pisces", date: "Feb 19 - Mar 20" }
  ];

  const selectedSubcategoryName = useMemo(() => {
    if (!selectedSubcategory) return "";
    const sc = subCategories.find(s => s.id === selectedSubcategory);
    return sc ? sc.name : "";
  }, [selectedSubcategory, subCategories]);

  const renderExpertCard = (expert) => (
    <ExpertCardPremium
      key={expert.id}
      onMouseEnter={() => setHoveredExpert(expert.id)}
      onMouseLeave={() => setHoveredExpert(null)}
      isHovered={hoveredExpert === expert.id}
    >
      <ExpertHeader>
        <ExpertAvatar src={expert.profile_photo} alt={expert.name} />
        <ExpertInfo>
          <ExpertName>
            {expert.name}
            <ExpertVerified>
              <VerificationBadge>
                <IoShieldCheckmark size={14} />
                Verified
              </VerificationBadge>
            </ExpertVerified>
          </ExpertName>
          <ExpertTitle>{expert.position}</ExpertTitle>
          <ExpertSpeciality>{expert.speciality}</ExpertSpeciality>
          <ExpertLocation>
            <IoPeople size={14} /> {expert.location}
          </ExpertLocation>
        </ExpertInfo>
      </ExpertHeader>

      <ExpertStats>
        <StatItem>
          <StatIcon>
            <IoStar size={16} />
          </StatIcon>
          <StatValue>{expert.avgRating.toFixed(1)}</StatValue>
          <StatLabel>({expert.totalReviews} reviews)</StatLabel>
        </StatItem>
        <StatItem>
          <StatIcon>
            <IoPeople size={16} />
          </StatIcon>
          <StatValue>{expert.followersCount}</StatValue>
          <StatLabel>Followers</StatLabel>
        </StatItem>
      </ExpertStats>

      <ExpertPricing>
        <PriceTag>
          <PriceIcon>
            <IoChatbubble size={16} />
          </PriceIcon>
          <PriceAmount>₹{expert.chatPrice}</PriceAmount>
          <PriceUnit>/min chat</PriceUnit>
        </PriceTag>
        <PriceTag>
          <PriceIcon>
            <IoCall size={16} />
          </PriceIcon>
          <PriceAmount>₹{expert.callPrice}</PriceAmount>
          <PriceUnit>/min call</PriceUnit>
        </PriceTag>
      </ExpertPricing>

      <ActionButtons>
        <ViewProfileButton onClick={() => navigate(`/user/experts/${expert.id}`)}>
          View Profile
        </ViewProfileButton>
        <StartChatButton onClick={() => startChat({
          expertId: expert.id,
          chatPrice: expert.chatPrice,
        })}>
          <IoChatbubble size={16} />
          Start Chat
        </StartChatButton>
      </ActionButtons>
    </ExpertCardPremium>
  );

  const renderLoadingSkeletons = () => (
    <LoadingGrid>
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i}>
          <SkeletonAvatar />
          <SkeletonLine width="70%" />
          <SkeletonLine width="50%" />
          <SkeletonLine width="60%" />
          <SkeletonButton />
        </SkeletonCard>
      ))}
    </LoadingGrid>
  );

  if (loading && !categoryName) {
    return (
      <PageContainer>
        <PageHeader>
          <HeaderContent>
            <SkeletonLine width="200px" height="32px" />
            <SkeletonLine width="300px" height="20px" />
          </HeaderContent>
        </PageHeader>
        <PageLayout>
          {renderLoadingSkeletons()}
        </PageLayout>
      </PageContainer>
    );
  }

  if (!categoryLoading && subCategories.length === 0) {
    return (
      <PageContainer>
        <NoCategories>
          <CategoryErrorTitle>No Subcategories Found</CategoryErrorTitle>
          <CategoryErrorText>
            Please check back later or try another category.
          </CategoryErrorText>
          <SecondaryButton onClick={() => navigate(-1)}>
            Go Back
          </SecondaryButton>
        </NoCategories>
      </PageContainer>
    );
  }

  return (
    <>
      <PageContainer>
        <Breadcrumb>
          <BreadcrumbItem onClick={() => navigate('/')}>Home</BreadcrumbItem>
          <BreadcrumbSeparator><FiChevronRight /></BreadcrumbSeparator>
          <BreadcrumbItem onClick={() => navigate('/user/categories')}>Categories</BreadcrumbItem>
          <BreadcrumbSeparator><FiChevronRight /></BreadcrumbSeparator>
          <BreadcrumbItem active>{categoryName}</BreadcrumbItem>
        </Breadcrumb>

        <PageHeader>
          <HeaderContent>
            <HeaderTitle>
              {categoryName} Experts
            </HeaderTitle>
            <HeaderSubtitle>
              Connect with verified {categoryName.toLowerCase()} experts for personalized insights and guidance
            </HeaderSubtitle>
            
            <SearchContainer>
              <SearchInput 
                type="text" 
                placeholder="Search experts by name, specialty, or keyword..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <SearchButton>
                <FiSearch size={18} />
                Search
              </SearchButton>
            </SearchContainer>
          </HeaderContent>
        </PageHeader>

        <MobileFilterToggle>
          <FilterToggleButton onClick={() => setShowMobileFilters(true)}>
            <FiFilter size={16} />
            Filter & Sort
          </FilterToggleButton>
          <MobileResultsInfo>
            {loading ? "Loading..." : `${filteredAndSortedExperts.length} experts available`}
          </MobileResultsInfo>
        </MobileFilterToggle>

        <MobileFilterOverlay 
          show={showMobileFilters} 
          onClick={() => setShowMobileFilters(false)}
        />

        <PageLayout>
          <FiltersSidebar show={showMobileFilters}>
            {showMobileFilters && (
              <MobileFilterHeader>
                <h3>Filters</h3>
                <MobileFilterClose onClick={() => setShowMobileFilters(false)}>
                  <FiX size={24} />
                </MobileFilterClose>
              </MobileFilterHeader>
            )}
            
            <FilterSection>
              <FilterSectionTitle>
                <FiFilter size={18} />
                Subcategories
              </FilterSectionTitle>
              
              <SubcategoryFilterList>
                {subCategories.map((sc) => {
                  const isSelected = sc.id === selectedSubcategory;
                  const expertCount = experts.filter(exp => exp.subcategory_id === sc.id).length;
                  
                  return (
                    <SubcategoryFilterItem
                      key={sc.id}
                      onClick={() => handleSubcategoryFilterChange(sc.id)}
                      isSelected={isSelected}
                    >
                      <SubcategoryRadio isSelected={isSelected} />
                      <SubcategoryFilterLabel isSelected={isSelected}>
                        {sc.name}
                      </SubcategoryFilterLabel>
                      <SubcategoryCount>
                        {expertCount}
                      </SubcategoryCount>
                    </SubcategoryFilterItem>
                  );
                })}
              </SubcategoryFilterList>
            </FilterSection>

            <FilterSection>
              <FilterSectionTitle>
                <IoTrendingUp size={18} />
                Sort By
              </FilterSectionTitle>
              <SortSelect 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="rating">Highest Rated</option>
              </SortSelect>
              
              <ClearFiltersButton onClick={resetFilters}>
                Clear All Filters
              </ClearFiltersButton>
            </FilterSection>

            <PremiumBadge>
              <BadgeIcon>
                <IoShieldCheckmark size={20} />
              </BadgeIcon>
              <BadgeText>
                <strong>Premium Verified</strong>
                <span>All experts are verified and background checked</span>
              </BadgeText>
            </PremiumBadge>
          </FiltersSidebar>

          <MainContent>
            <FilterChipsContainer>
              {subCategories.map((sc) => {
                const isActive = sc.id === selectedSubcategory;
                const expertCount = experts.filter(exp => exp.subcategory_id === sc.id).length;
                
                return (
                  <FilterChip
                    key={sc.id}
                    isActive={isActive}
                    onClick={() => handleSubCategoryClick(sc.id)}
                  >
                    {sc.name}
                    {expertCount > 0 && (
                      <span className="count">{expertCount}</span>
                    )}
                  </FilterChip>
                );
              })}
            </FilterChipsContainer>

            <PageTitleSection>
              <PageTitle>
                {selectedSubcategoryName ? (
                  <>
                    {selectedSubcategoryName} Experts
                    <ExpertRating>
                      <RatingStars>
                        <IoStar size={18} />
                        <IoStar size={18} />
                        <IoStar size={18} />
                        <IoStar size={18} />
                        <IoStar size={18} />
                      </RatingStars>
                      <RatingValue>4.9/5 from 1.2k+ reviews</RatingValue>
                    </ExpertRating>
                  </>
                ) : (
                  `Top ${categoryName} Experts`
                )}
              </PageTitle>
              <ResultsInfo>
                <span>
                  {loading ? (
                    "Loading experts..."
                  ) : (
                    `${filteredAndSortedExperts.length} expert${filteredAndSortedExperts.length !== 1 ? 's' : ''} available`
                  )}
                </span>
                <SelectedInfo>
                  <FiCheck size={14} />
                  {selectedSubcategoryName || "Select a subcategory"}
                </SelectedInfo>
                <DesktopInfo>
                  Sorted by: {
                    sortBy === 'price-high' ? 'Price: High to Low' :
                    sortBy === 'price-low' ? 'Price: Low to High' :
                    'Highest Rated'
                  }
                </DesktopInfo>
              </ResultsInfo>
            </PageTitleSection>

            {loading && currentSubcategoryExperts.length === 0 ? (
              renderLoadingSkeletons()
            ) : filteredAndSortedExperts.length > 0 ? (
              <>
                <ExpertsGrid>
                  {filteredAndSortedExperts.map(renderExpertCard)}
                </ExpertsGrid>

                {categoryName && categoryName.toLowerCase().includes('astrology') && (
                  <HoroscopeSection>
                    <HoroscopeTitle>
                      <IoCalendar size={24} />
                      Today's Horoscope
                    </HoroscopeTitle>
                    <HoroscopeGrid>
                      {horoscopeSigns.map(({ sign, date }) => (
                        <HoroscopeCard key={sign}>
                          <HoroscopeSign>
                            <h4>{sign}</h4>
                            <span>{date}</span>
                          </HoroscopeSign>
                          <ReadButton>Read Now</ReadButton>
                        </HoroscopeCard>
                      ))}
                    </HoroscopeGrid>
                  </HoroscopeSection>
                )}

                <CtaSection>
                  <RatingBanner>
                    <Stars>
                      <IoStar size={20} />
                      <IoStar size={20} />
                      <IoStar size={20} />
                      <IoStar size={20} />
                      <IoStar size={20} />
                    </Stars>
                    <RatingText>
                      Rated 4.9 out of 5 based on 1,300+ customer reviews
                    </RatingText>
                  </RatingBanner>
                  
                  <CtaBanner>
                    <CtaTitle>
                      Start Your {selectedSubcategoryName || categoryName} Journey Today
                    </CtaTitle>
                    <CtaDescription>
                      Get personalized insights from verified experts. 
                      Connect instantly via chat or call.
                    </CtaDescription>
                    <PrimaryButton
                      onClick={() => filteredAndSortedExperts.length > 0 && 
                        navigate(`/user/experts/${filteredAndSortedExperts[0].id}`)}
                    >
                      <IoChatbubble size={20} />
                      Start Free Consultation
                    </PrimaryButton>
                  </CtaBanner>
                </CtaSection>
              </>
            ) : !loading ? (
              <NoResults>
                <NoResultsTitle>
                  No Experts Found
                </NoResultsTitle>
                <NoResultsText>
                  We couldn't find any experts in {selectedSubcategoryName.toLowerCase()}. 
                  Try selecting a different subcategory or adjusting your search.
                </NoResultsText>
                <SecondaryButton onClick={resetFilters}>
                  Reset Filters
                </SecondaryButton>
              </NoResults>
            ) : null}
          </MainContent>
        </PageLayout>
      </PageContainer>
      <ChatPopups />
    </>
  );
};

export default SubcategoryPage;