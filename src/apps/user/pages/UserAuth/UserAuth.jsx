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
  const [activeTab, setActiveTab] = useState("login");
  const [showOtp, setShowOtp] = useState(false);
  const [verifyType, setVerifyType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // 🔁 Redirect path after login
  const redirectTo = location.state?.from?.pathname || "/";

  const [verified, setVerified] = useState({
    email: false,
    phone: false
  });

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: ""
  });

  /* ================= HANDLERS ================= */

  const handleChange = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  /* ================= LOGIN ================= */

  const handleLogin = async () => {
    if (!form.email || !form.password) return;

    try {
      setLoading(true);
      setSuccessMessage("");

      const res = await login({
        email: form.email,
        password: form.password
      });

      if (res?.success) {
        setSuccessMessage("✅ Login successful. Redirecting...");

        setTimeout(() => {
          navigate(redirectTo, { replace: true });
        }, 1200);
      } else {
        setSuccessMessage("❌ Invalid email or password");
      }
    } catch (err) {
      setSuccessMessage(`❌ ${err.message || "Login failed. Try again."}`);
    } finally {
      setLoading(false);
    }
  };

  /* ================= REGISTER ================= */

  const handleRegister = async () => {
    const { first_name, last_name, email, phone, password } = form;

    if (!first_name || !last_name || !email || !phone || !password) return;
    if (!verified.email || !verified.phone) return;

    try {
      setLoading(true);
      setSuccessMessage("");

      const res = await registerUserApi(form);

      if (res?.success) {
        setSuccessMessage("🎉 Registration successful. Please login.");

        setTimeout(() => {
          setActiveTab("login");
          setSuccessMessage("");
        }, 1500);
      } else {
        setSuccessMessage("❌ Registration failed.");
      }
    } catch (err) {
      setSuccessMessage("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= OTP ================= */

  const openOtp = (type) => {
    setVerifyType(type);
    setShowOtp(true);
  };

  const handleOtpVerify = () => {
    setVerified((prev) => ({ ...prev, [verifyType]: true }));
    setShowOtp(false);
  };

  /* ================= UI ================= */

  return (
    <PageWrap>
      <Card>
        <Caption>Welcome to Expert Yard</Caption>
        <SubCaption>
          Login or create an account to connect with verified experts
        </SubCaption>

        <Tabs>
          <Tab active={activeTab === "login"} onClick={() => setActiveTab("login")}>
            Login
          </Tab>
          <Tab active={activeTab === "register"} onClick={() => setActiveTab("register")}>
            Register
          </Tab>
        </Tabs>

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div
            style={{
              margin: "12px 0",
              padding: "10px",
              background: "rgba(34,197,94,0.12)",
              border: "1px solid rgba(34,197,94,0.35)",
              color: "#22c55e",
              borderRadius: 8,
              textAlign: "center",
              fontSize: 14
            }}
          >
            {successMessage}
          </div>
        )}

        {/* ================= LOGIN ================= */}
        {activeTab === "login" && (
          <Form>
            <InputWrap>
              <FiMail />
              <Input
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange("email")}
              />
            </InputWrap>

            <InputWrap>
              <FiLock />
              <Input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange("password")}
              />
            </InputWrap>

            <PrimaryBtn onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </PrimaryBtn>

            <SwitchText>
              Don’t have an account?{" "}
              <span onClick={() => setActiveTab("register")}>
                Register Here
              </span>
            </SwitchText>
          </Form>
        )}

        {/* ================= REGISTER ================= */}
        {activeTab === "register" && (
          <Form>
            <InputGroup>
              <InputWrap>
                <FiUser />
                <Input
                  placeholder="First Name"
                  value={form.first_name}
                  onChange={handleChange("first_name")}
                />
              </InputWrap>

              <InputWrap>
                <FiUser />
                <Input
                  placeholder="Last Name"
                  value={form.last_name}
                  onChange={handleChange("last_name")}
                />
              </InputWrap>
            </InputGroup>

            {/* PHONE */}
            <InputGroup>
              <InputWrap style={{ opacity: verified.phone ? 0.7 : 1 }}>
                <FiPhone />
                <Input
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  disabled={verified.phone}
                />
              </InputWrap>

              <VerifyBtn onClick={() => openOtp("phone")} disabled={verified.phone}>
                {verified.phone ? (
                  <>
                    <FiCheckCircle /> Verified
                  </>
                ) : (
                  "Verify"
                )}
              </VerifyBtn>
            </InputGroup>

            {/* EMAIL */}
            <InputGroup>
              <InputWrap style={{ opacity: verified.email ? 0.7 : 1 }}>
                <FiMail />
                <Input
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange("email")}
                  disabled={verified.email}
                />
              </InputWrap>

              <VerifyBtn onClick={() => openOtp("email")} disabled={verified.email}>
                {verified.email ? (
                  <>
                    <FiCheckCircle /> Verified
                  </>
                ) : (
                  "Verify"
                )}
              </VerifyBtn>
            </InputGroup>

            <InputWrap>
              <FiLock />
              <Input
                type="password"
                placeholder="Create Password"
                value={form.password}
                onChange={handleChange("password")}
              />
            </InputWrap>

            <PrimaryBtn onClick={handleRegister} disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </PrimaryBtn>

            <SwitchText>
              Already have an account?{" "}
              <span onClick={() => setActiveTab("login")}>
                Login Here
              </span>
            </SwitchText>
          </Form>
        )}
      </Card>

      {/* OTP MODAL */}
      {showOtp && (
        <OtpModal
          email={form.email}
          phone={form.phone}
          onClose={() => setShowOtp(false)}
          onSuccess={handleOtpVerify}
        />
      )}
    </PageWrap>
  );
};

export default UserAuth;
