import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { usePublicExpert } from "../../context/PublicExpertContext";

const PopularServices = () => {
  const navigate = useNavigate();
  const { experts } = usePublicExpert();

  // Instant Data Loading from Cache
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem("popular_services_cache");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(services.length === 0);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Sirf tabhi fetch karega jab data na ho ya background update ke liye
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

  // UI return nothing if no data to keep home page clean
  if (loading && services.length === 0) return null;

  return (
    <SectionWrapper>
      <Header>
        <div className="title-group">
          <h2 className="main-title">Popular Services</h2>
          <p className="sub-title">Top-rated professional solutions</p>
        </div>
        <ViewAllBtn onClick={() => navigate("/user/all-services")}>
          View All
        </ViewAllBtn>
      </Header>

      <ServiceGrid>
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
                onError={(e) => e.target.src = "https://via.placeholder.com/150"}
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
      </ServiceGrid>
    </SectionWrapper>
  );
};

export default PopularServices;

// --- STYLED COMPONENTS (LinkedIn Style & Accessible) ---

const SectionWrapper = styled.section`
  padding: 20px;
  background-color: transparent;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 20px;
  border-left: 4px solid #000080;
  padding-left: 15px;

  .main-title {
    font-size: 24px; /* Big for accessibility */
    font-weight: 800;
    color: #111827; /* Dark Black */
    margin: 0;
  }
  .sub-title {
    font-size: 14px;
    color: #4b5563;
    margin: 4px 0 0 0;
  }
`;

const ViewAllBtn = styled.button`
  background: none;
  border: 1px solid #000080;
  color: #000080;
  padding: 6px 16px;
  border-radius: 20px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #000080;
    color: white;
  }
`;

const ServiceGrid = styled.div`
  display: grid;
  /* Desktop: 5 per row */
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 768px) {
    /* Tablet/Mobile: 3 per row as requested */
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
`;

const ServiceCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
    border-color: #000080;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1.4 / 1;
  background: #f9fafb;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
  }
`;

const CardBody = styled.div`
  padding: 12px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;

  .service-title {
    font-size: 16px; /* Accessible size */
    font-weight: 700;
    color: #000000; /* Pure Black for visibility */
    margin: 0 0 6px 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 42px; /* Consistency */
  }

  .expert-name {
    font-size: 13px;
    color: #374151;
    margin: 0 0 10px 0;
    font-weight: 500;
  }

  .footer-row {
    margin-top: auto;
    display: flex;
    justify-content: flex-start;
  }

  .price-tag {
    color: #000080; /* Blue price as requested */
    font-size: 18px;
    font-weight: 800;
  }

  @media (max-width: 600px) {
    padding: 8px;
    .service-title { font-size: 13px; height: 34px; }
    .expert-name { font-size: 11px; }
    .price-tag { font-size: 15px; }
  }
`;