import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiArrowRight, FiGrid, FiSearch, FiStar, FiUser } from "react-icons/fi";

import {
  searchCategories,
  searchExperts,
  searchSubcategories,
} from "../../../../shared/api/userApi/searchV2.api";
import {
  asArray,
  getCategoryResultPath,
  getExpertPath,
  getInitials,
  getPayload,
  getSubcategoryResultPath,
} from "../../components/search/searchUtils";
import "./SearchResultsPage.css";

const TABS = [
  { key: "all", label: "All" },
  { key: "experts", label: "Experts" },
  { key: "categories", label: "Categories" },
  { key: "subcategories", label: "Subcategories" },
];

const getList = (response, key) => {
  const payload = getPayload(response);
  return asArray(payload[key] || payload.results || payload.items || payload);
};

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const [queryInput, setQueryInput] = useState(urlQuery);
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [results, setResults] = useState({
    experts: [],
    categories: [],
    subcategories: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

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
    }, 400);

    return () => window.clearTimeout(timer);
  }, [queryInput, setSearchParams, urlQuery]);

  useEffect(() => {
    const q = urlQuery.trim();
    if (!q) {
      setResults({ experts: [], categories: [], subcategories: [] });
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
        });
      } catch {
        if (controller.signal.aborted) return;
        setResults({ experts: [], categories: [], subcategories: [] });
        setError(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadSearchResults();

    return () => controller.abort();
  }, [page, urlQuery]);

  const counts = useMemo(
    () => ({
      all: results.experts.length + results.categories.length + results.subcategories.length,
      experts: results.experts.length,
      categories: results.categories.length,
      subcategories: results.subcategories.length,
    }),
    [results]
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

  return (
    <main className="search-page">
      <section className="search-page-hero">
        <span>Search</span>
        <h1>Search G9 Experts</h1>
        <form className="search-page-form" onSubmit={handleSubmit}>
          <FiSearch aria-hidden="true" />
          <input
            value={queryInput}
            onChange={(event) => setQueryInput(event.target.value)}
            placeholder="Search experts, services, categories..."
            aria-label="Search G9 Experts"
          />
          <button type="submit">Search</button>
        </form>
      </section>

      <div className="search-page-tabs" role="tablist" aria-label="Search result types">
        {TABS.map((tab) => (
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

      {error ? (
        <div className="search-page-state">Search is temporarily unavailable. Please try again.</div>
      ) : !urlQuery.trim() ? (
        <div className="search-page-state">Start with a search term to find G9 Experts services.</div>
      ) : !loading && !hasAnyResult ? (
        <div className="search-page-state">No results found. Try searching another service.</div>
      ) : (
        <>
          {renderSection("experts", "Experts", results.experts, renderExpertCard)}
          {renderSection("categories", "Categories", results.categories, renderCategoryCard)}
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
