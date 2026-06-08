import React, { useMemo, useState } from "react";

import {
  Overlay,
  PopupBox,
  InputField,
  PresetText,
  BillingBox,
  PayButton,
  CloseBtn
} from "./AddBalancePopup.styles";

const GST_RATE_PERCENT = 18;
const GST_RATE_DECIMAL = GST_RATE_PERCENT / 100;
const RAZORPAY_CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

let razorpayScriptPromise = null;

const formatMoney = (value) => {
  const amount = Number(value || 0);
  return Number.isFinite(amount) ? amount.toFixed(2) : "0.00";
};

const toPaise = (amount) => Math.round(Number(amount || 0) * 100);

const getOrderAmountInPaise = (orderAmount, expectedPaise) => {
  if (orderAmount === undefined || orderAmount === null || orderAmount === "") {
    return expectedPaise;
  }

  const numericAmount = Number(orderAmount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return expectedPaise;
  }

  const roundedAmount = Math.round(numericAmount);
  const amountIfRupees = toPaise(numericAmount);

  if (Math.abs(roundedAmount - expectedPaise) <= 1) {
    return roundedAmount;
  }

  if (Math.abs(amountIfRupees - expectedPaise) <= 1) {
    return amountIfRupees;
  }

  return roundedAmount >= 1000 ? roundedAmount : amountIfRupees;
};

const logPaymentDebug = (...args) => {
  if (import.meta.env?.DEV) {
    console.debug("[WalletRecharge]", ...args);
  }
};

const loadRazorpayScript = () => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Payment gateway is not available right now."));
  }

  if (window.Razorpay) {
    return Promise.resolve(true);
  }

  if (razorpayScriptPromise) {
    return razorpayScriptPromise;
  }

  razorpayScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${RAZORPAY_CHECKOUT_SRC}"]`);

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), { once: true });
      existingScript.addEventListener("error", () => {
        razorpayScriptPromise = null;
        reject(new Error("Payment gateway could not be loaded. Please check your internet connection and try again."));
      }, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_CHECKOUT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      razorpayScriptPromise = null;
      reject(new Error("Payment gateway could not be loaded. Please check your internet connection and try again."));
    };

    document.body.appendChild(script);
  });

  return razorpayScriptPromise;
};

const AddBalancePopup = ({ amountPreset, onClose, onConfirm, createOrder }) => {
  const [amount, setAmount] = useState(amountPreset || "");
  const [loading, setLoading] = useState(false);

  const billing = useMemo(() => {
    const rawAmount = Number(amountPreset || amount || 0);
    const baseAmount = Number.isFinite(rawAmount) && rawAmount > 0 ? rawAmount : 0;
    const gstAmount = baseAmount * GST_RATE_DECIMAL;
    const platformFee = 0;
    const totalAmount = baseAmount + gstAmount + platformFee;

    return {
      baseAmount,
      gstRate: GST_RATE_PERCENT,
      gstAmount,
      platformFee,
      totalAmount,
      amountInPaise: toPaise(totalAmount),
    };
  }, [amountPreset, amount]);

  const { baseAmount, gstRate, gstAmount, platformFee, totalAmount, amountInPaise } = billing;

  const handlePayNow = async () => {
    if (loading) return;

    if (!baseAmount || baseAmount < 1 || !Number.isFinite(baseAmount)) {
      alert("Please enter valid amount");
      return;
    }

    try {
      setLoading(true);

      await loadRazorpayScript();

      if (!window.Razorpay) {
        throw new Error("Payment gateway could not be loaded. Please check your internet connection and try again.");
      }

      const amountBreakdown = {
        baseAmount,
        gstRate,
        gstAmount,
        totalAmount,
        amountInPaise,
        base_amount: baseAmount,
        recharge_amount: baseAmount,
        wallet_credit_amount: baseAmount,
        gst_rate: gstRate,
        gst_rate_decimal: GST_RATE_DECIMAL,
        gst_amount: gstAmount,
        total_amount: totalAmount,
        paid_amount: totalAmount,
        amount_in_paise: amountInPaise,
      };

      logPaymentDebug("create-order payload", {
        amount: baseAmount,
        ...amountBreakdown,
      });

      const orderResponse = await createOrder(baseAmount, amountBreakdown);

      if (!orderResponse?.success) {
        throw new Error(orderResponse?.message || "Order creation failed");
      }

      const razorpayAmount = getOrderAmountInPaise(orderResponse.amount, amountInPaise);

      logPaymentDebug("order response amount check", {
        expectedAmountInPaise: amountInPaise,
        orderResponseAmount: orderResponse.amount,
        razorpayAmount,
        orderResponse,
      });

      if (Math.abs(razorpayAmount - amountInPaise) > 1) {
        throw new Error("Payment amount mismatch. Please try again.");
      }

      const options = {
        key: orderResponse.key_id,
        amount: razorpayAmount,
        currency: orderResponse.currency || "INR",
        order_id: orderResponse.order_id,
        name: "Wallet Recharge",
        description: `Base Rs ${formatMoney(baseAmount)} + 18% GST`,
        web_intent: true,
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
          emi: true
        },
        config: {
          display: {
            preferences: {
              show_default_blocks: true
            }
          }
        },
        handler: async function (response) {
          try {
            const result = await onConfirm({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              ...amountBreakdown,
              base_amount: baseAmount,
              recharge_amount: baseAmount,
              wallet_credit_amount: baseAmount,
              gst_rate: gstRate,
              gst_rate_decimal: GST_RATE_DECIMAL,
              gst_amount: gstAmount,
              total_amount: totalAmount,
              paid_amount: totalAmount,
              amount_in_paise: amountInPaise,
            });

            if (!result?.success) {
              throw new Error(result?.message || "Wallet update failed");
            }

            alert("Balance added successfully");
            onClose();
          } catch (err) {
            console.error(err);
            alert("Payment completed but wallet credit failed");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss() {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert(err.message || "Payment gateway could not be loaded. Please check your internet connection and try again.");
      setLoading(false);
    }
  };

  return (
    <Overlay>
      <PopupBox>
        <h2>Add Balance</h2>

        {!amountPreset && (
          <InputField
            type="number"
            placeholder="Enter Amount (Min Rs 1)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        )}

        {amountPreset && (
          <PresetText>Amount: Rs {formatMoney(amountPreset)}</PresetText>
        )}

        <BillingBox>
          <div>
            <span>Recharge Amount</span>
            <strong>Rs {formatMoney(baseAmount)}</strong>
          </div>

          <div>
            <span>GST (18%)</span>
            <strong>Rs {formatMoney(gstAmount)}</strong>
          </div>

          <div>
            <span>Platform Fee</span>
            <strong>Rs {formatMoney(platformFee)}</strong>
          </div>

          <hr />

          <div className="total">
            <span>Total Payable</span>
            <strong>Rs {formatMoney(totalAmount)}</strong>
          </div>
        </BillingBox>

        <PayButton
          disabled={!baseAmount || loading}
          onClick={handlePayNow}
        >
          {loading ? "Preparing payment..." : `Pay Rs ${formatMoney(totalAmount)}`}
        </PayButton>

        <CloseBtn onClick={loading ? undefined : onClose}>Close</CloseBtn>
      </PopupBox>
    </Overlay>
  );
};

export default AddBalancePopup;
