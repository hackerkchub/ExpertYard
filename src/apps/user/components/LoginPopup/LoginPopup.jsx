import React, { useState } from "react";
import {
  Overlay,
  Box,
  Close,
  Title,
  Input,
  Btn
} from "./LoginPopup.styles";

const LoginPopup = ({ close, success }) => {
  const [otp, setOtp] = useState("");

  return (
    <Overlay>
      <Box>
        <Close onClick={close}>×</Close>

        <Title>Enter OTP</Title>

        <Input
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        />

        <Btn onClick={success}>Verify & Continue</Btn>
      </Box>
    </Overlay>
  );
};

export default LoginPopup;
