// src/apps/user/pages/UserExpertsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  PageWrap,
  HeaderSection,
  Title,
  SubTitle,
  TabsRow,
  TabButton,
  Layout,
  FilterWrap,
  FilterTitle,
  FilterGroup,
  FilterLabel,
  FilterSelect,
  FilterCheckboxRow,
  FilterCheckbox,
  FilterText,
  ResetFilterBtn,
  ExpertsWrap,
  Grid,
  EmptyState,
  LoaderRow,
  AIComingSoon,
  AIIcon,
  AITitle,
  AIDesc,
  AIHint,
} from "./CallChatExpert.styles";

import ExpertCard from "../../components/userExperts/ExpertCard";
import { useExpert } from "../../../../shared/context/ExpertContext";
import { useCategory } from "../../../../shared/context/CategoryContext";

const TABS = [
  { id: "call", label: "Call with Experts" },
  { id: "chat", label: "Chat with Experts" },
  { id: "ai", label: "AI Experts" },
];

const professionsMap = {
  all: "All Professions",
  engineers: "Engineers",
  doctors: "Doctors",
  mentors: "Mentors",
  lawyers: "Lawyers",
  therapists: "Therapists",
  fitness: "Fitness",
  business: "Business",
  global: "Global Strategy",
};

const languagesOptions = [
  "English",
  "Hindi",
  "Marathi",
  "Gujarati",
  "Tamil",
  "Kannada",
];

export default function UserExpertsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const modeFromUrl = searchParams.get("mode"); // call | chat

  const [tab, setTab] = useState("call");

  // all profiles from ExpertContext (mapped from /expert-profile/list)
  const { experts, expertsLoading } = useExpert();
  const { subCategories } = useCategory();

  const [profession, setProfession] = useState("all");
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [minRating, setMinRating] = useState("0");
  const [maxPrice, setMaxPrice] = useState("");

  // URL → TAB sync
  useEffect(() => {
    if (modeFromUrl === "call" || modeFromUrl === "chat") {
      setTab(modeFromUrl);
    }
  }, [modeFromUrl]);

  const toggleLanguage = (lang) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang)
        ? prev.filter((l) => l !== lang)
        : [...prev, lang]
    );
  };

  const resetFilters = () => {
    setProfession("all");
    setSelectedLanguages([]);
    setMinRating("0");
    setMaxPrice("");
  };

  // helper: subcategory name from id
  const getSubcategoryName = (subId) => {
    const sc = subCategories.find((s) => Number(s.id) === Number(subId));
    return sc ? sc.name : "";
  };

  // FILTER LOGIC (profession/lang/rating/price)
  const filteredList = useMemo(() => {
    if (tab === "ai") return [];

    let list = [...experts];

    // Profession (simple contains check on position)
    if (profession !== "all") {
      const key = profession.toLowerCase();
      list = list.filter((e) =>
        (e.position || "").toLowerCase().includes(
          key === "doctors" ? "doctor" : key.slice(0, 3)
        )
      );
    }

    // Language: abhi API nahi, to filter skip; future me ExpertCard se language array aayega
    if (selectedLanguages.length > 0) {
      list = list.filter(() => true);
    }

    // Rating: card level pe avgRating aayega (prop), yahan sirf minRating respect karne ke liye
    const ratingMin = parseFloat(minRating || "0");
    if (ratingMin > 0) {
      list = list.filter((e) => Number(e.avgRating || 0) >= ratingMin);
    }

    // Price: per expert price API se ExpertCard me load hoga;
    // yahan sirf maxPrice prop pass karenge filter check ke liye card ke andar
    return list;
  }, [tab, experts, profession, selectedLanguages, minRating, maxPrice]);

  return (
    <PageWrap>
      {/* HEADER */}
      <HeaderSection>
        <div>
          <Title>Find the right expert – instantly</Title>
          <SubTitle>
            Talk 1:1 with verified professionals & smart AI specialists
            for career, health, finance, legal and more.
          </SubTitle>
        </div>
      </HeaderSection>

      {/* TABS */}
      <TabsRow>
        {TABS.map((t) => (
          <TabButton
            key={t.id}
            $active={tab === t.id}
            onClick={() => {
              setTab(t.id);
              if (t.id !== "ai") {
                setSearchParams({ mode: t.id });
              }
            }}
          >
            {t.label}
          </TabButton>
        ))}
      </TabsRow>

      {/* MAIN LAYOUT */}
      <Layout>
        {/* FILTERS */}
        <FilterWrap>
          <FilterTitle>Filters</FilterTitle>

          {tab !== "ai" && (
            <FilterGroup>
              <FilterLabel>Profession</FilterLabel>
              <FilterSelect
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
              >
                {Object.entries(professionsMap).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
          )}

          <FilterGroup>
            <FilterLabel>Language</FilterLabel>
            {languagesOptions.map((lang) => (
              <FilterCheckboxRow key={lang}>
                <FilterCheckbox
                  type="checkbox"
                  checked={selectedLanguages.includes(lang)}
                  onChange={() => toggleLanguage(lang)}
                />
                <FilterText>{lang}</FilterText>
              </FilterCheckboxRow>
            ))}
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Minimum Rating</FilterLabel>
            <FilterSelect
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
            >
              <option value="0">Any rating</option>
              <option value="3.5">3.5+</option>
              <option value="4.0">4.0+</option>
              <option value="4.5">4.5+</option>
              <option value="5.0">5.0</option>
            </FilterSelect>
          </FilterGroup>

          {tab !== "ai" && (
            <FilterGroup>
              <FilterLabel>
                Max price ({tab === "call" ? "₹/min Call" : "₹/min Chat"})
              </FilterLabel>
              <FilterSelect
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              >
                <option value="">No limit</option>
                <option value="30">Up to ₹30</option>
                <option value="40">Up to ₹40</option>
                <option value="60">Up to ₹60</option>
                <option value="100">Up to ₹100</option>
              </FilterSelect>
            </FilterGroup>
          )}

          <ResetFilterBtn onClick={resetFilters}>
            Reset Filters
          </ResetFilterBtn>
        </FilterWrap>

        {/* CONTENT */}
        <ExpertsWrap>
          {tab === "ai" ? (
            <AIComingSoon>
              <AIIcon>🤖</AIIcon>
              <AITitle>AI Experts Coming Soon</AITitle>
              <AIDesc>
                Our AI experts are currently under development.
              </AIDesc>
              <AIHint>🚀 Our team is actively working on this</AIHint>
            </AIComingSoon>
          ) : expertsLoading ? (
            <LoaderRow>Loading experts…</LoaderRow>
          ) : filteredList.length === 0 ? (
            <EmptyState>
              No experts found for current filters.
            </EmptyState>
          ) : (
            <Grid>
              {filteredList.slice(0, 20).map((exp) => (
                <ExpertCard
                  key={`${exp.expert_id || exp.id}`}
                  mode={tab}
                  // base data from /expert-profile/list
                  data={{
                    // detail page ke liye id: expert_id
                    id: exp.expert_id || exp.id,
                    profileId: exp.id,
                    name: exp.name || exp.expert_name || "Expert",
                    profile_photo: exp.profile_photo || null,
                    position: exp.position || "Expert",
                    speciality: getSubcategoryName(exp.subcategory_id),
                    location: exp.location || "India",
                    // default until API se card ke andar override
                    callPrice: 0,
                    chatPrice: 0,
                    avgRating: 0,
                    totalReviews: 0,
                    followersCount: 0,
                    languages: [], // abhi API nahi, so empty
                  }}
                  maxPrice={maxPrice}
                />
              ))}
            </Grid>
          )}
        </ExpertsWrap>
      </Layout>
    </PageWrap>
  );
}
