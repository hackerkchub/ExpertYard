import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FiFilter, FiSearch, FiCheck, FiX } from "react-icons/fi";
import { useCategory } from "../../../../shared/context/CategoryContext";
import { getExpertsBySubCategoryApi } from "../../../../shared/api/expertapi/auth.api";
import { getExpertPriceById } from "../../../../shared/api/expertapi/price.api";
import { getExpertFollowersApi } from "../../../../shared/api/expertApi/follower.api";
import { getReviewsByExpertApi } from "../../../../shared/api/expertApi/reviews.api";
import ExpertCard from "../../components/userExperts/ExpertCard";
import "./SubcategoryPage.css";
import useChatRequest from "../../../../shared/hooks/useChatRequest";

const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=12";

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
    // setPrevCategoryId(categoryId);
  }, [categoryId, prevCategoryId, loadSubCategories]);

  useEffect(() => {
    if (categoryId && categoryId !== prevCategoryId) {
      resetStateForNewCategory();
    }
  }, [categoryId, prevCategoryId, resetStateForNewCategory]);

  // useEffect(() => {
  //   if (categoryId && prevCategoryId === categoryId) {
  //     localStorage.setItem(`subcategory_${categoryId}`, activeSubCategory);
  //     localStorage.setItem(`experts_${categoryId}`, JSON.stringify(experts));
  //     localStorage.setItem(`expertDetails_${categoryId}`, JSON.stringify(expertDetails));
  //     localStorage.setItem(`sortBy_${categoryId}`, sortBy);
  //     localStorage.setItem(`selectedSubcategory_${categoryId}`, selectedSubcategory);
  //   }
  // }, [categoryId, activeSubCategory, experts, expertDetails, sortBy, prevCategoryId, selectedSubcategory]);

  // useEffect(() => {
  //   if (categoryId && !categoryLoading && subCategories.length > 0) {
  //     const savedSubCategory = localStorage.getItem(`selectedSubcategory_${categoryId}`);
  //     const savedExperts = localStorage.getItem(`experts_${categoryId}`);
  //     const savedExpertDetails = localStorage.getItem(`expertDetails_${categoryId}`);
  //     const savedSortBy = localStorage.getItem(`sortBy_${categoryId}`);
  //     const savedSelectedSubcategory = localStorage.getItem(`selectedSubcategory_${categoryId}`);
      
  //     const navigationState = location.state;
  //     const isBackNavigation = navigationState?.fromBack || false;
      
  //     if (savedSubCategory && savedExperts && savedExpertDetails && !isBackNavigation) {
  //       console.log("Loading saved state for category:", categoryId);
  //       const savedActiveSubCat = parseInt(savedSubCategory);
  //       setActiveSubCategory(savedActiveSubCat);
  //       setExperts(JSON.parse(savedExperts));
  //       setExpertDetails(JSON.parse(savedExpertDetails));
  //       if (savedSortBy) setSortBy(savedSortBy);
  //       if (savedSelectedSubcategory) {
  //         setSelectedSubcategory(parseInt(savedSelectedSubcategory));
  //       } else {
  //         setSelectedSubcategory(savedActiveSubCat);
  //       }
  //     } else {
  //       const firstSubCategory = subCategories[0];
  //        let defaultId;

  // if (saved) {
  //   defaultId = Number(saved);
  // } else {
  //   defaultId = subCategories[0]?.id;
  // }
  // setSelectedSubcategory(defaultId);
  // setActiveSubCategory(defaultId);
  //       if (firstSubCategory) {
  //         const firstId = firstSubCategory.id;
  //         setActiveSubCategory(firstId);
  //         setSelectedSubcategory(firstId);
          
  //         localStorage.removeItem(`subcategory_${categoryId}`);
  //         localStorage.removeItem(`experts_${categoryId}`);
  //         localStorage.removeItem(`expertDetails_${categoryId}`);
  //         localStorage.removeItem(`selectedSubcategory_${categoryId}`);
  //       }
  //     }
  //   }
  // }, [categoryId, subCategories, categoryLoading, location.state]);

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
    setShowMobileFilters(false); // Close mobile filters when item is selected
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
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", 
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];

  const selectedSubcategoryName = useMemo(() => {
    if (!selectedSubcategory) return "";
    const sc = subCategories.find(s => s.id === selectedSubcategory);
    return sc ? sc.name : "";
  }, [selectedSubcategory, subCategories]);

  if (loading && !categoryName) {
    return (
      <div className="subcategory-page">
        <header className="subcategory-header skeleton">
          <div className="skeleton-line large"></div>
          <div className="skeleton-line medium"></div>
          <div className="search-container skeleton">
            <div className="skeleton-input"></div>
            <div className="skeleton-button"></div>
          </div>
        </header>
        <div className="subcategory-layout">
          <aside className="filters-sidebar skeleton">
            <div className="skeleton-line"></div>
          </aside>
          <main className="subcategory-main">
            <div className="experts-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div className="expert-card skeleton" key={i}>
                  <div className="expert-avatar skeleton"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!categoryLoading && subCategories.length === 0) {
    return (
      <div className="subcategory-page">
        <div className="no-categories">
          <h2>No subcategories found</h2>
          <p>Please check back later or try another category.</p>
          <button onClick={() => navigate(-1)} className="primary-btn">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      
      <div className="subcategory-page">
        <header className="subcategory-header">
          <h1>{categoryName || "Category"} Experts</h1>
          <p>Get personalized insights from verified {categoryName.toLowerCase() || "category"} experts</p>
          
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search for experts..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn">
              <FiSearch size={18} style={{ marginRight: '8px' }} />
              Search
            </button>
          </div>
        </header>

        {/* Mobile Filter Toggle */}
        <div className="mobile-filter-toggle">
          <button 
            className="filter-toggle-btn"
            onClick={() => setShowMobileFilters(true)}
          >
            <FiFilter size={16} />
            Filter & Sort
          </button>
          <div className="results-info">
            {loading ? "Loading..." : `${filteredAndSortedExperts.length} experts`}
          </div>
        </div>

        {/* Mobile Filter Overlay */}
        <div 
          className={`mobile-filter-overlay ${showMobileFilters ? 'show' : ''}`}
          onClick={() => setShowMobileFilters(false)}
        />

        <div className="subcategory-layout">
          {/* Sidebar Filters */}
          <aside className={`filters-sidebar ${showMobileFilters ? 'show' : ''}`}>
            {showMobileFilters && (
              <button 
                className="mobile-filter-close"
                onClick={() => setShowMobileFilters(false)}
              >
                <FiX />
              </button>
            )}
            
            {/* Subcategory Filter Section */}
            <div className="filter-section">
              <h3>Filter by Subcategory</h3>
              
              <div className="subcategory-filter-list">
                {subCategories.map((sc) => {
                  const isSelected = sc.id === selectedSubcategory;
                  const expertCount = experts.filter(exp => exp.subcategory_id === sc.id).length;
                  
                  return (
                    <div 
                      key={sc.id}
                      className="subcategory-filter-item"
                      onClick={() => handleSubcategoryFilterChange(sc.id)}
                    >
                      <div className={`subcategory-radio ${isSelected ? 'checked' : ''}`} />
                      <span className="subcategory-filter-label">
                        {sc.name}
                      </span>
                      <span className="subcategory-count">
                        {expertCount}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sort By Section */}
            <div className="filter-section">
              <h3>Sort By</h3>
              <select 
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="rating">Rating: High to Low</option>
              </select>
              
              <button 
                className="clear-filters-btn"
                onClick={() => {
                  resetFilters();
                  setShowMobileFilters(false);
                }}
              >
                Reset All Filters
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="subcategory-main">
            {/* Subcategory Filter Chips */}
            <div className="subcategory-filters">
              {subCategories.map((sc) => {
                const isActive = sc.id === selectedSubcategory;
                
                return (
                  <button
                    key={sc.id}
                    className={`filter-chip ${isActive ? 'active' : ''}`}
                    onClick={() => handleSubCategoryClick(sc.id)}
                  >
                    {sc.name}
                  </button>
                );
              })}
            </div>

            {/* Page Title and Results */}
            <div className="page-title-section">
              <h2>
                {selectedSubcategoryName ? `${selectedSubcategoryName} Experts` : `Top ${categoryName || "Category"} Experts`}
              </h2>
              <div className="results-info">
                <span>{loading ? "Loading..." : `${filteredAndSortedExperts.length} experts found`}</span>
                <span className="selected-info">
                  {selectedSubcategoryName || "Select a subcategory"}
                </span>
                <span className="desktop-only">
                  Sorted by: {
                    sortBy === 'price-high' ? 'Price: High to Low' :
                    sortBy === 'price-low' ? 'Price: Low to High' :
                    'Rating: High to Low'
                  }
                </span>
              </div>
            </div>

            {/* Experts Grid */}
            {loading && currentSubcategoryExperts.length === 0 ? (
              <div className="experts-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div className="expert-card skeleton" key={i}>
                    <div className="expert-avatar skeleton"></div>
                    <div className="skeleton-line"></div>
                    <div className="skeleton-line short"></div>
                  </div>
                ))}
              </div>
            ) : filteredAndSortedExperts.length > 0 ? (
              <>
                <div className="experts-grid">
                  {filteredAndSortedExperts.map((expert) => (
                  <ExpertCard
  key={expert.id}
  data={expert}
  mode="chat"
  onViewProfile={() => navigate(`/user/expert/${expert.id}`)}
  onStartChat={() =>
    startChat({
      expertId: expert.id,
      chatPrice: expert.chatPrice,
    })
  }
/>
                  ))}
                </div>

                {/* Daily Horoscopes Section */}
                {categoryName && categoryName.toLowerCase().includes('astrology') && (
                  <div className="horoscope-section">
                    <h2 style={{ marginBottom: '24px', color: '#1a202c', fontSize: '22px' }}>
                      Daily Horoscopes
                    </h2>
                    <div className="horoscope-grid">
                      {horoscopeSigns.slice(0, 8).map((sign) => (
                        <div key={sign} className="horoscope-card">
                          <h4>{sign}</h4>
                          <button className="read-btn">Read Now</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer CTA */}
                <div className="cta-section">
                  <div className="rating-banner">
                    <span className="stars">★★★★★</span>
                    <span className="rating-text">Rated 4.9 out of 5 based on 1,300+ reviews</span>
                  </div>
                  
                  <div className="cta-banner">
                    <h2>Start Your {selectedSubcategoryName || categoryName || "Category"} Journey Today</h2>
                    <p>Chat with verified {selectedSubcategoryName?.toLowerCase() || categoryName?.toLowerCase() || "category"} experts anytime, anywhere.</p>
                    <button 
                      className="primary-btn"
                      onClick={() => filteredAndSortedExperts.length > 0 && 
                        navigate(`/user/experts/${filteredAndSortedExperts[0].id}`)}
                    >
                      Chat with an Expert
                    </button>
                  </div>
                </div>
              </>
            ) : !loading ? (
              <div className="no-results">
                <h3>No experts found in {selectedSubcategoryName || "this subcategory"}</h3>
                <p>Try selecting a different subcategory or adjusting your search criteria</p>
                <button 
                  className="primary-btn"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
              </div>
            ) : null}
          </main>
        </div>
      </div>
      <ChatPopups />

    </>
  );
};

export default SubcategoryPage;