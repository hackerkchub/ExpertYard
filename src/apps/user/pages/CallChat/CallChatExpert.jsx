// src/apps/user/pages/UserExpertsPage.jsx - PREMIUM UPGRADED WITH WORKING FILTERS (TAB FLICKER FIXED)
import React, { useEffect, useMemo, useState, useCallback } from "react";
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
import { socket } from "../../../../shared/api/socket";
import { useCategory } from "../../../../shared/context/CategoryContext";
import { getExpertsApi } from "../../../../shared/api/expertapi/expert.api";
import useNetworkReconnect from "../../../../shared/hooks/useNetworkReconnect";

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

  // FIX 1: Initialize tab from URL directly - prevents initial flicker
  const [tab, setTab] = useState(() => {
    if (modeFromUrl === "chat") return "chat";
    return "call";
  });
  
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

  // Chat states
  const [showWaitingPopup, setShowWaitingPopup] = useState(false);
  const [waitingText, setWaitingText] = useState("Waiting for expert to accept...");
  const [chatRequestId, setChatRequestId] = useState(null);
  const [chatRejectedMessage, setChatRejectedMessage] = useState("");
  const [showChatCancelled, setShowChatCancelled] = useState(false);

  // Online/Offline state
  const [onlineExperts, setOnlineExperts] = useState({});

  // FIX 2: Replace URL sync effect - only sync when URL mode differs from state
  useEffect(() => {
    if (!modeFromUrl) return;

    if (
      (modeFromUrl === "call" || modeFromUrl === "chat") &&
      modeFromUrl !== tab
    ) {
      setTab(modeFromUrl);
      setCurrentPage(1);
    }
  }, [modeFromUrl, tab]);

  // SIMPLIFIED SEARCH DEBOUNCE - NO extra refs
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setCurrentPage(1);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Build API params
  const buildApiParams = useCallback(() => {
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

  // FIX 3: Fetch experts with conditional URL update - prevents unnecessary URL rewrites
 const fetchExperts = useCallback(async () => {
  const params = buildApiParams();

  setLoading(true);
  setError(null);

  try {
    const response = await getExpertsApi(params);

    console.log("EXPERT RESPONSE:", response);

    setExperts(response.data || []);
    setTotalExperts(response.total || 0);
    setTotalPages(response.totalPages || 1);

    const newParams = new URLSearchParams();
    newParams.set("mode", tab);
    newParams.set("page", currentPage);

    if (debouncedSearch) {
      newParams.set("q", debouncedSearch);
    }

    setSearchParams(newParams, { replace: true });

  } catch (error) {
    console.error("Failed to fetch experts:", error);
    setError("Failed to load experts. Please try again.");
    setExperts([]);
    setTotalExperts(0);
    setTotalPages(1);
  } finally {
    setLoading(false);
  }
}, [buildApiParams, currentPage, tab, debouncedSearch, setSearchParams]);
  // SINGLE EFFECT for fetching - NO duplicates
  useEffect(() => {
    fetchExperts();
  }, [fetchExperts]);

  useNetworkReconnect(fetchExperts, {
    enabled: !showWaitingPopup && !chatRequestId,
  });

  // Reset subcategory when category changes AND load subcategories
  useEffect(() => {
    setSelectedSubcategoryId("");
  }, [selectedCategoryId]);

  // Socket events for chat
  useEffect(() => {
    const handleRequestPending = ({ request_id }) => {
      setChatRequestId(request_id);
      setShowWaitingPopup(true);
      setWaitingText("Waiting for expert to accept...");
    };

    const handleChatAccepted = ({ user_id, room_id }) => {
      if (Number(user_id) !== Number(userId)) return;
      setShowWaitingPopup(false);
      setChatRequestId(null);
      navigate(`/user/chat/${room_id}`, { replace: true });
    };

    const handleChatRejected = ({ user_id, message }) => {
      if (Number(user_id) !== Number(userId)) return;
      setShowWaitingPopup(false);
      setChatRequestId(null);
      setChatRejectedMessage(message || "Expert has rejected your chat request.");
    };

    const handleChatCancelled = ({ user_id, message }) => {
      if (Number(user_id) !== Number(userId)) return;
      setShowWaitingPopup(false);
      setChatRequestId(null);
      setShowChatCancelled(true);
    };

    socket.on("request_pending", handleRequestPending);
    socket.on("chat_accepted", handleChatAccepted);
    socket.on("chat_rejected", handleChatRejected);
    socket.on("chat_cancelled", handleChatCancelled);

    return () => {
      socket.off("request_pending", handleRequestPending);
      socket.off("chat_accepted", handleChatAccepted);
      socket.off("chat_rejected", handleChatRejected);
      socket.off("chat_cancelled", handleChatCancelled);
    };
  }, [navigate, userId]);

  // Socket listeners for online/offline status
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

  const handleStartChat = useCallback((expertId) => {
    if (!isLoggedIn) {
      navigate("/user/auth");
      return;
    }

    const expert = experts.find(e => e.id === expertId);
    const chatPrice = expert?.chat_per_minute || 0;
    const minRequired = chatPrice * 5;
    const userBalance = Number(balance || 0);

    if (userBalance >= minRequired) {
      socket.emit("request_chat", { 
        user_id: userId, 
        expert_id: Number(expertId) 
      });
    } else {
      const needed = Math.max(0, minRequired - userBalance);
      alert(`Low balance! Need ₹${needed.toFixed(0)} more. Minimum ₹${minRequired} required for 5 minutes.`);
      navigate("/user/wallet");
    }
  }, [isLoggedIn, userId, balance, experts, navigate]);

  const handleStartCall = useCallback((expertId) => {
    if (!isLoggedIn) {
      navigate("/user/auth");
      return;
    }
    navigate(`/user/voice-call/${expertId}`);
  }, [isLoggedIn, navigate]);

  const handleCancelRequest = useCallback(() => {
    if (chatRequestId && userId) {
      socket.emit("cancel_chat_request", { 
        request_id: chatRequestId, 
        user_id: userId 
      });
    }
    setShowWaitingPopup(false);
    setChatRequestId(null);
  }, [chatRequestId, userId]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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

      {/* Search Bar */}
      <FilterGroup>
        <FilterLabel>{t("callChat.searchByName")}</FilterLabel>
        <div style={{ position: 'relative' }}>
          <SearchInput
            type="text"
            placeholder={t("callChat.searchPlaceholder")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <SearchIcon>
            <FiSearch size={16} />
          </SearchIcon>
          {searchInput && (
            <ClearSearchBtn onClick={() => setSearchInput("")}>
              <FiX size={14} />
            </ClearSearchBtn>
          )}
        </div>
      </FilterGroup>

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

      {/* Rating Filter */}
      {/* <FilterGroup>
        <FilterLabel>Rating</FilterLabel>
        <FilterSelect
          value={minRating}
          onChange={(e) => {
            setMinRating(e.target.value);
            setCurrentPage(1);
          }}
        >
          {ratingOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </FilterSelect>
      </FilterGroup> */}

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
                // Update URL immediately on tab click
                setSearchParams({ 
                  mode: tabItem.id, 
                  ...(debouncedSearch && { q: debouncedSearch }),
                  page: "1"
                });
              }}
            >
              <span>{tabItem.icon}</span> {t(tabItem.labelKey)}
            </TabButton>
          ))}
        </TabsRow>

        {/* Stats Bar */}
        {!loading && experts.length > 0 && (
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
            {loading ? (
              <LoaderRow>
                <Spinner />
                <div style={{ marginTop: 16, color: '#64748b' }}>Loading experts...</div>
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
                  {experts.map((exp, index) => {
                    const isOnline = onlineExperts[String(exp.id)];
                    
                    return (
                      <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ExpertCard
                          mode={tab}
                          data={{
                            id: exp.id,
                            slug: exp.slug || exp.id,
                            name: exp.name,
                            profile_photo: exp.profile_photo,
                            position: exp.category_name,
                            speciality: exp.subcategory_name,
                            location: exp.location,
                            isOnline: isOnline,
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
                          }}
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

        {/* Waiting Popup */}
        <AnimatePresence>
          {showWaitingPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ 
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", 
                display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                style={{ 
                  background: "#fff", padding: 32, borderRadius: 24, 
                  width: "min(90vw, 420px)", textAlign: "center", 
                  boxShadow: "0 25px 60px rgba(0,0,0,0.2)" 
                }}
              >
                <div style={{ 
                  width: 60, height: 60, borderRadius: 60, 
                  background: "#eff6ff", display: "flex", 
                  alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px"
                }}>
                  <FiUserCheck size={28} color="#3b82f6" />
                </div>
                <h3 style={{ margin: 0, color: "#0f172a" }}>Request Sent</h3>
                <p style={{ marginTop: 12, color: "#475569" }}>{waitingText}</p>
                <div style={{ marginTop: 20 }}><Spinner /></div>
                <button
                  onClick={handleCancelRequest}
                  style={{
                    marginTop: 24, padding: "12px 24px", borderRadius: 40,
                    border: "1px solid #e2e8f0", background: "#f8fafc",
                    color: "#ef4444", fontWeight: 600, cursor: "pointer",
                  }}
                >
                  Cancel Request
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Rejected Popup */}
        <AnimatePresence>
          {chatRejectedMessage && !showWaitingPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ 
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", 
                display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 
              }}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                style={{ 
                  background: "#fff", padding: 28, borderRadius: 24, 
                  width: "min(90vw, 400px)", textAlign: "center" 
                }}
              >
                <div style={{ 
                  width: 56, height: 56, borderRadius: 56, 
                  background: "#fef2f2", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px"
                }}>
                  <FiX size={28} color="#ef4444" />
                </div>
                <h3 style={{ margin: 0, marginBottom: 8, color: "#dc2626" }}>Request Declined</h3>
                <p style={{ margin: 0, marginBottom: 24, color: "#475569" }}>{chatRejectedMessage}</p>
                <button onClick={() => setChatRejectedMessage("")} style={{
                  padding: "12px 28px", borderRadius: 40, background: "#3b82f6",
                  color: "white", border: "none", fontWeight: 600, cursor: "pointer",
                }}>Got it</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Cancelled Popup */}
        <AnimatePresence>
          {showChatCancelled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ 
                position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", 
                display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 
              }}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                style={{ 
                  background: "#fff", padding: 28, borderRadius: 24, 
                  width: "min(90vw, 400px)", textAlign: "center" 
                }}
              >
                <div style={{ 
                  width: 56, height: 56, borderRadius: 56, 
                  background: "#f1f5f9", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px"
                }}>
                  <FiX size={28} color="#64748b" />
                </div>
                <h3 style={{ margin: 0, marginBottom: 8, color: "#475569" }}>Request Cancelled</h3>
                <p style={{ margin: 0, marginBottom: 24 }}>Your chat request has been cancelled.</p>
                <button onClick={() => setShowChatCancelled(false)} style={{
                  padding: "12px 28px", borderRadius: 40, background: "#3b82f6",
                  color: "white", border: "none", fontWeight: 600, cursor: "pointer",
                }}>OK</button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </PageWrap>
    </>
  );
}