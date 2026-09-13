import React, { useState, useEffect } from "react";
import { FiX, FiLock } from "react-icons/fi";
import { RiWallet3Line } from "react-icons/ri";

import {
  Overlay,
  PopupBox,
  Header,
  TitleGroup,
  IconBadge,
  Title,
  Subtitle,
  CloseButton,
  FormGroup,
  InputLabel,
  InputWrapper,
  CurrencySymbol,
  AmountInput,
  QuickAddSection,
  QuickAddLabel,
  PresetGrid,
  PresetChip,
  BillingBox,
  BillingHeader,
  BillingRow,
  Divider,
  TotalRow,
  PayButton,
  TrustBadge
} from "./AddBalancePopup.styles";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const DEFAULT_PRESETS = [500, 1000, 2000, 5000];

const AddBalancePopup = ({
  isOpen = true,
  amountPreset,
  initialAmount,
  onClose,
  onConfirm,
  onSuccess,
  createOrder,
  onAddBalance
}) => {
  const [amount, setAmount] = useState(initialAmount || amountPreset || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialAmount || amountPreset) {
      setAmount(initialAmount || amountPreset);
    }
  }, [initialAmount, amountPreset]);

  // Lock body scroll and handle Escape key when modal is open
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && onClose) onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  /* ============================
     Amount Calculations
  ============================== */
  const baseAmount = Number(amount || 0);
  const gst = baseAmount * 0.18;
  const platformFee = 0;
  const total = baseAmount + gst + platformFee;

  /* ============================
     PAY NOW HANDLER (RAZORPAY)
  ============================== */
  const handlePayNow = async () => {
    if (!baseAmount || baseAmount < 1 || isNaN(baseAmount)) {
      alert("Please enter a valid amount (minimum ₹1)");
      return;
    }

    try {
      setLoading(true);

      const isSdkLoaded = await loadRazorpayScript();
      if (!isSdkLoaded || !window.Razorpay) {
        throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
      }

      const orderFn = createOrder || onAddBalance;
      if (!orderFn) {
        alert("Payment initialization error: missing order function.");
        return;
      }

      // STEP 1: Create Razorpay Order from backend
      const orderResponse = await orderFn(baseAmount);

      if (!orderResponse?.success || !orderResponse?.order_id) {
        throw new Error(orderResponse?.message || "Razorpay order creation failed");
      }

      const activeOrderId = orderResponse.order_id;
      const razorpayKeyId = orderResponse.key_id;
      const payableAmountPaise = orderResponse.amount; // Authoritative paise from backend

      // STEP 2: Launch Razorpay Checkout Modal
      const options = {
        key: razorpayKeyId,
        order_id: activeOrderId,
        amount: payableAmountPaise,
        currency: orderResponse.currency || "INR",
        name: "G9Expert",
        description: `Wallet Top-up (₹${baseAmount} + GST)`,
        handler: async function (response) {
          try {
            setLoading(true);
            const paymentPayload = {
              order_id: activeOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            };

            let confirmResult = null;
            if (onConfirm) {
              confirmResult = await onConfirm(paymentPayload);
            } else if (onAddBalance) {
              confirmResult = await onAddBalance(paymentPayload);
            }

            if (onSuccess) await onSuccess(confirmResult || paymentPayload);
            if (onClose) onClose();
          } catch (verifyErr) {
            alert(verifyErr.message || "Payment verification failed.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: ""
        },
        theme: {
          color: "#2563EB"
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert(err.message || "Payment process cancelled or failed.");
      setLoading(false);
    }
  };

  const formattedBase = baseAmount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const formattedGst = gst.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const formattedPlatformFee = platformFee.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const formattedTotal = total.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <Overlay onClick={onClose}>
      <PopupBox onClick={(e) => e.stopPropagation()}>
        {/* MODAL HEADER */}
        <Header>
          <TitleGroup>
            <IconBadge>
              <RiWallet3Line size={20} color="#2563eb" />
            </IconBadge>
            <div>
              <Title>Add Money to Wallet</Title>
              <Subtitle>Securely add balance to your G9Expert wallet</Subtitle>
            </div>
          </TitleGroup>
          <CloseButton onClick={onClose} aria-label="Close modal">
            <FiX size={18} />
          </CloseButton>
        </Header>

        {/* AMOUNT INPUT FIELD */}
        <FormGroup>
          <InputLabel htmlFor="wallet-amount-input">Amount to Add</InputLabel>
          <InputWrapper>
            <CurrencySymbol>₹</CurrencySymbol>
            <AmountInput
              id="wallet-amount-input"
              type="number"
              min="1"
              step="any"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </InputWrapper>
        </FormGroup>

        {/* QUICK ADD PRESETS */}
        <QuickAddSection>
          <QuickAddLabel>Quick Add</QuickAddLabel>
          <PresetGrid>
            {DEFAULT_PRESETS.map((preset) => {
              const isActive = Number(amount) === preset;
              return (
                <PresetChip
                  key={preset}
                  type="button"
                  $active={isActive}
                  onClick={() => setAmount(preset)}
                >
                  ₹{preset.toLocaleString("en-IN")}
                </PresetChip>
              );
            })}
          </PresetGrid>
        </QuickAddSection>

        {/* PAYMENT SUMMARY */}
        <BillingBox>
          <BillingHeader>Payment Summary</BillingHeader>

          <BillingRow>
            <span>Base Amount</span>
            <strong>₹{formattedBase}</strong>
          </BillingRow>

          <BillingRow>
            <span>GST (18%)</span>
            <strong>₹{formattedGst}</strong>
          </BillingRow>

          <BillingRow>
            <span>Platform Fee</span>
            <strong>₹{formattedPlatformFee}</strong>
          </BillingRow>

          <Divider />

          <TotalRow>
            <span>Total Payable</span>
            <strong>₹{formattedTotal}</strong>
          </TotalRow>
        </BillingBox>

        {/* CTA PAY BUTTON */}
        <PayButton
          disabled={!baseAmount || baseAmount < 1 || loading}
          onClick={handlePayNow}
        >
          {loading ? "Processing Payment..." : `Pay ₹${formattedTotal}`}
        </PayButton>

        {/* SECURITY TRUST INDICATOR */}
        <TrustBadge>
          <FiLock size={12} />
          <span>Encrypted & 256-Bit Secure Payment</span>
        </TrustBadge>
      </PopupBox>
    </Overlay>
  );
};

export default AddBalancePopup;