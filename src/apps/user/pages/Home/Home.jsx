import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  BriefcaseBusiness,
  Heart,
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
  User,
  UserRound,
  Wallet,
  X,
  Gift,
  Film,
  Video,
  Play,
  Package,
  MessageSquare,
} from "lucide-react";

import "./Home.css";
import HomeHeader from "./components/HomeHeader";
import Footer from "../../components/Footer/Footer";
import HomeSearch from "./components/HomeSearch";
import QuickActions from "./components/QuickActions";
import CategoryChips from "./components/CategoryChips";
import CategorySection from "./components/CategorySection";
import ReelsSection from "./components/ReelsSection";
import ExpertTipsSection from "./components/ExpertTipsSection";
import HomeSkeleton from "./components/HomeSkeleton";
import { HomeLeftSidebar, HomeRightSidebar } from "./components/HomeSidebars";
import AskG9Modal from "../../../../shared/components/ai/AskG9Modal";
import AskG9HomeWidget from "../../../../shared/components/ai/AskG9HomeWidget";
import MobileBottomNav from "./components/MobileBottomNav";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useCategory } from "../../../../shared/context/CategoryContext";
import { useWallet } from "../../../../shared/context/WalletContext";
import { useSeo } from "../../../../shared/seo/useSeo";
import { getHomeDashboardApi } from "../../../../shared/api/userApi/home.api";
import { hotToast } from "../../../../shared/utils/lazyNotifications";
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
  { label: "History", to: "/user/chat-history", icon: History },
  { label: "My Orders", to: "/user/my-services", icon: Package },
  { label: "My Inquiries", to: "/user/my-inquiries", icon: MessageSquare },
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

const isNumericText = (value) => /^\d+$/.test(String(value || "").trim());

const getPostText = (post) =>
  post?.title ||
  post?.caption ||
  post?.description ||
  post?.content ||
  post?.text ||
  post?.post_text ||
  "";

const getPostExpertName = (post) => {
  const name =
    post?.expert_name ||
    post?.expertName ||
    post?.name ||
    post?.full_name ||
    post?.fullName ||
    post?.business_name ||
    post?.businessName ||
    post?.expert?.name ||
    post?.expert?.full_name ||
    "";
  return name && !isNumericText(name) ? name : "Expert";
};

const getPostExpertAvatar = (post) =>
  post?.expert_profile_picture ||
  post?.expertProfilePicture ||
  post?.profile_photo ||
  post?.profilePhoto ||
  post?.profile_picture ||
  post?.profilePicture ||
  post?.profile_image ||
  post?.profileImage ||
  post?.expert_avatar ||
  post?.avatar ||
  post?.expert?.profile_photo ||
  "";

const getPostMedia = (post) =>
  post?.media_url ||
  post?.mediaUrl ||
  post?.image_url ||
  post?.imageUrl ||
  post?.thumbnail_url ||
  post?.thumbnailUrl ||
  post?.video_url ||
  post?.videoUrl ||
  post?.image ||
  "";

const getPostExpertRoute = (post) => {
  const routeId =
    post?.expert_slug ||
    post?.expertSlug ||
    post?.expert?.slug ||
    post?.profile_slug ||
    post?.profileSlug ||
    post?.slug ||
    "";
  return routeId ? `/user/experts/${routeId}` : "";
};

const getPostId = (post) =>
  post?.post_id ||
  post?.postId ||
  post?.id ||
  post?.content_id ||
  post?.contentId ||
  null;

const formatPostDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Helper function to get initials from name
const getInitials = (name = "") => {
  if (!name) return "?";
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + (words[1]?.charAt(0) || "")).toUpperCase();
};

// Check if there's a valid profile photo
const hasValidPhoto = (photo) => {
  return photo && 
    !photo.includes("default") && 
    !photo.includes("placeholder") &&
    !photo.includes("avatar") &&
    photo.length > 10;
};

const normalizeExpertTipPost = (post = {}) => {
  const expertName = getPostExpertName(post);
  const text = getPostText(post);

  return {
    ...post,
    displayText: text,
    displayExpertName: expertName,
    displayAvatar: getPostExpertAvatar(post),
    displayMedia: getPostMedia(post),
    displayCategory:
      post?.category_name ||
      post?.categoryName ||
      post?.subcategory_name ||
      post?.subcategoryName ||
      post?.position ||
      post?.expert?.position ||
      "Verified Consultant",
    displayDate: formatPostDate(post?.created_at || post?.createdAt),
    displayLikes: Number(post?.likes_count ?? post?.likes ?? 0),
    displayComments: Number(post?.comments_count ?? post?.comment_count ?? post?.comments ?? 0),
    likes_count: Number(post?.likes_count ?? post?.likes ?? 0),
    comments_count: Number(post?.comments_count ?? post?.comment_count ?? post?.comments ?? 0),
    displayPostId: getPostId(post),
    displayLiked: Boolean(post?.is_liked ?? post?.isLiked ?? post?.liked),
    displayRoute: getPostExpertRoute(post),
  };
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
  { id: "fb-1", name: "Rohit Sharma", city: "Mumbai, MH", rating: 4.9, review: "Doctor consultation was quick and helpful.", avatarInitials: "RS" },
  { id: "fb-2", name: "Priya Mehta", city: "Delhi", rating: 4.8, review: "Expert responded on time and guided me properly.", avatarInitials: "PM" },
  { id: "fb-3", name: "Ankit Verma", city: "Bangalore, KA", rating: 4.7, review: "Service booking process was simple and smooth.", avatarInitials: "AV" },
  { id: "fb-4", name: "Neha Singh", city: "Jaipur, RJ", rating: 4.9, review: "I got clear advice for my career confusion.", avatarInitials: "NS" },
  { id: "fb-5", name: "Aman Gupta", city: "Indore, MP", rating: 5.0, review: "Good platform for trusted online consultation.", avatarInitials: "AG" },
];

function HomeRatingsReviews({ isMobile }) {
  const [reviews, setReviews] = useState(fallbackReviews);

  useEffect(() => {
    let active = true;
    axiosInstance.get("/reviews/latest", { skipLoader: true })
      .then((res) => {
        if (active && res?.data?.success && Array.isArray(res?.data?.data) && res.data.data.length > 0) {
          setReviews(res.data.data);
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  return (
    <div className={`home-reviews-container ${isMobile ? "mobile-reviews" : "desktop-reviews"}`}>
      <div className="reviews-header-row">
        <h3 className="reviews-title">⭐ Customer Ratings & Feedback</h3>
        <span className="reviews-badge">Over 50,000+ Happy Consultations</span>
      </div>

      <div className="reviews-cards-scroll">
        {reviews.slice(0, 6).map((rev, idx) => (
          <div key={rev.id || idx} className="home-review-card">
            <div className="review-card-top">
              <div className="review-avatar-circle">
                {rev.avatarInitials || String(rev.name || "U").slice(0, 2).toUpperCase()}
              </div>
              <div className="review-user-info">
                <strong>{rev.name || "Verified User"}</strong>
                <span>{rev.city || "India"}</span>
              </div>
              <div className="review-rating-star">
                ★ {Number(rev.rating || 5.0).toFixed(1)}
              </div>
            </div>
            <p className="review-comment">"{rev.review || "Great experience consulting experts on G9Expert."}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { user, isLoggedIn, logout } = useAuth();
  const { balance } = useWallet();
  const { categories, selectedCategory, setSelectedCategory, categoriesLoading } = useCategory();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [askG9Open, setAskG9Open] = useState(false);
  const [askG9Prompt, setAskG9Prompt] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const loadMoreRef = useRef(null);
  const footerRef = useRef(null);
  const [isNearFooter, setIsNearFooter] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearFooter(entry.isIntersecting);
      },
      { rootMargin: "0px 0px -50px 0px", threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const [items, setItems] = useState([]);
  const [mobileServices, setMobileServices] = useState([]);
  const [expertTipsPosts, setExpertTipsPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);

  const [likedTips, setLikedTips] = useState({});
  const [likeLockByPost, setLikeLockByPost] = useState({});
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);
  const [loadingCommentsByPost, setLoadingCommentsByPost] = useState({});
  const [tipComments, setTipComments] = useState({});
  const [commentTextByPost, setCommentTextByPost] = useState({});

  const fetchFeed = useCallback(({ cursor, append } = {}) => {}, []);
  const handleTargetCategorySelect = (category) => {
    setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTipLike = (event, post) => { event?.stopPropagation?.(); };
  const handleTipCommentsToggle = (event, post) => { event?.stopPropagation?.(); };
  const handleTipCommentSubmit = (event, post) => { event?.preventDefault?.(); event?.stopPropagation?.(); };
  const handleTipProfileClick = (event, post) => {
    event?.stopPropagation?.();
    if (post?.displayRoute) navigate(post.displayRoute);
  };

  const [dashboardData, setDashboardData] = useState({
    hero: null,
    categories: [],
    reels: [],
    posts: [],
    trustBanner: null,
  });
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  const homeReels = dashboardData?.reels || [];
  const expertTipsLoading = loadingDashboard;
  const expertTipsError = null;

  useSeo({
    title: "G9Expert - Find Trusted Legal, Astrologer, Medical & Business Experts",
    description: "Find verified experts, chat or call instantly, explore services, offers, and expert tips on G9Expert.",
    canonicalPath: "/user",
  });

  useEffect(() => {
    let active = true;
    getHomeDashboardApi()
      .then((res) => {
        if (!active) return;
        const payload = res?.data?.data || res?.data || {};
        setDashboardData({
          hero: payload.hero || null,
          categories: Array.isArray(payload.categories) ? payload.categories : [],
          reels: Array.isArray(payload.reels) ? payload.reels : [],
          posts: Array.isArray(payload.posts) ? payload.posts : [],
          trustBanner: payload.trustBanner || null,
        });
      })
      .catch((err) => {
        console.error("Dashboard API error:", err);
      })
      .finally(() => {
        if (active) setLoadingDashboard(false);
      });

    return () => {
      active = false;
    };
  }, [user?.id, user?.user_id]);

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
    const fromFeed = items.find((item) => item.type === "expert_post")?.data;
    if (fromFeed) return fromFeed;
    return null;
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

    return sorted;
  }, [items]);

  const desktopPostsList = useMemo(() => {
    const directPosts = expertTipsPosts.map(normalizeExpertTipPost);
    if (directPosts.length > 0) return directPosts;

    return items
      .filter((item) => item.type === "expert_post")
      .map((item) => normalizeExpertTipPost(item.data));
  }, [expertTipsPosts, items]);
  
  const desktopCategories = useMemo(() => {
    const source = Array.isArray(categories) ? categories : [];
    return [...source].sort((a, b) => Number(a.display_order || 0) - Number(b.display_order || 0));
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

  // Filter categories if user clicks a category chip in hero slider
  const displayedCategories = useMemo(() => {
    if (!selectedCategory || !selectedCategory.id) {
      return dashboardData.categories;
    }
    return dashboardData.categories.filter(
      (cat) => String(cat.id) === String(selectedCategory.id)
    );
  }, [dashboardData.categories, selectedCategory]);

  return (
    <main className="home-feed-page home-page-container g9-home-page">
      <HomeHeader
        isLoggedIn={isLoggedIn}
        user={user}
        balance={balance}
        onLogin={openLogin}
        onLogout={logout}
        onMenuOpen={() => setMenuOpen(true)}
        onProfileOpen={() => navigate(isLoggedIn ? "/user/user-profile" : "/user/auth")}
        onLocationSelect={setSelectedLocation}
        onNotificationOpen={() => navigate("/user/notifications")}
        onWalletOpen={() => navigate("/user/wallet")}
        onFilterOpen={() => navigate("/user/search")}
      />
      {menuOpen ? (
        <div className="home-menu-layer">
          <button type="button" className="home-menu-backdrop" onClick={() => setMenuOpen(false)} aria-label="Close menu" />
          <aside className="home-menu-panel" aria-label="Home menu">
            {/* Gmail App Header Banner */}
            <div className="home-menu-head">
              <div
                className="home-menu-profile"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate(isLoggedIn ? "/user/user-profile" : "/user/auth");
                  setMenuOpen(false);
                }}
                role="button"
                tabIndex={0}
                title="View Profile"
              >
                <div className="home-menu-avatar">
                  {user?.profile_photo ? (
                    <img src={user.profile_photo} alt={user?.name || "User"} />
                  ) : (
                    <span>{(user?.first_name || user?.name || "G")[0].toUpperCase()}</span>
                  )}
                </div>
                <div className="home-menu-user-info">
                  <strong>{isLoggedIn ? user?.full_name || user?.first_name || user?.name || "G9Expert User" : "G9Expert"}</strong>
                  <span className="home-menu-sub">
                    {isLoggedIn ? (
                      <span className="home-menu-wallet-chip">₹ Wallet: ₹{Math.floor(Number(balance || 0))}</span>
                    ) : (
                      "Login for full access"
                    )}
                  </span>
                </div>
              </div>
              <button type="button" className="home-menu-close-btn" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Gmail Drawer Body */}
            <div className="home-menu-scrollable-body">
              <div className="home-menu-section-title">Navigation</div>
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <button
                    type="button"
                    key={item.label}
                    className={`home-menu-item ${isActive ? "active" : ""}`}
                    onClick={() => {
                      navigate(item.to);
                      setMenuOpen(false);
                    }}
                  >
                    <Icon size={20} className="menu-item-icon" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div className="home-menu-divider" />
              <div className="home-menu-section-title">Quick Actions</div>

              <button type="button" className="home-menu-item" onClick={() => { navigate("/user/call-chat?page=1&mode=chat"); setMenuOpen(false); }}>
                <MessageCircle size={20} className="menu-item-icon" />
                <span>Quick Chat</span>
              </button>
              <button type="button" className="home-menu-item" onClick={() => { navigate("/user/call-chat?page=1&mode=call"); setMenuOpen(false); }}>
                <PhoneCall size={20} className="menu-item-icon" />
                <span>Quick Call</span>
              </button>
              <button type="button" className="home-menu-item" onClick={() => { navigate("/user/call-chat?page=1&mode=video"); setMenuOpen(false); }}>
                <Video size={20} className="menu-item-icon" />
                <span>Quick Video</span>
              </button>
              <button type="button" className="home-menu-item" onClick={() => { navigate("/user/all-services"); setMenuOpen(false); }}>
                <BriefcaseBusiness size={20} className="menu-item-icon" />
                <span>Quick Services</span>
              </button>

              <div className="home-menu-divider" />
              <div className="home-menu-section-title">Account</div>

              {isLoggedIn ? (
                <>
                  <button
                    type="button"
                    className={`home-menu-item ${location.pathname === "/user/user-profile" ? "active" : ""}`}
                    onClick={() => {
                      navigate("/user/user-profile");
                      setMenuOpen(false);
                    }}
                  >
                    <User size={20} className="menu-item-icon" />
                    <span>Profile</span>
                  </button>
                  <button type="button" className="home-menu-item logout-item" onClick={() => { logout(); setMenuOpen(false); }}>
                    <LogOut size={20} className="menu-item-icon" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <button type="button" className="home-menu-item login-item" onClick={() => { openLogin(); setMenuOpen(false); }}>
                  <LogIn size={20} className="menu-item-icon" />
                  <span>Login / Register</span>
                </button>
              )}
            </div>
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
          isNearFooter={isNearFooter}
        />

        <section className="home-center-column">
          <section className="home-hero-card" aria-label="G9Expert Marketplace Hero">
            <div className="desktop-hero-layout">
              {/* LEFT CONTENT */}
              <div className="desktop-hero-left">
                <span className="home-hero-eyebrow">
                  <ShieldCheck size={14} />
                  Trusted by <strong className="gold-text">500,000+</strong> Users
                </span>

                <h1 className="desktop-hero-title">
                  Find Trusted Experts <br /> for <span className="home-hero-highlight">Every Problem</span>
                </h1>

                <p className="desktop-hero-subtitle">
                  Chat, call, or book services from verified experts across 50+ categories.
                </p>

                {/* 2x2 ACTION BUTTONS GRID */}
                <div className="desktop-hero-actions-grid">
                  <button type="button" className="desktop-action-btn chat-btn" onClick={() => navigate("/user/call-chat?page=1&mode=chat")}>
                    <MessageCircle size={16} />
                    <span>Chat</span>
                  </button>

                  <button type="button" className="desktop-action-btn call-btn" onClick={() => navigate("/user/call-chat?page=1&mode=call")}>
                    <PhoneCall size={16} />
                    <span>Call</span>
                  </button>

                  <button type="button" className="desktop-action-btn video-btn" onClick={() => navigate("/user/call-chat?page=1&mode=video")}>
                    <Video size={16} />
                    <span>Video Call</span>
                  </button>

                  <button type="button" className="desktop-action-btn service-btn" onClick={() => navigate("/user/all-services")}>
                    <BriefcaseBusiness size={16} />
                    <span>Book Service</span>
                  </button>
                </div>
              </div>

              {/* RIGHT CONTENT: INTEGRATED INFORMATION PANEL */}
              <div className="desktop-hero-right">
                <div className="hero-trust-info-panel">
                  {/* TOP ROW: Instant Chat & Audio Call */}
                  <div className="info-panel-top-row">
                    <div className="info-chip">
                      <div className="info-chip-icon chip-blue">
                        <MessageCircle size={14} />
                      </div>
                      <div className="info-chip-text">
                        <strong>Instant Chat</strong>
                        <span>&lt; 60s response</span>
                      </div>
                    </div>

                    <div className="info-chip">
                      <div className="info-chip-icon chip-green">
                        <PhoneCall size={14} />
                      </div>
                      <div className="info-chip-text">
                        <strong>Audio Call</strong>
                        <span>100% Private</span>
                      </div>
                    </div>
                  </div>

                  {/* CENTER EMBLEM BADGE */}
                  <div className="info-panel-center-badge">
                    <div className="center-shield-wrap">
                      <ShieldCheck size={20} color="#818CF8" />
                    </div>
                    <div className="center-badge-text">
                      <strong>✓ Verified Network</strong>
                      <span>500+ Certified Advisors</span>
                    </div>
                  </div>

                  {/* MIDDLE ROW: HD Video & 50+ Services */}
                  <div className="info-panel-middle-row">
                    <div className="info-chip">
                      <div className="info-chip-icon chip-purple">
                        <Video size={14} />
                      </div>
                      <div className="info-chip-text">
                        <strong>HD Video</strong>
                        <span>Face-to-face</span>
                      </div>
                    </div>

                    <div className="info-chip">
                      <div className="info-chip-icon chip-amber">
                        <BriefcaseBusiness size={14} />
                      </div>
                      <div className="info-chip-text">
                        <strong>50+ Services</strong>
                        <span>Legal, Tax, Health</span>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM MICRO-STATS BAR */}
                  <div className="info-panel-stats-bar">
                    <div className="panel-stat-item">
                      <strong>500K+</strong>
                      <span>Trusted Users</span>
                    </div>
                    <div className="panel-stat-sep"></div>
                    <div className="panel-stat-item">
                      <strong>4.9★</strong>
                      <span>Avg Rating</span>
                    </div>
                    <div className="panel-stat-sep"></div>
                    <div className="panel-stat-item">
                      <strong>&lt; 60s</strong>
                      <span>Avg Connect</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mobile-hero-layout">
              {/* Trust Badge (Solid styling) */}
              <div className="mobile-hero-trust-badge">
                <ShieldCheck size={14} color="#4ade80" fill="none" />
                <span>Trusted by 500,000+ Users</span>
              </div>

              {/* Headline */}
              <h1 className="mobile-hero-title">
                Find &amp; Consult <br />
                <span className="mobile-hero-blue-text">Verified Experts</span>
              </h1>

              {/* Subtitle */}
              <p className="mobile-hero-subtitle">
                Get expert help instantly.
              </p>

              {/* Action Grid (4 Horizontal Action Buttons) */}
              <div className="mobile-hero-action-grid">
                {/* Action 1: Chat */}
                <button 
                  type="button" 
                  className="mobile-hero-card"
                  onClick={() => navigate("/user/call-chat?page=1&mode=chat")}
                >
                  <div className="hero-card-icon-wrap chat-icon-wrap">
                    <MessageSquare size={20} color="#FFFFFF" strokeWidth={2.2} />
                  </div>
                  <span className="hero-card-label">Chat</span>
                </button>

                {/* Action 2: Call */}
                <button 
                  type="button" 
                  className="mobile-hero-card"
                  onClick={() => navigate("/user/call-chat?page=1&mode=call")}
                >
                  <div className="hero-card-icon-wrap call-icon-wrap">
                    <PhoneCall size={20} color="#FFFFFF" strokeWidth={2.2} />
                  </div>
                  <span className="hero-card-label">Call</span>
                </button>

                {/* Action 3: Video */}
                <button 
                  type="button" 
                  className="mobile-hero-card"
                  onClick={() => navigate("/user/call-chat?page=1&mode=video")}
                >
                  <div className="hero-card-icon-wrap video-icon-wrap">
                    <Video size={20} color="#FFFFFF" strokeWidth={2.2} />
                  </div>
                  <span className="hero-card-label">Video</span>
                </button>

                {/* Action 4: Service */}
                <button 
                  type="button" 
                  className="mobile-hero-card"
                  onClick={() => navigate("/user/all-services")}
                >
                  <div className="hero-card-icon-wrap service-icon-wrap">
                    <BriefcaseBusiness size={20} color="#FFFFFF" strokeWidth={2.2} />
                  </div>
                  <span className="hero-card-label">Service</span>
                </button>
              </div>
            </div>
          </section>

          {/* ASK G9 AI SEARCH WIDGET (SOLE HOMEPAGE SEARCH) */}
          <AskG9HomeWidget onOpenModal={() => setAskG9Open(true)} />

          {/* CATEGORIES SLIDER */}
          <CategoryChips
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
            loading={categoriesLoading}
          />

          {/* REDESIGNED HOMEPAGE CONTENT */}
          {loadingDashboard ? (
            <HomeSkeleton />
          ) : (
            <div className="homepage-redesign-feed">
              {/* CATEGORY WISE HOMEPAGE SECTIONS */}
              {displayedCategories.map((cat) => (
                <CategorySection key={cat.id || cat.slug} category={cat} />
              ))}

              {/* EXPERT REELS */}
              {dashboardData.reels.length > 0 && (
                <ReelsSection reels={dashboardData.reels} />
              )}

              {/* EXPERT TIPS */}
              {dashboardData.posts.length > 0 && (
                <ExpertTipsSection posts={dashboardData.posts} />
              )}

              {/* RATINGS & REVIEWS */}
              <HomeRatingsReviews isMobile={false} />

              <section className="marketplace-section trust-strip-section" style={{ margin: "24px 0" }}>
                <div className="home-trust-banner">
                  <ShieldCheck size={28} color="#059669" />
                  <div>
                    <strong>{dashboardData.trustBanner?.title || "100% Verified Experts & Money Back Guarantee"}</strong>
                    <span>{dashboardData.trustBanner?.subtitle || "Instant consultation with guaranteed privacy, secure payments, and 24/7 support."}</span>
                  </div>
                </div>
              </section>
            </div>
          )}
        </section>

        <HomeRightSidebar
          experts={dashboardData.categories.flatMap((c) => c.experts || []).slice(0, 5)}
          services={dashboardData.categories.flatMap((c) => c.services || []).slice(0, 5)}
          balance={balance}
          isNearFooter={isNearFooter}
        />
      </div>

      {/* FULL WIDTH FOOTER OUTSIDE DESKTOP SHELL */}
      <div ref={footerRef} className="full-width-footer-wrapper">
        <Footer />
      </div>

      <AskG9Modal
        isOpen={askG9Open}
        onClose={() => setAskG9Open(false)}
        initialPrompt={askG9Prompt}
      />
    </main>
  );
}