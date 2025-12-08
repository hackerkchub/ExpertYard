// src/apps/expert/pages/register/StepSubcategory.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useExpertRegister } from "../../context/ExpertRegisterContext";
import { SUBCATEGORIES } from "../../../../shared/services/expertService";
import RegisterLayout from "../../components/RegisterLayout";
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
  const { data, updateField } = useExpertRegister();
  const navigate = useNavigate();

  useEffect(() => {
    if (!data.category_id) {
      navigate("/expert/register/category");
    }
  }, [data.category_id, navigate]);

  const subs = SUBCATEGORIES[data.category_id] || {};

  const handleSelect = (id, label) => {
    updateField("subcategory_id", id);
    updateField("position", label);
  };

  const canNext = !!data.subcategory_id;

  return (
    <RegisterLayout
      title="Choose your primary specialization"
      subtitle="You can add more specializations later from your expert dashboard."
      step={3}
    >
      <CardGrid>
        {Object.entries(subs).map(([id, label]) => (
          <SelectCard
            key={id}
            type="button"
            active={data.subcategory_id === id}
            onClick={() => handleSelect(id, label)}
          >
            <CardTitle>{label}</CardTitle>
            <CardMeta>
              This will be your main tag shown on your public profile.
            </CardMeta>
          </SelectCard>
        ))}
      </CardGrid>

      <ActionsRow>
        <SecondaryButton onClick={() => navigate("/expert/register/category")}>
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
