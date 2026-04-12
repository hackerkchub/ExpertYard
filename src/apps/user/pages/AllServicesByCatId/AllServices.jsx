import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiLayers, FiBriefcase, FiUser, FiInfo } from "react-icons/fi";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import { usePublicExpert } from "../../context/PublicExpertContext";
import * as S from "./AllServices.style";

const AllServices = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { experts, expertsLoading } = usePublicExpert();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  /* -----------------------------------------------------------
     API FETCH: Services ka data backend se load karta hai
  ----------------------------------------------------------- */
  useEffect(() => {
    const fetchAllServices = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://softmaxs.com/api/services`);
        if (res.data && res.data.success) {
          setServices(res.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllServices();
  }, []);

  /* -----------------------------------------------------------
     EXPERT MAPPING: Context se ID ke base par Name map karta hai
     Performance ke liye useMemo use kiya hai.
  ----------------------------------------------------------- */
  const expertMap = useMemo(() => {
    const map = {};
    if (Array.isArray(experts)) {
      experts.forEach((e) => {
        map[e.id] = e.name;
      });
    }
    return map;
  }, [experts]);

  /* -----------------------------------------------------------
     HANDLERS: Navigation control
  ----------------------------------------------------------- */
  const handleGoToMyBookings = () => {
    isLoggedIn && user?.id ? navigate(`/user/my-booking/${user.id}`) : navigate("/login");
  };

  if (loading || expertsLoading) return <S.Loader>Loading Premium Services...</S.Loader>;

  return (
    <S.PageContainer>
      <S.ContentWrapper>
        
        {/* HEADER: LinkedIn style summary */}
        <S.HeaderSection>
          <div className="title-area">
            <h2>Professional Services</h2>
            <p>Connect with verified experts to accelerate your goals.</p>
          </div>
          <S.TopActionButton onClick={handleGoToMyBookings}>
            <FiBriefcase /> My Bookings
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
                
                {/* 1. EXPERT HEADER: LinkedIn style 'Posted by' section */}
                <S.ExpertIdentitySection onClick={() => navigate(`/user/experts/${service.expert_id}`)}>
                  <div className="expert-avatar">
                    <FiUser size={20} />
                  </div>
                  <div className="expert-info">
                    <h4>{expertName}</h4>
                    <span>Verified Expert • View Profile</span>
                  </div>
                </S.ExpertIdentitySection>

                {/* 2. IMAGE SECTION */}
                <S.ImageWrapper>
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    onError={(e) => e.target.src = "https://via.placeholder.com/400x200?text=ExpertYard"} 
                  />
                  <S.PriceBadge>₹{Math.floor(service.price)}</S.PriceBadge>
                </S.ImageWrapper>

                {/* 3. CONTENT AREA */}
                <S.CardContent>
                  <S.CategoryTag>
                    <FiLayers size={12} /> Digital Service
                  </S.CategoryTag>
                  
                  <h3>{service.title}</h3>
                  <p className="description">
                    {service.description?.substring(0, 85)}...
                  </p>

                  {/* LinkedIn style 'Key Skills/Deliverables' */}
                  <S.DeliverablesContainer>
                    {deliverableList.slice(0, 2).map((item, i) => (
                      <span key={i} className="skill-pill">{item}</span>
                    ))}
                  </S.DeliverablesContainer>
                </S.CardContent>

                {/* 4. FOOTER ACTION */}
                <S.CardFooter>
                  <S.PrimaryButton onClick={() => navigate(`/user/service-details/${service.id}`)}>
                    View Service Details <FiArrowRight />
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