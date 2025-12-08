import React, { useState } from "react";
import Slider from "../../components/HomeSlider/HomeSlider";
import LoginPopup from "../../components/LoginPopup/LoginPopup";
import Categories from "../../components/Categories/Categories";

import {
  Wrapper,
  LoginSection,
  Row,
  CountrySelect,
  MobileInput,
  LoginBtnSmall,
  ErrorText
} from "./Home.styles";

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

      {/* Login Section */}
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
