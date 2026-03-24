// src/apps/expert/pages/register/StepSubcategory.jsx (Premium Upgraded)
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { useExpert } from "../../../../shared/context/ExpertContext";
import { getSubCategoriesApi , saveSubCategoryApi} from "../../../../shared/api/expertapi/category.api";
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
  SubcategorySearch,
  SelectionStats,
  SelectedCount,
  SubcategoryEmptyState,
  CategoryPreview,
  SelectedPreview
} from "../../styles/Register.styles";

export default function StepSubcategory() {
  const navigate = useNavigate();
  const { expertData, updateExpertData } = useExpert();

  const [subCategories, setSubCategories] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  // 🔥 Multi-select temporarily disabled due to backend limitation
  const [isMultiSelect] = useState(false); // Fixed to single-select mode
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);

  const {
    request: getSubCategories,
    loading,
    error
  } = useApi(getSubCategoriesApi);

  const { request: saveSubCategory, loading: saving } = useApi(saveSubCategoryApi);

  const loadSubCategories = useCallback(async () => {
    try {
      const res = await getSubCategories(expertData.categoryId);
      // ✅ FIX: useApi already unwraps the response
     const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setSubCategories(list);
      setFilteredSubCategories(list);
    } catch (err) {
      console.error("SubCategory API failed", err);
      setSubCategories([]);
      setFilteredSubCategories([]);
    }
  }, [expertData.categoryId, getSubCategories]);

  // 🔐 Route Guard + Load Data
 useEffect(() => {
  if (!expertData.categoryId) {
    navigate("/expert/register/category");
    return;
  }

  loadSubCategories();
}, [expertData.categoryId]);

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

  // 🔹 Enhanced single-select handling (multi-select disabled)
  const handleSelect = useCallback((id, name) => {
    // Single select only (due to backend limitation)
    setSelectedIds([id]);
    
    updateExpertData({
      subCategoryIds: [id],
      primarySubCategory: name
    });
  }, [updateExpertData]);

  // ✅ FIX: Proper handleNext with API call
  const handleNext = async () => {
    if (selectedIds.length === 0) return;
    
    try {
     await saveSubCategory({
  subcategory_id: selectedIds[0]
});

updateExpertData({
  subCategoryIds: selectedIds
});
      navigate("/expert/register/profile");
    } catch (err) {
      console.error("Save subcategory failed", err);
    }
  };

  // ✅ FIX: Added proper dependency
  useEffect(() => {
    if (expertData.subCategoryIds?.length) {
      setSelectedIds(expertData.subCategoryIds);
    }
  }, [expertData.subCategoryIds]);

  // 🔹 Toggle multi-select mode (disabled temporarily)
  // const toggleMultiSelect = () => {
  //   // Temporarily disabled due to backend limitation
  //   // Only single select is supported currently
  //   console.warn("Multi-select is temporarily disabled");
  // };

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
      subtitle="Choose your primary specialization within your expertise area for better credibility"
      step={3}
      hasNavbar={true}
    >
      {/* ✅ Premium Category Preview */}
      <CategoryPreview>
        <div>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
          <h3>{expertData.categoryName || "Category"}</h3>
          <p>Select your primary specialization</p>
        </div>
        {/* Multi-select temporarily disabled - UI hidden */}
      </CategoryPreview>

      {/* ✅ Premium Stats */}
      <SelectionStats>
        <div>
          <SelectedCount>{selectedIds.length}</SelectedCount>
          <span>Primary Specialization</span>
        </div>
        <div>
          <span>{totalSubCategories}</span>
          <span>{totalSubCategories === 1 ? "Specialization" : "Specializations"}</span>
        </div>
      </SelectionStats>

      {/* ✅ Premium Search */}
      <SubcategorySearch>
        <input
          placeholder={`Search ${totalSubCategories} ${totalSubCategories === 1 ? "specialization" : "specializations"}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SubcategorySearch>

      {/* ✅ Premium Grid */}
      <AnimatePresence>
        <CardGrid>
          {filteredSubCategories.length === 0 ? (
            <SubcategoryEmptyState>
              <div>
                {searchQuery ? (
                  <>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                    <h3>No specializations found</h3>
                    <p>Try adjusting your search terms</p>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>⚙️</div>
                    <h3>Loading specializations...</h3>
                    <p>We'll show relevant options for your category</p>
                  </>
                )}
              </div>
            </SubcategoryEmptyState>
          ) : (
            filteredSubCategories.map((sub, index) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  scale: 1 
                }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.04 
                }}
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
                        boxShadow: selectedIds.includes(sub.id)
                          ? "0 6px 20px rgba(16,185,129,0.4)"
                          : "0 2px 12px rgba(16,185,129,0.2)"
                      }}
                    >
                      <div style={{
                        color: selectedIds.includes(sub.id) ? "white" : "#059669",
                        fontSize: 20,
                        fontWeight: "bold"
                      }}>
                        {selectedIds.includes(sub.id) ? "✓" : "★"}
                      </div>
                    </div>
                    <div>
                      <CardTitle>{sub.name}</CardTitle>
                      <CardMeta>
                        {selectedIds.includes(sub.id)
                          ? "✅ Your primary specialization"
                          : "Click to select as primary specialization"
                        }
                      </CardMeta>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 6 }}>
                    <Chip>1-on-1</Chip>
                    <Chip>Live</Chip>
                    <Chip>Expert</Chip>
                  </div>
                </SelectCard>
              </motion.div>
            ))
          )}
        </CardGrid>
      </AnimatePresence>

      {/* ✅ Premium Selected Preview */}
      {selectedSubCategories.length > 0 && (
        <SelectedPreview>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ 
              fontSize: 32, 
              color: "#10b981" 
            }}>✅</div>
            <div>
              <h4 style={{ margin: "0 0 4px 0", color: "#1e293b" }}>
                {selectedSubCategories.map(s => s.name).join(", ")}
              </h4>
              <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>
                Your primary specialization confirmed
              </p>
            </div>
          </div>
        </SelectedPreview>
      )}

      {/* ✅ Premium Action Buttons */}
      <ActionsRow style={{ marginTop: 48 }}>
        <SecondaryButton
          onClick={() => navigate("/expert/register/category")}
          style={{ marginRight: "auto" }}
        >
          ← Back to Categories
        </SecondaryButton>

        {/* ✅ FIX: Updated button with handleNext and saving state */}
        <PrimaryButton
          disabled={!canNext || saving}
          onClick={handleNext}
        >
          {saving ? (
            "Saving..."
          ) : selectedSubCategories.length > 0 ? (
            <>
              Continue to Profile ({selectedSubCategories[0]?.name?.slice(0, 20) || ""}) →
            </>
          ) : (
            "Continue to Profile →"
          )}
        </PrimaryButton>
      </ActionsRow>
    </RegisterLayout>
  );
}