import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiLayers, FiBriefcase, FiUser } from "react-icons/fi";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { usePublicExpert } from "../../context/PublicExpertContext";
import * as S from "./AllServices.style";

const AllServices = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { experts, expertsLoading } = usePublicExpert();

  // Initial data loading from cache (Fast Loading Strategy)
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem("expert_services_cache");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(services.length === 0);

  useEffect(() => {
    const fetchAllServices = async () => {
      try {
        // Background fetch: User ko purana data dikhta rahega tab tak naya load hoga
        const res = await axios.get(`https://softmaxs.com/api/services`);
        if (res.data && res.data.success) {
          const freshData = res.data.data || [];
          setServices(freshData);
          // Update cache for next time
          localStorage.setItem("expert_services_cache", JSON.stringify(freshData));
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllServices();
  }, []);

  const expertMap = useMemo(() => {
    const map = {};
    if (Array.isArray(experts)) {
      experts.forEach((e) => { map[e.id] = e.name; });
    }
    return map;
  }, [experts]);

  const handleGoToMyBookings = () => {
    isLoggedIn && user?.id ? navigate(`/user/my-booking/${user.id}`) : navigate("/user/auth");
  };

  // Professional Skeleton Loader
  if (loading && services.length === 0) {
    return (
      <S.PageContainer>
        <S.LoaderContainer>
          <div className="spinner"></div>
          <p>Fetching Professional Services...</p>
        </S.LoaderContainer>
      </S.PageContainer>
    );
  }

  return (
    <S.PageContainer>
      <S.ContentWrapper>
        
        <S.HeaderSection>
          <div className="title-area">
            <h2>Professional Services</h2>
            <p>Connect with verified experts to accelerate your goals.</p>
          </div>
          <S.TopActionButton onClick={handleGoToMyBookings}>
            <FiBriefcase /> <span>My Bookings</span>
          </S.TopActionButton>
        </S.HeaderSection>

        <S.ServiceGrid>
          {services.map((service) => {
            let deliverableList = [];
            try {
              deliverableList = typeof service.deliverables === "string" 
                ? JSON.parse(service.deliverables) : service.deliverables || [];
            } catch { deliverableList = []; }

            const expertName = expertMap[service.expert_id] || "Expert Professional";

            return (
              <S.ServiceCard key={service.id}>
                <S.ExpertIdentitySection onClick={() => navigate(`/user/experts/${service.expert_id}`)}>
                  <div className="expert-avatar">
                    <FiUser size={18} />
                  </div>
                  <div className="expert-info">
                    <h4>{expertName}</h4>
                    <span>Verified Professional</span>
                  </div>
                </S.ExpertIdentitySection>

                <S.ImageWrapper onClick={() => navigate(`/user/service-details/${service.id}`)}>
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    loading="lazy"
                    onLoad={(e) => e.target.classList.add('loaded')}
                    onError={(e) => e.target.src = "https://via.placeholder.com/400x200?text=Service+Image"} 
                  />
                  <S.PriceBadge>₹{Math.floor(service.price)}</S.PriceBadge>
                </S.ImageWrapper>

                <S.CardContent>
                  <S.CategoryTag>
                    <FiLayers size={12} /> Digital Service
                  </S.CategoryTag>
                  <h3>{service.title}</h3>
                  <p className="description">
                    {service.description?.substring(0, 90)}...
                  </p>

                  <S.DeliverablesContainer>
                    {deliverableList.slice(0, 2).map((item, i) => (
                      <span key={i} className="skill-pill">{item}</span>
                    ))}
                  </S.DeliverablesContainer>
                </S.CardContent>

                <S.CardFooter>
                  <S.PrimaryButton onClick={() => navigate(`/user/service-details/${service.id}`)}>
                    View Details <FiArrowRight />
                  </S.PrimaryButton>
                </S.CardFooter>
              </S.ServiceCard>
            );
          })}
        </S.ServiceGrid>

      </S.ContentWrapper>
    </S.PageContainer>
  );
};

export default AllServices;