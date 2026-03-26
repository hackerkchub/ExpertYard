// src/apps/expert/components/OtpModal.jsx
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const Box = styled.div`
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.14);
  padding: 30px 28px;
  border-radius: 18px;
  width: 350px;
  max-width: 90%;
  position: relative;
`;

const CloseButton = styled.span`
  position: absolute;
  top: 16px;
  right: 18px;
  cursor: pointer;
  color: #64748b;
  font-size: 18px;
  font-weight: 500;
`;

const Title = styled.h3`
  font-size: 18px;
  color: #0f172a;
  margin: 0 0 6px;
`;

const Sub = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px;
`;

const OtpRow = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 18px;

  input {
    width: 48px;
    height: 52px;
    text-align: center;
    border-radius: 12px;
    border: 1px solid rgba(148, 163, 184, 0.45);
    font-size: 22px;
    font-weight: 600;
    background: white;

    &:focus {
      border-color: #0ea5ff;
      outline: none;
      box-shadow: 0 0 0 2px rgba(14, 165, 255, 0.2);
    }
  }
`;

const ErrorMsg = styled.p`
  color: #ef4444;
  font-size: 13px;
  margin: -10px 0 12px;
  text-align: center;
  font-weight: 500;
`;

const Button = styled.button`
  width: 100%;
  border: none;
  border-radius: 12px;
  padding: 12px;
  background: linear-gradient(90deg, #0ea5ff, #38bdf8);
  color: white;
  font-weight: 600;
  cursor: pointer;
  font-size: 15px;
  opacity: ${(p) => (p.disabled ? 0.5 : 1)};
  transition: opacity 0.2s;
`;

export default function OtpModal({ email, phone, type, onClose, onSuccess }) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);

  useEffect(() => {
    return () => {
      setLoading(false);
      setError("");
    };
  }, []);

  function updateDigit(i, val) {
    if (val && !/^\d$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);

    if (val && i < 3) {
      inputsRef.current[i + 1].focus();
    }
  }

  function handleKeyDown(e, i) {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];

      if (otp[i]) {
        newOtp[i] = "";
        setOtp(newOtp);
      } else if (i > 0) {
        newOtp[i - 1] = "";
        setOtp(newOtp);
        inputsRef.current[i - 1].focus();
      }
      return;
    }

    if (e.key === "ArrowLeft" && i > 0) {
      inputsRef.current[i - 1].focus();
    }

    if (e.key === "ArrowRight" && i < 3) {
      inputsRef.current[i + 1].focus();
    }

    if (e.key === "Enter" && otp.every((v) => v)) {
      verify();
    }
  }

  function handlePaste(e) {
    const text = e.clipboardData.getData("text");
    if (!/^\d{4}$/.test(text)) return;

    const arr = text.split("");
    setOtp(arr);

    arr.forEach((digit, i) => {
      if (inputsRef.current[i]) inputsRef.current[i].value = digit;
    });

    inputsRef.current[3].focus();
  }

  async function verify() {
    const otpString = otp.join("");
    if (otpString.length !== 4) return;

    // ⏱️ Strictly 8 Seconds Timeout Logic
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      setLoading(true);
      setError("");

      const apiType = type === "phone" ? "mobile" : type;
      let apiUrl = "";
      let payload = {};

      if (apiType === "email") {
        apiUrl = "http://softmaxs.com/api/otp/email/verify";
        payload = { email, otp: otpString };
      } else {
        apiUrl = "http://softmaxs.com/api/otp/sms/verify";
        payload = { countryCode: "91", mobile: phone, otp: otpString };
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal, // 👈 Hooked with Abort Controller
      });

      clearTimeout(timeoutId); // Request aagyi, to timeout cancel kardo

      const data = await response.json();

      if (data.success) {
        onSuccess();
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setError("⏱️ Request Timeout! Backend is taking too long.");
      } else {
        setError("Server error during verification.");
      }
    } finally {
      setLoading(false);
    }
  }

  const filled = otp.every((v) => v);

  return (
    <Backdrop>
      <Box>
        <CloseButton onClick={onClose}>✕</CloseButton>
        <Title>Verify Account</Title>
        <Sub>We sent a 4-digit code to {type === "email" ? email : phone}</Sub>

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <OtpRow onPaste={handlePaste}>
          {otp.map((v, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={v}
              onChange={(e) => updateDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              maxLength={1}
              inputMode="numeric"
              autoFocus={i === 0}
            />
          ))}
        </OtpRow>

        <Button disabled={!filled || loading} onClick={verify}>
          {loading ? "Verifying..." : "Verify OTP →"}
        </Button>
      </Box>
    </Backdrop>
  );
}