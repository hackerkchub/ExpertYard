import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  PageWrap,
  Card,
  Caption,
  SubCaption,
  Tabs,
  Tab,
  Form,
  InputGroup,
  InputWrap,
  Input,
  VerifyBtn,
  PrimaryBtn,
  SwitchText
} from "./UserAuth.styles";

import {
  FiMail,
  FiLock,
  FiUser,
  FiPhone,
  FiCheckCircle
} from "react-icons/fi";

import OtpModal from "../../../expert/components/OtpModal";

// APIs
import { registerUserApi } from "../../../../shared/api/userApi";
import { useAuth } from "../../../../shared/context/UserAuthContext";

const UserAuth = () => {
  // 🧭 Navigation & Auth
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const redirectTo = location.state?.from?.pathname || "/";

  // 📂 Views State (login, register, forgot)
  const [activeTab, setActiveTab] = useState("login");
  const [isForgotMode, setIsForgotMode] = useState(false);

  // ⏱️ Loaders
  const [loading, setLoading] = useState(false);
  const [loadingType, setLoadingType] = useState(null); // 'phone' or 'email'

  // 🔔 Response Messages
  const [apiMessage, setApiMessage] = useState({ text: "", isError: false });

  // 🔑 OTP Modals
  const [showOtp, setShowOtp] = useState(false);
  const [verifyType, setVerifyType] = useState(null); // 'email' or 'phone'

  // ✅ Verification (For Registration)
  const [verified, setVerified] = useState({ email: false, phone: false });

  // 🗃️ Forgot Password State Machine
  const [forgotStep, setForgotStep] = useState(1); // 1: Send OTP, 1.5: Verify OTP, 2: Reset Password
  const [forgotData, setForgotData] = useState({
    type: "email", // 'email' or 'mobile'
    email: "",
    mobile: "",
    otp: "",
    resetToken: "",
    newPassword: "",
    confirmPassword: "" 
  });

  // 📋 Normal Auth Form
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: ""
  });

  /* ================= COMMON HANDLERS ================= */

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleForgotChange = (key) => (e) => {
    setForgotData((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const showMessage = (text, isError = false) => {
    setApiMessage({ text, isError });
  };

  const resetAllViews = (tab) => {
    setActiveTab(tab);
    setIsForgotMode(false);
    setForgotStep(1);
    setForgotData({ type: "email", email: "", mobile: "", otp: "", resetToken: "", newPassword: "", confirmPassword: "" });
    showMessage("");
  };


  /* ================= LOGIN ================= */

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!form.email || !form.password) {
      return showMessage("❌ Please enter email and password.", true);
    }

    try {
      setLoading(true);
      showMessage("");

      const res = await login({
        email: form.email,
        password: form.password
      });

      if (res?.success) {
        showMessage("✅ Login successful. Redirecting...", false);
        setTimeout(() => { navigate(redirectTo, { replace: true }); }, 1200);
      } else {
        showMessage("❌ Invalid email or password. Please try again.", true);
      }
    } catch (err) {
      showMessage(`❌ ${err.message || "Login failed. Try again."}`, true);
    } finally {
      setLoading(false);
    }
  };


  /* ================= REGISTER ================= */

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    const { first_name, last_name, email, phone, password } = form;

    if (!first_name || !last_name || !email || !phone || !password) {
      return showMessage("❌ All fields are required.", true);
    }

    if (!verified.email || !verified.phone) {
      return showMessage("❌ Please verify both email and phone number first.", true);
    }

    try {
      setLoading(true);
      showMessage("");

      const res = await registerUserApi(form);

      if (res?.success) {
        showMessage("🎉 Registration Successful! Please Login to continue.", false);
        setTimeout(() => { resetAllViews("login"); }, 2500);
      } else {
        showMessage(`❌ Registration Failed: ${res?.message || "Please try again."}`, true);
      }
    } catch (err) {
      showMessage(`❌ Error: ${err.message || "Something went wrong on the server."}`, true);
    } finally {
      setLoading(false);
    }
  };


  /* ================= REGISTRATION OTP ================= */

  const openOtp = async (type) => {
    showMessage("");

    if (type === "email" && !form.email) return showMessage("❌ Please enter an email address.", true);
    if (type === "phone" && !form.phone) return showMessage("❌ Please enter a phone number.", true);

    try {
      setLoadingType(type);
      let apiUrl = "";
      let payload = {};

      if (type === "email") {
        apiUrl = "http://softmaxs.com/api/otp/email/send";
        payload = { email: form.email };
      } else {
        apiUrl = "http://softmaxs.com/api/otp/sms/send";
        payload = { countryCode: "91", mobile: form.phone };
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


  /* ================= 🔑 FORGOT PASSWORD FLOW (User Type Fixed) 🔑 ================= */

  // 1️⃣ SEND OTP
  const handleForgotSendOtp = async () => {
    showMessage("");
    const { type, email, mobile } = forgotData;

    if (type === "email" && !email) return showMessage("❌ Please enter email address.", true);
    if (type === "mobile" && !mobile) return showMessage("❌ Please enter mobile number.", true);

    try {
      setLoading(true);
      let payload = { userType: "user", type }; // ✅ userType 'user' fixed

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
        showMessage(`✅ OTP sent to your ${type === 'email' ? 'email' : 'mobile'}. Check inbox!`, false);
        setForgotStep(1.5);
      } else {
        showMessage(`❌ Error: ${data.message}`, true);
      }
    } catch (error) {
      showMessage("❌ Server error. Please try again later.", true);
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ VERIFY OTP
  const handleForgotVerifyOtp = async () => {
    showMessage("");
    const { type, email, mobile, otp } = forgotData;

    if (!otp) return showMessage("❌ Please enter the 4-digit OTP.", true);

    try {
      setLoading(true);
      let payload = { userType: "user", type, otp }; // ✅ userType 'user' fixed

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
        showMessage("✅ OTP Verified! You can now set your new password.", false);
        setForgotStep(2);
      } else {
        showMessage(`❌ OTP Verification failed: ${data.message || "Invalid OTP."}`, true);
      }
    } catch (error) {
      showMessage("❌ Server error during verification.", true);
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ RESET PASSWORD
  const handleForgotResetPassword = async () => {
    showMessage("");
    const { type, email, mobile, resetToken, newPassword, confirmPassword } = forgotData;

    if (!newPassword || !confirmPassword) {
      return showMessage("❌ Please enter and confirm your password.", true);
    }

    if (newPassword !== confirmPassword) {
      return showMessage("❌ Passwords do not match. Please re-check.", true);
    }

    if (newPassword.length < 6) {
      return showMessage("❌ Password must be at least 6 characters long.", true);
    }

    try {
      setLoading(true);
      let payload = { userType: "user", type, resetToken, newPassword }; // ✅ userType 'user' fixed

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
      setLoading(false);
    }
  };

  return (
    <PageWrap>
      <Card>
        <Caption>Welcome to Expert Yard</Caption>
        <SubCaption>Login or create an account to connect with verified experts</SubCaption>

        {!isForgotMode && (
          <Tabs>
            <Tab active={activeTab === "login"} onClick={() => resetAllViews("login")}>Login</Tab>
            <Tab active={activeTab === "register"} onClick={() => resetAllViews("register")}>Register</Tab>
          </Tabs>
        )}

        {isForgotMode && (
          <Caption style={{ fontSize: "20px", color: "#0a66c2", marginBottom: "20px" }}>
            🔑 Forgot Password
          </Caption>
        )}

        {/* 🚦 Notification Bar */}
        {apiMessage.text && (
          <div
            style={{
              margin: "12px 0",
              padding: "10px",
              background: apiMessage.isError ? "rgba(239, 68, 68, 0.12)" : "rgba(34, 197, 94, 0.12)",
              border: apiMessage.isError ? "1px solid rgba(239, 68, 68, 0.35)" : "1px solid rgba(34, 197, 94, 0.35)",
              color: apiMessage.isError ? "#ef4444" : "#22c55e",
              borderRadius: 8,
              textAlign: "center",
              fontSize: 14,
              fontWeight: "500"
            }}
          >
            {apiMessage.text}
          </div>
        )}

        {/* ================= LOGIN UI ================= */}
        {!isForgotMode && activeTab === "login" && (
          <Form onSubmit={(e) => e.preventDefault()}>
            <InputWrap>
              <FiMail />
              <Input placeholder="Email Address" value={form.email} onChange={handleChange("email")} />
            </InputWrap>

            <InputWrap>
              <FiLock />
              <Input type="password" placeholder="Password" value={form.password} onChange={handleChange("password")} />
            </InputWrap>

            <div style={{ textAlign: "right", marginTop: "-10px" }}>
              <span 
                onClick={() => { setIsForgotMode(true); showMessage(""); }} 
                style={{ color: "#0a66c2", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
              >
                Forgot Password?
              </span>
            </div>

            <PrimaryBtn type="button" onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </PrimaryBtn>

            <SwitchText>
              Don’t have an account?{" "}
              <span onClick={() => resetAllViews("register")}>Register Here</span>
            </SwitchText>
          </Form>
        )}

        {/* ================= REGISTER UI ================= */}
        {!isForgotMode && activeTab === "register" && (
          <Form onSubmit={(e) => e.preventDefault()}>
            <InputGroup>
              <InputWrap>
                <FiUser />
                <Input placeholder="First Name" value={form.first_name} onChange={handleChange("first_name")} />
              </InputWrap>
              <InputWrap>
                <FiUser />
                <Input placeholder="Last Name" value={form.last_name} onChange={handleChange("last_name")} />
              </InputWrap>
            </InputGroup>

            <InputGroup>
              <InputWrap style={{ opacity: verified.phone ? 0.7 : 1 }}>
                <FiPhone />
                <Input placeholder="Phone Number" value={form.phone} onChange={handleChange("phone")} disabled={verified.phone} />
              </InputWrap>
              <VerifyBtn type="button" onClick={() => openOtp("phone")} disabled={verified.phone || loadingType === "phone"}>
                {verified.phone ? <><FiCheckCircle /> Verified</> : loadingType === "phone" ? "Sending..." : "Verify"}
              </VerifyBtn>
            </InputGroup>

            <InputGroup>
              <InputWrap style={{ opacity: verified.email ? 0.7 : 1 }}>
                <FiMail />
                <Input placeholder="Email Address" value={form.email} onChange={handleChange("email")} disabled={verified.email} />
              </InputWrap>
              <VerifyBtn type="button" onClick={() => openOtp("email")} disabled={verified.email || loadingType === "email"}>
                {verified.email ? <><FiCheckCircle /> Verified</> : loadingType === "email" ? "Sending..." : "Verify"}
              </VerifyBtn>
            </InputGroup>

            <InputWrap>
              <FiLock />
              <Input type="password" placeholder="Create Password" value={form.password} onChange={handleChange("password")} />
            </InputWrap>

            <PrimaryBtn type="button" onClick={handleRegister} disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </PrimaryBtn>

            <SwitchText>
              Already have an account?{" "}
              <span onClick={() => resetAllViews("login")}>Login Here</span>
            </SwitchText>
          </Form>
        )}

        {/* ================= 🛡️ FORGOT PASSWORD UI SECTION 🛡️ ================= */}
        {isForgotMode && (
          <Form onSubmit={(e) => e.preventDefault()}>
            
            {(forgotStep === 1 || forgotStep === 1.5) && (
              <>
                <div style={{ display: "flex", gap: "12px" }}>
                  <VerifyBtn 
                    type="button" 
                    style={{ flex: 1, background: forgotData.type === 'email' ? '#0a66c2' : '#fff', color: forgotData.type === 'email' ? '#fff' : '#0a66c2' }} 
                    onClick={() => { setForgotData(prev => ({ ...prev, type: "email" })); setForgotStep(1); }}
                    disabled={forgotStep > 1.4}
                  >
                    Use Email
                  </VerifyBtn>
                  <VerifyBtn 
                    type="button" 
                    style={{ flex: 1, background: forgotData.type === 'mobile' ? '#0a66c2' : '#fff', color: forgotData.type === 'mobile' ? '#fff' : '#0a66c2' }} 
                    onClick={() => { setForgotData(prev => ({ ...prev, type: "mobile" })); setForgotStep(1); }}
                    disabled={forgotStep > 1.4}
                  >
                    Use Mobile
                  </VerifyBtn>
                </div>

                {forgotData.type === "email" ? (
                  <InputWrap style={{ opacity: forgotStep > 1.4 ? 0.7 : 1 }}>
                    <FiMail />
                    <Input placeholder="Enter Email to Reset" value={forgotData.email} onChange={handleForgotChange("email")} disabled={forgotStep > 1.4} />
                  </InputWrap>
                ) : (
                  <InputWrap style={{ opacity: forgotStep > 1.4 ? 0.7 : 1 }}>
                    <FiPhone />
                    <Input placeholder="Enter Mobile Number" value={forgotData.mobile} onChange={handleForgotChange("mobile")} disabled={forgotStep > 1.4} />
                  </InputWrap>
                )}

                {forgotStep === 1 && (
                  <PrimaryBtn type="button" onClick={handleForgotSendOtp} disabled={loading}>
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </PrimaryBtn>
                )}
              </>
            )}

            {forgotStep === 1.5 && (
              <>
                <InputWrap>
                  <FiCheckCircle />
                  <Input placeholder="Enter 4-digit OTP" value={forgotData.otp} onChange={handleForgotChange("otp")} maxLength={4} />
                </InputWrap>
                <PrimaryBtn type="button" onClick={handleForgotVerifyOtp} disabled={loading}>
                  {loading ? "Verifying..." : "Verify OTP & Continue"}
                </PrimaryBtn>
              </>
            )}

            {forgotStep === 2 && (
              <>
                <InputWrap>
                  <FiLock />
                  <Input 
                    type="password" 
                    placeholder="Enter New Password" 
                    value={forgotData.newPassword} 
                    onChange={handleForgotChange("newPassword")} 
                  />
                </InputWrap>
                <InputWrap>
                  <FiLock />
                  <Input 
                    type="password" 
                    placeholder="Confirm New Password" 
                    value={forgotData.confirmPassword} 
                    onChange={handleForgotChange("confirmPassword")} 
                  />
                </InputWrap>
                <PrimaryBtn type="button" onClick={handleForgotResetPassword} disabled={loading}>
                  {loading ? "Updating Password..." : "Update Password"}
                </PrimaryBtn>
              </>
            )}

            <SwitchText>
              Remember your password?{" "}
              <span onClick={() => resetAllViews("login")}>Back to Login</span>
            </SwitchText>
          </Form>
        )}

      </Card>

      {showOtp && (
        <OtpModal
          email={form.email}
          phone={form.phone}
          type={verifyType}
          onClose={() => setShowOtp(false)}
          onSuccess={handleOtpVerifySuccess}
        />
      )}
    </PageWrap>
  );
};

export default UserAuth;