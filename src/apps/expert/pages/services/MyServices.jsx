import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiPackage, FiClipboard } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useExpert } from "../../../../shared/context/ExpertContext";
import * as S from "./MyServices.style";

const MyServices = () => {
  const navigate = useNavigate();
  const { expertData, profileLoading } = useExpert();
  
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      if (expertData?.expertId) {
        try {
          setLoading(true);
          const res = await axios.get(`https://softmaxs.com/api/services/expert/${expertData.expertId}`);
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
                  src={service.image || "https://via.placeholder.com/200x150?text=No+Image"} 
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
                      <div 
                        className="html-content"
                        dangerouslySetInnerHTML={{ __html: service.deliverables }} 
                      />
                    </S.DeliverablesPreview>
                  )}
                </S.ServiceInfo>

                <S.ActionButtons>
                  <button className="view" title="View Details"><FiEye /> View</button>
                  <button className="edit" title="Edit Service"><FiEdit2 /> Edit</button>
                  <button className="delete" title="Delete Service"><FiTrash2 /></button>
                </S.ActionButtons>
              </S.ServiceCard>
            ))}
          </S.ServiceList>
        )}
      </S.Container>
    </S.PageWrapper>
  );
};

export default MyServices;