// src/apps/expert/pages/register/Auth.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useExpert } from "../../../../shared/context/ExpertContext";
import { registerApi, loginApi } from "../../../../shared/api/expertApi/auth.api";
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
  FullRow
} from "../../styles/Register.styles";

export default function Auth() {
  const navigate = useNavigate();
  const { updateExpertData } = useExpert();

  const [mode, setMode] = React.useState("login");
  const [showOtp, setShowOtp] = React.useState(false);

  const [registerForm, setRegisterForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  });

  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");

  const { request: register, loading: registerLoading, error: registerError } =
    useApi(registerApi);

  const { request: login, loading: loginLoading, error: loginError } =
    useApi(loginApi);

  const handleRegister = async () => {
    try {
      const res = await register(registerForm);

      // 🔥 SAVE AUTH DATA IN CONTEXT
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

    /**
     * ✅ REAL RESPONSE STRUCTURE
     * res.data.id
     * res.data.name
     * res.data.email
     * res.data.phone
     */

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
        tabs={[
          { label: "Log In", active: mode === "login", onClick: () => setMode("login") },
          { label: "Register", active: mode === "register", onClick: () => setMode("register") },
        ]}
      >
        {loading && <Loader />}
        {error && <ErrorMessage message={error} />}

        {mode === "login" && (
          <FormGrid>
            <Field>
              <Label>Email or Phone</Label>
              <Input value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
            </Field>
            <Field>
              <Label>Password</Label>
              <Input
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
              />
            </Field>
          </FormGrid>
        )}

        {mode === "register" && (
          <FormGrid>
            <Field>
              <Label>Full Name</Label>
              <Input
                value={registerForm.name}
                onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
              />
            </Field>
            <Field>
              <Label>Email</Label>
              <Input
                value={registerForm.email}
                onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
              />
            </Field>
            <Field>
              <Label>Mobile</Label>
              <Input
                value={registerForm.phone}
                onChange={e => setRegisterForm({ ...registerForm, phone: e.target.value })}
              />
            </Field>
            <Field>
              <Label>Password</Label>
              <Input
                type="password"
                value={registerForm.password}
                onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
              />
            </Field>
          </FormGrid>
        )}

        <ActionsRow>
          {mode === "login" ? (
            <PrimaryButton disabled={!loginEmail || !loginPassword} onClick={handleLogin}>
              Log In →
            </PrimaryButton>
          ) : (
            <PrimaryButton
              disabled={!registerForm.name || !registerForm.email || !registerForm.phone || !registerForm.password}
              onClick={handleRegister}
            >
              Send OTP →
            </PrimaryButton>
          )}
        </ActionsRow>

        <FullRow style={{ textAlign: "center" }}>
          <small style={{ color: "#6b7280" }}>
            {mode === "login" ? "Don’t have an account?" : "Already registered?"}
            <span
              style={{ color: "#0ea5ff", cursor: "pointer", marginLeft: 4 }}
              onClick={() => setMode(mode === "login" ? "register" : "login")}
            >
              {mode === "login" ? "Create one" : "Log in"}
            </span>
          </small>
        </FullRow>
      </RegisterLayout>

      {showOtp && <OtpModal onSuccess={() => setShowOtp(false)} />}
    </>
  );
}
