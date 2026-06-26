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
  Field,
  FieldLabel,
  SearchInput,
  PillsRow,
  PillButton,
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

/* ---------------- QUERY ---------------- */
const useQuery = () => {
  const { search } = useLocation();
  return new URLSearchParams(search);
};

const ExpertListPage = () => {
  const query = useQuery();
  const navigate = useNavigate();
  const { categorySlug, citySlug, areaSlug, pincode } = useParams();
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

  /* ---------------- LOAD SEO DATA ---------------- */
  useEffect(() => {
    if (!categorySlug) return;

    const loadSeo = async () => {
      try {
        const res = await getSeoLocationPage({
          category: categorySlug,
          city: citySlug,
          area: areaSlug,
          pincode
        });
        if (res.data?.success) {
          setSeoData(res.data.data);
        }
      } catch (err) {
        console.error("SEO load failed:", err);
      }
    };
    loadSeo();
  }, [categorySlug, citySlug, areaSlug, pincode]);

  /* ---------------- INJECT SEO METADATA ---------------- */
  useSeo({
    title: seoData?.title || "G9 Experts",
    description: seoData?.meta_description || "Compare and connect with verified G9 Experts.",
    canonicalPath: categorySlug 
      ? `/experts/${categorySlug}/${citySlug ? (areaSlug ? citySlug + '/' + areaSlug : citySlug) : 'pincode/' + pincode}`
      : undefined
  });

  /* ---------------- LOAD SUBCATEGORIES ---------------- */
  useEffect(() => {
    if (categoryId) loadSubCategories(categoryId);
  }, [categoryId]);

  /* ---------------- LOAD EXPERTS ---------------- */
  const loadExperts = useCallback(async () => {
    if (categorySlug) {
      try {
        setLoading(true);
        const res = await discoverExperts({
          category_slug: categorySlug,
          city: citySlug,
          area: areaSlug,
          pincode
        });
        if (res.data?.success) {
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
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!subCategoryId) return;

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
  }, [categorySlug, citySlug, areaSlug, pincode, subCategoryId]);

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
  const suggestedSubCategories = subCategories.filter(
    (s) => s.id != subCategoryId
  );

  return (
    <PageWrap>
      {/* ================= HEADER ================= */}
      <HeaderWrap>
        <PageTitle>
          {seoData?.h1 || `Top ${subCategoryName || categoryName} Experts`}
        </PageTitle>
        <PageSubtitle>
          Verified experts • Real-time availability • Trusted guidance
        </PageSubtitle>
      </HeaderWrap>

      <Layout>
        {/* ================= FILTER ================= */}
        <LeftSidebar>
          <FilterTitle>Filter & Sort</FilterTitle>

          <FiltersForm>
            <Field>
              <FieldLabel>Search</FieldLabel>
              <SearchInput
                placeholder="Search expert name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Field>

            <PillsRow>
              <PillButton
                $active={sortBy === "rating-high"}
                onClick={() => setSortBy("rating-high")}
              >
                Rating High → Low
              </PillButton>

              <PillButton
                $active={sortBy === "rating-low"}
                onClick={() => setSortBy("rating-low")}
              >
                Rating Low → High
              </PillButton>

              <PillButton
                $active={sortBy === "budget-low"}
                onClick={() => setSortBy("budget-low")}
              >
                Budget Low → High
              </PillButton>

              <PillButton
                $active={sortBy === "budget-high"}
                onClick={() => setSortBy("budget-high")}
              >
                Budget High → Low
              </PillButton>
            </PillsRow>
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
                return (
                  <ExpertCard
                    key={exp.expert_id}
                    onClick={() => navigate(`/user/experts/${exp.expert_id}`)}
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

                      <PriceRow>
                        <Price>₹{price}</Price>
                        <PerMinute>/min</PerMinute>
                      </PriceRow>
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
          <h3 style={{ margin: "0 0 10px", color: "#0f172a" }}>About {seoData.h1}</h3>
          <p style={{ margin: 0 }}>{seoData.seo_text}</p>
        </section>
      )}

      {/* ================= SUGGESTED ================= */}
      <SuggestedSection>
        <SuggestedHeader>
          <SuggestedTitle>
            Explore other {categoryName} experts
          </SuggestedTitle>
        </SuggestedHeader>

        <SuggestedStrip>
          {suggestedSubCategories.map((sc) => (
            <SuggestedCard
              key={sc.id}
              onClick={() =>
                navigate(`/user/experts?category=${categoryId}&sub_category=${sc.id}`)
              }
            >
              <SuggestedName>{sc.name}</SuggestedName>
              <SuggestedMeta>View experts</SuggestedMeta>
            </SuggestedCard>
          ))}
        </SuggestedStrip>
      </SuggestedSection>
    </PageWrap>
  );
};

export default ExpertListPage;
