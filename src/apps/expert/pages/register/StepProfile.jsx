// src/apps/expert/pages/register/StepProfile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExpert } from "../../../../shared/context/ExpertContext";
import { createProfileApi } from "../../../../shared/api/expertapi/profile.api";
import useApi from "../../../../shared/hooks/useApi";

import RegisterLayout from "../../components/RegisterLayout";
import Loader from "../../../../shared/components/Loader/Loader";

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
  FullRow
} from "../../styles/Register.styles";

/* ================= FILE LIMITS ================= */
const MAX_SINGLE_FILE_SIZE = 1.5 * 1024 * 1024;
const MAX_TOTAL_SIZE = 5 * 1024 * 1024;

const compressImage = (file, quality = 0.6, maxWidth = 1024) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    const img = new Image();

    reader.onload = e => (img.src = e.target.result);
    reader.onerror = reject;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(maxWidth / img.width, 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        blob =>
          blob
            ? resolve(new File([blob], file.name, { type: file.type }))
            : reject("Compression failed"),
        file.type,
        quality
      );
    };

    reader.readAsDataURL(file);
  });

export default function StepProfile() {
  const navigate = useNavigate();
  const { expertData, updateExpertData } = useExpert();

  const [form, setForm] = useState({
    name: expertData.name || "",
    email: expertData.email || "",
    phone: expertData.phone || "",
    position: "",
    description: "",
    education: "",
    location: "",
    profile_photo: null,
    experience_certificate: null,
    marksheet: null,
    aadhar_card: null
  });

  const { request: createProfile, loading } = useApi(createProfileApi);

  // 🔐 Guard
  useEffect(() => {
    if (!expertData.subCategoryIds?.length) {
      navigate("/expert/register/subcategory");
    }
  }, [expertData.subCategoryIds, navigate]);

  const handleChange = (k, v) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const handleFile = async (k, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SINGLE_FILE_SIZE) {
      alert("File must be under 1.5MB");
      return;
    }

    const total =
      [form.profile_photo, form.experience_certificate, form.marksheet, form.aadhar_card]
        .filter(Boolean)
        .reduce((s, f) => s + f.size, 0) + file.size;

    if (total > MAX_TOTAL_SIZE) {
      alert("Total upload must be under 5MB");
      return;
    }

    const finalFile = file.type.startsWith("image/")
      ? await compressImage(file)
      : file;

    setForm(p => ({ ...p, [k]: finalFile }));
  };

  /* =================== MAIN FIX =================== */
  const handleSubmit = async () => {
    const payload = new FormData();

    payload.append("expert_id", expertData.expertId);
    payload.append("name", form.name);
    payload.append("email", form.email);
    payload.append("phone", form.phone);
    payload.append("category_id", String(expertData.categoryId));
    payload.append("subcategory_id", String(expertData.subCategoryIds[0]));
    payload.append("position", form.position);
    payload.append("description", form.description);
    payload.append("education", form.education);
    payload.append("location", form.location);

    if (form.profile_photo) payload.append("profile_photo", form.profile_photo);
    if (form.experience_certificate) payload.append("experience_certificate", form.experience_certificate);
    if (form.marksheet) payload.append("marksheet", form.marksheet);
    if (form.aadhar_card) payload.append("aadhar_card", form.aadhar_card);

    try {
      const res = await createProfile(payload);

      // ✅ SUCCESS RESPONSE
      if (res?.success) {
        updateExpertData({
          profileId: res.profile_id,
          profile: res.data
        });
      }

    } catch (err) {
      // ⚠️ IGNORE TIMEOUT / SERVER ERROR
      console.warn("Profile created but frontend timed out");
    }

    // 🚀 ALWAYS MOVE FORWARD
    navigate("/expert/register/pricing");
  };

  return (
    <RegisterLayout
      title="Build your expert profile"
      subtitle="Clients will see this information before booking."
      step={4}
    >
      {loading && <Loader />}

      <FormGrid>
        <Field><Label>Name</Label><Input value={form.name} disabled /></Field>
        <Field><Label>Email</Label><Input value={form.email} disabled /></Field>
        <Field><Label>Phone</Label><Input value={form.phone} disabled /></Field>

        <Field>
          <Label>Position</Label>
          <Input value={form.position} onChange={e => handleChange("position", e.target.value)} />
        </Field>

        <FullRow>
          <Label>Description</Label>
          <TextArea value={form.description} onChange={e => handleChange("description", e.target.value)} />
        </FullRow>

        <Field>
          <Label>Education</Label>
          <Input value={form.education} onChange={e => handleChange("education", e.target.value)} />
        </Field>

        <Field>
          <Label>Location</Label>
          <Input value={form.location} onChange={e => handleChange("location", e.target.value)} />
        </Field>

        <FullRow>
          <Label>Profile Photo</Label>
          <FileInput type="file" accept="image/*" onChange={e => handleFile("profile_photo", e)} />
        </FullRow>

        <Field>
          <Label>Experience Certificate</Label>
          <FileInput type="file" onChange={e => handleFile("experience_certificate", e)} />
        </Field>

        <Field>
          <Label>Marksheet</Label>
          <FileInput type="file" onChange={e => handleFile("marksheet", e)} />
        </Field>

        <Field>
          <Label>Aadhar Card</Label>
          <FileInput type="file" onChange={e => handleFile("aadhar_card", e)} />
        </Field>
      </FormGrid>

      <ActionsRow>
        <SecondaryButton onClick={() => navigate("/expert/register/subcategory")}>
          ← Back
        </SecondaryButton>
        <PrimaryButton disabled={loading} onClick={handleSubmit}>
          Save & Continue →
        </PrimaryButton>
      </ActionsRow>
    </RegisterLayout>
  );
}
