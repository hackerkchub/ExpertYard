import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import RegisterLayout from "../../components/RegisterLayout";
import { PrimaryButton, ActionsRow } from "../../styles/Register.styles";
import { useExpert } from "../../../../shared/context/ExpertContext";

/* ================= STYLED COMPONENTS (PRESERVED) ================= */
const DurationToggle = styled.div`
  display: flex; justify-content: center; gap: 10px; margin: 0 auto 20px auto;
  background: #f1f5f9; padding: 6px; border-radius: 12px; width: fit-content; border: 1px solid #e2e8f0;
`;

const ToggleBtn = styled.button`
  padding: 10px 22px; border-radius: 10px; border: none; font-size: 16px; 
  font-weight: 700; cursor: pointer; transition: 0.3s;
  background: ${props => props.active ? "#6D28D9" : "transparent"};
  color: ${props => props.active ? "#fff" : "#64748b"};
  box-shadow: ${props => props.active ? "0 4px 10px rgba(109, 40, 217, 0.2)" : "none"};
`;

const PlanGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const PlanCard = styled.div`
  border: ${props => props.active ? "3px solid #6D28D9" : "2px solid #e2e8f0"};
  border-radius: 18px; padding: 20px 25px; cursor: pointer; background: #fff;
  position: relative; display: flex; flex-direction: column; transition: all 0.2s ease;
  &:hover { border-color: #6D28D9; }
`;

const Badge = styled.div`
  position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
  background: #6D28D9; color: #fff; padding: 4px 16px; border-radius: 20px;
  font-size: 11px; font-weight: 800; text-transform: uppercase; white-space: nowrap;
`;

const PlanTitle = styled.h3` margin: 0 0 5px 0; font-size: 22px; color: #0f172a; font-weight: 800; `;

const MainPrice = styled.div`
  font-size: 38px; font-weight: 900; color: #1e293b; display: flex; align-items: baseline; gap: 6px;
  span { font-size: 16px; color: #64748b; font-weight: 600; }
`;

const SavingsLabel = styled.div`
  background: #dcfce7; color: #15803d; padding: 2px 10px; border-radius: 6px;
  font-size: 14px; font-weight: 700; display: inline-block; margin-top: 4px;
`;

const FeatureList = styled.ul`
  padding: 0; margin: 12px 0; list-style: none; border-top: 1px solid #f1f5f9;
  padding-top: 15px; flex-grow: 1;
`;

const FeatureItem = styled.li`
  margin-bottom: 10px; display: flex; align-items: flex-start; font-size: 15px;
  color: ${props => props.disabled ? "#cbd5e1" : "#334155"};
  line-height: 1.4; font-weight: 500;
  svg { margin-right: 12px; margin-top: 3px; color: ${props => props.disabled ? "#cbd5e1" : "#10b981"}; flex-shrink: 0; }
`;

const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000;
`;

const ModalContent = styled.div`
  background: white; padding: 30px; border-radius: 20px; width: 90%; max-width: 400px; text-align: center;
`;

const BillRow = styled.div`
  display: flex; justify-content: space-between; margin: 10px 0; font-size: 15px;
  &.total { font-weight: 800; font-size: 18px; border-top: 1px solid #eee; padding-top: 10px; margin-top: 15px; }
`;

/* ================= MAIN COMPONENT ================= */

export default function SubscriptionPlan() {
  const navigate = useNavigate();
  const { expertData } = useExpert(); // Get expert context
  const [years, setYears] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState("advanced");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. Expert ID Logic: Try context first, then localStorage
  const expertId = expertData?.expertId || JSON.parse(localStorage.getItem("expert_user"))?.expertId;
  const expertRaw = expertData || JSON.parse(localStorage.getItem("expert_user")) || {};

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsSdkReady(true);
    document.body.appendChild(script);
  }, []);

  const baseStandard = 2999;
  const baseAdvanced = 4999;

  const calculateTotal = (base) => {
    if (years === 1) return base;
    if (years === 2) return Math.round((base * 2) * 0.8); 
    if (years === 3) return Math.round((base * 3) * 0.7); 
    return base;
  };

  const amountToPay = selectedPlan === "standard" ? calculateTotal(baseStandard) : calculateTotal(baseAdvanced);
  const gst = amountToPay * 0.18;
  const totalWithTax = amountToPay + gst;

  const handleRazorpay = async () => {
    if (!window.Razorpay || !isSdkReady) return alert("Initializing Razorpay...");
    if (!expertId) return alert("Expert ID missing. Please login or register again.");
    
    setLoading(true);

    const options = {
      key: "rzp_test_RZ9SA1VOWXjQBJ", 
      amount: Math.round(totalWithTax * 100),
      currency: "INR",
      name: "ExpertYard",
      description: `${selectedPlan.toUpperCase()} Growth - ${years} Year(s)`,
      handler: async function (response) {
        try {
          // 2. Updated Payload based on your requirement
          const payload = {
            expert_id: expertId,
            amount: amountToPay,
            planName: selectedPlan,
            durationYears: years,
            paymentId: response.razorpay_payment_id, // As per your sample JSON
            totalWithTax: parseFloat(totalWithTax.toFixed(2))
          };

          // 3. API call to activate
          const res = await axios.post("https://softmaxs.com/api/expert-plan/activate", payload);

          if (res.data.success) {
            alert("Plan Activated Successfully!");
            setIsModalOpen(false);
            // 4. Redirect to Category Page
            navigate("/expert/register/category");
          } else {
            alert(res.data.message || "Activation failed.");
          }
        } catch (err) {
          console.error("Backend Sync Error:", err);
          alert(err.response?.data?.message || "Payment success but server sync failed.");
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: expertRaw.name || "",
        email: expertRaw.email || "",
        contact: expertRaw.phone || ""
      },
      theme: { color: "#6D28D9" },
      modal: { ondismiss: () => setLoading(false) }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <RegisterLayout 
      title="Scale Your Professional Business" 
      subtitle="Choose the Advanced Growth plan to unlock maximum exposure" 
      step={1.5}
    >
      
      <DurationToggle>
        <ToggleBtn active={years === 1} onClick={() => setYears(1)}>1 Year</ToggleBtn>
        <ToggleBtn active={years === 2} onClick={() => setYears(2)}>2 Yrs (-20%)</ToggleBtn>
        <ToggleBtn active={years === 3} onClick={() => setYears(3)}>3 Yrs (-30%)</ToggleBtn>
      </DurationToggle>

      <PlanGrid>
        <PlanCard active={selectedPlan === "standard"} onClick={() => setSelectedPlan("standard")}>
          <PlanTitle>Standard</PlanTitle>
          <MainPrice>₹{calculateTotal(baseStandard).toLocaleString()} <span>/{years} Yr</span></MainPrice>
          {years > 1 && <SavingsLabel>Loyalty Applied</SavingsLabel>}
          <FeatureList>
            <FeatureItem><CheckIcon /> Professional Listing</FeatureItem>
            <FeatureItem><CheckIcon /> Call & Chat Integration</FeatureItem>
            <FeatureItem><CheckIcon /> Service Catalogue</FeatureItem>
            <FeatureItem disabled><CheckIcon /> Marketing Post Creator</FeatureItem>
          </FeatureList>
        </PlanCard>

        <PlanCard active={selectedPlan === "advanced"} onClick={() => setSelectedPlan("advanced")}>
          <Badge>Best Growth</Badge>
          <PlanTitle>Advanced</PlanTitle>
          <MainPrice>₹{calculateTotal(baseAdvanced).toLocaleString()} <span>/{years} Yr</span></MainPrice>
          <SavingsLabel>{years === 1 ? 'Recommended' : 'Max Value'}</SavingsLabel>
          <FeatureList>
            <FeatureItem><strong><CheckIcon /> Professional Listing (Priority)</strong></FeatureItem>
            <FeatureItem><strong><CheckIcon /> Unlimited Sales & Products</strong></FeatureItem>
            <FeatureItem><strong><CheckIcon /> Marketing Post Creator</strong></FeatureItem>
            <FeatureItem><CheckIcon /> Verified Trust Seal</FeatureItem>
          </FeatureList>
        </PlanCard>
      </PlanGrid>

      <ActionsRow style={{ marginTop: '0' }}>
        <PrimaryButton onClick={() => setIsModalOpen(true)} style={{ width: '100%', fontSize: '20px', padding: '16px' }}>
          Activate {selectedPlan.toUpperCase()} Growth →
        </PrimaryButton>
      </ActionsRow>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <h2 style={{ marginBottom: '10px' }}>Confirm Payment</h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>{selectedPlan.toUpperCase()} Plan - {years} Year(s)</p>
            <div style={{ margin: '20px 0', textAlign: 'left', background: '#f8fafc', padding: '15px', borderRadius: '12px' }}>
              <BillRow><span>Plan Price</span><strong>₹{amountToPay.toLocaleString()}</strong></BillRow>
              <BillRow><span>GST (18%)</span><strong>₹{gst.toFixed(2)}</strong></BillRow>
              <BillRow className="total"><span>Total Payable</span><strong>₹{totalWithTax.toFixed(2)}</strong></BillRow>
            </div>
            <PrimaryButton disabled={loading || !isSdkReady} onClick={handleRazorpay} style={{ width: '100%' }}>
              {loading ? "Processing..." : "Pay Now via Razorpay"}
            </PrimaryButton>
            <button 
              onClick={() => setIsModalOpen(false)} 
              style={{ background: 'none', border: 'none', color: '#94a3b8', marginTop: '15px', cursor: 'pointer', fontWeight: '600' }}
            >
              Cancel
            </button>
          </ModalContent>
        </ModalOverlay>
      )}
    </RegisterLayout>
  );
}

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);