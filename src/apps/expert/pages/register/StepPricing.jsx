// src/apps/expert/pages/register/StepPricing.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useExpert } from "../../../../shared/context/ExpertContext";
import { savePriceApi, getMyPriceApi } from "../../../../shared/api/expertapi/price.api";
import useApi from "../../../../shared/hooks/useApi";

import RegisterLayout from "../../components/RegisterLayout";
import { getSmartPricing } from "../../utils/pricingEngine";
import Loader from "../../../../shared/components/Loader/Loader";

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
  PricingFieldsGrid,
  SuccessCard
} from "../../styles/Register.styles";

export default function StepPricing() {
  const navigate = useNavigate();
  const { expertData } = useExpert();

  const [pricePerMinute, setPricePerMinute] = useState("");
  const [chatPrice, setChatPrice] = useState("");
  const [reasonForPrice, setReasonForPrice] = useState("");
  const [handleCustomer, setHandleCustomer] = useState("");
  const [strength, setStrength] = useState("");
  const [weakness, setWeakness] = useState("");
  const [suggested, setSuggested] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoadingExisting, setIsLoadingExisting] = useState(true);

  const { request: savePrice, loading: saving } = useApi(savePriceApi);
  const { request: getMyPrice } = useApi(getMyPriceApi); // 👈 loading को यहाँ से हटा कर use hook loading direct use कर सकते हैं

  // 🔐 Route guard
  useEffect(() => {
    if (!expertData.expertId) {
      navigate("/expert/register/profile");
    }
  }, [expertData.expertId, navigate]);

  // ✅ FIX: empty dependency array [] ताकि ये सिर्फ़ एक बार लोड हो
  useEffect(() => {
    const loadExistingPrice = async () => {
      try {
        setIsLoadingExisting(true);
        const res = await getMyPrice();

        if (res?.data) {
          setPricePerMinute(res.data.call_per_minute?.toString() || "");
          setChatPrice(res.data.chat_per_minute?.toString() || "");
          setReasonForPrice(res.data.reason_for_price || "");
          setHandleCustomer(res.data.handle_customer || "");
          setStrength(res.data.strength || "");
          setWeakness(res.data.weakness || "");

          if (res.data.call_per_minute) {
            toast.info("Your existing pricing loaded");
          }
        } else if (res?.call_per_minute) {
          setPricePerMinute(res.call_per_minute?.toString() || "");
          setChatPrice(res.chat_per_minute?.toString() || "");
          setReasonForPrice(res.reason_for_price || "");
          setHandleCustomer(res.handle_customer || "");
          setStrength(res.strength || "");
          setWeakness(res.weakness || "");
        }
      } catch (err) {
        console.log("No existing price found, showing fresh form");
      } finally {
        setIsLoadingExisting(false);
      }
    };

    loadExistingPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 👈 खाली कर दिया गया ताकि बार-बार न चले!

  // 💡 Smart pricing
  const handleSmartPricing = useCallback(() => {
    const smartPrice = getSmartPricing({
      category: expertData.categoryName,
      experience: 3
    });

    setSuggested(smartPrice);
    setPricePerMinute(smartPrice.call.toString());
    setChatPrice(smartPrice.chat.toString());

    if (!reasonForPrice) {
      setReasonForPrice(`Expert in ${expertData.categoryName} with proven track record`);
    }

    toast.info(`Suggested pricing: ₹${smartPrice.call}/min call, ₹${smartPrice.chat}/min chat`);
  }, [expertData.categoryName, reasonForPrice]);

  // ✅ Validation
  const validateForm = useCallback(() => {
    const errors = {};

    const call = Number(pricePerMinute);
    const chat = Number(chatPrice);

    if (isNaN(call) || call < 10) {
      errors.call = "Call rate must be at least ₹10";
    } else if (call > 500) {
      errors.call = "Call rate cannot exceed ₹500 per minute";
    }

    if (isNaN(chat) || chat < 5) {
      errors.chat = "Chat rate must be at least ₹5";
    } else if (chat > 300) {
      errors.chat = "Chat rate cannot exceed ₹300 per minute";
    }

    if (!reasonForPrice.trim()) {
      errors.reason = "Please provide a reason for your pricing";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [pricePerMinute, chatPrice, reasonForPrice]);

  // रियल-टाइम वैलिडेशन (टाइप करने पर सिर्फ एरर चेक करेगा, API नहीं बुलाएगा!)
  useEffect(() => {
    if (pricePerMinute || chatPrice) {
      validateForm();
    }
  }, [pricePerMinute, chatPrice, reasonForPrice, validateForm]);

  const canFinish = Number(pricePerMinute) >= 10 &&
    Number(chatPrice) >= 5 &&
    !isNaN(Number(pricePerMinute)) &&
    !isNaN(Number(chatPrice)) &&
    reasonForPrice.trim().length > 0;

  const handleSubmit = async () => {
    if (!validateForm() || saving) return;

    try {
      const payload = {
        call_per_minute: Number(pricePerMinute),
        chat_per_minute: Number(chatPrice),
        reason_for_price: reasonForPrice.trim(),
        handle_customer: handleCustomer.trim(),
        strength: strength.trim(),
        weakness: weakness.trim()
      };

      const res = await savePrice(payload);

      if (!res?.success) {
        throw new Error(res?.message || "Failed to save pricing");
      }

      toast.success("Pricing saved successfully! 🎉");
      navigate(`/expert/register?completed=1&email=${expertData.email}`);

    } catch (err) {
      console.error("Pricing API failed:", err);
      toast.error(err.message || "Failed to save pricing. Please try again.");

      if (!err.message?.includes("network")) {
        toast.warning("You'll be able to update pricing later");
        navigate(`/expert/register?completed=1&email=${expertData.email}`);
      }
    }
  };

  if (isLoadingExisting) {
    return (
      <RegisterLayout title="Loading your pricing..." step={5} hasNavbar={true}>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Loader size="large" />
          <p style={{ marginTop: '20px', color: '#666' }}>
            Looking for existing pricing record...
          </p>
        </div>
      </RegisterLayout>
    );
  }

  return (
    <RegisterLayout
      title="Set your earning rates"
      subtitle="Competitive pricing attracts more clients. You can adjust anytime."
      step={5}
      hasNavbar={true}
    >
      {saving && <Loader />}

      <FullRow style={{ marginBottom: 32 }}>
        <PrimaryButton
          style={{
            background: "rgba(14,165,233,0.1)",
            color: "#0ea5ff",
            border: "2px solid rgba(14,165,233,0.2)"
          }}
          onClick={handleSmartPricing}
          disabled={saving}
        >
          💡 Suggest My Pricing
        </PrimaryButton>
      </FullRow>

      <FullRow style={{ marginBottom: 32 }}>
        <Field style={{ flex: 1, marginRight: 16 }}>
          <Label>Call Rate <span style={{ color: "#ef4444" }}>*</span></Label>
          <PriceInputRow>
            <Input
              type="number"
              min="10"
              max="500"
              step="5"
              value={pricePerMinute}
              onChange={e => setPricePerMinute(e.target.value)}
              placeholder="50"
              disabled={saving}
            />
            <span style={{ color: "#64748b" }}>₹ per minute</span>
          </PriceInputRow>
          {validationErrors.call && (
            <small style={{ color: "#ef4444", fontSize: 12, marginTop: 4, display: "block" }}>
              {validationErrors.call}
            </small>
          )}
        </Field>

        <Field style={{ flex: 1 }}>
          <Label>Chat Rate <span style={{ color: "#ef4444" }}>*</span></Label>
          <PriceInputRow>
            <Input
              type="number"
              min="5"
              max="300"
              step="5"
              value={chatPrice}
              onChange={e => setChatPrice(e.target.value)}
              placeholder="15"
              disabled={saving}
            />
            <span style={{ color: "#64748b" }}>₹ per minute</span>
          </PriceInputRow>
          {validationErrors.chat && (
            <small style={{ color: "#ef4444", fontSize: 12, marginTop: 4, display: "block" }}>
              {validationErrors.chat}
            </small>
          )}
        </Field>
      </FullRow>

      {suggested && (
        <SmartPricingCard style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>💡</span>
            <div>
              <strong>Smart Pricing Suggestion</strong>
              <p style={{ margin: "4px 0 0", fontSize: 14, color: "#10b981" }}>
                Based on your expertise: ₹{suggested.call}/min call | ₹{suggested.chat}/min chat
              </p>
            </div>
          </div>
        </SmartPricingCard>
      )}

      <PricingFieldsGrid>
        <FullRow>
          <Field>
            <Label>Reason for your pricing <span style={{ color: "#ef4444" }}>*</span></Label>
            <TextArea
              value={reasonForPrice}
              onChange={e => setReasonForPrice(e.target.value)}
              placeholder="Why do you charge this rate? (e.g., 5+ years experience, specialized skills, certified expert)"
              rows={3}
              maxLength={500}
              disabled={saving}
            />
            <CharacterCounter>
              {reasonForPrice.length}/500 characters
            </CharacterCounter>
            {validationErrors.reason && (
              <small style={{ color: "#ef4444", fontSize: 12, marginTop: 4, display: "block" }}>
                {validationErrors.reason}
              </small>
            )}
          </Field>
        </FullRow>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
          <Field>
            <Label>Customer Handling Style</Label>
            <TextArea
              value={handleCustomer}
              onChange={e => setHandleCustomer(e.target.value)}
              placeholder="How do you handle clients? (e.g., Polite, patient, solution-focused)"
              rows={2}
              maxLength={300}
              disabled={saving}
            />
            <CharacterCounter>{handleCustomer.length}/300</CharacterCounter>
          </Field>

          <Field>
            <Label>Your Strengths</Label>
            <Input
              value={strength}
              onChange={e => setStrength(e.target.value)}
              placeholder="e.g., Fast response, deep expertise, excellent communication"
              maxLength={200}
              disabled={saving}
            />
            <CharacterCounter>{strength.length}/200</CharacterCounter>
          </Field>

          <Field>
            <Label>Your Weakness (Optional)</Label>
            <Input
              value={weakness}
              onChange={e => setWeakness(e.target.value)}
              placeholder="e.g., Sometimes over-explains, but ensures clarity"
              maxLength={200}
              disabled={saving}
            />
            <CharacterCounter>{weakness.length}/200</CharacterCounter>
          </Field>
        </div>
      </PricingFieldsGrid>

      {Object.keys(validationErrors).length > 0 && (
        <ValidationSummary>
          <div style={{ color: "#ef4444", fontWeight: 600, marginBottom: 8 }}>
            ⚠️ Please fix before continuing:
          </div>
          {Object.values(validationErrors).map((error, idx) => (
            <div key={idx} style={{ color: "#ef4444", fontSize: 13, marginBottom: 4 }}>
              • {error}
            </div>
          ))}
        </ValidationSummary>
      )}

      {canFinish && (
        <SuccessCard style={{ marginTop: 24, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>✅</span>
            <div>
              <strong>Ready to go live!</strong>
              <p style={{ margin: "4px 0 0", fontSize: 14, color: "#10b981" }}>
                You'll earn ₹{Number(pricePerMinute)}/min for calls and ₹{Number(chatPrice)}/min for chats
              </p>
            </div>
          </div>
        </SuccessCard>
      )}

      <ActionsRow style={{ marginTop: 32 }}>
        <SecondaryButton
          onClick={() => navigate("/expert/register/profile")}
          disabled={saving}
        >
          ← Back to Profile
        </SecondaryButton>

        <PrimaryButton
          disabled={!canFinish || saving}
          onClick={handleSubmit}
        >
          {saving ? "Saving..." : "Complete Setup & Start →"}
        </PrimaryButton>
      </ActionsRow>
    </RegisterLayout>
  );
}