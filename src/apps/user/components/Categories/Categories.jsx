// src/components/Categories/Categories.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Wrap,
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

import { useCategory } from "../../../../shared/context/CategoryContext";
import { getExpertsBySubCategoryApi } from "../../../../shared/api/expertapi/auth.api";

const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=12";

const Categories = () => {
  const navigate = useNavigate();

  const {
    categories,
    subCategories,
    loadSubCategories,
    loading: categoryLoading,
  } = useCategory();

  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [experts, setExperts] = useState([]);
  const [expertsLoading, setExpertsLoading] = useState(false);

  /* ================= DEFAULT CATEGORY ================= */
  useEffect(() => {
    if (categories.length && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  /* ================= LOAD SUBCATEGORIES ================= */
  useEffect(() => {
    if (!activeCategory) return;
    setActiveSubCategory(null);
    setExperts([]);
    loadSubCategories(activeCategory);
  }, [activeCategory, loadSubCategories]);

  /* ================= LOAD EXPERTS ================= */
  const loadExperts = async (subCategoryId) => {
    if (!subCategoryId) return;

    try {
      setExpertsLoading(true);
      const res = await getExpertsBySubCategoryApi(subCategoryId);
      setExperts(res?.data?.data || []);
    } catch (err) {
      console.error("Experts load failed", err);
      setExperts([]);
    } finally {
      setExpertsLoading(false);
    }
  };

  /* ================= SUBCATEGORY CLICK ================= */
  const handleSubCategoryChange = (id) => {
    if (id === activeSubCategory) return;
    setActiveSubCategory(id);
    setExperts([]);
    loadExperts(id);
  };

  const loading = categoryLoading || expertsLoading;

  return (
    <Wrap>
      {/* CATEGORY TABS */}
      <TabsRow>
        {categories.map((cat) => (
          <TabButton
            key={cat.id}
            $active={cat.id === activeCategory}
            onClick={() => {
              if (cat.id !== activeCategory) {
                setActiveCategory(cat.id);
              }
            }}
          >
            {cat.name}
          </TabButton>
        ))}
      </TabsRow>

      {/* SUBCATEGORY FILTERS */}
      <FiltersRow>
        {subCategories.map((sc) => (
          <FilterChip
            key={sc.id}
            $active={sc.id === activeSubCategory}
            onClick={() => handleSubCategoryChange(sc.id)}
          >
            {sc.name}
          </FilterChip>
        ))}
      </FiltersRow>

      {/* EXPERT LIST */}
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
          {experts.map((exp) => (
            <ExpertCard
              key={exp.expert_id}
              onClick={() =>
                navigate(`/user/experts/${exp.expert_id}`)
              }
            >
              <Avatar
                src={exp.profile_photo || DEFAULT_AVATAR}
                alt={exp.name}
              />
              <ExpertName>{exp.name}</ExpertName>
              <ExpertProfession>{exp.category_name}</ExpertProfession>
              <ExpertSpeciality>{exp.main_expertise}</ExpertSpeciality>
              <ExpertTag>Online • Verified</ExpertTag>
            </ExpertCard>
          ))}
        </ExpertsStrip>
      )}
    </Wrap>
  );
};

export default Categories;
