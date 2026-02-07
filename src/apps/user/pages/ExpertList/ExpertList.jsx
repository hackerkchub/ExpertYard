// src/pages/ExpertList/ExpertList.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
import { getExpertsBySubCategoryApi } from "../../../../shared/api/expertapi/auth.api";

/* ---------------- QUERY ---------------- */
const useQuery = () => {
  const { search } = useLocation();
  return new URLSearchParams(search);
};

const ExpertListPage = () => {
  const query = useQuery();
  const navigate = useNavigate();

  const categoryId = query.get("category");
  const subCategoryId = query.get("sub_category");

  const { categories, subCategories, loadSubCategories } = useCategory();

  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating-high");

  /* ---------------- LOAD SUBCATEGORIES ---------------- */
  useEffect(() => {
    if (categoryId) loadSubCategories(categoryId);
  }, [categoryId]);

  /* ---------------- LOAD EXPERTS ---------------- */
  useEffect(() => {
    if (!subCategoryId) return;

    const loadExperts = async () => {
      try {
        setLoading(true);
        const res = await getExpertsBySubCategoryApi(subCategoryId);
        setExperts(res.data?.data || []);
      } catch (err) {
        console.error(err);
        setExperts([]);
      } finally {
        setLoading(false);
      }
    };

    loadExperts();
  }, [subCategoryId]);

  /* ---------------- TITLES ---------------- */
  const categoryName =
    categories.find((c) => c.id == categoryId)?.name || "Experts";

  const subCategoryName =
    subCategories.find((s) => s.id == subCategoryId)?.name || "";

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
          Top {subCategoryName} • {categoryName}
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
          {loading ? (
            <div style={{ padding: 40 }}>Loading experts…</div>
          ) : (
            <ExpertsGrid>
              {filteredExperts.map((exp) => (
                <ExpertCard
                  key={exp.expert_id}
                  onClick={() => navigate(`/user/experts/${exp.expert_id}`)}
                >
                  <AvatarImg src={exp.profile_photo} />

                  <ExpertBody>
                    <ExpertName>{exp.name}</ExpertName>

                    <StatusPill $online>
                      Online
                    </StatusPill>

                    <MetaRow>
                      <Rating>★ {exp.rating}</Rating>
                      <span>{exp.reviews} reviews</span>
                    </MetaRow>

                    <MetaRow>{exp.subcategory_name}</MetaRow>
                    <MetaRow>{exp.location}</MetaRow>

                    <PriceRow>
                      <Price>₹{exp.call_per_minute}</Price>
                      <PerMinute>/min</PerMinute>
                    </PriceRow>
                  </ExpertBody>
                </ExpertCard>
              ))}
            </ExpertsGrid>
          )}
        </RightPanel>
      </Layout>

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
