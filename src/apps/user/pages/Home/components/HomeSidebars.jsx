import React from "react";
import { Link, NavLink } from "react-router-dom";
import {
  Bell,
  BriefcaseBusiness,
  CreditCard,
  Film,
  Grid3X3,
  Home,
  LogIn,
  LogOut,
  Settings,
  Sparkles,
  Users,
  Star,
  Gift,
  X,
  Phone,
} from "lucide-react";
import logo from "../../../../../assets/logo.webp";
import { getAllServices } from "../../../../../shared/api/service.api";

const navItems = [
  { label: "Home", to: "/user", icon: Home, end: true },
  { label: "Reel", to: "/user/reels", icon: Film },
  { label: "Experts", to: "/user/call-chat?page=1", icon: Users },
  { label: "Services", to: "/user/all-services", icon: BriefcaseBusiness },
  { label: "Category", to: "/user/categories", icon: Grid3X3 },
  { label: "Wallet", to: "/user/wallet", icon: CreditCard },
  { label: "My Consultations", to: "/user/chat-history", icon: Sparkles },
  { label: "My Services", to: "/user/my-services", icon: BriefcaseBusiness },
  { label: "Notifications", to: "/user/notifications", icon: Bell },
  { label: "Settings", to: "/user/user-profile", icon: Settings },
];

const trendingServicesData = [
  { title: "Income Tax Filing", subtitle: "by CA Experts", price: "₹ 1,499" },
  { title: "Business Registration", subtitle: "by Legal Advisors", price: "₹ 2,999" },
  { title: "Birth Chart Analysis", subtitle: "by Astrologers", price: "₹ 499" },
  { title: "Logo & Brand Design", subtitle: "by Branding Experts", price: "₹ 2,499" },
];

const recommendedExpertsData = [
  { name: "Himanshu Dhote", position: "Finance Consultant", price: "₹ 50/min", rating: "4.9", reviews: "124" },
  { name: "Acharya Nishu kaushik", position: "Astrologer", price: "₹ 40/min", rating: "4.8", reviews: "98" },
  { name: "Dr. Amit Srivastava", position: "Psychologist", price: "₹ 65/min", rating: "4.9", reviews: "156" },
];

export function HomeLeftSidebar({ isLoggedIn = false, user, balance = 0, onLogin, onLogout }) {
  const accountName = isLoggedIn
    ? user?.first_name || user?.name || "G9Expert User"
    : "G9Expert";
  const accountSubtext = isLoggedIn
    ? `Wallet Rs ${Math.floor(Number(balance || 0))}`
    : "Login to manage consultations";

  return (
    <aside className="home-left-sidebar" aria-label="Home navigation">
      <Link className="home-sidebar-logo" to="/user" aria-label="G9Expert home">
        <img src={logo} alt="G9Expert" />
      </Link>

      <div className="home-sidebar-account">
        <strong>{accountName}</strong>
        <span>{accountSubtext}</span>
      </div>

      <div className="home-sidebar-card home-sidebar-card--nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.label} to={item.to} end={item.end}>
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        <div className="home-sidebar-divider" />

        <button
          type="button"
          className="home-sidebar-auth"
          onClick={isLoggedIn ? onLogout : onLogin}
        >
          {isLoggedIn ? <LogOut size={20} /> : <LogIn size={20} />}
          <span>{isLoggedIn ? "Logout" : "Login"}</span>
        </button>
      </div>

      <div className="home-sidebar-promo">
        <span>
          <Sparkles size={20} />
        </span>
        <strong>100% Verified Experts</strong>
        <p>Safe. Secure. Trusted.</p>
        <small>Consult with confidence.</small>
        <Link to="/user/call-chat?page=1">
          Learn More <span style={{ marginLeft: "4px" }}>→</span>
        </Link>
      </div>
    </aside>
  );
}

export function HomeRightSidebar({ experts = [], services = [], balance = 0 }) {
  const [showBonus, setShowBonus] = React.useState(true);
  const walletAmount = Math.floor(Number(balance || 0));

  const [dynamicServices, setDynamicServices] = React.useState([]);
  const [loadingServices, setLoadingServices] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    const loadServices = async () => {
      try {
        setLoadingServices(true);
        const response = await getAllServices();
        const payload = response?.data?.data || response?.data || [];
        if (active) {
          if (Array.isArray(payload) && payload.length > 0) {
            setDynamicServices(payload.slice(0, 4));
          } else {
            setDynamicServices([]);
          }
        }
      } catch (err) {
        console.error("Trending services load failed", err);
        if (active) {
          setDynamicServices([]);
        }
      } finally {
        if (active) setLoadingServices(false);
      }
    };
    loadServices();
    return () => {
      active = false;
    };
  }, []);

  const getServiceSubtitle = (svc) => {
    if (svc.subtitle) return svc.subtitle;
    const provider = svc.expert_name || svc.expert?.name || svc.category_name || svc.category || "Legal Advisors";
    return provider.startsWith("by ") ? provider : `by ${provider}`;
  };

  const formatPrice = (svc) => {
    if (svc.price === undefined || svc.price === null) {
      return "View Price";
    }
    if (typeof svc.price === "string" && svc.price.includes("₹")) {
      return svc.price;
    }
    const displayPrice = svc.offer_price || svc.price;
    if (displayPrice === undefined || displayPrice === null) {
      return "View Price";
    }
    return `₹ ${Math.round(Number(displayPrice))}`;
  };

  const TrendingServicesSkeleton = () => (
    <>
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="home-widget-item service-item" style={{ pointerEvents: "none" }}>
          <div className="trending-service-skeleton-icon" />
          <div className="item-details">
            <div className="trending-service-skeleton-text1" />
            <div className="trending-service-skeleton-text2" />
          </div>
          <div className="trending-service-skeleton-price" />
        </div>
      ))}
    </>
  );

  // Determine actual items, slice to 3
  const finalExperts = experts;
  const finalServices = dynamicServices.length > 0 ? dynamicServices : services;

  return (
    <aside className="home-right-sidebar" aria-label="Home suggestions">
      {/* 1. Trending Services Card */}
      <section className="home-widget home-trending-widget">
        <div className="home-widget-head">
          <h2>Trending Services</h2>
          <Link to="/user/all-services" className="view-all-link">View all</Link>
        </div>
        <div className="home-widget-list">
          {loadingServices ? (
            <TrendingServicesSkeleton />
          ) : finalServices.length > 0 ? (
            finalServices.slice(0, 4).map((svc, idx) => {
              const isReal = svc.id || svc.service_id;
              const linkTo = isReal ? `/user/service-details/${svc.slug || svc.id}` : "#";
              const image = svc.image || svc.image_url || svc.category_image || svc.icon;
              return (
                <Link
                  key={idx}
                  to={linkTo}
                  className="home-widget-item service-item"
                  style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", width: "100%" }}
                >
                  <div className="item-icon-box">
                    {image ? (
                      <img
                        src={image}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "10px",
                        }}
                      />
                    ) : (
                      <BriefcaseBusiness size={18} />
                    )}
                  </div>
                  <div className="item-details">
                    <h3>{svc.title || svc.name}</h3>
                    <p>{getServiceSubtitle(svc)}</p>
                  </div>
                  <div className="item-price">{formatPrice(svc)}</div>
                </Link>
              );
            })
          ) : (
            <div style={{ padding: "16px", color: "#64748b", fontSize: "12px", textAlign: "center", fontWeight: "600" }}>
              No trending services available right now.
            </div>
          )}
        </div>
      </section>

      {/* 2. Recommended Experts Card */}
      <section className="home-widget home-experts-widget">
        <div className="home-widget-head">
          <h2>Recommended Experts</h2>
          <Link to="/user/call-chat?page=1" className="view-all-link">View all</Link>
        </div>
        <div className="home-widget-list">
          {finalExperts.length > 0 ? (
            finalExperts.slice(0, 3).map((exp, idx) => {
              const isReal = exp.expert_id || exp.id;
              const name = isReal ? (exp.name || exp.expert_name) : exp.name;
              const pos = isReal ? (exp.category_name || exp.position) : exp.position;
              const price = isReal ? `₹ ${Math.round(Number(exp.call_per_minute || 0))}/min` : exp.price;
              const rating = isReal ? Number(exp.avg_rating || 4.8).toFixed(1) : exp.rating;
              const reviews = isReal ? (exp.total_reviews || "120") : exp.reviews;
              const slug = isReal ? (exp.expert_slug || exp.slug || exp.id) : "";

              return (
                <div key={idx} className="home-widget-item expert-item">
                  <div className="expert-avatar-box">
                    {isReal && exp.profile_photo ? (
                      <img src={exp.profile_photo} alt={name} className="expert-avatar" />
                    ) : (
                      <div className="expert-avatar-placeholder">
                        {String(name).slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="online-dot" />
                  </div>
                  <div className="item-details">
                    <Link to={slug ? `/user/experts/${slug}` : "#"} className="expert-name-link">
                      <h3>{name}</h3>
                    </Link>
                    <p>{pos}</p>
                    <div className="expert-meta-rating">
                      <Star size={12} fill="#FBBF24" color="#FBBF24" />
                      <span>{rating} ({reviews})</span>
                    </div>
                  </div>
                  <div className="expert-action-col">
                    <div className="item-price">{price}</div>
                    <Link 
                      to={isReal ? `/user/call-chat?page=1&mode=call&expert_id=${exp.expert_id || exp.id}` : "/user/call-chat?page=1&mode=call"} 
                      className="call-btn-pill"
                      aria-label="Start voice call"
                      title="Start voice call"
                    >
                      <Phone size={11} fill="currentColor" />
                      <span>{price || "--"}</span>
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ padding: "16px", color: "#64748b", fontSize: "12px", textAlign: "center", fontWeight: "600" }}>
              No recommended experts available right now.
            </div>
          )}
        </div>
      </section>

      {/* 3. My Wallet Card */}
      <section className="home-widget home-wallet-widget-card">
        <div className="home-widget-head">
          <h2>My Wallet</h2>
          <Link to="/user/wallet" className="view-all-link">View Transactions</Link>
        </div>
        <div className="wallet-balance-display">
          <div className="balance-info-col">
            <span className="balance-label">Available Balance</span>
            <strong className="balance-value">₹ {walletAmount || "2,450"}</strong>
          </div>
        </div>

        {showBonus && (
          <div className="bonus-promo-box">
            <Gift size={20} className="gift-icon" />
            <div className="bonus-promo-details">
              <h4>Get 10% Extra</h4>
              <p>Add money to wallet and get 10% bonus</p>
            </div>
            <button 
              type="button" 
              className="close-bonus-btn" 
              onClick={() => setShowBonus(false)}
              aria-label="Dismiss offer"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <Link to="/user/wallet" className="add-money-btn-gold">
          + Add Money to Wallet
        </Link>
      </section>
    </aside>
  );
}
