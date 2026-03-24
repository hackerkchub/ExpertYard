// src/apps/expert/pages/register/Auth.jsx (FINAL PRODUCTION READY)
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  FullRow,
  PhoneInputWrap,
  PasswordStrength,
  ToggleLink,
  Divider
} from "../../styles/Register.styles";

export default function Auth() {
  const navigate = useNavigate();
 const { updateExpertData, logoutExpert } = useExpert();

  const [mode, setMode] = useState("login");
  const [showOtp, setShowOtp] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const setupCompleted = params.get("completed");
  const prefillEmail = params.get("email");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const { request: register, loading: registerLoading, error: registerError } = useApi(registerApi);
  const { request: login, loading: loginLoading, error: loginError } = useApi(loginApi);

  const loading = registerLoading || loginLoading;
  const error = registerError || loginError;

  useEffect(() => {
  // 🚀 Reset session when opening register page
  logoutExpert();
}, []);

  useEffect(() => {
    if (setupCompleted) {
      setMode("login");
    }
  }, [setupCompleted]);

  useEffect(() => {
    if (prefillEmail) {
      setLoginEmail(prefillEmail);
    }
  }, [prefillEmail]);

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

  const getStrengthText = (strength) => {
    if (strength <= 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    if (strength >= 4) return "Strong";
    return "";
  };

  // ✅ REGISTER HANDLER (FIXED)
  const handleRegister = async () => {
    try {
      setSubmitting(true);
      
      const cleanForm = {
        name: registerForm.name.trim(),
        email: registerForm.email.trim(),
        phone: registerForm.phone.trim(),
        password: registerForm.password
      };

      const res = await register(cleanForm);

      if (!res.token) {
        throw new Error("Token missing");
      }

      localStorage.setItem("expert_token", res.token);

      updateExpertData({
        expertId: res.expert_id,
        name: registerForm.name,
        email: registerForm.email,
        phone: registerForm.phone
      });

      navigate("/expert/register/category");

    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ LOGIN HANDLER (PROPERLY CLOSED - CRITICAL FIX)
  const handleLogin = async () => {
    try {
      setSubmitting(true);

      const res = await login({
        email_or_phone: loginEmail.trim(),
        password: loginPassword
      });

      if (!res.token) {
        throw new Error("Token missing");
      }

      localStorage.setItem("expert_token", res.token);
      localStorage.setItem("last_panel", "expert");

      updateExpertData({
        expertId: res.expert.id,
        name: res.expert.name,
        email: res.expert.email,
        phone: res.expert.phone,
        categoryId: res.expert.category_id || null,
        subCategoryIds: res.expert.subcategory_id ? [res.expert.subcategory_id] : [],
        profileId: res.expert.profile_id || null
      });

      const expert = res.expert;

      // ✅ STEP BASED NAVIGATION (CORRECTED)
   if (!expert.category_id) {
  navigate("/expert/register/category");
} else if (!expert.subcategory_id) {
  navigate("/expert/register/subcategory");
} else if (!expert.profile_id) {
  navigate("/expert/register/profile");
} else {
  navigate("/expert/home");
}

    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setSubmitting(false); // ✅ IMPORTANT: Always reset submitting state
    }
  };

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
        {/* ✅ Loading State */}
        {submitting && <Loader />}

        {/* ✅ Setup Completion Message */}
        {setupCompleted && (
          <div
            style={{
              background: "#ecfeff",
              border: "1px solid #67e8f9",
              color: "#0e7490",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "20px",
              textAlign: "center",
              fontWeight: 500
            }}
          >
            🎉 Setup completed! Please login to start earning.
          </div>
        )}

        {/* ✅ Error Message */}
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
                disabled={submitting || loading}
              />
            </Field>
            
            <Field>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                disabled={submitting || loading}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && isLoginValid && !submitting && !loading) {
                    handleLogin();
                  }
                }}
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
                disabled={submitting || loading}
              />
            </Field>

            <Field>
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="example@domain.com"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                disabled={submitting || loading}
              />
            </Field>

            <PhoneInputWrap>
              <Label>Mobile Number</Label>
              <Input
                type="tel"
                placeholder="+91 98765 43210"
                value={registerForm.phone}
                onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                disabled={submitting || loading}
              />
            </PhoneInputWrap>

            <Field>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Create strong password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                disabled={submitting || loading}
              />
              
              {/* ✅ Password Strength Indicator */}
              {registerForm.password && (
                <PasswordStrength>
                  <div 
                    style={{ 
                      width: `${(passwordStrength / 5) * 100}%`,
                      backgroundColor: getStrengthColor(passwordStrength),
                      transition: "width 0.3s ease"
                    }} 
                  />
                  <span style={{ 
                    color: getStrengthColor(passwordStrength),
                    fontWeight: 500
                  }}>
                    {getStrengthText(passwordStrength)}
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
              disabled={!isLoginValid || submitting || loading} 
              onClick={handleLogin}
            >
              {submitting || loading ? "Logging in..." : "Continue with Expert Account →"}
            </PrimaryButton>
          ) : (
            <PrimaryButton
              disabled={!isRegisterValid || submitting || loading}
              onClick={handleRegister}
            >
              {submitting || loading ? "Creating Account..." : "Continue to Category →"}
            </PrimaryButton>
          )}
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
            <ToggleLink 
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                // Clear any errors when switching modes
                setSubmitting(false);
              }}
              style={{ marginLeft: "8px" }}
            >
              {mode === "login" ? "Create Account" : "Sign In"}
            </ToggleLink>
          </div>
        </FullRow>

        {/* ✅ Help Text */}
        <FullRow>
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <small style={{ color: "#94a3b8", fontSize: "12px" }}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </small>
          </div>
        </FullRow>
      </RegisterLayout>

      {showOtp && <OtpModal onSuccess={() => setShowOtp(false)} />}
    </>
  );
}