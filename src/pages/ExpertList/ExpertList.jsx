import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";

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
  SuggestedCaption,
  SuggestedStrip,
  SuggestedCard,
  SuggestedName,
  SuggestedMeta
} from "./ExpertList.styles";

/* -----------------------------------------
   GET QUERY STRING
----------------------------------------- */
const useQuery = () => {
  const { search } = useLocation();
  return new URLSearchParams(search);
};

/* -----------------------------------------
   MAIN EXPERT DATA
----------------------------------------- */
const EXPERTS = [
  {
    id: 1,
    professionId: "engineers",
    specialityId: "frontend",
    name: "Riya Desai",
    role: "Senior Frontend Engineer • React",
    experienceYears: 6,
    rating: 4.9,
    pricePerMin: 35,
    reviews: 120,
    online: true,
    img: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg"
  },
  {
    id: 2,
    professionId: "engineers",
    specialityId: "frontend",
    name: "Kabir Khanna",
    role: "UI Engineer • Animations",
    experienceYears: 7,
    rating: 4.8,
    pricePerMin: 40,
    reviews: 98,
    online: false,
    img: "https://images.pexels.com/photos/3760852/pexels-photo-3760852.jpeg"
  },
  {
    id: 3,
    professionId: "engineers",
    specialityId: "frontend",
    name: "Neha Sharma",
    role: "Frontend • Performance & Web Vitals",
    experienceYears: 5,
    rating: 4.7,
    pricePerMin: 30,
    reviews: 89,
    online: true,
    img: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg"
  },
  {
    id: 4,
    professionId: "engineers",
    specialityId: "frontend",
    name: "Arjun Mehta",
    role: "Frontend Architect • Design Systems",
    experienceYears: 8,
    rating: 4.9,
    pricePerMin: 45,
    reviews: 150,
    online: true,
    img: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
  }
];

/* -----------------------------------------
   SUGGESTED EXPERTS (Enhanced Dummy Data)
----------------------------------------- */
const SUGGESTED = [
  {
    id: 101,
    name: "Siddharth Jain",
    role: "Backend Engineer • Node",
    rating: 4.8,
    online: true,
    pricePerMin: 32,
    experienceYears: 6,
    specialityId: "backend",
    img: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg"
  },
  {
    id: 102,
    name: "Anjali Bansal",
    role: "Full-Stack Developer • MERN",
    rating: 4.9,
    online: true,
    pricePerMin: 38,
    experienceYears: 7,
    specialityId: "fullstack",
    img: "https://images.pexels.com/photos/4937227/pexels-photo-4937227.jpeg"
  },
  {
    id: 103,
    name: "Priya Nair",
    role: "Data Engineer • ML Pipelines",
    rating: 4.7,
    online: false,
    pricePerMin: 42,
    experienceYears: 5,
    specialityId: "data",
    img: "https://images.pexels.com/photos/7643745/pexels-photo-7643745.jpeg"
  },
  {
    id: 104,
    name: "Vikram Patil",
    role: "DevOps • Cloud, CI/CD",
    rating: 4.6,
    online: true,
    pricePerMin: 34,
    experienceYears: 4,
    specialityId: "devops",
    img: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg"
  }
];

/* -----------------------------------------
   COMPONENT
----------------------------------------- */
const ExpertListPage = () => {
  const query = useQuery();

  const initialSpeciality = query.get("speciality") || "frontend";

  const [speciality] = useState(initialSpeciality);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("rating-high");

  /* -----------------------------------------
     FILTER + SORT LOGIC
  ----------------------------------------- */
  const filteredExperts = useMemo(() => {
    let list = EXPERTS.filter((e) => e.specialityId === speciality);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.role.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "rating-high":
        return [...list].sort((a, b) => b.rating - a.rating);

      case "rating-low":
        return [...list].sort((a, b) => a.rating - b.rating);

      case "experience-high":
        return [...list].sort((a, b) => b.experienceYears - a.experienceYears);

      case "budget-low":
        return [...list].sort((a, b) => a.pricePerMin - b.pricePerMin);

      case "budget-high":
        return [...list].sort((a, b) => b.pricePerMin - a.pricePerMin);

      default:
        return list;
    }
  }, [speciality, search, sortBy]);

  const suggestedExperts = SUGGESTED.filter(
    (e) => e.specialityId !== speciality
  );

  return (
    <PageWrap>
      <HeaderWrap>
        <PageTitle>Top {speciality} Experts</PageTitle>
        <PageSubtitle>
          Find trusted specialists. Real-time availability. Professional insights.
        </PageSubtitle>
      </HeaderWrap>

      <Layout>
        {/* ---------------- LEFT FILTER BAR ---------------- */}
        <LeftSidebar>
          <FilterTitle>Filter & Sort</FilterTitle>

          <FiltersForm>
            {/* Search */}
            <Field>
              <FieldLabel>Search</FieldLabel>
              <SearchInput
                placeholder="Search by name or skills…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Field>

            {/* Sort Pills */}
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
              <ExpertCard key={exp.id}>
                <AvatarImg src={exp.img} />

                <ExpertBody>
                  <ExpertName>{exp.name}</ExpertName>

                  <StatusPill $online={exp.online}>
                    {exp.online ? "Online" : "Offline"}
                  </StatusPill>

                  <MetaRow>
                    <Rating>★ {exp.rating}</Rating>
                    <span>{exp.experienceYears}+ yrs exp.</span>
                    <span>{exp.reviews} reviews</span>
                  </MetaRow>

                  <MetaRow>{exp.role}</MetaRow>

                  <PriceRow>
                    <Price>₹{exp.pricePerMin}</Price>
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
          <SuggestedTitle>Suggested Experts</SuggestedTitle>
          {/* <SuggestedCaption>
            Backend, Data, DevOps & Full-Stack specialists you may also like
          </SuggestedCaption> */}
        </SuggestedHeader>

        <SuggestedStrip>
          {suggestedExperts.map((exp) => (
            <SuggestedCard key={exp.id}>
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

              <SuggestedMeta>
                ★ {exp.rating} • {exp.experienceYears} yrs
              </SuggestedMeta>

              <SuggestedMeta>
                {exp.online ? "🟢 Online" : "⚪ Offline"}
              </SuggestedMeta>

              <SuggestedMeta>₹{exp.pricePerMin}/min</SuggestedMeta>
            </SuggestedCard>
          ))}
        </SuggestedStrip>
      </SuggestedSection>
    </PageWrap>
  );
};

export default ExpertListPage;
