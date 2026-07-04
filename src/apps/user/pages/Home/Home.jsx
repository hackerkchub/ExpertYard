import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  BriefcaseBusiness,
  History,
  Grid3X3,
  Home as HomeIcon,
  LogIn,
  LogOut,
  MapPin,
  MessageCircle,
  PhoneCall,
  Scale,
  ShieldCheck,
  Sparkles,
  Star,
  Share2,
  UserRound,
  Wallet,
  X,
  Gift,
  Film,
} from "lucide-react";

import "./Home.css";
import HomeHeader from "./components/HomeHeader";
import Footer from "../../components/Footer/Footer";
import HomeSearch from "./components/HomeSearch";
import QuickActions from "./components/QuickActions";
import CategoryChips from "./components/CategoryChips";
import HomeFeed from "./components/HomeFeed";
import { HomeLeftSidebar, HomeRightSidebar } from "./components/HomeSidebars";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useCategory } from "../../../../shared/context/CategoryContext";
import { useWallet } from "../../../../shared/context/WalletContext";
import { useSeo } from "../../../../shared/seo/useSeo";
import { getHomeFeedApi } from "../../../../shared/api/userApi/home.api";
import { buildUserSearchPath } from "../../components/search/searchUtils";
import { getAllServices } from "../../../../shared/api/service.api";

const trendingServicesData = [
  { title: "Income Tax Filing", subtitle: "by CA Experts", price: "₹ 1,499" },
  { title: "Business Registration", subtitle: "by Legal Advisors", price: "₹ 2,999" },
  { title: "Birth Chart Analysis", subtitle: "by Astrologers", price: "₹ 499" },
  { title: "Logo & Brand Design", subtitle: "by Branding Experts", price: "₹ 2,499" },
];

const FEED_LIMIT = 12;

const getSavedLocation = () => {
  try {
    return JSON.parse(localStorage.getItem("last_selected_location") || "null") || {};
  } catch {
    return {};
  }
};

const sidebarItems = [
  { label: "Home", to: "/user", icon: HomeIcon },
  { label: "Services", to: "/user/all-services", icon: BriefcaseBusiness },
  { label: "Wallet", to: "/user/wallet", icon: Wallet },
  { label: "Category", to: "/user/categories", icon: Grid3X3 },
  { label: "Consultations", to: "/user/chat-history", icon: History },
  { label: "Notifications", to: "/user/notifications", icon: Bell },
];

const categoryPresentation = [
  { aliases: ["legal", "law"], icon: Scale },
  { aliases: ["career", "job"], icon: BriefcaseBusiness },
  { aliases: ["astrology", "astro"], icon: Sparkles },
  { aliases: ["finance", "tax", "account"], icon: Wallet },
  { aliases: ["health", "wellness"], icon: ShieldCheck },
  { aliases: ["business", "startup"], icon: Grid3X3 },
  { aliases: ["hr", "human resource", "human resources"], icon: UsersIconFallback },
  { aliases: ["it", "technology", "software"], icon: CpuIconFallback },
];

function UsersIconFallback(props) {
  return <UserRound {...props} />;
}

function CpuIconFallback(props) {
  return <Grid3X3 {...props} />;
}

const money = (value, fallback = "Rs 0") => {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? `Rs ${Math.round(numeric)}` : fallback;
};

const getCategoryText = (category) => {
  if (!category) return "";

  if (typeof category === "string") {
    return category.toLowerCase().trim();
  }

  if (typeof category === "object") {
    return (
      category.name ||
      category.category_name ||
      category.categoryName ||
      category.title ||
      category.slug ||
      category.label ||
      category?.category?.name ||
      category?.category?.category_name ||
      ""
    )
      .toString()
      .toLowerCase()
      .trim();
  }

  return "";
};

const getCategoryPresentation = (category) =>
  categoryPresentation.find((item) =>
    item.aliases.some((alias) => getCategoryText(category).includes(alias.toLowerCase()))
  ) || { aliases: [], icon: Grid3X3 };

import axiosInstance from "../../../../shared/api/userApi/axiosInstance";

const fallbackReviews = [
  {
    id: "fb-1",
    name: "Rohit Sharma",
    city: "Mumbai, MH",
    rating: 4.9,
    review: "Doctor consultation was quick and helpful.",
    createdAt: "recently",
    avatarInitials: "RS"
  },
  {
    id: "fb-2",
    name: "Priya Mehta",
    city: "Delhi",
    rating: 4.8,
    review: "Expert responded on time and guided me properly.",
    createdAt: "recently",
    avatarInitials: "PM"
  },
  {
    id: "fb-3",
    name: "Ankit Verma",
    city: "Bangalore, KA",
    rating: 4.7,
    review: "Service booking process was simple and smooth.",
    createdAt: "recently",
    avatarInitials: "AV"
  },
  {
    id: "fb-4",
    name: "Neha Singh",
    city: "Jaipur, RJ",
    rating: 4.9,
    review: "I got clear advice for my career confusion.",
    createdAt: "recently",
    avatarInitials: "NS"
  },
  {
    id: "fb-5",
    name: "Aman Gupta",
    city: "Indore, MP",
    rating: 5.0,
    review: "Good platform for trusted online consultation.",
    createdAt: "recently",
    avatarInitials: "AG"
  },
  {
    id: "fb-6",
    name: "Pooja Jain",
    city: "Ahmedabad, GJ",
    rating: 4.6,
    review: "Astrology session was explained in a simple way.",
    createdAt: "recently",
    avatarInitials: "PJ"
  },
  {
    id: "fb-7",
    name: "Saurabh Yadav",
    city: "Noida, UP",
    rating: 4.8,
    review: "Legal guidance was useful and easy to understand.",
    createdAt: "recently",
    avatarInitials: "SY"
  },
  {
    id: "fb-8",
    name: "Kavita Patel",
    city: "Pune, MH",
    rating: 4.7,
    review: "Call quality and consultation experience were good.",
    createdAt: "recently",
    avatarInitials: "KP"
  },
  {
    id: "fb-9",
    name: "Rahul Meena",
    city: "Kota, RJ",
    rating: 4.9,
    review: "The expert profile and service details helped me choose better.",
    createdAt: "recently",
    avatarInitials: "RM"
  },
  {
    id: "fb-10",
    name: "Divya Sharma",
    city: "Gurugram, HR",
    rating: 4.8,
    review: "Payment and booking flow felt secure.",
    createdAt: "recently",
    avatarInitials: "DS"
  },
  {
    id: "fb-11",
    name: "Manish Joshi",
    city: "Bhopal, MP",
    rating: 4.9,
    review: "Excellent response time. Very satisfied with the guidance.",
    createdAt: "recently",
    avatarInitials: "MJ"
  },
  {
    id: "fb-12",
    name: "Sneha Agarwal",
    city: "Kolkata, WB",
    rating: 5.0,
    review: "The expert was very professional and solved my issue quickly.",
    createdAt: "recently",
    avatarInitials: "SA"
  },
  {
    id: "fb-13",
    name: "Harsh Vyas",
    city: "Jodhpur, RJ",
    rating: 4.8,
    review: "Secure calls and clean interface. Super easy to use.",
    createdAt: "recently",
    avatarInitials: "HV"
  },
  {
    id: "fb-14",
    name: "Ritu Choudhary",
    city: "Jaipur, RJ",
    rating: 4.7,
    review: "Very transparent pricing and highly detailed consultations.",
    createdAt: "recently",
    avatarInitials: "RC"
  },
  {
    id: "fb-15",
    name: "Deepak Soni",
    city: "Indore, MP",
    rating: 4.9,
    review: "Top-notch customer support and extremely knowledgeable experts.",
    createdAt: "recently",
    avatarInitials: "DS"
  }
];

function HomeRatingsReviews({ isMobile }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemoData, setIsDemoData] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get("/reviews/latest", { skipLoader: true });
        if (active) {
          if (response?.data?.success && Array.isArray(response?.data?.data) && response.data.data.length > 0) {
            setReviews(response.data.data);
            setIsDemoData(false);
          } else {
            setReviews(fallbackReviews);
            setIsDemoData(true);
          }
        }
      } catch (err) {
        if (active) {
          setReviews(fallbackReviews);
          setIsDemoData(true);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchReviews();
    return () => {
      active = false;
    };
  }, []);

  const renderStars = (rating) => {
    const rounded = Math.round(rating);
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className="review-star" style={{ color: i < rounded ? "#FFC107" : "#CBD5E1", fontSize: "14px", marginRight: "2px" }}>
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <div className="reviews-section-loading" style={{ textAlign: "center", padding: "30px 20px", color: "#64748b", fontSize: "13.5px", fontWeight: 700 }}>
        Loading feedback...
      </div>
    );
  }

  return (
    <div className={`home-reviews-section ${isMobile ? "mobile-reviews-flow" : "desktop-reviews-flow"}`}>

      <div className={isMobile ? "mobile-reviews-list-scroll" : "desktop-reviews-grid"}>
        {reviews.map((rev) => (
          <div key={rev.id || rev.review_id} className="review-card">
            <div className="review-card-top">
              <div className="review-avatar-wrapper">
                {rev.avatarInitials || String(rev.name || "U").slice(0, 2).toUpperCase()}
              </div>
              <div className="review-user-info">
                <h4>{rev.name}</h4>
                <span>{rev.city || "Verified User"} &bull; {rev.createdAt || "recently"}</span>
              </div>
            </div>
            <div className="review-card-stars">
              {renderStars(rev.rating)}
              <span className="review-rating-num">{Number(rev.rating).toFixed(1)}</span>
            </div>
            <p className="review-text-content">
              {rev.review || rev.review_text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, logout } = useAuth();
  const { balance } = useWallet();
  const walletAmount = typeof balance === "number" || typeof balance === "string" ? Math.floor(Number(balance)) : 0;
  const { categories = [], loading: categoriesLoading } = useCategory();
  const [selectedLocation, setSelectedLocation] = useState(() => getSavedLocation());
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const requestIdRef = useRef(0);
  const loadMoreRef = useRef(null);

  const [mobileServices, setMobileServices] = useState([]);
  const [loadingMobileServices, setLoadingMobileServices] = useState(true);

  useSeo({
    title: "G9Expert | Discover Experts, Services, Offers and Tips",
    description:
      "Find verified experts, chat or call instantly, explore services, offers, and expert tips on G9Expert.",
    canonicalPath: "/user",
  });

  const city = selectedLocation?.city || "";
  const selectedCategoryName = selectedCategory?.name || "";

  const fetchFeed = useCallback(
    async ({ cursor = "", append = false } = {}) => {
      const requestId = ++requestIdRef.current;

      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
          setError("");
        }

        const response = await getHomeFeedApi({
          city,
          category_id: selectedCategory?.id || "",
          cursor,
          limit: FEED_LIMIT,
        });
        const payload = response?.data || {};

        if (requestId !== requestIdRef.current) return;

        setItems((current) => (append ? [...current, ...(payload.items || [])] : payload.items || []));
        setNextCursor(payload.nextCursor || null);
        setError("");
      } catch (err) {
        if (requestId !== requestIdRef.current) return;
        setError(err?.response?.data?.message || err.message || "Feed request failed");
        if (!append) setItems([]);
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [city, selectedCategory?.id]
  );

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  useEffect(() => {
    let active = true;
    const loadServices = async () => {
      try {
        setLoadingMobileServices(true);
        const response = await getAllServices();
        const payload = response?.data?.data || response?.data || [];
        if (active) {
          if (Array.isArray(payload) && payload.length > 0) {
            setMobileServices(payload.slice(0, 6));
          } else {
            setMobileServices([]);
          }
        }
      } catch (err) {
        console.error("Mobile trending services load failed", err);
      } finally {
        if (active) setLoadingMobileServices(false);
      }
    };
    loadServices();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleLocationChange = (event) => {
      setSelectedLocation(event.detail || {});
    };

    window.addEventListener("g9-location-changed", handleLocationChange);
    return () => window.removeEventListener("g9-location-changed", handleLocationChange);
  }, []);

  useEffect(() => {
    const anchor = loadMoreRef.current;
    if (!anchor || !nextCursor || loading || loadingMore) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && nextCursor) {
          fetchFeed({ cursor: nextCursor, append: true });
        }
      },
      { rootMargin: "600px 0px" }
    );

    observer.observe(anchor);
    return () => observer.disconnect();
  }, [fetchFeed, loading, loadingMore, nextCursor]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const suggestedExperts = useMemo(
    () => items.filter((item) => item.type === "expert_profile" || item.type === "promoted_expert"),
    [items]
  );
  const trendingServices = useMemo(
    () => items.filter((item) => item.type === "service_post"),
    [items]
  );
  const heroService = useMemo(() => {
    const fromFeed = items.find((item) => item.type === "service_post" || item.type === "service_offer")?.data;
    if (fromFeed) return fromFeed;
    if (mobileServices && mobileServices.length > 0) {
      return {
        title: mobileServices[0].title || mobileServices[0].name,
        price: mobileServices[0].price,
        expert_name: mobileServices[0].expert_name || "G9Expert Advisor",
        avg_rating: mobileServices[0].avg_rating || 4.9,
        slug: mobileServices[0].slug || mobileServices[0].id,
      };
    }
    return {
      title: "Income Tax & ITR Filing",
      price: 1499,
      expert_name: "CA Manoj Kumar",
      avg_rating: 4.8,
      slug: "",
    };
  }, [items, mobileServices]);

  const heroExpert = useMemo(() => {
    const expertsList = items.filter((item) => item.type === "expert_profile" || item.type === "promoted_expert");
    const sorted = [...expertsList].sort((a, b) => {
      const isOnlineA = a.data?.is_online || a.data?.online_status === "online" ? 1 : 0;
      const isOnlineB = b.data?.is_online || b.data?.online_status === "online" ? 1 : 0;
      return isOnlineB - isOnlineA;
    });
    if (sorted[0]?.data) return sorted[0].data;
    return {
      name: "Dr. Ananya Sharma",
      position: "Career & Relationship Advisor",
      avg_rating: 4.9,
      chat_per_minute: 20,
      call_per_minute: 40,
      online_status: "online",
      profile_photo: "",
      expert_id: "",
    };
  }, [items]);

  const heroPost = useMemo(() => {
    const fromFeed = items.find((item) => item.type === "tip_post")?.data;
    if (fromFeed) return fromFeed;
    return {
      title: "Quick Tip: How to save 30% on your business taxes this financial year.",
      expert_name: "CA Rajesh Mehta",
      expert_avatar: "",
    };
  }, [items]);

  const desktopServicesList = useMemo(() => {
    const list = items
      .filter((item) => item.type === "service_post" || item.type === "service_offer")
      .map((item) => item.data);
    
    if (list.length === 0 && mobileServices && mobileServices.length > 0) {
      return mobileServices.map(s => ({
        id: s.id,
        title: s.title || s.name,
        price: s.price,
        expert_name: s.expert_name || "G9Expert Advisor",
        avg_rating: s.avg_rating || 4.8,
        slug: s.slug,
        image: s.image || s.image_url,
      }));
    }
    
    if (list.length === 0) {
      return [
        { id: 1, title: "Income Tax & ITR Filing", price: 1499, expert_name: "CA Manoj Kumar", avg_rating: 4.8, slug: "" },
        { id: 2, title: "GST Registration & Filing", price: 2499, expert_name: "CA Rajesh Mehta", avg_rating: 4.9, slug: "" },
        { id: 3, title: "Business Legal Advisory", price: 1999, expert_name: "Adv. Sneha Iyer", avg_rating: 4.7, slug: "" },
      ];
    }
    return list;
  }, [items, mobileServices]);

  const desktopExpertsList = useMemo(() => {
    const list = items
      .filter((item) => item.type === "expert_profile" || item.type === "promoted_expert")
      .map((item) => item.data);

    const sorted = [...list].sort((a, b) => {
      const onlineA = a.is_online || a.online_status === "online" ? 1 : 0;
      const onlineB = b.is_online || b.online_status === "online" ? 1 : 0;
      return onlineB - onlineA;
    });

    if (sorted.length === 0) {
      return [
        { id: 1, name: "Dr. Ananya Sharma", position: "Career & Relationship Advisor", avg_rating: 4.9, chat_per_minute: 20, call_per_minute: 40, online_status: "online", experience: 8 },
        { id: 2, name: "CA Manoj Kumar", position: "Tax & Business Advisor", avg_rating: 4.8, chat_per_minute: 25, call_per_minute: 50, online_status: "online", experience: 10 },
        { id: 3, name: "Adv. Sneha Iyer", position: "Legal & Startup Consultant", avg_rating: 4.7, chat_per_minute: 30, call_per_minute: 60, online_status: "offline", experience: 6 },
      ];
    }
    return sorted;
  }, [items]);

  const desktopPostsList = useMemo(() => {
    return items
      .filter((item) => item.type === "tip_post")
      .map((item) => item.data);
  }, [items]);
  const desktopCategories = useMemo(() => {
    const source = Array.isArray(categories) ? categories : [];
    const sorted = [...source].sort((a, b) => {
      const indexA = categoryPresentation.findIndex((item) =>
        item.aliases.some((alias) => getCategoryText(a).includes(alias.toLowerCase()))
      );
      const indexB = categoryPresentation.findIndex((item) =>
        item.aliases.some((alias) => getCategoryText(b).includes(alias.toLowerCase()))
      );
      const safeA = indexA === -1 ? 99 : indexA;
      const safeB = indexB === -1 ? 99 : indexB;
      return safeA - safeB;
    });

    return sorted;
  }, [categories]);
  const featuredExpert = suggestedExperts[0]?.data || {};
  const featuredService = trendingServices[0]?.data || {};
  const featuredExpertName = featuredExpert.name || featuredExpert.expert_name || "Dr. Ananya Sharma";
  const featuredExpertCategory = featuredExpert.category_name || featuredExpert.position || "Career & Legal Expert";
  const featuredExpertPath = `/user/experts/${featuredExpert.expert_slug || featuredExpert.slug || featuredExpert.expert_id || featuredExpert.id || ""}`;
  const featuredServiceTitle = featuredService.title || featuredService.name || "Professional consultation package";
  const featuredServicePath = `/user/service-details/${featuredService.slug || featuredService.service_id || featuredService.id || ""}`;

  const openLogin = () => {
    const redirectPath = `${location.pathname}${location.search}${location.hash}`;
    navigate(`/user/auth?redirect=${encodeURIComponent(redirectPath)}`, {
      state: { from: location },
    });
  };

  const handleSearch = (query) => {
    navigate(buildUserSearchPath(query));
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTargetCategorySelect = (category) => {
    handleCategorySelect(category);
  };

  return (
    <main className="home-feed-page">
      <HomeHeader
        onMenuOpen={() => setMenuOpen(true)}
        onProfileOpen={() => navigate(isLoggedIn ? "/user/user-profile" : "/user/auth")}
        onLocationSelect={setSelectedLocation}
        onNotificationOpen={() => navigate("/user/notifications")}
        onWalletOpen={() => navigate("/user/wallet")}
        onFilterOpen={() => navigate("/user/search")}
        balance={balance}
        user={user}
      />

      {menuOpen ? (
        <div className="home-menu-layer">
          <button type="button" className="home-menu-backdrop" onClick={() => setMenuOpen(false)} aria-label="Close menu" />
          <aside className="home-menu-panel" aria-label="Home menu">
            <div className="home-menu-head">
              <div>
                <strong>{isLoggedIn ? user?.first_name || user?.name || "G9Expert User" : "G9Expert"}</strong>
                <span>{isLoggedIn ? `Wallet Rs ${Math.floor(Number(balance || 0))}` : "Login to manage consultations"}</span>
              </div>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X size={20} />
              </button>
            </div>

            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.label}
                  onClick={() => {
                    navigate(item.to);
                    setMenuOpen(false);
                  }}
                >
                  <Icon size={19} />
                  {item.label}
                </button>
              );
            })}

            <button type="button" onClick={() => navigate("/user/call-chat?page=1&mode=chat")}>
              <MessageCircle size={19} />
              Quick Chat
            </button>
            <button type="button" onClick={() => navigate("/user/call-chat?page=1&mode=call")}>
              <PhoneCall size={19} />
              Quick Call
            </button>
            <button type="button" onClick={() => navigate("/user/all-services")}>
              <BriefcaseBusiness size={19} />
              Quick Services
            </button>
            {isLoggedIn ? (
              <button type="button" onClick={logout}>
                <LogOut size={19} />
                Logout
              </button>
            ) : (
              <button type="button" onClick={openLogin}>
                <LogIn size={19} />
                Login
              </button>
            )}
          </aside>
        </div>
      ) : null}

      <div className="home-desktop-shell layout--with-right-sidebar">
        <HomeLeftSidebar
          isLoggedIn={isLoggedIn}
          user={user}
          balance={balance}
          onLogin={openLogin}
          onLogout={logout}
        />

        <section className="home-center-column">
          <HomeSearch onSearch={handleSearch} selectedCategoryName={selectedCategoryName} />
          <section className="home-hero-card" aria-label="G9Expert Marketplace Hero">
            {/* Desktop-specific layout */}
            <div className="desktop-hero-layout">
              <div className="desktop-hero-left">
                <span className="home-hero-eyebrow">
                  <ShieldCheck size={14} />
                  Trusted by <strong className="gold-text">50,000+</strong> Users
                </span>
                <h1 className="desktop-hero-title">
                  Find Trusted Experts <br /> for <span className="home-hero-highlight">Every Problem</span>
                </h1>
                <p className="desktop-hero-subtitle">
                  Chat, call, or book services from verified experts across 50+ categories.
                </p>
                
                {/* Desktop Hero Quick Action Buttons */}
                <div className="desktop-hero-actions-container">
                  <button type="button" className="desktop-hero-action-btn chat-btn" onClick={() => navigate("/user/call-chat?page=1&mode=chat")}>
                    <span className="action-btn-icon"><MessageCircle size={18} /></span>
                    <span>Chat</span>
                  </button>
                  <button type="button" className="desktop-hero-action-btn call-btn" onClick={() => navigate("/user/call-chat?page=1&mode=call")}>
                    <span className="action-btn-icon"><PhoneCall size={18} /></span>
                    <span>Call</span>
                  </button>
                  <button type="button" className="desktop-hero-action-btn service-btn" onClick={() => navigate("/user/all-services")}>
                    <span className="action-btn-icon"><BriefcaseBusiness size={18} /></span>
                    <span>Book Service</span>
                  </button>
                </div>
              </div>

              <div className="desktop-hero-right">
                <div className="hero-floating-visual-container">
                  <div className="glowing-orb orb-1"></div>
                  <div className="glowing-orb orb-2"></div>
                  
                  <div className="floating-card card-expert">
                    <div className="card-avatar-wrapper">
                      <span>JD</span>
                      <span className="status-dot online"></span>
                    </div>
                    <div className="card-info">
                      <h4>CA John Doe</h4>
                      <p>Tax &amp; Legal Expert</p>
                    </div>
                    <span className="rating-pill">★ 4.9</span>
                  </div>

                  <div className="floating-card card-chat">
                    <div className="chat-bubble-icon">💬</div>
                    <div className="card-info">
                      <h4>Active Chat</h4>
                      <p>Resolving query...</p>
                    </div>
                  </div>

                  <div className="floating-card card-call">
                    <div className="call-bubble-icon">📞</div>
                    <div className="card-info">
                      <h4>Direct Call</h4>
                      <p>Connecting now...</p>
                    </div>
                  </div>

                  <div className="floating-card card-service">
                    <div className="service-bubble-icon">📄</div>
                    <div className="card-info">
                      <h4>ITR Filing</h4>
                      <p>Completed successfully</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile-specific layout */}
            <div className="mobile-hero-layout">
              <span className="mobile-hero-badge">
                <ShieldCheck size={11} />
                Trusted by 50,000+ Users
              </span>
              <h1 className="mobile-hero-title">
                Find &amp; Consult <span className="home-hero-highlight">Verified Experts</span>
              </h1>
              <p className="mobile-hero-subtitle">
                Chat, call, or book top-rated expert services instantly with G9Expert.
              </p>
              
              <div className="mobile-hero-actions-row">
                <button type="button" className="mobile-action-card chat-btn" onClick={() => navigate("/user/call-chat?page=1&mode=chat")}>
                  <MessageCircle size={16} />
                  <span>Chat</span>
                </button>
                <button type="button" className="mobile-action-card call-btn" onClick={() => navigate("/user/call-chat?page=1&mode=call")}>
                  <PhoneCall size={16} />
                  <span>Call</span>
                </button>
                <button type="button" className="mobile-action-card service-btn" onClick={() => navigate("/user/all-services")}>
                  <BriefcaseBusiness size={16} />
                  <span>Book Service</span>
                </button>
              </div>
            </div>
          </section>
          {/* Desktop-only Structured Marketplace Sections */}
          <div className="desktop-only-marketplace-sections">
            
            {/* Section 2: Trending Category Section */}
            <div className="home-section-heading">
              <div>
                <h2>Explore by Category</h2>
              </div>
              <button type="button" onClick={() => navigate("/user/categories")}>
                View all categories
              </button>
            </div>
            <section className="home-target-categories" aria-label="Explore by Category">
              <button
                type="button"
                className={!selectedCategory ? "active" : ""}
                onClick={() => handleCategorySelect(null)}
              >
                <span>
                  <Grid3X3 size={24} />
                </span>
                <strong>All</strong>
              </button>
              {categoriesLoading
                ? Array.from({ length: 7 }).map((_, index) => (
                    <div className="home-target-category-skeleton" key={`desktop-category-skeleton-${index}`} />
                  ))
                : desktopCategories.map((category) => {
                    const Icon = getCategoryPresentation(category).icon;
                    const isActive = String(selectedCategory?.id || "") === String(category.id || "");

                    return (
                      <button
                        type="button"
                        key={category.id || category.slug || category.name}
                        className={isActive ? "active" : ""}
                        onClick={() => handleTargetCategorySelect(category)}
                      >
                        <span>
                          {category.image_url ? (
                            <img src={category.image_url} alt="" loading="lazy" />
                          ) : (
                            <Icon size={24} />
                          )}
                        </span>
                        <strong>{category.name}</strong>
                      </button>
                    );
                  })}
              {!categoriesLoading && desktopCategories.length === 0 ? (
                <div className="home-target-category-empty">No categories available</div>
              ) : null}
            </section>

            {/* Section 3: Top Services */}
            <section className="marketplace-section services-section">
              <div className="marketplace-section-header">
                <h2>Top Services</h2>
                <button type="button" onClick={() => navigate("/user/all-services")}>View All Services</button>
              </div>
              <div className="marketplace-grid services-grid">
                {desktopServicesList.slice(0, 3).map((svc, idx) => (
                  <div 
                    className="marketplace-service-card clickable-card" 
                    key={svc.id || svc.service_id || idx}
                    onClick={() => navigate(svc.slug || svc.id ? `/user/service-details/${svc.slug || svc.id}` : "/user/all-services")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="service-card-image">
                      {svc.image || svc.image_url ? (
                        <img src={svc.image || svc.image_url} alt="" />
                      ) : (
                        <div className="service-card-fallback-icon"><BriefcaseBusiness size={24} /></div>
                      )}
                    </div>
                    <div className="service-card-content">
                      <h3>{svc.title || svc.name}</h3>
                      <p className="expert-name">by {svc.expert_name || "Verified G9Expert"}</p>
                      <div className="service-card-meta">
                        <span className="rating"><Star size={13} fill="currentColor" /> {Number(svc.avg_rating || 4.8).toFixed(1)}</span>
                        <span className="price">{money(svc.price, "Rs 499")}</span>
                      </div>
                    </div>
                    <button className="book-service-btn" onClick={(e) => {
                      e.stopPropagation();
                      navigate(svc.slug || svc.id ? `/user/service-details/${svc.slug || svc.id}` : "/user/all-services");
                    }}>
                      Book Service
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4: Available Experts */}
            <section className="marketplace-section experts-section">
              <div className="marketplace-section-header">
                <h2>Available Experts</h2>
                <button type="button" onClick={() => navigate("/user/call-chat?page=1")}>View All Experts</button>
              </div>
              <div className="marketplace-grid experts-grid">
                {desktopExpertsList.slice(0, 3).map((exp, idx) => (
                  <div 
                    className="marketplace-expert-card clickable-card" 
                    key={exp.id || exp.expert_id || idx}
                    onClick={() => navigate(exp.expert_slug || exp.slug || exp.id ? `/user/experts/${exp.expert_slug || exp.slug || exp.id}` : "/user/call-chat?page=1")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="expert-card-top">
                      <div className="expert-avatar-wrapper">
                        {exp.profile_photo ? (
                          <img src={exp.profile_photo} alt="" />
                        ) : (
                          <div className="expert-avatar-fallback">{String(exp.name || exp.expert_name || "GE").slice(0, 2).toUpperCase()}</div>
                        )}
                        <span className={`status-dot ${exp.is_online || exp.online_status === "online" ? "online" : "offline"}`} />
                      </div>
                      <div className="expert-info">
                        <h3>
                          {exp.name || exp.expert_name}
                          {exp.is_verified !== false && <ShieldCheck size={14} className="verified-badge-icon" />}
                        </h3>
                        <p className="category">{exp.category_name || exp.position || "Expert Consultant"}</p>
                        <div className="rating-exp">
                          <span>★ {Number(exp.avg_rating || 4.8).toFixed(1)}</span>
                          <span>&bull; {exp.experience || 5}+ yrs exp</span>
                        </div>
                      </div>
                    </div>
                    <div className="expert-pricing-row">
                      <span>Chat: {money(exp.chat_per_minute, "Rs 20")}/m</span>
                      <span>Call: {money(exp.call_per_minute, "Rs 40")}/m</span>
                    </div>
                    <div className="expert-card-actions">
                      <button className="expert-action-chat" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/user/call-chat?page=1&mode=chat&expert_id=${exp.expert_id || exp.id || ""}`);
                      }}>Chat</button>
                      <button className="expert-action-call" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/user/call-chat?page=1&mode=call&expert_id=${exp.expert_id || exp.id || ""}`);
                      }}>Call</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 5: Tips / Expert Posts */}
            <section className="marketplace-section posts-section">
              <div className="marketplace-section-header">
                <h2>Expert Tips &amp; Guidance</h2>
                <span>Latest insights from consultants</span>
              </div>
              {desktopPostsList.length > 0 ? (
                <div className="marketplace-grid posts-grid">
                  {desktopPostsList.slice(0, 4).map((post, idx) => (
                    <div 
                      className="marketplace-post-card clickable-card" 
                      key={post.id || post.post_id || idx}
                      onClick={() => navigate(post.expert_slug || post.slug || post.expert_id ? `/user/experts/${post.expert_slug || post.slug || post.expert_id}` : "/user/call-chat?page=1")}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="post-card-header">
                        <div className="post-avatar">
                          {post.expert_avatar ? (
                            <img src={post.expert_avatar} alt="" />
                          ) : (
                            <span>{String(post.expert_name || "GE").slice(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="post-author-info">
                          <h4>{post.expert_name || "Expert Advisor"}</h4>
                          <span>{post.category_name || "Verified Consultant"}</span>
                        </div>
                      </div>
                      <div className="post-card-body">
                        <p>{post.title || post.description}</p>
                        {post.image && <img src={post.image} alt="" className="post-image" />}
                      </div>
                      <div className="post-card-footer">
                        <div className="post-stats">
                          <span>❤️ {post.likes_count || 0} Likes</span>
                          <span>💬 {post.comments_count || 0} Comments</span>
                        </div>
                        <button className="consult-btn" onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/user/call-chat?page=1&expert_id=${post.expert_id || ""}`);
                        }}>
                          Consult Expert
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="marketplace-posts-empty" style={{ textAlign: "center", padding: "30px 20px", color: "#64748b", fontWeight: 700, fontSize: "13.5px" }}>
                  No expert tips available yet.
                </div>
              )}
            </section>

            {/* Section 5.5: Ratings & Reviews (Desktop) */}
            <section className="marketplace-section reviews-section-desktop">
              <div className="marketplace-section-header">
                <h2>Ratings &amp; Reviews</h2>
                <span>Trusted feedback from G9Expert users</span>
              </div>
              <HomeRatingsReviews isMobile={false} />
            </section>

            {/* Section 6: Trust Strip */}
            <section className="marketplace-section trust-strip-section">
              <div className="home-trust-banner">
                <ShieldCheck size={24} />
                <div>
                  <strong>Secure, verified and wallet protected</strong>
                  <span>Profiles, payments, and consultation history stay organized in one trusted dashboard.</span>
                </div>
              </div>
            </section>
          </div>

          {/* Mobile-only Marketplace Body Flow */}
          <div className="mobile-only-marketplace-body">
            
            {/* 1. Explore Category horizontal scroll */}
            <div className="home-section-heading">
              <div>
                <h2>Explore Categories</h2>
                <span className="mobile-section-hint">Swipe to browse expert categories</span>
              </div>
              <div className="mobile-section-right">
                <span className="mobile-swipe-text">Swipe &rarr;</span>
                <button type="button" className="mobile-view-all-btn" onClick={() => navigate("/user/categories")}>
                  View all
                </button>
              </div>
            </div>
            <section className="mobile-target-categories" aria-label="Explore by Category">
              <button
                type="button"
                className={`mobile-category-chip-btn ${!selectedCategory ? "active" : ""}`}
                onClick={() => handleCategorySelect(null)}
              >
                <span>
                  <Grid3X3 size={20} />
                </span>
                <strong>All</strong>
              </button>
              {categoriesLoading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <div className="home-target-category-skeleton" key={`mobile-category-skeleton-${index}`} style={{ flex: "0 0 76px", width: "76px", minHeight: "72px" }} />
                  ))
                : desktopCategories.map((category) => {
                    const Icon = getCategoryPresentation(category).icon;
                    const isActive = String(selectedCategory?.id || "") === String(category.id || "");

                    return (
                      <button
                        type="button"
                        key={category.id || category.slug || category.name}
                        className={`mobile-category-chip-btn ${isActive ? "active" : ""}`}
                        onClick={() => handleTargetCategorySelect(category)}
                      >
                        <span>
                          {category.image_url ? (
                            <img src={category.image_url} alt="" loading="lazy" />
                          ) : (
                            <Icon size={20} />
                          )}
                        </span>
                        <strong>{category.name}</strong>
                      </button>
                    );
                  })}
            </section>

            {/* 2. Top Services Section */}
            <div className="home-section-heading">
              <div>
                <h2>Top Services</h2>
                <span className="mobile-section-hint">Swipe to book expert services</span>
              </div>
              <div className="mobile-section-right">
                <span className="mobile-swipe-text">Swipe &rarr;</span>
                <button type="button" className="mobile-view-all-btn" onClick={() => navigate("/user/all-services")}>
                  View all
                </button>
              </div>
            </div>
            <div className="mobile-services-list">
              {desktopServicesList.slice(0, 3).map((svc, idx) => (
                <div 
                  className="mobile-service-row-card clickable-card" 
                  key={svc.id || svc.service_id || idx}
                  onClick={() => navigate(svc.slug || svc.id ? `/user/service-details/${svc.slug || svc.id}` : "/user/all-services")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="mobile-service-img">
                    {svc.image || svc.image_url ? (
                      <img src={svc.image || svc.image_url} alt="" />
                    ) : (
                      <div className="mobile-service-fallback-icon"><BriefcaseBusiness size={20} /></div>
                    )}
                  </div>
                  <div className="mobile-service-info">
                    <h3>{svc.title || svc.name}</h3>
                    <p className="mobile-service-expert">by {svc.expert_name || "Verified G9Expert"}</p>
                    <div className="mobile-service-meta">
                      <span className="mobile-rating">★ {Number(svc.avg_rating || 4.8).toFixed(1)}</span>
                      <strong className="mobile-price">{money(svc.price, "Rs 499")}</strong>
                    </div>
                  </div>
                  <button className="mobile-service-book-btn" onClick={(e) => {
                    e.stopPropagation();
                    navigate(svc.slug || svc.id ? `/user/service-details/${svc.slug || svc.id}` : "/user/all-services");
                  }}>
                    Book
                  </button>
                </div>
              ))}
            </div>

            {/* 3. Available Experts Section */}
            <div className="home-section-heading">
              <div>
                <h2>Available Experts</h2>
                <span className="mobile-section-hint">Swipe to chat or call verified experts</span>
              </div>
              <div className="mobile-section-right">
                <span className="mobile-swipe-text">Swipe &rarr;</span>
                <button type="button" className="mobile-view-all-btn" onClick={() => navigate("/user/call-chat?page=1")}>
                  View all
                </button>
              </div>
            </div>
            <div className="mobile-experts-list">
              {desktopExpertsList.slice(0, 3).map((exp, idx) => (
                <div 
                  className="mobile-expert-row-card clickable-card" 
                  key={exp.id || exp.expert_id || idx}
                  onClick={() => navigate(exp.expert_slug || exp.slug || exp.id ? `/user/experts/${exp.expert_slug || exp.slug || exp.id}` : "/user/call-chat?page=1")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="mobile-expert-avatar-wrapper">
                    {exp.profile_photo ? (
                      <img src={exp.profile_photo} alt="" />
                    ) : (
                      <div className="mobile-avatar-fallback">{String(exp.name || exp.expert_name || "GE").slice(0, 2).toUpperCase()}</div>
                    )}
                    <span className={`status-dot ${exp.is_online || exp.online_status === "online" ? "online" : "offline"}`} />
                  </div>
                  <div className="mobile-expert-info">
                    <h3>
                      {exp.name || exp.expert_name}
                      {exp.is_verified !== false && <ShieldCheck size={12} className="verified-badge-icon" />}
                    </h3>
                    <p className="mobile-expert-category">{exp.category_name || exp.position || "Expert Consultant"}</p>
                    <div className="mobile-expert-meta">
                      <span>★ {Number(exp.avg_rating || 4.8).toFixed(1)}</span>
                      <span>&bull; {exp.experience || 5}+ yrs exp</span>
                    </div>
                  </div>
                  <div className="mobile-expert-actions-btns">
                    <button className="mobile-expert-chat-btn" onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/user/call-chat?page=1&mode=chat&expert_id=${exp.expert_id || exp.id || ""}`);
                    }}>Chat</button>
                    <button className="mobile-expert-call-btn" onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/user/call-chat?page=1&mode=call&expert_id=${exp.expert_id || exp.id || ""}`);
                    }}>Call</button>
                  </div>
                </div>
              ))}
            </div>

            {/* 4. Expert Tips & Guidance Section */}
            <div className="home-section-heading">
              <div>
                <h2>Expert Tips &amp; Guidance</h2>
                <span className="mobile-section-hint">Swipe to view expert posts and advice</span>
              </div>
              <div className="mobile-section-right">
                <span className="mobile-swipe-text">Swipe &rarr;</span>
              </div>
            </div>
            <div className="mobile-posts-list">
              {desktopPostsList.length > 0 ? (
                desktopPostsList.slice(0, 3).map((post, idx) => (
                  <div 
                    className="mobile-post-row-card clickable-card" 
                    key={post.id || post.post_id || idx}
                    onClick={() => navigate(post.expert_slug || post.slug || post.expert_id ? `/user/experts/${post.expert_slug || post.slug || post.expert_id}` : "/user/call-chat?page=1")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="mobile-post-header">
                      <div className="mobile-post-avatar">
                        {post.expert_avatar ? (
                          <img src={post.expert_avatar} alt="" />
                        ) : (
                          <span>{String(post.expert_name || "GE").slice(0, 2).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="mobile-post-author">
                        <h4>{post.expert_name || "Expert Advisor"}</h4>
                        <span>{post.category_name || "Verified Consultant"}</span>
                      </div>
                    </div>
                    <div className="mobile-post-body">
                      <p>{post.title || post.description}</p>
                      {post.image && <img src={post.image} alt="" className="mobile-post-img" />}
                    </div>
                    <div className="mobile-post-footer">
                      <div className="mobile-post-stats" onClick={(e) => e.stopPropagation()}>
                        <span>❤️ {post.likes_count || 0}</span>
                        <span>💬 {post.comments_count || 0}</span>
                      </div>
                      <button className="mobile-post-consult-btn" onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/user/call-chat?page=1&expert_id=${post.expert_id || ""}`);
                      }}>
                        Consult
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="mobile-posts-empty">
                  No expert tips available yet.
                </div>
              )}
            </div>

            {/* 4.5. Ratings & Reviews (Mobile) */}
            <div className="home-section-heading">
              <div>
                <h2>Ratings &amp; Reviews</h2>
                <span className="mobile-section-hint">Swipe to read user feedback</span>
              </div>
              <div className="mobile-section-right">
                <span className="mobile-swipe-text">Swipe &rarr;</span>
              </div>
            </div>
            <HomeRatingsReviews isMobile={true} />

            {/* 5. Mobile Trust Banner */}
            <section className="home-trust-banner mobile-trust-banner-only" style={{ margin: "16px 0 0" }}>
              <div className="mobile-trust-left">
                <div className="mobile-trust-icon-box">
                  <ShieldCheck size={24} />
                </div>
                <div className="mobile-trust-content">
                  <strong>Verified Experts. Secure Consultations.</strong>
                  <p>All experts are background verified. Your conversations and payments are 100% secure.</p>
                </div>
              </div>
              <button type="button" className="mobile-trust-arrow-btn" onClick={() => navigate("/user/about")}>
                →
              </button>
            </section>
          </div>
        </section>

        <HomeRightSidebar 
          experts={suggestedExperts.map(item => item.data)} 
          services={trendingServices.map(item => item.data)} 
          balance={balance} 
        />
      </div>
      <div className="home-footer-container">
        <Footer />
      </div>
    </main>
  );
}
