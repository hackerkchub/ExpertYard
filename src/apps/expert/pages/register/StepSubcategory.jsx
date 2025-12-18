// src/apps/expert/pages/register/StepSubcategory.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExpert } from "../../../../shared/context/ExpertContext";
import { getSubCategoriesApi } from "../../../../shared/api/expertapi/category.api";
import useApi from "../../../../shared/hooks/useApi";
import RegisterLayout from "../../components/RegisterLayout";
import Loader from "../../../../shared/components/Loader/Loader";
import ErrorMessage from "../../../../shared/components/ErrorMessage/ErrorMessage";

import {
  CardGrid,
  SelectCard,
  CardTitle,
  CardMeta,
  ActionsRow,
  PrimaryButton,
  SecondaryButton,
} from "../../styles/Register.styles";

export default function StepSubcategory() {
  const navigate = useNavigate();
  const { expertData, updateExpertData } = useExpert();

  const [subCategories, setSubCategories] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const {
    request: getSubCategories,
    loading,
    error
  } = useApi(getSubCategoriesApi);

  // 🔐 Route Guard (Phase-2 Rule)
  useEffect(() => {
    if (!expertData.categoryId) {
      navigate("/expert/register/category");
      return;
    }
    loadSubCategories();
  }, [expertData.categoryId]);

  const loadSubCategories = async () => {
  try {
    const res = await getSubCategories(expertData.categoryId);

    // 🔥 YAHI MAIN FIX HAI
    const list = Array.isArray(res?.data) ? res.data : [];

    setSubCategories(list);
  } catch (err) {
    console.error("SubCategory API failed", err);
    setSubCategories([]);
  }
};


  // 🔹 Select subcategory
  const handleSelect = (id, label) => {
    setSelectedId(id);

    updateExpertData({
      subCategoryIds: [id],
      position: label   // optional (agar backend accept karta ho)
    });
  };

  const canNext = !!selectedId;

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <RegisterLayout
      title="Choose your primary specialization"
      subtitle="You can add more specializations later from your expert dashboard."
      step={3}
    >
      <CardGrid>
        {subCategories.map((sub) => (
          <SelectCard
            key={sub.id}
            type="button"
            active={selectedId === sub.id}
            onClick={() => handleSelect(sub.id, sub.name)}
          >
            <CardTitle>{sub.name}</CardTitle>
            <CardMeta>
              This will be your main tag shown on your public profile.
            </CardMeta>
          </SelectCard>
        ))}
      </CardGrid>

      <ActionsRow>
        <SecondaryButton
          onClick={() => navigate("/expert/register/category")}
        >
          ← Back
        </SecondaryButton>

        <PrimaryButton
          disabled={!canNext}
          onClick={() => navigate("/expert/register/profile")}
        >
          Continue to Profile →
        </PrimaryButton>
      </ActionsRow>
    </RegisterLayout>
  );
}
