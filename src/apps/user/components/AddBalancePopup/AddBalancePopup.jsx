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

const AddBalancePopup = ({ amountPreset, onClose, onConfirm }) => {
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
  const platformFee = 10;
  const total = baseAmount + gst + platformFee;

  /* ============================
     PAY NOW HANDLER
  ============================== */
  const handlePayNow = async () => {
    if (loading) return;

    // 🔴 Critical validations
    if (!razorpayLoaded || !window.Razorpay) {
      alert("Razorpay not loaded yet");
      return;
    }

    if (!baseAmount || baseAmount < 1 || isNaN(baseAmount)) {
      alert("Please enter valid amount (₹1 minimum)");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("user"));
    const userId = userData?.id;

    if (!userId) {
      alert("User not logged in");
      return;
    }

    setLoading(true);

    console.log("DEBUG PAYMENT DATA", {
      baseAmount,
      gst,
      total,
      paise: Math.round(total * 100)
    });

    const options = {
      key: "rzp_test_RZ9SA1VOWXjQBJ",
      amount: Math.round(total * 100), // paise (MUST be > 0)
      currency: "INR",
      name: "Wallet Recharge",
      description: "Add balance to wallet",

      handler: async function (response) {
        console.log("Payment Success:", response);

        try {
           await onConfirm(baseAmount);
          alert("Balance added successfully");
          onClose();
        } catch (err) {
          console.error(err);
          alert("Payment done but wallet update failed");
        } finally {
          setLoading(false);
        }
      },

      modal: {
        ondismiss: function () {
          setLoading(false);
          console.log("Payment cancelled");
        }
      },

      theme: {
        color: "#3399cc"
      }
    };

    try {
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Razorpay Error:", err);
      alert("Something went wrong while opening payment");
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