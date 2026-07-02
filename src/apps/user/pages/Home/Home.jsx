import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useLocation, useNavigate } from "react-router-dom";

import {
  Bell,
  BriefcaseBusiness,
  Grid3X3,
  History,
  Home as HomeIcon,
  LogIn,
  LogOut,
  MessageCircle,
  PhoneCall,
  UserRound,
  Wallet,
  X,
} from "lucide-react";

import "./Home.css";

import HomeHeader from "./components/HomeHeader";
import HomeSearch from "./components/HomeSearch";
import CategoryChips from "./components/CategoryChips";
import HomeBanner from "./components/HomeBanner";
import FeaturedExpert from "./components/FeaturedExpert";
import TrendingServices from "./components/TrendingServices";
import LatestPosts from "./components/LatestPosts";
// import SubscriptionPlans from "./components/SubscriptionPlans";
import WalletCard from "./components/WalletCard";
import PromoBanner from "./components/PromoBanner";
import TrustBanner from "./components/TrustBanner";
import QuickActions from "./components/QuickActions";
// import Footer from "../../components/Footer/Footer";

import {
    HomeLeftSidebar,
    HomeRightSidebar,
} from "./components/HomeSidebars";

import {
    useAuth,
} from "../../../../shared/context/UserAuthContext";

import {
    useWallet,
} from "../../../../shared/context/WalletContext";

import {
    useSeo,
} from "../../../../shared/seo/useSeo";

import {
    getHomeDashboardApi,
} from "../../../../shared/api/userApi/home.api";

import {
    buildUserSearchPath,
} from "../../components/search/searchUtils";

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, logout } = useAuth();
  const { balance } = useWallet();
  const [dashboard, setDashboard] = useState({
    banner: null,
    stats: {},
    categories: [],
    featuredExpert: null,
    recommendedExperts: [],
    trendingServices: [],
    latestPosts: [],
    subscriptionPlans: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useSeo({
    title: "G9Expert | Discover Experts, Services, Offers and Tips",
    description:
      "Find verified experts, chat or call instantly, explore services, offers, and expert tips on G9Expert.",
    canonicalPath: "/user",
  });

  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getHomeDashboardApi();
      const data = res?.data?.data || {};
      setDashboard({
        banner: data.banner || null,
        stats: data.stats || {},
        categories: data.categories || [],
        featuredExpert: data.featuredExpert || null,
        recommendedExperts: data.recommendedExperts || [],
        trendingServices: data.trendingServices || [],
        latestPosts: data.latestPosts || [],
        subscriptionPlans: data.subscriptionPlans || []
      });
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
        "Unable to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const sidebarExperts = useMemo(() => {
    return dashboard.recommendedExperts || [];
  }, [dashboard]);

  const sidebarServices = useMemo(() => {
    return dashboard.trendingServices || [];
  }, [dashboard]);

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
  };

  return (
    <main className="home-feed-page">
      <HomeHeader
        onMenuOpen={() => setMenuOpen(true)}
        onProfileOpen={() => navigate(isLoggedIn ? "/user/user-profile" : "/user/auth")}
        onLocationSelect={() => {}}
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

            <button
              type="button"
              onClick={() => {
                navigate("/user");
                setMenuOpen(false);
              }}
            >
              <HomeIcon size={19} />
              Home
            </button>
            <button
              type="button"
              onClick={() => {
                navigate("/user/all-services");
                setMenuOpen(false);
              }}
            >
              <BriefcaseBusiness size={19} />
              Services
            </button>
            <button
              type="button"
              onClick={() => {
                navigate("/user/wallet");
                setMenuOpen(false);
              }}
            >
              <Wallet size={19} />
              Wallet
            </button>
            <button
              type="button"
              onClick={() => {
                navigate("/user/categories");
                setMenuOpen(false);
              }}
            >
              <Grid3X3 size={19} />
              Category
            </button>
            <button
              type="button"
              onClick={() => {
                navigate("/user/chat-history");
                setMenuOpen(false);
              }}
            >
              <History size={19} />
              Consultations
            </button>
            <button
              type="button"
              onClick={() => {
                navigate("/user/notifications");
                setMenuOpen(false);
              }}
            >
              <Bell size={19} />
              Notifications
            </button>

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

      <div className="home-desktop-shell">
        <HomeLeftSidebar />

        <section className="home-center-column">
          {error ? (
            <div className="feed-state">
              <h3>Unable to load dashboard</h3>
              <p>{error}</p>
            </div>
          ) : (
            <>
              <HomeSearch
                onSearch={handleSearch}
                selectedCategoryName={selectedCategory?.name}
              />
              <QuickActions />
              <HomeBanner
                banner={dashboard.banner}
                loading={loading}
              />
              <CategoryChips
                categories={dashboard.categories}
                loading={loading}
                selectedCategoryId={selectedCategory?.id}
                onSelect={handleCategorySelect}
              />
              <FeaturedExpert
                expert={dashboard.featuredExpert}
                loading={loading}
              />
              <PromoBanner />
              {/* <TrustBanner /> */}
              <TrendingServices
                services={dashboard.trendingServices}
                loading={loading}
              />
              <LatestPosts
                posts={dashboard.latestPosts}
                loading={loading}
              />
              {/* <SubscriptionPlans
                plans={dashboard.subscriptionPlans}
                loading={loading}
              /> */}
              {/* <WalletCard
                balance={balance}
              /> */}
            </>
          )}
        </section>

        <HomeRightSidebar
          experts={sidebarExperts}
          services={sidebarServices}
          balance={balance}
        />
      </div>
      {/* <div className="home-footer-container">
        <Footer />
      </div> */}
    </main>
  );
}