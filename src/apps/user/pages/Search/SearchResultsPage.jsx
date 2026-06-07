import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiBriefcase, FiGrid, FiSearch, FiStar, FiUser, FiX } from "react-icons/fi";

import {
  searchCategories,
  searchExperts,
  searchSubcategories,
} from "../../../../shared/api/userApi/searchV2.api";
import { getAllServices } from "../../../../shared/api/service.api";
import { useCategory } from "../../../../shared/context/CategoryContext";
import { usePublicExpert } from "../../context/PublicExpertContext";
import {
  asArray,
  getCategoryResultPath,
  getExpertPath,
  getInitials,
  getPayload,
  getSubcategoryResultPath,
} from "../../components/search/searchUtils";
import "./SearchResultsPage.css";

const DESKTOP_TABS = [
  { key: "all", label: "All" },
  { key: "experts", label: "Experts" },
  { key: "categories", label: "Categories" },
  { key: "subcategories", label: "Subcategories" },
];
const MOBILE_TABS = [
  ...DESKTOP_TABS.slice(0, 3),
  { key: "services", label: "Services" },
  DESKTOP_TABS[3],
];
const MOBILE_QUERY = "(max-width: 767px)";

const getList = (response, key) => {
  const payload = getPayload(response);
  return asArray(payload[key] || payload.results || payload.items || payload);
};

function useIsMobileSearchPage() {
  const [isMobile, setIsMobile] = useState(() => (
    typeof window !== "undefined" ? window.matchMedia(MOBILE_QUERY).matches : false
  ));

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const media = window.matchMedia(MOBILE_QUERY);
    const handleChange = () => setIsMobile(media.matches);
    handleChange();

    if (media.addEventListener) {
      media.addEventListener("change", handleChange);
      return () => media.removeEventListener("change", handleChange);
    }

    media.addListener(handleChange);
    return () => media.removeListener(handleChange);
  }, []);

  return isMobile;
}

const getServicePath = (service) =>
  `/user/service-details/${service?.slug || service?.service_slug || service?.id}`;

const getServiceName = (service) =>
  service?.title || service?.name || service?.service_name || "Expert Service";

const getServiceImage = (service) =>
  service?.image || service?.service_image || service?.thumbnail || service?.image_url;

const matchesQuery = (service, query) => {
  const normalized = query.toLowerCase();
  return [
    service?.title,
    service?.name,
    service?.service_name,
    service?.description,
    service?.category_name,
    service?.category,
    service?.tags,
    service?.skills,
  ]
    .flat()
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(normalized);
};

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useIsMobileSearchPage();
  const inputRef = useRef(null);
  const { categories, loading: categoriesLoading } = useCategory();
  const { experts, expertsLoading } = usePublicExpert();
  const urlQuery = searchParams.get("q") || "";
  const [queryInput, setQueryInput] = useState(urlQuery);
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [results, setResults] = useState({
    experts: [],
    categories: [],
    subcategories: [],
    services: [],
  });
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.body.classList.add("g9-search-route");
    window.setTimeout(() => inputRef.current?.focus(), 120);

    return () => {
      document.body.classList.remove("g9-search-route");
    };
  }, []);

  useEffect(() => {
    setQueryInput(urlQuery);
    setPage(1);
  }, [urlQuery]);

  useEffect(() => {
    const q = queryInput.trim();

    if (q === urlQuery.trim()) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setActiveTab("all");
      setPage(1);

      if (q) {
        setSearchParams({ q });
      } else {
        setSearchParams({});
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [queryInput, setSearchParams, urlQuery]);

  useEffect(() => {
    let active = true;

    const loadServices = async () => {
      try {
        setServicesLoading(true);
        const response = await getAllServices();
        const payload = response?.data?.data || response?.data || [];
        if (active) setServices(Array.isArray(payload) ? payload : []);
      } catch (err) {
        console.error("Search services load failed", err);
        if (active) setServices([]);
      } finally {
        if (active) setServicesLoading(false);
      }
    };

    loadServices();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const q = urlQuery.trim();
    if (!q) {
      setResults({ experts: [], categories: [], subcategories: [], services: [] });
      return undefined;
    }

    const controller = new AbortController();

    const loadSearchResults = async () => {
      try {
        setLoading(true);
        setError(false);

        const [expertsRes, categoriesRes, subcategoriesRes] = await Promise.all([
          searchExperts({ q, page, limit: 20, signal: controller.signal }),
          searchCategories({ q, page: 1, limit: 20, signal: controller.signal }),
          searchSubcategories({ q, page: 1, limit: 20, signal: controller.signal }),
        ]);

        setResults({
          experts: getList(expertsRes, "experts"),
          categories: getList(categoriesRes, "categories"),
          subcategories: getList(subcategoriesRes, "subcategories"),
          services: services.filter((service) => matchesQuery(service, q)).slice(0, 20),
        });
      } catch {
        if (controller.signal.aborted) return;
        setResults({ experts: [], categories: [], subcategories: [], services: [] });
        setError(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadSearchResults();

    return () => controller.abort();
  }, [page, services, urlQuery]);

  const counts = useMemo(
    () => ({
      all: results.experts.length + results.categories.length + results.subcategories.length + (isMobile ? results.services.length : 0),
      experts: results.experts.length,
      categories: results.categories.length,
      subcategories: results.subcategories.length,
      services: results.services.length,
    }),
    [isMobile, results]
  );

  const visibleTabs = isMobile ? MOBILE_TABS : DESKTOP_TABS;

  useEffect(() => {
    if (!isMobile && activeTab === "services") {
      setActiveTab("all");
    }
  }, [activeTab, isMobile]);

  const recommendedExperts = useMemo(
    () => (Array.isArray(experts) ? experts.slice(0, 8) : []),
    [experts]
  );

  const recommendedCategories = useMemo(
    () => (Array.isArray(categories) ? categories.slice(0, 10) : []),
    [categories]
  );

  const recommendedServices = useMemo(
    () => services.slice(0, 8),
    [services]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    const q = queryInput.trim();
    setActiveTab("all");
    setPage(1);
    if (!q) {
      setSearchParams({});
      return;
    }
    setSearchParams({ q });
  };

  const clearSearch = () => {
    setQueryInput("");
    setActiveTab("all");
    setPage(1);
    setSearchParams({});
    inputRef.current?.focus();
  };

  const renderExpertCard = (expert) => {
    const name = expert?.name || expert?.full_name || expert?.expert_name || "Verified Expert";
    const image = expert?.profile_photo || expert?.profile_image || expert?.image_url;
    const rating = expert?.rating || expert?.avg_rating || expert?.average_rating;

    return (
      <button
        type="button"
        className="search-page-card search-page-card--expert"
        key={`expert-${expert?.id || expert?.expert_id || name}`}
        onClick={() => navigate(getExpertPath(expert))}
      >
        <span className="search-page-card__avatar">
          {image ? <img src={image} alt={name} loading="lazy" /> : <span>{getInitials(name)}</span>}
        </span>
        <span className="search-page-card__body">
          <strong>{name}</strong>
          <small>{expert?.position || expert?.speciality || expert?.subcategory_name || "G9 Experts professional"}</small>
          <span className="search-page-card__meta">
            {expert?.location && <span>{expert.location}</span>}
            {rating && (
              <span>
                <FiStar aria-hidden="true" /> {rating}
              </span>
            )}
          </span>
        </span>
        <span className="search-page-card__action">View Profile</span>
      </button>
    );
  };

  const renderCategoryCard = (category) => {
    const name = category?.name || category?.title || "Expert Category";

    return (
      <button
        type="button"
        className="search-page-card"
        key={`category-${category?.id || category?.slug || name}`}
        onClick={() => navigate(getCategoryResultPath(category))}
      >
        <span className="search-page-card__avatar search-page-card__avatar--icon">
          {category?.image_url ? <img src={category.image_url} alt={name} loading="lazy" /> : <FiGrid />}
        </span>
        <span className="search-page-card__body">
          <strong>{name}</strong>
          <small>{category?.meta_desc || category?.description || "Explore verified experts in this category."}</small>
        </span>
        <span className="search-page-card__action">Explore</span>
      </button>
    );
  };

  const renderSubcategoryCard = (subcategory) => {
    const name = subcategory?.name || subcategory?.title || "Expert Service";

    return (
      <button
        type="button"
        className="search-page-card"
        key={`subcategory-${subcategory?.id || subcategory?.subcategory_id || name}`}
        onClick={() => navigate(getSubcategoryResultPath(subcategory))}
      >
        <span className="search-page-card__avatar search-page-card__avatar--icon">
          <FiUser />
        </span>
        <span className="search-page-card__body">
          <strong>{name}</strong>
          <small>{subcategory?.category_name || subcategory?.parent_category_name || "Browse related experts."}</small>
        </span>
        <span className="search-page-card__action">
          Explore <FiArrowRight />
        </span>
      </button>
    );
  };

  const renderServiceCard = (service) => {
    const name = getServiceName(service);
    const image = getServiceImage(service);
    const price = service?.price || service?.amount || service?.service_price;

    return (
      <button
        type="button"
        className="search-page-card"
        key={`service-${service?.id || service?.slug || name}`}
        onClick={() => navigate(getServicePath(service))}
      >
        <span className="search-page-card__avatar search-page-card__avatar--icon">
          {image ? <img src={image} alt={name} loading="lazy" /> : <FiBriefcase />}
        </span>
        <span className="search-page-card__body">
          <strong>{name}</strong>
          <small>{service?.category_name || service?.category || "Book a verified expert service"}</small>
          <span className="search-page-card__meta">
            {price != null && price !== "" && <span>Rs {Math.floor(Number(price) || 0)}</span>}
          </span>
        </span>
        <span className="search-page-card__action">
          View <FiArrowRight />
        </span>
      </button>
    );
  };

  const renderSection = (key, title, items, renderer) => {
    if (activeTab !== "all" && activeTab !== key) return null;
    if (!loading && items.length === 0) return null;

    return (
      <section className="search-page-section">
        <div className="search-page-section__top">
          <h2>{title}</h2>
          <span>{items.length}</span>
        </div>
        <div className="search-page-grid">
          {loading
            ? Array.from({ length: key === "experts" ? 6 : 3 }).map((_, index) => (
                <div className="search-page-skeleton" key={`${key}-skeleton-${index}`} />
              ))
            : items.map(renderer)}
        </div>
      </section>
    );
  };

  const hasAnyResult = counts.all > 0;
  const showingRecommendations = !urlQuery.trim();
  const recommendationsLoading = categoriesLoading || expertsLoading || servicesLoading;
  const showMobileRecommendations = isMobile && showingRecommendations;

  const renderRecommendations = () => (
    <div className="search-page-recommendations">
      <section className="search-page-recommendation-section">
        <div className="search-page-section__top">
          <h2>Recommended for You</h2>
          <span>{recommendedExperts.length}</span>
        </div>
        <div className="search-page-recommendation-list">
          {recommendationsLoading && recommendedExperts.length === 0
            ? Array.from({ length: 4 }).map((_, index) => <div className="search-page-skeleton" key={`expert-rec-${index}`} />)
            : recommendedExperts.map(renderExpertCard)}
        </div>
      </section>

      {recommendedCategories.length > 0 && (
        <section className="search-page-chip-section">
          <div className="search-page-section__top">
            <h2>Popular Categories</h2>
          </div>
          <div className="search-page-chip-row">
            {recommendedCategories.map((category) => {
              const name = category?.name || category?.title || "Category";
              return (
                <button
                  type="button"
                  key={`category-rec-${category?.id || category?.slug || name}`}
                  onClick={() => navigate(getCategoryResultPath(category))}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {recommendedServices.length > 0 && (
        <section className="search-page-recommendation-section">
          <div className="search-page-section__top">
            <h2>Popular Services</h2>
            <span>{recommendedServices.length}</span>
          </div>
          <div className="search-page-recommendation-list">
            {recommendedServices.map(renderServiceCard)}
          </div>
        </section>
      )}

      {!recommendationsLoading && recommendedExperts.length === 0 && recommendedCategories.length === 0 && recommendedServices.length === 0 && (
        <div className="search-page-state">Search for experts, services, or categories</div>
      )}
    </div>
  );

  return (
    <main className="search-page">
      <section className="search-page-hero">
        <div className="search-page-mobile-top">
          <button type="button" onClick={() => navigate(-1)} aria-label="Go back">
            <FiArrowLeft />
          </button>
          <span>Search</span>
        </div>
        <h1>Search G9 Experts</h1>
        <form className="search-page-form" onSubmit={handleSubmit}>
          <FiSearch aria-hidden="true" />
          <input
            ref={inputRef}
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
            placeholder="Search experts, services, categories..."
            aria-label="Search G9 Experts"
          />
          {queryInput ? (
            <button type="button" className="search-page-clear" onClick={clearSearch} aria-label="Clear search">
              <FiX />
            </button>
          ) : null}
          <button type="submit" className="search-page-submit">Search</button>
        </form>
      </section>

      {!isMobile && (
        <div className="search-page-tabs" role="tablist" aria-label="Search result types">
          {visibleTabs.map((tab) => (
            <button
              type="button"
              key={tab.key}
              className={activeTab === tab.key ? "search-page-tab search-page-tab--active" : "search-page-tab"}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              <span>{counts[tab.key]}</span>
            </button>
          ))}
        </div>
      )}

      {error ? (
        <div className="search-page-state">Search is temporarily unavailable. Please try again.</div>
      ) : showMobileRecommendations ? (
        renderRecommendations()
      ) : showingRecommendations ? (
        <div className="search-page-state">Start with a search term to find G9 Experts services.</div>
      ) : !loading && !hasAnyResult ? (
        <div className="search-page-state">No results found. Try searching another service.</div>
      ) : (
        <>
          {isMobile && (
            <div className="search-page-tabs" role="tablist" aria-label="Search result types">
              {visibleTabs.map((tab) => (
                <button
                  type="button"
                  key={tab.key}
                  className={activeTab === tab.key ? "search-page-tab search-page-tab--active" : "search-page-tab"}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                  <span>{counts[tab.key]}</span>
                </button>
              ))}
            </div>
          )}
          {renderSection("experts", "Experts", results.experts, renderExpertCard)}
          {renderSection("categories", "Categories", results.categories, renderCategoryCard)}
          {isMobile && renderSection("services", "Services", results.services, renderServiceCard)}
          {renderSection("subcategories", "Subcategories", results.subcategories, renderSubcategoryCard)}

          {(activeTab === "all" || activeTab === "experts") && results.experts.length >= 20 && (
            <div className="search-page-pagination">
              <button type="button" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
                Previous
              </button>
              <span>Page {page}</span>
              <button type="button" onClick={() => setPage((current) => current + 1)}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default SearchResultsPage;
