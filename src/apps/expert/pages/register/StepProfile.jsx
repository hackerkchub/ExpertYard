// src/apps/expert/pages/register/StepProfile.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useExpertRegister } from "../../context/ExpertRegisterContext";
import RegisterLayout from "../../components/RegisterLayout";
import {
  FormGrid,
  Field,
  Label,
  Input,
  TextArea,
  FileInput,
  ActionsRow,
  PrimaryButton,
  SecondaryButton,
  FullRow,
} from "../../styles/Register.styles";

export default function StepProfile() {
  const { data, updateField } = useExpertRegister();
  const navigate = useNavigate();

  useEffect(() => {
    if (!data.subcategory_id) {
      navigate("/expert/register/subcategory");
    }
  }, [data.subcategory_id, navigate]);

  const canNext =
    data.position &&
    data.description &&
    data.education &&
    data.location;

  const handleFile = (field, e) => {
    const file = e.target.files?.[0] || null;
    updateField(field, file);
  };

  return (
    <RegisterLayout
      title="Build your expert profile"
      subtitle="Clients will see this information before booking a call with you."
      step={4}
    >
      <FormGrid>
        <Field>
          <Label>Display Name</Label>
          <Input
            value={data.name}
            onChange={e => updateField("name", e.target.value)}
            placeholder="e.g. Dr. Rohan Sharma"
          />
        </Field>

        <Field>
          <Label>Headline / Position</Label>
          <Input
            value={data.position}
            onChange={e => updateField("position", e.target.value)}
            placeholder="e.g. Heart Specialist, Career Mentor"
          />
        </Field>

        <FullRow>
          <Field>
            <Label>Short Bio / Description</Label>
            <TextArea
              value={data.description}
              onChange={e => updateField("description", e.target.value)}
              placeholder="Describe your expertise, approach and what clients can expect from you."
            />
          </Field>
        </FullRow>

        <Field>
          <Label>Education</Label>
          <Input
            value={data.education}
            onChange={e => updateField("education", e.target.value)}
            placeholder="e.g. MBBS, MD (Cardiology), IIT / IIM etc."
          />
        </Field>

        <Field>
          <Label>Location</Label>
          <Input
            value={data.location}
            onChange={e => updateField("location", e.target.value)}
            placeholder="City, Country"
          />
        </Field>

        <FullRow>
          <Label>Profile Photo</Label>
          <FileInput
            type="file"
            accept="image/*"
            onChange={e => handleFile("profile_photo", e)}
          />
        </FullRow>

        <Field>
          <Label>Experience Certificate</Label>
          <FileInput
            type="file"
            onChange={e => handleFile("experience_certificate", e)}
          />
        </Field>

        <Field>
          <Label>Marksheet</Label>
          <FileInput
            type="file"
            onChange={e => handleFile("marksheet", e)}
          />
        </Field>

        <Field>
          <Label>Aadhar Card</Label>
          <FileInput
            type="file"
            onChange={e => handleFile("aadhar_card", e)}
          />
        </Field>
      </FormGrid>

      <ActionsRow>
        <SecondaryButton onClick={() => navigate("/expert/register/subcategory")}>
          ← Back
        </SecondaryButton>

        <PrimaryButton
          disabled={!canNext}
          onClick={() => navigate("/expert/register/pricing")}
        >
          Set Price →
        </PrimaryButton>
      </ActionsRow>
    </RegisterLayout>
  );
}
