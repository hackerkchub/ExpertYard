// src/apps/expert/pages/register/StepPricing.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useExpert } from "../../../../shared/context/ExpertContext";
import { savePriceApi, getMyPriceApi } from "../../../../shared/api/expertapi/price.api";
import { getPlansApi, createPlanApi, deletePlanApi, updatePlanApi } from "../../../../shared/api/expertapi/subscription.api";
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
  SuccessCard,
  CheckboxGroup,
  CheckboxLabel,
  CheckboxInput,
  SectionTitle,
  SectionCard,
  PlanCard,
  PlanHeader,
  PlanName,
  PlanPrice,
  PlanDetails,
  AddPlanButton,
  PlansGrid,
  RemoveButton,
  EditButton
} from "../../styles/Register.styles";

export default function StepPricing() {
  const navigate = useNavigate();
  const { expertData } = useExpert();

  // Pricing modes state
  const [selectedModes, setSelectedModes] = useState(["per_minute"]);
  
  // Per-minute pricing
  const [pricePerMinute, setPricePerMinute] = useState("");
  const [chatPrice, setChatPrice] = useState("");
  
  // Session pricing
  const [sessionPrice, setSessionPrice] = useState("");
  const [sessionDuration, setSessionDuration] = useState("");
  
  // Subscription plans
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [savingPlans, setSavingPlans] = useState(false);
  const [deletingPlan, setDeletingPlan] = useState(false);
  const [planForm, setPlanForm] = useState({
    name: "",
    duration_type: "monthly",
    price: "",
    minutes_limit: "",
    calls_limit: "",
    call_enabled: true,
    chat_enabled: true
  });
  
  // Common fields
  const [reasonForPrice, setReasonForPrice] = useState("");
  const [handleCustomer, setHandleCustomer] = useState("");
  const [strength, setStrength] = useState("");
  const [weakness, setWeakness] = useState("");
  const [suggested, setSuggested] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoadingExisting, setIsLoadingExisting] = useState(true);
  const [backendErrors, setBackendErrors] = useState({});
  
  const { request: savePrice, loading: saving, error: saveError } = useApi(savePriceApi);
  const { request: getMyPrice } = useApi(getMyPriceApi);
  const { request: getPlans, loading: loadingPlans } = useApi(getPlansApi);
  const { request: createPlan, loading: creatingPlan } = useApi(createPlanApi);
  const { request: deletePlan, loading: deletingPlanApi } = useApi(deletePlanApi);
  const { request: updatePlan, loading: updatingPlan } = useApi(updatePlanApi);

  // Route guard
  useEffect(() => {
    if (!expertData.expertId) {
      navigate("/expert/register/profile");
    }
  }, [expertData.expertId, navigate]);

  // Load existing data
  useEffect(() => {
    const loadExistingData = async () => {
      try {
        setIsLoadingExisting(true);
        
        // Load pricing data
        const priceRes = await getMyPrice();
        if (priceRes?.data) {
          // Load pricing modes (subscription is NOT stored here)
          if (priceRes.data.pricing_modes && Array.isArray(priceRes.data.pricing_modes)) {
            setSelectedModes(priceRes.data.pricing_modes);
          }
          
          // Load per-minute pricing
          if (priceRes.data.call?.per_minute) {
            setPricePerMinute(priceRes.data.call.per_minute.toString());
          }
          if (priceRes.data.chat?.per_minute) {
            setChatPrice(priceRes.data.chat.per_minute.toString());
          }
          
          // Load session pricing
          if (priceRes.data.session?.price) {
            setSessionPrice(priceRes.data.session.price.toString());
          }
          if (priceRes.data.session?.duration) {
            setSessionDuration(priceRes.data.session.duration.toString());
          }
          
          // Load common fields
          setReasonForPrice(priceRes.data.reason_for_price || "");
          setHandleCustomer(priceRes.data.handle_customer || "");
          setStrength(priceRes.data.strength || "");
          setWeakness(priceRes.data.weakness || "");
        }
        
        // Load subscription plans from backend (separate API)
        if (expertData.expertId) {
          const plansRes = await getPlans(expertData.expertId);
          if (plansRes?.data && Array.isArray(plansRes.data)) {
            setSubscriptionPlans(plansRes.data);
            // If subscription plans exist, auto-select subscription mode
            if (plansRes.data.length > 0 && !selectedModes.includes("subscription")) {
              setSelectedModes(prev => [...prev, "subscription"]);
            }
          }
        }
        
      } catch (err) {
        console.log("No existing data found, showing fresh form");
      } finally {
        setIsLoadingExisting(false);
      }
    };

    loadExistingData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Smart pricing suggestion
  const handleSmartPricing = useCallback(() => {
    const smartPrice = getSmartPricing({
      category: expertData.categoryName,
      experience: 3
    });

    setSuggested(smartPrice);
    
    if (selectedModes.includes("per_minute")) {
      setPricePerMinute(smartPrice.call.toString());
      setChatPrice(smartPrice.chat.toString());
    }
    
    if (selectedModes.includes("session")) {
      setSessionPrice((smartPrice.call * 30).toString());
      setSessionDuration("30");
    }

    if (!reasonForPrice) {
      setReasonForPrice(`Expert in ${expertData.categoryName} with proven track record`);
    }

    toast.info(`Suggested pricing loaded!`);
  }, [expertData.categoryName, reasonForPrice, selectedModes]);

  // Validate form
  const validateForm = useCallback(() => {
    const errors = {};
    const backendErrs = {};

    // Validate pricing modes (excluding subscription for validation)
    const nonSubscriptionModes = selectedModes.filter(m => m !== "subscription");
    
    if (nonSubscriptionModes.length === 0 && selectedModes.includes("subscription") === false) {
      errors.modes = "Please select at least one pricing method";
    }

    // Validate per-minute pricing
    if (nonSubscriptionModes.includes("per_minute")) {
      const call = Number(pricePerMinute);
      const chat = Number(chatPrice);

      if (isNaN(call) || call < 10) {
        errors.call = "Call rate must be at least ₹10";
      } else if (call > 10000) {
        errors.call = "Call rate cannot exceed ₹10,000 per minute";
      }

      if (isNaN(chat) || chat < 5) {
        errors.chat = "Chat rate must be at least ₹5";
      } else if (chat > 10000) {
        errors.chat = "Chat rate cannot exceed ₹10,000 per minute";
      }
    }

    // Validate session pricing
    if (nonSubscriptionModes.includes("session")) {
      const session = Number(sessionPrice);
      const duration = Number(sessionDuration);

      if (isNaN(session) || session < 50) {
        errors.session = "Session price must be at least ₹50";
      } else if (session > 100000) {
        errors.session = "Session price cannot exceed ₹1,00,000";
      }

      if (isNaN(duration) || duration < 1) {
        errors.sessionDuration = "Session duration must be at least 1 minute";
      } else if (duration > 480) {
        errors.sessionDuration = "Session duration cannot exceed 480 minutes (8 hours)";
      }
    }

    // Validate common fields (only if there are non-subscription modes)
    if (nonSubscriptionModes.length > 0 && !reasonForPrice.trim()) {
      errors.reason = "Please provide a reason for your pricing";
    }

    setValidationErrors(errors);
    setBackendErrors(backendErrs);
    return Object.keys(errors).length === 0 && Object.keys(backendErrs).length === 0;
  }, [selectedModes, pricePerMinute, chatPrice, sessionPrice, sessionDuration, reasonForPrice]);

  // Real-time validation
  useEffect(() => {
    if (pricePerMinute || chatPrice || sessionPrice || sessionDuration || selectedModes.length > 0) {
      validateForm();
    }
  }, [pricePerMinute, chatPrice, sessionPrice, sessionDuration, selectedModes, reasonForPrice, validateForm]);

  // Handle mode toggle
  const handleModeToggle = (mode) => {
    setSelectedModes(prev => {
      if (prev.includes(mode)) {
        return prev.filter(m => m !== mode);
      } else {
        return [...prev, mode];
      }
    });
  };

  // Save plan to backend
  const savePlanToBackend = async (planData) => {
    try {
      const payload = {
        name: planData.name,
        duration_type: planData.duration_type,
        price: Number(planData.price),
        minutes_limit: planData.minutes_limit ? Number(planData.minutes_limit) : null,
        calls_limit: planData.calls_limit ? Number(planData.calls_limit) : null,
        call_enabled: planData.call_enabled,
        chat_enabled: planData.chat_enabled
      };
      
      const response = await createPlan(payload);
      
      if (response?.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response?.message || "Failed to create plan");
      }
    } catch (err) {
      console.error("Create plan error:", err);
      return { 
        success: false, 
        message: err.response?.data?.message || err.message || "Failed to create plan" 
      };
    }
  };

  // Update plan in backend
  const updatePlanInBackend = async (planId, planData) => {
    try {
      const payload = {
        name: planData.name,
        duration_type: planData.duration_type,
        price: Number(planData.price),
        minutes_limit: planData.minutes_limit ? Number(planData.minutes_limit) : null,
        calls_limit: planData.calls_limit ? Number(planData.calls_limit) : null,
        call_enabled: planData.call_enabled,
        chat_enabled: planData.chat_enabled
      };
      
      const response = await updatePlan(planId, payload);
      
      if (response?.success) {
        return { success: true, data: response.data };
      } else {
        throw new Error(response?.message || "Failed to update plan");
      }
    } catch (err) {
      console.error("Update plan error:", err);
      return { 
        success: false, 
        message: err.response?.data?.message || err.message || "Failed to update plan" 
      };
    }
  };

  // Handle add/update plan
  const handleAddPlan = async () => {
    if (!planForm.name || !planForm.price) {
      toast.error("Please fill plan name and price");
      return;
    }

    setSavingPlans(true);
    
    let result;
    if (editingPlan !== null) {
      // Update existing plan
      const planId = subscriptionPlans[editingPlan].id;
      result = await updatePlanInBackend(planId, planForm);
    } else {
      // Create new plan
      result = await savePlanToBackend(planForm);
    }
    
    setSavingPlans(false);
    
    if (result.success) {
      // Reload plans from backend
      const plansRes = await getPlans(expertData.expertId);
      if (plansRes?.data && Array.isArray(plansRes.data)) {
        setSubscriptionPlans(plansRes.data);
        // Ensure subscription mode is selected
        if (!selectedModes.includes("subscription")) {
          setSelectedModes(prev => [...prev, "subscription"]);
        }
      }
      toast.success(editingPlan !== null ? "Plan updated successfully" : "Plan added successfully");
      resetPlanForm();
    } else {
      toast.error(result.message);
    }
  };

  const handleEditPlan = (index) => {
    setEditingPlan(index);
    setPlanForm({
      name: subscriptionPlans[index].name,
      duration_type: subscriptionPlans[index].duration_type,
      price: subscriptionPlans[index].price.toString(),
      minutes_limit: subscriptionPlans[index].minutes_limit?.toString() || "",
      calls_limit: subscriptionPlans[index].calls_limit?.toString() || "",
      call_enabled: subscriptionPlans[index].call_enabled,
      chat_enabled: subscriptionPlans[index].chat_enabled
    });
    setShowPlanForm(true);
  };

  const handleRemovePlan = async (index) => {
    const plan = subscriptionPlans[index];
    if (window.confirm(`Are you sure you want to remove "${plan.name}" plan?`)) {
      setDeletingPlan(true);
      try {
        const response = await deletePlan(plan.id);
        if (response?.success) {
          // Reload plans from backend
          const plansRes = await getPlans(expertData.expertId);
          if (plansRes?.data && Array.isArray(plansRes.data)) {
            setSubscriptionPlans(plansRes.data);
            // If no plans left, remove subscription mode
            if (plansRes.data.length === 0) {
              setSelectedModes(prev => prev.filter(m => m !== "subscription"));
            }
          }
          toast.success("Plan removed successfully");
        } else {
          throw new Error(response?.message || "Failed to delete plan");
        }
      } catch (err) {
        toast.error(err.message || "Failed to delete plan");
      } finally {
        setDeletingPlan(false);
      }
    }
  };

  const resetPlanForm = () => {
    setPlanForm({
      name: "",
      duration_type: "monthly",
      price: "",
      minutes_limit: "",
      calls_limit: "",
      call_enabled: true,
      chat_enabled: true
    });
    setEditingPlan(null);
    setShowPlanForm(false);
  };

  // Check if form is ready for submission
  const canFinish = () => {
    const nonSubscriptionModes = selectedModes.filter(m => m !== "subscription");
    
    let isValid = true;
    
    // If only subscription is selected, no need to validate pricing fields
    if (nonSubscriptionModes.length === 0 && selectedModes.includes("subscription")) {
      isValid = subscriptionPlans.length > 0;
    } else {
      // Validate other modes
      isValid = nonSubscriptionModes.length > 0 && reasonForPrice.trim().length > 0;
      
      if (nonSubscriptionModes.includes("per_minute")) {
        isValid = isValid && Number(pricePerMinute) >= 10 && Number(chatPrice) >= 5;
      }
      
      if (nonSubscriptionModes.includes("session")) {
        isValid = isValid && Number(sessionPrice) >= 50 && Number(sessionDuration) >= 1;
      }
    }
    
    return isValid && !saving && !savingPlans && !deletingPlan;
  };

  // Submit handler for pricing (ONLY per_minute and session)
  const handleSubmit = async () => {
    if (!validateForm() || saving) return;

    try {
      // Filter out subscription from pricing_modes
      const nonSubscriptionModes = selectedModes.filter(m => m !== "subscription");

      // ✅ Save pricing ONLY if there are non-subscription modes
      if (nonSubscriptionModes.length > 0) {
        const payload = {
          pricing_modes: nonSubscriptionModes,
          reason_for_price: reasonForPrice.trim(),
          handle_customer: handleCustomer.trim(),
          strength: strength.trim(),
          weakness: weakness.trim()
        };

        // Add per-minute pricing if enabled
        if (nonSubscriptionModes.includes("per_minute")) {
          payload.call_per_minute = Number(pricePerMinute);
          payload.chat_per_minute = Number(chatPrice);
        }

        // Add session pricing if enabled
        if (nonSubscriptionModes.includes("session")) {
          payload.session_price = Number(sessionPrice);
          payload.session_duration = Number(sessionDuration);
        }

const res = await savePrice(payload);

console.log("SAVE PRICE RESPONSE 👉", res);

// ✅ handle both wrapped + unwrapped cases
const isSuccess =
  res?.success === true || // if full response
  res?.pricing_modes !== undefined; // if unwrapped

if (!isSuccess) {
  const message =
    res?.message ||
    res?.data?.message ||
    "Failed to save pricing";

  toast.error(message);
  throw new Error(message);
}
      }

      toast.success("Pricing saved successfully! 🎉");
      
      // Navigate to completion
      navigate(`/expert/register?completed=1&email=${expertData.email}`);

    } catch (err) {
      console.error("Pricing API failed:", err);
      toast.error(err.message || "Failed to save pricing. Please try again.");
      
      // Parse backend error response
      if (err.response?.data?.message) {
        setBackendErrors({ api: err.response.data.message });
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
      subtitle="Choose how you want to earn. You can select multiple pricing methods."
      step={5}
      hasNavbar={true}
    >
      {(saving || savingPlans || deletingPlan) && <Loader />}

      {/* Backend Error Display */}
      {backendErrors.api && (
        <ValidationSummary style={{ marginBottom: 20, background: "#fee2e2", borderLeftColor: "#ef4444" }}>
          <div style={{ color: "#ef4444", fontWeight: 600 }}>
            ⚠️ Server Error: {backendErrors.api}
          </div>
        </ValidationSummary>
      )}

      {/* Smart Pricing Button */}
      <FullRow style={{ marginBottom: 32 }}>
        <PrimaryButton
          style={{
            background: "rgba(14,165,233,0.1)",
            color: "#0ea5ff",
            border: "2px solid rgba(14,165,233,0.2)"
          }}
          onClick={handleSmartPricing}
          disabled={saving || savingPlans || deletingPlan}
        >
          💡 Suggest My Pricing
        </PrimaryButton>
      </FullRow>

      {/* Pricing Methods Selection */}
      <SectionCard style={{ marginBottom: 24 }}>
        <SectionTitle>Select Pricing Methods</SectionTitle>
        <CheckboxGroup>
          <CheckboxLabel>
            <CheckboxInput
              type="checkbox"
              checked={selectedModes.includes("per_minute")}
              onChange={() => handleModeToggle("per_minute")}
              disabled={saving || savingPlans || deletingPlan}
            />
            ⏱️ Per Minute Pricing - Earn by the minute for calls & chats
          </CheckboxLabel>
          
          <CheckboxLabel>
            <CheckboxInput
              type="checkbox"
              checked={selectedModes.includes("session")}
              onChange={() => handleModeToggle("session")}
              disabled={saving || savingPlans || deletingPlan}
            />
            📦 Session Pricing - Fixed price for a session duration
          </CheckboxLabel>
          
          <CheckboxLabel>
            <CheckboxInput
              type="checkbox"
              checked={selectedModes.includes("subscription")}
              onChange={() => handleModeToggle("subscription")}
              disabled={saving || savingPlans || deletingPlan}
            />
            🔄 Subscription Plans - Monthly/Quarterly/Yearly subscription packages
          </CheckboxLabel>
        </CheckboxGroup>
        {validationErrors.modes && (
          <small style={{ color: "#ef4444", fontSize: 12, marginTop: 8, display: "block" }}>
            {validationErrors.modes}
          </small>
        )}
      </SectionCard>

      {/* Per Minute Pricing Section */}
      {selectedModes.includes("per_minute") && (
        <SectionCard style={{ marginBottom: 24 }}>
          <SectionTitle>⏱️ Per Minute Pricing</SectionTitle>
          <FullRow style={{ marginBottom: 16 }}>
            <Field style={{ flex: 1, marginRight: 16 }}>
              <Label>Call Rate <span style={{ color: "#ef4444" }}>*</span></Label>
              <PriceInputRow>
                <Input
                  type="number"
                  min="10"
                  max="10000"
                  step="5"
                  value={pricePerMinute}
                  onChange={e => setPricePerMinute(e.target.value)}
                  placeholder="50"
                  disabled={saving || savingPlans || deletingPlan}
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
                  max="10000"
                  step="5"
                  value={chatPrice}
                  onChange={e => setChatPrice(e.target.value)}
                  placeholder="15"
                  disabled={saving || savingPlans || deletingPlan}
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
        </SectionCard>
      )}

      {/* Session Pricing Section */}
      {selectedModes.includes("session") && (
        <SectionCard style={{ marginBottom: 24 }}>
          <SectionTitle>📦 Session Pricing</SectionTitle>
          <FullRow style={{ marginBottom: 16 }}>
            <Field style={{ flex: 1, marginRight: 16 }}>
              <Label>Session Price <span style={{ color: "#ef4444" }}>*</span></Label>
              <PriceInputRow>
                <Input
                  type="number"
                  min="50"
                  max="100000"
                  step="50"
                  value={sessionPrice}
                  onChange={e => setSessionPrice(e.target.value)}
                  placeholder="500"
                  disabled={saving || savingPlans || deletingPlan}
                />
                <span style={{ color: "#64748b" }}>₹ per session</span>
              </PriceInputRow>
              {validationErrors.session && (
                <small style={{ color: "#ef4444", fontSize: 12, marginTop: 4, display: "block" }}>
                  {validationErrors.session}
                </small>
              )}
            </Field>

            <Field style={{ flex: 1 }}>
              <Label>Session Duration <span style={{ color: "#ef4444" }}>*</span></Label>
              <PriceInputRow>
                <Input
                  type="number"
                  min="1"
                  max="480"
                  step="5"
                  value={sessionDuration}
                  onChange={e => setSessionDuration(e.target.value)}
                  placeholder="30"
                  disabled={saving || savingPlans || deletingPlan}
                />
                <span style={{ color: "#64748b" }}>minutes</span>
              </PriceInputRow>
              {validationErrors.sessionDuration && (
                <small style={{ color: "#ef4444", fontSize: 12, marginTop: 4, display: "block" }}>
                  {validationErrors.sessionDuration}
                </small>
              )}
            </Field>
          </FullRow>
          <small style={{ color: "#64748b", fontSize: 12 }}>
            💡 Session can be used for both calls and chats
          </small>
        </SectionCard>
      )}

      {/* Subscription Plans Section */}
      {selectedModes.includes("subscription") && (
        <SectionCard style={{ marginBottom: 24 }}>
          <SectionTitle>🔄 Subscription Plans</SectionTitle>
          
          {subscriptionPlans.length > 0 && (
            <PlansGrid>
              {subscriptionPlans.map((plan, index) => (
                <PlanCard key={plan.id || index}>
                  <PlanHeader>
                    <PlanName>{plan.name}</PlanName>
                    <div style={{ display: "flex", gap: 8 }}>
                      <EditButton onClick={() => handleEditPlan(index)}>✎</EditButton>
                      <RemoveButton onClick={() => handleRemovePlan(index)}>✕</RemoveButton>
                    </div>
                  </PlanHeader>
                  <PlanPrice>₹{plan.price}</PlanPrice>
                  <PlanDetails>
                    <div>📅 {plan.duration_type?.replace('_', ' ') || 'Monthly'}</div>
                    {plan.minutes_limit && <div>⏱️ {plan.minutes_limit} mins limit</div>}
                    {plan.calls_limit && <div>📞 {plan.calls_limit} calls limit</div>}
                    <div>
                      {plan.call_enabled && '📞 Call '}
                      {plan.call_enabled && plan.chat_enabled && '• '}
                      {plan.chat_enabled && '💬 Chat'}
                    </div>
                  </PlanDetails>
                </PlanCard>
              ))}
            </PlansGrid>
          )}

          {!showPlanForm ? (
            <AddPlanButton onClick={() => setShowPlanForm(true)} disabled={saving || savingPlans || deletingPlan}>
              + Add Subscription Plan
            </AddPlanButton>
          ) : (
            <div style={{ marginTop: 16, padding: 16, background: "#f8fafc", borderRadius: 12 }}>
              <h4 style={{ margin: "0 0 16px 0" }}>
                {editingPlan !== null ? "Edit Plan" : "Add New Plan"}
              </h4>
              
              <Field style={{ marginBottom: 12 }}>
                <Label>Plan Name *</Label>
                <Input
                  value={planForm.name}
                  onChange={e => setPlanForm({ ...planForm, name: e.target.value })}
                  placeholder="e.g., Basic, Premium, Pro"
                  disabled={saving || savingPlans || deletingPlan}
                />
              </Field>

              <Field style={{ marginBottom: 12 }}>
                <Label>Duration Type *</Label>
                <select
                  value={planForm.duration_type}
                  onChange={e => setPlanForm({ ...planForm, duration_type: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    fontSize: 14
                  }}
                  disabled={saving || savingPlans || deletingPlan}
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly (3 months)</option>
                  <option value="half_yearly">Half Yearly (6 months)</option>
                  <option value="yearly">Yearly (12 months)</option>
                </select>
              </Field>

              <Field style={{ marginBottom: 12 }}>
                <Label>Price * (₹)</Label>
                <Input
                  type="number"
                  value={planForm.price}
                  onChange={e => setPlanForm({ ...planForm, price: e.target.value })}
                  placeholder="999"
                  disabled={saving || savingPlans || deletingPlan}
                />
              </Field>

              <Field style={{ marginBottom: 12 }}>
                <Label>Minutes Limit (Optional)</Label>
                <Input
                  type="number"
                  value={planForm.minutes_limit}
                  onChange={e => setPlanForm({ ...planForm, minutes_limit: e.target.value })}
                  placeholder="Unlimited if empty"
                  disabled={saving || savingPlans || deletingPlan}
                />
                <small style={{ color: "#64748b", fontSize: 11 }}>Total minutes available in this plan</small>
              </Field>

              <Field style={{ marginBottom: 12 }}>
                <Label>Calls Limit (Optional)</Label>
                <Input
                  type="number"
                  value={planForm.calls_limit}
                  onChange={e => setPlanForm({ ...planForm, calls_limit: e.target.value })}
                  placeholder="Unlimited if empty"
                  disabled={saving || savingPlans || deletingPlan}
                />
                <small style={{ color: "#64748b", fontSize: 11 }}>Number of calls allowed</small>
              </Field>

              <CheckboxGroup style={{ marginBottom: 16 }}>
                <CheckboxLabel>
                  <CheckboxInput
                    type="checkbox"
                    checked={planForm.call_enabled}
                    onChange={e => setPlanForm({ ...planForm, call_enabled: e.target.checked })}
                    disabled={saving || savingPlans || deletingPlan}
                  />
                  Enable Call Support
                </CheckboxLabel>
                <CheckboxLabel>
                  <CheckboxInput
                    type="checkbox"
                    checked={planForm.chat_enabled}
                    onChange={e => setPlanForm({ ...planForm, chat_enabled: e.target.checked })}
                    disabled={saving || savingPlans || deletingPlan}
                  />
                  Enable Chat Support
                </CheckboxLabel>
              </CheckboxGroup>

              <div style={{ display: "flex", gap: 12 }}>
                <PrimaryButton 
                  onClick={handleAddPlan} 
                  disabled={saving || savingPlans || deletingPlan || creatingPlan || updatingPlan}
                >
                  {creatingPlan || updatingPlan ? "Saving..." : (editingPlan !== null ? "Update Plan" : "Add Plan")}
                </PrimaryButton>
                <SecondaryButton onClick={resetPlanForm} disabled={saving || savingPlans || deletingPlan}>
                  Cancel
                </SecondaryButton>
              </div>
            </div>
          )}
          
          {validationErrors.subscription && (
            <small style={{ color: "#ef4444", fontSize: 12, marginTop: 8, display: "block" }}>
              {validationErrors.subscription}
            </small>
          )}
        </SectionCard>
      )}

      {/* Smart Pricing Suggestion Card */}
      {suggested && (
        <SmartPricingCard style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>💡</span>
            <div>
              <strong>Smart Pricing Suggestion</strong>
              <p style={{ margin: "4px 0 0", fontSize: 14, color: "#10b981" }}>
                Based on your expertise: 
                {suggested.call && ` ₹${suggested.call}/min call`}
                {suggested.chat && ` | ₹${suggested.chat}/min chat`}
                {suggested.session && ` | ₹${suggested.session}/session`}
              </p>
            </div>
          </div>
        </SmartPricingCard>
      )}

      {/* Common Fields - Only show if there are non-subscription modes */}
      {selectedModes.filter(m => m !== "subscription").length > 0 && (
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
                disabled={saving || savingPlans || deletingPlan}
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
                disabled={saving || savingPlans || deletingPlan}
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
                disabled={saving || savingPlans || deletingPlan}
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
                disabled={saving || savingPlans || deletingPlan}
              />
              <CharacterCounter>{weakness.length}/200</CharacterCounter>
            </Field>
          </div>
        </PricingFieldsGrid>
      )}

      {/* Validation Summary */}
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

      {/* Success Preview */}
      {canFinish() && (
        <SuccessCard style={{ marginTop: 24, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>✅</span>
            <div>
              <strong>Ready to go live!</strong>
              <p style={{ margin: "4px 0 0", fontSize: 14, color: "#10b981" }}>
                {selectedModes.includes("per_minute") && `You'll earn ₹${Number(pricePerMinute)}/min for calls and ₹${Number(chatPrice)}/min for chats`}
                {selectedModes.includes("per_minute") && selectedModes.includes("session") && " • "}
                {selectedModes.includes("session") && `Sessions: ₹${Number(sessionPrice)} for ${Number(sessionDuration)} mins`}
                {selectedModes.includes("subscription") && subscriptionPlans.length > 0 && ` • ${subscriptionPlans.length} subscription plan(s) available`}
              </p>
            </div>
          </div>
        </SuccessCard>
      )}

      <ActionsRow style={{ marginTop: 32 }}>
        <SecondaryButton
          onClick={() => navigate("/expert/register/profile")}
          disabled={saving || savingPlans || deletingPlan}
        >
          ← Back to Profile
        </SecondaryButton>

        <PrimaryButton
          disabled={!canFinish() || saving || savingPlans || deletingPlan}
          onClick={handleSubmit}
        >
          {saving ? "Saving..." : "Complete Setup & Start →"}
        </PrimaryButton>
      </ActionsRow>
    </RegisterLayout>
  );
}