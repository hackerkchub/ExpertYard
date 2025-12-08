import React from "react";
import { useNavigate } from "react-router-dom";
import { useExpertRegister } from "../../context/ExpertRegisterContext";
import RegisterLayout from "../../components/RegisterLayout";
import OtpModal from "../../components/OtpModal";

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
  const { data, updateField } = useExpertRegister();

  const [mode, setMode] = React.useState("login"); // login | register
  const [showOtp, setShowOtp] = React.useState(false);

  // login state
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPassword, setLoginPassword] = React.useState("");

  const canRegister =
    data.name && data.email && data.phone && data.password;

  const canLogin =
    loginEmail && loginPassword;

  function handleRegister() {
    // Send OTP API
    setShowOtp(true);
  }

  function handleOtpSuccess() {
    setShowOtp(false);
    navigate("/expert/register/category");
  }

  function handleLogin() {
    // Login API
    navigate("/expert");
  }

  return (
    <>
      <RegisterLayout
        title={mode === "login" ? "Welcome back" : "Create your Expert account"}
        subtitle={mode === "login"
          ? "Log in to continue as expert"
          : "Start by creating your expert login"}
        step={1}
        tabs={[
          { label: "Log In", active: mode === "login", onClick: ()=>setMode("login") },
          { label: "Register", active: mode === "register", onClick: ()=>setMode("register") },
        ]}
      >

        {mode === "login" && (
          <FormGrid>
            <Field>
              <Label>Email</Label>
              <Input
                type="email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </Field>

            <Field>
              <Label>Password</Label>
              <Input
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="Your password"
              />
            </Field>

            <FullRow>
              <small style={{ fontSize: 12, color: "#6b7280" }}>
                Forgot password?
              </small>
            </FullRow>
          </FormGrid>
        )}

        {mode === "register" && (
          <FormGrid>
            <Field>
              <Label>Full Name</Label>
              <Input
                value={data.name}
                onChange={e => updateField("name", e.target.value)}
                placeholder="e.g. Dr. Rohan Sharma"
              />
            </Field>

            <Field>
              <Label>Email</Label>
              <Input
                type="email"
                value={data.email}
                onChange={e => updateField("email", e.target.value)}
                placeholder="name@example.com"
              />
            </Field>

            <Field>
              <Label>Mobile</Label>
              <Input
                value={data.phone}
                onChange={e => updateField("phone", e.target.value)}
                placeholder="+91-9876543210"
              />
            </Field>

            <Field>
              <Label>Password</Label>
              <Input
                type="password"
                value={data.password}
                onChange={e => updateField("password", e.target.value)}
                placeholder="Minimum 8 characters"
              />
            </Field>
          </FormGrid>
        )}

        <ActionsRow>
          {mode === "login" ? (
            <PrimaryButton disabled={!canLogin} onClick={handleLogin}>
              Log In →
            </PrimaryButton>
          ) : (
            <PrimaryButton disabled={!canRegister} onClick={handleRegister}>
              Send OTP →
            </PrimaryButton>
          )}
        </ActionsRow>

        {mode === "login" && (
          <FullRow style={{ textAlign: "center" }}>
            <small style={{ fontSize: 13, color: "#6b7280" }}>
              Don’t have an account?
              <span
                style={{ color: "#0ea5ff", marginLeft: 4, cursor: "pointer" }}
                onClick={() => setMode("register")}
              >
                Create one
              </span>
            </small>
          </FullRow>
        )}

        {mode === "register" && (
          <FullRow style={{ textAlign: "center" }}>
            <small style={{ fontSize: 13, color: "#6b7280" }}>
              Already registered?
              <span
                style={{ color: "#0ea5ff", marginLeft: 4, cursor: "pointer" }}
                onClick={() => setMode("login")}
              >
                Log in
              </span>
            </small>
          </FullRow>
        )}
      </RegisterLayout>

      {showOtp && (
        <OtpModal
          email={data.email}
          phone={data.phone}
          onClose={() => setShowOtp(false)}
          onSuccess={handleOtpSuccess}
        />
      )}
    </>
  );
}
