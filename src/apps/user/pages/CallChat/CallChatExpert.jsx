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
import { filterExpertsApi } from "../../../../shared/api/expertapi/filter.api";

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

  // base profiles from ExpertContext (/expert-profile/list)
  const { experts, expertsLoading } = useExpert();
  const { subCategories } = useCategory();

  const [profession, setProfession] = useState("all");
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [minRating, setMinRating] = useState("0");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortPrice, setSortPrice] = useState(""); // optional asc/desc

  // filtered experts from backend for rating/price
  const [serverExperts, setServerExperts] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);

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
    setSortPrice("");
    setServerExperts([]); // reset to base experts
  };

  // helper: subcategory name from id
  const getSubcategoryName = (subId) => {
    const sc = subCategories.find((s) => Number(s.id) === Number(subId));
    return sc ? sc.name : "";
  };

  // BACKEND FILTER CALL (price + rating + mode)
  useEffect(() => {
    // AI tab par koi expert nahi
    if (tab === "ai") return;

    const hasPrice = maxPrice && Number(maxPrice) > 0;
    const hasRating = minRating && Number(minRating) > 0;

    // agar price/rating dono empty hain -> backend filter API call mat karo
    if (!hasPrice && !hasRating && !sortPrice) {
      setServerExperts([]);
      return;
    }

    const params = {};

    if (hasPrice) {
      // API expects price in number, call/chat dono ke liye same endpoint
      params.price = Number(maxPrice);
      if (tab === "call" || tab === "chat") {
        params.mode = tab; // /experts/filter?price=200&mode=call
      }
    }

    if (hasRating) {
      params.rating = Number(minRating);
    }

    if (sortPrice) {
      params.sort_price = sortPrice; // "asc" | "desc"
    }

    let cancelled = false;

    const runFilter = async () => {
      try {
        setFilterLoading(true);
        const res = await filterExpertsApi(params);
        const list = res?.data?.data || [];
        if (!cancelled) {
          setServerExperts(list);
        }
      } catch (err) {
        console.error("Filter experts failed", err);
        if (!cancelled) setServerExperts([]);
      } finally {
        if (!cancelled) setFilterLoading(false);
      }
    };

    runFilter();

    return () => {
      cancelled = true;
    };
  }, [tab, maxPrice, minRating, sortPrice]);

  // FINAL LIST (profession + language filter front-end, price/rating from backend)
  const filteredList = useMemo(() => {
    if (tab === "ai") return [];

    // base list: agar serverExperts non-empty hai to woh, otherwise context experts
    const baseList =
      serverExperts && serverExperts.length > 0 ? serverExperts : experts;

    let list = [...baseList];

    // Profession (simple contains check on position)
    if (profession !== "all") {
      const key = profession.toLowerCase();
      list = list.filter((e) =>
        (e.position || "").toLowerCase().includes(
          key === "doctors" ? "doctor" : key.slice(0, 3)
        )
      );
    }

    // Language: abhi API nahi, to skip; future me data.languages array aayega
    if (selectedLanguages.length > 0) {
      list = list.filter(() => true);
    }

    return list;
  }, [tab, experts, serverExperts, profession, selectedLanguages]);

  const overallLoading = expertsLoading || filterLoading;

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
            <>
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

              <FilterGroup>
                <FilterLabel>Sort by Price</FilterLabel>
                <FilterSelect
                  value={sortPrice}
                  onChange={(e) => setSortPrice(e.target.value)}
                >
                  <option value="">Default</option>
                  <option value="asc">Low to High</option>
                  <option value="desc">High to Low</option>
                </FilterSelect>
              </FilterGroup>
            </>
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
          ) : overallLoading ? (
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
                  data={{
                    id: exp.expert_id || exp.id,
                    profileId: exp.id,
                    name: exp.name || exp.expert_name || "Expert",
                    profile_photo: exp.profile_photo || null,
                    position: exp.position || "Expert",
                    speciality: getSubcategoryName(exp.subcategory_id),
                    location: exp.location || "India",
                    callPrice: 0,
                    chatPrice: 0,
                    avgRating: 0,
                    totalReviews: 0,
                    followersCount: 0,
                    languages: [],
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
