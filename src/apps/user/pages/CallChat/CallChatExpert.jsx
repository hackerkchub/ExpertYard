// src/apps/user/pages/UserExpertsPage.jsx - PREMIUM UPGRADED WITH WORKING FILTERS (TAB FLICKER FIXED)
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useSearchParams, useNavigate, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { 
  FiX, FiChevronLeft, FiChevronRight, FiSearch, FiFilter, 
  FiSliders, FiXCircle, FiTrendingUp, FiClock,
  FiStar, FiUserCheck, FiZap,
  FiMessageSquare, FiPhoneCall, FiGlobe, FiMapPin
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
import MobileSelect from "../../components/MobileSelect/MobileSelect";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useWallet } from "../../../../shared/context/WalletContext";
import { socket } from "../../../../shared/api/socket"; // Only for online/offline status
import { useCategory } from "../../../../shared/context/CategoryContext";
import { getExpertsApi } from "../../../../shared/api/expertapi/expert.api";
import useNetworkReconnect from "../../../../shared/hooks/useNetworkReconnect";
import useChatRequest from "../../../../shared/hooks/useChatRequest"; // NEW IMPORT
import { normalizeExpertAccess } from "../../../../shared/utils/expertAccess";
import { buildTrackingPayload, trackLeadEvent } from "../../../../shared/utils/leadTracking";
import {
  findCategoryById,
  findCategoryBySlug,
  toSlug,
} from "../../../../shared/utils/categoryRoutes";

const TABS = [
  { id: "call", labelKey: "callChat.callTab", icon: "📞" },
  { id: "chat", labelKey: "callChat.chatTab", icon: "💬" },
];

const isEnabledFlag = (value) =>
  value === true ||
  value === 1 ||
  value === "1" ||
  String(value || "").toLowerCase() === "true";

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
const minPriceOptions = [
  { value: "", label: "No minimum" },
  { value: "10", label: "From Rs 10" },
  { value: "30", label: "From Rs 30" },
  { value: "50", label: "From Rs 50" },
  { value: "100", label: "From Rs 100" },
];
const experienceOptions = [
  { value: "", label: "Any experience" },
  { value: "1", label: "1+ years" },
  { value: "3", label: "3+ years" },
  { value: "5", label: "5+ years" },
  { value: "10", label: "10+ years" },
];
const statusOptions = [
  { value: "", label: "Any status" },
  { value: "online", label: "Online now" },
  { value: "available", label: "Available" },
];

const getParam = (params, ...keys) => {
  for (const key of keys) {
    const value = params.get(key);
    if (value != null && value !== "") return value;
  }
  return "";
};

const splitSortValue = (value) => {
  if (!value) return ["", "desc"];
  const index = value.lastIndexOf("_");
  if (index <= 0) return [value, "desc"];
  return [value.slice(0, index), value.slice(index + 1) || "desc"];
};

const normalizeTextList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === "string") {
    return value
      .split(/[,|]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

export default function UserExpertsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { categorySlug, categoryId: routeCategoryParam, subcategoryId: routeSubcategoryParam, subcategorySlug } = useParams();
  const { t } = useTranslation();
  const modeFromUrl = searchParams.get("mode");
  const searchQueryFromUrl = searchParams.get("q");
  const pageFromUrl = parseInt(searchParams.get("page")) || 1;
  const minRatingFromUrl = getParam(searchParams, "rating", "minRating");
  const minPriceFromUrl = getParam(searchParams, "minPrice");
  const maxPriceFromUrl = getParam(searchParams, "maxPrice");
  const minExperienceFromUrl = getParam(searchParams, "experience", "minExperience");
  const languageFromUrl = getParam(searchParams, "language");
  const statusFromUrl = getParam(searchParams, "status");
  const genderFromUrl = getParam(searchParams, "gender");
  const sortByFromUrl = getParam(searchParams, "sortBy");
  const sortOrderFromUrl = getParam(searchParams, "order") || "desc";

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
  const routeCategoryKey = routeCategoryParam || categorySlug;
  const routeCategory = useMemo(() => {
    if (!routeCategoryKey) return null;
    return findCategoryById(categories, routeCategoryKey) || findCategoryBySlug(categories, routeCategoryKey);
  }, [categories, routeCategoryKey]);
  const routeCategoryId = routeCategory?.id
    ? String(routeCategory.id)
    : routeCategoryParam
      ? String(routeCategoryParam)
      : "";
  const matchedSubcategory = useMemo(() => {
    if (!subcategorySlug && !routeSubcategoryParam) return null;
    const key = subcategorySlug || routeSubcategoryParam;
    return subCategories.find(
      s => String(s.id) === String(key) || s.slug === key || (s.name && toSlug(s.name) === key)
    );
  }, [subCategories, subcategorySlug, routeSubcategoryParam]);

  const routeSubcategoryId = matchedSubcategory?.id 
    ? String(matchedSubcategory.id) 
    : routeSubcategoryParam 
      ? String(routeSubcategoryParam) 
      : "";
  const isCategoryRoute = Boolean(routeCategoryKey);
  const isSubcategoryExpertRoute = Boolean(routeCategoryId && routeSubcategoryId);
  const { isLoggedIn, user } = useAuth();
  const userId = user?.id;
  const { balance } = useWallet();

  // Filter states
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [searchInput, setSearchInput] = useState(searchQueryFromUrl || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQueryFromUrl || "");
  const [minRating, setMinRating] = useState(minRatingFromUrl);
  const [minPrice, setMinPrice] = useState(minPriceFromUrl);
  const [maxPrice, setMaxPrice] = useState(maxPriceFromUrl);
  const [minExperience, setMinExperience] = useState(minExperienceFromUrl);
  const [language, setLanguage] = useState(languageFromUrl);
  const [statusFilter, setStatusFilter] = useState(statusFromUrl);
  const [gender, setGender] = useState(genderFromUrl);
  const [sortBy, setSortBy] = useState(sortByFromUrl);
  const [sortOrder, setSortOrder] = useState(sortOrderFromUrl);

  const [selectedLoc, setSelectedLoc] = useState(() => {
    try {
      const saved = localStorage.getItem("last_selected_location");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleLocChange = (e) => {
      setSelectedLoc(e.detail);
      setCurrentPage(1);
    };

    window.addEventListener("g9-location-changed", handleLocChange);
    return () => window.removeEventListener("g9-location-changed", handleLocChange);
  }, []);

  // Experts data
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fallbackInfo, setFallbackInfo] = useState({ used: false, reason: null });

  // Online/Offline state
  const [onlineExperts, setOnlineExperts] = useState({});
  const latestRequestRef = useRef(0);
  const abortRef = useRef(null);
  const lastLoadedRouteCategoryRef = useRef("");
  const searchParamsString = searchParams.toString();

  // Use Chat Request Hook
  const {
    startChat,
    ChatPopups,
    isWaiting,
  } = useChatRequest();

  useEffect(() => {
    if (!isCategoryRoute || !routeCategoryId) return;

    setSelectedCategoryId((current) => (
      String(current) === String(routeCategoryId) ? current : routeCategoryId
    ));
    if (routeSubcategoryId) {
      setSelectedSubcategoryId((current) => (
        String(current) === String(routeSubcategoryId) ? current : routeSubcategoryId
      ));
    }

    if (lastLoadedRouteCategoryRef.current !== String(routeCategoryId)) {
      lastLoadedRouteCategoryRef.current = String(routeCategoryId);
      loadSubCategories(routeCategoryId);
    }
  }, [isCategoryRoute, loadSubCategories, routeCategoryId, routeSubcategoryId]);

  useEffect(() => {
    if (!isCategoryRoute || routeCategoryId || categories.length === 0) return;
    navigate("/user/categories", { replace: true });
  }, [categories.length, isCategoryRoute, navigate, routeCategoryId]);

  useEffect(() => {
    if (!isMobileFilterOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileFilterOpen]);

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    const nextPage = parseInt(params.get("page")) || 1;
    setCurrentPage((current) => (nextPage === current ? current : nextPage));

    const nextMode = params.get("mode");
    if (nextMode === "chat" || nextMode === "call") {
      setTab((current) => (nextMode === current ? current : nextMode));
    }

    const nextSearch = params.get("q") || "";
    setSearchInput((current) => (nextSearch === current ? current : nextSearch));
    setDebouncedSearch((current) => (nextSearch === current ? current : nextSearch));

    const nextMinRating = getParam(params, "rating", "minRating");
    const nextMinPrice = getParam(params, "minPrice");
    const nextMaxPrice = getParam(params, "maxPrice");
    const nextMinExperience = getParam(params, "experience", "minExperience");
    const nextLanguage = getParam(params, "language");
    const nextStatus = getParam(params, "status");
    const nextGender = getParam(params, "gender");
    const nextSortBy = getParam(params, "sortBy");
    const nextSortOrder = getParam(params, "order") || "desc";

    setMinRating((current) => (nextMinRating === current ? current : nextMinRating));
    setMinPrice((current) => (nextMinPrice === current ? current : nextMinPrice));
    setMaxPrice((current) => (nextMaxPrice === current ? current : nextMaxPrice));
    setMinExperience((current) => (nextMinExperience === current ? current : nextMinExperience));
    setLanguage((current) => (nextLanguage === current ? current : nextLanguage));
    setStatusFilter((current) => (nextStatus === current ? current : nextStatus));
    setGender((current) => (nextGender === current ? current : nextGender));
    setSortBy((current) => (nextSortBy === current ? current : nextSortBy));
    setSortOrder((current) => (nextSortOrder === current ? current : nextSortOrder));
  }, [searchParamsString]);

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
    if (isCategoryRoute && !routeCategoryId) {
      return null;
    }

    const effectiveCategoryId = routeCategoryId || selectedCategoryId;
    const effectiveSubcategoryId = routeSubcategoryId || selectedSubcategoryId;

    const params = {
      page: currentPage,
      limit: 20,
      priceMode: tab
    };

    if (selectedLoc) {
      if (selectedLoc.type === "coordinates") {
        params.lat = selectedLoc.latitude;
        params.lng = selectedLoc.longitude;
        params.location_mode = "nearby";
      } else if (selectedLoc.type === "global") {
        params.location_mode = "global";
      } else {
        params.city = selectedLoc.city;
        params.area = selectedLoc.area;
        params.pincode = selectedLoc.pincode;
        params.location_mode = "local";
      }
    } else {
      params.location_mode = "global";
    }

    if (effectiveCategoryId) {
      params.category = effectiveCategoryId;
    }

    if (effectiveSubcategoryId) {
      params.subcategory = effectiveSubcategoryId;
    }

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    if (minRating) {
      params.minRating = minRating;
    }

    if (minPrice) {
      params.minPrice = minPrice;
    }

    if (maxPrice) {
      params.maxPrice = maxPrice;
    }

    if (minExperience) {
      params.minExperience = minExperience;
    }

    if (language.trim()) {
      params.language = language.trim();
    }

    if (statusFilter) {
      params.status = statusFilter;
    }

    if (gender) {
      params.gender = gender;
    }

    if (sortBy) {
      params.sortBy = sortBy;
      params.order = sortOrder;
    }

    const hasFilters =
      effectiveCategoryId ||
      effectiveSubcategoryId ||
      debouncedSearch ||
      minRating ||
      minPrice ||
      maxPrice ||
      minExperience ||
      language.trim() ||
      statusFilter ||
      gender ||
      sortBy ||
      (selectedLoc && selectedLoc.type !== "global");

    if (!hasFilters) {
      params.top = "true";
    }

    return params;
  }, [
    currentPage,
    isCategoryRoute,
    routeCategoryId,
    routeSubcategoryId,
    selectedCategoryId,
    selectedSubcategoryId,
    debouncedSearch,
    minRating,
    minPrice,
    maxPrice,
    minExperience,
    language,
    statusFilter,
    gender,
    sortBy,
    sortOrder,
    tab,
    selectedLoc
  ]);

  // FIX 3: URL sync effect - prevents loop while keeping page/mode query in sync
  useEffect(() => {
    const currentParams = new URLSearchParams(searchParamsString);
    const nextParams = new URLSearchParams(searchParamsString);
    nextParams.set("mode", tab);
    nextParams.set("page", String(currentPage));

    if (debouncedSearch) {
      nextParams.set("q", debouncedSearch);
    } else {
      nextParams.delete("q");
    }

    if (minRating) {
      nextParams.set("rating", minRating);
    } else {
      nextParams.delete("rating");
      nextParams.delete("minRating");
    }

    if (minPrice) {
      nextParams.set("minPrice", minPrice);
    } else {
      nextParams.delete("minPrice");
    }

    if (maxPrice) {
      nextParams.set("maxPrice", maxPrice);
    } else {
      nextParams.delete("maxPrice");
    }

    if (minExperience) {
      nextParams.set("experience", minExperience);
    } else {
      nextParams.delete("experience");
      nextParams.delete("minExperience");
    }

    if (language.trim()) {
      nextParams.set("language", language.trim());
    } else {
      nextParams.delete("language");
    }

    if (statusFilter) {
      nextParams.set("status", statusFilter);
    } else {
      nextParams.delete("status");
    }

    if (gender) {
      nextParams.set("gender", gender);
    } else {
      nextParams.delete("gender");
    }

    if (sortBy) {
      nextParams.set("sortBy", sortBy);
      nextParams.set("order", sortOrder || "desc");
    } else {
      nextParams.delete("sortBy");
      nextParams.delete("order");
    }

    const nextParamsString = nextParams.toString();

    if (nextParamsString !== searchParamsString) {
      const isDefaultNormalization =
        !currentParams.has("mode") ||
        !currentParams.has("page");

      setSearchParams(nextParams, { replace: isDefaultNormalization });
    }
  }, [
    tab,
    currentPage,
    debouncedSearch,
    minRating,
    minPrice,
    maxPrice,
    minExperience,
    language,
    statusFilter,
    gender,
    sortBy,
    sortOrder,
    searchParamsString,
    setSearchParams
  ]);

  const fetchExperts = useCallback(async () => {
    if (!apiParams) {
      setExperts([]);
      setTotalExperts(0);
      setTotalPages(1);
      return;
    }

    const requestId = latestRequestRef.current + 1;
    latestRequestRef.current = requestId;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const response = await getExpertsApi({
        ...apiParams,
        signal: controller.signal,
      });

      if (latestRequestRef.current !== requestId) return;

      const rawData = response.data || [];
      const seen = new Set();
      const unique = [];
      for (const item of rawData) {
        const id = Number(item.id || item.expert_id || item.expertId);
        if (id && !seen.has(id)) {
          seen.add(id);
          unique.push(item);
        }
      }
      setExperts(unique);
      setTotalExperts(response.total || 0);
      setTotalPages(response.totalPages || 1);
      setFallbackInfo({
        used: response.fallback_used || false,
        reason: response.fallback_reason || null
      });
    } catch (error) {
      if (controller.signal.aborted || error?.code === "ERR_CANCELED") return;
      if (latestRequestRef.current !== requestId) return;

      console.error("Failed to fetch experts:", error);
      setError("Failed to load experts. Please try again.");
      setExperts([]);
      setTotalExperts(0);
      setTotalPages(1);
      setFallbackInfo({ used: false, reason: null });
    } finally {
      if (latestRequestRef.current === requestId) {
        setLoading(false);
      }
    }
  }, [apiParams]);
  
  // SINGLE EFFECT for fetching - NO duplicates
  useEffect(() => {
    fetchExperts();
    return () => abortRef.current?.abort();
  }, [fetchExperts]);

  // FIX 4: Network reconnect - always enabled
  useNetworkReconnect(fetchExperts, {
    enabled: true,
  });

  // Reset subcategory when category changes AND load subcategories
  useEffect(() => {
    if (routeSubcategoryId) return;
    setSelectedSubcategoryId((current) => (current === "" ? current : ""));
  }, [routeSubcategoryId, selectedCategoryId]);

  // Socket listeners for online/offline status ONLY
  useEffect(() => {
    if (!socket) return;

    const handleMultipleStatus = (data) => {
      setOnlineExperts(prev => {
        const updated = { ...prev };
        let changed = false;
        Object.keys(data).forEach(id => {
          const key = String(id);
          if (updated[key] !== data[id]) {
            updated[key] = data[id];
            changed = true;
          }
        });
        return changed ? updated : prev;
      });
    };

    const handleOnline = ({ expert_id }) => {
      setOnlineExperts(prev => {
        const key = String(expert_id);
        return prev[key] === true ? prev : { ...prev, [key]: true };
      });
    };

    const handleOffline = ({ expert_id }) => {
      setOnlineExperts(prev => {
        const key = String(expert_id);
        return prev[key] === false ? prev : { ...prev, [key]: false };
      });
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
    setSelectedCategoryId(routeCategoryId || "");
    setSelectedSubcategoryId(routeSubcategoryId || "");
    setSearchInput("");
    setDebouncedSearch("");
    setMinRating("");
    setMinPrice("");
    setMaxPrice("");
    setMinExperience("");
    setLanguage("");
    setStatusFilter("");
    setGender("");
    setSortBy("");
    setSortOrder("desc");
    setCurrentPage(1);
    setFallbackInfo({ used: false, reason: null });
    if (routeCategoryId) {
      loadSubCategories(routeCategoryId);
    }
  };

  // UPDATED: Use hook's startChat instead of direct socket emit
  const handleStartChat = useCallback((expertId) => {
    const expert = experts.find(e => Number(e.id) === Number(expertId));
    if (!expertId) return;
    const chatAllowed = isEnabledFlag(expert?.effective_access?.show_chat_button ?? expert?.effective_access?.can_chat ?? expert?.show_chat_button ?? expert?.showChatButton ?? expert?.can_chat ?? expert?.canChat);
    if (!chatAllowed) {
      alert("Chat is currently unavailable for this expert.");
      return;
    }

    trackLeadEvent(
      "chat-attempt",
      buildTrackingPayload({
        user,
        sourcePage: "call_chat_listing",
        actionLabel: "Chat Now",
        extra: {
          expert_id: Number(expertId),
          category_id: expert?.category_id || expert?.categoryId || null,
          subcategory_id: expert?.subcategory_id || expert?.subcategoryId || null,
          contact_consent: true,
          can_show_contact_to_expert: true,
        },
      })
    );

    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: location } });
      return;
    }
    
    startChat({
      expertId,
      chatPrice: expert?.chat_per_minute || 0,
      pricingMode: "per_minute",
    });
  }, [isLoggedIn, experts, startChat, navigate, location, user]);

  const handleStartCall = useCallback((expertId) => {
    const expert = experts.find(e => Number(e.id) === Number(expertId));
    if (!expertId) return;
    const callAllowed = isEnabledFlag(expert?.effective_access?.show_call_button ?? expert?.effective_access?.can_call ?? expert?.show_call_button ?? expert?.showCallButton ?? expert?.can_call ?? expert?.canCall);
    if (!callAllowed) {
      alert("Call is currently unavailable for this expert.");
      return;
    }

    trackLeadEvent(
      "call-attempt",
      buildTrackingPayload({
        user,
        sourcePage: "call_chat_listing",
        actionLabel: "Call Now",
        extra: {
          expert_id: Number(expertId),
          category_id: expert?.category_id || expert?.categoryId || null,
          subcategory_id: expert?.subcategory_id || expert?.subcategoryId || null,
          contact_consent: true,
          can_show_contact_to_expert: true,
        },
      })
    );

    if (!isLoggedIn) {
      navigate("/user/auth", { state: { from: location } });
      return;
    }

    navigate(`/user/voice-call/${expertId}`);
  }, [isLoggedIn, experts, navigate, location, user]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const cardExperts = useMemo(() => {
    return experts.map((exp) => normalizeExpertAccess({
      id: exp.id,
      slug: exp.slug || exp.id,
      name: exp.name,
      profile_photo: exp.profile_photo,
      position: exp.category_name,
      speciality: exp.subcategory_name,
      location: exp.location,
      distance_km: exp.distance_km,
      isOnline: onlineExperts[String(exp.id)],
      call_per_minute: exp.call_per_minute || 0,
      chat_per_minute: exp.chat_per_minute || 0,
      video_call_per_minute: exp.video_call_per_minute ?? exp.videoCallPerMinute ?? exp.video_call_price_per_minute ?? exp.videoCallPricePerMinute ?? exp.video_price ?? exp.videoCallPrice ?? null,
      videoCallPerMinute: exp.videoCallPerMinute ?? exp.video_call_per_minute ?? exp.video_call_price_per_minute ?? exp.videoCallPricePerMinute ?? exp.video_price ?? exp.videoCallPrice ?? null,
      video_call_price_per_minute: exp.video_call_price_per_minute ?? exp.videoCallPricePerMinute ?? exp.video_call_per_minute ?? exp.videoCallPerMinute ?? exp.video_price ?? exp.videoCallPrice ?? null,
      videoCallPricePerMinute: exp.videoCallPricePerMinute ?? exp.video_call_price_per_minute ?? exp.video_call_per_minute ?? exp.videoCallPerMinute ?? exp.video_price ?? exp.videoCallPrice ?? null,
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
      discounted_call_per_minute: exp.discounted_call_per_minute || exp.call_discount_price || exp.discounted_call_price,
      discounted_chat_per_minute: exp.discounted_chat_per_minute || exp.chat_discount_price || exp.discounted_chat_price,
      orders: exp.orders || exp.total_orders || exp.total_bookings || 0,
      gender: exp.gender || exp.expert_gender || "",
      status: exp.status || exp.availability || exp.available_status || "",
      is_available: exp.is_available,
      isPaidExpert: exp.isPaidExpert,
      is_subscribed: exp.is_subscribed,
      isSubscribed: exp.isSubscribed,
      effective_access: exp.effective_access,
      subscription_status: exp.subscription_status,
      subscriptionStatus: exp.subscriptionStatus,
      access_level: exp.access_level,
      accessLevel: exp.accessLevel,
      can_chat: exp.can_chat,
      canChat: exp.canChat,
      can_call: exp.can_call,
      canCall: exp.canCall,
      can_view_contact: exp.can_view_contact,
      canViewContact: exp.canViewContact,
      chat_enabled: exp.chat_enabled,
      chatEnabled: exp.chatEnabled,
      call_enabled: exp.call_enabled,
      callEnabled: exp.callEnabled,
      show_chat_button: exp.show_chat_button,
      showChatButton: exp.showChatButton,
      show_call_button: exp.show_call_button,
      showCallButton: exp.showCallButton,
      plan_expires_at: exp.plan_expires_at,
      planExpiresAt: exp.planExpiresAt,
    }));
  }, [experts, onlineExperts]);

  const languageOptions = useMemo(() => {
    const values = new Set();
    if (language) values.add(language);
    cardExperts.forEach((expert) => {
      normalizeTextList(expert.languages).forEach((item) => values.add(item));
    });
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [cardExperts, language]);

  const genderOptions = useMemo(() => {
    const values = new Set();
    if (gender) values.add(gender);
    cardExperts.forEach((expert) => {
      if (expert.gender) values.add(String(expert.gender));
    });
    return Array.from(values).sort((a, b) => a.localeCompare(b));
  }, [cardExperts, gender]);

  const filteredCardExperts = useMemo(() => {
    return cardExperts;
  }, [cardExperts]);

  // Get active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedCategoryId) count++;
    if (selectedSubcategoryId) count++;
    if (debouncedSearch) count++;
    if (minRating) count++;
    if (minPrice) count++;
    if (maxPrice) count++;
    if (minExperience) count++;
    if (language) count++;
    if (statusFilter) count++;
    if (gender) count++;
    if (sortBy) count++;
    return count;
  }, [
    selectedCategoryId,
    selectedSubcategoryId,
    debouncedSearch,
    minRating,
    minPrice,
    maxPrice,
    minExperience,
    language,
    statusFilter,
    gender,
    sortBy
  ]);

  const removeFilter = (filterName) => {
    switch(filterName) {
      case 'category':
        if (!isCategoryRoute) {
          setSelectedCategoryId("");
        }
        break;
      case 'subcategory':
        if (!routeSubcategoryId) {
          setSelectedSubcategoryId("");
        }
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
      case 'minPrice':
        setMinPrice("");
        break;
      case 'maxPrice':
        setMaxPrice("");
        break;
      case 'experience':
        setMinExperience("");
        break;
      case 'language':
        setLanguage("");
        break;
      case 'status':
        setStatusFilter("");
        break;
      case 'gender':
        setGender("");
        break;
      case 'sort':
        setSortBy("");
        break;
      default:
        break;
    }
    setCurrentPage(1);
  };

  const getLanguageText = (languages) => {
    if (Array.isArray(languages)) {
      return languages.filter(Boolean).join(", ");
    }

    return languages || "";
  };

  const handleMobileCategorySelect = (categoryId) => {
    if (isCategoryRoute) return;
    setSelectedCategoryId(categoryId);
    setSelectedSubcategoryId("");
    setCurrentPage(1);

    if (categoryId) {
      loadSubCategories(categoryId);
    }
  };

  const renderStars = (rating) => {
    const numericRating = Number(rating) || 0;
    const filledStars = Math.max(0, Math.min(5, Math.round(numericRating)));

    return Array.from({ length: 5 }).map((_, index) => (
      <FiStar key={index} className={index < filledStars ? "filled" : ""} aria-hidden="true" />
    ));
  };

  const getModePrice = (expert) => {
    const basePrice = tab === "chat" ? expert.chat_per_minute : expert.call_per_minute;
    const discountedPrice = tab === "chat" ? expert.discounted_chat_per_minute : expert.discounted_call_per_minute;

    return {
      basePrice: Number(basePrice || 0),
      discountedPrice: Number(discountedPrice || 0),
    };
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

      <FilterGroup>
        <FilterLabel>Search</FilterLabel>
        <div style={{ position: "relative" }}>
          <SearchIcon><FiSearch size={16} /></SearchIcon>
          <SearchInput
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search expert name or skill"
          />
          {searchInput && (
            <ClearSearchBtn type="button" onClick={() => setSearchInput("")}>
              <FiX size={14} />
            </ClearSearchBtn>
          )}
        </div>
      </FilterGroup>

      {/* Category Filter - with loadSubCategories */}
      <FilterGroup>
        <FilterLabel>{t("common.categories")}</FilterLabel>
        <MobileSelect
          title="Select Category"
          value={selectedCategoryId}
          disabled={isCategoryRoute}
          DesktopSelectComponent={FilterSelect}
          options={[
            { value: "", label: t("callChat.allCategories") },
            ...categories.map((cat) => ({ value: cat.id, label: cat.name })),
          ]}
          onChange={(e) => {
            if (isCategoryRoute) return;
            const value = e.target.value;
            setSelectedCategoryId(value);
            setSelectedSubcategoryId("");
            setCurrentPage(1);
            if (value) {
              loadSubCategories(value);
            }
          }}
        />
      </FilterGroup>

      {/* Subcategory Filter - FIXED rendering */}
      {selectedCategoryId && (
        <FilterGroup>
          <FilterLabel>{t("callChat.subcategory", "Subcategory")}</FilterLabel>
          <MobileSelect
            title="Select Subcategory"
            value={selectedSubcategoryId}
            disabled={Boolean(routeSubcategoryId)}
            DesktopSelectComponent={FilterSelect}
            options={[
              { value: "", label: t("callChat.allSubcategories") },
              ...subCategories.map((sub) => ({ value: sub.id, label: sub.name })),
            ]}
            onChange={(e) => {
              if (routeSubcategoryId) return;
              setSelectedSubcategoryId(e.target.value);
              setCurrentPage(1);
            }}
          />
        </FilterGroup>
      )}

      {/* Price Filter */}
      <FilterGroup>
        <FilterLabel>Max Price ({tab === "call" ? "₹/min Call" : "₹/min Chat"})</FilterLabel>
        <MobileSelect
          title="Select Max Price"
          value={maxPrice}
          DesktopSelectComponent={FilterSelect}
          options={getPriceOptions(tab)}
          onChange={(e) => {
            setMaxPrice(e.target.value);
            setCurrentPage(1);
          }}
        />
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>Min Price ({tab === "call" ? "Call" : "Chat"} / min)</FilterLabel>
        <MobileSelect
          title="Select Min Price"
          value={minPrice}
          DesktopSelectComponent={FilterSelect}
          options={minPriceOptions}
          onChange={(e) => {
            setMinPrice(e.target.value);
            setCurrentPage(1);
          }}
        />
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>Rating</FilterLabel>
        <MobileSelect
          title="Select Rating"
          value={minRating}
          DesktopSelectComponent={FilterSelect}
          options={ratingOptions}
          onChange={(e) => {
            setMinRating(e.target.value);
            setCurrentPage(1);
          }}
        />
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>Experience</FilterLabel>
        <MobileSelect
          title="Select Experience"
          value={minExperience}
          DesktopSelectComponent={FilterSelect}
          options={experienceOptions}
          onChange={(e) => {
            setMinExperience(e.target.value);
            setCurrentPage(1);
          }}
        />
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>Language</FilterLabel>
        <MobileSelect
          title="Select Language"
          value={language}
          DesktopSelectComponent={FilterSelect}
          options={[
            { value: "", label: "Any language" },
            ...languageOptions.map((item) => ({ value: item, label: item })),
          ]}
          onChange={(e) => {
            setLanguage(e.target.value);
            setCurrentPage(1);
          }}
        />
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>Availability</FilterLabel>
        <MobileSelect
          title="Select Availability"
          value={statusFilter}
          DesktopSelectComponent={FilterSelect}
          options={statusOptions}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        />
      </FilterGroup>

      {genderOptions.length > 0 && (
        <FilterGroup>
          <FilterLabel>Gender</FilterLabel>
          <MobileSelect
            title="Select Gender"
            value={gender}
            DesktopSelectComponent={FilterSelect}
            options={[
              { value: "", label: "Any gender" },
              ...genderOptions.map((item) => ({ value: item, label: item })),
            ]}
            onChange={(e) => {
              setGender(e.target.value);
              setCurrentPage(1);
            }}
          />
        </FilterGroup>
      )}

      {/* Sort By */}
      <FilterGroup>
        <FilterLabel>Sort By</FilterLabel>
        <MobileSelect
          title="Sort Experts"
          value={sortBy ? `${sortBy}_${sortOrder}` : ""}
          DesktopSelectComponent={FilterSelect}
          options={sortOptions}
          onChange={(e) => {
            const [newSortBy, newOrder] = splitSortValue(e.target.value);
            setSortBy(newSortBy);
            setSortOrder(newOrder);
            setCurrentPage(1);
          }}
        />
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
      
      <PageWrap className="call-chat-expert-page">
        

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

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <ActiveFilters>
            {selectedCategoryId && (
              <ActiveFilterChip onClick={() => removeFilter('category')}>
                Category: {categories.find(c => c.id == selectedCategoryId)?.name}
                {!isCategoryRoute && <FiX size={12} />}
              </ActiveFilterChip>
            )}
            {selectedSubcategoryId && (
              <ActiveFilterChip onClick={() => removeFilter('subcategory')}>
                Subcategory: {subCategories.find(s => s.id == selectedSubcategoryId)?.name}
                {!routeSubcategoryId && <FiX size={12} />}
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
            {minPrice && (
              <ActiveFilterChip onClick={() => removeFilter('minPrice')}>
                Min Price: Rs {minPrice}/{tab === "call" ? "min" : "min"}
                <FiX size={12} />
              </ActiveFilterChip>
            )}
            {minExperience && (
              <ActiveFilterChip onClick={() => removeFilter('experience')}>
                Experience: {minExperience}+ yrs
                <FiX size={12} />
              </ActiveFilterChip>
            )}
            {language && (
              <ActiveFilterChip onClick={() => removeFilter('language')}>
                Language: {language}
                <FiX size={12} />
              </ActiveFilterChip>
            )}
            {statusFilter && (
              <ActiveFilterChip onClick={() => removeFilter('status')}>
                Status: {statusFilter}
                <FiX size={12} />
              </ActiveFilterChip>
            )}
            {gender && (
              <ActiveFilterChip onClick={() => removeFilter('gender')}>
                Gender: {gender}
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

        <div className="mobile-category-strip" aria-label="Expert category filters">
          {isCategoryRoute ? (
            <button type="button" className="active">
              {routeCategory?.name || t("common.categories")}
            </button>
          ) : (
            <>
              <button
                type="button"
                className={!selectedCategoryId ? "active" : ""}
                onClick={() => handleMobileCategorySelect("")}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  type="button"
                  key={category.id}
                  className={String(selectedCategoryId) === String(category.id) ? "active" : ""}
                  onClick={() => handleMobileCategorySelect(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </>
          )}
        </div>

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
                <Overlay
                  as={motion.div}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setIsMobileFilterOpen(false)}
                />
                <MobileFilterDrawer
                  as={motion.div}
                  initial={{ y: '100%', opacity: 0.98 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: '100%', opacity: 0.98 }}
                  transition={{ type: 'tween', duration: 0.28 }}
                >
                  <div className="mobile-filter-grabber" aria-hidden="true" />
                  <div className="mobile-filter-header">
                    <div>
                      <h3>Filters</h3>
                      {activeFiltersCount > 0 && <span>{activeFiltersCount} selected</span>}
                    </div>
                    <button type="button" className="mobile-filter-clear-top" onClick={resetFilters}>
                      Clear All
                    </button>
                    <button 
                      type="button"
                      className="mobile-filter-close"
                      onClick={() => setIsMobileFilterOpen(false)}
                      aria-label="Close filters"
                    >
                      <FiX size={24} />
                    </button>
                  </div>
                  <div className="mobile-filter-body">
                    <FilterContent />
                  </div>
                  <div className="mobile-filter-actions">
                    <button type="button" className="clear" onClick={resetFilters}>
                      Clear
                    </button>
                    <button type="button" className="apply" onClick={() => setIsMobileFilterOpen(false)}>
                      Apply Filters
                    </button>
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
            ) : filteredCardExperts.length === 0 ? (
              <EmptyState>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                {t("callChat.noExpertsFound")}
                {activeFiltersCount > 0 && (
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
                {fallbackInfo.used && (
                  <div className="location-fallback-warning" style={{
                    marginBottom: 16,
                    padding: "12px 16px",
                    background: "#fffbeb",
                    border: "1px solid #fef3c7",
                    borderRadius: "12px",
                    color: "#b45309",
                    fontSize: "13px"
                  }}>
                    ⚠️ {fallbackInfo.reason}
                  </div>
                )}
                <div className="experts-result-count" style={{ marginBottom: 16, fontSize: 14, color: "#64748b" }}>
                  Showing {filteredCardExperts.length} of {totalExperts || filteredCardExperts.length} experts
                </div>

                <div className="mobile-expert-list">
                  {filteredCardExperts.map((exp) => {
                    const { basePrice, discountedPrice } = getModePrice(exp);
                    const shownPrice = discountedPrice > 0 ? discountedPrice : basePrice;
                    const languageText = getLanguageText(exp.languages);
                    const allowedByAdmin =
                      tab === "chat"
                        ? isEnabledFlag(exp.effective_access?.show_chat_button ?? exp.effective_access?.can_chat ?? exp.show_chat_button ?? exp.showChatButton ?? exp.can_chat ?? exp.canChat)
                        : isEnabledFlag(exp.effective_access?.show_call_button ?? exp.effective_access?.can_call ?? exp.show_call_button ?? exp.showCallButton ?? exp.can_call ?? exp.canCall);

                    return (
                      <article className="mobile-callchat-card" key={`mobile-${exp.id}`}>
                        <button
                          type="button"
                          className="mobile-callchat-card__main"
                          onClick={() => navigate(`/user/experts/${exp.slug || exp.id}`)}
                        >
                          <span className="mobile-callchat-card__avatar">
                            <img src={exp.profile_photo || "https://i.pravatar.cc/150?img=12"} alt={exp.name} loading="lazy" />
                            <i className={exp.isOnline === true ? "online" : ""} />
                          </span>
                          <span className="mobile-callchat-card__info">
                            <span className="mobile-callchat-card__name-row">
                              <strong>{exp.name}</strong>
                              {exp.is_verified && (
                                <em>
                                  <FiUserCheck aria-hidden="true" />
                                </em>
                              )}
                            </span>
                            {(exp.category_name || exp.subcategory_name) && (
                              <small>{exp.subcategory_name || exp.category_name}</small>
                            )}
                            {languageText && (
                              <span className="mobile-callchat-card__line">
                                <FiGlobe aria-hidden="true" />
                                {languageText}
                              </span>
                            )}
                            {exp.total_experience > 0 && (
                              <span className="mobile-callchat-card__line">
                                <FiClock aria-hidden="true" />
                                {exp.total_experience}+ years experience
                              </span>
                            )}
                            {exp.location && (
                              <span className="mobile-callchat-card__line">
                                <FiMapPin aria-hidden="true" />
                                {exp.location}
                                {exp.distance_km !== null && exp.distance_km !== undefined && (
                                  <span style={{ color: '#0ea5e9', marginLeft: '4px', fontWeight: '600' }}>
                                    ({Number(exp.distance_km).toFixed(1)} km)
                                  </span>
                                )}
                              </span>
                            )}
                          </span>
                        </button>

                        <div className="mobile-callchat-card__meta">
                          <span className="mobile-callchat-card__rating">
                            {renderStars(exp.avg_rating)}
                            <b>{exp.avg_rating ? Number(exp.avg_rating).toFixed(1) : "New"}</b>
                            {exp.total_reviews > 0 && <small>({exp.total_reviews})</small>}
                          </span>
                          {exp.orders > 0 && <span>{exp.orders}+ orders</span>}
                        </div>

                        <div className="mobile-callchat-card__footer">
                          <div className="mobile-callchat-card__price">
                            {shownPrice > 0 ? (
                              <>
                                <strong>Rs {shownPrice}/min</strong>
                                {discountedPrice > 0 && basePrice > discountedPrice && <del>Rs {basePrice}</del>}
                              </>
                            ) : (
                              <strong>View price</strong>
                            )}
                          </div>
                          <button
                            type="button"
                            className="mobile-callchat-card__cta"
                            disabled={!exp.id || !allowedByAdmin}
                            title={tab === "chat" ? "Start chat consultation" : "Start voice call"}
                            aria-label={tab === "chat" ? "Start chat consultation" : "Start voice call"}
                            onClick={() => (tab === "chat" ? handleStartChat(exp.id) : handleStartCall(exp.id))}
                          >
                            {tab === "chat" ? <FiMessageSquare aria-hidden="true" /> : <FiPhoneCall aria-hidden="true" />}
                            {shownPrice > 0 ? `\u20B9${shownPrice}/min` : "--"}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
                
                <Grid>
                  {filteredCardExperts.map((exp, index) => {
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
