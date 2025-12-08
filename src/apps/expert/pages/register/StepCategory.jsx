// src/apps/expert/pages/register/StepCategory.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useExpertRegister } from "../../context/ExpertRegisterContext";
import { SUBCATEGORIES } from "../../../../shared/services/expertService";
import RegisterLayout from "../../components/RegisterLayout";
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
  const { data, updateField } = useExpertRegister();
  const navigate = useNavigate();

  const categories = Object.keys(SUBCATEGORIES);

  const handleSelect = (key) => {
    updateField("category_id", key);
  };

  const IconFor = (key) => {
    const Icon = CATEGORY_ICON_MAP[key];
    return Icon ? <Icon /> : null;
  };

  const canNext = !!data.category_id;

  return (
    <RegisterLayout
      title="Select your main category"
      subtitle="We’ll use this to show you right clients and sessions."
      step={2}
    >
      <CardGrid>
        {categories.map((key) => (
          <SelectCard
            key={key}
            type="button"
            active={data.category_id === key}
            onClick={() => handleSelect(key)}
          >
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                background: "rgba(56,189,248,0.12)",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                fontSize:16,
                color:"#0ea5ff"
              }}>
                {IconFor(key)}
              </div>
              <CardTitle>{prettyLabel(key)}</CardTitle>
            </div>
            <CardMeta>Includes all specializations under this area.</CardMeta>
            <Chip>Dynamic from service</Chip>
          </SelectCard>
        ))}
      </CardGrid>

      <ActionsRow>
        <SecondaryButton onClick={() => navigate("/expert/register")}>
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
