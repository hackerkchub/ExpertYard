// src/apps/expert/pages/register/StepProfile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExpert } from "../../../../shared/context/ExpertContext";
import { createProfileApi, updateExpertProfileApi, getExpertProfileApi } from "../../../../shared/api/expertapi/profile.api";
import useApi from "../../../../shared/hooks/useApi";
import RegisterLayout from "../../components/RegisterLayout";
import Loader from "../../../../shared/components/Loader/Loader";
import { toastify } from "../../../../shared/utils/lazyNotifications";

// ✅ साफ़ सुथरे और पक्के इंपोर्ट्स
import {
  ProfileContainer,
  Field,
  Label,
  Input,
  TextArea,
  FileInput,
  ActionsRow,
  PrimaryButton,
  SecondaryButton,
  FilePreview,
  FileInfo,
  FileName,
  FileSize,
  RemoveFileButton,
  ErrorMessage,
  UploadWidget,
  UploadWidgetIcon,
  DocumentsListWrapper // 👈 लिस्ट के लिए नया रैपर
} from "../../styles/StepProfile.style";

import {
  FiCheck,
  FiX,
  FiFile,
  FiImage,
  FiAlertCircle,
  FiUploadCloud
} from "react-icons/fi";

const MAX_SINGLE_FILE_SIZE = 1.5 * 1024 * 1024;

const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

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

  const [existingFiles, setExistingFiles] = useState({
    profile_photo: false,
    experience_certificate: false,
    marksheet: false,
    aadhar_card: false
  });

  const [fileErrors, setFileErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isLoadingExisting, setIsLoadingExisting] = useState(true);
  const notifyError = (message) => void toastify("error", message);
  const notifySuccess = (message) => void toastify("success", message);

  const { request: createProfile, loading: createLoading } = useApi(createProfileApi);
  const { request: updateProfile, loading: updateLoading } = useApi(updateExpertProfileApi);

  const apiLoading = createLoading || updateLoading;

  useEffect(() => {
    if (!expertData.subCategoryIds?.length) {
      navigate("/expert/register/subcategory");
    }
  }, [expertData.subCategoryIds, navigate]);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!expertData.expertId) {
        setIsLoadingExisting(false);
        return;
      }

      try {
        setIsLoadingExisting(true);
        const res = await getExpertProfileApi(expertData.expertId);
        const profile = res?.data?.data || res?.data;

        if (profile && profile.id) {
          setForm(prev => ({
            ...prev,
            position: profile.position || "",
            description: profile.description || "",
            education: profile.education || "",
            location: profile.location || "",
          }));

          setExistingFiles({
            profile_photo: !!profile.profile_photo,
            experience_certificate: !!profile.experience_certificate,
            marksheet: !!profile.marksheet,
            aadhar_card: !!profile.aadhar_card
          });

          updateExpertData({ profileId: profile.id, profile });
        }
      } catch (err) {
        console.log("No existing profile found");
      } finally {
        setIsLoadingExisting(false);
      }
    };

    loadProfileData();
  }, [expertData.expertId, updateExpertData]);

  const handleChange = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const handleFile = async (k, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SINGLE_FILE_SIZE) {
      setFileErrors(prev => ({ ...prev, [k]: `File must be under ${formatFileSize(MAX_SINGLE_FILE_SIZE)}` }));
      return;
    }

    setFileErrors(prev => ({ ...prev, [k]: null }));
    setForm(p => ({ ...p, [k]: file }));
    setExistingFiles(prev => ({ ...prev, [k]: false }));
  };

  const removeFile = (field) => {
    setForm(prev => ({ ...prev, [field]: null }));
    setExistingFiles(prev => ({ ...prev, [field]: false }));
    setFileErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    const textFields = {
      position: "Position is required",
      description: "Description is required",
      education: "Education is required",
      location: "Location is required"
    };

    for (const [field, message] of Object.entries(textFields)) {
      if (!form[field]?.trim()) {
        notifyError(message);
        return false;
      }
    }

    const requiredFiles = {
      profile_photo: "Profile photo is required",
      experience_certificate: "Experience certificate is required",
      marksheet: "Marksheet is required",
      aadhar_card: "Aadhar card is required"
    };

    for (const [field, message] of Object.entries(requiredFiles)) {
      if (!form[field] && !existingFiles[field]) {
        notifyError(message);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = new FormData();
    payload.append("name", form.name);
    payload.append("email", form.email);
    payload.append("phone", form.phone);
    payload.append("category_id", String(expertData.categoryId));
    payload.append("subcategory_id", String(expertData.subCategoryIds?.[0]));
    payload.append("position", form.position);
    payload.append("description", form.description);
    payload.append("education", form.education);
    payload.append("location", form.location);

    if (form.profile_photo) payload.append("profile_photo", form.profile_photo);
    if (form.experience_certificate) payload.append("experience_certificate", form.experience_certificate);
    if (form.marksheet) payload.append("marksheet", form.marksheet);
    if (form.aadhar_card) payload.append("aadhar_card", form.aadhar_card);

    try {
      const isEdit = !!expertData.profileId;
      const res = isEdit ? await updateProfile(payload) : await createProfile(payload);

      if (!res || !res.success) throw res?.message || "Profile save failed";

      const profile = res.data || res;
      updateExpertData({ profileId: profile?.id, profile });

      notifySuccess("Profile saved successfully! 🎉");
      setTimeout(() => navigate("/expert/register/pricing"), 500);
    } catch (err) {
      setSubmitError(err || "Failed to save profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormComplete = 
    form.position.trim() && 
    form.description.trim() && 
    form.education.trim() && 
    form.location.trim() && 
    (form.profile_photo || existingFiles.profile_photo) &&
    (form.experience_certificate || existingFiles.experience_certificate) &&
    (form.marksheet || existingFiles.marksheet) &&
    (form.aadhar_card || existingFiles.aadhar_card);

  if (isLoadingExisting) {
    return (
      <RegisterLayout title="Checking existing profile..." step={4}>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Loader size="large" />
          <p style={{ marginTop: '20px', color: '#666' }}>Fetching your profile data...</p>
        </div>
      </RegisterLayout>
    );
  }

  const FileFieldUI = ({ field, label, accept }) => (
    <Field style={{ marginBottom: 0 }}>
      <Label>{label} <span style={{ color: '#ef4444' }}>*</span></Label>
      {existingFiles[field] || form[field] ? (
        <FilePreview>
          {field === "profile_photo" ? <FiImage size={20} /> : <FiFile size={20} />}
          <FileInfo>
            <FileName>{form[field]?.name || "Document Uploaded"}</FileName>
            <FileSize>{form[field] ? formatFileSize(form[field].size) : "Cloud Saved"}</FileSize>
          </FileInfo>
          <RemoveFileButton onClick={() => removeFile(field)}>
            <FiX size={16} />
          </RemoveFileButton>
        </FilePreview>
      ) : (
        <UploadWidget>
          <UploadWidgetIcon>
            <FiUploadCloud size={20} />
          </UploadWidgetIcon>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flex: 1 }}>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>Click to upload</p>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Max 1.5MB</span>
          </div>
          <FileInput type="file" accept={accept} onChange={e => handleFile(field, e)} />
        </UploadWidget>
      )}
      {fileErrors[field] && <ErrorMessage><FiAlertCircle /> {fileErrors[field]}</ErrorMessage>}
    </Field>
  );

  return (
    <RegisterLayout title="Build your expert profile" subtitle="All fields are mandatory." step={4}>
      <ProfileContainer>
        
        {/* 📋 Section 1: Basic Info */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", width: "100%" }}>
          <Field><Label>Full Name</Label><Input value={form.name} disabled /></Field>
          <Field><Label>Contact Phone</Label><Input value={form.phone} disabled /></Field>
        </div>
        <Field><Label>Email Address</Label><Input value={form.email} disabled /></Field>

        {/* 📋 Section 2: Professional Info */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", width: "100%" }}>
          <Field>
            <Label>Position / Role <span style={{ color: '#ef4444' }}>*</span></Label>
            <Input value={form.position} onChange={e => handleChange("position", e.target.value)} placeholder="e.g., Software Engineer" />
          </Field>
          <Field>
            <Label>Qualification <span style={{ color: '#ef4444' }}>*</span></Label>
            <Input value={form.education} onChange={e => handleChange("education", e.target.value)} placeholder="e.g., B.Tech, MCA" />
          </Field>
        </div>

        <Field>
          <Label>Working Location <span style={{ color: '#ef4444' }}>*</span></Label>
          <Input value={form.location} onChange={e => handleChange("location", e.target.value)} placeholder="e.g., Indore, India" />
        </Field>

        <Field>
          <Label>About You / Experience <span style={{ color: '#ef4444' }}>*</span></Label>
          <TextArea value={form.description} onChange={e => handleChange("description", e.target.value)} placeholder="Tell us about your years of experience..." rows={4} />
        </Field>

        {/* 📁 Section 3: Documents (Description के ठीक नीचे, एक के नीचे एक) */}
        <div style={{ marginTop: "24px", width: "100%" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b", marginBottom: "16px", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px" }}>
            📁 Document Verification
          </h3>
          
          <DocumentsListWrapper>
            <FileFieldUI field="profile_photo" label="Professional Photo" accept="image/*" />
            <FileFieldUI field="experience_certificate" label="Experience Certificate" accept=".pdf,.jpg,.jpeg,.png" />
            <FileFieldUI field="marksheet" label="Degree / Marksheet" accept=".pdf,.jpg,.jpeg,.png" />
            <FileFieldUI field="aadhar_card" label="Govt. Identity Proof" accept=".pdf,.jpg,.jpeg,.png" />
          </DocumentsListWrapper>
        </div>

      </ProfileContainer>

      {submitError && (
        <div style={{ marginTop: "16px" }}>
          <ErrorMessage><FiAlertCircle /> {submitError}</ErrorMessage>
        </div>
      )}

      <ActionsRow style={{ marginTop: "32px" }}>
        <SecondaryButton onClick={() => navigate("/expert/register/subcategory")}>← Back</SecondaryButton>
        <PrimaryButton onClick={handleSubmit} disabled={apiLoading || !isFormComplete} style={{ opacity: isFormComplete ? 1 : 0.6 }}>
          {apiLoading ? "Saving..." : expertData.profileId ? "Update & Continue →" : "Save & Continue →"}
        </PrimaryButton>
      </ActionsRow>
    </RegisterLayout>
  );
}
