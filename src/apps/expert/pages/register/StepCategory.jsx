import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useExpert } from "../../../../shared/context/ExpertContext";
import { getCategoriesApi, saveCategoryApi } from "../../../../shared/api/expertapi/category.api";
import useApi from "../../../../shared/hooks/useApi";

import RegisterLayout from "../../components/RegisterLayout";
import Loader from "../../../../shared/components/Loader/Loader";
import ErrorMessage from "../../../../shared/components/ErrorMessage/ErrorMessage";

import {
  CategorySplitWrapper,
  CategoryLeftScroll,
  CategoryRightFixed,
  CardGrid,
  SelectCard,
  CardTitle,
  CardMeta,
  CategoryEmptyState,
  CategorySearch,
  PrimaryButton,
  SecondaryButton,
  ActionsRow,
  SelectionPreviewBox,
} from "../../styles/SubcategorySelect.style";

import { prettyLabel } from "../../constants/categoryIcons";

const DEFAULT_CATEGORY_IMAGE = "/default-category.png";

export default function StepCategory() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const isEditMode = useMemo(() => {
    return new URLSearchParams(search).get("mode") === "edit";
  }, [search]);
  const { expertData, updateExpertData } = useExpert();

  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { request: getCategories, loading, error } = useApi(getCategoriesApi);
  const { request: saveCategory, loading: saving } = useApi(saveCategoryApi);

  const selectedIds = useMemo(() => {
    const ids = expertData.categoryIds?.length
      ? expertData.categoryIds
      : (expertData.categoryId ? [expertData.categoryId] : []);
    return ids.map(Number).filter(Boolean);
  }, [expertData.categoryId, expertData.categoryIds]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategories();
        const list = Array.isArray(res) ? res : res?.data || [];
        setCategories(list);
      } catch (err) {
        console.error("Category API failed", err);
        setCategories([]);
      }
    };

    loadCategories();
  }, [getCategories]);

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter((cat) =>
      prettyLabel(cat.name).toLowerCase().includes(query) ||
      String(cat.name || "").toLowerCase().includes(query)
    );
  }, [categories, searchQuery]);

  const selectedCategories = useMemo(
    () => categories.filter((cat) => selectedIds.includes(Number(cat.id))),
    [categories, selectedIds]
  );

  const handleSelect = useCallback((category) => {
    const categoryId = Number(category.id);
    const nextIds = selectedIds.includes(categoryId)
      ? selectedIds.filter((id) => id !== categoryId)
      : [...selectedIds, categoryId];
    const nextSelections = (expertData.categorySelections || [])
      .filter((item) => nextIds.includes(Number(item.category_id)));

    updateExpertData({
      categoryIds: nextIds,
      categorySelections: nextSelections,
      categoryId: nextIds[0] || null,
      categoryName: nextIds[0]
        ? prettyLabel(categories.find((cat) => Number(cat.id) === nextIds[0])?.name || category.name)
        : "",
      categoryKey: nextIds[0]
        ? categories.find((cat) => Number(cat.id) === nextIds[0])?.key ||
          categories.find((cat) => Number(cat.id) === nextIds[0])?.slug ||
          category.key ||
          category.slug
        : null,
    });
  }, [categories, expertData.categorySelections, selectedIds, updateExpertData]);

  const handleNext = async () => {
    if (!selectedIds.length) return;

    try {
      await saveCategory({
        category_ids: selectedIds,
        category_id: selectedIds[0],
      });
      if (isEditMode) {
        navigate("/expert/register/subcategory?mode=edit");
      } else {
        navigate("/expert/register/subcategory");
      }
    } catch (err) {
      console.error("Save category failed", err);
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <RegisterLayout
      title="Choose your expertise areas"
      subtitle="Select every category where you can help clients."
      step={2}
      hasNavbar={true}
    >
      <CategorySplitWrapper>
        <CategoryLeftScroll>
          <CategorySearch>
            <input
              placeholder={`Search ${filteredCategories.length} categories...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </CategorySearch>

          <AnimatePresence>
            <CardGrid style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
              {filteredCategories.length === 0 ? (
                <CategoryEmptyState style={{ gridColumn: "1 / -1" }}>
                  <div>
                    <h3>No categories found</h3>
                    <p>Try a different search term</p>
                  </div>
                </CategoryEmptyState>
              ) : (
                filteredCategories.map((cat, index) => {
                  const active = selectedIds.includes(Number(cat.id));
                  return (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.3, delay: index * 0.02 }}
                    >
                      <SelectCard type="button" active={active} onClick={() => handleSelect(cat)}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div
                            style={{
                              width: 44,
                              height: 44,
                              borderRadius: "50%",
                              background: active ? "linear-gradient(135deg, #0ea5ff, #38bdf8)" : "rgba(56,189,248,0.12)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                              flexShrink: 0,
                              color: active ? "#fff" : "#0ea5ff",
                              fontWeight: 700,
                            }}
                          >
                            {active ? "OK" : (
                              <img
                                src={cat.image_url || DEFAULT_CATEGORY_IMAGE}
                                alt={cat.name}
                                style={{ width: "75%", height: "75%", objectFit: "cover", borderRadius: "50%" }}
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            )}
                          </div>
                          <div style={{ textAlign: "left" }}>
                            <CardTitle>{prettyLabel(cat.name)}</CardTitle>
                            <CardMeta>{active ? "Selected" : "Tap to select"}</CardMeta>
                          </div>
                        </div>
                      </SelectCard>
                    </motion.div>
                  );
                })
              )}
            </CardGrid>
          </AnimatePresence>
        </CategoryLeftScroll>

        <CategoryRightFixed>
          <SelectionPreviewBox>
            <h3>Your Categories</h3>
            {selectedCategories.length ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {selectedCategories.map((cat) => (
                  <span
                    key={cat.id}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 8,
                      background: "#e0f2fe",
                      color: "#0369a1",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    {prettyLabel(cat.name)}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>Select at least one category.</p>
            )}
          </SelectionPreviewBox>

          <ActionsRow style={{ flexDirection: "column", gap: 12, marginTop: 0 }}>
            <PrimaryButton
              disabled={!selectedIds.length || saving}
              onClick={handleNext}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {saving ? "Saving..." : selectedIds.length ? "Continue to specializations" : "Choose a category to continue"}
            </PrimaryButton>
            <SecondaryButton 
              onClick={() => navigate(isEditMode ? "/expert/profile" : "/expert/register")} 
              style={{ width: "100%", justifyContent: "center" }}
            >
              {isEditMode ? "Cancel & Go to Profile" : "Back to Basic Info"}
            </SecondaryButton>
          </ActionsRow>
        </CategoryRightFixed>
      </CategorySplitWrapper>
    </RegisterLayout>
  );
}
