import React, { useState } from "react";
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

// ✅ USER APIs
import {
  loginUserApi,
  registerUserApi
} from "../../../../shared/api/userApi";

const UserAuth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [showOtp, setShowOtp] = useState(false);
  const [verifyType, setVerifyType] = useState(null); // email | phone
  const [loading, setLoading] = useState(false);

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
    setForm({ ...form, [key]: e.target.value });
  };

  /* ================= LOGIN ================= */

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert("Email & password required");
      return;
    }

    try {
      setLoading(true);
      const res = await loginUserApi({
        email: form.email,
        password: form.password
      });

      if (res?.success) {
        localStorage.setItem("token", res.token);
        alert("Login successful");
      } else {
        alert(res?.message || "Login failed");
      }
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= REGISTER ================= */

  const handleRegister = async () => {
    const { first_name, last_name, email, phone, password } = form;

    if (!first_name || !last_name || !email || !phone || !password) {
      alert("All fields are required");
      return;
    }

    if (!verified.email || !verified.phone) {
      alert("Please verify email and phone");
      return;
    }

    try {
      setLoading(true);
      const res = await registerUserApi(form);

      if (res?.success) {
        alert("Registration successful");
        setActiveTab("login");
      } else {
        alert(res?.message || "Registration failed");
      }
    } catch (err) {
      alert(err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= OTP (BYPASS) ================= */

  const openOtp = (type) => {
    setVerifyType(type);
    setShowOtp(true);
  };

  const handleOtpVerify = () => {
    // 🟢 BYPASS: any OTP accepted
    setVerified((prev) => ({
      ...prev,
      [verifyType]: true
    }));
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
                  disabled={verified.phone}   // 🔒 LOCK
                />
              </InputWrap>

              <VerifyBtn
                onClick={() => openOtp("phone")}
                disabled={verified.phone}
                style={{
                  background: verified.phone
                    ? "linear-gradient(135deg,#16a34a,#22c55e)"
                    : undefined,
                  color: verified.phone ? "#fff" : undefined
                }}
              >
                {verified.phone ? (
                  <>
                    <FiCheckCircle style={{ marginRight: 6 }} />
                    Verified
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
                  disabled={verified.email}   // 🔒 LOCK
                />
              </InputWrap>

              <VerifyBtn
                onClick={() => openOtp("email")}
                disabled={verified.email}
                style={{
                  background: verified.email
                    ? "linear-gradient(135deg,#16a34a,#22c55e)"
                    : undefined,
                  color: verified.email ? "#fff" : undefined
                }}
              >
                {verified.email ? (
                  <>
                    <FiCheckCircle style={{ marginRight: 6 }} />
                    Verified
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

      {/* ================= OTP MODAL ================= */}
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
