import React, { useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  MessageCircle, 
  PhoneCall, 
  Star, 
  Clock, 
  ChevronRight, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Grid3X3
} from "lucide-react";
import { getCategoryPath } from "../../../../../../shared/utils/categoryRoutes";
import "./CompactDirectoryFeed.css";

// Category icon / emoji mapping
const CATEGORY_EMOJI_MAP = {
  doctor: "🩺",
  health: "🩺",
  medical: "🩺",
  clinic: "🩺",
  astro: "🔮",
  astrology: "🔮",
  kundli: "🔮",
  horoscope: "🔮",
  lawyer: "⚖️",
  legal: "⚖️",
  advocate: "⚖️",
  court: "⚖️",
  therapist: "🧠",
  mental: "🧠",
  counsellor: "🧠",
  ca: "📊",
  tax: "📊",
  gst: "📊",
  audit: "📊",
  finance: "💼",
  accounting: "💼",
  career: "🎓",
  education: "🎓",
  study: "🎓",
  diet: "🥗",
  nutrition: "🥗",
  fitness: "🥗",
  vastu: "🏠",
  property: "🏠",
  realestate: "🏠",
  business: "📈",
  startup: "📈",
  it: "💻",
  tech: "💻",
  software: "💻",
};

const resolveCategoryEmoji = (name = "") => {
  const lower = String(name || "").toLowerCase();
  for (const [key, emoji] of Object.entries(CATEGORY_EMOJI_MAP)) {
    if (lower.includes(key)) return emoji;
  }
  return "✨";
};

// Initials extraction for fallback avatars
const getInitials = (name = "") => {
  if (!name) return "E";
  const clean = String(name).replace(/^(Dr\.|Adv\.|Pt\.|CA|Mrs\.|Mr\.)\s*/i, "").trim();
  const parts = clean.split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + (parts[parts.length - 1]?.charAt(0) || "")).toUpperCase().slice(0, 2);
};

function CategoryChipIcon({ image, name, emoji }) {
  const [hasError, setHasError] = useState(false);
  if (image && !hasError) {
    return (
      <img
        src={image}
        alt={name}
        loading="lazy"
        onError={() => setHasError(true)}
      />
    );
  }
  return <span>{emoji}</span>;
}

function ExpertAvatar({ photo, name, isOnline }) {
  const [hasError, setHasError] = useState(false);
  return (
    <div className="ref-av">
      {photo && !hasError ? (
        <img
          src={photo}
          alt={name}
          loading="lazy"
          onError={() => setHasError(true)}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
      <b className={isOnline ? "" : "bz"} title={isOnline ? "Online" : "Busy/Offline"} />
    </div>
  );
}

export default function CompactDirectoryFeed({
  categories = [],
  dashboardData = {},
  loading = false,
  selectedCategoryId = null,
  onSelectCategory = () => {},
}) {
  const navigate = useNavigate();

  // Active view tab: "home" (Default Directory Overview) | "experts" | "services"
  const [activeTab, setActiveTab] = useState("home");

  // Filters for "experts" view
  const [expertCategoryFilter, setExpertCategoryFilter] = useState("all");
  const [onlyOnlineExperts, setOnlyOnlineExperts] = useState(false);
  const [expertSort, setExpertSort] = useState("top"); // "top" | "low" | "exp"
  const [expertsVisibleCount, setExpertsVisibleCount] = useState(12);

  // Filters for "services" view
  const [serviceCategoryFilter, setServiceCategoryFilter] = useState("all");
  const [servicesVisibleCount, setServicesVisibleCount] = useState(10);

  // Aggregated real experts & services from dashboard categories
  const { allExperts, allServices, onlineExperts } = useMemo(() => {
    const rawCategories = Array.isArray(dashboardData?.categories) ? dashboardData.categories : [];
    
    // Extract and deduplicate all experts
    const expertMap = new Map();
    rawCategories.forEach((cat) => {
      const exps = Array.isArray(cat.experts) ? cat.experts : [];
      exps.forEach((exp) => {
        const id = exp.id || exp.slug;
        if (id && !expertMap.has(id)) {
          expertMap.set(id, {
            ...exp,
            categoryId: cat.id,
            categoryName: cat.name,
            categorySlug: cat.slug,
          });
        }
      });
    });
    const expList = Array.from(expertMap.values());

    // Extract and deduplicate all services
    const serviceMap = new Map();
    rawCategories.forEach((cat) => {
      const svcs = Array.isArray(cat.services) ? cat.services : [];
      svcs.forEach((svc) => {
        const id = svc.slug || svc.master_service_id || svc.id;
        if (id && !serviceMap.has(id)) {
          serviceMap.set(id, {
            ...svc,
            categoryId: cat.id,
            categoryName: cat.name,
            categorySlug: cat.slug,
          });
        }
      });
    });
    const svcList = Array.from(serviceMap.values());

    // Filter real online experts (if none marked online, take top verified experts)
    const onlines = expList.filter((e) => e.is_online === true || e.is_online === 1);
    const displayOnlines = onlines.length > 0 ? onlines : expList.slice(0, 10);

    return {
      allExperts: expList,
      allServices: svcList,
      onlineExperts: displayOnlines,
    };
  }, [dashboardData]);

  // Categories list with display ordering
  const sortedCategories = useMemo(() => {
    const list = Array.isArray(categories) && categories.length > 0 
      ? categories 
      : Array.isArray(dashboardData?.categories) ? dashboardData.categories : [];
    return [...list].sort((a, b) => Number(a.display_order || 0) - Number(b.display_order || 0));
  }, [categories, dashboardData]);

  // Handle category chip click
  const handleCategoryClick = useCallback((cat) => {
    if (activeTab === "experts") {
      setExpertCategoryFilter(cat === "all" ? "all" : String(cat.id || cat.slug));
      setExpertsVisibleCount(12);
      return;
    }
    if (activeTab === "services") {
      setServiceCategoryFilter(cat === "all" ? "all" : String(cat.id || cat.slug));
      setServicesVisibleCount(10);
      return;
    }
    // In "home" view: sync parent state safely if provided
    try {
      if (typeof onSelectCategory === "function") {
        onSelectCategory(cat === "all" ? null : cat);
      }
    } catch (e) {
      console.warn("onSelectCategory error:", e);
    }

    // Always navigate to the resolved route
    if (cat === "all") {
      navigate("/user/categories");
    } else {
      const path = getCategoryPath(cat) || `/user/category/${cat.slug || cat.id}`;
      navigate(path);
    }
  }, [activeTab, onSelectCategory, navigate]);

  // Filtered & sorted experts for "experts" view
  const filteredExperts = useMemo(() => {
    let list = [...allExperts];

    if (expertCategoryFilter !== "all") {
      list = list.filter((e) => 
        String(e.categoryId) === String(expertCategoryFilter) || 
        String(e.category_id) === String(expertCategoryFilter) ||
        String(e.categorySlug) === String(expertCategoryFilter)
      );
    }

    if (onlyOnlineExperts) {
      list = list.filter((e) => e.is_online === true || e.is_online === 1);
    }

    if (expertSort === "top") {
      list.sort((a, b) => Number(b.avg_rating || 4.5) - Number(a.avg_rating || 4.5));
    } else if (expertSort === "low") {
      list.sort((a, b) => {
        const pa = Number(a.chat_per_minute || a.call_per_minute || 50);
        const pb = Number(b.chat_per_minute || b.call_per_minute || 50);
        return pa - pb;
      });
    } else if (expertSort === "exp") {
      list.sort((a, b) => Number(b.experience_years || 5) - Number(a.experience_years || 5));
    }

    return list;
  }, [allExperts, expertCategoryFilter, onlyOnlineExperts, expertSort]);

  // Filtered services for "services" view
  const filteredServices = useMemo(() => {
    let list = [...allServices];

    if (serviceCategoryFilter !== "all") {
      list = list.filter((s) => 
        String(s.categoryId) === String(serviceCategoryFilter) || 
        String(s.category_id) === String(serviceCategoryFilter) ||
        String(s.categorySlug) === String(serviceCategoryFilter)
      );
    }

    return list;
  }, [allServices, serviceCategoryFilter]);

  // Helper for expert price display
  const getExpertPrice = (e) => {
    const rate = e?.chat_per_minute || e?.call_per_minute || e?.price;
    if (rate && Number(rate) > 0) return `₹${Math.round(Number(rate))}/m`;
    return "₹25/m";
  };

  // Helper for service price display
  const getServicePrice = (s) => {
    const val = s?.offer_price ?? s?.price ?? 499;
    return `₹${Math.round(Number(val))}`;
  };

  return (
    <div className="g9-directory-container">
      {/* =========================================================================
          VIEW SWITCHER / DIRECTORY TABS (Matching reference home / experts / services)
          ========================================================================= */}
      <div className="directory-nav-tabs" role="tablist" aria-label="Directory views">
        <button
          type="button"
          className={`directory-tab-pill ${activeTab === "home" ? "on" : ""}`}
          onClick={() => setActiveTab("home")}
          role="tab"
          aria-selected={activeTab === "home"}
        >
          <span>✨</span>
          <span>Overview</span>
        </button>

        <button
          type="button"
          className={`directory-tab-pill ${activeTab === "experts" ? "on" : ""}`}
          onClick={() => {
            setActiveTab("experts");
            setExpertCategoryFilter("all");
          }}
          role="tab"
          aria-selected={activeTab === "experts"}
        >
          <span>👥</span>
          <span>All Experts</span>
        </button>

        <button
          type="button"
          className={`directory-tab-pill ${activeTab === "services" ? "on" : ""}`}
          onClick={() => {
            setActiveTab("services");
            setServiceCategoryFilter("all");
          }}
          role="tab"
          aria-selected={activeTab === "services"}
        >
          <span>🧾</span>
          <span>All Services</span>
        </button>
      </div>

      {/* =========================================================================
          VIEW A: HOME (Compact Carousels: Categories, Online Now, Services, Category Blocks)
          ========================================================================= */}
      {activeTab === "home" && (
        <div className="directory-home-view">
          {/* 1. HORIZONTAL CATEGORIES ROW */}
          <div className="ref-lh" style={{ paddingTop: "8px" }}>
            <h2>Categories</h2>
            <Link to="/user/categories" className="ref-lnk" aria-label="View all categories">
              See all →
            </Link>
          </div>

          <div className="ref-hs" aria-label="Categories row">
            {/* All Chip */}
            <button
              type="button"
              className={`ref-ct ${!selectedCategoryId ? "on" : ""}`}
              onClick={() => handleCategoryClick("all")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCategoryClick("all");
                }
              }}
              title="All Categories"
              aria-label="All Categories"
            >
              <span className="ct-icon-box">
                <span>✨</span>
              </span>
              <span className="ct-label">All</span>
            </button>

            {/* Real Categories */}
            {sortedCategories.map((c) => {
              const isActive = String(selectedCategoryId || "") === String(c.id || c.slug);
              const emoji = resolveCategoryEmoji(c.name);

              return (
                <button
                  type="button"
                  key={c.id || c.slug}
                  className={`ref-ct ${isActive ? "on" : ""}`}
                  onClick={() => handleCategoryClick(c)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleCategoryClick(c);
                    }
                  }}
                  title={c.name}
                  aria-label={`${c.name} category`}
                >
                  <span className="ct-icon-box">
                    <CategoryChipIcon image={c.image} name={c.name} emoji={emoji} />
                  </span>
                  <span className="ct-label">{c.name}</span>
                </button>
              );
            })}
          </div>

          {/* 2. ONLINE NOW EXPERTS SECTION */}
          {onlineExperts.length > 0 && (
            <div className="ref-blk">
              <div className="ref-lh">
                <h2>
                  <span className="ref-ok">●</span> Online now
                </h2>
                <Link to="/user/call-chat?status=online" className="ref-lnk" aria-label="See all online experts">
                  See all →
                </Link>
              </div>

              <div className="ref-hs" aria-label="Online experts carousel">
                {onlineExperts.slice(0, 10).map((exp) => {
                  const profileUrl = exp.slug ? `/user/experts/${exp.slug}` : `/user/experts/${exp.id}`;
                  const chatUrl = `${profileUrl}?action=chat`;
                  const isOnline = exp.is_online === true || exp.is_online === 1;

                  return (
                    <div
                      key={exp.id || exp.slug}
                      className="ref-ec"
                      onClick={() => navigate(profileUrl)}
                    >
                      <ExpertAvatar
                        photo={exp.profile_photo}
                        name={exp.name}
                        isOnline={isOnline}
                      />

                      <h3 title={exp.name}>{exp.name || "Verified Expert"}</h3>
                      <div className="ref-r" title={exp.position || exp.categoryName}>
                        {exp.position || exp.categoryName || "Consultant"}
                      </div>

                      <div className="ref-m">
                        <span className="ref-star">★ {Number(exp.avg_rating || 4.9).toFixed(1)}</span>
                        {" · "}
                        <span>{getExpertPrice(exp)}</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(chatUrl);
                        }}
                      >
                        Chat now
                      </button>
                    </div>
                  );
                })}

                {/* More card at end of carousel */}
                <button
                  type="button"
                  className="ref-more-c"
                  onClick={() => navigate("/user/call-chat")}
                  aria-label="See all online experts"
                >
                  <div className="more-arrow">→</div>
                  <span>See all online experts</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. POPULAR SERVICES SECTION */}
          {allServices.length > 0 && (
            <div className="ref-blk">
              <div className="ref-lh">
                <h2>Popular services</h2>
                <Link to="/user/all-services" className="ref-lnk" aria-label="See all popular services">
                  See all →
                </Link>
              </div>

              <div className="ref-hs" aria-label="Popular services carousel">
                {allServices.slice(0, 8).map((svc) => {
                  const serviceSlug = svc.slug || svc.id;
                  const serviceUrl = serviceSlug ? `/user/service/${serviceSlug}` : "/user/all-services";
                  const cover = svc.cover_image || svc.image;
                  const days = svc.delivery_time_days || 1;

                  return (
                    <div
                      key={svc.id || svc.slug}
                      className="ref-sc"
                      onClick={() => navigate(serviceUrl)}
                    >
                      <div className="ref-e">
                        {cover ? (
                          <img 
                            src={cover} 
                            alt={svc.title} 
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.parentNode.innerText = "🧾";
                            }}
                          />
                        ) : (
                          <span>🧾</span>
                        )}
                      </div>

                      <h3 title={svc.title}>{svc.title}</h3>
                      <p>Ready in {days} {days === 1 ? "day" : "days"}</p>
                      <span className="ref-tag">{svc.categoryName || "Verified Service"}</span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(serviceUrl);
                        }}
                      >
                        Book {getServicePrice(svc)}
                      </button>
                    </div>
                  );
                })}

                {/* More card at end of services carousel */}
                <button
                  type="button"
                  className="ref-more-c"
                  onClick={() => navigate("/user/all-services")}
                  aria-label="See all services"
                >
                  <div className="more-arrow">→</div>
                  <span>See all services</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. CATEGORY-WISE EXPERT BLOCKS */}
          {sortedCategories
            .filter((c) => {
              if (selectedCategoryId) {
                return String(c.id) === String(selectedCategoryId) || c.slug === selectedCategoryId;
              }
              return true;
            })
            .slice(0, 5)
            .map((cat) => {
              const catExperts = Array.isArray(cat.experts) ? cat.experts : [];
              const catServices = Array.isArray(cat.services) ? cat.services : [];

              if (catExperts.length === 0 && catServices.length === 0) return null;

              const emoji = resolveCategoryEmoji(cat.name);
              const viewAllPath = getCategoryPath(cat) || `/user/category/${cat.slug || cat.id}`;

              return (
                <div key={cat.id || cat.slug} className="ref-blk">
                  <div className="ref-lh">
                    <h2>
                      <span>{emoji}</span> {cat.name}
                    </h2>
                    <Link to={viewAllPath} className="ref-lnk" aria-label={`See all ${cat.name} experts`}>
                      See all →
                    </Link>
                  </div>

                  {catExperts.length > 0 && (
                    <div className="ref-hs" aria-label={`${cat.name} experts carousel`}>
                      {catExperts.slice(0, 6).map((exp) => {
                        const profileUrl = exp.slug ? `/user/experts/${exp.slug}` : `/user/experts/${exp.id}`;
                        const isOnline = exp.is_online === true || exp.is_online === 1;

                        return (
                          <div
                            key={exp.id || exp.slug}
                            className="ref-ec"
                            onClick={() => navigate(profileUrl)}
                          >
                            <ExpertAvatar
                              photo={exp.profile_photo}
                              name={exp.name}
                              isOnline={isOnline}
                            />

                            <h3 title={exp.name}>{exp.name}</h3>
                            <div className="ref-r">{exp.position || cat.name}</div>

                            <div className="ref-m">
                              <span className="ref-star">★ {Number(exp.avg_rating || 4.9).toFixed(1)}</span>
                              {" · "}
                              <span>{getExpertPrice(exp)}</span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`${profileUrl}?action=chat`);
                              }}
                            >
                              Chat now
                            </button>
                          </div>
                        );
                      })}

                      <button
                        type="button"
                        className="ref-more-c"
                        onClick={() => navigate(viewAllPath)}
                        aria-label={`See all ${cat.name} experts`}
                      >
                        <div className="more-arrow">→</div>
                        <span>See all {cat.name.toLowerCase()} experts</span>
                      </button>
                    </div>
                  )}

                  {catServices.length > 0 && (
                    <div className="ref-cnt" style={{ paddingTop: "6px" }}>
                      <Link 
                        to={`/user/all-services?category=${cat.slug || cat.id}`} 
                        className="ref-lnk"
                        style={{ fontSize: "12.5px" }}
                        aria-label={`View ${cat.name} services`}
                      >
                        View {cat.name.toLowerCase()} services →
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}

          {/* 5. BROWSE ALL EXPERTS BUTTON (LOADM) */}
          <button
            type="button"
            className="ref-loadm"
            onClick={() => navigate("/user/call-chat")}
            aria-label="Browse all experts & services"
          >
            Browse all experts & services →
          </button>
        </div>
      )}

      {/* =========================================================================
          VIEW B: ALL EXPERTS (Filterable List Row View matching reference expV)
          ========================================================================= */}
      {activeTab === "experts" && (
        <div className="directory-experts-view">
          <h1 className="ref-pt">All experts</h1>
          <p className="ref-ps">Choose a category, then filter and sort verified professionals.</p>

          {/* Category Chips Scroller */}
          <div className="ref-hs" style={{ paddingBottom: "6px" }}>
            <button
              type="button"
              className={`directory-tab-pill ${expertCategoryFilter === "all" ? "on" : ""}`}
              onClick={() => handleCategoryClick("all")}
            >
              ✨ All
            </button>
            {sortedCategories.map((c) => {
              const isSelected = String(expertCategoryFilter) === String(c.id || c.slug);
              return (
                <button
                  type="button"
                  key={c.id || c.slug}
                  className={`directory-tab-pill ${isSelected ? "on" : ""}`}
                  onClick={() => handleCategoryClick(c)}
                >
                  <span>{resolveCategoryEmoji(c.name)}</span>
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>

          {/* Filter Tools (Online toggle & Sort) */}
          <div className="ref-tools">
            <button
              type="button"
              className={`ref-pill ${onlyOnlineExperts ? "on" : ""}`}
              onClick={() => setOnlyOnlineExperts(!onlyOnlineExperts)}
            >
              ● Online now
            </button>

            <select
              className="ref-pill"
              value={expertSort}
              onChange={(e) => setExpertSort(e.target.value)}
              aria-label="Sort experts"
            >
              <option value="top">Top rated</option>
              <option value="low">Price: low to high</option>
              <option value="exp">Most experienced</option>
            </select>
          </div>

          {/* Count display */}
          <div className="ref-cnt">
            <span>Showing {Math.min(expertsVisibleCount, filteredExperts.length)} of {filteredExperts.length} experts</span>
          </div>

          {/* Expert List Rows (.ref-ex) */}
          <div className="ref-list">
            {filteredExperts.slice(0, expertsVisibleCount).map((exp) => {
              const profileUrl = exp.slug ? `/user/experts/${exp.slug}` : `/user/experts/${exp.id}`;
              const isOnline = exp.is_online === true || exp.is_online === 1;
              const expYears = exp.experience_years ? `${exp.experience_years} yrs` : "Verified";

              return (
                <div
                  key={exp.id || exp.slug}
                  className="ref-ex"
                  onClick={() => navigate(profileUrl)}
                >
                  <ExpertAvatar
                    photo={exp.profile_photo}
                    name={exp.name}
                    isOnline={isOnline}
                  />

                  <div className="ref-x">
                    <h3>{exp.name}</h3>
                    <div className="ref-r">
                      {exp.position || exp.categoryName} · {expYears}
                    </div>
                    <div className="ref-m">
                      <span className="ref-star">★ {Number(exp.avg_rating || 4.9).toFixed(1)}</span>
                      <span> · </span>
                      <span>{getExpertPrice(exp)}</span>
                      <span> · </span>
                      {isOnline ? <span className="ref-o">Online</span> : <span className="ref-b">Busy</span>}
                    </div>
                  </div>

                  <div className="ref-acts">
                    <button
                      type="button"
                      className="ref-chat"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`${profileUrl}?action=chat`);
                      }}
                    >
                      💬 Chat
                    </button>
                    <button
                      type="button"
                      className="ref-call"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`${profileUrl}?action=call`);
                      }}
                    >
                      📞 Call
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show more button */}
          {filteredExperts.length > expertsVisibleCount && (
            <button
              type="button"
              className="ref-loadm"
              onClick={() => setExpertsVisibleCount((prev) => prev + 8)}
              aria-label="Show more experts"
            >
              Show more experts
            </button>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW C: ALL SERVICES (Filterable List Row View matching reference svV)
          ========================================================================= */}
      {activeTab === "services" && (
        <div className="directory-services-view">
          <h1 className="ref-pt">All services</h1>
          <p className="ref-ps">Get professional delivery and legal documents without waiting for a call.</p>

          {/* Category Chips Scroller */}
          <div className="ref-hs" style={{ paddingBottom: "6px" }}>
            <button
              type="button"
              className={`directory-tab-pill ${serviceCategoryFilter === "all" ? "on" : ""}`}
              onClick={() => handleCategoryClick("all")}
            >
              ✨ All
            </button>
            {sortedCategories.map((c) => {
              const isSelected = String(serviceCategoryFilter) === String(c.id || c.slug);
              return (
                <button
                  type="button"
                  key={c.id || c.slug}
                  className={`directory-tab-pill ${isSelected ? "on" : ""}`}
                  onClick={() => handleCategoryClick(c)}
                >
                  <span>{resolveCategoryEmoji(c.name)}</span>
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>

          {/* Count display */}
          <div className="ref-cnt">
            <span>Showing {Math.min(servicesVisibleCount, filteredServices.length)} of {filteredServices.length} services</span>
          </div>

          {/* Service List Rows (.ref-sv) */}
          <div className="ref-list">
            {filteredServices.slice(0, servicesVisibleCount).map((svc) => {
              const serviceSlug = svc.slug || svc.id;
              const serviceUrl = serviceSlug ? `/user/service/${serviceSlug}` : "/user/all-services";
              const cover = svc.cover_image || svc.image;
              const days = svc.delivery_time_days || 1;

              return (
                <div
                  key={svc.id || svc.slug}
                  className="ref-sv"
                  onClick={() => navigate(serviceUrl)}
                >
                  <div className="ref-e">
                    {cover ? (
                      <img 
                        src={cover} 
                        alt={svc.title} 
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentNode.innerText = "🧾";
                        }}
                      />
                    ) : (
                      <span>🧾</span>
                    )}
                  </div>

                  <div className="ref-x">
                    <h3>{svc.title}</h3>
                    <p>{svc.categoryName || "Verified"} · ready in {days} {days === 1 ? "day" : "days"}</p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(serviceUrl);
                    }}
                  >
                    Buy {getServicePrice(svc)}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Show more button */}
          {filteredServices.length > servicesVisibleCount && (
            <button
              type="button"
              className="ref-loadm"
              onClick={() => setServicesVisibleCount((prev) => prev + 6)}
              aria-label="Show more services"
            >
              Show more services
            </button>
          )}
        </div>
      )}
    </div>
  );
}
