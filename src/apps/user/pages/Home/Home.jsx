import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SEOHead from "../../../../shared/components/SEO/SEOHead";
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
import HeroSearch from "./components/HeroSearch/HeroSearch";
import CategoryGrid from "./components/CategoryGrid/CategoryGrid";
import PopularServicesSection from "./components/PopularServices/PopularServicesSection";
import CategorySection from "./components/CategorySection";
import CompactDirectoryFeed from "./components/CompactDirectory/CompactDirectoryFeed";
import ReelsSection from "./components/ReelsSection";
import ExpertTipsSection from "./components/ExpertTipsSection";
import PremiumCenterLoader from "../../../../shared/components/Loader/PremiumCenterLoader";
import { HomeLeftSidebar, HomeRightSidebar } from "./components/HomeSidebars";
import AskG9Modal from "../../../../shared/components/ai/AskG9Modal";
import AskG9HomeWidget from "../../../../shared/components/ai/AskG9HomeWidget";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useCategory } from "../../../../shared/context/CategoryContext";
import { useWallet } from "../../../../shared/context/WalletContext";
import { useNotifications } from "../../../../shared/hooks/useNotifications";
import { getHomeDashboardApi } from "../../../../shared/api/userApi/home.api";
import { hotToast } from "../../../../shared/utils/lazyNotifications";
import { buildUserSearchPath } from "../../components/search/searchUtils";

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

function HomeRatingsReviews({ isMobile }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    let active = true;
    axiosInstance.get("/reviews/latest", { skipLoader: true })
      .then((res) => {
        if (active && res?.data?.success && Array.isArray(res?.data?.data) && res.data.data.length > 0) {
          setReviews(res.data.data);
        }
      })
      .catch(() => { });
    return () => { active = false; };
  }, []);

  if (!reviews || reviews.length === 0) {
    return null;
  }

  return (
    <div className={`home-reviews-container ${isMobile ? "mobile-reviews" : "desktop-reviews"}`}>
      <div className="reviews-header-row">
        <h3 className="reviews-title">⭐ Customer Ratings & Feedback</h3>
        <span className="reviews-badge">Verified Consultations</span>
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
  const { categories, loading: categoriesLoading } = useCategory() || {};
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const currentUserId = user?.id || user?.user_id;
  const { unread: notificationCount } = useNotifications({
    panel: "user",
    userId: isLoggedIn && currentUserId ? currentUserId : null,
  });

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

  const fetchFeed = useCallback(({ cursor, append } = {}) => { }, []);
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

  // Home uses SEOHead directly to guarantee single canonicalUrl="https://g9expert.com/"

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
    if (!menuOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

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
    if (
      selectedCategory &&
      (String(selectedCategory.id) === String(category?.id) ||
        (selectedCategory.slug && selectedCategory.slug === category?.slug))
    ) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
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
      <SEOHead
        title="Verified Experts for Online Consultation | G9EXPERT"
        description="Connect with verified experts online for legal, health, finance, career, astrology, property, and tax services on G9EXPERT."
        canonicalUrl="https://g9expert.com/"
      />
      <HomeHeader
        isLoggedIn={isLoggedIn}
        user={user}
        balance={balance}
        notificationCount={notificationCount}
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
          {loadingDashboard ? (
            <PremiumCenterLoader />
          ) : (
            <>
              {/* COMPACT DIRECTORY FEED (REFERENCE SPECIFICATION) */}
              <CompactDirectoryFeed
                categories={categories}
                dashboardData={dashboardData}
                loading={loadingDashboard}
                selectedCategoryId={selectedCategory?.id}
                onSelectCategory={handleCategorySelect}
                onOpenAskG9={() => setAskG9Open(true)}
              />

              {/* EXPERT REELS (COMMUNITY VIDEO FEED) */}
              {dashboardData.reels?.length > 0 && (
                <div style={{ marginTop: "8px" }}>
                  <ReelsSection reels={dashboardData.reels} />
                </div>
              )}

              {/* EXPERT TIPS (COMMUNITY ADVICE POSTS) */}
              {dashboardData.posts?.length > 0 && (
                <div style={{ marginTop: "8px" }}>
                  <ExpertTipsSection posts={dashboardData.posts} />
                </div>
              )}

              {/* ASK G9 AI SEARCH ASSISTANT */}
              <div style={{ padding: "0 16px", marginTop: "12px" }}>
                <AskG9HomeWidget onOpenModal={() => setAskG9Open(true)} />
              </div>

              {/* RATINGS & REVIEWS (REAL REVIEWS ONLY) */}
              <HomeRatingsReviews isMobile={false} />

              {/* VERIFIED TRUST STRIP */}
              <section className="marketplace-section trust-strip-section" style={{ margin: "20px 16px" }}>
                <div className="home-trust-banner">
                  <ShieldCheck size={28} color="#059669" />
                  <div>
                    <strong>{dashboardData.trustBanner?.title || "Verified Experts & Transparent Consultation"}</strong>
                    <span>{dashboardData.trustBanner?.subtitle || "Instant chat, call, or video consultation with privacy and secure payments."}</span>
                  </div>
                </div>
              </section>
            </>
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