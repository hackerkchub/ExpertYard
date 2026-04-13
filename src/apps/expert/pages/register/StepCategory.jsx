// src/apps/expert/pages/register/StepCategory.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useExpert } from "../../../../shared/context/ExpertContext";
import { getCategoriesApi, saveCategoryApi } from "../../../../shared/api/expertapi/category.api";
import useApi from "../../../../shared/hooks/useApi";

import RegisterLayout from "../../components/RegisterLayout";
import Loader from "../../../../shared/components/Loader/Loader";
import ErrorMessage from "../../../../shared/components/ErrorMessage/ErrorMessage";

// ✅ साफ़ सुथरे इंपोर्ट्स (ताकि कोई Component 'undefined' न आए)
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
  SelectionPreviewBox
} from "../../styles/SubcategorySelect.style";

import { prettyLabel } from "../../constants/categoryIcons";

export default function StepCategory() {
  const navigate = useNavigate();
  const { expertData, updateExpertData } = useExpert();

  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  const { request: getCategories, loading, error } = useApi(getCategoriesApi);
  const { request: saveCategory, loading: saving } = useApi(saveCategoryApi);

  const DEFAULT_CATEGORY_IMAGE = "/default-category.png";

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
  if (!expertData.isSubscribed) {
    navigate("/expert/register/subscription");
  }
}, [expertData.isSubscribed, navigate]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((cat) =>
        prettyLabel(cat.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      const list = Array.isArray(res) ? res : res?.data || [];
      setCategories(list);
      setFilteredCategories(list);
    } catch (err) {
      console.error("Category API failed", err);
      setCategories([]);
      setFilteredCategories([]);
    }
  };

  const handleSelect = useCallback((category) => {
    updateExpertData({
      categoryId: category.id,
      categoryName: prettyLabel(category.name),
      categoryKey: category.key || category.slug
    });
  }, [updateExpertData]);

  const handleNext = async () => {
    try {
      await saveCategory({ category_id: expertData.categoryId });
      navigate("/expert/register/subcategory");
    } catch (err) {
      console.error("Save category failed", err);
    }
  };

  const canNext = !!expertData.categoryId;
  const selectedCategory = categories.find((cat) => cat.id === expertData.categoryId);
  const totalCategories = filteredCategories.length;

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <RegisterLayout
      title="Choose your expertise area"
      subtitle="Select the main category where you can help clients best."
      step={2}
      hasNavbar={true}
    >
      <CategorySplitWrapper>
        
        {/* ⬅️ Left Side: Search + Grid (Scrollable) */}
        <CategoryLeftScroll>
          <CategorySearch>
            <input
              placeholder={`Search ${totalCategories} ${totalCategories === 1 ? "category" : "categories"}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </CategorySearch>

          <AnimatePresence>
            <CardGrid style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))" }}>
              {filteredCategories.length === 0 ? (
                <CategoryEmptyState style={{ gridColumn: "1 / -1" }}>
                  <div>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                    <h3>No categories found</h3>
                    <p>Try a different search term</p>
                  </div>
                </CategoryEmptyState>
              ) : (
                filteredCategories.map((cat, index) => (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                  >
                    <SelectCard
                      type="button"
                      active={expertData.categoryId === cat.id}
                      onClick={() => handleSelect(cat)}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            background: expertData.categoryId === cat.id 
                              ? "linear-gradient(135deg, #0ea5ff, #38bdf8)" 
                              : "rgba(56,189,248,0.12)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                            flexShrink: 0
                          }}
                        >
                          <img
                            src={cat.image_url || DEFAULT_CATEGORY_IMAGE}
                            alt={cat.name}
                            style={{
                              width: "75%",
                              height: "75%",
                              objectFit: "cover",
                              borderRadius: "50%"
                            }}
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.parentElement.innerHTML = cat.name.charAt(0).toUpperCase();
                            }}
                          />
                        </div>

                        <div style={{ textAlign: "left" }}>
                          <CardTitle>{prettyLabel(cat.name)}</CardTitle>
                          <CardMeta>Expertise area</CardMeta>
                        </div>
                      </div>
                    </SelectCard>
                  </motion.div>
                ))
              )}
            </CardGrid>
          </AnimatePresence>
        </CategoryLeftScroll>

        {/* ➡️ Right Side: Sticky/Eyes-Fixed Preview + Action CTA */}
        <CategoryRightFixed>
          <SelectionPreviewBox>
            <h3>Your Selection</h3>
            
            <AnimatePresence mode="wait">
              {selectedCategory ? (
                <motion.div
                  key={selectedCategory.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  style={{ textAlign: "center", width: "100%" }}
                >
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: "50%",
                      background: "linear-gradient(135deg, #0ea5ff, #38bdf8)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 4px 12px rgba(14,165,233,0.3)"
                    }}>
                      <img
                        src={selectedCategory.image_url || DEFAULT_CATEGORY_IMAGE}
                        alt={selectedCategory.name}
                        style={{ width: "70%", height: "70%", borderRadius: "50%", objectFit: "cover" }}
                      />
                    </div>
                  </div>
                  <h4 style={{ margin: "0 0 4px 0", color: "#0f172a" }}>{prettyLabel(selectedCategory.name)}</h4>
                  <span style={{ color: "#10b981", fontSize: 13, fontWeight: 500 }}>✅ Perfect match chosen!</span>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ textAlign: "center", color: "#64748b" }}
                >
                  <div style={{ fontSize: 32, marginBottom: 8 }}>👇</div>
                  <p style={{ margin: 0, fontSize: 14 }}>Click on a category to select.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </SelectionPreviewBox>

          <ActionsRow style={{ flexDirection: "column", gap: 12, marginTop: 0 }}>
            <PrimaryButton
              disabled={!canNext || saving}
              onClick={handleNext}
              style={{ width: "100%", justifyContent: "center" }}
            >
              {saving ? "Saving..." : selectedCategory ? `Continue with ${prettyLabel(selectedCategory.name)} →` : "Choose a category to continue"}
            </PrimaryButton>

            <SecondaryButton
              onClick={() => navigate("/expert/register")}
              style={{ width: "100%", justifyContent: "center" }}
            >
              ← Back to Basic Info
            </SecondaryButton>
          </ActionsRow>
        </CategoryRightFixed>

      </CategorySplitWrapper>
    </RegisterLayout>
  );
}