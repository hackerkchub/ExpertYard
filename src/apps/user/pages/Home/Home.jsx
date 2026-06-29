import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  BriefcaseBusiness,
  History,
  Grid3X3,
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

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, logout } = useAuth();
  const { balance } = useWallet();
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

  return (
    <main className="home-feed-page">
      <HomeHeader
        onMenuOpen={() => setMenuOpen(true)}
        onProfileOpen={() => navigate(isLoggedIn ? "/user/user-profile" : "/user/auth")}
        onLocationSelect={setSelectedLocation}
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

      <div className="home-desktop-shell">
        <HomeLeftSidebar />

        <section className="home-center-column">
          <HomeSearch onSearch={handleSearch} selectedCategoryName={selectedCategoryName} />
          <QuickActions />
          <CategoryChips
            categories={categories}
            loading={categoriesLoading}
            selectedCategoryId={selectedCategory?.id}
            onSelect={handleCategorySelect}
          />
          <HomeFeed
            items={items}
            loading={loading}
            loadingMore={loadingMore}
            error={error}
            hasMore={Boolean(nextCursor)}
            loadMoreRef={loadMoreRef}
            onRetry={() => fetchFeed()}
          />
        </section>

        <HomeRightSidebar experts={suggestedExperts} services={trendingServices} />
      </div>
      <div className="home-footer-container">
        <Footer />
      </div>
    </main>
  );
}
