import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { useExpert } from "../../../../shared/context/ExpertContext";
import {
  getActiveMembershipPlansApi,
  createExpertPlanOrderApi,
  verifyExpertPlanPaymentApi,
  getExpertCurrentPlanApi
} from "../../../../shared/api/expertapi/expertMembershipPlan.api";
import { 
  FaCheckCircle, 
  FaCrown, 
  FaStar, 
  FaRocket, 
  FaGem,
  FaShieldAlt,
  FaTag
} from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

/* ================= ANIMATIONS ================= */
const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`;

/* ================= STYLED COMPONENTS ================= */
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 40px;
  padding: 30px 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #64748b;
`;

const DurationTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 40px;
  flex-wrap: wrap;
`;

const DurationTab = styled.button`
  padding: 12px 28px;
  border-radius: 50px;
  border: none;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.active ? "#6D28D9" : "white"};
  color: ${props => props.active ? "white" : "#64748b"};
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(109,40,217,0.2);
  }
`;

const DiscountChip = styled.span`
  position: absolute;
  top: -10px;
  right: -10px;
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  color: white;
  font-size: 10px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 20px;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const PlansWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  width: 100%;
`;

const PlansGrid = styled.div`
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 25px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  width: 100%;
  
  @media (min-width: 1024px) {
    > * {
      flex: 0 1 calc(33.333% - 25px);
      min-width: 300px;
      max-width: 380px;
    }
  }
  
  @media (min-width: 1400px) {
    > * {
      flex: 0 1 380px;
    }
  }
`;

const PlanCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(0,0,0,0.08);
  border: 2px solid ${props => {
    if (props.isCurrentPlan) return "#10b981";
    if (props.isPopular) return "#6D28D9";
    return "#e2e8f0";
  }};
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
  }
`;

const CurrentPlanBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: #10b981;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  z-index: 10;
`;

const PopularBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #6D28D9, #8b5cf6);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  z-index: 10;
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: linear-gradient(135deg, #f59e0b, #ea580c);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 800;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const CardHeader = styled.div`
  padding: 25px 20px;
  text-align: center;
  background: ${props => props.isCurrentPlan ? "#f0fdf4" : "white"};
  border-bottom: 1px solid #f1f5f9;
`;

const PlanIcon = styled.div`
  font-size: 40px;
  margin-bottom: 12px;
`;

const PlanName = styled.h3`
  font-size: 22px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 8px;
`;

const PlanDuration = styled.div`
  font-size: 13px;
  color: #64748b;
  margin-bottom: 15px;
`;

const PriceContainer = styled.div`
  margin-top: 10px;
`;

const OriginalPrice = styled.div`
  font-size: 14px;
  color: #94a3b8;
  text-decoration: line-through;
  margin-bottom: 5px;
`;

const CurrentPrice = styled.div`
  font-size: 36px;
  font-weight: 900;
  color: #0f172a;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  
  span {
    font-size: 14px;
    font-weight: 600;
    color: #64748b;
  }
`;

const SavingsText = styled.div`
  font-size: 12px;
  color: #10b981;
  font-weight: 700;
  margin-top: 6px;
`;

const CardBody = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const FeatureList = styled.div`
  margin-bottom: 25px;
  flex: 1;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  color: #334155;
  font-size: 13px;
  
  svg {
    color: #10b981;
    font-size: 14px;
    flex-shrink: 0;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: none;
  font-size: 14px;
  font-weight: 700;
  cursor: ${props => props.disabled ? "not-allowed" : "pointer"};
  transition: all 0.3s ease;
  background: ${props => {
    if (props.disabled) return "#e2e8f0";
    return "linear-gradient(135deg, #6D28D9, #8b5cf6)";
  }};
  color: ${props => props.disabled ? "#94a3b8" : "white"};
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  &:hover {
    transform: ${props => props.disabled ? "none" : "translateY(-2px)"};
  }
`;

const NoPlansCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  
  svg {
    font-size: 60px;
    color: #cbd5e1;
    margin-bottom: 15px;
  }
  
  h3 {
    font-size: 18px;
    color: #64748b;
    margin-bottom: 8px;
  }
  
  p {
    color: #94a3b8;
    font-size: 14px;
  }
`;

const CurrentPlanAlert = styled.div`
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  border-radius: 16px;
  padding: 15px 20px;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  border: 1px solid #86efac;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 25px;
  width: 90%;
  max-width: 400px;
`;

const BillDetails = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 15px;
  margin: 15px 0;
`;

const BillRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  
  &.total {
    border-top: 1px solid #e2e8f0;
    margin-top: 8px;
    padding-top: 12px;
    font-weight: 800;
    font-size: 16px;
  }
`;

/* ================= FEATURES MAPPING ================= */
const getPlanFeatures = (planName) => {
  const name = planName.toLowerCase();
  
  if (name.includes("standard")) {
    return [
      "Professional Listing",
      "Call & Chat Integration",
      "Service Catalogue",
      "Basic Analytics",
      "Email Support"
    ];
  }
  
  if (name.includes("advanced")) {
    return [
      "Priority Professional Listing",
      "Unlimited Sales & Products",
      "Marketing Post Creator",
      "Advanced Analytics",
      "Priority Chat Support",
      "Verified Trust Seal"
    ];
  }
  
  if (name.includes("premium") || name.includes("elite")) {
    return [
      "Top Featured Listing",
      "Unlimited Everything",
      "Dedicated Account Manager",
      "Marketing Campaign Access",
      "Premium Support 24/7",
      "API Access",
      "Custom Branding"
    ];
  }
  
  return [
    "Professional Listing",
    "Basic Support",
    "Standard Analytics",
    "Email Support"
  ];
};

const getPlanIcon = (planName) => {
  const name = planName.toLowerCase();
  if (name.includes("standard")) return <FaStar color="#8b5cf6" />;
  if (name.includes("advanced")) return <FaRocket color="#f59e0b" />;
  if (name.includes("premium") || name.includes("elite")) return <FaGem color="#ec4899" />;
  return <FaShieldAlt color="#6D28D9" />;
};

// Calculate visual discount (only for display - NOT for actual pricing)
const getVisualDiscountPercentage = (duration) => {
  if (duration === 2) return 15;
  if (duration === 3) return 25;
  return 0;
};

// Calculate visual original price (only for strikethrough display)
const getVisualOriginalPrice = (backendAmount, duration) => {
  if (duration === 1) return null;
  const discountPercent = getVisualDiscountPercentage(duration);
  // Calculate what original price would be to show X% discount
  const originalPrice = Math.round(backendAmount / (1 - discountPercent / 100));
  return originalPrice;
};

/* ================= MAIN COMPONENT ================= */
export default function SubscriptionPlan() {
  const navigate = useNavigate();
  const { expertData, updateExpertData } = useExpert();
  const [allPlans, setAllPlans] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSdkReady, setIsSdkReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const expertId = expertData?.expertId || JSON.parse(localStorage.getItem("expert_user"))?.expertId;
  const expertRaw = expertData || JSON.parse(localStorage.getItem("expert_user")) || {};

  const availableDurations = [...new Set(allPlans.map(plan => plan.duration_years))].sort((a, b) => a - b);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setIsSdkReady(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    loadPlans();
    loadCurrentPlan();
  }, []);

  const loadPlans = async () => {
    try {
      const res = await getActiveMembershipPlansApi();
      if (res.data.success) {
        setAllPlans(res.data.data);
        if (res.data.data.length > 0) {
          const durations = [...new Set(res.data.data.map(p => p.duration_years))];
          if (durations.length > 0) {
            setSelectedDuration(durations[0]);
          }
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load plans");
    }
  };

  const loadCurrentPlan = async () => {
    try {
      const res = await getExpertCurrentPlanApi(expertId);
      if (res.data.success && res.data.data) {
        setCurrentPlan(res.data.data);
      }
    } catch (err) {
      console.log("No active plan");
    }
  };

  const filteredPlans = allPlans.filter(plan => plan.duration_years === selectedDuration);

  const handlePurchase = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleRazorpay = async () => {
    if (!selectedPlan) return;
    
    try {
      if (!window.Razorpay || !isSdkReady) {
        toast.error("Initializing Razorpay...");
        return;
      }

      setLoading(true);

      // Use REAL backend amount - no discount calculation
      const orderRes = await createExpertPlanOrderApi({
        plan_id: selectedPlan.id,
        duration_years: selectedDuration,
        amount: Math.round(selectedPlan.amount) // Backend amount
      });

      const orderData = orderRes.data;

      const options = {
        key: orderData.key_id,
        order_id: orderData.order_id,
        amount: Math.round(orderData.amount * 100),
        currency: "INR",
        name: "G9Expert",
        description: `${selectedPlan.plan_name} - ${selectedDuration} Year(s)`,
        handler: async function(response) {
          try {
            const verifyRes = await verifyExpertPlanPaymentApi({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data.success) {
              updateExpertData({ isSubscribed: 1 });
              toast.success("Payment successful! Redirecting...");
              setTimeout(() => navigate("/expert/register/category"), 1500);
            }
          } catch(err) {
            toast.error(err.response?.data?.message || "Payment verification failed");
          } finally {
            setLoading(false);
            setIsModalOpen(false);
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

    } catch(err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create order");
      setLoading(false);
    }
  };

  const isCurrentPlan = (plan) => {
    return currentPlan && 
           currentPlan.plan_name === plan.plan_name && 
           currentPlan.duration_years === plan.duration_years;
  };

  const showPopularBadge = (plan) => {
    return !isCurrentPlan(plan) && plan.plan_name.toLowerCase().includes("advanced");
  };

  // Get display price info (visual only - backend amount is real)
  const getDisplayPriceInfo = (plan) => {
    const backendAmount = plan.amount;
    
    if (selectedDuration === 1) {
      return { 
        current: backendAmount, 
        original: null, 
        discount: 0 
      };
    }
    
    const discountPercent = getVisualDiscountPercentage(selectedDuration);
    const visualOriginalPrice = getVisualOriginalPrice(backendAmount, selectedDuration);
    
    return { 
      current: backendAmount,  // Always show backend amount as payable
      original: visualOriginalPrice,  // Visual strikethrough only
      discount: discountPercent,
      savings: visualOriginalPrice ? visualOriginalPrice - backendAmount : 0
    };
  };

  const gst = selectedPlan ? selectedPlan.amount * 0.18 : 0;
  const totalWithTax = selectedPlan ? selectedPlan.amount + gst : 0;

  return (
    <Container>
      <Toaster position="top-right" />
      
      <HeroSection>
        <Title>Choose Your Success Path</Title>
        <Subtitle>Select a plan that matches your business goals</Subtitle>
      </HeroSection>

      {currentPlan && (
        <CurrentPlanAlert>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <FaCrown size={20} color="#15803d" />
            <div>
              <strong>Currently Subscribed:</strong> {currentPlan.plan_name} • {currentPlan.duration_years} Year(s)
            </div>
          </div>
          <div style={{ fontSize: "13px" }}>
            Expires: {new Date(currentPlan.expiry_date).toLocaleDateString()}
          </div>
        </CurrentPlanAlert>
      )}

      {availableDurations.length > 0 && (
        <DurationTabs>
          {availableDurations.map(duration => {
            const discount = getVisualDiscountPercentage(duration);
            return (
              <DurationTab
                key={duration}
                active={selectedDuration === duration}
                onClick={() => setSelectedDuration(duration)}
              >
                {duration} Year{duration > 1 ? 's' : ''}
                {discount > 0 && <DiscountChip>-{discount}% OFF</DiscountChip>}
              </DurationTab>
            );
          })}
        </DurationTabs>
      )}

      <PlansWrapper>
        <PlansGrid>
          {filteredPlans.length === 0 ? (
            <NoPlansCard>
              <FaShieldAlt />
              <h3>No Plans Available</h3>
              <p>No subscription plans found for {selectedDuration} year{selectedDuration > 1 ? 's' : ''}</p>
              <p style={{ marginTop: 8, fontSize: 12 }}>Please check other durations</p>
            </NoPlansCard>
          ) : (
            filteredPlans.map((plan) => {
              const isCurrent = isCurrentPlan(plan);
              const showPopular = showPopularBadge(plan);
              const features = getPlanFeatures(plan.plan_name);
              const priceInfo = getDisplayPriceInfo(plan);
              
              return (
                <PlanCard key={plan.id} isCurrentPlan={isCurrent} isPopular={showPopular}>
                  {isCurrent && <CurrentPlanBadge>✓ CURRENT PLAN</CurrentPlanBadge>}
                  {showPopular && !isCurrent && <PopularBadge>🔥 MOST POPULAR</PopularBadge>}
                  {priceInfo.discount > 0 && !isCurrent && (
                    <DiscountBadge>
                      <FaTag size={10} /> UP TO {priceInfo.discount}% OFF
                    </DiscountBadge>
                  )}
                  
                  <CardHeader isCurrentPlan={isCurrent}>
                    <PlanIcon>{getPlanIcon(plan.plan_name)}</PlanIcon>
                    <PlanName>{plan.plan_name}</PlanName>
                    <PlanDuration>{plan.duration_years} Year{plan.duration_years > 1 ? 's' : ''} Plan</PlanDuration>
                    <PriceContainer>
                      {priceInfo.original && (
                        <OriginalPrice>₹{priceInfo.original.toLocaleString()}</OriginalPrice>
                      )}
                      <CurrentPrice>
                        ₹{priceInfo.current.toLocaleString()}
                        <span>/ total</span>
                      </CurrentPrice>
                      {priceInfo.savings > 0 && (
                        <SavingsText>✨ You save ₹{priceInfo.savings.toLocaleString()}</SavingsText>
                      )}
                    </PriceContainer>
                  </CardHeader>
                  
                  <CardBody>
                    <FeatureList>
                      {features.map((feature, idx) => (
                        <FeatureItem key={idx}>
                          <FaCheckCircle />
                          <span>{feature}</span>
                        </FeatureItem>
                      ))}
                    </FeatureList>
                    
                    <ActionButton
                      disabled={isCurrent}
                      onClick={() => handlePurchase(plan)}
                    >
                      {isCurrent ? "✓ Currently Active" : `Get ${plan.plan_name} →`}
                    </ActionButton>
                  </CardBody>
                </PlanCard>
              );
            })
          )}
        </PlansGrid>
      </PlansWrapper>

      {isModalOpen && selectedPlan && (
        <Modal onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: 5, textAlign: "center" }}>Confirm Purchase</h3>
            <p style={{ textAlign: "center", color: "#64748b", fontSize: "14px", marginBottom: 15 }}>
              {selectedPlan.plan_name} • {selectedDuration} Year{selectedDuration > 1 ? 's' : ''}
            </p>
            
            <BillDetails>
              {selectedDuration > 1 && getVisualDiscountPercentage(selectedDuration) > 0 && (
                <BillRow>
                  <span>Original Price (Visual)</span>
                  <strong style={{ textDecoration: "line-through", color: "#94a3b8" }}>
                    ₹{getVisualOriginalPrice(selectedPlan.amount, selectedDuration)?.toLocaleString()}
                  </strong>
                </BillRow>
              )}
              <BillRow>
                <span>Plan Amount</span>
                <strong>₹{selectedPlan.amount.toLocaleString()}</strong>
              </BillRow>
              <BillRow>
                <span>GST (18%)</span>
                <strong>₹{gst.toFixed(2)}</strong>
              </BillRow>
              <BillRow className="total">
                <span>Total Payable</span>
                <strong style={{ color: "#6D28D9" }}>₹{totalWithTax.toFixed(2)}</strong>
              </BillRow>
            </BillDetails>
            
            <ActionButton
              onClick={handleRazorpay}
              disabled={loading || !isSdkReady}
              style={{ marginTop: 0 }}
            >
              {loading ? "Processing..." : `Pay ₹${totalWithTax.toFixed(2)}`}
            </ActionButton>
            
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                width: "100%",
                marginTop: 12,
                padding: 10,
                background: "none",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500
              }}
            >
              Cancel
            </button>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}