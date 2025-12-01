import React, { useState } from "react";
import styled from "styled-components";
import Slider from "../components/HomeSlider";
import LoginPopup from "../components/LoginPopup";
import Categories from "../components/Categories";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openOtp, setOpenOtp] = useState(false);

  const [mobile, setMobile] = useState("");
  const [country, setCountry] = useState("+91");
  const [error, setError] = useState("");

  const validateMobile = () => {
    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSignInClick = () => {
    if (validateMobile()) {
      setOpenOtp(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setOpenOtp(false);
  };

  return (
    <Wrapper>
      {/* Banner Slider */}
      <Slider />

    {/* Login UI (Visible on Home UI) */}
{!isLoggedIn && (
  <LoginSection>
    <Row>
      <CountrySelect value={country} onChange={(e) => setCountry(e.target.value)}>
        <option value="+91">🇮🇳 +91</option>
        <option value="+1">🇺🇸 +1</option>
        <option value="+44">🇬🇧 +44</option>
      </CountrySelect>

      <MobileInput
        placeholder="Enter mobile number"
        value={mobile}
        maxLength={10}
        onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
      />

      <LoginBtnSmall onClick={handleSignInClick}>Sign In</LoginBtnSmall>
    </Row>

    {error && <ErrorText>{error}</ErrorText>}
  </LoginSection>
)}


      {/* Categories */}
      <Categories />

      {/* OTP Popup */}
      {openOtp && (
        <LoginPopup 
          close={() => setOpenOtp(false)} 
          success={handleLoginSuccess} 
        />
      )}
    </Wrapper>
  );
};

export default HomePage;


/* ------------------------------------------
   STYLED COMPONENTS
------------------------------------------ */

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
`;

const LoginSection = styled.div`
  width: 100%;
  max-width: 430px;
  margin: 25px auto;
  padding: 20px;
  border-radius: 14px;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255,255,255,0.2);
`;

// const Row = styled.div`
//   display: flex;
//   gap: 10px;
// `;

const CountrySelect = styled.select`
  width: 100px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

const MobileInput = styled.input`
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

// const LoginBtn = styled.button`
//   width: 100%;
//   padding: 12px;
//   background: #0077ff;
//   color: white;
//   border: none;
//   margin-top: 12px;
//   border-radius: 8px;
//   cursor: pointer;
//   font-size: 16px;

//   &:hover {
//     background: #005dcc;
//   }
// `;

const ErrorText = styled.div`
  color: red;
  margin-top: 6px;
  font-size: 13px;
`;
const Row = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const LoginBtnSmall = styled.button`
  padding: 12px 18px;
  background: #0077ff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
  font-size: 15px;
  height: 46px;

  &:hover {
    background: #005dcc;
  }
`;
