import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiMail,
  FiLock,
  FiLogIn,
  FiEye,
  FiEyeOff,
  FiShield,
  FiAlertCircle,
  FiKey,
  FiRefreshCw,
} from "react-icons/fi";
import { MdAdminPanelSettings } from "react-icons/md";

import {
  LoginContainer,
  LoginCard,
  LogoSection,
  LogoIcon,
  LogoText,
  Subtitle,
  Form,
  FormGroup,
  Label,
  InputWrapper,
  InputIcon,
  Input,
  PasswordToggle,
  OptionsRow,
  Checkbox,
  LoginButton,
  Spinner,
  ErrorMessage,
  Footer,
  FooterText,
  SecurityBadge,
} from "../styles/AdminLogin.styles";
import {
  adminLoginApi,
  adminVerifyMfaApi,
  adminResendMfaApi,
} from "../../../shared/api/admin/auth.api";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // MFA State
  const [mfaRequired, setMfaRequired] = useState(false);
  const [mfaToken, setMfaToken] = useState("");
  const [otp, setOtp] = useState("");
  const [resending, setResending] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMsg("");

      const res = await adminLoginApi(formData);

      if (res.data?.mfa_required) {
        setMfaRequired(true);
        setMfaToken(res.data.mfa_token);
        setSuccessMsg(res.data.message || "MFA verification code sent to your email");
        return;
      }

      if (res.data?.token) {
        localStorage.setItem("admin_token", res.data.token);
        if (rememberMe) {
          localStorage.setItem("adminRemember", "true");
        }
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (err) {
      console.log("LOGIN ERROR →", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (e) => {
    e.preventDefault();

    if (!otp || otp.length < 4) {
      setError("Please enter a valid MFA code");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await adminVerifyMfaApi({
        mfa_token: mfaToken,
        otp: otp.trim(),
      });

      if (res.data?.token) {
        localStorage.setItem("admin_token", res.data.token);
        if (rememberMe) {
          localStorage.setItem("adminRemember", "true");
        }
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (err) {
      console.log("MFA VERIFY ERROR →", err);
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "MFA verification failed. Please check your code.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleMfaResend = async () => {
    try {
      setResending(true);
      setError("");
      setSuccessMsg("");

      const res = await adminResendMfaApi({ mfa_token: mfaToken });
      setSuccessMsg(res.data?.message || "A new MFA code has been sent to your email");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to resend MFA code";
      setError(message);
    } finally {
      setResending(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LogoSection>
          <LogoIcon>
            <MdAdminPanelSettings />
          </LogoIcon>
          <LogoText>
            Admin<span>Panel</span>
          </LogoText>
          <Subtitle>
            {mfaRequired
              ? "Enter 2FA verification code sent to email"
              : "Sign in to access the admin dashboard"}
          </Subtitle>
        </LogoSection>

        {error && (
          <ErrorMessage>
            <FiAlertCircle size={18} />
            {error}
          </ErrorMessage>
        )}

        {successMsg && !error && (
          <div
            style={{
              padding: "10px 14px",
              marginBottom: "16px",
              borderRadius: "8px",
              backgroundColor: "#eef2ff",
              color: "#3730a3",
              fontSize: "14px",
              border: "1px solid #c7d2fe",
            }}
          >
            {successMsg}
          </div>
        )}

        {!mfaRequired ? (
          <Form onSubmit={handleLoginSubmit}>
            <FormGroup>
              <Label>
                <FiMail size={16} />
                Email Address
              </Label>
              <InputWrapper>
                <InputIcon>
                  <FiMail />
                </InputIcon>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="abc@example.com"
                  disabled={loading}
                  autoComplete="email"
                />
              </InputWrapper>
            </FormGroup>

            <FormGroup>
              <Label>
                <FiLock size={16} />
                Password
              </Label>
              <InputWrapper>
                <InputIcon>
                  <FiLock />
                </InputIcon>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="current-password"
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </PasswordToggle>
              </InputWrapper>
            </FormGroup>

            <OptionsRow>
              <Checkbox>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
                Remember me
              </Checkbox>
            </OptionsRow>

            <LoginButton type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <FiLogIn />
                </>
              )}
            </LoginButton>
          </Form>
        ) : (
          <Form onSubmit={handleMfaSubmit}>
            <FormGroup>
              <Label>
                <FiKey size={16} />
                MFA Verification Code
              </Label>
              <InputWrapper>
                <InputIcon>
                  <FiKey />
                </InputIcon>
                <Input
                  type="text"
                  name="otp"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter 4-digit code"
                  disabled={loading}
                  maxLength={6}
                  autoFocus
                />
              </InputWrapper>
            </FormGroup>

            <OptionsRow style={{ justifyContent: "flex-end", marginTop: "-8px" }}>
              <button
                type="button"
                onClick={handleMfaResend}
                disabled={loading || resending}
                style={{
                  background: "none",
                  border: "none",
                  color: "#4f46e5",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <FiRefreshCw size={14} className={resending ? "animate-spin" : ""} />
                {resending ? "Resending..." : "Resend Code"}
              </button>
            </OptionsRow>

            <LoginButton type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner />
                  Verifying Code...
                </>
              ) : (
                <>
                  Verify & Continue
                  <FiShield />
                </>
              )}
            </LoginButton>
          </Form>
        )}

        <Footer>
          <FooterText>
            Protected by <span>G9Expert</span> Security
          </FooterText>
          <SecurityBadge>
            <FiShield />
            Secure & Encrypted Connection
          </SecurityBadge>
        </Footer>
      </LoginCard>
    </LoginContainer>
  );
};

export default AdminLogin;