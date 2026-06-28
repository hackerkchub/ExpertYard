import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiInfo, FiDollarSign, FiList, FiType, FiCheckCircle, FiLock, FiUpload, FiFileText, FiLoader } from "react-icons/fi";
import { useExpert } from "../../../../shared/context/ExpertContext";
import * as S from "./CreateService.style";
import expertApi from "../../../../shared/api/expertapi/axiosInstance";

const CreateService = () => {
  const navigate = useNavigate();
  const { expertData, profileLoading } = useExpert();
  const isLoggedIn = !!expertData?.expertId;
  const canCreateService = Boolean(expertData?.can_create_service);

  const [formData, setFormData] = useState({
    title: "",
    deliverables: "",
    description: "",
    price: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [uploadProgress, setUploadProgress] = useState(0);

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
    if (!canCreateService) {
      setMessage({ type: "error", text: "Activate a G9 Expert plan to create and publish services." });
      return;
    }

    setLoading(true);
    setUploadProgress(0);
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
      // Simulate progress for better UX (optional - can be removed if backend provides progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      const response = await expertApi.post("/services", data, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (response.data) {
        setMessage({ type: "success", text: "Service published successfully!" });
        setFormData({ title: "", deliverables: "", description: "", price: "" });
        setImageFile(null);
        
        // Reset progress before navigation
        setTimeout(() => {
          setUploadProgress(0);
          navigate("/expert/myservices");
        }, 800);
      }
    } catch (error) {
      setUploadProgress(0);
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

  if (!canCreateService) {
    return (
      <S.PageWrapper>
        <S.FormContainer style={{ textAlign: "center", padding: "50px" }}>
          <FiLock size={50} color="#0A66C2" />
          <S.SectionTitle style={{ border: "none", textAlign: "center" }}>Upgrade Required</S.SectionTitle>
          <p>Activate a G9 Expert plan to create services, receive bookings, and start earning.</p>
          <S.SubmitButton onClick={() => navigate("/expert/g9-plan")} style={{ marginTop: "20px" }}>
            View Plans
          </S.SubmitButton>
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

          {loading && (
            <S.LoaderContainer>
              <S.ProgressBarWrapper>
                <S.ProgressBar $progress={uploadProgress} />
              </S.ProgressBarWrapper>
              <S.LoaderText>
                <FiLoader className="spinning" />
                Publishing your service... {uploadProgress}%
              </S.LoaderText>
            </S.LoaderContainer>
          )}

          <S.ButtonGroup>
            <S.SubmitButton type="submit" disabled={loading}>
              {loading ? (
                <>
                  <FiLoader className="spinning" />
                  Publishing...
                </>
              ) : (
                "Publish Service"
              )}
            </S.SubmitButton>
          </S.ButtonGroup>
        </S.StyledForm>
      </S.FormContainer>
    </S.PageWrapper>
  );
};

export default CreateService;