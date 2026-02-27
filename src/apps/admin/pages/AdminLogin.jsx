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
  ForgotPassword,
  LoginButton,
  Spinner,
  ErrorMessage,
  Footer,
  FooterText,
  SecurityBadge,
} from "../styles/AdminLogin.styles";
import { adminLoginApi } from "../../../shared/api/admin/auth.api";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const navigate = useNavigate();

  // Track window width for responsive adjustments
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    navigate("/admin/dashboard", { replace: true });
  }
}, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.email || !formData.password) {
    setError("Please enter both email and password");
    return;
  }

  try {
    setLoading(true);
    setError("");

    const res = await adminLoginApi(formData);

    // ✅ TOKEN STORE
    localStorage.setItem("admin_token", res.data.token);

    // ✅ (optional) admin data store
    localStorage.setItem("adminData", JSON.stringify(res.data.admin));

    // ✅ REMEMBER ME (optional logic)
    if (rememberMe) {
      localStorage.setItem("adminRemember", "true");
    } else {
      localStorage.removeItem("adminRemember");
    }

    // ✅ REACT ROUTER REDIRECT (best practice)
    navigate("/admin/dashboard", { replace: true });

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

//   const handleForgotPassword = () => {
//     // Implement forgot password functionality
//     console.log("Forgot password clicked");
//   };

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
            Sign in to access the admin dashboard
          </Subtitle>
        </LogoSection>

        {error && (
          <ErrorMessage>
            <FiAlertCircle size={18} />
            {error}
          </ErrorMessage>
        )}

        <Form onSubmit={handleSubmit}>
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
            {/* <ForgotPassword
              type="button"
              onClick={handleForgotPassword}
              disabled={loading}
            >
              Forgot Password?
            </ForgotPassword> */}
          </OptionsRow>

          <LoginButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <FiLogIn />
              </>
            )}
          </LoginButton>
        </Form>

        <Footer>
          <FooterText>
            Protected by <span>ExpertYard</span> Security
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