// src/apps/expert/pages/register/StepPricing.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

import { useExpertRegister } from "../../context/ExpertRegisterContext";
import RegisterLayout from "../../components/RegisterLayout";
import { getSmartPricing } from "../../utils/pricingEngine";

import {
  Field,
  Label,
  Input,
  ActionsRow,
  PrimaryButton,
  SecondaryButton,
  FullRow,
  PriceInputRow,
} from "../../styles/Register.styles";

export default function StepPricing() {
  const { data, updateField, reset } = useExpertRegister();
  const [submitting, setSubmitting] = useState(false);
  const [suggested, setSuggested] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!data.position) {
      navigate("/expert/register/profile");
    }
  }, [data.position, navigate]);

  const canFinish =
    data.price_per_minute && data.chat_price;

  function handleSmartPricing() {
    const s = getSmartPricing(data);
    setSuggested(s);

    updateField("price_per_minute", s.call);
    updateField("chat_price", s.chat);
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const payload = {
        ...data,
        status: "active",
        expert_id: undefined,
      };

      // dummy ID future scope placeholder
      const dummyId = uuid();
      localStorage.setItem("expert_id", dummyId);

      console.log("Expert Registration Success!!");
      console.log("Generated ID:", dummyId);
      console.log("Payload:", payload);

      // redirect to home page
      navigate("/expert");

      // clear context AFTER navigation
      setTimeout(() => {
        reset();
      }, 300);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <RegisterLayout
      title="Set your price per minute"
      subtitle="You can always update your pricing later from the Earnings section."
      step={5}
    >
      {/* Smart pricing button */}
      <FullRow>
        <PrimaryButton
          style={{
            background: "rgba(14,165,233,0.1)",
            color: "#0ea5ff",
            marginBottom: 20
          }}
          onClick={handleSmartPricing}
        >
          💡 Suggest My Pricing
        </PrimaryButton>
      </FullRow>

      {suggested && (
        <FullRow style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, color: "#4b5563" }}>
            Recommended Range:{" "}
            <b>
              ₹{suggested.range.min} – ₹{suggested.range.max}/min
            </b>
          </div>
        </FullRow>
      )}

      {/* Call pricing */}
      <FullRow>
        <Field>
          <Label>Call rate (₹ per minute)</Label>
          <PriceInputRow>
            <Input
              type="number"
              min={1}
              value={data.price_per_minute || ""}
              onChange={e => updateField("price_per_minute", e.target.value)}
              placeholder="e.g. 50"
              style={{ maxWidth: 160 }}
            />
            <span>Clients will see this as your call rate.</span>
          </PriceInputRow>
        </Field>
      </FullRow>

      {/* Chat pricing */}
      <FullRow>
        <Field>
          <Label>Chat rate (₹ per minute)</Label>
          <PriceInputRow>
            <Input
              type="number"
              min={1}
              value={data.chat_price || ""}
              onChange={e => updateField("chat_price", e.target.value)}
              placeholder="e.g. 15"
              style={{ maxWidth: 160 }}
            />
            <span>For chat-based consultation.</span>
          </PriceInputRow>
        </Field>
      </FullRow>

      <ActionsRow>
        <SecondaryButton onClick={() => navigate("/expert/register/profile")}>
          ← Back
        </SecondaryButton>

        <PrimaryButton
          disabled={!canFinish || submitting}
          onClick={handleSubmit}
        >
          {submitting ? "Finishing..." : "Complete & go to home →"}
        </PrimaryButton>
      </ActionsRow>
    </RegisterLayout>
  );
}
