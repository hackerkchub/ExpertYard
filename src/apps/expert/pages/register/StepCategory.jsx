// src/apps/expert/pages/register/StepCategory.jsx (Premium Upgraded)
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useExpert } from "../../../../shared/context/ExpertContext";
import { getCategoriesApi } from "../../../../shared/api/expertapi/category.api";
import useApi from "../../../../shared/hooks/useApi";

import RegisterLayout from "../../components/RegisterLayout";
import Loader from "../../../../shared/components/Loader/Loader";
import ErrorMessage from "../../../../shared/components/ErrorMessage/ErrorMessage";

import {
  CardGrid,
  SelectCard,
  CardTitle,
  CardMeta,
  Chip,
  ActionsRow,
  PrimaryButton,
  SecondaryButton,
  CategoryEmptyState,
  CategorySearch,
  SelectedCount,
  CategoryStats
} from "../../styles/Register.styles";

import { CATEGORY_ICON_MAP, prettyLabel } from "../../constants/categoryIcons";

export default function StepCategory() {
  const navigate = useNavigate();
  const { expertData, updateExpertData } = useExpert();

  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  const {
    request: getCategories,
    loading,
    error
  } = useApi(getCategoriesApi);

  const DEFAULT_CATEGORY_IMAGE = "/default-category.png";
  // 🔹 Load categories from API
  useEffect(() => {
    loadCategories();
  }, []);

  // 🔹 Filter categories based on search
  useEffect(() => {
    if (!searchQuery) {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter(cat =>
        prettyLabel(cat.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, categories]);

  const loadCategories = async () => {
    try {
      const res = await getCategories();
      const list = Array.isArray(res?.data) ? res.data : [];
      setCategories(list);
      setFilteredCategories(list);
    } catch (err) {
      console.error("Category API failed", err);
      setCategories([]);
      setFilteredCategories([]);
    }
  };

  // 🔹 Enhanced category selection with animation
  const handleSelect = useCallback((category) => {
    updateExpertData({
      categoryId: category.id,
      categoryName: prettyLabel(category.name),
      categoryKey: category.key || category.slug
    });
  }, [updateExpertData]);

  // const IconFor = (key) => {
  //   const Icon = CATEGORY_ICON_MAP[key];
  //   return Icon ? <Icon style={{ fontSize: 16 }} /> : null;
  // };

  const canNext = !!expertData.categoryId;
  const selectedCategory = categories.find(cat => cat.id === expertData.categoryId);
  const totalCategories = filteredCategories.length;

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <RegisterLayout
      title="Choose your expertise area"
      subtitle="Select the main category where you can help clients best. You can add more later."
      step={2}
      hasNavbar={true}
    >
      {/* ✅ Premium Header Stats */}
      <CategoryStats>
        <div>
          <SelectedCount>{canNext ? 1 : 0}</SelectedCount>
          <span>Selected</span>
        </div>
        <div>
          <span>{totalCategories}</span>
          <span>{totalCategories === 1 ? "Category" : "Categories"}</span>
        </div>
      </CategoryStats>

      {/* ✅ Premium Search */}
      <CategorySearch>
        <input
          placeholder={`Search ${totalCategories} ${totalCategories === 1 ? "category" : "categories"}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </CategorySearch>

      {/* ✅ Premium Category Grid */}
      <AnimatePresence>
        <CardGrid>
          {filteredCategories.length === 0 ? (
            <CategoryEmptyState>
              <div>
                {searchQuery ? (
                  <>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                    <h3>No categories found</h3>
                    <p>Try a different search term</p>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
                    <h3>Categories loading...</h3>
                    <p>We'll find the perfect match for your expertise</p>
                  </>
                )}
              </div>
            </CategoryEmptyState>
          ) : (
            filteredCategories.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1 
                }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.05 
                }}
              >
                <SelectCard
                  type="button"
                  active={expertData.categoryId === cat.id}
                  onClick={() => handleSelect(cat)}
                >
                  <div style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 12,
                    marginBottom: 8
                  }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: expertData.categoryId === cat.id 
                          ? "linear-gradient(135deg, #0ea5ff, #38bdf8)" 
                          : "rgba(56,189,248,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: expertData.categoryId === cat.id 
                          ? "0 4px 16px rgba(14,165,233,0.4)" 
                          : "0 2px 8px rgba(56,189,248,0.2)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      }}
                    >
                      <div
  style={{
    width: 40,
    height: 40,
    borderRadius: "50%",
    background:
      expertData.categoryId === cat.id
        ? "linear-gradient(135deg, #0ea5ff, #38bdf8)"
        : "rgba(56,189,248,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow:
      expertData.categoryId === cat.id
        ? "0 4px 16px rgba(14,165,233,0.4)"
        : "0 2px 8px rgba(56,189,248,0.2)",
    overflow: "hidden"
  }}
>
  <img
    src={cat.image_url || DEFAULT_CATEGORY_IMAGE}
    alt={cat.name}
    style={{
      width: "70%",
      height: "70%",
      objectFit: "cover",
      borderRadius: "50%"
    }}
    onError={(e) => {
      e.target.style.display = "none";
      e.target.parentElement.innerHTML = cat.name.charAt(0);
    }}
  />
</div>
                    </div>

                    <div>
                      <CardTitle>
                        {prettyLabel(cat.name)}
                      </CardTitle>
                      <CardMeta>
                        {expertData.categoryId === cat.id 
                          ? "✅ Perfect match selected" 
                          : "Primary expertise area"
                        }
                      </CardMeta>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <Chip>Live Sessions</Chip>
                    <Chip>Voice Calls</Chip>
                    <Chip>High Demand</Chip>
                  </div>
                </SelectCard>
              </motion.div>
            ))
          )}
        </CardGrid>
      </AnimatePresence>

      {/* ✅ Premium Action Buttons */}
      <ActionsRow style={{ marginTop: 40 }}>
        <SecondaryButton
          onClick={() => navigate("/expert/register")}
          style={{ marginRight: "auto" }}
        >
          ← Back to Basic Info
        </SecondaryButton>

        <PrimaryButton
          disabled={!canNext}
          onClick={() => navigate("/expert/register/subcategory")}
        >
          {selectedCategory ? (
            <>
              Continue with {prettyLabel(selectedCategory.name)} →
            </>
          ) : (
            "Continue to Subcategory →"
          )}
        </PrimaryButton>
      </ActionsRow>

      {/* ✅ Premium Selected Category Preview */}
      {canNext && selectedCategory && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: "rgba(224,242,254,0.8)",
            border: "2px solid rgba(14,165,233,0.3)",
            borderRadius: "20px",
            padding: "20px",
            marginTop: "24px",
            textAlign: "center",
            backdropFilter: "blur(16px)"
          }}
        >
          <img
  src={selectedCategory.image_url || DEFAULT_CATEGORY_IMAGE}
  alt={selectedCategory.name}
  style={{ width: 64, height: 64, borderRadius: "50%" }}
/>
          <h3 style={{ margin: "0 0 8px 0", color: "#1e293b" }}>
            {prettyLabel(selectedCategory.name)} selected!
          </h3>
          <p style={{ color: "#64748b", margin: 0 }}>
            Perfect! Now choose your specific specialization.
          </p>
        </motion.div>
      )}
    </RegisterLayout>
  );
}
