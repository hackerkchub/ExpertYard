// src/pages/ExpertList/ExpertList.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSeo } from "../../../../shared/seo/useSeo";
import { discoverExperts, getSeoLocationPage } from "../../../../shared/api/userApi/locationDiscovery.api";

import {
  PageWrap,
  HeaderWrap,
  PageTitle,
  PageSubtitle,
  Layout,
  LeftSidebar,
  FilterTitle,
  FiltersForm,
  FilterSection,
  SectionTitle,
  OptionList,
  OptionLabel,
  RadioInput,
  RightPanel,
  ExpertsGrid,
  ExpertCard,
  AvatarImg,
  ExpertBody,
  ExpertName,
  StatusPill,
  MetaRow,
  Rating,
  PriceRow,
  Price,
  PerMinute,
  SuggestedSection,
  SuggestedHeader,
  SuggestedTitle,
  SuggestedStrip,
  SuggestedCard,
  SuggestedName,
  SuggestedMeta
} from "./ExpertList.styles";

import { useCategory } from "../../../../shared/context/CategoryContext";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { getExpertsBySubCategoryApi } from "../../../../shared/api/expertapi/auth.api";
import useNetworkReconnect from "../../../../shared/hooks/useNetworkReconnect";
import NeedHelpForm from "../../components/NeedHelpForm/NeedHelpForm";
import { buildTrackingPayload, trackLeadEvent } from "../../../../shared/utils/leadTracking";
import { normalizeVideoCallPrice } from "../../../../shared/utils/normalizeExpertPrice";

/* ---------------- QUERY ---------------- */
const useQuery = () => {
  const { search } = useLocation();
  return new URLSearchParams(search);
};

const ExpertListPage = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const rawParams = useParams();
  const trackedListRef = useRef("");

  const categoryId = query.get("category");
  const subCategoryId = query.get("sub_category");

  const { categories, subCategories, loadSubCategories } = useCategory();
  const { user } = useAuth();

  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seoData, setSeoData] = useState(null);
  const [fallbackInfo, setFallbackInfo] = useState({ used: false, reason: null });

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating-high");

  /* ---------------- PARAMETER RESOLUTION ---------------- */
  const { categorySlug, subcategorySlug, citySlug, areaSlug, pincode } = useMemo(() => {
    const cat = rawParams.categorySlug;
    const p2 = rawParams.subcategorySlug || rawParams.citySlug;
    const p3 = rawParams.areaSlug || (rawParams.subcategorySlug ? rawParams.citySlug : undefined);
    const pin = rawParams.pincode;

    return {
      categorySlug: cat,
      subcategorySlug: rawParams.subcategorySlug,
      citySlug: rawParams.citySlug || (rawParams.subcategorySlug ? undefined : p2),
      areaSlug: rawParams.areaSlug || p3,
      pincode: pin
    };
  }, [rawParams]);

  /* ---------------- LOAD SEO DATA ---------------- */
  useEffect(() => {
    setSeoData(null);
    const loadSeo = async () => {
      try {
        const res = await getSeoLocationPage({
          p1: rawParams.categorySlug,
          p2: rawParams.subcategorySlug || rawParams.citySlug,
          p3: rawParams.citySlug && rawParams.subcategorySlug ? rawParams.citySlug : rawParams.areaSlug,
          category_slug: rawParams.categorySlug,
          subcategory_slug: rawParams.subcategorySlug,
          city: rawParams.citySlug,
          area: rawParams.areaSlug,
          pincode: rawParams.pincode
        });
        if (res.data?.success) {
          setSeoData(res.data.data);
        }
      } catch (err) {
        console.error("SEO load failed:", err);
      }
    };
    loadSeo();
  }, [rawParams]);

  /* ---------------- DERIVED BREADCRUMBS ---------------- */
  const activeBreadcrumbs = useMemo(() => {
    if (seoData?.breadcrumbs && seoData.breadcrumbs.length > 0) {
      return seoData.breadcrumbs;
    }
    const crumbs = [
      { name: "Home", url: "/" },
      { name: "Experts", url: "/experts" }
    ];
    if (categorySlug) {
      const catTitle = categorySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      crumbs.push({ name: catTitle, url: `/experts/${categorySlug}` });
    }
    if (subcategorySlug) {
      const subTitle = subcategorySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      crumbs.push({ name: subTitle, url: `/experts/${categorySlug}/${subcategorySlug}` });
    }
    if (citySlug) {
      const cityTitle = citySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      const cityUrl = subcategorySlug
        ? `/experts/${categorySlug}/${subcategorySlug}/${citySlug}`
        : `/experts/${categorySlug}/${citySlug}`;
      crumbs.push({ name: cityTitle, url: cityUrl });
    }
    return crumbs;
  }, [seoData, categorySlug, subcategorySlug, citySlug]);

  /* ---------------- CANONICAL PATH ---------------- */
  const canonicalPath = useMemo(() => {
    if (seoData?.canonical_url) {
      try {
        const parsed = new URL(seoData.canonical_url);
        return parsed.pathname;
      } catch (e) {
        // Fallback
      }
    }
    if (!rawParams.categorySlug) return "/experts";
    if (rawParams.pincode) return `/experts/${rawParams.categorySlug}/pincode/${rawParams.pincode}`;
    if (rawParams.subcategorySlug && rawParams.citySlug && rawParams.areaSlug) return `/experts/${rawParams.categorySlug}/${rawParams.subcategorySlug}/${rawParams.citySlug}/${rawParams.areaSlug}`;
    if (rawParams.subcategorySlug && rawParams.citySlug) return `/experts/${rawParams.categorySlug}/${rawParams.subcategorySlug}/${rawParams.citySlug}`;
    if (rawParams.citySlug) return `/experts/${rawParams.categorySlug}/${rawParams.citySlug}`;
    return `/experts/${rawParams.categorySlug}`;
  }, [seoData, rawParams]);

  /* ---------------- INJECT SEO METADATA ---------------- */
  const defaultPageTitle = useMemo(() => {
    if (seoData?.title) return seoData.title;
    if (categorySlug && citySlug) return `Best ${categorySlug.replace(/-/g, " ")} Experts in ${citySlug.replace(/-/g, " ")} | G9Expert`;
    if (categorySlug) return `Best ${categorySlug.replace(/-/g, " ")} Experts | G9Expert`;
    return "Expert Consultation | G9Expert";
  }, [seoData, categorySlug, citySlug]);

  const defaultMetaDesc = useMemo(() => {
    if (seoData?.meta_description) return seoData.meta_description;
    if (categorySlug && citySlug) return `Find best ${categorySlug.replace(/-/g, " ")} experts in ${citySlug.replace(/-/g, " ")} on G9Expert for 1-on-1 consultation.`;
    return "Compare and connect with verified experts on G9Expert for instant voice, video, and chat consultations.";
  }, [seoData, categorySlug, citySlug]);

  const [isInvalidTaxonomy, setIsInvalidTaxonomy] = useState(false);

  useSeo({
    title: defaultPageTitle,
    description: defaultMetaDesc,
    canonicalPath,
    noindex: (!loading && experts.length === 0) || isInvalidTaxonomy || seoData?.is_indexable === 0
  });

  /* ---------------- LOAD SUBCATEGORIES ---------------- */
  useEffect(() => {
    if (categoryId) loadSubCategories(categoryId);
  }, [categoryId]);

  /* ---------------- LOAD EXPERTS ---------------- */
  const loadExperts = useCallback(async () => {
    if (!subCategoryId) {
      try {
        setLoading(true);
        const res = await discoverExperts({
          p1: rawParams.categorySlug,
          p2: rawParams.subcategorySlug || rawParams.citySlug,
          p3: rawParams.citySlug && rawParams.subcategorySlug ? rawParams.citySlug : rawParams.areaSlug,
          category_slug: rawParams.categorySlug,
          subcategory_slug: rawParams.subcategorySlug,
          city: rawParams.citySlug,
          area: rawParams.areaSlug,
          pincode: rawParams.pincode
        });
        if (res.data?.success) {
          setIsInvalidTaxonomy(Boolean(res.data.is_invalid_taxonomy));
          const rawData = res.data.data || [];
          const seen = new Set();
          const unique = [];
          for (const item of rawData) {
            const id = Number(item.id || item.expert_id || item.expertId);
            if (id && !seen.has(id)) {
              seen.add(id);
              unique.push(item);
            }
          }
          setExperts(unique);
          setFallbackInfo({
            used: res.data.fallback_used || false,
            reason: res.data.fallback_reason || null
          });
        }
      } catch (err) {
        console.error("Discovery failed:", err);
        setExperts([]);
        setIsInvalidTaxonomy(false);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      const res = await getExpertsBySubCategoryApi(subCategoryId);
      const rawData = res.data?.data || [];
      const seen = new Set();
      const unique = [];
      for (const item of rawData) {
        const id = Number(item.id || item.expert_id || item.expertId);
        if (id && !seen.has(id)) {
          seen.add(id);
          unique.push(item);
        }
      }
      setExperts(unique);
      setFallbackInfo({ used: false, reason: null });
    } catch (err) {
      console.error("Load experts failed:", err);
      setExperts([]);
    } finally {
      setLoading(false);
    }
  }, [rawParams, subCategoryId]);

  useEffect(() => {
    loadExperts();
  }, [loadExperts]);

  const effectiveCategoryId =
    categoryId ||
    seoData?.category_id ||
    experts[0]?.category_id ||
    experts[0]?.categoryId ||
    null;

  useEffect(() => {
    const trackingKey = `${effectiveCategoryId || categorySlug || ""}:${subCategoryId || ""}:${citySlug || ""}`;
    if (!trackingKey || trackedListRef.current === trackingKey) return;
    trackedListRef.current = trackingKey;
    trackLeadEvent(
      "expert-list-view",
      buildTrackingPayload({
        user,
        sourcePage: "expert_listing",
        actionLabel: "Expert Listing Open",
        extra: {
          category_id: effectiveCategoryId,
          subcategory_id: subCategoryId || null,
          city: citySlug || user?.city || "",
          area: areaSlug || user?.area || "",
        },
      })
    );
  }, [effectiveCategoryId, subCategoryId, categorySlug, citySlug, areaSlug, user]);

  useNetworkReconnect(() => {
    if (categoryId) loadSubCategories(categoryId, true);
    loadExperts();
  }, { enabled: Boolean(categoryId || subCategoryId) });

  /* ---------------- TITLES ---------------- */
  const categoryName = categorySlug
    ? (seoData?.category_name || categorySlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()))
    : (categories.find((c) => c.id == categoryId)?.name || "Experts");

  const subCategoryName = categorySlug
    ? ""
    : (subCategories.find((s) => s.id == subCategoryId)?.name || "");

  /* ---------------- FILTER & SORT ---------------- */
  const filteredExperts = useMemo(() => {
    let list = [...experts];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.name?.toLowerCase().includes(q) ||
          e.subcategory_name?.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "rating-high":
        return list.sort((a, b) => b.rating - a.rating);
      case "rating-low":
        return list.sort((a, b) => a.rating - b.rating);
      case "budget-low":
        return list.sort((a, b) => a.call_per_minute - b.call_per_minute);
      case "budget-high":
        return list.sort((a, b) => b.call_per_minute - a.call_per_minute);
      default:
        return list;
    }
  }, [experts, search, sortBy]);

  /* ---------------- SUGGESTED ---------------- */
  const hasRelatedCategories = Boolean(seoData?.related_categories && seoData.related_categories.length > 0);
  const hasRelatedSubcats = Boolean(seoData?.related_subcategories && seoData.related_subcategories.length > 0);
  const hasRelatedCities = Boolean(seoData?.related_cities && seoData.related_cities.length > 0);
  const hasOtherExperts = Boolean(seoData?.other_experts && seoData.other_experts.length > 0);
  const hasAnyRelated = hasRelatedCategories || hasRelatedSubcats || hasRelatedCities || hasOtherExperts;

  return (
    <PageWrap className="expert-listing-page">
      {/* ================= BREADCRUMBS & STRUCTURED DATA ================= */}
      {activeBreadcrumbs && activeBreadcrumbs.length > 0 && (
        <>
          <nav aria-label="Breadcrumb" style={{ marginBottom: "16px", fontSize: "14px", color: "#64748b" }}>
            <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px" }}>
              {activeBreadcrumbs.map((crumb, idx) => {
                const isLast = idx === activeBreadcrumbs.length - 1;
                return (
                  <li key={idx} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    {idx > 0 && <span style={{ color: "#94a3b8" }}>/</span>}
                    {isLast ? (
                      <span style={{ color: "#0f172a", fontWeight: 600 }}>{crumb.name}</span>
                    ) : (
                      <a href={crumb.url} onClick={(e) => { e.preventDefault(); navigate(crumb.url); }} style={{ color: "#2563eb", textDecoration: "none" }}>
                        {crumb.name}
                      </a>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: activeBreadcrumbs.map((crumb, idx) => ({
                  "@type": "ListItem",
                  position: idx + 1,
                  name: crumb.name,
                  item: `https://g9expert.com${crumb.url}`
                }))
              })
            }}
          />
        </>
      )}

      {filteredExperts.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: filteredExperts.map((exp, idx) => ({
                "@type": "ListItem",
                position: idx + 1,
                name: exp.expert_name || exp.name,
                url: `https://g9expert.com/user/experts/${exp.slug || exp.expert_slug || exp.expert_id}`
              }))
            })
          }}
        />
      )}

      {/* ================= HEADER ================= */}
      <HeaderWrap>
        <PageTitle>
          {seoData?.h1 || (
            categorySlug
              ? (citySlug
                  ? `Best ${categoryName} Experts in ${citySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}`
                  : `Best ${categoryName} Experts`)
              : "Expert Consultation on G9Expert"
          )}
        </PageTitle>
        <PageSubtitle>
          {seoData?.intro || (
            categorySlug
              ? (citySlug
                  ? `Find ${categoryName.toLowerCase()} experts in ${citySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} for personalized guidance and consultation needs.`
                  : `Find top ${categoryName.toLowerCase()} experts on G9Expert for instant 1-on-1 consultations.`)
              : "Find experts across multiple categories on G9Expert and compare their specializations, availability, consultation options and reviews before connecting for a 1-on-1 consultation."
          )}
        </PageSubtitle>
      </HeaderWrap>

      <Layout>
        {/* ================= FILTER ================= */}
        <LeftSidebar>
          <FilterTitle>Filter & Sort</FilterTitle>

          <FiltersForm>
            <FilterSection>
              <SectionTitle>Sort By</SectionTitle>
              <OptionList>
                <OptionLabel $active={sortBy === "rating-high"}>
                  <RadioInput
                    type="radio"
                    name="sortBy"
                    checked={sortBy === "rating-high"}
                    onChange={() => setSortBy("rating-high")}
                  />
                  Rating: High to Low
                </OptionLabel>

                <OptionLabel $active={sortBy === "rating-low"}>
                  <RadioInput
                    type="radio"
                    name="sortBy"
                    checked={sortBy === "rating-low"}
                    onChange={() => setSortBy("rating-low")}
                  />
                  Rating: Low to High
                </OptionLabel>

                <OptionLabel $active={sortBy === "budget-low"}>
                  <RadioInput
                    type="radio"
                    name="sortBy"
                    checked={sortBy === "budget-low"}
                    onChange={() => setSortBy("budget-low")}
                  />
                  Price: Low to High
                </OptionLabel>

                <OptionLabel $active={sortBy === "budget-high"}>
                  <RadioInput
                    type="radio"
                    name="sortBy"
                    checked={sortBy === "budget-high"}
                    onChange={() => setSortBy("budget-high")}
                  />
                  Price: High to Low
                </OptionLabel>
              </OptionList>
            </FilterSection>
          </FiltersForm>
        </LeftSidebar>

        {/* ================= EXPERT LIST ================= */}
        <RightPanel>
          {fallbackInfo.used && (
            <div style={{
              marginBottom: 16,
              padding: "12px 16px",
              background: "#fffbeb",
              border: "1px solid #fef3c7",
              borderRadius: "12px",
              color: "#b45309",
              fontSize: "13px"
            }}>
              ⚠️ {fallbackInfo.reason}
            </div>
          )}
          {loading ? (
            <div style={{ padding: 40 }}>Loading experts…</div>
          ) : (
            <ExpertsGrid>
              {filteredExperts.map((exp) => {
                const name = exp.expert_name || exp.name || "Verified Expert";
                const avatar = exp.profile_image || exp.profile_photo;
                const price = exp.call_per_minute || 0;
                const videoCallPrice = normalizeVideoCallPrice(exp);
                return (
                  <ExpertCard
                    key={exp.expert_id}
                    onClick={() => navigate(`/user/experts/${exp.slug || exp.expert_slug || exp.expert_id}`)}
                  >
                    <AvatarImg src={avatar} />

                    <ExpertBody>
                      <ExpertName>{name}</ExpertName>

                      <StatusPill $online>
                        Online
                      </StatusPill>

                      <MetaRow>
                        <Rating>★ {exp.rating}</Rating>
                        <span>{exp.review_count || exp.reviews || 0} reviews</span>
                      </MetaRow>

                      <MetaRow>{exp.subcategory_name || exp.position}</MetaRow>
                      <MetaRow>
                        {exp.location || `${exp.city || ""}${exp.state ? ", " + exp.state : ""}`}
                        {exp.distance_km != null && <span style={{ marginLeft: 8 }}>📍 {exp.distance_km} km</span>}
                      </MetaRow>
                    </ExpertBody>
                  </ExpertCard>
                );
              })}
            </ExpertsGrid>
          )}
          {!loading && filteredExperts.length === 0 && effectiveCategoryId && (
            <NeedHelpForm
              categoryId={effectiveCategoryId}
              subcategoryId={subCategoryId}
              categoryName={categoryName}
              sourcePage="expert_listing_no_results"
            />
          )}
        </RightPanel>
      </Layout>

      {effectiveCategoryId && filteredExperts.length > 0 && (
        <NeedHelpForm
          categoryId={effectiveCategoryId}
          subcategoryId={subCategoryId}
          categoryName={categoryName}
          sourcePage="expert_listing"
        />
      )}

      {/* ================= DYNAMIC ABOUT SECTION ================= */}
      {seoData?.seo_text && (
        <section style={{
          padding: "24px 32px",
          background: "#ffffff",
          borderTop: "1px solid #f1f5f9",
          fontSize: "14px",
          lineHeight: "1.6",
          color: "#475569",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.03)",
          margin: "24px 0"
        }}>
          <h3 style={{ margin: "0 0 10px", color: "#0f172a" }}>{seoData.about_title || `About ${seoData.h1}`}</h3>
          <p style={{ margin: 0 }}>{seoData.seo_text}</p>
        </section>
      )}

      {/* ================= RELATED DISCOVERY SECTION ================= */}
      {hasAnyRelated && (
        <section style={{ marginTop: "32px", marginBottom: "32px" }}>
          {/* Block 0: Related Categories (for /experts ROOT page) */}
          {hasRelatedCategories && (
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", marginBottom: "14px" }}>
                {seoData.related_categories_title || "Explore Expert Categories"}
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {seoData.related_categories.map((catItem) => (
                  <a
                    key={catItem.slug}
                    href={catItem.url}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(catItem.url);
                    }}
                    style={{
                      padding: "10px 18px",
                      borderRadius: "12px",
                      background: "#ffffff",
                      border: "1px solid #cbd5e1",
                      color: "#0f172a",
                      fontSize: "14px",
                      fontWeight: "600",
                      textDecoration: "none",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
                      transition: "all 0.15s ease"
                    }}
                  >
                    {catItem.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Block A: Other Experts */}
          {hasOtherExperts && (
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#334155", marginBottom: "12px" }}>
                {seoData.other_experts_title || (citySlug ? `More Experts in ${citySlug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}` : `Other ${categoryName} Experts`)}
              </h3>
              <SuggestedStrip>
                {seoData.other_experts.map((exp) => (
                  <SuggestedCard
                    key={exp.expert_id}
                    onClick={() => navigate(`/user/experts/${exp.slug || exp.expert_slug || exp.expert_id}`)}
                  >
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                      <img
                        src={exp.profile_image || "https://via.placeholder.com/40"}
                        alt={exp.expert_name}
                        style={{ width: "40px", height: "40px", borderRadius: "10px", objectFit: "cover" }}
                      />
                      <div>
                        <SuggestedName style={{ marginTop: 0, fontSize: "14px" }}>{exp.expert_name}</SuggestedName>
                        <span style={{ fontSize: "11px", color: "#facc15", fontWeight: "600" }}>★ {exp.rating}</span>
                      </div>
                    </div>
                    <SuggestedMeta>{exp.subcategory_name || exp.location}</SuggestedMeta>
                  </SuggestedCard>
                ))}
              </SuggestedStrip>
            </div>
          )}

          {/* Block B: Related Subcategories */}
          {hasRelatedSubcats && (
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#334155", marginBottom: "12px" }}>
                {seoData.related_subcategories_title || `Explore ${categoryName} Specializations`}
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {seoData.related_subcategories.map((sc) => (
                  <a
                    key={sc.slug}
                    href={sc.url}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(sc.url);
                    }}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "12px",
                      background: "#ffffff",
                      border: "1px solid #cbd5e1",
                      color: "#1e293b",
                      fontSize: "13px",
                      fontWeight: "500",
                      textDecoration: "none",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                      transition: "all 0.15s ease"
                    }}
                  >
                    {sc.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Block C: Related Cities */}
          {hasRelatedCities && (
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#334155", marginBottom: "12px" }}>
                {seoData.related_cities_title || `${categoryName} Experts by City`}
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {seoData.related_cities.map((ct) => (
                  <a
                    key={ct.slug}
                    href={ct.url}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(ct.url);
                    }}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "12px",
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      color: "#2563eb",
                      fontSize: "13px",
                      fontWeight: "500",
                      textDecoration: "none",
                      transition: "all 0.15s ease"
                    }}
                  >
                    📍 {ct.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </PageWrap>
  );
};

export default ExpertListPage;


