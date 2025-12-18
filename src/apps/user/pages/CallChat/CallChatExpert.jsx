// src/apps/user/pages/UserExpertsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllExperts } from "../../../../shared/services/expertService";

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

/* ------------------ CONSTANTS ------------------ */

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

/* ------------------ COMPONENT ------------------ */

export default function UserExpertsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const modeFromUrl = searchParams.get("mode"); // call | chat

  const [tab, setTab] = useState("call");
  const [loading, setLoading] = useState(true);
  const [experts, setExperts] = useState([]);

  // Filters
  const [profession, setProfession] = useState("all");
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [minRating, setMinRating] = useState("0");
  const [maxPrice, setMaxPrice] = useState("");

  /* ------------------ URL → TAB SYNC ------------------ */

  useEffect(() => {
    if (modeFromUrl === "call" || modeFromUrl === "chat") {
      setTab(modeFromUrl);
    }
  }, [modeFromUrl]);

  /* ------------------ DATA LOAD ------------------ */

  useEffect(() => {
    let mounted = true;

    const loadExperts = async () => {
      try {
        setLoading(true);
        const data = await getAllExperts();
        if (mounted) setExperts(data || []);
      } catch (err) {
        console.error("Failed to load experts", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadExperts();
    return () => (mounted = false);
  }, []);

  /* ------------------ HELPERS ------------------ */

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

  /* ------------------ FILTER LOGIC ------------------ */

  const filteredList = useMemo(() => {
    if (tab === "ai") return [];

    let list = [...experts];

    // Call / Chat availability
    if (tab === "call") list = list.filter((e) => e.callPrice);
    if (tab === "chat") list = list.filter((e) => e.chatPrice);

    // Profession
    if (profession !== "all") {
      list = list.filter((e) => e.professionId === profession);
    }

    // Language
    if (selectedLanguages.length > 0) {
      list = list.filter((e) =>
        (e.languages || []).some((l) =>
          selectedLanguages.includes(l)
        )
      );
    }

    // Rating
    const ratingMin = parseFloat(minRating || "0");
    if (ratingMin > 0) {
      list = list.filter(
        (e) => parseFloat(e.rating || 0) >= ratingMin
      );
    }

    // Price
    if (maxPrice) {
      const mp = parseInt(maxPrice, 10);
      if (tab === "call") list = list.filter((e) => e.callPrice <= mp);
      if (tab === "chat") list = list.filter((e) => e.chatPrice <= mp);
    }

    return list;
  }, [tab, experts, profession, selectedLanguages, minRating, maxPrice]);

  /* ------------------ UI ------------------ */

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
          ) : loading ? (
            <LoaderRow>Loading experts…</LoaderRow>
          ) : filteredList.length === 0 ? (
            <EmptyState>
              No experts found for current filters.
            </EmptyState>
          ) : (
            <Grid>
              {filteredList.slice(0, 20).map((exp) => (
                <ExpertCard key={exp.id} data={exp} mode={tab} />
              ))}
            </Grid>
          )}
        </ExpertsWrap>
      </Layout>
    </PageWrap>
  );
}
