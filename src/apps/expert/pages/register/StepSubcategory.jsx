import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useExpert } from "../../../../shared/context/ExpertContext";
import { getSubCategoriesApi, saveSubCategoryApi } from "../../../../shared/api/expertapi/category.api";
import useApi from "../../../../shared/hooks/useApi";
import { toastify } from "../../../../shared/utils/lazyNotifications";

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
  ActionsRow,
  PrimaryButton,
  SecondaryButton,
  SubcategorySearch,
  SelectionStats,
  SelectedCount,
  SubcategoryEmptyState,
  SelectionPreviewBox,
} from "../../styles/SubcategorySelect.style";

const toNumber = (value) => {
  const next = Number(value);
  return Number.isFinite(next) && next > 0 ? next : null;
};

export default function StepSubcategory() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const isEditMode = useMemo(() => {
    return new URLSearchParams(search).get("mode") === "edit";
  }, [search]);
  const { expertData, updateExpertData, refreshExpertData } = useExpert();

  const [groups, setGroups] = useState([]);
  const [selectedByCategory, setSelectedByCategory] = useState({});
  const [primary, setPrimary] = useState({
    category_id: expertData.primaryCategoryId || expertData.categoryId || null,
    subcategory_id: expertData.primarySubCategoryId || expertData.subCategoryIds?.[0] || null,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const { request: getSubCategories, loading, error } = useApi(getSubCategoriesApi);
  const { request: saveSubCategory, loading: saving } = useApi(saveSubCategoryApi);

  const selectedCategoryIdsStr = useMemo(() => {
    const ids = expertData.categoryIds?.length
      ? expertData.categoryIds
      : (expertData.categoryId ? [expertData.categoryId] : []);
    return ids.map(toNumber).filter(Boolean).join(",");
  }, [expertData.categoryId, expertData.categoryIds]);

  const selectedCategoryIds = useMemo(() => {
    return selectedCategoryIdsStr.split(",").map(Number).filter(Boolean);
  }, [selectedCategoryIdsStr]);

  useEffect(() => {
    if (!selectedCategoryIds.length) {
      navigate("/expert/register/category");
      return;
    }

    const initial = {};
    (expertData.categorySelections || []).forEach((item) => {
      const categoryId = toNumber(item.category_id);
      if (categoryId && selectedCategoryIds.includes(categoryId)) {
        initial[categoryId] = (item.subcategory_ids || []).map(toNumber).filter(Boolean);
      }
    });

    if (!Object.keys(initial).length && expertData.categoryId && expertData.subCategoryIds?.length) {
      initial[Number(expertData.categoryId)] = expertData.subCategoryIds.map(toNumber).filter(Boolean);
    }
    setSelectedByCategory(initial);
  }, [expertData.categoryId, expertData.categorySelections, expertData.subCategoryIds, navigate, selectedCategoryIdsStr]);

  useEffect(() => {
    if (!selectedCategoryIds.length) return;

    const loadGroups = async () => {
      try {
        const loaded = await Promise.all(
          selectedCategoryIds.map(async (categoryId) => {
            const res = await getSubCategories(categoryId);
            const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
            const categoryName = list[0]?.category_name || list[0]?.categoryName || `Category ${categoryId}`;
            return {
              category_id: categoryId,
              category_name: categoryName,
              subcategories: list,
            };
          })
        );
        setGroups(loaded);
      } catch (err) {
        console.error("SubCategory API failed", err);
        setGroups([]);
      }
    };

    loadGroups();
  }, [getSubCategories, selectedCategoryIdsStr]);

  const visibleGroups = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return groups;
    return groups
      .map((group) => ({
        ...group,
        subcategories: group.subcategories.filter((sub) =>
          String(sub.name || "").toLowerCase().includes(query)
        ),
      }))
      .filter((group) => group.subcategories.length);
  }, [groups, searchQuery]);

  const selectedCount = useMemo(
    () => Object.values(selectedByCategory).reduce((sum, ids) => sum + ids.length, 0),
    [selectedByCategory]
  );

  const payloadCategories = useMemo(
    () => Object.entries(selectedByCategory)
      .map(([categoryId, ids]) => ({
        category_id: Number(categoryId),
        subcategory_ids: [...new Set((ids || []).map(toNumber).filter(Boolean))],
      }))
      .filter((item) => selectedCategoryIds.includes(item.category_id) && item.subcategory_ids.length),
    [selectedByCategory, selectedCategoryIds]
  );

  const handleToggle = useCallback((categoryId, subcategory) => {
    const subcategoryId = Number(subcategory.id);
    setSelectedByCategory((prev) => {
      const current = prev[categoryId] || [];
      const next = current.includes(subcategoryId)
        ? current.filter((id) => id !== subcategoryId)
        : [...current, subcategoryId];
      return { ...prev, [categoryId]: next };
    });

    setPrimary((prev) => {
      if (prev.category_id && prev.subcategory_id && !(prev.category_id === categoryId && prev.subcategory_id === subcategoryId)) {
        return prev;
      }
      return { category_id: categoryId, subcategory_id: subcategoryId };
    });
  }, []);

  const handleNext = async () => {
    if (!payloadCategories.length) return;

    const firstCategory = payloadCategories[0];
    const primaryCategoryId = primary.category_id || firstCategory.category_id;
    const primarySubcategoryId = primary.subcategory_id || firstCategory.subcategory_ids[0];
    const primaryIsSelected = payloadCategories.some(
      (item) => item.category_id === primaryCategoryId && item.subcategory_ids.includes(primarySubcategoryId)
    );
    const finalPrimary = primaryIsSelected
      ? { category_id: primaryCategoryId, subcategory_id: primarySubcategoryId }
      : { category_id: firstCategory.category_id, subcategory_id: firstCategory.subcategory_ids[0] };

    try {
      await saveSubCategory({
        categories: payloadCategories,
        primary_category_id: finalPrimary.category_id,
        primary_subcategory_id: finalPrimary.subcategory_id,
      });
      updateExpertData({
        categorySelections: payloadCategories,
        categoryId: finalPrimary.category_id,
        primaryCategoryId: finalPrimary.category_id,
        primarySubCategoryId: finalPrimary.subcategory_id,
        subCategoryIds: payloadCategories.flatMap((item) => item.subcategory_ids),
      });
      
      // Refresh the context with updated profile expertise details
      await refreshExpertData();

      if (isEditMode) {
        toastify("success", "Expertise areas updated successfully!");
        navigate("/expert/profile");
      } else {
        navigate("/expert/register/profile");
      }
    } catch (err) {
      console.error("Save subcategory failed", err);
    }
  };

  const totalOptions = visibleGroups.reduce((sum, group) => sum + group.subcategories.length, 0);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <RegisterLayout
      title="Select your specializations"
      subtitle="Choose one or more subcategories under each selected category."
      step={3}
      hasNavbar={true}
    >
      <CategorySplitWrapper>
        <CategoryLeftScroll>
          <SelectionStats style={{ marginBottom: 16 }}>
            <div>
              <SelectedCount>{selectedCount}</SelectedCount>
              <span>Selected</span>
            </div>
            <div>
              <span>{totalOptions}</span>
              <span>Options Found</span>
            </div>
          </SelectionStats>

          <SubcategorySearch>
            <input
              placeholder="Search specializations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SubcategorySearch>

          <AnimatePresence>
            {visibleGroups.length === 0 ? (
              <SubcategoryEmptyState>
                <div>
                  <h3>No specialization found</h3>
                  <p>Try searching something else</p>
                </div>
              </SubcategoryEmptyState>
            ) : (
              visibleGroups.map((group) => (
                <div key={group.category_id} style={{ marginBottom: 24 }}>
                  <h3 style={{ margin: "0 0 12px", color: "#0f172a", fontSize: 18 }}>{group.category_name}</h3>
                  <CardGrid>
                    {group.subcategories.map((sub, index) => {
                      const active = (selectedByCategory[group.category_id] || []).includes(Number(sub.id));
                      const isPrimary = primary.category_id === group.category_id && primary.subcategory_id === Number(sub.id);
                      return (
                        <motion.div
                          key={`${group.category_id}-${sub.id}`}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.3, delay: index * 0.02 }}
                        >
                          <SelectCard type="button" active={active} onClick={() => handleToggle(group.category_id, sub)}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div
                                style={{
                                  width: 44,
                                  height: 44,
                                  borderRadius: "50%",
                                  background: active ? "linear-gradient(135deg, #10b981, #34d399)" : "rgba(16,185,129,0.12)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                  color: active ? "#fff" : "#10b981",
                                  fontWeight: 700,
                                }}
                              >
                                {active ? "Yes" : "+"}
                              </div>
                              <div style={{ textAlign: "left", flex: 1 }}>
                                <CardTitle>{sub.name}</CardTitle>
                                <CardMeta>{isPrimary ? "Primary expertise" : active ? "Selected" : "Tap to select"}</CardMeta>
                              </div>
                              {active && (
                                <input
                                  type="radio"
                                  checked={isPrimary}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    setPrimary({ category_id: group.category_id, subcategory_id: Number(sub.id) });
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  title="Set primary expertise"
                                />
                              )}
                            </div>
                          </SelectCard>
                        </motion.div>
                      );
                    })}
                  </CardGrid>
                </div>
              ))
            )}
          </AnimatePresence>
        </CategoryLeftScroll>

        <CategoryRightFixed>
          <SelectionPreviewBox>
            <h3>Selected Specializations</h3>
            {payloadCategories.length ? (
              <div style={{ width: "100%", display: "grid", gap: 10 }}>
                {payloadCategories.map((item) => {
                  const group = groups.find((g) => g.category_id === item.category_id);
                  return (
                    <div key={item.category_id} style={{ textAlign: "left" }}>
                      <strong style={{ color: "#0f172a", fontSize: 14 }}>{group?.category_name || `Category ${item.category_id}`}</strong>
                      <p style={{ margin: "4px 0 0", color: "#475569", fontSize: 13 }}>
                        {item.subcategory_ids
                          .map((id) => group?.subcategories.find((sub) => Number(sub.id) === id)?.name)
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>Select at least one specialization.</p>
            )}
          </SelectionPreviewBox>

          <ActionsRow style={{ flexDirection: "column", gap: 12, marginTop: 0 }}>
            <PrimaryButton disabled={!payloadCategories.length || saving} onClick={handleNext} style={{ width: "100%", justifyContent: "center" }}>
              {saving ? "Saving..." : payloadCategories.length ? "Continue to Profile" : "Choose a specialization"}
            </PrimaryButton>
            <SecondaryButton 
              onClick={() => navigate(isEditMode ? "/expert/register/category?mode=edit" : "/expert/register/category")} 
              style={{ width: "100%", justifyContent: "center" }}
            >
              Back to Category
            </SecondaryButton>
          </ActionsRow>
        </CategoryRightFixed>
      </CategorySplitWrapper>
    </RegisterLayout>
  );
}
