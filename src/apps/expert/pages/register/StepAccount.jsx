// src/apps/expert/pages/register/Auth.jsx
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
  SecondaryButton,
  FullRow,
  PhoneInputWrap,
  PasswordStrength,
  ToggleLink,
  Divider
} from "../../styles/Register.styles";

export default function Auth() {
  const navigate = useNavigate();
  const { updateExpertData, logoutExpert } = useExpert();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const setupCompleted = params.get("completed");
  const prefillEmail = params.get("email");

  // 📂 Views State (login, register)
  const [mode, setMode] = useState("login");
  const [isForgotMode, setIsForgotMode] = useState(false);

  // ⏱️ Loaders & Messages
  const [submitting, setSubmitting] = useState(false); 
  const [loadingType, setLoadingType] = useState(null); 
  const [apiMessage, setApiMessage] = useState({ text: "", isError: false });

  // 🔑 OTP Modals (Registration)
  const [showOtp, setShowOtp] = useState(false);
  const [verifyType, setVerifyType] = useState(null); 
  const [verified, setVerified] = useState({ email: false, phone: false });

  // 📋 Password Strength
  const [passwordStrength, setPasswordStrength] = useState(0);

  // 📋 Normal Auth Forms
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  // 🗃️ Forgot Password State Machine
  const [forgotStep, setForgotStep] = useState(1); // 1: Send OTP, 1.5: Verify OTP, 2: Reset Password
  const [forgotData, setForgotData] = useState({
    type: "email", 
    email: "",
    mobile: "",
    otp: "",
    resetToken: "",
    newPassword: "",
    confirmPassword: ""
  });

  const { request: register, loading: registerLoading, error: registerError } = useApi(registerApi);
  const { request: login, loading: loginLoading, error: loginError } = useApi(loginApi);

  const loading = registerLoading || loginLoading;
  const error = registerError || loginError;

  /* ================= COMMON HELPERS ================= */

  const showMessage = (text, isError = false) => {
    setApiMessage({ text, isError });
  };

  const resetAllViews = (selectedMode) => {
    setMode(selectedMode);
    setIsForgotMode(false);
    setForgotStep(1);
    setForgotData({ type: "email", email: "", mobile: "", otp: "", resetToken: "", newPassword: "", confirmPassword: "" });
    setVerified({ email: false, phone: false });
    showMessage("");
  };

  useEffect(() => {
    logoutExpert(); // 🚀 Clean session on mount
  }, [logoutExpert]);

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

  // ✅ Password Strength Checker
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

  /* ================= LOGIN ================= */

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      return showMessage("❌ Please enter email and password.", true);
    }

    try {
      setSubmitting(true);
      showMessage("");

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
  isSubscribed: res.expert.is_subscribed, // ✅ IMPORTANT
  categoryId: res.expert.category_id || null,
  subCategoryIds: res.expert.subcategory_id ? [res.expert.subcategory_id] : [],
  profileId: res.expert.profile_id || null,
});

      const expert = res.expert;

      // ✅ Step Based Navigation
     if (!expert.is_subscribed) {
  navigate("/expert/register/subscription");
} else if (!expert.category_id) {
  navigate("/expert/register/category");
} else if (!expert.subcategory_id) {
  navigate("/expert/register/subcategory");
} else if (!expert.profile_id) {
  navigate("/expert/register/profile");
} else if (!expert.price_id) {   // ✅ ADD THIS
  navigate("/expert/register/pricing");
} else {
  navigate("/expert/home");
}

    } catch (err) {
      showMessage(`❌ ${err.message || "Login failed. Try again."}`, true);
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= REGISTRATION OTP TRIGGERS ================= */

  const openOtp = async (type) => {
    showMessage("");

    if (type === "email" && !registerForm.email) return showMessage("❌ Please enter an email address.", true);
    if (type === "phone" && !registerForm.phone) return showMessage("❌ Please enter a phone number.", true);

    try {
      setLoadingType(type);
      let apiUrl = "";
      let payload = {};

      if (type === "email") {
        apiUrl = "https://softmaxs.com/api/otp/email/send";
        payload = { email: registerForm.email };
      } else {
        apiUrl = "https://softmaxs.com/api/otp/sms/send";
        payload = { countryCode: "91", mobile: registerForm.phone };
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setVerifyType(type);
        setShowOtp(true);
      } else {
        showMessage(`❌ Failed to send OTP: ${data.message}`, true);
      }
    } catch (error) {
      showMessage("❌ Server error while sending OTP.", true);
    } finally {
      setLoadingType(null);
    }
  };

  const handleOtpVerifySuccess = () => {
    setVerified((prev) => ({ ...prev, [verifyType]: true }));
    setShowOtp(false);
    showMessage(`✅ ${verifyType === "email" ? "Email" : "Phone"} verified successfully!`, false);
  };

  /* ================= REGISTER ================= */

  const handleRegister = async () => {
    if (!verified.email || !verified.phone) {
      return showMessage("❌ Please verify both email and phone number first.", true);
    }

    try {
      setSubmitting(true);
      showMessage("");

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

      navigate("/expert/register/subscription");

    } catch (err) {
      showMessage(`❌ Registration failed: ${err.message || "Try again."}`, true);
    } finally {
      setSubmitting(false);
    }
  };


  /* ================= 🔑 FORGOT PASSWORD FLOW 🔑 ================= */

  const handleForgotSendOtp = async () => {
    showMessage("");
    const { type, email, mobile } = forgotData;

    if (type === "email" && !email) return showMessage("❌ Please enter email address.", true);
    if (type === "mobile" && !mobile) return showMessage("❌ Please enter mobile number.", true);

    try {
      setSubmitting(true);
      let payload = { userType: "expert", type };

      if (type === "email") {
        payload.email = email;
      } else {
        payload.countryCode = "91";
        payload.mobile = mobile;
      }

      const response = await fetch("https://softmaxs.com/api/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        showMessage(`✅ OTP sent to your ${type === 'email' ? 'email' : 'mobile'}.`, false);
        setForgotStep(1.5);
      } else {
        showMessage(`❌ Error: ${data.message}`, true);
      }
    } catch (error) {
      showMessage("❌ Server error while sending forgot OTP.", true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotVerifyOtp = async () => {
    showMessage("");
    const { type, email, mobile, otp } = forgotData;

    if (!otp || otp.length !== 4) return showMessage("❌ Please enter a valid 4-digit OTP.", true);

    try {
      setSubmitting(true);
      let payload = { userType: "expert", type, otp }; 

      if (type === "email") {
        payload.email = email;
      } else {
        payload.countryCode = "91";
        payload.mobile = mobile;
      }

      const response = await fetch("https://softmaxs.com/api/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success && data.resetToken) {
        setForgotData(prev => ({ ...prev, resetToken: data.resetToken }));
        showMessage("✅ OTP Verified! You can now reset your password.", false);
        setForgotStep(2);
      } else {
        showMessage(`❌ Verification failed: ${data.message || "Invalid OTP."}`, true);
      }
    } catch (error) {
      showMessage("❌ Server error during verification.", true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotResetPassword = async () => {
    showMessage("");
    const { type, email, mobile, resetToken, newPassword, confirmPassword } = forgotData;

    if (!newPassword || !confirmPassword) return showMessage("❌ Please fill all password fields.", true);
    if (newPassword !== confirmPassword) return showMessage("❌ Passwords do not match.", true);
    if (newPassword.length < 6) return showMessage("❌ Minimum 6 characters required.", true);

    try {
      setSubmitting(true);
      let payload = { userType: "expert", type, resetToken, newPassword };

      if (type === "email") {
        payload.email = email;
      } else {
        payload.mobile = mobile;
      }

      const response = await fetch("https://softmaxs.com/api/forgot-password/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        showMessage("🎉 Password reset successful! Redirecting to login...", false);
        setTimeout(() => { resetAllViews("login"); }, 2000);
      } else {
        showMessage(`❌ Reset failed: ${data.message || "Try again."}`, true);
      }
    } catch (error) {
      showMessage("❌ Server error resetting password.", true);
    } finally {
      setSubmitting(false);
    }
  };


  const isLoginValid = loginEmail && loginPassword;
  const isRegisterValid = 
    registerForm.name && 
    registerForm.email && 
    registerForm.phone && 
    registerForm.password &&
    passwordStrength >= 3 &&
    (isForgotMode || (verified.email && verified.phone));

  return (
    <>
      <RegisterLayout
        title={isForgotMode ? "Reset Password" : mode === "login" ? "Welcome back" : "Create your Expert account"}
        subtitle={
          isForgotMode ? "Secure your account" : mode === "login" ? "Log in to continue as expert" : "Start by creating your expert login"
        }
        step={1}
        hasNavbar={true}
        tabs={!isForgotMode ? [
          { label: "Log In", active: mode === "login", onClick: () => resetAllViews("login") },
          { label: "Register", active: mode === "register", onClick: () => resetAllViews("register") },
        ] : []}
      >
        
        {submitting && <Loader />} 

        {setupCompleted && !isForgotMode && (
          <div style={{ background: "#ecfeff", border: "1px solid #67e8f9", color: "#0e7490", padding: "10px", borderRadius: "8px", marginBottom: "16px", textAlign: "center", fontWeight: 500 }}>
            🎉 Setup completed! Please login to start earning.
          </div>
        )}

        {apiMessage.text && (
          <div style={{ margin: "12px 0", padding: "10px", background: apiMessage.isError ? "rgba(239, 68, 68, 0.12)" : "rgba(34, 197, 94, 0.12)", border: apiMessage.isError ? "1px solid rgba(239, 68, 68, 0.35)" : "1px solid rgba(34, 197, 94, 0.35)", color: apiMessage.isError ? "#ef4444" : "#22c55e", borderRadius: 8, textAlign: "center", fontSize: 14, fontWeight: "500" }}>
            {apiMessage.text}
          </div>
        )}

        {error && <ErrorMessage message={error} />}

        {/* ================= LOGIN FORM ================= */}
        {!isForgotMode && mode === "login" && (
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
              />
            </Field>

            <div style={{ textAlign: "right", marginTop: "-10px" }}>
              <span onClick={() => { setIsForgotMode(true); showMessage(""); }} style={{ color: "#000080", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                Forgot Password?
              </span>
            </div>
          </FormGrid>
        )}

        {/* ================= REGISTER FORM ================= */}
        {!isForgotMode && mode === "register" && (
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
                disabled={verified.email || submitting || loading}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
              />
              <SecondaryButton 
                type="button" 
                style={{ marginTop: "4px" }}
                onClick={() => openOtp("email")} 
                disabled={verified.email || loadingType === "email" || submitting || loading}
              >
                {verified.email ? "Verified" : loadingType === "email" ? "..." : "Verify Email"}
              </SecondaryButton>
            </Field>

            <Field>
              <Label>Mobile Number</Label>
              <Input
                type="tel"
                placeholder="9876543210"
                value={registerForm.phone}
                disabled={verified.phone || submitting || loading}
                onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
              />
              <SecondaryButton 
                type="button" 
                style={{ marginTop: "4px" }}
                onClick={() => openOtp("phone")} 
                disabled={verified.phone || loadingType === "phone" || submitting || loading}
              >
                {verified.phone ? "Verified" : loadingType === "phone" ? "..." : "Verify Mobile"}
              </SecondaryButton>
            </Field>

            <Field>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Create strong password"
                disabled={submitting || loading}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              />
              {registerForm.password && (
                <PasswordStrength>
                  <div style={{ width: `${(passwordStrength / 5) * 100}%`, backgroundColor: getStrengthColor(passwordStrength) }} />
                  <span style={{ color: getStrengthColor(passwordStrength), fontWeight: 500 }}>
                    {getStrengthText(passwordStrength)}
                  </span>
                </PasswordStrength>
              )}
            </Field>
          </FormGrid>
        )}

        {/* ================= 🛡️ FORGOT PASSWORD UI SECTION 🛡️ ================= */}
        {isForgotMode && (
          <FormGrid>
            {(forgotStep === 1 || forgotStep === 1.5) && (
              <>
                <div style={{ display: "flex", gap: "12px" }}>
                  <SecondaryButton 
                    type="button" 
                    style={{ flex: 1, background: forgotData.type === 'email' ? '#000080' : '#fff', color: forgotData.type === 'email' ? '#fff' : '#000080' }} 
                    onClick={() => { setForgotData(prev => ({ ...prev, type: "email" })); setForgotStep(1); }}
                    disabled={forgotStep > 1.4 || submitting || loading}
                  >
                    Email
                  </SecondaryButton>
                  <SecondaryButton 
                    type="button" 
                    style={{ flex: 1, background: forgotData.type === 'mobile' ? '#000080' : '#fff', color: forgotData.type === 'mobile' ? '#fff' : '#000080' }} 
                    onClick={() => { setForgotData(prev => ({ ...prev, type: "mobile" })); setForgotStep(1); }}
                    disabled={forgotStep > 1.4 || submitting || loading}
                  >
                    Mobile
                  </SecondaryButton>
                </div>

                <Field>
                  <Label>{forgotData.type === "email" ? "Email Address" : "Mobile Number"}</Label>
                  {forgotData.type === "email" ? (
                    <Input placeholder="Enter Email to Reset" value={forgotData.email} onChange={(e) => setForgotData({...forgotData, email: e.target.value})} disabled={forgotStep > 1.4 || submitting || loading} />
                  ) : (
                    <Input placeholder="Enter Mobile to Reset" value={forgotData.mobile} onChange={(e) => setForgotData({...forgotData, mobile: e.target.value})} disabled={forgotStep > 1.4 || submitting || loading} />
                  )}
                </Field>

                {forgotStep === 1 && (
                  <PrimaryButton type="button" onClick={handleForgotSendOtp} disabled={submitting || loading}>
                    {submitting || loading ? "Sending OTP..." : "Send OTP"}
                  </PrimaryButton>
                )}
              </>
            )}

            {forgotStep === 1.5 && (
              <Field>
                <Label>Enter 4-digit OTP</Label>
                <Input placeholder="Enter 4-digit OTP" value={forgotData.otp} onChange={(e) => setForgotData({...forgotData, otp: e.target.value})} maxLength={4} disabled={submitting || loading} />
                <PrimaryButton type="button" style={{ marginTop: "12px" }} onClick={handleForgotVerifyOtp} disabled={submitting || loading || forgotData.otp.length !== 4}>
                  {submitting || loading ? "Verifying..." : "Verify OTP & Continue"}
                </PrimaryButton>
              </Field>
            )}

            {forgotStep === 2 && (
              <>
                <Field>
                  <Label>New Password</Label>
                  <Input type="password" placeholder="Enter New Password" value={forgotData.newPassword} onChange={(e) => setForgotData({...forgotData, newPassword: e.target.value})} disabled={submitting || loading} />
                </Field>
                <Field>
                  <Label>Confirm New Password</Label>
                  <Input type="password" placeholder="Confirm Password" value={forgotData.confirmPassword} onChange={(e) => setForgotData({...forgotData, confirmPassword: e.target.value})} disabled={submitting || loading} />
                </Field>
                <PrimaryButton type="button" onClick={handleForgotResetPassword} disabled={submitting || loading}>
                  {submitting || loading ? "Updating Password..." : "Update Password"}
                </PrimaryButton>
              </>
            )}

            <div style={{ textAlign: "center" }}>
              <ToggleLink onClick={() => resetAllViews("login")}>
                Back to Login
              </ToggleLink>
            </div>
          </FormGrid>
        )}

        {/* ================= ACTION BUTTONS ================= */}
        {!isForgotMode && (
          <ActionsRow>
            {mode === "login" ? (
              <PrimaryButton disabled={!isLoginValid || submitting || loading} onClick={handleLogin}>
                {submitting || loading ? "Logging in..." : "Continue with Expert Account →"}
              </PrimaryButton>
            ) : (
              <PrimaryButton disabled={!isRegisterValid || submitting || loading} onClick={handleRegister}>
                {submitting || loading ? "Please wait..." : "Continue →"}
              </PrimaryButton>
            )}
          </ActionsRow>
        )}

        {!isForgotMode && (
          <>
            <Divider />
            <FullRow>
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <small style={{ color: "#94a3b8", fontSize: "14px", fontWeight: 500 }}>
                  {mode === "login" ? "Don't have an expert account?" : "Already have an expert account?"}
                </small>
                <ToggleLink onClick={() => resetAllViews(mode === "login" ? "register" : "login")}>
                  {mode === "login" ? "Create Account" : "Sign In"}
                </ToggleLink>
              </div>
            </FullRow>
          </>
        )}
      </RegisterLayout>

      {showOtp && (
        <OtpModal
          email={registerForm.email}
          phone={registerForm.phone}
          type={verifyType}
          onClose={() => setShowOtp(false)}
          onSuccess={handleOtpVerifySuccess}
        />
      )}
    </>
  );
}