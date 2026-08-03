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
import CategorySection from "./components/CategorySection";
import ReelsSection from "./components/ReelsSection";
import ExpertTipsSection from "./components/ExpertTipsSection";
import HomeSkeleton from "./components/HomeSkeleton";
import { HomeLeftSidebar, HomeRightSidebar } from "./components/HomeSidebars";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { useCategory } from "../../../../shared/context/CategoryContext";
import { useWallet } from "../../../../shared/context/WalletContext";
import { useSeo } from "../../../../shared/seo/useSeo";
import { getHomeDashboardApi } from "../../../../shared/api/userApi/home.api";
import { hotToast } from "../../../../shared/utils/lazyNotifications";
import { buildUserSearchPath } from "../../components/search/searchUtils";
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

  const [dashboardData, setDashboardData] = useState({
    hero: null,
    categories: [],
    reels: [],
    posts: [],
    trustBanner: null,
  });
  const [loadingDashboard, setLoadingDashboard] = useState(true);

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
  }, []);

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
    <main className="home-page-container">
      <HomeHeader isLoggedIn={isLoggedIn} user={user} onLogin={openLogin} />

      <div className="home-desktop-shell layout--with-right-sidebar">
        <HomeLeftSidebar
          isLoggedIn={isLoggedIn}
          user={user}
          balance={balance}
          onLogin={openLogin}
          onLogout={logout}
        />

        <section className="home-center-column">
          {/* SEARCH BAR (NO CHANGES) */}
          <HomeSearch onSearch={handleSearch} selectedCategoryName={selectedCategory?.name || ""} />

          {/* HERO SECTION (NO CHANGES) */}
          <section className="home-hero-card" aria-label="G9Expert Marketplace Hero">
            <div className="desktop-hero-layout">
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
                      <span>GE</span>
                      <span className="status-dot online"></span>
                    </div>
                    <div className="card-info">
                      <h4>Verified Advisor</h4>
                      <p>Legal, Medical &amp; Tax</p>
                    </div>
                    <span className="rating-pill">★ 4.9</span>
                  </div>

                  <div className="floating-card card-chat">
                    <div className="chat-bubble-icon">💬</div>
                    <div className="card-info">
                      <h4>Instant Chat</h4>
                      <p>60s connection</p>
                    </div>
                  </div>

                  <div className="floating-card card-call">
                    <div className="call-bubble-icon">📞</div>
                    <div className="card-info">
                      <h4>Encrypted Call</h4>
                      <p>100% private</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mobile-hero-layout">
              <span className="mobile-hero-badge">
                <ShieldCheck size={11} />
                Trusted by 500,000+ Users
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

          {/* CATEGORIES SLIDER (NO CHANGES) */}
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

              {/* TRUST BANNER */}
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
        />
      </div>

      <div className="home-footer-container">
        <Footer />
      </div>
    </main>
  );
}
