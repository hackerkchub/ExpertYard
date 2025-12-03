import React, { useState } from "react";
import {
  Overlay,
  PopupBox,
  InputField,
  PresetText,
  BillingBox,
  PayButton,
  CloseBtn
} from "./AddBalancePopup.styles";

const AddBalancePopup = ({ amountPreset, onClose }) => {
  const [amount, setAmount] = useState(amountPreset || "");

  const gst = amount ? amount * 0.18 : 0;
  const platformFee = 10;
  const total = amount ? Number(amount) + gst + platformFee : 0;

  return (
    <Overlay>
      <PopupBox>
        <h2>Add Balance</h2>

        {/* Only show input if user did NOT click quick buttons */}
        {!amountPreset && (
          <InputField
            type="number"
            placeholder="Enter Amount"
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
            <strong>₹{amount || amountPreset}</strong>
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

        <PayButton disabled={!amount && !amountPreset}>
          PAY NOW
        </PayButton>

        <CloseBtn onClick={onClose}>Close</CloseBtn>
      </PopupBox>
    </Overlay>
  );
};

export default AddBalancePopup;
