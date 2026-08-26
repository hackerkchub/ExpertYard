import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
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
  MessageSquare,
  Package,
} from "lucide-react";
import logo from "../../../../../assets/logo.webp";
import { APP_CONFIG } from "../../../../../config/appConfig";

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

const navItems = [
  { label: "Home", to: "/user", icon: Home, end: true },
  { label: "Reel", to: "/user/reels", icon: Film },
  { label: "Experts", to: "/user/call-chat?page=1", icon: Users },
  { label: "Services", to: "/user/all-services", icon: BriefcaseBusiness },
  { label: "Category", to: "/user/categories", icon: Grid3X3 },
  { label: "Wallet", to: "/user/wallet", icon: CreditCard },
  { label: "History", to: "/user/chat-history", icon: Sparkles },
  { label: "My Orders", to: "/user/my-services", icon: Package },
  { label: "My Inquiries", to: "/user/my-inquiries", icon: MessageSquare },
  { label: "Notifications", to: "/user/notifications", icon: Bell },
  { label: "Settings", to: "/user/user-profile", icon: Settings },
];

const recommendedExpertsData = [
  { name: "Himanshu Dhote", position: "Finance Consultant", price: "₹ 50/min", rating: "4.9", reviews: "124" },
  { name: "Acharya Nishu kaushik", position: "Astrologer", price: "₹ 40/min", rating: "4.8", reviews: "98" },
  { name: "Dr. Amit Srivastava", position: "Psychologist", price: "₹ 65/min", rating: "4.9", reviews: "156" },
];

export function HomeLeftSidebar({ isLoggedIn = false, user, balance = 0, onLogin, onLogout, isNearFooter = false }) {
  const accountName = isLoggedIn
    ? user?.first_name || user?.name || "G9Expert User"
    : "G9Expert";
  const accountSubtext = isLoggedIn
    ? `Wallet Rs ${Math.floor(Number(balance || 0))}`
    : "Login to manage consultations";

  return (
    <aside className={`home-left-sidebar ${isNearFooter ? "sidebar-near-footer" : ""}`} aria-label="Home navigation">
      {/* LOGO - Fixed at Top */}
      <Link className="home-sidebar-logo" to="/user" aria-label="G9Expert home">
        <img src={logo} alt="G9Expert" />
      </Link>

      {/* SCROLLABLE MIDDLE SECTION */}
      <div className="home-sidebar-scrollable">
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
        </div>
      </div>

      {/* BOTTOM FIXED SECTION - Login + Promo */}
      <div className="home-sidebar-bottom">
        <button
          type="button"
          className="home-sidebar-auth"
          onClick={isLoggedIn ? onLogout : onLogin}
        >
          {isLoggedIn ? <LogOut size={20} /> : <LogIn size={20} />}
          <span>{isLoggedIn ? "Logout" : "Login / Sign Up"}</span>
        </button>

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
      </div>
    </aside>
  );
}

export function HomeRightSidebar({ experts = [], balance = 0, isNearFooter = false }) {
  const navigate = useNavigate();
  const [showBonus, setShowBonus] = React.useState(true);
  const walletAmount = Math.floor(Number(balance || 0));

  const [masterServices, setMasterServices] = React.useState([]);
  const [loadingServices, setLoadingServices] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    const loadMasterServices = async () => {
      try {
        setLoadingServices(true);
        const response = await fetch(`${APP_CONFIG.API_BASE_URL}/master-services/public`);
        const data = await response.json();
        const list = data?.success && Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        if (active) {
          setMasterServices(list.slice(0, 4));
        }
      } catch (err) {
        console.error("Trending master services load failed", err);
        if (active) {
          setMasterServices([]);
        }
      } finally {
        if (active) setLoadingServices(false);
      }
    };
    loadMasterServices();
    return () => {
      active = false;
    };
  }, []);

  const getServiceSubtitle = (svc) => {
    if (svc.subcategory_name) return svc.subcategory_name;
    if (svc.category_name) return svc.category_name;
    if (svc.subtitle) return svc.subtitle;
    return "Verified Service";
  };

  const formatPrice = (svc) => {
    const p = svc.starting_price ?? svc.price ?? svc.offer_price;
    if (p === undefined || p === null) {
      return "View Price";
    }
    if (typeof p === "string" && p.includes("₹")) {
      return p;
    }
    return `₹ ${Math.round(Number(p))}`;
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

  const finalExperts = experts;

  return (
    <aside className={`home-right-sidebar ${isNearFooter ? "sidebar-near-footer" : ""}`} aria-label="Home suggestions">
      {/* 1. Trending Services Card */}
      <section className="home-widget home-trending-widget">
        <div className="home-widget-head">
          <h2>Trending Services</h2>
          <Link to="/user/all-services" className="view-all-link">View all</Link>
        </div>
        <div className="home-widget-list">
          {loadingServices ? (
            <TrendingServicesSkeleton />
          ) : masterServices.length > 0 ? (
            masterServices.map((svc, idx) => {
              const title = svc.title || svc.name || svc.master_service_name || "Master Service";
              const slug = svc.slug || svc.id;
              const linkTo = slug ? `/user/service/${slug}` : "/user/all-services";
              const image = svc.icon || svc.icon_url || svc.image || svc.image_url;
              return (
                <Link
                  key={svc.id || idx}
                  to={linkTo}
                  className="home-widget-item service-item"
                  style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", width: "100%" }}
                >
                  <div className="item-icon-box">
                    {image && hasValidPhoto(image) ? (
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
                    <h3>{title}</h3>
                    <p>{getServiceSubtitle(svc)}</p>
                  </div>
                  <div className="item-price">{formatPrice(svc)}</div>
                </Link>
              );
            })
          ) : (
            <div style={{ padding: "16px", color: "#64748b", fontSize: "12px", textAlign: "center", fontWeight: "600" }}>
              No trending master services available right now.
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
              const targetExpertId = exp.expert_id || exp.id;
              const name = isReal ? (exp.name || exp.expert_name || "Verified Expert") : (exp.name || "Verified Expert");
              const pos = isReal ? (exp.category_name || exp.position || "Expert Consultant") : (exp.position || "Expert Consultant");
              
              const rawCallRate = exp.call_per_minute ?? exp.call_rate ?? exp.voice_call_rate ?? exp.rate;
              const numCallRate = rawCallRate !== undefined && rawCallRate !== null ? Math.round(Number(rawCallRate)) : null;
              const priceDisplay = numCallRate !== null && numCallRate > 0 ? `₹ ${numCallRate}/min` : (exp.price || "₹ 10/min");

              const rating = isReal ? Number(exp.avg_rating || 4.8).toFixed(1) : exp.rating;
              const reviews = isReal ? (exp.total_reviews || "120") : exp.reviews;
              const slug = isReal ? (exp.expert_slug || exp.slug || exp.id) : "";
              const profilePhoto = isReal ? exp.profile_photo : null;
              const initials = getInitials(name);
              const validPhoto = hasValidPhoto(profilePhoto);
              const profileUrl = slug ? `/user/experts/${slug}` : (targetExpertId ? `/user/experts/${targetExpertId}` : "/user/call-chat?page=1");

              const handleDirectCall = (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (targetExpertId) {
                  navigate(`/user/voice-call/${targetExpertId}`, {
                    state: {
                      fromProfile: false,
                      pricingMode: "per_minute",
                      callPrice: numCallRate || 10,
                      expertName: name,
                      expertImage: profilePhoto,
                    },
                  });
                } else {
                  navigate("/user/call-chat?page=1&mode=call");
                }
              };

              const handleCardClick = () => {
                navigate(profileUrl);
              };

              return (
                <div 
                  key={idx} 
                  className="home-widget-item expert-item" 
                  onClick={handleCardClick}
                  style={{ cursor: "pointer" }}
                >
                  <div className="expert-avatar-box">
                    {validPhoto ? (
                      <img src={profilePhoto} alt={name} className="expert-avatar" />
                    ) : (
                      <div className="expert-avatar-placeholder" style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "linear-gradient(135deg, #0a66c2, #004182)",
                        color: "#ffffff",
                        fontWeight: "700",
                        fontSize: "1rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        flexShrink: 0,
                      }}>
                        {initials}
                      </div>
                    )}
                  </div>
                  <div className="item-details">
                    <Link to={profileUrl} className="expert-name-link" style={{ textDecoration: "none" }} onClick={(e) => e.stopPropagation()}>
                      <h3>{name}</h3>
                    </Link>
                    <p>{pos}</p>
                    <div className="expert-meta-rating">
                      <Star size={12} fill="#FBBF24" color="#FBBF24" />
                      <span>{rating} ({reviews})</span>
                    </div>
                  </div>
                  <div className="expert-action-col">
                    <div className="item-price">{priceDisplay}</div>
                    <button
                      type="button" 
                      className="call-btn-pill"
                      onClick={handleDirectCall}
                      aria-label={`Direct call with ${name}`}
                      title={`Direct call with ${name}`}
                      style={{ border: 0, outline: 0, cursor: "pointer" }}
                    >
                      <Phone size={11} fill="currentColor" />
                      <span>Call</span>
                    </button>
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
            <strong className="balance-value">₹ {walletAmount || 0}</strong>
          </div>
        </div>

        <Link to="/user/wallet" className="add-money-btn-gold">
          + Add Money to Wallet
        </Link>
      </section>
    </aside>
  );
}