// src/components/Categories/Categories.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  Wrap,
  SectionHeader,
  Title,
  Subtitle,
  ActionsRow,
  ActionCard,
  ActionIcon,
  ActionTitle,
  TabsRow,
  TabButton,
  FiltersRow,
  FilterChip,
  ExpertsStrip,
  ExpertCard,
  Avatar,
  ExpertName,
  ExpertProfession,
  ExpertSpeciality,
  ExpertTag,
  SkeletonCard,
  SkeletonAvatar,
  SkeletonLine,
} from "./Categories.styles";

import { useExperts } from "../../../../shared/context/ExpertContext";
import { SUBCATEGORIES } from "../../../../shared/services/expertService";
// ICONS
import {
  FiUserCheck,
  FiMessageCircle,
  FiCpu,
  FiHeart,
  FiBriefcase,
  FiTrendingUp,
  FiActivity,
  FiGlobe,
} from "react-icons/fi";
import { FaUserTie } from "react-icons/fa";

const PROFESSION_TABS = [
  { id: "doctors", label: "Doctors", icon: FiHeart },
  { id: "engineers", label: "Engineers", icon: FiCpu },
  { id: "mentors", label: "Career Mentors", icon: FiTrendingUp },
  { id: "lawyers", label: "Lawyers", icon: FaUserTie },
  { id: "therapists", label: "Therapists", icon: FiActivity },
  { id: "fitness", label: "Fitness Coaches", icon: FiActivity },
  { id: "business", label: "Business Advisors", icon: FiBriefcase },
  { id: "global", label: "Global Experts", icon: FiGlobe },
];

const Categories = () => {
  const navigate = useNavigate();
  const { experts, loading: globalLoading } = useExperts();

  const [activeProfession, setActiveProfession] = useState("doctors");
  const [activeSpeciality, setActiveSpeciality] = useState("all");
  const [localLoading, setLocalLoading] = useState(false);

  // LOAD SPECIALITY OPTIONS FOR TABS
  const specialityOptions = useMemo(() => {
    const subs = SUBCATEGORIES[activeProfession] || {};
    return [
      { id: "all", label: "All" },
      ...Object.entries(subs).map(([id, label]) => ({ id, label })),
    ];
  }, [activeProfession]);

  // SMALL LOADER WHEN TABS OR FILTER CHANGE
  useEffect(() => {
    setLocalLoading(true);
    const timeout = setTimeout(() => setLocalLoading(false), 350);
    return () => clearTimeout(timeout);
  }, [activeProfession, activeSpeciality]);

  // FILTER EXPERTS BASED ON STATE (NO REDIRECT)
  const filteredExperts = useMemo(() => {
    let list = experts.filter((e) => e.professionId === activeProfession);
    if (activeSpeciality !== "all") {
      list = list.filter((e) => e.specialityId === activeSpeciality);
    }
    return list.slice(0, 12);
  }, [experts, activeProfession, activeSpeciality]);

  const loading = globalLoading || localLoading;

  return (
    <Wrap>
      <SectionHeader>
        <Title>India&apos;s Best Experts on ExpertYard</Title>
        <Subtitle>
          Choose a profession, filter by speciality and connect instantly.
        </Subtitle>
      </SectionHeader>

      {/* QUICK ACTION */}
      <ActionsRow>
        <ActionCard>
          <ActionIcon><FiUserCheck size={28} /></ActionIcon>
          <ActionTitle>Talk to Experts</ActionTitle>
        </ActionCard>
        <ActionCard>
          <ActionIcon><FiMessageCircle size={28} /></ActionIcon>
          <ActionTitle>Chat with Experts</ActionTitle>
        </ActionCard>
      </ActionsRow>

      {/* PROFESSION TABS */}
      <TabsRow>
        {PROFESSION_TABS.map((tab) => {
          const IconComp = tab.icon;
          return (
            <TabButton
              key={tab.id}
              $active={tab.id === activeProfession}
              onClick={() => {
                setActiveProfession(tab.id);
                setActiveSpeciality("all");
              }}
            >
              <IconComp size={18} />
              {tab.label}
            </TabButton>
          );
        })}
      </TabsRow>

      {/* SPECIALITY FILTERS */}
      <FiltersRow>
        {specialityOptions.map((sp) => (
          <FilterChip
            key={sp.id}
            $active={sp.id === activeSpeciality}
            onClick={() => setActiveSpeciality(sp.id)} // ❌ NO REDIRECT
          >
            {sp.label}
          </FilterChip>
        ))}
      </FiltersRow>

      {/* EXPERT CARDS STRIP */}
      {loading ? (
        <ExpertsStrip>
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i}>
              <SkeletonAvatar />
              <SkeletonLine style={{ width: "70%" }} />
              <SkeletonLine style={{ width: "55%" }} />
            </SkeletonCard>
          ))}
        </ExpertsStrip>
      ) : (
        <ExpertsStrip>
          {filteredExperts.map((exp) => (
            <ExpertCard
              key={exp.id}
              onClick={() =>
                navigate(
                  `/user/experts?profession=${exp.professionId}&speciality=${exp.specialityId}`
                )
              } // ✅ REDIRECT ONLY ON CARD CLICK
              style={{ cursor: "pointer" }}
            >
              <Avatar src={exp.img} />
              <ExpertName>{exp.name}</ExpertName>
              <ExpertProfession>
                {PROFESSION_TABS.find((p) => p.id === exp.professionId)?.label}
              </ExpertProfession>
              <ExpertSpeciality>{exp.mainExpertise}</ExpertSpeciality>
              <ExpertTag>Online • Verified</ExpertTag>
            </ExpertCard>
          ))}
        </ExpertsStrip>
      )}
    </Wrap>
  );
};

export default Categories;
