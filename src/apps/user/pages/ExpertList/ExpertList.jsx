// src/pages/ExpertList/ExpertList.jsx
import React, { useState, useMemo } from "react";
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

import { useExperts } from "../../../../shared/context/ExpertContext";
import { SUBCATEGORIES, getAllExperts } from "../../../../shared/services/expertService";

/* -------------------------------------------------------
   Query Reader
------------------------------------------------------- */
const useQuery = () => {
  const { search } = useLocation();
  return new URLSearchParams(search);
};

/* -------------------------------------------------------
   COMPONENT
------------------------------------------------------- */
const ExpertListPage = () => {
  const query = useQuery();
  const navigate = useNavigate();

  const profession = query.get("profession") || "engineers";
  const speciality = query.get("speciality") || "frontend";

  const { experts, loading } = useExperts();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating-high");

  /* -------------------------------------------------------
     FILTER MAIN EXPERTS (GLOBAL DATA)
  ------------------------------------------------------- */
  const filteredExperts = useMemo(() => {
    let list = experts.filter(
      (e) => e.professionId === profession && e.specialityId === speciality
    );

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (sortBy) {
      case "rating-high":
        return [...list].sort((a, b) => b.rating - a.rating);
      case "rating-low":
        return [...list].sort((a, b) => a.rating - b.rating);
      case "experience-high":
        return [...list].sort((a, b) => b.experienceYears - a.experienceYears);
      case "budget-low":
        return [...list].sort((a, b) => a.callPrice - b.callPrice);
      case "budget-high":
        return [...list].sort((a, b) => b.callPrice - a.callPrice);
      default:
        return list;
    }
  }, [profession, speciality, search, sortBy, experts]);

  /* -------------------------------------------------------
     SUGGESTED = Same profession, different speciality
  ------------------------------------------------------- */
  const suggestedExperts = useMemo(() => {
    return experts.filter(
      (e) => e.professionId === profession && e.specialityId !== speciality
    );
  }, [profession, speciality, experts]);

  const specialityLabel =
    SUBCATEGORIES[profession]?.[speciality] || "Experts";

  return (
    <PageWrap>
      <HeaderWrap>
        <PageTitle>
          Top {specialityLabel} • {profession}
        </PageTitle>

        <PageSubtitle>
          Real-time availability • Verified professionals • Trusted guidance
        </PageSubtitle>
      </HeaderWrap>

      <Layout>
        {/* ---------------- LEFT FILTER BAR ---------------- */}
        <LeftSidebar>
          <FilterTitle>Filter & Sort</FilterTitle>

          <FiltersForm>
            <Field>
              <FieldLabel>Search</FieldLabel>
              <SearchInput
                placeholder="Search by name or skills…"
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
                $active={sortBy === "experience-high"}
                onClick={() => setSortBy("experience-high")}
              >
                Experience High → Low
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

        {/* ---------------- EXPERT LIST ---------------- */}
        <RightPanel>
          <ExpertsGrid>
            {filteredExperts.map((exp) => (
              <ExpertCard
                key={exp.id}
                onClick={() => navigate(`/user/experts/${exp.id}`)}   // 🔥 CLEAN ROUTE
                style={{ cursor: "pointer" }}
              >
                <AvatarImg src={exp.img} />

                <ExpertBody>
                  <ExpertName>{exp.name}</ExpertName>

                  <StatusPill $online={exp.online}>
                    {exp.online ? "Online" : "Offline"}
                  </StatusPill>

                  <MetaRow>
                    <Rating>★ {exp.rating}</Rating>
                    <span>{exp.experienceYears}+ yrs</span>
                    <span>{exp.reviews} reviews</span>
                  </MetaRow>

                  <MetaRow>{exp.role}</MetaRow>

                  <PriceRow>
                    <Price>₹{exp.callPrice}</Price>
                    <PerMinute>/min</PerMinute>
                  </PriceRow>
                </ExpertBody>
              </ExpertCard>
            ))}
          </ExpertsGrid>
        </RightPanel>
      </Layout>

      {/* ---------------- SUGGESTED SECTION ---------------- */}
      <SuggestedSection>
        <SuggestedHeader>
          <SuggestedTitle>
            More {profession} Experts You May Like
          </SuggestedTitle>
        </SuggestedHeader>

        <SuggestedStrip>
          {suggestedExperts.map((exp) => (
            <SuggestedCard
              key={exp.id}
              onClick={() => navigate(`/user/experts/${exp.id}`)}   // 🔥 CLEAN ROUTE
              style={{ cursor: "pointer" }}
            >
              <AvatarImg
                src={exp.img}
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: "50%",
                  marginBottom: 8
                }}
              />

              <SuggestedName>{exp.name}</SuggestedName>
              <SuggestedMeta>{exp.role}</SuggestedMeta>
              <SuggestedMeta>★ {exp.rating}</SuggestedMeta>
              <SuggestedMeta>
                {exp.online ? "🟢 Online" : "⚪ Offline"}
              </SuggestedMeta>
              <SuggestedMeta>₹{exp.callPrice}/min</SuggestedMeta>
            </SuggestedCard>
          ))}
        </SuggestedStrip>
      </SuggestedSection>
    </PageWrap>
  );
};

export default ExpertListPage;
