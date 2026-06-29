import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiDollarSign,
  FiFile,
  FiFileText,
  FiImage,
  FiInfo,
  FiLayers,
  FiLock,
  FiPackage,
  FiPlus,
  FiTrash2,
  FiType,
  FiUpload,
} from "react-icons/fi";
import { useExpert } from "../../../../shared/context/ExpertContext";
import { createService, uploadServiceFiles } from "../../../../shared/api/service.api";
import * as S from "./CreateService.style";

const allowedAccept =
  ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4,.mp3,.zip";

const serviceTypes = [
  { value: "consultation", label: "Consultation" },
  { value: "digital_product", label: "Digital Product" },
  { value: "digital_package", label: "Digital Package" },
  { value: "course", label: "Course" },
  { value: "custom", label: "Custom" },
];

const productTypeSet = new Set(["digital_product", "digital_package", "course", "custom"]);

const fileType = (file) => file.name.split(".").pop()?.toLowerCase() || "file";

const CreateService = () => {
  const navigate = useNavigate();
  const { expertData, profileLoading } = useExpert();
  const isLoggedIn = !!expertData?.expertId;
  const canCreateService = Boolean(expertData?.can_create_service);

  const [formData, setFormData] = useState({
    title: "",
    service_type: "consultation",
    price: "",
    offer_price: "",
    short_description: "",
    full_description: "",
    deliverables: "",
    delivery_type: "scheduled",
    status: "active",
    preview_enabled: false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [serviceFiles, setServiceFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [uploadProgress, setUploadProgress] = useState(0);

  const isProduct = productTypeSet.has(formData.service_type);

  const deliverables = useMemo(
    () => formData.deliverables.split("\n").map((item) => item.trim()).filter(Boolean),
    [formData.deliverables]
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleServiceTypeChange = (event) => {
    const nextType = event.target.value;
    setFormData((prev) => ({
      ...prev,
      service_type: nextType,
      delivery_type: nextType === "consultation" ? "scheduled" : "instant",
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) setImageFile(file);
  };

  const handleFilesChange = (event) => {
    const nextFiles = Array.from(event.target.files || []).map((file, index) => ({
      id: `${file.name}-${file.lastModified}-${index}`,
      file,
      title: file.name.replace(/\.[^/.]+$/, ""),
      is_preview: index === 0,
      is_paid_content: index !== 0,
      is_downloadable: true,
    }));

    setServiceFiles((prev) => [...prev, ...nextFiles]);
    event.target.value = "";
  };

  const updateFileMeta = (id, key, value) => {
    setServiceFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item))
    );
  };

  const removeFile = (id) => {
    setServiceFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const appendCoreFields = (data) => {
    data.append("expert_id", expertData.expertId);
    data.append("category_id", expertData.categoryId || 1);
    data.append("subcategory_id", expertData.subCategoryIds?.[0] || expertData.subcategory_id || 1);
    data.append("title", formData.title);
    data.append("service_type", formData.service_type);
    data.append("price", formData.price);
    data.append("offer_price", formData.offer_price);
    data.append("short_description", formData.short_description);
    data.append("description", formData.short_description);
    data.append("full_description", formData.full_description);
    data.append("delivery_type", formData.delivery_type);
    data.append("preview_enabled", formData.preview_enabled ? "1" : "0");
    data.append("status", formData.status);
    data.append("deliverables", JSON.stringify(deliverables));
    if (imageFile) data.append("image", imageFile);
  };

  const uploadFilesForService = async (serviceId) => {
    if (!serviceFiles.length) return;

    const filesData = new FormData();
    serviceFiles.forEach((item, index) => {
      filesData.append("files", item.file);
      filesData.append("file_title", item.title || item.file.name);
      filesData.append("is_preview", item.is_preview ? "1" : "0");
      filesData.append("is_paid_content", item.is_paid_content ? "1" : "0");
      filesData.append("is_downloadable", item.is_downloadable ? "1" : "0");
      filesData.append("sort_order", String(index));
    });

    await uploadServiceFiles(serviceId, filesData, (progressEvent) => {
      const total = progressEvent.total || 1;
      setUploadProgress(Math.round((progressEvent.loaded * 100) / total));
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isLoggedIn) return;
    if (!canCreateService) {
      setMessage({ type: "error", text: "Activate a G9 Expert plan to create and publish services." });
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    setMessage({ type: "", text: "" });

    try {
      const data = new FormData();
      appendCoreFields(data);
      const response = await createService(data);
      const serviceId = response.data?.data?.id;

      if (serviceId) {
        await uploadFilesForService(serviceId);
      }

      setUploadProgress(100);
      setMessage({ type: "success", text: "Service published successfully." });
      setTimeout(() => navigate("/expert/myservices"), 700);
    } catch (error) {
      setUploadProgress(0);
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.response?.data?.message || error?.message || "Failed to create service";
      setMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) return <S.PageWrapper>Loading Profile...</S.PageWrapper>;

  if (!isLoggedIn || !canCreateService) {
    return (
      <S.PageWrapper>
        <S.FormContainer style={{ textAlign: "center", padding: "50px" }}>
          <FiLock size={50} color="#0A66C2" />
          <S.SectionTitle style={{ border: "none", textAlign: "center" }}>
            {!isLoggedIn ? "Access Denied" : "Upgrade Required"}
          </S.SectionTitle>
          <p>
            {!isLoggedIn
              ? "Please login as an Expert to create a service."
              : "Activate a G9 Expert plan to create services, receive bookings, and start earning."}
          </p>
          <S.SubmitButton
            onClick={() => navigate(!isLoggedIn ? "/expert/login" : "/expert/g9-plan")}
            style={{ marginTop: "20px" }}
          >
            {!isLoggedIn ? "Go to Login" : "View Plans"}
          </S.SubmitButton>
        </S.FormContainer>
      </S.PageWrapper>
    );
  }

  return (
    <S.PageWrapper>
      <S.FormContainer>
        <S.FormHeader>
          <h2>Universal Service Builder</h2>
          <p>Expert: <strong>{expertData.name}</strong></p>
        </S.FormHeader>

        {message.text && (
          <S.Alert $type={message.type}>
            {message.type === "success" ? <FiCheckCircle /> : <FiInfo />}
            {message.text}
          </S.Alert>
        )}

        <S.StyledForm onSubmit={handleSubmit}>
          <S.BuilderSection>
            <S.SectionTitle><FiType /> Basic Details</S.SectionTitle>
            <S.FormGrid>
              <S.InputGroup>
                <label>Title</label>
                <input name="title" value={formData.title} onChange={handleChange} required />
              </S.InputGroup>
              <S.InputGroup>
                <label>Service Type</label>
                <select name="service_type" value={formData.service_type} onChange={handleServiceTypeChange}>
                  {serviceTypes.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </S.InputGroup>
            </S.FormGrid>

            <S.FormGrid>
              <S.InputGroup>
                <label><FiDollarSign /> Price</label>
                <input name="price" type="number" min="0" step="0.01" value={formData.price} onChange={handleChange} required />
              </S.InputGroup>
              <S.InputGroup>
                <label>Offer Price</label>
                <input name="offer_price" type="number" min="0" step="0.01" value={formData.offer_price} onChange={handleChange} />
              </S.InputGroup>
            </S.FormGrid>

            <S.InputGroup>
              <label><FiInfo /> Short Description</label>
              <textarea
                name="short_description"
                rows="3"
                value={formData.short_description}
                onChange={handleChange}
                required
              />
            </S.InputGroup>

            <S.CompactUploadBox>
              <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} hidden />
              {imageFile ? (
                <S.FileStatus>
                  <FiImage color="#057642" size={20} />
                  <div className="info">
                    <span className="filename">{imageFile.name}</span>
                    <span className="status">Cover image selected</span>
                  </div>
                  <button type="button" onClick={() => document.getElementById("imageInput").click()}>Change</button>
                </S.FileStatus>
              ) : (
                <S.UploadTrigger onClick={() => document.getElementById("imageInput").click()}>
                  <FiUpload /> Upload cover image
                </S.UploadTrigger>
              )}
            </S.CompactUploadBox>
          </S.BuilderSection>

          <S.BuilderSection>
            <S.SectionTitle><FiFileText /> Description</S.SectionTitle>
            <S.InputGroup>
              <label>Full Description</label>
              <textarea
                name="full_description"
                rows="8"
                value={formData.full_description}
                onChange={handleChange}
                placeholder={"Use headings, bullets, and paragraphs. Example:\nWhat you will learn\n- Point one\n- Point two"}
              />
            </S.InputGroup>
            <S.InputGroup>
              <label><FiLayers /> What user will get</label>
              <textarea
                name="deliverables"
                rows="4"
                value={formData.deliverables}
                onChange={handleChange}
                placeholder="One deliverable per line"
              />
            </S.InputGroup>
          </S.BuilderSection>

          {isProduct && (
            <S.BuilderSection>
              <S.SectionTitle><FiPackage /> Media & Files</S.SectionTitle>
              <S.CompactUploadBox>
                <input id="serviceFilesInput" type="file" multiple accept={allowedAccept} onChange={handleFilesChange} hidden />
                <S.UploadTrigger onClick={() => document.getElementById("serviceFilesInput").click()}>
                  <FiPlus /> Add PDFs, videos, docs, images, audio, or ZIP files
                </S.UploadTrigger>
              </S.CompactUploadBox>

              {serviceFiles.length > 0 && (
                <S.FileBuilderList>
                  {serviceFiles.map((item) => (
                    <S.FileBuilderRow key={item.id}>
                      <div className="file-icon"><FiFile /></div>
                      <div className="file-fields">
                        <strong>{item.file.name}</strong>
                        <span>{fileType(item.file).toUpperCase()} · {(item.file.size / 1024 / 1024).toFixed(2)} MB</span>
                        <input
                          value={item.title}
                          onChange={(event) => updateFileMeta(item.id, "title", event.target.value)}
                          placeholder="File title"
                        />
                        <div className="file-flags">
                          <label><input type="checkbox" checked={item.is_preview} onChange={(event) => updateFileMeta(item.id, "is_preview", event.target.checked)} /> Preview/free</label>
                          <label><input type="checkbox" checked={item.is_paid_content} onChange={(event) => updateFileMeta(item.id, "is_paid_content", event.target.checked)} /> Paid content</label>
                          <label><input type="checkbox" checked={item.is_downloadable} onChange={(event) => updateFileMeta(item.id, "is_downloadable", event.target.checked)} /> Downloadable</label>
                        </div>
                      </div>
                      <button type="button" className="remove" onClick={() => removeFile(item.id)}><FiTrash2 /></button>
                    </S.FileBuilderRow>
                  ))}
                </S.FileBuilderList>
              )}
            </S.BuilderSection>
          )}

          <S.BuilderSection>
            <S.SectionTitle><FiCheckCircle /> Publish</S.SectionTitle>
            <S.FormGrid>
              <S.InputGroup>
                <label>Delivery Type</label>
                <select name="delivery_type" value={formData.delivery_type} onChange={handleChange}>
                  <option value="scheduled">Scheduled</option>
                  <option value="instant">Instant Access</option>
                  <option value="manual">Manual Delivery</option>
                  <option value="download">Download</option>
                </select>
              </S.InputGroup>
              <S.InputGroup>
                <label>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="active">Published</option>
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </S.InputGroup>
            </S.FormGrid>
            <S.CheckboxLine>
              <input
                id="preview_enabled"
                type="checkbox"
                name="preview_enabled"
                checked={formData.preview_enabled}
                onChange={handleChange}
              />
              <label htmlFor="preview_enabled">Enable previews for free files</label>
            </S.CheckboxLine>
          </S.BuilderSection>

          {loading && (
            <S.LoaderContainer>
              <S.ProgressBarWrapper>
                <S.ProgressBar $progress={uploadProgress} />
              </S.ProgressBarWrapper>
              <S.LoaderText>Publishing service... {uploadProgress}%</S.LoaderText>
            </S.LoaderContainer>
          )}

          <S.ButtonGroup>
            <S.SubmitButton type="submit" disabled={loading}>
              {loading ? "Publishing..." : "Publish Service"}
            </S.SubmitButton>
          </S.ButtonGroup>
        </S.StyledForm>
      </S.FormContainer>
    </S.PageWrapper>
  );
};

export default CreateService;
