// src/apps/expert/pages/register/Auth.jsx (Premium Upgraded)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useExpert } from "../../../../shared/context/ExpertContext";
import { registerApi, loginApi } from "../../../../shared/api/expertapi/auth.api";
import useApi from "../../../../shared/hooks/useApi";

import RegisterLayout from "../../components/RegisterLayout";
import OtpModal from "../../components/OtpModal";
import Loader from "../../../../shared/components/Loader/Loader";
import ErrorMessage from "../../../../shared/components/ErrorMessage/ErrorMessage";

import {
  FormGrid,
  Field,
  Label,
  Input,
  ActionsRow,
  PrimaryButton,
  SecondaryButton,
  FullRow,
  PhoneInputWrap,
  PasswordStrength,
  ToggleLink,
  Divider
} from "../../styles/Register.styles";

export default function Auth() {
  const navigate = useNavigate();
  const { updateExpertData } = useExpert();

  const [mode, setMode] = useState("login");
  const [showOtp, setShowOtp] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const { request: register, loading: registerLoading, error: registerError } =
    useApi(registerApi);

  const { request: login, loading: loginLoading, error: loginError } =
    useApi(loginApi);

  // ✅ Premium Password Strength Checker
  useEffect(() => {
    if (registerForm.password) {
      const strength = calculatePasswordStrength(registerForm.password);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [registerForm.password]);

  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const getStrengthColor = (strength) => {
    if (strength === 0) return "transparent";
    if (strength <= 2) return "#ef4444";
    if (strength <= 3) return "#f59e0b";
    if (strength <= 4) return "#10b981";
    return "#0ea5ff";
  };

  const handleRegister = async () => {
    try {
      const res = await register(registerForm);

      updateExpertData({
        expertId: res.expert_id,
        name: registerForm.name,
        email: registerForm.email,
        phone: registerForm.phone
      });

      setShowOtp(true);

      setTimeout(() => {
        setShowOtp(false);
        navigate("/expert/register/category");
      }, 700);
    } catch (err) {}
  };

  const handleLogin = async () => {
    try {
      const res = await login({
        email_or_phone: loginEmail,
        password: loginPassword
      });

      updateExpertData({
        expertId: res.data.id,
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone
      });

      navigate("/expert/home");
    } catch (err) {
      console.error(err);
    }
  };

  const loading = registerLoading || loginLoading;
  const error = registerError || loginError;

  const isLoginValid = loginEmail && loginPassword;
  const isRegisterValid = 
    registerForm.name && 
    registerForm.email && 
    registerForm.phone && 
    registerForm.password &&
    passwordStrength >= 3;

  return (
    <>
      <RegisterLayout
        title={mode === "login" ? "Welcome back" : "Create your Expert account"}
        subtitle={
          mode === "login"
            ? "Log in to continue as expert"
            : "Start by creating your expert login"
        }
        step={1}
        hasNavbar={true}
        tabs={[
          { label: "Log In", active: mode === "login", onClick: () => setMode("login") },
          { label: "Register", active: mode === "register", onClick: () => setMode("register") },
        ]}
      >
        {loading && <Loader />}
        {error && <ErrorMessage message={error} />}

        {/* ✅ Premium Login Form */}
        {mode === "login" && (
          <FormGrid>
            <Field>
              <Label>Email or Phone</Label>
              <Input
                placeholder="Enter email or phone number"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </Field>
            
            <Field>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </Field>
          </FormGrid>
        )}

        {/* ✅ Premium Register Form */}
        {mode === "register" && (
          <FormGrid>
            <Field>
              <Label>Full Name</Label>
              <Input
                placeholder="Enter your full name"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
              />
            </Field>

            <Field>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="example@domain.com"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              />
            </Field>

            <PhoneInputWrap>
              <Label>Mobile Number</Label>
              <Input
                type="tel"
                placeholder="+91 98765 43210"
                value={registerForm.phone}
                onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
              />
            </PhoneInputWrap>

            <Field>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Create strong password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              />
              
              {/* ✅ Password Strength Indicator */}
              {registerForm.password && (
                <PasswordStrength>
                  <div 
                    style={{ 
                      width: `${(passwordStrength / 5) * 100}%`,
                      backgroundColor: getStrengthColor(passwordStrength)
                    }} 
                  />
                  <span>
                    {passwordStrength <= 1 && "Weak"} 
                    {passwordStrength === 2 && "Fair"} 
                    {passwordStrength === 3 && "Good"} 
                    {passwordStrength >= 4 && "Strong"}
                  </span>
                </PasswordStrength>
              )}
            </Field>
          </FormGrid>
        )}

        {/* ✅ Premium Action Buttons */}
        <ActionsRow>
          {mode === "login" ? (
            <PrimaryButton 
              disabled={!isLoginValid} 
              onClick={handleLogin}
            >
              Continue with Expert Account →
            </PrimaryButton>
          ) : (
            <PrimaryButton
              disabled={!isRegisterValid}
              onClick={handleRegister}
            >
              Send Verification OTP →
            </PrimaryButton>
          )}
          
          {/* ✅ Secondary Action */}
          {/* <SecondaryButton onClick={() => navigate("/expert/forgot-password")}>
            Forgot Password?
          </SecondaryButton> */}
        </ActionsRow>

        {/* ✅ Premium Divider + Toggle */}
        <Divider />
        
        <FullRow>
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <small style={{ 
              color: "#94a3b8", 
              fontSize: "14px",
              fontWeight: 500
            }}>
              {mode === "login" 
                ? "Don't have an expert account?" 
                : "Already have an expert account?"
              }
            </small>
            <ToggleLink onClick={() => setMode(mode === "login" ? "register" : "login")}>
              {mode === "login" ? "Create Account" : "Sign In"}
            </ToggleLink>
          </div>
        </FullRow>
      </RegisterLayout>

      {showOtp && <OtpModal onSuccess={() => setShowOtp(false)} />}
    </>
  );
}
