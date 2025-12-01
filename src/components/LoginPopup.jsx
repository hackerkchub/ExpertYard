import React, { useState } from "react";
import styled from "styled-components";

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

// Styled ---------------------------

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  backdrop-filter: blur(10px);
  background: rgba(0,0,0,0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const Box = styled.div`
  width: 330px;
  background: rgba(255,255,255,0.15);
  padding: 28px;
  border-radius: 14px;
  position: relative;
  border: 1px solid rgba(255,255,255,0.3);
`;

const Close = styled.div`
  position: absolute;
  right: 14px;
  top: 10px;
  font-size: 26px;
  color: white;
  cursor: pointer;
`;

const Title = styled.h3`
  text-align: center;
  color: #66b3ff;
  margin-bottom: 18px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ffffff40;
  background: rgba(255,255,255,0.15);
  color: white;

  &::placeholder {
    color: #ddd;
  }
`;

const Btn = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 14px;
  background: #007bff;
  color: white;
  border: 0;
  border-radius: 8px;
  font-size: 16px;
`;
