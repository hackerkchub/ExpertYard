// src/apps/expert/pages/register/StepCategory.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
} from "../../styles/Register.styles";

import { CATEGORY_ICON_MAP, prettyLabel } from "../../constants/categoryIcons";

export default function StepCategory() {
  const navigate = useNavigate();
  const { expertData, updateExpertData } = useExpert();

  const [categories, setCategories] = useState([]);

  const {
    request: getCategories,
    loading,
    error
  } = useApi(getCategoriesApi);

  // 🔹 Load categories from API
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
   try {
    const res = await getCategories();

    // 🔥 IMPORTANT LINE
    const list = Array.isArray(res?.data) ? res.data : [];

    setCategories(list);
  } catch (err) {
    console.error("Category API failed", err);
    setCategories([]);
  }
};

  // 🔹 Select category
  const handleSelect = (category) => {
    updateExpertData({
      categoryId: category.id
    });
  };

  const IconFor = (key) => {
    const Icon = CATEGORY_ICON_MAP[key];
    return Icon ? <Icon /> : null;
  };

  const canNext = !!expertData.categoryId;

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <RegisterLayout
      title="Select your main category"
      subtitle="We’ll use this to show you right clients and sessions."
      step={2}
    >
      <CardGrid>
        {categories.map((cat) => (
          <SelectCard
            key={cat.id}
            type="button"
            active={expertData.categoryId === cat.id}
            onClick={() => handleSelect(cat)}
          >
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: "rgba(56,189,248,0.12)",
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"center",
                  fontSize:16,
                  color:"#0ea5ff"
                }}
              >
                {IconFor(cat.key || cat.slug || cat.name)}
              </div>

              <CardTitle>
                {prettyLabel(cat.name)}
              </CardTitle>
            </div>

            <CardMeta>
              Includes all specializations under this area.
            </CardMeta>

            <Chip>Live</Chip>
          </SelectCard>
        ))}
      </CardGrid>

      <ActionsRow>
        <SecondaryButton
          onClick={() => navigate("/expert/register")}
        >
          ← Back
        </SecondaryButton>

        <PrimaryButton
          disabled={!canNext}
          onClick={() => navigate("/expert/register/subcategory")}
        >
          Continue to Subcategory →
        </PrimaryButton>
      </ActionsRow>
    </RegisterLayout>
  );
}
