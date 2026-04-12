import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiInfo, FiDollarSign, FiList, FiType, FiCheckCircle, FiLock, FiUpload, FiFileText } from "react-icons/fi";
import { useExpert } from "../../../../shared/context/ExpertContext";
import * as S from "./CreateService.style";

const CreateService = () => {
  const navigate = useNavigate();
  const { expertData, profileLoading } = useExpert();
  const isLoggedIn = !!expertData?.expertId;

  const [formData, setFormData] = useState({
    title: "",
    deliverables: "",
    description: "",
    price: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    const data = new FormData();
    data.append("expert_id", expertData.expertId);
    data.append("category_id", expertData.categoryId || 1);
    data.append("subcategory_id", expertData.subCategoryIds?.[0] || 1);
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("deliverables", JSON.stringify(formData.deliverables.split(",").map(i => i.trim())));
    
    if (imageFile) {
      data.append("image", imageFile);
    }

    try {
      const response = await axios.post("https://softmaxs.com/api/services", data);
      if (response.data) {
        setMessage({ type: "success", text: "Service published successfully!" });
        setFormData({ title: "", deliverables: "", description: "", price: "" });
        setImageFile(null);
      }
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to create service" });
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) return <S.PageWrapper>Loading Profile...</S.PageWrapper>;

  if (!isLoggedIn) {
    return (
      <S.PageWrapper>
        <S.FormContainer style={{ textAlign: 'center', padding: '50px' }}>
          <FiLock size={50} color="#0A66C2" />
          <S.SectionTitle style={{ border: 'none', textAlign: 'center' }}>Access Denied</S.SectionTitle>
          <p>Please login as an Expert to create a service.</p>
          <S.SubmitButton onClick={() => navigate('/expert/login')} style={{ marginTop: '20px' }}>Go to Login</S.SubmitButton>
        </S.FormContainer>
      </S.PageWrapper>
    );
  }

  return (
    <S.PageWrapper>
      <S.FormContainer>
        <S.FormHeader>
          <h2>Create a New Service</h2>
          <p>Expert: <strong>{expertData.name}</strong></p>
        </S.FormHeader>

        {message.text && (
          <S.Alert $type={message.type}>
            {message.type === "success" ? <FiCheckCircle /> : <FiInfo />}
            {message.text}
          </S.Alert>
        )}

        <S.StyledForm onSubmit={handleSubmit}>
          {/* Compact Image Upload Status */}
          <S.CompactUploadBox>
            <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            {imageFile ? (
              <S.FileStatus>
                <FiFileText color="#057642" size={20} />
                <div className="info">
                  <span className="filename">{imageFile.name}</span>
                  <span className="status">Ready to upload</span>
                </div>
                <button type="button" onClick={() => document.getElementById('imageInput').click()}>Change</button>
              </S.FileStatus>
            ) : (
              <S.UploadTrigger onClick={() => document.getElementById('imageInput').click()}>
                <FiUpload /> Click to upload service image
              </S.UploadTrigger>
            )}
          </S.CompactUploadBox>

          <S.FormGrid>
            <S.InputGroup>
              <label><FiType /> Service Title</label>
              <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. 30 min consultation" required />
            </S.InputGroup>
            
            <S.InputGroup>
              <label><FiDollarSign /> Price (₹)</label>
              <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="500" required />
            </S.InputGroup>
          </S.FormGrid>

          <S.InputGroup>
            <label><FiList /> Deliverables (Comma separated)</label>
            <input name="deliverables" value={formData.deliverables} onChange={handleChange} placeholder="Document, 1-on-1 Call, Support" required />
          </S.InputGroup>

          <S.InputGroup>
            <label><FiInfo /> Description</label>
            <textarea name="description" rows="4" value={formData.description} onChange={handleChange} placeholder="Briefly describe your service..." required />
          </S.InputGroup>

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