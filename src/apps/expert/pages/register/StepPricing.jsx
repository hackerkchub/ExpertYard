// src/apps/expert/pages/register/StepPricing.jsx
import React, { useEffect, useState } from "react";
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
  ActionsRow,
  PrimaryButton,
  SecondaryButton,
  FullRow,
  PriceInputRow,
  TextArea
} from "../../styles/Register.styles";

export default function StepPricing() {
  const navigate = useNavigate();
  const { expertData } = useExpert();

  const [pricePerMinute, setPricePerMinute] = useState("");
  const [chatPrice, setChatPrice] = useState("");

  // 🔥 AUTO GENERATED BUT EDITABLE
  const [reasonForPrice, setReasonForPrice] = useState(
    "Experienced professional in this domain"
  );
  const [handleCustomer, setHandleCustomer] = useState(
    "Polite, professional and solution oriented"
  );
  const [strength, setStrength] = useState(
    "Strong problem solving and communication skills"
  );
  const [weakness, setWeakness] = useState(
    "Detail oriented, sometimes over explains"
  );

  const [suggested, setSuggested] = useState(null);

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
  function handleSmartPricing() {
    const s = getSmartPricing({
      price_per_minute: pricePerMinute,
      chat_price: chatPrice
    });

    setSuggested(s);
    setPricePerMinute(s.call);
    setChatPrice(s.chat);
  }

  const canFinish =
    Number(pricePerMinute) > 0 &&
    Number(chatPrice) > 0;

  // 🚀 Submit pricing
  const handleSubmit = async () => {
    try {
      const payload = {
        expert_id: expertData.expertId,
        call_per_minute: Number(pricePerMinute),
        chat_per_minute: Number(chatPrice),

        // 🔥 UI GENERATED VALUES
        reason_for_price: reasonForPrice,
        handle_customer: handleCustomer,
        strength,
        weakness
      };

      await setPrice(payload);
      navigate("/expert/home");
    } catch (err) {}
  };

  return (
    <RegisterLayout
      title="Set your price per minute"
      subtitle="You can always update your pricing later from the Earnings section."
      step={5}
    >
      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}

      {/* Smart pricing */}
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

      {/* Call pricing */}
      <FullRow>
        <Field>
          <Label>Call rate (₹ per minute)</Label>
          <PriceInputRow>
            <Input
              type="number"
              min={1}
              value={pricePerMinute}
              onChange={e => setPricePerMinute(e.target.value)}
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
              value={chatPrice}
              onChange={e => setChatPrice(e.target.value)}
              placeholder="e.g. 15"
              style={{ maxWidth: 160 }}
            />
            <span>For chat-based consultation.</span>
          </PriceInputRow>
        </Field>
      </FullRow>

      {/* AUTO GENERATED FIELDS (SAME CSS) */}
      <FullRow>
        <Field>
          <Label>Reason for your price</Label>
          <TextArea
            value={reasonForPrice}
            onChange={e => setReasonForPrice(e.target.value)}
          />
        </Field>
      </FullRow>

      <FullRow>
        <Field>
          <Label>How do you handle customers?</Label>
          <TextArea
            value={handleCustomer}
            onChange={e => setHandleCustomer(e.target.value)}
          />
        </Field>
      </FullRow>

      <FullRow>
        <Field>
          <Label>Your Strength</Label>
          <Input
            value={strength}
            onChange={e => setStrength(e.target.value)}
          />
        </Field>
      </FullRow>

      <FullRow>
        <Field>
          <Label>Your Weakness</Label>
          <Input
            value={weakness}
            onChange={e => setWeakness(e.target.value)}
          />
        </Field>
      </FullRow>

      <ActionsRow>
        <SecondaryButton
          onClick={() => navigate("/expert/register/profile")}
        >
          ← Back
        </SecondaryButton>

        <PrimaryButton
          disabled={!canFinish || loading}
          onClick={handleSubmit}
        >
          {loading ? "Finishing..." : "Complete & go to home →"}
        </PrimaryButton>
      </ActionsRow>
    </RegisterLayout>
  );
}
