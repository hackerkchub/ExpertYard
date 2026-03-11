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
  FullRow,
  FilePreview,
  FileInfo,
  FileName,
  FileSize,
  RemoveFileButton,
  ProgressBar,
  ProgressFill,
  UploadStatus,
  ErrorMessage
} from "../../styles/Register.styles";

import {
  FiUpload,
  FiCheck,
  FiX,
  FiFile,
  FiImage,
  FiAlertCircle
} from "react-icons/fi";

/* ================= FILE LIMITS ================= */
const MAX_SINGLE_FILE_SIZE = 1.5 * 1024 * 1024; // 1.5MB
const MAX_TOTAL_SIZE = 5 * 1024 * 1024; // 5MB

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

const formatFileSize = (bytes) => {
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

  const [uploadProgress, setUploadProgress] = useState({});
  const [fileErrors, setFileErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const { request: createProfile, loading: apiLoading } = useApi(createProfileApi);

  // 🔐 Guard
  useEffect(() => {
    if (!expertData.subCategoryIds?.length) {
      navigate("/expert/register/subcategory");
    }
  }, [expertData.subCategoryIds, navigate]);

  const handleChange = (k, v) =>
    setForm(prev => ({ ...prev, [k]: v }));

  const validateFile = (file, fieldName) => {
    if (file.size > MAX_SINGLE_FILE_SIZE) {
      setFileErrors(prev => ({
        ...prev,
        [fieldName]: `File must be under ${formatFileSize(MAX_SINGLE_FILE_SIZE)}`
      }));
      return false;
    }

    const total =
      [form.profile_photo, form.experience_certificate, form.marksheet, form.aadhar_card]
        .filter(Boolean)
        .reduce((s, f) => s + f.size, 0) + file.size;

    if (total > MAX_TOTAL_SIZE) {
      setFileErrors(prev => ({
        ...prev,
        [fieldName]: `Total upload must be under ${formatFileSize(MAX_TOTAL_SIZE)}`
      }));
      return false;
    }

    setFileErrors(prev => ({ ...prev, [fieldName]: null }));
    return true;
  };

  const handleFile = async (k, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file, k)) return;

    try {
      setUploadProgress(prev => ({ ...prev, [k]: 0 }));

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => ({
          ...prev,
          [k]: Math.min((prev[k] || 0) + 10, 90)
        }));
      }, 100);

      const finalFile = file.type.startsWith("image/")
        ? await compressImage(file)
        : file;

      clearInterval(interval);
      setUploadProgress(prev => ({ ...prev, [k]: 100 }));
      
      setTimeout(() => {
        setForm(p => ({ ...p, [k]: finalFile }));
        setUploadProgress(prev => ({ ...prev, [k]: null }));
      }, 500);

    } catch (error) {
      setFileErrors(prev => ({
        ...prev,
        [k]: "File processing failed. Please try again."
      }));
      setUploadProgress(prev => ({ ...prev, [k]: null }));
    }
  };

  const removeFile = (field) => {
    setForm(prev => ({ ...prev, [field]: null }));
    setFileErrors(prev => ({ ...prev, [field]: null }));
    setUploadProgress(prev => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    const requiredFields = {
      position: "Position is required",
      description: "Description is required",
      education: "Education is required",
      location: "Location is required"
    };

    for (const [field, message] of Object.entries(requiredFields)) {
      if (!form[field]?.trim()) {
        setSubmitError(message);
        return false;
      }
    }

    // Check for file errors
    const hasFileErrors = Object.values(fileErrors).some(error => error !== null);
    if (hasFileErrors) {
      setSubmitError("Please fix file upload errors before submitting");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

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

    const files = [
      { key: "profile_photo", file: form.profile_photo },
      { key: "experience_certificate", file: form.experience_certificate },
      { key: "marksheet", file: form.marksheet },
      { key: "aadhar_card", file: form.aadhar_card }
    ];

    files.forEach(({ key, file }) => {
      if (file) payload.append(key, file);
    });

    try {
      const res = await createProfile(payload);

      if (res?.success) {
        updateExpertData({
          profileId: res.profile_id,
          profile: res.data
        });
        
        // Small delay to show success state
        setTimeout(() => {
          navigate("/expert/register/pricing");
        }, 1000);
      } else {
        throw new Error(res?.message || "Failed to create profile");
      }

    } catch (err) {
      setSubmitError(err.message || "Failed to save profile. Please try again.");
      setIsSubmitting(false);
    }
  };

  const FileUploadField = ({ field, label, accept = "*", isImage = false }) => (
    <Field>
      <Label>{label}</Label>
      {!form[field] ? (
        <>
          <FileInput
            type="file"
            accept={accept}
            onChange={e => handleFile(field, e)}
            disabled={uploadProgress[field]}
          />
          {uploadProgress[field] !== null && uploadProgress[field] !== undefined && (
            <ProgressBar>
              <ProgressFill style={{ width: `${uploadProgress[field]}%` }} />
            </ProgressBar>
          )}
        </>
      ) : (
        <FilePreview>
          {isImage ? <FiImage size={20} /> : <FiFile size={20} />}
          <FileInfo>
            <FileName>{form[field].name}</FileName>
            <FileSize>{formatFileSize(form[field].size)}</FileSize>
          </FileInfo>
          <RemoveFileButton onClick={() => removeFile(field)}>
            <FiX />
          </RemoveFileButton>
        </FilePreview>
      )}
      {fileErrors[field] && (
        <ErrorMessage>
          <FiAlertCircle size={14} />
          {fileErrors[field]}
        </ErrorMessage>
      )}
    </Field>
  );

  if (isSubmitting && apiLoading) {
    return (
      <RegisterLayout title="Saving your profile..." step={4}>
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Loader size="large" />
          <p style={{ marginTop: '20px', color: '#666' }}>
            Please wait while we save your information...
          </p>
        </div>
      </RegisterLayout>
    );
  }

  return (
    <RegisterLayout
      title="Build your expert profile"
      subtitle="Clients will see this information before booking."
      step={4}
    >
      <FormGrid>
        <Field>
          <Label>Name</Label>
          <Input value={form.name} disabled />
        </Field>
        
        <Field>
          <Label>Email</Label>
          <Input value={form.email} disabled />
        </Field>
        
        <Field>
          <Label>Phone</Label>
          <Input value={form.phone} disabled />
        </Field>

        <Field>
          <Label>Position *</Label>
          <Input 
            value={form.position} 
            onChange={e => handleChange("position", e.target.value)}
            placeholder="e.g., Senior Software Engineer"
          />
        </Field>

        <FullRow>
          <Label>Description *</Label>
          <TextArea 
            value={form.description} 
            onChange={e => handleChange("description", e.target.value)}
            placeholder="Tell clients about your expertise and experience..."
            rows={4}
          />
        </FullRow>

        <Field>
          <Label>Education *</Label>
          <Input 
            value={form.education} 
            onChange={e => handleChange("education", e.target.value)}
            placeholder="e.g., B.Tech in Computer Science"
          />
        </Field>

        <Field>
          <Label>Location *</Label>
          <Input 
            value={form.location} 
            onChange={e => handleChange("location", e.target.value)}
            placeholder="e.g., Mumbai, India"
          />
        </Field>

        <FileUploadField
          field="profile_photo"
          label="Profile Photo"
          accept="image/*"
          isImage={true}
        />

        <FileUploadField
          field="experience_certificate"
          label="Experience Certificate"
          accept=".pdf,.jpg,.jpeg,.png"
        />

        <FileUploadField
          field="marksheet"
          label="Marksheet"
          accept=".pdf,.jpg,.jpeg,.png"
        />

        <FileUploadField
          field="aadhar_card"
          label="Aadhar Card"
          accept=".pdf,.jpg,.jpeg,.png"
        />

        {submitError && (
          <FullRow>
            <ErrorMessage>
              <FiAlertCircle size={16} />
              {submitError}
            </ErrorMessage>
          </FullRow>
        )}

        <UploadStatus>
          <FiCheck size={16} />
          <span>Max file size: {formatFileSize(MAX_SINGLE_FILE_SIZE)} per file, total {formatFileSize(MAX_TOTAL_SIZE)}</span>
        </UploadStatus>
      </FormGrid>

      <ActionsRow>
        <SecondaryButton 
          onClick={() => navigate("/expert/register/subcategory")}
          disabled={isSubmitting}
        >
          ← Back
        </SecondaryButton>
        <PrimaryButton 
          onClick={handleSubmit}
          disabled={isSubmitting || apiLoading}
        >
          {isSubmitting || apiLoading ? (
            <>
              <Loader size="small" color="white" />
              <span style={{ marginLeft: '8px' }}>Saving...</span>
            </>
          ) : (
            'Save & Continue →'
          )}
        </PrimaryButton>
      </ActionsRow>
    </RegisterLayout>
  );
}