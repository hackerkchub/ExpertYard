import React, { useState } from "react";
import { load } from "@cashfreepayments/cashfree-js";

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
  const [loading, setLoading] = useState(false);

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
    if (!baseAmount || baseAmount < 1 || isNaN(baseAmount)) {
      alert("Please enter valid amount");
      return;
    }

    try {
      setLoading(true);

      // STEP 1: Create order from backend
      const orderResponse = await createOrder(baseAmount);

      if (!orderResponse?.success) {
        throw new Error(orderResponse?.message || "Order creation failed");
      }

      // STEP 2: Load Cashfree SDK with environment from backend
      const cashfree = await load({
        mode: orderResponse.environment || "sandbox"
      });

      // STEP 3: Initialize Cashfree checkout
      const result = await cashfree.checkout({
        paymentSessionId: orderResponse.payment_session_id,
        redirectTarget: "_modal"
      });

      // STEP 4: Handle checkout result
      if (result?.error) {
        throw new Error(result.error.message || "Payment failed");
      }

      // STEP 5: Payment successful - confirm with backend
      const walletResult = await onConfirm({
        order_id: orderResponse.order_id
      });

      if (!walletResult?.success) {
        throw new Error(walletResult?.message || "Wallet update failed");
      }

      alert("Balance added successfully");
      onClose();

    } catch (err) {
      console.error("Payment error:", err);
      alert(err.message || "Payment failed. Please try again.");
    } finally {
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