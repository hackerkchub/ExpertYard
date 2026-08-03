import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Search,
  Briefcase,
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Filter,
  RefreshCw,
  ShieldCheck,
  Zap,
} from "lucide-react";
import APP_CONFIG from "../../../../config/appConfig";
import "./MasterServicesCatalogPage.css";

const DEFAULT_SUBCAT_IMAGE =
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80";

export default function MasterServicesCatalogPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [masterServices, setMasterServices] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const base = APP_CONFIG?.API_BASE_URL || "http://localhost:5000/api";

        // Fetch Master Services & Subcategories & Categories in parallel
        const [msRes, subcatRes, catRes] = await Promise.allSettled([
          axios.get(`${base}/master-services/public`),
          axios.get(`${base}/subcategory`),
          axios.get(`${base}/category`),
        ]);

        if (!active) return;

        // Process Master Services
        let msData = [];
        if (msRes.status === "fulfilled" && msRes.value?.data) {
          const raw = msRes.value.data;
          msData = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
        }

        // Process Subcategories
        let subcatData = [];
        if (subcatRes.status === "fulfilled" && subcatRes.value?.data) {
          const raw = subcatRes.value.data;
          subcatData = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
        }

        // Process Categories
        let catData = [];
        if (catRes.status === "fulfilled" && catRes.value?.data) {
          const raw = catRes.value.data;
          catData = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
        }

        setMasterServices(msData);
        setSubcategories(subcatData);
        setCategories(catData);
      } catch (err) {
        console.error("Failed to load master services catalog data:", err);
        if (active) setError("Unable to load Master Services. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();

    return () => {
      active = false;
    };
  }, []);

  // Map subcategories with active Master Services
  const subcategoryCatalog = useMemo(() => {
    if (!Array.isArray(subcategories) || subcategories.length === 0) {
      // Fallback: If subcategories array is empty, group master services by category/subcategory fields
      const subcatGroup = {};

      masterServices.forEach((ms) => {
        if (!ms.is_active && ms.status !== 1 && ms.status !== "active") return;

        const subcatId = ms.subcategory_id || ms.category_id || `cat-${ms.category_name || "general"}`;
        const subcatName = ms.subcategory_name || ms.category_name || "General Services";
        const catName = ms.category_name || "Services";
        const catSlug = ms.category_slug || "all";
        const subcatSlug = ms.subcategory_slug || ms.slug || subcatId;
        const img = ms.cover_image || ms.thumbnail || ms.image || DEFAULT_SUBCAT_IMAGE;

        if (!subcatGroup[subcatId]) {
          subcatGroup[subcatId] = {
            id: subcatId,
            name: subcatName,
            slug: subcatSlug,
            category_name: catName,
            category_slug: catSlug,
            image: img,
            services: [],
          };
        }
        subcatGroup[subcatId].services.push(ms);
      });

      return Object.values(subcatGroup).filter((s) => s.services.length > 0);
    }

    // Build subcategory catalog from subcategories list & map matching Master Services
    const catalog = subcategories.map((subcat) => {
      const subcatIdNum = Number(subcat.id);
      const subcatNameLower = (subcat.name || "").toLowerCase().trim();

      // Find all master services under this subcategory
      const matchingServices = masterServices.filter((ms) => {
        if (ms.is_active === 0 || ms.status === 0 || ms.status === "inactive") return false;
        
        const msSubId = Number(ms.subcategory_id);
        const msCatId = Number(ms.category_id);
        const msSubName = (ms.subcategory_name || "").toLowerCase().trim();

        return (
          msSubId === subcatIdNum ||
          (msSubName && msSubName === subcatNameLower) ||
          (msCatId === Number(subcat.category_id) && !ms.subcategory_id)
        );
      });

      // Find category name
      const parentCategory = categories.find((c) => Number(c.id) === Number(subcat.category_id));
      const categoryId = subcat.category_id || parentCategory?.id || matchingServices[0]?.category_id;
      const categoryName = parentCategory?.name || subcat.category_name || "Service Category";
      const categorySlug = parentCategory?.slug || subcat.category_slug;

      const subcatImage =
        subcat.image || subcat.image_url || subcat.thumbnail || matchingServices[0]?.cover_image || DEFAULT_SUBCAT_IMAGE;

      return {
        id: subcat.id,
        name: subcat.name,
        slug: subcat.slug || `sub-${subcat.id}`,
        category_id: categoryId,
        category_name: categoryName,
        category_slug: categorySlug,
        image: subcatImage,
        services: matchingServices,
      };
    });

    // REQUIREMENT: Load all subcategories that contain at least ONE active service
    return catalog.filter((subcat) => subcat.services.length > 0);
  }, [subcategories, masterServices, categories]);

  // Unique Parent Categories List for Filters
  const filterCategories = useMemo(() => {
    const set = new Set(["All"]);
    subcategoryCatalog.forEach((item) => {
      if (item.category_name) set.add(item.category_name);
    });
    return Array.from(set);
  }, [subcategoryCatalog]);

  // Filtered Subcategories based on Search Term & Selected Category
  const filteredSubcategories = useMemo(() => {
    return subcategoryCatalog.filter((item) => {
      // Category Filter
      if (selectedCategory !== "All" && item.category_name !== selectedCategory) {
        return false;
      }

      // Search Term Filter
      if (!searchTerm.trim()) return true;

      const query = searchTerm.toLowerCase().trim();
      const matchName = item.name.toLowerCase().includes(query);
      const matchCat = item.category_name.toLowerCase().includes(query);
      const matchServices = item.services.some(
        (s) =>
          (s.title || "").toLowerCase().includes(query) ||
          (s.short_description || "").toLowerCase().includes(query)
      );

      return matchName || matchCat || matchServices;
    });
  }, [subcategoryCatalog, selectedCategory, searchTerm]);

  const handleSubcategoryClick = (subcat) => {
    const rawCatId = subcat.category_id || (subcat.services && subcat.services[0]?.category_id);
    const catKey = (rawCatId && String(rawCatId) !== "all")
      ? rawCatId
      : (subcat.category_slug && subcat.category_slug !== "all" ? subcat.category_slug : "1");

    navigate(`/user/category/${catKey}/subcategory/${subcat.id}`);
  };

  return (
    <div className="master-services-catalog-page">
      {/* 1. HERO BANNER HEADER */}
      <header className="catalog-hero-section">
        <div className="catalog-hero-container">
          <div className="catalog-kicker">
            <Sparkles size={16} />
            <span>G9EXPERT MASTER SERVICES CATALOG</span>
          </div>

          <div className="catalog-title">Explore Verified Master Services</div>
          <p className="catalog-subtitle">
            Browse structured professional services by subcategory with transparent pricing, instant expert match, and 100% satisfaction guarantee.
          </p>

         

          {/* CATEGORY FILTER PILLS */}
          {filterCategories.length > 1 && (
            <div className="catalog-category-pills">
              {filterCategories.map((catName) => (
                <button
                  key={catName}
                  type="button"
                  className={`catalog-pill ${selectedCategory === catName ? "active" : ""}`}
                  onClick={() => setSelectedCategory(catName)}
                >
                  {catName}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* 2. MAIN CATALOG GRID SECTION */}
      <main className="catalog-main-content">
        <div className="catalog-content-container">
          <div className="catalog-section-header">
            <div className="catalog-header-text">
              <h2>Master Service Subcategories</h2>
              <span className="catalog-count-badge">
                {filteredSubcategories.length} Subcategories Available
              </span>
            </div>
            {searchTerm && (
              <div className="catalog-active-filter-indicator">
                <span>Filtering by: &ldquo;{searchTerm}&rdquo;</span>
                <button type="button" onClick={() => setSearchTerm("")}>
                  Reset
                </button>
              </div>
            )}
          </div>

          {/* LOADING SKELETON */}
          {loading ? (
            <div className="catalog-grid-skeleton">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="catalog-card-skeleton">
                  <div className="skeleton-img" />
                  <div className="skeleton-body">
                    <div className="skeleton-line line-short" />
                    <div className="skeleton-line line-title" />
                    <div className="skeleton-line line-subtitle" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="catalog-error-state">
              <RefreshCw size={36} color="#ef4444" />
              <h3>Failed to load Master Services</h3>
              <p>{error}</p>
              <button
                type="button"
                className="catalog-retry-btn"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          ) : filteredSubcategories.length === 0 ? (
            <div className="catalog-empty-state">
              <Layers size={48} color="#94a3b8" />
              <h3>No Subcategories Found</h3>
              <p>We couldn&apos;t find any subcategories matching your search criteria.</p>
              <button
                type="button"
                className="catalog-reset-btn"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* SUBCATEGORY CARDS GRID */
            <div className="catalog-cards-grid">
              {filteredSubcategories.map((subcat) => (
                <div
                  key={subcat.id}
                  className="catalog-subcat-card"
                  onClick={() => handleSubcategoryClick(subcat)}
                  role="button"
                  tabIndex={0}
                >
                  {/* CARD IMAGE & BADGE */}
                  <div className="subcat-card-image-wrap">
                    <img
                      src={subcat.image}
                      alt={subcat.name}
                      className="subcat-card-img"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = DEFAULT_SUBCAT_IMAGE;
                      }}
                    />
                    <div className="subcat-category-tag">{subcat.category_name}</div>
                    <div className="subcat-service-count-badge">
                      <Briefcase size={12} />
                      <span>{subcat.services.length} Master Services</span>
                    </div>
                  </div>

                  {/* CARD CONTENT */}
                  <div className="subcat-card-body">
                    <h3 className="subcat-card-title">{subcat.name}</h3>

                    {/* SAMPLE SERVICES PREVIEW CHIPS */}
                    <div className="subcat-services-preview">
                      {subcat.services.slice(0, 3).map((svc, idx) => (
                        <span key={idx} className="preview-chip">
                          <CheckCircle2 size={11} color="#059669" />
                          <span>{svc.title || svc.name}</span>
                        </span>
                      ))}
                      {subcat.services.length > 3 && (
                        <span className="preview-more-chip">
                          +{subcat.services.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* CARD FOOTER CTA */}
                    <div className="subcat-card-footer">
                      <span className="browse-link-text">Browse Services</span>
                      <ArrowRight size={16} className="subcat-arrow-icon" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 3. TRUST & SATISFACTION BANNER */}
      <footer className="catalog-trust-banner">
        <div className="trust-banner-container">
          <div className="trust-banner-item">
            <ShieldCheck size={24} color="#059669" />
            <div>
              <strong>100% Verified Master Services</strong>
              <span>Standardized deliverables by accredited professionals</span>
            </div>
          </div>
          <div className="trust-banner-item">
            <Zap size={24} color="#2563eb" />
            <div>
              <strong>Fast Turnaround Delivery</strong>
              <span>Guaranteed milestone tracking &amp; timely delivery</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
