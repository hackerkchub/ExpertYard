import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiClipboard, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useExpert } from "../../../../shared/context/ExpertContext";
import { getServicesByExpert, updateService, deleteService } from "../../../../shared/api/service.api";
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
    deliverables: "",
    status: "active"
  });
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
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
      description: service.description || "",
      deliverables: Array.isArray(service.deliverables) 
        ? JSON.stringify(service.deliverables) 
        : (service.deliverables || ""),
      status: service.status || "active"
    });
    setEditImagePreview(getImageUrl(service.image));
    setEditImage(null);
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
      formData.append("description", editFormData.description || "");
      formData.append("deliverables", editFormData.deliverables || "");
      formData.append("status", editFormData.status);
      
      if (editImage) {
        formData.append("image", editImage);
      }

      const response = await updateService(editingService.id, formData);
      
      if (response.data.success) {
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
                    <span className="price">₹{parseFloat(service.price || 0).toLocaleString()}</span>
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
                    </select>
                  </S.FormGroup>
                </S.FormRow>

                <S.FormGroup>
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditInputChange}
                    placeholder="Describe your service..."
                    rows="4"
                  />
                </S.FormGroup>

                <S.FormGroup>
                  <label>Deliverables (HTML supported)</label>
                  <textarea
                    name="deliverables"
                    value={editFormData.deliverables}
                    onChange={handleEditInputChange}
                    placeholder="What will you deliver? (You can use HTML formatting)"
                    rows="5"
                  />
                </S.FormGroup>

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