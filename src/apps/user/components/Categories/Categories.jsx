// src/components/Categories/Categories.jsx
import React, { useEffect, useState } from "react";
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

import { useCategory } from "../../../../shared/context/CategoryContext";
import { getExpertsBySubCategoryApi } from "../../../../shared/api/expertapi/auth.api";

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

  /* ================= LOAD DEFAULT CATEGORY ================= */
  useEffect(() => {
    if (categories.length && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  /* ================= LOAD SUBCATEGORIES ================= */
useEffect(() => {
  if (!activeCategory) return;

  setActiveSubCategory(null);
  loadSubCategories(activeCategory);
}, [activeCategory, loadSubCategories]);
  /* ================= LOAD EXPERTS BY SUBCATEGORY ================= */
  const loadExperts = async (subCategoryId) => {
    if (!subCategoryId) return;

    try {
      setExpertsLoading(true);
      const res = await getExpertsBySubCategoryApi(subCategoryId);
      setExperts(res?.data?.data || []);
    } catch (err) {
      console.error("Experts load failed", err);
    } finally {
      setExpertsLoading(false);
    }
  };

  /* ================= SUBCATEGORY CLICK ================= */
 const handleSubCategoryChange = (id) => {
  setActiveSubCategory(id);
  setExperts([]);        // clear only when subcategory changes
  loadExperts(id);
};

  const loading = categoryLoading || expertsLoading;

  return (
    <Wrap>
      {/* ================= CATEGORY TABS ================= */}
      <TabsRow>
        {categories.map((cat) => (
          <TabButton
            key={cat.id}
            $active={cat.id === activeCategory}
            onClick={() => setActiveCategory(cat.id)}
          >
            {cat.name}
          </TabButton>
        ))}
      </TabsRow>

      {/* ================= SUBCATEGORY FILTERS ================= */}
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

      {/* ================= EXPERT LIST ================= */}
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
      key={exp.id}
      onClick={() => navigate(`/experts/${exp.id}`)}
      style={{ cursor: "pointer" }}
    >
      <Avatar src={exp.profile_image} alt={exp.name} />
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
