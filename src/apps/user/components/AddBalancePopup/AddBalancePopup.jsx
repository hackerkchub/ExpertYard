import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Overlay,
  PopupBox,
  InputField,
  PresetText,
  BillingBox,
  PayButton,
  CloseBtn
} from "./AddBalancePopup.styles";

const AddBalancePopup = ({ amountPreset, onClose, onConfirm, createOrder }) => {
  const [amount, setAmount] = useState(amountPreset || "");
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ============================
     Load Razorpay Script SAFELY
  ============================== */
  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => setRazorpayLoaded(true);
    script.onerror = () => {
      alert("Razorpay SDK load failed");
      setRazorpayLoaded(false);
    };

    document.body.appendChild(script);
  }, []);

  /* ============================
     Amount Calculations
  ============================== */
  const baseAmount = Number(amountPreset || amount || 0);
  const gst = baseAmount * 0.18;
  const platformFee = 0;
  const total = baseAmount + gst + platformFee;

  /* ============================
     PAY NOW HANDLER
  ============================== */
  const handlePayNow = async () => {
if (!razorpayLoaded || !window.Razorpay) {
  alert("Razorpay not loaded");
  return;
}

if (!baseAmount || baseAmount < 1 || isNaN(baseAmount)) {
  alert("Please enter valid amount");
  return;
}
  try {
    setLoading(true);

    const orderResponse =
      await createOrder(baseAmount);

    if (!orderResponse?.success) {
      throw new Error("Order creation failed");
    }

    const options = {
      key: orderResponse.key_id,

      amount:
        Math.round(orderResponse.amount * 100),

      currency:
        orderResponse.currency,

      order_id:
        orderResponse.order_id,

      name: "Wallet Recharge",

      description: "Add balance",

        webview_intent: true,

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
  razorpay_signature: response.razorpay_signature
});

if (!result?.success) {
  throw new Error(result?.message || "Wallet update failed");
}

alert("Balance added successfully");
onClose();
} catch (err) {

          console.error(err);

          alert(
            "Payment completed but wallet credit failed"
          );
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

    const rzp =
      new window.Razorpay(options);

    rzp.open();

  } catch (err) {

    console.error(err);

    alert(err.message);

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
            placeholder="Enter Amount (Min ₹1)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        )}

        {amountPreset && (
          <PresetText>Amount: ₹{amountPreset}</PresetText>
        )}

        <BillingBox>
          <div>
            <span>Base Amount</span>
            <strong>₹{baseAmount}</strong>
          </div>

          <div>
            <span>GST (18%)</span>
            <strong>₹{gst.toFixed(2)}</strong>
          </div>

          <div>
            <span>Platform Fee</span>
            <strong>₹{platformFee}</strong>
          </div>

          <hr />

          <div className="total">
            <span>Total</span>
            <strong>₹{total.toFixed(2)}</strong>
          </div>
        </BillingBox>

        <PayButton
          disabled={!baseAmount || loading}
          onClick={handlePayNow}
        >
          {loading ? "PROCESSING..." : "PAY NOW"}
        </PayButton>

        <CloseBtn onClick={onClose}>Close</CloseBtn>
      </PopupBox>
    </Overlay>
  );
};

export default AddBalancePopup;