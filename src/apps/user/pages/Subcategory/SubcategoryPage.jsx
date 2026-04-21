import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiFilter, FiSearch, FiCheck, FiX, FiChevronRight, FiZap } from "react-icons/fi";
import { 
  IoStar, 
  IoPeople, 
  IoChatbubble, 
  IoCall, 
  IoTime,
  IoCalendar,
  IoTrendingUp,
  IoShieldCheckmark,
  IoBookOutline,
  IoPricetagOutline
} from "react-icons/io5";
import { useCategory } from "../../../../shared/context/CategoryContext";
import { getExpertsBySubCategoryApi } from "../../../../shared/api/expertapi/auth.api";
import { getExpertPriceByIdApi } from "../../../../shared/api/expertapi/price.api";
import { getExpertFollowersApi } from "../../../../shared/api/expertapi/follower.api";
import { getReviewsByExpertApi } from "../../../../shared/api/expertapi/reviews.api";
import { getPlansApi } from "../../../../shared/api/userApi/subscription.api";
import ExpertCard from "../../components/userExperts/ExpertCard";
import useChatRequest from "../../../../shared/hooks/useChatRequest";
import { socket } from "../../../../shared/api/socket";
import { useSeo } from "../../../../shared/seo/useSeo";
import { toAbsoluteUrl } from "../../../../shared/seo/siteConfig";
import {
  buildCategorySeoDescription,
  buildCategorySeoHeadline,
  buildCategorySeoTitle,
  findCategoryById,
  findCategoryBySlug,
  getCategoryPath,
} from "../../../../shared/utils/categoryRoutes";
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
  StartSessionButton,
  ViewPlansButton,
  PricingModesBadge,
  PricingModeBadge,
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
  CategoryErrorText,
  PricingInfo,
} from "./SubcategoryPage.styles";
import "./SubcategorySeo.css";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face";

const horoscopeSigns = [
  { sign: "Aries", date: "Mar 21 - Apr 19" },
  { sign: "Taurus", date: "Apr 20 - May 20" },
  { sign: "Gemini", date: "May 21 - Jun 20" },
  { sign: "Cancer", date: "Jun 21 - Jul 22" },
  { sign: "Leo", date: "Jul 23 - Aug 22" },
  { sign: "Virgo", date: "Aug 23 - Sep 22" },
];

const SubcategoryPage = () => {
  const { categoryId, slug } = useParams();
  const navigate = useNavigate();
  const latestRequestRef = useRef(0);
  const socketEmitTimeoutRef = useRef(null);

  const {
    categories,
    subCategories,
    subCategoriesLoading,
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
  const [expertPlans, setExpertPlans] = useState({});

  const [onlineExperts, setOnlineExperts] = useState({});

  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [hoveredExpert, setHoveredExpert] = useState(null);
  const loading = categoryLoading || subCategoriesLoading || expertsLoading;
  const matchedCategory = useMemo(() => {
    if (slug) return findCategoryBySlug(categories, slug);
    if (categoryId) return findCategoryById(categories, categoryId);
    return null;
  }, [categories, categoryId, slug]);
  const resolvedCategoryId = matchedCategory?.id ? String(matchedCategory.id) : null;
  const resolvedCategorySlug = matchedCategory?.slug || slug || "";
  const canonicalCategoryPath = resolvedCategorySlug
    ? `/user/categories/${resolvedCategorySlug}`
    : "/user/categories";
  const isLegacyIdRoute = Boolean(categoryId && !slug);
  const relatedCategories = useMemo(
    () =>
      categories
        .filter((category) => category.id !== matchedCategory?.id)
        .slice(0, 6),
    [categories, matchedCategory?.id]
  );

  const faqItems = useMemo(() => {
    const label = (matchedCategory?.name || categoryName || "expert").toLowerCase();

    return [
      {
        question: `How quickly can I connect with a verified ${label} expert?`,
        answer: `Most users can browse available ${label} experts and start a chat or call within minutes, depending on expert availability.`,
      },
      {
        question: `Are the ${label} experts verified on ExpertYard?`,
        answer: `Yes. ExpertYard is built around verified experts so users can discover trusted professionals before starting a consultation.`,
      },
      {
        question: `Can I compare different ${label} experts before connecting?`,
        answer: `Yes. You can review subcategories, pricing signals, ratings, and profiles to choose the right expert for your needs.`,
      },
    ];
  }, [categoryName, matchedCategory?.name]);

  const selectedSubcategoryName = useMemo(
    () =>
      subCategories.find((s) => String(s.id) === String(selectedSubcategory))?.name,
    [subCategories, selectedSubcategory]
  );

  const resetStateForNewCategory = useCallback(() => {
    setActiveSubCategory(null);
    setExperts([]);
    setExpertDetails({});
    setExpertPlans({});
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
    
    if (resolvedCategoryId) {
      loadSubCategories(resolvedCategoryId);
      setPrevCategoryId(resolvedCategoryId);
    }
  }, [loadSubCategories, prevCategoryId, resolvedCategoryId]);

  // ✅ FIX 1: Socket duplicate listener fix - Single useEffect with proper cleanup
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      console.log("✅ Socket connected:", socket.id);
    };

   const handleMultipleStatus = (data) => {
  setOnlineExperts(prev => {
    const updated = { ...prev };

    Object.keys(data).forEach(id => {
     updated[String(id)] = data[id]; // ✅ correct
    });

    return updated;
  });
};

    const handleOnline = ({ expert_id }) => {
      console.log(`🔵 Expert ${expert_id} is online`);
  setOnlineExperts(prev => ({
    ...prev,
    [String(expert_id)]: true
  }));
};

   const handleOffline = ({ expert_id }) => {
      console.log(`⚪ Expert ${expert_id} is offline`);
  setOnlineExperts(prev => ({
    ...prev,
    [String(expert_id)]: false
  }));
};
    socket.on("connect", handleConnect);
    socket.on("multiple_expert_status", handleMultipleStatus);
    socket.on("expert_online", handleOnline);
    socket.on("expert_offline", handleOffline);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("multiple_expert_status", handleMultipleStatus);
      socket.off("expert_online", handleOnline);
      socket.off("expert_offline", handleOffline);
    };
  }, []); // Empty dependency array - only runs once

  useEffect(() => {
  if (!socket || !experts.length) return;

  const send = () => {
    const expertIds = experts.map(e => Number(e.expert_id || e.id));
    socket.emit("check_multiple_experts", { expertIds });
  };

  // ✅ Initial fetch
  if (socket.connected) send();

  // ✅ Re-fetch on reconnect
  socket.on("connect", send);

  // ✅ 🔥 CRITICAL: periodic sync (backup)
  const interval = setInterval(() => {
    if (socket.connected) send();
  }, 5000); // every 5 sec

  return () => {
    socket.off("connect", send);
    clearInterval(interval);
  };

}, [experts]);

  const loadExpertsForSubcategory = useCallback(async (subCategoryId) => {
    if (!subCategoryId || !resolvedCategoryId) return;

    const requestId = ++latestRequestRef.current;

    try {
      setExpertsLoading(true);

      const res = await getExpertsBySubCategoryApi(subCategoryId);

      if (requestId !== latestRequestRef.current) return;

      const expertsList = res?.data?.experts || [];

      const expertsWithCategory = expertsList.map(exp => ({
        ...exp,
        category_id: resolvedCategoryId,
        subcategory_id: subCategoryId
      }));

      setExperts(expertsWithCategory);

      const newExpertDetails = {};
      const newExpertPlans = {};
      
      // ⚠️ TODO: Replace with single API call for better performance
      // For now, keeping existing logic but with Promise.allSettled for resilience
      const expertPromises = expertsList.map(async (expert) => {
        const expertId = expert.expert_id || expert.id;
        if (!expertId) return null;
        
        try {
          const [priceRes, followersRes, reviewsRes, plansRes] = await Promise.allSettled([
            getExpertPriceByIdApi(expertId),
            getExpertFollowersApi(expertId),
            getReviewsByExpertApi(expertId),
            getPlansApi(expertId)
          ]);
          
          const priceData = priceRes.status === "fulfilled" ? priceRes.value?.data || priceRes.value || {} : {};
          const followersData = followersRes.status === "fulfilled" ? followersRes.value?.data || {} : {};
          const reviewsData = reviewsRes.status === "fulfilled"
            ? reviewsRes.value?.data?.data || {}
            : {};
          const plansData = plansRes.status === "fulfilled" && plansRes.value?.data?.success ? plansRes.value.data.data || [] : [];
          
          let pricingModes = priceData.pricing_modes || [];
          if (typeof pricingModes === 'string') {
            try {
              pricingModes = JSON.parse(pricingModes);
            } catch {
              pricingModes = [];
            }
          }
          
          const hasPerMinute = pricingModes.includes('per_minute');
          const hasSession = pricingModes.includes('session');
          const hasPlans = plansData.length > 0;
          
          const callPrice = priceData.call?.per_minute || priceData.call_per_minute || 0;
          const chatPrice = priceData.chat?.per_minute || priceData.chat_per_minute || 0;
          const sessionPrice = priceData.session?.price || priceData.session_price || 0;
          const sessionDuration = priceData.session?.duration || priceData.session_duration || 0;
          
          return {
            expertId,
            details: {
              hasPricing: hasPerMinute || hasSession || hasPlans,
              hasPerMinute,
              hasSession,
              hasPlans,
              callPrice: Number(callPrice),
              chatPrice: Number(chatPrice),
              sessionPrice: Number(sessionPrice),
              sessionDuration: Number(sessionDuration),
              followersCount: followersData.total_followers || followersData.followers?.length || 0,
              avgRating: Number(reviewsData.avg_rating || 0),
              totalReviews: reviewsData.total_reviews || (reviewsData.reviews || []).length || 0,
              pricingModes,
              plansCount: plansData.length,
            }
          };
        } catch (err) {
          console.error(`Failed to load details for expert ${expertId}:`, err);
          return {
            expertId,
            details: {
              hasPricing: false,
              hasPerMinute: false,
              hasSession: false,
              hasPlans: false,
              callPrice: 0,
              chatPrice: 0,
              sessionPrice: 0,
              sessionDuration: 0,
              followersCount: 0,
              avgRating: 0,
              totalReviews: 0,
              pricingModes: [],
              plansCount: 0,
            }
          };
        }
      });
      
      const expertDetailsResults = await Promise.all(expertPromises);
      
      expertDetailsResults.forEach(result => {
        if (result) {
          newExpertDetails[result.expertId] = result.details;
          if (result.details.hasPlans) {
            newExpertPlans[result.expertId] = true;
          }
        }
      });

      if (requestId !== latestRequestRef.current) return;

      setExpertDetails(prev => ({ ...prev, ...newExpertDetails }));
      setExpertPlans(prev => ({ ...prev, ...newExpertPlans }));
      
    } catch (err) {
      console.error("Experts load failed", err);
      if (requestId === latestRequestRef.current) {
        setExperts([]);
        setExpertDetails({});
        setExpertPlans({});
      }
    } finally {
      if (requestId === latestRequestRef.current) {
        setExpertsLoading(false);
      }
    }
  }, [resolvedCategoryId]);

  useEffect(() => {
    if (resolvedCategoryId && resolvedCategoryId !== prevCategoryId) {
      resetStateForNewCategory();
    }
  }, [prevCategoryId, resetStateForNewCategory, resolvedCategoryId]);

  useEffect(() => {
    if (!resolvedCategoryId || subCategories.length === 0) return;

    const savedId = localStorage.getItem(`selectedSubcategory_${resolvedCategoryId}`);
    const firstId = subCategories[0]?.id ? String(subCategories[0].id) : null;
    const hasSavedId = savedId
      ? subCategories.some((subCategory) => String(subCategory.id) === String(savedId))
      : false;
    const defaultId = hasSavedId ? String(savedId) : firstId;

    if (defaultId) {
      setSelectedSubcategory(defaultId);
      setActiveSubCategory(defaultId);
    }
  }, [resolvedCategoryId, subCategories]);

  useEffect(() => {
    const hasValidSelectedSubcategory = subCategories.some(
      (subCategory) => String(subCategory.id) === String(selectedSubcategory)
    );

    if (selectedSubcategory && resolvedCategoryId && hasValidSelectedSubcategory) {
      loadExpertsForSubcategory(selectedSubcategory);
    }
  }, [loadExpertsForSubcategory, resolvedCategoryId, selectedSubcategory, subCategories]);

  useEffect(() => {
    if (slug || !categoryId || categoryLoading || categories.length === 0) return;

    const legacyCategory = findCategoryById(categories, categoryId);
    if (legacyCategory) {
      navigate(getCategoryPath(legacyCategory), { replace: true });
    }
  }, [categories, categoryId, categoryLoading, navigate, slug]);

  useEffect(() => {
    if (!slug || categoryLoading || categories.length === 0 || matchedCategory) return;
    navigate("/user/categories", { replace: true });
  }, [categories.length, categoryLoading, matchedCategory, navigate, slug]);

  useEffect(() => {
    if (matchedCategory?.name) {
      setCategoryName(matchedCategory.name);
      return;
    }

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
  }, [matchedCategory?.name, subCategories]);

  const handleSubCategoryClick = (subCategoryId) => {
    const normalizedSubCategoryId = String(subCategoryId);
    if (normalizedSubCategoryId === String(selectedSubcategory)) return;
    setSelectedSubcategory(normalizedSubCategoryId);
    setActiveSubCategory(normalizedSubCategoryId);
  };

  const handleSubcategoryFilterChange = (subCategoryId) => {
    const normalizedSubCategoryId = String(subCategoryId);
    setSelectedSubcategory(normalizedSubCategoryId);
    setActiveSubCategory(normalizedSubCategoryId);
    setShowMobileFilters(false);
  };

  const resetFilters = () => {
    setSortBy("price-high");
    setSearchQuery("");
    if (subCategories.length > 0) {
      const firstId = String(subCategories[0].id);
      setSelectedSubcategory(firstId);
      setActiveSubCategory(firstId);
    }
  };

  const getSubcategoryName = (subId) => {
    const sc = subCategories.find((s) => String(s.id) === String(subId));
    return sc ? sc.name : "";
  };

  const currentSubcategoryExperts = useMemo(() => {
    if (!selectedSubcategory) return [];
    
    return experts.filter(expert => 
      String(expert.subcategory_id) === String(selectedSubcategory) && 
      (!expert.category_id || String(expert.category_id) === String(resolvedCategoryId))
    );
  }, [experts, resolvedCategoryId, selectedSubcategory]);

  const seoTitle = matchedCategory?.meta_title?.trim() || buildCategorySeoTitle(matchedCategory?.name || categoryName || "Expert");
  const seoDescription = buildCategorySeoDescription(matchedCategory || { name: categoryName || "Expert" });
  const categoryStructuredData = useMemo(
    () =>
      matchedCategory
        ? [
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
                {
                  "@type": "ListItem",
                  position: 3,
                  name: matchedCategory.name,
                  item: toAbsoluteUrl(canonicalCategoryPath),
                },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqItems.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: item.answer,
                },
              })),
            },
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: `${matchedCategory.name} Experts`,
              url: toAbsoluteUrl(canonicalCategoryPath),
              description: seoDescription,
            },
          ]
        : [],
    [canonicalCategoryPath, faqItems, matchedCategory, seoDescription]
  );

  useSeo({
    title: seoTitle,
    description: seoDescription,
    canonicalPath: canonicalCategoryPath,
    robots: isLegacyIdRoute ? "noindex,follow" : "index,follow",
    og: {
      title: seoTitle,
      description: seoDescription,
      type: "website",
      image: matchedCategory?.image_url || undefined,
    },
    structuredData: categoryStructuredData,
  });

 const formatExpertForCard = (expert) => {
  const expertId = expert.expert_id || expert.id;
  const details = expertDetails[expertId] || {};

  const id = String(expertId); // ✅ FIX

  return {
    id,
    name: expert.name || expert.expert_name || "Expert",
    profile_photo: expert.profile_photo || DEFAULT_AVATAR,
    position: expert.position || "Expert",
    speciality:
      getSubcategoryName(expert.subcategory_id) ||
      expert.main_expertise ||
      categoryName,
    location: expert.location || "India",

    // ✅ ONLINE STATUS FIX
    isOnline: id in onlineExperts ? onlineExperts[id] : null,

    ...details,
    rawData: expert,
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
  }, [currentSubcategoryExperts, searchQuery, sortBy, expertsLoading, onlineExperts]);

  const formatRatingValue = useCallback((value) => {
    const numericValue = Number(value);
    return Number.isFinite(numericValue) ? numericValue.toFixed(1) : "0.0";
  }, []);

  const handleExpertAction = (expert, action) => {
    if (action === 'chat' && expert.hasPerMinute) {
      startChat({
        expertId: expert.id,
        chatPrice: expert.chatPrice,
        expertName: expert.name,
      });
    } else if (action === 'session') {
      navigate(`/user/experts/${expert.id}`, { 
        state: { scrollToBooking: true, bookingType: "session" }
      });
    } else if (action === 'plans') {
      navigate(`/user/experts/${expert.id}`, { 
        state: { scrollToPlans: true }
      });
    } else {
      navigate(`/user/experts/${expert.id}`);
    }
  };

  const getPrimaryActionButton = (expert) => {
    if (expert.hasPerMinute) {
      return (
        <StartChatButton onClick={() => handleExpertAction(expert, 'chat')}>
          <IoChatbubble size={16} />
          Chat ₹{expert.chatPrice}/min
        </StartChatButton>
      );
    } else if (expert.hasSession) {
      return (
        <StartSessionButton onClick={() => handleExpertAction(expert, 'session')}>
          <IoBookOutline size={16} />
          Book Session (₹{expert.sessionPrice})
        </StartSessionButton>
      );
    } else if (expert.hasPlans) {
      return (
        <ViewPlansButton onClick={() => handleExpertAction(expert, 'plans')}>
          <FiZap size={16} />
          View Plans
        </ViewPlansButton>
      );
    } else {
      return (
        <ViewProfileButton onClick={() => handleExpertAction(expert, 'profile')}>
          View Profile
        </ViewProfileButton>
      );
    }
  };

  // ✅ FIX 4: Updated UI with better glow effect
  const renderExpertCard = (expert) => (
    <ExpertCardPremium
      key={expert.id}
      onMouseEnter={() => setHoveredExpert(expert.id)}
      onMouseLeave={() => setHoveredExpert(null)}
      $isHovered={hoveredExpert === expert.id}
    >
      <ExpertHeader style={{ position: "relative" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <ExpertAvatar src={expert.profile_photo} alt={expert.name} />
          <div
            style={{
              position: "absolute",
              bottom: 2,
              right: 2,
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: expert.isOnline === true 
  ? "#22c55e" 
  : expert.isOnline === false 
    ? "#ef4444"
    : "#ef4444" ,// loading state
              border: "2px solid white",
              // ✅ FIX 5: Enhanced glow effect
              boxShadow: expert.isOnline 
                ? "0 0 10px rgba(34, 197, 94, 0.9)" 
                : "none",
              zIndex: 1,
            }}
          />
        </div>
        
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

      <PricingModesBadge>
        {expert.hasPerMinute && (
          <PricingModeBadge type="per_minute">💰 Per Minute</PricingModeBadge>
        )}
        {expert.hasSession && (
          <PricingModeBadge type="session">📋 Session Based</PricingModeBadge>
        )}
        {expert.hasPlans && !expert.hasPerMinute && !expert.hasSession && (
          <PricingModeBadge type="plans">📦 Subscription Plans</PricingModeBadge>
        )}
      </PricingModesBadge>

      <ExpertStats>
        <StatItem>
          <StatIcon><IoStar size={16} /></StatIcon>
          <StatValue>{formatRatingValue(expert.avgRating)}</StatValue>
          <StatLabel>({expert.totalReviews} reviews)</StatLabel>
        </StatItem>
        <StatItem>
          <StatIcon><IoPeople size={16} /></StatIcon>
          <StatValue>{expert.followersCount}</StatValue>
          <StatLabel>Followers</StatLabel>
        </StatItem>
      </ExpertStats>

      <ExpertPricing>
        {expert.hasPerMinute && (
          <>
            <PriceTag>
              <PriceIcon><IoChatbubble size={16} /></PriceIcon>
              <PriceAmount>₹{expert.chatPrice}</PriceAmount>
              <PriceUnit>/min chat</PriceUnit>
            </PriceTag>
            <PriceTag>
              <PriceIcon><IoCall size={16} /></PriceIcon>
              <PriceAmount>₹{expert.callPrice}</PriceAmount>
              <PriceUnit>/min call</PriceUnit>
            </PriceTag>
          </>
        )}
        {expert.hasSession && !expert.hasPerMinute && (
          <PriceTag>
            <PriceIcon><IoBookOutline size={16} /></PriceIcon>
            <PriceAmount>₹{expert.sessionPrice}</PriceAmount>
            <PriceUnit>/{expert.sessionDuration} min session</PriceUnit>
          </PriceTag>
        )}
        {expert.hasPlans && !expert.hasPerMinute && !expert.hasSession && (
          <PriceTag>
            <PriceIcon><FiZap size={16} /></PriceIcon>
            <PriceAmount>Plans Available</PriceAmount>
            <PriceUnit>{expert.plansCount} options</PriceUnit>
          </PriceTag>
        )}
        {!expert.hasPricing && (
          <PriceTag>
            <PriceIcon><IoPricetagOutline size={16} /></PriceIcon>
            <PriceAmount>Contact</PriceAmount>
            <PriceUnit>for pricing</PriceUnit>
          </PriceTag>
        )}
      </ExpertPricing>

      <ActionButtons>
        <ViewProfileButton onClick={() => navigate(`/user/experts/${expert.id}`)}>
          View Profile
        </ViewProfileButton>
        {getPrimaryActionButton(expert)}
      </ActionButtons>

      {expert.hasPlans && expert.hasPerMinute && (
        <PricingInfo>
          <IoShieldCheckmark size={12} />
          <span>Subscription plans available for savings</span>
        </PricingInfo>
      )}
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

  if (categoryLoading && !categoryName) {
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
          <BreadcrumbItem $active>{categoryName}</BreadcrumbItem>
        </Breadcrumb>

        <PageHeader>
          <HeaderContent>
            <HeaderTitle>{categoryName} Experts</HeaderTitle>
            <HeaderSubtitle>
              {buildCategorySeoHeadline(categoryName || matchedCategory?.name || "expert")} for personalized insights and guidance.
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
          $show={showMobileFilters} 
          onClick={() => setShowMobileFilters(false)}
        />

        <PageLayout>
          <FiltersSidebar $show={showMobileFilters}>
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
                  const isSelected = String(sc.id) === String(selectedSubcategory);
                  
                  return (
                    <SubcategoryFilterItem
                      key={sc.id}
                      onClick={() => handleSubcategoryFilterChange(sc.id)}
                      $isSelected={isSelected}
                    >
                      <SubcategoryRadio $isSelected={isSelected} />
    <SubcategoryFilterLabel $isSelected={isSelected}>
                        {sc.name}
                      </SubcategoryFilterLabel>
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
            <section className="category-seo-intro" aria-labelledby="category-seo-heading">
              <div className="category-seo-intro__copy">
                <span className="category-seo-intro__eyebrow">Verified category experts</span>
                <h2 id="category-seo-heading">{matchedCategory?.name || categoryName} consultations online</h2>
                <p>{seoDescription}</p>
              </div>

              {relatedCategories.length > 0 ? (
                <div className="category-seo-intro__links" aria-label="Related expert categories">
                  {relatedCategories.map((category) => (
                    <Link
                      key={category.id}
                      to={getCategoryPath(category)}
                      className="category-seo-chip"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              ) : null}
            </section>

            <FilterChipsContainer>
              {subCategories.map((sc) => {
                const isActive = String(sc.id) === String(selectedSubcategory);
                
                return (
                  <FilterChip
                    key={sc.id}
                    $isActive={isActive}
                    onClick={() => handleSubCategoryClick(sc.id)}
                  >
                    {sc.name}
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

                <section className="category-seo-bottom">
                  <div className="category-seo-card">
                    <h2>Why users choose ExpertYard for {matchedCategory?.name || categoryName}</h2>
                    <p>
                      Users landing from search can immediately browse relevant subcategories,
                      compare verified experts, and start a conversation without an extra discovery
                      step. That keeps the experience lightweight while still exposing indexable,
                      category-specific content.
                    </p>
                  </div>

                  <div className="category-seo-card">
                    <h2>Frequently asked questions</h2>
                    <div className="category-seo-faq">
                      {faqItems.map((item) => (
                        <details key={item.question} className="category-seo-faq__item">
                          <summary>{item.question}</summary>
                          <p>{item.answer}</p>
                        </details>
                      ))}
                    </div>
                  </div>

                  {relatedCategories.length > 0 ? (
                    <div className="category-seo-card">
                      <h2>Related expert categories</h2>
                      <div className="category-seo-links">
                        {relatedCategories.map((category) => (
                          <Link
                            key={`related-${category.id}`}
                            to={getCategoryPath(category)}
                            className="category-seo-link"
                          >
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </section>
              </>
            ) : !loading ? (
              <NoResults>
                <NoResultsTitle>No Experts Found</NoResultsTitle>
                <NoResultsText>
                  We couldn't find any experts in {selectedSubcategoryName?.toLowerCase() || categoryName?.toLowerCase()}. 
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
