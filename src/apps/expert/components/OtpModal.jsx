import React, { useState, useRef } from "react";
import styled from "styled-components";

const Backdrop = styled.div`
  position: fixed;
  inset:0;
  background: rgba(15,23,42,0.45);
  backdrop-filter: blur(6px);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:2000;
`;

const Box = styled.div`
  background: rgba(255,255,255,0.82);
  backdrop-filter: blur(16px);
  border:1px solid rgba(255,255,255,0.4);
  box-shadow: 0 18px 40px rgba(15,23,42,0.14);
  padding:30px 28px;
  border-radius:18px;
  width:350px;
  max-width:90%;
`;

const Title = styled.h3`
  font-size:18px;
  color:#0f172a;
  margin:0 0 6px;
`;

const Sub = styled.p`
  font-size:14px;
  color:#6b7280;
  margin:0 0 16px;
`;

const OtpRow = styled.div`
  display:flex;
  gap:8px;
  justify-content:center;
  margin-bottom:18px;

  input{
    width:42px;
    height:48px;
    text-align:center;
    border-radius:10px;
    border:1px solid rgba(148,163,184,0.45);
    font-size:20px;
    font-weight:600;
  }
`;

const Button = styled.button`
  width:100%;
  border:none;
  border-radius:12px;
  padding:10px;
  background:linear-gradient(90deg,#0ea5ff,#38bdf8);
  color:white;
  font-weight:600;
  cursor:pointer;
  font-size:15px;
  opacity:${p=>p.disabled?.5:1};
`;

export default function OtpModal({ email, phone, onClose, onSuccess }) {
  const [otp, setOtp] = useState(["","","","","",""]);
  const inputsRef = useRef([]);

  function updateDigit(i, val){
    if (!/^\d$/.test(val)) return; // only numbers

    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);

    // move to next
    if(i < 5){
      inputsRef.current[i+1].focus();
    }
  }

  function handleKeyDown(e, i){
    if(e.key === "Backspace"){
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[i] = "";
      setOtp(newOtp);

      if(i > 0){
        inputsRef.current[i-1].focus();
      }
      return;
    }

    if(e.key === "ArrowLeft" && i > 0){
      inputsRef.current[i-1].focus();
    }

    if(e.key === "ArrowRight" && i < 5){
      inputsRef.current[i+1].focus();
    }

    if(e.key === "Enter" && otp.every(v=>v)){
      verify();
    }
  }

  function handlePaste(e){
    const text = e.clipboardData.getData("text");
    if(!/^\d{6}$/.test(text)) return;

    const arr = text.split("");
    setOtp(arr);

    arr.forEach((digit, i)=>{
      inputsRef.current[i].value = digit;
    });

    inputsRef.current[5].focus();
  }

  const filled = otp.every(v=>v);

  function verify(){
    // TODO verify OTP
    onSuccess();
  }

  return(
    <Backdrop>
      <Box>
        <Title>Verify OTP</Title>
        <Sub>We sent a code to {email} and {phone}</Sub>

        <OtpRow onPaste={handlePaste}>
          {otp.map((v,i)=>(
            <input
              key={i}
              ref={el => inputsRef.current[i] = el}
              value={v}
              onChange={e=>updateDigit(i,e.target.value)}
              onKeyDown={e=>handleKeyDown(e,i)}
              maxLength={1}
              inputMode="numeric"
              autoFocus={i === 0}
            />
          ))}
        </OtpRow>

        <Button disabled={!filled} onClick={verify}>
          Verify →
        </Button>
      </Box>
    </Backdrop>
  );
}
