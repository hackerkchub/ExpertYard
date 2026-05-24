// src/apps/user/pages/UserExpertsPage.jsx - PREMIUM UPGRADED WITH WORKING FILTERS (TAB FLICKER FIXED)
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  FiX, FiChevronLeft, FiChevronRight, FiSearch, FiFilter, 
  FiSliders, FiXCircle, FiTrendingUp, FiAward, FiClock,
  FiStar, FiDollarSign, FiUserCheck, FiUsers, FiZap,
  FiMessageSquare, FiPhoneCall
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

import {
  PageWrap,
  HeaderSection,
  Title,
  SubTitle,
  TabsRow,
  TabButton,
  Layout,
  FilterWrap,
  FilterTitle,
  FilterGroup,
  FilterLabel,
  FilterSelect,
  ResetFilterBtn,
  ExpertsWrap,
  Grid,
  EmptyState,
  LoaderRow,
  SkeletonCard,
  SkeletonGrid,
  PaginationWrap,
  PageButton,
  PageInfo,
  StatsBar,
  StatItem,
  SearchInput,
  SearchIcon,
  ClearSearchBtn,
  FilterHeader,
  FilterCount,
  MobileFilterToggle,
  MobileFilterDrawer,
  Overlay,
  ActiveFilters,
  ActiveFilterChip,
} from "./CallChatExpert.styles";

import ExpertCard from "../../components/userExperts/ExpertCard";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useWallet } from "../../../../shared/context/WalletContext";
import { socket } from "../../../../shared/api/socket"; // Only for online/offline status
import { useCategory } from "../../../../shared/context/CategoryContext";
import { getExpertsApi } from "../../../../shared/api/expertapi/expert.api";
import useNetworkReconnect from "../../../../shared/hooks/useNetworkReconnect";
import useChatRequest from "../../../../shared/hooks/useChatRequest"; // NEW IMPORT

const TABS = [
  { id: "call", labelKey: "callChat.callTab", icon: "📞" },
  { id: "chat", labelKey: "callChat.chatTab", icon: "💬" },
];

// Rating options
const ratingOptions = [
  { value: "", label: "Any Rating" },
  { value: "4.5", label: "4.5 & Above ⭐" },
  { value: "4.0", label: "4.0 & Above ⭐" },
  { value: "3.5", label: "3.5 & Above ⭐" },
  { value: "3.0", label: "3.0 & Above ⭐" },
];

// Price options based on mode
const getPriceOptions = (mode) => [
  { value: "", label: `No limit` },
  { value: "30", label: `Up to ₹30/${mode === "call" ? "min" : "min"}` },
  { value: "50", label: `Up to ₹50/${mode === "call" ? "min" : "min"}` },
  { value: "100", label: `Up to ₹100/${mode === "call" ? "min" : "min"}` },
  { value: "200", label: `Up to ₹200/${mode === "call" ? "min" : "min"}` },
];

// Sort options
const sortOptions = [
  { value: "", label: "Default (Top Rated)" },
  { value: "experience_desc", label: "Experience: High to Low" },
  { value: "experience_asc", label: "Experience: Low to High" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating_desc", label: "Rating: High to Low" },
  { value: "rating_asc", label: "Rating: Low to High" },
];

export default function UserExpertsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const modeFromUrl = searchParams.get("mode");
  const searchQueryFromUrl = searchParams.get("q");
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const queryString = searchParams.toString();

  // FIX 1: Initialize tab with ref to prevent re-renders
  const initialTabRef = useRef(modeFromUrl === "chat" ? "chat" : "call");
  const [tab, setTab] = useState(initialTabRef.current);
  
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [totalPages, setTotalPages] = useState(1);
  const [totalExperts, setTotalExperts] = useState(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { 
    categories, 
    subCategories, 
    subCategoriesLoading, 
    loadSubCategories 
  } = useCategory();
  const { isLoggedIn, user } = useAuth();
  const userId = user?.id;
  const { balance } = useWallet();

  // Filter states
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [searchInput, setSearchInput] = useState(searchQueryFromUrl || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQueryFromUrl || "");
  const [minRating, setMinRating] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  // Experts data
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Online/Offline state
  const [onlineExperts, setOnlineExperts] = useState({});
  const latestRequestRef = useRef(0);

  // Use Chat Request Hook
  const {
    startChat,
    ChatPopups,
    isWaiting,
  } = useChatRequest();

  // FIX 2: Mode sync effect - only sync when URL mode differs from state
  useEffect(() => {
    if (!modeFromUrl) return;

    if (
      (modeFromUrl === "call" || modeFromUrl === "chat") &&
      modeFromUrl !== tab
    ) {
      setTab(modeFromUrl);
    }
  }, [modeFromUrl]); // Removed tab dependency to prevent loop

  // Debounce search and avoid resetting pagination when the value is unchanged.
  useEffect(() => {
    const timer = setTimeout(() => {
      const nextSearch = searchInput.trim();
      if (nextSearch !== debouncedSearch) {
        setDebouncedSearch(nextSearch);
        setCurrentPage(1);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [searchInput, debouncedSearch]);

  const apiParams = useMemo(() => {
    const params = {
      page: currentPage,
      limit: 20,
      priceMode: tab
    };

    if (selectedCategoryId) {
      params.category = selectedCategoryId;
    }

    if (selectedSubcategoryId) {
      params.subcategory = selectedSubcategoryId;
    }

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    if (minRating) {
      params.minRating = minRating;
    }

    if (maxPrice) {
      params.maxPrice = maxPrice;
    }

    if (sortBy) {
      params.sortBy = sortBy;
      params.order = sortOrder;
    }

    const hasFilters =
      selectedCategoryId ||
      selectedSubcategoryId ||
      debouncedSearch ||
      minRating ||
      maxPrice ||
      sortBy;

    if (!hasFilters) {
      params.top = "true";
    }

    return params;
  }, [
    currentPage,
    selectedCategoryId,
    selectedSubcategoryId,
    debouncedSearch,
    minRating,
    maxPrice,
    sortBy,
    sortOrder,
    tab
  ]);

  // FIX 3: URL sync effect - prevents loop
  useEffect(() => {
    const currentMode = searchParams.get("mode");

    if (currentMode === tab) return;

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("mode", tab);
    nextParams.set("page", String(currentPage));

    if (debouncedSearch) {
      nextParams.set("q", debouncedSearch);
    } else {
      nextParams.delete("q");
    }

    setSearchParams(nextParams, { replace: true });
  }, [tab, currentPage, debouncedSearch, searchParams, setSearchParams]);

  const fetchExperts = useCallback(async () => {
    const requestId = latestRequestRef.current + 1;
    latestRequestRef.current = requestId;

    setLoading(true);
    setError(null);

    try {
      const response = await getExpertsApi(apiParams);

      if (latestRequestRef.current !== requestId) return;

      setExperts(response.data || []);
      setTotalExperts(response.total || 0);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      if (latestRequestRef.current !== requestId) return;

      console.error("Failed to fetch experts:", error);
      setError("Failed to load experts. Please try again.");
      setExperts([]);
      setTotalExperts(0);
      setTotalPages(1);
    } finally {
      if (latestRequestRef.current === requestId) {
        setLoading(false);
      }
    }
  }, [apiParams]);
  
  // SINGLE EFFECT for fetching - NO duplicates
  useEffect(() => {
    fetchExperts();
  }, [fetchExperts]);

  // FIX 4: Network reconnect - always enabled
  useNetworkReconnect(fetchExperts, {
    enabled: true,
  });

  // Reset subcategory when category changes AND load subcategories
  useEffect(() => {
    setSelectedSubcategoryId("");
  }, [selectedCategoryId]);

  // Socket listeners for online/offline status ONLY
  useEffect(() => {
    if (!socket) return;

    const handleMultipleStatus = (data) => {
      setOnlineExperts(prev => {
        const updated = { ...prev };
        Object.keys(data).forEach(id => {
          updated[String(id)] = data[id];
        });
        return updated;
      });
    };

    const handleOnline = ({ expert_id }) => {
      setOnlineExperts(prev => ({
        ...prev,
        [String(expert_id)]: true
      }));
    };

    const handleOffline = ({ expert_id }) => {
      setOnlineExperts(prev => ({
        ...prev,
        [String(expert_id)]: false
      }));
    };

    socket.on("multiple_expert_status", handleMultipleStatus);
    socket.on("expert_online", handleOnline);
    socket.on("expert_offline", handleOffline);

    return () => {
      socket.off("multiple_expert_status", handleMultipleStatus);
      socket.off("expert_online", handleOnline);
      socket.off("expert_offline", handleOffline);
    };
  }, []);

  // Check online status for current experts
  useEffect(() => {
    if (!socket || !experts.length) return;

    const expertIds = experts.map(e => Number(e.id));
    if (expertIds.length) {
      socket.emit("check_multiple_experts", { expertIds });
    }
  }, [experts]);

  const resetFilters = () => {
    setSelectedCategoryId("");
    setSelectedSubcategoryId("");
    setSearchInput("");
    setDebouncedSearch("");
    setMinRating("");
    setMaxPrice("");
    setSortBy("");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  // UPDATED: Use hook's startChat instead of direct socket emit
  const handleStartChat = useCallback((expertId) => {
    if (!isLoggedIn) {
      navigate("/user/auth");
      return;
    }

    const expert = experts.find(e => Number(e.id) === Number(expertId));
    
    startChat({
      expertId,
      chatPrice: expert?.chat_per_minute || 0,
      pricingMode: "per_minute",
    });
  }, [isLoggedIn, experts, startChat, navigate]);

  const handleStartCall = useCallback((expertId) => {
    if (!isLoggedIn) {
      navigate("/user/auth");
      return;
    }
    navigate(`/user/voice-call/${expertId}`);
  }, [isLoggedIn, navigate]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const cardExperts = useMemo(() => {
    return experts.map((exp) => ({
      id: exp.id,
      slug: exp.slug || exp.id,
      name: exp.name,
      profile_photo: exp.profile_photo,
      position: exp.category_name,
      speciality: exp.subcategory_name,
      location: exp.location,
      isOnline: onlineExperts[String(exp.id)],
      call_per_minute: exp.call_per_minute || 0,
      chat_per_minute: exp.chat_per_minute || 0,
      session_price: exp.session_price || 0,
      session_duration: exp.session_duration || 30,
      avg_rating: exp.avg_rating || 0,
      total_reviews: exp.total_reviews || 0,
      total_followers: exp.total_followers || 0,
      total_experience: exp.total_experience || 0,
      total_time: exp.total_time || 0,
      chat_time: exp.chat_time || 0,
      call_time: exp.call_time || 0,
      has_subscription: exp.has_subscription || false,
      category_name: exp.category_name,
      subcategory_name: exp.subcategory_name,
      is_verified: exp.is_verified !== false,
      languages: exp.languages || [],
      avg_response_time: exp.avg_response_time,
      total_consultations: exp.total_consultations,
    }));
  }, [experts, onlineExperts]);

  // Get active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategoryId) count++;
    if (selectedSubcategoryId) count++;
    if (debouncedSearch) count++;
    if (minRating) count++;
    if (maxPrice) count++;
    if (sortBy) count++;
    return count;
  }, [selectedCategoryId, selectedSubcategoryId, debouncedSearch, minRating, maxPrice, sortBy]);

  const removeFilter = (filterName) => {
    switch(filterName) {
      case 'category':
        setSelectedCategoryId("");
        break;
      case 'subcategory':
        setSelectedSubcategoryId("");
        break;
      case 'search':
        setSearchInput("");
        setDebouncedSearch("");
        break;
      case 'rating':
        setMinRating("");
        break;
      case 'price':
        setMaxPrice("");
        break;
      case 'sort':
        setSortBy("");
        break;
      default:
        break;
    }
  };

  const FilterContent = () => (
    <>
      <FilterHeader>
        <FilterTitle>
          <FiSliders size={18} /> {t("callChat.filters", "Filters")}
        </FilterTitle>
        {activeFiltersCount > 0 && (
          <FilterCount>{activeFiltersCount} {t("callChat.active", "active")}</FilterCount>
        )}
      </FilterHeader>

      {/* Category Filter - with loadSubCategories */}
      <FilterGroup>
        <FilterLabel>{t("common.categories")}</FilterLabel>
        <FilterSelect
          value={selectedCategoryId}
          onChange={(e) => {
            const value = e.target.value;
            setSelectedCategoryId(value);
            setSelectedSubcategoryId("");
            setCurrentPage(1);
            if (value) {
              loadSubCategories(value);
            }
          }}
        >
          <option value="">{t("callChat.allCategories")}</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </FilterSelect>
      </FilterGroup>

      {/* Subcategory Filter - FIXED rendering */}
      {selectedCategoryId && (
        <FilterGroup>
          <FilterLabel>{t("callChat.subcategory", "Subcategory")}</FilterLabel>
          <FilterSelect
            value={selectedSubcategoryId}
            onChange={(e) => {
              setSelectedSubcategoryId(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">{t("callChat.allSubcategories")}</option>
            {subCategories.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </FilterSelect>
        </FilterGroup>
      )}

      {/* Price Filter */}
      <FilterGroup>
        <FilterLabel>Max Price ({tab === "call" ? "₹/min Call" : "₹/min Chat"})</FilterLabel>
        <FilterSelect
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(e.target.value);
            setCurrentPage(1);
          }}
        >
          {getPriceOptions(tab).map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </FilterSelect>
      </FilterGroup>

      {/* Sort By */}
      <FilterGroup>
        <FilterLabel>Sort By</FilterLabel>
        <FilterSelect
          value={`${sortBy}_${sortOrder}`}
          onChange={(e) => {
            const [newSortBy, newOrder] = e.target.value.split("_");
            setSortBy(newSortBy);
            setSortOrder(newOrder);
            setCurrentPage(1);
          }}
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </FilterSelect>
      </FilterGroup>

      <ResetFilterBtn onClick={resetFilters}>
        Reset All Filters
      </ResetFilterBtn>
    </>
  );

  const Spinner = () => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      style={{
        width: 40,
        height: 40,
        border: "3px solid #e2e8f0",
        borderTopColor: "#3b82f6",
        borderRadius: "50%",
        margin: "0 auto",
      }}
    />
  );

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      <PageWrap>
        <HeaderSection>
          <div>
            <Title>{t("callChat.title")}</Title>
            <SubTitle>
              {t("callChat.subtitle")}
            </SubTitle>
            <div className="trust-badges">
              <span><FiUserCheck /> {t("callChat.verifiedExperts")}</span>
              <span><FiDollarSign /> {t("callChat.secureWallet")}</span>
              <span><FiZap /> {t("callChat.instantConnect")}</span>
              <span><FiClock /> {t("callChat.support247")}</span>
            </div>
          </div>
          <div className="mode-indicator">
            {tab === "chat" ? <FiMessageSquare /> : <FiPhoneCall />}
            {tab === "chat" ? "Chat Mode" : "Call Mode"}
          </div>
        </HeaderSection>

        <TabsRow>
          {TABS.map((tabItem) => (
            <TabButton
              key={tabItem.id}
              $active={tab === tabItem.id}
              onClick={() => {
                setTab(tabItem.id);
                setCurrentPage(1);
              }}
            >
              <span>{tabItem.icon}</span> {t(tabItem.labelKey)}
            </TabButton>
          ))}
        </TabsRow>

        {/* Stats Bar */}
        {experts.length > 0 && (
          <StatsBar>
            <StatItem>
              <FiUsers size={16} />
              <span>{totalExperts} {t("callChat.expertsAvailable")}</span>
            </StatItem>
            <StatItem>
              <FiStar size={16} />
              <span>Top Rated Professionals</span>
            </StatItem>
            <StatItem>
              <FiClock size={16} />
              <span>24/7 Availability</span>
            </StatItem>
          </StatsBar>
        )}

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <ActiveFilters>
            {selectedCategoryId && (
              <ActiveFilterChip onClick={() => removeFilter('category')}>
                Category: {categories.find(c => c.id == selectedCategoryId)?.name}
                <FiX size={12} />
              </ActiveFilterChip>
            )}
            {selectedSubcategoryId && (
              <ActiveFilterChip onClick={() => removeFilter('subcategory')}>
                Subcategory: {subCategories.find(s => s.id == selectedSubcategoryId)?.name}
                <FiX size={12} />
              </ActiveFilterChip>
            )}
            {debouncedSearch && (
              <ActiveFilterChip onClick={() => removeFilter('search')}>
                Search: {debouncedSearch}
                <FiX size={12} />
              </ActiveFilterChip>
            )}
            {minRating && (
              <ActiveFilterChip onClick={() => removeFilter('rating')}>
                Rating: {minRating}+ ⭐
                <FiX size={12} />
              </ActiveFilterChip>
            )}
            {maxPrice && (
              <ActiveFilterChip onClick={() => removeFilter('price')}>
                Max Price: ₹{maxPrice}/{tab === "call" ? "min" : "min"}
                <FiX size={12} />
              </ActiveFilterChip>
            )}
            {sortBy && (
              <ActiveFilterChip onClick={() => removeFilter('sort')}>
                Sort: {sortOptions.find(opt => opt.value === `${sortBy}_${sortOrder}`)?.label}
                <FiX size={12} />
              </ActiveFilterChip>
            )}
          </ActiveFilters>
        )}

        <Layout>
          {/* Desktop Filters */}
          <FilterWrap>
            <FilterContent />
          </FilterWrap>

          {/* Mobile Filter Toggle */}
          <MobileFilterToggle onClick={() => setIsMobileFilterOpen(true)}>
            <FiFilter size={18} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="badge">{activeFiltersCount}</span>
            )}
          </MobileFilterToggle>

          {/* Mobile Filter Drawer */}
          <AnimatePresence>
            {isMobileFilterOpen && (
              <>
                <Overlay onClick={() => setIsMobileFilterOpen(false)} />
                <MobileFilterDrawer
                  as={motion.div}
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween', duration: 0.3 }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '16px 20px',
                    borderBottom: '1px solid #e2e8f0'
                  }}>
                    <h3 style={{ margin: 0 }}>Filters</h3>
                    <button 
                      onClick={() => setIsMobileFilterOpen(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: 24,
                        cursor: 'pointer'
                      }}
                    >
                      <FiX size={24} />
                    </button>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <FilterContent />
                  </div>
                </MobileFilterDrawer>
              </>
            )}
          </AnimatePresence>

          <ExpertsWrap>
            {loading && experts.length === 0 ? (
              <LoaderRow>
                <SkeletonGrid>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
                </SkeletonGrid>
              </LoaderRow>
            ) : error ? (
              <EmptyState>
                <FiXCircle size={48} color="#ef4444" />
                <p>{error}</p>
                <button onClick={fetchExperts} style={{
                  marginTop: 16,
                  padding: '10px 20px',
                  borderRadius: 8,
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}>Try Again</button>
              </EmptyState>
            ) : experts.length === 0 ? (
              <EmptyState>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                {t("callChat.noExpertsFound")}
                {(selectedCategoryId || minRating || maxPrice) && (
                  <button onClick={resetFilters} style={{
                    marginTop: 16,
                    padding: '10px 20px',
                    borderRadius: 8,
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer'
                  }}>Clear Filters</button>
                )}
              </EmptyState>
            ) : (
              <>
                <div style={{ marginBottom: 16, fontSize: 14, color: "#64748b" }}>
                  Showing {experts.length} of {totalExperts} experts
                </div>
                
                <Grid>
                  {cardExperts.map((exp, index) => {
                    return (
                      <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(index, 6) * 0.025 }}
                      >
                        <ExpertCard
                          variant="callChat"
                          mode={tab}
                          data={exp}
                          onStartChat={tab === "chat" ? handleStartChat : undefined}
                          onStartCall={tab === "call" ? handleStartCall : undefined}
                        />
                      </motion.div>
                    );
                  })}
                </Grid>

                {/* Pagination */}
                {totalPages > 1 && (
                  <PaginationWrap>
                    <PageButton
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <FiChevronLeft size={16} /> Previous
                    </PageButton>
                    <PageInfo>
                      Page {currentPage} of {totalPages}
                    </PageInfo>
                    <PageButton
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next <FiChevronRight size={16} />
                    </PageButton>
                  </PaginationWrap>
                )}
              </>
            )}
          </ExpertsWrap>
        </Layout>

        {/* Chat Popups from hook */}
        <ChatPopups />
      </PageWrap>
    </>
  );
}