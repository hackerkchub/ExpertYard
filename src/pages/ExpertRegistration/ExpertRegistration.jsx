import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import {
  PageWrap,
  Shell,
  LeftSteps,
  StepItem,
  StepIndex,
  StepLabel,
  RightPane,
  TopBar,
  Title,
  TagLine,
  Section,
  FieldGrid,
  Field,
  LabelRow,
  Label,
  RequiredDot,
  TextInput,
  TextArea,
  InlineRow,
  SmallButton,
  ProfileRow,
  ProfileAvatar,
  UploadHint,
  ChipRow,
  Chip,
  ErrorText,
  StepActions,
  PrimaryBtn,
  SecondaryBtn,
  Divider,
  PreviewBlock,
  PreviewRow,
  PreviewTitle,
  RateRow
} from "./ExpertRegistration.styles.jsx";

import { SUBCATEGORIES } from "../../services/expertService";

import {
  FiMail,
  FiPhone,
  FiUpload,
  FiLock,
  FiUser,
  FiAlertCircle,
  FiCheckCircle,
  FiFileText
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";

/* ---------- Small popups (OTP + Billing) ------------- */
const OtpPopup = ({ mode, onClose, onVerify }) => {
  const [otp, setOtp] = useState("");

  const labelMap = {
    phone: "Mobile",
    email: "Email",
    aadhaar: "Aadhaar"
  };

  return (
    <div className="overlay">
      <div className="modal">
        <h3>Verify {labelMap[mode]}</h3>
        <p className="sub">
          We’ve sent a 6-digit OTP to your {labelMap[mode].toLowerCase()}.  
          (Mock flow for now)
        </p>
        <input
          className="otp-input"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter OTP"
        />
        <div className="modal-actions">
          <button className="ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="primary"
            onClick={() => otp.length === 6 && onVerify()}
            disabled={otp.length !== 6}
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  );
};

const BillingPopup = ({ amount, onClose, onPaid }) => {
  const gst = amount * 0.18;
  const platformFee = amount;
  const total = platformFee + gst;

  return (
    <div className="overlay">
      <div className="modal">
        <h3>Platform Fee</h3>
        <p className="sub">
          A small one-time platform fee is required to complete your
          registration.
        </p>

        <div className="bill-box">
          <div>
            <span>Platform Fee</span>
            <strong>₹{platformFee.toFixed(2)}</strong>
          </div>
          <div>
            <span>GST (18%)</span>
            <strong>₹{gst.toFixed(2)}</strong>
          </div>
          <hr />
          <div className="total">
            <span>Total Payable</span>
            <strong>₹{total.toFixed(2)}</strong>
          </div>
        </div>

        <div className="modal-actions">
          <button className="ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="primary" onClick={onPaid}>
            Pay & Submit
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- MAIN COMPONENT ------------------ */

const ExpertRegistration = () => {
  const [step, setStep] = useState(1);

  // global form state
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    emailVerified: false,
    phone: "",
    phoneVerified: false,
    password: "",
    profileImage: null,

    professionId: "",
    specialityId: "",
    skills: [],
    expYears: "",
    education: "",
    callRate: "",
    chatRate: "",
    shortBio: "",
    longBio: "",

    aadhaar: "",
    aadhaarVerified: false,
    proofFile: null
  });

  const [errors, setErrors] = useState({});
  const [otpMode, setOtpMode] = useState(null); // 'phone' | 'email' | 'aadhaar'
  const [showBilling, setShowBilling] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  /* -------- password strength ---------- */
  const getPasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (!pwd) return { label: "Required", color: "#f97373" };
    if (score <= 1) return { label: "Weak", color: "#f97373" };
    if (score === 2) return { label: "Okay", color: "#facc15" };
    if (score >= 3) return { label: "Strong", color: "#4ade80" };
  };

  const pwdStrength = getPasswordStrength(form.password);

  /* ------------- change helpers --------------- */
  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const toggleSkill = (skill) => {
    setForm((prev) => {
      const exists = prev.skills.includes(skill);
      const skills = exists
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill];
      return { ...prev, skills };
    });
  };

  /* ------------- validations per step -------------- */
  const validateStep1 = () => {
    const e = {};
    if (!form.fullName) e.fullName = "Full name is required";
    if (!form.email) e.email = "Email is required";
    if (!form.emailVerified) e.emailVerified = "Please verify your email";
    if (!form.phone) e.phone = "Mobile number is required";
    if (!form.phoneVerified) e.phoneVerified = "Please verify your mobile";
    if (!form.password) e.password = "Password is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.professionId) e.professionId = "Select a profession";
    if (!form.specialityId) e.specialityId = "Select a speciality";
    if (form.skills.length === 0) e.skills = "Select at least one skill";
    if (!form.expYears) e.expYears = "Experience is required";
    if (!form.education) e.education = "Education is required";
    if (!form.callRate) e.callRate = "Call rate is required";
    if (!form.chatRate) e.chatRate = "Chat rate is required";
    if (!form.shortBio) e.shortBio = "Short bio is required";
    if (!form.longBio) e.longBio = "Detailed bio is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e = {};
    if (!form.aadhaar) e.aadhaar = "Aadhaar number is required";
    if (!form.aadhaarVerified)
      e.aadhaarVerified = "Please verify your Aadhaar via OTP";
    if (!form.proofFile) e.proofFile = "Upload a professional ID / certificate";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    if (step < 4) setStep(step + 1);
    if (step === 4) {
      // open billing popup on final submit
      setShowBilling(true);
    }
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  /* -------- preview helpers --------- */
  const professionLabel =
    form.professionId && SUBCATEGORIES[form.professionId]
      ? form.professionId.charAt(0).toUpperCase() +
        form.professionId.slice(1)
      : "-";

  const specialityLabel =
    form.professionId &&
    form.specialityId &&
    SUBCATEGORIES[form.professionId] &&
    SUBCATEGORIES[form.professionId][form.specialityId];

  return (
    <>
      <Navbar />

      <PageWrap>
        <Shell>
          {/* LEFT SIDE STEPS */}
          <LeftSteps>
            {[1, 2, 3, 4].map((num) => {
              const labels = {
                1: "Personal Info",
                2: "Professional Info",
                3: "Verification",
                4: "Preview & Submit"
              };
              const done = num < step;
              const active = num === step;

              return (
                <StepItem
                  key={num}
                  className={`${active ? "active" : ""} ${
                    done ? "done" : ""
                  }`}
                  onClick={() => {
                    if (num < step) setStep(num); // back allowed but no skipping ahead
                  }}
                >
                  <StepIndex>{num}</StepIndex>
                  <StepLabel>{labels[num]}</StepLabel>
                </StepItem>
              );
            })}
          </LeftSteps>

          {/* RIGHT SIDE FORM */}
          <RightPane>
            <TopBar>
              <div>
                <Title>Become an Expert</Title>
                <TagLine>
                  Create your pro profile and start earning via calls & chats.
                </TagLine>
              </div>
              
            </TopBar>

            {/* STEP CONTENTS */}
            {step === 1 && (
              <Section>
                <FieldGrid>
                  <ProfileRow>
                    <ProfileAvatar>
                      {form.profileImage ? (
                        <img
                          src={URL.createObjectURL(form.profileImage)}
                          alt="profile"
                        />
                      ) : (
                        <FiUser size={34} />
                      )}
                    </ProfileAvatar>
                    <div>
                      <LabelRow>
                        <Label>Profile Photo</Label>
                        <RequiredDot />
                      </LabelRow>
                      <UploadHint>
                        Upload a clear professional headshot (JPG/PNG).
                      </UploadHint>
                      <SmallButton
                        as="label"
                      >
                        <FiUpload />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          hidden
                          onChange={(e) =>
                            update("profileImage", e.target.files[0])
                          }
                        />
                      </SmallButton>
                    </div>
                  </ProfileRow>

                  <Field>
                    <LabelRow>
                      <Label>Full Name</Label>
                      <RequiredDot />
                    </LabelRow>
                    <TextInput
                      icon={<FiUser />}
                      value={form.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                    />
                    {errors.fullName && (
                      <ErrorText>{errors.fullName}</ErrorText>
                    )}
                  </Field>

                  <Field>
                    <LabelRow>
                      <Label>Email Address</Label>
                      <RequiredDot />
                    </LabelRow>
                    <InlineRow>
                      <TextInput
                        icon={<FiMail />}
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                      />
                      <SmallButton onClick={() => setOtpMode("email")}>
                        {form.emailVerified ? (
                          <>
                            <FiCheckCircle />
                            <span>Verified</span>
                          </>
                        ) : (
                          <>
                            <FiAlertCircle />
                            <span>Verify</span>
                          </>
                        )}
                      </SmallButton>
                    </InlineRow>
                    {errors.email && <ErrorText>{errors.email}</ErrorText>}
                    {errors.emailVerified && (
                      <ErrorText>{errors.emailVerified}</ErrorText>
                    )}
                  </Field>

                  <Field>
                    <LabelRow>
                      <Label>Mobile Number</Label>
                      <RequiredDot />
                    </LabelRow>
                    <InlineRow>
                      <TextInput
                        icon={<FiPhone />}
                        value={form.phone}
                        onChange={(e) =>
                          update(
                            "phone",
                            e.target.value.replace(/[^0-9+]/g, "")
                          )
                        }
                      />
                      <SmallButton onClick={() => setOtpMode("phone")}>
                        {form.phoneVerified ? (
                          <>
                            <FiCheckCircle />
                            <span>Verified</span>
                          </>
                        ) : (
                          <>
                            <FiAlertCircle />
                            <span>Verify</span>
                          </>
                        )}
                      </SmallButton>
                    </InlineRow>
                    {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
                    {errors.phoneVerified && (
                      <ErrorText>{errors.phoneVerified}</ErrorText>
                    )}
                  </Field>

                  <Field>
                    <LabelRow>
                      <Label>Create Password</Label>
                      <RequiredDot />
                    </LabelRow>
                    <TextInput
                      icon={<FiLock />}
                      type="password"
                      placeholder="Use 8+ chars, 1 uppercase, 1 number, 1 symbol"
                      value={form.password}
                      onChange={(e) => update("password", e.target.value)}
                    />
                    <InlineRow className="pwd-row">
                      <span
                        style={{
                          fontSize: 12,
                          opacity: 0.8,
                          color: pwdStrength.color
                        }}
                      >
                        Strength: {pwdStrength.label}
                      </span>
                    </InlineRow>
                    {errors.password && (
                      <ErrorText>{errors.password}</ErrorText>
                    )}
                  </Field>
                </FieldGrid>
              </Section>
            )}

            {step === 2 && (
              <Section>
                <FieldGrid>
                  <Field>
                    <LabelRow>
                      <Label>Profession</Label>
                      <RequiredDot />
                    </LabelRow>
                    <select
                      className="select"
                      value={form.professionId}
                      onChange={(e) => {
                        update("professionId", e.target.value);
                        update("specialityId", "");
                      }}
                    >
                      <option value="">Select profession</option>
                      {Object.keys(SUBCATEGORIES).map((id) => (
                        <option key={id} value={id}>
                          {id.charAt(0).toUpperCase() + id.slice(1)}
                        </option>
                      ))}
                    </select>
                    {errors.professionId && (
                      <ErrorText>{errors.professionId}</ErrorText>
                    )}
                  </Field>

                  <Field>
                    <LabelRow>
                      <Label>Speciality</Label>
                      <RequiredDot />
                    </LabelRow>
                    <select
                      className="select"
                      value={form.specialityId}
                      onChange={(e) => update("specialityId", e.target.value)}
                      disabled={!form.professionId}
                    >
                      <option value="">
                        {form.professionId
                          ? "Select speciality"
                          : "Choose profession first"}
                      </option>
                      {form.professionId &&
                        Object.entries(SUBCATEGORIES[form.professionId]).map(
                          ([id, label]) => (
                            <option key={id} value={id}>
                              {label}
                            </option>
                          )
                        )}
                    </select>
                    {errors.specialityId && (
                      <ErrorText>{errors.specialityId}</ErrorText>
                    )}
                  </Field>

                  <Field>
                    <LabelRow>
                      <Label>Expertise / Skills</Label>
                      <RequiredDot />
                    </LabelRow>
                    <ChipRow>
                      {/* profession + subcategories as skills */}
                      {Object.entries(SUBCATEGORIES).map(
                        ([profId, subs]) => (
                          <React.Fragment key={profId}>
                            {Object.values(subs).map((label) => (
                              <Chip
                                key={label}
                                className={
                                  form.skills.includes(label) ? "active" : ""
                                }
                                onClick={() => toggleSkill(label)}
                              >
                                {label}
                              </Chip>
                            ))}
                          </React.Fragment>
                        )
                      )}
                    </ChipRow>
                    {errors.skills && <ErrorText>{errors.skills}</ErrorText>}
                  </Field>

                  <Field>
                    <LabelRow>
                      <Label>Years of Experience</Label>
                      <RequiredDot />
                    </LabelRow>
                    <TextInput
                      type="number"
                      min="0"
                      value={form.expYears}
                      onChange={(e) => update("expYears", e.target.value)}
                    />
                    {errors.expYears && (
                      <ErrorText>{errors.expYears}</ErrorText>
                    )}
                  </Field>

                  <Field>
                    <LabelRow>
                      <Label>Educational Qualification</Label>
                      <RequiredDot />
                    </LabelRow>
                    <TextArea
                      rows={2}
                      value={form.education}
                      onChange={(e) => update("education", e.target.value)}
                    />
                    {errors.education && (
                      <ErrorText>{errors.education}</ErrorText>
                    )}
                  </Field>

                  <Field>
                    <LabelRow>
                      <Label>Rates (₹ per minute)</Label>
                      <RequiredDot />
                    </LabelRow>
                    <RateRow>
                      <TextInput
                        icon={<FaRupeeSign />}
                        type="number"
                        placeholder="Call / min"
                        value={form.callRate}
                        onChange={(e) => update("callRate", e.target.value)}
                      />
                      <TextInput
                        icon={<FaRupeeSign />}
                        type="number"
                        placeholder="Chat / min"
                        value={form.chatRate}
                        onChange={(e) => update("chatRate", e.target.value)}
                      />
                    </RateRow>
                    {errors.callRate && (
                      <ErrorText>{errors.callRate}</ErrorText>
                    )}
                    {errors.chatRate && (
                      <ErrorText>{errors.chatRate}</ErrorText>
                    )}
                  </Field>

                  <Field>
                    <LabelRow>
                      <Label>Short Bio (one line)</Label>
                      <RequiredDot />
                    </LabelRow>
                    <TextInput
                      placeholder="Eg. Senior AI/ML specialist helping startups scale."
                      value={form.shortBio}
                      onChange={(e) => update("shortBio", e.target.value)}
                    />
                    {errors.shortBio && (
                      <ErrorText>{errors.shortBio}</ErrorText>
                    )}
                  </Field>

                  <Field>
                    <LabelRow>
                      <Label>Detailed Bio / Introduction</Label>
                      <RequiredDot />
                    </LabelRow>
                    <TextArea
                      rows={4}
                      placeholder="Share your background, domains you work in, and how you help clients."
                      value={form.longBio}
                      onChange={(e) => update("longBio", e.target.value)}
                    />
                    {errors.longBio && (
                      <ErrorText>{errors.longBio}</ErrorText>
                    )}
                  </Field>
                </FieldGrid>
              </Section>
            )}

            {step === 3 && (
              <Section>
                <FieldGrid>
                  <Field>
                    <LabelRow>
                      <Label>Aadhaar Number</Label>
                      <RequiredDot />
                    </LabelRow>
                    <InlineRow>
                      <TextInput
                        value={form.aadhaar}
                        maxLength={12}
                        onChange={(e) =>
                          update(
                            "aadhaar",
                            e.target.value.replace(/[^0-9]/g, "")
                          )
                        }
                      />
                      <SmallButton onClick={() => setOtpMode("aadhaar")}>
                        {form.aadhaarVerified ? (
                          <>
                            <FiCheckCircle />
                            <span>Verified</span>
                          </>
                        ) : (
                          <>
                            <FiAlertCircle />
                            <span>Verify</span>
                          </>
                        )}
                      </SmallButton>
                    </InlineRow>
                    {errors.aadhaar && (
                      <ErrorText>{errors.aadhaar}</ErrorText>
                    )}
                    {errors.aadhaarVerified && (
                      <ErrorText>{errors.aadhaarVerified}</ErrorText>
                    )}
                  </Field>

                  <Field>
                    <LabelRow>
                      <Label>Professional ID / Certification</Label>
                      <RequiredDot />
                    </LabelRow>
                    <SmallButton as="label">
                      <FiUpload />
                      <span>
                        {form.proofFile
                          ? form.proofFile.name
                          : "Upload document"}
                      </span>
                      <input
                        type="file"
                        hidden
                        onChange={(e) =>
                          update("proofFile", e.target.files[0])
                        }
                      />
                    </SmallButton>
                    <UploadHint>
                      Accepted: Certificates, licenses, employee IDs (PDF/JPG/PNG)
                    </UploadHint>
                    {errors.proofFile && (
                      <ErrorText>{errors.proofFile}</ErrorText>
                    )}
                  </Field>
                </FieldGrid>
              </Section>
            )}

            {step === 4 && (
              <Section>
                <PreviewBlock>
                  <PreviewTitle>Profile Preview</PreviewTitle>

                  <PreviewRow>
                    <span>Name</span>
                    <strong>{form.fullName || "-"}</strong>
                  </PreviewRow>
                  <PreviewRow>
                    <span>Email</span>
                    <strong>{form.email || "-"}</strong>
                  </PreviewRow>
                  <PreviewRow>
                    <span>Mobile</span>
                    <strong>{form.phone || "-"}</strong>
                  </PreviewRow>
                  <Divider />

                  <PreviewRow>
                    <span>Profession</span>
                    <strong>{professionLabel || "-"}</strong>
                  </PreviewRow>
                  <PreviewRow>
                    <span>Speciality</span>
                    <strong>{specialityLabel || "-"}</strong>
                  </PreviewRow>
                  <PreviewRow>
                    <span>Skills</span>
                    <strong>
                      {form.skills.length ? form.skills.join(", ") : "-"}
                    </strong>
                  </PreviewRow>
                  <PreviewRow>
                    <span>Experience</span>
                    <strong>
                      {form.expYears ? `${form.expYears} years` : "-"}
                    </strong>
                  </PreviewRow>
                  <Divider />

                  <PreviewRow>
                    <span>Call Rate</span>
                    <strong>
                      {form.callRate ? `₹${form.callRate}/min` : "-"}
                    </strong>
                  </PreviewRow>
                  <PreviewRow>
                    <span>Chat Rate</span>
                    <strong>
                      {form.chatRate ? `₹${form.chatRate}/min` : "-"}
                    </strong>
                  </PreviewRow>
                  <Divider />

                  <PreviewRow className="bio">
                    <span>Short Bio</span>
                    <p>{form.shortBio || "-"}</p>
                  </PreviewRow>
                  <PreviewRow className="bio">
                    <span>Detailed Bio</span>
                    <p>{form.longBio || "-"}</p>
                  </PreviewRow>

                  <Divider />

                  <PreviewRow>
                    <span>Aadhaar</span>
                    <strong>
                      {form.aadhaarVerified ? "Verified" : "Pending"}
                    </strong>
                  </PreviewRow>
                </PreviewBlock>

                {submitSuccess && (
                  <div style={{ marginTop: 14, fontSize: 14, color: "#4ade80" }}>
                    <FiCheckCircle style={{ marginRight: 6 }} />
                    Your profile has been submitted successfully!
                  </div>
                )}
              </Section>
            )}

            {/* BOTTOM ACTIONS */}
            <StepActions>
              <SecondaryBtn disabled={step === 1} onClick={goBack}>
                Back
              </SecondaryBtn>
              <PrimaryBtn onClick={goNext}>
                {step === 4 ? "Submit & Pay Fee" : "Next Step"}
              </PrimaryBtn>
            </StepActions>
          </RightPane>
        </Shell>

        {/* OTP POPUP */}
        {otpMode && (
          <OtpPopup
            mode={otpMode}
            onClose={() => setOtpMode(null)}
            onVerify={() => {
              if (otpMode === "phone") update("phoneVerified", true);
              if (otpMode === "email") update("emailVerified", true);
              if (otpMode === "aadhaar") update("aadhaarVerified", true);
              setOtpMode(null);
            }}
          />
        )}

        {/* BILLING POPUP */}
        {showBilling && (
          <BillingPopup
            amount={299}
            onClose={() => setShowBilling(false)}
            onPaid={() => {
              setShowBilling(false);
              setSubmitSuccess(true);
            }}
          />
        )}
      </PageWrap>
    </>
  );
};

export default ExpertRegistration;
