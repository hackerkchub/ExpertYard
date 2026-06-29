import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiClipboard, FiX, FiFile, FiLock, FiUnlock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useExpert } from "../../../../shared/context/ExpertContext";
import { getServicesByExpert, updateService, deleteService, uploadServiceFiles, deleteServiceFile } from "../../../../shared/api/service.api";
import * as S from "./MyServices.style";

const MyServices = () => {
  const navigate = useNavigate();
  const { expertData, profileLoading } = useExpert();
  
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Edit Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    price: "",
    description: "",
    short_description: "",
    full_description: "",
    deliverables: "",
    service_type: "consultation",
    offer_price: "",
    delivery_type: "scheduled",
    preview_enabled: false,
    status: "active"
  });
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [editFiles, setEditFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirmation States
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingService, setDeletingService] = useState(null);

  // Helper function to get correct image URL (handles both relative and absolute paths)
  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/200x150?text=No+Image";
    
    // If already full URL
    if (img.startsWith("http")) return img;
    
    // If relative path
    return `https://softmaxs.com/${img}`;
  };

  // Helper function to render deliverables (handles both array and HTML string)
  const renderDeliverables = (deliverables) => {
    if (!deliverables) return null;
    
    // If deliverables is an array
    if (Array.isArray(deliverables)) {
      return (
        <ul>
          {deliverables.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    }
    
    // If deliverables is HTML string
    return <div dangerouslySetInnerHTML={{ __html: deliverables }} />;
  };

  useEffect(() => {
    const fetchServices = async () => {
      if (expertData?.expertId) {
        try {
          setLoading(true);
          const res = await getServicesByExpert(expertData.expertId);
          const data = Array.isArray(res.data) ? res.data : res.data.data || [];
          setServices(Array.isArray(data) ? data : []);
          setError(null);
        } catch (err) {
          console.error("Error fetching services:", err);
          setError("Failed to load services. Please try again.");
          setServices([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchServices();
  }, [expertData?.expertId]);

  // Handle Edit Click
  const handleEditClick = (service) => {
    setEditingService(service);
    setEditFormData({
      title: service.title || "",
      price: service.price || "",
      description: service.short_description || service.description || "",
      short_description: service.short_description || service.description || "",
      full_description: service.full_description || service.description || "",
      deliverables: Array.isArray(service.deliverables) 
        ? service.deliverables.join("\n") 
        : (service.deliverables || ""),
      service_type: service.service_type || "consultation",
      offer_price: service.offer_price || "",
      delivery_type: service.delivery_type || "scheduled",
      preview_enabled: Boolean(service.preview_enabled),
      status: service.status || "active"
    });
    setEditImagePreview(getImageUrl(service.image));
    setEditImage(null);
    setEditFiles(Array.isArray(service.files) ? service.files : []);
    setNewFiles([]);
    setShowEditModal(true);
  };

  // Handle Edit Form Input Change
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle Edit Image Change
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditImage(file);
      const previewUrl = URL.createObjectURL(file);
      setEditImagePreview(previewUrl);
    }
  };

  const handleNewFilesChange = (e) => {
    const files = Array.from(e.target.files || []).map((file, index) => ({
      id: `${file.name}-${file.lastModified}-${index}`,
      file,
      title: file.name.replace(/\.[^/.]+$/, ""),
      is_preview: false,
      is_paid_content: true,
      is_downloadable: true
    }));
    setNewFiles(prev => [...prev, ...files]);
    e.target.value = "";
  };

  const updateNewFileMeta = (id, key, value) => {
    setNewFiles(prev => prev.map(item => item.id === id ? { ...item, [key]: value } : item));
  };

  const removeNewFile = (id) => {
    setNewFiles(prev => prev.filter(item => item.id !== id));
  };

  const handleDeleteExistingFile = async (fileId) => {
    if (!editingService?.id || !window.confirm("Delete this service file?")) return;
    try {
      await deleteServiceFile(editingService.id, fileId);
      setEditFiles(prev => prev.filter(file => file.id !== fileId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete file");
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editFormData.title || !editFormData.price) {
      alert("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("title", editFormData.title);
      formData.append("price", editFormData.price);
      formData.append("description", editFormData.short_description || editFormData.description || "");
      formData.append("short_description", editFormData.short_description || editFormData.description || "");
      formData.append("full_description", editFormData.full_description || editFormData.description || "");
      formData.append("deliverables", JSON.stringify(String(editFormData.deliverables || "").split("\n").map(item => item.trim()).filter(Boolean)));
      formData.append("service_type", editFormData.service_type);
      formData.append("offer_price", editFormData.offer_price || "");
      formData.append("delivery_type", editFormData.delivery_type || "scheduled");
      formData.append("preview_enabled", editFormData.preview_enabled ? "1" : "0");
      formData.append("status", editFormData.status);
      
      if (editImage) {
        formData.append("image", editImage);
      }

      const response = await updateService(editingService.id, formData);
      
      if (response.data.success) {
        if (newFiles.length > 0) {
          const uploadData = new FormData();
          newFiles.forEach((item, index) => {
            uploadData.append("files", item.file);
            uploadData.append("file_title", item.title || item.file.name);
            uploadData.append("is_preview", item.is_preview ? "1" : "0");
            uploadData.append("is_paid_content", item.is_paid_content ? "1" : "0");
            uploadData.append("is_downloadable", item.is_downloadable ? "1" : "0");
            uploadData.append("sort_order", String(editFiles.length + index));
          });
          await uploadServiceFiles(editingService.id, uploadData);
        }
        // Refresh services list
        const refreshRes = await getServicesByExpert(expertData.expertId);
        const updatedServices = Array.isArray(refreshRes.data) ? refreshRes.data : refreshRes.data.data || [];
        setServices(updatedServices);
        setShowEditModal(false);
        setEditingService(null);
        alert("Service updated successfully!");
      } else {
        alert(response.data.message || "Failed to update service");
      }
    } catch (err) {
      console.error("Error updating service:", err);
      alert(err.response?.data?.message || "Failed to update service. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete Click
  const handleDeleteClick = (service) => {
    setDeletingService(service);
    setShowDeleteConfirm(true);
  };

  // Handle Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!deletingService) return;
    
    setSubmitting(true);
    
    try {
      const response = await deleteService(deletingService.id);
      
      if (response.data.success) {
        // Remove from local state
        setServices(prev => prev.filter(s => s.id !== deletingService.id));
        setShowDeleteConfirm(false);
        setDeletingService(null);
        alert("Service deleted successfully!");
      } else {
        alert(response.data.message || "Failed to delete service");
      }
    } catch (err) {
      console.error("Error deleting service:", err);
      alert(err.response?.data?.message || "Failed to delete service. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (profileLoading) return <S.PageWrapper><S.LoadingBox>Loading Profile...</S.LoadingBox></S.PageWrapper>;

  return (
    <S.PageWrapper>
      <S.Container>
        <S.Header>
          <div className="header-text">
            <h1>My Services</h1>
            <p>Manage your professional offerings for <strong>{expertData?.name}</strong></p>
          </div>
          
          {/* Action Buttons Container */}
          <S.ActionGroup>
            <S.BookingButton onClick={() => navigate("/expert/mybookings")}>
              <FiClipboard /> My Bookings
            </S.BookingButton>
            <S.AddButton onClick={() => navigate("/expert/create-services")}>
              <FiPlus /> Create New Service
            </S.AddButton>
          </S.ActionGroup>
        </S.Header>

        {loading ? (
          <S.LoadingBox>Fetching your services...</S.LoadingBox>
        ) : error ? (
          <S.ErrorBox>{error}</S.ErrorBox>
        ) : services.length === 0 ? (
          <S.EmptyState>
            <FiPackage size={50} color="#cbd5e0" />
            <h3>No services found</h3>
            <p>You haven't created any services yet. Start by clicking the button above.</p>
          </S.EmptyState>
        ) : (
          <S.ServiceList>
            {services.map((service) => (
              <S.ServiceCard key={service.id}>
                <S.ServiceImage 
                  src={getImageUrl(service.image)}
                  alt={service.title} 
                />
                
                <S.ServiceInfo>
                  <div className="top-row">
                    <S.StatusBadge $status={service.status}>{service.status || 'Active'}</S.StatusBadge>
                    <S.TypeBadge>{(service.type_label || service.service_type || "Consultation").replace("_", " ")}</S.TypeBadge>
                    <span className="price">
                      {service.offer_price ? (
                        <>
                          <small>₹{parseFloat(service.price || 0).toLocaleString()}</small>
                          ₹{parseFloat(service.offer_price || 0).toLocaleString()}
                        </>
                      ) : (
                        <>₹{parseFloat(service.price || 0).toLocaleString()}</>
                      )}
                    </span>
                  </div>
                  
                  <h3>{service.title}</h3>
                  <p className="description">
                    {service.description ? service.description.substring(0, 100) + "..." : "No description provided."}
                  </p>

                  {service.deliverables && (
                    <S.DeliverablesPreview>
                      <strong>Includes:</strong>
                      {renderDeliverables(service.deliverables)}
                    </S.DeliverablesPreview>
                  )}

                  {Array.isArray(service.files) && service.files.length > 0 && (
                    <S.FileSummary>
                      <FiFile /> {service.files.length} file{service.files.length > 1 ? "s" : ""} attached
                    </S.FileSummary>
                  )}
                </S.ServiceInfo>

                <S.ActionButtons>
                  <button className="edit" onClick={() => handleEditClick(service)} title="Edit Service">
                    <FiEdit2 /> Edit
                  </button>
                  <button className="delete" onClick={() => handleDeleteClick(service)} title="Delete Service">
                    <FiTrash2 />
                  </button>
                </S.ActionButtons>
              </S.ServiceCard>
            ))}
          </S.ServiceList>
        )}
      </S.Container>

      {/* Edit Modal */}
      {showEditModal && (
        <S.ModalOverlay onClick={() => setShowEditModal(false)}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <h2>Edit Service</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>
                <FiX />
              </button>
            </S.ModalHeader>
            
            <S.ModalBody>
              <form onSubmit={handleEditSubmit}>
                <S.FormGroup>
                  <label>Service Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleEditInputChange}
                    placeholder="Enter service title"
                    required
                  />
                </S.FormGroup>

                <S.FormRow>
                  <S.FormGroup>
                    <label>Service Type</label>
                    <select
                      name="service_type"
                      value={editFormData.service_type}
                      onChange={handleEditInputChange}
                    >
                      <option value="consultation">Consultation</option>
                      <option value="digital_product">Digital Product</option>
                      <option value="digital_package">Digital Package</option>
                      <option value="course">Course</option>
                      <option value="custom">Custom</option>
                    </select>
                  </S.FormGroup>

                  <S.FormGroup>
                    <label>Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={editFormData.price}
                      onChange={handleEditInputChange}
                      placeholder="Enter price"
                      required
                      min="0"
                      step="0.01"
                    />
                  </S.FormGroup>
                </S.FormRow>

                <S.FormRow>
                  <S.FormGroup>
                    <label>Offer Price</label>
                    <input
                      type="number"
                      name="offer_price"
                      value={editFormData.offer_price}
                      onChange={handleEditInputChange}
                      placeholder="Optional"
                      min="0"
                      step="0.01"
                    />
                  </S.FormGroup>

                  <S.FormGroup>
                    <label>Status</label>
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleEditInputChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="draft">Draft</option>
                      <option value="pending">Pending</option>
                    </select>
                  </S.FormGroup>
                </S.FormRow>

                <S.FormGroup>
                  <label>Delivery Type</label>
                  <select
                    name="delivery_type"
                    value={editFormData.delivery_type}
                    onChange={handleEditInputChange}
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="instant">Instant Access</option>
                    <option value="manual">Manual Delivery</option>
                    <option value="download">Download</option>
                  </select>
                </S.FormGroup>

                <S.FormGroup>
                  <label>Short Description</label>
                  <textarea
                    name="short_description"
                    value={editFormData.short_description}
                    onChange={handleEditInputChange}
                    placeholder="Describe your service..."
                    rows="4"
                  />
                </S.FormGroup>

                <S.FormGroup>
                  <label>Full Description</label>
                  <textarea
                    name="full_description"
                    value={editFormData.full_description}
                    onChange={handleEditInputChange}
                    placeholder="Use headings, bullets, and paragraphs"
                    rows="6"
                  />
                </S.FormGroup>

                <S.FormGroup>
                  <label>Deliverables (one per line)</label>
                  <textarea
                    name="deliverables"
                    value={editFormData.deliverables}
                    onChange={handleEditInputChange}
                    placeholder="What will you deliver?"
                    rows="5"
                  />
                </S.FormGroup>

                <S.CheckboxRow>
                  <label>
                    <input
                      type="checkbox"
                      name="preview_enabled"
                      checked={editFormData.preview_enabled}
                      onChange={(event) =>
                        setEditFormData(prev => ({ ...prev, preview_enabled: event.target.checked }))
                      }
                    />
                    Enable preview files
                  </label>
                </S.CheckboxRow>

                <S.FormGroup>
                  <label>Service Image</label>
                  {editImagePreview && (
                    <S.ImagePreview>
                      <img src={editImagePreview} alt="Preview" />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => {
                          setEditImage(null);
                          setEditImagePreview(null);
                        }}
                      >
                        <FiX />
                      </button>
                    </S.ImagePreview>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                  />
                  <small>Leave empty to keep current image</small>
                </S.FormGroup>

                <S.FormGroup>
                  <label>Service Files</label>
                  {editFiles.length > 0 && (
                    <S.FileManagerList>
                      {editFiles.map(file => (
                        <div className="file-row" key={file.id}>
                          <FiFile />
                          <div>
                            <strong>{file.file_title || file.file_name}</strong>
                            <span>
                              {String(file.file_type || "file").toUpperCase()} · {file.locked ? <FiLock /> : <FiUnlock />} {file.is_preview ? "Preview" : file.is_paid_content ? "Paid" : "Free"}
                            </span>
                          </div>
                          <button type="button" onClick={() => handleDeleteExistingFile(file.id)}>
                            <FiTrash2 />
                          </button>
                        </div>
                      ))}
                    </S.FileManagerList>
                  )}
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.mp4,.mp3,.zip"
                    onChange={handleNewFilesChange}
                  />
                  {newFiles.length > 0 && (
                    <S.FileManagerList>
                      {newFiles.map(file => (
                        <div className="file-row stacked" key={file.id}>
                          <FiFile />
                          <div>
                            <strong>{file.file.name}</strong>
                            <input
                              value={file.title}
                              onChange={(event) => updateNewFileMeta(file.id, "title", event.target.value)}
                              placeholder="File title"
                            />
                            <div className="flags">
                              <label><input type="checkbox" checked={file.is_preview} onChange={(event) => updateNewFileMeta(file.id, "is_preview", event.target.checked)} /> Preview</label>
                              <label><input type="checkbox" checked={file.is_paid_content} onChange={(event) => updateNewFileMeta(file.id, "is_paid_content", event.target.checked)} /> Paid</label>
                              <label><input type="checkbox" checked={file.is_downloadable} onChange={(event) => updateNewFileMeta(file.id, "is_downloadable", event.target.checked)} /> Download</label>
                            </div>
                          </div>
                          <button type="button" onClick={() => removeNewFile(file.id)}>
                            <FiTrash2 />
                          </button>
                        </div>
                      ))}
                    </S.FileManagerList>
                  )}
                </S.FormGroup>

                <S.ModalFooter>
                  <button type="button" className="cancel" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="submit" disabled={submitting}>
                    {submitting ? "Updating..." : "Update Service"}
                  </button>
                </S.ModalFooter>
              </form>
            </S.ModalBody>
          </S.ModalContent>
        </S.ModalOverlay>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <S.ModalOverlay onClick={() => setShowDeleteConfirm(false)}>
          <S.DeleteConfirmModal onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <h2>Confirm Delete</h2>
              <button className="close-btn" onClick={() => setShowDeleteConfirm(false)}>
                <FiX />
              </button>
            </S.ModalHeader>
            
            <S.ModalBody>
              <p>Are you sure you want to delete the service:</p>
              <p><strong>"{deletingService?.title}"</strong>?</p>
              <p style={{ color: "#e53e3e", marginTop: "10px" }}>This action cannot be undone.</p>
            </S.ModalBody>

            <S.ModalFooter>
              <button type="button" className="cancel" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button 
                type="button" 
                className="delete-confirm" 
                onClick={handleDeleteConfirm}
                disabled={submitting}
              >
                {submitting ? "Deleting..." : "Yes, Delete"}
              </button>
            </S.ModalFooter>
          </S.DeleteConfirmModal>
        </S.ModalOverlay>
      )}
    </S.PageWrapper>
  );
};

export default MyServices;
