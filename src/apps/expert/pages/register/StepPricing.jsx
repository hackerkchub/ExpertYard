// src/apps/expert/pages/register/StepPricing.jsx (Simplified & Fixed)
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useExpert } from "../../../../shared/context/ExpertContext";
import { setPriceApi } from "../../../../shared/api/expertapi/price.api";
import useApi from "../../../../shared/hooks/useApi";

import RegisterLayout from "../../components/RegisterLayout";
import { getSmartPricing } from "../../utils/pricingEngine";
import Loader from "../../../../shared/components/Loader/Loader";
import ErrorMessage from "../../../../shared/components/ErrorMessage/ErrorMessage";

import {
  Field,
  Label,
  Input,
  TextArea,
  ActionsRow,
  PrimaryButton,
  SecondaryButton,
  FullRow,
  PriceInputRow,
  SmartPricingCard,
  ValidationSummary,
  CharacterCounter,
  PricingFieldsGrid
} from "../../styles/Register.styles";

export default function StepPricing() {
  const navigate = useNavigate();
  const { expertData } = useExpert();

  const [pricePerMinute, setPricePerMinute] = useState("");
  const [chatPrice, setChatPrice] = useState("");
  const [reasonForPrice, setReasonForPrice] = useState("Experienced professional with specialized skills in this domain");
  const [handleCustomer, setHandleCustomer] = useState("Polite, professional, solution-oriented communication");
  const [strength, setStrength] = useState("Strong problem-solving and excellent client communication");
  const [weakness, setWeakness] = useState("Detail-oriented, sometimes provides comprehensive explanations");
  const [suggested, setSuggested] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  const {
    request: setPrice,
    loading,
    error
  } = useApi(setPriceApi);

  // 🔐 Route guard
  useEffect(() => {
    if (!expertData.expertId) {
      navigate("/expert/register/profile");
    }
  }, [expertData.expertId, navigate]);

  // 💡 Smart pricing
  const handleSmartPricing = useCallback(() => {
    const smartPrice = getSmartPricing({
      category: expertData.categoryName,
      experience: 3
    });
    
    setSuggested(smartPrice);
    setPricePerMinute(smartPrice.call.toString());
    setChatPrice(smartPrice.chat.toString());
  }, [expertData.categoryName]);

  // ✅ Real-time validation
  const validateForm = useCallback(() => {
    const errors = {};
    
    if (!pricePerMinute || Number(pricePerMinute) < 10) {
      errors.call = "Call rate must be at least ₹10";
    }
    if (!chatPrice || Number(chatPrice) < 5) {
      errors.chat = "Chat rate must be at least ₹5";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [pricePerMinute, chatPrice]);

  const canFinish = Number(pricePerMinute) >= 10 && Number(chatPrice) >= 5;

  // 🚀 Submit with offline fallback
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        expert_id: expertData.expertId,
        call_per_minute: Number(pricePerMinute),
        chat_per_minute: Number(chatPrice),
        reason_for_price: reasonForPrice.trim(),
        handle_customer: handleCustomer.trim(),
        strength: strength.trim(),
        weakness: weakness.trim()
      };

      const res = await setPrice(payload);
      navigate("/expert/home");
    } catch (err) {
      console.warn("⚠️ Pricing API failed - continuing:", err);
      localStorage.setItem("expert_pricing_draft", JSON.stringify({
        expertId: expertData.expertId,
        call_per_minute: Number(pricePerMinute),
        chat_per_minute: Number(chatPrice)
      }));
      navigate("/expert/home");
    }
  };

  return (
    <RegisterLayout
      title="Set your earning rates"
      subtitle="Competitive pricing attracts more clients. You can adjust anytime."
      step={5}
      hasNavbar={true}
    >
      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}

      {/* ✅ Smart Pricing Button */}
      <FullRow style={{ marginBottom: 32 }}>
        <PrimaryButton
          style={{
            background: "rgba(14,165,233,0.1)",
            color: "#0ea5ff",
            border: "2px solid rgba(14,165,233,0.2)"
          }}
          onClick={handleSmartPricing}
        >
          💡 Suggest My Pricing
        </PrimaryButton>
      </FullRow>

      {/* ✅ Call & Chat Rates */}
      <FullRow style={{ marginBottom: 32 }}>
        <Field style={{ flex: 1, marginRight: 16 }}>
          <Label>Call Rate <span style={{ color: "#ef4444" }}>*</span></Label>
          <PriceInputRow>
            <Input
              type="number"
              min="10"
              max="200"
              value={pricePerMinute}
              onChange={e => {
                setPricePerMinute(e.target.value);
                validateForm();
              }}
              placeholder="50"
            />
            <span style={{ color: "#64748b" }}>per minute</span>
          </PriceInputRow>
          {validationErrors.call && (
            <small style={{ color: "#ef4444", fontSize: 12 }}>{validationErrors.call}</small>
          )}
        </Field>

        <Field style={{ flex: 1 }}>
          <Label>Chat Rate <span style={{ color: "#ef4444" }}>*</span></Label>
          <PriceInputRow>
            <Input
              type="number"
              min="5"
              max="100"
              value={chatPrice}
              onChange={e => {
                setChatPrice(e.target.value);
                validateForm();
              }}
              placeholder="15"
            />
            <span style={{ color: "#64748b" }}>per minute</span>
          </PriceInputRow>
          {validationErrors.chat && (
            <small style={{ color: "#ef4444", fontSize: 12 }}>{validationErrors.chat}</small>
          )}
        </Field>
      </FullRow>

      {/* ✅ Pre-filled Professional Fields */}
      <PricingFieldsGrid>
        <FullRow>
          <Field>
            <Label>Reason for your pricing <span style={{ color: "#ef4444" }}>*</span></Label>
            <TextArea
              value={reasonForPrice}
              onChange={e => setReasonForPrice(e.target.value)}
              placeholder="Why do you charge this rate?"
              rows={3}
            />
            <CharacterCounter>{reasonForPrice.length}/200</CharacterCounter>
          </Field>
        </FullRow>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
          <Field>
            <Label>Customer Handling Style</Label>
            <TextArea
              value={handleCustomer}
              onChange={e => setHandleCustomer(e.target.value)}
              placeholder="How you interact with clients..."
              rows={2}
            />
          </Field>

          <Field>
            <Label>Your Strengths</Label>
            <Input
              value={strength}
              onChange={e => setStrength(e.target.value)}
              placeholder="Fast response, deep expertise..."
            />
          </Field>

          <Field>
            <Label>Your Weakness (Optional)</Label>
            <Input
              value={weakness}
              onChange={e => setWeakness(e.target.value)}
              placeholder="Sometimes over-explains..."
            />
          </Field>
        </div>
      </PricingFieldsGrid>

      {/* ✅ Validation Summary */}
      {Object.keys(validationErrors).length > 0 && (
        <ValidationSummary>
          <div style={{ color: "#ef4444", fontWeight: 600 }}>⚠️ Please fix:</div>
          {Object.values(validationErrors).map((error, idx) => (
            <div key={idx} style={{ color: "#ef4444", fontSize: 13 }}>
              • {error}
            </div>
          ))}
        </ValidationSummary>
      )}

      <ActionsRow style={{ marginTop: 48 }}>
        <SecondaryButton
          onClick={() => navigate("/expert/register/profile")}
          disabled={loading}
        >
          ← Back to Profile
        </SecondaryButton>

        <PrimaryButton
          disabled={!canFinish || loading}
          onClick={handleSubmit}
        >
          {loading ? "Finalizing..." : "Complete Setup & Start →"}
        </PrimaryButton>
      </ActionsRow>
    </RegisterLayout>
  );
}
