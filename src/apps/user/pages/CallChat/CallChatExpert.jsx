// src/apps/user/pages/UserExpertsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
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
} from "./CallChatExpert.styles";
import ExpertCard from "../../components/userExperts/ExpertCard";
import { AI_EXPERTS } from "../../components/userExperts/aiExpertsData";

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

const languagesOptions = ["English", "Hindi", "Marathi", "Gujarati", "Tamil", "Kannada"];

export default function UserExpertsPage() {
  const [tab, setTab] = useState("call");
  const [loading, setLoading] = useState(true);
  const [experts, setExperts] = useState([]);

  // filters
  const [profession, setProfession] = useState("all");
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [minRating, setMinRating] = useState("0");
  const [maxPrice, setMaxPrice] = useState(""); // blank = no limit

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getAllExperts();
        if (isMounted) setExperts(data);
      } catch (err) {
        console.error("Error while loading experts", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleLanguage = (lang) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const resetFilters = () => {
    setProfession("all");
    setSelectedLanguages([]);
    setMinRating("0");
    setMaxPrice("");
  };

  const filteredList = useMemo(() => {
    let list = [];

    if (tab === "ai") {
      list = AI_EXPERTS;
    } else {
      list = experts;

      // tab wise filter (call / chat)
      if (tab === "call") {
        list = list.filter((e) => e.callPrice);
      } else if (tab === "chat") {
        list = list.filter((e) => e.chatPrice);
      }
    }

    // profession filter (real experts only, AI में नहीं)
    if (tab !== "ai" && profession !== "all") {
      list = list.filter((e) => e.professionId === profession);
    }

    // language filter
    if (selectedLanguages.length > 0) {
      list = list.filter((e) =>
        (e.languages || []).some((lng) => selectedLanguages.includes(lng))
      );
    }

    // rating filter
    const mr = parseFloat(minRating || "0");
    if (mr > 0) {
      list = list.filter((e) => parseFloat(e.rating || 0) >= mr);
    }

    // price filter — tab के हिसाब से
    if (maxPrice) {
      const mp = parseInt(maxPrice, 10);
      if (tab === "call") list = list.filter((e) => e.callPrice <= mp);
      if (tab === "chat") list = list.filter((e) => e.chatPrice <= mp);
      if (tab === "ai") list = list.filter((e) => e.chatPrice <= mp);
    }

    return list;
  }, [tab, experts, profession, selectedLanguages, minRating, maxPrice]);

  return (
    <PageWrap>
      {/* top header */}
      <HeaderSection>
        <div>
          <Title>Find the right expert – instantly</Title>
          <SubTitle>
            Talk 1:1 with verified professionals & smart AI specialists for
            career, health, finance, legal and more.
          </SubTitle>
        </div>
      </HeaderSection>

      {/* tabs */}
      <TabsRow>
        {TABS.map((t) => (
          <TabButton
            key={t.id}
            $active={tab === t.id}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </TabButton>
        ))}
      </TabsRow>

      {/* page layout */}
      <Layout>
        {/* Filters */}
        <FilterWrap>
          <FilterTitle>Filters</FilterTitle>

          {/* profession (only for human experts) */}
          {tab !== "ai" && (
            <FilterGroup>
              <FilterLabel>Profession</FilterLabel>
              <FilterSelect
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
              >
                {Object.entries(professionsMap).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
          )}

          {/* languages */}
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

          {/* rating */}
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

          {/* price */}
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

          <ResetFilterBtn type="button" onClick={resetFilters}>
            Reset Filters
          </ResetFilterBtn>
        </FilterWrap>

        {/* Experts list */}
        <ExpertsWrap>
          {loading ? (
            <LoaderRow>Loading experts…</LoaderRow>
          ) : filteredList.length === 0 ? (
            <EmptyState>
              No experts found for current filters. Try removing some filters.
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
