import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { usePublicExpert } from "../../context/PublicExpertContext";

const PopularServices = () => {
  const navigate = useNavigate();
  const { experts } = usePublicExpert();
  const scrollRef = useRef(null);

  // Instant Data Loading from Cache
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem("popular_services_cache");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(services.length === 0);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`https://softmaxs.com/api/services`);
        if (res.data && res.data.success) {
          const freshData = res.data.data || [];
          setServices(freshData);
          localStorage.setItem("popular_services_cache", JSON.stringify(freshData));
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const expertMap = useMemo(() => {
    const map = {};
    if (Array.isArray(experts)) {
      experts.forEach((e) => { map[e.id] = e.name; });
    }
    return map;
  }, [experts]);

  if (loading && services.length === 0) return null;

  return (
    <SectionWrapper>
      <Header>
        <h2 className="main-title">Popular Services</h2>
        <ViewAllBtn onClick={() => navigate("/user/all-services")}>
          View All
        </ViewAllBtn>
      </Header>

      <HorizontalScrollContainer ref={scrollRef}>
        {services.slice(0, 10).map((service) => (
          <ServiceCard 
            key={service.id} 
            onClick={() => navigate(`/user/service-details/${service.id}`)}
          >
            <ImageContainer>
              <img 
                src={service.image} 
                alt={service.title} 
                loading="lazy"
                onError={(e) => e.target.src = "https://via.placeholder.com/300x200?text=Service"} 
              />
            </ImageContainer>
            
            <CardBody>
              <h4 className="service-title">{service.title}</h4>
              <p className="expert-name">by {expertMap[service.expert_id] || "Expert Professional"}</p>
              <div className="footer-row">
                <span className="price-tag">₹{Math.floor(service.price)}</span>
              </div>
            </CardBody>
          </ServiceCard>
        ))}
      </HorizontalScrollContainer>
    </SectionWrapper>
  );
};

export default PopularServices;

// --- STYLED COMPONENTS ---

const SectionWrapper = styled.section`
  padding: 15px 0;
  background-color: transparent;
  max-width: 100%;
  margin: 0 auto;
  font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 20px;
  width: 100%;

  .main-title {
    font-size: 18px;
    font-weight: 700;
    color: rgba(0, 0, 0, 0.9);
    margin: 0;
    white-space: nowrap;
  }
`;

const ViewAllBtn = styled.button`
  background: none;
  border: none;
  color: #004182;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 0;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
`;

const HorizontalScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 12px;
  padding: 10px 20px 20px 20px;
  scroll-behavior: smooth;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }

  & > div {
    flex: 0 0 280px; 
  }

  @media (max-width: 768px) {
    & > div {
      flex: 0 0 calc(46% - 10px); 
      min-width: 165px;
    }
  }
`;

const ServiceCard = styled.div`
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1);

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 150px; /* Increased height for desktop full-width feel */
  background: #f3f2ef;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Desktop par full width cover karegi */
    display: block;
  }

  @media (max-width: 600px) {
    height: 100px;
    img {
      object-fit: contain; /* Mobile par image katni nahi chahiye */
      padding: 5px;
      background: #fff;
    }
  }
`;

const CardBody = styled.div`
  padding: 10px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  .service-title {
    font-size: 14px;
    font-weight: 600;
    color: #000;
    margin: 0 0 4px 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 36px;
  }

  .expert-name {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.6);
    margin: 0 0 8px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .price-tag {
    color: #000080; 
    font-size: 15px;
    font-weight: 700;
  }

  @media (max-width: 600px) {
    padding: 8px;
    .service-title { font-size: 12px; height: 32px; }
    .price-tag { font-size: 13px; }
  }
`;