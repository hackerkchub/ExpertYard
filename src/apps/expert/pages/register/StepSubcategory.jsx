// src/apps/expert/pages/register/StepSubcategory.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useExpert } from "../../../../shared/context/ExpertContext";
import { getSubCategoriesApi, saveSubCategoryApi } from "../../../../shared/api/expertapi/category.api";
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
  ActionsRow,
  PrimaryButton,
  SecondaryButton,
  SubcategorySearch,
  SelectionStats,
  SelectedCount,
  SubcategoryEmptyState,
  SelectionPreviewBox
} from "../../styles/SubcategorySelect.style";

export default function StepSubcategory() {
  const navigate = useNavigate();
  const { expertData, updateExpertData } = useExpert();

  const [subCategories, setSubCategories] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

  const { request: getSubCategories, loading, error } = useApi(getSubCategoriesApi);
  const { request: saveSubCategory, loading: saving } = useApi(saveSubCategoryApi);

  // 🔐 Route Guard & Data Fetch (INFINITY LOOP FIX)
  useEffect(() => {
    if (!expertData.categoryId) {
      navigate("/expert/register/category");
      return;
    }

    const loadSubCategories = async () => {
      try {
        const res = await getSubCategories(expertData.categoryId);
        const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        setSubCategories(list);
        setFilteredSubCategories(list);
      } catch (err) {
        console.error("SubCategory API failed", err);
        setSubCategories([]);
        setFilteredSubCategories([]);
      }
    };

    loadSubCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expertData.categoryId]); // 👈 सिर्फ़ CategoryId बदलने पर ही API कॉल होगी!

  // 🔹 Filter subcategories
  useEffect(() => {
    if (!searchQuery) {
      setFilteredSubCategories(subCategories);
    } else {
      const filtered = subCategories.filter(sub =>
        sub.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSubCategories(filtered);
    }
  }, [searchQuery, subCategories]);

  const handleSelect = useCallback((id, name) => {
    setSelectedIds([id]);
    updateExpertData({
      subCategoryIds: [id],
      primarySubCategory: name
    });
  }, [updateExpertData]);

  const handleNext = async () => {
    if (selectedIds.length === 0) return;

    try {
      await saveSubCategory({ subcategory_id: selectedIds[0] });
      updateExpertData({ subCategoryIds: selectedIds });
      navigate("/expert/register/profile");
    } catch (err) {
      console.error("Save subcategory failed", err);
    }
  };

  useEffect(() => {
    if (expertData.subCategoryIds?.length) {
      setSelectedIds(expertData.subCategoryIds);
    }
  }, [expertData.subCategoryIds]);

  const selectedSubCategories = useMemo(() => 
    subCategories.filter(sub => selectedIds.includes(sub.id)),
    [subCategories, selectedIds]
  );

  const canNext = selectedIds.length > 0;
  const totalSubCategories = filteredSubCategories.length;

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <RegisterLayout
      title="Select your specialization"
      subtitle="Choose your primary specialization within your expertise area."
      step={3}
      hasNavbar={true}
    >
      <CategorySplitWrapper>
        
        <CategoryLeftScroll>
          <SelectionStats style={{ marginBottom: 16 }}>
            <div>
              <SelectedCount>{selectedIds.length}</SelectedCount>
              <span>Selected</span>
            </div>
            <div>
              <span>{totalSubCategories}</span>
              <span>Options Found</span>
            </div>
          </SelectionStats>

          <SubcategorySearch>
            <input
              placeholder={`Search in ${totalSubCategories} options...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SubcategorySearch>

          <AnimatePresence>
            <CardGrid>
              {filteredSubCategories.length === 0 ? (
                <SubcategoryEmptyState style={{ gridColumn: "1 / -1" }}>
                  <div>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                    <h3>No specialization found</h3>
                    <p>Try searching something else</p>
                  </div>
                </SubcategoryEmptyState>
              ) : (
                filteredSubCategories.map((sub, index) => (
                  <motion.div
                    key={sub.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                  >
                    <SelectCard
                      type="button"
                      active={selectedIds.includes(sub.id)}
                      onClick={() => handleSelect(sub.id, sub.name)}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            background: selectedIds.includes(sub.id)
                              ? "linear-gradient(135deg, #10b981, #34d399)"
                              : "rgba(16,185,129,0.12)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0
                          }}
                        >
                          <span style={{ 
                            color: selectedIds.includes(sub.id) ? "#fff" : "#10b981",
                            fontSize: 18,
                            fontWeight: "bold"
                          }}>
                            {selectedIds.includes(sub.id) ? "✓" : "★"}
                          </span>
                        </div>

                        <div style={{ textAlign: "left" }}>
                          <CardTitle>{sub.name}</CardTitle>
                          <CardMeta>Click to select</CardMeta>
                        </div>
                      </div>
                    </SelectCard>
                  </motion.div>
                ))
              )}
            </CardGrid>
          </AnimatePresence>
        </CategoryLeftScroll>

        <CategoryRightFixed>
          <SelectionPreviewBox>
            <h3>Specialty Selected</h3>
            
            <AnimatePresence mode="wait">
              {selectedSubCategories.length > 0 ? (
                <motion.div
                  key={selectedSubCategories[0].id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  style={{ textAlign: "center", width: "100%" }}
                >
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: "50%",
                      background: "linear-gradient(135deg, #10b981, #34d399)",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <span style={{ color: "#fff", fontSize: 24 }}>✓</span>
                    </div>
                  </div>
                  <h4 style={{ margin: "0 0 4px 0", color: "#0f172a" }}>
                    {selectedSubCategories[0].name}
                  </h4>
                </motion.div>
              ) : (
                <div style={{ textAlign: "center", color: "#64748b" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
                  <p style={{ margin: 0, fontSize: 14 }}>Please select options from the left.</p>
                </div>
              )}
            </AnimatePresence>
          </SelectionPreviewBox>

          <ActionsRow style={{ flexDirection: "column", gap: 12, marginTop: 0 }}>
            <PrimaryButton
              disabled={!canNext || saving}
              onClick={handleNext}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {saving ? "Saving..." : canNext ? `Continue to Profile →` : "Choose a specialty"}
            </PrimaryButton>

           
          </ActionsRow>
        </CategoryRightFixed>

      </CategorySplitWrapper>
    </RegisterLayout>
  );
}